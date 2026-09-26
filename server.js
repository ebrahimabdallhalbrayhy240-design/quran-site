const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({ extended: true }));

// كلمة السر الخاصة بك للإضافة والحذف (يمكنك تغييرها من هنا)
const ADMIN_PASSWORD = "1234";

// إعداد رفع الصوتيات والكتب
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "bookFile") {
      cb(null, './books_files/');
    } else {
      cb(null, './uploads/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// إنشاء مجلد الكتب إن لم يكن موجوداً
if (!fs.existsSync('./books_files')) {
  fs.mkdirSync('./books_files');
}

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/books_files', express.static('books_files'));

let articles = [];
let fatwas = [];

// الرئيسية
app.get('/', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    res.render('index', { files: files || [] });
  });
});

// الصوتيات
app.get('/audios', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    res.render('audios', { files: files || [] });
  });
});

app.post('/delete-audio', (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.send('كلمة السر خاطئة! <a href="/audios">عودة</a>');
  fs.unlink(path.join(__dirname, 'uploads', req.body.fileName), () => res.redirect('back'));
});

// المقالات
app.get('/articles', (req, res) => res.render('articles', { articles }));
app.post('/add-article', (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.send('كلمة السر خاطئة! <a href="/articles">عودة</a>');
  articles.push({ id: Date.now(), title: req.body.title, content: req.body.content, date: new Date().toLocaleDateString('ar-EG') });
  res.redirect('/articles');
});
app.post('/delete-article', (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.send('كلمة السر خاطئة! <a href="/articles">عودة</a>');
  articles = articles.filter(art => art.id !== Number(req.body.id));
  res.redirect('/articles');
});

// الفتاوى
app.get('/fatwas', (req, res) => res.render('fatwas', { fatwas }));
app.post('/add-fatwa', (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.send('كلمة السر خاطئة! <a href="/fatwas">عودة</a>');
  fatwas.push({ id: Date.now(), question: req.body.question, answer: req.body.answer });
  res.redirect('/fatwas');
});
app.post('/delete-fatwa', (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.send('كلمة السر خاطئة! <a href="/fatwas">عودة</a>');
  fatwas = fatwas.filter(f => f.id !== Number(req.body.id));
  res.redirect('/fatwas');
});

// الكتب والرسائل
app.get('/books', (req, res) => {
  fs.readdir('./books_files', (err, books) => {
    res.render('books', { books: books || [] });
  });
});
app.post('/add-book', upload.single('bookFile'), (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.send('كلمة السر خاطئة! <a href="/books">عودة</a>');
  res.redirect('/books');
});
app.post('/delete-book', (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.send('كلمة السر خاطئة! <a href="/books">عودة</a>');
  fs.unlink(path.join(__dirname, 'books_files', req.body.fileName), () => res.redirect('back'));
});

// رفع الصوتيات
app.get('/upload', (req, res) => res.render('upload'));
app.post('/upload', upload.single('audioFile'), (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.send('كلمة السر خاطئة! <a href="/upload">عودة</a>');
  res.redirect('/audios');
});

app.listen(3000, () => console.log('الموقع يعمل الان على: http://localhost:3000'));

