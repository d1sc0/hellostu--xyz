import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');
const PAGES_DIR = path.join(process.cwd(), 'src/content/pages');
const TEMPLATE_PATH = path.join(
  process.cwd(),
  'src/scripts/image-generation/social-image-template.html',
);
const BG_PATH = path.join(
  process.cwd(),
  'src/scripts/image-generation/og-background.png',
);
const OUTPUT_DIR = path.join(process.cwd(), 'public/generated_social_images');

// Read OG logo path from image-config.json
const configPath = path.join(
  process.cwd(),
  'src/scripts/image-generation/image-config.json',
);
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const ogLogoPath =
  config.og && config.og.logoPath
    ? path.join(process.cwd(), config.og.logoPath)
    : null;
let ogLogoBase64 = null;
if (ogLogoPath && fs.existsSync(ogLogoPath)) {
  const ext = path.extname(ogLogoPath).toLowerCase().replace('.', '');
  const mimeType =
    ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  ogLogoBase64 = `data:${mimeType};base64,${fs.readFileSync(ogLogoPath).toString('base64')}`;
}

function stripQueryAndHash(inputPath: string): string {
  return decodeURIComponent(inputPath.split('?')[0].split('#')[0]).trim();
}

function resolveContentImagePath(
  rawPath: string,
  contentDir: string,
): string | null {
  const sanitized = stripQueryAndHash(rawPath).replace(/\\/g, '/');
  if (!sanitized) return null;

  if (sanitized.startsWith('../../assets/')) {
    return path.join(
      process.cwd(),
      'src/assets',
      sanitized.replace(/^\.\.\/\.\.\/assets\//, ''),
    );
  }

  if (sanitized.startsWith('/src/assets/')) {
    return path.join(process.cwd(), sanitized.slice(1));
  }

  if (sanitized.startsWith('/')) {
    return path.join(process.cwd(), sanitized.slice(1));
  }

  return path.join(contentDir, sanitized);
}

async function getPosts() {
  const postFiles = fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  const pageFiles = fs.existsSync(PAGES_DIR)
    ? fs
        .readdirSync(PAGES_DIR)
        .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    : [];
  const allFiles = [
    ...postFiles.map(file => ({ file, dir: POSTS_DIR })),
    ...pageFiles.map(file => ({ file, dir: PAGES_DIR })),
  ];
  return allFiles.map(({ file, dir }) => {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data, content: body } = matter(content);
    const title = data.title
      ? String(data.title)
      : file.replace(/\.(md|mdx)$/, '');
    // Use slug frontmatter if present, else fallback to filename
    const id = data.slug ? String(data.slug) : file.replace(/\.(md|mdx)$/, '');
    const featureImagePath = data.featureImage
      ? String(data.featureImage)
      : null;
    // Find first image in markdown body
    const imageMatch = body.match(/!\[[^\]]*\]\(([^)]+)\)/);
    const firstBodyImagePath = imageMatch ? imageMatch[1] : null;
    const imagePath = featureImagePath || firstBodyImagePath;
    return { id, title, imagePath, dir };
  });
}

function fillTemplate(
  template: string,
  {
    siteTitle,
    title,
    siteUrl,
    bgPath,
  }: {
    siteTitle: string;
    title: string;
    siteUrl: string;
    bgPath: string;
  },
) {
  return template
    .replaceAll('%%SITE_TITLE%%', siteTitle)
    .replaceAll('%%TITLE%%', title)
    .replaceAll('%%SITE_URL%%', siteUrl)
    .replaceAll('%%OG_BG%%', bgPath);
}

async function generateOGImages() {
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
    // Always use lowercased slug for filename
    const outFile = `${post.id.toLowerCase()}.png`;
    const outPath = path.join(OUTPUT_DIR, outFile);
    if (fs.existsSync(outPath)) {
      continue;
    }
    // No episode number logic
    let html = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    // Determine which image to use as background
    let bgBase64 = null;
    if (post.imagePath) {
      const resolvedPath = resolveContentImagePath(post.imagePath, post.dir);
      if (resolvedPath && fs.existsSync(resolvedPath)) {
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
      .replace("background: url('%%OG_BG%%') no-repeat center center;", '')
      .replace(
        '<div class="container">',
        `<div class="container"><img src="${bgBase64}" class="og-bg" style="position:absolute;width:100%;height:100%;object-fit:cover;z-index:0;filter: opacity(0.5);" />`,
      );
    // Replace the template's %%LOGO_PATH%% with the base64 logo if available
    if (ogLogoBase64) {
      html = html.replace('src="%%LOGO_PATH%%"', `src="${ogLogoBase64}"`);
    } else {
      // Remove the logo img if not available
      html = html.replace(/<img[^>]*id=["']site-logo["'][^>]*>/, '');
    }
    // Read site URL from astro.config.mjs
    const astroConfig = fs.readFileSync(
      path.join(process.cwd(), 'astro.config.mjs'),
      'utf-8',
    );
    const siteUrlMatch = astroConfig.match(/site:\s*['\"]([^'\"]+)['\"]/);
    const siteUrl = siteUrlMatch ? siteUrlMatch[1] : '';
    html = fillTemplate(html, {
      siteTitle: 'BLOG POST',
      title: post.title,
      siteUrl,
      bgPath: '', // Not used anymore
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
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
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });
    await page.close();
    console.log(`social-image: ${outFile} - created`);
  }
  await browser.close();
}

generateOGImages();
