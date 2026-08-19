@echo off
title Paroisse Saint-Benoit - Admin
color 0B

echo.
echo  ============================================
echo   Paroisse Saint-Benoit - Panneau Admin
echo  ============================================
echo.

cd /d "%~dp0backend"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERREUR] Node.js n'est pas installe.
    echo  Telechargez-le sur https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo  Installation des dependances...
    npm install
    echo.
)

echo  Serveur en cours de demarrage...
echo.
echo  Le panneau admin s'ouvrira dans votre navigateur dans 3 secondes.
echo  Mot de passe par defaut : admin
echo  (Changez-le dans backend/.env)
echo.

start "" timeout /t 3 /nobreak >nul
start "" "http://localhost:3000/admin/"

node server.js

pause
