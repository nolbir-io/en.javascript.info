# Resurs yuklanishi: yuklash va xato

Brauzer bizga tashqi resurslarning yuklanishini kuzatish imkonini beradi -- skriptlar, iframes, rasmlar va boshqalar.

Buning uchun ikkita hodisa mavjud:

- `onload` -- muvaffaqiyatli yuklash,
- `error` -- xatolik yuz berdi.

## Skriptni yuklash

Aytaylik, biz uchinchi tomon skriptini yuklashimiz va u yerda joylashgan funksiyani chaqirishimiz kerak.

Biz uni dinamik ravishda yuklashimiz mumkin, masalan:

```js
let script = document.createElement('script');
script.src = "my.js";

document.head.append(script);
```

...Ammo ushbu skript ichida e'lon qilingan funksiyani qanday ishga tushiramiz? Biz skript yuklanguncha kutishimiz kerak va shundan keyingina uni chaqirishimiz mumkin.

```smart
O'z skriptlarimiz uchun biz bu yerda [JavaScript modullari](info:modules) dan foydalanishimiz mumkin, ammo ular uchinchi tomon kutubxonalari tomonidan keng qo'llanilmaydi.
```

### script.onload

Asosiy yordamchi `load` hodisasidir. U skript yuklangan va bajarilgandan so'ng ishga tushadi.

Masalan:

```js run untrusted
let script = document.createElement('script');

// istalgan domendan istalgan skriptni yuklashi mumkin
script.src = "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.3.0/lodash.js"
document.head.append(script);

*!*
script.onload = function() {
  // skript ushbu "_" variable ni yaratadi
  alert( _.VERSION ); // library versiyasini ko'rsatadi
};
*/!*
```

Shunday qilib, `onload` da biz skript o'zgaruvchilari, ishga tushirish funksiyalari va hokazolardan foydalanishimiz mumkin.

...Agar yuklash muvaffaqiyatsiz bo'lsa-chi? Masalan, bunday skript yo'q (xato 404) yoki server ishlamayapti (mavjud emas).

### script.onerror

Skriptni yuklash paytida yuzaga keladigan xatolar `error` hodisasida kuzatilishi mumkin.

Masalan, mavjud bo'lmagan skriptni so'raymiz:

```js run
let script = document.createElement('script');
script.src = "https://example.com/404.js"; // bunday skript yo'q
document.head.append(script);

*!*
script.onerror = function() {
  alert("Error loading " + this.src); // https://example.com/404.js yuklashda xatolik yuz berdi
};
*/!*
```

Esda tutingki, biz bu yerda HTTP xatosi tafsilotlarini ololmaydi. Bu xato 404 yoki 500 yoki boshqa narsa ekanligini bilmaymiz. Faqat yuklash muvaffaqiyatsiz tugadi.

```warn
`onload`/`onerror` hodisalari faqat yuklanishning o'zini kuzatib boradi.

Skriptni qayta ishlash va bajarish jarayonida yuzaga kelishi mumkin bo'lgan xatolar ushbu hodisalar uchun ko'rib chiqilmaydi. Ya'ni: agar skript muvaffaqiyatli yuklangan bo'lsa, unda dasturlash xatolari bo'lsa ham, `onload` ishga tushadi. Skript xatolarini kuzatish uchun `window.onerror` global ishlov beruvchisidan foydalanish mumkin.
```

## Boshqa resurslar

`load` va `error` hodisalari boshqa manbalar uchun ham ishlaydi, asosan tashqi `src` ga ega bo'lgan har qanday manba uchun.

Masalan:

```js run
let img = document.createElement('img');
img.src = "https://js.cx/clipart/train.gif"; // (*)

img.onload = function() {
  alert(`Image loaded, size ${img.width}x${img.height}`);
};

img.onerror = function() {
  alert("Error occurred while loading image");
};
```

Biroq, ba'zi eslatmalar mavjud:

- Ko'pgina resurslar hujjatga qo'shilgandan so'ng yuklashni boshlaydi. Lekin `<img>` bundan mustasno. U src `(*)` belgisini olganida yuklashni boshlaydi.
- `<iframe>` uchun iframe yuklash tugagach, `iframe.onload` hodisasi muvaffaqiyatli yuklash uchun ham, xatolik yuz berganda ham ishga tushadi.

Bu tarixiy sabablarga ko'ra shunday.

## Krossorigin siyosati

Shunday qoida bor: bir saytdagi skriptlar boshqa sayt tarkibiga kira olmaydi. Shunday qilib, masalan. `https://facebook.com` saytidagi skript foydalanuvchining `https://gmail.com` manzilidagi pochta qutisini o'qiy olmaydi.

Yoki, aniqrog'i, bir kelib chiqishi (domen/port/protokol uchligi) boshqasidan tarkibga kira olmaydi. Shunday qilib, agar bizda subdomain yoki boshqa qism bo'lsa ham, bular bir-biriga kirish imkoni bo'lmagan turli xil manbalardir.

Bu qoida boshqa domenlardagi resurslarga ham ta'sir qiladi.

Agar biz boshqa domendagi skriptdan foydalanayotgan bo'lsak va unda xatolik bo'lsa, biz xato tafsilotlarini ololmaymiz.

Masalan, bitta (yomon) funksiya chaqiruvidan iborat `error.js` skriptini olaylik:
```js
// 📁 error.js
noSuchFunction();
```

Endi uni u joylashgan saytdan yuklang:

```html run height=0
<script>
window.onerror = function(message, url, line, col, errorObj) {
  alert(`${message}\n${url}, ${line}:${col}`);
};
</script>
<script src="/article/onload-onerror/crossorigin/error.js"></script>
```

Biz yaxshi xato hisobotini ko'rishimiz mumkin, masalan:

```
Uncaught ReferenceError: noSuchFunction is not defined
https://javascript.info/article/onload-onerror/crossorigin/error.js, 1:1
```

Endi xuddi shu skriptni boshqa domendan yuklaymiz:

```html run height=0
<script>
window.onerror = function(message, url, line, col, errorObj) {
  alert(`${message}\n${url}, ${line}:${col}`);
};
</script>
<script src="https://cors.javascript.info/article/onload-onerror/crossorigin/error.js"></script>
```

Quyidagi kabi report biroz boshqacha:

```
Script error.
, 0:0
```

Tafsilotlar brauzerga qarab farq qilishi mumkin, ammo g'oya bir xil: skriptning ichki qismlari haqidagi har qanday ma'lumot, jumladan, xato stack izlari yashiringan, chunki u boshqa domendan.

Nima uchun bizga xato tafsilotlari kerak?

`window.onerror` yordamida global xatolarni tinglaydigan, xatolarni saqlaydigan va ularga kirish va tahlil qilish uchun interfeysni taqdim etadigan ko'plab xizmatlar mavjud (va biz o'zimiznikini yaratishimiz mumkin). Bu ajoyib, chunki biz foydalanuvchilarimiz tomonidan qo'zg'atilgan haqiqiy xatolarni ko'rishimiz mumkin. Agar skript boshqa manbadan kelgan bo'lsa, unda biz ko'rganimizdek, undagi xatolar haqida ko'p ma'lumot yo'q.

Shunga o'xshash o'zaro kelib chiqish siyosati (CORS) boshqa turdagi resurslar uchun ham qo'llaniladi.

**O'zaro kelib chiqishga ruxsat berish uchun `<script>` tegi `crossorigin` atribyutiga ega bo'lishi kerak, bundan tashqari masofaviy server maxsus sarlavhalarni taqdim etishi lozim.**

O'zaro kirishning uchta darajasi mavjud:

1. **`Crossorigin` atribyuti yo'q** -- kirish taqiqlangan.
2. **`crossorigin="anonymous"`** -- agar server `Access-Control-Allow-Origin` sarlavhasi bilan `*` yoki bizning kelib chiqishimiz bilan javob bersa, kirishga ruxsat beriladi. Brauzer avtorizatsiya ma'lumotlari va cookie-fayllarni masofaviy serverga yubormaydi.
3. **`crossorigin="use-credentials"`** -- agar server `Access-Control-Allow-Origin` sarlavhasini bizning kelib chiqishi va `Access-Control-Allow-Credentials: true` bilan qaytarib yuborsa, kirishga ruxsat beriladi. Brauzer avtorizatsiya ma'lumotlari va cookie fayllarini masofaviy serverga yuboradi.

```smart
O'zaro kirish ruxsati haqida ko'proq <info:fetch-crossorigin> bo'limida o'qishingiz mumkin. U tarmoq so'rovlari uchun `fetch` usulini tavsiflaydi, lekin siyosat aynan bir xil.

"Cookie-fayllar" kabi narsalar bizning joriy doiramizga kirmaydi, lekin siz ular haqida <info:cookie> bobida o'qishingiz mumkin.
```

Bizning holatlarimizda bizda hech qanday o'zaro bog'liqlik xususiyati yo'q edi. Shunday qilib, o'zaro kelib chiqish taqiqlandi. Keling, biz buni qo'shamiz.

Biz `"anonymous"` (cookie-fayllar yuborilmagan, bitta server tomoni sarlavhasi kerak) va `"use-credentials"` (cookie-fayllarni ham yuboradi, ikkita server tomoni sarlavhasi kerak) o'rtasida tanlov qilishimiz mumkin.

Agar biz cookie-fayllar haqida qayg'urmasak, unda `"anonymous"` eng ma'qul yo'l:

```html run height=0
<script>
window.onerror = function(message, url, line, col, errorObj) {
  alert(`${message}\n${url}, ${line}:${col}`);
};
</script>
<script *!*crossorigin="anonymous"*/!* src="https://cors.javascript.info/article/onload-onerror/crossorigin/error.js"></script>
```

Endi, agar server `Access-Control-Allow-Origin` sarlavhasini taqdim qilsa, hammasi joyida. Bizda to'liq xato hisoboti mavjud.

## Xulosa

Tasvirlar `<img>`, tashqi uslublar, skriptlar va boshqa resurslar yuklanishini kuzatish uchun `load` va `error` hodisalarini ta'minlaydi:

- `load` muvaffaqiyatli load ni ishga tushiradi,
- `error` muvaffaqiyatsiz yuklanishda paydo bo'ladi.

Faqatgina istisno `<iframe>`: tarixiy sabablarga ko'ra, sahifa topilmasa ham, har qanday yuklash tugallanishi uchun u har doim `load` ni ishga tushiradi.

`readystatechange` hodisasi resurslar uchun ham ishlaydi, lekin kamdan-kam qo'llaniladi, chunki `load/error` hodisalari oddiyroq.
