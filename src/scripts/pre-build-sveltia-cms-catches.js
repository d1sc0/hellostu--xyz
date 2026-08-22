import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../content/posts');
const PAGES_DIR = path.join(__dirname, '../content/pages');

function fixImagePathsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  // Normalize markdown image paths for static build compatibility
  content = content.replace(
    /\]\((?:\.\.\/\.\.\/assets\/images|\/src\/assets\/images)\/([^\)]+)\)/g,
    (match, p1) => {
      const replacement = `](../../assets/images/${p1})`;
      if (match !== replacement) {
        changed = true;
      }
      return replacement;
    },
  );
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`path-fixes: ${path.basename(filePath)} - updated`);
  }
}

function renameFileToSlug(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(content);
  if (data.slug) {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const newName = `${data.slug}${ext}`;
    const newPath = path.join(dir, newName);
    if (path.basename(filePath) !== newName && !fs.existsSync(newPath)) {
      fs.renameSync(filePath, newPath);
      console.log(`path-fixes: ${newName} - updated`);
      return newPath;
    }
  }
  return filePath;
}

function walkDir(dir, { renameToSlug = false } = {}) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, { renameToSlug });
    } else if (
      entry.isFile() &&
      (fullPath.endsWith('.md') || fullPath.endsWith('.mdx'))
    ) {
      fixImagePathsInFile(fullPath);
      // Keep slug-based renaming limited to posts content.
      if (
        renameToSlug &&
        (fullPath.endsWith('.md') || fullPath.endsWith('.mdx'))
      ) {
        renameFileToSlug(fullPath);
      }
    }
  });
}

// Optionally clean generated image folders if --clean flag is present
if (process.argv.includes('--clean')) {
  const previewDir = path.join(
    __dirname,
    '../../public/generated_preview_images',
  );
  const socialDir = path.join(
    __dirname,
    '../../public/generated_social_images',
  );
  function cleanDir(dir) {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
    }
  }
  cleanDir(previewDir);
  cleanDir(socialDir);
}
walkDir(POSTS_DIR, { renameToSlug: true });
walkDir(PAGES_DIR, { renameToSlug: false });
