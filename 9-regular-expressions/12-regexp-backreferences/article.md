# Patterndagi qayta havolalar: \N and \k<name>

Biz `pattern:(...)` guruhlarini olish mazmunidan nafaqat natijada yoki almashtirish qatorida, balki naqshning o'zida ham foydalanishimiz mumkin.

## Raqam bo'yicha qayta havola: \N

Guruhga shablonda `pattern:\N` yordamida murojaat qilish mumkin, bu yerda `N` guruh raqamidir.

Bu nima uchun foydali ekanligini tushunish uchun keling, vazifani ko'rib chiqaylik.

Biz qo'sh tirnoqli satrlarni topishimiz kerak: yoki bitta qo'sh tirnoqli `subject:'...'` yoki ikki qo'shtirnoqli `subject:"..."` -- ikkala variant ham mos kelishi kerak.

Ularni qanday topish mumkin?

Ikkala turdagi tirnoqlarni kvadrat qavs ichiga qo'yishimiz mumkin: `pattern:['"](.*?)['"]`, lekin u aralash qo'shtirnoqli satrlarni topadi, masalan, `match:"...'` va `match:'..."`. Bu `subject:"She's the one!"` qatoridagi kabi bir qo'shtirnoq boshqasining ichida paydo bo'lsa, noto'g'ri mos kelishiga olib keladi:

```js run
let str = `He said: "She's the one!".`;

let regexp = /['"](.*?)['"]/g;

// Natija biz xohlagandek emas
alert( str.match(regexp) ); // "She'
```

Ko'rib turganimizdek, qo'shtirnoq ochuvchi qo'shtirnoq `match:"` topildi, so'ngra matn boshqa qo'shtirnoq `match:'`gacha iste'mol qilinadi, bu moslikni yopadi.

Pattern yopilish qo'shtirnog'ini aynan ochilgan qo'shtirnoq bilan bir xil ko'rishiga ishonch hosil qilish uchun uni suratga olish guruhiga o'rashimiz va unga qayta havola qilishimiz mumkin: `pattern:(['"])(.*?)\1`.

Quyida to'g'ri kod berilgan:

```js run
let str = `He said: "She's the one!".`;

*!*
let regexp = /(['"])(.*?)\1/g;
*/!*

alert( str.match(regexp) ); // "She's the one!"
```

Endi u ishlaydi! Muntazam iboralar mexanizmi birinchi qo'shtirnoq `pattern:(['"])` ni topadi va uning mazmunini yodlaydi. Bu birinchi tortib olish guruhidir.

Keyinchalik `pattern:\1` pattern'da "birinchi guruhdagi kabi matnni toping" degan ma'noni anglatadi, bizning holatimizda bu aynan bir xil qo'shtirnoq.

Shunga o'xshab, `pattern:\2` ikkinchi guruh mazmunini, `pattern:\3` - 3-guruh va hokazolarni bildiradi.

```smart
Agar guruhda `?:` dan foydalansak, unga havola qila olmaymiz. `(?:...)` yozib olishdan chetlashtirilgan guruhlar dvigatel tomonidan eslab qolinmaydi.
```

```warn header="Chalkashtirmang: patternda `pattern:\1`, almashtirishda: `pattern:$1`"
O'zgartirish qatorida biz dollar belgisidan foydalanamiz: `pattern:$1`, patternda esa - teskari qiyshiq chiziq `pattern:\1`.
```

## Ism bo'yicha qayta havola: `\k<name>`

Agar regexpda ko'p qavs bo'lsa, ularga nom berish qulay.

Nomlangan guruhga murojaat qilish uchun `pattern:\k<name>` dan foydalanishimiz mumkin.

Quyidagi misolda qo'shtirnoqli guruh `pattern:?<quote>` deb nomlangan, shuning uchun qayta havola `pattern:\k<quote>`:

```js run
let str = `He said: "She's the one!".`;

*!*
let regexp = /(?<quote>['"])(.*?)\k<quote>/g;
*/!*

alert( str.match(regexp) ); // "She's the one!"
```
