# Prototipli meros

Dasturlashda biz ko'pincha biror narsa olib, uni kengaytirishni xohlaymiz.

Masalan, bizda uning xossalari va usullariga ega bo'lgan `user` obyekti bor va `admin` va `guest` ni uning biroz o'zgartirilgan variantlari qilishni xohlaymiz. Biz `user` da mavjud bo'lgan narsalarni qayta ishlatmoqchimiz, uning usullarini nusxalab yoki qayta amalga oshirmaymiz, shunchaki uning ustiga yangi obyekt quramiz.

*Prototip merosi* bunda yordam beruvchi til xususiyatidir.

## [[Prototip]] (prototype)

JavaScriptdagi obyektlarda maxsus yashirin xususiyatga ega `[[Prototype]]` (spesifikatsiyada nom berilgan), ya'ni `null` yoki boshqa obyektga murojaat qiladi. Ushbu obyekt "prototip" deb ataladi:

![prototype](object-prototype-empty.svg)

Biz `object` dan xususiyatni o'qiganimizda va u yo'q bo'lsa, JavaScript uni avtomatik ravishda prototipdan oladi. Dasturlashda bu "prototip merosi" deb ataladi. Va tez orada biz bunday merosning ko'plab misollarini, shuningdek, unga asoslangan tilning ajoyib xususiyatlarini o'rganamiz.

`[[Prototype]]` xossasi ichki va yashirin, lekin uni o'rnatishning ko'plab usullari mavjud.

Ulardan biri `__proto__` maxsus nomini ishlatishdir, masalan:

```js run
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

*!*
rabbit.__proto__ = animal; // rabbit.[[Prototype]] = animal ni o'rnatadi
*/!*
```

Endi `rabbit` dan xususiyatni o'qisak va u yo'q bo'lsa, JavaScript uni avtomatik ravishda `animal` dan oladi.

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

// biz rabbit da ikkala xususiyatni ham topishimiz mumkin:
*!*
alert( rabbit.eats ); // true (**)
*/!*
alert( rabbit.jumps ); // true
```

Bu yerda `(*)` qatori `animal` `rabbit` ning prototipi bo`lishini belgilaydi.

Keyin, `alert` `rabbit.eats` `(**)` xususiyatini o'qishga harakat qilganda, u `rabbit` ichida bo'lmaydi, shuning uchun JavaScript `[[Prototype]]` havolasiga amal qiladi va uni `animal` ichidan topadi (pastdan yuqoriga qarang):

![](proto-animal-rabbit.svg)

Bu yerda biz aytishimiz mumkinki, `animal` `rabbit` ning prototipi yoki `rabbit` prototipga xos tarzda `animal` meros bo'lib qoladi.

 Shunday qilib, agar `animal` juda ko'p foydali xususiyatlar va usullarga ega bo'lsa, ular `rabbit` da avtomatik ravishda mavjud bo'ladi. Bunday xususiyatlar "inherited", ya'ni me'ros qilib olingan deb ataladi.

Agar `animal` da usul mavjud bo'lsa, u `rabbit` da chaqirilishi mumkin:

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

// walk prototype dan olingan
*!*
rabbit.walk(); // Animal walk
*/!*
```

Usul avtomatik ravishda prototipdan olinadi, masalan:

![](proto-animal-rabbit-walk.svg)

Prototip zanjiri uzunroq bo'lishi mumkin:

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
alert(longEar.jumps); // true (rabbit dan olingan)
```

![](proto-animal-rabbit-chain.svg)

Endi `longEar` dan biror narsani o'qisak va u yo'q bo'lsa, JavaScript uni `rabbit`, keyin esa `animal`dan qidiradi.

Faqat ikkita cheklov mavjud:

1. Ma'lumotnomalar aylana bo'ylab bora olmaydi. Agar biz aylanada `__proto__` belgilashga harakat qilsak, JavaScript xato qiladi.
2. `__proto__` qiymati obyekt yoki `null` bo`lishi mumkin. Boshqa turlar e'tiborga olinmaydi.

Bundan tashqari, hamma narsa aniqdir, ammo baribir: faqat bitta `[[Prototype]]' bo'lishi mumkin. Obyekt boshqa ikkita obyektdan meros bo'lmaydi.

```smart header="`__proto__` `[[Prototype]]` uchun tarixiy getter/setter` hisoblanadi"
Ko'plab dasturchilarning keng tarqalgan xatosi bu ikkalasi o'rtasidagi farqni bilmaslikdir.

Esda tutingki, `__proto__` ichki `[[Prototype]]` xususiyati bilan *bir xil emas*. Bu `[[Prototype]]` uchun getter/setter. Keyinchalik biz bu muhim vaziyatlarni ko'rib chiqamiz, hozircha JavaScript tili haqidagi tushunchamizni shakllantirishda buni yodda tutaylik.

`__proto__` xususiyati biroz eskirgan. Bu tarixiy sabablarga ko'ra mavjud, zamonaviy JavaScript prototipni olish/o'rnatish o'rniga `Object.getPrototypeOf/Object.setPrototypeOf` funksiyalaridan foydalanishni taklif qiladi. Bu funksiyalarni keyinroq ham ko'rib chiqamiz.

Spetsifikatsiyaga ko'ra, `__proto__` faqat brauzerlar tomonidan qo'llab-quvvatlanishi kerak. Aslida, barcha muhitlar, shu jumladan server tomoni `__proto__` ni qo'llab-quvvatlaydi, shuning uchun biz undan xavfsiz foydalanishimiz mumkin.

`__proto__` belgisi biroz intuitivroq bo'lgani uchun biz uni misollarda ishlatamiz.
```

## Yozishda prototipdan foydalanilmaydi

Prototip faqat xususiyatlarni o'qish uchun ishlatiladi.

Yozish/o'chirish operatsiyalari bevosita obyekt bilan ishlaydi.

Quyidagi misolda biz `rabbit`ga o'zining `walk` usulini tayinlaymiz:

```js run
let animal = {
  eats: true,
  walk() {
    /* ushbu usul rabbit toomonidan ishlatilmaydi */  
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
Bundan buyon `rabbit.walk()` chaqiruvi obyektda usulni darhol topadi va uni prototipdan foydalanmasdan bajaradi:

![](proto-animal-rabbit-walk-2.svg)

Aksessuar xossalari bundan mustasno, chunki belgilash setter funksiyasi tomonidan boshqariladi. Shunday qilib, bunday xususiyatga yozish aslida funksiyani chaqirish bilan bir xil.

Shuning uchun `admin.fullName` quyidagi kodda to'g'ri ishlaydi:

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

alert(admin.fullName); // Alice Cooper, o'zgartirilgan boshqaruv holati 
alert(user.fullName); // John Smith, himoyalangan foydalanuvchi holati
```
Bu yerda `(*)` qatorida `admin.fullName` xossasi `user` prototipida qabul qiluvchiga ega, shuning uchun u chaqiriladi. Va `(**)` qatorida xususiyat prototipda o'rnatuvchiga ega, shuning uchun u ham chaqiriladi.

## "this" ning qiymati

Yuqoridagi misolda qiziqarli savol tug'ilishi mumkin: `set fullName(value)` ichidagi `this` qiymati nima? `this.name` va `this.surname` xususiyatlari qayerda yozilgan: `user` yoki `admin` ichigami?

Javob oddiy: `this` prototiplarga umuman ta'sir qilmaydi.

**Usul qayerda bo'lishidan qat'iy nazar: obyektda yoki uning prototipida, usul chaqiruvida `this` har doim nuqtadan oldingi obyekt bo'ladi.**

Shunday qilib, `admin.fullName=` setter chaqiruvi `user` ni emas, `admin` ni `this` sifatida ishlatadi.

Bu aslida juda muhim narsa, chunki bizda juda ko'p usullarga ega bo'lgan katta obyekt bo'lishi mumkin va undan meros bo'lib qolgan obyektlar bo'lishi mumkin. Va meros qilib olingan obyektlar meros usullarini ishga tushirganda, ular katta obyektning holatini emas, balki faqat o'zlarining holatlarini o'zgartiradilar.

Misol uchun, bu yerda `animal` "usul saqlash" ni anglatadi va `rabbit` undan foydalanadi.

`rabbit.sleep()` chaqiruvi `rabbit` obyektida `this.isSleeping` ni o'rnatadi:

```js run
// animal usullarga ega
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

alert(rabbit.isSleeping); // true
alert(animal.isSleeping); // aniqlanmagan (prototype da bunday xususiyat yo'q)
```

Natijaviy surat:

![](proto-animal-rabbit-walk-3.svg)

Agar bizda `bird`, `snake` va boshqalar `animal` dan meros bo'lgan boshqa obyektlar bo'lsa, ular ham `animal` usullaridan foydalanish imkoniyatiga ega bo'lar edi. Lekin har bir usul chaqiruvidagi `this` `animal` emas, chaqiruv vaqtida (nuqtadan oldin) baholanadigan mos obyekt bo'ladi. Shunday qilib, biz `this` ga ma'lumot yozganimizda, u ushbu obyektlarda saqlanadi.

Natijada obyekt holati emas, usullar baham ko'riladi.

## for..in sikli (loop)

`for..in` sikli meros qilib olingan xususiyatlarni ham takrorlaydi.

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
// Object.keys only returns own keys
alert(Object.keys(rabbit)); // jumps
*/!*

*!*
// for..in loops over both own and inherited keys
for(let prop in rabbit) alert(prop); // jumps, then eats
*/!*
```
Agar buni biz xohlamasak va biz meros qilib olingan xususiyatlarni istisno qilmoqchi bo'lsak, o'rnatilgan usul mavjud [obj.hasOwnProperty(key)](https://developer.mozilla.org/en-US/docs/Web/ JavaScript/Reference/Global_Objects/Object/hasOwnProperty): agar `obj` `key` nomli o'zining (meroslanmagan) xususiyatiga ega bo'lsa, u `true` qiymatini qaytaradi.

Shunday qilib, biz meros qilib olingan xususiyatlarni filtrlashimiz (yoki ular bilan boshqa biror narsa qilishimiz mumkin):

```js run
let animal = {
  eats: true
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

for(let prop in rabbit) {
  let isOwn = rabbit.hasOwnProperty(prop);

  if (isOwn) {
    alert(`Our: ${prop}`); // Our: jumps
  } else {
    alert(`Inherited: ${prop}`); // Inherited: eats
  }
}
```
Bu yerda bizda quyidagi meros zanjiri mavjud: `rabbit` `animal`dan, u `Object.prototype`dan meros oladi, chunki `animal` `{...}` tom ma'nodagi obyekt, shuning uchun u default tartibida va uning ustida `null` mavjud:

![](rabbit-animal-object.svg)

E'tibor bering, bitta kulgili narsa bor. `rabbit.hasOwnProperty` usuli qayerdan keladi? Biz buni aniqlamadik. Zanjirni ko'rib chiqsak, usul `Object.prototype.hasOwnProperty` tomonidan taqdim etilganligini ko'rishimiz mumkin. Boshqacha aytganda, u meros bo'lib qolgan.

...Agar `for..in` meros bo'lib qolgan xususiyatlar ro'yxatida bo'lsa, nega `eats` va `jumps` kabi `for..in` siklida `hasOwnProperty` ko'rinmaydi?

Javob oddiy: uni sanab bo'lmaydi. `Object.prototype` ning boshqa barcha xususiyatlari singari, u ham `enumerable:false` bayrog'iga ega. Va `for..in` faqat sanab bo'ladigan xususiyatlarni sanab o'tadi. Shuning uchun u va qolgan `Object.prototype` xususiyatlari ro'yxatga kiritilmagan.

```smart header="Deyarli barcha boshqa kalit/qiymat olish usullari irsiy xususiyatlarni e'tiborsiz qoldiradi"
Deyarli barcha boshqa kalit/qiymat olish usullari, masalan, `Object.keys`, `Object.values` va boshqalar meros qilib olingan xususiyatlarni e'tiborsiz qoldiradi.

Ular faqat obyektning o'zida ishlaydi. Prototipning xususiyatlari hisobga *olinmaydi*.
```

## Xulosa

- JavaScriptda barcha obyektlar yashirin `[[Prototype]]` xususiyatiga ega bo'lib, u boshqa obyekt yoki `null` hisoblanadi.
- Unga kirish uchun `obj.__proto__` dan foydalanishimiz mumkin (tarixiy getter/setter yoki boshqa yo'llar ham bor, bu tez orada muhokama qilinadi).
- `[[Prototip]]` tomonidan havola qilingan obyekt "prototype" deb ataladi.
- Agar biz `obj` xossasini o'qimoqchi yoki usulni chaqirmoqchi bo'lsak va u mavjud bo'lmasa, JavaScript uni prototipda topishga harakat qiladi.
- Yozish/o'chirish operatsiyalari to'g'ridan-to'g'ri obyektga ta'sir qiladi, ular prototipdan foydalanmaydi (agar bu ma'lumotlar xususiyati bo'lsa, sozlagich emas).
- Agar biz `obj.method()` ni chaqirsak va `method` prototipdan olingan bo'lsa, `this` baribir `obj` ga ishora qiladi. Shunday qilib, usullar meros qilib olingan bo'lsa ham, har doim joriy obyekt bilan ishlaydi.
- `for..in` sikli o'zining ham, meros bo'lib qolgan xususiyatlarini ham takrorlaydi. Boshqa barcha kalit/qiymat olish usullari faqat obyektning o'zida ishlaydi.
