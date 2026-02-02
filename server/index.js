const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'blocklist.json');
const EXPORTS_DIR = path.join(__dirname, 'exports');

// Ensure exports directory exists
if (!fs.existsSync(EXPORTS_DIR)) {
  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

// Helper: Read data
function readData() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Helper: Write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Helper: Get next ID
function getNextId(items) {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// ===== API ROUTES =====

// GET /api/blocklist - Get all data
app.get('/api/blocklist', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST /api/websites - Add website
app.post('/api/websites', (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const data = readData();
    const newWebsite = {
      id: getNextId(data.websites),
      url: url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
    };
    data.websites.push(newWebsite);
    writeData(data);

    res.json(newWebsite);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add website' });
  }
});

// DELETE /api/websites/:id - Remove website
app.delete('/api/websites/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = readData();
    data.websites = data.websites.filter(w => w.id !== id);
    writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete website' });
  }
});

// POST /api/programs - Add program
app.post('/api/programs', (req, res) => {
  try {
    const { name, path: programPath, processName } = req.body;
    if (!name || !programPath) {
      return res.status(400).json({ error: 'Name and path are required' });
    }

    const data = readData();
    const newProgram = {
      id: getNextId(data.programs),
      name,
      path: programPath,
      processName: processName || path.basename(programPath)
    };
    data.programs.push(newProgram);
    writeData(data);

    res.json(newProgram);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add program' });
  }
});

// DELETE /api/programs/:id - Remove program
app.delete('/api/programs/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = readData();
    data.programs = data.programs.filter(p => p.id !== id);
    writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete program' });
  }
});

// POST /api/export - Export BAT files
app.post('/api/export', (req, res) => {
  try {
    const data = readData();
    const version = `v${data.version.major}.${data.version.minor}.${data.version.patch}`;

    // Generate block_games.bat content
    const blockBat = generateBlockBat(data, version);
    const unblockBat = generateUnblockBat(data, version);

    // Save files
    const blockFileName = `block_games_${version}.bat`;
    const unblockFileName = `unblock_games_${version}.bat`;

    fs.writeFileSync(path.join(EXPORTS_DIR, blockFileName), blockBat);
    fs.writeFileSync(path.join(EXPORTS_DIR, unblockFileName), unblockBat);

    // Update version and history
    data.version.patch++;
    data.exportHistory.unshift({
      version,
      date: new Date().toISOString(),
      blockFile: blockFileName,
      unblockFile: unblockFileName
    });
    writeData(data);

    res.json({
      success: true,
      version,
      files: {
        block: blockFileName,
        unblock: unblockFileName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export BAT files' });
  }
});

// GET /api/versions - Get export history
app.get('/api/versions', (req, res) => {
  try {
    const data = readData();
    res.json({
      currentVersion: `v${data.version.major}.${data.version.minor}.${data.version.patch}`,
      history: data.exportHistory
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get versions' });
  }
});

// GET /api/download/:filename - Download exported file
app.get('/api/download/:filename', (req, res) => {
  const filePath = path.join(EXPORTS_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// DELETE /api/history/:version - Delete export history entry
app.delete('/api/history/:version', (req, res) => {
  try {
    const version = req.params.version;
    const data = readData();

    // Find the history entry
    const historyEntry = data.exportHistory.find(h => h.version === version);
    if (!historyEntry) {
      return res.status(404).json({ error: 'History entry not found' });
    }

    // Delete associated files
    const blockFilePath = path.join(EXPORTS_DIR, historyEntry.blockFile);
    const unblockFilePath = path.join(EXPORTS_DIR, historyEntry.unblockFile);

    if (fs.existsSync(blockFilePath)) {
      fs.unlinkSync(blockFilePath);
    }
    if (fs.existsSync(unblockFilePath)) {
      fs.unlinkSync(unblockFilePath);
    }

    // Remove from history
    data.exportHistory = data.exportHistory.filter(h => h.version !== version);
    writeData(data);

    res.json({ success: true, message: `Deleted ${version}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete history entry' });
  }
});

// ===== BAT FILE GENERATORS =====

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
timeout /t 5 /nobreak >nul
exit
`;

  return bat;
}

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
timeout /t 5 /nobreak >nul
exit
`;

  return bat;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Game Blocker API running at http://localhost:${PORT}`);
});
