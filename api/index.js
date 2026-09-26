const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.render('index', { files: [] });
});

// التعامل الذكي مع الأقسام المختلفة
app.get('/:page', (req, res) => {
    const pageName = req.params.page;
    const viewPath = path.join(__dirname, `../views/${pageName}.ejs`);
    
    // التحقق مما إذا كان الملف موجوداً في مجلد views
    if (fs.existsSync(viewPath)) {
        res.render(pageName, { files: [] });
    } else {
        // إذا لم يكن الملف موجوداً، نعرض صفحة مؤقتة مرتبة بدلاً من انهيار الموقع
        res.send(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>${pageName}</title>
                <style>
                    body { font-family: Tahoma, sans-serif; background: #f4f6f9; text-align: center; padding: 50px; }
                    .box { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: inline-block; }
                    a { color: #2e7d32; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="box">
                    <h2>قسم (${pageName}) جاهز قريباً</h2>
                    <p>هذا القسم سيتم ربطه بملف العرض الخاص به فوراً.</p>
                    <br>
                    <a href="/">العودة للرئيسية</a>
                </div>
            </body>
            </html>
        `);
    }
});

module.exports = app;
