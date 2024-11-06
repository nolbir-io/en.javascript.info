# Mantiqiy operatorlar

JavaScriptda to'rtta mantiqiy operator mavjud: `||` (OR), `&&` (AND), `!` (NOT), `??` (Nullish Coalescing). Hozir  birinchi uchtasini ko'rib chiqamiz, `??` operatori haqida esa keyingi maqolada bilib olamiz.

Ular "mantiqiy" deb atalsada, ular nafaqat mantiqiy, balki har qanday turdagi qiymatlar bilan ham qo'llaniladi. Ularning natijasi har qanday turda bo'lishi mumkin.

Keling, tafsilotlarni ko'rib chiqaylik.

## || (OR)

"OR" operatori ikkita vertikal chiziq belgisi bilan ifodalanadi:

```js
result = a || b;
```

Klassik dasturlashda mantiqiy OR faqat mantiqiy qiymatlarni boshqarish uchun mo'ljallangan. Agar uning argumentlaridan birortasi `true` bo'lsa, u `true` ni qaytaradi, aks holda `false` ni qaytaradi.

JavaScriptda operatorda biroz hiyla-nayrang mavjud va u ancha kuchliroq. Lekin birinchi navbatda, boolean qiymatlar bilan nima sodir bo'lishini ko'rib chiqaylik.

To'rtta mantiqiy kombinatsiya mavjud:

```js run
alert( true || true );   // true
alert( false || true );  // true
alert( true || false );  // true
alert( false || false ); // false
```

Ko'rib turganimizdek, ikkala operand ham `false` bo'lgan holdan boshqa paytda natija har doim `true` bo'ladi.

Agar operand boolean bo'lmasa, u hisoblash uchun booleanga aylantiriladi.

Misol uchun, `1` soniga `true` sifatida qaraladi, `0` soniga esa `false` sifatida:

```js run
if (1 || 0) { // if kabi ishlaydi( true || false )
  alert( 'truthy!' );
}
```

Ko'pincha, `||` OR `if` ifodasida berilgan shartlardan birortasi `true` mavjud yoki yo'qligini tekshirish uchun ishlatilgan.

Misol uchun:

```js run
let hour = 9;

*!*
if (hour < 10 || hour > 18) {
*/!*
  alert( 'The office is closed.' );
}
```

Ko'proq shartlarni bajarib ko'ramiz:

```js run
let hour = 12;
let isWeekend = true;

if (hour < 10 || hour > 18 || isWeekend) {
  alert( 'The office is closed.' ); // hafta oxiri
}
```

## "||" OR birinchi rost qiymatni topadi [#or-finds-the-first-truthy-value]

Yuqorida tavsiflangan mantiq biroz eskirgan. Keling, JavaScriptning "qo'shimcha" xususiyatlarini keltiramiz.

Kengaytirilgan algoritm quyidagicha ishlaydi.

Bir nechta OR qiymatlari berilgan:

```js
result = value1 || value2 || value3;
```

`||` OR operatori quyidagilarni bajaradi:

- Operandlarni chapdan o'ngga qarab hisoblaydi.
- Har bir operandni booleanga aylantiradi. Agar natija `true` bo'lsa to'xtaydi va o'sha operandning ilk qiymatini qaytaradi.
- Agar hamma operandlar hisoblab bo'linsa (ya'ni, hammasi `false` bo'lsa) oxirgi operandni qaytaradi.

Qiymat o'zining dastlabki ko'rinishida konversiya qilinmagan holda qaytariladi.

Boshqacha qilib aytanda, `||` OR zanjiri birinchi rost qiymatni yoki agar birorta rost qiymat topilmasa  oxirgi qiymatni qaytaradi.

Misol uchun:

```js run
alert( 1 || 0 ); // 1 (1 rost)

alert( null || 1 ); // 1 (1 birinchi rost qiymat)
alert( null || 0 || 1 ); // 1 (birinchi rost qiymat)

alert( undefined || null || 0 ); // 0 (hammasi falsy, oxirgi qiymatni qaytaradi)
```

Bundan foydalanish "sof, klassik, faqat boolean bo'lgan OR" dan ko'ra qiziqarliroq.

**O'zgaruvchi yoki ifodalar ro'yxatidan birinchi rost qiymatni olish.**

    Misol uchun, bizda qiymati ixtiyoriy (ya'ni, undefined yoki falsy qiymat bo'lishi mumkin) bo'lgan `firstName`, `lastName` va `nickName` o'zgaruvchilar mavjud.

    Keling, `||` OR dan ma'lumotga ega bo'lgan biri (yoki agar birorta bo'lmasa "Anonymous")ni tanlash va ko'rsatish uchun foydalanamiz:

    ```js run
    let firstName = "";
    let lastName = "";
    let nickName = "SuperCoder";

    *!*
    alert( firstName || lastName || nickName || "Anonymous"); // SuperCoder
    */!*
    ```

    Agar barcha o'zgaruvchilar falsy bo'lganida, `"Anonymous"` ko'rsatilgan bo'lardi.

2. **Short-circuit evaluation. (Qisqa doirali hisoblash)**

    `||` OR operatorining yana bir xususiyati bu "short-circuit"deb ataladigan hisoblashdir.

    Bu shuni anglatadiki, `||` birinchi rost qiymat topilguniga qadar o'z argumentlarini ko'zdan kechiradi va so'ngra qiymat boshqa argumentga tegmasdan darhol qaytariladi.

    Ushbu xususiyatning ahamiyati agar operand faqatgina qiymat emas, balki o'zgaruvchi tayinlash yoki funksiya chaqirish kabi ifoda bo'lganida ayon bo'ladi.

    Quyidagi misolda faqatgina ikkinchi xabar ko'rsatiladi:

    ```js run no-beautify
    *!*true*/!* || alert("not printed");
    *!*false*/!* || alert("printed");
    ```

    Birinchi qatorda `||` OR operatori `true` ni ko'rishi bilan darhol hisoblashni to'xtatadi, shuning uchun `alert` ishga tushmaydi.

    Ba'zida odamlar ushbu xususiyatdan faqatgina chap qismdagi shart yolg'on bo'lganda buyruqlarni ishga tushurish uchun foydalanadilar. 

## && (AND)

AND operatori ikkita `&&` belgisi bilan ifodalanadi:

```js
result = a && b;
```

Klassik dasturlashda AND ikkala operand ham rost bo'lganda `true`ni, aks holda esa `false`ni qaytaradi:

```js run
alert( true && true );   // true
alert( false && true );  // false
alert( true && false );  // false
alert( false && false ); // false
```

`if` bilan misol:

```js run
let hour = 12;
let minute = 30;

if (hour == 12 && minute == 30) {
  alert( 'The time is 12:30' );
}
```

OR da bo'lganidek, AND ham operand sifatida har qarday qiymatni qabul qiladi:

```js run
if (1 && 0) { //  true && false deb baholanadi
  alert( "ishlamaydi, chunki natija noto'g'ri" );
}
```


## "&&" AND birinchi yolg'on qiymatni topadi

Bir nechta AND qiymatlari berilgan:

```js
result = value1 && value2 && value3;
```

`&&` AND operatori quyidagilarni bajaradi:

- Operandlarni chapdan o'ngga qarab hisoblaydi:
- Har bir operandni booleanga aylantiradi. Agar natija `false` bo'lsa to'xtaydi va o'sha operandning asl qiymatini qaytaradi.
- Agar barcha operandlar hisoblab bo'linsa (ya'ni, barchasi rost bo'lsa), oxirgi operandni qaytaradi.

Boshqacha qilib aytganda, AND birinchi noto'g'ri qiymatni, agar u topilmasa, oxirgi qiymatni qaytaradi.

Yuqoridagi qoidalar OR ga o'xshash. Farqi shundaki, AND birinchi *yolg'on* qiymatni OR esa birinchi *rost* qiymatni qaytaradi.

Misollar:

```js run
// agar birinchi operand haqiqat bo'lsa,
// AND ikkinchi operandni qaytaradi:
alert( 1 && 0 ); // 0
alert( 1 && 5 ); // 5

// agar birinchi operand noto'g'ri bo'lsa,
// VA uni qaytaradi. Ikkinchi operand e'tiborga olinmaydi
alert( null && 5 ); // null
alert( 0 && "no matter what" ); // 0
```

Bundan tashqari, bir qatorga ko'plab qiymatlarni o'tkazishimiz ham mumkin. Birinchi yolg'on qiymat qanday qaytarilganiga e'tibor qarating:

```js run
alert( 1 && 2 && null && 3 ); // null
```

Barcha qiymatlar rost bo'lganda, oxirgi qiymat qaytadi:

```js run
alert( 1 && 2 && 3 ); // 3, the last one
```

````smart header="`&&` AND ning ustunligi `||` OR nikidan balandroq"
`&&` AND ning ustunligi `||` OR nikidan balandroq.

Demak, `a && b || c && d` kod `&&` ifoda qavsda `(a && b) || (c && d)` bo'lgani kabi bir xildir.
````

````warn header="`if` ni `||` yoki `&&` bilan almashtirmang"
Ba'zida odamalar `&&` AND operatorini "`if` ni yozishning qisqa yo'li" sifatida ishlatishadi.

Misol uchun:

```js run
let x = 1;

(x > 0) && alert( '0 dan kattaroq!' );
```

`&&` ning o'ng tomonidagi amal faqatgina hisoblash unga yetib kelganida bajariladi. Ya'ni faqat `(x > 0)` rost bo'lganda.

Demak, bizda analog mavjud:

```js run
let x = 1;

if (x > 0) alert( '0 dan katta!' );
```

Garchi `&&` varianti qisqaroq ko`rinsa-da, `if` ravshanroq va biroz o`qishga osonroq. Shuning uchun har bir kod tuzilmasini o'z maqsadi uchun ishlatish tavsiya qilinadi: xohlasangiz "if" dan yoki "&&" dan foydalaning. 
````


## ! (NOT)

Boolean NOT operatori undov `!` belgisi orqali ifodalanadi.

Sintaksis juda oddiy:

```js
result = !value;
```

Operator yagona argument qabul qiladi va quyidagilarni bajaradi:

1. Operandni boolean turga aylantiradi: `true/false`.
2. Teskari qiymatni qaytaradi.

Misol uchun:

```js run
alert( !true ); // false
alert( !0 ); // true
```

Ba'zan ikkita `!!` NOT dan qiymatni boolean turga aylantirish uchun foydalaniladi:

```js run
alert( !!"non-empty string" ); // true
alert( !!null ); // false
```

Ya'ni, birinchi NOT qiymatni booleanga aylantiradi va teskarisini qaytaradi, ikkinchi NOT uni yana teskarisiga o'giradi. Oxir-oqibat bizda qiymatdan booleanga konversiya paydo bo'ladi.

Xuddi shu narsani qilishning biroz batafsilroq usuli mavjud -- built-in `Boolean` funksiyasi:

```js run
alert( Boolean("non-empty string") ); // true
alert( Boolean(null) ); // false
```

`!` NOT barcha mantiqiy operatorlardan yuqori ustunlikka ega, shuning uchun u `&&` yoki `||` dan avval eng birinchi bajariladi.