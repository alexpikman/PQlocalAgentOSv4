#!/usr/bin/env bash
# ==============================================================================
# PQlocalAgentOSv4 — Универсальный скрипт запуска (Local PC & Remote Server)
# ==============================================================================
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "============================================================"
echo "  🚀 Запуск PQlocalAgentOSv4 (Local AI Agent Operating System)"
echo "============================================================"

# Проверка Python 3
if ! command -v python3 &>/dev/null; then
    echo "❌ Ошибка: Python 3 не найден в системе."
    exit 1
fi

echo "✓ Python: $(python3 --version)"

# Создание data/ если нет
mkdir -p data

# Проверка node & npm для современного интерфейса React
if command -v npm &>/dev/null; then
    echo "✓ Node.js & npm обнаружены. Запуск full-stack режима (React v4 + Python Core)..."
    echo "  - Backend API: http://127.0.0.1:8765"
    echo "  - Modern React Workspace: http://0.0.0.0:3000"
    echo "  - Classic UI: http://0.0.0.0:3000/classic"
    exec npm run dev
else
    echo "ℹ️ Node.js не найден. Запуск автономного Python ядра на порту 8765..."
    echo "  - URL: http://127.0.0.1:8765"
    exec python3 server.py
fi
