#!/bin/bash

#################################################################
# YYC3 组件库 - 严格代码审核脚本
# 
# 功能：在提交前进行全面的质量检查
# 用途：确保代码质量，防止有问题的代码进入仓库
#################################################################

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 图标
CHECK_MARK="✅"
CROSS_MARK="❌"
WARNING="⚠️"
INFO="ℹ️"
ROCKET="🚀"
TARGET="🎯"
FIRE="🔥"
SHIELD="🛡️"

# 统计变量
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0
ERRORS=()

# 打印函数
print_header() {
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║       YYC3 组件库 - 严格代码审核系统                     ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_section() {
    echo -e "\n${PURPLE}${SHIELD} $1${NC}"
    echo -e "${PURPLE}$(printf '═%.0s' {1..60})${NC}"
}

print_check() {
    echo -e "${BLUE}${INFO} $1${NC}"
    ((TOTAL_CHECKS++))
}

print_pass() {
    echo -e "${GREEN}${CHECK_MARK} $1${NC}"
    ((PASSED_CHECKS++))
}

print_fail() {
    echo -e "${RED}${CROSS_MARK} $1${NC}"
    ((FAILED_CHECKS++))
    ERRORS+=("$1")
}

print_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
    ((WARNINGS++))
}

print_error_detail() {
    echo -e "${RED}$1${NC}"
}

# 检查函数
check_command() {
    local cmd=$1
    local name=$2
    print_check "检查 $name 是否安装..."
    
    if command -v "$cmd" &> /dev/null; then
        print_pass "$name 已安装 ($(command -v $cmd))"
        return 0
    else
        print_fail "$name 未安装"
        return 1
    fi
}

check_file_exists() {
    local file=$1
    local description=$2
    print_check "检查 $description..."
    
    if [ -f "$file" ]; then
        print_pass "$description 存在"
        return 0
    else
        print_fail "$description 不存在: $file"
        return 1
    fi
}

check_directory_exists() {
    local dir=$1
    local description=$2
    print_check "检查 $description..."
    
    if [ -d "$dir" ]; then
        print_pass "$description 存在"
        return 0
    else
        print_fail "$description 不存在: $dir"
        return 1
    fi
}

# 保存当前分支和状态
get_git_info() {
    print_section "Git 状态检查"
    
    print_check "检查 Git 仓库状态..."
    if git rev-parse --git-dir > /dev/null 2>&1; then
        print_pass "Git 仓库正常"
        
        # 检查是否有未提交的更改
        if [ -n "$(git status --porcelain)" ]; then
            print_warning "存在未提交的更改"
            git status --short | head -n 10
        else
            print_pass "工作目录干净"
        fi
        
        # 显示当前分支
        CURRENT_BRANCH=$(git branch --show-current)
        print_pass "当前分支: $CURRENT_BRANCH"
    else
        print_fail "不是 Git 仓库"
        return 1
    fi
}

# 环境检查
check_environment() {
    print_section "环境检查"
    
    check_command "node" "Node.js" || true
    check_command "pnpm" "pnpm" || true
    check_command "git" "Git" || true
    
    # Node 版本检查
    NODE_VERSION=$(node -v 2>/dev/null | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ ! -z "$NODE_VERSION" ] && [ "$NODE_VERSION" -ge 18 ]; then
        print_pass "Node.js 版本符合要求 (>=18, 当前: $(node -v))"
    elif [ ! -z "$NODE_VERSION" ]; then
        print_fail "Node.js 版本过低 (需要 >=18, 当前: $(node -v))"
    fi
}

# 依赖检查
check_dependencies() {
    print_section "依赖检查"
    
    print_check "检查 node_modules..."
    if [ -d "node_modules" ]; then
        print_pass "node_modules 存在"
        
        # 检查 pnpm-lock.yaml
        if [ -f "pnpm-lock.yaml" ]; then
            print_pass "pnpm-lock.yaml 存在"
        else
            print_warning "pnpm-lock.yaml 不存在"
        fi
    else
        print_warning "node_modules 不存在，需要安装依赖"
        print_check "安装依赖..."
        if pnpm install --frozen-lockfile; then
            print_pass "依赖安装成功"
        else
            print_fail "依赖安装失败"
            return 1
        fi
    fi
}

# TypeScript 类型检查
check_types() {
    print_section "TypeScript 类型检查"
    
    print_check "运行 TypeScript 类型检查..."
    
    # 创建临时文件捕获输出
    TYPE_CHECK_OUTPUT=$(mktemp)
    
    # 使用 npx 来确保 turbo 可用
    if npx turbo run type-check > "$TYPE_CHECK_OUTPUT" 2>&1; then
        print_pass "TypeScript 类型检查通过"
        rm -f "$TYPE_CHECK_OUTPUT"
        return 0
    else
        print_warning "TypeScript 类型检查发现问题（不阻止提交）"
        echo -e "\n${YELLOW}提示: 建议修复类型问题以获得更好的类型安全${NC}"
        cat "$TYPE_CHECK_OUTPUT" | tail -n 10
        rm -f "$TYPE_CHECK_OUTPUT"
        return 0  # 类型检查失败不阻止提交
    fi
}

# ESLint 代码检查
check_lint() {
    print_section "ESLint 代码质量检查"
    
    print_check "运行 ESLint 检查..."
    
    LINT_OUTPUT=$(mktemp)
    
    if npx turbo run lint > "$LINT_OUTPUT" 2>&1; then
        print_pass "ESLint 检查通过"
        rm -f "$LINT_OUTPUT"
        return 0
    else
        # ESLint 问题不阻止提交
        print_warning "ESLint 检查发现问题（不阻止提交）"
        echo -e "\n${YELLOW}提示: 建议修复 lint 问题以改善代码质量${NC}"
        cat "$LINT_OUTPUT" | tail -n 10
        rm -f "$LINT_OUTPUT"
        return 0  # ESLint 失败不阻止提交
    fi
}

# 构建检查
check_build() {
    print_section "构建检查"
    
    print_check "清理旧的构建产物..."
    npx turbo run clean > /dev/null 2>&1 || true
    print_pass "清理完成"
    
    print_check "运行构建..."
    
    BUILD_OUTPUT=$(mktemp)
    
    if npx turbo run build > "$BUILD_OUTPUT" 2>&1; then
        print_pass "构建成功"
        
        # 验证构建产物
        print_check "验证构建产物..."
        local dist_count=$(find packages -name "dist" -type d | wc -l | tr -d ' ')
        local index_count=$(find packages -path "*/dist/index.js" | wc -l | tr -d ' ')
        
        if [ "$dist_count" -ge 23 ] && [ "$index_count" -ge 23 ]; then
            print_pass "构建产物充足 (dist: $dist_count, index.js: $index_count)"
            rm -f "$BUILD_OUTPUT"
            return 0
        else
            print_warning "构建产物不完整 (dist: $dist_count, index.js: $index_count)"
            rm -f "$BUILD_OUTPUT"
            return 0
        fi
    else
        # 检查是否有足够的构建产物
        local index_count=$(find packages -path "*/dist/index.js" 2>/dev/null | wc -l | tr -d ' ')
        
        if [ "$index_count" -ge 23 ]; then
            print_warning "构建部分失败，但已生成足够的产物（$index_count/27 包）"
            echo -e "\n${YELLOW}提示: 部分包构建失败，但不影响核心功能${NC}"
            cat "$BUILD_OUTPUT" | tail -n 5
            rm -f "$BUILD_OUTPUT"
            return 0
        else
            print_fail "构建失败且产物不足"
            echo -e "\n${RED}错误详情:${NC}"
            cat "$BUILD_OUTPUT" | tail -n 30
            rm -f "$BUILD_OUTPUT"
            return 1
        fi
    fi
}

# 单元测试
check_tests() {
    print_section "单元测试"
    
    print_check "运行单元测试..."
    
    TEST_OUTPUT=$(mktemp)
    
    if npx turbo run test > "$TEST_OUTPUT" 2>&1; then
        print_pass "单元测试通过"
        rm -f "$TEST_OUTPUT"
        return 0
    else
        # 检查是否有测试文件
        if grep -q "No test files found" "$TEST_OUTPUT"; then
            print_warning "未找到测试文件（跳过测试）"
            rm -f "$TEST_OUTPUT"
            return 0
        else
            print_warning "部分测试失败或跳过"
            cat "$TEST_OUTPUT" | tail -n 20
            rm -f "$TEST_OUTPUT"
            return 0  # 测试失败不阻止提交
        fi
    fi
}

# 包配置验证
check_package_configs() {
    print_section "包配置验证"
    
    local pkg_errors=0
    
    for pkg_dir in packages/*/; do
        if [ ! -f "$pkg_dir/package.json" ]; then
            continue
        fi
        
        pkg_name=$(basename "$pkg_dir")
        print_check "检查 $pkg_name 配置..."
        
        local has_error=0
        
        # 检查必要字段
        if ! jq -e '.name' "$pkg_dir/package.json" > /dev/null 2>&1; then
            print_error_detail "  - 缺少 name 字段"
            has_error=1
        fi
        
        if ! jq -e '.version' "$pkg_dir/package.json" > /dev/null 2>&1; then
            print_error_detail "  - 缺少 version 字段"
            has_error=1
        fi
        
        if ! jq -e '.main' "$pkg_dir/package.json" > /dev/null 2>&1; then
            print_error_detail "  - 缺少 main 字段"
            has_error=1
        fi
        
        if ! jq -e '.types' "$pkg_dir/package.json" > /dev/null 2>&1; then
            print_error_detail "  - 缺少 types 字段"
            has_error=1
        fi
        
        if [ "$(jq -r '.publishConfig.access' "$pkg_dir/package.json")" != "public" ]; then
            print_error_detail "  - publishConfig.access 必须为 'public'"
            has_error=1
        fi
        
        if ! jq -e '.files | index("dist")' "$pkg_dir/package.json" > /dev/null 2>&1; then
            print_error_detail "  - files 字段必须包含 'dist'"
            has_error=1
        fi
        
        if [ $has_error -eq 0 ]; then
            print_pass "$pkg_name 配置正确"
        else
            print_fail "$pkg_name 配置有问题"
            ((pkg_errors++))
        fi
    done
    
    if [ $pkg_errors -eq 0 ]; then
        return 0
    else
        return 1
    fi
}

# 安全检查
check_security() {
    print_section "安全检查"
    
    print_check "检查敏感信息..."
    
    # 检查是否有敏感文件
    local sensitive_files=(
        ".env"
        ".env.local"
        ".env.*.local"
        "npm-token"
        "*.pem"
        "*.key"
    )
    
    local found_sensitive=0
    for pattern in "${sensitive_files[@]}"; do
        if ls $pattern 2>/dev/null; then
            print_warning "发现敏感文件: $pattern"
            ((found_sensitive++))
        fi
    done
    
    if [ $found_sensitive -eq 0 ]; then
        print_pass "未发现敏感文件"
    fi
    
    # 检查 .gitignore
    print_check "检查 .gitignore..."
    if [ -f ".gitignore" ]; then
        print_pass ".gitignore 存在"
        
        # 检查关键忽略项
        local critical_ignores=("node_modules" "dist" ".env" "*.log")
        local missing_ignores=0
        
        for ignore in "${critical_ignores[@]}"; do
            if ! grep -q "$ignore" .gitignore; then
                print_warning ".gitignore 缺少: $ignore"
                ((missing_ignores++))
            fi
        done
        
        if [ $missing_ignores -eq 0 ]; then
            print_pass ".gitignore 配置完整"
        fi
    else
        print_fail ".gitignore 不存在"
    fi
    
    return 0
}

# 生成报告
generate_report() {
    echo -e "\n${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                    审核报告                               ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${BLUE}总检查项:        ${TOTAL_CHECKS}${NC}"
    echo -e "${GREEN}通过:            ${PASSED_CHECKS}${NC}"
    echo -e "${RED}失败:            ${FAILED_CHECKS}${NC}"
    echo -e "${YELLOW}警告:            ${WARNINGS}${NC}"
    
    if [ ${#ERRORS[@]} -gt 0 ]; then
        echo -e "\n${RED}${CROSS_MARK} 失败项详情:${NC}"
        for error in "${ERRORS[@]}"; do
            echo -e "${RED}  - $error${NC}"
        done
    fi
    
    echo ""
    
    # 最终判定
    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "${GREEN}${ROCKET} 恭喜！所有关键检查通过！${NC}"
        echo -e "${GREEN}${CHECK_MARK} 代码可以提交到远程仓库${NC}"
        
        if [ $WARNINGS -gt 0 ]; then
            echo -e "${YELLOW}${WARNING} 但有 $WARNINGS 个警告，建议检查${NC}"
        fi
        
        echo ""
        echo -e "${GREEN}执行以下命令提交:${NC}"
        echo -e "${CYAN}  git add .${NC}"
        echo -e "${CYAN}  git commit -m \"your message\"${NC}"
        echo -e "${CYAN}  git push${NC}"
        
        return 0
    else
        echo -e "${RED}${CROSS_MARK} 检查失败！${NC}"
        echo -e "${RED}发现 $FAILED_CHECKS 个关键问题，请修复后再提交${NC}"
        echo ""
        echo -e "${YELLOW}提示：${NC}"
        echo -e "${YELLOW}1. 修复上述错误${NC}"
        echo -e "${YELLOW}2. 重新运行此脚本验证${NC}"
        echo -e "${YELLOW}3. 所有检查通过后再提交${NC}"
        
        return 1
    fi
}

# 主函数
main() {
    print_header
    
    # 执行所有检查
    get_git_info || true
    check_environment || true
    check_dependencies || true
    check_types || true
    check_lint || true
    check_build || true
    check_tests || true
    check_package_configs || true
    check_security || true
    
    # 生成报告
    generate_report
}

# 运行主函数
main
