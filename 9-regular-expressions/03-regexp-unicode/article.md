# Unicode: "u" bayrog'i va  \p{...} klassi

JavaScript satrlar uchun [Unicode encoding](https://en.wikipedia.org/wiki/Unicode) dan foydalanadi. Aksariyat belgilar 2 bayt bilan kodlangan, ammo bu ko'pi bilan 65536 ta belgini ifodalashga imkon beradi.

Bu qator barcha mumkin bo'lgan belgilarni kodlash uchun yetarlicha katta emas, shuning uchun ba'zi noyob belgilar 4 bayt bilan kodlangan, masalan, `𝒳` (matematik X) yoki `😄` (smaylik), ba'zi ierogliflar va boshqalar.

Mana ba'zi belgilarning Unicode qiymatlari:

| Belgi  | Unicode | Unicodeda hisoblangan baytlar |
|------------|---------|--------|
| a | `0x0061` |  2 |
| ≈ | `0x2248` |  2 |
|𝒳| `0x1d4b3` | 4 |
|𝒴| `0x1d4b4` | 4 |
|😄| `0x1f604` | 4 |

 Shunday qilib, `a` va `≈` kabi belgilar 2 baytni egallaydi, `𝒳`, `𝒴` va `😄` uchun kodlar esa uzunroq, ular 4 baytga ega.

Uzoq vaqt oldin, JavaScript tili yaratilganda, Unicode kodlash osonroq edi: 4 baytli belgilar yo'q edi. Shunday qilib, ba'zi til xususiyatlari hali ham ularni noto'g'ri ishlatadi.

Masalan, `length` bu yerda ikkita belgi bor deb o'ylaydi:

```js run
alert('😄'.length); // 2
alert('𝒳'.length); // 2
```

...Ammo biz faqat bittasi borligini ko'ramiz, to'g'rimi? Gap shundaki, `length` 4 baytni ikkita 2 baytli belgi sifatida ko'rib chiqadi. Bu noto'g'ri, chunki ular faqat birgalikda ko'rib chiqilishi kerak ("surrogat juftlik" deb ataladi, ular haqida <info:string> maqolasida o'qishingiz mumkin).

Odatda oddiy iboralar ham 4 baytli "uzun belgilar"ni 2 baytli juftlik sifatida ko'radi. Va bu satrlarda bo'lgani kabi, bu g'alati natijalarga olib kelishi mumkin. Buni birozdan keyin <info:regexp-character-sets-and-ranges> maqolasida ko'ramiz.

Satrlardan farqli o'laroq, oddiy iboralar bunday muammolarni hal qiladigan `pattern:u` belgisiga ega. Bunday bayroq bilan regexp 4 baytli belgilarni to'g'ri boshqaradi. Shuningdek, Unicode mulk qidiruvi mavjud bo'ladi, biz unga keyingi bosqichda o'tamiz.

## Unicode xususiyatlari \p{...}

Unicode-dagi har bir belgi juda ko'p xususiyatlarga ega. Ular qahramonning qaysi "toifaga" tegishli ekanligini tasvirlaydi, u haqida turli xil ma'lumotlarni o'z ichiga oladi.

Masalan, agar belgi `Letter` xususiyatiga ega boʻlsa, bu belgi alifboga (har qanday tilga) tegishli ekanligini bildiradi. `Number` xususiyati esa bu raqam ekanligini bildiradi: ehtimol arab yoki xitoy va hokazo.

Biz `pattern:\p{…}` sifatida yozilgan xususiyatga ega belgilarni qidirishimiz mumkin. `Pattern:\p{…}` dan foydalanish uchun oddiy iborada `pattern:u` belgisi bo'lishi kerak.

Masalan, `\p{Letter}` har qanday tildagi harfni bildiradi. Biz `\p{L}` dan ham foydalanishimiz mumkin, chunki `L` `Letter`ning ikkinchi nomidir. Deyarli har bir xususiyat uchun qisqaroq nomlar mavjud. 

Quyidagi misolda uch xil harflar topiladi: ingliz, gruzin va koreys.

```js run
let str = "A ბ ㄱ";

alert( str.match(/\p{L}/gu) ); // A,ბ,ㄱ
alert( str.match(/\p{L}/g) ); // null (mos kelmaydi, \p "u" bayrog'isiz ishlamaydi)
```

Bu yerda asosiy belgilar toifalari va ularning pastki toifalari:

- Letter `L`:
  - lowercase `Ll`
  - modifier `Lm`,
  - titlecase `Lt`,
  - uppercase `Lu`,
  - other `Lo`.
- Number `N`:
  - decimal digit `Nd`,
  - letter number `Nl`,
  - other `No`.
- Punctuation `P`:
  - connector `Pc`,
  - dash `Pd`,
  - initial quote `Pi`,
  - final quote `Pf`,
  - open `Ps`,
  - close `Pe`,
  - other `Po`.
- Mark `M` (accents etc):
  - spacing combining `Mc`,
  - enclosing `Me`,
  - non-spacing `Mn`.
- Symbol `S`:
  - currency `Sc`,
  - modifier `Sk`,
  - math `Sm`,
  - other `So`.
- Separator `Z`:
  - line `Zl`,
  - paragraph `Zp`,
  - space `Zs`.
- Other `C`:
  - control `Cc`,
  - format `Cf`,
  - not assigned `Cn`,
  - private use `Co`,
  - surrogate `Cs`.


Shunday qilib, masalan, agar bizga kichik harflar kerak bo'lsa, biz `pattern:\p{Ll}`, tinish belgilari: `pattern:\p{P}` va hokazolarni yozishimiz mumkin.

Boshqa olingan toifalar ham mavjud, masalan:
- `Alphabetic` (`Alpha`), `L` harflari va `Nl` harf raqamlarini (masalan, Ⅻ - rim raqami 12 uchun belgi), shuningdek, `Other_Alphabetic` (`OAlpha`) boshqa belgilarni o'z ichiga oladi.
- `Hex_Digit` o'n oltilik raqamlarni o'z ichiga oladi: `0-9`, `a-f`.
- ...va boshqalar.

Unicode juda ko'p turli xil xususiyatlarni qo'llab-quvvatlaydi, ularning to'liq ro'yxati juda ko'p joy talab qiladi, shuning uchun bu yerda havolalar qoldirilgan:

- Belgilar bo'yicha barcha xususiyatlarni sanab o'ting: <https://unicode.org/cldr/utility/character.jsp>.
- Xususiyat bo'yicha barcha belgilarni sanab o'ting: <https://unicode.org/cldr/utility/list-unicodeset.jsp>.
- Xususiyatlar uchun qisqa taxalluslar: <https://www.unicode.org/Public/UCD/latest/ucd/PropertyValueAliases.txt>.
- Matn formatidagi Unicode belgilarining barcha xususiyatlari bilan to'liq bazasi bu yerda: <https://www.unicode.org/Public/UCD/latest/ucd/>.

### Masalan: hexadecimal, ya'ni o'n oltilik raqamlar

Masalan, `xFF` shaklida yozilgan o'n oltilik sonlarni qidiramiz, bu yerda `F` oltilik raqam (0..9 yoki A..F).

O'n oltilik raqam `pattern:\p{Hex_Digit}` sifatida belgilanishi mumkin:

```js run
let regexp = /x\p{Hex_Digit}\p{Hex_Digit}/u;

alert("number: xAF".match(regexp)); // xAF
```

### Masalan: Xitoy iyerogliflari

Keling, Xitoy ierogliflarini qidiramiz.

Unicode xususiyati `Script` (yozuv tizimi) mavjud bo'lib, u qiymatga ega bo'lishi mumkin: `Cyrillic`, `Greek`, `Arabic`, `Han` (Chinese) va hokazo, [bu yerda to'liq ro'yxat keltirilgan](https: //en.wikipedia.org/wiki/Script_(Unicode)).

Berilgan yozuv tizimidagi belgilarni izlash uchun biz `pattern:Script=<value>` dan foydalanishimiz kerak, masalan, kirill harflari uchun: `pattern:\p{sc=Kirill}`, xitoy ierogliflari uchun: `pattern:\p{sc=Han}` va hokazo:

```js run
let regexp = /\p{sc=Han}/gu; // Xitoy iyerogliflarini qaytaradi

let str = `Hello Привет 你好 123_456`;

alert( str.match(regexp) ); // 你,好
```

### Masalan: valyuta

`$`, `€`, `¥` kabi valyutani bildiruvchi belgilar Unicode xususiyati `pattern:\p{Currency_Symbol}`, qisqa taxallus: `pattern:\p{Sc}`ga ega.

Keling, undan "valyuta, keyin raqam" formatidagi narxlarni qidirish uchun foydalanamiz:

```js run
let regexp = /\p{Sc}\d/gu;

let str = `Prices: $2, €1, ¥9`;

alert( str.match(regexp) ); // $2,€1,¥9
```

Keyinchalik, <info:regexp-quantifiers> maqolasida biz ko'p sonli raqamlarni qanday qidirishni ko'rib chiqamiz.

## Xulosa

`pattern:u` bayrog'i muntazam ifodalarda Unicodeni qo'llab-quvvatlash imkonini beradi.

Bu ikki narsani anglatadi:

1. 4 baytlik belgilar to'g'ri ishlatiladi: ikkita 2 baytli belgi emas, bitta belgi sifatida.
2. Qidiruvda Unicode xususiyatlaridan foydalanish mumkin: `\p{…}`.

Unicode xususiyatlari bilan biz berilgan tillardagi so'zlarni, maxsus belgilarni (sitatalar, valyutalar) va hokazolarni qidirishimiz mumkin.
