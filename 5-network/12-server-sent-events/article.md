# Server sent events (server tomonidan jo'natilgan hodisalar)

[Server sent events](https://html.spec.whatwg.org/multipage/comms.html#the-eventsource-interface) spesifikatsiyasi server va server bilan aloqani saqlaydigan o'rnatilgan `EventSource` sinfini tavsiflaydi, undan hodisalarni olish imkonini beradi.

`WebSocket` ga o'xshab, ulanish doimiydir.

Ammo bir nechta muhim farqlar mavjud:

| `WebSocket` | `EventSource` |
|-------------|---------------|
| Bi-directional: mijoz ham, server ham xabar almashishi mumkin | Bir yo'nalishli: faqat server ma'lumotlarni yuboradi |
| Ikkilik va matnli ma'lumotlar | Faqat matn |
| WebSocket protokoli | Muntazam HTTP |

`EventSource` server bilan `WebSocket`ga qaraganda kamroq quvvatli aloqa usuli hisoblanadi.

Nima uchun uni ishlatish kerak?

Asosiy sabab: bu oddiyroq. Ko'pgina ilovalarda `WebSocket` ning kuchi biroz ortiqcha.

Biz serverdan ma'lumotlar oqimini olishimiz kerak: chat xabarlari, bozor narxlari yoki boshqalar. `EventSource` aynan shu narsada yaxshi. Bundan tashqari, u avtomatik qayta ulanishni qo'llab-quvvatlaydi, biz uni `WebSocket` yordamida qo'lda amalga oshirishimiz kerak. Bundan tashqari, bu yangi protokol emas, oddiy eski HTTP hisoblanadi.

## Getting messages

Xabarlarni olishni boshlash uchun biz `new EventSource(url)` ni yaratishimiz kerak.

Brauzer `url` ga ulanadi va ulanishni ochiq ushlab, voqealarni kutadi.

Server 200 holati va `Content-Type: text/event-stream` sarlavhasi bilan javob berishi kerak, so'ngra ulanishni saqlab qo'ying va unga quyidagi kabi maxsus formatda xabarlar yozing:

```
data: Message 1

data: Message 2

data: Message 3
data: ikki qatordan iborat
```

- Xabar matni `data:` dan keyin keladi, ikki nuqtadan keyingi bo'sh joy ixtiyoriy.
- Xabarlar ikki qatorli `\n\n` bilan ajratilgan.
- `\n` qatorni yuborish uchun biz darhol yana bitta `data:` yuborishimiz mumkin (yuqoridagi 3-xabar).

Amalda, murakkab xabarlar odatda JSON-kodlangan holda yuboriladi. Satr uzilishlari ular ichida `\n` sifatida kodlangan, shuning uchun ko'p qatorli `data:` xabarlari shart emas.

Masalan:

```js
data: {"user":"John","message":"First line*!*\n*/!* Second line"}
```

...Shunday qilib, bitta `data:` aynan bitta xabarni o'z ichiga oladi, deb tahmin qilishimiz mumkin.

Har bir bunday xabar uchun `message` hodisasi yaratiladi:

```js
let eventSource = new EventSource("/events/subscribe");

eventSource.onmessage = function(event) {
  console.log("New message", event.data);
  //yuqoridagi ma'lumotlar oqimi uchun 3 marta tizimga kiradi
};

// yoki eventSource.addEventListener('message', ...)
```

### O'zaro kelib chiqish so'rovlari (Cross origin requests)

`EventSource` o'zaro kelib chiqish so'rovlarini qo'llab-quvvatlaydi, masalan, `fetch` va boshqa tarmoq usullari. Biz har qanday URL manzilidan foydalanishimiz mumkin:

```js
let source = new EventSource("https://another-site.com/events");
```

Masofaviy server `Origin` sarlavhasini oladi va davom etish uchun `Access-Control-Allow-Origin` bilan javob berishi kerak.

Hisob ma'lumotlarini topshirish uchun biz qo'shimcha `withCredentials` opsiyasini o'rnatishimiz lozim, masalan:

```js
let source = new EventSource("https://another-site.com/events", {
  withCredentials: true
});
```

O'zaro kelib chiqish sarlavhalari haqida batafsil ma'lumot olish uchun <info:fetch-crossorigin> bobiga qarang.


## Reconnection (qayta ulanish)

Yaratilgandan so'ng, `new EventSource` serverga ulanadi va agar ulanish uzilgan bo'lsa -- qayta ulanadi.

Bu juda qulay, chunki biz bunga ahamiyat bermasligimiz kerak.

Qayta ulanishlar orasida kichik kechikish bor, sukut bo'yicha bir necha soniya.

Server tavsiya etilgan kechikishni `retry:` yordamida o'rnatishi mumkin (millisekundlarda):

```js
retry: 15000
data: Hello, I set the reconnection delay to 15 seconds
```

`retry:` ikkalasi ham ba'zi ma'lumotlar bilan birga yoki mustaqil xabar sifatida kelishi mumkin.

Brauzer qayta ulanishdan oldin shuncha millisekund kutishi kerak. Yoki uzoqroq, masalan, agar brauzer hozirda tarmoqqa ulanish yo'qligini bilsa (OSdan), u ulanish paydo bo'lguncha kutib, keyin qayta urinib ko'radi.

- Agar server brauzer qayta ulanishni to'xtatishni xohlasa, u HTTP holati 204 bilan javob berishi kerak.
- Agar brauzer ulanishni yopmoqchi bo'lsa, u `eventSource.close()` ni chaqirishi kerak:

```js
let eventSource = new EventSource(...);

eventSource.close();
```

Shuningdek, agar javobda noto'g'ri `Content-Type` bo'lsa yoki uning HTTP holati 301, 307, 200 va 204 dan farq qilsa, qayta ulanish bo'lmaydi. Bunday hollarda `"error"` hodisasi chiqariladi va brauzer qayta ulamaydi.

```smart
Ulanish nihoyat yopilganda, uni "reopen", ya'ni qayta ochish imkoni yo'q. Agar biz qayta ulanishni istasak, shunchaki yangi `EventSource` yaratamiz.
```

## Message id

Tarmoq muammolari tufayli aloqa uzilib qolganda, qaysi xabarlar qabul qilingan va qaysi biri qabul qilinmaganiga ikki tomon ham ishonch hosil qila olmaydi.

Ulanishni to'g'ri davom ettirish uchun har bir xabarda `id` maydoni bo'lishi kerak, masalan:

```
data: Message 1
id: 1

data: Message 2
id: 2

data: Message 3
data: ikki qatordan iborat
id: 3
```

`id:` bilan xabar kelganda, brauzer:

- `eventSource.lastEventId` xususiyatini uning qiymatiga o'rnatadi.
- Qayta ulangandan so'ng, server quyidagi xabarlarni qayta yuborishi uchun `Last-Event-ID` sarlavhasini o'sha `id` bilan yuboradi.

```smart header="Put `id:` after `data:`"
Iltimos, diqqat qiling: xabar olingandan keyin `lastEventId` yangilanishini ta'minlash uchun `id` server tomonidan `data` xabari ostiga qo'shilgan.
```

## Ulanish holati: readyState

`EventSource` obyekti `readyState` xususiyatiga ega bo'lib, u uchta qiymatdan biriga ega:

```js no-beautify
EventSource.CONNECTING = 0; // ulanish yoki qayta ulash
EventSource.OPEN = 1;       // ulangan
EventSource.CLOSED = 2;     // ulanish yopilgan
```

Obyekt yaratilganda yoki ulanish uzilganda, u har doim `EventSource.CONNECTING` (`0` ga teng) bo'ladi.

`EventSource` holatini bilish uchun ushbu xususiyatni so'rashimiz mumkin.

## Hodisa turlari

Odatda `EventSource` obyekti uchta hodisa hosil qiladi:

- `message` -- qabul qilingan xabar, `event.data` sifatida mavjud.
- `open` -- ulanish ochiq.
- `error` -- aloqani o'rnatib bo'lmadi, masalan, server HTTP 500 holatini qaytardi.

Server voqea boshlanishida `event: ...`  bilan boshqa hodisa turini belgilashi mumkin.

Masalan:

```
event: join
data: Bob

data: Hello

event: leave
data: Bob
```

Maxsus hodisalarni boshqarish uchun biz `onmessage` emas, `addEventListener` dan foydalanishimiz kerak:

```js
eventSource.addEventListener('join', event => {
  alert(`Joined ${event.data}`);
});

eventSource.addEventListener('message', event => {
  alert(`Said: ${event.data}`);
});

eventSource.addEventListener('leave', event => {
  alert(`Left ${event.data}`);
});
```

## To'liq misol

Bu yerda `1`, `2`, `3`, keyin `bye` bilan xabarlar yuboradigan va ulanishni uzadigan server.

Keyin brauzer avtomatik ravishda qayta ulanadi.

[codetabs src="eventsource"]

## Xulosa

`EventSource` obyekti avtomatik ravishda doimiy ulanishni o'rnatadi va serverga u orqali xabarlar yuborish imkonini beradi.

U quyidagilarni taklif qiladi:
- `retry` sozlanish vaqti tugashi bilan avtomatik qayta ulanish.
- Voqealarni davom ettirish uchun xabar identifikatorlari, oxirgi qabul qilingan identifikator qayta ulanganda `Last-Event-ID` sarlavhasiga yuboriladi.
- Joriy holat `readyState` xususiyatida.

Bu `EventSource` ni `WebSocket` ga munosib muqobil qiladi, chunki ikkinchisi past darajadagi va bunday o'rnatilgan funksiyalarga ega emas (garchi ularni amalga oshirish mumkin bo'lsa ham).

Haqiqiy hayotdagi ko'plab ilovalarda `EventSource` ning kuchi yetarli.

Barcha zamonaviy brauzerlarda qo'llab-quvvatlanadi (IE emas).

Sintaksis:

```js
let source = new EventSource(url, [credentials]);
```

Ikkinchi argumentda faqat bitta mumkin bo'lgan variant mavjud: `{wiCredentials: true }`, u o'zaro kelib chiqish hisob ma'lumotlarini yuborish imkonini beradi.

Umumiy o'zaro kelib chiqish xavfsizligi `fetch` va boshqa tarmoq usullari bilan bir xil.

### `EventSource` obyektining xususiyatlari

`readyState`
: Joriy ulanish holati: `EventSource.CONNECTING (=0)`, `EventSource.OPEN (=1)` yoki `EventSource.CLOSED (=2)`.

`lastEventId`
: Oxirgi qabul qilingan `id` qayta ulangandan so'ng, brauzer uni `Last-Event-ID` sarlavhasiga yuboradi.

### Usullar

`close()`
: Ulanishni yopadi.

### Hodisalar

`message`
: Xabar qabul qilindi, ma'lumotlar `event.data` ichida.

`open`
: Ulanish o'rnatildi.

`error`
: Xato bo'lgan taqdirda, shu jumladan yo'qolgan ulanish va halokatli xatolar avtomatik qayta ulanadi. Qayta ulanishga urinilayotganligini bilish uchun `readyState` ni tekshirishimiz mumkin.

Server `event:` da maxsus hodisa nomini o'rnatishi mumkin. Bunday hodisalarni `on<event>` emas, balki `addEventListener` yordamida boshqarish kerak.

### Server javob formati

Server `\n\n` bilan chegaralangan xabarlarni yuboradi.

Xabarda quyidagi maydonlar bo'lishi mumkin:

- `data:` -- Xabar tanasida bir nechta `data` ketma-ketligi qismlar orasida `\n` bo'lgan yagona xabar sifatida talqin qilinadi.
- `id:` -- qayta ulanganda `Last-Event-ID` yuborilganda `lastEventId` yangilanadi.
- `retry:` -- ms da qayta ulanishlar uchun qayta urinish kechikishini tavsiya qiladi. Uni JavaScriptdan o'rnatishning hech qanday usuli yo'q.
- `event:` -- hodisa nomi, `data:` oldidan kelishi kerak.

Xabar istalgan tartibda bir yoki bir nechta maydonlarni o'z ichiga olishi mumkin, lekin odatda `id:` oxirgi bo'ladi.
