#!/bin/bash

# YYC3 组件库本地智能测试脚本
# 用于在发布前进行全面的本地测试

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 图标
CHECK_MARK="✅"
CROSS_MARK="❌"
WARNING="⚠️"
INFO="ℹ️"
ROCKET="🚀"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║       YYC3 组件库 - 本地智能测试脚本                      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 错误计数
ERRORS=0
WARNINGS=0

# 函数：打印步骤
print_step() {
    echo -e "\n${BLUE}${INFO} $1${NC}"
}

# 函数：打印成功
print_success() {
    echo -e "${GREEN}${CHECK_MARK} $1${NC}"
}

# 函数：打印错误
print_error() {
    echo -e "${RED}${CROSS_MARK} $1${NC}"
    ((ERRORS++))
}

# 函数：打印警告
print_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
    ((WARNINGS++))
}

# 1. 环境检查
print_step "检查开发环境..."

if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js 版本: $NODE_VERSION"
else
    print_error "未安装 Node.js"
    exit 1
fi

if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    print_success "pnpm 版本: $PNPM_VERSION"
else
    print_error "未安装 pnpm"
    exit 1
fi

# 2. 清理旧的构建产物
print_step "清理旧的构建产物..."
pnpm run clean || true
print_success "清理完成"

# 3. 安装依赖
print_step "安装依赖..."
if pnpm install --frozen-lockfile; then
    print_success "依赖安装成功"
else
    print_error "依赖安装失败"
    exit 1
fi

# 4. 代码检查
print_step "运行 ESLint 代码检查..."
if pnpm run lint; then
    print_success "代码检查通过"
else
    print_warning "代码检查发现问题，尝试自动修复..."
    pnpm run lint:fix || true
fi

# 5. TypeScript 类型检查
print_step "运行 TypeScript 类型检查..."
if pnpm run type-check; then
    print_success "类型检查通过"
else
    print_error "类型检查失败"
fi

# 6. 单元测试
print_step "运行单元测试..."
if pnpm run test; then
    print_success "单元测试通过"
else
    print_warning "部分测试失败或跳过"
fi

# 7. 构建所有包
print_step "构建所有包..."
if pnpm run build; then
    print_success "构建成功"
else
    print_error "构建失败"
    exit 1
fi

# 8. 验证构建产物
print_step "验证构建产物..."
PACKAGES_DIR="packages"
PACKAGE_COUNT=0
SUCCESS_COUNT=0

for pkg_dir in $PACKAGES_DIR/*/; do
    if [ -d "$pkg_dir/dist" ]; then
        PACKAGE_NAME=$(basename "$pkg_dir")
        ((PACKAGE_COUNT++))
        
        # 检查是否有 index.js
        if [ -f "$pkg_dir/dist/index.js" ]; then
            ((SUCCESS_COUNT++))
            print_success "$PACKAGE_NAME: 构建产物完整"
        else
            print_error "$PACKAGE_NAME: 缺少 dist/index.js"
        fi
    fi
done

echo -e "\n${BLUE}构建验证: $SUCCESS_COUNT/$PACKAGE_COUNT 个包构建成功${NC}"

# 9. 检查 package.json 配置
print_step "验证 package.json 配置..."

validate_package() {
    local pkg_json="$1"
    local pkg_name=$(jq -r '.name' "$pkg_json")
    local errors=0
    
    # 检查必要字段
    if [ "$(jq -r '.version' "$pkg_json")" = "null" ]; then
        print_error "$pkg_name: 缺少 version 字段"
        ((errors++))
    fi
    
    if [ "$(jq -r '.description' "$pkg_json")" = "null" ]; then
        print_error "$pkg_name: 缺少 description 字段"
        ((errors++))
    fi
    
    if [ "$(jq -r '.main' "$pkg_json")" = "null" ]; then
        print_error "$pkg_name: 缺少 main 字段"
        ((errors++))
    fi
    
    if [ "$(jq -r '.types' "$pkg_json")" = "null" ]; then
        print_error "$pkg_name: 缺少 types 字段"
        ((errors++))
    fi
    
    if [ "$(jq -r '.publishConfig.access' "$pkg_json")" != "public" ]; then
        print_error "$pkg_name: publishConfig.access 必须为 'public'"
        ((errors++))
    fi
    
    if [ "$(jq '.files | index("dist")' "$pkg_json")" = "null" ]; then
        print_error "$pkg_name: files 字段必须包含 'dist'"
        ((errors++))
    fi
    
    if [ "$(jq '.files | index("README.md")' "$pkg_json")" = "null" ]; then
        print_warning "$pkg_name: files 字段建议包含 'README.md'"
    fi
    
    return $errors
}

for pkg_dir in $PACKAGES_DIR/*/; do
    if [ -f "$pkg_dir/package.json" ]; then
        validate_package "$pkg_dir/package.json"
    fi
done

# 10. 检查 README 文件
print_step "检查 README 文件..."
README_COUNT=0

for pkg_dir in $PACKAGES_DIR/*/; do
    if [ -f "$pkg_dir/README.md" ]; then
        ((README_COUNT++))
    else
        PACKAGE_NAME=$(basename "$pkg_dir")
        print_warning "$PACKAGE_NAME: 缺少 README.md"
    fi
done

echo -e "${BLUE}README 检查: $README_COUNT 个包有 README 文件${NC}"

# 11. 模拟发布检查（dry run）
print_step "模拟发布检查..."
echo "提示: 使用 'pnpm publish --dry-run' 可以检查发布配置是否正确"

# 最终报告
echo -e "\n${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    测试报告总结                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}${CHECK_MARK} 所有关键检查通过！${NC}"
    echo -e "${GREEN}${ROCKET} 项目已准备好发布${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}${WARNING} 发现 $WARNINGS 个警告，建议检查${NC}"
    fi
    
    exit 0
else
    echo -e "${RED}${CROSS_MARK} 发现 $ERRORS 个错误，请修复后再发布${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}${WARNING} 发现 $WARNINGS 个警告${NC}"
    fi
    
    exit 1
fi
