import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../content/posts');

function fixImagePathsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  // Fix path and suffix, and rename image if needed
  content = content.replace(
    /\]\((?:\.\.\/\.\.\/assets\/uploaded_images|\/src\/assets\/uploaded_images)\/([^\)]+)\)/g,
    (match, p1) => {
      // p1 is the filename, e.g. foo.jpg
      const ext = path.extname(p1);
      const base = p1.slice(0, -ext.length);
      // Case-insensitive check for RIGHT, LEFT, FULL at end of base (no underscore)
      const baseUpper = base.toUpperCase();
      if (
        !baseUpper.endsWith('RIGHT') &&
        !baseUpper.endsWith('LEFT') &&
        !baseUpper.endsWith('FULL')
      ) {
        const newName = `${base}_FULL${ext}`;
        const replacement = `](../../assets/uploaded_images/${newName})`;
        if (match !== replacement) {
          changed = true;
        }
        // Try to rename the image file if it exists
        const imgDir = path.join(__dirname, '../assets/uploaded_images');
        const oldPath = path.join(imgDir, p1);
        const newPath = path.join(imgDir, newName);
        if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
          fs.renameSync(oldPath, newPath);
          console.log(`path-fixes: ${newName} - updated`);
        }
        return replacement;
      } else {
        const replacement = `](../../assets/uploaded_images/${p1})`;
        if (match !== replacement) {
          changed = true;
        }
        return replacement;
      }
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

function walkDir(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.md')) {
      fixImagePathsInFile(fullPath);
      // If renamed, update path for further processing
      renameFileToSlug(fullPath);
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
walkDir(POSTS_DIR);
