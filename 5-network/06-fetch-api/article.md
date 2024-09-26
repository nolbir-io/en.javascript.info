
# Fetch API

Hozircha biz `fetch` haqida biroz ma'lumotga egamiz.

Keling, uning barcha imkoniyatlarini qamrab olish uchun APIning qolgan qismini ham ko'rib chiqaylik.

```smart

E'tibor bering: ushbu variantlarning aksariyati kamdan-kam hollarda qo'llaniladi. Siz ushbu bobni o'tkazib yuborishingiz va `fetch` dan yaxshi foydalanishingiz mumkin.

Shunday bo'lsa-da, `fetch` nima qila olishini bilish yaxshi, shuning uchun agar kerak bo'lsa, qaytib kelib, tafsilotlarni o'qishingiz mumkin.
```
Bu yerda barcha mumkin boʻlgan `fetch` opsiyalarining standart qiymatlari bilan toʻliq roʻyxati (sharhlardagi muqobillar):

```js
let promise = fetch(url, {
  method: "GET", // POST, PUT, DELETE, etc.
  headers: {
    // kontent turi sarlavhasi qiymati odatda avtomatik o'rnatiladi
     // so'rov tanasiga qarab
    "Content-Type": "text/plain;charset=UTF-8"
  },
  body: undefined, // string, FormData, Blob, BufferSource, yoki URLSearchParams
  referrer: "about:client", // yoki hech qanday Referer sarlavhasini yuborish uchun "",
  // yoki joriy manbadan url
  referrerPolicy: "strict-origin-when-cross-origin", // downgrade vaqtida referer yo'q, no-referrer, kelib chiqishi, kelib chiqishi bir xil...
  mode: "cors", // kelib chiqishi bir xil, cors mavjud emas
  credentials: "same-origin", // o'tkazib yuborish, o'z tarkibiga olish
  cache: "default", // saqlash yo'q, qayta yuklash, keshsiz, majburiy kesh yoki faqat keshlangan bo'lsa
  redirect: "follow", // manual, xato
  integrity: "", // "sha256-abcdef1234567890" kabi hash
  keepalive: false, // true
  signal: undefined, // AbortController abort so'rovni bekor qilish uchun
  window: window // null
});
```

Ta'sirli ro'yxat, to'g'rimi?

Biz <info:fetch> bobida `method`, `headers` va `body`ni to'liq ko'rib chiqdik.

`Signal` opsiyasi <info:fetch-abort> da yoritilgan.

Endi qolgan imkoniyatlarni ko'rib chiqamiz.

## referrer, referrerPolicy

Ushbu parametrlar `fetch` HTTP `Referer` sarlavhasini qanday o'rnatishini boshqaradi.

Odatda bu sarlavha avtomatik tarzda o'rnatiladi va so'rovni yuborgan sahifaning URL manzilini o'z ichiga oladi. Ko'pgina stsenariylarda bu umuman muhim emas, ba'zida xavfsizlik maqsadlarida uni olib tashlash yoki qisqartirish mantiqan to'g'ri.

**`Referer` opsiyasi istalgan `Referer`ni (joriy manba ichida) o'rnatish yoki uni olib tashlash imkonini beradi.**

Referrerni yubormaslik uchun bo'sh qatorni o'rnating:
```js
fetch('/page', {
*!*
  referrer: "" // Referer header yo'q
*/!*
});
```

Joriy manba ichida boshqa url o'rnatish uchun:

```js
fetch('/page', {
  // https://javascript.info saytidamiz deb faraz qilamiz
   // biz har qanday Referer sarlavhasini o'rnatishimiz mumkin, lekin faqat joriy manba ichida
*!*
  referrer: "https://javascript.info/anotherpage"
*/!*
});
```

**`ReferrerPolicy` opsiyasi `Referer` uchun umumiy qoidalarni belgilaydi.**

So'rovlar 3 turga bo'linadi:

1. Bir xil kelib chiqish so'rovi.
2. Boshqa kelib chiqishga ega so'rov.
3. HTTPS dan HTTP ga so'rov (xavfsiz protokoldan xavfli protokolga).

Aniq `Referer` qiymatini belgilash imkonini beruvchi `referrer` opsiyasidan farqli o'laroq, `referrerPolicy` brauzerga har bir so'rov turi uchun umumiy qoidalarni aytib beradi.

Mumkin qiymatlar [Referrer siyosati spetsifikatsiyasida] (https://w3c.github.io/webappsec-referrer-policy/) tavsiflangan:

- **`"strict-origin-when-cross-origin"`** -- standart qiymat: bir xil kelib chiqishi uchun to'liq `Referer`ni yuboring, o'zaro kelib chiqishi uchun faqat manbaani yuboring, agar HTTPS→HTTP so'rovi bo'lmasa, keyin hech narsa yubormang.
- **`"no-referrer-when-downgrade"`** -- HTTPS dan HTTP ga (kamroq xavfsiz protokolga) so'rov yubormagunimizcha, to'liq `Referer` har doim yuboriladi.
- **`"no-referrer"`** -- `Referer`ni hech qachon yubormang.
- **`"origin"`** -- to'liq sahifaning URL manzilini emas, faqat `Referer` ga manbani yuboring, masalan, `http://site.com/path` o'rniga faqat `http://site.com`.
- **`"origin-when-cross-origin"`** -- to'liq `Referer` ni bir xil manbaga yuboring, lekin o'zaro kelib chiqish so'rovlari uchun faqat boshlang'ich qismini (yuqoridagi kabi) yuboring.
- **`"same-origin"`** -- to'liq `Referer`ni bir xil manbaga yuboring, lekin o'zaro kelib chiqish so'rovlari uchun `Referer` yo'q.
- **`"strict-origin"`** -- HTTPS→HTTP so'rovlari uchun `Referer`ni emas, faqat manbani yuboring.
- **`"unsafe-url"`** -- HTTPS→HTTP so'rovlari uchun ham har doim to'liq urlni `Referer` ga yuboring.

Mana barcha kombinatsiyalar bilan jadval:

| Qiymat | Bir xil kelib chiqishga | Turli xil kelib chiqishga | HTTPS→HTTP |
|-------|----------------|-------------------|------------|
| `"no-referrer"` | - | - | - |
| `"no-referrer-when-downgrade"` | full | full | - |
| `"origin"` | origin | origin | origin |
| `"origin-when-cross-origin"` | full | origin | origin |
| `"same-origin"` | full | - | - |
| `"strict-origin"` | origin | origin | - |
| `"strict-origin-when-cross-origin"` or `""` (default) | full | origin | - |
| `"unsafe-url"` | full | full | full |

Aytaylik, bizda saytdan tashqarida ma'lum bo'lmasligi kerak bo'lgan URL tuzilmasi bo'lgan administrator zonasi mavjud.

Agar biz `fetch` ni yuboradigan bo'lsak, u default bo'yicha har doim sahifamizning to'liq URL manzili bilan `Referer` sarlavhasini yuboradi (biz HTTPS-dan HTTP-ga so'rov yuborganimizdan tashqari, `Referer` yo'q).

Masalan, `Referer: https://javascript.info/admin/secret/paths`.

Agar boshqa veb-saytlar URL-yo'lni emas, balki faqat manba qismini bilishini istasak, biz quyidagi variantni o'rnatishimiz mumkin:

```js
fetch('https://another.com/page', {
  // ...
  referrerPolicy: "origin-when-cross-origin" // Referer: https://javascript.info
});
```

Biz uni barcha `fetch` qo'ng'iroqlariga qo'yishimiz mumkin, balki barcha so'rovlarni bajaradigan va ichida `fetch` dan foydalanadigan loyihamizning JavaScript kutubxonasiga integratsiyalasak bo'ladi.

Uning standart xatti-harakatlardan yagona farqi shundaki, boshqa manbaga so'rovlar uchun `fetch` faqat URLning boshlang'ich qismini yuboradi (masalan, `https://javascript.info`, yo'lsiz). Bizning kelib chiqishi haqidagi so'rovlar uchun biz hali ham to'liq `Referer` ni olamiz (balki nosozliklarni tuzatish uchun foydalidir).

```smart header="Yo'naltiruvchi siyosati faqat `fetch` uchun emas"
Yo'naltiruvchi siyosati [spesifikatsiyada] (https://w3c.github.io/webappsec-referrer-policy/) tasvirlangan, nafaqat `fetch` uchun, balki globalroqdir.

Xususan, `Referrer-Policy` HTTP sarlavhasi yoki `<a rel="noreferrer">` bilan har bir havola yordamida butun sahifa uchun standart siyosatni o'rnatish mumkin.
```

## mode (Rejim)

`Mode` opsiyasi vaqti-vaqti bilan o'zaro kelib chiqish so'rovlarini oldini oluvchi himoya vositasidir:

- **`"cors"`** -- <info:fetch-crossorigin>da tavsiflanganidek, birlamchi, o'zaro kelib chiqish so'rovlariga ruxsat beriladi,
- **`"same-origin"`** -- o'zaro kelib chiqish so'rovlari ta'qiqlangan,
- **`"no-cors"`** -- faqat xavfsiz o'zaro kelib chiqish so'rovlariga ruxsat beriladi.

Bu parametr `fetch` URL manzili uchinchi tomondan kelganda foydali bo'lishi mumkin va biz o'zaro kelib chiqish imkoniyatlarini cheklash uchun "o'chirish tugmasi"ni xohlaymiz.

## Hisob ma'lumotlari (credentials)

`Credentials` opsiyasi `fetch` so'rov bilan cookie-fayllar va HTTP-Authorization sarlavhalarini yuborish kerakligini belgilaydi.

- **`"same-origin"`** -- sukut bo'yicha, o'zaro kelib chiqish so'rovlarini yubormang,
- **`"include"`** -- har doim jo'natish, <info:fetch- bobida yoritilgan javobga JavaScript kirishi uchun o'zaro kelib chiqish serveridan `Access-Control-Allow-Credentials` talab qiladi. 
- **`"omit"`** -- hech qachon, hatto bir xil so'rovlar uchun ham yubormang.

## kesh

Odatiy bo'lib, `fetch` so'rovlari standart HTTP-keshlashdan foydalanadi. Ya'ni, `Expires` va `Cache-Control` sarlavhalarini hurmat qiladi,  xuddi oddiy HTTP so'rovlari kabi `If-Modified-Since` va hokazolarni yuboradi.

`cache` opsiyalari HTTP keshini e'tiborsiz qoldirish yoki undan foydalanishni aniq sozlash imkonini beradi:

- **`"default"`** -- `fetch` standart HTTP-kesh qoidalari va sarlavhalaridan foydalanadi,
- **`"no-store"`** -- HTTP-keshni butunlay e'tiborsiz qoldiring, agar biz `If-Modified-Since`, `If-None-Match`, `If-Unmodified-Since`, `If-Match`, yoki `If-Range` sarlavhasini o'rnatsak, bu rejim birlamchi bo'ladi. 
- **`"qayta yuklash"`** -- HTTP-keshdan natijani olmang (agar mavjud bo'lsa), lekin keshni javob bilan to'ldiring (agar javob sarlavhalari bu harakatga ruxsat bersa),
- **`"no-cache"`** -- agar keshlangan javob bo'lsa, shartli so'rov, aks holda oddiy so'rov yarating. HTTP keshini javob bilan to'ldiring,
- **`"force-cache"`** -- eski bo'lsa ham HTTP-keshdagi javobdan foydalaning. Agar HTTP keshida javob bo'lmasa, muntazam HTTP so'rovini qiling, odatdagidek harakatlaning,
- **`"only-if-cached"`** -- eskirgan bo'lsa ham HTTP-keshdan javobdan foydalaning. Agar HTTP keshida javob bo'lmasa, xato. `mode` `"same-origin"` bo'lganda ishlaydi.

## yo'naltirish (redirect)

Odatda, `fetch` 301, 302 va boshqalar kabi HTTP yo'naltirishlarini shaffof tarzda bajaradi.

`redirect` opsiyasi buni o'zgartirishga imkon beradi:

- **`"follow"`** -- sukut bo'yicha, HTTP yo'naltirishlariga rioya qiling,
- **`"error"`** -- HTTP-qayta yo'naltirishda xatolik,
- **`"manual"`** -- HTTP-yo'naltirishni qo'lda qayta ishlash imkonini beradi. Qayta yo'naltirishda biz `response.type="opaqueredirect"` va nollangan/bo'sh holati va boshqa ko'plab xususiyatlar bilan maxsus javob obyektini olamiz.

## yaxlitlik (integrity)

`integrity` opsiyasi javobning oldindan ma'lum bo'lgan nazorat summasiga mos kelishini tekshirish imkonini beradi.

[spetsifikatsiyada](https://w3c.github.io/webappsec-subresource-integrity/) ta'riflanganidek, qo'llab-quvvatlanadigan hash-funksiyalar SHA-256, SHA-384 va SHA-512 hisoblanadi, brauzerga qarab boshqalar ham bo'lishi mumkin..

Misol uchun, biz faylni yuklab olmoqdamiz va uning SHA-256 nazorat summasi "abcdef" ekanligini bilamiz (haqiqiy nazorat summasi, albatta, uzoqroq).

Biz buni `integrity` opsiyasiga qo'yishimiz mumkin, masalan:

```js
fetch('http://site.com/file', {
  integrity: 'sha256-abcdef'
});
```

Keyin `fetch` SHA-256 ni mustaqil ravishda hisoblab chiqadi va uni bizning qatorimiz bilan taqqoslaydi. Agar nomuvofiqlik bo'lsa, xato to'g'rilanadi.

## keepalive

`Keepalive` opsiyasi so'rov uni boshlagan veb-sahifadan "uzoq" bo'lishi mumkinligini bildiradi.

Misol uchun, foydalanuvchi tajribasini tahlil qilish va yaxshilash uchun joriy tashrifchi bizning sahifamizdan qanday foydalanishi (sichqonchani bosishlari, u ko'rgan sahifa fragmentlari) haqida statistik ma'lumotlarni yig'amiz.

Visitor sahifamizni tark etganda, biz ma'lumotlarni serverimizga saqlamoqchimiz.

Buning uchun `window.onunload` hodisasidan foydalanishimiz mumkin:

```js run
window.onunload = function() {
  fetch('/analytics', {
    method: 'POST',
    body: "statistics",
*!*
    keepalive: true
*/!*
  });
};
```

Odatda, hujjat tushirilganda, barcha bog'langan tarmoq so'rovlari bekor qilinadi. Ammo `keepalive` opsiyasi brauzerga so'rovni sahifadan chiqqandan keyin ham fonda bajarishni aytadi. Demak, bu variant bizning so'rovimiz muvaffaqiyatli bo'lishi uchun zarur.

U bir nechta cheklovlarga ega:

 - Biz megabaytlarni yubora olmaymiz: `keepalive` so'rovlari uchun asosiy chegara 64KB.
     - Agar tashrif haqida juda ko'p statistik ma'lumotlarni to'plashimiz kerak bo'lsa, oxirgi `onunload` so'roviga ko'p vaqt qolmasligi uchun uni muntazam ravishda paketlarda yuborishimiz kerak.
     - Bu cheklov barcha `keepalive` so'rovlari uchun amal qiladi. Boshqacha qilib aytadigan bo'lsak, biz parallel ravishda bir nechta `keepalive` so'rovlarini bajarishimiz mumkin, ammo ularning tana uzunligi yig'indisi 64 KB dan oshmasligi kerak.
- Hujjat tushirilgan bo'lsa, server javobini bajara olmaymiz. Shunday qilib, bizning misolimizda `fetch` `keepalive` tufayli muvaffaqiyatli bo'ladi, ammo keyingi funksiyalar ishlamaydi.
     - Aksariyat hollarda, masalan, statistik ma'lumotlarni yuborish muammo emas, chunki server faqat ma'lumotlarni qabul qiladi va odatda bunday so'rovlarga bo'sh javob yuboradi.   
