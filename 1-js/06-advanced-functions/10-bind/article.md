libs:
  - lodash

---

# Function binding (Funksiyani bog'lash)

Obyekt usullarini, masalan, `setTimeout`ni, qayta chaqiruvlar sifatida o'tkazishda `this`ni yo'qotish bilan bog'liq muammo bor.

Ushbu bo'limda biz uni tuzatish usullarini ko'rib chiqamiz.

## "thisni" yo'qotish

Biz allaqachon `this`ni yo'qotish misollarini ko'rib chiqqanmiz. Usul obyektdan alohida joyga o'tkazilgandan so'ng -- `this` yo'qoladi.

Bu `setTimeout` bilan qanday sodir bo'lishi mumkin:

```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

*!*
setTimeout(user.sayHi, 1000); // Hello, undefined!
*/!*
```

Ko'rib turganimizdek, chiqish "John" ni `this.firstName` sifatida emas, balki `undefined` sifatida ko'rsatadi!

Buning sababi, `setTimeout` obyektdan alohida `user.sayHi` funksiyasini oldi. Oxirgi qatorni quyidagicha qayta yozish mumkin:

```js
let f = user.sayHi;
setTimeout(f, 1000); // user konteksti yo'qoldi
```

Brauzerdagi `setTimeout` metodi biroz o'ziga xosdir: funksiya chaqiruvi uchun `this=window` ni o'rnatadi (Node.js uchun `this` taymer obyektiga aylanadi, lekin bu yerda muhim emas). Shunday qilib, `this.firstName` uchun `window.firstName` ni olishga harakat qiladi, lekin bu mavjud emas. Boshqa shunga o'xshash holatlarda, odatda, `this` `undefined` bo'ladi.

Vazifa juda odatiy - biz obyekt usulini chaqiriladigan boshqa joyga (bu yerda - rejalashtiruvchiga) o'tkazmoqchimiz. U to'g'ri kontekstda chaqirilishiga qanday ishonch hosil qilish mumkin?

## Yechim 1: a wrapper (o'rovchi)

Eng oddiy yechim - wrapper funksiyasidan foydalanish:

```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

*!*
setTimeout(function() {
  user.sayHi(); // Hello, John!
}, 1000);
*/!*
```

Endi u ishlaydi, chunki u tashqi leksik muhitdan `user` ni oladi va keyin usulni odatdagidek chaqiradi.

Lekin bu usulda ishlash qisqaroq:

```js
setTimeout(() => user.sayHi(), 1000); // Hello, John!
```

Bu tashqi tomondan yaxshi ko'rinadi, ammo bizning kod tuzilmamizda ozgina zaiflik paydo bo'ladi.

Agar `setTimeout` ishga tushishidan oldin (bir soniya kechikish bor!) `user` qiymatni o'zgartirsachi? Keyin, to'satdan, u noto'g'ri obyektni chaqiradi!


```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(() => user.sayHi(), 1000);

// ...user qiymati 1 soniya ichida o'zgaradi
user = {
  sayHi() { alert("setTimeout da boshqa user!"); }
};

// setTimeout da boshqa user!
```

Keyingi yechim bunday narsa sodir bo'lmasligini kafolatlaydi.

## Yechim 2: bind

Funksiyalar o'rnatilgan [bind](mdn:js/Function/bind) metodini ta'minlaydi, bu `this`ni tuzatishga imkon beradi.

Asosiy sintaksis:

```js
// murakkabroq sintaksis biroz keyinroq keladi
let boundFunc = func.bind(context);
```

`func.bind(context)` natijasi funksiya sifatida chaqirilishi mumkin bo'lgan va chaqiruvni `this=kontekst` `func` sozlamasiga shaffof tarzda uzatuvchi maxsus funksiyaga o'xshash "ekzotik obyekt"dir.

Boshqacha qilib aytadigan bo'lsak, `boundFunc` qo'ng'irog'i `func`ga o'xshaydi, bu esa o'rnatilgan.

Masalan, bu yerda `funcUser` `this=user` bilan `func` ga chaqiruvni uzatadi:

```js run  
let user = {
  firstName: "John"
};

function func() {
  alert(this.firstName);
}

*!*
let funcUser = func.bind(user);
funcUser(); // John  
*/!*
```

Bu yerda `func.bind(user)` `func` ning "bog'langan varianti" sifatida, `this=user` belgilangan.

Barcha argumentlar asl `func` ga "xuddi shunday" uzatiladi, masalan:

```js run  
let user = {
  firstName: "John"
};

function func(phrase) {
  alert(phrase + ', ' + this.firstName);
}

// buni userga bog'lang
let funcUser = func.bind(user);

*!*
funcUser("Hello"); // Hello, John ("Hello" argumenti qabul qilindi va this = user)
*/!*
```

Keling, obyekt usuli bilan harakat qilaylik:


```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

*!*
let sayHi = user.sayHi.bind(user); // (*)
*/!*

// obyektsiz ishga tushirishi mumkin
sayHi(); // Hello, John!

setTimeout(sayHi, 1000); // Hello, John!

// user qiymati 1 soniya ichida o'zgarsa ham
// sayHi eski user obyektiga havola bo'lgan oldindan bog'langan qiymatdan foydalanadi
user = {
  sayHi() { alert("setTimeout da boshqa user!"); }
};
```

`(*)` qatorida `user.sayHi` metodini olamiz va uni `user` bilan bog'laymiz. `sayHi` "bog'langan" funksiya bo'lib, uni yakka o'zi chaqirish yoki `setTimeout` ga o'tkazish mumkin -- muhim emas, kontekst to'g'ri bo'ladi.

Bu yerda biz argumentlar "xuddi shunday" uzatilganini ko'rishimiz mumkin, faqat "this" "bind" bilan o'rnatiladi:

```js run
let user = {
  firstName: "John",
  say(phrase) {
    alert(`${phrase}, ${this.firstName}!`);
  }
};

let say = user.say.bind(user);

say("Hello"); // Hello, John! ("Hello" argumenti aytish uchun uzatiladi)
say("Bye"); // Bye, John! ("Bye" aytish uchun uzatiladi)
```
``
smart header="Qulay metod: `bindAll`"
Agar obyektda ko'plab usullar mavjud bo'lsa va biz uni faol ravishda o'tkazishni rejalashtirmoqchi bo'lsak, biz ularning barchasini siklda bog'lashimiz mumkin:

```js
for (let key in user) {
  if (typeof user[key] == 'function') {
    user[key] = user[key].bind(user);
  }
}
```

JavaScript kutubxonalari, shuningdek, qulay ommaviy ulanish uchun funksiyalarni taqdim etadi, masalan, lodashda [_.bindAll(object, methodNames)](https://lodash.com/docs#bindAll).
````
````
## Qisman funktsiyalar

Hozirgacha biz faqat `this`ni bog'lash haqida gapirib kelganmiz. Keling, yana bir qadam tashlaylik.

Biz nafaqat `this`, balki argumentlarni ham bog'lashimiz mumkin. Bu kamdan-kam hollarda amalga oshiriladi, lekin bu ba'zida qulay.

`bind` ning to'liq sintaksisi:

```js
let bound = func.bind(context, [arg1], [arg2], ...);
```

Bu kontekstni `this` va funksiyaning boshlang'ich argumentlari sifatida bog'lash imkonini beradi.

Masalan, bizda `mul(a, b)` ko'paytirish funksiyasi mavjud:

```js
function mul(a, b) {
  return a * b;
}
```

Uning asosida `double` funksiyasini yaratish uchun `bind` dan foydalanamiz:

```js run
function mul(a, b) {
  return a * b;
}

*!*
let double = mul.bind(null, 2);
*/!*

alert( double(3) ); // = mul(2, 3) = 6
alert( double(4) ); // = mul(2, 4) = 8
alert( double(5) ); // = mul(2, 5) = 10
```

`mul.bind(null, 2)` ga chaqiruv yangi `double` funksiyasini yaratadi, bu chaqiruvlarni `mul` ga uzatadi, kontekst sifatida `null` va birinchi argument sifatida `2` ni o'rnatadi. Keyingi argumentlar "xuddi shunday" uzatiladi.

Bu [qisman funksiya ilovasi](https://en.wikipedia.org/wiki/Partial_application) deb ataladi -- biz mavjud funksiyaning ayrim parametrlarini tuzatish orqali yangi funksiya yaratamiz.

Shuni esda tutingki, biz bu yerda `this` dan foydalanmaymiz. Lekin `bind` buni talab qiladi, shuning uchun biz `null` kabi biror narsani qo'yishimiz kerak. 

Quyidagi koddagi `triple` funksiyasi qiymatni uch barobar oshiradi:

```js run
function mul(a, b) {
  return a * b;
}

*!*
let triple = mul.bind(null, 3);
*/!*

alert( triple(3) ); // = mul(3, 3) = 9
alert( triple(4) ); // = mul(3, 4) = 12
alert( triple(5) ); // = mul(3, 5) = 15
```

Nima uchun biz odatda qisman funksiyani qilamiz?

Foydasi shundaki, biz o'qilishi mumkin bo'lgan nomga ega mustaqil funktsiyani yaratishimiz mumkin (`double`, `triple`). Biz undan foydalanishimiz mumkin va har safar birinchi argumentni keltira olmaymiz, chunki u `bind` bilan o'rnatiladi.

Boshqa hollarda, qisman qo'llash bizda umumiy funksiyaga ega bo'lsa, qulaylik uchun uning kamroq universal varianti foydali bo'ladi. 

Masalan, bizda `send(from, to, text)` funksiyasi mavjud. Keyin, `user` obyekti ichida biz uning qisman variantidan foydalanishni xohlashimiz mumkin, masalan, joriy foydalanuvchidan yuboriladigan `sendTo(to, text)`.

## Kontekstsiz qisman funksiya

Agar biz `this` kontekstini emas, balki ba'zi argumentlarni tuzatmoqchi bo'lsak-chi? Masalan, obyekt usuli uchun.

Mahalliy `bind` bunga ruxsat bermaydi. Biz shunchaki kontekstni qoldirib, dalillarga o'tishimiz mumkin emas.

Yaxshiyamki, faqat argumentlarni bog'lash uchun `partial` funksiyasi osongina amalga oshirilishi mumkin.

Xuddi quyidagi kabi:

```js run
*!*
function partial(func, ...argsBound) {
  return function(...args) { // (*)
    return func.call(this, ...argsBound, ...args);
  }
}
*/!*

// Ishlatilinishi:
let user = {
  firstName: "John",
  say(time, phrase) {
    alert(`[${time}] ${this.firstName}: ${phrase}!`);
  }
};

// belgilangan vaqt bilan qisman usul qo'shing
user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes());

user.sayNow("Hello");
// Quyidagicha:
// [10:00] John: Hello!
```

`partial(func[, arg1, arg2...])` chaqiruvi natijasi `(*)` wrapper bo'lib, `func` ni quyidagidek chaqiradi:
- Xuddi shunday `this` (`user.sayNow` uchun `user` deb nomlanadi)
- Keyin unga `...argsBound` -- `partial` chaqiruvdan (`"10:00"`) argumentlarni beradi.
- Keyin unga `...args` beradi -- wrapperga berilgan argumentlar (`"Salom"`)

Spread sintaksisi bilan buni qilish juda oson, to'g'rimi?

Shuningdek, lodash kutubxonasidan tayyor [_.partial](https://lodash.com/docs#partial) ilovasi mavjud.

## Xulosa

`func.bind(context, ...args)` usuli `this` kontekstini va agar berilgan bo'lsa, birinchi argumentlarni tuzatuvchi `func` funksiyasining "bog'langan variantini" qaytaradi.

Odatda biz obyekt usulidagi `this` ni tuzatish uchun `bind` ni qo'llaymiz, shunda biz uni biror joyga o'tkazamiz, masalan, `SetTimeout` uchun.

Mavjud funksiyaning ba'zi argumentlarini tuzatsak, natijada paydo bo'lgan (kamroq universal) funksiya *qisman qo'llaniladigan* yoki *qisman* deb ataladi.

Biz bir xil argumentni qayta-qayta takrorlashni istamaganimizda, "qisman" qulaydir. Masalan, bizda `send(from, to)` funksiyasi bo'lsa va `from` bizning vazifamiz uchun har doim bir xil bo'lishi kerak bo'lsa, biz "qisman" ni olishimiz va u bilan davom etishimiz mumkin.
