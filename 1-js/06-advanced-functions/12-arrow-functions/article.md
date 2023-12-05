# Arrow funksiyalarini qayta ko'rib chiqish

Keling, arrow funksiyalarini qayta ko'rib chiqaylik.

Arrow funksiyalari shunchaki kichik narsalarni yozish uchun "qisqa belgi" emas. Ular o'ziga xos va judayam foydali xususiyatlarga ega.

JavaScript boshqa joyda bajariladigan kichik funksiyani yozishimiz kerak bo'lgan holatlarga to'la.

Masalan:

- `arr.forEach(func)` -- `func` har bir massiv elementi uchun `forEach` tomonidan bajariladi.
- `setTimeout(func)` -- `func` o'rnatilgan rejalashtiruvchi tomonidan bajariladi.
- ..va yana ko'plab holatlar mavjud.

Funksiyani yaratish va uni biror joyga o'tkazishni JavaScript o'ziga xos tarzda bajaradi.

Va bunday funksiyalarda biz odatda joriy kontekstni tark etishni xohlamaymiz. Bu yerda arrow funksiyalari yordam beradi.

## Arrow funksiyalarida "this" yo'q

<info:object-methods> bobidan eslaganimizdek, arrow funksiyalarida `this` yo'q. Agar `this` ga kirsa, u tashqaridan olinadi.

Misol uchun, biz uni obyekt usuli ichida takrorlash uchun ishlatishimiz mumkin:

```js run
let group = {
  title: "Our Group",
  students: ["John", "Pete", "Alice"],

  showList() {
*!*
    this.students.forEach(
      student => alert(this.title + ': ' + student)
    );
*/!*
  }
};

group.showList();
```

Bu yerda `forEach` da arrow funksiyasidan foydalaniladi, shuning uchun undagi `this.title` tashqi `showList` metodi bilan aynan bir xil, ya'ni: `group.title`.

Agar biz "muntazam" funksiyadan foydalansak, xato bo'ladi:

```js run
let group = {
  title: "Our Group",
  students: ["John", "Pete", "Alice"],

  showList() {
*!*
    this.students.forEach(function(student) {
      // Error: undefined ning 'title' xususiyatini o'qiy olmaydi
      alert(this.title + ': ' + student);
    });
*/!*
  }
};

group.showList();
```

Xatolik yuzaga keladi, chunki `forEach` standard bo'yicha `this=undefined` bilan funksiyalarni ishga tushiradi, shuning uchun `undefined.title` ga kirishga harakat qilinadi.

Bu arrow funksiyalariga ta'sir qilmaydi, chunki ularda "this" yo'q.
````
````
`` `warn header="Arrow funksiyalari `new` bilan ishlamaydi"
`this` ga ega bo'lmaslik tabiiy ravishda boshqa cheklovni anglatadi: arrow funksiyalarini konstruktor sifatida ishlatib bo'lmaydi. Ularni `new` deb atash mumkin emas.
```
```
``smart header="Arrow funktsiyalari VS bind"
`=>` arrow funksiyasi va `.bind(this)` bilan chaqiriladigan oddiy funksiya o'rtasida nozik farq bor:
```
```
- `.bind(this)` funksiyaning "bog'langan versiyasini" yaratadi.
- `=>` strelkasi hech qanday bog'lanishni yaratmaydi. Funksiyada oddiygina `this` yo'q. `This` ni qidirish odatiy o'zgaruvchilarni qidirish bilan bir xil tarzda tashqi leksik muhitda amalga oshiriladi.
````
````
## Arrowlarda "argumentlar" yo'q

Arrow funksiyalarida `arguments` o'zgaruvchisi ham yo'q.

Joriy `this` va `arguments` bilan chaqiruvni yo'naltirishimiz kerak bo'lganda, bu dekoratorlar uchun juda yaxshi usul.

Masalan, `defer(f, ms)` funksiyani oladi va uning atrofida chaqiruvni `ms` millisekundlarga kechiktiradigan o'ramni qaytaradi:

```js run
function defer(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(who) {
  alert('Hello, ' + who);
}

let sayHiDeferred = defer(sayHi, 2000);
sayHiDeferred("John"); // Hello, John 2 soniyadan so'ng
```

Arrow funksiyasisiz xuddi shunday ko'rinadi:

```js
function defer(f, ms) {
  return function(...args) {
    let ctx = this;
    setTimeout(function() {
      return f.apply(ctx, args);
    }, ms);
  };
}
```

Bu yerda biz qo'shimcha `args` va `ctx` o'zgaruvchilarni yaratishimiz kerak edi, shunda `setTimeout` ichidagi funksiya ularni qabul qilishi mumkin edi.

## Xulosa

Arrow funksiyalar:

- `this` yo'q
- `arguments` yo'q
- `new` deb atash mumkin emas
- Ularda ham `super` yo'q, lekin biz buni hali o'rganmadik. Bu haqida <info:class-inheritance> bobida ko'rib chiqamiz

Buning sababi, ular o'zlarining "konteksti" ga ega bo'lmagan, balki joriy kodda ishlaydigan qisqa kod qismlari uchun mo'ljallangan va ular haqiqatan ham bu foydalanish holatida porlaydilar.
