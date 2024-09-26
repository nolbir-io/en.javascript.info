
Birinchi g'oya orasida `|` bilan tillarni sanab o'tish mumkin.

Lekin bu to'g'ri ishlamaydi:

```js run
let regexp = /Java|JavaScript|PHP|C|C\+\+/g;

let str = "Java, JavaScript, PHP, C, C++";

alert( str.match(regexp) ); // Java,Java,PHP,C,C
```

Muntazam ifoda mexanizmi birma-bir o'zgarishlarni qidiradi. Ya'ni: avval bizda `match:Java` borligini tekshiradi, aks holda -- `match:JavaScript` va hokazolarni qidiradi.

Natijada, `match:JavaScript` hech qachon topilmaydi, chunki avval `match:Java` tekshiriladi.

`Match:C` va `match:C++` bilan ham xuddi shunday.

Ushbu muammoning ikkita yechimi mavjud:

1. Avval uzunroq moslikni tekshirish uchun tartibni o'zgartiring:`pattern:JavaScript|Java|C\+\+|C|PHP`.
2. Variantlarni bir xil boshlanish bilan birlashtiring: `pattern:Java(Script)?|C(\+\+)?|PHP`.

Amalda:

```js run
let regexp = /Java(Script)?|C(\+\+)?|PHP/g;

let str = "Java, JavaScript, PHP, C, C++";

alert( str.match(regexp) ); // Java,JavaScript,PHP,C,C++
```
