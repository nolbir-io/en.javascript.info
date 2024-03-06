# Blob

`ArrayBuffer` va ko'rinishlar ECMA standarti va JavaScriptning bir qismidir.

Brauzerda [File API](https://www.w3.org/TR/FileAPI/), xususan, `Blob` da tasvirlangan qo'shimcha yuqori darajadagi obyektlar mavjud.

`Blob` ixtiyoriy `type` (odatda MIME turi), shuningdek `blobParts` -- boshqa `Blob` obyektlari, satrlari va `BufferSource` ketma-ketligidan iborat.

![](blob.svg)

Konstruktor sintaksisi:

```js
new Blob(blobParts, options);
```

- **`blobParts`** bu `Blob`/`BufferSource`/`String` qiymatlari massivi.
- **`variantlar`** ixtiyoriy obyekt:
   - **`tur`** -- `Blob` turi, odatda MIME-turi, masalan, `tasvir/png`,
   - **`tugashlari`** -- `Blob` joriy OS yangi qatorlariga (`\r\n` yoki `\n`) mos kelishi uchun qator oxirini o'zgartirish kerak. Bu odatiy holat `"transparent"` (hech narsa qilmang), balki `"native"` (o'zgartirish) ham bo'lishi mumkin.

Masalan:

```js
// satrdan Blob yarating
let blob = new Blob(["<html>…</html>"], {type: 'text/html'});
// Iltimos, diqqat qiling: birinchi argument massiv bo'lishi kerak [...]
```

```js
// terilgan massiv va satrlardan Blob yaratish
let hello = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" ikkilik shaklda

let blob = new Blob([hello, ' ', 'world'], {type: 'text/plain'});
```


Biz `Blob` bo'laklarini quyidagi bilan ajratib olishimiz mumkin:

```js
blob.slice([byteStart], [byteEnd], [contentType]);
```

- **`byteStart`** -- boshlang'ich bayt, sukut bo'yicha 0.
- **`byteEnd`** -- oxirgi bayt (eksklyuziv, sukut bo'yicha oxirigacha).
- **`contentType`** -- yangi blokdagi `type`, sukut bo'yicha manbaa bilan bir xil.

Argumentlar `array.slice` ga o'xshaydi, manfiy raqamlarga ham ruxsat beriladi.

```smart header="`Blob` obyektlari o'zgarmasdir"`
Biz to'g'ridan-to'g'ri `Blob` da ma'lumotlarni o'zgartira olmaymiz, lekin biz `Blob` qismlarini kesishimiz, ulardan yangi `Blob` obyektlarini yaratishimiz, ularni yangi `Blob` ga aralashtirishimiz mumkin va hokazo.

Ushbu xatti-harakatlar JavaScript satrlariga o'xshaydi: biz satrdagi belgini o'zgartira olmaymiz, lekin biz yangi tuzatilgan qatorni yaratolamiz.
```

## URL sifatida Blob

Blob `<a>`, `<img>` yoki boshqa teglar uchun URL manzili sifatida uning mazmunini ko'rsatish uchun osongina ishlatilishi mumkin.

`type` tufayli biz `Blob` obyektlarini ham yuklab olishimiz/yuklashimiz mumkin va `type` tarmoq so'rovlarida tabiiy ravishda `Content-Type`ga aylanadi.

Oddiy misol bilan boshlaylik. Havolani bosish orqali siz dinamik tarzda yaratilgan `Blob`ni `hello world` mazmuni bilan fayl sifatida yuklab olasiz:

```html run
<!-- download atributi brauzerni navigatsiya o'rniga yuklab olishga majbur qiladi -->
<a download="hello.txt" href='#' id="link">Download</a>

<script>
let blob = new Blob(["Hello, world!"], {type: 'text/plain'});

link.href = URL.createObjectURL(blob);
</script>
```

Shuningdek, biz JavaScriptda dinamik ravishda havola yaratishimiz va `link.click()` orqali bosishni simulyatsiya qilishimiz mumkin, keyin yuklab olish avtomatik ravishda boshlanadi.

Mana shunga o'xshash kod, foydalanuvchi dinamik ravishda yaratilgan `Blob` ni hech qanday HTMLsiz yuklab olishiga sabab bo'ladi:

```js run
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

link.href = URL.createObjectURL(blob);

link.click();

URL.revokeObjectURL(link.href);
```

`URL.createObjectURL` `Blob` oladi va uning uchun `blob:<origin>/<uuid>` shaklida yagona URL-manzil yaratadi.

`link.href` qiymati shunday ko'rinishga ega:

```
blob:https://javascript.info/1e67e00e-860d-40a5-89ae-6ab0cbee6273
```

`URL.createObjectURL` tomonidan yaratilgan har bir URL uchun brauzer ichki URL -> `Blob` xaritasini saqlaydi. Shunday qilib, bunday URL manzillar qisqa, ammo `Blob` ga kirishga ruxsat beradi.

Yaratilgan URL (va shuning uchun u bilan bog'langan havola) faqat joriy hujjatda, u ochiq bo'lganda amal qiladi. Va u `<img>`, `<a>`dagi `Blob`ga, asosan URL manzilini kutayotgan boshqa obyektga murojaat qilish imkonini beradi.

Buning salbiy ta'siri bor. `Blob` uchun xaritalash mavjud bo'lsada, `Blob` o'zi xotirada joylashgan. Brauzer uni bo'shata olmaydi.

Hujjat yuklanganda xaritalash avtomatik ravishda o'chiriladi, shuning uchun `Blob` obyektlari bo'shatiladi. Agar ilova uzoq umr ko'rsa, bu tez orada sodir bo'lmaydi.

**Shunday qilib, agar biz URL manzil yaratsak, hatto kerak bo'lmasa ham o'sha `Blob` xotirada qoladi.**

`URL.revokeObjectURL(url)` ichki xaritalashdan havolani olib tashlaydi, shu bilan `Blob`ni o'chirish (agar boshqa havolalar bo'lmasa) va xotirani bo'shatish imkonini beradi.

Oxirgi misolda biz `Blob`ni bir marta, bir lahzada yuklab olish uchun ishlatishni maqsad qilganmiz, shuning uchun biz darhol `URL.revokeObjectURL(link.href)` deb chaqiramiz.

Oldingi misolda bosiladigan HTML-havolada biz `URL.revokeObjectURL(link.href)` deb chaqirmaymiz, chunki bu `Blob` URL manzilini yaroqsiz qiladi. Bekor qilingandan so'ng, xaritalash olib tashlanganligi sababli, URL boshqa ishlamaydi.

## Base64 ga Blob

`URL.createObjectURL` ga alternativ `Blob` ni base64-kodlangan qatorga aylantirishdir.

Bu kodlash ikkilik ma'lumotni 0 dan 64 gacha ASCII kodlari bilan o'ta xavfsiz "o'qilishi mumkin bo'lgan" belgilar qatori sifatida ifodalaydi. Eng muhimi shundaki, biz bu kodlashdan "ma'lumotlar-url" da foydalanishimiz mumkin.

[Data url](mdn:/http/Data_URIs) `data:[<mediatype>][;base64],<data>` ko'rinishiga ega. Biz bunday urllardan hamma joyda, "oddiy" urllar bilan teng foydalanishimiz mumkin.

Masalan, bu yerda tabassum:

```html
<img src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">
```

Brauzer satrni dekodlaydi va rasmni ko'rsatadi: <img src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">

`Blob` ni base64 ga aylantirish uchun biz o'rnatilgan `FileReader` obyektidan foydalanamiz. U Blobsdan ma'lumotlarni bir nechta formatda o'qiy oladi. [Keyingi bobda](ma'lumot:fayl) biz buni chuqurroq yoritamiz.

Mana 64-bazasi orqali blobni yuklab olish namunasi:

```js run
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

*!*
let reader = new FileReader();
reader.readAsDataURL(blob); // blobni base64 ga aylantiradi va yuklashni chaqiradi
*/!*

reader.onload = function() {
  link.href = reader.result; // data url
  link.click();
};
```
`Blob` URL manzilini yaratishning ikkala usuli ham foydalanish mumkin. Lekin odatda `URL.createObjectURL(blob)` oddiyroq va tezroq.

```taqqoslash title-plus="URL.createObjectURL(blob)" title-minus="Blob to data url"
+ Xotira haqida qayg'uradigan bo'lsak, ularni bekor qilishimiz kerak.
+ Blobga to'g'ridan-to'g'ri kirish mavjud, "kodlash/dekodlash" yo'q
- Hech narsani bekor qilish kerak emas.
- Kodlash uchun katta `Blob` obyektlarida ishlash va xotira yo'qotishlari.
```

## Blob uchun rasm

Biz tasvirning `Blob` qismini, rasm qismini yaratishimiz yoki hatto sahifa skrinshotini yaratishimiz mumkin. Buni biror joyga yuklash qulay.

Tasvir operatsiyalari `<canvas>` elementi orqali amalga oshiriladi:

1. [canvas.drawImage](mdn:/api/CanvasRenderingContext2D/drawImage) yordamida rasmni (yoki uning qismini) chizing.
2. `Blob` yaratadigan va bajarilgandan so'ng u bilan `callback`ni ishga tushiradigan [.toBlob(callback, format, quality)](mdn:/api/HTMLCanvasElement/toBlob) qo'ng'iroq qilish usuli.

Quyidagi misolda rasm shunchaki ko'chiriladi, lekin biz undan kesishimiz yoki blob yaratishdan oldin uni o'zgartirishimiz mumkin:

```js run
// istalgan rasmni oling
let img = document.querySelector('img');

// bir xil o'lchamdagi <canva>lar yasang
let canvas = document.createElement('canvas');
canvas.width = img.clientWidth;
canvas.height = img.clientHeight;

let context = canvas.getContext('2d');

// unga rasmni nusxalash (bu usul tasvirni kesish imkonini beradi)
context.drawImage(img, 0, 0);
// biz context.rotate()ni va boshqa ko'p narsalarni canvada bajarishimiz mumkin

// toBlob asinxron operatsiya bo'lib, bajarilganda qayta qo'ng'iroq chaqiriladi
canvas.toBlob(function(blob) {
  // blob tayyor, uni yuklab oling
  let link = document.createElement('a');
  link.download = 'example.png';

  link.href = URL.createObjectURL(blob);
  link.click();

  // Brauzer xotirani undan tozalashga ruxsat berish uchun ichki blob havolasini o'chiring
  URL.revokeObjectURL(link.href);
}, 'image/png');
```

Agar biz qayta qo'ng'iroqlar o'rniga `async/await` ni tanlasak:
```js
let blob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));
```

 Sahifani skrinshot qilish uchun biz <https://github.com/niklasvh/html2canvas> kabi kutubxonadan foydalanishimiz mumkin. U faqat sahifani kezadi va uni `<canvas>` ustiga chizadi. Keyin biz yuqoridagi kabi `Blob` ni olishimiz mumkin.

## Blob dan ArrayBuffer ga

`Blob` konstruktori deyarli hamma narsadan, shu jumladan har qanday `BufferSource` dan blob yaratishga imkon beradi.

Agar biz past darajadagi ishlov berishni amalga oshirishimiz kerak bo'lsa, biz eng past darajadagi `ArrayBuffer` ni `blob.arrayBuffer()` dan olishimiz mumkin:

```js
// blobdan arrayBufferni oling
const bufferPromise = await blob.arrayBuffer();

// yoki
blob.arrayBuffer().then(buffer => /* ArrayBufferni qayta ishlang */);
```

## Blobdan streamga

Biz `2 GB` dan ortiq blokni o'qiganimizda va yozganimizda, `arrayBuffer` dan foydalanish biz uchun xotirani ko'proq talab qiladi. Ushbu nuqtada biz to'g'ridan-to'g'ri blobni oqimga aylantirishimiz mumkin.

Oqim - bu undan qisman o'qish (yoki unga yozish) imkonini beruvchi maxsus obyekt. Bu bizning doiramizdan tashqarida, lekin bu yerda unga misol berilgan va uni batafsilroq o'qishingiz mumkin <https://developer.mozilla.org/en-US/docs/Web/API/Streams_API>. Oqimlar parchalab ishlov berish uchun mos bo'lgan ma'lumotlar uchun qulaydir.

`Blob` interfeysining `stream()` usuli `ReadableStream` ni qaytaradi, bu o'qish paytida `Blob` ichidagi ma'lumotlarni qaytaradi.

Keyin biz undan quyidagicha o'qiymiz:

```js
// blobdan readableStreamni oling
const readableStream = blob.stream();
const stream = readableStream.getReader();

while (true) {
  // har bir iteratsiya uchun: qiymat keyingi blob fragmentidir
  let { done, value } = await stream.read();
  if (done) {
    // streamda hech qanday ma'lumot yo'q
    console.log('all blob processed.');
    break;
  }

   // Blobdan o'qilgan ma'lumotlar qismi bilan biror narsa qiling
  console.log(value);
}
```

## Xulosa

`ArrayBuffer`, `Uint8Array` va boshqa `BufferSource` "ikkilik ma'lumotlar" bo'lsa, [Blob](https://www.w3.org/TR/FileAPI/#dfn-Blob) "binary data with type"ni ifodalaydi. 

Bu Blobs-ni brauzerda keng tarqalgan yuklash/yuklab olish operatsiyalari uchun qulay qiladi.

[XMLHttpRequest](info:xmlhttprequest), [fetch](info:fetch) va boshqalar kabi veb-so'rovlarni bajaradigan usullar `Blob` bilan ham, boshqa ikkilik turlar bilan ham ishlashi mumkin.

Biz `Blob` va past darajadagi ikkilik ma'lumotlar turlarini osongina o'zgartira olamiz:

- Biz `new Blob(...)` konstruktori yordamida terilgan massivdan `Blob` yasashimiz mumkin.
- Biz Blobdan `ArrayBuffer`ni `blob.arrayBuffer()` yordamida qaytarib olishimiz va keyin past darajadagi ikkilik ishlov berish uchun uning ustida ko'rinish yaratishimiz mumkin.

Konversiya oqimlari biz katta blob bilan ishlashimiz kerak bo'lganda juda foydali. Blobdan osongina `ReadableStream` ni yaratishingiz mumkin. `Blob` interfeysining `stream()` usuli `ReadableStream` ni qaytaradi, bu o'qish paytida blob ichidagi ma'lumotlarni qaytaradi.
