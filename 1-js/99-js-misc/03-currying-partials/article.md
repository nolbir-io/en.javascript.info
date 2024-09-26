libs:
  - lodash

---

# Currying

[Currying](https://en.wikipedia.org/wiki/Currying) funksiyalar bilan ishlashning ilg'or usulidir. U nafaqat JavaScriptda, balki boshqa dasturlash tillarda ham qo'llaniladi.

Currying - funksiyani `f(a, b, c)` deb chaqiriladigan funksiyadan `f(a)(b)(c)` sifatida chaqiriladigan funksiyaga aylantiruvchi funksiyalarni tarjima qilish.

Currying funksiyani chaqirmaydi, shunchaki uni o'zgartiradi.

Keling, nima haqida gapirayotganimizni yaxshiroq tushunish uchun avval bir misolni, keyin esa amaliy qo'llanmalarni ko'rib chiqaylik.

Ikkita argumentli `f` uchun currying ni bajaradigan `carry(f)` yordamchi funksiyasini yaratamiz. Boshqacha qilib aytganda, ikki argumentli `f(a, b)` uchun `curry(f)` uni `f(a)(b)` sifatida ishlaydigan funksiyaga aylantiradi:

```js run
*!*
function curry(f) { // curry(f) currying transformatsiyasini bajaradi
  return function(a) {
    return function(b) {
      return f(a, b);
    };
  };
}
*/!*

// foydalanish
function sum(a, b) {
  return a + b;
}

let curriedSum = curry(sum);

alert( curriedSum(1)(2) ); // 3
```

Ko'rib turganingizdek, amalga oshirish juda oddiy: bu faqat ikkita o'rashdan iborat.
- `Curry(func)` ning natijasi `function(a)` o'ramidir.
- U `curriedSum(1)` kabi chaqirilsa, argument leksik muhitda saqlanadi va yangi o'ramga `function(b)` qaytariladi.
- Keyin bu o'ram argument sifatida `2` bilan chaqiriladi va u chaqiruvni asl `sum` ga uzatadi.

Lodash kutubxonasidan [_.curry](https://lodash.com/docs#curry) kabi currying ning yanada ilg'or ilovalari funksiyani ham normal, ham qisman chaqirish imkonini beruvchi o'ramni qaytaradi:

```js run
function sum(a, b) {
  return a + b;
}

let curriedSum = _.curry(sum); // using _.curry from lodash library

alert( curriedSum(1, 2) ); // 3, odatdagidek chaqirish mumkin
alert( curriedSum(1)(2) ); // 3, qisman chaqiriladi
```

## Currying? Nima uchun?

Currying ning foydali tomonlarini tushunish uchun bizga munosib haqiqiy misol kerak.

Masalan, bizda ma'lumotni formatlaydigan va chiqaradigan `log (date, importance, message)` jurnali funksiyasi mavjud. Haqiqiy loyihalarda bunday funksiyalar tarmoq orqali jurnallarni yuborish kabi juda ko'p foydali xususiyatlarga ega, bu yerda biz `alert` dan foydalanamiz:

```js
function log(date, importance, message) {
  alert(`[${date.getHours()}:${date.getMinutes()}] [${importance}] ${message}`);
}
```

Keling, quyidagi misolni curry qilib ko'ramiz!

```js
log = _.curry(log);
```

Shundan so'ng `log` normal ishlaydi:

```js
log(new Date(), "DEBUG", "some debug"); // log(a, b, c)
```

...Shu bilan birga, curry qilingan shaklda ham ishlaydi:

```js
log(new Date())("DEBUG")("some debug"); // log(a)(b)(c)
```

Endi biz joriy log lar uchun qulaylik funksiyasini osongina yaratishimiz mumkin:

```js
// logNow belgilangan birinchi argumentli jurnalning bir qismi bo'ladi
let logNow = log(new Date());

// use it
logNow("INFO", "message"); // [HH:mm] INFO message
```

Endi `logNow` birinchi argumentga ega bo'lgan `log` dir, boshqacha qilib aytganda, "qisman qo'llaniladigan funksiya" yoki qisqacha aytganda "qisman" deb ataladi.

 Biz oldinga borishimiz va joriy debug log lari uchun qulaylik funksiyasini yaratishimiz mumkin:

```js
let debugNow = logNow("DEBUG");

debugNow("message"); // [HH:mm] DEBUG message
```

Demak:
1. Curryingdan keyin biz hech narsani yo'qotmadik: `log` hali ham odatdagidek chaqirilishi mumkin.
2. Bugungi loglar kabi qisman funksiyalarni osongina yaratishimiz mumkin.

## Kengaytirilgan curry ni amalga oshirish

Tafsilotlar bilan tanishmoqchi bo'lsangiz, biz yuqorida foydalanishimiz mumkin bo'lgan ko'p argumentli funktsiyalar uchun "ilg'or" curry ilovasi keltirilgan.

Bu juda qisqa:

```js
function curry(func) {

  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };

}
```

Foydalanish uchun misollar:

```js
function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

alert( curriedSum(1, 2, 3) ); // 6, odatdagidek chaqirish mumkin
alert( curriedSum(1)(2,3) ); // 6, 1-argumentni curry qilish
alert( curriedSum(1)(2)(3) ); // 6, to'liq currying qilish
```

Yangi `curry` murakkab ko'rinishi mumkin, lekin aslida uni tushunish oson.

`Curry(func)` chaqiruvining natijasi `curried` o'rami bo'lib, u quyidagicha ko'rinadi:

```js
// func - bu o'zgartirish funksiyasi
function curried(...args) {
  if (args.length >= func.length) { // (1)
    return func.apply(this, args);
  } else {
    return function(...args2) { // (2)
      return curried.apply(this, args.concat(args2));
    }
  }
};
```

Uni ishga tushirganimizda ikkita `if` ijro bo'limlari mavjud:

1. Agar o'tkazilgan `args` soni asl funksiyaning ta'rifidagi (`func.length`) bilan bir xil yoki undan ko'p bo'lsa, unga `func.apply` orqali qo'ng'iroqni o'tkazing. 
2. Demak, qisman misol olamiz: biz hozircha `func` ni chaqirmaymiz. Buning o'rniga oldingi argumentlar bilan birga yangi argumentlarni taqdim etgan holda `curried` qayta qo'llaniladigan boshqa o'ram qaytariladi.

Agar biz uni yana chaqirsak, biz yangi qismni (agar yetarli dalillar bo'lmasa) yoki to'liq natijani olamiz.

```smart header="Faqat tuzattilgan uzunlikdagi funksiyalar"
Currying funksiyadan qat'iy argumentlar soni bo'lishini talab qiladi.

`f(...args)` kabi dam olish parametrlaridan foydalanadigan funksiyani bu tarzda o'rnatib bo'lmaydi.
```

```smart header="Currying dan biroz ko'proq"
Ta'rifga ko'ra, currying `sum(a, b, c)`ni `sum(a)(b)(c)` ga aylantirishi kerak.

Ammo JavaScriptda ko'rishning aksariyat ilovalari, ta'riflanganidek, ilg'or: ular funksiyani ko'p argumentli variantda ham chaqirish imkoniyatini saqlab qoladilar. 
```

## Xulosa

*Currying* - `f(a,b,c)` ni `f(a)(b)(c)` sifatida chaqirish mumkin bo'lgan transformatsiya. JavaScript ilovalari odatda funktsiyani an'anaviy tarzda chaqirish imkoniyatini saqlab qoladi va agar argumentlar soni yetarli bo'lmasa, qisman qaytaradi. 

Currying bizga qismlarni osongina olish imkonini beradi. Logging misolida ko'rganimizdek, uchta argumentli universal funksiya `log (date, importance, message)` bir argument (masalan, `log (date)`) yoki ikkita argument (masalan `log(date, importance)`) bilan chaqirilganda bizga qismlarni beradi.
