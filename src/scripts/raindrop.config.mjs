export default {
  // Whitelist of Raindrop.io collections (folders) to sync at build time.
  // You can specify:
  // - Collection names (case-insensitive, e.g. 'Site Shared', 'Learning Design')
  // - Nested paths (e.g. 'Work / Agile')
  // - Numeric Raindrop collection IDs (e.g. 42819302)
  //
  // Run `npm run raindrop:collections` to view all collections & IDs in your account.
  collections: [
    '_hellostu shared',
    /*  'Reading List',
    'Learning Design',
    'Agile & Systems', */
  ],

  // If true, any sub-folders nested inside a whitelisted parent collection
  // will automatically be synced as well.
  includeSubcollections: true,

  // If true, normalizes all Raindrop tags to lowercase kebab-case
  // (e.g. "Learning Design" -> "learning-design") to match hellostu.xyz tag conventions.
  normalizeTags: true,

  // Optional: Sync bookmarks from ANY collection if they have this tag in Raindrop
  // (set to null or '' to strictly only sync from the whitelisted collections above).
  globalOptInTag: null,

  // Number of items to fetch per API request (Raindrop max is 50)
  perPage: 50,
};
