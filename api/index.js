const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تطبيق القرآن الكريم</title>
        <style>
            body { font-family: Tahoma, sans-serif; background: #f4f6f9; text-align: center; padding: 50px; }
            h1 { color: #1b5e20; }
            .box { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: inline-block; }
        </style>
    </head>
    <body>
        <div class="box">
            <h1>تم تشغيل موقع القرآن الكريم بنجاح!</h1>
            <p>الموقع يعمل الآن بشكل سليم ومستقر على Vercel.</p>
        </div>
    </body>
    </html>
  `);
});

module.exports = app;
