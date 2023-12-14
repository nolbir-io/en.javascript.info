
# Asinxron iteratsiya va generatorlar

Asinxron iteratsiya bizga talab bo'yicha asinxron ravishda keladigan ma'lumotlarni takrorlash imkonini beradi. Masalan, biz tarmoq orqali biror narsani bo'laklarga bo'lib yuklab olganimizda asinxron generatorlar uni yanada qulayroq qiladi.

Keling, sintaksisni tushunish uchun avval oddiy misol ko'ramiz, so'ngra real hayotda foydalanish misolini ko'rib chiqamiz.

## Takrorlanuvchilarni eslang
Kelng, iterable'lar, ya'ni takrorlanuvchilar mavzusini yodga olaylik.

G'oya shundan iboratki, bizda `range` kabi obyekt mavjud:
```js
let range = {
  from: 1,
  to: 5
};
```

 ...Va biz `1` dan `5` gacha qiymatlarni olish uchun `for(value of range)` kabi `for..of` siklidan foydalanmoqchimiz.

Boshqacha qilib aytganda, biz obyektga *iteratsiya qobiliyati*ni qo'shmoqchimiz.

Buni `Symbol.iterator` nomi bilan maxsus usul yordamida amalga oshirish mumkin:

- Bu usul sikl boshlanganda `for..of` konstruksiyasi orqali chaqiriladi va u `next` usuli bilan obyektni qaytarishi kerak.
- Har bir iteratsiya uchun `next` usuli keyingi qiymat uchun chaqiriladi.
- The `next()` should return a value in the form `{done: true/false, value:<loop value>}`, where `done:true` means the end of the loop. `Next()` usuli `{done: true/false, value:<loop value>}` ko'rinishidagi qiymatni qaytarishi kerak, bu yerda `done:true` siklning oxirini bildiradi.

Mana, takrorlanadigan `range` uchun dastur:

```js run
let range = {
  from: 1,
  to: 5,

*!*
  [Symbol.iterator]() { // bir marta for..of boshida chaqirilgan
*/!*
    return {
      current: this.from,
      last: this.to,

*!*
      next() { // keyingi qiymatni olish uchun har bir iteratsiyani chaqirdi
*/!*
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

for(let value of range) {
  alert(value); // 1 keyin 2, keyin 3, keyin 4, keyin 5
}
```

Agar biror narsa tushunarsiz bo'lsa, iltimos, [](info:iterable) bo'limiga tashrif buyuring, unda muntazam takrorlanuvchilar haqida barcha tafsilotlar berilgan.

## Asinxron takrorlanuvchilar

 Asinxron iteratsiya qiymatlar asinxron kelganda: `setTimeout` yoki boshqa turdagi kechikishdan keyin kerak bo'ladi.
 Eng keng tarqalgan holat shundaki, obyekt keyingi qiymatni yetkazib berish uchun tarmoq so'rovini amalga oshirishi kerak, biz uning hayotiy misolini birozdan keyin ko'ramiz.

Obyektni asinxron ravishda takrorlanadigan qilish uchun:

1. `Symbol.iterator`ning o'rniga `Symbol.asyncIterator` ni ishlating. 
2. `Next ()` usuli va'dani qaytarishi kerak (keyingi qiymat bilan bajarilishi kerak).
    - `Async` kalit so‘zi uni boshqaradi, biz shunchaki `async next()` ni yaratishimiz mumkin.
3. Bunday obyektni takrorlash uchun biz `for await (iterable elementi)` siklidan foydalanishimiz kerak.
    - `await` so'ziga e'tibor bering.

Boshlang'ich misol sifatida, avvalgisiga o'xshash takrorlanadigan `range` obyektini yaratamiz, lekin endi u qiymatlarni asinxron tarzda, soniyada bir marta qaytaradi.

Biz qilishimiz kerak bo'lgan narsa yuqoridagi kodni bir necha marta almashtirishni amalga oshirishdir:

```js run
let range = {
  from: 1,
  to: 5,

*!*
  [Symbol.asyncIterator]() { // (1)
*/!*
    return {
      current: this.from,
      last: this.to,

*!*
      async next() { // (2)
*/!*

*!*
        //  Eslatma: biz async ichida "await" dan foydalanishimiz mumkin:
        await new Promise(resolve => setTimeout(resolve, 1000)); // (3)
*/!*

        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

(async () => {

*!*
  for await (let value of range) { // (4)
    alert(value); // 1,2,3,4,5
  }
*/!*

})()
```

Ko'rib turganimizdek, struktura oddiy iteratorlarga o'xshaydi:

1. Obyektni asinxron ravishda takrorlanadigan qilish uchun u `Symbol.asyncIterator` `(1)` usuliga ega bo'lishi kerak.
2. Bu usul `(2)` promise'ni qaytaruvchi `next()` usuli bilan obyektni qaytarishi kerak.
3. `Next()` usuli `async` bo'lishi shart emas, bu va'dani qaytaruvchi oddiy usul bo'lishi mumkin, lekin `async` bizga `await` dan foydalanishga imkon beradi, shuning uchun bu qulay. Bu yerda biz `3` ni bir soniya kechiktiramiz.
4. Takrorlash uchun biz `for await(Let value of range)` va `(4)` dan foydalanamiz, ya'ni "for" dan keyin "await" ni qo'shamiz. U bir marta `range[Symbol.asyncIterator]()` ni, keyin esa qiymatlar uchun `next()` ni chaqiradi.

Quyida farqlar bilan kichik jadval berilgan:

|       | Iteratorlar | Asinxron iteratorlar |
|-------|-----------|-----------------|
| Iteratorni ta'minlash uchun obyekt usuli| `Symbol.iterator` | `Symbol.asyncIterator` |
| `next()` qaytish qiymati hisoblanadi        | istalgan qiymat          | `Promise`  |
| loop uchun quyidagilardan foydalaning                          | `for..of`         | `for await..of` |

````ogohlantiruvchi sarlavha=" tarqalish sintaksisi `...` asinxron tarzda ishlamaydi"
Muntazam, sinxron iteratorlarni talab qiladigan funksiyalar asinxronlar bilan ishlamaydi.

Masalan, tarqalish sintaksisi ishlamaydi:
```js
alert( [...range] ); // Error, Symbol.iterator mavjud emas
```

Bu tabiiy holat, chunki u `Symbol.asyncIterator` ni emas, `Symbol.iterator` ni topishni kutadi.

Bu `for..of` uchun ham shunday: `await`siz sintaksis uchun `Symbol.iterator` kerak.
````

## Generatorlarni eslang

Endi generatorlarni eslaylik, chunki ular iteratsiya kodini ancha qisqartirishga imkon beradi. Ko'pincha, biz iteratsiya qilishni xohlasak, biz generatorlardan foydalanamiz.

Oddiylik uchun, ba'zi muhim narsalarni hisobga olmaganda, ular "qiymatlarni yaratuvchi (hosildorlik) funksiyalari" dir. Ular [](info:generators) bobida batafsil yoritilgan.

Generatorlar `funksiya*` (yulduzchaga e`tibor bering) bilan etiketlanadi va qiymat hosil qilish uchun `yield` dan foydalanamiz, keyin biz ularni aylantirish uchun `for..of` dan foydalanishimiz mumkin.

Bu misol `start`dan `end`gacha bo‘lgan qiymatlar ketma-ketligini hosil qiladi:

```js run
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for(let value of generateSequence(1, 5)) {
  alert(value); // 1, then 2, then 3, then 4, then 5
}
```

Biz allaqachon bilganimizdek, obyektni takrorlanadigan qilish uchun unga `Symbol.iterator` ni qo'shishimiz kerak.

```js
let range = {
  from: 1,
  to: 5,
*!*
  [Symbol.iterator]() {
  range ni takrorlanadigan qilish uchun <obyektni next bilan qaytaring
  }
*/!*
}
```

`Symbol.iterator` uchun keng tarqalgan amaliyot generatorni qaytarishdir, ko`rib turganingizdek bu kodni qisqartiradi:

```js run
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() { // [Symbol.iterator]: uchun qisqartma function*()
    for(let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};

for(let value of range) {
  alert(value); // 1, keyin 2, keyin 3, keyin 4, keyin 5
}
```

Batafsil ma’lumot olishni istasangiz, [](info:generators) bobini ko;'rib chiqing.

Oddiy generatorlarda biz `await` dan foydalana olmaymiz. Barcha qiymatlar `for..of` konstruksiyasini talab qilganidek, ular sinxron tarzda kelishi kerak.

Agar biz asinxron qiymatlarni yaratmoqchi bo'lsak-chi? Masalan, tarmoq so'rovlaridan.

Buni amalga oshirish uchun asinxron generatorlarga o'tamiz.
## Asinxron generatorlar (vanihoyat)

Aksariyat amaliy ilovalar uchun, biz asinxron ravishda qiymatlar ketma-ketligini yaratadigan obyektni yaratmoqchi bo'lsak, biz asinxron generatordan foydalanishimiz mumkin.

Sintaksis oddiy: `funksiya*`ni `async` bilan oldinga qo'ying. Bu generatorni asinxron qiladi.

Va keyin uni takrorlash uchun `for await (...)` dan foydalaning, masalan:
```js run
*!*async*/!* function* generateSequence(start, end) {

  for (let i = start; i <= end; i++) {

*!*
    // await dan foydalanishimiz mumkin!
    await new Promise(resolve => setTimeout(resolve, 1000));
*/!*

    yield i;
  }

}

(async () => {

  let generator = generateSequence(1, 5);
  for *!*await*/!* (let value of generator) {
    alert(value); // 1, keyin 2, keyin 3, keyin 4, keyin 5 (orasida biroz kechikish bilan)
  }

})();
```

Generator asinxron bo'lgani uchun biz uning ichida `await` dan foydalanishimiz, va'dalarga tayanishimiz, tarmoq so'rovlarini bajarishimiz lozim va hokazo.

````aqlli sarlavha="hood ostidagi farq"
Agar siz generatorlar haqidagi tafsilotlarni texnik jihatdan eslab qoladigan ilg'or o'quvchi bo'lsangiz, ichki farq mavjud.

Asinxron generatorlar uchun `generator.next()` usuli asinxron bo'lib, va promise'larni qaytaradi.

Oddiy generatorda qiymatlarni olish uchun `result = generator.next()` dan foydalanamiz. Asinxron generatorida biz `await` ni qo'shishimiz kerak, masalan:

```js
natija = await generator.next(); // natija = {value: ..., bajarildi: true/false}
```
Shuning uchun ham asinxron generatorlar `for await...of` bilan ishlaydi.
````

### Asinxron takrorlanadigan diapazon

Takrorlash kodini qisqartirish uchun oddiy generatorlardan `Symbol.iterator` sifatida foydalanish mumkin.

Shunga o'xshab, asinxron generatorlar asinxron iteratsiyani amalga oshirish uchun `Symbol.asyncIterator` sifatida ishlatilishi mumkin.

Masalan, sinxron `Symbol.iterator` ni asinxron `Symbol.asyncIterator` bilan almashtirib, biz `range` obyektini sekundiga bir marta asinxron qiymatlarni yaratishimiz mumkin:

```js run
let range = {
  from: 1,
  to: 5,

  // bu qator [Symbol.asyncIterator] bilan bir xil: async function*() {
*!*
  async *[Symbol.asyncIterator]() {
*/!*
    for(let value = this.from; value <= this.to; value++) {

      // qiymatlar orasida pauza qiling, biroz kuting 
      await new Promise(resolve => setTimeout(resolve, 1000));

      yield value;
    }
  }
};

(async () => {

  for *!*await*/!* (let value of range) {
    alert(value); // 1, keyin 2, keyin 3, keyin 4, keyin 5
  }

})();
```

Endi qiymatlar ular orasida 1 soniya kechikish bilan keladi.

```smart
Texnik jihatdan obyektga `Symbol.iterator` va `Symbol.asyncIterator` ni qo'shishimiz mumkin, shuning uchun u sinxron (`for..of`) va asinxron (`for await..of`) takrorlanadi.
Amalda esa bu g'alati ish bo'lardi.
```

## Haqiqiy misol: sahifalangan ma'lumotlar

Hozirgacha biz tushunish uchun asosiy misollarni ko'rdik. Keling, haqiqiy hayotda foydalanish misolini ko'rib chiqaylik.

Sahifali ma'lumotlarni yetkazib beradigan ko'plab onlayn xizmatlar mavjud. Misol uchun, bizga foydalanuvchilar ro'yxati kerak bo'lganda, so'rov oldindan belgilangan sonni (masalan, 100ta foydalanuvchi) qaytaradi - "bir sahifa" va keyingi sahifaga URL manzilini beradi.

Ushbu usul juda keng tarqalgan. Bu foydalanuvchilar haqida emas, balki hamma narsa haqidadir.

Misol uchun, GitHub bizga majburiyatlarni bir xil, sahifalangan tarzda olish imkonini beradi:

- Biz `https://api.github.com/repos/<repo>/commits` shaklida `fetch` qilish uchun so'rov yuborishimiz kerak.
- U 30 ta topshiriqdan iborat JSON bilan javob beradi va shuningdek, `Link` sarlavhasidagi keyingi sahifaga havolani taqdim etadi.
- Keyin biz ushbu havoladan keyingi so'rov, ko'proq majburiyatlarni olish va hokazolar uchun foydalanishimiz mumkin.

Bizning kodimiz uchun biz majburiyatlarni olishning oddiyroq usuliga ega bo'lishni xohlaymiz.

Keling, biz uchun majburiyatlarni oladigan, kerak bo'lganda so'rovlar yuboradigan `fetchCommits(repo)` funksiyasini yarataylik. Va u barcha sahifalash ishlari haqida qayg'ursin. Biz uchun bu `wait..of` uchun oddiy asinxron iteratsiya bo'ladi.

Shunday qilib, foydalanish quyidagicha bo'ladi:

```js
for await (let commit of fetchCommits("username/repository")) {
  // jarayonni bajarish
}
```

Bu yerda asinxron generator sifatida amalga oshiriladigan bunday funksiya mavjud:

```js
async function* fetchCommits(repo) {
  let url = `https://api.github.com/repos/${repo}/commits`;

  while (url) {
    const response = await fetch(url, { // (1)
      headers: {'User-Agent': 'Our script'}, // github har qanday foydalanuvchi-agent sarlavhasiga muhtoj
    });

    const body = await response.json(); // (2) javob JSON (commit'lar massivi)

    // (3) keyingi sahifaning URL manzili sarlavhalarda, uni chiqarib oling
    let nextPage = response.headers.get('Link').match(/<(.*?)>; rel="next"/);
    nextPage = nextPage?.[1];

    url = nextPage;

    for(let commit of body) { // (4) yield sahifa tugaguniga qadar birma-bir bajariladi
      yield commit;
    }
  }
}
```

Bu qanday ishlashi haqida ko'proq ma'lumotlar:

1. Biz topshiriqlarni yuklab olish uchun brauzer [fetch](info:fetch) usulidan foydalanamiz.

    - Dastlabki URL manzili `https://api.github.com/repos/<repo>/commits`, keyingi sahifa esa javobning `Link` sarlavhasida bo'ladi.
    - `Fetch` usuli bizga kerak bo'lganda avtorizatsiya va boshqa sarlavhalarni taqdim etish imkonini beradi -- bu erda GitHub `User-Agent` ni talab qiladi.
2. Commit'lar JSON formatida qaytariladi.
3. Javobning `Link` sarlavhasidan keyingi sahifa URL manzilini olishimiz kerak. Uning maxsus formati bor, biz buning uchun oddiy iboradan foydalanamiz (biz bu xususiyatni [Regular expressions](ma'lumot:regular-expressions) da o'rganamiz).
    - Keyingi sahifa URL manzili `https://api.github.com/repositories/93253246/commits?page=2` kabi ko'rinishi mumkin. U GitHub tomonidan yaratilgan.
4. Keyin biz qabul qilingan majburiyatlarni birma-bir beramiz va ular tugagach, navbatdagi `while(url)` iteratsiyasi ishga tushadi va yana bitta so'rov yuboriladi.

Foydalanish misoli (konsolda mualliflarni topshirishni ko'rsatadi):

```js run
(async () => {

  let count = 0;

  for await (const commit of fetchCommits('javascript-tutorial/en.javascript.info')) {

    console.log(commit.author.login);

    if (++count == 100) { // keling, 100 ta commit'da to'xtaylik
      break;
    }
  }

})();

// Eslatma: Agar siz buni tashqi sinov muhitida ishlatayotgan bo'lsangiz, yuqorida tavsiflangan fetchCommits funksiyasini bu yerga joylashtirishingiz kerak bo'ladi.
```

Biz xohlagan narsa shu edi.

Sahifali so'rovlarning ichki mexanikasi tashqaridan ko'rinmaydi. Biz uchun bu shunchaki majburiyatlarni qaytaradigan asinxron generator.

## Xulosa

Muntazam iteratorlar va generatorlar yaratish uchun vaqt talab qilmaydigan ma'lumotlar bilan yaxshi ishlaydi.

Ma'lumotlar asinxron, kechikishlar bilan kelishini kutganimizda, `for..of` o'rniga `for await..of` asinxron hamkasblaridan foydalanish mumkin.

Asinxron va oddiy iteratorlar o'rtasidagi sintaktik farqlar:

|       | Iterable | Asinxron Iterable |
|-------|-----------|-----------------|
| Iteratorni ta'minlash usuli | `Symbol.iterator` | `Symbol.asyncIterator` |
| `next()` qaytish qiymati          | `{value:…, done: true/false}`         | ``{value:..., done: true/false}`ni hal qiladigan promise |

Asinxron va oddiy generatorlar o'rtasidagi sintaktik farqlar:
|       | Generatorlar | Asinxron generatorlar |
|-------|-----------|-----------------|
| Deklaratsiya | `function*` | `async function*` |
| `next()` return value is          | `{value:…, done: true/false}`         | `{value:…, done: true/false}` ni hal qiladigan `promise`  |

Veb dasturlashda biz ko'pincha ma'lumotlar oqimini uchratamiz, ular bo'lakma-bo'lak oqadi. Masalan, katta faylni yuklab olish yoki yuklash.

Bunday ma'lumotlarni qayta ishlash uchun asinxron generatorlardan foydalanishimiz mumkin. Shunisi e'tiborga loyiqki, ba'zi muhitlarda, masalan, brauzerlarda, bunday oqimlar bilan ishlash, ma'lumotlarni o'zgartirish va uni bir oqimdan boshqasiga o'tkazish uchun maxsus interfeyslarni ta'minlaydigan Streams deb nomlangan yana bir API ham mavjud.(masalan, bir joydan yuklab olib va darhol boshqa joyga yuborish mumkin).
