#!/usr/bin/env node

import { access, readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_EXTENSIONS = new Set([
  '.astro', '.css', '.html', '.js', '.jsx', '.less', '.mjs', '.sass', '.scss',
  '.svelte', '.ts', '.tsx', '.vue',
]);

const IGNORED_DIRECTORIES = new Set([
  '.git', '.next', '.visual-evidence', 'build', 'coverage', 'dist', 'node_modules', 'research',
]);

const RULES = Object.freeze({
  decorativeGrid: 'decorative-grid',
  gradientText: 'gradient-text',
  missingImage: 'missing-local-image',
  spaceGrotesk: 'space-grotesk',
  transitionAll: 'transition-all',
  viewportHeight: 'fixed-viewport-height',
});

function lineNumberAt(source, index) {
  return source.slice(0, index).split('\n').length;
}

function finding(filePath, source, index, rule, message) {
  return {
    file: filePath,
    line: lineNumberAt(source, index),
    rule,
    message,
  };
}

function scanTransitionAll(filePath, source) {
  const declarationPattern = /\btransition(?:-property)?\s*:\s*all\b/g;
  const classPattern = /(?:class|className)\s*=\s*["'`][^"'`]*\btransition-all\b[^"'`]*["'`]/g;
  return [...source.matchAll(declarationPattern), ...source.matchAll(classPattern)].map((match) => finding(
    filePath,
    source,
    match.index,
    RULES.transitionAll,
    'Name the transitioned properties instead of using all.',
  ));
}

function scanSpaceGrotesk(filePath, source) {
  const pattern = /space[\s_-]*grotesk/gi;
  return [...source.matchAll(pattern)].map((match) => finding(
    filePath,
    source,
    match.index,
    RULES.spaceGrotesk,
    'Space Grotesk is forbidden for new work; choose typography from the researched direction.',
  ));
}

function scanViewportHeight(filePath, source) {
  const declarationPattern = /\bheight\s*:\s*100vh\b/g;
  const classPattern = /(?:class|className)\s*=\s*["'`][^"'`]*\bh-screen\b[^"'`]*["'`]/g;
  return [...source.matchAll(declarationPattern), ...source.matchAll(classPattern)].map((match) => finding(
    filePath,
    source,
    match.index,
    RULES.viewportHeight,
    'Use content-led height or a dynamic viewport unit instead of a fixed 100vh surface.',
  ));
}

function scanGradientText(filePath, source) {
  const findings = [];
  const classPattern = /(?:class|className)\s*=\s*["'`][^"'`]*(?:bg-clip-text[^"'`]*(?:bg-gradient|text-transparent)|(?:bg-gradient|text-transparent)[^"'`]*bg-clip-text)[^"'`]*["'`]/g;
  for (const match of source.matchAll(classPattern)) {
    findings.push(finding(
      filePath,
      source,
      match.index,
      RULES.gradientText,
      'Use solid color, weight, or size for text emphasis.',
    ));
  }

  const cssBlockPattern = /[^{}]+\{[^{}]*\}/g;
  for (const match of source.matchAll(cssBlockPattern)) {
    const block = match[0];
    const clipsText = /(?:-webkit-)?background-clip\s*:\s*text\b/.test(block);
    const usesGradient = /background(?:-image)?\s*:[^;}]*(?:linear|radial|conic)-gradient\s*\(/.test(block);
    if (!clipsText || !usesGradient) continue;
    findings.push(finding(
      filePath,
      source,
      match.index,
      RULES.gradientText,
      'Use solid color, weight, or size for text emphasis.',
    ));
  }
  return findings;
}

function scanDecorativeGrid(filePath, source) {
  const findings = [];
  const cssBlockPattern = /[^{}]+\{[^{}]*\}/g;
  for (const match of source.matchAll(cssBlockPattern)) {
    const block = match[0];
    const gradients = block.match(/linear-gradient\s*\(/g) ?? [];
    if (gradients.length < 2 || !/background-size\s*:/.test(block)) continue;
    findings.push(finding(
      filePath,
      source,
      match.index,
      RULES.decorativeGrid,
      'Remove the two-axis grid unless the surface is a real map, canvas, blueprint, or measuring tool.',
    ));
  }
  return findings;
}

async function pathExists(candidate) {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function resolveLocalImage(sourceFile, imageSource, projectRoot) {
  const cleanSource = imageSource.split(/[?#]/, 1)[0];
  if (!cleanSource || /^(?:[a-z]+:|#|\{)/i.test(cleanSource)) return true;

  const candidates = cleanSource.startsWith('/')
    ? [path.join(projectRoot, 'public', cleanSource), path.join(projectRoot, cleanSource)]
    : [path.resolve(projectRoot, path.dirname(sourceFile), cleanSource)];

  for (const candidate of candidates) {
    if (await pathExists(candidate)) return true;
  }
  return false;
}

async function scanMissingImages(filePath, source, projectRoot) {
  const findings = [];
  const imagePattern = /<(?:img|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/g;
  for (const match of source.matchAll(imagePattern)) {
    if (await resolveLocalImage(filePath, match[1], projectRoot)) continue;
    findings.push(finding(
      filePath,
      source,
      match.index,
      RULES.missingImage,
      `Local image does not exist: ${match[1]}`,
    ));
  }
  return findings;
}

export async function scanSource(filePath, source, projectRoot) {
  const mechanicalFindings = [
    ...scanSpaceGrotesk(filePath, source),
    ...scanTransitionAll(filePath, source),
    ...scanViewportHeight(filePath, source),
    ...scanGradientText(filePath, source),
    ...scanDecorativeGrid(filePath, source),
    ...await scanMissingImages(filePath, source, projectRoot),
  ];
  return mechanicalFindings.sort((left, right) => left.line - right.line || left.rule.localeCompare(right.rule));
}

async function collectSourceFiles(targetPath) {
  const targetStat = await stat(targetPath);
  if (targetStat.isFile()) {
    const isTest = /\.(?:spec|test)\.[^.]+$/.test(path.basename(targetPath));
    return SOURCE_EXTENSIONS.has(path.extname(targetPath)) && !isTest ? [targetPath] : [];
  }
  if (!targetStat.isDirectory()) return [];

  const files = [];
  const entries = await readdir(targetPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
    const entryPath = path.join(targetPath, entry.name);
    files.push(...await collectSourceFiles(entryPath));
  }
  return files;
}

export async function lintTargets(targets, projectRoot = process.cwd()) {
  const files = new Set();
  for (const target of targets) {
    for (const file of await collectSourceFiles(path.resolve(projectRoot, target))) files.add(file);
  }

  const findings = [];
  for (const filePath of [...files].sort()) {
    const source = await readFile(filePath, 'utf8');
    const relativePath = path.relative(projectRoot, filePath).split(path.sep).join('/');
    findings.push(...await scanSource(relativePath, source, projectRoot));
  }
  return findings;
}

export async function main(argumentsList = process.argv.slice(2)) {
  const jsonIndex = argumentsList.indexOf('--json');
  const json = jsonIndex !== -1;
  const targets = argumentsList.filter((argument) => argument !== '--json');

  if (targets.length === 0) {
    process.stderr.write('Usage: node scripts/ipw-lint.mjs [--json] <file-or-directory> [...]\n');
    return 2;
  }

  try {
    const findings = await lintTargets(targets);
    if (json) {
      process.stdout.write(`${JSON.stringify({ findings }, null, 2)}\n`);
    } else if (findings.length === 0) {
      process.stdout.write('IPW lint passed.\n');
    } else {
      for (const result of findings) {
        process.stdout.write(`${result.file}:${result.line} [${result.rule}] ${result.message}\n`);
      }
    }
    return findings.length === 0 ? 0 : 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`IPW lint failed. ${message}\n`);
    return 2;
  }
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isCli) process.exitCode = await main();
