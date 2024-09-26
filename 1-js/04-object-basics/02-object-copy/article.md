# Obyekt havolalari va nusxalash

Obyektlarning ibtidoiylardan asosiy farqlaridan biri shundaki, obyektlar "havolalar bo'yicha" saqlanadi va ko'chiriladi, ibtidoiy qiymatlar: satrlar, raqamlar, mantiqiy qiymatlar va boshqalar har doim "butun qiymat sifatida" ko'chiriladi.

Agar qiymatni nusxalashda nima sodir bo'lishini ko'rib chiqsak, buni tushunish oson.

Keling, ibtidoiydan boshlaylik, masalan, satr.

Bu erda biz `message` nusxasini `phrase`ga joylashtiramiz:

```js
let message = "Hello!";
let phrase = message;
```

 Natijada biz ikkita mustaqil o'zgaruvchiga ega bo'lamiz, ularning har biri `"Hello!"` qatorini saqlaydi.

![](variable-copy-value.svg)

Aniq natija, shunday emasmi?

Obyektlar bunga o'xshash emas.

**Obyektga tayinlangan o'zgaruvchi obyektning o'zini emas, balki uning "xotiradagi manzilini", boshqacha aytganda, unga "mos yozuvlar"ni saqlaydi.**

Keling, bunday o'zgaruvchining misolini ko'rib chiqaylik:

```js
let user = {
  name: "John"
};
```

Va u aslida xotirada qanday saqlanadi:

![](variable-contains-reference.svg)

Obyekt xotiraning biron bir joyida (rasmning o'ng tomonida) saqlanadi, `user` o'zgaruvchisi (chapda) esa "reference", ya'ni havolalarga ega.

Biz `user` kabi obyekt o'zgaruvchisini obyekt manzili ko'rsatilgan qog'oz varag'i kabi tasavvur qilishimiz mumkin.

Obyekt bilan harakatlarni bajarganimizda, masalan. `user.name` xususiyatini oling, JavaScript mexanizmi ushbu manzilda nima borligini ko'rib chiqadi va amaldagi obyekt ustida amalni bajaradi.

Endi nima uchun bu muhimligini ko'rib chiqamiz.

**Obyekt o'zgaruvchisi nusxalanganda havola ko'chiriladi, lekin obyektning o'zi takrorlanmaydi.**

Masalan:

```js no-beautify
let user = { name: "John" };

let admin = user; // havolani nusxalang
```

Endi bizda ikkita o'zgaruvchi bor, ularning har biri bir xil obyektga havolani saqlaydi:

![](variable-copy-reference.svg)

Ko'rib turganingizdek, bitta obyekt mavjud, ammo endi unga havola qiluvchi ikkita o'zgaruvchi mavjud.

Obyektga kirish va uning mazmunini o'zgartirish uchun biz ikkala o'zgaruvchidan foydalanishimiz mumkin:

```js run
let user = { name: 'John' };

let admin = user;

*!*
admin.name = 'Pete'; // "admin" havolasi bilan o'zgartirildi
*/!*

alert(*!*user.name*/!*); //  Pete', o'zgarishlar "user" ma'lumotnomasidan ko'rinadi
```
Go'yo bizda ikkita kalitli kabinet bor edi va ulardan birini (`admin`) ishlatib, unga kirib, o'zgartirishlar kiritdik. Keyinchalik, agar biz boshqa kalitdan (`user`) foydalansak, biz hali ham o'sha kabinetni ochamiz va o'zgartirilgan tarkibga kira olamiz.

## Malumot bo'yicha taqqoslash

Ikki obyekt bir xil obyekt bo'lsagina teng bo'ladi.

Masalan, bu erda `a` va `b` bir xil obyektga ishora qiladi, shuning uchun ular tengdir:

```js run
let a = {};
let b = a; // havolani nusxalanag

alert( a == b ); // true, ikkala o'zgaruvchi ham bir xil obyektga murojaat qiladi
alert( a === b ); // true
```

Va bu yerda ikkita mustaqil obyekt bir-biriga o'xshash bo'lsa ham teng emas, (ikkalasi ham bo'sh):

```js run
let a = {};
let b = {}; // ikkita mustaqil obyektlar

alert( a == b ); // false
```
`obj1 > obj2` kabi taqqoslashlar yoki ibtidoiy `obj == 5` bilan taqqoslash uchun obyektlar primitivlarga aylantiriladi. Biz yaqin orada obyektni o'zgartirish qanday ishlashini o'rganamiz, lekin rostini aytsam, bunday taqqoslashlar juda kamdan-kam hollarda kerak bo'ladi -- odatda ular dasturlash xatosi natijasida paydo bo'ladi.

````smart header="Const obyektlari o'zgartirilishi mumkin"
An important side effect of storing objects as references is that an object declared as `const` *can* be modified.
Obyektlarni havola sifatida saqlashning muhim yon ta'siri shundan iboratki, `const` deb e'lon qilingan obyektni *o'zgartirishi mumkin*.

Masalan:

```js run
const user = {
  name: "John"
};

*!*
user.name = "Pete"; // (*)
*/!*

alert(user.name); // Pete
```
`(*)` qatori xatolikka olib kelishi mumkindek tuyulishi mumkin, lekin unday emas. `user` qiymati doimiy, u har doim bir xil obyektga murojaat qilishi kerak, lekin bu obyektning xususiyatlarini o'zgartirish mumkin.

Boshqacha qilib aytganda, `const user` faqat `user=...` ni to'liq o'rnatishga harakat qilsak xato qiladi.

Ya'ni, agar biz haqiqatan ham doimiy obyekt xususiyatlarini yaratishimiz ham mumkin, lekin mutlaqo boshqa usullardan foydalanish lozim. Buni <info:property-descriptors> bobida aytib o'tamiz.
````

## Klonlash va birlashtirish, Object.assign[#cloning-and-merging-object-assign]

Shunday qilib, obyekt o'zgaruvchisini nusxalash bir xil obyektga yana bir havola hosil qiladi.

Ammo obyektni takrorlashimiz kerak bo'lsa-chi?

Biz yangi obyekt yaratishimiz va mavjud obyektning tuzilishini uning xususiyatlarini takrorlash va ularni ibtidoiy darajada nusxalash orqali takrorlashimiz mumkin.

Quyidagi kabi:

```js run
let user = {
  name: "John",
  age: 30
};

*!*
let clone = {}; // yangi bo'sh obyekt

// unga barcha foydalanuvchi xossalarini ko'chirib olaylik
for (let key in user) {
  clone[key] = user[key];
}
*/!*

// endi klon xuddi shu tarkibga ega bo'lgan to'liq mustaqil obyektdir
clone.name = "Pete"; // undagi ma'lumotlarni o'zgartirdi

alert( user.name ); // asl obyektda hali ham Jon
```

Biz [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) metodidan ham foydalanishimiz mumkin.

Sintaksis:

```js
Object.assign(dest, ...sources)
```

- `dest` birinchi argumenti maqsadli obyektdir.
- Keyingi argumentlar - manba obyektlari ro'yxati.

U barcha manba ob'ektlarining xususiyatlarini maqsadli `dest` ga ko'chiradi va keyin uni natija sifatida qaytaradi.

Masalan, bizda `user` obyekti bor, keling, unga bir nechta ruxsatlarni qo'shamiz:

```js run
let user = { name: "John" };

let permissions1 = { canView: true };
let permissions2 = { canEdit: true };

*!*
// ruxsatlar1 va ruxsatlar2 dan barcha xususiyatlarni foydalanuvchiga ko'chiradi
Object.assign(user, permissions1, permissions2);
*/!*

// now user = { name: "John", canView: true, canEdit: true }
alert(user.name); // John
alert(user.canView); // true
alert(user.canEdit); // true
```

Agar nusxa olingan xususiyat nomi allaqachon mavjud bo'lsa, uning ustiga yoziladi:

```js run
let user = { name: "John" };

Object.assign(user, { name: "Pete" });

alert(user.name); // now user = { name: "Pete" }
```

Obyektni oddiy klonlashni amalga oshirish uchun `Object.assign` dan ham foydalanishimiz mumkin:

```js run
let user = {
  name: "John",
  age: 30
};

*!*
let clone = Object.assign({}, user);
*/!*

alert(clone.name); // John
alert(clone.age); // 30
```

Bu yerda u `user` ning barcha xususiyatlarini bo'sh obyektga ko'chiradi va uni qaytaradi.

Obyektni klonlashning boshqa usullari ham mavjud, masalan. [spread sintaksisi](info:rest-parameters-spread) `clone = {...user}` dan foydalanish, bu qo'llanmada keyinroq muhokama qilinadi.

## Ichki klonlash

Shu paytgacha biz `user` ning barcha xossalari ibtidoiy deb hisoblardik. Lekin xususiyatlar boshqa obyektlarga havola bo'lishi mumkin.

Quyidagi kabi:
```js run
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

alert( user.sizes.height ); // 182
```

Endi `clone.sizes = user.sizes` ni nusxalash yetarli emas, chunki `user.sizes` obyekt bo'lib, havola orqali ko'chiriladi, shuning uchun `clone` va `user` bir xil o'lchamlarga ega bo'ladi:

```js run
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

let clone = Object.assign({}, user);

alert( user.sizes === clone.sizes ); // true, o'xshash obyekt

// foydalanuvchi va klon almashish o'lchamlari
user.sizes.width = 60;    // xususiyatni bitta joydan o'zgartirish
alert(clone.sizes.width); // 60, va boshqasidan olingan natija
```

Buni tuzatish va `user` va `clone` ni haqiqatan ham alohida obyektlar qilish uchun biz `user[kalit]` ning har bir qiymatini tekshiradigan klonlash siklidan foydalanishimiz kerak va agar u obyekt bo'lsa, uning tuzilishini ham takrorlaymiz. Bu "chuqur klonlash" yoki "tuzilgan klonlash" deb ataladi. Chuqur klonlashni amalga oshiradigan [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) usuli mavjud.


### tuzilgan klon (Clone)

`structuredClone(object)` chaqiruvi `obyekt` ni barcha o'rnatilgan xususiyatlar bilan klonlaydi.

Buni misolimizda qanday ishlatishimiz mumkin:

```js run
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

*!*
let clone = structuredClone(user);
*/!*

alert( user.sizes === clone.sizes ); // false, har xil obyektlar

// foydalanuvchi va klon endi umuman bog'liq emas
user.sizes.width = 60;    // mulkni bir joydan o'zgartirish
alert(clone.sizes.width); // 50, bog'liq emas
```

`structuredClone` usuli obyektlar, massivlar, primitiv qiymatlar kabi ko'pgina ma'lumotlar turlarini klonlashi mumkin.

Shuningdek, u obyekt xususiyati obyektning o'ziga (to'g'ridan-to'g'ri yoki zanjir yoki havolalar orqali) murojaat qilganda, aylanma havolalarni qo'llab-quvvatlaydi.

Masalan:

```js run
let user = {};

// dumaloq havola yaratamiz:
// user.me foydalanuvchining o'ziga havola qiladi
user.me = user;

let clone = structuredClone(user);
alert(clone.me === clone); // true
```
Ko'rib turganingizdek, `clone.me` `user`ga emas, `clone`ga ishora qiladi! Shunday qilib, dumaloq ma'lumotnoma ham to'g'ri klonlangan.

Garchi, `structuredClone` ishlamay qolgan holatlar ham mavjud.

Misol uchun, agar obyekt funksiya xususiyatiga ega bo'lsa:

```js run
// error
structuredClone({
  f: function() {}
});
```
Funksiya xususiyatlari qo'llab-quvvatlanmaydi.

Bunday murakkab ishlarni hal qilish uchun biz klonlash usullari kombinatsiyasidan foydalanishimiz, maxsus kod yozishimiz yoki g'ildirakni qayta ixtiro qilmaslik uchun mavjud dasturni olishimiz kerak bo'lishi mumkin, masalan ([_.cloneDeep(obj)](https://lodash.com). /docs#cloneDeep) JavaScript kutubxonasidan [lodash](https://lodash.com).

## Xulosa

Obyektlar mos yozuvlar bo'yicha tayinlanadi va ko'chiriladi. Boshqacha qilib aytganda, o'zgaruvchi "obyekt qiymatini" emas, balki qiymat uchun "ma'lumotnoma" (xotiradagi manzil) ni saqlaydi. Shunday qilib, bunday o'zgaruvchidan nusxa ko'chirish yoki uni funksiya argumenti sifatida topshirish obyektning o'zini emas, balki o'sha havolani nusxalaydi.

Ko'chirilgan havolalar orqali barcha operatsiyalar (xususiyatlarni qo'shish/o'chirish kabi) bir xil obyektda amalga oshiriladi.

"Haqiqiy nusxa" (klon) yaratish uchun biz "sayoz nusxa" (ichiga joylashtirilgan obyektlar mos yozuvlar bo'yicha ko'chiriladi) yoki "chuqur klonlash" funksiyasi "structuredClone" klonlashni amalga oshirish uchun `Object.assign` dan foydalanishimiz yoki maxsus funksiyadan foydalanishimiz mumkin, masalan, [_.cloneDeep(obj)](https://lodash.com/docs#cloneDeep).