
# sinfning asosiy sintaksisi

```muallif izohi="Wikipedia"
Obyektga yo'naltirilgan dasturlashda *sinf* obyektlarni yaratish uchun kengaytiriladigan dastur-kod-shablon bo'lib, holat (a'zo o'zgaruvchilar) va xatti-harakatlarning amalga oshirilishi (a'zo funksiyalari yoki usullari) uchun boshlang'ich qiymatlarni taqdim etadi.
```

Amalda, biz ko'pincha bir xil turdagi ko'plab obyektlarni yaratishimiz kerak, masalan, foydalanuvchilar yoki tovarlar yoki boshqalar.

<info:constructor-new> bobidan ma'lumki, `new function`, ya'ni yangi funksiya bizga yordam bera oladi.

Ammo zamonaviy JavaScript-da obyektga yo'naltirilgan dasturlash uchun foydali bo'lgan ajoyib yangi xususiyatlarni taqdim etadigan yanada rivojlangan "sinf" konstruktsiyasi mavjud.

## "sinf" sintaksisi

Asosiy sintaksis bu:
```js
sinf MeningSinfim {
  // sinf metodlari
  constructor() { ... }
  method1() { ... }
  method2() { ... }
  method3() { ... }
  ...
}
```

Keyin yuqorida sanab o'tilgan metodlar yordamida yangi obyekt yaratish uchun `new MyClass()` dan foydalaniladi. 

Obyektni ishga tushirish uchun `constructor()` metod chaqiruvi `new` orqali avtomatik ravishda amalga oshiriladi.

Masalan:

```js run
sinf Foydalanuvchi {

  constructor(name) {
    this.name = name;
  }

  sayHi() {
    alert(this.name);
  }

}

// Usage:
let foydalanuvchi = yangi Foydalanuvchi("John");
user.sayHi();
```

Qachonki `yangi Foydalanuvchi ("John")` chaqirilganda:
1. Yangi obyekt yaratiladi
2. `constructor` berilgan argument bilan ishlaydi va uni `this.name` ga tayinlaydi.

...Keyin biz `user.sayHi()` kabi obyekt metodlarini chaqira olamiz.


```ogohlantiruvchi sarlavha="sinf metodlari orasida vergul qo'yilmaydi"
Yangi dasturchilar yo'l qo'yadigan ko'p xatolardan biri - bu sinf usullari orasiga vergul qo'yish, bu hol esa sintaksis xatosiga olib keladi.

Bu yerda yozuvni obyekt harflari bilan aralashtirib yubormaslik kerak. Sinf ichida vergul qo'yish shart emas.
```

## Sinf nima?

Demak, `sinf` qanday ma'noni anglatadi? Bu ko'pchilik o'ylashi mumkin bo'lgan til darajasidagi mutlaqo yangi obyekt emas.

 Keling, har qanday sehrni ochib, sinf aslida nima ekanligini bilib olamiz. Bu ko'plab murakkab jihatlarni tushunishga yordam beradi.

JavaScript-da sinf o'ziga xos funktsiyadir.

Bu yerda o'zingiz ko'rishingiz mumkin:

```js run
class User {
  constructor(name) { this.name = name; }
  sayHi() { alert(this.name); }
}

// isbot: Foydalanuvchi funksiyadir
*!*
alert(typeof User); // function
*/!*
```

`class User {...}` konstruktori aynan qanday vazifalarni bajaradi:

1. Sinf deklaratsiyasining natijasi bo'lgan `User` nomli funktsiyani yaratadi. Funktsiya kodi `constructor` usulidan olingan (agar biz bunday usulni yozmasak, bo'sh deb hisoblanadi).
2. `User.prototype`da `sayHi` kabi sinf metodlarini saqlaydi. 

`new User` obyekti yaratilgandan so`ng, biz uning usulini chaqirganimizda, <info:function-prototype> bobida tasvirlanganidek, u prototipdan olinadi. Shunday qilib, obyekt sinf usullariga kirish huquqiga ega.

Biz `class User` deklaratsiyasining natijasini quyidagicha tasvirlashimiz mumkin:

![](class-user.svg)

Quyida buni o'rganish uchun kod berilgan:

```js run
class User {
  constructor(name) { this.name = name; }
  sayHi() { alert(this.name); }
}

// sinf funksiyadir
alert(typeof User); // funksiya

// ...yoki, yanayam aniqroq aytadigan bo'lsak, bu konstruktor metodi
alert(User === User.prototype.constructor); // true

// Metodlar User.prototype da berilgan, masalan:
alert(User.prototype.sayHi); // sayHi metodining kodi

// Bu yerda prototipda aniq ikkita metod mavjud
alert(Object.getOwnPropertyNames(User.prototype)); // konstruktor, sayHi
```

## Faqatgina sintaktik shakar emas

Ba'zan odamlar `class` bu "sintaktik shakar", deb aytishadi, (sintaksisni o'qishni osonlashtirish uchun yaratilgan, ammo yangi hech narsa kiritmaydi), chunki biz `class` kalit so'zidan foydalanmasdan ham xuddi shu narsani e'lon qilishimiz mumkin:

```js run
// sof funktsiyalarda foydalanuvchi sinfini qayta yozish

// 1. Konstruktor funksiyasini yaarting
function User(name) {
  this.name = name;
}
// funktsiya prototipi sukut bo'yicha "konstruktor" xususiyatiga ega,
// shuning uchun uni yaratishimiz shart emas

// 2. Prototipga metodni qo'shing
User.prototype.sayHi = function() {
  alert(this.name);
};

// Usage:
let user = new User("John");
user.sayHi();
```

Ushbu ta'rifning natijasi tahminan bir xil. Shunday qilib, `class` ni konstruktorni prototip usullari bilan aniqlash uchun sintaktik shakar deb hisoblashning sabablari bor.

Ammo bu yerda muhim farqlar mavjud:

1. Birinchidan, `sinf` tomonidan yaratilgan funksiya maxsus ichki xususiyat `[[IsClassConstructor]] bilan belgilanadi: true`. Shunday qilib, uni qo'lda yaratish bilan butunlay bir xil emas.

  Til bu xususiyatni turli joylarda tekshiradi. Masalan, oddiy funksiyadan farqli ravishda, uni `new` bilan chaqirish kerak:

    ```js run
    class User {
      constructor() {}
    }

    alert(typeof User); // function
    User(); // Error: Sinf konstruktori foydalanuvchisini "new"siz chaqirib bo'lmaydi
    ```
   Bundan tashqari, ko'pgina JavaScript dvigatellarida sinf konstruktorining qatorli ko'rinishi "sinf..." bilan boshlanadi.

    ```js run
    class User {
      constructor() {}
    }

    alert(User); // class User { ... }
    ```
   Boshqa farqlar ham mavjud, ularni keyinroq ko'rib o'tamiz. 

2.  Sinf usullarini sanab bo'lmaydi.
  Sinf ta'rifi `"prototype"` dagi barcha usullar uchun `enumerable` bayroqni `false` ga o'rnatadi.

    That's good, because if we `for..in` over an object, we usually don't want its class methods. Bu yaxshi, chunki obyekt ustida `for..in` bo'lsa, bizga odatda uning sinf usullari kerak bo'lmaydi.

3. Sinflar har doim `use strict` , qat'iy foydalanadi.
     Sinf konstruktsiyasi ichidagi barcha kodlar avtomatik ravishda qattiq rejimda bo'ladi.

Bundan tashqari, `class` sintaksisi biz keyinroq o'rganadigan boshqa ko'plab xususiyatlarga ega.

## Sinf Ifodasi

Just like functions, classes can be defined inside another expression, passed around, returned, assigned, etc. Huddi funksiyalar kabi, sinflar ham boshqa ifoda ichida aniqlanishi, o'tkazilishi, qaytarilishi va tayinlanishi mumkin.

Quyida sinf ifodasi bilan bog'liq bir misolni ko'ramiz:  

```js
let User = class {
  sayHi() {
    alert("Hello");
  }
};
```

Nomlangan funksiya ifodalari kabi sinf ifodalari ham nomga ega bo'lishi mumkin.

Agar sinf ifodasining nomi bo'lsa, u faqat sinf ichida ko'rinadi:

```js run
// "Nomli sinf ifodasi"
// (spetsda bunday atama yo'q, lekin bu nomlangan funktsiya ifodasiga o'xshaydi)
let User = class *!*MyClass*/!* {
  sayHi() {
    alert(MyClass); // MyClass nomi faqatgina sinf ichida ko'rinadi.
  }
};

new User().sayHi(); // ishlaydi, MyClass ta'rifini ko'rsatadi

alert(MyClass); // xato, MyClass nomi sinfdan tashqarida ko'rinmaydi
```

Biz hatto sinflarni dinamik ravishda "talab bo'yicha" qilishimiz mumkin, masalan:

```js run
function makeClass(phrase) {
  // sinfni e'lon qiling va qaytaring
  return class {
    sayHi() {
      alert(phrase);
    }
  };
}

// Yangi sinf yarating
let User = makeClass("Hello");

new User().sayHi(); // Hello
```


## Oluvchilar va o'rnatuvchilar

Huddi so'zma-so'z obyektlar kabi, sinflar qabul qiluvchilar/o'rnatuvchilar, hisoblangan xususiyatlar va boshqalarni o'z ichiga olishi mumkin.

Here's an example for `user.name` implemented using `get/set`: Mana, `get/set` yordamida amalga oshirilgan `user.name` uchun misol:

```js run
class User {

  constructor(name) {
    // o'rnatuvchini chaqiradi
    this.name = name;
  }

*!*
  get name() {
*/!*
    return this._name;
  }

*!*
  set name(value) {
*/!*
    if (value.length < 4) {
      alert("Nom judayam qisqa.");
      return;
    }
    this._name = value;
  }

}

let user = new User("John");
alert(user.name); // John

user = new User(""); // Nom judayam qisqa.
```

Texnik jihatdan bunday sinf deklaratsiyasi `User.prototype` da oluvchilar va sozlagichlarni yaratish orqali ishlaydi.

## Hisoblangan nomlar [...]

Qavslar yordamida hisoblangan usul nomiga misol keltiramiz `[...]`:

```js run
class User {

*!*
  ['say' + 'Hi']() {
*/!*
    alert("Hello");
  }

}

new User().sayHi();
```

Bunday xususiyatlarni eslab qolish oson, chunki ular haqiqiy obyektlarga o'xshaydi.

## Sinf maydonlari

```ogohlantiruvchi sarlavha ="Eski brauzerlar uchun polifill, to'ldiruvchi maydon kerak bo'lishi mumkin"
Sinf maydonlari tilga yaqinda qo'shilgan.
```

Ilgari darslarimizda faqat metodlar mavjud edi.

"Sinf maydonlari" har qanday xususiyatlarni qo'shish imkonini beruvchi sintaksisdir.

Masalan, `name` xususiyatini `class User` ga qo'shaylik:

```js run
class User {
*!*
  name = "John";
*/!*

  sayHi() {
    alert(`Hello, ${this.name}!`);
  }
}

new User().sayHi(); // Hello, John!
```

Demak, "<property name> = <value>" ni deklaratsiyaga yozamiz, xolos. 

Sinf maydonlarining muhim farqi shundaki, ular `User.prototype` ga emas, balki alohida obektlarga o'rnatiladi:

```js run
class User {
*!*
  name = "John";
*/!*
}

let user = new User();
alert(user.name); // John
alert(User.prototype.name); // aniqlanmagan
```

Bundan tashqari, murakkabroq ifodalar va funksiya chaqiruvlari yordamida qiymatlarni belgilashimiz mumkin:

```js run
class User {
*!*
  name = prompt("Name, please?", "John");
*/!*
}

let user = new User();
alert(user.name); // John
```


### Sinf maydonlari bilan bog'liq usullarni yaratish

<info:bind> bobida ko'rsatilganidek, JavaScript-dagi funksiyalar `this` dinamigiga ega. Bu qo'ng'iroqning kontekstiga bog'liq.

Shunday qilib, agar obyekt usuli boshqa kontekstga o'tkazilsa va chaqirilsa, `this` endi uning obyektiga havola bo'lmaydi.

Masalan, bu kod `aniqlanmagan`, deya ko'rsatadi:

```js run
class Button {
  constructor(value) {
    this.value = value;
  }

  click() {
    alert(this.value);
  }
}

let button = new Button("hello");

*!*
setTimeout(button.click, 1000); // aniqlanmagan
*/!*
```

Ushbu masala " `this` ni yo'qotish" deb nomlanadi.

<info:bind> bobida muhokama qilinganidek, uni hal qilishning ikkita usuli mavjud:

1. `setTimeout(() => button.click(), 1000)` kabi oʻrash funksiyasini oʻtkazing.
2. Usulni obyektga bog'lang, masalan. konstruktorda.

Sinf maydonlari boshqa sintaksisni taqdim etadi:

```js run
class Button {
  constructor(value) {
    this.value = value;
  }
*!*
  click = () => {
    alert(this.value);
  }
*/!*
}

let button = new Button("hello");

setTimeout(button.click, 1000); // hello
```

Sinf maydoni `click = () => {...}` har bir obyekt asosida yaratiladi, har bir `Button` obyekti uchun alohida funksiya mavjud bo'lib, uning ichida `this` o'sha obyektga havola qiladi. Biz `button.click` tugmachasini istalgan joyga o'tkazishimiz mumkin va  `this` qiymati har doim to'g'ri bo'ladi.

Bu, ayniqsa, brauzer muhitida, voqea tinglovchilari uchun foydalidir.

## Xulosa

Asosiy sinf sintaksisi quyidagicha ko'rinadi:

```js
class MyClass {
  prop = value; // xususiyat

  constructor(...) { // konstruktor
    // ...
  }

  method(...) {} // metod

  get something(...) {} // qabul qiluvchi metod
  set something(...) {} // o'rnatuvchi metod

  [Symbol.iterator]() {} // hisoblangan nomli usul (bu erda belgi)
  // ...
}
```
`MyClass` texnik jihatdan funksiyadir (biz `konstruktor` sifatida taqdim etamiz), usullar, qabul qiluvchilar va sozlagichlar esa `MyClass.prototype`ga yoziladi.

 Keyingi boblarda biz sinflar, jumladan, meros va boshqa xususiyatlar haqida ko'proq bilib olamiz.
