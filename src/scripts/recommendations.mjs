import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import matter from 'gray-matter';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from './recommendations.config.mjs';

// Load environment variables from .env file (Native Node.js feature)
try {
  process.loadEnvFile();
} catch (err) {
  // Silently ignore if .env file is missing, falling back to system env vars
}

// Initialize Gemini API Client
// Strip accidental quotes that process.loadEnvFile() might leave behind
const apiKey = process.env.GEMINI_API_KEY?.replace(/^["']|["']$/g, '');
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY environment variable is missing.');
  console.error(
    'Run with: GEMINI_API_KEY=your_key node src/scripts/recommendations.mjs',
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const embeddingModel = genAI.getGenerativeModel({
  model: config.models.embedding,
});
const reasoningModel = genAI.getGenerativeModel({
  model: config.models.reasoning,
});

const isTestMode = process.argv.includes('--test');
const BASE_DIR = process.cwd();
const CONTENT_DIR = path.join(BASE_DIR, 'src/content/posts');
const OUTPUT_FILE = path.join(
  BASE_DIR,
  isTestMode
    ? 'src/data/test-recommendations.json'
    : 'src/data/recommendations.json',
);
const EMBEDDINGS_CACHE_FILE = path.join(
  BASE_DIR,
  'src/data/embeddings-cache.json',
);

// --- Helpers ---

// Simple delay function to respect rate limits
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Cosine Similarity Calculator
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Helper to chunk long text into safe sizes for the embedding model
function chunkText(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

// Helper to average multiple embedding arrays into a single representative vector (Mean Pooling)
function averageEmbeddings(embeddings) {
  if (embeddings.length === 0) return [];
  if (embeddings.length === 1) return embeddings[0];

  const length = embeddings[0].length;
  const averaged = new Array(length).fill(0);
  for (const emb of embeddings) {
    for (let i = 0; i < length; i++) {
      averaged[i] += emb[i] / embeddings.length;
    }
  }
  return averaged;
}

// --- Main Execution ---
async function generateRecommendations() {
  // --- Smoke Test ---
  console.log('[*] Running API connection smoke test...');
  console.log(`[*] Key starts with: "${apiKey.substring(0, 4)}..."`);

  if (!apiKey.startsWith('AIza')) {
    console.warn('[!] WARNING: Google API keys typically start with "AIza".');
    console.warn(
      '[!] Double-check that you copied the exact string from Google AI Studio.',
    );
  }

  try {
    console.log(
      '[*] Fetching the definitive list of models your API key is authorized to use...',
    );
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || `HTTP ${response.status} ${response.statusText}`,
      );
    }

    if (!data.models) {
      throw new Error('Connected, but no models array was returned.');
    }

    const availableModels = data.models.map(m => m.name.replace('models/', ''));
    console.log(
      `[✔] Connection successful! Your key has access to ${availableModels.length} models.`,
    );

    const requiredReasoning = config.models.reasoning;
    const requiredEmbedding = config.models.embedding;

    if (
      !availableModels.includes(requiredReasoning) ||
      !availableModels.includes(requiredEmbedding)
    ) {
      console.error(
        '\n[✖] STOPPING: The requested models are NOT available for your account/region.',
      );
      console.log('\nHere are the models you DO have access to:');
      availableModels.forEach(m => console.log(`  - ${m}`));
      console.log(
        '\nPlease copy one of the embedding models and one of the generative models from the list above, update lines 28 and 31 of this script, and run it again!',
      );
      process.exit(1);
    }
  } catch (err) {
    console.error(
      '\n[✖] API Smoke Test Failed: Could not connect to Google AI.',
    );
    console.error(
      '   This is likely an issue with your API key or Google Cloud project setup.',
    );
    console.error('   Please check the following:');
    console.error(
      '   1. Your GEMINI_API_KEY in the .env file is correct and has no typos.',
    );
    console.error('\n   Google API Error Response:', err.message);
    process.exit(1);
  }
  // --- End Smoke Test ---

  console.log(`[1/4] Reading markdown files from ${CONTENT_DIR}...`);
  const posts = [];

  try {
    const files = await fs.readdir(CONTENT_DIR);
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const content = await fs.readFile(
          path.join(CONTENT_DIR, file),
          'utf-8',
        );
        try {
          const { data, content: bodyText } = matter(content);
          const id = data.slug || path.parse(file).name;

          let formattedDate = 'Unknown Date';
          if (data.pubDate) {
            try {
              formattedDate = new Date(data.pubDate)
                .toISOString()
                .split('T')[0];
            } catch (e) {
              formattedDate = String(data.pubDate);
            }
          }

          // Skip drafts to save API calls and processing time
          if (id && data.draft !== true) {
            posts.push({
              id,
              title: data.title || 'Untitled',
              description: data.description || '',
              pubDate: formattedDate,
              category: data.category || 'Uncategorized',
              tags: Array.isArray(data.tags)
                ? data.tags.join(', ')
                : data.tags || '',
              body: bodyText || '',
            });
          }
        } catch (err) {
          console.error(`\nFailed to parse frontmatter for ${file}`, err);
        }
      }
    }
    console.log(`Found ${posts.length} valid posts.`);
  } catch (err) {
    console.error('Error reading content files:', err);
    process.exit(1);
  }

  console.log('\n[2/4] Generating semantic embeddings...');
  let embeddingsCache = {};
  if (existsSync(EMBEDDINGS_CACHE_FILE)) {
    try {
      const cacheContent = await fs.readFile(EMBEDDINGS_CACHE_FILE, 'utf-8');
      embeddingsCache = JSON.parse(cacheContent);
      console.log(
        `Loaded embeddings cache from ${path.basename(EMBEDDINGS_CACHE_FILE)}.`,
      );
    } catch (e) {
      console.log('Could not parse embeddings cache. Starting fresh.');
    }
  }

  let embeddingsUpdated = false;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const fullText = `Title: ${post.title}. Category: ${post.category}. Description: ${post.description}. Date: ${post.pubDate}. Tags: ${post.tags}. Content: ${post.body}`;

    const contentHash = crypto
      .createHash('sha256')
      .update(fullText)
      .digest('hex');
    if (
      embeddingsCache[post.id] &&
      embeddingsCache[post.id].hash === contentHash
    ) {
      post.embedding = embeddingsCache[post.id].embedding;
      process.stdout.write(
        `\rLoaded embedding for ${i + 1}/${posts.length} posts from cache...`,
      );
      continue;
    }

    // Chunk text to ~2000 characters. Gemini API often throws cryptic 404 errors
    // when dense text/code exceeds the 2048 token limit on the embedContent endpoint.
    const chunks = chunkText(fullText, 2000);
    const chunkEmbeddings = [];

    try {
      for (const chunk of chunks) {
        let success = false;
        let retries = 0;
        while (!success && retries < 3) {
          try {
            const result = await embeddingModel.embedContent(chunk);
            chunkEmbeddings.push(result.embedding.values);
            success = true;
            await delay(300); // Increased buffer to respect burst API limits
          } catch (e) {
            if (e.message.includes('429') && retries < 2) {
              retries++;
              process.stdout.write(
                `\n[!] Burst limit hit. Pausing for 10s (Retry ${retries}/2)...\n`,
              );
              await delay(10000); // Wait 10 seconds for the quota bucket to refill
            } else {
              throw e;
            }
          }
        }
      }
      post.embedding = averageEmbeddings(chunkEmbeddings);

      embeddingsCache[post.id] = {
        hash: contentHash,
        embedding: post.embedding,
      };
      embeddingsUpdated = true;

      process.stdout.write(
        `\rGenerated embeddings for ${i + 1}/${posts.length} posts...`,
      );
    } catch (err) {
      console.error(`\nFailed to embed post: ${post.id} - ${err.message}`);
    }
  }

  if (embeddingsUpdated) {
    await fs.writeFile(
      EMBEDDINGS_CACHE_FILE,
      JSON.stringify(embeddingsCache),
      'utf-8',
    );
    console.log('\nSaved updated embeddings to cache.');
  }

  console.log('\n\n[3/4] Calculating similarities and reasoning matches...');

  let postsToProcess = posts;
  if (isTestMode) {
    console.log('[TEST MODE] Selecting 5 random posts to process...');
    postsToProcess = [...posts].sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  let existingRecommendations = {};
  if (existsSync(OUTPUT_FILE)) {
    try {
      const fileContent = await fs.readFile(OUTPUT_FILE, 'utf-8');
      existingRecommendations = JSON.parse(fileContent);
      console.log(
        `Loaded existing recommendations to use as a cache from ${path.basename(OUTPUT_FILE)}.`,
      );
    } catch (e) {
      console.log('Could not parse existing recommendations. Starting fresh.');
    }
  }

  const recommendations = {};

  for (let i = 0; i < postsToProcess.length; i++) {
    const postA = postsToProcess[i];
    if (!postA.embedding || postA.embedding.length === 0) continue;

    let candidates = posts
      .filter(
        postB =>
          postA.id !== postB.id &&
          postB.embedding &&
          postB.embedding.length > 0,
      )
      .map(postB => {
        let baseScore = cosineSimilarity(postA.embedding, postB.embedding);
        // Cross-Pollinator (Category Math): Boost score if posts are in different categories
        if (postA.category !== postB.category) {
          baseScore += config.weights.crossCategoryBoost;
        }
        return { id: postB.id, score: baseScore, postB };
      });

    // Maximal Marginal Relevance (MMR) - Diversity Math
    const scores = [];
    const lambda = config.weights.mmrLambda;

    while (scores.length < 3 && candidates.length > 0) {
      if (scores.length === 0) {
        // First pick is just the absolute highest score
        candidates.sort((a, b) => b.score - a.score);
        scores.push(candidates.shift());
      } else {
        // Subsequent picks balance similarity with diversity
        let bestMmrScore = -Infinity;
        let bestIndex = -1;

        for (let j = 0; j < candidates.length; j++) {
          const candidate = candidates[j];
          // Find how similar this candidate is to the posts we ALREADY selected
          let maxSimToSelected = Math.max(
            ...scores.map(s =>
              cosineSimilarity(candidate.postB.embedding, s.postB.embedding),
            ),
          );
          // MMR Equation: (Relevance) - (Similarity to already picked items)
          const mmrScore =
            lambda * candidate.score - (1 - lambda) * maxSimToSelected;
          if (mmrScore > bestMmrScore) {
            bestMmrScore = mmrScore;
            bestIndex = j;
          }
        }
        scores.push(candidates.splice(bestIndex, 1)[0]);
      }
    }

    recommendations[postA.id] = [];

    // Generate Reasoning for the Top 3 Matches
    for (const match of scores) {
      let justification = '';
      const cachedMatch = existingRecommendations[postA.id]?.find(
        r => r.id === match.id,
      );
      const isInvalidCache =
        cachedMatch?.justification?.includes('temporarily disabled') ||
        cachedMatch?.justification?.includes('highly recommended');

      // In test mode, we bypass the cache so you can actually test the new prompt
      if (
        cachedMatch &&
        cachedMatch.justification &&
        !isInvalidCache &&
        !isTestMode
      ) {
        justification = cachedMatch.justification; // Reuse existing rationale
      } else {
        const prompt = config.prompt
          .replace(/\{\{TITLE_A\}\}/g, postA.title)
          .replace(/\{\{CAT_A\}\}/g, postA.category)
          .replace(/\{\{TAGS_A\}\}/g, postA.tags)
          .replace(/\{\{DESC_A\}\}/g, postA.description)
          .replace(/\{\{CONTENT_A\}\}/g, postA.body)
          .replace(/\{\{TITLE_B\}\}/g, match.postB.title)
          .replace(/\{\{CAT_B\}\}/g, match.postB.category)
          .replace(/\{\{TAGS_B\}\}/g, match.postB.tags)
          .replace(/\{\{DESC_B\}\}/g, match.postB.description)
          .replace(/\{\{CONTENT_B\}\}/g, match.postB.body);

        try {
          const response = await reasoningModel.generateContent(prompt);
          justification = response.response.text().trim();
        } catch (err) {
          console.error(
            `\nFailed to reason match ${postA.id} -> ${match.id} - ${err.message}`,
          );
          justification = 'A highly recommended related post.';
        }

        if (config.delayMs > 0) await delay(config.delayMs);
      }

      recommendations[postA.id].push({
        id: match.id,
        justification,
      });
    }
    process.stdout.write(
      `\rProcessed relationships for ${i + 1}/${postsToProcess.length} posts...`,
    );
  }

  console.log('\n\n[4/4] Writing recommendations to JSON...');
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!existsSync(outputDir)) {
    await fs.mkdir(outputDir, { recursive: true });
  }

  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(recommendations, null, 2),
    'utf-8',
  );
  console.log(`Success! Recommendations saved to ${OUTPUT_FILE}`);
}

generateRecommendations();
