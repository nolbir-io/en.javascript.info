# Alternation (OR) |

Alternation - bu oddiy iboradagi atama bo'lib, aslida oddiy "OR".

Muntazam ifodada u vertikal chiziq belgisi `pattern:|` bilan belgilanadi.

Masalan, biz dasturlash tillarini topishimiz kerak: HTML, PHP, Java yoki JavaScript.

Eng mos regexp: `pattern:html|php|java(script)?`.

Foydalanish misoli:

```js run
let regexp = /html|php|css|java(script)?/gi;

let str = "Avval HTML, keyin CSS, keyin JavaScript paydo bo'ldi";

alert( str.match(regexp) ); // 'HTML', 'CSS', 'JavaScript'
```

Biz allaqachon shunga o'xshash narsa -- kvadrat qavslarni ko'rdik. Ular bir nechta belgilarni tanlash imkonini beradi, masalan, `pattern:gr[ae]y` mos `match:gray` yoki `match:grey`.

Kvadrat qavslar faqat belgilar yoki belgilar sinflariga ruxsat beradi. Alternativ har qanday ifodaga imkon beradi. Regexp `pattern:A|B|C` `A`, `B` yoki `C` iboralardan birini bildiradi.

Masalan:

- `pattern:gr(a|e)y` `pattern:gr[ae]y` bilan aynan bir xil ma'noni anglatadi.
- `pattern:gra|ey` `match:gra` yoki `match:ey` degan ma'noni anglatadi.

Patternning tanlangan qismiga almashtirishni qo'llash uchun uni qavs ichiga olishimiz mumkin:
- `pattern:I love HTML|CSS` `match:I love HTML` yoki `match:CSS` ga mos keladi.
- `pattern:I love (HTML|CSS)` `match:I love HTML` yoki `motch:I love CSS`ga mos keladi.

## Masalan: vaqt uchun regexp

Oldingi maqolalarda `hh:mm`, masalan, `12:00` shaklida vaqtni qidirish uchun regexp yaratish vazifasi bor edi. Ammo oddiy `pattern:\d\d:\d\d` juda noaniq. U `25:99`ni vaqt sifatida qabul qiladi (chunki 99 daqiqa patternga mos keladi, lekin bu vaqt noto'g'ri).

Qanday qilib yaxshiroq pattern yaratishimiz mumkin?

Biz ehtiyotkorroq moslashuvdan foydalanishimiz mumkin. Birinchidan, ish soatlari:

- Agar birinchi raqam `0` yoki `1` bo'lsa, keyingisi istalgan raqam bo'lishi mumkin: `pattern:[01]\d`.
- Aks holda, agar birinchi raqam `2` bo'lsa, keyingisi `pattern:[0-3]` bo`lishi kerak.
- (boshqa birinchi raqamga ruxsat berilmaydi)

Har ikkala variantni regexpda quyidagi o'zgartirish yordamida yozishimiz mumkin: `pattern:[01]\d|2[0-3]`.

Keyin daqiqalar `00` dan `59` gacha bo'lishi kerak. `Pattern:[0-5]\d` shaklida yozilishi mumkin bo'lgan oddiy ifoda tilida: birinchi raqam `0-5`, keyin esa istalgan raqam.

Agar soat va daqiqalarni bir-biriga yopishtirsak, biz quyidagi pattern'ni olamiz:`pattern:[01]\d|2[0-3]:[0-5]\d`.

Biz deyarli tugatdik, lekin muammo bor. `pattern:|` muqobilligi endi `pattern:[01]\d` va `pattern:2[0-3]:[0-5]\d` orasida bo'ladi.

Ya'ni: ikkinchi muqobil variantga daqiqalar qo'shiladi, bu yerda aniq rasm ko'rsatilgan:

```
[01]\d  |  2[0-3]:[0-5]\d
```

Bu pattern `pattern:[01]\d` yoki `pattern:2[0-3]:[0-5]\d` ni qidiradi.

Lekin bu noto'g'ri, muqobil `pattern:[01]\d` OR `pattern:2[0-3]` ga ruxsat berish uchun faqat oddiy iboraning "soat" qismida ishlatilishi kerak. Qavslar ichiga "soat"ni qo‘shish orqali buni to'g'rilaymiz: `pattern:([01]\d|2[0-3]):[0-5]\d`.

Yakuniy yechim:

```js run
let regexp = /([01]\d|2[0-3]):[0-5]\d/g;

alert("00:00 10:10 23:59 25:99 1:2".match(regexp)); // 00:00,10:10,23:59
```
