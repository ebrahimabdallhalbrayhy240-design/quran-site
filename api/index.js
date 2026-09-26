const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.render('index', { files: [], articles: [], books: [], messages: [] }, (err, html) => {
        if (err) {
            res.send('<h1>مرحباً بك في موقع القرآن الكريم والمحاضرات</h1>');
        } else {
            res.send(html);
        }
    });
});

// مسارات الأقسام الرئيسية مع دعم استقبال البيانات المرفوعة
app.get('/articles', (req, res) => {
    res.render('articles', { success: false });
});
app.post('/articles', (req, res) => {
    res.render('articles', { success: true });
});

app.get('/books', (req, res) => {
    res.render('books', { success: false });
});
app.post('/books', (req, res) => {
    res.render('books', { success: true });
});

app.get('/fatwa', (req, res) => {
    res.render('fatwa', { success: false });
});
app.post('/fatwa', (req, res) => {
    res.render('fatwa', { success: true });
});

app.get('/audios', (req, res) => {
    res.render('audios', { success: false });
});
app.post('/audios', (req, res) => {
    res.render('audios', { success: true });
});

// التعامل مع أي صفحة أخرى لمنع انهيار السيرفر
app.get('/:page', (req, res) => {
    const pageName = req.params.page;
    res.render(pageName, { 
        files: [], 
        articles: [], 
        books: [], 
        messages: [], 
        data: [] 
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
