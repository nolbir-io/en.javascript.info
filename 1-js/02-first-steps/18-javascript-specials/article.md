# JavaScript spesifikatsiyalari

Ushbu bobda biz hozirgacha o'rgangan JavaScriptning xususiyatlarini qisqacha ko'rib chiqamiz va nozik nuqtalarga alohida e'tibor qaratamiz.

## Kod tuzilishi

Ifodalar nuqtali vergul bilan ajratiladi:

```js run no-beautify
alert('Hello'); alert('World');
```

Odatda, line-break ga ham ajratuvchi sifatida qaraladi, shuning uchun u ham ishlatilishi mumkin:

```js run no-beautify
alert('Hello')
alert('World')
```

Bu "avtomatik nuqtali vergul qo'yish" deb ataladi. Ba'zi vaqtda u ishlamaydi, masalan:

```js run
alert("There will be an error after this message")

[1, 2].forEach(alert)
```

Ko'pgina kod uslubi qo'llanmalari har bir ifodadan keyin nuqtali vergul qo'yish kerak, degan fikrni ma'qullaydi.

`{...}` kod bloklari va ular bilan loop kabi sintaksis tuzilmalaridan keyin nuqtali vergul qo'yish shart emas:

```js
function f() {
  // funksiya deklaratsiyasidan keyin nuqtali vergul kerak emas
}

for(;;) {
  // sikldan keyin nuqtali vergul kerak emas
}
```

...Lekin agar biror joyga "ortiqcha" nuqtali vergul qo'ysak, bu xatolik hisoblanmaydi.

Bu haqda <info:structure> dan ko'proq ma'lumot olishingiz mumkin.

## Strict mode (Qat'iy rejim)

Zamonaviy JavaScriptning barcha xususiyatlarini to'liq faollashtirish uchun skriptlarni `"use strict"` bilan boshlashimiz kerak.

```js
'use strict';

...
```

Direktiv skriptning yuqori qismida yoki funksiya tanasining boshida bo'lishi kerak.

`"Strict mode"`siz hamma narsa ishlayveradi, lekin ba'zi xususiyatlar eskicha, "mos keluvchan" usulda ishlaydi. Biz odatda zamonaviy usulni afzal ko'ramiz.

Tilning ba'zi zamonaviy xususiyatlari (masalan, biz keyinroq o'rganadigan classlar) qat'iy rejimni bilvosita faollashtiradi.

Bu haqida <info:strict-mode> dan ko'proq ma'lumot olishingiz mumkin.

## O'zgaruvchilar

Quyidagilar yordamida e'lon qilinadi:

- `let`
- `const` (konstanta, o'zgartirib bo'lmaydi)
- `var` (eski uslubda, keyinroq ko'rib chiqamiz)

O'zgaruvchi nomi o'z ichiga quyidagilarni olishi mumkin:
- Harflar va raqamlar, lekin birinchi belgi raqam bo'la olmaydi.
- `$` va `_` belgilar odatda harflar bilan teng.
- Lotin bo'lmagan alifbo va iyerogliflarga ham ruxsat berilgan, lekin ular keng qo'llanilmaydi.

O'zgaruvchilar dinamik ravishda yoziladi. Ular istalgan qiymatni saqlay oladi:

```js
let x = 5;
x = "John";
```

8 ta ma'lumot turi mavjud:

- `number` kasr nuqta va butun sonlar uchun
- `bigint` katta o'lchamli butun sonlar uchun
- `string` satrlar uchun
- `boolean` mantiqiy qiymatlar uchun: `true/false`,
- `null` -- "bo'sh" yoki "mavjud emas" ma'nosini anglatuvchi yagona `null` qiymatga ega tur
- `undefined` -- "e'lon qilinmagan"ni anglatuvchi yagona `undefined` qiymatga ega tur 
- `object` va `symbol` -- murakkab ma'lumotlar tuzilmalari va noyob identifikatorlar uchun ishlatiladi, biz ularni hali o'rganmaganmiz.

`typeof` operatori qiymatning turini qaytaradi, lekin ikkita istisno mavjud:
```js
typeof null == "object" // dasturlash tilida error mavjud
typeof function(){} == "function" // funksiyalar alohida ko'rib chiqiladi
```

Bu haqida <info:variables> va <info:types> dan ko'proq ma'lumot olishingiz mumkin.

## O'zaro ta'sir

Biz ishlash muhiti sifatida brauzerdan foydalanamiz, shuning uchun asosiy UI funksiyalari quyidagilar bo'ladi:

[`prompt(question, [default])`](mdn:api/Window/prompt)
:`question`, ya'ni savol so'raydi va foydalanuvchi kiritgan qiymatni, agar "bekor qilish" ni bossa `null`ni qaytaradi.

[`confirm(question)`](mdn:api/Window/confirm)
:`question` so'raydi va Ok yoki Cancel dan birini tanlash imkinini beradi. Tanlov `true/false` bo'lib qaytariladi.

[`alert(message)`](mdn:api/Window/alert)
:`message`ni chiqaradi.

Bu funksiyalarning barchasi *modal* bo‘lib, ular kod bajarilishini to'xtatib turadi va tashrif buyuruvchi javob bermaguncha sahifa bilan o'zaro aloqa qilishiga yo'l qo'ymaydi.

Masalan:

```js run
let userName = prompt("Your name?", "Alice");
let isTeaWanted = confirm("Do you want some tea?");

alert( "Visitor: " + userName ); // Alice
alert( "Tea wanted: " + isTeaWanted ); // true
```

Bu haqida <info:alert-prompt-confirm> dan ko'proq ma'lumot olishingiz mumkin.

## Operatorlar

JavaScript quyidagi operatorlarni qo'llab-quvvatlaydi:

Arifmetik
: Doimiy: `* + - /`, `%` qoldiq uchun va `**` sonning darajasi uchun.

    Binar plus `+` stringlarni birlashtiradi. Va agar operandlardan biri string bo'lsa, qolgani ham stringga konversiya qilinadi.

    ```js run
    alert( '1' + 2 ); // '12', string
    alert( 1 + '2' ); // '12', string
    ```

Tayinlashlar
: Oddiy tayinlash mavjud: `a = b` va u `a *= 2` ga o'xshaganlarni biriktiradi.

Bitwise
: Bitwise operatorlar juda past, bit darajadagi 32 bitli butun sonlar bilan ishlaydi : kerak bo'lganda [docs](mdn:/JavaScript/Guide/Expressions_and_Operators#Bitwise) dan ko'ring.

Shart
: Uchta parametrga ega yagona operator: `cond ? resultA : resultB`. Agar `cond` rost bo'lsa, `resultA` ni, aks holda `resultB` ni qaytaradi.

Mantiqiy operatorlar
: Mantiqiy AND `&&` va OR `||` kichik doirali hisoblashni amalga oshiradi va to'xtagan joyidagi qiymatni qaytaradi 
(`true`/`false` kerak emas). Mantiqiy NOT `!` operandni boolean turga aylantiradi va uning teskari qiymatini qaytaradi.

Nullish coalescing operator
: `??` operatori o'zgaruvchilar ro'yxatidan e'lon qilingan qiymatni tanlash imkonini beradi. `a ?? b` ning natijasi u `null/undefined` bo'lmaguncha `a` ga, keyin `b` ga teng.

 Taqqoslashlar
: Tenglik tekshiruvi `==` har xil turdagi qiymatlarni (`null` va `undefined` dan tashqari, chunki ular bir-biridan boshqa hech narsaga teng emas) songa aylantiradi, shunday qilib, ular teng bo'ladi:

    ```js run
    alert( 0 == false ); // true
    alert( 0 == '' ); // true
    ```

    Boshqa taqqoslashlar ham songa aylantiriladi.

    Qat'iy tenglik tekshiruvi `===` konversiyani amalga oshirmaydi: har xil turlar u uchun turli qiymatlar hisoblanadi.

    `null` va `undefined` maxsus qiymatlardir: ular bir-biriga teng `==` va boshqa hech narsaga teng emas.

    Kattaroq/kichikroq taqqoslashlar stringlarni belgima-belgi solishtiradi, boshqa turlar esa songa aylantiriladi.

Boshqa operatorlar
: Vergul operatori kabi yana ba'zi boshqa operatorlar ham mavjud.

Bu haqida <info:operators>, <info:comparison>, <info:logical-operators>, <info:nullish-coalescing-operator> dan ko'proq ma'lumot olishingiz mumkin.

## Looplar

- Biz looplarning 3 ta turini ko'rib chiqdik:

    ```js
    // 1
    while (condition) {
      ...
    }

    // 2
    do {
      ...
    } while (condition);

    // 3
    for(let i = 0; i < 10; i++) {
      ...
    }
    ```

- `for(let...)` loopda e'lon qilingan o'zgaruvchi faqat loop ichida ko'rinadi. Ammo biz `let` ni tushirib qoldirishimiz va joriy o'zgaruvchidan qayta foydalanishimiz mumkin.
- `break/continue` direktivlari loop/joriy iteratsiyadan chiqish imkonini beradi. Ichma-ich looplarni buzish uchun labellardan foydalaning.

Bu haqida <info:while-for> dan ko'proq ma'lumot olishingiz mumkin.

Keyinchalik biz obyektlar bilan ishlash uchun ko'proq turdagi looplarni o'rganamiz.

## "switch" tuzilmasi

"switch" tuzilmasi bir nechta `if` tekshiruvlarining o'rnini bosa oladi. U taqqoslashlar uchun `===` (qat'iy tenglik) dan foydalanadi.

Masalan:

```js run
let age = prompt('Your age?', 18);

switch (age) {
  case 18:
    alert("Won't work"); // so'rovning natijasi raqam emas, balki satrdir
    break;

  case "18":
    alert("This works!");
    break;

  default:
    alert("Any value not equal to one above");
}
```

Ko'proq ma'lumot uchun <info:switch> ni ko'rib chiqing.

## Funksiyalar

Biz JavaScriptda funksiya yaratishning uchta usulini ko'rib chiqdik:

1. Function Declaration: asosiy kod oqimidagi funksiya

    ```js
    function sum(a, b) {
      let result = a + b;

      return result;
    }
    ```

2. Function Expression: ifoda kontekstidagi funksiya

    ```js
    let sum = function(a, b) {
      let result = a + b;

      return result;
    };
    ```

3. Arrow funksiyalar

    ```js
    // ifoda o'ng tomonda
    let sum = (a, b) => a + b;

    // yoki { ... } bilan ko'p qatorli sintaksis, bu yerga qaytishi kerak:
    let sum = (a, b) => {
      // ...
      return a + b;
    }

    // argumentlarsiz
    let sayHi = () => alert("Hello");

    // yagona argument bilan birga
    let double = n => n * 2;
    ```


- Funksiyalar mahalliy, ya'ni uning tanasida yoki parametrlar ro'yxatida e'lon qilingan o'zgaruvchilarga ega bo'lishi mumkin. Bunday o'zgaruvchilar faqat funksiya ichida ko'rinadi.
- Parameterlar doimiy qiymatga ega bo'ladi: `function sum(a = 1, b = 2) {...}`.
- Funksiyalar har doim nimanidir qaytaradi. Agar `return` ifodasi bo'lmasa, u holda natija `undefined` bo'ladi.

Ma'lumot uchun <info:function-basics>, <info:arrow-functions-basics> bobini ko'rib chiqing.

## Hali davom etadi

Bu JavaScript xususiyatlarining qisqacha ro'yxati edi. Hozircha biz faqat asosiy narsalarni o'rgandik. Kelgusi darsliklarda JavaScriptning boshqa maxsus va ilg'or xususiyatlari haqida bilib olasiz.
