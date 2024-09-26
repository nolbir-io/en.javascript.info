
# Ixtiyoriy zanjirlanish '?.'

[oxirgi brauzer="yangi"]

Ixtiyoriy zanjirlanish `?.` o'rta xususiyat mavjud bo'lmasa ham, o'rnatilgan obyekt xususiyatlariga kirishning xavfsiz yo'lidir. 

## "Mavjud bo'lmagan xususiyat" muammosi

Agar siz qo'llanmani endi o'qib, JavaScriptni o'rganayotgan bo'lsangiz, bu muammoga hali duch kelmagandirsiz, ammo bu keng tarqalgan muammmolardan biridir.

Masalan, faraz qilaylik, bizda foydalanuvchilar haqida ma'lumotni ushlab turuvchi `user` (foydalanuvchi) obyektlari bor.

Ko'pchilik foydalanuvchilarimiz `user.address` xususiyatida, `user.address.street` ko'chasida manzillarga ega, biroq ba'zilari ularni ko'rsatmagan.

Bunday vaziyatda, `user.address.street` ni olishga harakat qilganimizda, va foydalanuvchi manzilsiz bo'lib chiqsa, biz xatolikka duch kelamiz:

```js run
let user = {}; // ""address" xususiyatiga ega bo'lmagan foydalanuvchi 

alert(user.address.street); // Error!
```

Bu kutilgan natija. JavaScript shunday ishlaydi. `user.address` `undefined` (aniqlanmagan) bo'lganligi tufayli, `user.address.street` ni olishga bo'lgan harakat xatoga uchrab muvaffaqiyatsiz yakunlanadi. 

Ko'plab amaliy holatlarda, biz xato (bu yerda "street yo'q" degan ma'noni bildiradi) ni o'rniga `undefined` ni olishni afzal ko'ramiz. 

...boshqa bir misol. Web dasturlashda  biz `document.querySelector('.elem')` kabi maxsus usul chaqiruvi yordamida web-sahifa elementiga mos keladigan obyektni olishimiz mumkin va bunday element bo'lmaganda u "null" qiymatini qaytaradi.

```js run
// Agar element (tarkibiy qism) bo'lmasa document.querySelector('.elem') nol bo'ladi
let html = document.querySelector('.elem').innerHTML; // Agar nol bo'lsa, xato hisoblamadi
```

Agar element mavjud bo'lmasa, biz `.innerHTML` `null` xususiyatiga kirishda xatolikka duch kelamiz. Va ba'zi hollarda, elementning yo'qligi normal bo'lsa, biz xatolikka yo'l qo'ymaslikni va natija sifatida `html = null` ni qabul qilishni xohlaymiz.

Buni qanday qilishimiz mumkin?

Eng aniq yechim xususiyatga kirishdan oldin `if` yoki shartli operator `?` yordamida qiymatni tekshirish bo'ladi, xuddi quyidagi kabi:

```js
let user = {};

alert(user.address ? user.address.street : undefined);
```

U ishlaydi, hech qanday xatolik yo'q... Lekin bu juda noaniq. Ko'rib turganingizdek, kodda `"user.address"` ikki marta paydo bo'ladi.

`document.querySelector` uchun ham xuddi shunday ko'rinadi:

```js run
let html = document.querySelector('.elem') ? document.querySelector('.elem').innerHTML : null;
```

Bu yerda `document.querySelector('.elem')` element qidiruvi aslida ikki marta chaqirilganini ko'rishimiz mumkin. Bu yaxshi holat emas.

Chuqurroq joylashtirilgan xususiyatlar uchun u yanada qo'polroq bo'ladi, chunki ko'p marotaba takrorlash talab etiladi.

Masalan, shunga o'xshash tarzda `user.address.street.name` ni olamiz.

```js
let user = {}; // foydalanuvchining manzili yo'q

alert(user.address ? user.address.street ? user.address.street.name : null : null);
```

Bu shunchaki juda yomon, hatto bunday kodni tushunishda muammolar ham bo'lishi mumkin.

Bunga ahamiyat bermang, chunki uni `&&` operatoridan foydalanib, yozishning yaxshiroq usuli bor:

```js run
let user = {}; // foydalanuvchining manzili yo'q

alert( user.address && user.address.street && user.address.street.name ); // aniqlanmagan (xato yo'q)
```

Va xossaga boradigan butun yo'l barcha komponentlarning mavjudligini ta'minlaydi (agar bo'lmasa, baholash to'xtaydi), lekin ayni paytda bu ideal variant emas.

Ko'rib turganingizdek, kodda xususiyat nomlari hali ham takrorlanib turibdi. Masalan, yuqoridagi kodda "user.address" uch marta qaytarildi. 

Shu tufayli tilga ixtiyoriy zanjirbandlik `?.` qo`shilgan. Bu muammoni bir marta barcha uchun hal qiladi!

## Ixtiyoriy zanjirlanish

 Agar `?` dan avvalgi qiymat `undefined` (aniqlanmagan) yoki `null` bo'lsa, ixtiyoriy zanjirlanish `?`  baholashni to'xtatadi va `undefined` (aniqlanmagan)ga qaytadi. 

**Keyinchalik ushbu maqolada, qisqa qilib, agar u `null` yoki `aniqlanmagan` bo'lmasa, "mavjud" deb hisoblaymiz.**

Boshqa so'z bilan aytganda, `value?.prop`:
- Agar `value`(qiyamt) mavjud bo'lsa `value.prop` sifatida ishlaydi,
- Aks holda (`value` (qiymat) `undefined/null` (aniqlanmagan/nol) bo'lganda) u `undefined` ga qaytadi.

Quyidagi `?.` dan foydalanib `user.address.street`ga kirishning xavfsiz yo'li:

```js run
let user = {}; // foydalanuvchining manzili yo'q

alert( user?.address?.street ); // aniqlanmagan (xato mavjud emas)
```

Kod qisqa va aniq, hech qanday takrorlanishlar yo'q. 

Manzilni `user?.address` bilan o'qish hatto `user` obyekti mavjud bo'lmasa ham ishlay oladi:
Mana `document.querySelector` bilan bir misol:

```js run
let html = document.querySelector('.elem')?.innerHTML; // agar element bo'lmasa, undefined bo'ladi
```

`user?.adres` bilan manzilni o'qish, `user` obyekti mavjud bo'lmasa ham ishlaydi:

```js run
let user = null;

alert( user?.address ); // undefined
alert( user?.address.street ); // undefined
```

Esda tuting: `?.` sintaksisi o'zidan oldingi qiymatni ixtiyoriy qiladi, lekin bundan ortig'ini bajarolmaydi.

Masalan, `user?.address.street.name` da `?.` `user` ga xavfsiz tarzda `null/undefined` bo'lishiga imkon beradi (va bu holda `undefined`ni qaytaradi, lekin bu faqat `user` uchun). Qo'shimcha xususiyatlarga esa odatiy tarzda kirish mumkin. Agar ulardan ba'zilari ixtiyoriy bo'lishini istasak, ko'proq `.` ni `?.` bilan almashtirishimiz kerak bo'ladi.

```warn header="Ixtiyoriy zanjirndan keragidan ortiq foydalanmang"
Biz `?.` dan faqat biror narsa mavjud bo'lmasligi zarari yo'q bo'lgan vaziyatlarda foydalanishimiz kerak.

Agar "user" aniqlanmagan bo'lsa, biz bu haqda dasturlash xatosini ko'ramiz va uni tuzatamiz. Aks holda, agar biz ?. dan ortiqcha foydalansak, kodlash xatolari mos bo'lmagan joyda o'chirilishi va debug qilish qiyinlashishi mumkin.

Misol uchun, agar kod mantiqiga ko'ra `user` obyekti mavjud bo'lishi kerak, lekin `address` ixtiyoriy bo'lsa, biz `user?.address?.street` ni emas, `user.address?.street`ni yozishimiz kerak.
```

````warn header="o'zgaruvchi `?.` dan oldin ma'lum qilinishi kerak"``
Agar `user` o'zgaruvchisi umuman mavjud bo'lmasa, `user?.anything` xatolikni keltirib chiqaradi:

```js run
// ReferenceError: foydalanuvchi aniqlanmagan
user?.address;
```
O'zgaruvchi e'lon qilinishi kerak (masalan, `let/const/var user` yoki funksiya parametri sifatida). Ixtiyoriy zanjir faqat e'lon qilingan o'zgaruvchilar uchun ishlaydi.
````

## Qisqa tutashuv

Yuqorida aytib o'tilganidek, agar chap qism mavjud bo'lmasa, `?.` darhol baholashni to'xtatadi ("qisqa tutashuvlar").

Agar boshqa funksiya chaqiruvlari yoki nojo'ya ta'sirlar mavjud bo'lsa, ular yuzaga kelmaydi.

Demak, `?.` ning o`ng tomonida boshqa funksiya chaqiruvlari yoki amallar mavjud bo`lsa, ular bajarilmaydi.

Misol uchun:

```js run
let user = null;
let x = 0;

user?.sayHi(x++); // "sayHi" yo'q, shuning uchun amal x++ ga yetib bormaydi
user?.sayHi(x++); // "user" mavjud emas, shuning uchun ijro sayHi chaqiruviga va x++ ga etib bormaydi

alert(x); // 0, qiymat oshirilmagan
```

## Boshqa variantlar: ?.(), ?.[]

Ixtiyoriy zanjirlash `?.` operator emas, balki funksiyalar va kvadrat qavslar bilan ham ishlaydigan maxsus sintaksis konstruksiyasidir.


Masalan, `?.()` mavjud bo`lmasligi mumkin bo`lgan funksiyani chaqirish uchun ishlatiladi.

Quyidagi kodda ba'zi foydalanuvchilarimiz "admin" usuli mavjud, ba'zilarida esa yo'q:

```js run
let userAdmin = {
  admin() {
    alert("Men adminman");
  }
};

let userGuest = {};

*!*
userAdmin.admin?.(); // Men adminman
*/!*

*!*
userGuest.admin?.(); // hech narsa (bunday usul yo'q)
*/!*
```

Bu yerda ikkala qatorda ham `admin` xususiyatini olish uchun avval nuqtadan (`userAdmin.admin`) foydalanamiz, chunki biz foydalanuvchi obyekti mavjud deb hisoblaymiz, shuning uchun uni xavfsiz o'qish mumkin.

Keyin `?.()` chap qismni tekshiradi: agar admin funksiyasi mavjud bo'lsa, u ishlaydi ("userAdmin" uchun shunday). Aks holda (`userGuest` uchun) baholash xatosiz to`xtaydi.
userGuest.admin?.(); // hech narsa bajarilmaydi (bunday usul yo'q)
*/!*
```

Bu yerda ikkala qatorda biz `admin` xususiyatini olish uchun avval nuqtadan foydalanamiz (`userAdmin.admin`), chunki `user` obyekti mavjud deb taxmin qilamiz, shuning uchun uni xavfsiz o'qish mumkin.

Keyin `?.()` chap qismni tekshiradi: agar `admin` funksiyasi mavjud bo`lsa, u ishlaydi (`userAdmin` uchun ham shunday). Aks holda (`userGuest` uchun) baholash xatosiz to`xtaydi.

Agar biz nuqta `.` o`rniga xususiyatlarga kirish uchun `[]` qavslardan foydalanmoqchi bo`lsak, `?.[]` sintaksisi ham ishlaydi. Oldingi holatlarga o'xshab, u mavjud bo'lmagan obyektdan xususiyatni xavfsiz o'qish imkonini beradi.

```js run
let key = "firstName";

let user1 = {
  firstName: "John"
};

let user2 = null;

alert( user1?.[key] ); // John
alert( user2?.[key] ); // undefined 
```

Shuningdek, `?.` ni `delete` bilan ham ishlatishimiz mumkin:

```js run
foydalanuvchini delete?.name; // agar foydalanuvchi mavjud bo'lsa, user.name o'chiriladi
```

````warn header="Biz xavfsiz o'qish va o'chirish uchun `?.` dan foydalanishimiz mumkin, lekin yozish uchun emas"
Ixtiyoriy zanjirli `?.` topshiriqning chap tomonida ishlatilmaydi.

Masalan:
```js run
let user = null;

user?.name = "John"; // Error, ishlamayapti
// chunki u undefined = "John" ga baholanadi
````

## Xulosa 

Ixtiyoriy zanjirli `?.` sintaksisi uchta shaklga ega:

1. Agar `obj` mavjud bo'lsa `obj?.prop` -- `obj.prop` ga qaytadi, aks holda u `undefined`.
2. `obj?.[prop]` -- agar `obj` mavjud bo'lsa, `obj[prop]`ni qaytaradi, aks holda `undefined`.
3. `obj.method?.()` -- agar `obj.method` mavjud bo'lsa, `obj.method()` ni chaqiradi, aks holda `undefined`ni qaytaradi.

Ko'rib turganimizdek, ularning barchasi oddiy va ulardan foydalanish oson. `?.` chap qismda `null/undefined` mavjudligini tekshiradi va agar bunday bo'lmasa, baholashni davom ettirishga imkon beradi.

`?.` zanjiri ichki kiritilgan xususiyatlarga xavfsiz kirish imkonini beradi.

Shunga qaramay, biz `?.` ni chap qism mavjud emasligi ma'qul bo'lgan joyda diqqat bilan qo'llashimiz kerak. Agar ular yuzaga kelsa, dasturlash xatolarini bizdan yashirmaydi.