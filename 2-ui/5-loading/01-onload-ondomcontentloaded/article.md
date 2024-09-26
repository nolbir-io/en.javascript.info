# Sahifa: DOMContentLoaded, load, beforeunload, unload

HTML-sahifaning hayotiy aylanishi uchta muhim hodisadan iborat:

- `DOMContentLoaded` -- brauzer HTML-ni to'liq yuklagan va DOM daraxti qurilgan, ammo `<img>` rasmlar va uslublar jadvallari kabi tashqi resurslar hali yuklanmagan bo'lishi mumkin.
- `load` -- nafaqat HTML, balki barcha tashqi resurslar ham yuklanadi: tasvirlar, uslublar va h.k.
- `beforeunload/unload` -- foydalanuvchi sahifani tark etmoqda.

Har bir hodisa foydali bo'lishi mumkin:

- `DOMContentLoaded` hodisasi -- DOM tayyor, shuning uchun ishlov beruvchi DOM tugunlarini qidirishi, interfeysni ishga tushirishi mumkin.
- `load` hodisasi -- tashqi resurslar yuklanadi, shuning uchun uslublar qo'llaniladi, tasvir o'lchamlari ma'lum.
- `beforeunload` hodisasi -- foydalanuvchi ketmoqda: foydalanuvchi o'zgarishlarni saqlaganligini tekshirib ko'rishimiz va ulardan haqiqatan ham ketishni xohlashini so'rashimiz mumkin.
- `unload` -- foydalanuvchi deyarli tark etdi, lekin biz hali ham ba'zi operatsiyalarni boshlashimiz mumkin, masalan, statistikani yuborish.

Keling, ushbu voqealarning tafsilotlarini ko'rib chiqaylik.

## DOMContentLoaded
`DOMContentLoaded` hodisasi `document` obyektida sodir bo`ladi.

Uni qo'lga olish uchun `addEventListener` dan foydalanishimiz kerak:

```js
document.addEventListener("DOMContentLoaded", ready);
// "document.onDOMContentLoaded = ..." emas
```

Masalan:

```html run height=200 refresh
<script>
  function ready() {
    alert('DOM is ready');

    // tasvir hali yuklanmagan (agar u keshlangan bo'lmasa), shuning uchun hajmi 0x0
    alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);
  }

*!*
  document.addEventListener("DOMContentLoaded", ready);
*/!*
</script>

<img id="img" src="https://en.js.cx/clipart/train.gif?speed=1&cache=0">
```

Misolda, `DOMContentLoaded` ishlov beruvchisi hujjat yuklanganda ishlaydi, shuning uchun u barcha elementlarni, jumladan, quyida joylashgan `<img>`ni ko'rishi mumkin.

Lekin rasm yuklanishini kutmaydi. Shunday qilib, `alert` nol o'lchamlarni ko'rsatadi.

Bir qarashda, DOMContentLoaded hodisasi juda oddiy. DOM daraxti tayyor -- mana hodisa. Bir nechta o'ziga xosliklar mavjud.

### DOMContentLoaded va skriptlar

Brauzer HTML-hujjatni qayta ishlaganda va `<script>` tegiga duch kelganda, DOMni yaratishni davom ettirishdan oldin uni bajarishi kerak. Bu ehtiyot chorasi, chunki skriptlar DOMni o'zgartirishni va hatto `document.write` ni unga o'zgartirishni xohlashi mumkin, shuning uchun `DOMContentLoaded` kutishi kerak.

Shunday qilib, DOMContentLoaded, albatta, bunday skriptlardan keyin sodir bo'ladi:

```html run
<script>
  document.addEventListener("DOMContentLoaded", () => {
    alert("DOM ready!");
  });
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.3.0/lodash.js"></script>

<script>
  alert("Library loaded, inline script executed");
</script>
```
Yuqoridagi misolda biz avval "Library loaded..." ni , keyin esa "DOM ready!" ni ko'ramiz (barcha skriptlar bajariladi).

```warn header="DOMContentLoaded ni bloklamaydigan skriptlar"
Ushbu qoidadan ikkita istisno mavjud:
1. Biz [birozdan keyin] (info:script-async-defer) qamrab oladigan `async` atribyutiga ega skriptlar `DOMContentLoaded`ni bloklamang.
2. `document.createElement('script')` yordamida dinamik ravishda yaratilgan va keyin veb-sahifaga qo'shilgan skriptlar ham bu hodisani bloklamaydi.
```

### DOMContentLoaded va uslublar

Tashqi uslublar jadvallari DOM ga ta'sir qilmaydi, shuning uchun `DOMContentLoaded` ularni kutmaydi.

Lekin bir tuzoq bor. Agar bizda uslubdan keyin skript mavjud bo'lsa, u holda bu skript uslublar jadvali yuklanmaguncha kutishi kerak:

```html run
<link type="text/css" rel="stylesheet" href="style.css">
<script>
  // skript uslublar jadvali yuklanmaguncha bajarilmaydi
  alert(getComputedStyle(document.body).marginTop);
</script>
```
Buning sababi shundaki, skript yuqoridagi misoldagi kabi elementlarning koordinatalarini va boshqa uslubga bog'liq xususiyatlarini olishni xohlashi mumkin. Tabiiyki, uslublar yuklanishini kutish kerak.

`DOMContentLoaded` skriptlarni kutganidek, endi u ulardan oldingi uslublarni ham kutadi.

### O'rnatilgan brauzerni avtomatik to'ldirish

`DOMContentLoaded` da Firefox, Chrome va Opera avtomatik to'ldirish shakllari mavjud.

Misol uchun, agar sahifada login va parolga ega bo'lgan shakl mavjud bo'lsa va brauzer qiymatlarni eslab qolsa, u holda `DOMContentLoaded` da ularni avtomatik to'ldirishga harakat qilishi mumkin (agar foydalanuvchi tomonidan ma'qullangan bo'lsa).

Shunday qilib, agar `DOMContentLoaded` uzoq vaqt yuklanadigan skriptlar tomonidan qoldirilsa, avtomatik to'ldirish ham kutiladi. Ehtimol, ba'zi saytlarda (agar siz brauzerni avtomatik to'ldirishdan foydalansangiz) -- login/parol maydonlari darhol avtomatik to'ldirilmasligini ko'rgansiz, lekin sahifa to'liq yuklanmaguncha kechikish ehtimoli mavjud. Bu `DOMContentLoaded` hodisasigacha kechikadi.


## window.onload [#window-onload]

`Window` obyektidagi `load` hodisasi butun sahifa, jumladan uslublar, tasvirlar va boshqa manbalar yuklanganda ishga tushadi. Ushbu hodisa `onload` xususiyati orqali mavjud.

Quyidagi misolda tasvir o'lchamlari to'g'ri ko'rsatilgan, chunki `window.onload` barcha tasvirlarni kutadi:

```html run height=200 refresh
<script>
  window.onload = function() { // window.addEventListener dan ham foydalanish mumkin('load', (event) => {
    alert('Page loaded');

    // image bu vaqtda yuklangan
    alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);
  };
</script>

<img id="img" src="https://en.js.cx/clipart/train.gif?speed=1&cache=0">
```

## window.onunload
Visitor sahifani tark etganda, `unload` hodisasi `window` ishga tushadi. Biz u yerda kechikish bilan bog'liq bo'lmagan ishni qilishimiz mumkin, masalan, tegishli qalqib chiquvchi oynalarni yopish.

E'tiborga molik istisno tahliliy ma'lumotlarni yuborishdir.

Aytaylik, biz sahifadan qanday foydalanish haqida ma'lumot to'playmiz: sichqonchani bosish, aylantirish, ko'rilgan sahifa maydonlari va boshqalar.

Tabiiyki, `unload` hodisasi foydalanuvchi bizni tark etganda sodir bo'ladi va biz ma'lumotlarni serverimizda saqlamoqchimiz.

Bunday ehtiyojlar uchun <https://w3c.github.io/beacon/> spetsifikatsiyasida tasvirlangan maxsus `navigator.sendBeacon(url, data)` usuli mavjud.

U ma'lumotlarni fonda yuboradi. Boshqa sahifaga o'tish kechiktirilmaydi: brauzer sahifani tark etadi, lekin baribir `sendBeacon` ni bajaradi.

Undan qanday foydalanish kerakligi quyida tushuntirilgan:
```js
let analyticsData = { /* to'plangan ma'lumotlarga ega obyekt */ };

window.addEventListener("unload", function() {
  navigator.sendBeacon("/analytics", JSON.stringify(analyticsData));
});
```
- So'rov POST sifatida yuboriladi.
- Biz <info:fetch> bobida ta'riflanganidek, biz nafaqat satrni, balki shakllar va boshqa formatlarni ham yuborishimiz mumkin, lekin odatda bu stringli obyektdir.
- Ma'lumot 64 kb bilan cheklangan.

`sendBeacon` so'rovi tugagach, brauzer hujjatni allaqachon tark etgan bo'lishi mumkin, shuning uchun serverdan javob olishning iloji yo'q (bu odatda tahlillar uchun bo'sh hisoblanadi).

Umumiy tarmoq so'rovlari uchun [fetch](info:fetch) usulida "chapdan keyingi sahifa" so'rovlarini bajarish uchun `keepalive` bayrog'i ham mavjud. Qo'shimcha ma'lumotni <info:fetch-api> bo'limida topishingiz mumkin.


Agar biz boshqa sahifaga o'tishni bekor qilmoqchi bo'lsak, biz buni bu yerda bajarolmaymiz. Lekin biz boshqa `onbeforeunload` hodisadan foydalanishimiz mumkin.

## window.onbeforeunload [#window.onbeforeunload]

Agar tashrifchi sahifadan uzoqda navigatsiyani boshlagan bo'lsa yoki oynani yopishga harakat qilsa, `beforeunload` ishlov beruvchisi qo'shimcha tasdiqlashni so'raydi.

Agar biz tadbirni bekor qilsak, brauzer tashrif buyuruvchidan ishonch hosil qilishini so'rashi mumkin.

Siz ushbu kodni ishga tushirish va sahifani qayta yuklash orqali sinab ko'rsangiz bo'ladi:

```js run
window.onbeforeunload = function() {
  return false;
};
```

Tarixiy sabablarga ko'ra, bo'sh bo'lmagan qatorni qaytarish ham tadbirni bekor qilish hisoblanadi. Bir muncha vaqt oldin brauzerlar buni xabar sifatida ko'rsatishgan, ammo [zamonaviy spetsifikatsiya](https://html.spec.whatwg.org/#unloading-documents) aytganidek, bunday qilmaslik kerak.

Mana, quyidagi namunaga e'tibor bering:

```js run
window.onbeforeunload = function() {
  return "There are unsaved changes. Leave now?";
};
```
Behavior o'zgartirildi, chunki ba'zi veb-ustalar noto'g'ri va bezovta qiluvchi xabarlarni ko'rsatish orqali ushbu hodisani ishlovchini suiiste'mol qilishdi. Shunday qilib, hozirda eski brauzerlar uni xabar sifatida ko'rsatishi mumkin, ammo bundan tashqari, foydalanuvchiga ko'rsatilgan xabarni sozlashning hech qanday usuli yo'q.

````warn header="`event.preventDefault()` `beforeunload` ishlov beruvchisida ishlamaydi`"
Bu biroz g'alati tuyilishi mumkin, ammo ko'pchilik brauzerlar `event.preventDefault()` ni e'tiborga olmaydi.

Bu shuni anglatadiki, quyida berilgan kod ishlamasligi mumkin:
```js run
window.addEventListener("beforeunload", (event) => {
  // ishlamaydi, demak ushbu event handler hech qanday vazifani bajarmaydi
	event.preventDefault();
});
```

Buning o'rniga, bunday ishlov beruvchilarda yuqoridagi kodga o'xshash natijani olish uchun `event.returnValue` ni qatorga o'rnatish kerak:
```js run
window.addEventListener("beforeunload", (event) => {
  // window.onbeforeunload dan qaytish bilan bir xil ishlaydi
	event.returnValue = "There are unsaved changes. Leave now?";
});
```
````

## readyState

Hujjat yuklangandan so'ng `DOMContentLoaded` ishlov beruvchisini o'rnatsak nima bo'ladi?

Tabiiyki, u hech qachon yugurmaydi.

Hujjat tayyor yoki tayyor emasligiga ishonchimiz komil bo'lmagan holatlar mavjud. Biz DOM yuklanganda funksiyamiz bajarilishini xohlaymiz, yo hozir yoki keyinroq.

`document.readyState` xususiyati bizga joriy yuklanish holati haqida xabar beradi.

3 ta mumkin bo'lgan qiymat mavjud:

- `"loading"` -- hujjat yuklanmoqda.
- `"interactive"` -- hujjat to'liq o'qildi.
- `"complete"` -- Hujjat to'liq o'qildi va barcha resurslar (masalan, tasvirlar) yuklandi.

Shunday qilib, biz `document.readyState` ni tekshirib, ishlov beruvchini o‘rnatishimiz yoki kod tayyor bo'lsa, darhol uni bajarishimiz mumkin.

Shunga o'xshash:

```js
function work() { /*...*/ }

if (document.readyState == 'loading') {
  // hali ham yuklanmoqda, event ni kutib turing
  document.addEventListener('DOMContentLoaded', work);
} else {
  // DOM tayyor!
  work();
}
```
Vaziyat o'zgarganda ishga tushadigan `readstatechange` hodisasi ham mavjud, shuning uchun biz ushbu barcha holatlarni quyidagicha chop etishimiz mumkin:

```js run
// current state
console.log(document.readyState);

// print state changes
document.addEventListener('readystatechange', () => console.log(document.readyState));
```

`readstatechange` hodisasi hujjatning yuklanish holatini kuzatishning muqobil mexanikasi bo'lib, u ancha oldin paydo bo'lgan. Hozirgi vaqtda u kamdan-kam qo'llaniladi.

Keling, to'liqlik uchun voqealar oqimini ko'rib chiqaylik.

Mana `<iframe>`, `<img>` va hodisalarni qayd qiluvchi ishlov beruvchilarga ega hujjat:

```html
<script>
  log('initial readyState:' + document.readyState);

  document.addEventListener('readystatechange', () => log('readyState:' + document.readyState));
  document.addEventListener('DOMContentLoaded', () => log('DOMContentLoaded'));

  window.onload = () => log('window onload');
</script>

<iframe src="iframe.html" onload="log('iframe onload')"></iframe>

<img src="https://en.js.cx/clipart/train.gif" id="img">
<script>
  img.onload = () => log('img onload');
</script>
```

Ishlaydigan namuna [sandbox](sandbox:readystate) da berilgan .

Oddiy namuna:
1. [1] initial readyState:loading
2. [2] readyState:interactive
3. [2] DOMContentLoaded
4. [3] iframe onload
5. [4] img onload
6. [4] readyState:complete
7. [4] window onload

Kvadrat qavs ichidagi raqamlar bu sodir bo'ladigan taxminiy vaqtni bildiradi. Xuddi shu raqam bilan belgilangan hodisalar taxminan bir vaqtning o'zida sodir bo'ladi (+- bir necha milodiy).

- `document.readyState` `DOMContentLoaded` oldidan `interactive` bo`ladi. Bu ikki narsa aslida bir xil ma'noni anglatadi.
- `document.readyState` barcha resurslar (`iframe` va `img`) yuklanganda `complete` hisoblanadi. Bu yerda biz `img.onload` (`img` oxirgi manba) va `window.onload` bilan bir vaqtda sodir bo'lishini ko'rishimiz mumkin. `complete` holatiga o'tish `window.onload` bilan bir xil degan ma'noni anglatadi. Farqi shundaki, `window.onload` har doim boshqa barcha `load` ishlov beruvchilardan keyin ishlaydi.


## Xulosa

Page load hodisalari:

- DOM tayyor bo'lganda `DOMContentLoaded` hodisasi `document` da ishga tushadi. Ushbu bosqichda biz JavaScriptni elementlarga qo'llashimiz mumkin.
   - `<script>...</script>` yoki `<script src="..."></script>` bloki DOMContentLoaded kabi skript, brauzer ularning bajarilishini kutadi.
   - Rasmlar va boshqa manbalar yuklanishida davom etishi mumkin.
- `window` dagi `load` hodisasi sahifa va barcha resurslar yuklanganda ishga tushadi. Biz uni kamdan-kam ishlatamiz, chunki odatda uzoq kutishning hojati yo'q.
- `window`dagi `beforeunload` hodisasi foydalanuvchi sahifani tark etmoqchi bo'lganda ishga tushadi. Agar biz hodisani bekor qilsak, brauzer foydalanuvchi haqiqatdan ham ketishni xohlashini so'raydi (masalan, bizda saqlanmagan o'zgarishlar mavjud).
- `window` dagi `unload` hodisasi foydalanuvchi nihoyat chiqib ketayotganda ishga tushadi, ishlov beruvchida biz faqat kechikishlar yoki foydalanuvchidan so'rash bilan bog'liq bo'lmagan oddiy ishlarni bajarishimiz mumkin. Ushbu cheklov tufayli u kamdan-kam qo'llaniladi. Biz `navigator.sendBeacon` orqali tarmoq so'rovini yuborishimiz mumkin.
- `document.readyState` - hujjatning joriy holati, o'zgarishlarni `readstatechange` hodisasida kuzatish mumkin:
   - `loading` -- hujjat yuklanmoqda.
   - `interactive` -- hujjat tahlil qilinadi, `DOMContentLoaded` bilan bir vaqtda, lekin undan oldin sodir bo'ladi.
   - `complete` -- hujjat va resurslar yuklanadi, `window.onload` bilan bir vaqtda, lekin undan oldin sodir bo'ladi.
