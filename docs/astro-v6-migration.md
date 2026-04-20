# Astro v6 Migration Notes

- Upgraded all dependencies to Astro v6 and latest integrations.
- Content collections migrated to Content Layer API (`src/content.config.ts`).
- Uses `id` for canonical post URLs and navigation.
- Uses `render(entry)` for content rendering in dynamic routes.
- Environment: Node 24.x required.
- See [Astro v6 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v6/) for more details.

---

## Styling & Naming Conventions

For details on the CSS methodology and class naming conventions used after migration, see [css-naming-conventions.md](css-naming-conventions.md).
