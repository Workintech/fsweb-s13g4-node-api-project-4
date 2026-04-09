let users = [
  {
    id: 1,
    kullaniciadi: "admin",
    sifre: "1234",
  },
  {
    id: 2,
    kullaniciadi: "caner",
    sifre: "12345",
  },
];

function tumunuGetir() {
  return users;
}

function kullaniciBul(kullaniciadi) {
  return users.find(
    (user) => user.kullaniciadi.toLowerCase() === kullaniciadi.toLowerCase()
  );
}

function ekle(user) {
  const yeniKullanici = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    ...user,
  };

  users.push(yeniKullanici);
  return yeniKullanici;
}

module.exports = {
  tumunuGetir,
  kullaniciBul,
  ekle,
};