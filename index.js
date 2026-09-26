const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD = 'admin123';

let db = {
    books: [],
    audios: [],
    articles: [],
    fatwas: []
};

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const checkAdmin = (req, res, next) => {
    const pass = req.headers['x-admin-pass'] || req.body.adminPass;
    if (pass === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'كلمة مرور المشرف غير صحيحة!' });
    }
};

// دالة آمنة تماماً لمنع انهيار الخادم إذا كان ملف الـ EJS غير موجود
const safeRender = (req, res, viewName, data) => {
    const viewPath = path.join(__dirname, viewName + '.ejs');
    if (fs.existsSync(viewPath)) {
        res.render(viewName, data);
    } else {
        res.send(`<!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"><title>منصة إسلامية</title><style>body{font-family:Tahoma;background:#0f172a;color:#fff;text-align:center;padding:50px;}h1{color:#d4af37;}</style></head>
        <body>
            <h1>مرحباً بك في منصة إسلامية</h1>
            <p>السيرفر يعمل بنجاح تام على Vercel الآن!</p>
            <p style="color: #cbd5e1;">(جارٍ التحقق من ملفات العرض: ${viewName}.ejs)</p>
        </body>
        </html>`);
    }
};

app.get('/', (req, res) => {
    const latestAudio = db.audios.length > 0 ? db.audios[db.audios.length - 1] : null;
    safeRender(req, res, 'index', { latestAudio });
});

app.get('/books', (req, res) => {
    safeRender(req, res, 'books', { books: db.books });
});

app.post('/books', checkAdmin, (req, res) => {
    const { title } = req.body;
    db.books.push({ title, url: '#', date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/audio', (req, res) => {
    safeRender(req, res, 'audio', { audios: db.audios });
});

app.post('/audio', checkAdmin, (req, res) => {
    const { title } = req.body;
    db.audios.push({ title, url: '#', date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/articles', (req, res) => {
    safeRender(req, res, 'articles', { articles: db.articles });
});

app.post('/articles', checkAdmin, (req, res) => {
    const { title, content } = req.body;
    db.articles.push({ title, content, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/fatwas', (req, res) => {
    safeRender(req, res, 'fatwas', { fatwas: db.fatwas });
});

app.post('/fatwas', checkAdmin, (req, res) => {
    const { title, content } = req.body;
    db.fatwas.push({ title, content, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
