import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';

// Configurable paths
const MIGRATE_SRC = path.join('src', 'content', '_to_migrate');
const POSTS_DEST = path.join('src', 'content', 'posts');
const CONTENT_COMPLETED = path.join('src', 'content', 'completed');
const ASSETS_SRC = path.join('src', 'assets', '_to_migrate');
const ASSETS_DEST = path.join('src', 'assets', 'uploaded_images');
const ASSETS_COMPLETED = path.join('src', 'assets', 'completed');

// Helper: Guess category from content/title/tags
function guessCategory(frontmatter, content) {
  const text =
    `${frontmatter.title || ''} ${(frontmatter.tags || []).join(' ')} ${content}`.toLowerCase();
  if (/work|weeknote|design|learning/.test(text)) return 'Work';
  if (/rest|read|listen|watch|playlist|houseplant|calm|routine/.test(text))
    return 'Rest';
  if (
    /play|experiment|data|code|photo|podcast|drum|exercise|project/.test(text)
  )
    return 'Play';
  return 'Work'; // Default
}

// Helper: Find image paths in markdown body
function findImagePaths(md) {
  const regex = /!\[[^\]]*\]\(([^)]+)\)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(md))) {
    matches.push(match[1]);
  }
  return matches;
}

// Main migration function
async function migrate({ limit = 10, dryRun = false } = {}) {
  const files = (await fs.readdir(MIGRATE_SRC)).filter(
    f => f.endsWith('.md') || f.endsWith('.mdx'),
  );
  // Pre-filter files that have already been migrated (by slug)
  const unmigrated = [];
  for (const file of files) {
    const srcPath = path.join(MIGRATE_SRC, file);
    const raw = await fs.readFile(srcPath, 'utf8');
    // Parse frontmatter as raw text
    const frontmatterMatch = raw.match(/^---[\r\n]+([\s\S]*?)---[\r\n]+/);
    let frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    // Remove postImage and socialImage (and their indented contents)
    const fmLines = frontmatter.split(/\r?\n/).reduce(
      (acc, line, idx, arr) => {
        if (/^(postImage|socialImage)\s*:/.test(line)) {
          let i = idx + 1;
          while (i < arr.length && /^\s+/.test(arr[i])) i++;
          acc.skip = i;
          return acc;
        }
        if (acc.skip && idx < acc.skip) return acc;
        acc.lines.push(line);
        return acc;
      },
      { lines: [], skip: 0 },
    ).lines;
    // Find slug
    let slug = '';
    for (const line of fmLines) {
      if (/^slug\s*:\s*(.+)/.test(line)) {
        slug = line.match(/^slug\s*:\s*(.+)/)[1].trim();
        break;
      }
    }
    // Support .mdx extension
    const ext = path.extname(file);
    if (!slug) slug = path.basename(file, ext);
    const destFile = `${slug}${ext}`;
    const destPath = path.join(POSTS_DEST, destFile);
    if (!(await fs.pathExists(destPath))) {
      unmigrated.push(file);
    }
  }
  // Now process only the next N unmigrated files
  for (const file of unmigrated.slice(0, limit)) {
    const srcPath = path.join(MIGRATE_SRC, file);
    const raw = await fs.readFile(srcPath, 'utf8');

    // Parse frontmatter as raw text
    const frontmatterMatch = raw.match(/^---[\r\n]+([\s\S]*?)---[\r\n]+/);
    let frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    let body = raw.replace(/^---[\r\n]+([\s\S]*?)---[\r\n]+/, '');

    // Remove postImage and socialImage (and their indented contents)
    frontmatter = frontmatter.split(/\r?\n/).reduce(
      (acc, line, idx, arr) => {
        if (/^(postImage|socialImage)\s*:/.test(line)) {
          let i = idx + 1;
          while (i < arr.length && /^\s+/.test(arr[i])) i++;
          acc.skip = i;
          return acc;
        }
        if (acc.skip && idx < acc.skip) return acc;
        acc.lines.push(line);
        return acc;
      },
      { lines: [], skip: 0 },
    ).lines;

    // Find slug line and insert category after
    let inserted = false;
    const category = guessCategory(matter(frontmatter.join('\n')).data, body);
    const newFrontmatter = [];
    for (let i = 0; i < frontmatter.length; i++) {
      newFrontmatter.push(frontmatter[i]);
      if (/^slug\s*:/.test(frontmatter[i]) && !inserted) {
        newFrontmatter.push(`category: ${category}`);
        inserted = true;
      }
    }
    if (!inserted) newFrontmatter.push(`category: ${category}`);

    // Ensure slug exists and rename file
    let slug = '';
    for (const line of newFrontmatter) {
      if (/^slug\s*:\s*(.+)/.test(line)) {
        slug = line.match(/^slug\s*:\s*(.+)/)[1].trim();
        break;
      }
    }
    const ext = path.extname(file);
    if (!slug) slug = path.basename(file, ext);
    const destFile = `${slug}${ext}`;
    const destPath = path.join(POSTS_DEST, destFile);

    // Move images from any subfolder and update paths (flattened)
    let newContent = body;
    const imgPaths = findImagePaths(body);
    for (const imgPath of imgPaths) {
      const imgName = path.basename(imgPath);
      // Try to find the image in any subfolder of ASSETS_SRC
      let found = false;
      // Possible locations: top-level, or any subfolder
      const possiblePaths = [path.join(ASSETS_SRC, imgName)];
      // Add subfolders
      const subfolders = (await fs.readdir(ASSETS_SRC, { withFileTypes: true }))
        .filter(d => d.isDirectory())
        .map(d => d.name);
      for (const folder of subfolders) {
        possiblePaths.push(path.join(ASSETS_SRC, folder, imgName));
      }
      let srcImg = null;
      for (const p of possiblePaths) {
        if (await fs.pathExists(p)) {
          srcImg = p;
          found = true;
          break;
        }
      }
      const destImg = path.join(ASSETS_DEST, imgName);
      if (found && srcImg) {
        if (!dryRun) {
          await fs.move(srcImg, destImg, { overwrite: true });
        }
        newContent = newContent.replace(
          imgPath,
          `../../assets/uploaded_images/${imgName}`,
        );
      } else {
        console.log(`[MISSING IMAGE] ${imgPath} referenced in ${file}`);
      }
    }

    // Write new markdown file with preserved frontmatter formatting
    const newMd = `---\n${newFrontmatter.join('\n')}\n---\n\n${newContent}`;
    if (!dryRun) {
      await fs.writeFile(destPath, newMd);
      // Move the original markdown file to completed
      const completedMd = path.join(CONTENT_COMPLETED, file);
      await fs.move(srcPath, completedMd, { overwrite: true });
    }
    console.log(
      `[MIGRATED] ${file} -> ${destFile} (original moved to completed)`,
    );
  }
}

// Run with limit from command line, default to 10
if (import.meta.url === `file://${process.argv[1]}`) {
  // Accept: node migrate-md-content.js [limit]
  const argLimit = process.argv[2] ? parseInt(process.argv[2], 10) : 10;
  migrate({ limit: isNaN(argLimit) ? 10 : argLimit, dryRun: false }).catch(
    console.error,
  );
}

export default migrate;
