#!/bin/bash
#
# deploydemo.sh - 演示环境一键部署脚本
# 将本项目构建后部署到 demo2.zhiyu.com.cn，并把跳转链接中的 IP 替换为演示服务器 IP
#
set -euo pipefail

# ==================== 演示环境配置（可通过环境变量覆盖） ====================
DEMO_HOST="${DEMO_HOST:-demo2.zhiyu.com.cn}"
DEMO_USER="${DEMO_USER:-root}"
DEMO_PASS="${DEMO_PASS:-lEL9cHcBQMjCEqp6}"
OLD_IP="${OLD_IP:-111.170.170.202}"

# ==================== 项目配置（每个项目只需改这里） ====================
SITE_NAME="zhiyu-library"
PORT=3009

# ==================== 自动推导 ====================
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REMOTE_BASE="/var/www"
REMOTE_DIR="$REMOTE_BASE/$SITE_NAME"
STANDALONE_DIR="$SCRIPT_DIR/.next/standalone"
STATIC_DIR="$SCRIPT_DIR/.next/static"
PUBLIC_DIR="$SCRIPT_DIR/public"
SERVER_DIR="$SCRIPT_DIR/.next/server"
SSH_PORT="${SSH_PORT:-22}"

# 演示环境打包目录（放在 /tmp 下，不污染源码和本地构建产物）
DEMO_PKG_DIR="/tmp/${SITE_NAME}-demo-pkg"

# 安全提示
if [ -z "${DEMO_PASS:-}" ]; then
  echo "❌ 错误：未设置 DEMO_PASS 环境变量且脚本默认密码为空"
  exit 1
fi

# 检查 sshpass
if ! command -v sshpass &>/dev/null; then
  echo "❌ 未检测到 sshpass，请先安装："
  echo "   Debian/Ubuntu: sudo apt-get install -y sshpass"
  echo "   macOS:         brew install hudochenkov/sshpass/sshpass"
  exit 1
fi

export SSHPASS="$DEMO_PASS"
SSH_CMD="sshpass -e ssh"
SCP_CMD="sshpass -e scp"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -p $SSH_PORT"

cd "$SCRIPT_DIR"

# ==================== IP 替换函数（只在打包目录中操作） ====================
patch_ip_in_dir() {
  local dir="$1" old="$2" new="$3"
  local old_pattern
  old_pattern=$(sed 's/\./\\./g' <<< "$old")
  echo ">>> 在打包目录中替换 IP ($old -> $new)..."
  while IFS= read -r -d '' f; do
    sed -i "s/$old_pattern/$new/g" "$f"
    echo "  已替换: ${f#$dir/}"
  done < <(grep -rlF --binary-files=without-match "$old" "$dir" 2>/dev/null || true)
}

# ==================== 主流程 ====================
echo ""
echo "🚀 启动演示环境部署: [$SITE_NAME] -> http://$DEMO_HOST:$PORT"
echo ""

echo "[1/5] 清理旧构建..."
rm -rf "$STANDALONE_DIR" "$STATIC_DIR" "$SERVER_DIR" "$DEMO_PKG_DIR"

echo "[2/5] 安装依赖并构建..."
if [ ! -d "node_modules" ] || [ "${FORCE_INSTALL:-0}" = "1" ]; then
  pnpm install --prefer-offline --no-frozen-lockfile
else
  echo "   node_modules 已存在，跳过依赖安装"
fi
pnpm exec next build --webpack

echo "[3/5] 组装 standalone 产物..."
if [ -d "$SERVER_DIR" ]; then
  mkdir -p "$STANDALONE_DIR/.next/server"
  rsync -a --delete --exclude="*.map" "$SERVER_DIR/" "$STANDALONE_DIR/.next/server/"
fi
if [ -d "$STATIC_DIR" ]; then
  mkdir -p "$STANDALONE_DIR/.next/static"
  rsync -a --delete --exclude="*.map" "$STATIC_DIR/" "$STANDALONE_DIR/.next/static/"
fi
if [ -d "$PUBLIC_DIR" ]; then
  mkdir -p "$STANDALONE_DIR/public"
  rsync -a --delete --exclude="*.map" "$PUBLIC_DIR/" "$STANDALONE_DIR/public/"
fi

echo "[4/5] 复制到打包目录并替换 IP..."
rm -rf "$DEMO_PKG_DIR"
cp -a "$STANDALONE_DIR" "$DEMO_PKG_DIR"
patch_ip_in_dir "$DEMO_PKG_DIR" "$OLD_IP" "$DEMO_HOST"
# 同时替换 data 目录中的 IP（如平台链接配置等）
if [ -d "$SCRIPT_DIR/data" ]; then
  mkdir -p "$DEMO_PKG_DIR/data"
  rsync -a "$SCRIPT_DIR/data/" "$DEMO_PKG_DIR/data/"
  patch_ip_in_dir "$DEMO_PKG_DIR/data" "$OLD_IP" "$DEMO_HOST"
fi

echo "[5/5] 上传并部署到演示服务器 $DEMO_HOST..."

$SSH_CMD $SSH_OPTS "$DEMO_USER@$DEMO_HOST" \
  "rm -rf $REMOTE_DIR && mkdir -p $REMOTE_DIR && chown $DEMO_USER:$DEMO_USER $REMOTE_DIR"

rsync -az --delete \
  -e "$SSH_CMD $SSH_OPTS" \
  --timeout=300 \
  --exclude='*.map' \
  --exclude='*.log' \
  --exclude='logs/' \
  "$DEMO_PKG_DIR/" \
  "$DEMO_USER@$DEMO_HOST:$REMOTE_DIR/"

# 清理本地打包目录
rm -rf "$DEMO_PKG_DIR"

$SSH_CMD $SSH_OPTS "$DEMO_USER@$DEMO_HOST" \
  "export SITE_NAME='$SITE_NAME'; export PORT='$PORT'; export REMOTE_DIR='$REMOTE_DIR'; bash -s" << 'REMOTE_EOF'
  set -e
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

  NODE_BIN=$(command -v node || echo "/usr/local/bin/node")
  if [ ! -x "$NODE_BIN" ]; then
    echo "❌ 远程服务器未找到 node，请先安装 Node.js"
    exit 1
  fi

  if ! command -v pm2 &>/dev/null; then
    echo ">>> 远程安装 pm2..."
    "$NODE_BIN" "$(command -v npm || echo '/usr/local/bin/npm')" install -g pm2
  fi

  pm2 delete "$SITE_NAME" &>/dev/null || true

  cd "$REMOTE_DIR"

  PORT="$PORT" HOSTNAME="0.0.0.0" pm2 start server.js \
    --name "$SITE_NAME" \
    --interpreter "$NODE_BIN" \
    --restart-delay 3000

  pm2 save > /dev/null
REMOTE_EOF

$SSH_CMD $SSH_OPTS "$DEMO_USER@$DEMO_HOST" \
  "pm2 restart '$SITE_NAME' --update-env" >/dev/null 2>&1 || true

echo ""
echo "✨ [$SITE_NAME] 演示环境部署完成！"
echo "   访问地址: http://$DEMO_HOST:$PORT"
echo ""
