# To'plamlar va intervallarlar [...]

Kvadrat qavslar ichidagi bir nechta belgilar yoki belgilar sinflari `[…]` "berilganlar orasidan istalgan belgini qidirish" degan ma'noni anglatadi.

## To'plamlar

Masalan, `pattern:[eao]` 3 ta belgidan birini bildiradi: `'a'`, `'e'` yoki `'o'`.

Bu *to'plam* deb ataladi. To'plamlar regexpda oddiy belgilar bilan birga ishlatilishi mumkin:

```js run
// [t yoki m] ni va keyin "op" ni toping
alert( "Mop top".match(/[tm]op/gi) ); // "Mop", "top"
```

E'tibor bering, to'plamda bir nechta belgilar mavjud bo'lsada, ular o'yinda aynan bitta belgiga mos keladi.

Shunday qilib, quyidagi misol hech qanday moslik keltirmaydi:

```js run
// "V", keyin [o yoki i], keyin "la" ni toping
alert( "Voila".match(/V[oi]la/) ); // null, moslik yo'q
```

Shakl quyidagilarni qidiradi:

- `pattern:V`,
- keyin `pattern:[oi]` harflaridan *biri*,
- keyin `pattern:la`.

Demak, bu yerda `match:Vola` yoki `match:Vila` uchun o'yin bo'ladi.

## Intervallar

Kvadrat qavs ichida *belgilar oralig'i* ham bo'lishi mumkin.

Masalan, `pattern:[a-z]` bu `a` dan `z` oralig'idagi belgi va `pattern:[0-5]` - `0` dan `5` gacha bo'lgan raqam.

Quyidagi misolda biz `x` dan keyin `A` dan `F` gacha bo'lgan ikkita raqam yoki harfni qidiramiz:

```js run
alert( "Exception 0xAF".match(/x[0-9A-F][0-9A-F]/g) ); // xAF
```

Bu yerda `pattern:[0-9A-F]` ikkita diapazonga ega: u `0` dan `9` gacha bo'lgan raqam yoki `A` dan `F` gacha bo'lgan harfli belgini qidiradi.

Agar biz kichik harflarni ham qidirmoqchi bo'lsak, `a-f` oralig'ini qo'shishimiz mumkin: `pattern:[0-9A-Fa-f]`. Yoki `pattern:i` bayrog'ini qo'shing.

Shuningdek, biz `[…]` ichidagi belgilar sinflaridan foydalanishimiz mumkin.

Misol uchun, agar biz `pattern:\w` yoki tire `pattern:-` so'z belgisini qidirmoqchi bo'lsak, to'plam `pattern:[\w-]` bo'ladi.

Bir nechta sinflarni birlashtirish ham mumkin, masalan, `pattern:[\s\d]` "bo'sh joy belgisi yoki raqam" degan ma'noni anglatadi.

```smart header="Belgilar sinflari ma'lum belgilar to'plami uchun stenografiyadir"
Masalan:

- **\d** -- `pattern:[0-9]` bilan bir xil,
- **\w** -- `pattern:[a-zA-Z0-9_]` bilan bir xil,
- **\s** -- `pattern:[\t\n\v\f\r ]` bilan bir xil va yana bir nechta noyob Unicode bo'sh joy belgilari.
```

### Misol: bir necha tilli \w

`pattern:\w` belgilar sinfi `pattern:[a-zA-Z0-9_]` ning qisqartmasi bo'lgani uchun u xitoycha ierogliflar, kirill harflari va hokazolarni topa olmaydi.

Biz har qanday tilda so'z belgilarini qidiradigan universalroq pattern yozishimiz mumkin. Unicode xususiyatlari bilan buni bajarish oson: `pattern:[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]`.

Keling, buni hal qilaylik. `pattern:\w`ga o'xshab, biz quyidagi Unicode xususiyatlariga ega belgilarni o'z ichiga olgan o'zimizning to'plamimizni yaratmoqdamiz:

- `Alphabetic` (`Alpha`) - harflar uchun,
- `Mark` (`M`) - aksentlar uchun
- `Decimal_Number` (`Nd`) - raqamlar uchun,
- `Connector_Punctuation` (`Pc`) - pastki chiziq `'_'` va shunga o'xshash belgilar uchun,
- `Join_Control` (`Join_C`) - ikkita maxsus kod `200c` va `200d`, ligature'larda ishlatiladi, masalan, arab tilida.

Foydalanish misoli:

```js run
let regexp = /[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]/gu;

let str = `Hi 你好 12`;

// barcha harf va raqamlarni topadi:
alert( str.match(regexp) ); // H,i,你,好,1,2
```

Albatta, biz ushbu pattern'ni tahrirlashimiz mumkin: Unicode xususiyatlarini qo'shing yoki ularni olib tashlang. Unicode xususiyatlari <info:regexp-unicode> maqolasida batafsil yoritilgan.

```warn header="Unicode xususiyatlari IE da qo'llab-quvvatlanmaydi"
Unicode `pattern:p{…}` xususiyatlari IEda qo'llanilmaydi. Agar ularga haqiqatan ham kerak bo'lsa, [XRegExp] kutubxonasidan foydalanishimiz mumkin (https://xregexp.com/).

Yoki bizni qiziqtiradigan tildagi belgilar diapazonidan foydalaning, masalan, `pattern:[a-ya]` kirill harflari uchun.
```

## Diapazonlar bundan mustasno

Oddiy diapazonlardan tashqari, `pattern:[^…]`ga o'xshash "istisno" diapazonlari mavjud.

Ular boshida `^` karet belgisi bilan belgilanadi va *berilganlardan tashqari* istalgan belgiga mos keladi.

Masalan:

- `pattern:[^aeyo]` -- `'a'`, `'e'`, `'y'` yoki `'o'`dan tashqari har qanday belgi.
- `pattern:[^0-9]` -- raqamdan tashqari har qanday belgi, `pattern:\D` bilan bir xil.
- `pattern:[^\s]` -- `\S` bilan bir xil bo'sh joy bo'lmagan har qanday belgi.

Quyidagi misol harflar, raqamlar va bo'shliqlardan tashqari har qanday belgilarni qidiradi:

```js run
alert( "alice15@gmail.com".match(/[^\d\sA-Z]/gi) ); // @ and .
```

## Tashlab ketish […]

Odatda, biz aniq maxsus belgini topmoqchi bo'lganimizda, `pattern:\.` kabi undan qochishimiz kerak. Va agar bizga teskari chiziq kerak bo'lsa, biz `pattern:\\` va hokazolardan foydalanamiz.

Kvadrat qavs ichida biz maxsus belgilarning katta qismidan tashlab ketmasdan foydalanishimiz mumkin:

- `pattern:. + ( )` belgilari hech qachon qochishi kerak emas.
- `Pattern:-` boshida yoki oxirida chiziqcha qo'yilmaydi (bu yerda u diapazonni belgilamaydi).
- `Pattern:^` karetasi faqat boshida qochib qo'yiladi (bu yerda istisno degan ma'noni anglatadi).
- Yopuvchi kvadrat qavs `pattern:]` har doim chiqarib tashlanadi (agar biz ushbu belgini izlashimiz kerak bo'lsa).

Boshqacha qilib aytadigan bo'lsak, barcha maxsus belgilar qochmasidan ruxsat etiladi, faqat kvadrat qavslar uchun biror narsani anglatuvchi holatlar bundan mustasno hisoblanadi.

Kvadrat qavs ichidagi nuqta `.` shunchaki nuqtani bildiradi. `Pattern:[.,]` pattern nuqta yoki verguldan birini qidiradi.

Quyidagi misolda regexp `pattern:[-().^+]` `-().^+` belgilaridan bittasini izlaydi:

```js run
// qochish kerak emas
let regexp = /[-().^+]/g;

alert( "1 + 2 - 3".match(regexp) ); // Mos keladi +, -
```

...Ammo agar siz ulardan "har ehtimolga qarshi" qochishga qaror qilsangiz, unda hech qanday zarar bo'lmaydi:

```js run
// Hamma narsadan qochdi
let regexp = /[\-\(\)\.\^\+]/g;

alert( "1 + 2 - 3".match(regexp) ); // bu ham ishlaydi: +, -
```

## Diapazonlar va "u" bayrog'i

Agar to'plamda surrogat juftliklar mavjud bo'lsa, ularning to'g'ri ishlashi uchun `pattern:u` belgisi talab qilinadi.

Masalan, `mavzu:𝒳` qatorida `pattern:[𝒳𝒴]` ni qidiramiz:

```js run
alert( '𝒳'.match(/[𝒳𝒴]/) ); // g'alati xarakterni ko'rsatadi, masalan [?]
// (qidiruv noto'g'ri amalga oshirildi, yarim belgi qaytarildi)
```

Natija noto'g'ri, chunki sukut bo'yicha surrogat juftliklar haqida "bilmayman" muntazam iboralar mavjud.

Muntazam ifoda mexanizmi `[𝒳𝒴]` ikki emas, balki to'rtta belgidan iborat deb hisoblaydi:
1. `𝒳` `(1)` ning chap yarmi,
2. `𝒳` `(2)` ning o'ng yarmi,
3. `𝒴` `(3)` ning chap yarmi,
4. `𝒴` `(4)` ning o'ng yarmi.

Biz ularning kodlarini quyidagicha ko'rishimiz mumkin:

```js run
for(let i=0; i<'𝒳𝒴'.length; i++) {
  alert('𝒳𝒴'.charCodeAt(i)); // 55349, 56499, 55349, 56500
};
```

Shunday qilib, yuqoridagi misol `𝒳` ning chap yarmini topadi va ko'rsatadi.

Agar biz `pattern:u` bayrog'ini qo'shsak, unda xatti-harakatlar to'g'ri bo'ladi:

```js run
alert( '𝒳'.match(/[𝒳𝒴]/u) ); // 𝒳
```

`[𝒳-𝒴]` kabi diapazonni qidirishda shunga o'xshash holat yuzaga keladi.

Agar `pattern:u` bayrog'ini qo'shishni unutib qo'ysak, xatolik yuz beradi:
```js run
'𝒳'.match(/[𝒳-𝒴]/); // Error: Oddiy noto'g'ri ifoda
```

Sababi, bayroqsiz `pattern:u` surrogat juftlari ikki belgi sifatida qabul qilinadi, shuning uchun `[𝒳-𝒴]` `[<55349><56499>-<55349><56500>]` deb talqin qilinadi (har bir surrogat juftligi uning kodlari bilan almashtiriladi). Endi `56499-55349` oralig'i noto'g'ri ekanligini ko'rish oson: uning boshlang'ich kodi `56499` oxiri `55349`dan katta. Bu xatoning rasmiy sababi.

`pattern:u` bayrog'i bilan pattern to'g'ri ishlaydi:

```js run
// 𝒳 dan 𝒵 gacha bo'lgan belgilarni qidiring
alert( '𝒴'.match(/[𝒳-𝒵]/u) ); // 𝒴
```
