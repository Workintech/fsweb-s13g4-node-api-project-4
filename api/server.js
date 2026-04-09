const express = require('express');
const cors = require('cors');

const server = express();

server.use(cors());
server.use(express.json());

const users = [
  {
    id: 1,
    kullaniciadi: 'caner',
    sifre: '1234',
  },
  {
    id: 2,
    kullaniciadi: 'mert',
    sifre: '5678',
  },
];

server.get('/', (req, res) => {
  res.status(200).json({
    message: 'API çalışıyor',
  });
});

server.get('/api/kullanicilar', (req, res) => {
  res.status(200).json(users);
});

server.post('/api/kayitol', (req, res) => {
  const { kullaniciadi, sifre } = req.body;

  if (!kullaniciadi || !sifre) {
    return res.status(400).json({
      message: 'kullaniciadi ve sifre zorunludur',
    });
  }

  const existingUser = users.find(
    (user) => user.kullaniciadi.toLowerCase() === kullaniciadi.toLowerCase()
  );

  if (existingUser) {
    return res.status(400).json({
      message: 'bu kullaniciadi zaten kullaniliyor',
    });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    kullaniciadi,
    sifre,
  };

  users.push(newUser);

  return res.status(201).json(newUser);
});

server.post('/api/giris', (req, res) => {
  const { kullaniciadi, sifre } = req.body;

  if (!kullaniciadi || !sifre) {
    return res.status(400).json({
      message: 'kullaniciadi ve sifre zorunludur',
    });
  }

  const user = users.find(
    (u) => u.kullaniciadi === kullaniciadi && u.sifre === sifre
  );

  if (!user) {
    return res.status(401).json({
      message: 'gecersiz kullaniciadi veya sifre',
    });
  }

  return res.status(200).json({
    message: `Hos geldin ${user.kullaniciadi}`,
  });
});

module.exports = server;