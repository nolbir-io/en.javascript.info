# Proxy va Reflect

`Proxy` obyekti boshqa obyektni o'raydi, o'qish/yozish xususiyatlari va boshqa operatsiyalarni to'xtatadi hamda ixtiyoriy ravishda ularni mustaqil ravishda boshqarish yoki obyektga ularni boshqarishga shaffof ruxsat beradi.

Proksi-serverlar ko'plab kutubxonalarda va ba'zi brauzer ramkalarida qo'llaniladi. Ushbu maqolada biz ko'plab amaliy dasturlarni ko'rib chiqamiz.

## Proxy

Sintaksis:

```js
let proxy = new Proxy(target, handler)
```

- `target` -- o'rash uchun obyekt hisoblanib, har qanday narsa, jumladan, funksiyalar ham bo'lishi mumkin.
- `handler` -- proksi-server konfiguratsiyasi: "tuzoqlarga" ega obyekt, operatsiyalarni to'xtatuvchi usullardan biri - masalan, `target` xususiyatini o'qish uchun `get` trap, `target`ga xususiyat yozish uchun `set` trap kerak va hokazo.

`Proxy` bo'yicha operatsiyalar uchun, agar `handler`da mos keladigan trap bo'lsa, u ishlaydi va proksi-server uni boshqarish imkoniyatiga ega bo'ladi, aks holda operatsiya `target` bo'yicha amalga oshiriladi.

Boshlang'ich misol sifatida, keling, hech qanday tuzoqsiz proxy yarataylik:

```js run
let target = {};
let proxy = new Proxy(target, {}); // bo'sh handler

proxy.test = 5; // proxy yozish (1)
alert(target.test); // 5, target da xususiyat paydo bo'ldi!

alert(proxy.test); // 5, biz uni proksi-serverdan ham o'qishimiz mumkin (2)

for(let key in proxy) alert(key); // test, takrorlash ishlari (3)
```

Hech qanday tuzoq yo'qligi sababli, `proxy` dagi barcha operatsiyalar `target` ga yo'naltiriladi.

1. `proxy.test=` yozish operatsiyasi `target` bo'yicha qiymatni o'rnatadi.
2. `Proxy.test` o'qish operatsiyasi `target` qiymatini qaytaradi.
3. `Proxy` ustidan takrorlash `target` dan qiymatlarni qaytaradi.

Ko'rib turganimizdek, hech qanday tuzoqsiz `proxy` `target` atrofida shaffof o'ramdir.

![](proxy.svg)

`Proxy` - bu maxsus "ekzotik obyekt". Uning o'ziga xos xususiyatlari yo'q. Bo'sh `handler` bilan operatsiyalarni shaffof tarzda `target` ga yo'naltiradi.

Qo'shimcha imkoniyatlarni faollashtirish uchun tuzoqlarni qo'shamiz.

Biz ular bilan nima qilishimiz mumkin?

Obyektlardagi ko'pgina operatsiyalar uchun JavaScript spetsifikatsiyasida uning eng past darajada qanday ishlashini tavsiflovchi "ichki usul" mavjud. Masalan, `[[Get]]`, xususiyatni o'qishning ichki usuli, `[[Set]]`, xususiyatni yozishning ichki usuli va boshqalar. Ushbu usullar faqat spetsifikatsiyada qo'llaniladi, biz ularni to'g'ridan-to'g'ri nom bilan chaqira olmaymiz.

Proksi tuzoqlari ushbu usullarning chaqiruvlarini to'xtatadi. Ular [Proksi spetsifikatsiyasi](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots) va quyidagi jadvalda keltirilgan.

Har bir ichki usul uchun ushbu jadvalda tuzoq mavjud: operatsiyani to'xtatish uchun biz `new proxy` ning `handler` parametriga qo'shishimiz mumkin bo'lgan usulning nomi:

| Ichki metod | Handler metodi | Harakatlanadi, qachonki... |
|-----------------|----------------|-------------|
| `[[Get]]` | `get` | xususiyatni o'qish |
| `[[Set]]` | `set` | xususiyatni yozish |
| `[[HasProperty]]` | `has` | `in` operator |
| `[[Delete]]` | `deleteProperty` | `delete` operator |
| `[[Call]]` | `apply` | funksiya chaqiruvi |
| `[[Construct]]` | `construct` | `new` operator |
| `[[GetPrototypeOf]]` | `getPrototypeOf` | [Object.getPrototypeOf](mdn:/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) |
| `[[SetPrototypeOf]]` | `setPrototypeOf` | [Object.setPrototypeOf](mdn:/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) |
| `[[IsExtensible]]` | `isExtensible` | [Object.isExtensible](mdn:/JavaScript/Reference/Global_Objects/Object/isExtensible) |
| `[[PreventExtensions]]` | `preventExtensions` | [Object.preventExtensions](mdn:/JavaScript/Reference/Global_Objects/Object/preventExtensions) |
| `[[DefineOwnProperty]]` | `defineProperty` | [Object.defineProperty](mdn:/JavaScript/Reference/Global_Objects/Object/defineProperty), [Object.defineProperties](mdn:/JavaScript/Reference/Global_Objects/Object/defineProperties) |
| `[[GetOwnProperty]]` | `getOwnPropertyDescriptor` | [Object.getOwnPropertyDescriptor](mdn:/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor), `for..in`, `Object.keys/values/entries` |
| `[[OwnPropertyKeys]]` | `ownKeys` | [Object.getOwnPropertyNames](mdn:/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames), [Object.getOwnPropertySymbols](mdn:/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols), `for..in`, `Object.keys/values/entries` |

```warn header="Invariantlar"
JavaScript ba'zi invariantlarni qo'llaydi -- shartlar ichki usullar va tuzoqlar bilan bajarilishi kerak.

Ularning aksariyati qaytarish qiymatlari uchundir:
- `[[Set]]` Agar qiymat muvaffaqiyatli yozilgan bo'lsa, `true` ni, aks holda `false` ni qaytarishi kerak.
- `[[Delete]]` Agar qiymat muvaffaqiyatli o'chirilgan bo'lsa, `true` ni, aks holda `false` ni qaytarishi kerak.
- ...va hokazo, biz quyida keltirilgan misollarda ko'proq bilib olamiz.

Boshqa invariantlar ham mavjud, masalan:
- `[[GetPrototypeOf]]`, proksi obyektiga qo'llaniladigan 
`[[GetPrototypeOf]]` proksi-obyektning maqsadli obyektiga qo'llaniladigan qiymatni qaytarishi kerak. Boshqacha qilib aytganda, proksi-serverning prototipini o'qish har doim maqsadli obyektning prototipini qaytarishi kerak.

Tuzoqlar bu operatsiyalarni ushlab turishi mumkin, ammo ular ushbu qoidalarga rioya qilishlari kerak.

Invariantlar til xususiyatlarining to'g'ri va izchil harakatini ta'minlaydi. To'liq invariantlar ro'yxati [spetsifikatsiyada] (https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots) mavjud. Agar siz g'alati ish qilmasangiz, ular buzilmaydi.
```

Keling, bu qanday ishlashini amaliy misollarda ko'rib chiqaylik.

## "Get" tuzog'i bilan standart qiymat

Eng keng tarqalgan tuzoqlar o'qish / yozish xususiyatlari uchundir.

O'qishni to'xtatish uchun `handler` `get (target, property, receiver)` usuliga ega bo'lishi kerak.

Quyidagi argumentlar bilan xususiyat o'qilganda ishga tushadi:

- `target` -- `new proxy` ga birinchi argument sifatida uzatiladigan maqsadli obyekt,
- `property` -- xususiyat nomi,
- `receiver` -- agar maqsadli xususiyat qabul qiluvchi bo'lsa, u holda `receiver` qo'ng'iroqda `this` sifatida foydalaniladigan obyektdir. Odatda bu `proxy` obyektining o'zi (yoki proksi-serverdan meros olsak, undan meros bo'lgan obyekt). Hozir bizga bu dalil kerak emas, shuning uchun keyinroq batafsilroq tushuntiriladi.

Obyekt uchun standart qiymatlarni amalga oshirish uchun `get` dan foydalanamiz.

Biz mavjud bo'lmagan qiymatlar uchun `0` ni qaytaradigan raqamli massiv yaratamiz.

Odatda mavjud bo'lmagan massiv elementini olishga harakat qilganimizda, ular `undefined` bo'ladi, lekin biz o'qishni ushlab turuvchi proksi-serverga oddiy massivni o'rab olamiz va agar bunday xususiyat bo'lmasa, `0` ni qaytaramiz:

```js run
let numbers = [0, 1, 2];

numbers = new Proxy(numbers, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      return 0; // standart qiymat
    }
  }
});

*!*
alert( numbers[1] ); // 1
alert( numbers[123] ); // 0 (bunday element yo'q)
*/!*
```

Ko'rib turganimizdek, `get` tuzog'i bilan buni qilish juda oson.

Biz "default" qiymatlar uchun har qanday mantiqni amalga oshirish maqsadida `Proxy` dan foydalanishimiz mumkin.

Tasavvur qiling, bizda iboralar va ularning tarjimalari mavjud lug'at bor:

```js run
let dictionary = {
  'Hello': 'Hola',
  'Bye': 'Adiós'
};

alert( dictionary['Hello'] ); // Hola
alert( dictionary['Welcome'] ); // undefined
```

Hozirda, agar ibora bo'lmasa, `dictionary` dan o'qish `undefined`ni qaytaradi, lekin amalda iborani tarjimasiz qoldirish odatda `undefined` dan ko'ra yaxshiroqdir. Shunday qilib, keling, u holda `undefined` o'rniga tarjima qilinmagan iborani qaytaraylik.

Bunga erishish uchun biz `dictionary`ni o'qish operatsiyalarini to'xtatuvchi proksi-serverga o'rab olamiz:

```js run
let dictionary = {
  'Hello': 'Hola',
  'Bye': 'Adiós'
};

dictionary = new Proxy(dictionary, {
*!*
  get(target, phrase) { // dictionarydan xususiyatni o'qishni to'xtating
*/!*
    if (phrase in target) { // agar u lug'atda bo'lsa
      return target[phrase]; // tarjimani qaytaring
    } else {
      // aks holda, tarjima qilinmagan iborani qaytaring
      return phrase;
    }
  }
});

// Lug'atdan ixtiyoriy iboralarni qidiring!
// Eng yomoni, ular tarjima qilinmagan.
alert( dictionary['Hello'] ); // Hola
*!*
alert( dictionary['Welcome to Proxy']); // Proksi-serverga xush kelibsiz (tarjimasiz)
*/!*
```

````smart
Iltimos, proksi-server o'zgaruvchining ustiga qanday yozishiga e'tibor bering:

```js
dictionary = new Proxy(dictionary, ...);
```

Proksi-server hamma joyda maqsadli obyektni to'liq almashtirishi kerak. Proksi-serverdan keyin hech kim maqsadli obyektga murojaat qilmasligi lozim. Aks holda chalkashib ketish ehtimoli osonlashadi.
````

## "Set" tuzog'i bilan tasdiqlash

Aytaylik, biz faqat raqamlar uchun massivni xohlaymiz. Agar boshqa turdagi qiymat qo'shilsa, error bo'lishi kerak.

Xususiyat yozilganda `set` tuzog'i ishga tushadi. 

`set(target, property, value, receiver)`:

- `target` -- `new proxy` ga birinchi argument sifatida uzatiladigan maqsadli obyekt,
- `property` -- xususiyat nomi,
- `value` -- xususiyat qiymati,
- `receiver` -- `get` tuzog'iga o'xshash, faqat setter xususiyatlariga tegishli.

`Set` tuzog'i, agar sozlash muvaffaqiyatli bo'lsa, `true` ni, aks holda `false` qiymatini qaytarishi kerak (`TypeError` ni ishga tushiradi).

Keling, undan yangi qiymatlarni tasdiqlash uchun foydalanamiz:

```js run
let numbers = [];

numbers = new Proxy(numbers, { // (*)
*!*
  set(target, prop, val) { // xususiyatni yozishni to'xtatish
*/!*
    if (typeof val == 'number') {
      target[prop] = val;
      return true;
    } else {
      return false;
    }
  }
});

numbers.push(1); // muvaffaqiyatli qo'shildi
numbers.push(2); // muvaffaqiyatli qo'shildi
alert("Length is: " + numbers.length); // 2

*!*
numbers.push("test"); // TypeError (proksi-serverda "set" noto'g'ri chiqdi)
*/!*

alert("Bu qatorga hech qachon yetib bo'lmaydi (yuqoridagi satrda error mavjud)");
```

E'tibor bering: massivlarning o'rnatilgan funksionalligi hali ham ishlamoqda! Qiymatlar `push` (surish) orqali qo'shiladi. Qiymatlar qo'shilganda `length` xususiyati avtomatik ravishda ortadi. Bizning proksi-serverimiz hech narsani buzmaydi.

Cheklarni qo'shish uchun `push` va `unshift` kabi qo'shimcha qiymatli massiv usullarini bekor qilishimiz shart emas, chunki ular ichkarida proksi-server tomonidan to'xtatilgan `[[Set]]` operatsiyasidan foydalanadi.

Shunday qilib, kod aniq va qisqa.

```warn header`` = `true` ni qaytarishni unutmang`
Yuqorida aytib o'tilganidek, o'zgarmaydigan invariant lar mavjud.

Muvaffaqiyatli yozishda `set` uchun `true` qiymatini qaytarish kerak.

Agar biz buni qilishni unutib qo'ysak yoki birorta noto'g'ri qiymatni qaytarsak, operatsiya `TypeError` ni ishga tushiradi.
```

## "ownKeys" va "getOwnPropertyDescriptor" bilan iteratsiya

`Object.keys`, `for..in` sikli va obyekt xususiyatlari bo'yicha takrorlanadigan boshqa ko'plab usullar xususiyatlarning ro'yxatini olish uchun `[[OwnPropertyKeys]]` ichki usulidan (`ownKeys` tuzog'i tomonidan tutiladi) foydalanadi. 

Bunday usullar tafsilotlarda farqlanadi:
- `Object.getOwnPropertyNames(obj)` belgilarsiz kalitlarni qaytaradi.
- `Object.getOwnPropertySymbols(obj)` belgili kalitlarni qaytaradi.
- `Object.keys/values()` belgisi bo'lmagan kalitlarni/qiymatlarni `enumerable` (sonli) bayroq bilan qaytaradi (xususiyat bayroqlari <info:property-descriptors> maqolasida tushuntirilgan).
- `for..in` `sonli` bayrog'i bo'lgan belgisiz tugmalar, shuningdek, prototipli kalitlar ustidan o`tadi.

...Ammo ularning barchasi shu ro'yxat bilan boshlanadi.

Quyidagi misolda biz `for..in` ni `user` ustidan aylanish uchun `ownKeys` tuzog'idan, shuningdek pastki chiziq `_` bilan boshlanadigan xususiyatlarni o'tkazib yuborish uchun `Object.keys` va `Object.values`dan foydalanamiz:

```js run
let user = {
  name: "John",
  age: 30,
  _password: "***"
};

user = new Proxy(user, {
*!*
  ownKeys(target) {
*/!*
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

// "ownKeys" filters out _password
for(let key in user) alert(key); // name, keyin: age

// same effect on these methods:
alert( Object.keys(user) ); // name,age
alert( Object.values(user) ); // John,30
```

Hozircha u ishlaydi.

Agar obyektda mavjud bo'lmagan kalitni qaytarsak, `Object.keys` uni ro'yxatga kiritmaydi:

```js run
let user = { };

user = new Proxy(user, {
*!*
  ownKeys(target) {
*/!*
    return ['a', 'b', 'c'];
  }
});

alert( Object.keys(user) ); // <bo'sh>
```

Nega? Sababi oddiy: `Object.keys` faqat `enumerable` bayrog'i bilan xossalarni qaytaradi. Buni tekshirish uchun u har bir xususiyatni [uning identifikatorini] olish uchun `[[GetOwnProperty]]` ichki usulini chaqiradi (info:property-descriptors). Va bu yerda, hech qanday xususiyat yo'qligi sababli, uning deskriptori bo'sh, `enumerable` bayrog'i yo'q, shuning uchun u o'tkazib yuborilgan.

`Object.keys` xususiyatini qaytarishi uchun u obyektda `enumerable` bayrog'i bilan mavjud bo'lishi kerak yoki biz `[[GetOwnProperty]]`ga qo'ng'iroqlarni to'xtata olamiz (`getOwnPropertyDescriptor` tuzog'i buni amalga oshiradi). `enumerable: true` bilan tavsiflovchini qaytaring.

Quyida shunga doir misolni ko'rib chiqamiz:

```js run
let user = { };

user = new Proxy(user, {
  ownKeys(target) { // mulklar ro'yxatini olish uchun bir marta chaqiriladi
    return ['a', 'b', 'c'];
  },

  getOwnPropertyDescriptor(target, prop) { // har bir xususiyat uchun chaqirildi
    return {
      enumerable: true,
      configurable: true
      /* ...boshqa bayroqlar, ehtimoliy "qiymat:..." */
    };
  }

});

alert( Object.keys(user) ); // a, b, c
```

Yana bir bor eslatib o'tamiz: agar obyektda xususiyat mavjud bo'lmasa, biz faqat `[[GetOwnProperty]]`ni ushlab turishimiz kerak.

## "deleteProperty" va boshqa tuzoqlar bilan himoyalangan xususiyatlar

Pastki chiziqli `_` prefiksli xususiyatlar va usullar ichki ekanligi haqida keng tarqalgan konvensiya mavjud. Ularga obyekt tashqarisidan kirish mumkin emas.

Texnik jihatdan buning iloji bor:

```js run
let user = {
  name: "John",
  _password: "secret"
};

alert(user._password); // secret
```

`_` bilan boshlanadigan xususiyatlarga kirishni oldini olish uchun proksi-serverlardan foydalanamiz.

Bizga quyidagi tuzoqlar kerak bo'ladi:
- `get` - bunday xususiyatni o'qiyotganda xatoga yo'l qo'yish uchun;
- `set`- yozishda xatolarni yo'qotish uchun,
- `deleteProperty`- o'chirishda xatoliklarni yo'qo'tish,
- `ownKeys`- `for..in` dan `_` bilan boshlanadigan xususiyatlarni va `Object.keys` kabi usullarni istisno qilish uchun

```js run
let user = {
  name: "John",
  _password: "***"
};

user = new Proxy(user, {
*!*
  get(target, prop) {
*/!*
    if (prop.startsWith('_')) {
      throw new Error("Ruxsat berilmadi");
    }
    let value = target[prop];
    return (typeof value === 'function') ? value.bind(target) : value; // (*)
  },
*!*
  set(target, prop, val) { // xususiyatni yozishni to'xtatish
*/!*
    if (prop.startsWith('_')) {
      throw new Error("Ruxsat berilmadi");
    } else {
      target[prop] = val;
      return true;
    }
  },
*!*
  deleteProperty(target, prop) { // xususiyatni o'chirishni to'xtatish
*/!*
    if (prop.startsWith('_')) {
      throw new Error("Access denied");
    } else {
      delete target[prop];
      return true;
    }
  },
*!*
  ownKeys(target) { // xususiyat ro'yxatini to'xtatish
*/!*
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

// "get" parolni o'qishga ruxsat bermaydi
try {
  alert(user._password); // Error: Ruxsat berilmadi
} catch(e) { alert(e.message); }

// "set" _password yozishga ruxsat bermaydi
try {
  user._password = "test"; // Error: Ruxsat berilmadi
} catch(e) { alert(e.message); }

// "deleteProperty" parolni o'chirishga ruxsat bermaydi
try {
  delete user._password; // Error: Ruxsat berilmadi
} catch(e) { alert(e.message); }

// "ownKeys" _passwordni filtrlaydi
for(let key in user) alert(key); // name
```
Iltimos, `(*)` qatoridagi `get` tuzog'idagi muhim tafsilotga e'tibor bering:

```js
get(target, prop) {
  // ...
  let value = target[prop];
*!*
  return (typeof value === 'function') ? value.bind(target) : value; // (*)
*/!*
}
```

 Nima uchun bizga `value.bind(target)` ni chaqirish funksiyasi zarur?

Sababi, `user.checkPassword()` kabi obyekt usullari `_password` ga kirish imkoniyatiga ega bo'lishi kerak: 

```js
user = {
  // ...
  checkPassword(value) {
    // obyekt usuli _password o'qiy olishi kerak
    return value === this._password;
  }
}
```


`user.checkPassword()` ga chaqiruv `user`ga `this` (nuqtadan oldingi obyekt `this` bo'ladi) sifatida proksilangan bo'ladi, shuning uchun u `this._password` ga kirishga harakat qilganda `get` tuzog'i faollashadi (u o'qilgan har qanday xususiyatni ishga tushiradi) va xatoni yo'qotadi.

Shunday qilib, biz obyekt usullari kontekstini `(*)` qatoridagi `target` asl obyektiga bog'laymiz. Keyin ularning kelajakdagi qo'ng'iroqlari hech qanday tuzoqsiz `target` dan `this` sifatida foydalanadi.

Bu yechim odatda ishlaydi, lekin ideal darajada emas, chunki usul proksisiz obyektni boshqa joyga o'tkazib yuborishi, keyin biz asl va proksilangan obyekt qayerda deb biroz adashishimiz mumkin. 

Bundan tashqari, obyekt bir necha marta proksilangan bo'lishi mumkin (ko'plab proksi-serverlar obyektga turli xil "tweaks" qo'shadi) va agar biz o'ralgan obyektni usulga o'tkazsak, kutilmagan oqibatlarga olib keladi.

Shunday qilib, bunday proksi-server hamma joyda qo'llanilmasligi kerak.

```smart header="Class ning shaxsiy xususiyatlari"
Zamonaviy JavaScript dvigatellari `#` prefiksli sinflardagi shaxsiy xususiyatlarni qo'llab-quvvatlaydi. Ular <info:private-protected-properties-methods> maqolasida tasvirlangan. Proksi-server talab qilinmaydi.

Bunday xususiyatlarning o'ziga xos muammolari bor. Xususan, ular meros qilib olinmaydi.
```

## "has" qopqonli "in range"

Keling, ko'proq misollarni ko'rib chiqamiz.

Bizda range, ya'ni diapazon obyekti bor:

```js
let range = {
  start: 1,
  end: 10
};
```

Raqamning `range`da ekanligini tekshirish uchun `in` operatoridan foydalanmoqchimiz.

`has` tuzog'i `in` qo'ng'iroqlarini ushlab turadi.

`has(target, property)`

- `target` -- `new Proxy`ga birinchi argument sifatida uzatiladigan maqsadli obyekt,
- `property` -- xususiyat nomi

Quyida misol keltirilgan:

```js run
let range = {
  start: 1,
  end: 10
};

range = new Proxy(range, {
*!*
  has(target, prop) {
*/!*
    return prop >= target.start && prop <= target.end;
  }
});

*!*
alert(5 in range); // true
alert(50 in range); // false
*/!*
```

Yaxshi sintaktik sugar, ya'ni shakar, shunday emasmi? Va amalga oshirish ham juda oddiy.
## Wrapping, ya'ni o'rash funksiyalari: "apply" [#proxy-apply]

Biz proksi-serverni funksiya atrofida ham o'rashimiz mumkin. 

`apply(target, thisArg, args)` tuzog'i proksi-serverni funksiya sifatida chaqirishni boshqaradi:

- `target` - maqsadli obyekt (funktsiya JavaScriptdagi obyekt),
- `thisArg` esa `this` ning qiymati.
- `args` argumentlar ro'yxatidir.

Masalan, <info:call-apply-decorators> maqolasida qilgan `delay(f, ms)` dekoratorini eslaylik.

Ushbu maqolada biz buni proksisiz bajardik. `delay(f, ms)` ga qo'ng'iroq barcha qo'ng'iroqlarni `ms` millisekunddan keyin `f` ga yo'naltiruvchi funksiyani qaytardi.

Mana quyida oldingi funksiyaga asoslangan dastur berilgan:

```js run
function delay(f, ms) {
  // vaqt tugashidan keyin f ga qo'ng'iroqni o'tkazadigan o'ramni qaytaring
  return function() { // (*)
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// bu o'rashdan so'ng, sayHi qo'ng'iroqlari 3 soniyaga kechiktiriladi
sayHi = delay(sayHi, 3000);

sayHi("John"); // Hello, John! (3 soniyadan keyin)
```

Ko'rib turganimizdek, bu ko'p hollarda ishlaydi. `(*)` o'rash funksiyasi qo'ng'iroqni kutish vaqti tugaganidan keyin amalga oshiradi.

Lekin o'rash funksiyasi xususiyatni o'qish/yozish operatsiyalarini yoki boshqa narsalarni uzatmaydi. O'rashdan so'ng, `name`, `length` va boshqalar kabi asl funktsiyalarning xususiyatlariga kirish yo'qoladi:

```js run
function delay(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

*!*
alert(sayHi.length); // 1 (funksiya uzunligi - bu deklaratsiyada hisobga olinadigan argumentlar)
*/!*

sayHi = delay(sayHi, 3000);

*!*
alert(sayHi.length); // 0 (o'rash deklaratsiyasida nol argumentlar mavjud)
*/!*
```

`Proxy` ancha kuchliroq, chunki u hamma narsani maqsadli obyektga yo'naltiradi.

O'rash funksiyasi o'rniga `Proxy` dan foydalanamiz:

```js run
function delay(f, ms) {
  return new Proxy(f, {
    apply(target, thisArg, args) {
      setTimeout(() => target.apply(thisArg, args), ms);
    }
  });
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

sayHi = delay(sayHi, 3000);

*!*
alert(sayHi.length); // 1 (*) proksi-server "uzunlikni olish" operatsiyasini maqsadga yo'naltiradi
*/!*

sayHi("John"); // Hello, John! (3 soniyadan keyin)
```

Natija bir xil, ammo endi nafaqat qo'ng'iroqlar, balki proxy-serverdagi barcha operatsiyalar asl funksiyaga yo'naltiriladi. Shunday qilib, `sayHi.length` `(*)` qatoriga o'ralganidan keyin to'g'ri qaytariladi. 

Bizda "boyroq" o'ram bor.

Boshqa tuzoqlar ham mavjud: to'liq ro'yxat ushbu maqolaning boshida berilgan. Ulardan foydalanish sxemasi yuqoridagiga o'xshaydi.

## Reflect (aks ettirish)

`Reflect` o'rnatilgan obyekt bo'lib, `Proxy`ning yaratilishini osonlashtiradi.

`[[Get]]`, `[[Set]]` va boshqalar kabi ichki usullar faqat spetsifikatsiya bo'lib, ularni to'g'ridan-to'g'ri chaqirib bo'lmaydi, deb ilgari aytilgan edi.

`Reflect` obyekti bunga biroz imkon beradi. Uning usullari ichki usullar atrofida minimal o'rashlardan iborat.

Mana, xuddi shunday bajaradigan operatsiyalar va `Reflect` chaqiruvlariga misollar:

| Operation |  `Reflect` chaqiruvi | Ichki usul |
|-----------------|----------------|-------------|
| `obj[prop]` | `Reflect.get(obj, prop)` | `[[Get]]` |
| `obj[prop] = value` | `Reflect.set(obj, prop, value)` | `[[Set]]` |
| `delete obj[prop]` | `Reflect.deleteProperty(obj, prop)` | `[[Delete]]` |
| `new F(value)` | `Reflect.construct(F, value)` | `[[Construct]]` |
| ... | ... | ... |

Masalan:

```js run
let user = {};

Reflect.set(user, 'name', 'John');

alert(user.name); // John
```

Xususan, `Reflect` operatorlarni (`new`, `delete`...) funksiya sifatida chaqirish imkonini beradi (`Reflect.construct`, `Reflect.deleteProperty`, ...). Bu qiziqarli qobiliyat, lekin bu yerda yana bir muhim narsa bor. 

**`Proxy` tomonidan tutib olinadigan har bir ichki usul uchun `Reflect` da `Proxy` tuzog'i bilan bir xil nom va argumentlarga ega mos keladigan usul mavjud.**

Shunday qilib, operatsiyani asl obyektga yo'naltirish uchun `Reflect` dan foydalanishimiz mumkin. 

Ushbu misolda ikkala `get` va `set` shaffof tarzda (go'yo ular mavjud emasdek) o'qish/yozish operatsiyalarini obyektga yo'naltiradi va xabarni ko'rsatadi:

```js run
let user = {
  name: "John",
};

user = new Proxy(user, {
  get(target, prop, receiver) {
    alert(`GET ${prop}`);
*!*
    return Reflect.get(target, prop, receiver); // (1)
*/!*
  },
  set(target, prop, val, receiver) {
    alert(`SET ${prop}=${val}`);
*!*
    return Reflect.set(target, prop, val, receiver); // (2)
*/!*
  }
});

let name = user.name; // "GET name" ni ko'rsatadi
user.name = "Pete"; // "SET name=Pete" ni ko'rsatadi
```

Quyidagilarni eslab qolamiz:

- `Reflect.get` obyekt xususiyatini o'qiydi
- `Reflect.set` obyekt xususiyatini yozadi va agar muvaffaqiyatli bo'lsa `true`, aks holda `false` ni qaytaradi.

Hamma narsa oddiy, ya'ni: agar tuzoq qo'ng'iroqni obyektga yo'naltirmoqchi bo'lsa, xuddi shu argumentlar bilan `Reflect.<metod>` ni chaqirish kifoya.

Aksariyat hollarda biz `Reflect`siz ham xuddi shunday qilishimiz mumkin, masalan, `Reflect.get(target, prop, receiver)` xususiyatini o'qish `target[prop]` bilan almashtirilishi mumkin. Biroq, muhim nyuanslar ham mavjud.

### Getterni proksilash

Keling, `Reflect.get` nima uchun yaxshiroq ekanligini ko'rsatadigan misolni ko'rib chiqaylik. Bundan tashqari, nima uchun `get/set` ning biz ilgari ishlatmagan uchinchi `receiver`, ya'ni qabul qiluvchi argumenti borligini ham bilib olamiz. 

Bizda `_name` xususiyatiga ega `user` obyekti va uning oluvchisi bor.

Uning atrofida proxy mavjud:

```js run
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

*!*
let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop];
  }
});
*/!*

alert(userProxy.name); // Guest
```

Bu yerda `get` tuzog'i "shaffof" bo'lib, u asl xususiyatni qaytaradi va boshqa hech narsa qilmaydi. Bizning misolimiz uchun bu yetarli.

Bizga hammasi yaxshidek tuyilyapti. Ammo keling, misolni biroz murakkablashtiramiz. 

`User` dan boshqa `admin` obyektini meros qilib olgandan so'ng, biz noto'g'ri xatti-harakatni kuzatishimiz mumkin:

```js run
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop]; // (*) target = user
  }
});

*!*
let admin = {
  __proto__: userProxy,
  _name: "Admin"
};

// Expected: Admin
alert(admin.name); // outputs: Guest (?!?)
*/!*
```

`admin.name` ni o'qish lozim, `"Guest"` ni emas, `"Admin"`ni qaytarishi kerak!

Nima bo'ldi? Balki biz meros bilan noto'g'ri ish qilgandirmiz?

Ammo proxyni olib tashlasak, hamma narsa kutilganidek ishlaydi.

Muammo aslida proxydagi `(*)` qatorida.

1. Biz `admin.name`ni o'qiganimizda, `admin` obyektining o'ziga xos xususiyati yo'qligi sababli, qidiruv uning prototipiga o'tadi.
2. `userProxy` prototip hisoblanadi.
3. Proxydan `name` xususiyatini o'qiyotganda, uning `get` tuzog'i ishga tushiriladi va uni `(*)` qatorida `target[prop]` sifatida asl obyektdan qaytaradi.

    `target[prop]`ga qo'ng'iroq, `prop` oluvchi bo'lsa, o'z kodini `this=target` kontekstida ishga tushiradi. Demak, natija asl obyekt `target`dan `thhis._name`, ya'ni: `user`dan olinadi.

Bunday vaziyatlarni tuzatish uchun bizga `receiver`, ya'ni qabul qiluvchi, `get` trapning uchinchi argumenti kerak. Bu oluvchiga uzatiladigan to'g'ri `this`ni saqlaydi. Bizning holatlarimizda bu `admin` hisoblanadi.

Getter uchun kontekstni qanday o'tkazish kerak? Muntazam funktsiya uchun biz `call/apply` dan foydalanishimiz mumkin, lekin bu qabul qiluvchi "chaqirilmaydi", shunchaki unga kirish mumkin.

`Reflect.get` buni qila oladi. Agar biz undan foydalansak, hamma narsa to'g'ri ishlaydi.

Mana tuzatilgan variant:

```js run
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) { // receiver = admin
*!*
    return Reflect.get(target, prop, receiver); // (*)
*/!*
  }
});


let admin = {
  __proto__: userProxy,
  _name: "Admin"
};

*!*
alert(admin.name); // Admin
*/!*
```

Endi to'g'ri `this` (ya'ni `admin`) ga havolani saqlaydigan `receiver` `(*)` qatoridagi `Reflect.get` yordamida qabul qiluvchiga uzatiladi.

Biz trapni qisqaroq qilib qayta yozishimiz mumkin:
```js
get(target, prop, receiver) {
  return Reflect.get(*!*...arguments*/!*);
}
```


`Reflect` qo'ng'iroqlari tuzoqlar bilan bir xil nomlanadi va bir xil argumentlarni qabul qiladi. Ular shu tarzda maxsus ishlab chiqilgan.

Shunday qilib, `Return Reflect...` operatsiyani oldinga siljitish va bu bilan bog'liq hech narsani unutmasligimiz uchun xavfsiz bo'lish imkonini beradi.

## Proxy cheklovlari

Proxylar mavjud obyektlarning xatti-harakatlarini eng past darajada o'zgartirish yoki sozlashning noyob usulini ta'minlaydi. Shunga qaramay, u mukammal emas, ba'zi cheklovlar mavjud. 

### O'rnatilgan obyektlar: Ichki slotlar (uyalar)

Ko'pgina o'rnatilgan obyektlar, masalan, `Map`, `Set`, `Data`, `Promise` va boshqalar "ichki slot"lardan foydalanadi.

Bu xususiyatlarga o'xshash, lekin faqat ichki spetsifikatsiya maqsadlari uchun ajratilgan. Masalan, `Map` elementlarni ``[[MapData]]`` ichki uyasiga saqlaydi. O'rnatilgan usullar ularga `[[Get]]/[[Set]]` ichki usullari orqali emas, balki bevosita kirishadi. Shunday qilib, `Proxy` buni to'xtata olmaydi. 

Nima uchun xavotirlanasiz? Ular baribir ichki usullar!

Xo'sh, masalani ko'rib chiqamiz. Bunday o'rnatilgan obyekt proxyga ulangandan so'ng, proxyda bunday ichki slotlar yo'q, shuning uchun o'rnatilgan usullar muvaffaqiyatsiz bo'ladi. 

Masalan:

```js run
let map = new Map();

let proxy = new Proxy(map, {});

*!*
proxy.set('test', 1); // Error
*/!*
```

Ichkarida `Map` barcha ma'lumotlarni o'zining ``[[MapData]]`` ichki uyasida saqlaydi. Proxyda bunday slot yo'q. [built-in method `Map.prototype.set`](https://tc39.es/ecma262/#sec-map.prototype.set) usuli `this.[[MapData]]` ichki xususiyatga kirishga harakat qiladi, lekin `this=proxy` bo'lgani uchun uni `proxy` ichida topa olmadi va shunchaki bajarilmadi.

Yaxshiyamki, uni tuzatishning bir yo'li bor:

```js run
let map = new Map();

let proxy = new Proxy(map, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
*!*
    return typeof value == 'function' ? value.bind(target) : value;
*/!*
  }
});

proxy.set('test', 1);
alert(proxy.get('test')); // 1 (ishlaydi!)
```

Endi u yaxshi ishlaydi, chunki `get` trap `map.set` kabi funksiya xususiyatlarini maqsadli obyektning (`map`) o'ziga bog'laydi.

Oldingi misoldan farqli o'laroq, `proxy.set(...)` ichidagi `this` qiymati `proxy` emas, balki asl `map` bo'ladi. Shunday qilib, `set` ning ichki ilovasi `this.[[MapData]]` ichki uyasiga kirishga harakat qilsa, u muvaffaqiyatli bo'ladi.

```smart header="` `Array` da hech qanday ichki slot mavjud emas"
E'tiborli istisno: o'rnatilgan `Array` ichki slotlardan foydalanmaydi. Bu tarixiy sabablarga ko'ra juda uzoq vaqt oldin paydo bo'lgan. 

Shunday qilib, arrayni proksilashda bunday muammo yo'q.
```

### Shaxsiy maydonlar

Xuddi shunday holat shaxsiy klass maydonlari bilan sodir bo'ladi.

Misol uchun, `getName()` usuli xususiy `#name` xususiyatiga kiradi va proxydan keyin uziladi:

```js run
class User {
  #name = "Guest";

  getName() {
    return this.#name;
  }
}

let user = new User();

user = new Proxy(user, {});

*!*
alert(user.getName()); // Error
*/!*
```

Buning sababi shundaki, shaxsiy maydonlar ichki slotlar yordamida amalga oshiriladi. JavaScript ularga kirishda `[[Get]]/[[Set]]`dan foydalanmaydi.

`getName()` chaqiruvida `this` qiymati proxylangan `user` bo'lib, unda shaxsiy maydonlari mavjud bo'lgan slot yo'q.

Yana bir bor, usulni bog'lash bilan yechim uni ishlatadi:

```js run
class User {
  #name = "Guest";

  getName() {
    return this.#name;
  }
}

let user = new User();

user = new Proxy(user, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
    return typeof value == 'function' ? value.bind(target) : value;
  }
});

alert(user.getName()); // Guest
```

Yuqorida aytib o'tilganidek, yechimning kamchiliklari ham bor: u asl obyektni usulga ochib beradi, bu esa uni yanada ko'proq o'tkazishga imkon beradi va boshqa proxylangan funksiyalarni buzadi.

### Proxy != target

Proxy va asl obyekt turli obyektlardir. Bu tabiiy hol, to'g'rimi?

Shunday qilib, agar biz asl obyektni kalit sifatida ishlatsak va keyin uni proxylasak, keyin proxyni topib bo'lmaydi:

```js run
let allUsers = new Set();

class User {
  constructor(name) {
    this.name = name;
    allUsers.add(this);
  }
}

let user = new User("John");

alert(allUsers.has(user)); // true

user = new Proxy(user, {});

*!*
alert(allUsers.has(user)); // false
*/!*
```

Ko'rib turganimizdek, proksi-serverdan so'ng biz `allUsers` to'plamida `user` ni topa olmaymiz, chunki proxy boshqa obyektdir.

```warn header="Proxylar qat'iy tenglik testini to'xtata olmaydi `===`"
Proxylar ko'plab operatorlarni to'xtatib qo'yishi mumkin, masalan, `new` (`construct` bilan), `in` (`has` bilan), `delete` (`deleteProperty` bilan) va boshqalar.

Ammo obyektlar uchun qat'iy tenglik testini to'xtatib turishning iloji yo'q. Obyekt qat'iy ravishda faqat o'ziga teng va boshqa qiymat mavjud emas.

Shunday qilib, obyektlarni tenglik uchun taqqoslaydigan barcha operatsiyalar va o'rnatilgan sinflar obyekt va proksi-server o'rtasida farqlanadi. Bu yerda shaffof almashtirish yo'q.
```

## Qaytarib olinadigan proxylar

*Revocable* proxy o'chirib qo'yilishi mumkin bo'lgan proxydir.

Aytaylik, bizda resurs bor va istalgan vaqtda unga kirishn imkonini yopishni xohlaymiz.

Biz qila oladigan narsa, uni hech qanday tuzoqsiz, qaytarib olinadigan proxyga o'rashdir. Bunday proxy operatsiyalarni obyektga yo'naltiradi va biz uni istalgan vaqtda o'chirib qo'yishimiz mumkin.

Sintaksis:

```js
let {proxy, revoke} = Proxy.revocable(target, handler)
```

Qo'ng'iroq uni o'chirish uchun `proxy` va `revoke` funksiyasiga ega obyektni qaytaradi.

Masalan:

```js run
let object = {
  data: "Valuable data"
};

let {proxy, revoke} = Proxy.revocable(object, {});

// obyekt o'rniga proxyni biror joyga o'tkazing ...
alert(proxy.data); // Qimmatli ma'lumotlar

// keyinroq bizning kodimizda
revoke();

// proxy endi ishlamayapti (bekor qilingan)
alert(proxy.data); // Error
```

`Revoke()` ga qo'ng'iroq proxydan maqsadli obyektga barcha ichki havolalarni olib tashlaydi, shuning uchun ular endi ulanmagan hisoblanadi. 

Dastlab, `revoke` `proxy` dan alohida bo'lib, biz `revoke` ni joriy doirada qoldirib, `proxy` ni o'tkazamiz.

Shuningdek, biz `revoke` usulini proksi-serverga `proxy.revoke = revoke` belgilash orqali bog'lashimiz mumkin.

Boshqa variant esa, proxy uchun `revoke` ni osongina topish imkonini beruvchi kalit sifatida `revoke` va qiymat sifatida `revoke` ga ega `WeakMap` ni yaratishdir:

```js run
*!*
let revokes = new WeakMap();
*/!*

let object = {
  data: "Valuable data"
};

let {proxy, revoke} = Proxy.revocable(object, {});

revokes.set(proxy, revoke);

// ..bizning kodimizda boshqa joyda ..
revoke = revokes.get(proxy);
revoke();

alert(proxy.data); // Error (bekor qilindi)
```

Bu yerda `Map` o'rniga `WeakMap` dan foydalanamiz, chunki u axlat yig'ishni to'sib qo'ymaydi. Agar proxy obyekti "unreachable" (yetishib bo'lmaydigan) bo'lib qolsa (masalan, boshqa hech qanday o'zgaruvchi unga havola qilmasa), `WeakMap` uni `Revoke` bilan birga xotiradan o'chirishga imkon beradi va u endi bizga kerak bo'lmaydi.

## Havolalar

- Spesifikatsiya: [Proxy](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots).
- MDN: [Proxy](mdn:/JavaScript/Reference/Global_Objects/Proxy).

## Xulosa

`Proxy` - obyekt atrofidagi o'ram bo'lib, u ustidagi operatsiyalarni obyektga yo'naltiradi va ixtiyoriy ravishda ulardan ba'zilarini ushlab turadi.

U har qanday obyektni, jumladan, sinflar va funksiyalarni o'rashi mumkin.

Sintaksis:

```js
let proxy = new Proxy(target, {
  /* traps */
});
```

...Keyin hamma joyda `target` o'rniga `proxy` dan foydalanishimiz kerak. Proxyning o'ziga xos xususiyatlari yoki usullari yo'q. Agar trap, ya'ni tuzoq ta'minlangan bo'lsa, u operatsiyani ushlab turadi, aks holda uni `target` obyektiga yo'naltiradi.

Biz quyidagilarni trap qilishimiz mumkin:
- O'qish (`get`), yozish (`set`), xususiyatni o'chirish (`deleteProperty`) (hatto hali mavjud bo'lmasa ham).
- Funksiyani chaqirish (`apply` trap).
- `new` operatori (`construct` trap).
- Ko'pgina boshqa operatsiyalar (to'liq ro'yxat maqolaning boshida va [docs] (mdn:/JavaScript/Reference/Global_Objects/Proksi) da berilgan).

Bu bizga "virtual" xususiyatlar va usullarni yaratish, standart qiymatlarni, kuzatilishi mumkin bo'lgan obyektlarni, funksiya dekoratorlarini va boshqalarni amalga oshirish imkonini beradi.

Shuningdek, biz obyektni turli xil proxylarga bir necha marta o'rashimiz va uni turli xil funksional jihatlar bilan bezashimiz mumkin.

[Reflect](mdn:/JavaScript/Reference/Global_Objects/Reflect) API [Proxy](mdn:/JavaScript/Reference/Global_Objects/Proksi) ni to'ldirish uchun mo'ljallangan. Har qanday `Proxy` tuzog'i uchun bir xil argumentlarga ega `Reflect` chaqiruvi mavjud. Biz ulardan qo'ng'iroqlarni maqsadli obyektlarga yo'naltirish uchun ishlatishimiz kerak.

Proxylarda ba'zi cheklovlar mavjud:

- O'rnatilgan obyektlarda "ichki slotlar" mavjud bo'lib, ularga kirishni proxy orqali ulash mumkin emas. Yuqoridagi vaqtinchalik yechimga qarang.
- Xuddi shu narsa xususiy klass maydonlari uchun ham amal qiladi, chunki ular slotlar yordamida ichki tarzda amalga oshiriladi. Shunday qilib, proxylangan usul qo'ng'iroqlari ularga kirish uchun maqsadli obyektga ega bo'lishi kerak.
- `===` obyekt tengligi testlarini tutib bo'lmaydi.
- Ishlash: ko'rsatkichlar dvigatelga bog'liq, lekin odatda eng oddiy proxy yordamida mulkka kirish bir necha baravar ko'proq vaqtni oladi. Amalda, bu faqat ba'zi "bottleneck", ya'ni torbo'yli obyektlar uchun ahamiyatga ega.
