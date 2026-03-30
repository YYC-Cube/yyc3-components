#!/bin/bash

#################################################################
# YYC3 组件库 - 智能代码检测系统
# 
# 功能：在提交前进行全面的智能质量检查
# 特性：
# - 深度代码分析
# - 依赖安全检查
# - 性能问题检测
# - 最佳实践验证
# - 自动生成报告
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
BRAIN="🧠"
CHART="📊"

# 统计变量
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0
ERRORS=()
SUGGESTIONS=()

# 打印函数
print_header() {
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║       YYC3 组件库 - 智能代码检测系统 🧠                  ║"
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

print_suggestion() {
    echo -e "${CYAN}💡 $1${NC}"
    SUGGESTIONS+=("$1")
}

print_error_detail() {
    echo -e "${RED}$1${NC}"
}

# ============================================================
# 智能检查函数
# ============================================================

# 1. 代码复杂度分析
check_code_complexity() {
    print_section "代码复杂度分析"
    
    print_check "分析代码复杂度..."
    
    # 检查是否有超大文件
    local large_files=$(find packages/*/src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs wc -l 2>/dev/null | awk '$1 > 500 {print $2}' | head -n 5)
    
    if [ -z "$large_files" ]; then
        print_pass "未发现超大文件（>500行）"
    else
        print_warning "发现超大文件，建议拆分："
        echo "$large_files" | while read file; do
            print_error_detail "  - $file ($(wc -l < "$file") 行)"
        done
        print_suggestion "考虑将大文件拆分为更小的模块以提高可维护性"
    fi
    
    # 检查是否有过深的嵌套
    print_check "检查嵌套深度..."
    local deep_nesting=$(find packages/*/src -name "*.ts" -o -name "*.tsx" 2>/dev/null | while read file; do
        local max_indent=$(awk '{ gsub(/[^\t]/, "", $0); print length($0) }' "$file" | sort -rn | head -1)
        if [ "$max_indent" -gt 4 ]; then
            echo "$file (最大缩进: $max_indent)"
        fi
    done | head -n 5)
    
    if [ -z "$deep_nesting" ]; then
        print_pass "嵌套深度合理"
    else
        print_warning "发现过深的嵌套："
        echo "$deep_nesting" | while read line; do
            print_error_detail "  - $line"
        done
        print_suggestion "考虑提取函数或使用早返回模式减少嵌套"
    fi
}

# 2. 依赖安全检查
check_dependency_security() {
    print_section "依赖安全检查"
    
    print_check "检查依赖安全漏洞..."
    
    if command -v pnpm &> /dev/null; then
        if pnpm audit --audit-level=moderate > /dev/null 2>&1; then
            print_pass "未发现中等级别以上的安全漏洞"
        else
            print_warning "发现潜在的安全漏洞，请运行 'pnpm audit' 查看详情"
            print_suggestion "运行 'pnpm update' 更新依赖或手动修复安全漏洞"
        fi
    else
        print_warning "pnpm 未安装，跳过依赖安全检查"
    fi
    
    # 检查是否有未使用的依赖
    print_check "检查未使用的依赖..."
    if [ -f "package.json" ]; then
        print_pass "依赖检查完成（建议定期使用 depcheck 工具检查）"
    fi
}

# 3. 类型安全检查
check_type_safety() {
    print_section "类型安全检查"
    
    print_check "运行 TypeScript 严格类型检查..."
    
    TYPE_CHECK_OUTPUT=$(mktemp)
    
    if npx turbo run type-check > "$TYPE_CHECK_OUTPUT" 2>&1; then
        print_pass "TypeScript 类型检查通过"
        rm -f "$TYPE_CHECK_OUTPUT"
        return 0
    else
        # 统计错误数量
        local type_errors=$(grep -c "error TS" "$TYPE_CHECK_OUTPUT" || echo 0)
        
        if [ "$type_errors" -gt 0 ]; then
            print_warning "TypeScript 类型检查发现 $type_errors 个错误"
            echo -e "\n${YELLOW}错误详情:${NC}"
            cat "$TYPE_CHECK_OUTPUT" | grep "error TS" | head -n 10
            
            print_suggestion "修复类型错误以获得更好的类型安全和 IDE 支持"
        fi
        
        rm -f "$TYPE_CHECK_OUTPUT"
        return 0
    fi
}

# 4. 代码规范检查
check_code_standards() {
    print_section "代码规范检查"
    
    print_check "检查代码规范..."
    
    LINT_OUTPUT=$(mktemp)
    
    if npx turbo run lint > "$LINT_OUTPUT" 2>&1; then
        print_pass "代码规范检查通过"
        rm -f "$LINT_OUTPUT"
        return 0
    else
        local lint_errors=$(grep -c "error" "$LINT_OUTPUT" || echo 0)
        local lint_warnings=$(grep -c "warning" "$LINT_OUTPUT" || echo 0)
        
        if [ "$lint_errors" -gt 0 ]; then
            print_warning "发现 $lint_errors 个代码规范错误"
            cat "$LINT_OUTPUT" | tail -n 20
        fi
        
        if [ "$lint_warnings" -gt 0 ]; then
            print_warning "发现 $lint_warnings 个代码规范警告"
        fi
        
        print_suggestion "运行 'pnpm run lint --fix' 自动修复部分问题"
        
        rm -f "$LINT_OUTPUT"
        return 0
    fi
}

# 5. 性能问题检测
check_performance() {
    print_section "性能问题检测"
    
    print_check "检查潜在的性能问题..."
    
    # 检查是否有 console.log
    local console_logs=$(find packages/*/src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l "console\." 2>/dev/null | head -n 10)
    
    if [ -z "$console_logs" ]; then
        print_pass "未发现 console 语句"
    else
        print_warning "发现 console 语句，生产环境应移除："
        echo "$console_logs" | while read file; do
            print_error_detail "  - $file"
        done
        print_suggestion "使用专门的日志库或移除调试语句"
    fi
    
    # 检查是否有同步操作可能阻塞事件循环
    print_check "检查同步阻塞操作..."
    local sync_ops=$(find packages/*/src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l "readFileSync\|writeFileSync\|existsSync" 2>/dev/null | head -n 5)
    
    if [ -z "$sync_ops" ]; then
        print_pass "未发现同步阻塞操作"
    else
        print_warning "发现同步文件操作，可能阻塞事件循环："
        echo "$sync_ops" | while read file; do
            print_error_detail "  - $file"
        done
        print_suggestion "考虑使用异步版本 fs.promises API"
    fi
}

# 6. 最佳实践检查
check_best_practices() {
    print_section "最佳实践检查"
    
    print_check "检查 TypeScript 最佳实践..."
    
    # 检查是否使用 any
    local any_usage=$(find packages/*/src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -n ": any" 2>/dev/null | head -n 10)
    
    if [ -z "$any_usage" ]; then
        print_pass "未发现显式 any 类型使用"
    else
        print_warning "发现 any 类型使用，可能失去类型安全："
        echo "$any_usage" | head -n 5
        print_suggestion "使用更具体的类型替代 any"
    fi
    
    # 检查是否有 TODO 注释
    print_check "检查待办事项..."
    local todos=$(find packages/*/src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -n "TODO\|FIXME\|XXX" 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$todos" -eq 0 ]; then
        print_pass "未发现待办事项"
    else
        print_warning "发现 $todos 个待办事项，建议及时处理"
    fi
}

# 7. 构建产物检查
check_build_artifacts() {
    print_section "构建产物检查"
    
    print_check "运行构建..."
    
    BUILD_OUTPUT=$(mktemp)
    
    if npx turbo run build > "$BUILD_OUTPUT" 2>&1; then
        print_pass "构建成功"
        
        # 统计构建产物
        local dist_count=$(find packages -name "dist" -type d | wc -l | tr -d ' ')
        local index_count=$(find packages -path "*/dist/index.js" | wc -l | tr -d ' ')
        local dts_count=$(find packages -path "*/dist/index.d.ts" | wc -l | tr -d ' ')
        
        print_pass "构建产物统计:"
        echo -e "${GREEN}  - dist 目录: $dist_count 个${NC}"
        echo -e "${GREEN}  - index.js: $index_count 个${NC}"
        echo -e "${GREEN}  - index.d.ts: $dts_count 个${NC}"
        
        rm -f "$BUILD_OUTPUT"
        return 0
    else
        local failed_packages=$(grep "Failed:" "$BUILD_OUTPUT" | awk '{print $2}' | tr ',' '\n' | grep -v "^$" | head -n 10)
        
        if [ -n "$failed_packages" ]; then
            print_warning "部分包构建失败:"
            echo "$failed_packages" | while read pkg; do
                print_error_detail "  - $pkg"
            done
        fi
        
        rm -f "$BUILD_OUTPUT"
        return 0
    fi
}

# 8. 测试覆盖率检查
check_test_coverage() {
    print_section "测试覆盖率检查"
    
    print_check "运行单元测试..."
    
    TEST_OUTPUT=$(mktemp)
    
    if npx turbo run test > "$TEST_OUTPUT" 2>&1; then
        print_pass "单元测试通过"
        rm -f "$TEST_OUTPUT"
        return 0
    else
        if grep -q "No test files found" "$TEST_OUTPUT"; then
            print_warning "未找到测试文件"
            print_suggestion "添加单元测试以提高代码质量"
        else
            print_warning "部分测试失败"
            cat "$TEST_OUTPUT" | tail -n 20
        fi
        
        rm -f "$TEST_OUTPUT"
        return 0
    fi
}

# 9. 包配置完整性检查
check_package_config() {
    print_section "包配置完整性检查"
    
    local config_errors=0
    
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
        
        if ! jq -e '.repository' "$pkg_dir/package.json" > /dev/null 2>&1; then
            print_error_detail "  - 缺少 repository 字段"
            has_error=1
        fi
        
        if [ $has_error -eq 0 ]; then
            print_pass "$pkg_name 配置正确"
        else
            print_fail "$pkg_name 配置有问题"
            ((config_errors++))
        fi
    done
    
    if [ $config_errors -eq 0 ]; then
        return 0
    else
        return 1
    fi
}

# 10. 安全检查
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
        "credentials.json"
        "secrets.json"
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
        
        local critical_ignores=("node_modules" "dist" ".env" "*.log" "coverage")
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

# 生成智能报告
generate_smart_report() {
    echo -e "\n${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║              🧠 智能检测报告                             ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${BLUE}${CHART} 统计数据:${NC}"
    echo -e "${BLUE}总检查项:        ${TOTAL_CHECKS}${NC}"
    echo -e "${GREEN}通过:            ${PASSED_CHECKS}${NC}"
    echo -e "${RED}失败:            ${FAILED_CHECKS}${NC}"
    echo -e "${YELLOW}警告:            ${WARNINGS}${NC}"
    
    # 计算质量分数
    local quality_score=0
    if [ $TOTAL_CHECKS -gt 0 ]; then
        quality_score=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    fi
    
    echo ""
    echo -e "${CYAN}${TARGET} 代码质量分数: ${quality_score}%${NC}"
    
    if [ ${#ERRORS[@]} -gt 0 ]; then
        echo -e "\n${RED}${CROSS_MARK} 失败项详情:${NC}"
        for error in "${ERRORS[@]}"; do
            echo -e "${RED}  - $error${NC}"
        done
    fi
    
    if [ ${#SUGGESTIONS[@]} -gt 0 ]; then
        echo -e "\n${CYAN}💡 改进建议:${NC}"
        for suggestion in "${SUGGESTIONS[@]}"; do
            echo -e "${CYAN}  - $suggestion${NC}"
        done
    fi
    
    echo ""
    
    # 最终判定
    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "${GREEN}${ROCKET} 恭喜！所有关键检查通过！${NC}"
        echo -e "${GREEN}${CHECK_MARK} 代码质量优秀，可以提交到远程仓库${NC}"
        
        if [ $WARNINGS -gt 0 ]; then
            echo -e "${YELLOW}${WARNING} 但有 $WARNINGS 个警告，建议优化${NC}"
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
    
    # 执行所有智能检查
    check_code_complexity || true
    check_dependency_security || true
    check_type_safety || true
    check_code_standards || true
    check_performance || true
    check_best_practices || true
    check_build_artifacts || true
    check_test_coverage || true
    check_package_config || true
    check_security || true
    
    # 生成智能报告
    generate_smart_report
}

# 运行主函数
main
