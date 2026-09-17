# Recommendation Engine Guide

`hellostu.xyz` includes an AI-assisted recommendation engine that analyses all published posts, finds semantically related content using vector embeddings and Maximal Marginal Relevance (MMR), and generates personalized, conversational post recommendations in Stuart's voice (with an alternate pirate easter egg mode).

---

## 1. How It Works

1. **Semantic Embeddings**:
   - Every post's title, category, tags, description, and markdown body are converted into a semantic embedding vector using **`gemini-embedding-2`**.
   - Embeddings are cached in `src/data/embeddings-cache.json` using a SHA-256 hash of the post content. Only newly added or edited posts are re-embedded.

2. **MMR (Maximal Marginal Relevance)**:
   - Finds candidate matches using cosine similarity.
   - Applies an MMR diversity slider (`mmrLambda` in config) to balance pure semantic relevance with diversity across different topics and categories.

3. **Conversational Reasoning (Voice Generation)**:
   - For the top matches, **`gemini-3.5-flash`** writes 1–2 conversational sentences (22–38 words) in Stuart's first-person voice explaining *why* the reader should check out the linked piece.
   - Generates both a standard voice justification and an alternate pirate-themed justification for the site's easter egg toggle.
   - Dynamic anti-repetition constraints prevent duplicate phrasing across multiple recommendations on the same post.

4. **Front-end Display**:
   - Rendered by `src/components/Recommendations.astro` at the bottom of blog posts.
   - Supports live toggling between standard mode (📚) and pirate mode (🏴‍☠️) without page reloads.

---

## 2. Models Used

* **Embedding Model**: `gemini-embedding-2`
* **Reasoning / Voice Generation Model**: `gemini-3.5-flash`

---

## 3. Configuration

All tuning parameters are centralized in:

    src/scripts/recommendations.config.mjs

Key configuration options:
- `models.embedding`: Name of the Gemini embedding model.
- `models.reasoning`: Name of the Gemini text generation model.
- `delayMs`: Delay between requests in milliseconds (set to `0` for paid/high-quota tiers, or `4000`–`5000` if rate-limited).
- `weights.mmrLambda`: Diversity vs. relevance slider (`1.0` = Pure Relevance, `0.0` = Pure Diversity).
- `prompt`: Main prompt template with Stuart's voice guidelines, examples, and negative constraints.
- `promptAlt`: Alternate prompt template for the pirate easter egg persona.

---

## 4. Scripts & Commands

| Command | Purpose |
| :--- | :--- |
| `npm run generate:recommendations` | Generates recommendations for new or uncached posts (also runs automatically during `npm run dev`). |
| `npm run generate:recommendations:force` | Bypasses the text cache and regenerates all recommendations across the entire site from scratch (use after changing prompts or models). |
| `npm run generate:recommendations:test` | Runs a dry-run test on 5 random posts and prints the preview to the console without modifying files. |

---

## 5. Required Environment Variables

Set the following in your local `.env` file:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

If missing, the script will exit with an instructional message.

---

## 6. Data Files

* `src/data/recommendations.json`: Final output file containing recommendations and justifications for all posts. Read by `Recommendations.astro` at build time.
* `src/data/embeddings-cache.json`: Content-hashed cache of all post embeddings.
