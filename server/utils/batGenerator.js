// Generate block_games.bat content
function generateBlockBat(data, version) {
    const websites = data.websites;
    const programs = data.programs;

    // Get unique process names
    const processNames = [...new Set(programs.map(p => p.processName))];

    let bat = `@echo off
:: ===================================
:: Game Blocker Script ${version}
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

title Game Blocker - Blocking Mode ${version}
color 0C
echo.
echo ========================================
echo        GAME BLOCKER - BLOCK MODE
echo             Version: ${version}
echo ========================================
echo.

echo [INFO] Running with Administrator privileges...
echo.

:: ===================================
:: BLOCK GAMING WEBSITES
:: ===================================
echo [STEP 1] Blocking gaming websites...

set HOSTS=%SystemRoot%\\System32\\drivers\\etc\\hosts

:: Backup hosts file
copy "%HOSTS%" "%HOSTS%.backup" >nul 2>&1

:: Add gaming websites to hosts file (redirect to localhost)
echo. >> "%HOSTS%"
echo # ====== GAME BLOCKER ${version} - START ====== >> "%HOSTS%"

`;

    // Add website blocks
    websites.forEach(w => {
        bat += `echo 127.0.0.1 ${w.url} >> "%HOSTS%"\r\n`;
    });

    bat += `
echo # ====== GAME BLOCKER ${version} - END ====== >> "%HOSTS%"

echo [OK] Gaming websites blocked!
echo.

:: ===================================
:: BLOCK GAMING PROGRAMS
:: ===================================
echo [STEP 2] Blocking gaming programs...

:: Kill running game processes
`;

    // Add taskkill commands
    processNames.forEach(proc => {
        bat += `taskkill /F /IM ${proc} >nul 2>&1\r\n`;
    });

    bat += `
echo [OK] Gaming processes terminated!
echo.

:: Block gaming programs using Windows Firewall
echo [STEP 3] Creating firewall rules...

:: Remove old rules first (if exist)
`;

    // Add firewall delete commands
    programs.forEach(p => {
        bat += `netsh advfirewall firewall delete rule name="Block ${p.name}" >nul 2>&1\r\n`;
    });

    bat += `\n:: Add firewall rules to block gaming programs\r\n`;

    // Add firewall add commands
    programs.forEach(p => {
        if (p.path.includes('*')) {
            // Handle wildcard paths (like Roblox)
            const basePath = p.path.split('*')[0];
            bat += `if exist "${basePath}" (\r\n`;
            bat += `    for /d %%i in ("${basePath}*") do (\r\n`;
            bat += `        if exist "%%i\\${p.processName}" (\r\n`;
            bat += `            netsh advfirewall firewall add rule name="Block ${p.name}" dir=out action=block program="%%i\\${p.processName}" >nul 2>&1\r\n`;
            bat += `        )\r\n`;
            bat += `    )\r\n`;
            bat += `)\r\n`;
        } else {
            bat += `if exist "${p.path}" (\r\n`;
            bat += `    netsh advfirewall firewall add rule name="Block ${p.name}" dir=out action=block program="${p.path}" >nul 2>&1\r\n`;
            bat += `)\r\n`;
        }
    });

    bat += `
echo [OK] Firewall rules created!
echo.

:: Flush DNS cache
echo [STEP 4] Flushing DNS cache...
ipconfig /flushdns >nul 2>&1
echo [OK] DNS cache flushed!
echo.

echo ========================================
echo      GAME BLOCKING COMPLETED!
echo             Version: ${version}
echo ========================================
echo.
echo Gaming websites and programs are now blocked.
echo To unblock, run "unblock_games_${version}.bat"
echo.
timeout /t 2 /nobreak >nul
exit
`;

    return bat;
}

// Generate unblock_games.bat content
function generateUnblockBat(data, version) {
    const websites = data.websites;
    const programs = data.programs;

    // Get unique domains for filtering
    const uniqueDomains = [...new Set(websites.map(w => {
        const parts = w.url.split('.');
        return parts.length >= 2 ? parts.slice(-2).join('.') : w.url;
    }))];

    let bat = `@echo off
:: ===================================
:: Game Unblocker Script ${version}
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

title Game Blocker - Unblock Mode ${version}
color 0A
echo.
echo ========================================
echo       GAME BLOCKER - UNBLOCK MODE
echo             Version: ${version}
echo ========================================
echo.

echo [INFO] Running with Administrator privileges...
echo.

:: ===================================
:: UNBLOCK GAMING WEBSITES
:: ===================================
echo [STEP 1] Unblocking gaming websites...

set HOSTS=%SystemRoot%\\System32\\drivers\\etc\\hosts
set TEMP_HOSTS=%TEMP%\\hosts_temp

:: Remove game blocker entries from hosts file
findstr /v "GAME BLOCKER" "%HOSTS%" > "%TEMP_HOSTS%" 2>nul
`;

    // Add findstr commands for each unique domain
    uniqueDomains.forEach(domain => {
        bat += `findstr /v "${domain}" "%TEMP_HOSTS%" > "%HOSTS%" 2>nul\r\n`;
        bat += `copy "%HOSTS%" "%TEMP_HOSTS%" >nul 2>&1\r\n`;
    });

    bat += `
del "%TEMP_HOSTS%" >nul 2>&1

echo [OK] Gaming websites unblocked!
echo.

:: ===================================
:: UNBLOCK GAMING PROGRAMS (Remove Firewall Rules)
:: ===================================
echo [STEP 2] Removing firewall rules...

`;

    // Add firewall delete commands
    programs.forEach(p => {
        bat += `netsh advfirewall firewall delete rule name="Block ${p.name}" >nul 2>&1\r\n`;
    });

    bat += `
echo [OK] Firewall rules removed!
echo.

:: Flush DNS cache
echo [STEP 3] Flushing DNS cache...
ipconfig /flushdns >nul 2>&1
echo [OK] DNS cache flushed!
echo.

echo ========================================
echo     GAME UNBLOCKING COMPLETED!
echo             Version: ${version}
echo ========================================
echo.
echo All gaming websites and programs are now unblocked.
echo.
timeout /t 2 /nobreak >nul
exit
`;

    return bat;
}

module.exports = {
    generateBlockBat,
    generateUnblockBat
};
