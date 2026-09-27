export default function Home() {
  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>المكتبة الإسلامية</h1>

      {/* قسم الصوتيات */}
      <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>سورة الفاتحة</h2>
        <audio controls style={{ width: '100%' }}>
          <source 
            src="https://github.com/ebrahimabdallhalbrayhy240-design/quran-site/releases/download/v1/1_Al_Fatiha___._.0.m4a" 
            type="audio/mp4" 
          />
          متصفحك لا يدعم تشغيل المقاطع الصوتية.
        </audio>
      </div>

      {/* قسم الكتب والمقالات */}
      <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>الكتاب / الملف (PDF)</h2>
        <a 
          href="https://github.com/ebrahimabdallhalbrayhy240-design/quran-site/releases/download/v1/3_105909.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}
        >
          فتح قراءة الكتاب (PDF)
        </a>
      </div>
    </main>
  );
}

