# Dekoratorlar va yo'naltirish, call/apply

JavaScript funksiyalar bilan ishlashda ajoyib moslashuvchanlikni beradi. Ularni atrofga o'tkazish, obyekt sifatida ishlatish mumkin va endi biz ular orasidagi chaqiruvlarni qanday _yo'naltirish_ va _bezashni_ ko'rib chiqamiz.

## Shaffof keshlash

Aytaylik, bizda protsessorga og'ir bo'lgan `slow(x)` funksiyasi mavjud, lekin uning natijalari barqaror. Boshqacha qilib aytganda, bir xil `x` uchun u har doim bir xil natijani qaytaradi.

Agar funksiya tez-tez chaqirilsa, biz qayta hisob-kitoblarga qo'shimcha vaqt sarflamaslik uchun natijalarni keshlashni (eslab qolishni) xohlashimiz mumkin.

Ammo bu funksiyani `slow()` ga qo'shish o'rniga keshlashni qo'shadigan o'rash funktsiyasini yaratamiz. Ko'rib turganimizdek, buning ko'plab afzalliklari bor.

Kod va tushuntirishlar quyidagicha:

```js run
function slow(x) {
  // bu yerda og'ir CPU-intensiv ish bo'lishi mumkin
  alert(`Called with ${x}`);
  return x;
}

function cachingDecorator(func) {
  let cache = new Map();

  return function (x) {
    if (cache.has(x)) {
      // keshda shunday kalit bo'lsa
      return cache.get(x); // undan olingan natijani o'qiydi
    }

    let result = func(x); // aks holda funcni chaqirish

    cache.set(x, result); // va natijani keshlash (eslab qolish).
    return result;
  };
}

slow = cachingDecorator(slow);

alert(slow(1)); // slow(1) keshlanadi va natija qaytariladi
alert("Again: " + slow(1)); // slow(1) natija keshdan qaytarildi

alert(slow(2)); // slow(2) keshlanadi va natija qaytariladi
alert("Again: " + slow(2)); // slow(2) natija keshdan qaytarildi
```

Yuqoridagi kodda `cachingDecorator` _dekorator_: boshqa funksiyani qabul qiladigan va uning harakatini o'zgartiruvchi maxsus funksiya.

G'oya shundan iboratki, biz har qanday funksiya uchun `cachingDecorator` ni chaqirishimiz mumkin va u keshlash paketini qaytaradi. Bu juda zo'r, chunki bizda bunday xususiyatdan foydalanishi mumkin bo'lgan ko'plab funktsiyalar bo'lishi mumkin va biz qilishimiz kerak bo'lgan narsa ularga `cachingDecorator` ni qo'llashdir.

Keshlashni asosiy funktsiya kodidan ajratib, asosiy kodni ham soddalashtiramiz.

`cachingDecorator(func)` natijasi `func(x)` chaqiruvini keshlash mantig'iga "o'raydigan" `function(x)` bo'ladi:

![](decorator-makecaching-wrapper.svg)

Tashqi koddan o'ralgan `slow` funktsiyasi hali ham xuddi shunday qiladi. Uning xatti-harakatlariga keshlash tomoni qo'shildi.

Xulosa qilib aytadigan bo'lsak, `slow` kodini o'zgartirish o'rniga alohida `cachingDecorator` dan foydalanishning bir qancha afzalliklari bor:

- `CachingDecorator` dan qayta foydalansa bo'ladi. Biz uni boshqa funksiya bilan qo'llashimiz mumkin.
- Keshlash mantig'i alohida, u `slow`ning murakkabligini oshirmadi (agar mavjud bo'lsa).
- Kerak bo'lsa, biz bir nechta dekorativlarni birlashtira olamiz (boshqa dekoratorlar ergashadi).

## Kontekst uchun "func.call" dan foydalanish

Yuqorida aytib o'tilgan keshlash dekoratori obyekt usullari bilan ishlash uchun mos emas.

Masalan, quyidagi kodda `worker.slow()` dekorator, ya'ni bezakdan keyin ishlamay qoladi:

```js run
// biz `worker.slow` keshini qilamiz
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    // Bu qo'rqinchli CPUga og'ir vazifa
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
};

// oldingidek bir xil kod
function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
*!*
    let result = func(x); // (**)
*/!*
    cache.set(x, result);
    return result;
  };
}

alert( worker.slow(1) ); // original metod ishlaydi

worker.slow = cachingDecorator(worker.slow); // endi uni keshlaymiz

*!*
alert( worker.slow(2) ); // Voy! Error: undefined ning 'someMethod' xususiyatini o'qiy olmaydi
*/!*
```

Error `(*)` qatorida `this.someMethod` ga kirishga harakat qiladi va bajarilmaydi. Nega?

Buning sababi shundaki, o'rovchi asl funksiyani `(**)` qatorida `func(x)` deb chaqiradi. Va shunday chaqirilganda, funksiya `this = undefined` ni oladi.

Agar ishga chiqarishga harakat qilsak, shunga o'xshash alomatni kuzatamiz:

```js
let func = worker.slow;
func(2);
```

Shunday qilib, o'rovchi chaqiruvni asl metodga o'tkazadi, lekin bu vazifani `this` kontekstisiz yakunlaydi. Shuning uchun bu xato chiqadi.

Keling, xatoni to'g'irlaymiz.

Maxsus o'rnatilgan funksiya metodi [func.call(context, ...args)](mdn:js/Function/call) mavjud bo'lib, bu funksiyani aniq `this` sozlab chaqirish imkonini beradi.

Sintaksisi:

```js
func.call(context, arg1, arg2, ...)
```

Birinchi argumentni `this`, keyingisini esa argumentlar sifatida ta'minlab, `func` ishlaydi.

Oddiy qilib aytganda, bu ikki chaqiruv deyarli bir xil ishlaydi:

```js
func(1, 2, 3);
func.call(obj, 1, 2, 3);
```

Ularning ikkalasi ham `1`, `2` va `3` argumentlari bilan `func` ni chaqiradi. Yagona farq shundaki, `func.call` ham `this` ni `obj` ga o'rnatadi.

Misol tariqasida, quyidagi kodda biz turli obyektlar kontekstida `sayHi` deb nomlaymiz: `sayHi.call(user)` `his=user` ni ta'minlovchi `sayHi`ni ishga tushiradi va keyingi qatorda `this=admin` o'rnatiladi:

```js run
function sayHi() {
  alert(this.name);
}

let user = { name: "John" };
let admin = { name: "Admin" };

// turli obyektlarni "this" sifatida o'tkazish uchun chaqiruvdan foydalanish
sayHi.call(user); // John
sayHi.call(admin); // Admin
```

Va bu yerda biz berilgan kontekst va ibora bilan `say` uchun `call` dan foydalanamiz:

```js run
function say(phrase) {
  alert(this.name + ": " + phrase);
}

let user = { name: "John" };

// user this bo'ladi va "Hello" birinchi argumentga aylanadi
say.call(user, "Hello"); // John: Hello
```

Bizning holatda, kontekstni asl funksiyaga o'tkazish uchun o'ramdagi `call` dan foydalanishimiz mumkin:

```js run
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
};

function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
*!*
    let result = func.call(this, x); // "this" endi to'g'ri o'tdi
*/!*
    cache.set(x, result);
    return result;
  };
}

worker.slow = cachingDecorator(worker.slow); // endi keshlaymiz

alert( worker.slow(2) ); // ishlaydi
alert( worker.slow(2) ); // ishlaydi, asl nusxani chaqirmaydi (keshlangan)
```

Endi hammasi yaxshi.

Hammasi aniq bo'lishi uchun keling, `this` qanday o'tishini chuqurroq ko'rib chiqaylik:

1. Bezatishdan keyin `worker.slow` endi o'rovchi `function (x) { ... }`.
2. Shunday qilib, `worker.slow(2)` bajarilganda, o'rovchi argument sifatida `2` va `this=worker` (bu nuqtadan oldingi obyekt) ni oladi.
3. O'rovchi ichida, natija hali keshlanmagan deb faraz qilsak, `func.call(this, x)` joriy `this` (`=worker`) va joriy argumentni (`=2`) asl usulga o'tkazadi.

## Multi argumentga o'tish

Keling, `cachingDecorator` ni yanada universalroq qilaylik. Hozirgacha u faqat bitta argumentli funksiyalar bilan ishlagan.

Endi ko'p argumentli `worker.slow` usulini qanday keshlash mumkin?

```js
let worker = {
  slow(min, max) {
    return min + max; // qo'rqinchli CPU-hogger taxmin qilinadi
  },
};

// bir xil argumentli chaqiruvlarni eslab qolishi kerak
worker.slow = cachingDecorator(worker.slow);
```

Ilgari, bitta `x` argumenti uchun natijani saqlash uchun `cache.set(x, result)` va uni olish uchun `cache.get(x)` ni ishlatishimiz mumkin edi. Ammo endi biz _argumentlar kombinatsiyasi_ `(min,max)` uchun natijani eslab qolishimiz kerak. Mahalliy `Map` faqat bitta qiymatni kalit sifatida qabul qiladi.

Ko'p yechimlar mavjud:

1. Ko'p qirrali va ko'p kalitlarga ruxsat beruvchi yangi (yoki uchinchi tomonning) mapga o'xshash ma'lumotlar strukturasini amalga oshiring.
2. Ichki xaritalardan foydalaning: `cache.set(min)` `(maksimal, natija)` juftligini saqlaydigan `Xarita` bo'ladi. Shunday qilib, biz `natija`ni `cache.get(min).get(max)` sifatida olishimiz mumkin.
3. Ikki qiymatni bittaga birlashtiring. Bizning alohida holatda, biz `Map` kaliti sifatida `min, max` qatoridan foydalanishimiz mumkin. Moslashuvchanlik uchun biz ko'pchilikdan bitta qiymatni qanday qilishni biladigan dekorator uchun _keshlash funksiyasini_ taqdim etishga ruxsat berishimiz mumkin.

Ko'pgina amaliy ilovalar uchun 3-variant yetarli darajada yaxshi, shuning uchun biz shu usulni tanlaymiz.

Bundan tashqari, biz faqat `x` ni emas, balki `func.call` dagi barcha argumentlarni o'tkazishimiz kerak. Eslatib o'tamiz, `funksiya()`da biz uning argumentlarining psevdomassivini `arguments` sifatida olishimiz mumkin, shuning uchun `func.call(this, x)` `func.call(this, ...arguments)` bilan almashtirilishi kerak..

Quyida kuchliroq `cachingDecorator` berilgan:

```js run
let worker = {
  slow(min, max) {
    alert(`Called with ${min},${max}`);
    return min + max;
  }
};

function cachingDecorator(func, hash) {
  let cache = new Map();
  return function() {
*!*
    let key = hash(arguments); // (*)
*/!*
    if (cache.has(key)) {
      return cache.get(key);
    }

*!*
    let result = func.call(this, ...arguments); // (**)
*/!*

    cache.set(key, result);
    return result;
  };
}

function hash(args) {
  return args[0] + ',' + args[1];
}

worker.slow = cachingDecorator(worker.slow, hash);

alert( worker.slow(3, 5) ); // ishlaydi
alert( "Again " + worker.slow(3, 5) ); // bir xil (keshlangan)
```

Endi u istalgan miqdordagi argumentlar bilan ishlaydi (hash funksiyasi ham argumentlar soniga ruxsat berish uchun sozlanishi kerak. Buni hal qilishning qiziqarli usuli quyida muhokama qilinadi).

Ikki xil o'zgarish mavjud:

- `(*)` qatorida `arguments` dan bitta kalit yaratish uchun `hash` chaqiriladi. Bu yerda biz `(3, 5)` argumentlarni `"3,5"` kalitiga aylantiruvchi oddiy "qo`shilish" funksiyasidan foydalanamiz. Keyinchalik murakkab holatlar boshqa hashlash funksiyalarini talab qilishi mumkin.
- Keyin `(**)` kontekstni ham, o'rovchi olgan (faqat birinchi emas) barcha argumentlarni asl funksiyaga o'tkazish uchun `func.call(this, ...arguments)` dan foydalanadi.

## func.apply

`func.call(this, ...arguments)` o'rniga biz `func.apply(this, arguments)` dan foydalanishimiz mumkin.

O'rnatilgan [func.apply] (mdn:js/Function/apply) metodining sintaksisi:

```js
func.apply(context, args);
```

U `this=context` `func` sozlamasini ishga tushiradi va argumentlar ro'yxati sifatida massivga o'xshash `args` obyektidan foydalanadi.

`call` va `apply` o'rtasidagi yagona sintaktik farq shundaki, `call` argumentlar ro'yxatini kutadi, `apply` esa ular bilan massivga o'xshash obyektni oladi.

Shunday qilib, bu ikki chaqiruv deyarli teng:

```js
func.call(context, ...args);
func.apply(context, args);
```

Ular berilgan kontekst va argumentlar bilan bir xil `func` chaqiruvini bajaradilar.

`args` bilan bog'liq faqat nozik farq bor:

- `...` spread sintaksisi _iterable_ `args`ni `call` ro'yxati sifatida o`tkazish imkonini beradi.
- `apply` faqat _massivga o'xshash_ `arg`larni qabul qiladi.

...Haqiqiy massiv kabi bir vaqtning o'zida takrorlanadigan va massivga o'xshash obyektlar uchun biz ulardan istalganidan foydalanishimiz mumkin, lekin `apply` tezroq bo'lishi mumkin, chunki ko'pchilik JavaScript mexanizmlari uni ichki tarzda optimallashtiradi.

Barcha argumentlarni kontekst bilan birga boshqa funksiyaga o'tkazish _call forwarding_ deb ataladi.

Quyida uning eng oddiy shaklini ko'rib chiqing:

```js
let wrapper = function () {
  return func.apply(this, arguments);
};
```

Agar tashqi kod bunday `wrapper` ni chaqirsa, uni `func` asl funksiyasining chaqiruvidan ajratib bo'lmaydi.

## Metodni qarzga olish [#method-borrowing]

Keling, hashlash funksiyasida yana bir kichik yaxshi o'zgarish qilaylik:

```js
function hash(args) {
  return args[0] + "," + args[1];
}
```

Hozircha u faqat ikkita argumentda ishlaydi. Istalgan miqdordagi `args`ni yopishtirib olsa yaxshi bo'lardi.

Tabiiy yechim [arr.join](mdn:js/Array/join) metodidan foydalanish bo'ladi:

```js
function hash(args) {
  return args.join();
}
```

...Afsuski, bu ishlamaydi. Chunki biz `hash(arguments)` deb nomlaymiz va `arguments` obyekti ham iterativ, ham massivga o‘xshaydi, lekin u haqiqiy massiv emas.

Shunday qilib, biz quyida ko'rib turganimizdek, `join` ni chaqirish muvaffaqiyatsiz bo'ladi:

```js run
function hash() {
*!*
  alert( arguments.join() ); // Error: arguments.join funksiya emas
*/!*
}

hash(1, 2);
```

Shunga qaramay, massivni birlashtirishdan foydalanishning oson yo'li mavjud:

```js run
function hash() {
*!*
  alert( [].join.call(arguments) ); // 1,2
*/!*
}

hash(1, 2);
```

Bu hiyla _method borrowing_ deb ataladi.

Biz oddiy massivdan (`[].join`) birlashish usulini olamiz (borrow) va uni `arguments` kontekstida ishga tushirish uchun `[].join.call` dan foydalanamiz.

Nima uchun u ishlaydi?

Sababi `arr.join(glue)` mahalliy metodining ichki algoritmi juda oddiy.

Deyarli "xuddi shunday" spesifikatsiyadan olingan:

1. Birinchi argument `glue` bo'lsin yoki argumentlar bo'lmasa, vergul `","` qo'yilsin.
2. `result` bo'sh qator bo`lsin.
3. `result`ga `this[0]` qo'shing.
4. `glue` va `this[1]`ni qo'shing.
5. `glue` va `this[2]`ni qo'shing.
6. ...`this.length` elementlari yopishtirilguncha shunday qiling.
7. `result`ni qaytaring.
   Shunday qilib, texnik jihatdan u `this` ni oladi va ` this[0]`, ` this[1]` ... va hokazolarni birlashtiradi. U ataylab har qanday massivga o'xshash `this`ga ruxsat beruvchi tarzda yozilgan (tasodif emas, ko'p usullar bu amaliyotga amal qiladi). Shuning uchun u `this=arguments` bilan ham ishlaydi.

## Dekoratorlar va funksiya xususiyatlari

Umuman olganda, biron bir kichik narsadan tashqari, biron bir funksiya yoki usulni dekorator bilan almashtirish xavfsizdir. Agar asl funktsiyada `func.calledCount` yoki shunga o'xshash xususiyatlar bo'lsa, dekorator ularni ta'minlamaydi, chunki u o'rovchi. Shuning uchun ulardan foydalanishda ehtiyot bo'lish kerak.

Masalan, yuqoridagi misolda agar `slow` funksiyasi har qanday xususiyatga ega bo'lsa, `cachingDecorator(slow)` ularsiz o'rovchi hisoblanadi.

Ba'zi dekoratorlar o'z xususiyatlarini taqdim etishlari mumkin. Masalan, dekorator funktsiya necha marta chaqirilganini va qancha vaqt ketganini hisoblashi va bu ma'lumotni o'rovchi xususiyatlari orqali ochishi mumkin.

Funksiya xususiyatlariga kirishni saqlaydigan dekoratorlarni yaratish usuli mavjud, ammo bu funksiyani o'rash uchun maxsus `Proxy` obyektidan foydalanishni talab qiladi. Bu haqda keyinroq <info:proxy#proxy-apply> maqolasida muhokama qilamiz.

## Xulosa

_Dekorator_ funksiyaning harakatini o'zgartiruvchi o'rovchidir. Asosiy ish hali ham funksiya tomonidan amalga oshiriladi.

Dekoratorlar funksiyaga qo'shilishi mumkin bo'lgan "xususiyatlar" yoki "aspektlar" sifatida qaralishi mumkin. Biz bitta yoki bittadan ko'p dekorator qo'sha olamiz va bularning barchasining kodini o'zgartirmasdan bajarishimiz lozim!

`cashDecorator` ni amalga oshirish uchun biz metodlarni o'rganib chiqdik:

- [func.call(context, arg1, arg2...)](mdn:js/Function/call) -- berilgan kontekst va argumentlar bilan `func` ni chaqiradi.
- [func.apply(context, args)](mdn:js/Function/apply) -- `context`ni `this` va massivga o'xshash `arg` larni argumentlar ro'yxatiga o'tkazish orqali `func`ni chaqiradi.

Umumiy _call forwarding_ odatda `apply` bilan amalga oshiriladi:

```js
let wrapper = function () {
  return original.apply(this, arguments);
};
```

Biz obyektdan usul olib, uni boshqa obyekt kontekstida "chaqirayotganimizda" _metod qarz olish_ misolini ham ko'rdik. Massiv usullarini olish va ularni `arguments` ga qo'llash juda keng tarqalgan. Muqobil variant - haqiqiy massiv bo'lgan qolgan parametrlar obyektidan foydalanishdir.

Yovvoyi tabiatda ko'plab dekorativlar bor. Ushbu bobdagi vazifalarini bajarish orqali ularni qanchalik yaxshi o'rganganingizni tekshiring.
