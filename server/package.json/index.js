/**
 * DevPortal - Mock Node.js & Express Application Gateway
 * Purpose: Architectural reference layer for code layout inspection.
 */

const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware layout configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets for visual layout continuity
app.use(express.static(path.join(__dirname, '../')));

// API health endpoint stub
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Mock Node.js runtime operating in layout-only mode',
        timestamp: new Date().toISOString()
    });
});

// Fallback route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
    console.log(`Mock server architecture online at port ${PORT}`);
});

