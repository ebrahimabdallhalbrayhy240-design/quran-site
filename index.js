const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
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

const upload = multer({ storage: multer.memoryStorage() });

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
    const latestAudio = db.audios.length > 0 ? db.audios[db.audios.length - 1] : null;
    const latestBook = db.books.length > 0 ? db.books[db.books.length - 1] : null;
    res.render('index', { latestAudio, latestBook });
});

app.get('/books', (req, res) => {
    res.render('books', { books: db.books });
});

app.post('/books', upload.single('bookFile'), checkAdmin, (req, res) => {
    const { title } = req.body;
    let fileUrl = '#';
    if (req.file) {
        fileUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    db.books.push({ title, url: fileUrl, date: new Date().toLocaleDateString('ar-SA'), fileName: req.file ? req.file.originalname : 'ملف' });
    res.json({ success: true });
});

app.get('/audio', (req, res) => {
    res.render('audio', { audios: db.audios });
});

app.post('/audio', upload.single('audioFile'), checkAdmin, (req, res) => {
    const { title } = req.body;
    let fileUrl = '#';
    if (req.file) {
        fileUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    db.audios.push({ title, url: fileUrl, date: new Date().toLocaleDateString('ar-SA'), fileName: req.file ? req.file.originalname : 'مقطع صوتي' });
    res.json({ success: true });
});

app.get('/articles', (req, res) => {
    res.render('articles', { articles: db.articles });
});

app.post('/articles', checkAdmin, (req, res) => {
    const { title, content } = req.body;
    db.articles.push({ title, content, date: new Date().toLocaleDateString('ar-SA') });
    res.json({ success: true });
});

app.get('/fatwas', (req, res) => {
    res.render('fatwas', { fatwas: db.fatwas });
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
