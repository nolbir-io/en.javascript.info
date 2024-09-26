# Guruhlarni suratga olish

Patternning bir qismi `pattern:(...)` qavslar ichiga olinishi mumkin. Bu "capturing group" deb ataladi.

Buning ikkita ta'siri bor:

1. U o'yinning bir qismini natijalar qatorida alohida element sifatida olish imkonini beradi.
2. Qavsdan keyin kvant qo'ysak, u butun qavsga tegishli bo'ladi.

## Namunalar

Keling, misollarda qavslar qanday ishlashini ko'rib chiqaylik.

### Namuna: gogogo

Qavslarsiz `pattern:go+` qolipi `subject:g` belgisini bildiradi, undan keyin `subject:o` bir yoki bir necha marta takrorlanadi. Masalan, `match: goooo` yoki `match: gooooooooo`.

Qavslar belgilarni birga guruhlaydi, shuning uchun `pattern:(go)+` `match:go`, `match:gogo`, `match:gogogo` va hokazolarni bildiradi.

```js run
alert( 'Gogogo now!'.match(/(go)+/ig) ); // "Gogogo"
```

### Namuna: domain

Keling, murakkabroq narsani yarataylik, masalan, veb-sayt domenini qidirish uchun oddiy ibora.

Masalan:

```
mail.com
users.mail.com
smith.users.mail.com
```

Ko'rib turganimizdek, domen takrorlanuvchi so'zlardan iborat bo'lib, oxirgisidan tashqari har biridan keyin nuqta qo'yiladi.

Oddiy iboralarda bu `pattern:(\w+\.)+\w+`:

```js run
let regexp = /(\w+\.)+\w+/g;

alert( "site.com my.site.com".match(regexp) ); // site.com,my.site.com
```

Qidiruv ishlaydi, lekin pattern chiziqli domenga mos kela olmaydi, masalan, `my-site.com`, chunki defis `pattern:\w` sinfiga tegishli emas.

Oxirgi so'zdan tashqari har bir so'zda `pattern:\w` so'zini `pattern:[\w-]` bilan almashtirish orqali tuzatishimiz mumkin: `pattern:([\w-]+\.)+\w+`.

### Namuna: email

Oldingi misolni kengaytirish mumkin. Biz unga asoslangan elektron pochta uchun muntazam ifoda yaratishimiz mumkin.

Elektron pochta formati: `name@domen`. Har qanday so'z ism bo'lishi mumkin, defis va nuqtalarga ruxsat beriladi. Oddiy iboralarda bu `pattern:[-.\w]+`.

Namuna:

```js run
let regexp = /[-.\w]+@([\w-]+\.)+[\w-]+/g;

alert("my@mail.com @ his@site.com.uk".match(regexp)); // my@mail.com, his@site.com.uk
```

Bu regexp mukammal emas, lekin yaxshi ishlaydi va tasodifiy xatolarni tuzatishga yordam beradi. Elektron pochta uchun yagona haqiqiy ishonchli tekshirish faqat xat yuborish orqali amalga oshirilishi mumkin.

## Matndagi qavslar

Qavslar chapdan o'ngga raqamlangan. Qidiruv tizimi ularning har biriga mos keladigan tarkibni yodlab oladi va natijada uni olish imkonini beradi.

`str.match(regexp)` usuli, agar `regexp`da `g` belgisi bo'lmasa, birinchi moslikni qidiradi va uni massiv sifatida qaytaradi:

1. `0` indeksida: to'liq moslik.
2. `1` indeksida: birinchi qavslar mazmuni.
3. `2` indeksida: ikkinchi qavslar mazmuni.
4. ...va boshqalar ...

Masalan, biz `pattern:<.*?>` HTML teglarini topib, ularni qayta ishlashni xohlaymiz. Alohida o'zgaruvchida teg tarkibiga (burchaklar ichida nima bor) ega bo'lish qulay bo'lar edi.

Keling, ichki tarkibni qavs ichiga o'rab olamiz, masalan: `pattern:<(.*?)>`.

Endi biz butun `match:<h1>` tegini va uning mazmuni `match:h1`ni hosil bo'lgan massivda olamiz:

```js run
let str = '<h1>Hello, world!</h1>';

let tag = str.match(/<(.*?)>/);

alert( tag[0] ); // <h1>
alert( tag[1] ); // h1
```

### Ichki guruhlar

Qavslar ichkariga kiritilishi mumkin. Bu holda raqamlash ham chapdan o'ngga o'tadi.

Masalan, `subject:<span class="my">` bo'limida tegni qidirishda bizni quyidagilar qiziqtiradi:

1. Butun teg mazmuni: `match:span class="my"`.
2. Teg nomi: `match:span`.
3. Teg atributlari: `match:class="my"`.

Keling, ular uchun qavslar kiritamiz: `pattern:<(([a-z]+)\s*([^>]*))>`.

Ular qanday raqamlangan (chapdan o'ngga, ochiladigan qavs orqali):

![](regexp-nested-groups-pattern.svg)

Amaliy namuna:

```js run
let str = '<span class="my">';

let regexp = /<(([a-z]+)\s*([^>]*))>/;

let result = str.match(regexp);
alert(result[0]); // <span class="my">
alert(result[1]); // span class="my"
alert(result[2]); // span
alert(result[3]); // class="my"
```

`Result` ning nol indeksi har doim to'liq moslikni saqlaydi.

Keyin esa ochiladigan qavs orqali chapdan o'ngga raqamlangan guruhlar. Birinchi guruh `natija[1]` sifatida qaytariladi. Bu yerda u butun teg tarkibini qamrab oladi.

Keyin `natija[2]`da ikkinchi ochiladigan qavsdagi guruh `pattern:([a-z]+)` - teg nomi, so'ng `result[3]`da teg: `pattern:([^>]* )`.

Satrdagi har bir guruhning mazmuni:

![](regexp-nested-groups-matches.svg)

### Ixtiyoriy guruhlar

Guruh ixtiyoriy bo'lsa va moslikda mavjud bo'lmasa ham (masalan, `pattern:(...)?` kvantifikatoriga ega), mos keladigan `result` qator elementi mavjud va `undefined` ga teng.

Masalan, `pattern:a(z)?(c)?` regexpni ko'rib chiqaylik. U ixtiyoriy ravishda `"a"` keyin `"z"` va ixtiyoriy ravishda `"c"`ni qidiradi.

Agar biz uni satrda bitta `subject:a` harfi bilan ishga tushirsak, natija quyidagicha bo'ladi:

```js run
let match = 'a'.match(/a(z)?(c)?/);

alert( match.length ); // 3
alert( match[0] ); // a (to'liq moslik)
alert( match[1] ); // undefined
alert( match[2] ); // undefined
```

Massiv uzunligi `3` ga teng, lekin barcha guruhlar bo'sh.

Va bu yerda `subject:ac` qatori uchun murakkabroq moslik mavjud:

```js run
let match = 'ac'.match(/a(z)?(c)?/)

alert( match.length ); // 3
alert( match[0] ); // ac (to'liq moslik)
alert( match[1] ); // undefined, chunki (z)? uchun hech narsa yo'q
alert( match[2] ); // c
```

Massiv uzunligi doimiy: `3`. Lekin `pattern:(z)?` guruhi uchun hech narsa yo'q, shuning uchun natija `["ac", undefined, "c"]` bo'ladi.

## Guruhlar bilan barcha mosliklarni qidirish: matchAll

```warn header="`matchAll` - bu yangi usul, polifill kerak bo'lishi mumkin`"
Eski brauzerlarda `matchAll` usuli qo'llab-quvvatlanmaydi.

Polyfill talab qilinishi mumkin, masalan, <https://github.com/ljharb/String.prototype.matchAll>.
```

Barcha mosliklarni qidirganimizda (flag `pattern:g`), `match` usuli guruhlar uchun tarkibni qaytarmaydi.

Masalan, qatordagi barcha teglarni topamiz:

```js run
let str = '<h1> <h2>';

let tags = str.match(/<(.*?)>/g);

alert( tags ); // <h1>,<h2>
```

Natijada bir qator o'yinlar paydo bo'ldi, ammo ularning har biri haqida batafsil ma'lumot yo'q. Ammo amalda biz odatda natijada guruhlarni qo'lga kiritish mazmuniga muhtojmiz.

Ularni olish uchun biz `str.matchAll(regexp)` usuli yordamida qidirishimiz kerak.

U JavaScript tiliga `match` dan ancha keyin "yangi va takomillashtirilgan versiya" sifatida qo'shildi.

Xuddi `match` kabi, u mosliklarni qidiradi, lekin 3 ta farq bor:

1. U massivni emas, balki takrorlanadigan obyektni qaytaradi.
2. `pattern:g` bayrog'i mavjud bo'lganda, u har bir moslikni guruhlar bilan massiv sifatida qaytaradi.
3. Agar mosliklar bo'lmasa, u `null` emas, balki bo'sh takrorlanadigan obyektni qaytaradi.

Masalan:

```js run
let results = '<h1> <h2>'.matchAll(/<(.*?)>/gi);

// natijalar - array emas, balki takrorlanadigan obyekt
alert(results); // [object RegExp String Iterator]

alert(results[0]); // undefined (*)

results = Array.from(results); // ularni arrayga aylantiramiz

alert(results[0]); // <h1>,h1 (1st tag)
alert(results[1]); // <h2>,h2 (2nd tag)
```

Ko'rib turganimizdek, `(*)` qatorida ko'rsatilgandek, birinchi farq juda muhim. Biz moslikni `results[0]` sifatida qabul qila olmaymiz, chunki bu obyekt psevdoarray emas. Biz uni `Array.from` yordamida haqiqiy `Array` ga aylantira olamiz. Pseudoarrays va iterablelar haqida batafsil ma'lumot <info:iterable> maqolasida berilgan.

Agar biz natijalarni ko'rib chiqayotgan bo'lsak, `Array.from` ga hojat yo'q:

```js run
let results = '<h1> <h2>'.matchAll(/<(.*?)>/gi);

for(let result of results) {
  alert(result);
  // birinchi alert: <h1>,h1
  // ikkinchisi: <h2>,h2
}
```

...Yoki destructuring dan foydalanish:

```js
let [tag1, tag2] = '<h1> <h2>'.matchAll(/<(.*?)>/gi);
```

`matchAll` tomonidan qaytarilgan har bir moslik `pattern:g` belgisisiz `match` tomonidan qaytarilgan formatga ega: bu `index` (satrdagi mos indeks) va `input` (manba qatori) qo'shimcha xususiyatlarga ega massiv:

```js run
let results = '<h1> <h2>'.matchAll(/<(.*?)>/gi);

let [tag1, tag2] = results;

alert( tag1[0] ); // <h1>
alert( tag1[1] ); // h1
alert( tag1.index ); // 0
alert( tag1.input ); // <h1> <h2>
```

```smart header="Nima uchun `matchAll` natijasi massiv emas, takrorlanadigan obyekt hisoblanadi?"`
Nima uchun usul shunday yaratilgan? Sababi oddiy - optimallashtirish uchun.

`matchAll` ga qo'ng'iroq qidiruvni amalga oshirmaydi. Buning o'rniga, dastlab natijalarsiz, takrorlanadigan obyektni qaytaradi. Qidiruv biz uni har safar takrorlaganimizda amalga oshiriladi, masalan, halqa ichida.

Shunday qilib, keragicha natijalar topiladi, keragidan ko'p emas.

Masalan, matnda potentsial 100 ta mos kelishi mumkin, biroq `for..of` tsiklida biz ulardan 5 tasini topdik, keyin yetarli deb hisobladik va `break`, ya'ni tanaffus qildik. Keyin dvigatel boshqa 95 ta gugurtni topishga vaqt sarflamaydi.
```

## Nomlangan guruhlar

Guruhlarni raqamlari bo'yicha eslab qolish qiyin. Oddiy naqshlar uchun buni qilish mumkin, ammo murakkabroqlari uchun qavslarni hisoblash noqulay. Bizda ancha yaxshi variant bor: qavslarga nom berish.

Bu ochiladigan qavsdan keyin darhol `pattern:?<name>` qo'yish orqali amalga oshiriladi.

Masalan, sanani "yil-oy-kun" formatida qidiramiz:

```js run
*!*
let dateRegexp = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;
*/!*
let str = "2019-04-30";

let groups = str.match(dateRegexp).groups;

alert(groups.year); // 2019
alert(groups.month); // 04
alert(groups.day); // 30
```

Ko'rib turganingizdek, guruhlar o'yinning `.groups` xususiyatida joylashgan.

Barcha sanalarni qidirish uchun `pattern:g` bayroqchasini qo'shishimiz mumkin.

Guruhlar bilan birgalikda to'liq mosliklarni olish uchun bizga `matchAll` ham kerak bo'ladi:

```js run
let dateRegexp = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/g;

let str = "2019-10-30 2020-01-01";

let results = str.matchAll(dateRegexp);

for(let result of results) {
  let {year, month, day} = result.groups;

  alert(`${day}.${month}.${year}`);
  // birinchi alert: 30.10.2019
  // ikkinchisi: 01.01.2020
}
```

## Guruhlarni almashtirishda yozib olish

`str` dagi barcha mosliklarni `regexp` bilan almashtiruvchi `str.replace(regexp, replacement)` usuli `replacement` qatoridagi qavs tarkibidan foydalanishga imkon beradi. Bu `pattern:$n` yordamida amalga oshiriladi, bu yerda `pattern:n` guruh raqamidir.

Masalan,

```js run
let str = "John Bull";
let regexp = /(\w+) (\w+)/;

alert( str.replace(regexp, '$2, $1') ); // Bull, John
```

Nomlangan qavslar uchun havola `pattern:$<name>` bo'ladi.

Masalan, sanalarni "yil-oy-kun" dan "kun.oy-yil" ga qayta formatlaymiz:

```js run
let regexp = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/g;

let str = "2019-10-30, 2020-01-01";

alert( str.replace(regexp, '$<day>.$<month>.$<year>') );
// 30.10.2019, 01.01.2020
```

## ? bilan qo'lga kiritilmaydigan guruhlar:

Ba'zan miqdor ko'rsatkichini to'g'ri qo'llash uchun qavslar kerak bo'ladi, lekin biz ularning mazmunini natijalarda bo'lishini xohlamaymiz.

Guruhni boshida `pattern:?:` qo'shish orqali chiqarib tashlash mumkin.

Misol uchun, agar biz `pattern:(go)+` topmoqchi bo'lsak, lekin qavslar tarkibini (`go`) alohida massiv elementi sifatida istamasak, biz quyidagilarni yozishimiz mumkin: `pattern:(?:go)+` .

Quyidagi misolda biz faqat `match:John` nomini o'yinning alohida a'zosi sifatida olamiz:

```js run
let str = "Gogogo John!";

*!*
// ?: capturingdan 'go' ni istisno qiladi
let regexp = /(?:go)+ (\w+)/i;
*/!*

let result = str.match(regexp);

alert( result[0] ); // Gogogo John (to'liq moslik)
alert( result[1] ); // John
alert( result.length ); // 2 (arrayda boshqa narsa yo'q)
```

## Xulosa

Qavslar muntazam ifodaning bir qismini birlashtiradi, shuning uchun miqdoriy ko'rsatkich unga bir butun sifatida tegishli bo'ladi.

Qavslar guruhlari chapdan o'ngga raqamlangan va ixtiyoriy ravishda `(?<name>...)` bilan nomlanishi mumkin.

Guruh tomonidan mos keladigan tarkibni natijalarda olish mumkin:

- `str.match` usuli faqat `pattern:g` bayrog'isiz suratga olish guruhlarini qaytaradi.
- `str.matchAll` usuli har doim qo'lga olish guruhlarini qaytaradi.

Qavslar nomi bo'lmasa, ularning mazmuni mos keladigan qatorda raqami bo'yicha mavjud bo'ladi. Nomlangan qavslar `groups` xususiyatida ham mavjud.

Qavslar tarkibini `str.replace` dagi almashtirish qatorida ham ishlatishimiz mumkin: `$n` raqami yoki `$<name>` nomi bilan.

Guruh boshiga `pattern:?:` qo'shish orqali raqamlashdan chiqarib tashlanishi mumkin. Bu butun guruhga kvant qo'llashimiz kerak bo'lganda ishlatiladi, lekin uni natijalar qatorida alohida element sifatida istamaymiz. Biz almashtirish qatorida bunday qavslarga ham murojaat qila olmaymiz.
