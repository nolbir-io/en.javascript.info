
# Statik xususiyatlar va usullar

Shuningdek, biz butun sinfga metod belgilashimiz mumkin. Bunday usullar *statik* deb ataladi.

 Sinf deklaratsiyasida ular `static`  kalit so'zi bilan qo'shiladi, masalan:

```js run
class User {
*!*
  static staticMethod() {
*/!*
    alert(this === User);
  }
}

User.staticMethod(); // to'g'ri
```

Bu aslida uni to'g'ridan-to'g'ri mulk sifatida belgilash bilan bir xil bajariladi:

```js run
class User { }

User.staticMethod = function() {
  alert(this === User);
};

User.staticMethod(); // to'g'ri
```

`User.staticMethod()` chaqiruvidagi `this` ning qiymati `User` sinf konstruktoridir ("nuqtadan oldingi obyekt" qoidasi).

Odatda, statik usullar sinfning biron bir obyektiga emas, balki butun sinfga tegishli bo'lgan funksiyalarni amalga oshirish uchun ishlatiladi.

Masalan, bizda `Article` obyektlari bor va ularni solishtirish uchun funksiya kerak.

Tabiiy yechim `Article.compare` statik usulini qo'shish bo'ladi:

```js run
class Article {
  constructor(title, date) {
    this.title = title;
    this.date = date;
  }

*!*
  static compare(articleA, articleB) {
    return articleA.date - articleB.date;
  }
*/!*
}

// foydalanish
let articles = [
  new Article("HTML", new Date(2019, 1, 1)),
  new Article("CSS", new Date(2019, 0, 1)),
  new Article("JavaScript", new Date(2019, 11, 1))
];

*!*
articles.sort(Article.compare);
*/!*

alert( articles[0].title ); // CSS
```

Bu yerda `Article.compare` usuli maqolalarni solishtirish vositasi sifatida "yuqorida" turadi. Bu maqolaning usuli emas, balki butun sinfning usuli hisoblanadi.

Yana bir misol, "zavod" deb ataladigan usul.

 Aytaylik, maqola yaratish uchun bizga bir nechta usullar kerak bo'ladi:

1. Mavjud parametrlar bilan yaratish (`title`, `date` sarlavha, sana va boshqalar).
2. Bugungi sana bilan bo'sh maqola yaratish
3. ...yoki boshqalar

Birinchi usul konstruktor tomonidan amalga oshirilishi mumkin. Ikkinchisi uchun biz sinfning statik usulini yaratamiz.

`Article.createTodays()` kabi:

```js run
class Article {
  constructor(title, date) {
    this.title = title;
    this.date = date;
  }

*!*
  static createTodays() {
    // remember, this = Article
    return new this("Today's digest", new Date());
  }
*/!*
}

let article = Article.createTodays();

alert( article.title ); // Bugungi dayjest (qisqa bayon)
```

Endi har safar bugungi dayjestni yaratishimiz kerak bo'lganda, biz `Article.createTodays()` ni chaqirishimiz mumkin. Yana bir bor ta'kidlayman, bu maqolaning usuli emas, balki butun sinfning usuli hisoblanadi.

Statik usullar ma'lumotlar bazasi bilan bog'liq sinflarda ma'lumotlar bazasidan yozuvlarni qidirish/saqlash/o'chirish uchun ham qo'llaniladi, masalan:

```js
//  Maqola maqolalarni boshqarish uchun maxsus sinfdir
// Maqolani id bo'yicha olib tashlashning statik usuli:
Article.remove({id: 12345});
```

````ogohlantiruvchi sarlavha="Statik usullar alohida obyektlar uchun mavjud emas"
Statik usullar alohida obyektlarda emas, balki sinflarda chaqirilishi mumkin.

E.g. quyidagi kabi kodlar ishlamaydi:

```js
// ...
article.createTodays(); /// Error: article.createTodays funksiya emas
```
````

## Statik xususiyatlar

[recent browser=Chrome]

Statik xususiyatlar ham ishlatilishi mumkin, ular oddiy sinf xususiyatlariga o'xshaydi, lekin `static` bilan old qatorda yoziladi:

```js run
class Article {
  static publisher = "Ilya Kantor";
}

alert( Article.publisher ); // Ilya Kantor
```

That is the same as a direct assignment to `Article`: Bu  `Article` ga to'g'ridan-to'g'ri tayinlash bilan bir xil

```js
Article.publisher = "Ilya Kantor";
```

## Statik xossalar va usullarni meros qilib olish[#statik-va-meros]

Statik xususiyatlar va usullar meros qilib olinadi.

Masalan, quyidagi kodda berilgan `Animal.compare` va `Animal.planet` meros qilib olingan hamda ulardan `Rabbit.compare` va `Rabbit.planet` kabi foydalamish mumkin:

```js run
class Animal {
  static planet = "Earth";

  constructor(name, speed) {
    this.speed = speed;
    this.name = name;
  }

  run(speed = 0) {
    this.speed += speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }

*!*
  static compare(animalA, animalB) {
    return animalA.speed - animalB.speed;
  }
*/!*

}

// Inherit from Animal
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }
}

let rabbits = [
  new Rabbit("White Rabbit", 10),
  new Rabbit("Black Rabbit", 5)
];

*!*
rabbits.sort(Rabbit.compare);
*/!*

rabbits[0].run(); // Black Rabbit (qora quyon) 5 tezlikda yuguradi.

alert(Rabbit.planet); // Earth
```

Qachonki `Rabbit.compare` ni chaqirganimizda, meros qilib olingan `Animal.compare` chaqiriladi.

Bu qanday ishlaydi? Yana prototiplardan foydalangan holda ishlatilishi mumkin. Allaqachon tahmin qilganingizdek, `extends` `Rabbit`ga, `[[Prototip]]` `Animal`ga havola beradi.

![](animal-rabbit-static.svg)

Demak, `Rabbit extends Animal` (quyon hayvonni kengaytiradi) ikkita `[[Prototype]]` havola yaratadi:

1. `Rabbit`  funksiyasi prototip sifatida `Animal` funksiyasidan meros oladi.
2. `Rabbit.prototype` prototipi sifatida `Animal.prototype` dan meros oladi.

Natijada, meros ham muntazam, ham statik usullar uchun ishlaydi.

Demak, buni kod yozish orqali tekshirib ko'ramiz:

```js run
class Animal {}
class Rabbit extends Animal {}

// for statics
alert(Rabbit.__proto__ === Animal); // true

// for regular methods
alert(Rabbit.prototype.__proto__ === Animal.prototype); // true
```

## Xulosa

Statik usullar "butun" sinfga tegishli bo'lgan funksionallik uchun qo'llaniladi. Bu aniq sinf misoliga taalluqli emas.

Masalan, `Article.compare(article1, article2)` taqqoslash usuli yoki `Article.createTodays()` zavod usuli.

Ular sinf deklaratsiyasida `static` so'zi bilan belgilanadi.

Statik xususiyatlar biz sinf darajasidagi ma'lumotlarni saqlamoqchi bo'lganimizda ishlatiladi, shuningdek, ular  misol bilan bog'lanmagan.

Sintaksisda misol ko'rib chiqishimiz mumkin:

```js
class MyClass {
  static property = ...;

  static method() {
    ...
  }
}
```

Texnik jihatdan, statik deklaratsiya sinfning o'ziga tayinlash bilan bir xil:

```js
MyClass.property = ...
MyClass.method = ...
```

Static xususiyatlar va usullar meros qilib olingan.

`class B extends A` uchun `B` sinf prototipining o'zi `A` ga ishora qiladi: `B.[[Prototype]] = A`. Shunday qilib, agar `B` da maydon topilmasa, qidiruv `A` da davom etadi.
