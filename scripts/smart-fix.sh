#!/bin/bash

#################################################################
# YYC3 组件库 - 智能修复系统
# 
# 功能：自动修复常见的代码问题
# - 类型错误修复
# - ESLint 问题修复
# - 依赖问题修复
# - 代码格式化
# - 构建错误修复
#################################################################

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

FIXES_APPLIED=0
FIXES_FAILED=0

print_header() {
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║         YYC3 组件库 - 智能修复系统 🔧                    ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_section() {
    echo ""
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}════════════════════════════════════════════════════════════${NC}"
}

fix_eslint_issues() {
    print_section "🧹 修复 ESLint 问题"
    
    echo -e "${BLUE}ℹ️ 运行 ESLint 自动修复...${NC}"
    
    # 修复所有包的 ESLint 问题
    if pnpm run lint --fix 2>&1 | tee /tmp/eslint-fix.log; then
        echo -e "${GREEN}✅ ESLint 问题已修复${NC}"
        ((FIXES_APPLIED++))
    else
        echo -e "${YELLOW}⚠️ 部分 ESLint 问题无法自动修复${NC}"
    fi
}

fix_type_errors() {
    print_section "🔧 修复类型错误"
    
    echo -e "${BLUE}ℹ️ 检查类型错误...${NC}"
    
    # 检查哪些包有类型错误
    for pkg in packages/*; do
        if [ -d "$pkg" ] && [ -f "$pkg/package.json" ]; then
            pkg_name=$(basename "$pkg")
            
            # 检查是否有 @types/react 依赖问题
            if grep -q '"react"' "$pkg/package.json" 2>/dev/null; then
                if ! grep -q '"@types/react"' "$pkg/package.json" 2>/dev/null; then
                    echo -e "${YELLOW}⚠️ $pkg_name 缺少 @types/react 依赖${NC}"
                    echo -e "${BLUE}ℹ️ 正在添加 @types/react...${NC}"
                    cd "$pkg"
                    pnpm add -D @types/react @types/react-dom 2>&1 || true
                    cd - > /dev/null
                    ((FIXES_APPLIED++))
                fi
            fi
            
            # 检查是否缺少 @types/node
            if grep -q "process\|require\|__dirname" "$pkg/src"/*.ts 2>/dev/null; then
                if ! grep -q '"@types/node"' "$pkg/package.json" 2>/dev/null; then
                    echo -e "${YELLOW}⚠️ $pkg_name 使用 Node.js API 但缺少 @types/node${NC}"
                    echo -e "${BLUE}ℹ️ 正在添加 @types/node...${NC}"
                    cd "$pkg"
                    pnpm add -D @types/node 2>&1 || true
                    cd - > /dev/null
                    ((FIXES_APPLIED++))
                fi
            fi
        fi
    done
}

fix_missing_files() {
    print_section "📁 修复缺失文件"
    
    # 检查并创建缺失的 tsconfig.json
    for pkg in packages/*; do
        if [ -d "$pkg" ] && [ -f "$pkg/package.json" ]; then
            if [ ! -f "$pkg/tsconfig.json" ]; then
                pkg_name=$(basename "$pkg")
                echo -e "${YELLOW}⚠️ $pkg_name 缺少 tsconfig.json${NC}"
                echo -e "${BLUE}ℹ️ 正在创建 tsconfig.json...${NC}"
                
                cat > "$pkg/tsconfig.json" << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "__tests__"]
}
EOF
                ((FIXES_APPLIED++))
            fi
        fi
    done
}

fix_import_errors() {
    print_section "📦 修复导入错误"
    
    echo -e "${BLUE}ℹ️ 检查并修复常见导入问题...${NC}"
    
    # 修复相对路径导入问题
    for pkg in packages/*; do
        if [ -d "$pkg/src" ]; then
            # 查找缺失的类型定义文件
            missing_types=$(find "$pkg/src" -name "*.ts" -o -name "*.tsx" 2>/dev/null | \
                xargs grep -l "from '\.\.\/types" 2>/dev/null | \
                head -n 5)
            
            if [ -n "$missing_types" ]; then
                pkg_name=$(basename "$pkg")
                echo -e "${YELLOW}⚠️ $pkg_name 可能存在缺失的类型文件${NC}"
                echo -e "${BLUE}ℹ️ 检查: $missing_types${NC}"
            fi
        fi
    done
}

fix_build_errors() {
    print_section "🏗️ 修复构建错误"
    
    echo -e "${BLUE}ℹ️ 清理构建缓存...${NC}"
    
    # 清理构建产物
    pnpm run clean 2>/dev/null || true
    
    # 清理 turbo 缓存
    rm -rf .turbo node_modules/.cache 2>/dev/null || true
    
    # 重新安装依赖
    echo -e "${BLUE}ℹ️ 重新安装依赖...${NC}"
    pnpm install 2>&1 | grep -E "WARN|ERR|done" || true
    
    echo -e "${GREEN}✅ 构建环境已清理${NC}"
    ((FIXES_APPLIED++))
}

fix_dependencies() {
    print_section "📦 修复依赖问题"
    
    echo -e "${BLUE}ℹ️ 检查依赖一致性...${NC}"
    
    # 运行 pnpm install 确保依赖一致
    if pnpm install --frozen-lockfile 2>&1 | grep -q "WARN"; then
        echo -e "${YELLOW}⚠️ 发现依赖警告，正在修复...${NC}"
        pnpm install 2>&1 | tail -n 20
        ((FIXES_APPLIED++))
    else
        echo -e "${GREEN}✅ 依赖一致${NC}"
    fi
}

fix_formatting() {
    print_section "💅 修复代码格式"
    
    echo -e "${BLUE}ℹ️ 格式化代码...${NC}"
    
    # 检查是否有 prettier
    if command -v prettier &> /dev/null; then
        prettier --write "**/*.{ts,tsx,js,jsx,json,md}" --ignore-path .gitignore 2>&1 || true
        echo -e "${GREEN}✅ 代码已格式化${NC}"
        ((FIXES_APPLIED++))
    else
        echo -e "${YELLOW}⚠️ 未安装 prettier，跳过格式化${NC}"
    fi
}

generate_report() {
    print_section "📊 修复报告"
    
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║              修复统计                                   ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}应用的修复: ${GREEN}$FIXES_APPLIED${NC}"
    echo -e "${BLUE}失败的修复: ${RED}$FIXES_FAILED${NC}"
    echo ""
    
    if [ $FIXES_APPLIED -gt 0 ]; then
        echo -e "${GREEN}✅ 已应用 $FIXES_APPLIED 个修复${NC}"
        echo ""
        echo -e "${YELLOW}💡 建议：运行 'bash scripts/smart-check.sh' 验证修复${NC}"
    else
        echo -e "${GREEN}✅ 未发现需要自动修复的问题${NC}"
    fi
}

# 主函数
main() {
    print_header
    
    # 执行修复
    fix_dependencies
    fix_missing_files
    fix_type_errors
    fix_eslint_issues
    fix_formatting
    fix_import_errors
    fix_build_errors
    
    # 生成报告
    generate_report
    
    # 返回状态
    if [ $FIXES_FAILED -gt 0 ]; then
        exit 1
    fi
    
    exit 0
}

# 运行
main "$@"
