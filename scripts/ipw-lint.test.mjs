import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, test } from 'node:test';

import { lintTargets, scanSource } from './ipw-lint.mjs';

describe('mechanical design rules', () => {
  test('flags deterministic frontend tells', async () => {
    const source = `
      <main className="h-screen transition-all">
        <h1 className="bg-gradient-to-r bg-clip-text text-transparent">Hello</h1>
      </main>
      <style>
        .grid { background: linear-gradient(red 1px, transparent 1px), linear-gradient(90deg, red 1px, transparent 1px); background-size: 20px 20px; }
      </style>
    `;

    const findings = await scanSource('src/page.tsx', source, '/project');
    assert.deepEqual(
      [...new Set(findings.map((result) => result.rule))].sort(),
      ['decorative-grid', 'fixed-viewport-height', 'gradient-text', 'transition-all'],
    );
  });

  test('accepts explicit transitions and dynamic minimum height', async () => {
    const source = '<main className="min-h-[100dvh] transition-transform">Hello</main>';
    const findings = await scanSource('src/page.tsx', source, '/project');
    assert.deepEqual(findings, []);
  });

  test('flags Space Grotesk font declarations and loaders', async () => {
    const source = `
      import { Space_Grotesk } from 'next/font/google';
      const body = { fontFamily: 'Space Grotesk, sans-serif' };
    `;

    const findings = await scanSource('src/page.tsx', source, '/project');
    assert.equal(findings.length, 2);
    assert.ok(findings.every((result) => result.rule === 'space-grotesk'));
  });
});

describe('local image validation', () => {
  test('reports only missing local images', async () => {
    const projectRoot = await mkdtemp(path.join(os.tmpdir(), 'ipw-lint-'));
    await mkdir(path.join(projectRoot, 'src'), { recursive: true });
    await mkdir(path.join(projectRoot, 'public'), { recursive: true });
    await writeFile(path.join(projectRoot, 'src', 'existing.png'), 'image');
    await writeFile(path.join(projectRoot, 'public', 'logo.svg'), '<svg/>');
    await writeFile(
      path.join(projectRoot, 'src', 'page.html'),
      '<img src="./existing.png"><img src="/logo.svg"><img src="./missing.png"><img src="https://example.com/photo.jpg">',
    );

    const findings = await lintTargets(['src'], projectRoot);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].rule, 'missing-local-image');
    assert.match(findings[0].message, /missing\.png/);
  });
});
