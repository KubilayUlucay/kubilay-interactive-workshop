import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const requireReactPlugin = createRequire(import.meta.resolve('@vitejs/plugin-react'));
const requireVite = createRequire(import.meta.resolve('vite'));
const babel = requireReactPlugin('@babel/core');
const postcss = requireVite('postcss');

export function verifyPortfolioUi(root) {
  const about = readFileSync(join(root, 'src/AboutPage.jsx'), 'utf8');
  const styles = postcss.parse(readFileSync(join(root, 'src/exhibits.css'), 'utf8'));
  const base = postcss.parse(readFileSync(join(root, 'src/index.css'), 'utf8'));
  const tree = babel.parseSync(about, { babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] } });
  let sparkleCount = 0;
  let rendersSparkles = false;
  let hasPauseControl = false;
  babel.traverse(tree, {
    VariableDeclarator(nodePath) {
      const { id, init } = nodePath.node;
      if (id.name === 'employerSparkles' && init?.type === 'ArrayExpression') sparkleCount = init.elements.length;
    },
    CallExpression(nodePath) {
      const { callee } = nodePath.node;
      if (callee.type === 'MemberExpression' && callee.object.name === 'employerSparkles' && callee.property.name === 'map') rendersSparkles = true;
    },
    JSXOpeningElement(nodePath) {
      if (nodePath.node.name.name !== 'button') return;
      const attributes = nodePath.node.attributes;
      if (attributes.some(attribute => attribute.name?.name === 'className' && attribute.value?.value === 'home-sparkle-toggle') && attributes.some(attribute => attribute.name?.name === 'aria-pressed')) hasPauseControl = true;
    }
  });
  assert.equal(sparkleCount, 24, 'Accenture must retain the approved 24 sparks; merge changes instead of restoring an older homepage.');
  assert.ok(rendersSparkles && hasPauseControl, 'Accenture sparks must render with an accessible pause/resume control.');

  const tokens = new Map();
  base.walkRules(':root', rule => rule.walkDecls(declaration => tokens.set(declaration.prop, declaration.value)));
  for (const [name, value] of Object.entries({ '--page-background': '#141518', '--panel-background': '#1b1f25', '--foreground': '#f0f3f7', '--copper': '#a2cadc' })) {
    assert.equal(tokens.get(name), value, `Approved Ink/ice token changed: ${name}. Update this check only for an owner-approved palette change.`);
  }
  assert.equal(tokens.get('color-scheme'), 'dark', 'Ink/ice must retain dark native controls.');

  let loopsWithMotionPreference = false;
  let canPause = false;
  let hasAnimation = false;
  styles.walkRules(rule => {
    if (rule.selector === '.portfolio-root[data-motion="full"] .home-employer-sparkle') {
      const respectsPreference = rule.parent.type === 'atrule' && rule.parent.name === 'media' && /prefers-reduced-motion\s*:\s*no-preference/.test(rule.parent.params);
      rule.walkDecls('animation', declaration => {
        if (respectsPreference && /\bemployer-sparkle\b/.test(declaration.value) && /\binfinite\b/.test(declaration.value)) loopsWithMotionPreference = true;
      });
    }
    if (rule.selector.includes('[data-sparkles="paused"]')) rule.walkDecls('animation-play-state', declaration => { if (declaration.value === 'paused') canPause = true; });
  });
  styles.walkAtRules('keyframes', rule => { if (rule.params === 'employer-sparkle') hasAnimation = true; });
  assert.ok(loopsWithMotionPreference && canPause && hasAnimation, 'Accenture must loop continuously, support pause, and respect reduced motion.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyPortfolioUi(fileURLToPath(new URL('../', import.meta.url)));
  console.log('Approved portfolio UI verified: Ink/ice, 24 continuous Accenture sparks, pause and reduced-motion support.');
}