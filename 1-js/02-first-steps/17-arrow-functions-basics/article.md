# Arrow funksiyalarning asoslari

Funksiyalarni yaratish uchun yana bir juda sodda va ixcham sintaksis mavjud bo'lib, u ko'plab funksiya ifodalaridan yaxshiroq.

Ular "arrow functions" deb ataladi, chunki ular quyidagicha ko'rinishga ega:

```js
let func = (arg1, arg2, ..., argN) => expression;
```

Bu `arg1..argN` argumentlarni qabul qiluvchi `func` funksiyasini yaratadi, so'ngra ulardan foydalanish bilan o'ng tarafdagi `expression` ni hisoblaydi va uning natijasini qaytaradi.

Boshqacha qilib aytganda, bu quyidagi kodni yozishning qisqa usuli:

```js
let func = function(arg1, arg2, ..., argN) {
  return expression;
};
```

Keling, aniq bir misolni ko'rib chiqaylik:

```js run
let sum = (a, b) => a + b;

/* Bu strelka funksiyasi quyidagilarning qisqaroq shaklidir:
let sum = function(a, b) {
  return a + b;
};
*/

alert( sum(1, 2) ); // 3
```

Ko'rib turganingizdek, `(a, b) => a + b` `a` va `b` nomli ikkita argumentni qabul qiluvchi funksiyani bildiradi. Amalga oshirilgandan so'ng, u `a + b` ifodasini hisoblaydi va natijani qaytaradi.

- Agar bizda faqat bitta argument bo'lsa, parametrlar atrofidagi qavslarni olib tashlash mumkin, bu esa uni yanada qisqaroq qiladi.

    Masalan:

    ```js run
    *!*
    let double = n => n * 2;
    // taxminan bir xil: let double = function(n) { return n * 2 }
    */!*

    alert( double(3) ); // 6
    ```

- Agar argumentlar bo'lmasa, qavslar bo'sh bo'ladi (lekin mavjud bo'lishi shart):

    ```js run
    let sayHi = () => alert("Hello!");

    sayHi();
    ```

Arrow funksiyalardan Function Expressions kabi foydalanish mumkin.

Masalan, funksiyani dinamik tarzda yaratish maqsadida:

```js run
let age = prompt("What is your age?", 18);

let welcome = (age < 18) ?
  () => alert('Hello!') :
  () => alert("Greetings!");

welcome();
```

Arrow funksiyalar notanish va boshida o'qishga ancha noqulay ko'rinishi mumkin, lekin ko'zlar tuzilishga o'rganishi bilan bu darhol o'zgaradi.

Ko'p so'zlarni yozishga eringanimizda, ular oddiy bir qatorli harakatlar uchun judayam qulaydir.

## Ko'p qatorli arrow funktsiyalar

Yuqorida misollar `=>` ning chap tomonidagi argumentarni oldi va ular bilan o'ng tomondagi ifodalarni hisobladi.

Ba'zan bizga bir nechta iboralar yoki ifodalar kabi biroz murakkabroq narsa kerak bo'ladi. Buning iloji bor, lekin biz ularni figurali qavslar ichiga olishimiz kerak. Keyin ular ichida oddiy `return` dan foydalanamiz.

Mana bunga o'xshash:

```js run
let sum = (a, b) => {  // figurali qavs ko'p qatorli funksiyani ochadi
  let result = a + b;
*!*
  return result; // agar biz figurali qavslardan foydalansak, unda aniq "return" kerak bo'ladi
*/!*
};

alert( sum(1, 2) ); // 3
```

```smart header="Hali asosiylari oldinda"
Bu yerda biz qisqaligi uchun arrow funksiyalarini maqtadik. Lekin bu hammasi emas!

Arrow funksiyalar boshqa qiziqarli xususiyatlarga ega.

Ularni chuqur o'rganish uchun avvalo JavaScriptning ba'zi boshqa jihatlari bilan tanishishimiz kerak, shuning uchun keyinroq <info:arrow-functions> bobida arrow funksiyalariga qaytamiz.

Hozircha, biz allaqachon arrow funksiyalardan bir qatorli harakatlar va callback lar uchun foydalana olamiz.
```

## Xulos

Arrow funktsiyalar oddiy harakatlar, ayniqsa, bir qatorli harakatlar uchun judayam qulay. Ular ikki xil ko'rinishda bo'ladi:

1. Figurali qavslarsiz: `(...args) => expression` -- o'ng tomon ifoda: funksiya uni hisoblaydi va qaytaradi.
2. Figurali qavslar bilan: `(...args) => { body }` -- qavslar bizga funksiya ichida bir nechta ifodalarni yozish imkonini beradi, ammo biz biror narsani qaytarish uchun `return` dan foydalanishimiz kerak.