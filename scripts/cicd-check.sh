#!/bin/bash

#################################################################
# YYC3 组件库 - CI/CD 前置检查
# 
# 功能：在推送到远程前进行完整的 CI/CD 验证
# - 环境检查
# - 依赖验证
# - 构建测试
# - 类型检查
# - 测试运行
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

ERRORS=0
WARNINGS=0

print_header() {
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║         YYC3 组件库 - CI/CD 前置检查 🔍                  ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_section() {
    echo ""
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}════════════════════════════════════════════════════════════${NC}"
}

check_environment() {
    print_section "🌍 环境检查"
    
    # Node.js 版本
    echo -e "${BLUE}ℹ️ 检查 Node.js 版本...${NC}"
    NODE_VERSION=$(node -v 2>/dev/null || echo "未安装")
    if [[ $NODE_VERSION == v20* ]]; then
        echo -e "${GREEN}✅ Node.js $NODE_VERSION (符合要求)${NC}"
    else
        echo -e "${YELLOW}⚠️ Node.js $NODE_VERSION (推荐 v20.x)${NC}"
        ((WARNINGS++))
    fi
    
    # pnpm 版本
    echo -e "${BLUE}ℹ️ 检查 pnpm 版本...${NC}"
    PNPM_VERSION=$(pnpm -v 2>/dev/null || echo "未安装")
    if [[ $PNPM_VERSION == 9* ]]; then
        echo -e "${GREEN}✅ pnpm v$PNPM_VERSION (符合要求)${NC}"
    else
        echo -e "${YELLOW}⚠️ pnpm v$PNPM_VERSION (推荐 v9.x)${NC}"
        ((WARNINGS++))
    fi
    
    # 磁盘空间
    echo -e "${BLUE}ℹ️ 检查磁盘空间...${NC}"
    DISK_AVAIL=$(df -h . | awk 'NR==2 {print $4}')
    echo -e "${GREEN}✅ 可用空间: $DISK_AVAIL${NC}"
}

check_dependencies() {
    print_section "📦 依赖检查"
    
    echo -e "${BLUE}ℹ️ 检查依赖完整性...${NC}"
    
    if [ -f "pnpm-lock.yaml" ]; then
        echo -e "${GREEN}✅ pnpm-lock.yaml 存在${NC}"
        
        # 检查是否需要安装
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}⚠️ node_modules 不存在，正在安装...${NC}"
            pnpm install --frozen-lockfile
        fi
        
        # 验证依赖
        if pnpm install --frozen-lockfile 2>&1 | grep -q "WARN"; then
            echo -e "${YELLOW}⚠️ 依赖有警告${NC}"
            ((WARNINGS++))
        else
            echo -e "${GREEN}✅ 依赖完整${NC}"
        fi
    else
        echo -e "${RED}❌ pnpm-lock.yaml 不存在${NC}"
        ((ERRORS++))
    fi
}

check_build() {
    print_section "🏗️ 构建检查"
    
    echo -e "${BLUE}ℹ️ 运行构建...${NC}"
    
    # 清理旧的构建产物
    echo -e "${CYAN}→ 清理旧构建产物...${NC}"
    pnpm run clean 2>/dev/null || true
    
    # 运行构建
    echo -e "${CYAN}→ 构建所有包...${NC}"
    if pnpm run build 2>&1 | tee /tmp/cicd-build.log | grep -E "error|Error|ERROR|failed|Failed|FAILED"; then
        echo -e "${RED}❌ 构建失败${NC}"
        echo -e "${YELLOW}💡 查看详细日志: cat /tmp/cicd-build.log${NC}"
        ((ERRORS++))
        return 1
    else
        echo -e "${GREEN}✅ 构建成功${NC}"
        
        # 检查构建产物
        DIST_COUNT=$(find packages -name "dist" -type d | wc -l | tr -d ' ')
        echo -e "${GREEN}✅ 生成了 $DIST_COUNT 个构建产物${NC}"
    fi
}

check_types() {
    print_section "🔍 类型检查"
    
    echo -e "${BLUE}ℹ️ 运行 TypeScript 类型检查...${NC}"
    
    if pnpm run type-check 2>&1 | tee /tmp/cicd-types.log | grep -E "error TS"; then
        echo -e "${YELLOW}⚠️ 发现类型错误${NC}"
        echo -e "${YELLOW}💡 查看详细日志: cat /tmp/cicd-types.log${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ 类型检查通过${NC}"
    fi
}

check_lint() {
    print_section "🧹 Lint 检查"
    
    echo -e "${BLUE}ℹ️ 运行 ESLint...${NC}"
    
    if pnpm run lint 2>&1 | tee /tmp/cicd-lint.log | grep -E "error|Error|ERROR|warning|Warning|WARNING" | head -n 20; then
        echo -e "${YELLOW}⚠️ Lint 有问题${NC}"
        echo -e "${YELLOW}💡 运行 'pnpm run lint --fix' 自动修复${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ Lint 检查通过${NC}"
    fi
}

check_tests() {
    print_section "🧪 测试检查"
    
    echo -e "${BLUE}ℹ️ 运行测试...${NC}"
    
    if pnpm run test 2>&1 | tee /tmp/cicd-test.log | tail -n 20; then
        echo -e "${GREEN}✅ 测试通过${NC}"
    else
        echo -e "${YELLOW}⚠️ 部分测试失败${NC}"
        echo -e "${YELLOW}💡 查看详细日志: cat /tmp/cicd-test.log${NC}"
        ((WARNINGS++))
    fi
}

check_package_configs() {
    print_section "📦 包配置检查"
    
    echo -e "${BLUE}ℹ️ 检查所有包的 package.json...${NC}"
    
    local invalid_configs=0
    
    for pkg in packages/*; do
        if [ -d "$pkg" ] && [ -f "$pkg/package.json" ]; then
            pkg_name=$(basename "$pkg")
            
            # 检查必需字段
            if ! jq -e '.name and .version and .main and .types and .exports' "$pkg/package.json" > /dev/null 2>&1; then
                echo -e "${RED}❌ $pkg_name 缺少必需字段${NC}"
                ((invalid_configs++))
            fi
            
            # 检查 tsconfig.json
            if [ ! -f "$pkg/tsconfig.json" ]; then
                echo -e "${YELLOW}⚠️ $pkg_name 缺少 tsconfig.json${NC}"
                ((WARNINGS++))
            fi
        fi
    done
    
    if [ $invalid_configs -eq 0 ]; then
        echo -e "${GREEN}✅ 所有包配置完整${NC}"
    else
        echo -e "${RED}❌ $invalid_configs 个包配置不完整${NC}"
        ((ERRORS++))
    fi
}

check_security() {
    print_section "🔒 安全检查"
    
    echo -e "${BLUE}ℹ️ 检查依赖安全漏洞...${NC}"
    
    if pnpm audit --audit-level=moderate 2>&1 | tee /tmp/cicd-audit.log | grep -q "vulnerabilities"; then
        echo -e "${YELLOW}⚠️ 发现安全漏洞${NC}"
        echo -e "${YELLOW}💡 运行 'pnpm audit' 查看详情${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ 无安全漏洞${NC}"
    fi
    
    # 检查敏感文件
    echo -e "${BLUE}ℹ️ 检查敏感文件...${NC}"
    if find . -name ".env*" -o -name "*.key" -o -name "*.pem" 2>/dev/null | grep -v node_modules | grep -v .git | head -n 5; then
        echo -e "${YELLOW}⚠️ 发现敏感文件，请确保已添加到 .gitignore${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ 未发现敏感文件${NC}"
    fi
}

generate_report() {
    print_section "📊 CI/CD 检查报告"
    
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║              检查统计                                   ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}错误: $ERRORS${NC}"
    echo -e "${YELLOW}警告: $WARNINGS${NC}"
    echo ""
    
    if [ $ERRORS -gt 0 ]; then
        echo -e "${RED}❌ CI/CD 检查失败${NC}"
        echo ""
        echo -e "${YELLOW}💡 修复建议:${NC}"
        echo -e "${YELLOW}   1. 查看上述错误详情${NC}"
        echo -e "${YELLOW}   2. 运行 'bash scripts/smart-fix.sh' 自动修复${NC}"
        echo -e "${YELLOW}   3. 重新运行此脚本验证${NC}"
        return 1
    elif [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️ CI/CD 检查通过，但有 $WARNINGS 个警告${NC}"
        echo ""
        echo -e "${YELLOW}💡 建议修复警告以获得更好的代码质量${NC}"
        return 0
    else
        echo -e "${GREEN}✅ CI/CD 检查完全通过${NC}"
        echo ""
        echo -e "${GREEN}🚀 代码已准备好推送到远程${NC}"
        return 0
    fi
}

# 主函数
main() {
    print_header
    
    # 执行检查
    check_environment
    check_dependencies
    check_package_configs
    check_types
    check_lint
    check_build
    check_tests
    check_security
    
    # 生成报告
    generate_report
}

# 运行
main "$@"
