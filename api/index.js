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
    res.render('index', { files: [] });
});

// توجيه الأقسام الرئيسية مباشرة لملفاتها الأصلية
app.get('/articles', (req, res) => {
    res.render('articles', { files: [] });
});

app.get('/books', (req, res) => {
    res.render('books', { files: [] });
});

app.get('/fatwa', (req, res) => {
    res.render('fatwa', { files: [] });
});

app.get('/audios', (req, res) => {
    res.render('audios', { files: [] });
});

// مسار عام لأي صفحة أخرى
app.get('/:page', (req, res) => {
    const pageName = req.params.page;
    res.render(pageName, { files: [] }, (err, html) => {
        if (err) {
            res.status(404).send('الصفحة غير موجودة أو قيد التجهيز');
        } else {
            res.send(html);
        }
    });
});

module.exports = app;
