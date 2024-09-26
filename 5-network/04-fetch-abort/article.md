
# Fetch: Abort (Bekor qilish)

Ma'lumki, `fetch` promiseni qaytaradi. Va JavaScriptda umuman promiseni "aborting", ya'ni bekor qilish tushunchasi yo'q. Masalan, agar bizning saytimizdagi foydalanuvchi harakatlari `fetch` endi kerak emasligini ko'rsatsa, qanday qilib davom etayotgan `fetch` ni bekor qilishimiz mumkin?

Bunday maqsadlar uchun maxsus o'rnatilgan `AbortController` obyekti mavjud. U nafaqat `fetch` ni, balki boshqa asinxron vazifalarni ham bekor qilish uchun ishlatilishi mumkin.

Undan foydalanish juda oddiy:

## AbortController obyekti

Controller, ya'ni tekshirish moslamasini yarating:

```js
let controller = new AbortController();
```

Controller moslamasi juda oddiy obyektdir.

- U yagona `abort()` usuliga ega,
- Va voqea tinglovchilarini o'rnatishga imkon beruvchi yagona xususiyat `signal` ga ham ega.

`abort()` chaqirilgan vaqtda:
- `controller.signal` `"abort"` eventini chiqaradi.
- `controller.signal.aborted` xususiyati `true` ga aylanadi.

Umuman olganda, jarayonda bizda ikki tomon bor:
1. Bekor qilish mumkin bo'lgan operatsiyani bajaradigan `controller.signal` ga tinglovchini o'rnatadi.
2. Bekor qiluvchi kerak bo'lganda `controller.abort()` ni chaqiradi.

Mana to'liq misol (hali `fetch`siz):

```js run
let controller = new AbortController();
let signal = controller.signal;

// Bekor qilinadigan operatsiyani bajaradigan tomon
// "signal" obyektini oladi
// va controller.abort() chaqirilganda tinglovchini ishga tushirishga sozlaydi
signal.addEventListener('abort', () => alert("abort!"));

// Boshqa tomon bekor qilishi mumkin (keyinchalik istalgan vaqtda):
controller.abort(); // abort!

// Event trigger ishga tushadi va signal.aborted true bo'ladi
alert(signal.aborted); // true
```

Ko'rib turganimizdek, `AbortController` bu `abort()` chaqirilganda `abort` hodisalarini o'tkazish uchun vositadir.

Biz xuddi shunday eventni o'z kodimizda tinglashda `AbortController` obyektisiz amalga oshirishimiz mumkin.

Eng muhimi shundaki, `fetch` `AbortController` obyekti bilan qanday ishlashni biladi. Ikkalasi birlashtirilgan.

## Fetch bilan foydalanish

`fetch` ni bekor qilish uchun `AbortController`ning `signal` xususiyatini `fetch` opsiyasi sifatida o'tkazing:

```js
let controller = new AbortController();
fetch(url, {
  signal: controller.signal
});
```

`Fetch` usuli `AbortController` bilan qanday ishlashni biladi. U `signal` bo'yicha `abort` hodisalarini tinglaydi.

Endi bekor qilish uchun `controller.abort()` ni chaqiring:

```js
controller.abort();
```

Ish tugadi: `fetch` hodisani `signal`dan oladi va so'rovni bekor qiladi.

Qachon qabul qilish to'xtatilsa, uning va'dasi `AbortError` xatosi bilan rad etiladi, shuning uchun biz uni `try..catch` bilan hal qilishimiz kerak. 

Mana, 1 soniyadan so'ng bekor qilingan `fetch` bilan to'liq misol:

```js run async
// 1 soniyada bekor qiling
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch('/article/fetch-abort/demo/hang', {
    signal: controller.signal
  });
} catch(err) {
  if (err.name == 'AbortError') { // handle abort()
    alert("Aborted!");
  } else {
    throw err;
  }
}
```

## AbortController kengaytirilishi mumkin

`AbortController` kengaytirilishi mumkin. Bu bir vaqtning o'zida bir nechta `fetch`ni bekor qilish imkonini beradi.

Mana bir nechta `url`larni parallel ravishda oladigan va ularning barchasini bekor qilish uchun bitta kontrollerdan foydalanadigan kod eskizi:

```js
let urls = [...]; // parallel ravishda olinadigan urllar ro'yxati

let controller = new AbortController();

// fetch promise larning massivi
let fetchJobs = urls.map(url => fetch(url, {
  signal: controller.signal
}));

let results = await Promise.all(fetchJobs);

// agar controller.abort() istalgan joydan chaqirilsa,
// u barcha fetchlarni bekor qiladi
```

Agar bizda `fetch` dan farqli o'z asinxron vazifalarimiz bo'lsa, biz ularni olib tashlash bilan birga to'xtatish uchun bitta `AbortController` dan foydalanishimiz mumkin.

Biz faqat vazifalarimizda uning `abort` hodisasini tinglashimiz kerak:

```js
let urls = [...];
let controller = new AbortController();

let ourJob = new Promise((resolve, reject) => { // bizning vazifalarimiz
  ...
  controller.signal.addEventListener('abort', reject);
});

let fetchJobs = urls.map(url => fetch(url, { // fetches
  signal: controller.signal
}));

// Fetch va bizning vazifalarimizni parallel ravishda kuting
let results = await Promise.all([...fetchJobs, ourJob]);

// agar controller.abort() istalgan joydan chaqirilsa,
// u barcha fetchni va ourJob ni bekor qiladi
```

## Xulosa

- `AbortController` oddiy obyekt bo'lib, `abort()` usuli chaqirilganda o'zining `signal` xususiyatida `abort` hodisasini hosil qiladi (shuningdek, `signal.aborted` ni `true`ga o'rnatadi).
- `fetch` u bilan birlashadi: biz `signal` xususiyatini variant sifatida o'tkazamiz, so'ngra `fetch` uni tinglaydi, shuning uchun `fetch` ni bekor qiladi. 
- Kodimizda `AbortController` dan foydalanishimiz mumkin. "Call `abort()`" -> "listen to `abort` event" o'zaro ta'siri oddiy va universaldir. Biz uni `fetch`siz ham ishlatishimiz mumkin.
