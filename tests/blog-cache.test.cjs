const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

function harness() {
  let rows = [], calls = 0, admin = true, fail = false
  const cached = new Map(), paths = []
  const sql = async () => { calls++; if (fail) throw Error('offline'); return rows }
  const response = { json: (body, init = {}) => ({ body, status: init.status || 200 }) }
  const cache = {
    unstable_cache: (fn, key, opts) => { assert.equal(opts.revalidate, 86400); return async (...args) => {
      const k = JSON.stringify([key, args]); if (!cached.has(k)) cached.set(k, await fn(...args)); return cached.get(k)
    } },
    revalidateTag: () => cached.clear(), revalidatePath: (...args) => paths.push(args),
  }
  function load(file) {
    const module = { exports: {} }
    const mocks = { 'next/cache': cache, 'next/server': { NextResponse: response }, '@/lib/db': { sql }, '@/lib/admin-auth': { isAdmin: async () => admin }, '@/lib/blog-cache': blog }
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
    vm.runInNewContext(code, { module, exports: module.exports, require: id => { if (!(id in mocks)) throw Error(id); return mocks[id] }, console, Date })
    return module.exports
  }
  let blog
  blog = load('lib/blog-cache.ts')
  return { blog, load, paths, cache, setRows: v => rows = v, calls: () => calls, setAdmin: v => admin = v, setFail: v => fail = v }
}

test('published list and per-slug reads reuse cache; edits invalidate list, missing slugs, metadata and neighbors', async () => {
  const h = harness(); h.setRows([{id:'1', slug:'old', title:'Old', content:'private large body'}])
  const list = await h.blog.getPublishedPosts(); await h.blog.getPublishedPosts()
  assert.equal(h.calls(), 1); assert.equal(list[0].content, undefined)
  await h.blog.getPublishedPost('old'); await h.blog.getPublishedPost('old'); assert.equal(h.calls(), 2)
  h.setRows([]); assert.equal(await h.blog.getPublishedPost('new'), null)
  h.setRows([{id:'1', slug:'new', title:'New'}]); h.blog.refreshPublicBlog()
  assert.equal((await h.blog.getPublishedPost('new')).title, 'New')
  assert.equal((await h.blog.getPublishedPosts())[0].slug, 'new')
  assert.ok(h.paths.some(p => p[0] === '/blog/[slug]' && p[1] === 'page'))
  assert.ok(h.paths.some(p => p[0] === '/sitemap.xml'))
  h.setRows([]); h.blog.refreshPublicBlog(); assert.equal(await h.blog.getPublishedPost('old'), null)
})

test('database failures are not cached as empty content', async () => {
  const h = harness(); h.setFail(true); await assert.rejects(h.blog.getPublishedPosts)
  h.setFail(false); h.setRows([{slug:'recovered'}]); assert.equal((await h.blog.getPublishedPosts())[0].slug, 'recovered')
})

test('admin refresh is authenticated and reports enqueue failure', async () => {
  const h = harness(), route = h.load('app/api/admin/blog/revalidate/route.ts')
  h.setAdmin(false); assert.equal((await route.POST()).status, 401); assert.equal(h.paths.length, 0)
  h.setAdmin(true); assert.equal((await route.POST()).status, 200)
  h.cache.revalidateTag = () => { throw Error('cache offline') }; assert.equal((await route.POST()).status, 503)
  const result = h.blog.blogMutationResponse({id:'saved'})
  assert.equal(result.status, 200); assert.equal(result.body.id, 'saved'); assert.match(result.body.cacheWarning, /was saved/)
})

test('create, update/unpublish/rename and delete invalidate only after successful writes', async () => {
  const h = harness(), create = h.load('app/api/admin/blog/route.ts'), edit = h.load('app/api/admin/blog/[id]/route.ts')
  const request = { json: async () => ({title:'Title', slug:'new', content:'Text', published:false}) }, params = { params: Promise.resolve({id:'1'}) }
  h.setRows([{id:'1', title:'Old', slug:'old', content:'Old text', published:true}])
  await create.POST(request); let n = h.paths.length; assert.ok(n > 0)
  await edit.PUT(request, params); assert.ok(h.paths.length > n); n = h.paths.length
  await edit.DELETE({}, params); assert.ok(h.paths.length > n); n = h.paths.length
  h.setFail(true); assert.equal((await create.POST(request)).status, 500); assert.equal(h.paths.length, n)
  h.setAdmin(false); assert.equal((await edit.DELETE({}, params)).status, 401); assert.equal(h.paths.length, n)
})

test('public reads are published-only and page routes are static; imports remain drafts', () => {
  const source = fs.readFileSync('lib/blog-cache.ts','utf8')
  assert.equal((source.match(/WHERE .*published = true/g) || []).length, 2)
  for (const file of ['app/blog/page.tsx','app/blog/[slug]/page.tsx']) assert.match(fs.readFileSync(file,'utf8'), /dynamic = 'force-static'/)
  for (const file of ['import-json','import-substack']) assert.match(fs.readFileSync(`app/api/admin/blog/${file}/route.ts`,'utf8'), /false,/)
})
