# Promise (va'da)

Tasavvur qiling-a, siz eng yaxshi qo'shiqchisiz va muxlislar kechayu kunduz bo'lajak qo'shiqingizni so'rashadi.

Bir oz yengillik olish uchun siz uni chop etilganda ularga yuborishga va'da berasiz. Siz muxlislaringizga ro'yxat berasiz. Ular o'zlarining elektron pochta manzillarini to'ldirishlari mumkin, shunda qo'shiq mavjud bo'lganda, barcha obuna bo'lganlar uni bir zumda olishadi. Va agar biror narsa noto'g'ri bo'lsa ham, aytaylik, studiyada yong'in sodir bo'lsa, qo'shiqni nashr eta olmasligingiz uchun ular baribir xabardor qilinadi.

Hamma xursand: siz, chunki xalq sizni boshqa olomonga to'plamaydi, muxlislar esa qo'shiqni sog'inmaydilar.

Bu bizda dasturlashda tez-tez uchraydigan narsalar uchun haqiqiy hayotdagi o'xshashliklardan biri:

1. Biror narsani bajaradigan va vaqt talab qiladigan "kod ishlab chiqarish". Masalan, tarmoq orqali ma'lumotlarni yuklaydigan ba'zi kodlar. Bu "qo'shiqchi".
2. Tayyor bo'lgandan keyin "ishlab chiqaruvchi kod" natijasini xohlaydigan "iste'mol qiluvchi kod". Ko'pgina funksiyalar uchun bu natija kerak bo'lishi mumkin. Bular "muxlislar".
3. *Promise* - bu "ishlab chiqaruvchi kod" va "iste'molchi kod"ni bir-biriga bog'laydigan maxsus JavaScript obyekti. Bizning analogiyamiz nuqtai nazaridan: bu "obuna ro'yxati". "Ishlab chiqaruvchi kod" va'da qilingan natijani ishlab chiqarish uchun kerakli vaqtda "va'da" bu natijani tayyor qiladi va obuna bo'lgan barcha kodlarga taqdim etadi.

O'xshashlik unchalik aniq emas, chunki JavaScript va'dalari oddiy obuna ro'yxatidan ko'ra murakkabroq: ular qo'shimcha funksiyalar va cheklovlarga ega. Lekin boshlanishiga yaxshi.

Va'da qilingan obyekt uchun konstruktor sintaksisi:

```js
let promise = new Promise(function(resolve, reject) {
  // ijrochi (ishlab chiqaruvchi kod, "qo'shiqchi")
});
```

`New promise` ga o'tkazilgan funksiya *executor* (ijrochi) deb ataladi. `New promise` yaratilganda, ijrochi avtomatik ravishda ishlaydi. U oxir-oqibat natija berishi kerak bo'lgan ishlab chiqarish kodini o'z ichiga oladi. Yuqoridagi oʻxshatish nuqtai nazaridan: ijrochi “qoʻshiqchi”.

Uning `resolve` va `reject` argumentlari JavaScript-ning o'zi tomonidan taqdim etilgan qayta qo'ng'iroqlardir. Bizning kodimiz faqat ijrochining ichida.

Ijrochi natijani olganida, ertami yoki kechmi, muhim emas, u quyidagi qayta qo'ng'iroqlardan birini chaqirishi kerak:

- `resolve(value)` — agar ish muvaffaqiyatli yakunlangan bo'lsa, natija "qiymat" bilan.
- `reject(error)` — agar xatolik yuz bergan bo'lsa, `error` error obyektidir.
Xulosa qilish uchun: ijrochi avtomatik ravishda ishlaydi va ishni bajarishga harakat qiladi. Urinish tugagach, agar u muvaffaqiyatli bo'lsa, `resolve` yoki xatolik bo'lsa, `reject` ni chaqiradi.

`New Promise` konstruktori tomonidan qaytarilgan `promise` obyekti quyidagi ichki xususiyatlarga ega:

- `state` — dastlab `pending`, keyin `resolve` chaqirilganda `fulfilled`ga yoki `reject` chaqirilganda `rejected`ga o'zgaradi.
- `result` —  dastlab `undefined`, keyin `resolve(value)` chaqirilganda `value` yoki `reject(error)` chaqirilganda `error` ga o'zgaradi.

Shunday qilib, ijrochi oxir-oqibat `promise`ni ushbu holatlardan biriga o'tkazadi:

![](promise-resolve-reject.svg)

"Muxlislar" bu o'zgarishlarga qanday obuna bo'lishlari mumkinligini keyinroq bilib olamiz.

Mana, promise konstruktori va “kod ishlab chiqarish”ga ega oddiy ijrochi funksiyasiga misol, bu `setTimeout” orqali` vaqt talab etadi.

```js run
let promise = new Promise(function(resolve, reject) {
  // promise tuzilganda funksiya avtomatik ravishda bajariladi

  // 1 soniyadan so'ng ish "bajarildi" natijasi bilan bajarilganligi haqida signal
  setTimeout(() => *!*resolve("done")*/!*, 1000);
});
```

Yuqoridagi kodni ishga tushirish orqali biz ikkita narsani ko'rishimiz mumkin:

1. Ijrochi avtomatik ravishda va darhol chaqiriladi (`new promise` bilan).
2. Ijrochi ikkita argumentni oladi: `resolve` va `reject`. Bu funksiyalar JavaScript dvigateli tomonidan oldindan belgilangan, shuning uchun ularni yaratishimiz shart emas. Biz tayyor bo'lganda ulardan birini chaqirishimiz kerak.

    After one second of "processing", the executor calls `resolve("done")` to produce the result. This changes the state of the `promise` object: Bir soniya "qayta ishlash"dan so'ng, ijrochi natijani chiqarish uchun `resolve("done")` ni chaqiradi. Bu `promise` obyektining holatini o'zgartiradi:

    ![](promise-resolve-1.svg)

Bu ishni muvaffaqiyatli yakunlash,"fu;fi;;ed promise" (bajarilgan va'da) misoli edi.

Va endi bajaruvchining xato bilan va'dani rad etishiga misol:

```js
let promise = new Promise(function(resolve, reject) {
  // 1 soniyadan so'ng ish xato bilan tugaganligini bildiradi
  setTimeout(() => *!*reject(new Error("Whoops!"))*/!*, 1000);
});
```

The call to `reject(...)` moves the promise object to `"rejected"` state: `"Reject(...)` qo'ng'irog'i va'da obyektini `rejected` holatiga o'tkazadi:

![](promise-reject-1.svg)

Xulosa qilib aytadigan bo'lsak, ijrochi ishni bajarishi kerak (odatda vaqt talab qiladigan narsa) va keyin tegishli va'da obyektining holatini o'zgartirish uchun `resolve` yoki `reject` ni chaqirishi kerak.

Qabul qilingan yoki rad etilgan va'da dastlab "kutib turgan" va'dadan farqli ravishda "hal qilingan" deb ataladi.

````smart header="Faqat bitta natija yoki xato bo'lishi mumkin"
Ijrochi faqat bitta `resolve` yoki bitta `reject`ni chaqirishi kerak. Har qanday o'zgarishi yakuniy hisoblanadi.

Barcha keyingi `resolve` va `reject` qo'ng'iroqlari e'tiborga olinmaydi:

```js
let promise = new Promise(function(resolve, reject) {
*!*
  resolve("done");
*/!*

  reject(new Error("…")); // ignored
  setTimeout(() => resolve("…")); // ignored
});
```

G'oya shundan iboratki, ijrochi tomonidan bajarilgan ish faqat bitta natija yoki xato bo'lishi mumkin.

Shuningdek, `resolve`/`reject` faqat bitta argumentni (yoki hech birini) kutadi va qo'shimcha argumentlarni e'tiborsiz qoldiradi.
````

```smart header=""Xato obyektlari bilan rad etish"`
Agar biror narsa noto'g'ri bo'lsa, ijrochi `reject` ni chaqirishi kerak. Buni har qanday argument turi bilan amalga oshirish mumkin (xuddi `resolve` kabi). Lekin `Error` obyektlaridan (yoki `Error`dan meros bo`lgan obyektlardan) foydalanish tavsiya etiladi. Buning sababi tez orada ma'lum bo'ladi.
```

````smart header="Darhol `hal qilish`/`rad etishni chaqirish`"
Amalda, ijrochi odatda biror narsani asinxron qiladi va ma'lum vaqtdan keyin `resolve`/`reject` ni chaqiradi, lekin bunga majbur emas. Shuningdek, biz darhol `resolve` yoki `reject` deb nomlashimiz mumkin, masalan:

```js
let promise = new Promise(function(resolve, reject) {
  // ishni bajarish uchun vaqtimizni olmaymiz
  resolve(123); // darhol natijani berish lozim: 123
});
```

Misol uchun, bu biz ishni bajarishni boshlaganimizda sodir bo'lishi mumkin, lekin keyin hamma narsa allaqachon tugallangan va keshlanganligini ko'rishimiz mumkin.

Juda soz. Biz darhol hal qilingan va'damiz bor.
````

``` aqlli sarlavha="`state` va `result` ichki"
Promise obyektining `state` va `result` xossalari ichki xususiyatga ega. Biz ularga bevosita kira olmaymiz. Buning uchun `.then`/`.catch`/`.finally` usullaridan foydalanishimiz mumkin. Ular quyida tavsiflanadi.
```

## Iste'molchilar: then, catch

Promise obyekti ijrochi ("ishlab chiqaruvchi kod" yoki "qo'shiqchi") va natija yoki errorni oladigan iste'molchi funktsiyalar ("fanatlar") o'rtasidagi bog'lanish vazifasini bajaradi. Iste'mol qiluvchi funksiyalarni `.then` va `.catch` usullari yordamida ro'yxatdan o'tkazish (obuna bo'lish) mumkin.

### then

Eng muhimi, asosiysi `.keyin`.

Sintaksis bu:

```js
promise.then(
  function(result) { *!*/* muvaffaqiyatli natijaga erishish */*/!* },
  function(error) { *!*/* errorni hal qilish */*/!* }
);
```

`.then` ning birinchi argumenti va'da hal qilinganda ishlaydigan va natijani oladigan funksiyadir.

`.then` ning ikkinchi argumenti va'da rad etilganda va xatoni qabul qilganda ishlaydigan funksiyadir.

Masalan, muvaffaqiyatli hal qilingan va'daga munosabat:

```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done!"), 1000);
});

// resolve .then
promise.then dagi birinchi funksiyani ishga tushiradi(
*!*
  result => alert(result), // 1 sekunddan keyin "bajarildi!" belgisini ko'rsatadi
*/!*
  error => alert(error) // ishlamaydi);
```

Birinchi funktsiya bajarildi.

Va rad etilgan taqdirda, ikkinchisi:

```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
});

// reject .then promise.then dagi ikkinchi funksiyani ishga tushiradi(
  result => alert(result), // ishlaydi
*!*
  error => alert(error) // "Xato: Voy!" 1 soniyadan keyin ko'rsatiladi
*/!*
);
```

Agar bizni faqat muvaffaqiyatli yakunlash qiziqtirsa, `.then` ga faqat bitta funktsiya argumentini taqdim etishimiz mumkin:

```js run
let promise = new Promise(resolve => {
  setTimeout(() => resolve("done!"), 1000);
});

*!*
promise.then(alert); //  1 soniyadan keyin "bajarildi!" belgisi ko'rsatiladi 
*/!*
```

### catch

If we're interested only in errors, then we can use `null` as the first argument: `.then(null, errorHandlingFunction)`. Or we can use `.catch(errorHandlingFunction)`, which is exactly the same: Agar bizni faqat xatolar qiziqtirsa, birinchi argument sifatida `null` dan foydalanishimiz mumkin: `.then(null, errorHandlingFunction)`. Yoki biz `.catch(errorHandlingFunction)` dan foydalanishimiz ham mumkin, bu aynan bir xil hisoblanadi:


```js run
let promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
});

*!*
// .catch(f) is the same as promise.then(null, f)
promise.catch(alert); // 1 soniyadan so'ng "Error: Whoops!" belgisi ko'rsatiladi
*/!*
```

`.catch(f)` chaqiruvi `.then(null, f)` ning to`liq analogidir, bu shunchaki qisqartmadir.

## Cleanup: vanihoyat 

Oddiy `try {...} catch {...}`da `finally` bandi bo`lgani kabi promise'larda ham `finally` bor.

`.finally(f)` chaqiruvi `.then(f, f)` ga o`xshaydi, ya`ni `f` har doim va'da bajarilganda ishlaydi: u hal qiladi yoki rad etadi.

`Finally` g'oyasi oldingi operatsiyalar tugagandan so'ng tozalash/yakuniylashtirish uchun ishlov beruvchini o'rnatishdir.

Masalan, yuklash ko'rsatkichlarini to'xtatish, endi kerak bo'lmagan ulanishlarni yopish va h.k.

Buni partiyani tugatuvchi sifatida tasavvur qiling. Bayram yaxshi yoki yomon bo'lishi va unda qancha do'stlar bo'lishidan qat'i nazar, biz undan keyin tozalashga muhtojmiz (yoki hech bo'lmaganda).

Kod quyidagicha ko'rinishi mumkin:
```js
new Promise((resolve, reject) => {
  /* vaqt talab qiladigan biror narsa qiling, so'ngra hal qilish uchun qo'ng'iroq qiling yoki rad etishingiz mumkin */
})
*!*
  // promise bajarilganda ishlaydi, muvaffaqiyatli yoki yo'qligi muhim emas
   .finally(() => yuklashni toʻxtatish koʻrsatkichi)
   // shuning uchun biz davom etishimizdan oldin yuklash indikatori doimo to'xtatiladi
*/!*
   .then(natija => natijani ko'rsatish, error => error'ni ko'rsatish)
```

Esda tutingki, `nihoyat(f)` aynan `then(f,f)` taxallusi emas.

Muhim farqlar mavjud:

1.`Finally` ishlov beruvchisida argumentlar yo'q. `Finally`da biz promise muvaffaqiyatli yoki yo'qligini bilmaymiz. Hammasi yaxshi, chunki bizning vazifamiz odatda "umumiy" yakuniy protseduralarni bajarishdir.

    Iltimos, yuqoridagi misolni ko'rib chiqing: ko'rib turganingizdek, `finally` ishlov beruvchisida hech qanday dalil yo'q va va'da qilingan natija keyingi ishlov beruvchi tomonidan boshqariladi.
2. `Finally` ishlov beruvchisi natija yoki xatoni keyingi mos ishlov beruvchiga "o'tadi".

    Masalan, bu yerda natija `finally` orqali `then` ga o'tkaziladi:

    ```js run
    new Promise((resolve, reject) => {
      setTimeout(() => resolve("value"), 2000);
    })
      .finally(() => alert("Promise ready")) // triggers first
      .then(result => alert(result)); // <-- .then shows "value"
    ```

    Ko'rib turganingizdek, birinchi promise bilan qaytarilgan `value` `finally` orqali keyingi `then` ga o'tadi.

     Bu juda qulay, chunki `finally` va'da qilingan natijani qayta ishlash uchun mo'ljallanmagan. Aytganimizdek, natija qanday bo'lishidan qat'i nazar, bu umumiy tozalash uchun joy.

     `Finally` orqali `catch` ga qanday o‘tishini ko'rishimiz uchun xatoga misol keltiramiz:

    ```js run
    new Promise((resolve, reject) => {
      throw new Error("error");
    })
      .finally(() => alert("Promise ready")) // birinchi navbatda tetiklaydi
      .catch(err => alert(err));  // <-- .catch errorni ko'rsatadi
    ```

3. `Finally` ishlov beruvchisi ham hech narsani qaytarmasligi kerak. Agar shunday bo'lsa, qaytarilgan qiymat jimgina e'tiborga olinmaydi.

     "Finally` ishlov beruvchisi xatoga yo'l qo'ysa, bu qoidadan yagona istisno. Keyin bu xato oldingi natija o'rniga keyingi ishlov beruvchiga o'tadi.

Xulosa:

- `Finally` ishlov beruvchisi oldingi ishlov beruvchining natijasini olmaydi (uning argumentlari yo'q). Bu natija o'rniga keyingi mos ishlov beruvchiga uzatiladi.
- Agar `finally` ishlov beruvchisi biror narsani qaytarsa, u e'tiborga olinmaydi.
- `Finally` xatoga yo'l qo'yganda, bajarilish eng yaqin xato ishlov beruvchisiga o'tadi.
Bu funksiyalar foydali. Agar biz `finally` undan qanday foydalanish kerakligidan foydalansak, ishlarning to‘g‘ri ishlashiga yordam beradi: umumiy tozalash protseduralari uchun.

````smart header="Biz ishlovchilarni belgilangan va'dalarga biriktira olamiz"
Agar promise kutilayotgan bo'lsa, `.then/catch/finally` ishlov beruvchilari uning natijasini kutishadi.

Ba'zan, biz unga ishlov beruvchini qo'shganimizda, va'da allaqachon bajarilgan bo'lishi mumkin.

Bunday holda, ushbu ishlov beruvchilar darhol ishlaydi:
```js run
// va'da yaratilgandan so'ng darhol hal bo'ladi
va'da bersin = yangi va'da(hal qilish => hal ("bajarildi!"));

promise.then(alert); // bajarildi! (hoziroq ko'rinadi)
```

E'tibor bering, bu va'dalarni haqiqiy hayotdagi "obuna ro'yxati" stsenariysidan kuchliroq qiladi. Agar qo'shiqchi allaqachon o'z qo'shig'ini chiqargan bo'lsa va keyin bir kishi obuna ro'yxatida ro'yxatdan o'tgan bo'lsa, ular bu qo'shiqni qabul qila olmaydi. Haqiqiy hayotdagi obunalar tadbirdan oldin amalga oshirilishi kerak.
Promises are more flexible. We can add handlers any time: if the result is already there, they just execute.
````

## Masalan: loadScript [#loadscript]

Keyinchalik, keling, promise'larr asinxron kod yozishga qanday yordam berishi haqida ko'proq amaliy misollarni ko'rib chiqaylik.

Oldingi bobdagi skriptni yuklash uchun bizda `loadScript` funksiyasi mavjud.

Buni eslatish uchun calback'ka asoslangan variant:

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`${src} uchun script load erro`));

  document.head.append(script);
}
```

Keling, uni Promises yordamida qayta yozamiz.

Yangi `loadScript` funksiyasi qayta qo'ng'iroq qilishni talab qilmaydi. Buning o'rniga, u yuklash tugagandan so'ng hal qilinadigan Promise obyektini yaratadi va qaytaradi. Tashqi kod unga `.then` yordamida ishlov beruvchilarni (obuna funksiyalarini) qo‘shishi mumkin:
```js run
function loadScript(src) {
  return new Promise(function(resolve, reject) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Script load error for ${src}`));

    document.head.append(script);
  });
}
```

Foydalanishi

```js run
let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js");

promise.then(
  script => alert(`${script.src} joylandi!`),
  error => alert(`Error: ${error.message}`)
);

promise.then(script => alert('Boshqa nazoratchi...'));
```

Callback'ka asoslangan naqshning bir nechta afzalliklarini darhol ko'rishimiz mumkin:


| Promises | Callbacks |
|----------|-----------|
| Promise bizga ishlarni tabiiy tartibda bajarishga imkon beradi. 
Avval `loadScript(script)` ni ishga tushiramiz va `.then` natija bilan nima qilish kerakligini yozamiz. | `loadScript`(skript, callback)" ga qo'ng'iroq qilishda bizning ixtiyorimizda `callback` funksiyasi bo'lishi kerak. Boshqacha qilib aytadigan bo'lsak, `loadScript` chaqirilishidan *oldin* natija bilan nima qilish kerakligini bilishimiz kerak. |
| Biz `.then` ga va'da bo'yicha xohlagancha qo'ng'iroq qilishimiz mumkin. Har safar biz “obuna roʻyxati”ga yangi “fanat”, yangi obuna funksiyasini qoʻshamiz. Bu haqda keyingi bobda bilib olamiz: [](ma'lumot: promise zanjiri). | Faqat bitta callback bo'lishi mumkin. |

Shunday qilib, va'dalar bizga yaxshiroq kod oqimi va moslashuvchanlikni beradi. Ammo hali ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++bundan ham ko'proq foydali narsa bor. Buni keyingi boblarda ko‘ramiz.
