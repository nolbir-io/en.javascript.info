# Map va Set

Hozirgacha biz quyidagi murakkab ma'lumotlar tuzilmalari haqida bilib oldik:

- Obyektlar kalitli kolleksiyalarni saqlash uchun ishlatiladi.
- Massivlar esa buyurtma qilingan kolleksiyalarni saqlash uchun ishlatiladi.

Ammo bu haqiqiy hayot uchun yetarli emas. Shuning uchun `Map` va `Set` dan foydalanamiz.

## Map

[Map](mdn:js/Map) Obyekt kabi kalitli ma'lumotlar to'plamidir. Lekin asosiy farq shundaki, `Map` har qanday turdagi kalitlarga ruxsat beradi.

Uning metodlari va xususiyatlari quyidagilardir:

- `new Map()` -- mapni yaratadi.
- [`map.set(key, value)`](mdn:js/Map/set) -- qiymatni kalit orqali saqlaydi.
- [`map.get(key)`](mdn:js/Map/get) -- agar `key` xaritada mavjud bo'lmasa, `undefined` kalit bo'yicha qiymatni qaytaradi.
- [`map.has(key)`](mdn:js/Map/has) -- agar `key` mavjud bo'lsa, `true`, aks holda `false` qiymatini qaytaradi.
- [`map.delete(key)`](mdn:js/Map/delete) -- kalit orqali qiymatni olib tashlaydi.
- [`map.clear()`](mdn:js/Map/clear) -- mapdan hamma narsani olib tashlaydi.
- [`map.size`](mdn:js/Map/size) -- joriy elementlar sonini qaytaradi.

Masalan:

```js run
let map = new Map();

map.set("1", "str1"); // stringli kalit
map.set(1, "num1"); // raqamli kalit
map.set(true, "bool1"); // mantiqiy kalit

// oddiy obyektni eslaysizmi? u kalitlarni stringga aylantiradi
// Map type ni saqlaydi, shuning uchun bu ikkisi farq qiladi:
alert(map.get(1)); // 'num1'
alert(map.get("1")); // 'str1'

alert(map.size); // 3
```

Ko'rib turganimizdek, obyektlardan farqli o'laroq, kalitlar satrlarga aylantirilmaydi. Bu jarayon har qanday turdagi kalit bilan bajarilishi mumkin.

``smart header="`map[key] `Map`ni ishlatishning to'g'ri yo'li emas.`map[key]`ham ishlasa-da, masalan. biz`map[key] = 2`ni o'rnatishimiz mumkin, bu `map`ni oddiy JavaScript obyekti sifatida ko'rib chiqadi, shuning uchun u barcha tegishli cheklovlarni nazarda tutadi (faqat string/simvol tugmachalari va boshqalar).

Shunday qilib, biz `map` usullaridan foydalanishimiz kerak: `set`, `get` va boshqalar.

**Map obyektlardan kalit sifatida ham foydalanishi mumkin.**

Masalan:

```js run
let john = { name: "John" };

// har bir foydalanuvchi uchun ularning tashriflari sonini saqlaylik
let visitsCountMap = new Map();

// John map uchun kalit
visitsCountMap.set(john, 123);

alert(visitsCountMap.get(john)); // 123
```

Obyektlarni kalit sifatida ishlatish `Map` ning eng muhim funksiyalaridan biridir. Xuddi shu narsa `Object` uchun hisobga olinmaydi. `Object` da kalit sifatida string yaxshi, lekin biz `Object` da boshqa `Object` dan kalit sifatida foydalana olmaymiz.

Sinab ko'ramiz:

```js run
let john = { name: "John" };
let ben = { name: "Ben" };

let visitsCountObj = {}; // obyektdan foydalanishga harakat qiling

visitsCountObj[ben] = 234; // Ben obyektini kalit sifatida ishlatishga harakat qiling
visitsCountObj[john] = 123; // kalit sifatida John obyektidan foydalanishga harakat qiling, Ben obyekti almashtiriladi

*!*
// Bu yozilgan!
alert( visitsCountObj["[object Object]"] ); // 123
*/!*
```

`visitsCountObj` obyekt bo'lgani uchun u yuqoridagi `John` va `Ben` kabi barcha `Objectt` tugmachalarini bir xil `"[object Object]"` qatoriga o'zgartiradi. Albatta, bu biz xohlagan narsa emas.

``smart header="`Map`` kalitlarni qanday taqqoslaydi"
Kalitlarni ekvivalentligini tekshirish uchun `Map` [SameValueZero] algoritmidan foydalanadi (https://tc39.github.io/ecma262/#sec-samevaluezero). Bu qat'iy tenglik`===`bilan taxminan bir xil, ammo farq shundaki,`NaN` `NaN`ga teng hisoblanadi. Shunday qilib, `NaN` kalit sifatida ham ishlatilishi mumkin.

Bu algoritmni o'zgartirish yoki sozlash mumkin emas.

`
``smart header=`Chaining`` (zanjirlash) 
Har bir `map.set` qo'ng'irog'i xaritaning o'zini qaytaradi, shuning uchun biz qo'ng'iroqlarni `chaining`, ya'ni zanjirlashimiz mumkin:

```js
map.set("1", "str1").set(1, "num1").set(true, "bool1");
```

````

## Map ustida takrorlash

`Map` bo'ylab aylanish uchun 3 ta usul mavjud:

- [`map.keys()`](mdn:js/Map/keys) -- kalitlar uchun iteratsiyani qaytaradi,
- [`map.values()`](mdn:js/Map/values) -- qiymatlar uchun iteratsiyani qaytaradi,
- [`map.entries()`](mdn:js/Map/entries) -- `[kalit, qiymat]` yozuvlari uchun iteratsiyani qaytaradi, u sukut bo'yicha `for..of` da ishlatiladi.

Masalan:

```js run
let recipeMap = new Map([
  ['cucumber', 500],
  ['tomatoes', 350],
  ['onion',    50]
]);

// kalitlar ustida takrorlash (vegetables)
for (let vegetable of recipeMap.keys()) {
  alert(vegetable); // cucumber, tomatoes, onion
}

// qiymatlar ustidan takrorlash (amounts)
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}

// [kalit, qiymat] yozuvlari ustidan takrorlash
for (let entry of recipeMap) { // retseptMap.entries() bilan bir xil
  alert(entry); // cucumber,500 (va boshqalar)
}
````

` `smart header= `Qo'shish tartibi qo'llaniladi"`
Takrorlash qiymatlar kiritilgan tartibda davom etadi. `Map` oddiy `Object` dan farqli o'laroq, bu tartibni saqlaydi.
``

Bundan tashqari, `Map` da `Array` ga o'xshash o'rnatilgan `forEach` usuli mavjud:

```js
// har bir (kalit, qiymat) juftligi uchun funksiyani ishga tushiradi
recipeMap.forEach((value, key, map) => {
  alert(`${key}: ${value}`); // cucumber: 500 va boshqalar
});
```

## Object.entries: Objectdan Map

`Map` yaratilganda ishga tushirish uchun kalit/qiymat juftlari bilan massivni (yoki boshqa iterativ) o'tkazishimiz mumkin, masalan:

```js run
// array of [key, value] pairs
let map = new Map([
  ["1", "str1"],
  [1, "num1"],
  [true, "bool1"],
]);

alert(map.get("1")); // str1
```

Agar bizda oddiy obyekt bo'lsa va undan `Map` yaratmoqchi bo'lsak, massivni qaytaradigan o'rnatilgan [Object.entries(obj)](mdn:js/Object/entries) metodidan foydalanishimiz mumkin. Bu obyekt uchun kalit/qiymat juftlari qatorini aynan shu formatda qaytaradi. Shunday qilib, biz bunday obyektdan map yaratishimiz mumkin:


```js run
let obj = {
  name: "John",
  age: 30
};

*!*
let map = new Map(Object.entries(obj));
*/!*

alert( map.get('name') ); // John
```

Bu yerda `Object.entries` kalit/qiymat juftliklari massivini qaytaradi: `[ [["ism","Jon"], ["yosh", 30] ]`. `Map`ga aynan shu kerak.

## Object.fromEntries: Mapdan Obyekt

Biz hozirgina `Object.entries(obj)` yordamida oddiy obyektdan `Map`ni qanday yaratishni ko'rib chiqdik.

Buning teskarisini amalga oshiradigan `Object.fromEntries` usuli mavjud: `[kalit, qiymat]` juftlik massivi berilganda, u ulardan obyekt yaratadi:

```js run
let prices = Object.fromEntries([
  ["banana", 1],
  ["orange", 2],
  ["meat", 4],
]);

// endi narxlar = { banana: 1, orange: 2, meat: 4}

alert(prices.orange); // 2
```

Biz `Map` dan oddiy obyektni olish uchun `Object.fromEntries` dan foydalanishimiz mumkin.

Masalan, biz ma'lumotlarni `Map` da saqlaymiz, lekin uni oddiy obyektni kutayotgan uchinchi tomon kodiga o'tkazishimiz kerak.

Buni amalda sinab ko'ramiz:

```js run
let map = new Map();
map.set('banana', 1);
map.set('orange', 2);
map.set('meat', 4);

*!*
let obj = Object.fromEntries(map.entries()); // oddiy obyekt yasash (*)
*/!*

// tayyor!
// obj = { banana: 1, orange: 2, meat: 4 }

alert(obj.orange); // 2
```

`map.entries()` ga chaqiruv qilish `Object.fromEntries` uchun aynan to'g'ri formatda kalit/qiymat juftlarining takrorlanishini qaytaradi.

Biz `(*)` qatorini qisqartirishimiz ham mumkin:

```js
let obj = Object.fromEntries(map); // omit .entries()
```

`Object.fromEntries` argument sifatida takrorlanadigan obyektni kutadi. Massiv bo'lishi shart emas. `Map` uchun standart iteratsiya `map.entries()` bilan bir xil kalit/qiymat juftlarini qaytaradi. Shunday qilib, biz `map` bilan bir xil kalit/qiymatlarga ega oddiy obeyktni olamiz.

## Set

`Set` - bu maxsus turdagi to'plam - `qiymatlar to'plami` (kalitlarsiz), unda har bir qiymat faqat bir marta bo'lishi mumkin.

Uning asosiy metodlari quyidagilardir:

- `new Set(iterable)` -- to'plamni yaratadi va agar `iterable` obyekt taqdim etilsa (odatda massiv), undan qiymatlarni to'plamga ko'chiradi.
- [`set.add(value)`](mdn:js/Set/add) -- qiymat qo'shadi, to'plamning o'zini qaytaradi.
- [`set.delete(value)`](mdn:js/Set/delete) -- qiymatni olib tashlaydi, agar chaqiruv paytida `value` mavjud bo'lsa, `true` qaytaradi, aks holda `false`.
- [`set.has(value)`](mdn:js/Set/has) -- Agar qiymat to'plamda mavjud bo'lsa, `true` qaytaradi, aks holda `false`.
- [`set.clear()`](mdn:js/Set/clear) -- to'plamdan hamma narsani olib tashlaydi.
- [`set.size`](mdn:js/Set/size) -- elementlar sonini hisoblaydi.

Asosiy xususiyat shundaki, bir xil qiymatga ega `set.add(value)` ning takroriy chaqiruvlari hech narsa qilmaydi. Shuning uchun har bir qiymat `Set` da faqat bir marta paydo bo'ladi.

Misol uchun, bizga tashrif buyuruvchilar bor va biz hammani eslashni xohlaymiz. Ammo takroriy tashriflar dublikatlarga olib kelmasligi kerak. Mehmon faqat bir marta "hisoblanishi" kerak.

`Set` buning uchun eng ma'qul tanlov:

```js run
let set = new Set();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

// tashriflar, ba'zi foydalanuvchilar bir necha marta keladi
set.add(john);
set.add(pete);
set.add(mary);
set.add(john);
set.add(mary);

// to'plam faqat noyob qiymatlarni saqlaydi
alert(set.size); // 3

for (let user of set) {
  alert(user.name); // Jon (keyin Pit va Meri)
}
```

`Set` ga muqobil foydalanuvchilar qatori va [arr.find](mdn:js/Array/find) yordamida har bir qo'shishda dublikatlarni tekshirish uchun kod bo'lishi mumkin. Ammo ishlash ancha yomonroq bo'lar edi, chunki bu usul har bir elementni tekshirib, butun massiv bo'ylab yuradi. `Set` o'ziga xoslikni tekshirish uchun ichki tomondan optimallashtirilgan.

## To'plam ustidan takrorlash

Biz to'plamni `for..of` yoki `forEach` yordamida aylantirishimiz mumkin:

```js run
let set = new Set(["oranges", "apples", "bananas"]);

for (let value of set) alert(value);

// forEach bilan bir xil:
set.forEach((value, valueAgain, set) => {
  alert(value);
});
```

Qiziqarli narsaga e'tibor bering. `ForEach` da o'tkazilgan qayta chaqiruv funksiyasi 3 ta argumentga ega: `value`, keyin _bir xil qiymat_ `valueAgain` va keyin maqsadli obyekt. Darhaqiqat, bir xil qiymat argumentlarda ikki marta paydo bo'ladi.

Bu `Map` bilan moslik uchun, bu yerda ``forEach` qayta chaqirish uchta argumentga ega. Bu biroz g'alati ko'rinadi, ammo ma'lum holatlarda `Map` ni `Set` bilan osongina almashtirishga yordam beradi va aksincha.

Iteratorlar uchun `Map` ning bir xil usullari ham qo'llab-quvvatlanadi:

- [`set.keys()`](mdn:js/Set/keys) -- qiymatlar uchun takrorlanadigan obyektni qaytaradi,
- [`set.values()`](mdn:js/Set/values) -- `Map` bilan mosligi uchun `set.keys()` bilan bir xil,
- [`set.entries()`](mdn:js/Set/entries) -- `[qiymat, qiymat]` yozuvlari uchun takrorlanadigan obyektni qaytaradi, `Map` bilan muvofiqligi uchun mavjud.

## Xulosa

`Map` -- kalitli qiymatlar to'plamidir.

Metodlari va xususiyatlari:

- `new Map([iterable])` -- ishga tushirish uchun ixtiyoriy `iterable` (masalan, massiv) `[key, value]` juftliklari bilan xaritani yaratadi.
- [`map.set(key, value)`](mdn:js/Map/set) -- kalit orqali qiymatni saqlaydi, xaritaning o'zini qaytaradi.
- [`map.get(key)`](mdn:js/Map/get) -- Agar `key` xaritada mavjud bo'lmasa, `undefined` kalit bo'yicha qiymatni qaytaradi.
- [`map.has(key)`](mdn:js/Map/has) -- agar `key` mavjud bo'lsa, `true`, aks holda `false` qiymatini qaytaradi.
- [`map.delete(key)`](mdn:js/Map/delete) -- kalit bo'yicha qiymatni olib tashlaydi, agar chaqiruv paytida `key` mavjud bo'lsa, `true` qaytaradi, aks holda `false`.
- [`map.clear()`](mdn:js/Map/clear) -- xaritadan hamma narsani olib tashlaydi.
- [`map.size`](mdn:js/Map/size) -- joriy elementlar sonini qaytaradi.

Oddiy `Objectt` dan farqlari:

- Har qanday kalitlar, obyektlar kalit bo'lishi mumkin.
- Qo'shimcha qulay metodlar, `size` xususiyati.

`Set` -- noyob qiymatlar to'plamidir.

Metodlari va xususiyatlari:

- `new Set([iterable])` -- ishga tushirish uchun ixtiyoriy `iterable` (masalan, massiv) qiymatlar to'plamini yaratadi.
- [`set.add(value)`](mdn:js/Set/add) -- qiymat qo'shadi (agar `value` mavjud bo'lsa, hech narsa qilmaydi), to'plamning o'zini qaytaradi.
- [`set.delete(value)`](mdn:js/Set/delete) -- qiymatni olib tashlaydi, agar chaqiruv paytida `value` mavjud bo'lsa, `true` qaytaradi, aks holda `false`.
- [`set.has(value)`](mdn:js/Set/has) -- Agar qiymat to'plamda mavjud bo'lsa, `true` ni qaytaradi, aks holda `false`.
- [`set.clear()`](mdn:js/Set/clear) -- to'plamdan hamma narsani olib tashlaydi.
- [`set.size`](mdn:js/Set/size) -- elementlar sonini hisoblaydi.

`Map` va `Set` bo'yicha takrorlash har doim qo'shish tartibida bo'ladi, shuning uchun biz bu to'plamlar tartibsiz deb ayta olmaymiz, lekin elementlarni qayta tartiblay olmaymiz yoki to'g'ridan-to'g'ri uning raqami bo'yicha elementni ololmaymiz.

```

```
