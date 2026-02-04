@echo off
:: ===================================
:: Game Blocker Script v1.1.7
:: Block gaming websites and programs
:: Auto-elevates to Administrator!
:: ===================================

:: ===================================
:: AUTO-ELEVATE TO ADMINISTRATOR
:: ===================================
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process -Verb RunAs -FilePath '%~f0'"
    exit /b
)

title Game Blocker - Blocking Mode v1.1.7
color 0C
echo.
echo ========================================
echo        GAME BLOCKER - BLOCK MODE
echo             Version: v1.1.7
echo ========================================
echo.

echo [INFO] Running with Administrator privileges...
echo.

:: ===================================
:: BLOCK GAMING WEBSITES
:: ===================================
echo [STEP 1] Blocking gaming websites...

set HOSTS=%SystemRoot%\System32\drivers\etc\hosts

:: Backup hosts file
copy "%HOSTS%" "%HOSTS%.backup" >nul 2>&1

:: Add gaming websites to hosts file (redirect to localhost)
echo. >> "%HOSTS%"
echo # ====== GAME BLOCKER v1.1.7 - START ====== >> "%HOSTS%"

echo 127.0.0.1 friv.com >> "%HOSTS%"
echo 127.0.0.1 www.friv.com >> "%HOSTS%"
echo 127.0.0.1 friv.net >> "%HOSTS%"
echo 127.0.0.1 www.friv.net >> "%HOSTS%"
echo 127.0.0.1 y8.com >> "%HOSTS%"
echo 127.0.0.1 www.y8.com >> "%HOSTS%"
echo 127.0.0.1 poki.com >> "%HOSTS%"
echo 127.0.0.1 www.poki.com >> "%HOSTS%"
echo 127.0.0.1 crazygames.com >> "%HOSTS%"
echo 127.0.0.1 www.crazygames.com >> "%HOSTS%"
echo 127.0.0.1 kongregate.com >> "%HOSTS%"
echo 127.0.0.1 www.kongregate.com >> "%HOSTS%"
echo 127.0.0.1 miniclip.com >> "%HOSTS%"
echo 127.0.0.1 www.miniclip.com >> "%HOSTS%"
echo 127.0.0.1 armorgames.com >> "%HOSTS%"
echo 127.0.0.1 www.armorgames.com >> "%HOSTS%"
echo 127.0.0.1 newgrounds.com >> "%HOSTS%"
echo 127.0.0.1 www.newgrounds.com >> "%HOSTS%"
echo 127.0.0.1 slither.io >> "%HOSTS%"
echo 127.0.0.1 agar.io >> "%HOSTS%"
echo 127.0.0.1 krunker.io >> "%HOSTS%"
echo 127.0.0.1 diep.io >> "%HOSTS%"
echo 127.0.0.1 store.steampowered.com >> "%HOSTS%"
echo 127.0.0.1 steampowered.com >> "%HOSTS%"
echo 127.0.0.1 steamcommunity.com >> "%HOSTS%"
echo 127.0.0.1 epicgames.com >> "%HOSTS%"
echo 127.0.0.1 www.epicgames.com >> "%HOSTS%"
echo 127.0.0.1 store.epicgames.com >> "%HOSTS%"
echo 127.0.0.1 th.y8.com >> "%HOSTS%"
echo 127.0.0.1 gemini.google.com/app >> "%HOSTS%"
echo 127.0.0.1 gemini.google.com >> "%HOSTS%"

echo # ====== GAME BLOCKER v1.1.7 - END ====== >> "%HOSTS%"

echo [OK] Gaming websites blocked!
echo.

:: ===================================
:: BLOCK GAMING PROGRAMS
:: ===================================
echo [STEP 2] Blocking gaming programs...

:: Kill running game processes
taskkill /F /IM RobloxPlayerBeta.exe >nul 2>&1
taskkill /F /IM RobloxPlayerLauncher.exe >nul 2>&1
taskkill /F /IM steam.exe >nul 2>&1
taskkill /F /IM EpicGamesLauncher.exe >nul 2>&1
taskkill /F /IM Origin.exe >nul 2>&1
taskkill /F /IM EADesktop.exe >nul 2>&1
taskkill /F /IM Battle.net.exe >nul 2>&1

echo [OK] Gaming processes terminated!
echo.

:: Block gaming programs using Windows Firewall
echo [STEP 3] Creating firewall rules...

:: Remove old rules first (if exist)
netsh advfirewall firewall delete rule name="Block Roblox Player" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Roblox Launcher" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Steam" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Epic Games Launcher (32-bit)" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Epic Games Launcher (64-bit)" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Origin" >nul 2>&1
netsh advfirewall firewall delete rule name="Block EA Desktop" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Battle.net" >nul 2>&1

:: Add firewall rules to block gaming programs
if exist "%LOCALAPPDATA%\Roblox\Versions\" (
    for /d %%i in ("%LOCALAPPDATA%\Roblox\Versions\*") do (
        if exist "%%i\RobloxPlayerBeta.exe" (
            netsh advfirewall firewall add rule name="Block Roblox Player" dir=out action=block program="%%i\RobloxPlayerBeta.exe" >nul 2>&1
        )
    )
)
if exist "%LOCALAPPDATA%\Roblox\Versions\" (
    for /d %%i in ("%LOCALAPPDATA%\Roblox\Versions\*") do (
        if exist "%%i\RobloxPlayerLauncher.exe" (
            netsh advfirewall firewall add rule name="Block Roblox Launcher" dir=out action=block program="%%i\RobloxPlayerLauncher.exe" >nul 2>&1
        )
    )
)
if exist "%ProgramFiles(x86)%\Steam\steam.exe" (
    netsh advfirewall firewall add rule name="Block Steam" dir=out action=block program="%ProgramFiles(x86)%\Steam\steam.exe" >nul 2>&1
)
if exist "%ProgramFiles(x86)%\Epic Games\Launcher\Portal\Binaries\Win32\EpicGamesLauncher.exe" (
    netsh advfirewall firewall add rule name="Block Epic Games Launcher (32-bit)" dir=out action=block program="%ProgramFiles(x86)%\Epic Games\Launcher\Portal\Binaries\Win32\EpicGamesLauncher.exe" >nul 2>&1
)
if exist "%ProgramFiles%\Epic Games\Launcher\Portal\Binaries\Win64\EpicGamesLauncher.exe" (
    netsh advfirewall firewall add rule name="Block Epic Games Launcher (64-bit)" dir=out action=block program="%ProgramFiles%\Epic Games\Launcher\Portal\Binaries\Win64\EpicGamesLauncher.exe" >nul 2>&1
)
if exist "%ProgramFiles%\Origin\Origin.exe" (
    netsh advfirewall firewall add rule name="Block Origin" dir=out action=block program="%ProgramFiles%\Origin\Origin.exe" >nul 2>&1
)
if exist "%ProgramFiles%\EA\EA Desktop\EA Desktop\EADesktop.exe" (
    netsh advfirewall firewall add rule name="Block EA Desktop" dir=out action=block program="%ProgramFiles%\EA\EA Desktop\EA Desktop\EADesktop.exe" >nul 2>&1
)
if exist "%ProgramFiles(x86)%\Battle.net\Battle.net.exe" (
    netsh advfirewall firewall add rule name="Block Battle.net" dir=out action=block program="%ProgramFiles(x86)%\Battle.net\Battle.net.exe" >nul 2>&1
)

echo [OK] Firewall rules created!
echo.

:: Flush DNS cache
echo [STEP 4] Flushing DNS cache...
ipconfig /flushdns >nul 2>&1
echo [OK] DNS cache flushed!
echo.

echo ========================================
echo      GAME BLOCKING COMPLETED!
echo             Version: v1.1.7
echo ========================================
echo.
echo Gaming websites and programs are now blocked.
echo To unblock, run "unblock_games_v1.1.7.bat"
echo.
timeout /t 2 /nobreak >nul
exit
