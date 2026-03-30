#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagesDir = path.join(__dirname, '..', 'packages');

// 标准的仓库信息
const repositoryInfo = {
  homepage: 'https://github.com/YYC-Cube/yyc3-components#readme',
  repository: {
    type: 'git',
    url: 'https://github.com/YYC-Cube/yyc3-components.git',
  },
  bugs: {
    url: 'https://github.com/YYC-Cube/yyc3-components/issues',
  },
};

// 需要修复的包列表（基于检查报告）
const packageFolders = fs.readdirSync(packagesDir).filter(name => {
  const pkgPath = path.join(packagesDir, name, 'package.json');
  return fs.existsSync(pkgPath);
});

console.log(`\n🔍 发现 ${packageFolders.length} 个包需要检查\n`);

let fixedCount = 0;
let errorCount = 0;

packageFolders.forEach(folderName => {
  const pkgPath = path.join(packagesDir, folderName, 'package.json');
  
  try {
    const pkgContent = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgContent);
    let modified = false;
    
    console.log(`\n📦 检查 ${pkg.name}`);
    
    // 1. 修复 publishConfig
    if (!pkg.publishConfig || pkg.publishConfig.access !== 'public') {
      pkg.publishConfig = { access: 'public' };
      modified = true;
      console.log('  ✅ 添加 publishConfig.access: "public"');
    }
    
    // 2. 修复 files 字段
    if (!pkg.files) {
      pkg.files = ['dist', 'README.md'];
      modified = true;
      console.log('  ✅ 添加 files 字段');
    } else if (!pkg.files.includes('README.md')) {
      pkg.files.push('README.md');
      modified = true;
      console.log('  ✅ 在 files 中添加 "README.md"');
    }
    
    // 3. 修复 repository 信息
    if (!pkg.repository) {
      pkg.homepage = repositoryInfo.homepage;
      pkg.repository = { ...repositoryInfo.repository, directory: `packages/${folderName}` };
      pkg.bugs = repositoryInfo.bugs;
      modified = true;
      console.log('  ✅ 添加 repository, bugs, homepage 字段');
    } else if (!pkg.repository.directory) {
      pkg.repository.directory = `packages/${folderName}`;
      modified = true;
      console.log('  ✅ 添加 repository.directory');
    }
    
    // 4. 确保有 author 字段
    if (!pkg.author) {
      pkg.author = 'YYC3 Team <admin@0379.email>';
      modified = true;
      console.log('  ✅ 添加 author 字段');
    }
    
    // 保存修改
    if (modified) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
      console.log(`  💾 已保存 ${pkg.name} 的修改`);
      fixedCount++;
    } else {
      console.log('  ✓ 配置完整，无需修改');
    }
    
  } catch (error) {
    console.error(`  ❌ 处理 ${folderName} 时出错:`, error.message);
    errorCount++;
  }
});

console.log(`\n\n📊 修复统计:`);
console.log(`   ✅ 成功修复: ${fixedCount} 个包`);
console.log(`   ❌ 失败: ${errorCount} 个包`);
console.log(`   📦 总计: ${packageFolders.length} 个包\n`);

process.exit(errorCount > 0 ? 1 : 0);
