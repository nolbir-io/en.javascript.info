# Langarlar(anchors): string start ^ va end $

Regexpda karet `pattern:^` va dollar `pattern:$` belgilar alohida ma'noga ega. Ular "langarlar" deb ataladi.

Matn boshida `pattern:^` karet, oxirida esa dollar `pattern:$` mos keladi.

Masalan, matn `Mary` bilan boshlangan yoki yo'qligini tekshirib ko'raylik:

```js run
let str1 = "Mary had a little lamb";
alert( /^Mary/.test(str1) ); // true
```

`pattern:^Mary` namunasi: "string start, keyin Mary" degan ma'noni anglatadi.

Shunga o'xshab, satr `snow` (qor)  bilan tugashini `pattern:snow$` yordamida tekshirishimiz mumkin:

```js run
let str1 = "its fleece was white as snow";
alert( /snow$/.test(str1) ); // true
```

Bunday holatlarda biz `startsWith/endsWith` string usullaridan foydalanishimiz mumkin. Murakkab testlar uchun oddiy iboralardan foydalanish kerak.

## To'liq moslik uchun sinov

Ikkala langar birgalikda `pattern:^...$` ko'pincha satr patternga to'liq mos keladimi yoki yo'qligini tekshirish uchun ishlatiladi. Masalan, foydalanuvchi kiritish to'g'ri formatdaligi yoki yo'qligini tekshirish mumkin.

Keling, satr `12:34` formatidagi vaqt ekanligini tekshirib ko'ramiz. Ya'ni: ikkita raqam, keyin ikki nuqta va yana ikkita raqam.

Oddiy iboralar tilida `pattern:\d\d:\d\d`:

```js run
let goodInput = "12:34";
let badInput = "12:345";

let regexp = /^\d\d:\d\d$/;
alert( regexp.test(goodInput) ); // true
alert( regexp.test(badInput) ); // false
```

Bu yerda `pattern:\d\d:\d\d` uchun moslik `pattern:^` matni boshidan keyin boshlanishi kerak va `pattern:$` oxiri darhol kelishi lozim.

Butun satr aynan shu formatda bo'lishi kerak. Agar biror og'ish yoki qo'shimcha belgi bo'lsa, natija `false` bo'ladi.

Agar `pattern:m` belgisi mavjud bo'lsa, langarlar boshqacha harakat qiladi. Buni keyingi maqolada ko'ramiz.

```smart header="Ankorlar \"nol kengligi\""ga ega
Anchor `pattern:^` va `pattern:$` sinovlardir. Ularning kengligi nolga teng.

Boshqacha qilib aytganda, ular belgiga mos kelmaydi, balki regexp mexanizmini shartni tekshirishga majbur qiladi (matnni boshlash/tugatish).
```
