# F.prototype

Yodda tuting, yangi obyektlar `new F()`kabi konstruktor funksiyasi yordamida yaratilishi mumkin. 

Agar `F.prototype` obyekt bo'lsa, bunday holda `new`operator undan `[[Prototype]]` ni yangi obyektga o'rnatish uchun foydalanadi.   

```smart
JavaScript avval ham prototip merosiga ega bo'lgan. Bu dasturlash tilining asosiy xususiyatlaridan biri hisoblanadi.  

Avval unga to'g'ridan-to'g'ri kirish imkoni yo'q edi. Ishonchli ishlagan yagona narsa ushbu bobda tasvirlangan `"prototype"` xususiyati edi. Shunday qilib hali ham undan foydalanadigan ko'plab skriptlar mavjud. 
```

Esingizda bo'lsin,  `F.prototype`  bu yerda `F` da `"prototype"` nomli oddiy xususiyatni bildiradi. Bu "prototip" atamasiga o'xshash nomdek eshitiladi, lekin biz bu yerda haqiqatan ham shunday nomga ega oddiy mulkni nazarda tutyapmiz. 

Quyidagi misolni ko'rib chiqamiz:

```js run
let animal = {
  eats: true
};

function Rabbit(name) {
  this.name = name;
}

*!*
rabbit.prototype = animal;
*/!*

let rabbit = new Rabbit("White rabbit"); //  rabbit.__proto__ == animal

alert( rabbit.eats ); // true
```

`Rabbit.prototype = animal` sozlamasi tom ma'noda quyidagi ma'noni bildiradi: "`new Rabbit` obyekti yaratilganda, uning `[[Prototype]]`ini `animal`da belgilang". 

Mana natijaviy surat:

![](proto-constructor-animal-rabbit.svg)

Rasmda `"prototype"`gorizontal o'q bo'lib, oddiy xususiyatlarni ifodalaydi, va `[[Prototype]]`vertikal bo'lib, `rabbit` ning `animal` dan meros bo'lishini belgilaydi.

```smart header="F.prototype` faqat `new F` vaqtida ishlatilgan" `F.prototype` xususiyati faqat `new F` chaqiruvi amalga oshirilganda foydalaniladi, u yangi obyektga `[[Prototype]]`ni tayinlaydi.

``` Agar yaratilgandan so'ng `F.prototype` xususiyati o'zgarsa (`F.prototype = <another object>`), u holda `new F` tomonidan yaratilgan yangi obyektlar `[[Prototype]]`` kabi boshqa obyektga ega bo'ladi, lekin allaqachon mavjud obyektlar eskisini saqlab qoladi.
```

## Standart F.prototipi, konstruktor xususiyati

Biz taqdim qilmasak ham har bir funksiya `"prototip"` xususiyatiga ega. 

Standart `"prototip"` funksiyaning o'ziga ishora qiluvchi yagona `constructor` xususiyatiga ega obyektdir.

Masalan:

```js
function Rabbit() {}

/* defaultt prototype
Rabbit.prototype = { constructor: Rabbit };
*/
```

![](function-prototype-constructor.svg)

Biz buni amalda tekshirib ko'rishimiz mumkin:

```js run
function Rabbit() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

alert( Rabbit.prototype.constructor == Rabbit ); // true
```
Tabiiyki, agar biz hech narsa qilmasak, `constructor` xususiyati `[[Prototype]]` orqali barcha rabbit uchun mavjud bo'ladi:

```js run
function Rabbit() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

let rabbit = New Rabbit(); // {constructor: Rabbit} dan meros bo'ladi

alert(rabbit.constructor == Rabbit); // true (prototipdan)
```

![](rabbit-prototype-constructor.svg)

Biz `constructor` xususiyatidan foydalanib, mavjud obyekt bilan bir xil konstruktor yordamida yangi obyekt yaratishimiz mumkin.

Masalan bunday:

```js run
function Rabbit(name) {
  this.name = name;
  alert(name);
}

let rabbit = new Rabbit("White Rabbit");

*!*
let rabbit2 = new rabbit.constructor("Black Rabbit");
*/!*
```

Bizdagi obyekt uchun qaysi konstruktor ishlatilganligini bilmagan vaqtimizda (masalan, u uchinchi tomon kutubxonasidan olingandir) va biz xuddi shunday boshqasini yaratishimiz kerak bo'lganda, ushbu usul qulay yo'l hisoblanadi.

Lekin ehtimol `"constructor"` haqidagi eng muhim narsa bu...

**...JavaScript ning bitta o'zi to'g'ri `"constructor"` qiymatini belgilay olmaydi.**

Ha, u funksiyalar uchun `"prototype"` da mavjud, ammo bor-yo'g'i shu. Keyinchalik nima sodir bo'lishi to'liq o'zimizga bog'liq. 

Xususan, agar biz standart prototipni bir butun sifatida almashtirsak, unda `"constructor"` bo'lmaydi.

Misol uchun:

```js run
function Rabbit() {}
Rabbit.prototype = {
  jumps: true
};

let rabbit = new Rabbit();
*!*
alert(rabbit.constructor === Rabbit); // false
*/!*
```

Shunday qilib, to'g'ri `"constructor"` ni saqlab qolish uchun biz uni butunlay qayta yozish o'rniga standart `"prototype"` ga xususiyatlarni qo'shish/o'chirishni tanlashimiz mumkin:

```js
function Rabbit() {}

//Rabbit.prototype to'liq qayta yozilmaydi
// shunchaki unga qo'shing
Rabbit.prototype.jumps = true
// standart Rabbit.prototype.constructor saqlandi
```

Yoki, muqobil ravishda, `constructor` xususiyatini qo'lda qayta yaratish mumkin:

```js
Rabbit.prototype = {
  jumps: true,
*!*
  constructor: Rabbit
*/!*
};

// endi konstruktor to'g'ri holatda, chunki uni obyektga qo'shdik
```


## Xulosa

Ushbu bobda biz konstruktor funksiyasi orqali yaratilgan obyektlar uchun `[[Prototype]]`ni o'rnatish usulini qisqacha tasvirlab berdik. Keyinchalik yanada rivojlangan dasturlash modellarini ko'rib chiqamiz.

 Hammasi juda oddiy, tushunarli bo'lishi uchun bir nechta eslatmalar mavjud:

- `F.prototype` xususiyatini (`[[Prototype]]`bilan adashtirmang. `new F()` chaqiruvi amalga oshirilganda, yangi obyektlarning `[[Prototype]]` ini o'rnatadi. 
- `F.prototype` yoki obyekt yoki `null` bo'lishi lozim: boshqa qiymatlar ishlamaydi.
- `"prototype"` xususiyati faqat konstruktor funksiyasiga o'rnatilganda va `new` orqali chaqirilganda shunday maxsus natija beradi.

Oddiy obyektlarda `prototype` maxsus ma'noga ega emas:
```js
let user = {
  name: "John",
  prototype: "Bla-bla" // hech qanaqa sehr-jodu emas
};
```
Barcha funksiyalar `F.prototype = { constructor: F }` ga ega, shuning uchun obekt konstruktorini uning `"constructor"` xususiyatiga kirish orqali olishimiz mumkin.
