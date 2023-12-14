
# # O'rnatilgan sinflarni kengaytirish

Array (to'plam), map (xarita) va boshqalar kabi o'rnatilgan sinflar ham kengaytirilishi mumkin.

Misol uchun, bu yerda `PowerArray` mahalliy `Array` dan meros oladi:

```js run
//  yana bitta usul qo'shish (ko'proq qila oladi)
class PowerArray extends Array {
  isEmpty() {
    return this.length === 0;
  }
}

let arr = new PowerArray(1, 2, 5, 10, 50);
alert(arr.isEmpty()); // false

let filteredArr = arr.filter(item => item >= 10);
alert(filteredArr); // 10, 50
alert(filteredArr.isEmpty()); // false
```

Iltimos, juda qiziq narsaga e'tibor bering. `filter` , `map` va boshqalar kabi o'rnatilgan usullar -- `PowerArray` turidagi yangi obyektlarni qaytaradi. Ularning ichki amalga oshirilishi uchun obyektning `constructor` xususiyatidan foydalaniladi.

Yuqoridagi misolda berilganki:
```js
arr.constructor === PowerArray
```

`arr.filter()` chaqirilganda, u asosiy `Array` emas, aynan `arr.constructor` yordamida yangi natijalar qatorini yaratadi. Bu aslida juda zo'r, chunki biz natijada `PowerArray` usullaridan foydalanishni davom ettirishimiz mumkin.

Bundan tashqari, biz bu xatti-harakatni sozlashimiz mumkin.

Biz sinfga maxsus statik qabul qiluvchi `Symbol.species` ni qo'shishimiz mumkin. Agar u mavjud bo'lsa, u `map`, `filter` va hokazolarda yangi obyektlar yaratish uchun JavaScript ichki ishlatadigan konstruktorni qaytarishi kerak.

Oddiy massivlarni qaytarish uchun `map` yoki `filter` kabi o'rnatilgan usullarni xohlasak, `Symbol.species` da `Array`ni qaytarishimiz mumkin, masalan:

```js run
class PowerArray extends Array {
  isEmpty() {
    return this.length === 0;
  }

*!*
  // o'rnatilgan usullar buni konstruktor sifatida ishlatadi
  static get [Symbol.species]() {
    return Array;
  }
*/!*
}

let arr = new PowerArray(1, 2, 5, 10, 50);
alert(arr.isEmpty()); // xato

// filtr konstruktor sifatida arr.constructor[Symbol.species] yordamida yangi massiv yaratadi
let filteredArr = arr.filter(item => item >= 10);

*!*
// filteredArr PowerArray emas, lekin Array hisoblanadi
*/!*
alert(filteredArr.isEmpty()); // Xato: filteredArr. bo'sh va u funksiya emas
```

Ko'rib turganingizdek, endi `.filtr` `Array`ni qaytaradi. Shunday qilib, kengaytirilgan funksiya boshqa o'tkazilmaydi.

```aqlli sarlavha="Boshqa to'plamlar xuddi shunday ishlaydi"
"Map" va "Set" kabi boshqa to'plamlar bir xil ishlaydi. Ular `Symbol.species` dan ham foydalanadilar.
```

## O'rnatilgan sinflarda statik meroslar mavjud emas

O'rnatilgan obyektlar o'zining shaxsiy statik usullariga ega, masalan, `Object.keys`, `Array.isArray` va boshqalar.

Allaqachon bizga ma'lumki,  mahalliy sinflar bir-birini kengaytiradi. Masalan, `Array` `Object` ni kengaytiradi.

Odatda, bir sinf boshqasini kengaytirganda, statik va statik bo'lmagan usullar meros qilib olinadi. Bu maqolada batafsil tushuntirilgan [](info:static-properties-methods#statics-and-inheritance).

O'rnatilgan sinflar bundan istisno. Ular bir-biridan statiklarni meros qilib olmaydi.

Masalan, `Array` ham, `Date` ham `Object`dan meros bo‘lib, ularning misollarida `Object.prototype` usullari mavjud. Lekin `Array.[[Prototype]]` `Object`ga havola qilmaydi, shuning uchun, masalan, `Array.keys()` (yoki `Date.keys()`) statik usuli mavjud emas.

Bu yerda `Date` va `Object` uchun rasm strukturasi berilgan:

![](object-date-inheritance.svg)

Ko'rib turganingizdek, `Date` va `Object` o'rtasida hech qanday havola yo'q. Ular mustaqil, faqatgina `Date.prototype` `Object.prototype` dan meros oladi.

Bu o'rnatilgan obyektlar o'rtasidagi merosning `extends` bilan biz olgan narsaga nisbatan muhim farqidir.
