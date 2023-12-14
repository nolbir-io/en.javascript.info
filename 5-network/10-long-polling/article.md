# Long polling

Long polling server bilan doimiy ulanishning eng oddiy usuli bo'lib, u WebSocket yoki Server Side Events kabi maxsus protokollardan foydalanmaydi.

Amalga oshirish juda oson bo'lib, u ko'p hollarda ham yetarli darajada yaxshi amalga oshiriladi.

## Muntazam Polling

Serverdan yangi ma'lumotlarni olishning eng oddiy usuli bu davriy pollingdir. Ya'ni, serverga muntazam so'rovlar: "Salom, men shu yerdaman, men uchun biron bir ma'lumotingiz bormi?" kabi so'rovlar har 10 soniyada bir marta bajariladi.

Bunga javoban, server birinchi navbatda mijozning onlayn ekanligi haqida xabar oladi, ikkinchidan - shu paytgacha olingan xabarlar paketini yuboradi.

Bu ishlaydi, ammo kamchiliklar mavjud:
1. Xabarlar 10 soniyagacha kechikish bilan uzatiladi (so'rovlar orasida).
2. Xabarlar bo'lmasa ham, foydalanuvchi boshqa joyga o'tgan yoki uxlab yotgan bo'lsa ham, server har 10 soniyada so'rovlar bilan bombalanadi. Ishlash nuqtai nazaridan aytganda, bu juda katta yukdir.

Shunday qilib, agar biz juda kichik xizmat haqida gapiradigan bo'lsak, yondashuv hayotiy bo'lishi mumkin, lekin umuman olganda, uni yaxshilash kerak.

## Long polling

"Long polling" deb ataladigan narsa serverda so'rov o'tkazishning ancha yaxshi usulidir.

Uni amalga oshirish ham juda oson va xabarlarni kechiktirmasdan yetkazib beradi.

Oqim:

1. Serverga so'rov yuboriladi.
2. Server yuborish uchun xabar bo'lmaguncha ulanishni yopmaydi.
3. Xabar paydo bo'lganda - server so'rovga u bilan javob beradi.
4. Brauzer darhol yangi so'rov yuboradi.

Brauzer so'rov yuborgan va server bilan kutilayotgan aloqaga ega bo'lgan vaziyat ushbu usul uchun standart hisoblanadi. Faqat xabar yuborilganda, ulanish qayta tiklanadi.

![](long-polling.svg)

Agar ulanish, masalan, tarmoq xatosi tufayli yo'qolsa, brauzer darhol yangi so'rov yuboradi.

Uzoq so'rovlarni amalga oshiradigan mijoz tomonidagi `subscribe` funksiyasining eskizi:

```js
async function subscribe() {
  let response = await fetch("/subscribe");

  if (response.status == 502) {
    // Status 502 - ulanish vaqti tugashi xatosi,
    // ulanish juda uzoq vaqt davomida kutilayotganda sodir bo'lishi mumkin,
    // va masofaviy server yoki proksi uni yopadi
    // qayta ulanamiz
    await subscribe();
  } else if (response.status != 200) {
    // error - keling, uni ko'rsatamiz
    showMessage(response.statusText);
    // bir soniyada qayta ulanamiz
    await new Promise(resolve => setTimeout(resolve, 1000));
    await subscribe();
  } else {
    // Xabarni oling va ko'rsating
    let message = await response.text();
    showMessage(message);
    // Keyingi xabarni olish uchun subscribe() ga yana qo'ng'iroq qiling
    await subscribe();
  }
}

subscribe();
```

Ko'rib turganingizdek, `subscribe` funksiyasi yuklaydi, keyin javobni kutadi, uni boshqaradi va yana o'zini chaqiradi.

```warn header="Server ko'plab kutilayotgan ulanishlar bilan yaxshi bo'lishi kerak"

Server arxitekturasi ko'plab kutilayotgan ulanishlar bilan ishlay olishi kerak.

Ba'zi server arxitekturalari har bir ulanish uchun bitta jarayonni ishga tushiradi, natijada ulanishlar qancha bo'lsa, shuncha ko'p jarayonlar mavjud bo'lib, har bir jarayon biroz xotirani sarflaydi. Shunday qilib, juda ko'p ulanishlar hammasini iste'mol qiladi.

Ko'pincha PHP va Ruby kabi tillarda yozilgan backendlar uchun shunday bo'ladi.

Node.js yordamida yozilgan serverlarda odatda bunday muammolar bo'lmaydi.

Ya'ni, bu dasturlash tili muammosi emas. Ko'pgina zamonaviy tillar, shu jumladan PHP va Ruby backendni to'g'ri amalga oshirishga imkon beradi. Iltimos, server arxitekturasi bir vaqtning o'zida bir nechta ulanishlar bilan yaxshi ishlashiga ishonch hosil qiling.
```

## Demo: a chat

Bu yerda demo chat mavjud, siz uni yuklab olishingiz va mahalliy ravishda ishga tushirishingiz mumkin (agar siz Node.js bilan tanish bo'lsangiz va modullarni o'rnata olsangiz):

[codetabs src="longpoll" height=500]

Brauzer kodi `browser.js` da.

## Foydalanish sohasi

Xabarlar kam bo'lgan holatlarda long polling juda yaxshi ishlaydi.

Agar xabarlar tez-tez kelib tursa, yuqorida bo'yalgan xabarlarni so'rash-qabul qilish jadvali arraga o'xshaydi.

Har bir xabar alohida so'rov bo'lib, sarlavhalar, autentifikatsiya xarajatlari va boshqalar bilan ta'minlanadi.

Shunday qilib, bu holda, boshqa usul afzal ko'riladi, masalan, [Websocket](info:websocket) yoki [Server Sent Events](info:server-sent-events).
