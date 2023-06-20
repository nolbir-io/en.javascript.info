# Dinamik importlar
Oldingi boblarda ko'rib chiqilgan eksport va import bayonotlari "statik" deb ataladi. Sintaksis juda sodda va qat'iy.

Birinchidan, biz `import` parametrlarini dinamik ravishda yarata olmaymiz.

Modul yo'li primitiv satr bo'lishi kerak, funksiya chaqiruvi bo'lishi mumkin emas. Bu ishlamaydi:

```js
import ... from *!*getModuleName()*/!*; // Error, faqat "string" dan ruxsat berilgan
```

Ikkinchidan, biz shartli yoki ish vaqtida import qila olmaymiz:

```js
if(...) {
  import ...; // Error, ruxsat berilmagan!
}

{
  import ...; // Error, biz importni hech qanday blokka joylashtira olmaymiz
}
```

Buning sababi, `import`/`eksport` kod tuzilishi uchun asos yaratishni maqsad qilgan. Bu yaxshi narsa, chunki kod strukturasini tahlil qilish, modullarni maxsus vositalar yordamida bir faylga yig'ish va to'plash, foydalanilmagan eksportlarni olib tashlash mumkin ("tree-shaken"). Bu faqat import/eksport tuzilishi oddiy va qat'iy bo'lgani uchun mumkin.

Ammo modulni dinamik ravishda, talab bo'yicha qanday import qilishimiz mumkin?

## import() ifodasi

`Import(modul)` ifodasi modulni yuklaydi va uning barcha eksportlarini o'z ichiga olgan modul obyektiga hal qiluvchi va'dani qaytaradi. Uni kodning istalgan joyidan chaqirish mumkin.

Biz uni kodning istalgan joyida dinamik ravishda ishlatishimiz mumkin, masalan:

```js
let modulePath = prompt("Qaysi modulni yuklash kerak?");

import(modulePath)
  .then(obj => <module object>)
  .catch(err => <loading error, e.g. if no such module>)
```

Yoki asinxron funksiyasi ichida bo‘lsa, `let modul = await import(modulePath)` dan foydalanishimiz mumkin.

Masalan, agar bizda `say.js` moduli mavjud bo'lsa:

```js
// 📁 say.js
export function hi() {
  alert(`Hello`);
}

export function bye() {
  alert(`Bye`);
}
```

...Keyin dinamik import quyidagicha bo'lishi mumkin:

```js
let {hi, bye} = await import('./say.js');

hi();
bye();
```

Yoki, agar `say.js` standart eksportga ega bo'lsa:

```js
// 📁 say.js
export default function() {
  alert("Modul yuklandi (export default)!");
}
```

...Keyin unga kirish uchun modul obyektining `default` xususiyatidan foydalanishimiz mumkin:

```js
let obj = await import('./say.js');
let say = obj.default;
// yoki bitta qatorda: let {default: say} = await import('./say.js');

say();
```

Mana toʻliq misol:

[codetabs src="say" current="index.html"]

```smart
Dinamik importlar oddiy skriptlarda ishlaydi, ular `script type="module"` talab qilmaydi.
```

```smart
`import()` funksiya chaqiruviga o'xshab ko'rinsa-da, bu maxsus sintaksis bo`lib, qavslardan foydalaniladi («super()`ga o`xshash).

Shuning uchun biz `import` ni o'zgaruvchiga ko'chira olmaymiz yoki u bilan `call/apply` dan foydalana olmaymiz. Bu funksiya emas.
```
