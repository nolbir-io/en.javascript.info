
# Symbol (belgi) turlari

Spetsifikatsiyaga ko'ra, faqat ikkita ibtidoiy tur ob'ekt mulk kalitlari sifatida xizmat qilishi mumkin:

string turi yoki
belgi turi.

Aks holda, raqam kabi boshqa turdan foydalansa, u avtomatik ravishda satrga o'zgartiriladi. Demak, `obj[1]` `obj["1"]` va `obj[true]` `obj["true"]` bilan bir xil.

Hozirgacha biz faqat strings ishlatib kelganmiz.

Endi ramzlarni o'rganamiz, ular biz uchun nima qilishi mumkinligini ko'rib chiqamiz.

## Symbollar

"Symbol" noyob aniqlovchini ifodalaydi.

Ushbu turdagi qiymat `Symbol()` yordamida yaratilishi mumkin:

```js
// id yangi Symboldir
let id = Symbol();
```

Ushbu turdagi qiymat Symbol() yordamida yaratilishi mumkin:
Yaratilgandan so'ng, biz belgilarga tavsif berishimiz mumkin (simvol nomi ham deyiladi), asosan debugging qilish uchun foydalidir:

```js
// id - "id" tavsifiga ega Symbol
let id = Symbol("id");
```

Symbol o'ziga xos bo'lishi kafolatlanadi. Hatto bir xil tavsif bilan ko'plab Symbol yaratsak ham, ular har xil qiymatda bo'ladi. Tavsif shunchaki yorliq bo'lib, hech narsaga ta'sir qilmaydi.

Misol uchun, bu yerda bir xil tavsifga ega ikkita symbol bor - ular teng emas:

```js run
let id1 = Symbol("id");
let id2 = Symbol("id");

*!*
alert(id1 == id2); // false
*/!*
```

Agar Ruby yoki qandaydir "symbol"lari bo'lgan boshqa bir til bilan tanish bo'lsangiz -- yanglishmang. JavaScript belgilari biroz boshqacha.

````warn header="Symbol lar avtomatik ravishda string ga aylantirilmaydi"
JavaScript dagi aksariayat qiymatlar string ga yashirin o'tishni qo'llaydi. Misol uchun, biz deyarli barcha qiymatni `alert` qila olamiz va bu ishlaydi. Symbol lar maxsusdir. Ular avtomatik ravishda o'zgarmaydi. 

Xulosa qilib aytganda, belgi ixtiyoriy tavsifga ega bo'lgan "ibtidoiy noyob qiymat" dir. Keling, ularni qayerda ishlatishimiz mumkinligini ko'rib chiqaylik.

Misol uchun, ushbu `alert` xatolikni ko'rsatib beradi:

```js run
let id = Symbol("id");
*!*
alert(id); // TypeError: Symbol qiymatni string ga aylantirib bo'lmaydi
*/!*
```

Bu chalkashlikllarni oldini olish uchun "language guard" (til qo'riqchisi) dir, chunki string va symbol lar tubdan farq qiladi va ular tasodifan bir-biriga aylantirilmasligi kerak.

Agar symbol ni ko'rsatmoqchi bo'lsak, unda `.toString()` ni quyidagi kabi ochiq tarzda chaqirishimiz kerak bo'ladi:

```js run
let id = Symbol("id");
*!*
alert(id.toString()); // Symbol(id), endi u ishlaydi
*/!*
```
Yoki faqat tavsifni ko'rsatish uchun "symbol.description" xususiyatini olinadi:

```js run
let id = Symbol("id");
*!*
alert(id.description); // id
*/!*
```

````

## "Hidden" (Yashirin) xususiyatlar

Symbollar bizga obyektning "yashirin" xususiyatlarini yaratishga imkon beradi, kodning boshqa hech bir qismi ularga tasodifan kira olmaydi yoki qayta yozmaydi.

Misol uchun, agar `user` obyektlaridan foydalanayotgan bo'lsak, ular uchinchi qism kodiga tegishli. Biz ularga aniqlovchilarni qo'shmoqchimiz.

Buning uchun symbol kalitidan foydalanamiz:

```js run
let user = { // boshqa kodga tegishli
  name: "John"
};

let id = Symbol("id");

user[id] = 1;

alert( user[id] ); // Ma'lumotlarga symbol dan kalit sifatida foydalanib kirish mumkin
```

`Symbol("id")` `id` qatoridan foydalanishning nima foydasi bor?

`user` obyektlari boshqa kod bazasiga tegishli bo'lganligi sababli, ularga maydonlar qo'shish xavfsiz emas, chunki biz ushbu boshqa kod bazasida oldindan belgilangan xatti-harakatlarga ta'sir qilishimiz mumkin. Biroq, belgilarga tasodifan kirish mumkin emas. Uchinchi tomon kodi yangi belgilangan belgilardan xabardor bo'lmaydi, shuning uchun `user` obyektlariga belgilar qo'shish xavfsizdir.

Bundan tashqari, boshqa skript o'z maqsadlari uchun `user` ichida o'z identifikatoriga ega bo'lishni xohlayotganini tasavvur qiling.

Keyin bu skript o'zining `Symbol("id")` sini yaratishi mumkin, masalan:

```js
// ...
let id = Symbol("id");

user[id] = "Their id value";
```

Bizning va ularning identifikatorlari o'rtasida hech qanday ziddiyat bo'lmaydi, chunki symbol lar bir xil nomga ega bo'lsa ham, har doim farq qiladi.

...Ammo bir xil maqsad uchun symbol o'rniga `"id"` string idan foydalansak, bu yerda ziddiyat *yuzaga  kelardi*:
```js
    
let user = { name: "John" };

// Bizning skriptimiz "id" xususiyatidan foydalanadi
user.id = "Our id value";

// ...Boshqa skript ham o'zining maqsadlari uchun "id" dan foydalanishni xohlaydi... 

user.id = "Their id value"   
// Bom! boshqa skript tomonidan yozilgan!
```

### Obyekt harfidagi symbol lar

Agar biz `{...}` obyektida symboldan foydalanmoqchi bo'lsak, uning atrofida kvadrat qavslar kerak.

Shunga o'xshash:

```js
let id = Symbol("id");

let user = {
  name: "John",
*!*
  [id]: 123 // "id" emas: 123
*/!*
};
```
Buning sababi, kalit sifatida bizga "id" string emas, balki "id" o'zgaruvchisi qiymati kerak.

### Symbols for..in tomonidan tashlab ketiladi 

Symbolic xususiyatlar `for..in` siklida qatnashmaydi.

Misol uchun:
```js run
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123
};

*!*
for (let key in user) alert(key); // ism, yosh (symbol larsiz)
*/!*

// symbol orqali to'g'ridan to'g'ri kirish ishlaydi
alert( "Direct: " + user[id] ); // Direct: 123

```

[Object.keys(user)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) ham ularga e'tibor bermaydi. Bu umumiy "symbolic xususiyatlarni yashirish" tamoyilining bir qismidir. Agar boshqa skript yoki kutubxona obyektimiz ustidan aylansa, u kutilmaganda symbolic xususiyatga kira olmaydi.

Bundan farqli ravishda, [Object.assign](mdn:js/Object/assign) ham string, ham symbol xususiyatlarini nusxalaydi:
```js run
let id = Symbol("id");
let user = {
  [id]: 123
};

let clone = Object.assign({}, user);

alert( clone[id] ); // 123
```

Bu yerda hech qanday paradoks yo'q, bu holat shunchki dizayn bilan bog'liq. G'oya shundan iboratki, obyektni klonlash yoki obyektlarni birlashtirishda, biz odatda *barcha* xususiyatlarni (jumladan, `id` kabi symbol larni) ham nusxalashni xohlaymiz.

## Global symbol lar

Ko'rib turganimizdek, odatda barcha belgilar bir xil nomga ega bo'lsa ham, har xil bo'ladi. 
Ammo ba'zida biz bir xil nomdagi belgilar bir xil obyektlar bo'lishini xohlaymiz. Masalan, ilovamizning turli qismlari aynan bir xil xususiyatni anglatuvchi `id` belgisiga kirishni xohlaydi.

Bunga erishish uchun *global symbol registr*i mavjud. Unda symbol lar yaratib, ularga keyinroq kirsa bo'ladi va u bir xil nom bilan qayta-qayta kirirish ayni bir xil symbolga qaytishni kafolatlaydi. 

Ro'yxatga olish kitobidan belgini o'qish (agar yo'q bo'lsa yaratiladi) uchun `Symbol.for(key)` dan foydalaning.

Ushbu chaqiruv global registrni tekshiradi va agar `key` sifatida tasvirlangan symbol bo'lsa, uni qaytaradi, aks holda yangi `Symbol(key)` symbolni yaratadi va uni berilgan `key` bo'yicha registrda saqlaydi.

Masalan:

```js run
// global registrdan o'qing
let id = Symbol.for("id"); // agar symbol mavjud bo'lmasa, u yaratiladi

// uni yana o'qing (kodning boshqa qismidan bo'lishi mumkin)
let idAgain = Symbol.for("id");

// bir xil symbol
alert( id === idAgain ); // true
```

Ro'yxatga olish ichidagi symbol lar *global symbollar* deb ataladi. Agar biz kodning hamma joyidan foydalanish mumkin bo'lgan keng ko'lamli dastur symbol ga ega bo'lishni istasak - ular aynan shu maqsadda  ishlatiladi.

```smart header="Bu Rubyga o'xshab ketadi"
Ruby kabi ba'zi dasturlash tillarida har bir nom uchun bitta symbol mavjud.

JavaScript-da, biz ko'rib turganimizdek, bu global symbol lar uchun to'g'ri.

```

### Symbol.keyFor

Global symbol lar uchun nafaqat `Symbol.for(key)` nomi bilan symbol ni qaytaradi, balki teskari chaqiruv ham mavjud: `Symbol.keyFor(sym)`, bu teskari harakatni amalga oshiradi: nomni global symbol bilan qaytaradi.

Misol uchun:
```js run
// name bilan symbol ni oling
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// nameni symbol bilan oling
alert( Symbol.keyFor(sym) ); // name
alert( Symbol.keyFor(sym2) ); // id
```

`Symbol.keyFor` symbol kalitini qidirish uchun global symbol lar registridan ichki ravishda foydalanadi. Shunday uchun, u global bo'lmagan belgilar uchun ishlamaydi. Agar belgi global bo'lmasa, uni topa olmaydi va `undefined` ga qaytadi.

Ammo, har qanday symbol lar ham `description` xususiyatiga ega.

Misol uchun:

```js run
let globalSymbol = Symbol.for("name");
let localSymbol = Symbol("name");

alert( Symbol.keyFor(globalSymbol) ); // name, global symbol
alert( Symbol.keyFor(localSymbol) ); // undefined, global emas

alert( localSymbol.description ); // nom
```

## System symbol lar

JavaScriptda ichki tarzda foydalaniladigan ko'plab "tizim" symbol lari mavjud va biz ulardan obyektlarimizning turli tomonlarini nozik sozlashda foydalanishimiz mumkin.

Ular [Well-known symbols](https://tc39.github.io/ecma262/#sec-well-known-symbols) jadvalidagi spesifikatsiyada keltirilgan:

- `Symbol.hasInstance`
- `Symbol.isConcatSpreadable`
- `Symbol.iterator`
- `Symbol.toPrimitive`
- ...va boshqalar.

Misol uchun, `Symbol.toPrimitive` bizga obyektni primitiv konvertatsiya qilishni tasvirlash imkonini beradi. Tez orada uning ishlatilishini ko'ramiz.

Tegishli til xususiyatlarini o'rganganimizda boshqa symbol lar ham tanish bo'lib qoladi.

## Xulosa

`Symbol` noyob identifikatorlar uchun primitiv tur hisoblanadi.

Belgilar ixtiyoriy tavsif (nom) bilan `Symbol()` chaqiruvi bilan yaratiladi.

Belgilar bir xil nomga ega bo'lishiga qaramay, har doim turli xil qiymatlardir. Agar bir xil nomdagi belgilar teng bo'lishini istasak, u holda global registrdan foydalanishimiz kerak: `Symbol.for(key)` nom sifatida `key` bilan global symbolni qaytaradi (agar kerak bo'lsa yaratadi).`Symbol.for` ning bir xil  `key` bilan bir nechta chaqiruvlari aynan bir xil belgini qaytaradi.

Symbol lar ikkita asosiy foydalanish holatiga ega:

1. "Yashirin" obyekt xususiyatlari.
   Agar biz boshqa skript yoki kutubxonaga "tegishli" obyektga xususiyat qo'shmoqchi bo'lsak, biz symbol yaratishimiz va uni property key (xususiyat kaliti) sifatida ishlatishimiz mumkin. Symbolic xususiyat `for..in` da ko'rinmaydi, shuning uchun u boshqa xususiyatlar bilan birga tasodifan qayta jarayondan o'tishi mumkin emas. Bundan tashqari, unga to'g'ridan-to'g'ri kirish imkoni mavjud emas, chunki boshqa skriptda bizning symbol yo'q. Xususiyat tasodifiy foydalanish yoki qayta yozishdan himoyalangan bo'ladi.

  O'zimizga kerak bo'lgan narsalarni "yashirincha" yashira olamiz, lekin symbolic xususiyatlardan foydalanib, boshqalar ko'rmasligi kerak. 

2. JavaScriptda `Symbol.*` sifatida foydalanish mumkin bo'lgan ko'plab tizim belgilari mavjud. Ulardan ba'zi o'rnatilgan xatti-harakatlarni o'zgartirish uchun foydalanish mumkin. Misol uchun, qo'llanmaning keyingi qismida, [iterables](info:iterable) uchun `Symbol.iterator` dan, [object-to-primitive conversion](info:object-toprimitive) ni ishga tushirish uchun `Symbol.toPrimitive` dan foydalanamiz va boshqalar.

Texnik jihatdan symbollar 100% yashiringan bo'ladi. Bizga barcha symbollarni olish imkonini beruvchi [Object.getOwnPropertySymbols(obj)](mdn:js/Object/getOwnPropertySymbols) ichki o'rnatilgan uslub mavjud. Yana, object symbollarni ham o'z ichiga olgan *barcha* keylarni qaytaruvchi [Reflect.ownKeys(obj)](mdn:js/Reflect/ownKeys) deb atalgan uslub mavjud. Shunday ekan, ular unchalik ham yashirin emas. Lekin ko'plab kutubxonalar, ichki o'rnatilgan funksiyalar va sintaksis tuzilmalar bu uslublardan foydalanmaydilar.

