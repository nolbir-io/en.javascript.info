# Ankorlarning ko'p qatorli rejimi ^ $, flag "m"

Ko'p qatorli rejim `pattern:m` bayrog'i bilan yoqiladi.

Bu faqat `pattern:^` va `pattern:$` xatti-harakatlariga ta'sir qiladi.

Ko'p qatorli rejimda ular faqat satrning boshida va oxirida emas, balki satr boshida/oxirida ham mos keladi.

## Qator boshida izlanmoqda ^

Quyidagi misolda matn bir nechta qatorlardan iborat. `pattern:/^\d/gm` pattern har bir satr boshidan raqam oladi:

```js run
let str = `1st place: Winnie
2nd place: Piglet
3rd place: Eeyore`;

*!*
console.log( str.match(/^\d/gm) ); // 1, 2, 3
*/!*
```

`pattern:m` bayrog'isiz faqat birinchi raqam mos keladi:

```js run
let str = `1st place: Winnie
2nd place: Piglet
3rd place: Eeyore`;

*!*
console.log( str.match(/^\d/g) ); // 1
*/!*
```

Buning sababi shundaki, sukut bo'yicha `pattern:^` karet faqat matn boshida, ko'p qatorli rejimda esa istalgan satr boshida mos keladi.

```smart
"Qator boshi" rasmiy ravishda "satr uzilishidan so‘ng" degan ma’noni anglatadi: ko'p qatorli rejimdagi `pattern:^` testi yangi qator belgisi `\n` oldidagi barcha pozitsiyalarga mos keladi.

Va matn boshida.
```

## $ qator oxirida qidirilmoqda

Dollar belgisi `pattern:$` xuddi shunday harakat qiladi.

`Pattern:\d$` muntazam ifodasi har bir satrdagi oxirgi raqamni topadi

```js run
let str = `Winnie: 1
Piglet: 2
Eeyore: 3`;

console.log( str.match(/\d$/gm) ); // 1,2,3
```

`Pattern:m` bayrog'i bo'lmasa, dollar `pattern:$` faqat butun matnning oxiriga to'g'ri keladi, shuning uchun faqat oxirgi raqam topiladi.

```smart
"Qator oxiri" rasmiy ravishda "satr uzilishidan oldin" degan ma'noni anglatadi: ko'p qatorli rejimdagi `pattern:$` testi `\n` yangi qator belgisidan keyingi barcha pozitsiyalarda mos keladi.

Va matn oxirida.
```

## ^ $ oʻrniga \n qidirilmoqda

Yangi qatorni topish uchun biz nafaqat `pattern:^` va `pattern:$` ankorlaridan, balki yangi qator `\n` belgisidan ham foydalanishimiz mumkin.

Nima farqi bor? Keling, bir misolni ko'rib chiqaylik.

Bu yerda `pattern:\d$` o'rniga `pattern:\d\n` ni qidiramiz:

```js run
let str = `Winnie: 1
Piglet: 2
Eeyore: 3`;

console.log( str.match(/\d\n/g) ); // 1\n,2\n
```

Ko'rib turganimizdek, 3 ta o'rniga 2 ta o'yin bor.

Buning sababi, `subject: 3` dan keyin yangi qator yo'q (ammo matn oxiri bor, shuning uchun u `pattern: $` ga mos keladi).

Yana bir farq: endi har bir o'yinda `match:\n` yangi qator belgisi mavjud. Faqat shartni (satrning boshi/oxiri) sinovdan o'tkazuvchi `pattern:^` `pattern:$` langar(anchor)laridan farqli o'laroq, `\n` belgidir, shuning uchun u natijaning bir qismiga aylanadi.

Shunday qilib, naqshdagi `\n` natijada yangi qator belgilari kerak bo'lganda, langarlar esa satr boshida/oxirida biror narsani topish uchun ishlatiladi.
