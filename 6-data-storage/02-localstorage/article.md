# LocalStorage, sessionStorage

`localStorage` va `sessionStorage` veb-saqlash obyektlari brauzerda kalit/qiymat juftlarini saqlashga imkon beradi.

Ularning qiziq tomoni shundaki, ma'lumotlar sahifa yangilanganda (`sessionStorage` uchun) va hatto brauzer to'liq qayta ishga tushirilganda ham (`localStorage` uchun) saqlanib qoladi. Buni tez orada ko'rib chiqamiz.

Bizda allaqachon kukilar bor. Nima uchun bizga qo'shimcha obyektlar kerak?

- Cookie-fayllardan farqli o'laroq, web storage obyektlari har bir so'rov bilan serverga yuborilmaydi. Shu sababli, biz ko'proq narsalarni saqlashimiz mumkin. Ko'pgina zamonaviy brauzerlar kamida 5 megabayt (yoki undan ko'p) ma'lumotlarga ruxsat beradi va uni sozlash uchun sozlamalar mavjud.
- Shuningdek, cookie-fayllardan farqli o'laroq, server HTTP sarlavhalari orqali saqlash obyektlarini boshqara olmaydi. Hammasi JavaScriptda bajarilgan.
- Saqlash manbaga bog'langan (domen/protokol/port uchligi). Ya'ni, turli protokollar yoki subdomenlar turli xil saqlash obyektlarini chiqaradi, ular bir-biridan ma'lumotlarga kira olmaydi.

Ikkala saqlash obyekti ham bir xil usullar va xususiyatlarni ta'minlaydi:

- `setItem(key, value)` -- kalit/qiymat juftligini saqlash.
- `getItem(key)` -- kalit bo'yicha qiymatni oling.
- `removeItem(key)` -- qiymati bilan kalitni olib tashlang.
- `clear()` -- hamma narsani o'chirish.
- `key(index)` -- berilgan pozitsiyada kalitni olish.
- `length` -- saqlangan elementlar soni.

Ko'rib turganingizdek, u `Map` to'plamiga o'xshaydi (`setItem/getItem/removeItem`), lekin `key(index)` bilan indeks bo'yicha kirish imkonini beradi.

Keling, bu qanday ishlashini ko'rib chiqaylik.

## localStorage namunasi

`localStorage` ning asosiy xususiyatlari quyidagilardir:

- Bir xil manbadagi barcha yorliqlar va oynalar o'rtasida taqsimlanadi.
- Ma'lumotlar muddati tugamaydi. Brauzer va hattoki OS qayta ishga tushirilgandan keyin ham qoladi.

Misol uchun, agar siz ushbu kodni ishlatsangiz...

```js run
localStorage.setItem('test', 1);
```

...Va brauzerni yoping/oching yoki xuddi shu sahifani boshqa oynada oching, keyin siz buni quyidagicha olishingiz mumkin:

```js run
alert( localStorage.getItem('test') ); // 1
```

Biz faqat bir xil kelib chiqish (domen/port/protokol) ga ega bo'lishimiz kerak, url yo'li boshqacha bo'lishi mumkin.

`localStorage` bir xil kelib chiqishi bo'lgan barcha oynalar o'rtasida taqsimlanadi, shuning uchun agar biz ma'lumotlarni bitta oynaga o'rnatsak, o'zgarish boshqa oynada ko'rinadi.

## Obyektga o'xshash kirish

Shuningdek, biz kalitlarni olish/sozlashning oddiy obyekt usulidan foydalanishimiz mumkin, masalan:

```js run
// kalitni o'rnating
localStorage.test = 2;

// kalitni oling
alert( localStorage.test ); // 2

// kalitni butunlay olib tashlang
delete localStorage.test;
```

Bunga tarixiy sabablarga ko'ra ruxsat berilgan va asosan ishlaydi, lekin odatda tavsiya etilmaydi, chunki:

1. Agar kalit foydalanuvchi tomonidan yaratilgan bo'lsa, u `length` yoki `toString` kabi har qanday narsa yoki `localStorage` ning boshqa o'rnatilgan usuli bo'lishi mumkin. Bunday holda, `getItem/setItem` yaxshi ishlaydi, obyektga o'xshash kirish muvaffaqiyatsiz bo'ladi:

    ```js run
    let key = 'length';
    localStorage[key] = 5; // Error, uzunlikni belgilash mumkin emas
    ```

2. Bizda `storage` hodisasi mavjud, u ma'lumotlarni o'zgartirganimizda ishga tushadi. Ushbu hodisa obyektga o'xshash kirish uchun sodir bo'lmaydi. Buni keyinroq ushbu bobda ko'rib chiqamiz.

## Kalitlar ustida aylanish

Ko'rib turganimizdek, usullar "get/set/remove by key" funksiyasini ta'minlaydi. Lekin barcha saqlangan qiymatlar yoki kalitlarni qanday olish mumkin?

Afsuski, saqlash obyektlari takrorlanmaydi.

Buning bir usuli - ularni massiv orqali aylantirish:

```js run
for(let i=0; i<localStorage.length; i++) {
  let key = localStorage.key(i);
  alert(`${key}: ${localStorage.getItem(key)}`);
}
```

Yana bir yo'l, oddiy obyektlar bilan bo'lgani kabi, `for key in localStorage` siklidan foydalanishdir.

U kalitlarni takrorlaydi, lekin bizga kerak bo'lmagan bir nechta o'rnatilgan maydonlarni chiqaradi:

```js run
// bad try
for(let key in localStorage) {
  alert(key); // getItem, setItem va boshqa o'rnatilgan narsalarni ko'rsatadi
}
```

...Demak, prototipdagi maydonlarni `hasOwnProperty` tekshiruvi bilan filtrlashimiz kerak:

```js run
for(let key in localStorage) {
  if (!localStorage.hasOwnProperty(key)) {
    continue; // "setItem", "getItem" kabi boshqa kalitlarni o'tkazib yuboring
  }
  alert(`${key}: ${localStorage.getItem(key)}`);
}
```

...Yoki `Object.keys` yordamida "o'z" kalitlarini oling va agar kerak bo'lsa, ularni aylantiring:

```js run
let keys = Object.keys(localStorage);
for(let key of keys) {
  alert(`${key}: ${localStorage.getItem(key)}`);
}
```

Ikkinchisi ishlaydi, chunki `Object.keys` prototipga e'tibor bermasdan, faqat obyektga tegishli bo'lgan kalitlarni qaytaradi.

## Faqat stringlar

Esda tutingki, kalit ham, qiymat ham string bo'lishi kerak.

Agar raqam yoki obyekt kabi boshqa turdagi bo'lsa, u avtomatik ravishda stringga aylanadi:

```js run
localStorage.user = {name: "John"};
alert(localStorage.user); // [object Object]
```

Obyektlarni saqlash uchun `JSON` dan foydalanishimiz mumkin:

```js run
localStorage.user = JSON.stringify({name: "John"});

// birozdan keyin
let user = JSON.parse( localStorage.user );
alert( user.name ); // John
```

Shuningdek, butun saqlash obyektini stringifikatsiya qilish mumkin, masalan, debugging maqsadlari uchun:

```js run
// obyektni yanada chiroyli qilish uchun JSON.stringify ga formatlash parametrlari qo'shildi
alert( JSON.stringify(localStorage, null, 2) );
```

## sessionStorage

`sessionStorage` obyekti `localStorage` ga qaraganda kamroq ishlatiladi.

Xususiyatlari va usullari bir xil, ammo u ancha cheklangan:

- `sessionStorage` faqat joriy brauzer yorlig'ida mavjud.
   - Xuddi shu sahifaga ega bo'lgan boshqa yorliqda boshqa xotira bo'ladi.
   - Lekin u bir xil yorliqdagi iframelar o'rtasida taqsimlanadi (bir xil kelib chiqishga ega ekanligi inobatga olingan holda).
- Ma'lumotlar sahifani yangilashdan omon qoladi, lekin yorliq yopilmaydi/ochilmaydi.

Keling, buni amalda ko'rib chiqaylik.

Ushbu kodni ishga tushiring ...

```js run
sessionStorage.setItem('test', 1);
```

...Keyin sahifani yangilang. Endi siz hali ham ma'lumotlarni olishingiz mumkin:

```js run
alert( sessionStorage.getItem('test') ); // yangilashdan so'ng: 1
```

...Agar siz xuddi shu sahifani boshqa varaqda ochsangiz va u yerda qayta urinib ko‘rsangiz, yuqoridagi kod `null`ni qaytaradi, ya'ni "hech narsa topilmadi".

Buning sababi, `sessionStorage` nafaqat manbaga, balki brauzer yorlig'iga ham bog'langan. Shu sababli, `sessionStorage` juda kam ishlatiladi.

## Saqlash hodisasi

Ma'lumotlar `localStorage` yoki `sessionStorage` da yangilanganda, [storage](https://html.spec.whatwg.org/multipage/webstorage.html#the-storageevent-interface) quyidagi xususiyatlarga ega hodisani ishga tushiradi:

- `key` – o'zgartirilgan kalit (agar `.clear()` chaqirilsa` null`).
- `oldValue` - eski qiymat (agar kalit yangi qo'shilgan bo'lsa `null`).
- `newValue` – yangi qiymat (agar kalit olib tashlangan bo'lsa, `null`).
- `url` – yangilanish sodir bo`lgan hujjatning URL manzili.
- `storageArea` - yangilanish sodir bo'lgan `localStorage` yoki `sessionStorage` obyekti.

Muhimi shundaki, bunga sabab bo'lganidan tashqari hodisa xotiraga kirish mumkin bo'lgan barcha `window` obyektlarida ishga tushadi.

Keling, bu mavzuga batafsilroq to'xtalib o'tamiz.

Tasavvur qiling-a, har birida bir xil saytga ega ikkita derazangiz bor. Shunday qilib, `localStorage` ular o'rtasida taqsimlanadi.

```online
Quyidagi kodni sinab ko'rish uchun ushbu sahifani ikkita brauzer oynasida ochishni xohlashingiz mumkin.
```

Agar ikkala oyna ham `window.onstorage` ni tinglayotgan bo'lsa, ularning har biri ikkinchisida sodir bo'lgan yangilanishlarga munosabat bildiradi.

```js run
// boshqa hujjatlardan bir xil xotiraga kiritilgan yangilanishlarni ishga tushiradi
window.onstorage = event => { // window.addEventListener('storage', event => { ham foydalanishi mumkin.
  if (event.key != 'now') return;
  alert(event.key + ':' + event.newValue + " at " + event.url);
};

localStorage.setItem('now', Date.now());
```

Shuni esda tutingki, tadbirda quyidagilar ham mavjud: `event.url` -- ma'lumotlar yangilangan hujjatdagi url.

Shuningdek, `event.storageArea` saqlash obyektini o'z ichiga oladi – hodisa `sessionStorage` va `localStorage` uchun bir xil, shuning uchun `event.storageArea` o'zgartirilgan obyektga havola qiladi. Biz hatto biror narsani o'zgartirishni, o'zgarishlarga "javob berishni" xohlashimiz mumkin.

**Bu bir xil manbadagi turli oynalarga xabar almashish imkonini beradi.**

Zamonaviy brauzerlar, shuningdek, [Broadcast channel API](mdn:/api/Broadcast_Channel_API), bir xil manbali oynalararo aloqa uchun maxsus APIni qo'llab-quvvatlaydi, u to'liq xususiyatga ega, ammo kamroq qo'llab-quvvatlanadi. `localStorage` asosidagi APIni ko'p to'ldiruvchi kutubxonalar mavjud bo'lib, ular uni hamma joyda mavjud qiladi.

## Xulosa

`localStorage` va `sessionStorage` web-storage obyektlari kalit/qiymatni brauzerda saqlash imkonini beradi.

- `key` ham, `value` ham string bo'lishi kerak.
- Cheklov 5mb+, brauzerga bog'liq.
- Ularning muddati tugamaydi.
- Ma'lumotlar manbaga bog'langan (domen/port/protocol).

| `localStorage` | `sessionStorage` |
|----------------|------------------|
| Kelib chiqishi bir xil bo'lgan barcha yorliqlar va oynalar o'rtasida taqsimlanadi | Brauzer yorlig'ida ko'rinadi, shu jumladan bir xil kelib chiqqan iframes |
| Brauzerni qayta ishga tushirishdan omon qoladi | Sahifani yangilashdan omon qoladi (lekin yorliq yopilmaydi) |

API:

- `setItem(key, value)` -- kalit/qiymat juftligini saqlash.
- `getItem(key)` -- kalit bo'yicha qiymatni olish.
- `removeItem(key)` -- qiymati bilan kalitni olib tashlash.
- `clear()` -- hamma narsani o'chirish.
- `key(index)` -- `index` kalit raqamini oling.
- `length` -- saqlangan elementlar soni.
- Barcha kalitlarni olish uchun `Object.keys` dan foydalaning.
- Biz kalitlarga obyekt xususiyatlari sifatida kiramiz, bu holda `storage` hodisasi ishga tushmaydi.

Storage hodisasi:

- `setItem`, `removeItem`, `clear` qo'ng'iroqlarini ishga tushiradi.
- Operatsiya (`key/oldValue/newValue`), `url` hujjati va `storageArea` saqlash obyekti haqidagi barcha ma'lumotlarni o'z ichiga oladi.
- Xotiraga kirish huquqiga ega bo'lgan barcha `window` obyektlarida, uni yaratganidan tashqari (`sessionStorage` uchun yorliq ichida, `localStorage` uchun global).
