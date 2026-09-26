const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Quran App</title>
        <style>
            body { font-family: Arial, sans-serif; background: #e8f5e9; text-align: center; padding: 60px; }
            .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); display: inline-block; }
            h1 { color: #2e7d32; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Quran Website is Online Successfully!</h1>
            <p>Vercel deployment and Express server are working perfectly.</p>
        </div>
    </body>
    </html>
  `);
});

module.exports = app;
