# BigInt

[recent caniuse="bigint"]

`BigInt` - bu ixtiyoriy uzunlikdagi butun sonlarni qo'llab-quvvatlaydigan maxsus raqamli tip.

Bigint butun son literalining oxiriga `n` qo'shilishi yoki satrlar, raqamlar va hokazolardan bigint lar yaratuvchi `BigInt` funksiyasini chaqirish orqali yaratiladi.

```js
const bigint = 1234567890123456789012345678901234567890n;

const sameBigint = BigInt("1234567890123456789012345678901234567890");

const bigintFromNumber = BigInt(10); // 10n kabi bir xil
```

## Matematik operatorlar

`BigInt` odatda oddiy raqam sifatida ishlatilishi mumkin, masalan:

```js run
alert(1n + 2n); // 3

alert(5n / 2n); // 2
```

Esda tuting: "5/2" boʻlinmasi natijani o'nli kasrsiz nolga yaxlitlangan holda qaytaradi. Bigintlardagi barcha operatsiyalar bigintlarni qaytaradi.

Biz katta va oddiy raqamlarni aralashtira olmaymiz:

```js run
alert(1n + 2); // Error: BigInt va boshqa turlarni aralashtirib bo'lmaydi
```

Agar kerak bo'lsa, biz ularni aniq konvertatsiya qilishimiz kerak: `BigInt()` yoki `Number()` yordamida quyidagi kabi:

```js run
let bigint = 1n;
let number = 2;

// number to bigint
alert(bigint + BigInt(number)); // 3

// bigint to number
alert(Number(bigint) + number); // 3
```

O'tkazish operatsiyalari har doim ovozsiz bo'ladi, hech qachon xato qilmaydi, lekin agar bigint juda katta bo'lsa va raqam turiga mos kelmasa, qo'shimcha bitlar kesiladi, shuning uchun biz bunday konvertatsiya qilishda ehtiyot bo'lishimiz kerak.

````aqlli sarlavha="Bigintlarda birlik plus qo'llab-quvvatlanmaydi"
Birlik plyus operatori `+value` `value`ni raqamga aylantirishning mashhur usulidir.

Chalkashmaslik uchun u bigintlarda qo'llab-quvvatlanmaydi:
```js run
let bigint = 1n;

alert( +bigint ); // error
```
Shunday qilib, biz bigintni raqamga aylantirish uchun `Number()` dan foydalanishimiz kerak.
````

## Taqqoslashlar

`<`, `>` kabi taqqoslashlar bigintlar va raqamlar bilan ishlaydi:

```js run
alert( 2n > 1n ); // true

alert( 2n > 1 ); // true
```

E'tibor bering, raqamlar va kattaliklar har xil turlarga tegishli bo'lganligi sababli, ular `==` ga teng bo'lishi mumkin, lekin qat'iy teng emas `===`:

```js run
alert( 1 == 1n ); // true

alert( 1 === 1n ); // false
```

## Mantiqiy operatsiyalar

`If` yoki boshqa mantiqiy operatsiyalar ichida bo'lsa, bigintlar raqamlar kabi ishlaydi.

Masalan, `if` da bigint `0n` noto'g'ri, boshqa qiymatlar to'g'ridir:

```js run
if (0n) {
  // hech qachon bajarmaydi
}
```

`||`, `&&` va boshqalar kabi mantiqiy operatorlar ham raqamlarga o`xshash bigintlar bilan ishlaydi:

```js run
alert( 1n || 2 ); // 1 (1n to'g'ri deb hisoblanadi)

alert( 0n || 2 ); // 2 (0n xato deb hisoblanadi)
```

## Polyfills

Bigintlarni polyfilling qilish juda qiyin. Sababi,`+`, `-` va boshqalar kabi ko'pgina JavaScript operatorlari oddiy raqamlarga nisbatan bigintlar bilan boshqacha yo'l tutishadi.

Misol uchun, bigintlarning bo'linishi har doim bigintni qaytaradi (agar kerak bo'lsa, yaxlitlanadi).

Bunday xatti-harakatlarga taqlid qilish uchun polyfill kodni tahlil qilishi va barcha operatorlarni o'z funktsiyalari bilan almashtirishi kerak. Ammo buni qilish juda og'ir va ko'p ishlashga xarajat qiladi.

Shunday qilib, bizda taniqli yaxshi polyfill mavjud emas.

Aksincha, [JSBI](https://github.com/GoogleChromeLabs/jsbi) kutubxonasi ishlab chiquvchilar tomonidan taklif qilingan.

Ushbu kutubxona o'z usullaridan foydalangan holda katta raqamlarni amalga oshiradi. Biz ularni mahalliy bigintlar o'rniga ishlatishimiz mumkin:

| Operation | native `BigInt` | JSBI |
|-----------|-----------------|------|
| Creation from Number | `a = BigInt(789)` | `a = JSBI.BigInt(789)` |
| Addition | `c = a + b` | `c = JSBI.add(a, b)` |
| Subtraction	| `c = a - b` | `c = JSBI.subtract(a, b)` |
| ... | ... | ... |

... Va keyin JSBI qo'ng'iroqlarini ularni qo'llab-quvvatlaydigan brauzerlar uchun mahalliy bigintlarga aylantirish uchun polyfill (Babel plugini) dan foydalaning.

Boshqacha qilib aytadigan bo'lsak, bu yondashuv mahalliy bigintlar o'rniga JSBI-da kod yozishni taklif qiladi. Ammo JSBI raqamlar bilan, xuddi bigintlar kabi, ichkarida ishlaydi, spetsifikatsiyaga rioya qilgan holda ularga taqlid qiladi, shuning uchun kod "bigintga tayyor" bo'ladi.

Biz bunday JSBI kodini bigintlarni qo'llab-quvvatlamaydigan dvigatellar uchun va qo'llab-quvvatlaydiganlar uchun "as is" ishlatishimiz mumkin - polyfill qo'ng'iroqlarni mahalliy bigintlarga aylantiradi.

## Havolalar

- [MDN docs on BigInt](mdn:/JavaScript/Reference/Global_Objects/BigInt).
- [Specification](https://tc39.es/ecma262/#sec-bigint-objects).
