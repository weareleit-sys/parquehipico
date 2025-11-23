@echo off
REM Script para iniciar el servidor Express de forma permanente
REM No cierra automáticamente, permite desarrollo continuo

title Parque Hipico - Servidor Express
color 0A

echo.
echo ========================================
echo   PARQUE HIPICO - SERVIDOR EXPRESS
echo ========================================
echo.
echo Iniciando servidor...
echo.

cd /d "%~dp0"

REM Verificar si Node está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado o no está en PATH
    echo Descárgalo desde: https://nodejs.org/
    pause
    exit /b 1
)

REM Iniciar el servidor
echo [OK] Node.js detectado
echo.
echo Servidor corriendo en: http://localhost:3000/
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
echo ========================================
echo.

node server-express.js

REM Si el servidor falla
echo.
echo [ERROR] El servidor se ha detenido inesperadamente
echo Presiona cualquier tecla para cerrar...
pause >nul




