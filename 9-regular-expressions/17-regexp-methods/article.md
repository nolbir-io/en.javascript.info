# RegExp va String usullari

Ushbu maqolada biz regexps bilan chuqur ishlaydigan turli usullarni ko'rib chiqamiz.

## str.match(regexp)

`str.match(regexp)` usuli `str` qatoridagi `regexp` uchun mosliklarni topadi.

U 3 ta rejimga ega:

1. Agar `regexp` da `pattern:g` bayrog'i bo'lmasa, u birinchi moslikni `index` (moslik o'rni), `input` (kirish qatori, `str` bilan teng) olish guruhlari va xususiyatlariga ega massiv sifatida qaytaradi:

    ```js run
    let str = "I love JavaScript";

    let result = str.match(/Java(Script)/);

    alert( result[0] );     // JavaScript (to'liq moslik)
    alert( result[1] );     // Skript (birinchi suratga olish guruhi)
    alert( result.length ); // 2

    // Qo'shimcha ma'lumot:
    alert( result.index );  // 7 (moslik pozitsiyasi)
    alert( result.input );  // I love JavaScript (manbaa stringi)
    ```

2. Agar `regexp` da `pattern:g` bayrog'i bo'lsa, u guruhlar va boshqa tafsilotlarni yozmasdan, barcha mos keladigan qatorni qatorlar sifatida qaytaradi.
    ```js run
    let str = "I love JavaScript";

    let result = str.match(/Java(Script)/g);

    alert( result[0] ); // JavaScript
    alert( result.length ); // 1
    ```

3. Agar `pattern:g` bayrog'i bor yoki yo'qligidan qat'iy nazar, mos kelmasa, `null` qaytariladi.

   Bu muhim nyuans. Agar mosliklar bo'lmasa, biz bo'sh massivni olmaymiz, lekin `null` ni olamiz. Buni unutib xato qilish oson, masalan:

    ```js run
    let str = "I love JavaScript";

    let result = str.match(/HTML/);

    alert(result); // null
    alert(result.length); // Error: Nullning "length" xususiyatini o'qib bo'lmaydi
    ```

    Natija massiv bo'lishini istasak, quyidagicha yozishimiz mumkin:

    ```js
    let result = str.match(regexp) || [];
    ```

## str.matchAll(regexp)

[recent browser="new"]

`str.matchAll(regexp)` usuli `str.match` ning "yangiroq, takomillashtirilgan" variantidir.

U asosan barcha guruhlar bilan barcha mosliklarni qidirish uchun ishlatiladi.

`Match`dan 3 ta farqi bor:

1. U massiv o'rniga mos keladigan takrorlanadigan obyektni qaytaradi. Undan `Array.from` yordamida oddiy massiv yasashimiz mumkin.
2. Har bir moslik qo'lga olingan guruhlarga ega massiv sifatida qaytariladi (`str.match` bilan bir xil format `pattern:g` belgisisiz).
3. Natijalar bo'lmasa, u `null` o'rniga bo'sh takrorlanadigan obyektni qaytaradi.

Amaliy misol:

```js run
let str = '<h1>Hello, world!</h1>';
let regexp = /<(.*?)>/g;

let matchAll = str.matchAll(regexp);

alert(matchAll); // [object RegExp String Iterator], array emas, lekin iterable (takrorlanadigan)

matchAll = Array.from(matchAll); // endi array 

let firstMatch = matchAll[0];
alert( firstMatch[0] );  // <h1>
alert( firstMatch[1] );  // h1
alert( firstMatch.index );  // 0
alert( firstMatch.input );  // <h1>Hello, world!</h1>
```

Agar biz `matchAll` mosliklarini aylantirish uchun `for..of` dan foydalansak, endi `Array.from` kerak emas.

## str.split(regexp|substr, limit)

Ajratuvchi sifatida regexp (yoki pastki qator) yordamida qatorni ajratadi.

Biz `split` dan quyidagi kabi satrlar bilan foydalanishimiz mumkin:

```js run
alert('12-34-56'.split('-')) // ['12', '34', '56'] dagi array
```

Ammo biz oddiy ibora bilan ham quyidagi kabi ajratishimiz mumkin:

```js run
alert('12, 34, 56'.split(/,\s*/)) // ['12', '34', '56'] dagi array
```

## str.search(regexp)

`str.search(regexp)` usuli birinchi mos keladigan joyni yoki topilmasa, `-1`ni qaytaradi:

```js run
let str = "A drop of ink may make a million think";

alert( str.search( /ink/i ) ); // 10 (birinchi moslik pozitsiyasi)
```

**Muhim cheklov: `search` faqat birinchi moslikni topadi.**

Agar bizga keyingi moslik pozitsiyalari kerak bo'lsa, biz boshqa vositalardan foydalanishimiz kerak, masalan, `str.matchAll(regexp)` yordamida ularning barchasini topish.

## str.replace(str|regexp, str|func)

Bu qidirish va almashtirishning eng foydali umumiy usullardan biridir . Qidiruv va almashtirish uchun Shveytsariya armiyasi pichog'idan foydalanamiz.

Biz undan pastki qatorni qidirish va almashtirishda regexpssiz ishlatishimiz mumkin:

```js run
// chiziqchani ikki nuqta bilan almashtiring
alert('12-34-56'.replace("-", ":")) // 12:34-56
```

Biroq, bu yerda tuzoq bor.

**`replace` ning birinchi argumenti satr bo'lsa, u faqat birinchi moslikni almashtiradi.**

Buni yuqoridagi misolda ko'rishingiz mumkin: faqat birinchi `"-"` `":"` bilan almashtirilgan.

Barcha defislarni topish uchun biz `"-"` qatorini emas, balki regexp `pattern:/-/g`, majburiy `pattern:g` bayrog'ini ishlatishimiz kerak:

```js run
// barcha chiziqlarni ikki nuqta bilan almashtiring
alert( '12-34-56'.replace( *!*/-/g*/!*, ":" ) )  // 12:34:56
```

Ikkinchi argument string o'rnini bosuvchi qatordir. Unda biz maxsus belgilardan foydalanishimiz mumkin:

| Belgilar | O'zgartirish qatoridagi harakat |
|--------|--------|
|`$&`|barcha moslikni kiritadi|
|<code>$&#096;</code>|o'yindan oldin qatorning bir qismini kiritadi|
|`$'`|moslikdan keyingi satrning bir qismini kiritadi|
|`$n`|agar `n` 1-2 xonali raqam bo'lsa, n-tortib olish guruhi tarkibini kiritadi, batafsil ma'lumot uchun [](info:regexp-groups)|
|`$<name>`|qavslar mazmunini berilgan `name` bilan kiritadi, batafsil ma'lumot uchun [](info:regexp-groups)|
|`$$`|`$` | belgisini kiritadi

Masalan:

```js run
let str = "John Smith";

// ism va familiyani almashtiring
alert(str.replace(/(john) (smith)/i, '$2, $1')) // Smith, John
```

**"Smart" almashtirishni talab qiladigan vaziyatlar uchun ikkinchi argument funksiya bo'lishi mumkin.**

U har bir moslik uchun chaqiriladi va qaytarilgan qiymat almashtirish sifatida kiritiladi.

Funksiya `func(match, p1, p2, ..., pn, ofset, input, groups)` argumentlari bilan chaqiriladi:

1. `match` -- match,
2. `p1, p2, ..., pn` -- qo'lga olish guruhlari tarkibi (agar mavjud bo'lsa),
3. `ofset` -- matchning pozitsiyasi,
4. `kiritish` -- manbaa qatori,
5. `guruhlar` -- nomli guruhlarga ega obyekt.

Agar regexpda qavslar bo'lmasa, u holda faqat 3 ta argument mavjud: `func(str, ofset, input)`.

Masalan, keling, barcha mosliklarni bosh harf bilan yozamiz:

```js run
let str = "html and css";

let result = str.replace(/html|css/gi, str => str.toUpperCase());

alert(result); // HTML and CSS
```

Har bir moslikni satrdagi o'rni bilan almashtiring:

```js run
alert("Ho-Ho-ho".replace(/ho/gi, (match, offset) => offset)); // 0-3-6
```

Quyidagi misolda ikkita qavs mavjud, shuning uchun almashtirish funktsiyasi 5 ta argument bilan chaqiriladi: birinchisi to'liq moslik, keyin 2 qavs va undan keyin (misolda ishlatilmaydi) moslik pozitsiyasi va manba qatori berilgan:

```js run
let str = "John Smith";

let result = str.replace(/(\w+) (\w+)/, (match, name, surname) => `${surname}, ${name}`);

alert(result); // Smith, John
```

Agar guruhlar ko'p bo'lsa, ularga kirish uchun dam olish parametrlaridan foydalanish qulayroq:

```js run
let str = "John Smith";

let result = str.replace(/(\w+) (\w+)/, (...match) => `${match[2]}, ${match[1]}`);

alert(result); // Smith, John
```

Yoki biz nomli guruhlardan foydalanayotgan bo'lsak, ular bilan birga `grooups` obyekti har doim oxirgi bo'ladi, shuning uchun uni quyidagicha olishimiz mumkin:

```js run
let str = "John Smith";

let result = str.replace(/(?<name>\w+) (?<surname>\w+)/, (...match) => {
  let groups = match.pop();

  return `${groups.surname}, ${groups.name}`;
});

alert(result); // Smith, John
```

Funksiyadan foydalanish bizga yakuniy almashtirish quvvatini beradi, chunki u o'yin haqidagi barcha ma'lumotlarni oladi, tashqi o'zgaruvchilarga kirish huquqiga ega va hamma narsani bajaroladi.

## str.replaceAll(str|regexp, str|func)

Bu usul asosan `str.replace` bilan bir xil bo'lib, ikkita asosiy farqqa ega:

1. Agar birinchi argument satr bo'lsa, u satrning *barcha takrorlanishlar* o'rnini bosadi, `replace` esa faqat *birinchi hodisani* almashtiradi.
2. Agar birinchi argument `g` bayrog'isiz muntazam ifoda bo'lsa, xatolik yuz beradi. `G` bayrog'i `replace` bilan bir xil ishlaydi.

`replaceAll` ning asosiy qo'llanilishi satrning barcha holatlarini almashtirishdir.

Quyidagi kabi:

```js run
// barcha chiziqlarni ikki nuqta bilan almashtiring
alert('12-34-56'.replaceAll("-", ":")) // 12:34:56
```


## regexp.exec(str)

`regexp.exec(str)` usuli `str` qatoridagi `regexp` uchun moslikni qaytaradi. Oldingi usullardan farqli o'laroq, u satrda emas, balki regexp orqali chaqiriladi.

Regexp `pattern:g` bayrog'iga ega yoki yo'qligiga qarab u boshqacha harakat qiladi.

Agar `pattern:g` bo'lmasa, `regexp.exec(str)` birinchi moslikni aynan `str.match(regexp)` sifatida qaytaradi. Bu xatti-harakat yangi hech narsa keltirmaydi.

Ammo agar `pattern:g` bayrog'i bo'lsa, unda:
- `regexp.exec(str)` ga qo'ng'iroq birinchi moslikni qaytaradi va darhol undan keyingi joyni `regexp.lastIndex` xususiyatida saqlaydi.
- Keyingi bunday qo'ng'iroq `regexp.lastIndex` pozitsiyasidan qidirishni boshlaydi, keyingi moslikni qaytaradi va undan keyingi joyni `regexp.lastIndex` da saqlaydi.
- ...Va hokazo.
- Agar mos kelmasa, `regexp.exec` `null`ni qaytaradi va `regexp.lastIndex` ni `0` ga qaytaradi.

Shunday qilib, takroriy qo'ng'iroqlar joriy qidiruv holatini kuzatish uchun `regexp.lastIndex` xususiyatidan foydalanib, barcha mosliklarni birin-ketin qaytaradi.

Ilgari, JavaScriptga `str.matchAll` usuli qo'shilishidan oldin, guruhlar bilan barcha mosliklarni olish uchun siklda `regexp.exec` qo'ng'iroqlari ishlatilgan:

```js run
let str = 'JavaScript haqida yanada chuqurroq bilish uchun: https://javascript.info';
let regexp = /javascript/ig;

let result;

while (result = regexp.exec(str)) {
  alert( `Found ${result[0]} at position ${result.index}` );
  // 11-pozitsiyada JavaScript topildi, keyin
   // 33-pozitsiyada javascript topildi
}
```

Bu hozir ham ishlaydi, garchi yangi brauzerlar uchun `str.matchAll` odatda qulayroqdir.

**Biz `lastIndex`ni qo'lda o'rnatish orqali berilgan joydan qidirish uchun `regexp.exec` dan foydalanishimiz mumkin.**

Masalan:

```js run
let str = 'Hello, world!';

let regexp = /\w+/g; // flag "g" bayrog'isiz lastIndex xususiyati e'tiborga olinmaydi
regexp.lastIndex = 5; // 5-pozitsiyadan qidiring (verguldan boshlab)

alert( regexp.exec(str) ); // world
```

Agar regexpda `pattern:y` belgisi bo'lsa, qidiruv `regexp.lastIndex` pozitsiyasida amalga oshiriladi, bundan keyin emas.

Yuqoridagi misoldagi `pattern:g` belgisini `pattern:y` bilan almashtiramiz. `5` pozitsiyasida hech qanday so'z yo'qligi sababli hech narsa mos kelmaydi:

```js run
let str = 'Hello, world!';

let regexp = /\w+/y;
regexp.lastIndex = 5; // 5-pozitsiyada aniq qidiring

alert( regexp.exec(str) ); // null
```

Bu biz satrdan biror narsani regexp orqali "o'qishimiz" kerak bo'lgan holatlar uchun qulaydir, boshqa joyda emas.

## regexp.test(str)

`regexp.test(str)` usuli moslikni qidiradi va u mavjud bo'lsa, `true/false` ni qaytaradi.

Masalan:

```js run
let str = "I love JavaScript";

// quyidagi ikkita test bir xil vazifani bajaradi
alert( *!*/love/i*/!*.test(str) ); // true
alert( str.search(*!*/love/i*/!*) != -1 ); // true
```

Manfiy javobga ega namuna:

```js run
let str = "Bla-bla-bla";

alert( *!*/love/i*/!*.test(str) ); // false
alert( str.search(*!*/love/i*/!*) != -1 ); // false
```

Agar regexpda `pattern:g` bayrog'i bo'lsa, `regexp.test` `regexp.lastIndex` xususiyatidan ko'rinadi va xuddi `regexp.exec` kabi bu xususiyatni yangilaydi.

Shunday qilib, biz uni ma'lum bir pozitsiyadan qidirish uchun ishlatishimiz mumkin:

```js run
let regexp = /love/gi;

let str = "I love JavaScript";

// 10-pozitsiyadan qidiruvni boshlang:
regexp.lastIndex = 10;
alert( regexp.test(str) ); // false (moslik yo'q)
```

````warn header="Turli manbalarda qayta-qayta sinovdan o'tgan bir xil global regexp muvaffaqiyatsiz bo'lishi mumkin"
Agar biz bir xil global regexpni turli ma'lumotlarga qo'llasak, bu noto'g'ri natijaga olib kelishi mumkin, chunki `regexp.test` qo'ng'irog'i `regexp.lastIndex` xususiyatini ilgari suradi, shuning uchun boshqa qatorda qidirish nolga teng bo'lmagan joydan boshlanishi mumkin.

Misol uchun, bu yerda biz bir xil matnda ikki marta `regexp.test` ni chaqiramiz va u ikkinchi marta bajarilmaydi:

```js run
let regexp = /javascript/g;  // (regexp just created: regexp.lastIndex=0)

alert( regexp.test("javascript") ); // true (regexp.lastIndex=10 now)
alert( regexp.test("javascript") ); // false
```

Buning sababi, ikkinchi testda `regexp.lastIndex` nolga teng emas.

Buni hal qilish uchun har bir qidiruvdan oldin `regexp.lastIndex = 0` ni o'rnatishimiz mumkin. Yoki regexp da qo'ng'iroq qilish usullari o'rniga `str.match/search/...` qator usullaridan foydalaning, ular "lastIndex" dan foydalanmaydi.
````
