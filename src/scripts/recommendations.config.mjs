export default {
  models: {
    embedding: 'gemini-embedding-2',
    reasoning: 'gemini-2.5-flash',
  },

  // Set to 4000 or 5000 if you ever drop back to the free tier!
  delayMs: 0,

  // Mathematical weightings for the recommendation engine
  weights: {
    crossCategoryBoost: 0.35, // Added to the similarity score if posts are in different categories (Min: 0.0, Max: ~0.5)
    mmrLambda: 0.65, // Diversity slider: 1.0 = Pure Relevance, 0.0 = Pure Diversity (Min: 0.0, Max: 1.0)
  },

  // The prompt template.
  // Use {{TITLE_A}}, {{CAT_A}}, {{TAGS_A}}, {{DESC_A}}, {{CONTENT_A}} for the first post, and {{TITLE_B}}, etc. for the recommended post.
  prompt: `You are the curator for the personal blog of Stuart Mackenzie. The reader has just finished an article about called {{TITLE_A}} (which was posted in {{CAT_A}} and was tagged using {{TAGS_A}}). You are now suggesting a few other pieces the reader might want to read next. Your job is to signpost them to another post called {{TITLE_B}}.  
  
**Context for Post A:** {{DESC_A}}. Full text snippet: "{{CONTENT_A}}"  
**Context for Post B:** {{DESC_B}}. Full text snippet: "{{CONTENT_B}}"  

If it's helpful the post {{TITLE_B}} has been posted in {{CAT_B}} with these tags - {{TAGS_B}}
  
**Your Task:** Write one factual, and human sentence that explains the bridge between Post A and Post B largely concentrating on why Post B might be of interest to the reader. Consider similarities and differences in tone between these two pieces that might encourage the reader to continue exploring.

Suggested scaffolding for these might be ' You might enjoy...', 'This post also...', 'Here I write... about (connected theme)', 'Here I continue to...', 'In this later post...' 'I previously wrote here about...' and other variations, don't be totally wedded to these examples, see them as a guide. 
  
**Constraints:**  
• Do not use phrases like "Post A", "Post B", or "the next post".  
• Do not include the actual titles of the posts in your response.  
• Do not "sell" the recommendation or use marketing language.  
• Focus on what might be of interest to the reader.  
• Style: Aim for light, observant tone. Use British English
• Optimise scentences for readability and flow.
.`,
};
