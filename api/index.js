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
            res.send('<h1>مرحباً بك في موقع القرآن الكريم</h1>');
        } else {
            res.send(html);
        }
    });
});

// التعامل مع أي صفحة مع تمرير كافة المتغيرات المحتملة لمنع انهيار السيرفر
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
            // إذا حدث أي خطأ في العرض، نعرض رسالة نظيفة بدلاً من Internal Server Error
            res.status(200).send(`
                <!DOCTYPE html>
                <html lang="ar" dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <title>قسم ${pageName}</title>
                    <style>
                        body { font-family: Tahoma, sans-serif; background: #f4f6f9; text-align: center; padding: 50px; }
                        .box { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: inline-block; }
                        a { color: #2e7d32; text-decoration: none; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="box">
                        <h2>قسم (${pageName})</h2>
                        <p>عذراً، هذا القسم قيد التحديث أو ملف العرض الخاص به غير متطابق.</p>
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
