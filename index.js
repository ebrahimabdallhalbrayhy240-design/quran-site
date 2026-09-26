const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD = 'admin123';

let db = {
    books: [],
    audios: [],
    articles: [],
    fatwas: []
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const checkAdmin = (req, res, next) => {
    const pass = req.headers['x-admin-pass'] || req.body.adminPass;
    if (pass === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'كلمة مرور المشرف غير صحيحة!' });
    }
};

app.get('/', (req, res) => {
    try {
        const latestAudio = db.audios.length > 0 ? db.audios[db.audios.length - 1] : null;
        res.render('index', { latestAudio });
    } catch (err) {
        res.status(500).send('خطأ في العرض: ' + err.message);
    }
});

app.get('/books', (req, res) => {
    try {
        res.render('books', { books: db.books });
    } catch (err) {
        res.status(500).send('خطأ في العرض: ' + err.message);
    }
});

app.post('/books', checkAdmin, (req, res) => {
    const { title } = req.body;
    db.books.push({ title, url: '#', date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/audio', (req, res) => {
    try {
        res.render('audio', { audios: db.audios });
    } catch (err) {
        res.status(500).send('خطأ في العرض: ' + err.message);
    }
});

app.post('/audio', checkAdmin, (req, res) => {
    const { title } = req.body;
    db.audios.push({ title, url: '#', date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/articles', (req, res) => {
    try {
        res.render('articles', { articles: db.articles });
    } catch (err) {
        res.status(500).send('خطأ في العرض: ' + err.message);
    }
});

app.post('/articles', checkAdmin, (req, res) => {
    const { title, content } = req.body;
    db.articles.push({ title, content, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/fatwas', (req, res) => {
    try {
        res.render('fatwas', { fatwas: db.fatwas });
    } catch (err) {
        res.status(500).send('خطأ في العرض: ' + err.message);
    }
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
