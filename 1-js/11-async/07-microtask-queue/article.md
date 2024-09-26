
# Mikrovazifalar

`.then`/`.catch`/`.finally` promise ishlov beruvchilari har doim asinxrondir.

Promise darhol hal qilingan bo'lsa ham, *quyida* `.then`/`.catch`/`.finally` satrlaridagi kod bu ishlovchilardan oldin bajariladi.

Mana namuna:

```js run
let promise = Promise.resolve();

promise.then(() => alert("promise bajarildi!"));

alert("kod tugallandi"); // bu ogohlantirish birinchi bo'lib ko'rsatiladi
```

Agar siz uni ishga tushirsangiz, avval `kod tugallandi`, keyin esa `promise bajarildi!` degan xabarni ko'rasiz.

Bu g'alati, chunki promise, albatta, boshidan amalga oshiriladi.

Nima uchun `.then` keyinroq ishga tushdi? Nima bo'ldi?

## Mikrovazifalar ro'yxati

Asinxron vazifalar to'g'ri boshqaruvni talab qiladi. Buning uchun ECMA standarti `PromiseJobs` ichki navbatini belgilaydi, ko'pincha `mikro vazifa navbati` (V8 atamasi) deb ataladi.

[spetsifikatsiyada] aytilganidek (https://tc39.github.io/ecma262/#sec-jobs-and-job-queues):

- Navbat birinchi bo'lib chiqadi: birinchi navbatda qo'yilgan vazifalar birinchi bo'lib bajariladi.
- Vazifani bajarish hech narsa ishlamayotganda boshlanadi.

Yoki soddaroq qilib aytganda, promise tayyor bo'lgach, uning `.then/catch/finally` ishlov beruvchilari navbatga qo'yiladi; ular hali amalga oshirilmagan. JavaScript mexanizmi joriy koddan ozod bo'lganda, u navbatdan vazifani oladi va uni bajaradi.

Shuning uchun yuqoridagi misolda "kod tugadi" birinchi bo'lib ko'rsatiladi.

![](promiseQueue.svg)

Promiselar bilan shug'ullanuvchilar har doim ushbu ichki navbatdan o'tadilar.

Agar bir nechta `.then/catch/finally` bilan zanjir mavjud bo'lsa, ularning har biri asinxron tarzda bajariladi. Ya'ni, u avval navbatga qo'yiladi, so'ngra joriy kod tugallangandan so'ng va avval navbatga qo'yilgan ishlov beruvchilar tugagach bajariladi.

**Agar buyurtma biz uchun muhim bo'lsa-chi? Qanday qilib `promise bajarilganidan` keyin `kod tugallandi` ko'rinishini yaratishimiz mumkin?**

Oson, shunchaki `.then` bilan navbatga qo'ying:

```js run
Promise.resolve()
  .then(() => alert("promise bajarildi!"))
  .then(() => alert("kod yakunlandi"));
```

Endi barchasi navbatda ko'rsatilgandek bo'ldi.

## Ishlov berilmagan rad etish

<info:promise-error-handling> maqolasidagi `unhandledrejection` hodisasini eslaysizmi?

Endi biz JavaScriptning hal qilinmagan rad etish borligini qanday aniqlaganini ko'rishimiz mumkin.

**Mikrovazifalar navbatining oxirida promise errori ishlanmasa, "ishlov berilmagan rad etish" sodir bo'ladi.**

Odatda, agar error kutilgan bo'lsa, uni hal qilish uchun promiselar zanjiriga `.catch` qo'shamiz:

```js run
let promise = Promise.reject(new Error("Promise muvaffaqiyatsizlikka uchradi!"));
*!*
promise.catch(err => alert('ushlandi));
*/!*

// ishlamaydi: error hal qilindi
window.addEventListener('unhandledrejection', event => alert(event.reason));
```

Ammo agar biz `.catch` qo'shishni unutib qo'ysak, mikrovazifalar navbati bo'sh bo'lgandan keyin vosita hodisani ishga tushiradi:

```js run
let promise = Promise.reject(new Error("Promise muvaffaqiyatsizlikka uchradi!"));

// Promise muvaffaqiyatsizlikka uchradi!
window.addEventListener('unhandledrejection', event => alert(event.reason));
```

Xatoni keyinroq hal qilsak-chi? Shunga o'xshash:

```js run
let promise = Promise.reject(new Error("Promise muvaffaqiyatsizlikka uchradi!"));
*!*
setTimeout(() => promise.catch(err => alert('ushlandi')), 1000);
*/!*

// Error: Promise muvaffaqiyatsizlikka uchradi!
window.addEventListener('unhandledrejection', event => alert(event.reason));
```

Endi, agar biz uni ishga tushirsak, avval `promise bajarilmadi!`, keyin esa `caught`ni ko'ramiz.

Agar biz mikrovazifalar navbati haqida bilmagan bo'lsak, biz hayron bo'lishimiz mumkin: "Nima uchun `unhandledrejection` ishlov beruvchisi ishga tushdi? Biz xatoni aniqladik va tuzatdik!" 

Ammo endi biz tushunamizki, `unhandledrejection` mikrovazifalar navbati tugallanganda hosil bo'ladi: vosita promiselarni tekshiradi va agar ulardan biri `rejected` holatida bo'lsa, event harakatga keltiriladi. 

Yuqoridagi misolda `setTimeout` tomonidan qo'shilgan `.catch` ham ishga tushiriladi. Lekin buni keyinroq, `unhandledrejection` sodir bo'lgandan keyin qiladi, shuning uchun u hech narsani o'zgartirmaydi.

## Xulosa

Promiselarni ko'rib chiqish har doim asinxrondir, chunki barcha promiselar "mikrovazifa navbati" (V8 atamasi) deb ham ataladigan ichki "promise ishlari" navbati orqali o'tadi. 

Shunday qilib, `.then/catch/finally` ishlov beruvchilari har doim joriy kod tugagandan so'ng chaqiriladi.

Agar kod qismi `.then/catch/finally` dan keyin bajarilishini kafolatlashimiz kerak bo'lsa, biz uni zanjirlangan `.then` chaqiruviga qo'shishimiz mumkin.

Ko'pgina Javascript dvigatellarida, shu jumladan brauzerlar va Node.js da, mikrotopshiriqlar tushunchasi "voqea sikli" va "makrovazifalar" bilan chambarchas bog'langan. Ularning promiselarga bevosita aloqasi yo'qligi sababli, ular o'quv qo'llanmaning boshqa qismida, <info:event-loop> maqolasida yoritilgan.
