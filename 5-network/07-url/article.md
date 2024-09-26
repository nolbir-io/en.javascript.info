
# URL obyektlari

O'rnatilgan [URL](https://url.spec.whatwg.org/#api) klassi URL manzillarini yaratish va tahlil qilish uchun qulay interfeysni ta'minlaydi.

Aynan `URL` obyektini talab qiladigan tarmoq usullari mavjud emas, stringlar yetarli. Shunday qilib, texnik jihatdan biz `URL` dan foydalanishimiz shart emas. Ammo ba'zida bu haqiqatan ham foydali bo'lishi mumkin.

## URL yaratish

Yangi `URL` obyektini yaratish sintaksisi:

```js
new URL(url, [base])
```

- **`url`** -- to'liq URL yoki yagona yo'l (agar baza o'rnatilgan bo'lsa, pastga qarang),
- **`baza`** -- ixtiyoriy asosiy URL: agar set va `url` argumentida faqat yo'l bo'lsa, u holda URL `base` ga nisbatan yaratiladi.

Masalan:

```js
let url = new URL('https://javascript.info/profile/admin');
```

Quyidagi ikkita URL bir xil:

```js run
let url1 = new URL('https://javascript.info/profile/admin');
let url2 = new URL('/profile/admin', 'https://javascript.info');

alert(url1); // https://javascript.info/profile/admin
alert(url2); // https://javascript.info/profile/admin
```

Mavjud URL manziliga nisbatan yo'lga asoslangan holda osongina yangi URL yaratishimiz mumkin:

```js run
let url = new URL('https://javascript.info/profile/admin');
let newUrl = new URL('tester', url);

alert(newUrl); // https://javascript.info/profile/tester
```

`URL` obyekti bizga darhol uning komponentlariga kirish imkonini beradi, shuning uchun bu urlni tahlil qilishning yaxshi usuli, masalan:

```js run
let url = new URL('https://javascript.info/url');

alert(url.protocol); // https:
alert(url.host);     // javascript.info
alert(url.pathname); // /url
```

Mana, URL komponentlari uchun cheatsheet:

![](url-object.svg)

- `href` to'liq url, `url.toString()` bilan bir xil
- `protocol` ikki nuqta `:` belgisi bilan tugaydi
- `search` - parametrlar qatori, `?` savol belgisi bilan boshlanadi
- `xesh` `#` hash belgisi bilan boshlanadi
- HTTP autentifikatsiyasi mavjud bo'lsa, `user` va `password` xususiyatlari ham bo'lishi mumkin: `http://login:password@site.com` (yuqorida bo'yalgan emas, kamdan-kam ishlatiladi).


```smart header="Biz `URL` obyektlarini string o'rniga tarmoq (va boshqa ko'pgina) usullarga o'tkazishimiz mumkin`" 
Biz `URL` obyektini `fetch` yoki `XMLHttpRequest` da ishlatishimiz mumkin, bunda URL satri kutilgan deyarli hamma joyda.

Odatda, `URL` obyekti satr o'rniga istalgan usulga uzatilishi mumkin, chunki ko'pchilik usullar `URL` obyektini to'liq URL manzili bo'lgan satrga aylantiradigan satr konvertatsiyasini amalga oshiradi.
```

## SearchParams "?..."

Aytaylik, biz berilgan qidiruv parametrlari bilan url yaratmoqchimiz, masalan, `https://google.com/search?query=JavaScript`.

Biz ularni URL qatorida taqdim etishimiz mumkin:

```js
new URL('https://google.com/search?query=JavaScript')
```

...Ammo parametrlar bo‘shliqlar, lotin bo'lmagan harflar va hokazolarni o'z ichiga olsa, kodlash kerak (quyida bu haqda batafsilroq).

Demak, buning uchun URL xossasi mavjud: `url.searchParams`, [URLSearchParams] (https://url.spec.whatwg.org/#urlsearchparams) tipidagi obyekt.

Qidiruv parametrlari uchun qulay usullarni taqdim etadi:

- **`append(name, value)`** -- parametrni `name` orqali qo'shing,
- **`delete(name)`** -- parametrni `name` bilan olib tashlang,
- **`get(name)`** -- parametrni `name` orqali oling,
- **`getAll(name)`** -- barcha parametrlarni bir xil `ism` bilan oling (bu mumkin, masalan, `?user=John&user=Pete`),
- **`has(name)`** -- `name` orqali parametr mavjudligini tekshiring,
- **`set(nom, qiymat)`** -- parametrni o'rnatish/almashtirish,
- **`sort()`** -- parametrlarni nom bo'yicha tartiblash, kamdan-kam hollarda kerak,
- ...va u yana takrorlanishi mumkin, xuddi `map`ga o'xshaydi.

Bo'shliqlar va tinish belgilarini o'z ichiga olgan parametrlarga misol:

```js run
let url = new URL('https://google.com/search');

url.searchParams.set('q', 'test me!'); // bo'sh joy bilan qo'shilgan parametr va !

alert(url); // https://google.com/search?q=test+me%21

url.searchParams.set('tbs', 'qdr:y'); // ikki nuqta bilan qo'shilgan parametr:

// parametrlar avtomatik ravishda kodlanadi
alert(url); // https://google.com/search?q=test+me%21&tbs=qdr%3Ay

// qidiruv parametrlarini takrorlash (dekodlangan)
for(let [name, value] of url.searchParams) {
  alert(`${name}=${value}`); // q=test me!, then tbs=qdr:y
}
```

## Kodlash

Standart [RFC3986](https://tools.ietf.org/html/rfc3986) mavjud bo'lib, u URL manzillarida qaysi belgilarga ruxsat berilgan va qaysi biri yo'qligini belgilaydi.

Ruxsat berilmaganlar kodlangan bo'lishi kerak, masalan, lotin bo'lmagan harflar va bo'shliqlar - ularning UTF-8 kodlari bilan almashtirilishi kerak, `%` prefiksli, masalan, `% 20` (bo'sh joy `+` bilan kodlanishi mumkin, tarixiy sabablarga ko'ra, lekin bu istisno).

Yaxshi xabar shundaki, `URL` obyektlari hammasini avtomatik tarzda boshqaradi. Biz shunchaki barcha parametrlarni kodlanmagan holda taqdim etamiz va keyin `URL`ni qatorga aylantiramiz:

```js run
// bu misol uchun ba'zi kirill belgilaridan foydalanish

let url = new URL('https://ru.wikipedia.org/wiki/Тест');

url.searchParams.set('key', 'ъ');
alert(url); //https://ru.wikipedia.org/wiki/%D0%A2%D0%B5%D1%81%D1%82?key=%D1%8A
```

Ko'rib turganingizdek, url yo'lidagi `Test` va parametrdagi `ъ` kodlangan.

URL uzunroq bo'ldi, chunki har bir kirill harfi UTF-8 da ikki bayt bilan ifodalanadi, shuning uchun ikkita `%..` obyekt mavjud.

### Kodlash satrlari

Qadim zamonlarda, `URL` obyektlari paydo bo'lishidan oldin, odamlar URL manzillari uchun satrlardan foydalanganlar.

Hozirda `URL` obyektlari ko'pincha qulayroq, ammo satrlardan ham foydalanish mumkin. Ko'p hollarda satrdan foydalanish kodni qisqartiradi.

Agar biz satrdan foydalansak, maxsus belgilarni qo'lda kodlash/dekodlash kerak.

Buning uchun o'rnatilgan funktsiyalar mavjud:

- [encodeURI](mdn:/JavaScript/Reference/Global_Objects/encodeURI) - URLni bir butun sifatida kodlaydi.
- [decodeURI](mdn:/JavaScript/Reference/Global_Objects/decodeURI) - uni qayta dekodlaydi.
- [encodeURIComponent](mdn:/JavaScript/Reference/Global_Objects/encodeURIComponent) - qidiruv parametri, hash yoki yo'l nomi kabi URL komponentini kodlaydi.
- [decodeURIComponent](mdn:/JavaScript/Reference/Global_Objects/decodeURIComponent) - uni qayta dekodlaydi.

Tabiiy savol: "`encodeURIComponent` va `encodeURI` o'rtasidagi farq nima? Qachon biz ikkalasidan ham foydalanishimiz kerak?"

Yuqoridagi rasmdagi tarkibiy qismlarga bo'lingan URL manziliga qarasak, buni tushunish oson:

```
https://site.com:8080/path/page?p1=v1&p2=v2#hash
```

Ko'rib turganimizdek, URL manzilida `:`, `?`, `=`, `&`, `#` kabi belgilarga ruxsat berilgan.

...Boshqa tomondan, qidiruv parametri kabi bitta URL komponentini ko‘rib chiqsak, bu belgilar formatlashni buzish uchun emas, balki kodlangan bo'lishi kerak.

- `encodeURI` faqat URL manzilida mutlaqo taqiqlangan belgilarni kodlaydi.
- `encodeURIComponent` bir xil belgilarni va ularga qo'shimcha ravishda `#`, `$`, `&`, `+`, `,`, `/`, `:`, `;`, `?`, `@` = belgilarni kodlaydi. 

Shunday qilib, butun URL uchun biz `encodeURI` dan foydalanishimiz mumkin:

```js run
// url pathda kirill belgilaridan foydalanish
let url = encodeURI('http://site.com/привет');

alert(url); // http://site.com/%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82
```

...URL parametrlari uchun `encodeURIComponent` dan foydalanishimiz kerak:

```js run
let music = encodeURIComponent('Rock&Roll');

let url = `https://google.com/search?q=${music}`;
alert(url); // https://google.com/search?q=Rock%26Roll
```

Uni `encodeURI` bilan solishtiring:

```js run
let music = encodeURI('Rock&Roll');

let url = `https://google.com/search?q=${music}`;
alert(url); // https://google.com/search?q=Rock&Roll
```

Ko'rib turganimizdek, `encodeURI` `&` ni kodlamaydi, chunki bu butun URL uchun qonuniy belgi.

Lekin biz qidiruv parametri ichida `&` ni kodlashimiz kerak, aks holda biz `q=Rock&Roll` ni olamiz - bu aslida `q=Rock` va ba'zi noaniq parametr `Roll` hisoblanadi. Ular ko'rsatilgandek emas.

Shunday qilib, biz har bir qidiruv parametri uchun URL satriga to'g'ri kiritish uchun faqat `encodeURIComponent` dan foydalanishimiz kerak. Agar u faqat ruxsat etilgan belgilarga ega ekanligiga amin bo'lsak, eng xavfsizi ism va qiymatni kodlashdir.

````smart header="`URL` bilan taqqoslaganda kodlash farqi`"

Sinflar [URL](https://url.spec.whatwg.org/#url-class) va url parametrlari [URLSearchParams](https://url.spec.whatwg.org/#interface-urlsearchparams) oxirgi URIga asoslangan. spetsifikatsiya: [RFC3986](https://tools.ietf.org/html/rfc3986), `encode*` funksiyalari esa eskirgan versiyaga asoslangan [RFC2396](https://www.ietf.org/rfc/rfc2396).

Bir nechta farqlar mavjud, masalan, IPv6 manzillari boshqacha kodlangan:

```js run
// IPv6 manzili bilan haqiqiy url
let url = 'http://[2607:f8b0:4005:802::1007]/';

alert(encodeURI(url)); // http://%5B2607:f8b0:4005:802::1007%5D/
alert(new URL(url)); // http://[2607:f8b0:4005:802::1007]/
```

Ko'rib turganimizdek, `encodeURI` kvadrat qavslarni `[...]` almashtirdi, bu to'g'ri emas, sababi: RFC2396 (1998 yil avgust) vaqtida IPv6 urllari mavjud emas edi.

Bunday holatlar kam, `encode*` funksiyalari ko'pincha yaxshi ishlaydi.
````
