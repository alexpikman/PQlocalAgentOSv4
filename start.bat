@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo   PQlocalAgentOSv4 - Запуск рабочей среды агентов
echo ============================================================
set "PQ_PORT=8765"
if not exist data mkdir data

python --version >nul 2>&1
if errorlevel 1 (
  echo ОШИБКА: Python 3 не установлен или не добавлен в PATH.
  pause
  exit /b 1
)

where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [Full-Stack] Node.js и npm обнаружены. Запуск PQlocalAgentOSv4 (React 19 + Python Core)...
  echo   - Веб-интерфейс: http://localhost:3000
  echo   - Классический интерфейс: http://localhost:3000/classic
  echo   - API порт: 8765
  call npm run dev
) else (
  echo [Core-Only] Node.js не найден. Запуск ядра Python...
  echo   - URL: http://127.0.0.1:%PQ_PORT%
  python "%CD%\server.py"
)

pause
