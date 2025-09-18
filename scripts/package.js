// 打包脚本：将 dist 目录打包为 ZIP 文件
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = path.resolve(process.cwd());
const distDir = path.join(root, 'dist');
const releaseDir = path.join(root, 'release');
const outputFile = path.join(releaseDir, 'mixui-removebg-plugin.zip');

async function createZip() {
  try {
    // 检查 dist 目录是否存在
    if (!fs.existsSync(distDir)) {
      console.error('❌ dist/ 目录不存在，请先运行 npm run build');
      process.exit(1);
    }

    // 检查必要文件是否存在
    const requiredFiles = [
      'frontend.js',
      'backend.js', 
      'background-removal.runtime.js',
      'plugin.json',
      'schema.json',
      'icon.svg'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(distDir, file);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ 缺少必要文件: ${file}`);
        process.exit(1);
      }
    }

    // 确保 release 目录存在
    if (!fs.existsSync(releaseDir)) {
      fs.mkdirSync(releaseDir, { recursive: true });
      console.log('📁 创建 release 目录');
    }

    console.log('📦 开始打包插件...');

    // 使用 PowerShell 的 Compress-Archive 命令创建 ZIP
    const command = `powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${outputFile}' -Force"`;
    
    execSync(command, { stdio: 'inherit' });

    // 检查 ZIP 文件是否创建成功
    if (fs.existsSync(outputFile)) {
      const stats = fs.statSync(outputFile);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`✅ 插件打包成功！`);
      console.log(`📁 输出文件: ${outputFile}`);
      console.log(`📊 文件大小: ${sizeKB} KB`);
      console.log(`\n🚀 现在可以将 release/mixui-removebg-plugin.zip 上传到 Flowcraft 中使用了！`);
    } else {
      console.error('❌ ZIP 文件创建失败');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 打包过程中出现错误:', error.message);
    process.exit(1);
  }
}

createZip();
