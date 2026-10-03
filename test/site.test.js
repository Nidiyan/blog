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

test('About offers Instagram and email without collecting subscriptions', () => {
  const html = readFileSync(path.join(publicDir, 'about.html'), 'utf8');
  assert.match(html, /href="https:\/\/www.instagram.com\/"/);
  assert.match(html, /href="mailto:[^"]+"/);
  for (const page of pages) {
    const content = readFileSync(path.join(publicDir, page), 'utf8');
    assert.doesNotMatch(content, /<form|<script/i);
  }
});
