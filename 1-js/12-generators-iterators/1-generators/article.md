# Generatorlar

Oddiy funktsiyalar faqat bitta, yagona qiymatni qaytaradi (yoki hech narsani qaytarmasligiyam mumkin).

Generators can return ("yield") multiple values, one after another, on-demand. They work great with [iterables](info:iterable), allowing to create data streams with ease.

## Generator funksiyalari

Generator yaratish uchun bizga maxsus sintaksis konstruktsiyasi kerak bo'ladi: `function*`, "generator funktsiyasi" deb ataladi.

Bu shunday ko'rinadi:

```js
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}
```

Generator funksiyalari odatdagidan farq qiladi. Bunday funktsiya chaqirilganda, u o'z kodini ishga tushirmaydi. Buning o'rniga ijroni boshqarish uchun "generator obyekti" deb nomlangan maxsus obyektni qaytaradi.

Mana, qarang:

```js run
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}

// "generator funksiyasi" "generator obyekt"ini yaratadi
let generator = generateSequence();
*!*
alert(generator); // [object Generator]
*/!*
```

Funksiya kodini bajarish hali boshlanmagan:

![](generateSequence-1.svg)

Generatorning asosiy usuli bu `next()`. chaqirilsa, u eng yaqin `yield <value>` iborasigacha (`vallue` qoldirilishi mumkin, keyin esa `undefined`) bajarilishni amalga oshiradi. Keyin funktsiyaning bajarilishi to'xtatiladi va olingan `value` tashqi kodga qaytariladi.

`next()` natijasi har doim ikkita xususiyatga ega obyekt hisoblanadi:
- `value`: olingan qiymat.
- `done`: funksiya kodi tugallangan bo'lsa `true`, aks holda `false` bo'ladi.

Misol uchun, biz generatorni yaratamiz va uning birinchi qiymatini olamiz:

```js run
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}

let generator = generateSequence();

*!*
let one = generator.next();
*/!*

alert(JSON.stringify(one)); // {value: 1, done: false}
```

Hozircha biz faqat birinchi qiymatni oldik va funksiyaning bajarilishini ikkinchi qatorda ko'ramiz:

![](generateSequence-2.svg)

Keling, `generator.next()` ni yana chaqiramiz. U kodning bajarilishini davom ettiradi va keyingi `yield`ni qaytaradi:
```js
let two = generator.next();

alert(JSON.stringify(two)); // {value: 2, done: false}
```

![](generateSequence-3.svg)

Va agar biz uni uchinchi marta chaqiradigan bo'lsak, bajarilish funksiyani tugatadigan `return` iborasiga etadi:

```js
let three = generator.next();

alert(JSON.stringify(three)); // {value: 3, *!*done: true*/!*}
```

![](generateSequence-4.svg)

Endi generator tayyor. Biz buni `done:true` dan ko'rishimiz va yakuniy natija sifatida `value:3` ni qayta ishlashimiz kerak.

`generator.next()` ga yangi chaqiruvlar endi mantiqiy emas. Agar biz ularni qilsak, ular bir xil obyektni qaytaradi: `{done: true}`.

```aqlli sarlavha="` funksiya* f(…)` yoki `f(...)` funksiya to'g'rimi? Ikkala sintaksis ham to'g'ri.

Lekin odatda birinchi sintaksisga afzallik beriladi, chunki yulduz `*` generator funksiyasi ekanligini bildiradi, u nomni emas, turini tavsiflaydi, shuning uchun u `function` kalit so`ziga yopishib olishi kerak.
```

## Generatorlar takrorlanadi

 `next()` usuliga qarab tahmin qilganingizdek, generatorlar [takrorlanuvchan](info:iterable).

 Biz `for..of` yordamida ularning qiymatlarini aylanib chiqishimiz mumkin:

```js run
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}

let generator = generateSequence();

for(let value of generator) {
  alert(value); // 1, then 2
}
```

Bu `.next().value` ga qo'ng'iroq qilishdan ko'ra ancha yaxshi ko'rinadi, shunday emasmi?  

...Ammo diqqat qiling: yuqoridagi misolda `1`, keyin `2` ko'rsatilgan va hammasi shu. U `3` ni ko'rsatmaydi!

 achonki `done: true` bo'lsa, `for..of` iteratsiyasi oxirgi `value` ga e'tibor bermaydi. Shunday qilib, agar biz barcha natijalarni `for..of` orqali ko'rsatilishini istasak, ularni `yield` bilan qaytarishimiz kerak:

```js run
function* generateSequence() {
  yield 1;
  yield 2;
*!*
  yield 3;
*/!*
}

let generator = generateSequence();

for(let value of generator) {
  alert(value); // 1, then 2, then 3
}
```
Generatorlar takrorlanadigan bo'lgani uchun biz barcha tegishli funksiyalarni chaqirishimiz mumkin, masalan, tarqalish sintaksisi `...`:

```js run
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}

let sequence = [0, ...generateSequence()];

alert(sequence); // 0, 1, 2, 3
```
Yuqoridagi kodda `...generateSequence()` takrorlanadigan generator obyektini elementlar massiviga aylantiradi 
(quyidagi bobda batafsil o'qing[]
(info:rest-parameters-spread#spread-syntax))

## Takrorlanuvchilar uchun generatorlardan foydalanish

Bir muncha vaqt oldin, [](info:iterable) bobida biz `from..to` qiymatlarni qaytaruvchi takrorlanadigan `range` obyektini yaratdik.

Mana, kodni eslaylik:
```js run
let range = {
  from: 1,
  to: 5,

  // for..of range bu usulni boshida bir marta chaqiradi
  [Symbol.iterator]() {
    // ...iterator obyektini qaytaradi:
     // oldinga, for..of faqat shu obyekt bilan ishlaydi va undan keyingi qiymatlarni so'raydi
    return {
      current: this.from,
      last: this.to,

      // next() har bir iteratsiyada for..of sikli orqali chaqiriladi
      next() {
        // u qiymatni obyekt sifatida qaytarishi kerak {done:.., value:...}
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

// diapazon bo'ylab takrorlash interval.dan intervalgacha bo'lgan raqamlarni qaytaradi
alert([...range]); // 1,2,3,4,5
```

Biz uni `Symbol.iterator` sifatida taqdim etish orqali iteratsiya uchun generator funksiyasidan foydalanishimiz mumkin.

Mana bir xil `range`, lekin ancha ixchamroq:

```js run
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() { // [Symbol.iterator] ning qisqartmasi: function*()
    for(let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};

alert( [...range] ); // 1,2,3,4,5
```

Bu ishlaydi, chunki `range[Symbol.iterator]()` endi generatorni qaytaradi va generator usullari aynan `for..of` kutgan narsadir:
- u `.next()` usuliga ega
- bu qiymatlarni `{value: ..., done: true/false}` shaklida qaytaradi

Bu tasodif emas, albatta. Generatorlar ularni osonlik bilan amalga oshirish uchun JavaScript tiliga iteratorlarni hisobga olgan holda qo'shildi.

Generatorli variant asl `range` (qator) ning takrorlanadigan kodiga qaraganda ancha ixchamroq va bir xil funksionallikni saqlaydi.

``aqlli sarlavha="Generatorlar abadiy qiymatlarni yaratishi mumkin"
Yuqoridagi misollarda biz chekli ketma-ketliklarni yaratdik, lekin biz abadiy qiymatlarni beradigan generatorni ham yaratishimiz mumkin. Masalan, psevdo-tasodifiy raqamlarning tugamaydigan ketma-ketligi.

Bu, albatta, bunday generatorga nisbatan `for..of` da `break` (yoki `return`) ni talab qiladi. Aks holda, halqa abadiy takrorlanadi va osilib qoladi.
```

## Generator tarkibi
Generator tarkibi generatorlarning o'ziga xos xususiyati bo'lib, generatorlarni bir-biriga shaffof "embed" (joylashtirish) imkonini beradi.

Masalan, bizda raqamlar ketma-ketligini yaratadigan funksiya mavjud:

```js
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
```

Endi biz undan murakkabroq ketma-ketlikni yaratish uchun uni qayta ishlatmoqchimiz:
- birinchidan, `0..9` raqamlari (48..57 belgilar kodlari bilan),
- keyin bosh alifbo harflari `A..Z` (belgi kodlari 65..90)
- keyin kichik alifbo harflari `a..z` (belgi kodlari 97..122)

Biz ushbu ketma-ketlikni ishlatishimiz mumkin, masalan, undan belgilarni tanlash orqali parollar yaratish uchun foydalanamiz (sintaksis belgilarini ham qo'shish mumkin), lekin avval uni yaratib olishimiz lozim.

Oddiy funksiyada bir nechta boshqa funksiyalardan natijalarni birlashtirish uchun biz ularni chaqiramiz, natijalarni saqlaymiz va oxirida qo'shamiz.

Generatorlar uchun bir generatorni boshqasiga "embed" (compose) uchun maxsus `yield*` sintaksisi mavjud.

Yaratilgan generator:

```js run
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

function* generatePasswordCodes() {

*!*
  // 0..9
  yield* generateSequence(48, 57);

  // A..Z
  yield* generateSequence(65, 90);

  // a..z
  yield* generateSequence(97, 122);
*/!*

}

let str = '';

for(let code of generatePasswordCodes()) {
  str += String.fromCharCode(code);
}

alert(str); // 0..9A..Za..z
```

`Yeld*` yo'riqnomasi ijroni boshqa generatorga  *topshiradi*. Bu atama `yield* gen` generator `gen` ustidan takrorlanishini va go'yo qiymatlar tashqi generator tomonidan berilgandek uning hosildorligini shaffof ravishda tashqariga yo'naltirishini bildiradi. 

Natijada biz o'rnatilgan generatorlardan kodni kiritganimiz bilan bir xil bo'ladi:

```js run
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

function* generateAlphaNum() {

*!*
  // yield* generateSequence(48, 57);
  for (let i = 48; i <= 57; i++) yield i;

  // yield* generateSequence(65, 90);
  for (let i = 65; i <= 90; i++) yield i;

  // yield* generateSequence(97, 122);
  for (let i = 97; i <= 122; i++) yield i;
*/!*

}

let str = '';

for(let code of generateAlphaNum()) {
  str += String.fromCharCode(code);
}

alert(str); // 0..9A..Za..z
```

Generator tarkibi - bu bir generatorning oqimini boshqasiga kiritishning tabiiy usuli. Oraliq natijalarni saqlash uchun qo'shimcha xotiradan foydalanilmaydi.

## "yield", ya'ni "hosildorlik" - bu ikki tomonlama ko'cha

Shu paytgacha generatorlar qiymatlarni yaratish uchun maxsus sintaksisga ega bo'lgan takrorlanadigan obyektlarga o'xshash edi. Lekin aslida ular ancha kuchli va moslashuvchan bo'lishadi.

Buning sababi shundaki, `yield` ikki tomonlama ko'chadir: u nafaqat natijani tashqi tomonga qaytaradi, balki generator ichidagi qiymatni ham o'tkazishi mumkin.

Buning uchun `generator.next(arg)` ni argument bilan chaqirishimiz kerak. Bu argument `yield` natijasiga aylanadi.

Quyidagi misolni ko'rib chiqamiz:

```js run
function* gen() {
*!*
  // Savolni tashqi kodga yuboring va javobni kuting
  let result = yield "2 + 2 = ?"; // (*)
*/!*

  alert(result);
}

let generator = gen();

let question = generator.next().value; // <-- yield value ni qaytaradi

generator.next(4); // --> natijani generatorga o'tkazing
```

![](genYield2.svg)

1. `generator.next()` birinchi chaqiruvi har doim argumentsiz amalga oshirilishi kerak (argument uzatilsa e'tiborga olinmaydi). U bajarishni boshlaydi va birinchi `2+2=?” yield` ning natijasini qaytaradi. Bu vaqtda generator `(*)` qatorida qolib, bajarishni to'xtatib turadi.
2. Keyin, yuqoridagi rasmda ko'rsatilganidek, `yield` natijasi qo'ng'iroq kodidagi `question` o'zgaruvchisiga tushadi.
3. `generator.next(4)` da generator davom etadi va natijada `4` kiritiladi: `natija = 4` bo`ladi.

E'tibor bering, tashqi kod darhol `keyingi(4)` ni chaqirishi shart emas. Bu vaqt talab qilishi mumkin. Bu muammo emas: generator kutib turadi.

Masalan:

```js
// bir muncha vaqt o'tgach, generatorni qayta ishga tushiring
setTimeout(() => generator.next(4), 1000);
```

Ko'rib turganimizdek, oddiy funkssiyalardan farqli o'laroq, generator va qo'ng'iroq kodi `next/yield` ga qiymatlarni o'tkazish orqali natijalarni almashishi mumkin.

Vaziyatni yanada ravshanroq qilish uchun, bu yerda ko'proq qo'ng'iroqlar bilan yana bir misolni ko'rib chiqamiz:

```js run
function* gen() {
  let ask1 = yield "2 + 2 = ?";

  alert(ask1); // 4

  let ask2 = yield "3 * 3 = ?"

  alert(ask2); // 9
}

let generator = gen();

alert( generator.next().value ); // "2 + 2 = ?"

alert( generator.next(4).value ); // "3 * 3 = ?"

alert( generator.next(9).done ); // true
```

Natijaviy surat:

![](genYield2-2.svg)

1. Birinchi `.next()` bajarilishni boshlaydi... U birinchi `yield`ga yetadi.
2. Natija tashqi kodga qaytariladi.
3. Ikkinchi `.next(4)` birinchi `yield` natijasida `4` ni generatorga qaytaradi va bajarishni davom ettiradi.
4. ...U generator chaqiruvining natijasi bo'lgan ikkinchi `yield` ga yetadi.
5. Uchinchi `next(9)`  ikkinchi `yield` natijasi sifatida generatorga `9`ni uzatadi va funksiyaning oxiriga yetib boruvchi bajarishni davom ettiradi, shuning uchun `done: true` hisoblanadi.

Bu "ping-pong" o'yiniga o'xshaydi. Har bir `next(value)` (birinchisidan tashqari) generatorga joriy `yield` natijasiga aylanadigan qiymatni uzatadi va keyin keyingi `yield` natijasini qaytaradi.

## generator.throw

Yuqoridagi misollarda ko'rganimizdek, tashqi kod `yield` natijasi sifatida generatorga qiymat o'tkazishi mumkin.

...Lekin u yerda xatoni ham boshlashi (tashlashi) mumkin. Bu tabiiy hol, chunki xato o'ziga xos natijadir.

Xatoni `yield` ga o'tkazish uchun biz uni `generator.throw(err)` deb nomlashimiz kerak. Bunday holda, `err` o'sha `yield` bilan bir qatorga tashlanadi.

Masalan, bu yerdagi `"2 + 2 = ?"` natijasi xatoga olib keladi:

```js run
function* gen() {
  try {
    let result = yield "2 + 2 = ?"; // (1)

    alert("Ijro bu yerga yetib bormaydi, chunki istisno yuqorida tashlanadi");
  } catch(e) {
    alert(e); // error ni ko'rsatadi
  }
}

let generator = gen();

let question = generator.next().value;

*!*
generator.throw(new Error("Javob mendagi ma'lumotlar bazasida topilmadi")); // (2)
*/!*
```

`(2)` qatorida generatorga yuborilgan error `(1)` qatorida `yield` bilan istisnoga olib keladi. Yuqoridagi misolda `try..catch` uni ushlaydi va ko'rsatadi.

Agar biz buni ushlamasak, u holda har qanday istisno singari, u generatorni chaqiruv kodiga "tushadi".

Qo'ng'iroq kodining joriy qatori `generator.throw` ga ega bo'lib, `(2)` sifatida belgilangan. Shunday qilib, biz uni bu yerda qo'lga olishimiz mumkin, masalan:

```js run
function* generate() {
  let result = yield "2 + 2 = ?"; // Ushbu qatorda error mavjud
}

let generator = generate();

let question = generator.next().value;

*!*
try {
  generator.throw(new Error("Javob mendagi ma'lumotlar bazasida topilmadi"));
} catch(e) {
  alert(e); // errorni ko'rsatadi
}
*/!*
```

Agar u yerda errorni sezmasak, odatdagidek, u tashqi qo'ng'iroq kodiga (agar mavjud bo'lsa) tushadi va agar ushlanmasa, skriptni o'ldiradi.

## generator.return

`generator.return(value)` generatorning bajarilishini tugatadi va berilgan `value`ni qaytaradi.

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const g = gen();

g.next();        // { value: 1, done: false }
g.return('foo'); // { value: "foo", done: true }
g.next();        // { value: undefined, done: true }
```

Agar tugallangan generatorda `generator.return()` dan yana foydalansak, u yana bu qiymatni qaytaradi ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/return)).

Ko'pincha biz undan foydalanmaymiz, chunki biz barcha qaytib keladigan qiymatlarni olishni xohlaymiz, lekin generatorni muayyan holatda to'xtatmoqchi bo'lganimizda foydali bo'lishi mumkin.

## Xulosa

- Generatorlar `function* f(…) {…}` generator funksiyalari orqali yaratilgan.
- Generatorlar ichida (faqat) `yield` operatori mavjud.
- Tashqi kod va generator `next/yield` qo'ng'iroqlari orqali natijalarni almashishi mumkin.

Zamonaviy JavaScript-da generatorlar kamdan-kam qo'llaniladi. Ammo ba'zida ular foydali bo'ladi, chunki funktsiyani bajarish paytida qo'ng'iroq kodi bilan ma'lumot almashish qobiliyati juda noyobdir. Va, albatta, ular takrorlanadigan obyektlarni yaratish uchun juda yaxshi vosita.

Shuningdek, keyingi bobda biz `for await ... of` sikllarida asinxron tarzda yaratilgan ma'lumotlar oqimini (masalan, tarmoq orqali sahifalangan olishlar) o'qish uchun ishlatiladigan asinxron generatorlarni o'rganamiz.

Veb-dasturlashda biz ko'pincha oqimli ma'lumotlar bilan ishlaymiz, shuning uchun yana bir juda muhim foydalanish holatini ko'rib chiqamiz.
