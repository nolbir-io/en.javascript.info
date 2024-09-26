# Primitiv metodlar

JavaScript bizga primitivlar (stringlar, numberlar va hokazo) bilan obyektlar kabi ishlash imkonini beradi. Ular, shuningdek, chaqirish (calling) metodlarini ham taqdim etadi. Ularni o'rganishimizdan avval biz ularning qanday ishlashini ko'rib chiqishimiz lozim, chunki primitivlar obyektlar emas (va endi bunga yanada aniqlik kiritamiz).

Keling, primitiv va obyektlar o'rtasidagi asosiy farqlarni ko'rib chiqaylik.

Primitiv

- Primitiv turdagi qiymat.
- 7 ta primitiv tur mavjud: `string`, `number`, `bigint`, `boolean`, `symbol`, `null` va `undefined`.

Obyekt

- Bir nechta qiymatlarni xususiyat (property) sifatida saqlay oladi.
- Obyekt `{}` bilan yaratiladi, masalan: `{name: "John", age: 30}`. JavaScriptda boshqa obyekt turlari mavjud, masalan funksiyalar ham obyektlar hisoblanadi.

Obyektlarning eng yaxshi jihatlaridan biri shundaki, biz funksiyani uning xususiyatlaridan biri sifatida saqlashimiz mumkin.

```js run
let john = {
  name: "John",
  sayHi: function() {
    alert("Hi buddy!");
  }
};

john.sayHi(); // Hi buddy!
```

Shunday qilib, biz bu yerda `sayHi` metodiga ega `John` obyektini yaratdik.

Ko'plab ichki o'rnatilgan obyektlar (built-in objects) allaqachon mavjud bolib ularga sanalar, xatolar, HTML elementlari va boshqalar bilan ishlaydiganlar kiradi. Ular turli xususiyat va metodlarga ega.

Biroq, bu xususiyatlar qimmatga tushadi!

Obyektlar primitivlardan ko'ra "yengilroq". Ular ichki mexanizmlarni qo'llab-quvvatlashi uchun qo'shimcha resurslarni talab qiladi.

## Primitiv obyekt sifatida

Quyida JavaScript yaratuvchisi duch kelgan paradoks:

- String yoki Number kabi primitiv bilan ko'p amallarni bajarishni xohlashingiz mumkin. Metodlar ularga kirish uchun juda yaxshi yo'ldir.
- Primitivlar imkon qadar tez va yengil bo'lishi kerak.

Yechim biroz noqulay ko'rinadi, lekin quyida yechimni ko'rishimiz mumkin:

1. Primitivlar, xohlaganingizdek, yagona qiymat.
2. Dasturlash tili string, number, boolean va symbollarning metodlari va xususiyatlariga kirish imkonini beradi.
3. Buning ishlashi uchun qo'shimcha funksiyalarni ta'minlaydigan maxsus "o'rovchi obyekt" (wrapping object) yaratiladi va keyin yo'q qilinadi.

"O'rovchi obyektlar" har bir primitiv tur uchun turlicha va ular `String`, `Number`, `Boolean`, `Symbol` va `BigInt` deb ataladi. Shuning uchun, ular turli xil metodlar to'plamini taqdim etadi.

Masalan, bosh harf bilan yozilgan `str` ni qaytaruvchi [str.toUpperCase()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase) string metodi mavjud.

Mana, quyida u qanday ishlashi ko'rsatilgan:

```js run
let str = "Hello";

alert( str.toUpperCase() ); // HELLO
```

Oddiy, to'g'rimi? Mana, aslida `str.toUpperCase()` da nima sodir bo'ladi:

1. `str` string primitivdir. Shunday qilib, uning qiymatiga kirish vaqtida, string qiymatini biladigan va `toUpperCase()` kabi foydali metodlarga ega maxsus obyekt yaratiladi.
2. Ushbu metod bajariladi va yangi string (`alert` da ko'rsatilgan) qaytariladi.
3. Maxsus obyekt yo'q qilinadi va primitiv `str` faqat o'zi qoladi.

Shunday qilib, primitivlar metodlar taqdim etishi mumkin, ammo ular yengil bo'lib qolaveradi.

JavaScript dvigateli bu jarayonni yuqori darajada optimallashtiradi. U hatto qo'shimcha obyekt yaratilishini ham o'tkazib yuborishi mumkin. Lekin u baribir spetsifikatsiyaga rioya qilishi va xuddi uni yaratgandek harakat qilishi kerak.

Number o'z metodlariga ega, masalan, [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) metodi raqamni berilgan aniqlikka yaxlitlaydi:

```js run
let n = 1.23456;

alert( n.toFixed(2) ); // 1.23
```

<info:number> va <info:string> bo'limlarida ko'proq metodlarni ko'rib chiqamiz.


````warn header="Constructors `String/Number/Boolean` faqat ichki foydalanish uchun"``
Java kabi ba'zi tillar bizga `new Number(1)` yoki `new Boolean(false)` kabi sintaksisdan foydalangan holda primitivlar uchun "o'rovchi obyektlar" ni qo'lda yaratishga imkon beradi.

JavaScriptda bu tarixiy sabablarga ko'ra mumkin bo'lishi mumkin, lekin umuman **tavsiya etilmaydi**. Bir necha joylarda narsalar g'alati ishlashi mumkin.

Masalan:

```js run
alert( typeof 0 ); // "number"

alert( typeof new Number(0) ); // "object"!
```

Obyektlar har doim `if` da true, shuning uchun bu yerda alert paydo bo'ladi:

```js run
let zero = new Number(0);

if (zero) { // zero true hisoblanadi, chunki u obyekt
  alert( "zero is truthy!?!" );
}
```

Boshqa tomondan, `new`siz bir xil `String/Number/Boolean` funksiyalaridan foydalanish eng munosib va foydali yo'ldir. Ular qiymatni mos keladigan turlar: string, number yoki boolean (primitive) ga o'zgartiradi.

Masalan, mana bu to'liq yaroqli:

```js
let num = Number("123"); // string ni numberga aylantiring
```
````


````warn header="null/undefined metodlarga ega emas"
`null` va `undefined` maxsus primitivlari bundan mustasno. Ularda mos keladigan "o'rovchi obyektlar" yo'q va hech qanday usullarni taqdim etmaydi. Qaysidir ma'noda ular "eng primitiv", ya'ni eng sodda funksiyalardir.

Bunday qiymatdagi xususiyatga kirishga urinish xatoga olib keladi:

```js run
alert(null.test); // error
````

## Xulosa

- `null` va `undefined`dan boshqa primitivlar ko'plab foydali metodlarni taqdim etadi. Ularni kelayotgan bo'limlarda o'rganamiz.
- Rasman, bu metodlar vaqtinchalik obyektlar orqali ishlaydi, ammo JavaScript dvigatellari buni ichki optimallashtirish uchun yaxshi sozlangan, shuning uchun ularni chaqirish qimmat emas.
