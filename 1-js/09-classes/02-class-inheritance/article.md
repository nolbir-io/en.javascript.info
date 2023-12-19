
# Sinf merosi (Class inheritance)

Sinf merosi - bu bir sinfning boshqa sinfni kengaytirish usuli.

Shunday qilib, biz mavjud funksiyalar ustiga yangi funksiyalarni yaratishimiz mumkin.

## "extends" kalit so'zi

Aytaylik, bizda `Animal`, ya'ni hayvon sinfi bor: 

```js
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
  run(speed) {
    this.speed = speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }
  stop() {
    this.speed = 0;
    alert(`${this.name} stands still.`);
  }
}

let animal = new Animal("My animal");
```

Bu yerda `animal` obyekti va `Animal` sinfini grafik tarzda qanday ko'rsatishimiz mumkinligi berilgan:

![](rabbit-animal-independent-animal.svg)

...Va endi biz boshqa `class Rabbit`, quyon sinfini yaratmoqchimiz

Quyonlar hayvon bo'lganligi sababli, `Rabbit` sinfi `Animal` sinfiga asoslangan bo'lishi va hayvonlar usullaridan foydalanish imkoniyatiga ega bo'lishi kerak, shunda quyonlar "umumiy" hayvonlar qila oladigan narsalarni qila oladi.

Boshqa sinfni kengaytirish sintaksisi: `class Child extends Parent` , ( bolalar sinfi ota-ona sinfini kengaytiradi)

`Animal`, hayvondan meros oladigan `class Rabbit` (quyon sinfi)ni yaratamiz:

```js
*!*
class Rabbit Animal ni kengaytiradi {
*/!*
  hide() {
    alert(`${this.name} hides!`);
  }
}

let rabbit = new Rabbit("White Rabbit");

rabbit.run(5); // White Rabbit 5 tezlikda yuguradi.
rabbit.hide(); // White Rabbit yashirinadi!
```

`Rabbit` sinfi obyekti `rabbit.hide()` kabi `Rabbit` usullariga, hamda `rabbit.run()` kabi `Animal` usullariga kirish huquqiga ega.

Ichkarida, `extends` kalit so'zi yaxshi eski prototip mexanikasi yordamida ishlaydi. U `Rabbit.prototype.[[Prototype]]` ni `Animal.prototype` ga o'rnatadi. Shunday qilib, agar `Rabbit.prototype` da usul topilmasa, JavaScript uni `Animal.prototype` dan oladi.

![](animal-rabbit-extends.svg)

Masalan, `rabbit.run` usulini topish uchun qurilma tekshiradi (rasmda pastdan yuqoriga):
1. `rabbit` obyekti (`run` xususiyati mavjud emas).
2. Uning prototipi, ya'ni `Rabbit.prototype` ( `hide` xususiyatiga ega, ammo `run` xususiyati yo'q).
3. Uning prototipi, ya'ni ( `extends` bilan bog'liq) , `Animal.prototype` nihoyat `run` usuliga ega.

<info:native-prototypes> bo'limidan yodga olishimiz mumkinki, JavaScriptning o'zi o'rnatilgan obyektlar uchun prototip merosidan foydalanadi. Masalan, `Data.prototype.[[Prototip]]` , sana prototipi `Object.prototype` hisoblanadi. Shuning uchun sanalar umumiy obyekt usullariga kirish huquqiga ega.

````smart header=extends` dan keyin har qanday iboraga ruxsat beriladi.
Sinf sintaksisi nafaqat sinfni, balki `extends` (kengaytirish) dan keyin istalgan ifodani belgilash imkonini beradi.

Masalan, asosiy sinfni yaratadigan funksiya chaqiruvi:

```js run
function f(phrase) {
  return class {
    sayHi() { alert(phrase); }
  };
}

*!*
class User extends f("Hello") {}
*/!*

new User().sayHi(); // Hello
```
Bu yerda `class User`, sinf foydalanuvchisi `f("Hello")` ning natijasidan meros oladi.

Bu ko'plab shartlarga qarab sinflarni yaratish va ulardan meros bo'lishi mumkin bo'lgan funksiyalardan foydalanganda ilg'or dasturlash naqshlari uchun foydali bo'lishi mumkin.
````

## Usulni bekor qilish

Endi biroz oldinga harakat qilamiz va usulni bekor qilamiz. Odatda, `class Rabbit` da ko'rsatilmagan barcha usullar to'g'ridan-to'g'ri `class Animal` "as is" ya'ni, "xuddi shunday" olinadi.

Ammo agar biz `Rabbit`, quyonda da `stop()` kabi o'z uslubimizni belgilasak, bunday holda uning o'rniga ishlatiladi:

```js
rabbit class animal class ni kengaytiradi {
  stop() {
    // ...endi bu rabbit.stop() uchun ishlatiladi
    // Animal sinfidagi stop() o'rniga
  }
}
```

Odatda, biz ota-ona usulini to'liq almashtirishni emas, balki uning funksiyasini sozlash yoki kengaytirish uchun uning ustiga qurishni xohlaymiz. Biz usulimizda biror narsa qilamiz, lekin undan oldin/keyin yoki jarayonda ota-ona usulini chaqiramiz.

Sinflar buning uchun `"super"` kalitso'zini ta'minlaydi.

- `super.method(...)` ota-ona usulini chaqiradi. 
- `super(...)` ota-ona konstruktorini chaqiradi (faqat o'zimizning konstruktorimizning ichida) 

Misol uchun, bizning quyon to'xtatilganda avtomatik ravishda yashirilsin:

```js run
class Animal {

  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  run(speed) {
    this.speed = speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }

  stop() {
    this.speed = 0;
    alert(`${this.name} stands still.`);
  }

}

class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }

*!*
  stop() {
    super.stop(); // parent stopni chaqiradi
    this.hide(); // va keyin yashirinadi
  }
*/!*
}

let rabbit = new Rabbit("White Rabbit");

rabbit.run(5); // White Rabbit 5 tezlikda yuguradi.
rabbit.stop(); // White Rabbit haliyam joyida turadi. White Rabbit yashirinadi!
```

Endi jarayon davomida `Rabbit` da  ota-onani `super.stop()`orqali chaqiradigan `stop` usuli mavjud.

````smart header="Strelka funksiyalarida `super` yo'q
 <info:arrow-functions> bobida ta'kidlanganidek, strelka funksiyalarida `super` mavjud emas.

Agar kirish bo'lsa, u tashqi funksiyadan olingan. Masalan:

```js
class Rabbit extends Animal {
  stop() {
    setTimeout(() => super.stop(), 1000); // 1 sekunddan keyin parent stop ni chaqiradi
  }
}
```

Strelka funksiyasidagi `super` `stop()` funksiyasi bilan deyarli bir xil, shuning uchun u mo'ljallangandek ishlaydi. Agar biz bu yerda "regular" funksiyani belgilasak, xato bo'ladi:

```js
// kutilmagan super
setTimeout(function() { super.stop() }, 1000);
```
````

## Konstruktorni bekor qilish

Konstruktorlar bilan ish biroz shubhali kechishi mumkin.

Hozirgacha `Rabbit` o'zining shaxsiy `constructor` iga ega emasdi.

[specification](https://tc39.github.io/ecma262/#sec-runtime-semantics-classdefinitionevaluation) ga ko'ra, agar sinf boshqa sinfni kengaytirsa va `constructor` bo'lmasa, quyidagi "bo'sh" 'konstruktor' hosil bo'ladi:

```js
class Rabbit extends Animal {
  //sinflarni o'z konstruktorlarisiz kengaytirish uchun yaratilgan
*!*
  constructor(...args) {
    super(...args);
  }
*/!*
}
```

 Ko'rib turganimizdek, u asosan barcha argumentlarni o'tkazib, ota-ona `constructor` ni chaqiradi. Agar biz o'zimizning konstruktorimizni yozmasak, bu holat sodir bo'ladi.

Endi `Rabbit` ga maxsus konstruktor qo'shamiz. U `name` ga qo'shimcha ravishda `earLength` ni ham belgilaydi:

```js run
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
  // ...
}

class Rabbit extends Animal  {

*!*
  constructor(name, earLength) {
    this.speed = 0;
    this.name = name;
    this.earLength = earLength;
  }
*/!*

  // ...
}

*!*
// Ishlamaydi!
let rabbit = new Rabbit("White Rabbit", 10); // Xato: bu aniqlanmagan.
*/!*
```

Obbo, bizda xato bor. Endi quyonlarni yarata olmaymiz. Qanday muammo yuz berdi?

Qisqa javob

- **Sinflarni meros qilib olgan konstruktorlar `super(...)` ni chaqirishi va (!) `this` dan foydalanishidan oldin buni bajarishi kerak.**

...Ammo nega? Bu yerda nima sodir bo'lyapti? Qaytaga qo'yilgan talab shubhali ko'rinyapti. 

Albatta, tushuntirishlar mavjud. Keling, tafsilotlarga to'xtalib o'tamiz, shunda siz haqiqatan ham nima bo'layotganini tushunasiz.

JavaScriptda meros qilib olingan sinfning konstruktor funktsiyasi ("hosila konstruktor", ya'ni derived constructor deb ataladi) va boshqa funktsiyalar o'rtasida farq mavjud. Olingan konstruktor `[[ConstructorKind]]:"derived"` maxsus ichki xususiyatiga ega. Bu maxsus ichki yorliq hisoblanadi.

Bu yorliq uning xatti-harakatlariga `new` bilan ta'sir qiladi.

- Muntazam funksiya `new` bilan bajarilganda, u bo'sh obyektni yaratadi va uni `this` ga tayinlaydi.
- Lekin olingan konstruktor ishlaganda, u buni bajarmaydi. Bu ishni parent constructor bajarishini kutadi.

Shunday qilib, olingan konstruktor o'zining parent (asosiy) konstruktorini bajarish uchun `super` ni chaqirishi kerak, aks holda `this` uchun obyekt yaratilmaydi va biz xatoga duch kelamiz.

`Rabbit` konstruktori ishlashi uchun `this` dan foydalanishdan oldin `super()` ni chaqirishi kerak, masalan:

```js run
class Animal {

  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  // ...
}

class Rabbit extends Animal {

  constructor(name, earLength) {
*!*
    super(name);
*/!*
    this.earLength = earLength;
  }

  // ...
}

*!*
// now fine
let rabbit = new Rabbit("White Rabbit", 10);
alert(rabbit.name); // White Rabbit
alert(rabbit.earLength); // 10
*/!*
```

### Sinf maydonlarini bekor qilish: murakkab eslatma

```warn header="rivojlangan eslatma"
Ushbu eslatmada siz boshqa dasturlash tillarida darslar bilan ma'lum tajribaga ega bo'lishingizni nazarda tutadi.

Bu tilni yaxshiroq tushunish imkonini beradi va xatolar manbayi bo'lishi mumkin bo'lgan xatti-harakatlarni izohlab beradi (lekin tez-tez emas).

Agar tushunish qiyin bo'lsa, shunchaki to'xtab qolmasdan o'qishda davom eting, keyin biroz vaqt o'tgach unga qayting.
```

Biz nafaqat usullarni, balki sinf maydonlarini ham bekor qilishimiz mumkin.

Garchi parent constructorda bekor qilingan maydonga kirganimizda, boshqa dasturlash tillaridan ancha farq qiladigan qiyin xatti-harakatlar mavjud.

Ushbu misolni ko'rib chiqing:

```js run
sinf Hayvon {
  name = 'hayvon';

  constructor() {
    alert(this.name); // (*)
  }
}

class Rabbit extends Animal {
  name = 'quyon';
}

yangi Hayvon(); // hayvon
*!*
yangi Quyon(); // hayvon
*/!*
```

Bu yerda `Rabbit` sinfi `Animal`ni kengaytiradi va `name` maydonini o'z qiymati bilan bekor qiladi.

`Rabbit` da shaxsiy konstruktor yo'q, shuning uchun `Animal` konstruktori deyiladi.

Qizig'i shundaki, ikkala holatda ham: `new animal()` va `new rabbit()`, `(*)` qatoridagi `alert` `animal`ni ko'rsatadi.

 **Boshqacha so'z bilan aytganda, parent konstruktori har doim bekor qilingan qiymatdan emas, balki o'zining maydon qiymatidan foydalanadi.**

Buning nimasi g'alati?

Agar u hali aniq bo'lmasa, iltimos, usullar bilan solishtirib ko'ring.

Mana bir xil kod, lekin `this.name` maydoni o'rniga `this.showName()` usulini chaqiramiz:

```js run
class Animal {
  showName() {  // this.name ning o'rniga = 'animal'
    alert('animal');
  }

  constructor() {
    this.showName(); // alert o'rniga (this.name);
  }
}

class Rabbit extends Animal {
  showName() {
    alert('rabbit');
  }
}

new Animal(); // animal
*!*
new Rabbit(); // rabbit
*/!*
```

Iltimos, diqqat qiling: endi natija biroz boshqacha.

Va bu holat biz tabiiy ravishda kutgan narsadir. Parent konstruktori ajratib olingan sinfda chaqirilganda, u bekor qilingan usuldan foydalanadi.

...Ammo sinf maydonlari uchun bunday emas. Aytganimizdek, parent konstruktori har doim ota-ona maydondan foydalanadi.

Nimaga bu yerda farq mavjud?

Xo'sh, bunga sabab maydonni ishga tushirish tartibidir. Sinf maydoni ishga tushirildi:
- Asosiy sinf uchun konstruktordan oldin (bu hech narsani kengaytirmaydi),
- Darhol olingan sinf uchun `super()` dan keyin.

Bizning holatda, `Rabbit` hosila sinfdir, ya'ni derived class. Unda `constructor()` yo'q. Avval aytib o'tganimizdek, bu xuddi `super(...args)` bo'lgan bo'sh konstruktorga o'xshaydi.

Shunday qilib, `new Rabbit()` `super()` ni chaqiradi, shu bilan parent konstruktorini ishga tushiradi va (oluvchi sinflar uchun qoida bo'yicha) shundan keyingina uning sinf maydonlari ishga tushiriladi. Parent konstruktorini bajarish vaqtida hali `Rabbit` sinf maydonlari mavjud emas, shuning uchun `Animal` maydonlari ishlatiladi.

Maydonlar va usullar o'rtasidagi bu nozik farq JavaScriptga xosdir.

Yaxshiyamki, bu xatti-harakat faqat parent konstruktorida bekor qilingan maydon ishlatilsa, o'zini namoyon qiladi. Keyin nima bo'layotganini anglash qiyin bo'lishi mumkin, shuning uchun biz buni bu yerda tushuntiramiz.

Agar muammo yuzaga kelsa, uni maydonlar o'rniga usullar yoki getter/setterlar yordamida tuzatish mumkin.

## Super: ichki qismlar, [[HomeObject]]

```warn header="Rivojlantirilgan ma'lumot"
Agar siz o'quv qo'llanmasini birinchi marta o'qiyotgan bo'lsangiz - bu bo'lim o'tkazib yuborilishi mumkin.

Bu meros va `super` ortidagi ichki mexanizmlar haqida ma'lumot beradi.
```

Keling, `super` atamasiga biroz chuqurroq kiraylik. Yo'lda biz qiziqarli narsalarni ko'ramiz.

Birinchidan, shuni aytish kerakki, biz hozirgacha o'rgangan narsalarimizdan `super` umuman ishlashi mumkin emas!

Ha, haqiqatan ham, keling, o'zimizga savol beraylik, bu texnik jihatdan qanday ishlashi kerak? Obyekt usuli ishga tushganda, u joriy obyektni `this` sifatida oladi. Agar biz `super.method()` deb chaqirsak, dvigatel joriy obyekt prototipidan `method` ni olishi kerak. Lekin qanday qilib?

Vazifa oddiy ko'rinishi mumkin, ammo unday emas. Dvigatel joriy obyekt `this` ni biladi, shuning uchun u asosiy `method` ni `this.__proto__.method` sifatida oladi. Afsuski, bunday "sodda" yechim ishlamaydi.

Keling, muammoni ko'rib chiqaylik. Sinflarsiz, oddiylik uchun oddiy obyektlardan foydalanamiz.

Tafsilotlarni bilishni istamasangiz, bu qismni o'tkazib yuborishingiz va quyida `[[HomeObject]]` bo'limiga o'tishingiz mumkin. Bu zarar qilmaydi. Yoki narsalarni chuqur tushunishga qiziqsangiz, o'qing.

Quyida shunday misol berilgan, `rabbit.__proto__ = animal`. Keling harakat qilib ko'ramiz: `rabbit.eat()` da `this.__proto__` dan foydalangan holda `animal.eat()` ni chaqiramiz:

```js run
let animal = {
  name: "Animal",
  eat() {
    alert(`${this.name} eats.`);
  }
};

let rabbit = {
  __proto__: animal,
  name: "Rabbit",
  eat() {
*!*
    // super.eat() shunday ishlashi mumkin
    this.__proto__.eat.call(this); // (*)
*/!*
  }
};

rabbit.eat(); // Rabbit eats.
```

`(*)` qatorida biz prototipdan (`animal`) `eat` ni olamiz va uni joriy obyekt kontekstida chaqiramiz. Esda tutingki, `.call(this)` bu yerda muhim, chunki ushbu `this.__proto__.eat()` obyekti oddiy obyekt emas, balki prototip kontekstida `eat` ota-ona rolini bajaradi.

Va yuqoridagi kod mo'ljallangandek ishlaydi: bizda to'g'ri `alert` mavjud.

Endi zanjirga yana bitta obyektni qo'shamiz. Vaziyat qanday buzilishini ko'ramiz:

```js run
let animal = {
  name: "Animal",
  eat() {
    alert(`${this.name} eats.`);
  }
};

let rabbit = {
  __proto__: animal,
  eat() {
    // ...quyon uslubi atrofida sakrang va parent (animal) usulini chaqiring
    this.__proto__.eat.call(this); // (*)
  }
};

let longEar = {
  __proto__: rabbit,
  eat() {
    // ... uzun quloqlarni nimadir qiling va parent (animal) usulini chaqiring
    this.__proto__.eat.call(this); // (**)
  }
};

*!*
longEar.eat(); // Xato: chaqiruvlar to'plamining maksimal hajmi oshib ketdi
*/!*
```

Kod endi ishlamaydi! Error, ya'ni xatoning `longEar.eat()`ni chaqirishga urinayotganini ko'rishimiz mumkin.

Bu unchalik aniq bo'lmasligi mumkin, lekin biz `longEar.eat()` chaqiruvini kuzatsak, buning sababini bilib olamiz. `(*)` va `(**)` ikkala qatorida `this` ning qiymati joriy obyekt (`longEar`) dir. Bu juda muhim: barcha obyekt usullari joriy obyektni prototip yoki boshqa narsa emas, balki `this` sifatida oladi.

Demak, `(*)` va `(**)` ikkala qatorida `this.__proto__` ning qiymati aynan bir xil, ya'ni `rabbit`. Ularning ikkalasi ham cheksiz aylanada zanjirni ko'tarmasdan `rabbit.eat` deb chaqiruvni amalga oshiradi.

Mana bu yerda sodir bo'layotgan vaziyatning suratini ko'rishimiz mumkin:

![](this-super-loop.svg)

1. `longEar.eat()`ning tarkibida `(**)` qatori `this=longEar` bilan ta'minlagan holda `rabbit.eat` ni chaqiradi. 
    ```js
    // longEar.eat() ning tarkibida bizda = longEar mavjud
    this.__proto__.eat.call(this) // (**)
    // becomes
    longEar.__proto__.eat.call(this)
    // that is
    rabbit.eat.call(this);
    ```
2. Keyin `rabbit.eat` ning `(*)` qatorida biz qo'ng'iroqni zanjirda yanada yuqoriroqqa o'tkazmoqchimiz, lekin `this=longEar`, shuning uchun `this.__proto__.eat` yana `rabbit.eat` holicha qoladi!

    ```js
    // rabbit.eat() ning tarkibida bizda yana = longEar mavjud
    this.__proto__.eat.call(this) // (*)
    // becomes
    longEar.__proto__.eat.call(this)
    // or (again)
    rabbit.eat.call(this);
    ```

3. ...Shunday qilib, `rabbit.eat` o'zini cheksiz siklda chaqiradi, chunki u boshqa ko'tarila olmaydi.

Muammoni faqatgina `this` dan foydalangan holda hal qilib bo'lmaydi.

### `[[HomeObject]]`

Yechimni ta'minlash uchun JavaScript funksiyalar uchun yana bitta maxsus ichki xususiyat `[[HomeObject]]` ni qo'shadi.

Agar funksiya sinf yoki obyekt usuli sifatida belgilangan bo'lsa, uning `[[HomeObject]]` xususiyati o'sha obyektga aylanadi.

Keyin `super`  uni asosiy prototip va uning usullarini hal qilish uchun ishlatadi.

Keling, avval oddiy obyektlar bilan qanday ishlashini ko'rib chiqaylik:

```js run
let animal = {
  name: "Animal",
  eat() {         // animal.eat.[[HomeObject]] == animal
    alert(`${this.name} eats.`);
  }
};

let rabbit = {
  __proto__: animal,
  name: "Rabbit",
  eat() {         // rabbit.eat.[[HomeObject]] == rabbit
    super.eat();
  }
};

let longEar = {
  __proto__: rabbit,
  name: "Long Ear",
  eat() {         // longEar.eat.[[HomeObject]] == longEar
    super.eat();
  }
};

*!*
// to'g'ri ishlaydi
longEar.eat();  // Long Ear eats.
*/!*
```

 U `[[HomeObject]]` mexanikasi tufayli rejalashtirilganidek ishlaydi. `longEar.eat` kabi usul o'zining `[[HomeObject]]` ini taniydi va `this` dan foydalanmagan holda prototipidan asosiy usulni oladi.

###  Usullar "bepul" emas

Bizga ilgari ma'lum bo'lganidek, odatda funksiyalar "bepul" bo'lib, JavaScriptdagi obyektlar bilan bog'lanmagan. Shunday qilib, ularni obyektlar o'rtasida nusxalash va boshqa `this` bilan chaqirish mumkin.

`[[HomeObject]]`ning mavjudligi bu tamoyilni buzadi, chunki usullar o'z obyektlarini eslab qoladi. `[[HomeObject]]`ni o'zgartirib bo'lmaydi, shuning uchun bu aloqa abadiydir. 

Dasturlash tilida `[[HomeObject]]` ishlatiladigan yagona joy -- `super`. Shunday qilib, agar usul `super` dan foydalanmasa, biz uni hali ham bepul deb hisoblashimiz va obyektlar o'rtasida nusxalashimiz mumkin. Ammo `super` bilan narsalar noto'g'ri ketishi mumkin.

 Nusxalashdan keyin noto'g'ri `super` natijaning namoyishi:

```js run
let animal = {
  sayHi() {
    alert(`I'm an animal`);
  }
};

// rabbit animaldan meros oladi
let rabbit = {
  __proto__: animal,
  sayHi() {
    super.sayHi();
  }
};

let plant = {
  sayHi() {
    alert("I'm a plant");
  }
};

// tree plantdan meros oladi
let tree = {
  __proto__: plant,
*!*
  sayHi: rabbit.sayHi // (*)
*/!*
};

*!*
tree.sayHi();  // I'm an animal (?!?)
*/!*
```

`tree.sayHi()` chaqiruvi "I'm an animal" ni ko'rsatadi va bu albatta noto'g'ri.

Sababi juda oddiy:
- `(*)` qatorida, `tree.sayHi` usuli `rabbit` dan nusxalangan. Balki biz shunchaki kodni takrorlashning oldini olishni xohlagandirmiz?
- Uning `[[HomeObject]]` , ya'ni uy obyekti `rabbit` hisoblanadi, chunki chaqiruvning o'zi ham `rabbit` da yaratilgan. `[[HomeObject]]` ni o'zgartirishning hech qanday iloji yo'q.
- `tree.sayHi()` kodi tarkibida `super.sayHi()` mavjud. U `rabbit` dan yuqoriga ko‘tarilib, `animal` dan usulni oladi.

Sodir bo'layotgan vaziyatning diagrammasi bilan tanishing:

![](super-homeobject-wrong.svg)

### Usullar funksiya xususiyatlari emas

`[[HomeObject]]` ham sinflardagi, ham oddiy obyektlardagi usullar uchun belgilangan. Ammo obyektlar uchun usullar `"method: function()"` sifatida emas, aynan `method()` sifatida ko'rsatilishi kerak.

Farqlar biz uchun katta ahamiyat kasb etmas, lekin bu jolat JavaScript uchun muhim hisoblanadi.

Quyidagi misolda taqqoslash uchun usul bo'lmagan sintaksis ishlatilgan. `[[HomeObject]]` xususiyati o'rnatilmagan va meros ishlamaydi:

```js run
let animal = {
  eat: function() { // eat() ning o'rniga atay shunday yoziladi {...
    // ...
  }
};

let rabbit = {
  __proto__: animal,
  eat: function() {
    super.eat();
  }
};

*!*
rabbit.eat();  // Xato super ni chaqirmoqda (chunki bu yerda hech qanday [[HomeObject]] mavjud emas )
*/!*
```

## Xulosa

1. Sinfni kengaytirish: `class Child extends Parent`, (sinf bolalari parent xususiyatini kengaytiradi):
   - Bu degani, `Child.prototype.__proto__` xususiyati `Parent.prototype` bo'ladi, shuning uchun usullar meros qilib olinadi.
2. Konstruktorni bekor qilayotgan vaqtda:
     - `this` dan foydalanishdan oldin `Child` konstruktorida parent konstruktorini `super()` deb chaqirishimiz kerak.
3. Boshqa usulni bekor qilayotgan vaqtda:
    - `Parent` usulini chaqirish uchun `Child` usulida `super.method()`dan foydalanishimiz mumkin.
4. Ichki qismlar:
    - Usullar o'z sinfini/obyektini ichki `[[HomeObject]]` xususiyatida eslab qoladi. Shunday qilib, `super` parent usullarini hal qiladi.
    - Demak, `super` bilan usulni bir obyektdan ikkinchisiga nusxalash xavfsiz emas.

Shuningdek:
- Strelkali funksiyalarining o'ziga xos `this` yoki `super` funksiyalari yo'q, shuning uchun ular atrofdagi kontekstga shaffof tarzda mos tushadi.
