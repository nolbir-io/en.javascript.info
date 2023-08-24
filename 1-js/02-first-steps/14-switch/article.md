# "switch" bayonoti

`switch` bayonoti ko'plab `if` tekshiruvlarining o'rnini bosishi mumkin.

Bu qiymatni bir nechta variant bilan solishtirishning yanada tavsifli usulini beradi

## Sintaksis

`switch` bir yoki undan ko'proq `case` bloklari va ixtiyoriy defaultdan iborat.
 
U shunga o'xshaydi:

```js no-beautify
switch(x) {
  case 'value1':  // if (x === 'value1')
    ...
    [break]

  case 'value2':  // if (x === 'value2')
    ...
    [break]

  default:
    ...
    [break]
}
```

- `x`ning qiymati birinchi `case` (ya'ni `value1`) dan ikkinchisiga (`value2`) va hokazo qiymatlarga qat'iy tenglik uchun tekshiriladi.
- Agar tenglik topilsa, `switch` mos kelgan `case`dan boshlab eng yaqin `break`ga (yoki `switch` yakuniga) qadar ishlashni boshlaydi.
- Agar bironta `case` mos kelmasa u holda `default` kod ishga tushadi, (agar mavjud bo'lsa).

## Namuna

`switch`ga namuna (bajarilgan kod yoritilgan):

```js run
let a = 2 + 2;

switch (a) {
  case 3:
    alert( 'Too small' );
    break;
*!*
  case 4:
    alert( 'Exactly!' );
    break;
*/!*
  case 5:
    alert( 'Too big' );
    break;
  default:
    alert( "I don't know such values" );
}
```

Bu yerda `switch` `a`ni `3`ga teng bo'lgan birinchi `case`dan solishtirishni boshlaydi. O'xshashlik muvaffaqiyatsiz yakunlanadi.

So'ngra `4`. U mos keladi, shuning uchun bajaruv `case4`dan boshlanib eng yaqin `break`gacha davom etadi.

**Agar `break` mavjud bo'lmasa barajuv hech qanday tekshiruvlarsiz keyingi `case` bilan davom etadi.**

`break` mavjud bo'lmagandagi namuna:

```js run
let a = 2 + 2;

switch (a) {
  case 3:
    alert( 'Too small' );
*!*
  case 4:
    alert( 'Exactly!' );
  case 5:
    alert( 'Too big' );
  default:
    alert( "I don't know such values" );
*/!*
}
```

Yuqoridagi misolda uchta `alert`ning  ketma-ket bajarilishini ko'ramiz:

```js
alert( 'Exactly!' );
alert( 'Too big' );
alert( "I don't know such values" );
```

````smart header="Har qanday ibora `switch/case` argumenti bo'lishi mumkin.
`switch` ham `case` ham katta hajmli ifodalar bilan ham ishlaydi.

Misol uchun:

```js run
let a = "1";
let b = 0;

switch (+a) {
*!*
  case b + 1:
    alert("bu ishlaydi, chunki +a 1, aynan b+1 ga teng");
    break;
*/!*

  default:
    alert("bu ishlamaydi");
}
```
Bu yerda `+a` `1`ni beradi, u `case`da `b + 1` bilan solishtiriladi va mos kelgan kod bajariladi.
````
````

## "case"ni guruhlash

Bir xil kodga ega bo'lgan "case" ning bir nechta variantlarini guruhlash mumkin.

Misol uchun, agar bir xil kodni `case 3` uchun ham `case 5` uchun bajarilishini xohlasak:

```js run no-beautify
let a = 3;

switch (a) {
  case 4:
    alert('Right!');
    break;

*!*
  case 3: // (*) ikkita case guruhlandi
  case 5:
    alert('Wrong!');
    alert("Why don't you take a math class?");
    break;
*/!*

  default:
    alert('The result is strange. Really.');
}
```

Endi `3` ham `5` ham bir xil xabarni ko'rsatadi.

Caselarni guruhlash qobiliyati `switch/case` `break`siz qanday ishlashining ta'siridir. Bu yerda `case 3`ning bajariluvi `(*)` qatordan boshlanadi va `case 5`gacha davom etadi, lekin bironta `break` mavjud emas.

## Turning ahamiyati

Shuni ta'kidlash kerakki, tenglikni tekshirish har doim qat'iy vazifadir. Qiymatlar mos kelishi uchun bir xil turga ega bo'lishlari kerak.

Misol uchun:

```js run
let arg = prompt("Enter a value?");
switch (arg) {
  case '0':
  case '1':
    alert( 'One or zero' );
    break;

  case '2':
    alert( 'Two' );
    break;

  case 3:
    alert( 'Never executes!' );
    break;
  default:
    alert( 'An unknown value' );
}
```

1. `0`, `1` uchun birnchi `alert` bajariladi.
2. `2` uchun ikkinchi `alert` bajariladi.
3. Ammo `3` uchun so'rovning natijasi `3` qatori bo'lib, u `3` raqamiga `===` mutlaqo teng emas. Shunday qilib, bizda `case-3` ishlamaydigan kod bor va standart variant ishga tushadi.

