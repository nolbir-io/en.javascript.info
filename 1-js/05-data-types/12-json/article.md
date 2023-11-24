# JSON metodlari, toJSON

Aytaylik, bizda murakkab obyekt bor va biz uni satrga aylantirmoqchimiz, uni tarmoq orqali jo'natish yoki ro'yxatga olish maqsadida chiqarishni istaymiz.

Tabiiyki, bunday satr barcha muhim xususiyatlarni o'z ichiga olishi kerak.

Biz konvertatsiyani quyidagicha amalga oshirishimiz mumkin:

```js run
let user = {
  name: "John",
  age: 30,

*!*
  toString() {
    return `{name: "${this.name}", age: ${this.age}}`;
  }
*/!*
};

alert(user); // {name: "John", age: 30}
```

...Ammo rivojlanish jarayonida yangi xususiyatlar qo'shiladi, eski xususiyatlar o'zgartiriladi va olib tashlanadi. Bunday `toString` ni har safar yangilash og'riqli bo'lishi mumkin. Biz undagi xususiyatlarni aylanib chiqishga harakat qilamiz, lekin agar obyekt murakkab bo'lsa va xususiyatlarda ichki obyektlar bo'lsachi? Biz ularning konvertatsiyasini ham amalga oshirishimiz lozim.

Yaxshiyamki, bularning barchasini hal qilish uchun kod yozishning hojati yo'q. Bu muammo allaqachon hal qilingan.

## JSON.stringify

[JSON](https://en.wikipedia.org/wiki/JSON) (JavaScript Object Notation) qiymatlar va obyektlarni ifodalash uchun umumiy formatdir. U [RFC 4627](https://tools.ietf.org/html/rfc4627) standartida tasvirlangan. Dastlab u JavaScript uchun yaratilgan, ammo boshqa ko'plab tillarda ham uni boshqarish uchun kutubxonalar mavjud. Shunday qilib, mijoz JavaScriptdan foydalansa va server Ruby/PHP/Java/Whatever da yozilgan bo'lsa, ma'lumotlar almashinuvi uchun JSONdan foydalanish oson.

JavaScript quyidagi metodlarni taqdim etadi:

- `JSON.stringify` obyektlarni JSONga aylantiradi.
- `JSON.parse` JSONni yana obyektga aylantiradi.

Masalan, biz student (talaba) ni `JSON.stringify` qilamiz:

```js run
let student = {
  name: 'John',
  age: 30,
  isAdmin: false,
  courses: ['html', 'css', 'js'],
  spouse: null
};

*!*
let json = JSON.stringify(student);
*/!*

alert(typeof json); // bizda endi string bor!

alert(json);
*!*
/* JSON-encoded object:
{
  "name": "John",
  "age": 30,
  "isAdmin": false,
  "courses": ["html", "css", "js"],
  "spouse": null
}
*/
*/!*
```

`JSON.stringify(student)` usuli obyektni oladi va uni satrga aylantiradi.

Olingan json qatori _JSON-kodlangan_ yoki _seriyalashtirilgan_ yoki _stringlashtirilgan_ yoki _marshalllangan_ obyekt deb ataladi. Biz uni sim orqali yuborishga yoki oddiy ma'lumotlar do'koniga joylashtirishga tayyormiz.

E'tibor bering, JSON-kodlangan obyekt obyekt literalidagi bir nechta muhim farqlarga ega:

- Sstringlar qo'sh tirnoqlardan foydalanadi. JSONda bitta qo'shtirnoq yoki teskari belgi yo'q. Shunday qilib, `'John'` `"John"` ga aylanadi.
- Obyekt xossalari nomlari ham ikkita qo'shtirnoqli. Bunday usulda yozish majburiy. Shunday qilib, `age: 30` `"age": 30` ga aylanadi.

`JSON.stringify` primitivlar bilan ham qo'llanilishi mumkin.

JSON quyidagi ma'lumotlar turlarini qo'llab-quvvatlaydi:

- Obyektlar `{ ... }`
- Massivlar `[ ... ]`
- Primitivlar:
  - stringlar,
  - raqamlar,
  - boolean qiymatlar `true/false`,
  - `null`.

Masalan:

```js run
// JSONdagi raqam shunchaki raqamdir
alert(JSON.stringify(1)); // 1

// JSONdagi satr hali ham satr, lekin ikkita qo'shtirnoqli
alert(JSON.stringify("test")); // "test"

alert(JSON.stringify(true)); // true

alert(JSON.stringify([1, 2, 3])); // [1,2,3]
```

JSON faqat tilga emas, balki ma'lumotlarga ham bog'liq bo'lgan spetsifikatsiyadir, shuning uchun JavaScriptga xos bo'lgan ba'zi obyekt xususiyatlari `JSON.stringify` tomonidan o'tkazib yuboriladi.

Ya'ni:

- Funksiya xususiyatlari (metodlari).
- Ramziy kalitlar va qiymatlar.
- `Undefined`ni saqlaydigan xususiyatlar.

```js run
let user = {
  sayHi() {
    // e'tiborga olinmagan
    alert("Hello");
  },
  [Symbol("id")]: 123, // e'tiborga olinmagan
  something: undefined, // e'tiborga olinmagan
};

alert(JSON.stringify(user)); // {} (bo'sh obyekt)
```

Odatda bu yaxshi. Agar bu biz xohlagan narsa bo'lmasa, tez orada jarayonni qanday sozlashni ko'ramiz.

Ajoyib narsa shundaki, ichki o'rnatilgan obyektlar avtomatik ravishda qo'llab-quvvatlanadi va o'zgartiriladi.

Masalan:

```js run
let meetup = {
  title: "Conference",
*!*
  room: {
    number: 23,
    participants: ["john", "ann"]
  }
*/!*
};

alert( JSON.stringify(meetup) );
/* Butun struktura stringlashtirilgan:
{
  "title":"Conference",
  "room":{"number":23,"participants":["john","ann"]},
}
*/
```

Muhim cheklov: dumaloq havolalar bo'lmasligi kerak.

Maslan:

```js run
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: ["john", "ann"]
};

meetup.place = room;       // uchrashuv ma'lumotnomalari xonasi
room.occupiedBy = meetup; // xona ma'lumotnomalari uchrashuvi

*!*
JSON.stringify(meetup); // Error: aylanma tuzilmani JSON ga aylantirish
*/!*
```

Aylanali havola: `room.occupiedBy` `meetup` va `meetup.place` havolalari `room` sabab konvertatsiya amalga oshmadi:

![](json-meetup.svg)

## Istisno qilish va o'zgartirish: almashtiruvchi (replacer)

`JSON.stringify` ning to'liq sintaksisi:

```js
let json = JSON.stringify(value[, replacer, space])
```

value
: Kodlash uchun qiymat.

replacer
: Kodlash uchun xossalar massivi yoki `function (key, value)` xaritalash (mapping) funksiyasi.

space
: Formatlash uchun foydalanish uchun bo'sh joy miqdori

Ko'pincha `JSON.stringify` faqat birinchi argument bilan ishlatiladi. Ammo agar biz aylanma havolalarni filtrlash kabi almashtirish jarayonini nozik sozlashimiz kerak bo'lsa, biz `JSON.stringify` ning ikkinchi argumentidan foydalanishimiz mumkin.

Unga xossalar massivini uzatsak, faqat shu xossalar kodlanadi.

Masalan:

```js run
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room // uchrashuv ma'lumotnomalari xonasi
};

room.occupiedBy = meetup; // xona ma'lumotnomalari uchrashuvi

alert( JSON.stringify(meetup, *!*['title', 'participants']*/!*) );
// {"title":"Conference","participants":[{},{}]}
```

Bu yerda, ehtimol, biz qattiqqo'llik bilan ish tutmoqdamiz. Xususiyatlar ro'yxati butun obyekt tuzilishiga qo'llaniladi. Shunday qilib, `participants` dagi obyektlar bo'sh qoldi, chunki `name` ro'yxatda yo'q.

Keling, ro'yxatga dumaloq havolaga sabab bo'ladigan `room.occupiedBy` dan tashqari har bir xususiyatni kiritaylik:

```js run
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room // uchrashuv ma'lumotnomalari xonasi
};

room.occupiedBy = meetup; // xona ma'lumotnomalari uchrashuvi

alert( JSON.stringify(meetup, *!*['title', 'participants', 'place', 'name', 'number']*/!*) );
/*
{
  "title":"Conference",
  "participants":[{"name":"John"},{"name":"Alice"}],
  "place":{"number":23}
}
*/
```

Endi `occupiedBy` dan tashqari hamma narsa seriyalashtirildi. Ammo mulklar ro'yxati juda katta.

Yaxshiyamki, biz massiv o'rniga `replacer` (almashtiruvchi) sifatida funksiyadan foydalanishimiz mumkin.

Funksiya har bir `(key, value)` juftligi uchun chaqiriladi va asl qiymati o'rniga ishlatiladigan "almashtirilgan(replaced)" qiymatni qaytarishi lozim yoki qiymat o'tkazib yuborilishi kerak bo'lsa, `undefined` ni qaytarishi mumkin.

Bizning holatda, biz `occupiedBy` dan tashqari hamma narsa uchun `value` ni "bo'lgani kabi" qaytarishimiz mumkin. `OccupiedBy` ni e'tiborsiz qoldirish uchun quyidagi kod "aniqlanmagan"ni qaytaradi:

```js run
let room = {
  number: 23,
};

let meetup = {
  title: "Conference",
  participants: [{ name: "John" }, { name: "Alice" }],
  place: room, // uchrashuv ma'lumotnomalari xonasi
};

room.occupiedBy = meetup; // xona ma'lumotnomalari uchrashuvi

alert(
  JSON.stringify(meetup, function replacer(key, value) {
    alert(`${key}: ${value}`);
    return key == "occupiedBy" ? undefined : value;
  })
);

/* key:almashtiruvchiga keladigan qiymat juftlari:
:             [object Object]
title:        Conference
participants: [object Object],[object Object]
0:            [object Object]
name:         John
1:            [object Object]
name:         Alice
place:        [object Object]
number:       23
occupiedBy: [object Object]
*/
```

Esda tutingki, `replacer` funksiyasi har bir kalit/qiymat juftligini oladi, ichki o'rnatilgan obyektlar va massiv elementlari ham shu jumladan. U rekursiv ravishda qo'llaniladi. `Replacer` ichidagi `this` qiymati joriy xususiyatni o'z ichiga olgan obyektdir.

Birinchi chaqiruv alohida bajariladi. U maxsus "o'rash obyekti" yordamida amalga oshiriladi: `{"": meetup}`. Boshqacha qilib aytganda, birinchi `(kalit, qiymat)` juftligi bo'sh kalitga ega va qiymat butun sifatida maqsadli obyektdir. Shuning uchun yuqoridagi misolda birinchi qatorda `":[object Object]"` yoziladi.

G'oya `replacer` ni iloji boricha ko'proq quvvat bilan ta'minlashdan iborat: agar kerak bo'lsa, hatto butun obyektni tahlil qilish va almashtirish/o'tkazib yuborish imkoniyati mavjud.

## Formatlash: bo'sh joy

`JSON.stringify(value, replacer, space)` ning uchinchi argumenti chiroyli formatlash uchun foydalaniladigan bo'shliqlar soni hisoblanadi.

Ilgari barcha stringlangan obyektlarda chuqurchalar va ortiqcha bo'shliqlar yo'q edi. Obyektni tarmoq orqali jo'natish yaxshi tanlov. `Space` argumentidan chiroyli chiqish uchun foydalaniladi.

Bu yerda `space = 2` JavaScriptga bir nechta satrlarda ichki o'rnatilgan obyektlarni ko'rsatishni aytadi, bunda obyekt ichida 2ta bo'sh joy ajratiladi:

```js run
let user = {
  name: "John",
  age: 25,
  roles: {
    isAdmin: false,
    isEditor: true,
  },
};

alert(JSON.stringify(user, null, 2));
/* 2ta bo'shliqli indent lar:
{
  "name": "John",
  "age": 25,
  "roles": {
    "isAdmin": false,
    "isEditor": true
  }
}
*/

/* JSON.stringify(user, null, 4) uchun natija satr boshidan boshlab yoziladi:
{
    "name": "John",
    "age": 25,
    "roles": {
        "isAdmin": false,
        "isEditor": true
    }
}
*/
```

Uchinchi argument ham string bo'lishi mumkin. Bunda qator bo'shliqlar o'rniga satr boshidan yozilish uchun ishlatiladi.

`space` parametri faqat jurnalga yozish va natija chiroyli chiqishi uchun ishlatiladi.

## Maxsus "toJSON"

Stringni o'zgartirish uchun `toString` kabi, obyekt JSONga o'tkazish uchun `toJSON` usulini taqdim etishi mumkin. Agar mavjud bo'lsa, `JSON.stringify` uni avtomatik ravishda chaqiradi.

Masalan:

```js run
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  date: new Date(Date.UTC(2017, 0, 1)),
  room
};

alert( JSON.stringify(meetup) );
/*
  {
    "title":"Conference",
*!*
    "date":"2017-01-01T00:00:00.000Z",  // (1)
*/!*
    "room": {"number":23}               // (2)
  }
*/
```

Bu yerda biz `date` `(1)` satrga aylanganini ko'rishimiz mumkin. Buning sababi, barcha sanalarda shunday qatorni qaytaradigan o'rnatilgan `toJSON` usuli mavjud.

Keling, `room` `(2)` obyektimiz uchun maxsus `toJSON` qo'shamiz:

```js run
let room = {
  number: 23,
*!*
  toJSON() {
    return this.number;
  }
*/!*
};

let meetup = {
  title: "Conference",
  room
};

*!*
alert( JSON.stringify(room) ); // 23
*/!*

alert( JSON.stringify(meetup) );
/*
  {
    "title":"Conference",
*!*
    "room": 23
*/!*
  }
*/
```

Ko'rib turganimizdek, `toJSON` dan to'g'ridan-to'g'ri `JSON.stringify(room)` chaqiruvi uchun ham, `room` boshqa kodlangan obyektga joylashtirishda ham ishlatiladi.

## JSON.parse

JSON-stringni dekodlash uchun bizga [JSON.parse](mdn:js/JSON/parse) nomli boshqa usul kerak bo'ladi.

Sintaksisi:

```js
let value = JSON.parse(str, [reviver]);
```

str
: Tahlil qilish uchun JSON-string.

reviver
: Har bir `(key, value)` juftligi uchun chaqiriladigan va qiymatni o'zgartira oladigan ixtiyoriy function(key, value).

Masalan:

```js run
// stringli massiv
let numbers = "[0, 1, 2, 3]";

numbers = JSON.parse(numbers);

alert(numbers[1]); // 1
```

Yoki o'rnatilgan obyektlar uchun:

```js run
let userData =
  '{ "name": "John", "age": 35, "isAdmin": false, "friends": [0,1,2,3] }';

let user = JSON.parse(userData);

alert(user.friends[1]); // 1
```

JSON yetarli darajada murakkab, obyektlar va massivlar boshqa obyektlar va massivlarni o'z ichiga olishi mumkin. Lekin ular bir xil JSON formatiga bo'ysunishlari kerak.

Qo'lda yozilgan JSON-dagi odatiy xatolar (ba'zida biz uni tuzatish uchun yozishimiz kerak):

```js
let json = `{
  *!*name*/!*: "John",                     // xato: qo'shtirnoqlarsiz xususiyat nomiz
  "surname": *!*'Smith'*/!*,               // xato: qiymatdagi bitta qo'shtirnoq (ikkita yozilishi kerak)
  *!*'isAdmin'*/!*: false                  // xato: (key) kalitdagi bitta qo'shtirnoq (ikkita yozilishi kerak)
  "birthday": *!*new Date(2000, 2, 3)*/!*, // xato: hech qanday "new" ga ruxsat berilmagan, faqatgina bo'sh qiymatlar
  "friends": [0,1,2,3]              // bu yerda hammasi joyida
}`;
```

Bundan tashqari, JSON sharhlarni qo'llab-quvvatlamaydi. JSONga izoh qo'shish uni yaroqsiz holga keltiradi.

Yana [JSON5](https://json5.org/) nomli format mavjud bo'lib, unda qo'shtirnoqsiz kalitlar, sharhlar va hokazolar mavjud. Lekin bu alohida kutubxona bo'lib, til spetsifikatsiyasida joylashmagan.

Dasturchilar dangasa bo'lgani uchun emas, balki tahlil qilish algoritmni oson, ishonchli va juda tez amalga oshirish imkonini bergani sababli muntazam JSON dan foydalanish majburiy.

## Reviver ishlatish

Tasavvur qiling-a, biz serverdan simli `meetup` obyektini oldik.

Bu quyidagicha ko'rinadi:

```js
// title: (meetup title), date: (meetup date)
let str = '{"title":"Conference","date":"2017-11-30T12:00:00.000Z"}';
```

...Endi esa yana JavaScript obyektiga aylantirish uchun uni _deserialize_ qilishimiz kerak.

Keling, buni `JSON.parse` ni chaqirgan holda bajaramiz:

```js run
let str = '{"title":"Conference","date":"2017-11-30T12:00:00.000Z"}';

let meetup = JSON.parse(str);

*!*
alert( meetup.date.getDate() ); // Error!
*/!*
```

Yo'q! Error!

`meetup.date` qiymati `Date` obyekti emas, balki stringdir. `JSON.parse` bu qatorni `Date` ga aylantirish kerakligini qayerdan bilishi mumkin?

`JSON.parse` ga ikkinchi argument sifatida barcha qiymatlarni qaytaruvchi jonlantirish funksiyasini o'tamiz, lekin `date` `Date`ga aylanadi:

```js run
let str = '{"title":"Conference","date":"2017-11-30T12:00:00.000Z"}';

*!*
let meetup = JSON.parse(str, function(key, value) {
  if (key == 'date') return new Date(value);
  return value;
});
*/!*

alert( meetup.date.getDate() ); // endi ishlaydi!
```

Aytgancha, bu ichki o'rnatilgan obyektlar uchun ham ishlaydi:

```js run
let schedule = `{
  "meetups": [
    {"title":"Conference","date":"2017-11-30T12:00:00.000Z"},
    {"title":"Birthday","date":"2017-04-18T12:00:00.000Z"}
  ]
}`;

schedule = JSON.parse(schedule, function(key, value) {
  if (key == 'date') return new Date(value);
  return value;
});

*!*
alert( schedule.meetups[1].date.getDate() ); // works!
*/!*
```

## Xulosa

- JSON o'zining mustaqil standarti va ko'pgina dasturlash tillari uchun kutubxonalarga ega bo'lgan ma'lumotlar formatidir.
- JSON oddiy obyektlar, massivlar, satrlar, raqamlar, mantiqiy va `null` ni qo'llab-quvvatlaydi.
- JavaScriptni JSONga seriyalashtirish uchun [JSON.stringify](mdn:js/JSON/stringify) va JSONni o'qish uchun [JSON.parse](mdn:js/JSON/parse) usullarini taqdim etadi.
- Ikkala metod ham aqlli o'qish/yozish uchun transformator funktsiyalarini qo'llab-quvvatlaydi.
- Agar obyektda `toJSON` bo'lsa, u `JSON.stringify` tomonidan chaqiriladi.
