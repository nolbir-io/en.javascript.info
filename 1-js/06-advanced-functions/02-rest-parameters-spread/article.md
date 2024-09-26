# Rest parametrlari va tarqalish sintaksisi

JavaScriptning o'rnatilgan ko'pgina funksiyalari ixtiyoriy sonli argumentlarni qo'llab-quvvatlaydi.

Masalan:

- `Math.max(arg1, arg2, ..., argN)` -- argumentlarning eng kattasini qaytaradi.
- `Object.assign(dest, src1, ..., srcN)` -- `src1..N` dan `dest` ga xossalarni ko'chiradi.
- ...va hokazo.

Ushbu bobda biz buni qanday bajarishni, shuningdek, massivlarni parametrlar kabi funksiyalarga qanday o'tkazish kerakligini o'rganamiz.

## Rest parametrlari `...`

Funksiya qanday aniqlanganidan qat'iy nazar, uni istalgan miqdordagi argumentlar bilan chaqirish mumkin.

Quyidagidek:
```js run
function sum(a, b) {
  return a + b;
}

alert( sum(1, 2, 3, 4, 5) );
```

"Haddan tashqari" argumentlar tufayli xato bo'lmaydi, lekin natijada faqat birinchi ikkitasi hisobga olinadi, shuning uchun yuqoridagi koddagi natija `3` bo'ladi.

Qolgan parametrlar funksiya ta'rifiga uchta nuqta `...` va undan keyin ularni o'z ichiga olgan massiv nomidan foydalanib kiritish mumkin. Nuqtalar tom ma'noda "qolgan parametrlarni massivga to'plash" degan ma'noni anglatadi.

Masalan, barcha argumentlarni `args` massiviga to'plash quyida ko'rsatilgan:

```js run
function sumAll(...args) { // args massivning nomi
  let sum = 0;

  for (let arg of args) sum += arg;

  return sum;
}

alert( sumAll(1) ); // 1
alert( sumAll(1, 2) ); // 3
alert( sumAll(1, 2, 3) ); // 6
```

Biz birinchi parametrlarni o'zgaruvchilar sifatida olishni tanlashimiz va faqat qolganlarini yig'ishimiz mumkin.

Bu yerda dastlabki ikkita argument o'zgaruvchilarga, qolganlari esa `titles` massiviga kiradi:

```js run
function showName(firstName, lastName, ...titles) {
  alert( firstName + ' ' + lastName ); // Julius Caesar

  // rest sarlavhalar qatoriga kiradi
  // i.e. titles = ["Consul", "Imperator"]
  alert( titles[0] ); // Consul
  alert( titles[1] ); // Imperator
  alert( titles.length ); // 2
}

showName("Julius", "Caesar", "Consul", "Imperator");
```

``warn header="Rest parametrlar oxirida bo'lishi kerak"
Rest parametrlar qolgan barcha argumentlarni to'playdi, shuning uchun quyidagilar mantiqiy emasligi error kelib chiqishiga sabab bo'ladi:


```js
function f(arg1, ...rest, arg2) { // arg2 after ...rest ?!
  // error
}
```

`... rest` har doim oxirgi bo'lishi kerak.
````
````
## "Argumentlar" o'zgaruvchisi

Shuningdek, `arguments` nomli massivga o'xshash maxsus obyekt mavjud bo'lib, u indeks bo'yicha barcha argumentlarni o'z ichiga oladi.

Masalan:

```js run
function showName() {
  alert( arguments.length );
  alert( arguments[0] );
  alert( arguments[1] );

  // u takrorlanadi
  // for(let arg of arguments) alert(arg);
}

// ko'rsatadi: 2, Julius, Caesar
showName("Julius", "Caesar");

// ko'rsatadi: 1, Ilya, undefined (ikkinchi argument yo'q)
showName("Ilya");
```

Qadimgi davrlarda tilda rest parametrlari mavjud emas edi va `arguments` dan foydalanish funksiyaning barcha argumentlarini olishning yagona usuli edi. Va u hali ham ishlaydi, biz uni eski kodda topishimiz mumkin.

Ammo salbiy tomoni shundaki, `arguments` massivga o'xshash va takrorlanadigan bo'lsa ham, u massiv emas. U massiv usullarini qo'llab-quvvatlamaydi, shuning uchun biz `arguments.map(...)` ni chaqira olmaymiz.

Bundan tashqari, u har doim barcha dalillarni o'z ichiga oladi. Biz rest parametrlarida bo'lgani kabi, ularni qisman qo'lga kirita olmaymiz.

Shunday qilib, bizga ushbu xususiyatlar kerak bo'lganda, rest parametrlariga afzallik beriladi.

``
``smart header="Arrow funksiyalari mavjud emas `\"arguments\"` "
Agar biz `arguments` obyektiga strelkali funksiya (arrow function) dan kirsak, u ularni tashqi "normal" funksiyadan oladi.

Misol uchun:

```js run
function f() {
  let showArg = () => alert(arguments[0]);
  showArg();
}

f(1); // 1
```

Esda tutganimizdek, strelka funksiyalarida o'ziga xos `this` mavjud emas. Endi biz ularda maxsus "argumentlar" obyekti ham yo'qligini bilamiz.
`````
`````

## Spread sintaksisi [#spread-syntax]

Biz hozirgina parametrlar ro'yxatidan massivni qanday olish mumkinligini ko'rib chiqdik.

Ammo ba'zida biz teskarisini qilishimiz kerak.

Masalan, ro'yxatdagi eng katta raqamni qaytaruvchi [Math.max](mdn:js/Math/max) funksiyasidan foydalanamiz:

```js run
alert( Math.max(3, 5, 1) ); // 5
```

Aytaylik, bizda `[3, 5, 1]` massiv bor. U bilan qanday qilib `Math.max`ni chaqiramiz?

Uni "xuddi shunday" o'tkazish ishlamaydi, chunki `Math.max` bitta massivni emas, balki raqamli argumentlar ro'yxatini kutadi:

```js run
let arr = [3, 5, 1];

*!*
alert( Math.max(arr) ); // NaN
*/!*
```

Va, albatta, biz `Math.max(arr[0], arr[1], arr[2])` kodidagi elementlarni qo'lda ro'yxatga kirita olmaymiz, chunki ularning soni qancha ekanligini bilmasligimiz mumkin. Bizning skriptimiz bajarilganda, elementlar ko'p bo'lishi ham va aksincha bo'lishi ham mumkin. Agar elemntlar soni kam bo'lsa, sintaksiz xunuk ko'rinadi.

Qutqarishga *spread sintaksisi* yordam beradi! U `...` dan foydalangan holda rest parametrlari kabi ishlaydi, lekin buning aksini qiladi.

Funksiya chaqiruvida `...arr` ishlatilsa, u takrorlanadigan `arr` obyektini argumentlar ro`yxatiga «kengaytiradi».

`Math.max` uchun:

```js run
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5 (spread massivni argumentlar ro'yxatiga aylantiradi)
```

Shuningdek, biz bir nechta iterativlarni shu tarzda o'tkazishimiz mumkin:

```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(...arr1, ...arr2) ); // 8
```

Biz hatto tarqalish sintaksisini oddiy qiymatlar bilan birlashtira olamiz:


```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(1, ...arr1, 2, ...arr2, 25) ); // 25
```

Shuningdek, tarqalish sintaksisi massivlarni birlashtirish uchun ham ishlatilishi mumkin:

```js run
let arr = [3, 5, 1];
let arr2 = [8, 9, 15];

*!*
let merged = [0, ...arr, 2, ...arr2];
*/!*

alert(merged); // 0,3,5,1,2,8,9,15 (0, keyin arr, keyin 2, keyin arr2)
```

Yuqoridagi misollarda biz tarqalish sintaksisini ko'rsatish uchun massivdan foydalanganmiz, ammo har qanday iteratsiya bajarilaveradi.

Misol uchun, bu yerda biz satrni belgilar qatoriga aylantirish uchun tarqalish sintaksisidan foydalanamiz:

```js run
let str = "Hello";

alert( [...str] ); // H,e,l,l,o
```

Tarqalgan sintaksis, xuddi `for..of` bilan bir xil tarzda elementlarni yig'ish uchun iteratorlardan foydalanadi.

Shunday qilib, satr uchun `for..of` belgilarni qaytaradi va `...str` `"H","e","l","l","o"`ga aylanadi. Belgilar ro'yxati `[...str]` massivni ishga tushirgichga uzatadi.

Ushbu aniq vazifa uchun biz `Array.from` dan ham foydalanishimiz mumkin, chunki u iteratsiya qilinadigan elementlarni(string kabi) massivga aylantiradi:

```js run
let str = "Hello";

// Array.from takrorlanuvchini massivga aylantiradi
alert( Array.from(str) ); // H,e,l,l,o
```

Natija `[...str]` bilan o'xshash.

Ammo `Array.from(obj)` va `[...obj]` o'rtasida nozik farq bor:

- `Array.from` massiv bilan bir xil va takrorlanuvchilar bilan ishlaydi.
- Tarqalgan sintaksis esa faqat takrorlanuvchilar bilan ishlaydi.

Shunday qilib, biror narsani massivga aylantirish vazifasi uchun `Array.from` ko'proq universal variant hisoblanadi.


## Massiv/obyektdan nusxa olish

Esingizdami, biz `Object.assign()` haqida [avval](ma'lumot:object-copy#cloning-and-merging-object-assign) gaplashgan edik?

Tarqalgan sintaksis bilan ham xuddi ish tutishimiz mumkin.

```js run
let arr = [1, 2, 3];

*!*
let arrCopy = [...arr]; // massivni parametrlar ro'yxatiga tarqating
                        // keyin natijani yangi massivga qo'ying
*/!*

// massivlar bir xil tarkibga egami?
alert(JSON.stringify(arr) === JSON.stringify(arrCopy)); // to'g'ri

// massivlar tengmi?
alert(arr === arrCopy); // noto'g'ri (bir xil havola emas)

// boshlang'ich massivimizni o'zgartirish nusxani o'zgartirmaydi:
arr.push(4);
alert(arr); // 1, 2, 3, 4
alert(arrCopy); // 1, 2, 3
```

E'tibor bering, obyektning nusxasini yaratish uchun xuddi shunday qilish mumkin:

```js run
let obj = { a: 1, b: 2, c: 3 };

*!*
let objCopy = { ...obj }; // obyektni parametrlar ro'yxatiga tarqatish
                          // keyin natijani yangi obyektga qaytarish
*/!*

// obyektlar bir xil tarkibga egami?
alert(JSON.stringify(obj) === JSON.stringify(objCopy)); // to'g'ri

// obyektlar tengmi?
alert(obj === objCopy); // noto'g'ri (bir xil havola emas)

// boshlang'ich obyektimizni o'zgartirish nusxani o'zgartirmaydi:
obj.d = 4;
alert(JSON.stringify(obj)); // {"a":1,"b":2,"c":3,"d":4}
alert(JSON.stringify(objCopy)); // {"a":1,"b":2,"c":3}
```

Obyektni nusxalashning bu usuli `let objCopy = Object.assign({}, obj)` yoki `let arrCopy = Object.assign([], arr)` massividan ancha qisqaroqdir, shuning uchun biz undan istalgan vaqtda foydalanishni afzal ko'ramiz.


## Xulosa

Kodda `"..."` ni ko'rsak, bu rest parametrlari yoki tarqalish sintaksisidir.

Ularni farqlashning oson yo'li bor:

- `...` funksiya parametrlarining oxirida bo'lsa, u "rest parametrlari" hisoblanadi va qolgan argumentlar ro'yxatini massivga to'playdi.
- Funksiya chaqiruvida `...` ga o'xshash element paydo bo'lsa, u "tarqatish sintaksisi" deb ataladi va massivni ro'yxatga kengaytiradi.

Shakllardan foydalanish:

- Rest parametrlari istalgan miqdordagi argumentlarni qabul qiladigan funksiyalarni yaratish uchun ishlatiladi.
- Spread sintaksisi massivni odatda ko'plab argumentlar ro'yxatini talab qiladigan funktsiyalarga o'tkazish uchun ishlatiladi.

Ular birgalikda ro'yxat va parametrlar massivi o'rtasida osongina sayohat qilishga yordam beradi.

Funksiya chaqiruvining barcha argumentlari "eski uslubdagi" `argumentlar`, ya'ni massivga o'xshash takrorlanadigan obyektda ham mavjud: 