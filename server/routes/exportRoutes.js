const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// POST /api/export - Export BAT files
router.post('/export', exportController.exportBat);

// GET /api/versions - Get export history
router.get('/versions', exportController.getVersions);

// GET /api/download/:filename - Download single file
router.get('/download/:filename', exportController.downloadFile);

// GET /api/download-zip/:version - Download both files as zip
router.get('/download-zip/:version', exportController.downloadZip);

// DELETE /api/history/:version - Delete history entry
router.delete('/history/:version', exportController.deleteHistory);

module.exports = router;
