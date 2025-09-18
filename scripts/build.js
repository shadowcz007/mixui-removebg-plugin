// 简单的 esbuild 打包脚本：
// - frontend: 生成 UMD，暴露默认导出到全局 window.RemoveBGNode
// - backend: 生成 IIFE，注入 @imgly/background-removal 到全局 ImglyBackgroundRemoval
// 注意：我们把第三方库一起打包到 backend.runtime.bundle.js 里，并提供全局变量

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd());
const distDir = path.join(root, 'dist');
fs.mkdirSync(distDir, { recursive: true });

async function buildFrontend() {
  // 将组件源码包成 IIFE，同时提供全局变量和模块导出
  await build({
    entryPoints: [path.join(root, 'frontend/nodeComponent.js')],
    outfile: path.join(distDir, 'frontend.js'),
    bundle: true,
    format: 'iife',
    globalName: 'RemoveBGNode',
    platform: 'browser',
    target: ['es2020'],
    minify: true,
    banner: {
      js: '// RemoveBGNode frontend bundle',
    },
    footer: {
      js: `
        // 提供模块导出兼容性
        if (typeof module !== 'undefined' && module.exports) {
          module.exports = { default: RemoveBGNode };
        }
        if (typeof exports !== 'undefined') {
          exports.default = RemoveBGNode;
        }
        // 确保组件函数在全局作用域中可用
        if (typeof globalThis !== 'undefined') {
          globalThis.RemoveBGNode = RemoveBGNode;
        }
      `,
    },
  });
}

async function buildBackgroundRemovalLib() {
  // 将 @imgly/background-removal 打成自包含的 IIFE，挂到全局 ImglyBackgroundRemoval
  const bgRemovalPath = path.resolve('node_modules/@imgly/background-removal/dist/index.mjs');
  await build({
    entryPoints: [bgRemovalPath],
    outfile: path.join(distDir, 'background-removal.runtime.js'),
    bundle: true,
    format: 'iife',
    globalName: 'ImglyBackgroundRemoval',
    platform: 'browser',
    target: ['es2020'],
    minify: true,
  });
}

async function buildBackend() {
  // 将执行器与其依赖一并输出为 IIFE，依赖 runtime 通过全局 ImglyBackgroundRemoval 提供
  await build({
    entryPoints: [path.join(root, 'backend/executor.js')],
    outfile: path.join(distDir, 'backend.js'),
    bundle: true,
    format: 'iife',
    globalName: 'RemoveBGExecutor',
    platform: 'browser',
    target: ['es2020'],
    minify: true,
    banner: { js: '// RemoveBG backend executor' },
    external: [],
  });
}

async function copyPluginFiles() {
  // 复制插件清单文件
  const pluginJson = path.join(root, 'plugin.json');
  const schemaJson = path.join(root, 'schema.json');
  const iconSvg = path.join(root, 'frontend/icon.svg');
  
  fs.copyFileSync(pluginJson, path.join(distDir, 'plugin.json'));
  fs.copyFileSync(schemaJson, path.join(distDir, 'schema.json'));
  fs.copyFileSync(iconSvg, path.join(distDir, 'icon.svg'));
  
  console.log('Plugin files copied to dist/');
}

async function main() {
  await buildFrontend();
  await buildBackgroundRemovalLib();
  await buildBackend();
  await copyPluginFiles();
  console.log('Build completed: dist/ contains all files needed for plugin distribution');
  console.log('Files in dist/:');
  console.log('- frontend.js (frontend component)');
  console.log('- backend.js (backend executor)');
  console.log('- background-removal.runtime.js (background removal library)');
  console.log('- plugin.json (plugin manifest)');
  console.log('- schema.json (parameter schema)');
  console.log('- icon.svg (plugin icon)');
  console.log('\nTo distribute: run "npm run package" to create ZIP file');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


