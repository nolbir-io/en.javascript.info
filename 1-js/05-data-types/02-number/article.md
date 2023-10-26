# Numbers (raqamlar)

Zamonaviy JavaScriptda raqamlarning ikki turi mavjud:

JavaScriptdagi oddiy raqamlar 64-bit formatda [IEEE-754](https://en.wikipedia.org/wiki/IEEE_754-2008_revision) saqlanadi, shuningdek, "ikkita aniqlikdagi kasr sonlar" sifatida ham tanilgan. Bular biz ko'pincha ishlatadigan raqamlardir va ushbu bobda biz ular haqida gaplashamiz.

2. BigInt sonlar - katta o'lchamli butun sonlarni ifodalash uchun foydalaniladi. Ular juda ham zarur, chunki oddiy son <code>2<sup>53</sup></code> dan yuqori yoki <code>-2<sup>53</sup></code>dan kam bo'la olmaydi. BigIntlar bir nechta maxsus sohalarda qo'llanilganligi sababli, biz ular haqida maxsus <info:bigint> bobida o'rganamiz.


Shunday qilib, biz endi oddiy raqamlar haqida gaplashamiz. Keling, ular haqidagi bilimlarimizni kengaytiraylik.

## Number yozishning boshqa usullari

Tasavvur qiling, 1 milliardni yozishimiz kerak. Buning aniq yo'li:

```js
let billion = 1000000000;
```

Biz yana pastki chiziqchadan `_` ajratuvchi sifatida foydalanishimiz mumkin:

```js
let billion = 1_000_000_000;
```

Bu yerda pastki chiziq `_` "syntactic sugar" rolini o'ynaydi, bu raqamning o'qilishini yanada osonlashtiradi. JavaScript dvigateli raqamlar orasidagi `_` ga e'tibor bermaydi, shuning uchun u yuqoridagi kabi bir milliardga teng bo'ladi.

Shunga qaramasdan, biz hayotda nollarning uzun ketma-ketligini yozishdan qochishga harakat qilamiz. Chunki buni yozish uchun dangasaligimiz halaqit beradi. Biz milliard uchun `"1bn"` yoki 7 milliard 300 million uchun `"7.3bn"` deb yozishga harakat qilamiz. Ko'pchilik katta raqamlar uchun ham xuddi shunday yo'l tutishimiz mumkin.

JavaScriptda biz raqamga `"e"` harfini qo'shish va nol sonini belgilash orqali uni qisqartirishimiz mumkin:

```js run
let billion = 1e9;  // 1 milliard, aslida: 1 and 9 ta nol

alert( 7.3e9 );  // 7.3 billions (milliard) ( 7300000000 yoki 7_300_000_000 bilan bir xil)
```

Boshqacha qilib aytganda, `e` sonni `1` bilan berilgan nollar soniga ko'paytiradi.

```js
1e3 === 1 * 1000; // e3 means *1000
1.23e6 === 1.23 * 1000000; // e6 means *1000000
```

Endi juda kichik sonni yozib ko'ramiz. Aytaylik, 1 mikrosoniya (soniyaning milliondan biri):

```js
let mсs = 0.000001;
```

Xuddi avvalgidek, `"e"` dan foydalanish yordam berishi mumkin. Agar nollarni yozishni istamasak, quyidagi kabi ish tutamiz:


```js
let mcs = 1e-6; // 1 dan chapga beshta nol
```

Agar `0.000001`dagi nollar sonini sanasak, ular 6 ta. Demak, bu `1e-6` bo'ladi.

Boshqacha qilib aytganda, `"e"` dan keyin manfiy raqam berilgan nol soni bilan 1 ga bo'linishini anglatadi:

```js
// -3 ni 1 ga 3ta nol bilan bo'lish
1e-3 === 1 / 1000; // 0.001

// -6 ni 1 ga 6ta nol bilan bo'lish
1.23e-6 === 1.23 / 1000000; // 0.00000123

// kattaroq raqamga ega bo'lgan misol
1234e-2 === 1234 / 100; // 12.34, kasr nuqtasi 2 marta siljiydi
```

### Oltilik, ikkilik va sakkizlik raqamlar (Hex, binary and octal numbers)

[Hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) raqamlardan JavaScriptda ranglarni ifodalash, belgilarni kodlash va boshqa narsalar uchun keng foydalaniladi. Ularni yozishning qisqaroq usuli mavjud: `0x` va keyin raqam.

Masalan:

```js run
alert( 0xff ); // 255
alert( 0xFF ); // 255 (bir xil, holat muhim emas)
```

Binary(ikkilik) va octal(sakkizlik) sanoq sistemalar kamdan-kam hollarda qo'llaniladi, lekin `0b` va `0o` prefikslari yordamida ham qo'llab-quvvatlanishi mumkin:

```js run
let a = 0b11111111; // 255 ning ikkilik shakli
let b = 0o377; // 255 ning sakkizlik shakli

alert( a == b ); // to'g'ri, ikkala tomonda bir xil raqam 255 ifodalangan
```

Bunday qo'llab-quvvatlashga qodir faqat 3 ta sanoq sistemalari mavjud. Boshqa sanoq sistemalari uchun biz `parseInt` funksiyasidan foydalanishimiz kerak (uni keyinroq ushbu bobda ko'rib chiqamiz).

## toString(base)

`num.toString(base)` metodi `num` ning berilgan `base` ga teng sanoq sistemasidagi satrli ko'rinishini qaytaradi.

Masalan:
```js run
let num = 255;

alert( num.toString(16) );  // ff
alert( num.toString(2) );   // 11111111
```

`base` `2` dan `36` gacha o'zgarishi mumkin. Doimiyda esa u `10`ga teng.

Buning uchun keng tarqalgan foydalanish holatlari:

- **base=16** hex (oltilik) ranglar, belgilarni kodlash va hokazolar uchun ishlatilinadi, raqamlar `0..9` yoki `A..F` ko'rinishida bo'lishi mumkin.
- **base=2** asosan bitwise amallarni debug qilish uchun ishlatilinadi, raqamlar `0` yoki `1` ko'rinishida bo'lishi mumkin.
- **base=36** raqamlar maksimum `0..9` yoki `A..Z` ko'rinishda bo'lishi mumkin. Sonni aks ettirish uchun to'liq lotin alifbosidan foydalaniladi. `36`ning kulgili, ammo foydali ishlatilish holati - uzun raqamli identifikatorni qisqartirish, masalan, qisqa url qilish kerak bo'lganda foydalaniladi. Uni oddiygina `36` asosli sanoq sistemada ifodalash mumkin:

    ```js run
    alert( 123456..toString(36) ); // 2n9c
    ```

```warn header="Usul (metod)ni chaqirish uchun ikkita nuqta"
Shuni yodda tutingki, `123456..toString(36)` dagi ikkita nuqta xato emas. Agar metodni sonda to'g'ridan-to'gri chaqirmoqchi bo'lsak, xuddi yuqoridagi misoldagi `toString` kabi, undan keyin ikkita nuqta `..` qo'yishimiz kerak.

Agar yakka nuqta qo'ysak: `123456.toString(36)`, u holda xatolik hisoblanadi, chunki JavaScript sintaksisi birinchi nuqtadan keyingi qismni kasr deb hisoblaydi. Agar yana bitta nuqta qo'yadigan bo'lsak, unda JavaScript kasr qismni bo'sh deb biladi va shunda metodga o'tadi.

Yana `(123456).toString(36)` deb yozish ham mumkin.

```

## Yaxlitlash

Sonlar bilan ishlayotganda eng ko'p qo'llaniladigan amallardan biri bu yaxlitlashdir.

Yaxlitlash uchun bir nechta ichki o'rnatilgan funksiyalar mavjud:

`Math.floor`
: Pastga qarab yaxlitlaydi: `3.1` => `3` va `-1.1` => `-2` bo'ladi.

`Math.ceil`
: Yuqoriga qarab yaxlitlaydi: `3.1` => `4` va `-1.1` => `-1` bo'ladi.

`Math.round`
: Eng yaqin butunga qarab yaxlitlaydi: `3.1` => `3`, `3.6` => `4` bo'ladi, o'rtadagilar esa: `3.5` ham yuqoriga `4`ga yaxlitlanadi.

`Math.trunc` (Internet Explorer tomonidan qo'llab-quvvatlanmaydi)
: Kasrdan keyin hamma narsani yaxlitlashsiz olib tashlaydi: `3.1` => `3`, `-1.1` => `-1` bo'ladi.

Quyida ular orasidagi farqlarni umumlashtirish uchun jadval berilgan:

|   | `Math.floor` | `Math.ceil` | `Math.round` | `Math.trunc` |
|---|---------|--------|---------|---------|
|`3.1`|  `3`    |   `4`  |    `3`  |   `3`   |
|`3.6`|  `3`    |   `4`  |    `4`  |   `3`   |
|`-1.1`|  `-2`    |   `-1`  |    `-1`  |   `-1`   |
|`-1.6`|  `-2`    |   `-1`  |    `-2`  |   `-1`   |


Bu funksiyalar sonning o'nlik qismi bilan ishlashning barcha mumkin bo'lgan usullarini qamrab oladi. Ammo o'nli kasrdan keyin raqamni `n-th` (n-chi) raqamga yaxlitlashni istasak nima bo'ladi?

Masalan, bizda `1.2345` bor va faqatgina `1.23`ni olgan holda uni 2 ta raqamga yaxlitlashni xohlaymiz.

Buni amalga oshirishning ikki usuli mavjud:

1. Ko'paytirish va bo'lish.

    Masalan, sonni kasrdan keyingi ikkinchi raqamgacha yaxlitlagani, sonni `100`ga (yoki 10 ning kattaroq darajasiga) ko'paytirishimiz, yaxlitlash funksiyasini chaqirishimiz va keyin uni qaytarib bo'lishimiz mumkin.
    ```js run
    let num = 1.23456;

    alert( Math.round(num * 100) / 100 ); // 1.23456 -> 123.456 -> 123 -> 1.23
    ```

2. [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) metodi sonni nuqtadan keyingi `n` raqamgacha yaxlitlaydi va natijaning string ko'rinishini qaytaradi.

    ```js run
    let num = 12.34;
    alert( num.toFixed(1) ); // "12.3"
    ```

    Bu eng yaqindagi qiymat tomon yuqoriga yoki pastga tomon `Math.round`ga o'xshab yaxlitlaydi:

    ```js run
    let num = 12.36;
    alert( num.toFixed(1) ); // "12.4"
    ```

    Yodda tuting, `toFixed`ning natijasi stringga teng. Agar kasr qism kerakligidan kichikroq bo'lsa, u holda oxiriga nollar qo'shiladi:

    ```js run
    let num = 12.34;
    alert( num.toFixed(5) ); // "12.34000", aniq 5 ta raqam hosil qilish uchun nol qo'shildi
    ```

    Biz uni unary plyus yoki `Number()` chaqiruvi yordamida songa aylantirishimiz mumkin: `+num.toFixed(5)`.

## Noto'g'ri hisob-kitoblar

Ichki tomondan, raqam 64 bitli [IEEE-754](https://en.wikipedia.org/wiki/IEEE_754-2008_revision) formatda taqdim etiladi, shuning uchun raqamni saqlash uchun aniq 64 ta bit mavjud: ulardan 52 tasi raqamlarni saqlash uchun ishlatiladi, 11 tasi kasr o'rnini saqlaydi (butun sonlar uchun ular nolga teng), va 1 ta bit belgi uchun foydalaniladi.

Agar son juda katta bo'lsa, u 64 bitlik xotiraga sig'maydi va u katta ehtimol bilan `Infinity`, cheksizlikni beradi:
```js run
alert( 1e500 ); // Infinity
```

Aniqlikni yo'qotish unchalik ravshan bo'lmasligi mumkin, lekin tez-tez sodir bo'ladi.

Ushbu (noto'g'ri!) testni ko'ring:

```js run
alert( 0.1 + 0.2 == 0.3 ); // *!*false*/!*
```

To'g'ri, `0.1` va `0.2` ning yig'indisi `0.3` yoki emasligini tekshirganimizda, `false` ni olamiz.

G'alati! Agar `0.3` bo'lmasa, unda nima?

```js run
alert( 0.1 + 0.2 ); // 0.30000000000000004
```

Buning noto'g'ri taqqoslashdan ko'ra ko'proq oqibatlari bo'lishi mumkin. Tasavvur qiling siz onlayn xarid qilish saytini yaratyapsiz va tashrif buyuruvchi savatiga `$0.10` va `$0.20` lik tovarlarni qo'yadi. Buyurtma jami `$0.30000000000000004` bo'ladi. Albatta, bu hammani hayratlantiradi.

Ammo nega bunday bo'lmoqda?

Son xotirada binar (ikkilik) shaklda, ya'ni birlar va nollar - bitlar ketma-ketligida saqlanadi. Lekin o'nlik sanoq sistemasida oddiy ko'rinadigan `0.1`, `0.2` kabi kasrlar aslida o'zining binar ko'rinishida tugamaydigan kasrlardir.

Boshqacha qilib aytganda, `0.1` o'zi nima? U bir bo'lingan o'n `1/10`, ya'ni o'ndan bir. O'nlik sanoq sistemasida bunday sonlar osongina ifodalanadi. Uni uchdan birga solishtirsak: `1/3`. U cheksiz kasr `0.33333(3)`ga aylanadi.

Demak, `10` darajalariga bo'lish o'nlik sistemada yaxshi ishlashi kafolatlangan, lekin `3`ga bo'lish bunday emas. Ayni sababga ko'ra, ikkilik sanoq sistemasida, `2`ning darajalariga bo'lish yaxshi ishlashi kafolatlanadi, ammo `1/10` cheksiz ikkilik kasrga aylanadi.

Uchdan birni o'nlik kasr sifatida saqlashning ilojisi bo'lmagani kabi ikkilik sistemada *aniq 0.1* yoki *aniq 0.2* ni saqlashning hech qanday yo'li mavjud emas.

IEEE-754 raqamli formati buni imkon qadar yaqin raqamga yaxlitlash orqali hal qiladi. Ushbu yaxlitlash qoidalari odatda "kichik aniqlik yo'qolishi" ni ko'rishga imkon bermaydi, lekin u mavjud hisoblanadi.

Buni amalda ko‘rishimiz mumkin:
```js run
alert( 0.1.toFixed(20) ); // 0.10000000000000000555
```

Ikkita raqamni jamlaganimizda, ularning "aniqlik yo'qotishlari" oshib boradi.

Shuning uchun `0.1 + 0.2` aynan `0.3` emas.

```smart header="Faqat JavaScriptda bunday holat mavjud emas"
Xuddi shu muammo boshqa ko'plab dasturlash tillarida ham mavjud.

PHP, Java, C, Perl, Ruby bir xil natijani beradi, chunki ular ham bir xil raqamli formatga asoslangan.
```

Muammoni hal qila olamizmi? Albatta, buning eng ishonchli usuli bu natijani [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) metodi yordamida yaxlitlashdir:

```js run
let sum = 0.1 + 0.2;
alert( sum.toFixed(2) ); // "0.30"
```

Yodda tuting, `toFixed` doim string ni qaytaradi. Bu kasr qismda 2 ta raqam bor ekanligini ta'minlaydi. Bu ayniqsa onlayn xaridlarni amalga oshirayotganda va `$0.30`ni ko'rsatish kerak bo'lganda juda qulay. Boshqa hollarda, uni raqamga aylantirish uchun unar plyus dan foydalanishimiz mumkin:

```js run
let sum = 0.1 + 0.2;
alert( +sum.toFixed(2) ); // 0.3
```

Biz yana sonlarni butunga aylantirish uchun ularni vaqtinchalik 100 (yoki kattaroq son)ga ko'paytirshimiz, amallarni bajarishimiz va qayta bo'lishimiz ham mumkin. Bunda, butun sonlar bilan amallar bajarayotganimiz uchun, xatolik qaysidir ma'noda kamayadi, lekin biz uni bo'lishdan olamiz:

```js run
alert( (0.1 * 10 + 0.2 * 10) / 10 ); // 0.3
alert( (0.28 * 100 + 0.14 * 100) / 100); // 0.4200000000000001
```

Shunday qilib, ko'paytirish/bo'lish usuli xatoni kamaytiradi, lekin uni butunlay olib tashlamaydi.

Ba'zan biz kasrlardan qochishga harakat qilishimiz mumkin. Agar do'kon bilan ishlayotgan bo'lsak, unda narxlarni dollar o'rniga sentda saqlashimiz mumkin. Lekin agar 30% chegirma qo'ysak-chi? Amalda, butunlay kasrlardan qochishning ilojisi yo'q. Shunchaki kerak bo'lganida "dumlar"ni kesish uchun ularni yaxlitlang.

````smart header="Kulguli narsa"
Buni bajarib ko'ring:

```js run
// Salom! Men o'zi o'sadigan sonman!
alert( 9999999999999999 ); // 10000000000000000 ko'rsatiladi
```

Bu ham yana bir xil muammo: aniqlik yo'qolishiga ega. Son uchun 64 ta bit mavjud, ularning 52 tasi raqamlarni saqlash uchun ishlatilinishi mumkin, ammo bu yetarli emas. Shuning uchun, eng kam ahamiyatli raqamlar yo'qoladi.

JavaScript bunday holatlarda xatolik keltirib chiqarmaydi. U sonni kerakli formatga joylash uchun qo'lidan kelganini qiladi, afsuski, bunday format yetarlicha katta bo'lmaydi.
````

```smart header="Ikkita nol"
Raqamlarning ichki ko'rinishining yana bir kulgili natijasi bu unda ikkita nolning mavjudligidir: `0` va `-0`.

Buning sababi, belgi bitta bit bilan ifodalanadi, shuning uchun uni har qanday raqam uchun, shu jumladan nol uchun o'rnatish yoki o'rnatmaslik mumkin.

Aksariyat hollarda farq sezilmaydi, chunki operatorlar ularga bir xil munosabatda bo'lishga moslashadi.
```

## Testlar: isFinite va isNaN

Ushbu ikkita maxsus raqamli qiymatlarni eslaysizmi?

- `Infinity` (va `-Infinity`) bu har qanday narsadan kattaroq (kamroq) bo'lgan maxsus raqamli qiymat.
- `NaN` xatoni ifodalaydi.

Ular `number` turiga qarashli, lekin "odatiy" raqamlar emas, shuning uchun ularni tekshirish uchun maxsus funksiyalar mavjud:


- `isNaN(value)` o'z argumentini raqamga aylantiradi va keyin uning `NaN` ekanligini tekshiradi:

    ```js run
    alert( isNaN(NaN) ); // true
    alert( isNaN("str") ); // true
    ```

    Lekin bizga bu funksiya kerakmi? Shunchaki `=== NaN` taqqoslashdan foydalanib qo'ya olmaymizmi? Kechirasiz, lekin javobi yo'q. `NaN` qiymatini noyob jihati shundaki, u hech narsaga teng emas, shu jumladan o'ziga ham:

    ```js run
    alert( NaN === NaN ); // false
    ```

- `isFinite(value)` o'z argumentini raqamga aylantiradi va agar u `NaN/Infinity/ -Infinity` emas, balki odatiy raqam bo'lsa, `true` ni qaytaradi:

    ```js run
    alert( isFinite("15") ); // true
    alert( isFinite("str") ); // false, chunki maxsus qiymat mavjud: NaN: 
    alert( isFinite(Infinity) ); // false, chunki maxsus qiymat mavjud : Infinity
    ```

Ba'zan `isFinite` dan string ning qiymati odatiy raqam yoki unday emasligini tasdiqlash uchun foydalaniladi:


```js run
let num = +prompt("Enter a number", '');

// Agar siz Infinity, -Infinity yoki raqamni kiritmaguningizcha true bo'ladi
alert( isFinite(num) );
```

Yodda tuting, bo'sh yoki faqat bo'sh joy bo'lgan string barcha raqamli funksiyalarda, jumladan `isFinite`da `0` sifatida qabul qilinadi.

````smart header="`Number.isNaN` and `Number.isFinite`"

[Number.isNaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN) va [Number.isFinite](https://developer.mozilla.org /en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite) usullari `isNaN` va `isFinite` funksiyalarining yanada "qattiq" versiyalaridir. Ular o'z argumentlarini raqamga o'zgartirmaydilar, lekin uning o'rniga `number` turiga tegishli ekanligini tekshiradi.

`===` kabi qiymatlarni taqqoslaydigan maxsus ichki o'rnatilgan [`Object.is`](mdn:js/Object/is) metodi mavjud, ammo u ikki tomonlama holatlar uchun ishonchliroqdir:

1. U `NaN` bilan ishlaydi: `Object.is(NaN, NaN) === true`, bu yaxshi narsa.
2. `0` va `-0` qiymatlari turlicha: `Object.is(0, -0) === false`, texnik jihatdan bu to'g'ri, chunki ichki tomondan raqam boshqa barcha bitlar nol bo'lsa ham farqli bo'lishi mumkin bo'lgan ishora bitiga ega.
- `Number.isNaN(value)` argument `number` turiga tegishli bo'lsa va u `NaN` bo'lsa, `true` qiymatini qaytaradi. Boshqa har qanday holatda u `false` ni qaytaradi.

    ```js run
    alert( Number.isNaN(NaN) ); // true
    alert( Number.isNaN("str" / 2) ); // true

    // Farqlarga e'tibor bering:
    alert( Number.isNaN("str") ); // false, chunki "str" string type ga tegishli, number type ga emas
    alert( isNaN("str") ); // true, chunki isNaN "str" qatorini raqamga aylantiradi va bu konvertatsiya natijasida NaN olinadi
    ```

- Agar argument `number` turiga tegishli bo'lsa va u `NaN/Infinity/-Infinity` bo'lmasa, `Number.isFinite(value)` `true` qiymatini qaytaradi. Boshqa har qanday holatda u `false` ni qaytaradi.

    ```js run
    alert( Number.isFinite(123) ); // true
    alert( Number.isFinite(Infinity) ); // false
    alert( Number.isFinite(2 / 0) ); // false

    // Farqlarga e'tibor bering:
    alert( Number.isFinite("123") ); // false, chunki "123" raqam turiga emas, string turiga tegishli
    alert( isFinite("123") ); // true, chunki isFinite "123" qatorini 123 raqamiga aylantiradi
    ```

Qaysidir ma'noda, `Number.isNaN` va `Number.isFinite` `isNaN` va `isFinite` funksiyalariga qaraganda sodda va tushunarliroqdir. Amalda esa `isNaN` va `isFinite` asosan ishlatiladi, chunki ular yozish uchun qisqaroq.
````

```smart header="`Object.is` bilan taqqoslash"
`===` kabi qiymatlarni solishtiruvchi maxsus o'rnatilgan `Object.is` usuli mavjud, lekin u ikkita chekka holatlar uchun ishonchliroqdir:

1. U `NaN` bilan ishlaydi: `Object.is(NaN, NaN) === true`, bu yaxshi narsa.
2. `0` va `-0` qiymatlari har xil: `Object.is(0, -0) === false`, texnik jihatdan bu to`g`ri, chunki ichki raqamda boshqa barcha bitlar nol bo`lsa ham farqli bo`lishi mumkin bo`lgan belgi biti mavjud.

Boshqa barcha holatlarda, `Object.is(a, b)` `a === b` bilan bir xil.

Ushbu taqqoslash usulidan JavaScript spesifikatsiyasida tez-tez foydalaniladi. Ichki algoritm ikki qiymatning aynan o'xshash ekanligini taqqoslashi kerak bo'lganida u `Object.is` (ichki tomondan [SameValue](https://tc39.github.io/ecma262/#sec-samevalue) deb nomlangan) metoddan foydalanadi.

```


## parseInt va parseFloat

`+` plyus yoki `Number()` yordamidagi raqamli konvertatsiyalar qat'iydir. Agar qiymat aniq raqam bo'lmasa, u ishlamaydi:

```js run
alert( +"100px" ); // NaN
```

Yagona istisno bu string boshidagi yoki oxiridagi bo'shliqlardir, chunki ular e'tiborga olinmaydi.

Lekin real hayotda biz ko'pincha CSSda `"100px"` yoki `"12pt"` kabi birliklarda qiymatlarga egamiz. Shuningdek, ko'pgina mamlakatlarda pul birligi belgisi summadan keyin keladi, shuning uchun bizda `19€` bor va undan raqamli qiymat chiqarmoqchimiz.


`parseInt` va `parseFloat` aynan shuning uchunatiladi.
Ular stringdan raqamni o'qiy olmaguncha "o'qiydilar". Xato bo'lganida, to'plangan raqam qaytariladi. `parseInt` funksiyasi butun sonni qaytaradi, `parseFloat` esa kasr sonni qaytaradi:

```js run
alert( parseInt('100px') ); // 100
alert( parseFloat('12.5em') ); // 12.5

alert( parseInt('12.3') ); // 12, faqat butun son qismi qaytariladi
alert( parseFloat('12.3.4') ); // 12.3, ikkinchi nuqta o'qishni to'xtatadi
```

`parseInt/parseFloat` metodlari `NaN` ni qaytaruvchi vaziyatlar mavjud. Bu hech qanday raqam o'qilmaganida sodir bo'ladi:

```js run
alert( parseInt('a123') ); // NaN, birinchi belgi jarayonni to'xtatadi
```

````smart header="`parseInt(str, radix)` ning ikkinchi argumenti"
`parseInt()` funksiyasi ixtiyoriy ikkinchi argumentga ega. U sanoq sistemasining asosini belgilaydi, shuning uchun `parseInt`, o'n oltilik, ikkilik raqamlar va boshqalar stringlarni ham tahlil qila oladi:

```js run
alert( parseInt('0xff', 16) ); // 255
alert( parseInt('ff', 16) ); // 255, 0x mavjud bo'lmagan holda ham ishlaydi

alert( parseInt('2n9c', 36) ); // 123456
```
````

## Boshqa matematik funksiyalar

JavaScript ichki o'rnatilgan [Math](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math) obyektiga ega bo'lib, unda matematik funksiyalar va konstantalarning kichik kutubxonasi mavjud.

Ba'zi misollar:

`Math.random()`
: 0 dan 1 gacha bo'lgan tasodifiy raqamni qaytaradi (shu jumladan 1 ni).

    ```js run
    alert( Math.random() ); // 0.1234567894322
    alert( Math.random() ); // 0.5435252343232
    alert( Math.random() ); // ... (istalgan tasodifiy raqamlar)
    ```

`Math.max(a, b, c...)` / `Math.min(a, b, c...)`
: Argumentlarning ixtiyoriy sonidan eng kattasi yoki kichigini qaytaradi.

    ```js run
    alert( Math.max(3, 5, -10, 0, 1) ); // 5
    alert( Math.min(1, 2) ); // 1
    ```

`Math.pow(n, power)`
: Berilgan darajaga ko'tarilgan `n` ni qaytaradi.

    ```js run
    alert( Math.pow(2, 10) ); // 2 ning 10-darajasi 1024
    ```

`Math` obyektida ko'plab funksiya va konstantalar mavjud, jumladan trigonometriya, ularni [docs for the Math object](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math)da topishingiz mumkin.

## Xulosa

Ko'p nolga ega raqamlarni yozish uchun:

- Raqamga `"e"` ni nollar soni bilan qo'shing, masalan, `123e6` - `123` bilan 6 ta nolni yozish, ya'ni `123000000`ga teng.
- `"e"`dan keyingi manfiy raqam sonni 1 bilan berilgan nollar soniga bo'linishiga olib keladi. M.u. `123e-6` - `0.000123` (miliondan `123`) degani.

Turli sanoq sistemalari uchun:

- Raqamlarni to'g'ridan-to'g'ri o'n oltilik (`0x`), sakkizlik (`0o`) va ikkilik (`0b`) sistemalarida yozish mumkin.
- `parseInt(str, base)` `str` stringni berilgan `base` ga ega sanoq sistemasidagi butun songa parse qiladi, `2 ≤ base ≤ 36`.
- `num.toString(base)` raqamni berilgan `base` ga ega sanoq sistemasidagi stringga konvertatsiya qiladi.

`12pt` va `100px` kabi qiymatlarni raqamga konvertatsiya qilish uchun:
Oddiy raqamli testlar uchun:

- `isNaN(value)` o'z argumentini raqamga aylantiradi va keyin uni `NaN` ekanligini tekshiradi
- `Number.isNaN(value)` uning argumenti `number` turiga tegishli yoki yo'qligini tekshiradi va agar shunday bo'lsa, uni `NaN` ekanligini tekshiradi
- `isFinite(value)` argumentni raqamga aylantiradi va keyin uni `NaN/Infinity/-Infinity` emasligini tekshiradi
- `Number.isFinite(value)` uning argumenti `number` turiga tegishli yoki yo'qligini tekshiradi va agar shunday bo'lsa, uni `NaN/Infinity/-Infinity` emasligini tekshiradi.

- "Yumshoq" konvertatsiya qilish uchun `parseInt/parseFloat` dan foydalaning, u satrdan raqamni o'qiydi va keyin xatolikdan oldin o'qishi mumkin bo'lgan qiymatni qaytaradi.

Kasrlar uchun:

- `Math.floor`, `Math.ceil`, `Math.trunc`, `Math.round` yoki `num.toFixed(precision)` yordamida yaxlitlang.
- Kasrlar bilan ishlayotganda aniqlik yo'qolish ehtimoli borligini yodda tuting.

Ko'proq matematik funktsiyalar:

- Kerak bo'lganida [Math](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math) obyektini ko'ring. Ushbu kutubxona juda kichik, lekin barcha zaruriy narsalarni qamrab olgan.
