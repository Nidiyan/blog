const assert = require('node:assert/strict');
const { readdirSync, readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const publicDir = path.resolve(__dirname, '../public');
const pages = readdirSync(publicDir, { recursive: true })
  .filter(file => file.endsWith('.html'));

test('the site includes home, posts, about, a sample post, and an error page', () => {
  for (const file of ['index.html', 'posts.html', 'about.html', 'posts/welcome.html', '404.html']) {
    assert.ok(pages.includes(file), `Missing ${file}`);
  }
});

test('the homepage has the public blog identity and structured SEO metadata', () => {
  const html = readFileSync(path.join(publicDir, 'index.html'), 'utf8');
  assert.match(html, /<title>Nidiyan's blog, nids blog :\)<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/nidiyan\.com\/">/);
  assert.match(html, /<meta property="og:type" content="website">/);
  assert.match(html, /<script type="application\/ld\+json">/);
});

test('the public site includes a crawlable sitemap and robots policy', () => {
  const sitemap = readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf8');
  const robots = readFileSync(path.join(publicDir, 'robots.txt'), 'utf8');
  assert.match(sitemap, /<loc>https:\/\/nidiyan\.com\/<\/loc>/);
  assert.match(sitemap, /posts\/welcome\.html/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/nidiyan\.com\/sitemap\.xml/);
});

for (const page of pages) {
  const html = readFileSync(path.join(publicDir, page), 'utf8');

  test(`${page} has accessible page structure and metadata`, () => {
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<meta name="viewport"/);
    assert.match(html, /<meta name="description" content="[^"]+">/);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.match(html, /href="#main"/);
    assert.match(html, /<main id="main"/);
    assert.match(html, /<nav aria-label="Main navigation">/);
    assert.match(html, /href="\/styles.css"/);
  });

  test(`${page} only links to existing local files and anchors`, () => {
    for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https:|mailto:)/.test(href)) continue;
      if (href.startsWith('#')) {
        assert.ok(html.includes(`id="${href.slice(1)}"`), `Missing anchor ${href}`);
        continue;
      }
      assert.ok(href.startsWith('/'), `Expected root-relative URL: ${href}`);
      const target = href === '/' ? 'index.html' : href.slice(1);
      assert.ok(existsSync(path.join(publicDir, target)), `Broken link ${href}`);
    }
  });
}

test('About offers social links in the requested order without collecting subscriptions', () => {
  const html = readFileSync(path.join(publicDir, 'about.html'), 'utf8');
  const links = [...html.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)/g)]
    .map(([, href, label]) => ({ href, label: label.trim() }));
  assert.deepEqual(
    links.filter(({ label }) => ['Instagram', 'LinkedIn', 'GitHub', 'Email'].includes(label)),
    [
      { href: 'https://www.instagram.com/nidiyan_', label: 'Instagram' },
      { href: 'https://www.linkedin.com/in/nidiyan', label: 'LinkedIn' },
      { href: 'https://www.github.com/nidiyan', label: 'GitHub' },
      { href: 'mailto:nidiyanblog@gmail.com', label: 'Email' }
    ]
  );
  for (const page of pages) {
    const content = readFileSync(path.join(publicDir, page), 'utf8');
    assert.doesNotMatch(content, /<form/i);
    assert.doesNotMatch(content, /<script(?! type="application\/ld\+json")/i);
  }
});
