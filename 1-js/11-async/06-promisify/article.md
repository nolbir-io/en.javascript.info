# Promisification (promisifaktsiyalashtirish)

`Promisification` - bu oddiy o'zgartirish uchun uzoq so'z. Bu callbackni qabul qiladigan funksiyani promiseni qaytaruvchi funksiyaga aylantirishdir.

Bunday o'zgartirishlar ko'pincha real hayotda talab qilinadi, chunki ko'plab funksiyalar va kutubxonalar qayta qo'ng'iroq qilishga asoslangan. Ammo promiselar qulayroq, shuning uchun ularni promisify qilishdan foyda bor. 

Yaxshiroq tushunish uchun quyidagi misolni ko'rib chiqamiz:

Masalan, bizda <info:callbacks> bo'limidan `loadScript(src, callback)` mavjud.

```js run
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`${src}` uchun skriptni yuklash xatosi);

  document.head.append(script);
}

// foydalanish:
// loadScript('path/script.js', (err, script) => {...})
```

Funksiya berilgan `src` bilan skriptni yuklaydi, so'ngra error bo'lsa `callback (err)` ni yoki muvaffaqiyatli yuklangan taqdirda `callback (null, skript)` ni chaqiradi. Bu qayta qo'ng'iroqlardan foydalanish bo'yicha keng tarqalgan kelishuv, biz buni avval ham ko'rganmiz.

Keling, promisify qilaylik. Biz yangi `loadScriptPromise(src)` funksiyasini yaratamiz, u skriptni yuklaydi, lekin callbacklarni ishlatish o'rniga promiseni qaytaradi.

Boshqacha qilib aytadigan bo'lsak, biz uni faqat `src` (`callback`siz) o'tkazamiz va buning evaziga promise olamiz, bu yuk muvaffaqiyatli bo'lganda `skript` bilan hal qilinadi va aks holda xato bilan rad etiladi.

Mana:
```js
let loadScriptPromise = function(src) {
  return new Promise((resolve, reject) => {
    loadScript(src, (err, script) => {
      if (err) reject(err);
      else resolve(script);
    });
  });
};

// foydalanish:
// loadScriptPromise('path/script.js').then(...)
```

Ko'rib turganimizdek, yangi funksiya asl `loadScript` funksiyasi atrofidagi o'ramdir. U o'zining callbacklarini taqdim etishga chaqiradi, bu esa `resolve`/`reject` promiseni anglatadi. 

Endi `loadScriptPromise` promisega asoslangan kodga yaxshi mos keladi. Agar bizga callbackdan ko'ra ko'proq promiselar yoqsa (va tez orada buning sabablarini ko'ramiz), uning o'rniga biz undan foydalanamiz.

Amalda biz bir nechta funksiyalarni va'da qilishimiz kerak bo'lishi mumkin, shuning uchun yordamchidan foydalanish lozim.

Biz uni `promisify(f)` deb ataymiz: u `f` promisify funksiyasini qabul qiladi va o'rash funksiyasini qaytaradi.

```js
function promisify(f) {
  return function (...args) { // o'rash funksiyasini qaytarish (*)
    return new Promise((resolve, reject) => {
      function callback(err, result) { // f uchun maxsus callback qilish lozim (**)
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // f argumentlari oxiriga bizning maxsus callbackni qo'shamiz
0
      f.call(this, ...args); // original funksiyani chaqiring
    });
  };
}

// foydalanish:
let loadScriptPromise = promisify(loadScript);
loadScriptPromise(...).then(...);
```

Kod biroz murakkab ko'rinishi mumkin, lekin biz `loadScript` funksiyasini va'da qilgan holda yuqorida yozganimiz bilan bir xil.

`Promisify(f)` ga qo'ng'iroq `f` `(*)` atrofida o'ramni qaytaradi. Bu o'ram promiseni qaytaradi va qo'ng'iroqni asl `f` ga yo'naltiradi, natijani maxsus qayta qo'ng'iroqda `(**)` kuzatib boradi. 

Bu yerda `promisify`" asl funksiya aynan ikkita `(error, natija)` argumentlari bilan callbackni kutadi deb tahmin qilinadi. Bu biz tez-tez duch keladigan narsa. Keyin bizning qayta qo'ng'iroq qilishimiz to'g'ri formatda bo'ladi va "`promisify` bunday holatda juda yaxshi ishlaydi.

Agar asl `f` ko'proq argumentlar `callback (err, res1, res2, ...)` bilan qayta qo'ng'iroq qilishni kutsa-chi?

Biz yordamchimizni yaxshilashimiz mumkin. Keling, `promisify` ning yanada rivojlangan versiyasini yaratamiz.
- `Promisify(f)` chaqirilganda, u yuqoridagi versiyaga o'xshab ishlashi lozim.
- `Promisify(f, true)` deb chaqirilganda esa, u qayta qo'ng'iroq natijalari qatori bilan hal qilinadigan promiseni qaytarishi kerak. Bu juda ko'p dalillar bilan qayta qo'ng'iroqlar uchun mo'ljallangan. 

```js
// natijalar qatorini olish uchun promisify (f, true)
function promisify(f, manyArgs = false) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function *!*callback(err, ...results*/!*) { // f uchun maxsus callback
        if (err) {
          reject(err);
        } else {
          // manyArgs belgilangan bo'lsa, barcha qayta qo'ng'iroq natijalari bilan hal qiling
          *!*resolve(manyArgs ? results : results[0]);*/!*
        }
      }

      args.push(callback);

      f.call(this, ...args);
    });
  };
}

// foydalanish:
f = promisify(f, true);
f(...).then(arrayOfResults => ..., err => ...);
```

Ko'rib turganingizdek, u yuqoridagi bilan bir xil, lekin `resolve` `manyArgs` ning to'g'riligiga qarab faqat bitta yoki barcha argumentlar bilan chaqiriladi. 

Ko'proq ekzotik callback formatlari uchun, masalan, `error`siz: `callback (result)`, biz yordamchidan foydalanmasdan bunday funksiyalarni qo'lda va'da qilishimiz mumkin.
Bundan tashqari, biroz moslashuvchan va'da qilish funksiyalariga ega modullar bor, masalan. [es6-promisify](https://github.com/digitaldesignlabs/es6-promisify). Node.js da buning uchun o'rnatilgan `util.promisify` funksiyasi mavjud.

```smart
Promisifikatsiya, ayniqsa, `async/await` (keyinroq <info:async-await> bobida yoritilgan) dan foydalanganda ajoyib, lekin qayta qo'ng'iroqlarni to'liq almashtirish yaxshi variant emas. 

Esingizda bo'lsin, promise faqat bitta natijaga ega bo'lishi mumkin, ammo callback texnik jihatdan ko'p marta chaqiriladi.

Shunday qilib, promise faqat qayta qo'ng'iroqni bir marta chaqiradigan funksiyalar uchun mo'ljallangan. Keyingi qo'ng'iroqlar e'tiborga olinmaydi.
```
