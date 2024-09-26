# Ma'lumot turlari

JavaScriptdagi qiymat har doim aniq bir turda bo'ladi. Masalan, satr yoki raqam. 

JavaScriptda 8 ta asosiy ma'lumot turi mavjud. Biz bu qismda ularnining barchasini umumiy qamrab olamiz va keyingi bo'limlarda ma'lumot turlarining har biri haqida batafsil to'xtalib o'tamiz. 

Biz o'zgaruvchiga istalgan shaklni joylay olamiz. Masalan, o'zgaruvchi bir holatda satr bo'lib, raqamni kiritishi mumkin:

```js
// xato yo'q
let message = "hello";
message = 123456;
```

JavaScript kabi bunday narsalarga imkon beruvchi tillarni dasturlash "dinamik tarzda yozilgan", ya'ni dynamically typed deb nomlanadi va bu ma'lumot turlari mavjudligini bildiradi, ammo o'zgaruvchilar bularning birortasiga ham tegishli emas. 

## Raqam

```js
let n = 123;
n = 12.345;
```

 Bu yerda *raqam* turi ham butun, ham butun bo'lmagan raqamlarni ko'rsatadi.

Raqamlar uchun ko'plab amallar mavjud, jumladan, ko'paytirish `*`, bo'lish `/`, qo'shish `+`, ayrish `-` va boshqalar.

Odatiy raqamlar bilan bir qatorda, ma'lumotning bu turiga tegishli bo'lgan yana "maxsus raqamli qiymatlarham mavjud: `Infinity`, `-Infinity` va `NaN` 

- `Infinity` - bu matematik cheksizlik [Infinity](https://en.wikipedia.org/wiki/Infinity) ∞ ni bildiradi. Bu maxsus qiymat bo'lib, u har qanday sondan katta.

    Cheksiz qiymatga sonni nolga bo'lish natijasida erishishimiz mumkin: 

    ```js run
    alert( 1 / 0 ); // Infinity
    ```

    Yoki unga to'g'ridan-to'g'ri murojaat qilish orqali:

    ```js run
    alert( Infinity ); // Infinity
    ```
- `NaN` komputerga oid xatoni bildiradi. U noto'g'ri yoki ma'noga ega bo'lmagan matematik amal natijasidir, masalan:

    ```js run
    alert( "not a number" / 2 ); // NaN, bunday bo'lish asossiz
    ```

    `NaN` qiyin tushuncha. `NaN` dagi istalgan qo'shimcha matematik amal `NaN` ga qaytib keladi:

    ```js run
    alert( NaN + 1 ); // NaN
    alert( 3 * NaN ); // NaN
    alert( "not a number" / 2 - 1 ); // NaN
    ```

    Shu tufayli, agar matemaik ifodaning biror joyida `NaN` bor bo'lsa, u butun natijaga tarqaladi (bunday holda bitta istisno mavjud: `NaN ** 0` `1` ga teng).

```smart header="Matematik amallar xavfsizdir"
JavaScriptda matematik amallarni bajarish "xavfsiz". Biz istagan narsamizni qila olamiz: nolga bo'la olamiz, raqamli bo'lmagan qatorlarni raqam deb qaray olamiz va hokazo.

Skript hech qachon falokatli xato bilan to'xtab qolmaydi, ya'ni "ishdan chiqmaydi". Eng yomon holatda `NaN` ga duch kelishimiz mumkin.
```

Maxsus raqamli qiymatlar rasmiy ravishda "raqam", ya'ni number ma'lumot turiga tegishli. Albatta, ular bu so'zning umumiy ma'nosida raqamlar emas. 

Raqamlar bilan ishlashni <info:number> bo'limida ko'proq ko'rib chiqamiz.

## BigInt [#bigint-type]

JavaScript-da "raqam" turi `(253-1)` dan katta `(9007199254740991)` yoki manfiy sonlar uchun `-(253-1)` dan kichik butun sonlarni ishonchli tarzda ifodalay olmaydi.

 Haqiqatan ham, "raqam" turi kattaroq butun sonlarni saqlashi mumkin (1,7976931348623157 * 10308), lekin butun sonlarning xavfsiz diapazonidan tashqarida ±(253-1) aniqlik xatosi bo'ladi, chunki qattiq 64 bitli xotiraga hamma raqamlar ham mos kelmaydi. Shunday qilib, "taxminiy" qiymat saqlanishi mumkin.

```js
console.log(9007199254740991 + 1); // 9007199254740992
console.log(9007199254740991 + 2); // 9007199254740992
```

Shunday qilib, (253-1) dan katta bo'lgan barcha toq sonlarni "raqam" turida saqlash mumkin emas.

Ko'pgina maqsadlar uchun ± (253-1) diapazoni yetarli, lekin ba'zida bizga haqiqatan ham katta butun sonlarning butun diapazoni kerak bo'ladi, masalan, kriptografiya yoki mikrosoniyali aniqlikdagi vaqt belgilari uchun.

`BigInt` ixtiyoriy uzunlikdagi butun sonlarni ifodalash uchun tilga yaqinda qo'shilgan. 

 `BigInt` qiymati butun sonning oxiriga `n` qo'shimchasini kiritish orqali yaratiladi:

```js
//  oxiridagi "n" belgi BigInt ma'nosini bildiradi
const bigInt = 1234567890123456789012345678901234567890n;
```

`BigInt` raqamlari kamdan kam hollarda kerak bo'lganligi tufayli biz ularni bu qismda ko'rib chiqmaymiz, lekin ularga alohida bo'lim <info:bigint> ni bag'ishlaganmiz. Sizga katta raqamlar kerak bo'lganda uni o'qib chiqing.


```smart header="Compatibility issues"
Hozirda `BigInt`  Firefox/Chrome/Edge/Safari lar tomonidan ishlatila oladi, lekin IE da emas.
```

Siz brauzerning qaysi versiyalari ishlatila olishini bilish uchun [*MDN* BigInt compatibility table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility)ni tekshirishingiz mumkin.

## Qator

JavaScriptda satr qo'shtirnoqlar bilan o'rab olinishi lozim.

```js
let str = "Hello"; "salom" ;
let str2 = yakka qo'shtirnoqlar ham qabul qilinadi ; 
let phrase = `boshqa bir  ${str} ni o'rnata oladi`; 
```

JavaScriptda 3 turdagi qo'shtirnoq bor.

1. Ikkitalik qo'shtirnoq: `"Hello"`.
2. Yakka qo'shtirnoq: `'Hello'`.
3. Backtick lar, ya'ni teskari belgilar: <code>&#96;Hello&#96;</code>.

Ikkitali va yakka qo'shtirnoqlar "oddiy" qo'shtirnoqlar hisoblanadi. JavaScriptda ularda amaliy jihatdan hech qanaqa farq yo'q.

Backtick lar "kengaytirilgan funksionallik" qo'shtirnog'idir. Ular bizga o'zgaruvchilar va ifodalarni `${…}` belgilari ichiga o'rab olish orqali satrga kiritish imkoniyatini beradi, misol uchun:

```js run
let name = "John";

// o'zgaruvchini kiritamiz
alert( `Hello, *!*${name}*/!*!` ); // Hello, John!

// ifodani kiritamiz
alert( `natija *!*${1 + 2}*/!*` ); // natija 3 
```

`${…}` belgining ichidagi ifoda baholanadi va natija satrning bir qismiga aylanib qoladi. Buning ichiga istalgan narsa qo'yishimiz mumkin: `name`ga o'xshash o'zgaruvchi yoki  `1 + 2` ga o'xshash arifmetik ifoda yoki biror mukammalroq narsa.

Shuni yodda tutiki, bu faqat backticklardagina bo'ladi. Boshqa qo'shtirnoqnlarni bunday o'rnatish funksiyasi yo'q!
```js run
alert( "natija ${1 + 2}" ); // natija ${1 + 2} (ikkitalik qo'shtirnoq hech narsa qilmaydi)
```

Biz satrlarni <info:string> bo'limida batafsiroq ko'rib chiqamiz.

```smart header="*belgi* turi mavjud emas."
Ba'zi tillarda har bir belgi uchun maxsus "belgi" turi bor. Masalan, C tilida va Java da bu "char" (character) deb nomlanadi. 

JavaScriptda bunday shakl yo'q, faqat bitta shakl mavjud: `string`, ya'ni satr. Satr nol (bo'sh), bitta yoki bir nechata belgilaridan tashkil topgan bo'lishi mumkin.
```

## Boolean (mantiqiy turi)

Boolean turining faqat 2 dona qiymati bor:  `true` (to'g'ri)  va  `false` (noto'g'ri) .

Bu tur ko'pincha ha/yo'q qiymatlarini saqlab qo'yishda ishlatiladi: `true` "ha, to'g'ri" degani, va `false` "yo'q, noto'g'ri" degani.

Misol uchun:

```js
let nameFieldChecked = true; // ha, nom maydoni tekshirildi
let ageFieldChecked = false; // yo'q, yosh maydoni tekshirilmadi
```

Boolean da qiymatlar, shuningdek qiyoslashlar natijasida ham keladi:

```js run
let isGreater = 4 > 1;

alert( isGreater ); // true (to'g'ri) (qiyoslash natijasi "yes" (ha))
```

Booleanlarga <info:logical-operators> bo'limida batafsilroq qarab chiqamiz.

## "null" qiymati

Maxsus `null` qiymati yuqorida ta'kidlab o'tilgan turlarning biortasiga ham tegishli emas.

U o'zining alohida turini shakllantiradi va u faqat `null` qiymatdan iborat:

```js
let age = null;
```

JavaScriptda boshqa dasturlash tillariga o'xshab, `null` "mavjud bo'lmagan obyekt ma'nosini bildirmaydi" yoki "null ko'rsatkich" emas.

U faqatgina  "nothing" (hech narsa) , "empty" (bo'sh) yoki "value unknown" (noma'lum qiymat) larni bildiruvchi maxsus qiymat hisoblanadi.

Yuqoridagi kod `age` noma'lum ekanligini bildiradi. 

## "aniqlanmagan qiymat" (undefined value) 

`undefined` maxsus qiymat ham boshqalardan ajralib turadi. U ham huddi `null` singari o'zining turini shakllantiradi.

`undefined` "qiymat belgilanmagan" degan ma'noni bildiradi.

Agar o'zgaruvchi ma'lum qilinsa, ammo belgilanmasa, demak uning qiymati  `undefined` (aniqlanmagan) bo'ladi:

```js run
let age;

alert(age); // belgi "undefined" ni ko'rsatadi
```

Aslida, `undefined` ni o'zgaruvchiga ochig ravishda belgilashning iloji bor:

```js run
let age = 100;

// qiymatni aniqlanmaganga o'zgartiramiz
age = undefined;

alert(age); // "undefined"
```

...Ammo bunday qilish tavsiya qilinmaydi. Ko'p holatlarda, foydalanuvchi `null`  "empty" (bo'sh) yoki "unknown" (noma'um) qiymatlarni o'zgaruvchiga belgilash uchun `null`dan foydalanadi, `undefined` esa belgilanmagan narsalarga birlamchi boshlang'ich qiymat sifatida saqlab qo'yiladi.

## Jismlar va Ishoralar

`object` turi o'ziga xos hisoblanadi.

Boshqa barcha turlar "primitive" (sodda) deb ataladi, chunki ularning qiymati qator yoki raqam bo'lishidan qat'iy nazar faqat bitta narsani o'z ichiga oladi. Bulardan farqli o'laroq, obyektlardan ma'lumotlar to'plami va mukammalroq bo'lgan birliklarni saqlashda foydalaniladi.


Shu darajada muhim bo'lishi bilan bir qatorda, jismlar yana o'ziga xos yondashuvga ham arziydi. Ular bilan keyinroq, primitive (sodda)lar haqida ko'proq o'rganib bo'lganimizdan keyin <info:object> bo'limida ko'proq shug'ullanamiz. 

`symbol` turi jismlar uchun yagona aniqlovchilar, ya'ni identifiers ni yaratishda foydalaniladi. To'liqlikni ta'minlash uchun, uni shu yerda ta'kidlab o'tdik, ammo tafsilotlarni jismlarni o'rganganimizgacha kechiktirib turamiz. 

## typeof operatori [#type-typeof]

`typeof` operatori argument (berilgan fikr) turini qaytaradi. Har xil turdagi qiymatlarni jarayondan o'tqazayotganimizda yoki qisqa tekshiruv qilmoqchi bo'lganimizda ular foydali bo'ladi. 

`typeof x` ni chaqirish satrni shakl nomi bilan qaytaradi:

```js
typeof undefined // "undefined" (aniqlanmagan)

typeof 0 // "number" (raqam)

typeof 10n // "bigint"

typeof true // "boolean"

typeof "foo" // "string" (satr)

typeof Symbol("id") // "symbol" (ishora)

*!*
typeof Math // "object" (jism) (1)
*/!*

*!*
typeof null // "object" (jism) (2)
*/!*

*!*
typeof alert // "function" (funksiya) (3)
*/!*
```

So'nggi uchta qatorga qo'shimcha tushuntirish kerak bo'lishi mumkin:

1. `Math` bu matematik ammallar bilan ta'minlaydigan ichki (built-in) qurilma. Biz uni <info:number> bo'limida o'rganamiz. Bu yerda esa u faqatgina jism (obyekt) uchun namuna xizmatini bajaradi. 
2. `typeof null` ning natijasi `"object"` dir. Bu `typeof` da rasmiy tan olingan xato bo'lib, JavaScriptning dastlabki kunlaridan kelib chiqqan va mos kelish uchun saqlab qo'yilgan. `null` albatta obyekt emas. U o'zining alohida turiga ega bo'lgan maxsus qiymat. `typeof` ning bu yerdagi xarakteristikasi xatodir.
3. `typeof alert` ning natijasi `"function"` (funksiya)dir, chunki `alert` ning o'zi ham funksiya. Biz funksiyalarni keyingi qismlarda o'rganib chiqamiz va unda JavaScriptda maxsus "function" (funksiy) turi yo'qligini ham ko'ramiz. Funksiyalar obyekt turiga tegishli. Ammo `typeof` ularga boshqacha munosabatda bo'lib, `"function"`ni qaytaradi. Bu ham JavaScriptning dastlabki kunlaridan kelib chiqadi. Texnik jihatdan bunday amallar to'g'ri emas, lekin amalda qulay bo'lishi mumkin.

```smart header="The `typeof(x)` sintaksis"
boshqa `typeof(x)` sinkaksisiga ham duch kelishingiz mumkin. U `typeof x` bilan bir xil.

Aniqroq qilib aytganda `typeof` funksiya emas, operator hisoblanadi. Bu yerdagi qavs `typeof`ning biror bo'lagi hisoblanmaydi, u matematik guruhlashda ishlatiladigan qavs turidir.

Odatda, bunday qavslar matematik ifodani o'z ichiga oladi, masalan `(2 + 2)` kabi, lekin bu yerda ularda faqat bitta `(x)` argumenti bor. Sintaktik ravishda, ular`typeof` operatori va uning argumenti o'rtasidagi bo'shliqdan qochish imkonini beradi va bu ba'zilarga ma'qul keladi>

`typeof x` sintalsisi ancha keng tarqalgan bo'lishiga qaramay ba'zi odamlar `typeof(x)` ni afzal ko'radi.
```

## Xulosa 

JavaScriptda 8 ta ma'lumot turi mavjud.

- `number` har qanday turdagi raqamlar uchun: butun yoki suzuvchi nuqta, butun sonlar ±(253-1) bilan cheklangan.
- `bigint` istalgan uzunlikdagi butun sonlar uchun.
- `string` satrlar uchun. Satrda nol yoki ko'p belgilar bo'lishi mumkin, bularga alohida yakka shakl yo'q.
- `boolean` `true`/`false` (to'g'ri/noto'g'ri) uchun.
- `null` noma'lum qiymatlar uchun -- `null` yagona qiymatga ega bo'lgan mustaqil tur.
- `undefined` belgilanmagan qiymatlar uchun -- yagona `aniqlanmagan` qiymatga ega bo'lgan mustaqil tur.
- `object` mukammalroq ma'lumot tuzilmalari uchun.
- `symbol` yagona aniqlovchilar uchun.

`typeof` operatori bizga o'zgaruvchida qaysi bir tur o'rnatilganini ko'rish imkonini beradi.
 
- Odatda `typeof x`sifatida foydalaniladi, lekin `typeof(x)` ham ishlatilishi mumkin.
- Satrni  huddi `"string"` ga o'xshab bir xil tur nomi bilan qaytaradi.
- `null` uchun `"object"` (obyekt)ni qaytaradi  -- bu dasturlash tilidagi xatodir, u aslida obyekt emas.

Keyingi bo'limlarda biz primitive (sodda) qiymatlarga e'tibor qaratamiz va ular bilan tanishib chiqqanimizdan so'ng, obyektlarga o'tamiz. 