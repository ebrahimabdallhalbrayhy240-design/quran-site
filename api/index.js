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

// المفتاح السري الخاص بك (يمكنك تغليقه بالرمز الذي تريده)
const ADMIN_KEY = 'ibrahim123';

// دالة وسيطة للتحقق من أن المستخدم هو المشرف
function checkAdmin(req, res, next) {
    const key = req.query.key || req.body.key;
    if (key === ADMIN_KEY) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'غير مصرح لك بالرفع أو التعديل' });
    }
}

app.get('/', (req, res) => {
    const isAdmin = req.query.key === ADMIN_KEY;
    res.render('index', { files: [], articles: articlesList, books: booksList, messages: [], isAdmin });
});

app.get('/audios', (req, res) => { 
    const isAdmin = req.query.key === ADMIN_KEY;
    res.render('audios', { audios: audiosList, isAdmin, adminKey: ADMIN_KEY }); 
});
app.post('/audios', checkAdmin, (req, res) => {
    const title = req.body.title || 'صوتية بدون عنوان';
    const url = req.body.url;
    audiosList.unshift({ title, url, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/books', (req, res) => { 
    const isAdmin = req.query.key === ADMIN_KEY;
    res.render('books', { books: booksList, isAdmin, adminKey: ADMIN_KEY }); 
});
app.post('/books', checkAdmin, (req, res) => {
    const title = req.body.title || 'كتاب بدون عنوان';
    const url = req.body.url;
    booksList.unshift({ title, url, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/fatwa', (req, res) => { 
    const isAdmin = req.query.key === ADMIN_KEY;
    res.render('fatwa', { fatwas: fatwaList, isAdmin, adminKey: ADMIN_KEY }); 
});
app.post('/fatwa', checkAdmin, (req, res) => {
    const title = req.body.title || 'سؤال فتوى';
    const answer = req.body.answer || 'الإجابة قيد المراجعة';
    fatwaList.unshift({ title, answer, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/articles', (req, res) => { 
    const isAdmin = req.query.key === ADMIN_KEY;
    res.render('articles', { articles: articlesList, isAdmin, adminKey: ADMIN_KEY }); 
});
app.post('/articles', checkAdmin, (req, res) => {
    const title = req.body.title || 'مقال جديد';
    articlesList.unshift({ title, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/:page', (req, res) => {
    const pageName = req.params.page;
    const isAdmin = req.query.key === ADMIN_KEY;
    res.render(pageName, { 
        files: [], articles: articlesList, books: booksList, audios: audiosList, fatwas: fatwaList, isAdmin, adminKey: ADMIN_KEY 
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
