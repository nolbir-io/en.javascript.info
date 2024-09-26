# Miqdor ko'rsatkichlari +, *, ? va {n}

Aytaylik, bizda `+7(903)-123-45-67` kabi qator bor va undagi barcha raqamlarni topmoqchimiz. Ammo avvalgidan farqli o'laroq, bizni yakka raqamlar emas, balki to'liq raqamlar qiziqtiradi: `7, 903, 123, 45, 67`.

Raqam 1 yoki undan ortiq raqamlar ketma-ketligi `pattern:\d`. Bizga qancha kerakligini belgilash uchun biz *miqdoriy belgini* qo'shishimiz mumkin.

## Miqdor {n}

Eng oddiy miqdor ko'rsatgichi figurali qavslar ichidagi sondir: `pattern:{n}`.

Miqdor belgiga (yoki belgilar sinfiga yoki `[...]` to'plamiga h.k.) qo'shiladi va bizga qancha kerakligini belgilaydi.

Uning bir nechta rivojlangan shakllari bor, keling, misollarni ko'rib chiqaylik:

Aniq son: `pattern:{5}`
: `pattern:\d{5}` aniq 5 ta raqamni bildiradi, `pattern:\d\d\d\d\d` bilan bir xil.

    Quyidagi misol 5 xonali raqamni qidiradi:

    ```js run
    alert( "I'm 12345 years old".match(/\d{5}/) ); //  "12345"
    ```

    Uzunroq raqamlarni chiqarib tashlash uchun `\b` qo'shishimiz mumkin: `pattern:\b\d{5}\b`.

 Diapazon: `pattern:{3,5}`, 3-5 marta mos
: 3 dan 5 gacha raqamlarni topish uchun biz chegaralarni figurali qavs ichiga qo'yishimiz mumkin: `pattern:\d{3,5}`

    ```js run
    alert( "I'm not 12, but 1234 years old".match(/\d{3,5}/) ); // "1234"
    ```

    Biz yuqori chegarani o'tkazib yuborishimiz mumkin.

    Keyin regexp `pattern:\d{3,}` `3` yoki undan ortiq uzunlikdagi raqamlar ketma-ketligini qidiradi:

    ```js run
    alert( "I'm not 12, but 345678 years old".match(/\d{3,}/) ); // "345678"
    ```

 Keling, `+7(903)-123-45-67` qatoriga qaytaylik.

Raqam - bu ketma-ket bir yoki bir nechta raqamlarning ketma-ketligi. Shunday qilib, regexp `pattern:\d{1,}`:

```js run
let str = "+7(903)-123-45-67";

let numbers = str.match(/\d{1,}/g);

alert(numbers); // 7,903,123,45,67
```

## Qisqartmalar

Ko'p ishlatiladigan miqdor ko'rsatgichlari uchun qisqartmalar mavjud:

`pattern:+`
: "Bir yoki bir nechta" degan ma'noni anglatadi, `pattern:{1,}` bilan bir xil.

    Masalan, `pattern:\d+` raqamlarni qidiradi:

    ```js run
    let str = "+7(903)-123-45-67";

    alert( str.match(/\d+/g) ); // 7,903,123,45,67
    ```

`pattern:?`
: "Nol yoki bitta" degan ma'noni anglatadi, `pattern:{0,1}` bilan bir xil. Boshqacha qilib aytganda, bu belgini ixtiyoriy qiladi.

    Misol uchun, `pattern:ou?r` qolipi `match:o` dan keyin nol yoki bitta `match:u` va keyin `match:r` ni qidiradi.

    Shunday qilib, `pattern:colou?r` ikkala `match:colour` va `match:colour`ni topadi:

    ```js run
    let str = "Should I write color or colour?";

    alert( str.match(/colou?r/g) ); // color, colour
    ```

`pattern:*`
: "Nol yoki undan ko'p" degan ma'noni anglatadi, `pattern:{0,}"` bilan bir xil. Ya'ni, xarakter har qanday vaqtda takrorlanishi yoki yo'q bo'lishi mumkin.

    Masalan, `pattern:\d0*` raqamdan keyin istalgan sondagi nollarni qidiradi (ko'p yoki hech kim bo'lmasligi mumkin):

    ```js run
    alert( "100 10 1".match(/\d0*/g) ); // 100, 10, 1
    ```

    Uni `pattern:+` (bir yoki bir nechta) bilan solishtiring:

    ```js run
    alert( "100 10 1".match(/\d0+/g) ); // 100, 10
    // 1 mos kelmadi, chunki 0+ kamida bitta nolni talab qiladi
    ```

## Ko'proq misollar

Miqdor ko'rsatgichlari juda tez-tez ishlatiladi. Ular murakkab muntazam iboralarning asosiy "qurilish bloki" bo'lib xizmat qiladi, shuning uchun ko'proq misollarni ko'rib chiqamiz. 

**O'nli kasrlar uchun regexp (suzuvchi nuqtali raqam): `pattern:\d+\.\d+`**

Amaliyotda:
```js run
alert( "0 1 12.345 7890".match(/\d+\.\d+/g) ); // 12.345
```

**"<span>` yoki `<p>` kabi "atribyutlarsiz ochiladigan HTML tegi" uchun Regexp.**

1. Eng oddiysi: `pattern:/<[a-z]+>/i`

    ```js run
    alert( "<body> ... </body>".match(/<[a-z]+>/gi) ); // <body>
    ```

    Regexp `pattern:'<'` belgisini, keyin bir yoki bir nechta lotin harflarini, so'ngra `pattern:'>'` belgisini qidiradi.

2. Rivojlantirilgan: `pattern:/<[a-z][a-z0-9]*>/i`

  Standartga ko'ra, HTML teg nomi birinchisidan tashqari har qanday holatda raqamga ega bo'lishi mumkin, masalan, `<h1>`.

    ```js run
    alert( "<h1>Hi!</h1>".match(/<[a-z][a-z0-9]*>/gi) ); // <h1>
    ```

 **Regexp "atribyutlarsiz HTML tegini ochish yoki yopish": `pattern:/<\/?[a-z][a-z0-9]*>/i`**

 Pattern boshiga ixtiyoriy slash `pattern:/?` qo'shdik. Undan teskari chiziq bilan qochish kerak edi, aks holda JavaScript bu patternning oxiri deb o'ylaydi.

```js run
alert( "<h1>Hi!</h1>".match(/<\/?[a-z][a-z0-9]*>/gi) ); // <h1>, </h1>
```

```smart header="Regexpni aniqroq qilish uchun biz ko'pincha uni murakkabroq qilishimiz kerak"
Ushbu misollarda biz bitta umumiy qoidani ko'rishimiz mumkin: muntazam ifoda qanchalik aniq bo'lsa, u shunchalik uzunroq va murakkabroq bo'ladi.

Masalan, HTML teglari uchun biz oddiyroq regexpdan foydalanishimiz mumkin: `pattern:<\w+>`. Lekin HTMLda teg nomi uchun qattiqroq cheklovlar borligi sababli, `pattern:<[a-z][a-z0-9]*>` ishonchliroq.

Biz `pattern:<\w+>` dan foydalana olamizmi yoki bizga `pattern:<[a-z][a-z0-9]*>` kerakmi?

Haqiqiy hayotda ikkala variant ham qabul qilinadi. Bu "qo'shimcha" o'yinlarga qanchalik bardoshli bo'lishimiz va ularni boshqa usullar bilan natijadan olib tashlashning qanchalik qiyinligiga bog'liq.
```
