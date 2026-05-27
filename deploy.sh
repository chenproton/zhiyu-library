#!/bin/bash
#
# deploy.sh - Next.js Standalone 部署脚本 (v5.1 智能全自动清扫版)
#
set -euo pipefail

# ==================== 配置区 ====================
REMOTE_HOST="${REMOTE_HOST:-111.170.170.202}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_BASE="${REMOTE_BASE:-/var/www}"

# 每个项目修改这里即可
SITE_NAME="evaluation" 
PORT=3005

SSH_PORT="${SSH_PORT:-22}"

# ==================== 自动推导 ====================
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REMOTE_DIR="$REMOTE_BASE/$SITE_NAME"
STANDALONE_DIR="$SCRIPT_DIR/.next/standalone"
STATIC_DIR="$SCRIPT_DIR/.next/static"
PUBLIC_DIR="$SCRIPT_DIR/public"

# 标注数据备份配置
ANNOTATION_DATA_FILE="data/annotations.json"
PRD_ANNOTATION_DATA_FILE="data/prd-annotations-overrides.json"
REMOTE_DATA_PATH="$REMOTE_DIR/$ANNOTATION_DATA_FILE"
REMOTE_PRD_DATA_PATH="$REMOTE_DIR/$PRD_ANNOTATION_DATA_FILE"
BACKUP_PATH="/tmp/annotations-backup-${SITE_NAME}.json"
PRD_BACKUP_PATH="/tmp/prd-annotations-backup-${SITE_NAME}.json"
HISTORY_BACKUP_DIR="/var/backups/annotation-systems/${SITE_NAME}"
ANNOTATIONS_HISTORY="$HISTORY_BACKUP_DIR/annotations"
PRD_HISTORY="$HISTORY_BACKUP_DIR/prd-annotations"
CRON_CMD="0 * * * * mkdir -p $ANNOTATIONS_HISTORY $PRD_HISTORY && [ -f $REMOTE_DATA_PATH ] && cp $REMOTE_DATA_PATH $ANNOTATIONS_HISTORY/annotations-\$(date +\%Y\%m\%d-\%H\%M\%S).json; [ -f $REMOTE_PRD_DATA_PATH ] && cp $REMOTE_PRD_DATA_PATH $PRD_HISTORY/prd-annotations-\$(date +\%Y\%m\%d-\%H\%M\%S).json"

SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -p $SSH_PORT"

# ==================== 主入口 ====================

echo ""
echo "🚀 启动智能部署: [$SITE_NAME]"
echo ""

cd "$SCRIPT_DIR"

# ── 0. 备份远程标注数据 ──────────────────────────────────────────────
echo "[0/4] 备份远程标注数据..."
ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" "bash -s" << EOF
  set -e

  # 临时备份（部署恢复用）
  rm -f $BACKUP_PATH $PRD_BACKUP_PATH
  if [ -f $REMOTE_DATA_PATH ]; then
    cp $REMOTE_DATA_PATH $BACKUP_PATH && echo '已备份系统一标注数据'
  else
    echo '系统一无标注数据，跳过备份'
  fi
  if [ -f $REMOTE_PRD_DATA_PATH ]; then
    cp $REMOTE_PRD_DATA_PATH $PRD_BACKUP_PATH && echo '已备份系统二 PRD 标注数据'
  else
    echo '系统二无 PRD 标注数据，跳过备份'
  fi

  # 历史备份（永久保留，带时间戳）
  ANNOTATIONS_HISTORY="$HISTORY_BACKUP_DIR/annotations"
  PRD_HISTORY="$HISTORY_BACKUP_DIR/prd-annotations"
  mkdir -p "$ANNOTATIONS_HISTORY" "$PRD_HISTORY"

  if [ -f $REMOTE_DATA_PATH ]; then
    cp $REMOTE_DATA_PATH "$ANNOTATIONS_HISTORY/annotations-\$(date +%Y%m%d-%H%M%S).json"
    echo "已保存系统一历史备份到 $ANNOTATIONS_HISTORY"
  fi
  if [ -f $REMOTE_PRD_DATA_PATH ]; then
    cp $REMOTE_PRD_DATA_PATH "$PRD_HISTORY/prd-annotations-\$(date +%Y%m%d-%H%M%S).json"
    echo "已保存系统二历史备份到 $PRD_HISTORY"
  fi

  # 设置每小时自动备份（永久保留，不自动删除旧备份）
  # 清理旧配置，确保不重复添加
  (crontab -l 2>/dev/null | grep -v 'annotation-systems/${SITE_NAME}' | grep -v '${SITE_NAME}/data/annotations.json' || true; echo "$CRON_CMD") | crontab -
  echo '已设置每小时自动备份（永久保留在项目外 /var/backups/annotation-systems/${SITE_NAME}）'
EOF

sleep 3

# ── 1. 本地构建 ──────────────────────────────────────────────────────
echo "[1/3] 本地构建中..."
rm -rf "$STANDALONE_DIR"

# 编译
pnpm install
pnpm build

# 组装产物
rsync -a --delete --exclude='*.map' "$STATIC_DIR/" "$STANDALONE_DIR/.next/static/"
if [ -d "$PUBLIC_DIR" ]; then
  rsync -a --delete --exclude='*.map' "$PUBLIC_DIR/" "$STANDALONE_DIR/public/"
fi

echo "✅ 本地构建完成"

# ── 2. 远程智能清扫与同步 ──────────────────────────────────────────
echo ""
echo "[2/3] 远程清扫与同步..."

# 【优化点】智能识别并清理远程所有干扰目录 (dist, .next, standalone)
# 这样无论子模块叫什么名字，rsync 都不再会报 cannot delete 错误
ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" \
  "mkdir -p $REMOTE_DIR && find $REMOTE_DIR -maxdepth 3 \( -name 'dist' -o -name '.next' -o -name 'standalone' \) -exec rm -rf {} + || true"

sleep 5

# 执行增量同步
rsync -az --delete-after \
  -e "ssh $SSH_OPTS" \
  --timeout=300 \
  --exclude='*.map' \
  --exclude='*.log' \
  --exclude='logs/' \
  --exclude='data/' \
  "$STANDALONE_DIR/" \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

sleep 3

# ── 3. 恢复远程标注数据（必须在 PM2 重启前恢复，否则新进程会读到空文件）
echo ""
echo "[3/4] 恢复远程标注数据..."
ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" "bash -s" << EOF
  if [ -f $BACKUP_PATH ]; then
    mkdir -p $REMOTE_DIR/data
    cp $BACKUP_PATH $REMOTE_DATA_PATH
    echo '已恢复系统一标注数据'
  else
    echo '无系统一备份，跳过恢复'
  fi
  if [ -f $PRD_BACKUP_PATH ]; then
    mkdir -p $REMOTE_DIR/data
    cp $PRD_BACKUP_PATH $REMOTE_PRD_DATA_PATH
    echo '已恢复系统二 PRD 标注数据'
  else
    echo '无系统二备份，跳过恢复'
  fi
EOF

sleep 3

# ── 4. 服务器进程切换 ──────────────────────────────────────────────
echo ""
echo "[4/4] 重启 PM2 服务..."

ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" \
  "export SITE_NAME='$SITE_NAME'; export PORT='$PORT'; export REMOTE_DIR='$REMOTE_DIR'; bash -s" << 'REMOTE_EOF'
  set -e
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

  # 彻底删除旧进程防止残留
  pm2 delete "$SITE_NAME" &>/dev/null || true

  cd "$REMOTE_DIR"
  NODE_BIN=$(which node)
  
  # 启动新进程
  PORT="$PORT" HOSTNAME="0.0.0.0" pm2 start server.js \
    --name "$SITE_NAME" \
    --interpreter "$NODE_BIN" \
    --restart-delay 3000

  pm2 save > /dev/null
REMOTE_EOF

echo ""
echo "✨ [$SITE_NAME] 部署任务圆满完成！"
echo "   访问地址: http://$REMOTE_HOST:$PORT"
echo ""