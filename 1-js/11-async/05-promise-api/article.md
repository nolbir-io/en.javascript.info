# Promise API

`Promise` sinfida oltita statik usul mavjud. Biz bu yerda ulardan foydalanish holatlarini tezda yoritamiz.

## Promise.all

Aytaylik, biz ko'plab va'dalarni parallel ravishda bajarishni xohlaymiz va ularning barchasi tayyor bo'lguncha kutamiz.

Masalan, bir nechta URL-manzillarni parallel ravishda yuklab oling va ular tugagandan so'ng tarkibni qayta ishlang.

`Promise.all` dan aynan shu maqsadda foydalaniladi.

Sintaksis:

```js
let promise = Promise.all(iterable);
```

`Promise.all` iterable ni (odatda, bir qator promise'lar) oladi va yangi promise ni qaytaradi.

Yangi promise barcha sanab o'tilgan promise lar bajarilganda hal bo'ladi va ularning natijalar qatori uning natijasiga aylanadi.

Masalan, quyidagi `Promise.all` 3 soniyadan so'ng o'rnatiladi va natijada `[1, 2, 3]` massiv hosil bo'ladi:

```js run
Promise.all([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
  new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
  new Promise(resolve => setTimeout(() => resolve(3), 1000))  // 3
]).then(alert); // 1,2,3 promise lar tayyor bo'lganda: har bir promise massiv a'zosini qo'shadi
```

E'tibor bering, olingan massiv a'zolarining tartibi uning manba promise lari bilan bir xil. Garchi birinchi promise ni hal qilish eng uzoq vaqt talab qilsa ham, u hali ham natijalar qatorida birinchi o'rinda turadi.

Umumiy hiyla - bu ish ma'lumotlari massivini promiselar qatoriga solish va keyin uni `Promise.all` ga o'rashdan iborat.

Agar bizda bir qator URL manzillari bo'lsa, ularning barchasini quyidagicha olishimiz mumkin:

```js run
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://api.github.com/users/jeresig'
];

// har bir urlni fetch promisega ko'rsating
let requests = urls.map(url => fetch(url));

// Promise.all barcha ishlar hal bo'lguncha kutadi
Promise.all(requests)
  .then(responses => responses.forEach(
    response => alert(`${response.url}: ${response.status}`)
  ));
```

GitHub foydalanuvchilari massivi uchun foydalanuvchi ma'lumotlarini ularning nomlari bo'yicha olishning kattaroq misoli (biz bir qator tovarlarni ularning identifikatorlari bo'yicha olishimiz mumkin, mantiq bir xil):

```js run
let names = ['iliakan', 'remy', 'jeresig'];

let requests = names.map(name => fetch(`https://api.github.com/users/${name}`));

Promise.all(requests)
  .then(responses => {
    // barcha javoblar muvaffaqiyatli hal qilindi
    for(let response of responses) {
      alert(`${response.url}: ${response.status}`); // har bir url uchun 200 ni ko'rsatadi 
    }

    return responses;
  })
  // Ularning mazmunini o'qish uchun javoblar massivini respond.json() qatoriga joylashtiring
  .then(responses => Promise.all(responses.map(r => r.json())))
  // barcha JSON javoblari tahlil qilinadi: "foydalanuvchilar" ularning massivi
  .then(users => users.forEach(user => alert(user.name)));
```

**Agar va'dalardan birortasi rad etilsa, `Promise.all` tomonidan qaytarilgan promise shu xato bilan darhol rad etiladi.**

Masalan:

```js run
Promise.all([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
*!*
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000)),
*/!*
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).catch(alert); // Error: Whoops!
```

Bu yerda ikkinchi promise ikki soniya ichida rad etadi. Bu `Promise.all` ning darhol rad etilishiga olib keladi, shuning uchun `.catch` bajariladi: rad etish xatosi butun `Promise.all` ning natijasiga aylanadi.

```warn header="Error mavjud bo'lsa, boshqa promiselar e'tiborga olinmaydi"
Agar bitta promise rad etilsa, `Promise.all` darhol rad etadi va ro'yxatdagi boshqalarini butunlay unutadi. Ularning natijalari e'tiborga olinmaydi.

Misol uchun, yuqoridagi misoldagi kabi bir nechta `fetch` qo'ng'iroqlari bo'lsa va ulardan biri bajarilmasa, qolganlari bajarishda davom etadi, lekin `Promise.all` ularni boshqa ko'rmaydi. Ular, ehtimol, hal qilinar, lekin ularning natijalari e'tiborga olinmaydi.

`Promise.all` ularni bekor qilish uchun hech narsa qilmaydi, chunki promiselarda "bekor qilish" tushunchasi yo'q. [Boshqa bobda](info:fetch-abort) biz bu borada yordam berishi mumkin boʻlgan `AbortController`ni ko'rib chiqamiz, lekin bu Promise API ning bir qismi emas.
```

````smart header="` "`Promise.all(iterable)`non-promise \"regular\" value ga `iterable` da ruxsat beradi"
Odatda, `Promise.all(...)` takrorlanadigan (ko'p hollarda massiv) promiselarni qabul qiladi. Ammo agar ushbu obyektlardan birortasi promise bo'lmasa, u hosil bo'lgan massivga "xuddi shunday" o'tkaziladi.

Masalan, bu yerda `[1, 2, 3]` natijalarni ko'rishingiz mumkin:

```js run
Promise.all([
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(1), 1000)
  }),
  2,
  3
]).then(alert); // 1, 2, 3
```

Shunday qilib, biz qulay bo'lgan joyda `Promise.all` ga tayyor qiymatlarni o'tkazamiz.
````

## Promise.allSettled

[recent browser="new"]

Har qanday promise rad etilsa, `Promise.all` umuman rad etadi. Bu "hammasi yoki hech narsa" holatlari uchun yaxshi, davom etish uchun *barcha* natijalar muvaffaqiyatli bo'lishi kerak:

```js
Promise.all([
  fetch('/template.html'),
  fetch('/style.css'),
  fetch('/data.json')
]).then(render); // render usuli barcha olingan natijalarni talab qiladi
```

`Promise.allSettled` natijadan qat'iy nazar, barcha promise'lar bajarilishini kutadi. Olingan massiv quyidagilarga ega:

- `{status:"fulfilled", value:result}` muvaffaqiyatli javoblar uchun,
- `{status:"rejected", reason:error}` errorlar uchun.

Misol uchun, biz bir nechta foydalanuvchilar haqida ma'lumot olishni xohlaymiz. Agar bitta so'rov bajarilmasa ham, biz boshqalar bilan qiziqib ko'ramiz.

Keling, `Promise.allSettled` ni ishlatib ko'ramiz:

```js run
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://no-such-url'
];

Promise.allSettled(urls.map(url => fetch(url)))
  .then(results => { // (*)
    results.forEach((result, num) => {
      if (result.status == "fulfilled") {
        alert(`${urls[num]}: ${result.value.status}`);
      }
      if (result.status == "rejected") {
        alert(`${urls[num]}: ${result.reason}`);
      }
    });
  });
```

Yuqoridagi `(*)` qatoridagi `natijalar` quyidagicha bo`ladi:
```js
[
  {status: 'fulfilled', value: ...response...},
  {status: 'fulfilled', value: ...response...},
  {status: 'rejected', reason: ...error obyekti...}
]
```

Shunday qilib, har bir promise uchun biz uning holati va `value/eror` ni olamiz.

### Polyfill

Agar brauzer `Promise.allSettled` ni qo'llab-quvvatlamasa, uni polyfill qilish oson:

```js
if (!Promise.allSettled) {
  const rejectHandler = reason => ({ status: 'rejected', reason });

  const resolveHandler = value => ({ status: 'fulfilled', value });

  Promise.allSettled = function (promises) {
    const convertedPromises = promises.map(p => Promise.resolve(p).then(resolveHandler, rejectHandler));
    return Promise.all(convertedPromises);
  };
}
```

Ushbu kodda `promises.map` kirish qiymatlarini oladi, ularni `p => Promise.resolve(p)` bilan promise larga aylantiradi (va'da qilinmagan taqdirda) va keyin ularning har biriga `.then` ishlov beruvchisini qo'shadi.

Bu ishlov beruvchi muvaffaqiyatli natija `value` `{status:'fulfilled', value}`ga va error `sabab`ini{status:'rejected', reason}`ga aylantiradi. Bu aynan `Promise.allSettled` formati hisoblanadi.

Hatto ulardan ba'zilari rad etsa ham, endi biz `Promise.allSettled` dan *barcha* berilgan va'dalarning natijalarini olish uchun foydalanishimiz mumkin. 

## Promise.race (promise musobaqasi)

`Promise.all` ga o'xshash, lekin faqat birinchi hal qilingan promise kutadi va uning natijasini (yoki errorini) oladi.

Sintaksis:
```js
let promise = Promise.race(iterable);
```

Masalan, bu yerda natija "1" bo'ladi:

```js run
Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1
```

Bu yerda birinchi promise eng tezi edi, shuning uchun natija bo'ldi. Birinchi "wins the race" promisedan so'ng, barcha keyingi natijalar/errorlar e'tiborga olinmaydi.

## Promise.any

`Promise.race`ga o'xshaydi, lekin faqat birinchi bajarilgan promiseni kutadi va uning natijasini oladi. Agar berilgan promiselarning barchasi rad etilsa, qaytarilgan promise[`AggregateError`](mdn:js/AggregateError) bilan rad etiladi - barcha promise errorlarini o'zining `errors` xususiyatida saqlaydigan maxsus error obyekti hisoblanadi.

Sintaksis:

```js
let promise = Promise.any(iterable);
```

Masalan, bu yerda natija "1" bo'ladi:

```js run
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1
```

Bu yerda birinchi promise eng tez edi, lekin u rad etildi, shuning uchun ikkinchi promise natija bo'ldi. Birinchi bajarilgan "wins the race" promisedan so'ng, keyingi barcha natijalar e'tiborga olinmaydi.

Mana, barcha promiselar bajarilmasa, misol:

```js run
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Ouch!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Error!")), 2000))
]).catch(error => {
  console.log(error.constructor.name); // AggregateError
  console.log(error.errors[0]); // Error: Ouch!
  console.log(error.errors[1]); // Error: Error!
});
```

Ko'rib turganingizdek, bajarilmagan promiselar uchun error obyektlari `AggregateError` obyektining "errors" xususiyatida mavjud.

## Promise.resolve/reject

`Promise.resolve` va `Promise.reject` usullari zamonaviy kodda kamdan-kam talab qilinadi, chunki `async/await` sintaksisi (biz uni [birozdan keyin ko‘rib chiqamiz](info:async-await)) ularni biroz eskirishiga sabab bo'ladi.

Biz ularni bu yerda to'liqlik uchun va ba'zi sabablarga ko'ra `async/await` dan foydalana olmaydiganlar uchun ko'rib chiqamiz.

### Promise.resolve

`Promise.resolve(value)` natija `value` bilan hal qilingan promise yaratadi.

Xuddi shunday:

```js
let promise = new Promise(resolve => resolve(value));
```

 Agar funksiya promiseni qaytarishi kutilsa, usul moslik uchun ishlatiladi.

Masalan, quyida joylashgan `loadCached` funksiyasi URL manzilini oladi va uning mazmunini eslab qoladi (keshlaydi). Xuddi shu URL bilan bo'lajak qo'ng'iroqlar uchun u darhol keshdan oldingi tarkibni oladi, lekin bu haqda promise berish uchun `Promise.resolve` dan foydalanadi, shuning uchun qaytarilgan qiymat har doim promise bo'ladi: 

```js
let cache = new Map();

function loadCached(url) {
  if (cache.has(url)) {
*!*
    return Promise.resolve(cache.get(url)); // (*)
*/!*
  }

  return fetch(url)
    .then(response => response.text())
    .then(text => {
      cache.set(url,text);
      return text;
    });
}
```

Biz `loadCached(url).then(...)` ni yozishimiz mumkin, chunki funksiya promiseni qaytarishi kafolatlangan. Biz har doim `loadCached` dan keyin `.then` dan foydalanishimiz mumkin. `(*)` qatoridagi `Promise.resolve` ning maqsadi ham aslida shu.

### Promise.reject

`Promise.reject(error)` `error` bilan rad etilgan promiseni yaratadi.

Xuddi shunday:

```js
let promise = new Promise((resolve, reject) => reject(error));
```

Amalda bu usul deyarli qo'llanilmaydi.

## Xulosa

`Promise` sinfining oltita statik usullari mavjud:

1. `Promise.all(promises)` --barcha promiselarning hal etilishini kutadi va ularning natijalari qatorini qaytaradi. Agar berilgan promiselardan birortasi rad etilsa, bu `Promise.all` erroriga aylanadi va boshqa barcha natijalar e'tiborga olinmaydi.
2. `Promise.allSettled(promises)` (yaqinda qo'shilgan usul) -- barcha promiselarning bajarilishini kutadi va natijalarini obyektlar qatori sifatida qaytaradi:
    - `status`: `"fulfilled"` yoki `"rejected"`
    - `value` (agar fulfilled bo'lsa) yoki `reason` (agar rejected bo'lsa).
3. `Promise.race(promises)` -- birinchi promisening bajarilishini kutadi va uning natijasi/errori natijaga aylanadi.
4. `Promise.any(promises)` (yaqinda qo'shilgan usul) -- birinchi promisening bajarilishini kutadi va uning natijasi natijaga aylanadi. Agar berilgan barcha promiselar rad etilsa, [`AggregateError`](mdn:js/AggregateError) `Promise.any` erroriga aylanadi.
5. `Promise.resolve(value)` -- berilgan qiymat bilan hal qilingan promise beradi.
6. `Promise.reject(error)` -- berilgan error bilan rad etilgan promiseni beradi.

Bularning barchasidan `Promise.all` amaliyotda eng keng tarqalgani bo'lishi mumkin.
