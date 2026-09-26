const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    try {
        const indexPath = path.join(__dirname, '../views/index.ejs');
        if (fs.existsSync(indexPath)) {
            let html = fs.readFileSync(indexPath, 'utf8');
            res.send(html);
        } else {
            res.send('<h1>مرحباً بك في موقع القرآن الكريم</h1><p>جاري تحميل الملفات...</p>');
        }
    } catch (err) {
        res.status(500).send('Error loading page: ' + err.message);
    }
});

module.exports = app;
