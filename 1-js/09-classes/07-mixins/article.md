# Mixins - Aralashmalar

JavaScriptda biz faqat bitta obyektdan meros olishimiz mumkin. Obyekt uchun faqat bitta `[[Prototype]]` bo'lishi mumkin. Va sinf faqat bitta boshqa sinfni kengaytira olaadi.

Ammo ba'zida bu cheklovlarga sabab bo'ladi. Masalan, bizda `StreetSweeper` (ko'cha supuruvchi)va `Bicycle`(velosiped) sinflari bor va ularning aralashmasini yaratmoqchimiz: `StreetSweepingBicycle`

Yoki bizda hodisa yaratishni amalga oshiradigan `User` va `EventEmitter` sinflari bor va biz `User` ga `EventEmitter` funksiyasini qo‘shmoqchimiz, shunda bizning foydalanuvchilarimiz hodisalarni chiqarishi mumkin.

Bu yerda bizga yordam berishi mumkin bo'lgan "aralashmalar" deb nomlangan tushuncha mavjud.

Vikipediyada taʼriflanganidek, [mixin](https://en.wikipedia.org/wiki/Mixin) boshqa sinflar tomonidan undan meros olish zaruratisiz foydalanishi mumkin boʻlgan usullarni oʻz ichiga olgan sinfdir.

Boshqacha qilib aytadigan bo'lsak, *mixin* ma'lum bir xatti-harakatni amalga oshiradigan usullarni taqdim etadi, lekin biz uni yolg'iz ishlatmaymiz, undan boshqa sinflarga xatti-harakatni qo'shish uchun foydalanamiz.

## Mixins, ya'ni aralashmalarga doir misollar

JavaScriptda miksinni, ya'ni aralashmani amalga oshirishning eng oddiy usuli bu obyektni foydali usullar bilan yaratishdir, shunda biz ularni istalgan sinfning prototipiga osongina birlashtira olamiz.

Masalan, bu erda `sayHiMixin` miksin `User` uchun ba`zi bir "nutq" qo'shish uchun ishlatiladi:

```js run
*!*
// mixin
*/!*
let sayHiMixin = {
  sayHi() {
    alert(`Hello ${this.name}`);
  },
  sayBye() {
    alert(`Bye ${this.name}`);
  }
};

*!*
// ishlatilishi:
*/!*
class User {
  constructor(name) {
    this.name = name;
  }
}

// usullarni ko'chirish
Object.assign(User.prototype, sayHiMixin);

// user, ya'ni foydalanuvchi endi hi deb ayta oladi
new User("Dude").sayHi(); // Hello Dude!
```

Meros yo'q, lekin bu nusxa ko'chirishning oddiy usuli. Shunday qilib, `User` boshqa sinfdan meros bo'lib, qo'shimcha usullarni aralashtirish uchun "mix-in" ni o'z ichiga olishi mumkin, masalan:

```js
class User extends Person {
  // ...
}

Object.assign(User.prototype, sayHiMixin);
```

Miksinlar o'zlari merosdan foydalanishlari mumkin.

Masalan, quyidagi `sayHiMixin` `sayMixin` dan meros oladi:

```js run
let sayMixin = {
  say(phrase) {
    alert(phrase);
  }
};

let sayHiMixin = {
  __proto__: sayMixin, // (yoki bu yerda prototipni o'rnatish uchun Object.setPrototypeOf dan foydalanishimiz mumkin)

  sayHi() {
    *!*
    // ota-ona usulini chaqirish
    */!*
    super.say(`Hello ${this.name}`); // (*)
  },
  sayBye() {
    super.say(`Bye ${this.name}`); // (*)
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

// usullarni ko'chirish
Object.assign(User.prototype, sayHiMixin);

// user, foydalanuvchi endi hi deb ayta oladi
new User("Dude").sayHi(); // Hello Dude!
```

Esda tutingki, `sayHiMixin` `super.say()` ota-ona usuliga chaqiruv (`(*)` bilan belgilangan satrlarda) sinfni emas, balki o'sha mix-in prototipidagi usulni qidiradi.

Mana diagramma (o'ng qismga qarang):

![](mixin-inheritance.svg)

Buning sababi,  `sayHi` va `sayBye` usullari dastlab `sayHiMixin` da yaratilgan. Shunday qilib, ular nusxalangan bo'lsa ham, ularning `[[HomeObject]]` ichki xususiyati yuqoridagi rasmda ko'rsatilganidek, `sayHiMixin` ga ishora qiladi.

`Super` `[[HomeObject]].[[Prototype]]`da asosiy usullarni qidirayotgani uchun u `sayHiMixin.[[Prototype]]`ni qidiradi.

## EventMixin - mix-in hodisasi

Keling, haqiqiy hayot uchun miksin yarataylik.

Ko'pgina brauzer obyektlarining muhim xususiyati, masalan, ular hodisalarni yaratishlari mumkin. Voqealar - bu ma'lumotni istagan har bir kishiga "efirga uzatish" ning ajoyib usuli. Shunday qilib, keling, har qanday sinf/obyektga voqea bilan bog'liq funksiyalarni osongina qo'shish imkonini beruvchi mix-in ni yarataylik.

- Mix-in `.trigger(nom, [...ma'lumotlar])` usulini ta'minlaydi, agar biror muhim voqea sodir bo'lsa, "hodisa" yaratadi. `name` argumenti hodisaning nomi boʻlib, ixtiyoriy ravishda voqea ma'lumotlari bilan qo'shimcha argumentlardan keyin keladi.
- Shuningdek, `.on(name, handler)` usuli ham berilgan nomli hodisalarni tinglovchi sifatida `handler` funksiyasini qo'shadi. U berilgan `name` bilan voqea ishga tushganda chaqiriladi va `.trigger` chaqiruvidan argumentlarni oladi.
- ...Va `.off(name, handler)` usuli `handler` tinglovchini olib tashlaydi.

Mix-in qo'shilgandan so'ng, `user` obyekti tashrif buyuruvchi tizimga kirganda `"login"` hodisasini yaratishi mumkin. Boshqa obyekt, masalan, `calendar` hodisani yuklash uchun  tizimga kirgan shaxs bunday voqealarni tinglashni xohlashi mumkin. 

Yoki `menu` bandi tanlanganda `"select"`, tanlash hodisasini yaratishi mumkin va boshqa obyektlar ushbu hodisaga munosabat bildirish uchun ishlov beruvchilarni belgilashi mumkin va hokazo.

Quyida kod berilgan:

```js run
let eventMixin = {
  /**
   * Hodisani kuzatish va undan foydalanish:
   *  menu.on('select', function(item) { ... }
  */
  on(eventName, handler) {
    if (!this._eventHandlers) this._eventHandlers = {};
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
  },

  /**
   * Obunani bekor qilish, foydalanish:
   *  menu.off('select', handler)
   */
  off(eventName, handler) {
    let handlers = this._eventHandlers?.[eventName];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }
  },

  /**
   * Belgilangan nom va ma'lumotlar bilan voqea yarating
   *  this.trigger('select', data1, data2);
   */
  trigger(eventName, ...args) {
    if (!this._eventHandlers?.[eventName]) {
      return; // bu hodisa nomi uchun ishlov beruvchilar yo'q
    }

    // ishlovchilarni chaqirish
    this._eventHandlers[eventName].forEach(handler => handler.apply(this, args));
  }
};
```


- `.on(eventName, handler)` -- shu nomdagi voqea sodir bo'lganda ishga tushirish uchun `handler`, ishlab chiqaruvchi funksiyasini tayinlaydi. Texnik jihatdan, har bir hodisa nomi uchun ishlov beruvchilar massivini saqlaydigan `_eventHandlers` xususiyati mavjud va u faqat roʻyxatga qoʻshadi.
- `.off(eventName, handler)` -- funktsiyani ishlov beruvchilar ro'yxatidan olib tashlaydi.
- `.trigger(eventName, ...args)` -- hodisani yaratadi: `_eventHandlers[eventName]` dan barcha ishlov beruvchilar `...args` argumentlar ro`yxati bilan chaqiriladi.

Foydalanish:

```js run
// Sinf yaratish
class Menu {
  choose(value) {
    this.trigger("select", value);
  }
}
// Hodisa bilan bog'liq usullar bilan mix-in ni qo'shing
Object.assign(Menu.prototype, eventMixin);

let menu = new Menu();

// tanlashda chaqiriladigan ishlov beruvchini qo'shing:
*!*
menu.on("select", value => alert(`Value selected: ${value}`));
*/!*

// hodisani ishga tushiradi => yuqoridagi ishlov beruvchi ishlaydi va ko'rsatadi:
// Qiymat tanlandi: 123
menu.choose("123");
```

Agar biz biron bir kodning menyu tanloviga munosabat bildirishini xohlasak, uni `menu.on(...)`  orqali tinglashimiz mumkin.

Va `eventMixin` mixin bu kabi xatti-harakatlarni meros zanjiriga aralashmasdan, biz xohlagancha ko'p sinflarga qo'shishni osonlashtiradi.

## Xulosa

*Mixin* -- umumiy obyektga yo'naltirilgan dasturlash atamasi: boshqa sinflar uchun usullarni o'z ichiga olgan sinf.

Ba'zi boshqa tillar bir nechta merosga ruxsat beradi. JavaScript bir nechta merosni qo'llab-quvvatlamaydi, ammo mix-inlarni prototipga nusxalash usullari orqali amalga oshirish mumkin.

Biz yuqorida ko'rganimizdek, bir nechta xatti-harakatlarni qo'shish orqali sinfni ko'paytirish uchun mix-inlardan foydalanishimiz mumkin, masalan, voqealarni boshqarishda foydalansak bo'ladi.

Mix-inlar tasodifan mavjud sinf usullarini qayta yozsa, ziddiyat nuqtasiga aylanishi mumkin. Shunday qilib, odatda, bu sodir bo'lish ehtimolini minimallashtirish uchun aralashmaning nomlash usullari haqida yaxshi o'ylash kerak.
