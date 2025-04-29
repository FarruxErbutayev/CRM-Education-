document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Shaklni yuborishni to'xtatish

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('e-mail').value;
    let date = document.getElementById('sana').value;
    let genderMale = document.getElementById('erkak').checked;
    let genderFemale = document.getElementById('ayol').checked;
    let passport = document.getElementById('passport').value;

    // Foydalanuvchi nomi tekshiruvi
    if (username === '') {
        alert("Iltimos, foydalanuvchi nomini kiriting.");
        return;
    }

    // Parol tekshiruvi
    if (password === '') {
        alert("Iltimos, parolni kiriting.");
        return;
    }

    // Email tekshiruvi
    if (email === '') {
        alert("Iltimos, email manzilini kiriting.");
        return;
    }

    // Tug'ilgan sana tekshiruvi
    if (date === '') {
        alert("Iltimos, tug'ilgan sanangizni kiriting.");
        return;
    }

    // Jins tekshiruvi
    if (!genderMale && !genderFemale) {
        alert("Iltimos, jinsingizni tanlang.");
        return;
    }

    // Passport fayl tekshiruvi
    if (passport === '') {
        alert("Iltimos, passport faylini yuklang.");
        return;
    }

    // Hamma maydonlar to'ldirilgan bo'lsa, shakl yuboriladi
    alert("Shakl muvaffaqiyatli yuborildi!");
    document.getElementById('myForm').submit(); // Shaklni yuborish
});
