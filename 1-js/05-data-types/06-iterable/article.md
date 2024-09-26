# Takrorlanuvchilar (iterables)

_Takrorlanuvchi_ obyektlar massivlarning umumlashtirilishi hisoblanadi. Bu bizga har qanday obyektni `for..of` siklida foydalanishga imkon beradigan tushunchadir.

Albatta, massivlar takrorlanadi. Ammo yana ko'plab o'rnatilgan obyektlar mavjud, ular ham takrorlanadi, masalan, stringlar ham.

Agar obyekt texnik jihatdan massiv bo'lmasa, lekin biror narsaning to'plamini (ro'yxatini) ifodalasa, u holda `for..of` uni aylantirish uchun ajoyib sintaksisdir, shuning uchun uni qanday ishlashini quyida ko'rib chiqamiz.

## Symbol.iterator

Biz o'zimiz takrorlanuvchi yaratib, takrorlanuvchilar haqida osongina tushunishimiz mumkin.

Masalan, bizda massiv bo'lmagan, lekin `for..of` uchun mos keladigan obyekt mavjud.

Raqamlar oralig'ini ifodalovchi `range` obyekti kabi:

```js
let range = {
  from: 1,
  to: 5,
};

// Biz for..of ishlashini xohlaymiz:
// for(let num of range) ... num=1,2,3,4,5
```

`Range` obyektini takrorlanadigan qilish (va shunday qilib `for..of` ishlashiga imkon berish) uchun biz `Symbol.iterator` nomli obyektga usul qo'shishimiz kerak (buning uchun maxsus belgi o'rnatilgan).

1. `For..of` ishga tushganda, u bu metodni bir marta chaqiradi (yoki topilmasa error hisoblanadi). Usul _iterator_ -- `next()` usuliga ega obyektni qaytarishi kerak.
2. Keyinchalik, `for..of` \_faqat o'sha qaytarilgan obyekt bilan ishlaydi.
3. Qachonki `for..of` keyingi qiymatni xohlasa, u obyektda `next()` ni chaqiradi.
4. `Next()` natijasi `{bajarildi: Mantiqiy, qiymat: har qanday}` ko'rinishiga ega bo'lishi kerak, bu yerda `bajarildi=true` sikl tugaganligini bildiradi, aks holda `value` keyingi qiymatdir.

Quyida izohlar bilan `range` uchun to'liq dastur berilgan:

```js run
let range = {
  from: 1,
  to: 5,
};

// 1. for..of chaqiruvi dastlab buni chaqiradi
range[Symbol.iterator] = function () {
  // ...iterator obyektini qaytaradi:
  // 2. Keyin, for..of faqat quyidagi iterator obyekti bilan ishlaydi va undan keyingi qiymatlarni so'raydi
  return {
    current: this.from,
    last: this.to,

    // 3. next() har bir iteratsiyada for..of sikli orqali chaqiriladi
    next() {
      // 4. u qiymatni obyekt sifatida qaytarishi kerak {bajarildi:.., qiymat:...}
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    },
  };
};

// bu endi ishlaydi!
for (let num of range) {
  alert(num); // 1, keyin 2, 3, 4, 5
}
```

Iltimos, takrorlanuvchilarning aloqalarni ajratish kabi asosiy xususiyatiga e'tibor bering:

- `range` o'zida `next()` usuliga ega emas.
- Buning o'rniga `range[Symbol.iterator]()` chaqiruvi orqali `iterator` deb ataladigan boshqa obyekt yaratiladi va takrorlash uchun `next()` qiymatini hosil qiladi.

Shunday qilib, iterator obyekti takrorlanadigan obyektdan alohida ishlaydi.

Texnik jihatdan biz ularni birlashtirib, kodni soddalashtirish uchun iterator sifatida `range` dan foydalanishimiz mumkin.

Misol uchun:

```js run
let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    this.current = this.from;
    return this;
  },

  next() {
    if (this.current <= this.to) {
      return { done: false, value: this.current++ };
    } else {
      return { done: true };
    }
  },
};

for (let num of range) {
  alert(num); // 1, keyin 2, 3, 4, 5
}
```

Endi `range[Symbol.iterator]()` `range` obyektining o'zini qaytaradi: u kerakli `next()` metodiga ega va `this.current` da joriy takrorlanish jarayonini eslab qoladi. Kod qisqaroqmi? Ha. Va ba'zida bu ham yaxshi tanlov.

Salbiy tomoni shundaki, endi obyekt ustida bir vaqtning o'zida ikkita `for..of` sikliga ega bo'lishning iloji yo'q: ular iteratsiya holatini baham ko'radi, chunki faqat bitta iterator - obyektning o'zi. Ammo ikkita parallel for-of kamdan-kam uchraydi, hatto asinxron ssenariylarda ham shunday.

``smart header="Cheksiz iteratorlar"
Cheksiz iteratorlar ham bo'lishi mumkin. Masalan, `range` cheksiz bo'lib,`range.to = Infinity` uchun mo'ljallangan. Yoki biz tasodifiy raqamlarning cheksiz ketma-ketligini hosil qiluvchi takrorlanadigan obyektni yaratishimiz mumkin. Bu foydali usul hisoblanadi.

`next` bo'yicha hech qanday cheklovlar yo'q, u ko'proq va ko'proq qiymatlarni qaytarishi mumkin va normal holat.

Albatta, bunday takrorlanuvchi uchun `for..of` sikli cheksiz bo'ladi. Lekin biz uni har doim `break` yordamida to'xtata olamiz.

``

## String takrorlanadi

Massivlar va stringlar eng ko'p ishlatiladigan o'rnatilgan takrorlanuvchilardir (iterable).

String uchun `for..of` uning belgilarini aylantiradi:

```js run
for (let char of "test") {
  // 4 marta takrorlaydi: har bir belgi uchun bir marta
  alert(char); // t, keyin e, keyin s, keyin t
}
```

Va u surrogat juftliklar bilan to'g'ri ishlaydi!

```js run
let str = "𝒳😂";
for (let char of str) {
  alert(char); // 𝒳, so'ngra 😂
}
```

## Iteratorni aniq chaqirish

Chuqurroq tushunish uchun iteratordan qanday qilib aniq foydalanishni ko'rib chiqamiz.

Biz satrni xuddi `for..of` bilan bir xil tarzda takrorlaymiz, lekin buni to'g'ridan-to'g'ri chaqiruvlar bilan bajaramiz. Ushbu kod string iteratorini yaratadi va undan qiymatlarni "qo'lda" oladi:

```js run
let str = "Hello";

// for (let char of str) alert(char);
// kabi bajaradi

*!*
let iterator = str[Symbol.iterator]();
*/!*

while (true) {
  let result = iterator.next();
  if (result.done) break;
  alert(result.value); // belgilarni birma-bir chiqaradi
}
```

Bu kamdan-kam hollarda kerak bo'ladi, lekin bizga jarayonni `for..of` dan ko'ra ko'proq boshqarish imkonini beradi. Misol uchun, biz iteratsiya jarayonini ajratishimiz mumkin: bir oz takrorlash, keyin to'xtash, boshqa ishni bajarish va keyinroq yana davom etish.

## Takrorlanuvchilar va massivga o'xshashlar [#array-like]

Ikki rasmiy atama bir-biriga o'xshash, ammo juda farq qiladi. Chalkashmaslik uchun ularni yaxshi tushunganingizga ishonch hosil qiling.

- _Takrorlanuvchilar_ yuqorida ta'riflanganidek, `Symbol.iterator` usulini amalga oshiradigan obyektlardir.
- _Masivga o'xshashlar_ - indekslari va `length`, ya'ni uzunligi bo'lgan obyektlar, shuning uchun ular massivlarga o'xshaydi.

JavaScriptni brauzerda yoki boshqa har qanday muhitda amaliy vazifalar uchun ishlatganimizda, takrorlanadigan, massivga o'xshash yoki ikkalasini ham uchratishimiz mumkin.

Masalan, stringlar iterativ (`for..of` ular ustida ishlaydi) va massivga o'xshaydi (ularning raqamli indekslari va `uzunligi` mavjud).

Ammo iteratsiya massivga o'xshamasligi mumkin. Va aksincha, massivga o'xshash takrorlanmasligi mumkin.

Masalan, yuqoridagi misoldagi `range` takrorlanadi, lekin massivga o'xshamaydi, chunki u indekslangan xususiyatga va `length`ga ega emas.

Va quyida massivga o'xshash, lekin takrorlanmaydigan obyekt:

```js run
let arrayLike = { // indekslari va uzunligi => massivga o'xshash
  0: "Hello",
  1: "World",
  length: 2
};

*!*
// Error (Symbol.iterator yo'q)
for (let item of arrayLike) {}
*/!*
```

Takrorlanuvchi va massivga o'xshashlar odatda massiv emas, ularda `push`, `pop` va boshqalar yo'q. Agar bizda bunday obyekt bo'lsa va u bilan massiv bilan ishlashni xohlasak, bu juda noqulay. Masalan, biz massiv usullaridan foydalangan holda `range` bilan ishlashni xohlaymiz. Bunga qanday erishish mumkin?

## Array.from

Universal metod [Array.from](mdn:js/Array/from) mavjud bo'lib, u takrorlanadigan yoki massivga o'xshash qiymatni oladi va undan haqiqiy `Array` ni hosil qiladi. Unda massiv usullarini chaqirishimiz mumkin.

Misol uchun:

```js run
let arrayLike = {
  0: "Hello",
  1: "World",
  length: 2
};

*!*
let arr = Array.from(arrayLike); // (*)
*/!*
alert(arr.pop()); // World (metod ishlaydi)
```

`(*)` qatoridagi `Array.from` obyektni oladi, uni takrorlanuvchi yoki massivga o'xshashligini tekshiradi, so'ng yangi massiv yaratadi va unga barcha elementlarni ko'chiradi.

Xuddi shu narsa takrorlanuvchi uchun sodir bo'ladi:

```js run
// bu diapazon yuqoridagi misoldan olingan bo'lsa
let arr = Array.from(range);
alert(arr); // 1,2,3,4,5 (massiv toString konvertatsiyasi ishlaydi)
```

`Array.from` uchun to'liq sintaksis bizga ixtiyoriy `mapping` funksiyasini ham taqdim qilish imkonini beradi:

```js
Array.from(obj[, mapFn, thisArg])
```

Ixtiyoriy ikkinchi argument `mapFn` har bir elementni massivga qo'shishdan oldin qo'llaniladigan funksiya bo'lishi mumkin va `thisArg` bizga `this` ni o'rnatishga imkon beradi.

Misol uchun:

```js run
// bu diapazon yuqoridagi misoldan olingan bo'lsa

// har bir raqamni kvadratga aylantiring
let arr = Array.from(range, (num) => num * num);

alert(arr); // 1,4,9,16,25
```

Bu yerda stringni belgilar massiviga aylantirish uchun `Array.from` dan foydalanamiz:

```js run
let str = "𝒳😂";

// satrni belgilar qatoriga ajratadi
let chars = Array.from(str);

alert(chars[0]); // 𝒳
alert(chars[1]); // 😂
alert(chars.length); // 2
```

`str.split` dan farqli ravishda u satrning takrorlanadigan xususiyatiga tayanadi va xuddi `for..of` kabi surrogat juftlar bilan to'g'ri ishlaydi.

Texnik jihatdan bu yerda u xuddi shunday qiladi:

```js run
let str = "𝒳😂";

let chars = []; // Array.from ichki bir xil siklni bajaradi
for (let char of str) {
  chars.push(char);
}

alert(chars);
```

...Ammo u qisqaroq.

Biz hatto uning ustiga surrogatdan xabardor `slice` qurishimiz mumkin:

```js run
function slice(str, start, end) {
  return Array.from(str).slice(start, end).join("");
}

let str = "𝒳😂𩷶";

alert(slice(str, 1, 3)); // 😂𩷶

// mahalliy metod surrogat juftlarni qo'llab-quvvatlamaydi
alert(str.slice(1, 3)); // axlat (turli surrogat juftliklaridan ikkita bo'lak)
```

## Xulosa

`for..of` da ishlatilishi mumkin bo'lgan obyektlar _takrorlanuvchi_ (iterable) deb ataladi.

- Texnik jihatdan, takrorlanuvchilar `Symbol.iterator` deb nomlangan usulni amalga oshirishi kerak.
  - `obj[Symbol.iterator]()` natijasi _takrorlanuvchi_ deb ataladi. U keyingi iteratsiya jarayonini boshqaradi.
  - Iterator `{bajarildi: mantiqiy, qiymat: har qanday}` obyektini qaytaruvchi `next()` nomli metodga ega bo'lishi kerak, bu yerda `bajarildi: true` takrorlash jarayonining oxirini bildiradi, aks holda `value` keyingi qiymat hisoblanadi.
- `Symbol.iterator` usuli `for..of` tomonidan avtomatik ravishda chaqiriladi, lekin biz buni to'g'ridan-to'g'ri bajarishimiz ham mumkin.
- Stringlar yoki massivlar kabi o'rnatilgan takrorlanuvchilar `Symbol.iterator`ni ham amalga oshiradi.
- String iterator surrogat juftliklar haqida biladi.

Indekslangan xossalari va `lengt`, ya'ni uzunligi bo'lgan obyektlar _massivga-o'xshash_ deb ataladi. Bunday obyektlar boshqa xususiyat va metodlarga ham ega bo'lishi mumkin, ammo massivlarning o'rnatilgan usullari mavjud emas.

Spetsifikatsiyani ko'rib chiqamiz: o'rnatilgan usullarning aksariyati ular haqiqiy massivlarning o'rniga takrorlanadigan yoki massivga o'xshashlar bilan ishlaydi, chunki bu mavhumroq.

`Array.from(obj[, mapFn, thisArg])` takrorlanadigan yoki massivga o'xshash `obj` dan haqiqiy `Array` (massiv) hosil qiladi va biz unda massiv usullaridan foydalanishimiz mumkin. `mapFn` va `thisArg` ixtiyoriy argumentlari har bir elementga funktsiyani qo'llash imkonini beradi.
