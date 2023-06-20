
# Havola turi

```ogohlantiruvchi sarlavha="Chuqur til xususiyati"
Ushbu maqola ba'zi chekka holatlarni yaxshiroq tushunish uchun ilg'or mavzuni qamrab oladi.

Bu muhim emas. Ko'pgina tajribali ishlab chiquvchilar buni bilmagan holda yaxshi yashaydilar. Ishlarning kaput ostida qanday ishlashini bilmoqchi bo'lsangiz, o'qing.
```

Dinamik tarzda baholangan usul chaqiruvi `this` ni yo'qotishi mumkin.

Masalan:

```js run
let user = {
  name: "John",
  hi() { alert(this.name); },
  bye() { alert("Bye"); }
};

user.hi(); // ishlaydi

// endi ismga qarab user.hi yoki user.bye deb chaqiramiz
*!*
(user.name == "John" ? user.hi : user.bye)(); // Error!
*/!*
```

Oxirgi qatorda `user.hi` yoki `user.bye` ni tanlaydigan shartli operator mavjud. Bu holda natija `user.hi` bo'ladi.

Keyin usul darhol `()` qavslar bilan chaqiriladi. Lekin u to'g'ri ishlamayapti!

Ko'rib turganingizdek, chaqiruv xatolikka olib keladi, chunki qo'ng'iroq ichidagi `this` qiymati `undefined` bo'ladi.

Bu ishlaydi (obyekt nuqta usuli):
```js
user.hi();
```

Bu ishlamaydi (baholangan usul):
```js
(user.name == "John" ? user.hi : user.bye)(); // Error!
```

Nega? Agar bu nima uchun sodir bo'lishini tushunmoqchi bo'lsak, keling, `obj.method()` chaqiruvi qanday ishlashini ko'rib chiqaylik.

## Ma'lumot turi tushuntirilgan

Diqqat bilan qaraydigan bo'lsak, `obj.method()` iborasida ikkita operatsiyani ko'rishimiz mumkin:

1. Birinchidan, nuqta `'.'` `obj.method` xususiyatini qaytarib oladi.
2. Keyin `()` qavslar uni bajaradi.

Xo'sh, `this` haqidagi ma'lumot birinchi qismdan ikkinchi qismga qanday o'tadi?

Agar biz ushbu operatsiyalarni alohida qatorlarga qo'ysak, u holda `this` aniq yo'qoladi:

```js run
let user = {
  name: "John",
  hi() { alert(this.name); }
};

*!*
// olish va usulni chaqirishni ikki qatorga ajrating
let hi = user.hi;
hi(); // Error, chunki this aniqlanmagan
*/!*
```

Bu yerda `hi = user.hi` funksiyani o'zgaruvchiga qo'yadi, so'ngra oxirgi qatorda u butunlay mustaqil bo'ladi va shuning uchun `this` mavjud emas.

**`user.hi()` qo'ng'iroqlarini ishlashi uchun JavaScript hiyla ishlatadi -- nuqta `'.'` funksiyani emas, balki maxsus [Reference Type](https://tc39.github) qiymatini qaytaradi. .(io/ecma262/#sec-reference-specification-type).**

Malumot turi "spetsifikatsiya turi" dir. Biz uni aniq ishlata olmaymiz, lekin u til tomonidan ichki tarzda ishlatiladi.

Havola turi qiymati uch qiymatli `(base,name, strict)` birikmasidir, bu yerda:

- `base` obyekt.
- `name` xususiyat nomi.
- `strict` to'g'ri hisoblanadi, agar `use strict` amalda bo'lsa.

`user.hi` xususiyatiga kirish natijasi funksiya emas, balki Reference Type qiymatidir. Qattiq rejimda `user.hi` uchun bu:

```js
// Reference Type qiymati
(user, "hi", true)
```

Qavslar `()` Reference Type bo'yicha chaqirilganda, ular obyekt va uning usuli haqida to'liq ma'lumot oladi va o'ng `this` (bu holda `user`) ni o'rnatishi mumkin.

Ma'lumot turi maxsus "vositachi" ichki tip bo'lib, ma'lumotni nuqta `.` dan `()` chaqiruvchi qavslarga o'tkazish uchun mo'ljallangan.

`hi = user.hi` ni tayinlash kabi har qanday boshqa amal mos yozuvlar turini bir butun sifatida bekor qiladi, `user.hi` (funksiya) qiymatini oladi va uni uzatadi. Shunday qilib, keyingi har qanday operatsiya `this` ni "yo'qotadi".

Natijada, funksiya to'g'ridan-to'g'ri nuqta `obj.method()` yoki kvadrat qavslar `obj['method']()` sintaksisi (ular bu yerda ham xuddi shunday ishlaydi). Ushbu muammoni hal qilishning turli usullari mavjud, masalan, [func.bind()](/bind#solution-2-bind).

## Xulosa

Reference Type - bu tilning ichki turi.

`obj.method()` da nuqta `.` kabi xususiyatni o'qish aniq xususiyat qiymatini emas, balki xususiyat qiymatini ham, u olingan obyektni ham saqlaydigan maxsus "havola turi" qiymatini qaytaradi.

Bu obyektni olish va unga `this` ni o'rnatish uchun `()` chaqiruvining keyingi usuli uchun mo'ljallangan.

Boshqa barcha operatsiyalar uchun mos yozuvlar turi avtomatik ravishda xususiyat qiymatiga aylanadi (bizning holatlarimizda funksiya).

Butun mexanika bizning ko'zimiz uchun yashirin. Bu faqat nozik holatlarda, masalan, ifoda yordamida obyektdan dinamik ravishda usul olinganda muhim ahamiyatga ega.
