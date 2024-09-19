const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController'); // Adjust path if necessary

// Authentication route
router.post('/authenticate', authController.authenticate);

module.exports = router;
