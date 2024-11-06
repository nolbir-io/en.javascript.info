# '??' Nullish birlashtiruvchi operator '??'

[recent browser="new"]

Nullish birlashtiruvchi operatori ikkita `??` so'roq belgisi bilan yoziladi.

Uning `null` va `undefined` ga nisbatan bir xil munosabatda bo'lgani sababli biz bu maqolada maxsus atamadan foydalanamiz. Ifoda na `null` va na `undefined` bo'lganida, uni "defined" (aniqlangan) deb ataymiz.

`a ?? b` ning natijasi:
- agar `a` aniqlangan bo'lsa, u holda `a`,
- agar `a` aniqlanmagan bo'lsa, u holda `b`.

Boshqacha qilib aytganda, `??` agar `null/undefined` bo'lmasa birinchi argumentni, aks holda ikkinchisini qaytaradi.

Nullish birlashtiruvchi operatori butunlay yangi narsa emas. Bu ikki qiymatning birinchi "aniqlangan" qiymatini topishning juda yaxshi usuli.

Biz `result = a ?? b` ni o'zimiz bilgan operatorlardan foydalanib boshidan quyidagi kabi yozishimiz mumkin:

```js
result = (a !== null && a !== undefined) ? a : b;
```

Endi `??` nima vazifa bajarishi butunlay tushunarli bo'ladi. Keling, u qayerda yordam berishini ko'rib chiqaylik.

`??` ning eng keng tarqalgan ishlatilish holati bu aniqlanmagan o'zgaruvchini doimiy qiymat bilan ta'minlashdir.

Misol uchun, quyida agar aniqlangan bo'lsa `user`ni, aks holda `Anonymous`ni ko'rsatamiz:

```js run
let user;

alert(user ?? "Anonymous"); // Anonymous (user aniqlangan)
```

Quyida `user`ning namega tayinlanganidagi misoli:

```js run
let user = "John";

alert(user ?? "Anonymous"); // John (user null emas/aniqlanmagan)
```

Biz `??` ketma-ketligidan ro'yxatdagi birinchi `null/undefined` bo'lmagan qiymatni olish uchun ham foydalanishimiz mumkin.

Keling, bizda `firstName`, `lastName` yoki `nickName` o'zgaruvchilarida foydalanuvchi ma'lumotlari bor deylik. Agar foydalanuchi qiymat kiritishni xohlamasa, ularning barchasi aniqlangan bo'lmasligi ham mumkin.

Biz ushbu o'zgaruvchilardan biri yordamida foydalanuvchi ismini, agar ularning barchasi `null/undefined` bo'lsa, "Anonymous"ni ko'rsatmoqchimiz.

Keling, buning uchun `??` operatoridan foydalanamiz:

```js run
let firstName = null;
let lastName = null;
let nickName = "Supercoder";

// birinchi belgilangan qiymatni ko'rsatadi:
*!*
alert(firstName ?? lastName ?? nickName ?? "Anonymous"); // Supercoder
*/!*
```

## || bilan taqqoslash

[O'tgan bobda](info:logical-operators#or-finds-the-first-truthy-value) aytilgani kabi `||` OR operatori  `??` bilan bir xil ishlatilishi mumkin. 

Misol uchun, yuqoridagi kodda `??` bilan `||` o'rnini almashtishimiz va shunga qaramay bir xil natijani olishimiz mumkin:

```js run
let firstName = null;
let lastName = null;
let nickName = "Supercoder";

// birinchi haqiqat qiymatini ko'rsatadi:
*!*
alert(firstName || lastName || nickName || "Anonymous"); // Supercoder
*/!*
```

Tarixiy jihatdan, birinchi bo'lib faqat OR `||` operatori mavjud bo'lgan. U JavaScript boshidan beri mavjud, shuning uchun dasturchilar undan uzoq vaqt davomida shunday maqsadlarda foydalanishgan.

Boshqa tomondan, nullish birlashtiruvchi operatori `??` JavaScriptga yaqinda qo'shilgan va buning sababi odamlar `||` dan unchalik mamnun emasdi.

Ularning o'rtasidagi muhim farqlar:
- `||` birinchi *rost* qiymatni qaytaradi.
- `??` birinchi *aniqlangan* qiymatni qaytaradi.

Boshqacha qilib aytganda, `||` `false`, `0`, bo'sh string `""` va `null/aniqlanmagan` qatorlarini ajratmaydi. Ularning barchasi bir xil -- yolg'on qiymatlar. Agar ulardan birortasi `||` ning birinchi argumenti bo'lsa, natija sifatida biz ikkinchi argumentni olamiz.

Amalda biz standart qiymatdan faqat o'zgaruvchi `null/undefined`, ya'ni qiymat haqiqatan ham noma'lum/o'rnatilmagan bo'lsa, undan foydalanish mumkin. 

Misol uchun, quyidagi misolni ko'rib chiqaylik:

```js run
let height = 0;

alert(height || 100); // 100
alert(height ?? 100); // 0
```

- `height || 100` ifoda `height` yolg'on qiymat ekanligini tekshiradi, va u `0`, rostan ham yolg'on,
    - shunday qilib `||` ning natijasi ikkinchi argument, `100`.
- `height ?? 100` ifoda `height` `null/undefined` ekanligini tekshiradi, va bunday emas,
    - shunday qilib `height` ning natijasi "uning o'zi", ya'ni `0`.

Amalda, nol balandligi ko'pincha haqiqiy qiymat bo'lib, uni standart bilan almashtirmaslik kerak. Demak, `??` to'g'ri ish qiladi.

## Ustunlik

`??` operatorining ustunligi `||` niki bilan bir xil. Ular ikkalasi ham [MDN jadval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table)ida `3` ga teng.

Bu shuni anglatadiki, nullish birlashtiruvchi operatori ham xuddi `||` kabi `=` va `?` dan avval, lekin `+`, `*` va boshqa ko'plab operatorlardan keyin hisoblanadi.

Agar biz ifodada `??` bilan qiymatni boshqa operatorlar bilan ishlatishni istasak, qavslar qo'shishni ko'ramiz:
Shunday qilib, biz quyidagi iboralarga qavs qo'shishimiz kerak bo'lishi mumkin:

```js run
let height = null;
let width = null;

// important: qavslardan foydalaning
let area = (height ?? 100) * (width ?? 50);

alert(area); // 5000
```

Agar qavslarni tushirib qoldirsak, `??` dan yuqoriroq ustunlikka ega bo'lgani sababli `*` birinchi bajariladi va noto'g'ri natijalar keltirib chiqaradi.

```js
// qavslar ishlatilmaganda
let area = height ?? 100 * width ?? 50;

// ... shunday ishlaydi (biz xohlagandek emas):
let area = height ?? (100 * width) ?? 50;
```

### ?? ni  && yoki || bilan qo'llash

Xavfsizlik nuqtayi nazaridan, ustunlik qavslar ichida aniq ko'rsatilmaguncha JavaScript `??` dan `&&` va `||` operatorlari bilan birgalikda foydalanishni ta'qiqlaydi.

Quyidagi kod sintaksis xatolik keltirib chiqaradi:

```js run
let x = 1 && 2 ?? 3; // Syntax error
```

Bu cheklov shubhasiz munozarali, u odamlar `||` dan `??` ga o'tishni boshlaganlarida dasturlashdagi xatolarning oldini olish maqsadida til spetsifikatsiyasiga qo'shilgan edi.

Uning atrofida ishlash uchun tashqi qavslardan foydalaning:

```js run
*!*
let x = (1 && 2) ?? 3; // Ishlaydi
*/!*

alert(x); // 2
```

## Xulosa

- `??` nullish birlashtiruvchi operatori ro'yxatdan birinchi "aniqlangan" qiymatni qisqa yo'l bilan tanlashning imkonini beradi.

    Undan o'zgaruchilarga doimiy qiymatni tayinlash uchun foydalanish mumkin:

    ```js
    // balandligi null yoki aniqlanmagan bo'lsa, balandligi = 100 o'rnating
    height = height ?? 100;
    ```

- `??` operatori juda past, `?` va `=` dan biroz balandroq ustunlikka ega, shuning uchun undan ifodada foydalanayotganda qavslarni qo'shishni hisobga oling.
- Undan `||` yoki `&&` bilan qavslarsiz foydalanish ta'qiqlanadi.
