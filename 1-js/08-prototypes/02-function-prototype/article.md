# F.prototype

Yodda tuting, yangi obyektlar `new F()`kabi konstruktor funksiyalar yordamida yaratilishi mumkin. 

Agar `F.prototype` obyekt bo'lsa, bunday holda `new`operator undan `[[Prototype]]` ni yangi obyektga o'rnatish uchun foydalanadi.   

```smart
JavaScript boshidayoq prototip merosga ega edi. Bu dasturlash tilining asosiy xususiyatlaridan biri hisoblanadi.  

Avval unga to'g'ridan-to'g'ri kirish imkoni yo'q edi. Ishonchli ishlagan yagona narsa ushbu bobda tasvirlangan `"prototype"` xususiyati edi. Shunday qilib hali ham undan foydalanadigan ko'plab matnlar mavjud. 
```

Esingizda bo'lsin,  `F.prototype`  bu yerda `F` da `"prototype"` nomli oddiy xususiyatni bildiradi. Bu "prototip" atamasiga o'xshash nomdek eshitiladi, lekin biz bu yerda haqiqatan ham shunday nomga ega oddiy mulkni nazarda tutyapmiz. 

Quyidagi misolni ko'rib chiqamiz:

```js run
let hayvon = {
  yeydi: true
};

function Quyon(name) {
  this.name = name;
}

*!*
quyon.prototype = hayvon;
*/!*

let quyon = yangi Quyon("Oq Quyon"); //  quyon.__proto__ == hayvon

alert( quyon.yeydi ); // true
```

`Quyon.prototype = hayvon` sozlamasi tom ma'noda quyidagi ma'noni bildiradi: "`yangi Quyon` obyekti yaratilganda, uning `[[Prototype]]`, ya'ni prototipini `hayvon`da belgilang". 

Mana natijaviy surat:

![](proto-constructor-animal-rabbit.svg)

Rasmda `"prototype"`gorizontal o'q bo'lib, oddiy xususiyatlarni ifodalaydi, and `[[Prototype]]`vertikal bo'lib, `quyon` ning `hayvon` dan meros bo'lishini belgilaydi.

```smart header="`F.prototype` faqat `yangi F` vaqtida ishlatilgan" `F.prototype` xususiyati faqat `yangi F` chaqiruvi amalga oshirilganda foydalaniladi, u yangi obyektga `[[Prototip]]`ni tayinlaydi.

``` Agar yaratilgandan so'ng `F.prototype` xususiyati o'zgarsa (`F.prototype = <boshqa obyekt>`), u holda `yangi F` tomonidan yaratilgan yangi obyektlar `[[Prototype]]' kabi boshqa obyektga ega bo'ladi, lekin allaqachon mavjud obyektlar eskisini saqlab qoladi.
```

## Standart F.prototipi, konstruktor xususiyati

Biz taqdim qilmasak ham har bir funksiya `"prototip"` xususiyatiga ega. 

Standart `"prototip"` funksiyaning o'ziga ishora qiluvchi yagona `konstruktor` xususiyatiga ega obyektdir.

Masalan:

```js
function Quyon() {}

/* standart prototip
Quyon.prototip = { konstruktor: Quyon };
*/
```

![](function-prototype-constructor.svg)

Biz buni amalda tekshirib k'rishimiz mumkin:

```js run
function Quyon() {}
// by default:
// Quyon.prototip = { konstruktor: Quyon }

alert( Quyon.prototip.konstruktor == Quyon ); // true
```
Tabiiyki, agar biz hech narsa qilmasak, `konstruktor` xususiyati `[[Prototip]]` orqali barcha quyonlar uchun mavjud bo'ladi:

```js run
function Quyon() {}
// by default:
// Quyon.prototip = { konstruktor: Quyon }

let quyon = yangi Quyon(); // {konstruktor: Quyon} dan meros bo'ladi

alert(quyon.konstruktor == Quyon); // true (prototipdan)
```

![](rabbit-prototype-constructor.svg)

Biz `konstruktor` xususiyatidan foydalanib, mavjud obyekt bilan bir xil konstruktor yordamida yangi obyekt yaratishimiz mumkin.

Masalan bunday:

```js run
function Quyon(name) {
  this.name = name;
  alert(name);
}

let quyon = yangi Quyon("Oq Quyon");

*!*
let quyon2 = yangi quyon.konstruktor("Qora Quyon");
*/!*
```

Bizdagi obyekt uchun qaysi konstruktor ishlatilganligini bilmagan vaqtimizda (masalan, u uchinchi tomon kutubxonasidan olingan) va biz xuddi shunday boshqasini yaratishimiz kerak bo'lganda, ushbu usul qulay yo'l hisoblanadi.

Lekin ehtimol `"constructor"` haqidagi eng muhim narsa bu...

**...JavaScript ning bitta o'zi to'g'ri `"constructor"` qiymatini belgilay olmaydi.**

Ha, u funksiyalar uchun `"prototype"` da mavjud, ammo bor-yo'g'i shu. Keyinchalik nima sodir bo'lishi to'liq o'zimizga bog'liq. 

Xususan, agar biz standart prototipni bir butun sifatida almashtirsak, unda `"constructor"` bo'lmaydi.

Misol uchun:

```js run
function Quyon() {}
Quyon.prototip = {
  sakraydi: true
};

let quyon = yangi Quyon();
*!*
alert(quyon.konstruktor === Quyon); // false
*/!*
```

Shunday qilib, to'g'ri `"konstruktor"` ni saqlab qolish uchun biz uni butunlay qayta yozish o'rniga standart `"prototip"` ga xususiyatlarni qo'shish/o'chirishni tanlashimiz mumkin:

```js
function Quyon() {}

//Quyon.prototip to'liq qayta yozilmaydi
// shunchaki unga qo'shing
Quyon.prototip.sakraydi = true
// standart Rabbit.prototip.konstruktor saqlandi
```

Yoki, muqobil ravishda, `constructor` xususiyatini qo'lda qayta yaratish mumkin:

```js
Quyon.prototip = {
  sakraydi: true,
*!*
  konstruktor: Quyon
*/!*
};

// endi konstructor to'g'ri holatda, chunki uni obyektga qo'shdik
```


## Xulosa

Ushbu bobda biz konstruktor funksiyasi orqali yaratilgan obyektlar uchun `[[Prototip]]`ni o'rnatish usulini qisqacha tasvirlab berdik. Keyinchalik biz unga tayanadigan yanada rivojlangan dasturlash modellarini ko'ramiz.

 Hammasi juda oddiy, tushunarli bo'lishi uchun bir nechta eslatmalar mavjud:

- `F.prototype` xususiyati (`[[Prototype]]`bilan adashtirmang) `yangi F()` chaqiruvi amalga oshirilganda, yangi obyektlarning `[[Prototype]]` ini o'rnatadi. 
- `F.prototype` yoki obyekt yoki `null` bo'lishi lozim: boshqa qiymatlar ishlamaydi.
- `"prototype"` xususiyati faqat konstruktor funksiyasiga o'rnatilganda va `new` orqali chaqirilganda shunday maxsus natija beradi.

Oddiy obyektlarda `prototype` maxsus ma'noga ega emas:
```js
let user = {
  name: "John",
  prototype: "Bla-bla" // hech qanaqa sehr-jodu emas
};
```
Barcha funksiyalar `F.prototype = { constructor: F }` ga ega, shuning uchun obekt konstruktorini uning `"konstruktor"` xususiyatiga kirish orqali olishimiz mumkin.
