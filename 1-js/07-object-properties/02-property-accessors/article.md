
# Xususiyat oluvchilar va o'rnatuvchilar (Property getters and setters)

Obyekt xususiyatlarining ikkita turi mavjud.

Birinchisi *ma'lumotlar xususiyatlari*. Ular bilan qanday ishlash kerakligini bilamiz. Biz hozirgacha foydalanayotgan barcha xususiyatlar ma'lumotlar xususiyatlari edi.

Ikkinchi turdagi xususiyat - bu yangi narsa. Bu *aksessor xususiyati*, ya'ni *accessor property* . Ular mohiyatan qiymatni olish va o'rnatishda bajariladigan funksiyalardir, lekin tashqi kodning odatiy xususiyatlariga o'xshaydi.

## Oluvchilar va o'rnatuvchilar (Getters and setters)

Aksessuar xossalari "getter" va "setter" usullari bilan ifodalanadi. Obyekt literalida ular `get` va `set` bilan belgilanadi:

```js
let obj = {
  *!*get propName()*/!* {
    // getter, obj.propName olishda bajariladigan kod
  },

  *!*set propName(value)*/!* {
    // setter, obj.propName = qiymatni o'rnatishda bajariladigan kod
  }
};
```
Getter `obj.propName` o'qilganda, setter esa tayinlanganda ishlaydi.

 Masalan, bizda `name` va `surname` ega `user` obyekti mavjud:

```js
let user = {
  name: "John",
  surname: "Smith"
};
```
Endi biz `fullName` xususiyatini qo'shmoqchimiz, u `"Jon Smith"` bo'lishi kerak. Albatta, biz mavjud ma'lumotlarni nusxalash va joylashtirishni xohlamaymiz, shuning uchun biz uni yordamchi sifatida amalga oshirishimiz mumkin:

```js run
let user = {
  name: "John",
  surname: "Smith",

*!*
  get fullName() {
    return `${this.name} ${this.surname}`;
  }
*/!*
};

*!*
alert(user.fullName); // John Smith
*/!*
```
Tashqaridan qaraganda, accessor xususiyati oddiy xususiyatga o'xshaydi. Bu aksessuar xususiyatlarining g'oyasi. Biz `user.fullName` funksiyasi sifatida *qo'ng'iroq qilmaymiz*, biz uni odatdagidek *o'qiymiz*: qabul qiluvchi, ya'ni getter sahna ortida ishlaydi.

Hozircha `fullName` faqat qabul qiluvchiga ega. Agar biz `user.fullName=` ni belgilashga harakat qilsak, error yuz beradi:

```js run
let user = {
  get fullName() {
    return `...`;
  }
};

*!*
user.fullName = "Test"; // Error (xususiyatda faqat getter mavjud)
*/!*
```

`user.fullName` uchun setter qo'shish orqali uni tuzatamiz:

```js run
let user = {
  name: "John",
  surname: "Smith",

  get fullName() {
    return `${this.name} ${this.surname}`;
  },

*!*
  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  }
*/!*
};

// set fullName berilgan qiymat bilan bajariladi.
user.fullName = "Alice Cooper";

alert(user.name); // Alice
alert(user.surname); // Cooper
```

Natijada, bizda "virtual" xususiyat `fullName` mavjud. U o'qilishi va yozilishi mumkin.

## Aksessuar deskriptorlari

Aksessuar xususiyatlarining identifikatorlari ma'lumotlar xususiyatlaridan farq qiladi.

Aksessuarlar uchun `value` yoki `writable` funksiyalari mavjud emas, buning o'rniga `get` va `set` funksiyalari mavjud.

 Ya'ni, aksessuar deskriptorida quyidagilar bo'lishi mumkin:

- **`get`** --argumentsiz funksiya, xususiyat o'qilganda ishlaydi,
- **`set`** -- xususiyat o'rnatilganda chaqiriladigan bitta argumentli funksiya,
- **`enumerable`** -- ma'lumotlar xususiyatlari bilan bir xil,
- **`configurable`** -- ma'lumotlar xususiyatlari bilan bir xil.

Masalan, `defineProperty` yordamida `fullName` aksessuarini yaratish uchun biz `get` va `set` bilan deskriptorni o'tkazishimiz mumkin:

```js run
let user = {
  name: "John",
  surname: "Smith"
};

*!*
Object.defineProperty(user, 'fullName', {
  get() {
    return `${this.name} ${this.surname}`;
  },

  set(value) {
    [this.name, this.surname] = value.split(" ");
  }
*/!*
});

alert(user.fullName); // John Smith

for(let key in user) alert(key); // name, surname
```

Esda tutingki, xususiyat aksessuar (`get/set` usullariga) yoki ma'lumotlar xususiyati (`value` ga ega) bo'lishi mumkin, ammo birdaniga ikkalasiga ega bo'lolmaydi.

Agar biz bir xil identifikatorda `get` va `value` ni ham berishga harakat qilsak, xatolik yuz beradi:

```js run
*!*
// Error: Xususiyat deskriptori yaroqsiz.
*/!*
Object.defineProperty({}, 'prop', {
  get() {
    return 1
  },

  value: 2
});
```

## Aqlli oluvchilar/sozlovchilar, ya'ni getter va setterlar

Qabul qiluvchilar/setterlar ular bilan operatsiyalar ustidan ko'proq nazoratga ega bo'lish uchun "haqiqiy" mulk qiymatlari ustidan wrapper sifatida ishlatilishi mumkin.

Masalan, agar biz `user` uchun juda qisqa nomlarni ta'qiqlashni istasak, biz `name` setteriga ega bo'lishimiz va qiymatni alohida `_name` xususiyatida saqlashimiz mumkin:

```js run
let user = {
  get name() {
    return this._name;
  },

  set name(value) {
    if (value.length < 4) {
      alert("Name juda qisqa, kamida 4 ta belgi kerak");
      return;
    }
    this._name = value;
  }
};

user.name = "Pete";
alert(user.name); // Pete

user.name = ""; // Name juda qisqa...
```
Shunday qilib, nom `_name` xususiyatida saqlanadi va kirish getter va setter orqali amalga oshiriladi.

Texnik jihatdan tashqi kod `user._name` yordamida nomga bevosita kirishi mumkin. Ammo `"_"` pastki chiziq bilan boshlangan xususiyatlar ichki xususiyatga ega va obyektga tashqaridan tegmaslik kerakligi haqida keng tarqalgan konventsiya mavjud.

## Muvofiqlik uchun foydalanish

Aksessuarlardan foydalanishning eng yaxshi jihatlaridan biri shundaki, ular istalgan vaqtda "oddiy" ma'lumotlar mulkini getter va setter bilan almashtirish va uning xatti-harakatlarini sozlash orqali nazorat qilish imkonini beradi.

Tasavvur qiling-a, biz `name` va `age` ma'lumotlar xususiyatlaridan foydalangan holda foydalanuvchi obyektlarini amalga oshirishni boshladik:

```js
function User(name, age) {
  this.name = name;
  this.age = age;
}

let john = new User("John", 25);

alert( john.age ); // 25
```

...Ammo ertami-kechmi hammasi o'zgarishi mumkin. `age` o'rniga `birthday` ni saqlashga qaror qilishimiz mumkin, chunki bu aniq va qulayroq:

```js
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;
}

let john = new User("John", new Date(1992, 6, 1));
```

Endi `age` xususiyatidan foydalanadigan eski kod bilan nima qilish kerak?

Biz bunday joylarning barchasini topishga va ularni tuzatishga harakat qilishimiz mumkin, ammo bu ko'p vaqt talab etadi. Agar bu kod boshqa odamlar tomonidan ishlatilsa, buni bajarish qiyinlashishi mumkin. Bundan tashqari, `age` `user` da bo'lishi yaxshi narsa, to'g'rimi?

Keling, buni shunday qoldiramiz.

`age` uchun getterni qo'shish muammoni hal qiladi:

```js run no-beautify
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;

*!*
  // yosh joriy sana va tug'ilgan kundan boshlab hisoblanadi
  Object.defineProperty(this, "age", {
    get() {
      let todayYear = new Date().getFullYear();
      return todayYear - this.birthday.getFullYear();
    }
  });
*/!*
}

let john = new User("John", new Date(1992, 6, 1));

alert( john.birthday ); // tug'ilgan kun mavjud
alert( john.age );      // ...shuningdek yosh ham
```

Endi eski kod ham ishlaydi va bizda yaxshi qo'shimcha xususiyat mavjud.
