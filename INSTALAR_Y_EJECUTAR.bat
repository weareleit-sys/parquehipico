@echo off
REM Script de instalación automática para Parque Hípico Next.js
REM Creado para instalar todas las dependencias y ejecutar el servidor

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  PARQUE HÍPICO LA MONTAÑA - Instalación Automática             ║
echo ║  Este script instalará TODO lo necesario                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Cambiar a la carpeta del proyecto
cd /d "%~dp0"

echo ✓ Ubicación: %CD%
echo.

REM Verificar si node está instalado
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    echo.
    echo Por favor instala Node.js desde:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

node --version
echo ✓ Node.js encontrado
echo.

REM Verificar si npm está disponible
echo Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️ npm no disponible, intentando con Node Package Manager global...
)

echo.
echo ════════════════════════════════════════════════════════════════
echo PASO 1: Instalando dependencias (esto puede tardar 3-5 minutos)
echo ════════════════════════════════════════════════════════════════
echo.

REM Limpiar instalaciones anteriores
if exist "node_modules" (
    echo Removiendo node_modules antiguo...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo Removiendo package-lock.json antiguo...
    del package-lock.json
)

REM Instalar dependencias
call npm install
if errorlevel 1 (
    echo ❌ Error en npm install
    echo Intenta ejecutar manualmente:
    echo   npm install
    pause
    exit /b 1
)

echo.
echo ✓ Dependencias instaladas correctamente
echo.

echo ════════════════════════════════════════════════════════════════
echo PASO 2: Iniciando servidor de desarrollo
echo ════════════════════════════════════════════════════════════════
echo.
echo 🌐 Tu sitio estará disponible en:
echo    http://localhost:3000
echo.
echo 💡 Tips:
echo    - Presiona Ctrl+C para detener el servidor
echo    - Los cambios se reflejan automáticamente
echo    - Abre tu navegador favorito en http://localhost:3000
echo.
echo ════════════════════════════════════════════════════════════════
echo.

timeout /t 3

REM Ejecutar el servidor
call npm run dev

pause

