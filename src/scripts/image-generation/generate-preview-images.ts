import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import matter from 'gray-matter';

const config = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), 'src/scripts/image-generation/image-config.json'),
    'utf-8',
  ),
);
const previewConfig = config.preview;
const siteUrl = config.siteUrl;
const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');
const TEMPLATE_PATH = path.join(process.cwd(), previewConfig.templatePath);
const BG_PATH = path.join(process.cwd(), previewConfig.fallbackBgPath);
const OUTPUT_DIR = path.join(process.cwd(), previewConfig.outputDir);
const SITE_TITLE = previewConfig.siteTitle;
const BG_STYLE = previewConfig.bgStyle;

async function getPosts() {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content: body } = matter(content);
    const title = data.title
      ? String(data.title)
      : file.replace(/\.(md|mdx)$/, '');
    // Use slug frontmatter if present, else fallback to filename
    const id = data.slug ? String(data.slug) : file.replace(/\.(md|mdx)$/, '');
    // Find first image in markdown body
    const imageMatch = body.match(/!\[[^\]]*\]\(([^)]+)\)/);
    const imagePath = imageMatch ? imageMatch[1] : null;
    return { id, title, imagePath };
  });
}

function fillTemplate(template, { siteTitle, title, siteUrl, bgPath }) {
  return template
    .replaceAll('%%SITE_TITLE%%', siteTitle)
    .replaceAll('%%TITLE%%', title)
    .replaceAll('%%SITE_URL%%', siteUrl)
    .replaceAll('%%PREVIEW_BG%%', bgPath);
}

async function generatePreviewImages() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const posts = await getPosts();
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });
  for (const post of posts) {
    const outFile = `${post.id}.png`;
    const outPath = path.join(OUTPUT_DIR, outFile);
    if (fs.existsSync(outPath)) {
      continue;
    }
    // No episode number logic
    let html = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    // Determine which image to use as background
    let bgBase64 = null;
    if (post.imagePath) {
      // Try to resolve the image path relative to the post file
      let resolvedPath = post.imagePath;
      if (resolvedPath.startsWith('../../assets/')) {
        // Convert ../../assets/foo.jpg (relative to post) to src/assets/foo.jpg (project root)
        resolvedPath = path.join(
          process.cwd(),
          'src/assets',
          resolvedPath.replace(/^\.\.\/\.\.\/assets\//, ''),
        );
      } else if (resolvedPath.startsWith('/src/assets/')) {
        resolvedPath = path.join(process.cwd(), resolvedPath.slice(1));
      } else if (resolvedPath.startsWith('/')) {
        resolvedPath = path.join(process.cwd(), resolvedPath.slice(1));
      } else {
        // fallback: relative to post file
        resolvedPath = path.join(POSTS_DIR, resolvedPath);
      }
      if (fs.existsSync(resolvedPath)) {
        const ext = path.extname(resolvedPath).toLowerCase().replace('.', '');
        const mimeType =
          ext === 'svg'
            ? 'image/svg+xml'
            : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        bgBase64 = `data:${mimeType};base64,${fs.readFileSync(resolvedPath).toString('base64')}`;
      }
    }
    if (!bgBase64) {
      // Fallback to default background
      const bgBuffer = fs.readFileSync(BG_PATH);
      const ext = path.extname(BG_PATH).toLowerCase().replace('.', '');
      const mimeType =
        ext === 'svg'
          ? 'image/svg+xml'
          : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      bgBase64 = `data:${mimeType};base64,${bgBuffer.toString('base64')}`;
    }
    // Replace the background url in the template with an <img> tag for reliability and styling
    html = html
      .replace("background: url('%%PREVIEW_BG%%') no-repeat center center;", '')
      .replace(
        '<div class="container">',
        `<div class="container"><img src="${bgBase64}" class="preview-bg" style="position:absolute;width:100%;height:100%;object-fit:cover;z-index:0;${BG_STYLE}" />`,
      );
    html = fillTemplate(html, {
      siteTitle: SITE_TITLE,
      title: post.title,
      siteUrl,
      bgPath: '', // Not used anymore
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 600 });
    await page.setContent(html, { waitUntil: 'networkidle2' });
    // Wait for all relevant fonts to be loaded
    await page.waitForFunction(
      () => document.fonts.check('1em "Inter"') && document.fonts.ready,
      { timeout: 15000 },
    );
    // Force layout reflow and wait for rendering stability
    await page.evaluate(() => document.body.offsetHeight);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: outPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 600, height: 600 },
    });
    await page.close();
    console.log(`preview-images: ${outFile} - created`);
  }
  await browser.close();
}

generatePreviewImages();
