# Shakllar va bayroqlar

Muntazam iboralar matnda qidirish va almashtirishning kuchli usulini ta'minlovchi shakllardir.

JavaScriptda ular [RegExp](mdn:js/RegExp) obyekti orqali mavjud, shuningdek, ular satrlar usullarida birlashtirilgan.

## Oddiy ifodalar

Muntazam ifoda (shuningdek, "regexp" yoki shunchaki "reg") *shakl* va ixtiyoriy *bayroqlar* dan iborat.

Muntazam ifoda obyektini yaratish uchun ishlatilishi mumkin bo'lgan ikkita sintaksis mavjud.

"uzun" sintaksis:

```js
regexp = new RegExp("pattern", "flags");
```

Va "qisqa", slash yordamida `"/"`:

```js
regexp = /pattern/; // bayroqlar yo'q
regexp = /pattern/gmi; // g,m va i bayroqlari bilan (tez orada qoplanadi)
```

Slash `pattern:/.../` JavaScriptga biz muntazam ifoda yaratayotganimizni bildiradi. Ular satrlar uchun tirnoq bilan bir xil rol o'ynaydi.

Ikkala holatda ham `regexp` o'rnatilgan `RegExp` sinfining namunasiga aylanadi.

Bu ikki sintaksis o'rtasidagi asosiy farq shundaki, `/.../` qiyshiq chiziqdan foydalanilgan shakl iboralarni qo'shishga ruxsat bermaydi (masalan, `${...}` bo'lgan satr shablonining literallari). Ular butunlay statikdir.

Kod yozish vaqtida muntazam iborani bilganimizda, slash ishlatiladi - bu eng keng tarqalgan holat. `new RegExp` tez-tez dinamik ravishda yaratilgan satrdan "tezda" regexp yaratish kerak bo'lganda ishlatiladi. Masalan:

```js
let tag = prompt("What tag do you want to find?", "h2");

let regexp = new RegExp(`<${tag}>`); // yuqoridagi taklifda "h2" deb javob berilsa, /<h2>/ bilan bir xil
```

## Bayroqlar

Oddiy iboralar qidiruvga ta'sir qiluvchi bayroqlarga ega bo'lishi mumkin.

JavaScriptda ulardan faqat 6 tasi mavjud:

`pattern:i`
: Bu bayroq bilan qidiruv katta-kichik harflarga sezgir emas: `A` va `a` o'rtasida farq yo'q (quyidagi misolga qarang).

`pattern:g`
: Bu bayroq bilan qidiruv barcha mosliklarni qidiradi, usiz -- faqat birinchi moslik qaytariladi.

`pattern:m`
: Ko'p qatorli rejim (<info:regexp-multiline-mode> bo'limida yoritilgan).

`pattern:s`
: Nuqta `pattern:.` yangi qator belgisi `\n` (<info:regexp-character-classes> bobida yoritilgan) mos kelishiga imkon beruvchi "dotall" rejimini yoqadi.

`pattern:u`
: Unicode to'liq qo'llab-quvvatlashni yoqadi. Bayroq surrogat juftlarini to'g'ri qayta ishlash imkonini beradi. Bu haqda batafsilroq <info:regexp-unicode> bobida o'qishingiz mumkin. 

`pattern:y`
: "Sticky" rejimi: matndagi aniq pozitsiyada qidirish (<info:regexp-sticky> bobida yoritilgan)

```smart header="Colors"
Bu yerda rang sxemasi berilgan:

- regexp -- `pattern:red`
- string (biz qidiradigan joy) -- `subject:blue`
- result -- `match:green`
```

## Qidirilmoqda: str.match

Yuqorida aytib o'tilganidek, muntazam iboralar string usullari bilan birlashtirilgan.

`str.match(regexp)` usuli `str` qatoridagi `regexp` ning barcha mosliklarini topadi.

U 3 ta ish rejimiga ega:

1. Agar muntazam ifodada `pattern:g` bayrog'i bo'lsa, u barcha mosliklar qatorini qaytaradi:
    ```js run
    let str = "We will, we will rock you";

    alert( str.match(/we/gi) ); // We,we (mos keladigan 2 ta pastki qatorlar massivi)
    ```
    Esda tutingki, `match:We` va `match:we` ikkalasi ham topiladi, chunki `pattern:i` bayroqchasi muntazam ifodani katta-kichik harflarga sezgir qilmaydi.

2. Agar bunday bayroq bo'lmasa, u faqat massiv ko'rinishidagi birinchi moslikni qaytaradi, to'liq moslik `0` indeksida va xususiyatlardagi ba'zi qo'shimcha tafsilotlar bilan ko'rsatilgan:
    ```js run
    let str = "We will, we will rock you";

    let result = str.match(/we/i); // g bayrog'isiz

    alert( result[0] );     // We (1-o'yin)
    alert( result.length ); // 1

    // Details:
    alert( result.index );  // 0 (o'yin pozitsiyasi)
    alert( result.input );  // We will, we will rock you (manba qatori)
    ```
    Agar muntazam ifodaning bir qismi qavs ichiga olingan bo'lsa, massivda `0` dan tashqari boshqa indekslar ham bo'lishi mumkin. Biz buni <info:regexp-groups> bobida ko'rib chiqamiz.

3. Va nihoyat, agar mos keladiganlar bo'lmasa, `null` qaytariladi (`pattern:g` bayroqchasi bor yoki yo'qligi muhim emas).

    Bu juda muhim nyuans. Agar mos keladiganlar bo'lmasa, biz bo'sh massivni olmaymiz, balki `null` ni olamiz. Buni unutish xatolarga olib kelishi mumkin, masalan:

    ```js run
    let matches = "JavaScript".match(/HTML/); // = null

    if (!matches.length) { // Error: Nullning 'length' xususiyatini o'qib bo'lmaydi
      alert("Yuqoridagi qatorda error mavjud");
    }
    ```

    Agar natija har doim massiv bo'lishini istasak, uni quyidagicha yozishimiz mumkin:

    ```js run
    let matches = "JavaScript".match(/HTML/)*!* || []*/!*;

    if (!matches.length) {
      alert("No matches"); // endi u ishlaydi
    }
    ```

## O'zgartirish: str.replace

`str.replace(regexp, replacement)` usuli `str` qatoridagi `regexp` yordamida topilgan mosliklarni `replacement` bilan almashtiradi (barcha mosliklar `pattern:g` bayrog'i bo`lsa, aks holda faqat birinchisi almashtiriladi).

Masalan:

```js run
// g bayrog'i yo'q
alert( "We will, we will".replace(/we/i, "I") ); // I will, we will

// g bayrog'i bilan
alert( "We will, we will".replace(/we/ig, "I") ); // I will, I will
```

Ikkinchi argument `replacement` qatoridir. O'yin qismlarini kiritish uchun biz unda maxsus belgilar kombinatsiyasidan foydalanishimiz mumkin:

| Belgilar | O'zgartirish qatoridagi harakat |
|--------|--------|
|`$&`|butun o'yinni kiritadi|
|<code>$&#096;</code>|o'yindan oldin qatorning bir qismini kiritadi|
|`$'`|o'yindan keyin qatorning bir qismini kiritadi|
|`$n`|agar `n` 1-2 xonali son bo'lsa, u n-qavslar mazmunini kiritadi, bu haqda batafsilroq <info:regexp-groups> bo'limida|
|`$<name>`|Qavslar tarkibini berilgan `name` bilan kiritadi, bu haqda batafsil <info:regexp-groups>| bobida.
|`$$`|`$` belgisini kiritadi|

`Pattern:$&` bilan misol:

```js run
alert( "I love HTML".replace(/HTML/, "$& and JavaScript") ); // I love HTML and JavaScript
```

## Sinov: regexp.test

`regexp.test(str)` usuli kamida bitta moslikni qidiradi, agar topilsa, `true`, aks holda `false` qiymatini qaytaradi.

```js run
let str = "I love JavaScript";
let regexp = /LOVE/i;

alert( regexp.test(str) ); // true
```

Keyinchalik bu bobda biz ko'proq muntazam iboralarni o'rganamiz, ko'proq misollar va boshqa usullar bilan tanishamiz.

Usullar haqida to'liq ma'lumot <info:regexp-methods> maqolasida keltirilgan.

## Xulosa

- Muntazam ibora shakl va ixtiyoriy bayroqlardan iborat: `pattern:g`, `pattern:i`, `pattern:m`, `pattern:u`, `pattern:s`, `pattern:y`.
- Bayroqlar va maxsus belgilarsiz (buni keyinroq o'rganamiz), regexp orqali qidirish pastki qator qidiruvi bilan bir xil.
- `str.match(regexp)` usuli mosliklarni qidiradi: agar `pattern:g` bayrog'i bo'lsa, ularning barchasini, aks holda, faqat birinchisini qidiradi.
- `str.replace(regexp, replacement)` usuli `regexp` yordamida topilgan mosliklarni `replacement` bilan almashtiradi: agar `pattern:g` bayrog'i bo'lsa, ularning barchasini, aks holda faqat birinchisini almashtiradi.
- `regexp.test(str)` usuli kamida bitta moslik bo'lsa `true`ni qaytaradi, aks holda `false`ni qaytaradi.
