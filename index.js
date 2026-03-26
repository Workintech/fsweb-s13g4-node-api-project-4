require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const server = express();
server.use(express.json());
server.use(cors());

// --- VERİTABANI (Dizi) ---
let kullanicilar = [
    { id: 310635, kullaniciadi: 'admin', sifre: bcrypt.hashSync('1234', 8) }
];

// --- ARA YAZILIM (Middleware) ---
function kontrolEt(req, res, next) {
    const { kullaniciadi, sifre } = req.headers;
    const user = kullanicilar.find(u => u.kullaniciadi === kullaniciadi);

    if (user && bcrypt.compareSync(sifre, user.sifre)) {
        next(); 
    } else {
        res.status(401).json({ mesaj: "Bu listeyi görmek için geçerli kullanıcı adı ve şifreyi 'Header' kısmından göndermelisiniz." });
    }
}

// --- ROTALAR (Endpoints) ---

// 1. Ana Sayfa (Basit bir Kayıt Formu)
server.get('/', (req, res) => {
    res.send(`
        <div style="font-family:sans-serif; padding:20px;">
            <h1>Kayıt Paneli</h1>
            <input id="u" placeholder="Kullanıcı Adı"><br><br>
            <input id="p" type="password" placeholder="Şifre"><br><br>
            <button onclick="kaydet()">Kayıt Ol</button>
            <p id="mesaj"></p>
            <script>
                async function kaydet() {
                    const u = document.getElementById('u');
                    const p = document.getElementById('p');
                    const res = await fetch('/api/kayıtol', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({kullaniciadi: u.value, sifre: p.value})
                    });
                    const data = await res.json();
                    if(res.ok) {
                        document.getElementById('mesaj').innerText = "Kayıt Başarılı: " + data.kullaniciadi;
                    } else {
                        document.getElementById('mesaj').innerText = "Hata: " + data.mesaj;
                    }
                }
            </script>
        </div>
    `);
});

// 2. Kullanıcı Listesi (Korumalı!)
server.get('/api/kullanıcılar', kontrolEt, (req, res) => {
    res.json(kullanicilar);
});

// 3. Kayıt Ol
server.post('/api/kayıtol', (req, res) => {
    const { kullaniciadi, sifre } = req.body;
    if (!kullaniciadi || !sifre) return res.status(400).json({ mesaj: "Eksik bilgi" });

    const yeni = { 
        id: Date.now(), 
        kullaniciadi, 
        sifre: bcrypt.hashSync(sifre, 8) 
    };
    kullanicilar.push(yeni);
    res.status(201).json(yeni);
});

// 4. Giriş Yap
server.post('/api/giriş', (req, res) => {
    const { kullaniciadi, sifre } = req.body;
    const user = kullanicilar.find(u => u.kullaniciadi === kullaniciadi);

    if (user && bcrypt.compareSync(sifre, user.sifre)) {
        res.json({ mesaj: `Hoş geldin ${kullaniciadi}!` });
    } else {
        res.status(401).json({ mesaj: "Hatalı bilgiler" });
    }
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde fırtına gibi çalışıyor...`);
});