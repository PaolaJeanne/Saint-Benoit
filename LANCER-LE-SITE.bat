@echo off
title Paroisse Saint-Benoit - Serveur
color 0A

echo.
echo  ============================================
echo   Paroisse Saint-Benoit - Demarrage serveur
echo  ============================================
echo.

:: Aller dans le dossier backend
cd /d "%~dp0backend"

:: Verifier que node est installe
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERREUR] Node.js n'est pas installe.
    echo  Telechargez-le sur https://nodejs.org
    pause
    exit /b 1
)

:: Verifier que node_modules existe
if not exist "node_modules" (
    echo  Installation des dependances...
    npm install
    echo.
)

echo  Serveur en cours de demarrage...
echo.
echo  Le site s'ouvrira dans votre navigateur dans 3 secondes.
echo  Pour arreter le serveur : fermez cette fenetre.
echo.

:: Attendre 3 secondes puis ouvrir le navigateur
start "" timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"

:: Lancer le serveur
node server.js

pause
