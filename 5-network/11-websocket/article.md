# WebSocket

[RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455) spetsifikatsiyasida tasvirlangan `WebSocket` protokoli doimiy ulanish orqali brauzer va server o'rtasida ma'lumot almashish imkonini beradi. Ma'lumotlar ulanishni buzmasdan va qo'shimcha HTTP so'rovlarini talab qilmasdan "paketlar" sifatida har ikki yo'nalishda ham uzatilishi mumkin.

WebSocket, ayniqsa, doimiy ma'lumotlar almashinuvini talab qiladigan xizmatlar, masalan, onlayn o'yinlar, real vaqtda savdo tizimlari va boshqalar uchun juda qulay.

## Oddiy misol

Websocket ulanishini ochish uchun url-da maxsus `ws` protokoli yordamida `new WebSocket` yaratishimiz kerak:

```js
let socket = new WebSocket("*!*ws*/!*://javascript.info");
```

Shuningdek, shifrlangan `wss://` protokoli ham mavjud. Bu veb-soketlar uchun HTTPSga o'xshaydi.

```smart header="Har doim `wss://` ni afzal ko'ring"
`wss://` protokoli nafaqat shifrlangan, balki ishonchliroq.

Buning sababi, `ws://` ma'lumotlari shifrlanmagan, har qanday vositachi uchun ko'rinadi. Eski proksi-serverlar WebSocket haqida bilishmaydi, ular "g'alati" sarlavhalarni ko'rishlari va ulanishni to'xtatishlari mumkin.

Boshqa tomondan, `wss://` - bu TLS orqali WebSocket, (HTTPS, TLS orqali HTTP kabi), transport xavfsizligi qatlami jo'natuvchida ma'lumotlarni shifrlaydi va qabul qiluvchida shifrni ochadi. Shunday qilib, ma'lumotlar paketlari proksi-serverlar orqali shifrlangan holda uzatiladi. Ular ichkarida nima borligini ko'ra olmaydilar va ularni o'tkazib yuboradilar.
```

Socket yaratilgandan so'ng, biz undagi voqealarni tinglashimiz kerak. Hammasi bo'lib 4 ta hodisa mavjud:
- **`open`** -- ulanish o'rnatildi,
- **`message`** -- olingan ma'lumotlar,
- **`error`** -- websocket xatosi,
- **`close`** -- ulanish yopiq.

...Agar biz biror narsa jo'natmoqchi bo'lsak, buni `socket.send(data)` bajaradi.

Quyida namuna berilgan:

```js run
let socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");

socket.onopen = function(e) {
  alert("[open] Connection established");
  alert("Sending to server");
  socket.send("My name is John");
};

socket.onmessage = function(event) {
  alert(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {  
    alert(`[close] Ulanish yopildi, code=${event.code} reason=${event.reason}`);
  } else {
     // masalan, server jarayoni o'chirildi yoki tarmoq o'chirildi
     // event.code odatda bu holda 1006 bo'ladi
    alert('[close] Ulanish o'chirildi');
  }
};

socket.onerror = function(error) {
  alert(`[error]`);
};
```

Namoyish maqsadida kichik server [server.js](demo/server.js) mavjud, yuqoridagi misol uchun Node.js da yozilgan. U "Serverdan salom, Jon" deb javob beradi, keyin 5 soniya kutadi va ulanishni yopadi.

Shunday qilib, siz `open` -> `message` -> `close` voqealarini ko'rasiz.

Aslida biz allaqachon WebSocket bilan gaplasha olamiz. Juda oddiy, shunday emasmi?

Endi batafsilroq gapirsak.

## Websocket ochish

`New WebSocket(url)` yaratilganda, u darhol ulanishni boshlaydi.

Ulanish vaqtida brauzer (sarlavhalar yordamida) serverdan so'raydi: "Siz Websocket-ni qo'llab-quvvatlaysizmi?" Va agar server "ha" deb javob bersa, suhbat umuman HTTP bo'lmagan WebSocket protokolida davom etadi.

![](websocket-handshake.svg)

Mana `new WebSocket("wss://javascript.info/chat")` tomonidan qilingan so'rov uchun brauzer sarlavhalariga misol.

```
GET /chat
Host: javascript.info
Origin: https://javascript.info
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
Sec-WebSocket-Version: 13
```

- `Origin` -- mijoz sahifasining kelib chiqishi, masalan, `https://javascript.info`. WebSocket obyektlari tabiatan o'zaro kelib chiqadi. Hech qanday maxsus sarlavhalar yoki boshqa cheklovlar yo'q. Eski serverlar WebSocket bilan baribir ishlay olmaydi, shuning uchun moslik bilan bog'liq muammolar yo'q. Ammo `Origin` sarlavhasi muhim, chunki u serverga WebSocket bilan ushbu veb-sayt bilan gaplashish yoki gaplashmaslik haqida qaror qabul qilish imkonini beradi.
- `Connection: Upgrade` -- mijoz protokolni o'zgartirmoqchi ekanligini bildiradi.
- `Upgrade: websocket` -- so'ralgan protokol `websocket`.
- `Sec-WebSocket-Key` -- brauzer tomonidan tasodifiy yaratilgan kalit, server WebSocket protokolini qo'llab-quvvatlashini ta'minlash uchun ishlatiladi. Proksi-serverlarning har qanday keyingi aloqani keshlashiga yo'l qo'ymaslik tasodifiy.
- `Sec-WebSocket-Version` -- 13-joriy WebSocket protokoli versiyasi.

```smart header="WebSocket handshake ni taqlid qilib bo'lmaydi"
Ushbu turdagi HTTP so'rovini amalga oshirish uchun biz `XMLHttpRequest` yoki `fetch` dan foydalana olmaymiz, chunki JavaScriptda bu sarlavhalarni o'rnatishga ruxsat berilmagan.
```

Agar server WebSocketga o'tishga rozi bo'lsa, u javob kodini 101 yuborishi kerak:

```
101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: hsBlbuDTkk24srzEOTBUlZAlC2g=
```

Bu yerda `Sec-WebSocket-Accept` - bu maxsus algoritm yordamida qayta kodlangan `Sec-WebSocket-Key`. Uni ko'rgandan so'ng, brauzer server haqiqatan ham WebSocket protokolini qo'llab-quvvatlashini tushunadi.

Keyinchalik, ma'lumotlar WebSocket protokoli yordamida uzatiladi, biz uning tuzilishini ("ramkalar") tez orada ko'rib chiqamiz. Va bu umuman HTTP emas.

### Kengaytmalar va subprotokollar

Kengaytmalar va subprotokollarni tavsiflovchi qo'shimcha `Sec-WebSocket-Extensions` va `Sec-WebSocket-Protocol` sarlavhalari bo'lishi mumkin.

Masalan:

- `Sec-WebSocket-Extensions: deflate-frame` brauzer ma'lumotlarni siqishni qo'llab-quvvatlashini bildiradi. Kengaytma - bu ma'lumotlarni uzatish bilan bog'liq bo'lgan narsa, WebSocket protokolini kengaytiruvchi funksionallik. `Sec-WebSocket-Extensions` sarlavhasi brauzer tomonidan qo'llab-quvvatlanadigan barcha kengaytmalar ro'yxati bilan avtomatik ravishda yuboriladi.

- `Sec-WebSocket-Protocol: soap, wamp` biz nafaqat har qanday ma'lumotlarni, balki [SOAP](https://en.wikipedia.org/wiki/SOAP) yoki WAMP ()dagi ma'lumotlarni uzatishni xohlayotganimizni bildiradi. ("WebSocket Application Messaging Protocol") protokollari. WebSocket subprotokollari [IANA katalogida] (https://www.iana.org/assignments/websocket/websocket.xml) ro'yxatga olingan. Shunday qilib, ushbu sarlavha biz foydalanmoqchi bo'lgan ma'lumotlar formatlarini tavsiflaydi.

   Ushbu ixtiyoriy sarlavha `new WebSocket` ning ikkinchi parametri yordamida o'rnatiladi. Bu subprotokollar massivi, masalan, agar biz SOAP yoki WAMP dan foydalanmoqchi bo'lsak:

    ```js
    let socket = new WebSocket("wss://javascript.info/chat", ["soap", "wamp"]);
    ```

Server foydalanishga rozi bo'lgan protokollar va kengaytmalar ro'yxati bilan javob berishi kerak.

Masalan, so'rov:

```
GET /chat
Host: javascript.info
Upgrade: websocket
Connection: Upgrade
Origin: https://javascript.info
Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
Sec-WebSocket-Version: 13
*!*
Sec-WebSocket-Extensions: deflate-frame
Sec-WebSocket-Protocol: soap, wamp
*/!*
```

Response:

```
101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: hsBlbuDTkk24srzEOTBUlZAlC2g=
*!*
Sec-WebSocket-Extensions: deflate-frame
Sec-WebSocket-Protocol: soap
*/!*
```

Bu yerda server "deflate-frame" kengaytmasini va faqat so'ralgan subprotokollardagi SOAPni qo'llab-quvvatlashini aytadi.

## Ma'lumotlarni uzatish (data transfer)

WebSocket aloqasi har ikki tomondan yuborilishi mumkin bo'lgan va bir necha turdagi bo'lishi mumkin bo'lgan "ramkalar" -- ma'lumotlar bo'laklaridan iborat:

- "text frames" -- tomonlar bir-biriga yuboradigan matn ma'lumotlarini o'z ichiga oladi.
- "binary data frames" -- tomonlar bir-biriga yuboradigan ikkilik ma'lumotlarni o'z ichiga oladi.
- "ping/pong frames" serverdan yuborilgan ulanishni tekshirish uchun ishlatiladi, brauzer ularga avtomatik ravishda javob beradi.
- shuningdek, "connection close frame" va boshqa bir nechta xizmat ko'rsatish ramkalari mavjud.

Brauzerda biz to'g'ridan-to'g'ri faqat matn yoki ikkilik ramkalar bilan ishlaymiz.

**WebSocket `.send()` usuli matn yoki ikkilik ma'lumotlarni yuborishi mumkin.**

`socket.send(body)` chaqiruvi string yoki binary formatda `body` ga ruxsat beradi, jumladan, `Blob`, `ArrayBuffer` va hokazo. Hech qanday sozlash shart emas, uni istalgan formatda yuborish kifoya.

**Ma'lumotni olganimizda, matn har doim qator sifatida keladi. Ikkilik ma'lumotlar uchun esa biz `Blob` va `ArrayBuffer` formatlarini tanlashimiz mumkin.**

Bu `socket.binaryType` xususiyati tomonidan o'rnatiladi, sukut bo'yicha `"blob"`, shuning uchun ikkilik ma'lumotlar `Blob` obyektlari sifatida keladi.

[Blob](ma'lumot:blob) yuqori darajadagi binary obyekt bo'lib, u `<a>`, `<img>` va boshqa teglar bilan bevosita integratsiyalanadi, shuning uchun bu standart standart hisoblanadi. Ammo ikkilik ishlov berish uchun alohida ma'lumotlar baytlariga kirish uchun biz uni `arraybufer` ga o'zgartirishimiz mumkin:

```js
socket.binaryType = "arraybuffer";
socket.onmessage = (event) => {
  // event.data yoki satr (agar matn bo'lsa) yoki arraybufer (agar ikkilik bo'lsa)
};
```

## Tarifni cheklash

Tasavvur qiling-a, bizning ilovamiz jo'natish uchun juda ko'p ma'lumotlarni ishlab chiqarmoqda. Lekin foydalanuvchi sekin tarmoq ulanishiga ega, ehtimol mobil internetda, shahar tashqarisida.

Biz `socket.send(data)` ga qayta-qayta qo'ng'iroq qilishimiz mumkin. Ammo ma'lumotlar xotirada buferlanadi (saqlanadi) va faqat tarmoq tezligi imkon qadar tez yuboriladi.

`socket.bufferedAmount` xususiyati tarmoq orqali yuborilishini kutayotgan qancha bayt buferlanganligini saqlaydi.

Biz rozetkaning uzatish uchun mavjud yoki yo'qligini tekshirish uchun uni ko'zdan kechirishimiz mumkin.

```js
// har 100ms rozetkani tekshiring va ko'proq ma'lumot yuboring
// faqat barcha mavjud ma'lumotlar yuborilgan bo'lsa
setInterval(() => {
  if (socket.bufferedAmount == 0) {
    socket.send(moreData());
  }
}, 100);
```

## Ulanish yopilishi

Odatda, bir tomon ulanishni yopishni xohlasa (brauzer ham, server ham teng huquqlarga ega), ular raqamli kod va matnli sabab bilan "ulanishni yopish ramkasi" (connection close frame) ni yuboradilar.

Buning uchun usul:
```js
socket.close([code], [reason]);
```

- `code` - bu maxsus WebSocket yopish kodi (ixtiyoriy)
- `reason` - yopilish sababini tavsiflovchi qator (ixtiyoriy)

Keyin `close` hodisasi ishlovchisidagi boshqa tomondagi code va reasonni oladi, masalan:

```js
// yopilish partiyasi:
socket.close(1000, "Work complete");

// boshqa partiya
socket.onclose = event => {
  // event.code === 1000
  // event.reason === "Work complete"
  // event.wasClean === true (clean close)
};
```

Eng keng tarqalgan kod qiymatlari:

- `1000` -- standart, oddiy yopilish (agar `code` berilmagan bo'lsa ishlatiladi),
- `1006` -- bunday kodni qo'lda o'rnatishning imkoni yo'q, ulanish uzilganligini bildiradi (yopiq ramka yo'q).

Boshqa kodlar mavjud:

- `1001` -- ziyofat ketmoqda, masalan, server yopiladi yoki brauzer sahifani tark etadi,
- `1009` -- xabarni qayta ishlash uchun juda katta,
- `1011` -- serverda kutilmagan xatolik,
- ...va hokazo.

To'liq ro'yxatni [RFC6455, §7.4.1](https://tools.ietf.org/html/rfc6455#section-7.4.1) da topishingiz mumkin.

WebSocket kodlari biroz HTTP kodlariga o'xshaydi, lekin u biroz boshqacha. Xususan, `1000` dan past kodlar zaxiralangan, agar biz bunday kodni o'rnatishga harakat qilsak, xatolik yuz beradi.

```js
// ulanish buzilgan taqdirda
socket.onclose = event => {
  // event.code === 1006
  // event.reason === ""
  // event.wasClean === false (closing frame mavjud emas)
};
```


## Ulanish holati

Ulanish holatini olish uchun qo'shimcha qiymatlarga ega `socket.readyState` xususiyati mavjud:

- **`0`** -- "CONNECTING": ulanish hali o'rnatilmagan,
- **`1`** -- "OPEN": muloqot qilish,
- **`2`** -- "CLOSING": ulanish yopilyapti,
- **`3`** -- "CLOSED": ulanish yopiq.


## Chat namunasi

Keling, WebSocket API brauzeri va Node.js WebSocket moduli <https://github.com/websockets/ws> yordamida chat misolini ko'rib chiqaylik. Biz asosiy e'tiborni mijoz tomoniga qaratamiz, lekin server ham oddiy.

HTML: bizga xabarlarni yuborish uchun `<form>` va kiruvchi xabarlar uchun `<div>` kerak:

```html
<!-- message form -->
<form name="publish">
  <input type="text" name="message">
  <input type="submit" value="Send">
</form>

<!-- xabarlar bilan div -->
<div id="messages"></div>
```

JavaScriptdan biz uchta narsani xohlaymiz:

1. Ulanishni oching.
2. Shaklni yuborishda -- xabar uchun `socket.send(message)`.
3. Kiruvchi xabarda -- uni `div#messages` ga qo'shing.

Mana kod:

```js
let socket = new WebSocket("wss://javascript.info/article/websocket/chat/ws");

// formdan xabar yuboring
document.forms.publish.onsubmit = function() {
  let outgoingMessage = this.message.value;

  socket.send(outgoingMessage);
  return false;
};

// xabar qabul qilindi - xabarni div#messages da ko'rsatish
socket.onmessage = function(event) {
  let message = event.data;

  let messageElem = document.createElement('div');
  messageElem.textContent = message;
  document.getElementById('messages').prepend(messageElem);
}
```

Server tomonidagi kod bizning doiramizdan biroz tashqarida. Bu yerda biz Node.js dan foydalanamiz, lekin bunga majbur emassiz. Boshqa platformalarda ham WebSocket bilan ishlash vositalari mavjud.

Server tomoni algoritmi quyidagicha bo'ladi:

1. `clients = new Set()` -- rozetkalar to'plamini yarating.
2. Har bir qabul qilingan veb-rozetka uchun uni `clients.add(socket)` to'plamiga qo'shing va uning xabarlarini olish uchun `message` hodisa tinglovchisini o'rnating.
3. Xabar qabul qilinganda: mijozlarni takrorlang va uni hammaga yuboring.
4. Ulanish yopilganda: `clients.delete(socket)` dan foydalaning.

```js
const ws = new require('ws');
const wss = new ws.Server({noServer: true});

const clients = new Set();

http.createServer((req, res) => {
   // bu yerda biz faqat websocket ulanishlari bilan ishlaymiz
   // haqiqiy loyihada bizda websocket bo'lmagan so'rovlarni bajarish uchun boshqa kod mavjud
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
});

function onSocketConnect(ws) {
  clients.add(ws);

  ws.on('message', function(message) {
    message = message.slice(0, 50); // maksimal xabar uzunligi 50 bo'ladi

    for(let client of clients) {
      client.send(message);
    }
  });

  ws.on('close', function() {
    clients.delete(ws);
  });
}
```


Mana ish misoli:

[iframe src="chat" balandligi="100" zip]

Siz uni yuklab olishingiz ham mumkin (iframe-ning yuqori o'ng tugmasi) va uni mahalliy holatda ishga tushirishingiz mumkin. Ishlashdan oldin [Node.js](https://nodejs.org/en/) va `npm install ws` ni o'rnatishni unutmang.

## Xulosa

WebSocket - doimiy brauzer-server ulanishiga ega bo'lishning zamonaviy usuli.

- WebSockets o'zaro kelib chiqish cheklovlariga ega emas.
- Ular brauzerlarda yaxshi qo'llab-quvvatlanadi.
- Satrlar va ikkilik ma'lumotlarni yuborish/qabul qilish.

API oddiy.

Usullar:
- `socket.send(data)`,
- `socket.close([code], [reason])`.

Eventlar:
- `open`,
- `message`,
- `error`,
- `close`.

WebSocket o'z-o'zidan qayta ulanish, autentifikatsiya va boshqa ko'plab yuqori darajadagi mexanizmlarni o'z ichiga olmaydi. Shunday qilib, buning uchun mijoz/server kutubxonalari mavjud va bu imkoniyatlarni qo'lda amalga oshirish ham mumkin.

Ba'zan, WebSocketni mavjud loyihalarga integratsiya qilish uchun odamlar asosiy HTTP-server bilan parallel ravishda WebSocket serverini ishga tushiradilar va ular bitta ma'lumotlar bazasini almashadilar. WebSocket so'rovlarida WebSocket serveriga olib boruvchi `wss://ws.site.com` subdomenidan foydalaniladi, `https://site.com` esa asosiy HTTP-serverga boradi.

Albatta, integratsiyaning boshqa usullari ham mavjud.