# Static public blog / database-backed authoring

## Behavior

Next.js 15.5.14 (the lockfile version) renders `/blog` and `/blog/[slug]` as static pages. New slugs render on their first request; later requests reuse the HTML. Published-only database reads are also cached with `unstable_cache`, shared by metadata, page content, navigation, the public JSON API and sitemap. Public JSON endpoints still invoke a function but do not query Neon on cache hits. Admin/draft reads remain uncached.

Create, update, publish, unpublish and delete through the existing authenticated admin endpoints invalidate the shared blog tag, all blog pages (including cached missing slugs and neighboring links), and sitemap. The next visitor regenerates the affected page; the change is not pre-rendered synchronously during Save. Imports remain drafts and become visible only when published. A database read error is thrown rather than cached as an empty blog or false 404.

The dashboard has **Refresh public blog**, backed by an admin-session-protected POST `/api/admin/blog/revalidate`. Use it after direct database edits, external import scripts, or a failed cache refresh. A raw SQL edit does **not** automatically notify Next. A one-day, request-driven revalidation interval provides a safety net (not a cron and not an immediate or hard maximum freshness guarantee). For immediate automatic updates from an external writer, that writer must invoke an authenticated invalidation mechanism after commit; no DB trigger, new credentials or unauthenticated webhook has been installed.

An invalidation enqueue error returns a saved result with a visible warning, avoiding duplicate writes on retry. Next flushes actual cache invalidation after the handler returns; backend failures cannot all be caught by that warning. Check hosting logs and use the refresh button, then verify public output. Already-open tabs may need a reload. Failed regeneration can retain the previous page; for urgent takedowns, verify the public URL rather than assuming an API success removes every CDN copy.

## Validation performed locally

- Five regression tests pass: `node --test tests/blog-cache.test.cjs`. These use mock database/cache boundaries, not Neon.
- Real Next production compilation passed. A normal full build stops at prerendering because this isolated worktree deliberately has no `DATABASE_URL`.
- A separate temporary **fixture-only** production build completed. Production server tests verified `/blog` HIT; first article MISS then HIT; repeated page/API requests generated zero extra database-adapter calls; authenticated refresh updated listing, title metadata and body on the next request; rename produced old 404/new 200; unpublish removed page/listing; republish cleared cached 404; unauthenticated refresh returned 401. No real database was contacted or changed. The original database adapter was restored and fixture build output removed.
- Full type checking is blocked by pre-existing syntax errors in `assets/IntelligentBookLanding.tsx:260`. Excluding that asset still reports existing types in tools/books/substack and sitemap's section mapping. No new changed-blog errors appeared. `next.config.mjs` already skips type/lint checks at build, so compilation is not a typecheck pass.
- Lockfile installation reported 21 existing dependency vulnerabilities (3 moderate, 17 high, 1 critical). No dependency upgrades were mixed into this patch.

## Before production

1. Review diff and merge/deploy only after authorization. No push, merge or deploy was performed.
2. Supply the existing database connection to the build environment as well as runtime. Static generation intentionally fails rather than publishing an empty blog when blog reads fail. Keep existing admin authentication.
3. Run build/CI against a safe test database. Verify publish/edit/rename/unpublish/delete via admin and public URLs, metadata and sitemap; confirm cache HIT after warmup. Include refresh retries and external SQL edit followed by the refresh button.
4. Deploy, repeat those checks on the actual CDN, inspect errors/cache behavior, and compare Neon usage over several days. This does not remove database storage charges or eliminate reads from unrelated tools, newsletter, admin, or other sites.

Other public sections are outside this blog change. Their existing dynamic behavior is unchanged.
