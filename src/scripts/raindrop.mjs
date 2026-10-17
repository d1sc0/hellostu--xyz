import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import config from './raindrop.config.mjs';

// Load environment variables from .env file (Native Node.js feature)
try {
  process.loadEnvFile();
} catch {
  // Silently ignore if .env file is missing, falling back to system env vars
}

const API_BASE = 'https://api.raindrop.io/rest/v1';
const BASE_DIR = process.cwd();
const OUTPUT_FILE = path.join(BASE_DIR, 'src/data/raindrop.json');

const args = process.argv.slice(2);
const isListCollectionsMode = args.includes('--collections');
const isListBookmarksMode = args.includes('--list');
const searchQuery = args
  .filter(arg => !arg.startsWith('--'))
  .join(' ')
  .trim()
  .toLowerCase();

const token = process.env.RAINDROP_TOKEN?.replace(/^["']|["']$/g, '').trim();

function toKebabCase(str) {
  return String(str || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function raindropFetch(endpoint, authToken) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get('Retry-After') || 2);
    console.warn(`Rate limited by Raindrop API. Waiting ${retryAfter}s...`);
    await delay(retryAfter * 1000);
    return raindropFetch(endpoint, authToken);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Raindrop API error (${res.status}) on ${endpoint}: ${text}`);
  }

  return res.json();
}

/**
 * Fetches both root and child collections and builds a flat lookup map
 * with full hierarchical paths (e.g. "Work / Learning Design").
 */
async function fetchAllCollections(authToken) {
  const [rootRes, childRes] = await Promise.all([
    raindropFetch('/collections', authToken),
    raindropFetch('/collections/childrens', authToken),
  ]);

  const rawCollections = [
    ...(rootRes.items || []),
    ...(childRes.items || []),
  ];

  const byId = new Map();
  for (const col of rawCollections) {
    byId.set(col._id, {
      id: col._id,
      title: col.title,
      slug: col.slug || toKebabCase(col.title),
      count: col.count || 0,
      parentId: col.parent?.$id ?? null,
      public: Boolean(col.public),
      cover: col.cover?.[0] || null,
    });
  }

  // Compute full path & ancestor chain for each collection
  for (const col of byId.values()) {
    const parts = [col.title];
    const ancestorIds = [];
    let currParentId = col.parentId;
    const visited = new Set([col.id]);

    while (currParentId && byId.has(currParentId) && !visited.has(currParentId)) {
      visited.add(currParentId);
      const parentCol = byId.get(currParentId);
      parts.unshift(parentCol.title);
      ancestorIds.push(parentCol.id);
      currParentId = parentCol.parentId;
    }

    col.path = parts.join(' / ');
    col.pathSlug = parts.map(toKebabCase).join('/');
    col.ancestorIds = ancestorIds;
  }

  return Array.from(byId.values()).sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * Determines whether a collection matches the whitelist in raindrop.config.mjs.
 */
function resolveMatchedCollections(allCollections) {
  const configured = config.collections || [];
  const directMatchedIds = new Set();

  for (const col of allCollections) {
    for (const rule of configured) {
      if (typeof rule === 'number' && col.id === rule) {
        directMatchedIds.add(col.id);
      } else if (typeof rule === 'string') {
        const normalizedRule = rule.trim().toLowerCase();
        const ruleSlug = toKebabCase(rule);
        if (
          String(col.id) === normalizedRule ||
          col.title.toLowerCase() === normalizedRule ||
          col.path.toLowerCase() === normalizedRule ||
          col.slug === ruleSlug ||
          col.pathSlug === normalizedRule
        ) {
          directMatchedIds.add(col.id);
        }
      }
    }
  }

  if (config.includeSubcollections) {
    for (const col of allCollections) {
      if (col.ancestorIds.some(ancestorId => directMatchedIds.has(ancestorId))) {
        directMatchedIds.add(col.id);
      }
    }
  }

  return allCollections.filter(col => directMatchedIds.has(col.id));
}

/**
 * Fetches all raindrops (bookmarks) inside a given collection ID, handling pagination.
 */
async function fetchRaindropsInCollection(collectionId, authToken, extraSearch = '') {
  const perPage = Math.min(Number(config.perPage) || 50, 50);
  let page = 0;
  const allItems = [];

  while (true) {
    const searchParam = extraSearch
      ? `&search=${encodeURIComponent(extraSearch)}`
      : '';
    const data = await raindropFetch(
      `/raindrops/${collectionId}?perpage=${perPage}&page=${page}${searchParam}`,
      authToken,
    );

    const items = data.items || [];
    allItems.push(...items);

    if (items.length < perPage) {
      break;
    }
    page += 1;
    await delay(150);
  }

  return allItems;
}

/**
 * Normalizes a raw Raindrop API item into our clean site schema.
 */
function normalizeRaindropItem(item, collectionMap) {
  const colId = item.collection?.$id ?? item.collectionId ?? -1;
  const colInfo = collectionMap.get(colId) || {
    id: colId,
    title: 'Unsorted',
    slug: 'unsorted',
    path: 'Unsorted',
  };

  const rawTags = Array.isArray(item.tags) ? item.tags : [];
  const tags = config.normalizeTags
    ? rawTags.map(toKebabCase).filter(Boolean)
    : rawTags;

  const highlights = Array.isArray(item.highlights)
    ? item.highlights
        .filter(h => h && h.text)
        .map(h => ({
          id: h._id || null,
          text: h.text.trim(),
          note: (h.note || '').trim(),
          color: h.color || 'yellow',
          created: h.created || null,
        }))
    : [];

  return {
    id: item._id,
    title: (item.title || '').trim(),
    link: item.link,
    domain: item.domain || '',
    excerpt: (item.excerpt || '').trim(),
    note: (item.note || '').trim(),
    type: item.type || 'link',
    cover: item.cover || '',
    tags,
    important: Boolean(item.important),
    created: item.created,
    lastUpdate: item.lastUpdate || item.created,
    collection: {
      id: colInfo.id,
      title: colInfo.title,
      slug: colInfo.slug,
      path: colInfo.path,
    },
    highlights,
  };
}

/**
 * CLI mode: `--list [query]`
 * Prints a formatted list of bookmarks currently stored in src/data/raindrop.json
 */
async function listLocalBookmarks() {
  if (!existsSync(OUTPUT_FILE)) {
    console.log('No src/data/raindrop.json file found yet. Run `npm run sync:raindrop` first.');
    return;
  }

  const raw = await fs.readFile(OUTPUT_FILE, 'utf-8');
  const data = JSON.parse(raw);
  let bookmarks = data.bookmarks || [];

  if (searchQuery) {
    bookmarks = bookmarks.filter(b => {
      const haystack = [
        b.id,
        b.title,
        b.link,
        b.domain,
        b.note,
        b.excerpt,
        b.collection?.path,
        ...(b.tags || []),
        ...(b.highlights || []).map(h => h.text),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(searchQuery);
    });
  }

  console.log(
    `\n📚 Raindrop Bookmarks (${bookmarks.length}${searchQuery ? ` matching "${searchQuery}"` : ''})${data.isSeedData ? ' [SAMPLE SEED DATA]' : ''}:\n`,
  );

  if (bookmarks.length === 0) {
    console.log('  No matching bookmarks found.');
    return;
  }

  for (const b of bookmarks) {
    const tagStr = b.tags?.length ? b.tags.map(t => `#${t}`).join(' ') : '(no tags)';
    const highlightCount = b.highlights?.length || 0;
    console.log(`  • [${b.id}] ${b.title}`);
    console.log(`    URL:        ${b.link}`);
    console.log(`    Collection: ${b.collection?.path || b.collection?.title} (ID: ${b.collection?.id})`);
    console.log(`    Tags:       ${tagStr}`);
    console.log(
      `    Extras:     ${b.note ? '📝 Has note' : '—'} | ${highlightCount ? `🖍️  ${highlightCount} highlight(s)` : '0 highlights'}${b.important ? ' | ❤️ Favorite' : ''}\n`,
    );
  }
}

/**
 * CLI mode: `--collections`
 * Connects to Raindrop API and prints all collections with their IDs and whitelist status.
 */
async function listRemoteCollections() {
  if (!token) {
    console.error('Error: RAINDROP_TOKEN is not set in your .env file.');
    console.error('Add RAINDROP_TOKEN=your_test_token to .env and try again.');
    process.exit(1);
  }

  const allCollections = await fetchAllCollections(token);
  const matched = new Set(resolveMatchedCollections(allCollections).map(c => c.id));

  console.log(`\n📁 Your Raindrop.io Collections (${allCollections.length} total):\n`);
  for (const col of allCollections) {
    const status = matched.has(col.id) ? '✅ [SYNCED]' : '   [ignored]';
    console.log(
      `  ${status} ${col.path.padEnd(38)} | ID: ${String(col.id).padEnd(10)} | Items: ${col.count}`,
    );
  }
  console.log(
    '\nTip: Add any collection name, path, or numeric ID to `collections` in src/scripts/raindrop.config.mjs.\n',
  );
}

/**
 * Default mode: Sync whitelisted collections to src/data/raindrop.json
 */
async function syncRaindrop() {
  if (!token) {
    console.log(
      'ℹ️  RAINDROP_TOKEN not found in environment. Skipping live Raindrop sync and using cached src/data/raindrop.json.',
    );
    return;
  }

  console.log('🌧️  Fetching collections from Raindrop.io...');
  const allCollections = await fetchAllCollections(token);
  const collectionMap = new Map(allCollections.map(c => [c.id, c]));
  const matchedCollections = resolveMatchedCollections(allCollections);

  if (matchedCollections.length === 0 && !config.globalOptInTag) {
    console.warn(
      '⚠️  None of the collections in src/scripts/raindrop.config.mjs matched your Raindrop account.',
    );
    console.warn('   Configured collections:', config.collections);
    console.warn(
      '   Available collections in your account:',
      allCollections.map(c => `${c.path} (${c.id})`).join(', ') || 'None',
    );
    console.warn('   Run `npm run raindrop:collections` to inspect your folders.');
    return;
  }

  const bookmarksMap = new Map();

  for (const col of matchedCollections) {
    console.log(`   ↳ Syncing "${col.path}" (ID: ${col.id})...`);
    const items = await fetchRaindropsInCollection(col.id, token);
    for (const item of items) {
      bookmarksMap.set(item._id, normalizeRaindropItem(item, collectionMap));
    }
  }

  // Optional: also pull items from any collection tagged with globalOptInTag
  if (config.globalOptInTag) {
    const cleanTag = config.globalOptInTag.replace(/^#/, '');
    console.log(`   ↳ Syncing global opt-in tag "#${cleanTag}"...`);
    const items = await fetchRaindropsInCollection(0, token, `#${cleanTag}`);
    for (const item of items) {
      bookmarksMap.set(item._id, normalizeRaindropItem(item, collectionMap));
    }
  }

  const bookmarks = Array.from(bookmarksMap.values()).sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
  );

  const payload = {
    lastSynced: new Date().toISOString(),
    isSeedData: false,
    collections: matchedCollections.map(c => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      path: c.path,
      count: c.count,
    })),
    bookmarks,
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
  console.log(
    `✅ Synced ${bookmarks.length} bookmark(s) across ${matchedCollections.length} collection(s) to src/data/raindrop.json.`,
  );
}

async function main() {
  try {
    if (isListBookmarksMode) {
      await listLocalBookmarks();
    } else if (isListCollectionsMode) {
      await listRemoteCollections();
    } else {
      await syncRaindrop();
    }
  } catch (err) {
    console.error('❌ Raindrop script error:', err.message);
    process.exit(1);
  }
}

main();
