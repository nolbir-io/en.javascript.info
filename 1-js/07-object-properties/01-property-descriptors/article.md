
# Xususiyat bayroqlari va deskriptorlari

Ma'lumki, obyektlar xususiyatlarni saqlashi mumkin.

Hozirgacha xususiyat biz uchun oddiy "kalit-qiymat" juftligi edi. Lekin obyekt xususiyati aslida yanada moslashuvchan va kuchli narsadir.

Ushbu bobda biz qo'shimcha konfiguratsiya opsiyalarini o'rganamiz va keyingisida ularni qanday qilib ko'rinmas holda getter/setter funksiyalariga aylantirishni ko'rib chiqamiz.

## Xususiyat bayroqlari

Obyekt xususiyatlari, **`value`**dan tashqari, uchta maxsus atribyutga ega ( ular"flags" deb ataladi):

- **`writable`** -- agar `true` bo'lsa, qiymat o'zgartirilishi mumkin, u faqat o'qish uchun mo'ljallangan.
- **`enumerable`** -- agar `true` bo'lsa, sikllar ro'yxatiga kiritiladi, aks holda ro'yxatga kiritilmaydi.
- **`configurable`** -- agar `true` bo'lsa, xususiyat o'chirilishi va bu atribyutlar o'zgartirilishi mumkin, aks holda o'zgartirilmaydi.

Biz ularni hali ko'rmadik, chunki ular odatda ko'rinmaydi. Biz "odatiy usul" xususiyatini yaratganimizda, ularning barchasi `true` hisoblanadi, ammo biz ularni istalgan vaqtda o'zgartirishimiz mumkin.

Birinchidan, bu bayroqlarni qanday olish kerakligini ko'rib chiqaylik.

[Object.getOwnPropertyDescriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) usuli xususiyat haqidagi *to'liq* ma'lumotni so'rash imkonini beradi.

Sintaksis:
```js
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
```

`obj`
: Ma'lumot olish uchun obyekt.

`propertyName`
: Xususiyatning nomi

Qaytarilgan qiymat "xususiyat deskriptori" deb ataladigan obyektdir: u qiymat va barcha bayroqlarni o'z ichiga oladi.

Masalan:

```js run
let user = {
  name: "John"
};

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/* xususiyat deskriptori:
{
  "value": "John",
  "writable": true,
  "enumerable": true,
  "configurable": true
}
*/
```
Bayroqlarni o'zgartirish uchun biz [Object.defineProperty] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) dan foydalanishimiz mumkin.

Sintaksis:

```js
Object.defineProperty(obj, propertyName, descriptor)
```

`obj`, `propertyName`
: Deskriptorni qo'llash uchun obyekt va uning xususiyati.

`descriptor`
: Qo'llash uchun xususiyat deskriptor obyekti.

Agar xususiyat mavjud bo'lsa, `defineProperty` o'z bayroqlarini yangilaydi. Aks holda, u berilgan qiymat va bayroqlar bilan xususiyatni yaratadi; u holda, agar bayroq taqdim etilmasa, u `false` deb qabul qilinadi.

Misol uchun, bu yerda barcha noto'g'ri bayroqlar bilan `name` xususiyati yaratilgan:

```js run
let user = {};

*!*
Object.defineProperty(user, "name", {
  value: "John"
});
*/!*

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": "John",
*!*
  "writable": false,
  "enumerable": false,
  "configurable": false
*/!*
}
 */
```

Uni yuqoridagi "normal yaratilgan" `user.name` bilan solishtiring: endi barcha bayroqlar noto'g'ri. Agar bu biz xohlamagan holat bo'lsa, biz ularni `descriptor` da `true` ga o'rnatganimiz ma'qul.


Endi bayroqlarning ta'sirini misol orqali ko'rib chiqamiz.

## Yozilmaydigan (non-writable) 

`writable` bayroqchasini o'zgartirish orqali `user.name`ni yozilmaydigan qilib qo'yamiz (qayta tayinlash mumkin emas):

```js run
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
*!*
  writable: false
*/!*
});

*!*
user.name = "Pete"; // Error: Faqat "name" xususiyatini o'qishga tayinlab bo'lmaydi
*/!*
```
Agar ular biznikini bekor qilish uchun o'zlarining `defineProperty` ni qo'llamasalar, endi hech kim bizning foydalanuvchi nomini o'zgartira olmaydi.

```smart header="Xatolar faqat qattiq rejimda paydo bo'ladi"

Qattiq bo'lmagan, ya'ni non-strict rejimda yozilmaydigan xususiyatlarga va shunga o'xshashlarga yozishda hech qanday xatolik yuzaga kelmaydi. Ammo operatsiya hali ham muvaffaqiyatli bo'lmaydi. Bayroqni buzuvchi harakatlar qat'iy bo'lmaganda shunchaki e'tiborga olinmaydi.
```

Mana bir xil misol, lekin xususiyat noldan yaratilgan:

```js run
let user = { };

Object.defineProperty(user, "name", {
*!*
  value: "John",
  // yangi xususiyatlar uchun biz nima true bo'lishini aniq sanab o'tishimiz kerak
  enumerable: true,
  configurable: true
*/!*
});

alert(user.name); // John
user.name = "Pete"; // Error
```

## Non-enumerable

Endi `user` ga maxsus `toString` ni qo'shamiz.

Odatda, obyektlar uchun o'rnatilgan `toString` ni sanab bo'lmaydi, u `for..in` da ko'rinmaydi. Ammo biz o'zimizga tegishli `toString` ni qo'shsak, u `for..in` da quyidagicha ko'rinadi:

```js run
let user = {
  name: "John",
  toString() {
    return this.name;
  }
};

// ikkala xususiyat ham ro'yxatga olingan:
for (let key in user) alert(key); // name, toString
```

Agar bu bizga yoqmasa, biz `enumerable:false` ni o'rnatishimiz mumkin. Keyin u xuddi o'rnatilgani kabi `for..in` siklida ko'rinmaydi:

```js run
let user = {
  name: "John",
  toString() {
    return this.name;
  }
};

Object.defineProperty(user, "toString", {
*!*
  enumerable: false
*/!*
});

*!*
// Endi bizning toString yo'qoladi:
*/!*
for (let key in user) alert(key); // name
```

Ro'yxatga olinmaydigan xususiyatlar `Object.keys` dan ham chiqarib tashlangan:

```js
alert(Object.keys(user)); // name
```

## Sozlab bo'lmaydigan (Non-configurable)

Sozlab bo'lmaydigan bayroq (`configurable:false`) ba'zan o'rnatilgan obyektlar va xususiyatlar uchun oldindan o'rnatiladi.

Sozlab bo'lmaydigan xususiyatni o'chirib bo'lmaydi, uning atribyutlarini o'zgartirib bo'lmaydi.

Masalan, `Math.PI` yozilmaydi, sanalmaydi va sozlanmaydi:

```js run
let descriptor = Object.getOwnPropertyDescriptor(Math, 'PI');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": 3.141592653589793,
  "writable": false,
  "enumerable": false,
  "configurable": false
}
*/
```
Shunday qilib, dasturchi `Math.PI` qiymatini o'zgartira olmaydi yoki uning ustiga yoza olmaydi.

```js run
Math.PI = 3; // Error, chunki u yozilishi mumkin: false

// o'chirish, Math.PI ham ishlamaydi
```

Shuningdek, `Math.PI` ni yoziladigan, ya'ni `writable` qilib o'zgartira olmaymiz:

```js run
// Error, confugurable sababli: false
Object.defineProperty(Math, "PI", { writable: true });
```

`Math.PI` bilan mutlaqo hech narsa qila olmaymiz.

Mulkni sozlanmaydigan qilib qo'yish bir tomonlama yo'ldir. Biz uni `defineProperty` bilan o'zgartira olmaymiz.

**Iltimos, diqqat qiling: `configurable: false` xususiyat bayroqlarini o'zgartirish va uni o'chirishning oldini oladi, shu bilan birga uning qiymatini o'zgartirishga imkon beradi.**

Bu yerda `user.name` sozlanmaydi, lekin biz uni o'zgartirishimiz mumkin (u yozilishi mumkin):

```js run
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  configurable: false
});

user.name = "Pete"; // yaxshi ishlaydi
delete user.name; // Error
```

Bu yerda biz `user.name` ni o'rnatilgan `Math.PI` kabi "abadiy muhrlangan" konstantaga aylantiramiz:

```js run
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  writable: false,
  configurable: false
});

// user.name yoki uning bayroqlarini o'zgartira olmaydi
// bularning barchasi ishlamaydi:
user.name = "Pete";
delete user.name;
Object.defineProperty(user, "name", { value: "Pete" });
```

```smart header="Mumkin bo'lgan yagona atribut o'zgarishi: yoziladigan true -> false"
Bayroqlarni o'zgartirishda kichik istisno mavjud.

Sozlanishi mumkin bo'lmagan xususiyat uchun `yoziladigan: true` ni `false` ga o'zgartirishimiz mumkin, bu esa uning qiymatini o'zgartirishga yo'l qo'ymaydi (boshqa himoya qatlamini qo'shish uchun).
```

## Object.defineProperties

Bir vaqtning o'zida bir nechta xususiyatlarni aniqlash imkonini beruvchi [Object.defineProperties(obj, deskriptorlar)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) usuli mavjud. .

Sintaksis:

```js
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2
  // ...
});
```

Masalan:

```js
Object.defineProperties(user, {
  name: { value: "John", writable: false },
  surname: { value: "Smith", writable: false },
  // ...
});
```

Shunday qilib, biz bir vaqtning o'zida ko'plab xususiyatlarni o'rnatishimiz mumkin.

## Object.getOwnPropertyDescriptors

Barcha xususiyat identifikatorlarini birdaniga olish uchun biz [Object.getOwnPropertyDescriptors(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors) usulidan foydalanishimiz mumkin.

`Object.defineProperties` bilan birgalikda obyektni klonlashning "bayroqlardan xabardor" usuli sifatida foydalanish mumkin:

```js
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```

Odatda obyektni klonlashda biz xususiyatlarni nusxalash uchun topshiriqdan foydalanamiz, masalan:

```js
for (let key in user) {
  clone[key] = user[key]
}
```
...Ammo bu bayroqlarni nusxalamaydi. Shunday qilib, agar biz "yaxshiroq" klonni xohlasak, `Object.defineProperties` afzalroqdir.

Yana bir farq shundaki, `for..in` ramziy va sanab bo'lmaydigan xususiyatlarni e'tiborsiz qoldiradi, lekin `Object.getOwnPropertyDescriptors` *barcha* xususiyat identifikatorlarini, shu jumladan, ramziy va sanab bo'lmaydiganlarni ham qaytaradi.

## Obyektni global miqyosda muhrlash

Xususiyat deskriptorlari individual xususiyatlar darajasida ishlaydi.

*butun* obyektga kirishni cheklovchi usullar ham mavjud:

[Object.preventExtensions(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)
: Obyektga yangi xususiyatlar qo'shishni taqiqlaydi.

[Object.seal(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
: Xususiyatlarni qo'shish/o'chirishni taqiqlaydi. Barcha mavjud xususiyatlar uchun `configurable: false` ni o'rnatadi.

[Object.freeze(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
: Xususiyatlarni qo'shish/o'chirish/o'zgartirishni taqiqlaydi. Barcha mavjud xususiyatlar uchun `configurable: false, writable: false` ni o'rnatadi.

Shuningdek, ular uchun testlar ham mavjud:

[Object.isExtensible(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)
: Xususiyatlarni qo'shish taqiqlangan bo'lsa, `false` ni qaytaradi, aks holda `true`.

[Object.isSealed(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed)
: Xususiyatlarni qo'shish/o'chirish taqiqlangan bo'lsa va barcha mavjud xususiyatlar `configurable: false` qiymatini qaytaradi.

[Object.isFrozen(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen)
: Xususiyatlarni qo'shish/o'chirish/o'zgartirish ta'qiqlangan bo'lsa va barcha joriy xususiyatlar `configurable: false, writable: false` bo'lsa, `true `qiymatini qaytaradi.

Amalda bu usullar kamdan-kam qo'llaniladi.
