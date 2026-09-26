const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

let audiosList = [];
let booksList = [];
let fatwaList = [];
let articlesList = [];

const ADMIN_PASS = '1234';

function checkAdmin(req, res, next) {
    const password = req.body.password || req.headers['x-admin-pass'];
    if (password === ADMIN_PASS) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'كلمة المرور غير صحيحة' });
    }
}

// تمرير الصوتيات للرئيسية لكي تظهر آخر صوتية
app.get('/', (req, res) => {
    res.render('index', { 
        audios: audiosList, 
        books: booksList, 
        articles: articlesList, 
        fatwas: fatwaList 
    });
});

app.get('/audios', (req, res) => { res.render('audios', { audios: audiosList }); });
app.post('/audios', checkAdmin, (req, res) => {
    const title = req.body.title || 'صوتية بدون عنوان';
    const url = req.body.url;
    audiosList.unshift({ title, url, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/books', (req, res) => { res.render('books', { books: booksList }); });
app.post('/books', checkAdmin, (req, res) => {
    const title = req.body.title || 'كتاب بدون عنوان';
    const url = req.body.url;
    booksList.unshift({ title, url, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/fatwa', (req, res) => { res.render('fatwa', { fatwas: fatwaList }); });
app.post('/fatwa', checkAdmin, (req, res) => {
    const title = req.body.title || 'سؤال فتوى';
    const answer = req.body.answer || 'الإجابة قيد المراجعة';
    fatwaList.unshift({ title, answer, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/articles', (req, res) => { res.render('articles', { articles: articlesList }); });
app.post('/articles', checkAdmin, (req, res) => {
    const title = req.body.title || 'مقال جديد';
    articlesList.unshift({ title, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/:page', (req, res) => {
    const pageName = req.params.page;
    res.render(pageName, { 
        files: [], articles: articlesList, books: booksList, audios: audiosList, fatwas: fatwaList 
    }, (err, html) => {
        if (err) {
            res.status(200).send(`
                <!DOCTYPE html>
                <html lang="ar" dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <title>قسم ${pageName}</title>
                    <style>
                        body { font-family: Tahoma, sans-serif; background: #0f2e1b; color: #fff; text-align: center; padding: 50px; }
                        .box { background: #12372a; padding: 30px; border-radius: 10px; border: 1px solid #436850; display: inline-block; }
                        a { color: #d4af37; text-decoration: none; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="box">
                        <h2>قسم (${pageName})</h2>
                        <p>عذراً، هذا القسم قيد التحديث.</p>
                        <br>
                        <a href="/">العودة للرئيسية</a>
                    </div>
                </body>
                </html>
            `);
        } else {
            res.send(html);
        }
    });
});

module.exports = app;
