# Async/await

Promiselar bilan yanada qulayroq uslubda ishlash uchun maxsus "async/await" sintaksis mavjud. Uni tushunish va ishlatish hayratlanarli darajada oson.

## Async funksiyalari

Keling, `async` kalit so'zidan boshlaylik. Uni funktsiyadan oldin qo'yish mumkin, masalan:

```js
async function f() {
  return 1;
}
```
Funktsiya oldidagi `async` so'zi bitta oddiy narsani anglatadi: funksiya har doim promiseni qaytaradi. Boshqa qiymatlar avtomatik ravishda hal qilingan promisega o'raladi.

Masalan, bu funksiya `1` natijasi bilan hal qilingan va’dani qaytaradi; sinab ko'raylik:

```js run
async function f() {
  return 1;
}

f().then(alert); // 1
```

...Biz promiseni aniq qaytarishimiz mumkin, bu xuddi shunday bo'ladi:

```js run
async function f() {
  return Promise.resolve(1);
}

f().then(alert); // 1
```

Shunday qilib, `async` funksiya promiseni qaytarishini ta'minlaydi va unga non-promise larni o'rab oladi. Yetarlicha oddiy, to'g'rimi? Lekin nafaqat bu, yana bir kalit so'z bor, `await`, u faqat `async` funksiyalarida ishlaydi va bu juda zo'r.

## Await

Sintaksis:

```js
// faqat async funktsiyalari ichida ishlaydi
let value = await promise;
```

`await` kalit so‘zi JavaScript-ni promise bajarilguncha kutishga majbur qiladi va natijani qaytaradi.

1 soniyada hal bo'ladigan promiseli misol:
```js run
async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000)
  });

*!*
  let result = await promise; // promise hal bo'lguncha kuting (*)
*/!*

  alert(result); // "tayyor!"
}

f();
```

Funksiyaning bajarilishi `(*)` qatorida “to'xtatiladi” va promise bajarilgandan so'ng davom etadi va `natija` uning natijasiga aylanadi. Shunday qilib, yuqoridagi kod "bajarildi!" bir soniyada.

Ta'kidlab o'tamiz: `await` so'zma-so'z promise bajarilgunga qadar funksiyaning bajarilishini to'xtatib turadi va keyin uni va'da qilingan natija bilan davom ettiradi. Bu protsessor resurslarini talab qilmaydi, chunki JavaScript dvigateli ayni paytda boshqa ishlarni ham bajarishi mumkin: boshqa skriptlarni bajarish, hodisalarni boshqarish va h.k.

Bu `promise.then` dan ko'ra va'da qilingan natijani olishning yanada oqlangan sintaksisidir. Va o'qish va yozish osonroq.

````ogohlantiruvchi sarlavha= "Odat funksiyalarda await` ni ishlatib bo'lmaydi"
Agar biz sinxron bo'lmagan funksiyada "`await` dan foydalanmoqchi bo'lsak, sintaksis xatosi bo'ladi:

```js run
function f() {
  let promise = Promise.resolve(1);
*!*
  let result = await promise; // Syntax error
*/!*
}
```

Agar funktsiyadan oldin `async` ni qo'yishni unutib qo'ysak, bu xatoga duch kelishimiz mumkin. Yuqorida aytib o'tilganidek, `await` faqat `async` funksiyasi ichida ishlaydi.
````

Keling, <info:promise-chaining> bo'limidagi `showAvatar()` misolini olaylik va uni `async/await` yordamida qayta yozamiz:

1. `then` qo‘ng‘iroqlarini `await` bilan almashtirishimiz kerak bo‘ladi.
2. Shuningdek, ular ishlashi uchun `async` funksiyasini ham qilishimiz kerak.

```js ishlaydi
async funksiyasi showAvatar() {

  // bizning JSON-ni o'qing
   let respond = await fetch('/article/promise-chaining/user.json');
   foydalanuvchi = javobni kutib tursin.json();

  // github userni o'qing
  let githubResponse = await fetch(`https://api.github.com/users/${user.name}`);
  let githubUser = await githubResponse.json();

  // avatarni ko'rsating
  let img = document.createElement('img');
  img.src = githubUser.avatar_url;
  img.className = "promise-avatar-example";
  document.body.append(img);

  // 3 sekund kuting
  yangi Promiseni kuting((resolve, reject) => setTimeout(resolve, 3000));

  img.remove();

   githubUser ni qaytaring;
}

showAvatar();
```

Juda toza va o'qish oson, to'g'rimi? Avvalgidan ancha yaxshi.

````aqlli sarlavha="Zamonaviy brauzerlar modullarda yuqori darajadagi `kutis` imkonini beradi"
Zamonaviy brauzerlarda, modul ichida bo'lganimizda, yuqori darajadagi `kutish` juda yaxshi ishlaydi. Biz modullarni <info:modules-intro> maqolasida ko'rib chiqamiz.

Masalan:

```js run module
// biz ushbu kod modul ichida yuqori darajada ishlaydi deb taxmin qilamiz
let response = await fetch('/article/promise-chaining/user.json');
let user = await response.json();

console.log(user);
```

Agar biz modullardan foydalanmayotgan bo'lsak yoki [eski brauzerlar](https://caniuse.com/mdn-javascript_operators_await_top_level) qo'llab-quvvatlanishi kerak bo'lsa, universal retsept mavjud: ya'ni anonim asinx funksiyasiga o'rash.

Mana bunga o'xshash:

```js
(async () => {
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();
  ...
})();
```

````

````smart header="await \thenables\""`ni qabul qiladi
`Promise.then` kabi, `await` bizga keyin mumkin boʻlgan obyektlardan (chaqiriladigan `then` usuliga ega boʻlganlar) foydalanish imkonini beradi. G'oya shundaki, uchinchi tomon obyekti promise bo'lmasligi mumkin, lekin promisega mos keladi: agar u `.then` ni qo'llab-quvvatlasa, uni `await` bilan ishlatish kifoya.

Bu yerda `Thenable` demo sinfi; Quyidagi "`await` o'z misollarini qabul qiladi:

```js run
class Thenable {
  constructor(num) {
    this.num = num;
  }
  then(resolve, reject) {
    alert(resolve);
    // 1000ms dan keyin this.num*2 bilan hal qiling
    setTimeout(() => resolve(this.num * 2), 1000); // (*)
  }
}

async function f() {
  // 1 soniya kutadi, keyin natija 2 bo'ladi
  let result = await new Thenable(1);
  alert(result);
}

f();
```

Agar `await` `.then` bilan promise siz obyektga ega bo'lsa, u o'rnatilgan `resolve` va `reject` funksiyalarini argument sifatida ta'minlovchi ushbu usulni chaqiradi (xuddi oddiy `Promise` ijrochisi uchun bo'lgani kabi). Keyin `await` ulardan biri chaqirilguncha kutadi (yuqoridagi misolda bu `(*)` qatorida sodir bo'ladi) va natija bilan davom etadi.
````

````aqlli sarlavha="Asinxron sinf usullari"`
Sinxron sinf usulini e'lon qilish uchun uni async` bilan oldinga qo'ying:

```js run
class Waiter {
*!*
  async wait() {
*/!*
    return await Promise.resolve(1);
  }
}

new Waiter()
  .wait()
  .then(alert); // 1 (bu (natija => ogohlantirish (natija)) bilan bir xil)
```
Ma'nosi bir xil: qaytarilgan qiymat promise bo'lishini ta'minlaydi va `await` ni yoqadi.

````
## Errorni hal qilish

Agar promise odatdagidek hal bo'lsa, `await promise` natijani qaytaradi. Ammo rad etilgan taqdirda, xuddi shu satrda `throw` iborasi mavjud bo'lganidek, xatoni chiqaradi.

Bu kod:

```js
async function f() {
*!*
  await Promise.reject(new Error("Whoops!"));
*/!*
}
```

...shu kabi bir xil:

```js
async function f() {
*!*
  throw new Error("Whoops!");
*/!*
}
```

Haqiqiy holatlarda, promise rad etilishidan oldin biroz vaqt talab qilinishi mumkin. Bunday holda, `await` xatolik yuz berishidan oldin kechikish bo'ladi.

Biz bu xatoni oddiy `throw` kabi `try..catch` yordamida aniqlashimiz mumkin:

```js run
async function f() {

  try {
    let response = await fetch('http://no-such-url');
  } catch(err) {
*!*
    alert(err); // TypeError: olib bo'lmadi
*/!*
  }
}

f();
```

Xato bo'lsa, boshqaruv `catch` blokiga o'tadi. Shuningdek, biz bir nechta qatorlarni o'rashimiz mumkin:

```js run
async function f() {

  try {
    let response = await fetch('/bu yerda user mavjud emas');
    let user = await response.json();
  } catch(err) {
    // fetch va respond.json da xatolarni ushlaydi
    alert(err);
  }
}

f();
```

Agar bizda `try..catch` bo'lmasa, u holda `f()` asinxron funksiyasining chaqiruvi tomonidan yaratilgan promise rad etiladi. Biz uni boshqarish uchun `.catch` qo'shishimiz mumkin:

```js run
async function f() {
  let response = await fetch('http://no-such-url');
}

// f() rad etilgan promise ga aylanadi
*!*
f().catch(alert); // TypeError: olib bo'lmadi // (*)
*/!*
```

Agar biz u yerga `.catch` qo'shishni unutib qo'ysak, biz ishlov berilmagan promise xatosini olamiz (konsolda ko'rish mumkin). Biz bunday xatolarni <info:promise-error-handling> bobida tasvirlanganidek, global `unhandledrejection` hodisasi ishlov beruvchisi yordamida aniqlashimiz mumkin.


```aqlli sarlavha="async/await` va `promise.then/catch`"
Biz `async/await` dan foydalansak, bizga kamdan-kam hollarda `.then` kerak bo'ladi, chunki `await` bizni kutish bilan shug'ullanadi. Va biz `.catch` o‘rniga oddiy `try..catch` dan foydalanishimiz mumkin. Bu odatda (lekin har doim emas) qulayroq.

Lekin kodning yuqori darajasida, biz har qanday `async` funksiyasidan tashqarida bo‘lganimizda, biz sintaktik jihatdan `await` dan foydalana olmaymiz, shuning uchun yakuniy natijani boshqarish uchun `.then/catch` ni qo'shish yuqoridagi misolning `(*)` qatoridagi kabi pasayish xatosi kabi odatiy holdir. 
```

````aqlli sarlavha="`async/await` `Promise.all` bilan yaxshi ishlaydi"
Agar biz bir nechta promiselarni kutishimiz kerak bo'lsa, ularni `Promise.all` ga o'rashimiz va keyin "kutishimiz" mumkin:

```js
// natijalar to'plamini kuting
let results = await Promise.all([
  fetch(url1),
  fetch(url2),
  ...
]);
```

Error bo'lsa, u odatdagidek, bajarilmagan promisedan `Promise.all`gacha tarqaladi va keyin biz qo'ng'iroq atrofida `try..catch` yordamida qo'lga olishimiz mumkin bo'lgan istisnoga aylanadi.

````

## Xulosa

Funksiya oldidagi `async` kalit so‘zi ikkita effektga ega:

1. Har doim va'dasini qaytarishga majbur qiladi.
2. Unda `await` dan foydalanishga ruxsat beradi.

Promisedan oldin `await` kalit so'zi JavaScript-ni promise bajarilguncha kutishga majbur qiladi va keyin:

1. Agar bu error bo'lsa, xuddi o'sha joyda `throw error` chaqirilgandek istisno hosil bo'ladi.
2. Aks holda, natijani qaytaradi.

Ular birgalikda o'qish va yozish oson bo'lgan asinxron kodni yozish uchun ajoyib ramka yaratadilar.

`Async/await` bilan biz kamdan-kam hollarda `promise.then/catch`ni yozishimiz kerak, lekin ular promiselarga asoslanganligini hali ham unutmasligimiz kerak, chunki ba'zan (masalan, eng chekka doirada) bu usullardan foydalanishga to'g'ri keladi. Bundan tashqari, biz bir vaqtning o'zida ko'plab vazifalarni kutayotganimizda `Promise.all` ajoyib usul hisoblanadi.
