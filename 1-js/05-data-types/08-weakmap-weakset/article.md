# WeakMap va WeakSet

<info:garbage-collection> bo'limidan ma'lumki, JavaScript dvigateli xotiradan qiymatni "olish mumkin" va undan foydalanish mumkin bo'lgan holatda saqlaydi. 

Masalan:

```js
let john = { name: "John" };

// obyektga kirish mumkin, John uning havolasi

// havolaning ustiga yozing

john = null;

*!*
// obyekt xotiradan o'chiriladi
*/!*
```
Odatda obyekt xususiyatlari, array elementlari yoki boshqa ma'lumotlar strukturasidan foydalanish mumkin hisoblanadi va ma'lumotlar strukturasi xotirada bo'lganda xotirada saqlanadi.

Misol uchun, agar biz obyektni massivga qo'ysak, u holda massiv tirik bo'lsa ham, unga boshqa havolalar bo'lmasa-da, obyekt ham tirik bo'ladi.

Quyidagicha:

```js
let john = { name: "John" };

let array = [ john ];

john = null; // havolaning ustiga yozing

*!*
// avval John tomonidan havola qilingan obyekt massiv ichida saqlanadi
// shuning uchun u axlat yig'ilmaydi
// biz uni massiv [0] sifatida olishimiz mumkin
*/!*
```

Shunga o'xshab, agar biz obyektni oddiy `Map` da kalit sifatida ishlatsak, `Map` mavjud bo'lsa, u ham mavjud. U xotirani egallaydi va axlat yig'ilmasligi mumkin.

Masalan:

```js
let john = { name: "John" };

let map = new Map();
map.set(john, "...");

john = null; // havolaning ustiga yozing

*!*
// Jon xaritada saqlanadi,
// Biz buni map.keys() yordamida olishimiz mumkin.
*/!*
```

`WeakMap` bu borada tubdan farq qiladi. Bu asosiy obyektlarning axlat yig'ilishiga to'sqinlik qilmaydi.

Keling, misollarda nimani anglatishini ko'rib chiqaylik.

## WeakMap

`Map` va `WeakMap` o'rtasidagi birinchi farq shundaki, kalitlar primitiv qiymatlar emas, balki obyektlar bo'lishi kerak:

```js run
let weakMap = new WeakMap();

let obj = {};

weakMap.set(obj, "ok"); // yaxshi ishlaydi (obyekt kaliti)

*!*
// string kalit sifatida ishlata olmaydi
weakMap.set("test", "Whoops"); // Xato, chunki "test" obyekt emas
*/!*
```

Agar obyektni kalit sifatida ishlatsak va bu obyektga boshqa havolalar bo'lmasa, u avtomatik ravishda xotiradan (va xaritadan) o'chiriladi.

```js
let john = { name: "John" };

let weakMap = new WeakMap();
weakMap.set(john, "...");

john = null; // havolaning ustiga yozing

// John xotiradan olib tashlandi!
```

Uni yuqoridagi oddiy `Map` misoli bilan solishtiring. Endi agar `John` faqat `WeakMap` kaliti sifatida mavjud bo'lsa, u avtomatik ravishda xaritadan (va xotiradan) o'chiriladi.

`WeakMap` iteratsiya va `keys()`, `values()`, `entries()` usullarini qo'llab-quvvatlamaydi, shuning uchun undan barcha kalit yoki qiymatlarni olishning imkoni yo`q.

`WeakMap` faqat quyidagi usullarga ega:

- `weakMap.get(key)`
- `weakMap.set(key, value)`
- `weakMap.delete(key)`
- `weakMap.has(key)`

Nega bunday cheklov bor? Bu cheklovlar texnik sabablarga ko'ra mavjud. Agar obyekt boshqa barcha havolalarni yo'qotgan bo'lsa (masalan, yuqoridagi koddagi "John"), unda avtomatik ravishda axlat yig'ilishi kerak. Lekin texnik jihatdan _tozalash qachon sodir bo'lishi_ aniq belgilanmagan.

JavaScript dvigateli buni hal qiladi. U xotirani darhol tozalashi, ko'proq o'chirish sodir bo'lganda tozalashni kutishi yoki keyinroq bajarishni tanlashi mumkin. Shunday qilib, texnik jihatdan `WeakMap` ning joriy elementlari soni ma'lum emas. Dvigatel uni tozalagan, bu ishni qilmagan yoki qisman qilgan bo'lishi mumkin. Shu sababli, barcha kalitlarga/qiymatlarga kirish usullari qo'llab-quvvatlanmaydi.

Endi bunday ma'lumotlar tuzilmasi bizga qayerda kerak bo'ladi?

## Foydalanish holati: qo'shimcha ma'lumotlar

`WeakMap` qo'llanilishining asosiy sohasi _qoʻshimcha maʼlumotlarni saqlash_ hisoblanadi.

Agar biz boshqa kodga, hatto uchinchi tomon kutubxonasiga "tegishli" obyekt bilan ishlayotgan va u bilan bog'langan ba'zi ma'lumotlarni saqlamoqchi bo'lsak, ular faqat obyekt tirik bo'lganda mavjud bo'lishi kerak - u holda aynan `WeakMap` bizga yordam bera oladi.

Obyektni kalit sifatida ishlatib, `WeakMap` ga ma'lumotlarni joylashtiramiz va obyektga axlat yig'ilganda, bu ma'lumotlar ham avtomatik ravishda yo'qoladi.

```js
weakMap.set(john, "maxfiy hujjatlar");
// agar John o'lsa, maxfiy hujjatlar avtomatik ravishda yo'q qilinadi
```

Keling, bir misolni ko'rib chiqaylik.

Masalan, bizda foydalanuvchilar uchun tashriflar sonini saqlaydigan kod mavjud. Ma'lumotlar xaritada saqlanadi: foydalanuvchi obyekti kalit, tashriflar soni esa qiymatdir. Foydalanuvchi tark etganda (uning obyektida axlat yig'iladi), biz ularning tashriflari sonini saqlashni xohlamaymiz.

Quyida `Map` yordamida hisoblash funksiyasiga misol keltirilgan:

```js
// 📁 visitsCount.js
let visitsCountMap = new Map(); // map: user => tashriflar hisobga olinadi

// tashriflar sonini oshirish
function countUser(user) {
  let count = visitsCountMap.get(user) || 0;
  visitsCountMap.set(user, count + 1);
}
```

Va bu kodning yana bir qismi, ehtimol uni ishlatadigan boshqa fayl:

```js
// 📁 main.js
let john = { name: "John" };

countUser(john); // tashriflarini hisoblash

// keyin John bizni tark etadi
john = null;
```

Endi `john` obyektida axlat yig'ilishi kerak, lekin u xotirada qoladi, chunki u `visitsCountMap` ning kaliti hisoblanadi.

Biz foydalanuvchilarni o'chirishda `visitsCountMap` ni tozalashimiz kerak, aks holda u xotirada cheksiz o'sib boraverdi. Bunday tozalash murakkab arxitekturada zerikarli vazifaga aylanishi mumkin.

Buning o'rniga `WeakMap` ga o'tish orqali bu muammoning oldini olishimiz mumkin:

```js
// 📁 visitsCount.js
let visitsCountMap = new WeakMap(); // weakmap: user => tashriflar soni

// tashriflar sonini oshirish
function countUser(user) {
  let count = visitsCountMap.get(user) || 0;
  visitsCountMap.set(user, count + 1);
}
```

Endi biz `visitsCountMap` ni tozalashimiz shart emas. `John` obyektiga yetib bo'lmaydigan holga kelgandan so'ng, `WeakMap` kaliti bundan mustasno, u `WeakMap` dan ushbu kalit ma'lumotlari bilan birga xotiradan o'chiriladi.

## Foydalanish holati: keshlash (caching)

Yana bir keng tarqalgan misol keshlashdir. Biz funksiyadan natijalarni ("kesh") saqlashimiz mumkin, shunda bir xil obyekt uchun kelajakdagi chaqiruvlar uni qayta ishlatishi mumkin.

Bunga erishish uchun biz `Map` dan foydalanishimiz mumkin (optimal ssenariy emas):

```js run
// 📁 cache.js
let cache = new Map();

// hisoblang va natijani eslang
function process(obj) {
  if (!cache.has(obj)) {
    let result = obj /* uchun natijalarni hisoblash */ ;

    cache.set(obj, result);
  }

  return cache.get(obj);
}

*!*
// Endi biz boshqa faylda process() dan foydalanamiz:
*/!*

// 📁 main.js
let obj = {/* deylik, bizda obyekt bor */};

let result1 = process(obj); // hisoblandi

// ...keyinroq, kodning boshqa joyidan...
let result2 = process(obj); // keshdan olingan eslab qolingan natija

// ...keyinroq, obyektga kerak bo'lmaganda:
obj = null;

alert(cache.size); // 1 (Voy! Obyekt hali ham keshda, xotirada joy egallaydi!)
```

Xuddi shu obyekt bilan bir nechta `process(obj)` chaqiruvlari uchun u faqat birinchi marta natijani hisoblab chiqadi va keyin uni `cache` dan oladi. Salbiy tomoni shundaki, agar obyektga kerak bo'lmasa, biz `cache` ni tozalashimiz kerak.

Agar `Map` ni `WeakMap` bilan almashtirsak, bu muammo yo'qoladi. Obyekt axlat yig'ilgandan so'ng keshlangan natija avtomatik ravishda xotiradan o'chiriladi.

```js run
// 📁 cache.js
*!*
let cache = new WeakMap();
*/!*

// hisoblang va natijani eslang
function process(obj) {
  if (!cache.has(obj)) {
    let result = obj /* uchun natijani hisoblang */;

    cache.set(obj, result);
  }

  return cache.get(obj);
}

// 📁 main.js
let obj = {/* ba'zi obyekt */};

let result1 = process(obj);
let result2 = process(obj);

// ...keyinchalik, obyekt endi kerak bo'lmaganda:
obj = null;

// cache.size faylini ololmadi, chunki u WeakMap,
// lekin u 0 yoki tez orada 0 bo'ladi
// Objda axlat yig'ilganda keshlangan ma'lumotlar ham o'chiriladi
```

## WeakSet

`WeakSet` xuddi shunday harakat qiladi:

- Bu `Set` ga o'xshaydi, lekin biz faqat `WeakSet` ga obyektlarni qo'shishimiz mumkin (primitivlarni emas).
- Obyekt to'plamda mavjud bo'lib, unga boshqa joydan kirish mumkin.
- `Set` kabi, u `add`, `has` va `delete`ni qo'llab-quvvatlaydi, lekin `size`, `keys()`ni va hech qanday takrorlashlarni qo'llab-quvvatlamaydi .

"Zaif" bo'lishiga qaramasdan, u qo'shimcha saqlash vazifasini ham bajaradi. Lekin o'zboshimcha ma'lumotlar uchun emas, balki "ha/yo'q" faktlari uchun. `WeakSet` ga a'zolik obyekt haqida muhim narsani anglatishi mumkin.

Masalan, saytimizga tashrif buyurganlarni kuzatib borish uchun foydalanuvchilarni `WeakSet`ga qo'shishimiz mumkin:

```js run
let visitedSet = new WeakSet();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

visitedSet.add(john); // John bizga tashrif buyurdi
visitedSet.add(pete); // Keyin Pete
visitedSet.add(john); // Yana John

// visitedSet da hozirda 2 ta foydalanuvchi bor

// John tashrif buyurganligini tekshirish?
alert(visitedSet.has(john)); // true

// Mary tashrif buyurganligini tekshirish?
alert(visitedSet.has(mary)); // false

john = null;

// visitedSet avtomatik ravishda tozalanadi
```

`WeakMap` va `WeakSet` ning eng ko'zga ko'ringan cheklovi - bu iteratsiyalarning yo'qligi va barcha joriy tarkibni olishning mumkin emasligi. Bu noqulay bo'lib ko'rinishi mumkin, lekin `WeakMap/WeakSet` asosiy vazifasini bajarishiga to'sqinlik qilmaydi -- boshqa joyda saqlanadigan/boshqariladigan obyektlar uchun ma'lumotlarni "qo'shimcha" saqlash imkoni mavjud.

## Xulosa

`WeakMap` bu `Map` ga o'xshash to'plam bo'lib, u faqat obyektlarga kalit sifatida ruxsat beradi va boshqa vositalar bilan kirish imkoni bo`lmaganda ularni tegishli qiymatlari bilan birga olib tashlaydi.

`WeakSet` bu `Set`ga o'xshash to'plam bo'lib, u faqat obyektlarni saqlaydi va boshqa vositalar bilan kirish imkoni bo`lmaganda ularni olib tashlaydi.

Ularning asosiy afzalliklari shundaki, ular obyektlarning zaif havolasiga ega, shuning uchun ularni axlat yig'uvchi tomonidan osongina olib tashlash mumkin.

Bu `clear`, `size`, `keys`, `values`ni qo'llab-quvvatlamaslik evaziga keladi...

`WeakMap` va `Weakset` "asosiy" obyektni saqlashdan tashqari "ikkilamchi" ma'lumotlar tuzilmalari sifatida ishlatiladi. Obyekt asosiy xotiradan olib tashlangandan so'ng, u faqat `WeakMap` yoki `WeakSet` kaliti sifatida topilsa, u avtomatik ravishda tozalanadi.
