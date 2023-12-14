# Prototypal inheritance

Dasturlash davomida biz ko'pincha biror narsani olishni va uni kengaytirishni xohlaymiz.

 Masalan, bizda o'z xususiyati va usullariga ega bo'lgan `user` obyekti bor, `admin` hamda `guest`obyektlarini esa uning biroz o'zgartirish kiritilgan variantlari sifatida qoldiramiz. Biz metodlarni nusxalash yoki qayta bajarish orqali emas, balki yuqori qismida yangi obyektni yaratish orqali `user`da mavjud bo'lgan narsalardan qaytadan foydalanmoqchimiz. 

 *Prototypal inheritance* bu borada yordam beruvchi til xususiyatidir.

## [[Prototype]]

 JavaScriptda obyektlar huddi spesifikatsiyada ko'rsatilgandek `[[Prototype]]`nomli maxsus yashirin xususiyatga ega. Bu xossa odatda `null`deyiladi yoki boshqa obyektga ishora qiladi. Bu obyekt " prototype" deb ataladi:

![prototype](object-prototype-empty.svg)

 Biz `object`dan mavjud bo'lmagan ma'lumotni o'qimoqchi bo'lganimizda JavaScript avtomatik ravishda uni prototipdan olib, bizga taqdim etadi. Dasturlashda bu usul "prototypal inheritance", ya'ni prototip merosi, deb ataladi. Va biz tez orada bunday merosning ko'p turlarini hamda unga asoslangan ajoyib til xususiyatlarini o'rganamiz.

`[[Prototype]]` xossasi ichki va yashirin bo'lib, uni o'rnatishning ko'plab usullari mavjud.

Bulardan biri `__proto__`maxsus nomini ishlatishdir, masalan: 

```js run
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

*!*
rabbit.__proto__ = animal; // sets rabbit.[[Prototype]] = animal
*/!*
```

Endi biz `rabbit`ma'lumotini o'qimoqchi bo'lganimizda u mavjud bo'lmasa, JavaScript ushbu xususiyatni avtomatik tarzda `animal` dan oladi. 

Masalan:

```js
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

*!*
rabbit.__proto__ = animal; // (*)
*/!*

// Endi ikkala xususiyatni ham rabbit dan topishimiz mumkin:
*!*
alert( rabbit.eats ); // true (**)
*/!*
alert( rabbit.jumps ); // true
```

Yuqorida ko'rsatilgan `(*)` belgisi `animal``rabbit` ning prototipi bo'lishini belgilaydi.

 Keyin  `alert` esa `rabbit.eats` `(**)` ma'lumotini o'qishga harakat qiladi, ammo u `rabbit` ichida mavjud emas, shuning uchun JavaScript `[[Prototype]]` havolasiga amal qiladi va uni `animal`ichidan topadi (pastdan yuqoriga qarang):

![](proto-animal-rabbit.svg)

 Biz bu yerda `animal`ni `rabbit`ning prototipi yoki `rabbit`ni `animal` prototipi bo'yicha nusxalangan deyishimiz mumkin. 

 Shunday qilib `animal`ko'plab xususiyatlar va usullarga ega bo'lsa, ular `rabbit`da ham avtomatik ravishda mavjud bo'ladi. Bunday xususiyatlar "inherited", ya'ni "meros" deb ataladi.

Agar bizda `animal` metodi mavjud bo'lsa, biz uni `rabbit` deb nomlashimiz mumkin: 

```js run
let animal = {
  eats: true,
*!*
  walk() {
    alert("Animal walk");
  }
*/!*
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

 // walk prototipdan olingan
*!*
rabbit.walk(); // Animal walk
*/!*
```

Ushbu metod avtomatik tarzda prototipdan olinadi, misol uchun:

![](proto-animal-rabbit-walk.svg)

Prototip zanjiri uzunroq bo'lishi ham mumkin:

```js run
let animal = {
  eats: true,
  walk() {
    alert("Animal walk");
  }
};

let rabbit = {
  jumps: true,
*!*
  __proto__: animal
*/!*
};

let longEar = {
  earLength: 10,
*!*
  __proto__: rabbit
*/!*
};

// walk prototip zanjiridan olingan
longEar.walk(); // Animal walk
alert(longEar.jumps); // true (from rabbit)
```

![](proto-animal-rabbit-chain.svg)

Endi biz `longEar`dan nimadir o'qimoqchi bo'lsak, ammo biz qidirgan ma'lumot mavjud bo'lmasa, JavaScript uni avval `rabbit` dan, keyin esa `longEar`dan izlab ko'radi.

Bu yerda atigi ikkita cheklov mavjud:

1. Havolalar aylana bo'ylab bora olmaydi. Agar biz aylanada `__proto__` ni belgilashga harakat qilsak, JavaScript bu harakatning xato ekanligini ko'rsatadi.
2. `__proto__`ning qiymati obyekt yoki `null` bo'lishi mumkin. Boshqa turlar hisobga olinmaydi. 

Also it may be obvious, but still: there can be only one `[[Prototype]]`. An object may not inherit from two others. Hamma narsa aniq bo'lsada, faqat bittagina `[[Prototype]]` ga ega bo'lishimiz mumkin. Birorta obyekt boshqa ikkita obyektning nusxasi bo'la olmaydi.

```smart header="`__proto__, ya'ni aqlli sarlavha protosi `[[Prototype]]`"  ``` uchun tarixiy qabul qiluvchi va sozlovchi hisoblanadi.
Ikkala funksiyaning o'rtasidagi farqni bilmaslik bu sohaga endi kirib kelgan yangi dasturchilarning odatiy xatosidir. 
 
Yodda tutingki, `__proto__` `[[Prototype]]`deb nomlanuvchi ichki xususiyat bilan *umuman o'xshash emas*, balki `[[Prototype]]` ning qabul qiluvchi yoki sozlovchisidir. Bu holatni keyinchalik muhim bo'lgan vaziyatlarda ko'rib chiqamiz, hozir esa JavaScript dasturlash tili haqidagi tushunchalarimizni shakllantirish bilan birga ushbu qoidani ham yoddan chiqarmaylik. 

`__proto__` xususiyati biroz eskirgan, hozirda u ayrim tarixiy sabablar uchun mavjud. Zamonaviy JavaScript dasturlash tili olish yoki sozlash prototipi o'rniga `Object.getPrototypeOf/Object.setPrototypeOf`funksiyalaridan foydalanishni taklif qiladi. Ushbu funksiyalarni ham keyinroq ko'rib chiqamiz.  

Tafsilotlarga qaraganda `__proto__` faqat brauzerlar tomonidan qo'llab-quvvatlanishi kerak. Aslida barcha muhitlar, shuningdek, serverlar ham `__proto__` ni qo'llab-quvvatlaydi, shuning uchun biz undan xavfsiz foydalana olishimiz mumkin. 

`__proto__` belgisi intuitiv tarzda aniqroq bo'lgani uchun, undan misollarda foydalanamiz.  
```

## Yozish prototipdan foydalanmaydi. 

Prototiplar faqatgina xususiyatlarni o'qish uchun foydalaniladi. 

Yozish va o'chirish operatsiyalari obyekt bilan bevosita ish olib boradi. 

Quyidagi milsolda `rabbit` ga o'zining `walk` usulini tayinlaymiz": 

```js run
let animal = {
  eats: true,
  walk() {
    /* ushbu usul rabbit tomonidan ishlatilmaydi*/  
  }
};

let rabbit = {
  __proto__: animal
};

*!*
rabbit.walk = function() {
  alert("Rabbit! Bounce-bounce!");
};
*/!*

rabbit.walk(); // Rabbit! Bounce-bounce!
```

Bundan buyon `rabbit.walk()`chaqiruvi obyektda usulni darhol topadi va uni prototipdan foydalanmasdan bajaradi:

![](proto-animal-rabbit-walk-2.svg)

Qo'shimcha qismlar bundan mustasno, chunki belgilash sozlash funksiyasi tomonidan amalga oshiriladi. Shunday qilib, bunday xususiyatlarni yozish aslida funksiyalarni chaqirish bilan bir xil. 

Shu sababga ko'ra `admin.fullName` quyidagi kodda xatosiz ishlaydi:

```js run
let user = {
  name: "John",
  surname: "Smith",

  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  },

  get fullName() {
    return `${this.name} ${this.surname}`;
  }
};

let admin = {
  __proto__: user,
  isAdmin: true
};

alert(admin.fullName); // John Smith (*)

// setter triggers!
admin.fullName = "Alice Cooper"; // (**)

alert(admin.fullName); // Alice Cooper, boshqaruv holati o'zgartirildi
alert(user.fullName); // John Smith, foydalanuvchi holati himoyalandi
```

`(*)` qatorida `admin.fullName` xususiyati `user`prototipiga ega bo'lganligi uchun bu shunday nomlanadi. Va `(**)` qatoridagi xususiyat setter, ya'ni o'rnatuvchiga ega va bu ham shunday ataladi. 

## "This" ning qiymati

An interesting question may arise in the example above: what's the value of `this` inside `set fullName(value)`? Where are the properties `this.name` and `this.surname` written: into `user` or `admin`? Quyidagi misolda qiziq savol paydo bo'lishi mumkin: `this` ning `set fullName(value)`tarkibidagi qiymati qanday? `this.name` va `this.surname`xususiyatlari qayerga yozilgan: `user` yoki `admin` gami?  

Javob esa oddiy: `this`xususiyati prototiplarga umuman ta'sir o'tkazmaydi. 

**Metod obyektda yoki uning prototipida bo'lishidan qat'iy nazar, `this` xususiyati chaqiruvda har doim nuqtadan oldingi belgi hisoblanadi.**

Demak, `admin.fullName=` sozlovchi chaqiruvi `user` ni emas, `admin` ni `this` sifatida ishlatadi. 
Bu aslida juda muhim holat, chunki bizda juda ko'p metodlarga ega bo'lgan katta obyekt va ulardan meros bo'lib qolgan xususiyatlar bo'lishi mumkin. Va meros qilib olingan obyektlar meros usullarini ishga tushirganda, ular katta obyektning holatini emas, balki faqat o'zlarining holatlarini o'zgartiradilar.

Masalan, `animal` "salqash usuli ni ifodalaydi va `rabbit` undan foydalanadi. 

`rabbit.sleep()` chaqiruvi `this.isSleeping` ni `rabbit` obyektida o'rnatadi:

```js run
// animal bir qancha metodlarga ega
let animal = {
  walk() {
    if (!this.isSleeping) {
      alert(`I walk`);
    }
  },
  sleep() {
    this.isSleeping = true;
  }
};

let rabbit = {
  name: "White Rabbit",
  __proto__: animal
};

// rabbit.isSleeping o'zgaradi
rabbit.sleep();

alert(rabbit.isSleeping); // to'g'ri
alert(animal.isSleeping); // (prototipda hech qanday xususiyat aniqlanmadi)
```

Natijaviy surat:

![](proto-animal-rabbit-walk-3.svg)

Agar bizda `animal` dan meros bo'lgan `bird`, `snake` kabi boshqa hayvonlar bo'lsa, ular ham `animal` dagi metodlardan foydalanish imkoniyatiga ega bo'lar edi. Lekin har bir usul chaqiruvidagi `this` xususiyati `animal` emas, chaqiruv vaqtida nuqtadan oldin baholanadigan mos obyekt bo'ladi. Shunday qilib biz `this` ga ma'lumot yozganimizda, u ushbu obyektlarda saqlanadi. 

As a result, methods are shared, but the object state is not.Natijada obyekt holati emas, metodlar ulashiladi.  

## for..in sikli

`for..in` sikli meros qilib olingan xususiyatlarni ham ifodalaydi.

Masalan:

```js run
let animal = {
  eats: true
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

*!*
// Object belgilari faqatgina o'z belgilarinigina qaytaradi
alert(Object.keys(rabbit)); // sakraydi
*/!*

*!*
// for..in sikli o'z va meros belgilarni ham qaytaradi
for(let prop in rabbit) alert(prop); // sakraydi, keyin yeydi
*/!*
```

Agar bu biz xohlagan natijani bermasa va biz meros qilib olingan xususiyatlarni istisno qilmoqchi bo'lsak, [obj.hasOwnProperty(key)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) kabi metoddan foydalanamiz: agar `obj` o'zining meroslanmagan xususiyatiga ega bo'lsa, u `true` qiymatini qaytaradi. 
So we can filter out inherited properties (or do something else with them): Shunday qilib biz meroslangan xususiyatlarni filtrlashimiz mumkin (yoki ulardan boshqa maqsadlarda foydalanishimiz mumkin ):

```js run
let animal = {
  yeydi: true
};

let rabbit = {
  sakraydi: true,
  __proto__: animal
};

for(let prop in rabbit) {
  let isOwn = rabbit.hasOwnProperty(prop);

  if (isOwn) {
    alert(`Our: ${prop}`); // Shaxsiy: sakraydi
  } else {
    alert(`Inherited: ${prop}`); // Meroslangan: yeydi
  }
}
```

Bu yerda bizda quyidagi meros zanjiri mavjud: `rabbit` `animal` dan, 'that' esa `Object.prototype` dan meros oladi, chunki `animal` haqiqiy obyekt `{...}, demak u hech qanday majburiyatni bajarmaydi, va uning yuqorisida `null` mavjud:

![](rabbit-animal-object.svg)

 E'tibor bergan bo'lsangiz, bir kulguli holat yuz bermoqda. `rabbit.hasOwnProperty` metodi qayerdan paydo bo'ldi? Biz hali buni aniqlamadik. Zanjirga qarab shunga guvoh bo'lishimiz mumkinki, metod `Object.prototype.hasOwnProperty` tomonidan ta'minlangan. Boshqacha so'z bilan aytganda, u meros qilib olingan. 

...Agar `for..in` meroslangan xususiyatlar ro'yxatida mavjud bo'lsa, nega `hasOwnProperty` xususiyati `eats`, yeydi va `jumps`, sakraydi kabi `for..in` siklida ko'rinmaydi?

Javobi oddiy: uni sanab bo'lmaydi. `Object.prototype` ning huddi boshqa xususiyatlari kabi u ham `enumerable:false` bayrog'iga ega. Va `for..in` faqat sanash mumkin bo'lgan xususiyatlarni hisobga oladi. Shu sababli `Object.prototype` ning boshqa xususiyatlari ro'yxatga kiritilmagan. 

```smart header="deyarli barcha boshqa qiymat olish usullari meros bo'lib qolgan xususiyatlarni e'tiborsiz qoldiradi". 
Deyarli barcha boshqa qiymat olish usullari, jumladan `Object.keys`, `Object.values`va boshqalar meros qilib olingan xususiyatlarni e'tiborsiz qoldiradi. 

Ular faqat obyektning o'zida ishlaydi. Prototipning xususiyatlari hisobga *olinmaydi*. 
```

## Xulosa

- JavaScript dasturlash tilida hamma obyektlar boshqa obyekt yoki `null` hisoblangan `[[Prototype]]` yashirin xususiyatiga ega.  
- Unga kirish uchun `obj.__proto__` dan foydalanishimiz mumkin (tarixiy qabul qiluvchi, sozlovchi va boshqa usullar tez orada muhokama qilinadi). 
- `[[Prototype]]` tomonidan havola qilingan obyekt "prototip" deb ataladi. 
- Agar biz `obj` xususiyatini o'qimoqchi yoki metod chaqiruvini amalga oshirmoqchi bo'lganimizda, bunday xususiyat mavjud bo'lmasa, JavaScript uni prototipdan topishga harakat qiladi. 
- Yozish va o'chirish operatsiyalari obyektga to'g'ridan-to'g'ri ta'sir o'tkazadi. agar u sozlovchi emas, ma'lumotlar xususiyati bo'lsa, prototipdan foydalanilmaydi.
- Agar `obj.method()` chaqiruvini amalga oshirsak va `method`prototipdan olingan bo'lsa, `this` hali ham `obj`ga ishora qiladi. Shunday qilib, usullar meros qilib olingan bo'lsa ham, har doim joriy ob'ekt bilan ishlaydi.
- `for..in` sikli o'zining ham, meroslangan obyektlar atrofida ham takrorlanadi. Boshqa barcha qiymat olish usullari faqat obyektning o'zida ishlaydi. 
