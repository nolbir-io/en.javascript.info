# Shartli zanjirlanish: if, '?'

Ba'zan biz turli shartlar asosida har xil harakatlarni amalga oshirishimiz kerak.

Buning uchun biz `if` ifodasidan va shartli operator`?`dan foydalanishimiz mumkin, bu ham "question mark" (so'roq belgisi) operatori deb ataladi.

## "if" ifodasi

`if(...)` ifoda qavs ichidagi shartni hisoblaydi va agar natija `rost` bo`lsa kod bajariladi.

Misol uchun:

```js run
let year = prompt('ECMAScript-2015 spetsifikatsiyasi qaysi yilda chop etilgan?'','');

*!*
if (year == 2015) alert( 'Siz haqsiz!' );
*/!*
```

Yuqoridagi misolda oddiy tenglikni tekshirish sharti berilgan (`yil == 2015`), lekin u ancha murakkabroq bo'lishi ham mumkin.

Agar biz bir nechta ifodani bajarmoqchi bo'lsak, kod blokini figurali qavslar ichiga yozishimiz kerak:

```js
if (year == 2015) {
  alert( "Bu to'g'ri!" );
  alert( "Siz judayam aqllisiz!" );
}
```
Har safar `if` iborasidan foydalanganda, hatto bajariladigan bitta buyruq bo'lsa ham, kod blokingizni figurali qavslar `{}` bilan o'rashingizni tavsiya qilamiz. Bu o'qish imkoniyatini yaxshilaydi.

## Boolean konversiyasi

`if (...)` ifodasi qavs ichidagi ifodani hisoblaydi va natijani boolean qiymatga aylantiradi.

Keling <info:type-conversions> bobidan konvertatsiya qilish qoidalarini eslaylik:

- `0` soni, `""` bo'sh string, `null`, `undefined` va `NaN` hammasi `false` ga alanadi. Shu tufayli ular "falsy" (yolg'on) qiymatlar deb ataladi.
- Boshqa qiymatlar `true` ga aylanadi, shuning uchun ular "truthy" (rost) deb ataladi.

Shunday qilib, ushbu shart ostidagi kod hech qachon bajarilmaydi:

```js
if (0) { // 0 is falsy
  ...
}
```

...va shart ichida -- u doim bajariladi:

```js
if (1) { // 1 is truthy
  ...
}
```

Bundan tashqari, oldindan hisoblangan mantiqiy qiymatni `if` ga quyidagicha o'tkazishimiz mumkin:

```js
let cond = (year == 2015); // tenglik to'g'ri yoki noto'g'ri deb baholanadi

if (cond) {
  ...
}
```

## "else" clause

`if` ifodasi ixtiyoriy "else" blokini o'z ichiga olishi mumkin. U shart yolg'on bo'lganda bajariladi.

Misol uchun:
```js run
let year = prompt('In which year was the ECMAScript-2015 specification published?', '');

if (year == 2015) {
  alert( 'To'g'ri taxmin qildingiz!' );
} else {
  alert( 'Qanday qilib bunchalik xato qila olasiz?' ); // 2015-yildan tashqari har qanday qiymat
}
```

## Bir nechta shartlar: "else if"

Ba'zan biz shartning bir nechta variantini sinab ko'rmoqchi bo'lamiz. `Else if` clause buni qilishga imkon beradi.

Masalan:

```js run
let year = prompt('ECMAScript-2015 spetsifikatsiyasi qaysi yilda nashr etilgan?', '');

if (year < 2015) {
  alert( 'Juda erta...' );
} else if (year > 2015) {
  alert( 'Juda kech' );
} else {
  alert( 'Aniq!' );
}
```

Yuqoridagi kodda JavaScript birinchi `year < 2015` ni tekshiradi. Agar u yolg'on bo'lsa, u keyingi `year > 2015` shartiga yuzlanadi. Agar u ham yolg'on bo'lsa, u oxirgi `alert` ni ko'rsatadi.

Ko'plab `else if` bloklarini yaratish mumkin. Yakuniy `else` esa ixtiyoriy.

## '?' shart operatori

Ba'zan biz shartga qarab o'zgaruvchini tayinlashimiz kerak.

Misol uchun:

```js run no-beautify
let accessAllowed;
let age = prompt('Yoshingiz nechchida?', '');

*!*
if (age > 18) {
  accessAllowed = true;
} else {
  accessAllowed = false;
}
*/!*

alert(accessAllowed);
```

"Shart" yoki "so'roq belgisi" deb ataladigan operator bizga buni qisqaroq va soddaroq usulda qilish imkonini beradi.

Operator `?` savol belgisi bilan ifodalanadi. Ba'zan u "ternary" (uchlik) deb ataladi, chunki operator uchta operandga ega. Bu JavaScriptda buncha ko'p operandi bo'lgan yakka va yagona operatordir.

Sintaksis:
```js
let result = condition ? value1 : value2;
```

`condition` hisoblanadi: agar u rost bo'lsa keyin `value1` qaytariladi, aks holda -- `value2`.

Misol uchun:

```js
let accessAllowed = (age > 18) ? true : false;
```

Texnik jihatda, `age > 18` ning atrofidagi qavslarni tushirib qoldirishimiz mumkin. So'roq belgisi operatori past ustunlikka ega, shuning uchun u `>` taqqoslashdan keyin bajariladi. 

Ushbu misol avvalgisi bilan bir xil ishni bajaradi:

```js
// "age > 18" taqqoslash operatori baribir birinchi bo'lib bajariladi
// (qavslar ichiga o'rash shart emas)
let accessAllowed = age > 18 ? true : false;
```

Ammo qavslar kodni o'qishni osonlashtiradi, shuning uchun ulardan foydalanishni tavsiya qilamiz.

````smart
Yuqoridagi misolda so'roq belgisi operatoridan foydalanmasligingiz mumkin, chunki taqqoslashning o'zi `true/false` ni qayataradi:
```js
// the same
let accessAllowed = age > 18;
```
````

## Ko'plab '?'

`?` so'roq belgisi operatorlari ketma-ketligi bir nechta shartlarga bog'liq bo'lgan qiymatni qaytarishi mumkin:

Misol uchun:
```js run
let age = prompt('age?', 18);

let message = (age < 3) ? 'Hi, baby!' :
  (age < 18) ? 'Hello!' :
  (age < 100) ? 'Greetings!' :
  'What an unusual age!';

alert( message );
```

Avvaliga nima bo'layotganini tushunish qiyin bo'lishi mumkin. Ammo diqqat bilan o'rganib chiqqach, bu oddiy sinovlar ketma-ketligi ekanligini ko'rishimiz mumkin:

1. Birinchi so'roq belgisi `age < 3` yoki yo'qligini tekshiradi.
2. Agar rost boʻlsa -- u `'Hi, baby!'` ni qaytaradi. Aks holda, u '":"' ikki nuqtadan keyingi `age < 18` tekshiruv ifodasi bilan davom etadi.
3. Agar u rost bo'lsa -- u `'Hello!'` ni qaytaradi. Aks holda, u '":"' ikki nuqtadan keyingi `age < 100` tekshiruv ifodasi bilan davom etadi.
4. Agar u rost bo'lsa -- u `'Greetings!` ni qaytaradi. Aks holda, u oxirgi '":"' ikki nuqtadan keyingi `'What an unusual age!'`ni qaytaruvchi ifoda bilan davom etadi.

Quyida uning `if..else` yordamida qanday ko'rinishi:

```js
if (age < 3) {
  message = 'Hi, baby!';
} else if (age < 18) {
  message = 'Hello!';
} else if (age < 100) {
  message = 'Greetings!';
} else {
  message = 'What an unusual age!';
}
```

## '?' ning noan'anaviy qo'llanishi

Ba'zida `?` so'roq belgisi `if`ni o`rniga ishlatiladi:

```js run no-beautify
let company = prompt('Which company created JavaScript?', '');

*!*
(company == 'Netscape') ?
   alert('Right!') : alert('Wrong.');
*/!*
```

`company == 'Netscape'` shartiga qarab, `?` dan keyingi birinchi yoki ikkinchi ifoda bajariladi va alertni ko'rsatadi.

Bu yerda natijani o'zgaruvchiga tayinlamaymiz. Buning o'rniga shartga qarab turlicha kodni bajarishimiz mumkin.

**So'roq belgisi operatorini bunday usulda qo'llash maslahat berilmaydi.**

Notation ba'zi dasturchilarni qiziqtiradigan ekvivalent `if` iborasidan qisqaroq. Ammo uning o'qilish qobiliyati kamroq hisoblanadi.

Quyida taqqoslash uchun `if` dan foydalangan holda bir xil kodni ko'rib chiqamiz:

```js run no-beautify
let company = prompt('Which company created JavaScript?', '');

*!*
if (company == 'Netscape') {
  alert('Right!');
} else {
  alert('Wrong.');
}
*/!*
```

Ko'zlarimiz kodni vertikal ravishda tekshiradi. Bir nechta satrlarni o'z ichiga olgan kod bloklarini uzun, gorizontal ko'rsatmalar to'plamiga qaraganda tushunish osonroqdir.

`?` savol belgisi operatorining maqsadi uning shartiga qarab u yoki bu qiymatni qaytarish. Uni faqat shu maqsaddagina ishlating. Kodning turli bo'limlarini bajarish kerak bo'lganda `if` dan foydalaning.
