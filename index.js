const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// كلمة مرور المشرف السرية
const ADMIN_PASSWORD = 'admin123';

// إعداد التخزين للملفات المرفوعة (كتب وصوتيات)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// قواعد البيانات المحلية البسيطة (ملفات JSON)
const getData = (file) => {
    if (!fs.existsSync(file)) return [];
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return [];
    }
};

const saveData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// ديوان التحقق من كلمة مرور المشرف
const checkAdmin = (req, res, next) => {
    const pass = req.headers['x-admin-pass'] || req.body.adminPass;
    if (pass === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'كلمة مرور المشرف غير صحيحة!' });
    }
};

// الصفحات الرئيسية
app.get('/', (req, res) => {
    const audios = getData('audios.json');
    const latestAudio = audios.length > 0 ? audios[audios.length - 1] : null;
    res.render('index', { latestAudio });
});

// قسم الكتب والرسائل
app.get('/books', (req, res) => {
    const books = getData('books.json');
    res.render('books', { books });
});

app.post('/books', upload.single('bookFile'), checkAdmin, (req, res) => {
    const { title } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const books = getData('books.json');
    books.push({ title, url: fileUrl, date: new Date().toLocaleDateString('ar-SA') });
    saveData('books.json', books);
    res.json({ success: true });
});

// قسم الصوتيات (تحديث ليدعم رفع ملف صوتي من الجهاز مباشرة)
app.get('/audio', (req, res) => {
    const audios = getData('audios.json');
    res.render('audio', { audios });
});

app.post('/audio', upload.single('audioFile'), checkAdmin, (req, res) => {
    const { title } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const audios = getData('audios.json');
    audios.push({ title, url: fileUrl, date: new Date().toLocaleDateString('ar-SA') });
    saveData('audios.json', audios);
    res.json({ success: true });
});

// قسم المقالات
app.get('/articles', (req, res) => {
    const articles = getData('articles.json');
    res.render('articles', { articles });
});

app.post('/articles', checkAdmin, (req, res) => {
    const { title, content } = req.body;
    const articles = getData('articles.json');
    articles.push({ title, content, date: new Date().toLocaleDateString('ar-SA') });
    saveData('articles.json', articles);
    res.json({ success: true });
});

// قسم الفتاوى
app.get('/fatwas', (req, res) => {
    const fatwas = getData('fatwas.json');
    res.render('fatwas', { fatwas });
});

app.post('/fatwas', checkAdmin, (req, res) => {
    const { title, content } = req.body;
    const fatwas = getData('fatwas.json');
    fatwas.push({ title, content, date: new Date().toLocaleDateString('ar-SA') });
    saveData('fatwas.json', fatwas);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
