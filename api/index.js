const express = require('express');
const path = require('path');
const app = express();

// إعداد مسار العروض ومحرك القوالب
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.render('index', { files: [] });
});

// صفحات الأقسام (المقالات، الصوتيات، الفتاوى، الكتب)
app.get('/:page', (req, res) => {
    const pageName = req.params.page;
    try {
        res.render(pageName, { files: [] });
    } catch (err) {
        res.status(404).send('الصفحة غير موجودة');
    }
});

module.exports = app;
