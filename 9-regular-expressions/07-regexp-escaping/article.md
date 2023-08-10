
# Escaping, maxsus belgilar

Ko'rib turganimizdek, teskari qiyshiq chiziq `pattern:\` belgilar sinflarini belgilash uchun ishlatiladi, masalan. `pattern:\d`. Demak, bu regexplardagi maxsus belgi (xuddi oddiy satrlardagi kabi).

Regexpda maxsus ma'noga ega bo'lgan boshqa maxsus belgilar ham mavjud, masalan, `pattern:[ ] { } ( ) \ ^ $ . | ? * +`. Ular yanada kuchli qidiruvlarni amalga oshirish uchun ishlatiladi.

Ro'yxatni eslab qolishga urinmang -- tez orada biz ularning har biri bilan shug'ullanamiz va siz ularni avtomatik ravishda yoddan bilib olasiz.

## Escaping (qochish)

Aytaylik, biz tom ma'noda nuqta topmoqchimiz. "Har qanday belgi" emas, faqat nuqta.

Maxsus belgidan oddiy belgi sifatida foydalanish uchun uning oldiga teskari chiziq qo'ying: `pattern:\.`.

Bu "belgidan qochish", ya'ni escaping a character deb ham ataladi.
For example:
```js run
alert( "Chapter 5.1".match(/\d\.\d/) ); // 5.1 (match!)
alert( "Chapter 511".match(/\d\.\d/) ); // null (haqiqiy nuqta qidirmoqda \.)
```

Qavslar ham maxsus belgilardir, shuning uchun agar biz ularni xohlasak, `pattern:\(` dan foydalanishimiz kerak. Quyidagi misol `"g()"` qatorini qidiradi:

```js run
alert( "function g()".match(/g\(\)/) ); // "g()"
```

Agar biz `\` teskari chiziq, ya'ni backslashni izlayotgan bo`lsak, bu oddiy satrlarda ham, regexplarda ham maxsus belgi, shuning uchun biz uni ikki barobarga oshirishimiz kerak.

```js run
alert( "1\\2".match(/\\/) ); // '\'
```

## Slash

slash belgisi maxsus belgi emas, lekin JavaScriptda u regexpni ochish va yopish uchun ishlatiladi: `pattern:/...pattern.../`, shuning uchun biz ham undan qochishimiz kerak.

`'/'` qiyshiq chiziqni qidirish quyidagicha bo'ladi:

```js run
alert( "/".match(/\//) ); // '/'
```

Boshqa tomondan, agar biz `pattern:/.../` dan foydalanmasak, lekin `new RegExp` yordamida regexp yaratsak, undan qochishimiz shart emas:

```js run
alert( "/".match(new RegExp("/")) ); // finds /
```

## new RegExp

Agar biz `new RegExp` bilan muntazam ifoda yaratayotgan bo'lsak, biz `/` dan qochishimiz shart emas, balki boshqa escaping ni bajarishimiz kerak.

Masalan, buni ko'rib chiqing:

```js run
let regexp = new RegExp("\d\.\d");

alert( "Chapter 5.1".match(regexp) ); // null
```

Oldingi misollardan biridagi shunga o'xshash qidiruv `pattern:/\d\.\d/` bilan ishlagan, lekin `new RegExp("\d\.\d")` ishlamayapti, nega?

Buning sababi shundaki, teskari chiziq chizig'i satr tomonidan "iste'mol qilinadi". Eslatib o'tamiz, oddiy satrlar o'ziga xos belgilarga ega, masalan, `\n` va qochish uchun teskari chiziq ishlatiladi.

"\d\.\d" quyidagicha qabul qilinadi:

```js run
alert("\d\.\d"); // d.d
```

Satr quote'lari teskari chiziqchalarni "iste'mol qiladi" va ularni mustaqil ravishda izohlaydi, masalan:

- `\n` -- yangi satr belgisiga aylanadi,
- `\u1234` -- bunday kod bilan Unicode belgisiga aylanadi,
-  Va hech qanday maxsus ma'no bo'lmasa: `pattern:\d` yoki `\z` kabi, teskari chiziq shunchaki olib tashlanadi.

Shunday qilib, `new RegExp` teskari chiziqsiz qatorni oladi. Shuning uchun qidiruv ishlamaydi!

Buni tuzatish uchun biz ikki marta teskari qiyshiq chiziq qo'yishimiz kerak, chunki qator tirnoqlari `\\` ni `\` ga aylantiradi:

```js run
*!*
let regStr = "\\d\\.\\d";
*/!*
alert(regStr); // \d\.\d (hozir to'g'ri)

let regexp = new RegExp(regStr);

alert( "Chapter 5.1".match(regexp) ); // 5.1
```

## Xulosa

- Maxsus belgilarni qidirish uchun `pattern:[ \ ^ $ . | ? * + ( )` so'zma-so'z, biz ularni teskari qirrali `\` ("escape them") bilan qo'yishimiz kerak.
- Agar biz `pattern:/.../` ichida bo'lsak, `/` dan qochishimiz kerak (lekin `new RegExp` ichida emas).
- `new RegExp` ga satrni o'tkazishda biz `\\` teskari chiziqni ikki marta qo'yishimiz kerak, buning natijasida qator qo'shtirnoqlari ulardan birini iste'mol qiladi.
