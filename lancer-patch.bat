@echo off
cd /d "%~dp0"
echo.
echo  === Mon Deen - Patch et Deploy ===
echo.
node patch.cjs
echo.
pause
