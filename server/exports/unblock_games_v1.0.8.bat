@echo off
:: ===================================
:: Game Unblocker Script v1.0.8
:: Remove blocks on gaming websites and programs
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

title Game Blocker - Unblock Mode v1.0.8
color 0A
echo.
echo ========================================
echo       GAME BLOCKER - UNBLOCK MODE
echo             Version: v1.0.8
echo ========================================
echo.

echo [INFO] Running with Administrator privileges...
echo.

:: ===================================
:: UNBLOCK GAMING WEBSITES
:: ===================================
echo [STEP 1] Unblocking gaming websites...

set HOSTS=%SystemRoot%\System32\drivers\etc\hosts
set TEMP_HOSTS=%TEMP%\hosts_temp

:: Remove game blocker entries from hosts file
findstr /v "GAME BLOCKER" "%HOSTS%" > "%TEMP_HOSTS%" 2>nul
findstr /v "friv.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "friv.net" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "y8.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "poki.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "crazygames.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "kongregate.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "miniclip.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "armorgames.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "newgrounds.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "slither.io" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "agar.io" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "krunker.io" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "diep.io" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "steampowered.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "steamcommunity.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1
findstr /v "epicgames.com" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul
copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1

del "%TEMP_HOSTS%" >nul 2>&1

echo [OK] Gaming websites unblocked!
echo.

:: ===================================
:: UNBLOCK GAMING PROGRAMS (Remove Firewall Rules)
:: ===================================
echo [STEP 2] Removing firewall rules...

netsh advfirewall firewall delete rule name="Block Roblox Player" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Roblox Launcher" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Steam" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Epic Games Launcher (32-bit)" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Epic Games Launcher (64-bit)" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Origin" >nul 2>&1
netsh advfirewall firewall delete rule name="Block EA Desktop" >nul 2>&1
netsh advfirewall firewall delete rule name="Block Battle.net" >nul 2>&1

echo [OK] Firewall rules removed!
echo.

:: Flush DNS cache
echo [STEP 3] Flushing DNS cache...
ipconfig /flushdns >nul 2>&1
echo [OK] DNS cache flushed!
echo.

echo ========================================
echo     GAME UNBLOCKING COMPLETED!
echo             Version: v1.0.8
echo ========================================
echo.
echo All gaming websites and programs are now unblocked.
echo.
timeout /t 5 /nobreak >nul
exit
