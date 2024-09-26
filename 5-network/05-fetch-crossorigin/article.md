# Fetch: O'zaro kelib chiqish so'rovlari

Agar biz boshqa veb-saytga `fetch` so'rovini yuborsak, u muvaffaqiyatsiz bo'lishi mumkin.

Masalan, `http://example.com` ni olishga harakat qilaylik:

```js run async
try {
  await fetch('http://example.com');
} catch(err) {
  alert(err); // Olib bo'lmadi
}
```

Kutilganidek, olib kelish muvaffaqiyatsiz tugadi.

Bu yerda asosiy tushuncha *kelib chiqishi* -- domen/port/protokol uchligidir.

O'zaro kelib chiqish so'rovlari -- boshqa domenga (hatto subdomenga), protokol yoki portga yuborilgan so'rovlar uzoq tomondan maxsus sarlavhalarni talab qiladi.

Ushbu siyosat "CORS" deb nomlanadi: bu o'zaro manbalar almashinuvi hisoblanadi.

## Nima uchun CORS kerak? Qisqacha tarix

CORS internetni yovuz xakerlardan himoya qilish uchun mavjud.

Bu ancha jiddiy mavzu. Keling, qisqacha tarixiy ekspluatatsiya qilaylik.

**Ko'p yillar davomida bir saytning skripti boshqa sayt tarkibiga kira olmadi.**

Ushbu oddiy, ammo kuchli qoida internet xavfsizligining asosi edi. Masalan, `hacker.com` veb-saytidagi yomon skript `gmail.com` saytidagi foydalanuvchining pochta qutisiga kira olmadi. Odamlar o'zlarini xavfsiz his qilishdi.

O'sha paytda JavaScriptda tarmoq so'rovlarini bajarish uchun maxsus usullar mavjud emas, bu veb-sahifani bezash uchun o'yinchoq tili edi.

Ammo veb-dasturchilar ko'proq kuch talab qilishdi. Cheklovni bartaraf etish va boshqa veb-saytlarga so'rov yuborish uchun turli xil fokuslar ixtiro qilindi.

### Shakllardan foydalanish

Boshqa server bilan bog'lanishning bir usuli u yerda `<form>` yuborish edi. Odamlar uni `<iframe>`ga joriy sahifada qolish uchun yuborishgan, masalan:

```html
<!-- form target -->
*!*
<iframe name="iframe"></iframe>
*/!*

<!-- form dinamik ravishda yaratilishi va JavaScript tomonidan yuborilishi mumkin -->
*!*
<form target="iframe" method="POST" action="http://another.com/…">
*/!*
  ...
</form>
```

Shunday qilib, boshqa saytga GET/POST so'rovini hatto tarmoq usullarisiz ham qilish mumkin edi, chunki formalar ma'lumotlarni istalgan joyga yuborishi mumkin. Lekin boshqa saytdan `<iframe>` tarkibiga kirish taqiqlangani uchun javobni o'qib bo'lmadi.

Aniqroq qilib aytadigan bo'lsak, buning uchun aslida fokuslar bor edi, ular iframe va sahifada maxsus skriptlarni talab qilishdi. Shunday qilib, iframe bilan aloqa texnik jihatdan mumkin edi. Hozir tafsilotlarga to'xtalib o'tishning ma'nosi yo'q, bu dinozavrlar tinchgina orom olishsin.

### Skriptlardan foydalanish

Yana bir hiyla `skript` tegidan foydalanish edi. Skript har qanday `src`ga ega bo'lishi mumkin, masalan, `<script src="http://another.com/…">`. Skriptni istalgan veb-saytdan bajarish mumkin.

Agar veb-sayt, masalan. `another.com` ushbu turdagi kirish uchun ma'lumotlarni oshkor qilishni maqsad qilgan, keyin `JSONP (to'ldiruvchi JSON)` protokoli ishlatilgan.

Quyida u qanday ishlaganini ko'rishingiz mumkin.

Aytaylik, bizning saytimizda `http://another.com` dan ob-havo lumotlarni olishimiz kerak:

1. Birinchidan, oldindan ma'lumotlarni qabul qilish uchun global funktsiyani e'lon qilamiz, masalan, `gotWeather`.

    ```js
    // 1. Ob-havo ma'lumotlarini qayta ishlash funktsiyasini e'lon qiling
    function gotWeather({ temperature, humidity }) {
      alert(`temperature: ${temperature}, humidity: ${humidity}`);
    }
    ```
2. Keyin `src="http://another.com/weather.json?callback=gotWeather"` bilan `<script>` tegini yaratamiz, bunda funksiyamiz nomini `callback` URL-parametri sifatida ishlatamiz.

    ```js
    let script = document.createElement('script');
    script.src = `http://another.com/weather.json?callback=gotWeather`;
    document.body.append(script);
    ```
3. `Another.com` masofaviy serveri dinamik ravishda `gotWeather(...)` deb chaqiradigan skriptni ishlab chiqaradi, u biz olishni xohlagan ma'lumotlarga ega.
    ```js
    // Serverdan kutilgan javob shunday ko'rinishda bo'ladi:
    gotWeather({
      temperature: 25,
      humidity: 78
    });
    ```
4. Masofaviy skript yuklanganda va bajarilganda `gotWeather` ishlaydi va bu bizning vazifamiz bo'lgani uchun bizda ma'lumotlar mavjud.

Bu ishlaydi va xavfsizlikni buzmaydi, chunki ikkala tomon ham ma'lumotlarni shu tarzda uzatishga kelishib oldilar. Agar ikkala tomon ham rozi bo'lsa, bu, albatta, xakerlik emas. Bunday kirishni ta'minlaydigan xizmatlar hali ham mavjud, chunki u juda eski brauzerlar uchun ham ishlaydi.

Biroz vaqt o'tgach, JavaScript brauzerida tarmoq usullari paydo bo'ldi.

Dastlab, o'zaro kelib chiqish so'rovlari ta'qiqlangan. Ammo uzoq davom etgan munozaralar natijasida o'zaro kelib chiqish so'rovlariga ruxsat berildi, lekin har qanday yangi imkoniyatlar bilan server tomonidan aniq ruxsatni talab qiladigan, maxsus sarlavhalarda ifodalangan.

## Xavfsiz so'rovlar

O'zaro kelib chiqish so'rovlarining ikki turi mavjud:

1. Xavfsiz so'rovlar.
2. Qolganlarning hammasi.

Xavfsiz so'rovlar qilish osonroq, shuning uchun ulardan boshlaylik.

Agar so'rov ikki shartga javob bersa, xavfsiz hisoblanadi:

1. [Safe method](https://fetch.spec.whatwg.org/#cors-safelisted-method): GET, POST yoki HEAD
2. [Safe headers](https://fetch.spec.whatwg.org/#cors-safelisted-request-header) -- ruxsat etilgan yagona sarlavhalar:
    - `Accept`,
    - `Accept-Language`,
    - `Content-Language`,
    - `application/x-www-form-urlencoded`, `multipart/form-data` yoki `matn/plain` qiymati bilan `Content-Type`.

Boshqa har qanday so'rov "xavfli" deb hisoblanadi. Masalan, `PUT` usuli yoki `API-Key` HTTP sarlavhali so'rov cheklovlarga mos kelmaydi.

**Muhim farq shundaki, xavfsiz so'rov hech qanday maxsus usullarsiz `<form>` yoki `<skript>` bilan amalga oshirilishi mumkin.**

Shunday qilib, hatto juda eski server ham xavfsiz so'rovni qabul qilishga tayyor bo'lishi kerak.

Buning aksincha, nostandart sarlavhali so'rovlar yoki h.k. `DELETE` usulini bu tarzda yaratib bo'lmaydi. Uzoq vaqt davomida JavaScript bunday so'rovlarni bajara olmadi. Shunday qilib, eski server bunday so'rovlar imtiyozli manbadan keladi deb taxmin qilishi mumkin, chunki "veb-sahifa ularni yubora olmaydi".

Xavfli so'rovni amalga oshirishga harakat qilganimizda, brauzer serverdan so'raladigan maxsus "preflight" so'rovini yuboradi -- u bunday o'zaro kelib chiqish so'rovlarini qabul qilishga rozimi yoki yo'qmi?

Va agar server sarlavhalar bilan xavfli so'rov yuborilmasligini aniq tasdiqlamasa, so'rov yuborilmaydi.

Endi biz tafsilotlarga o'tamiz.

## Xavfsiz so'rovlar uchun CORS

Agar so'rov o'zaro kelib chiqishli bo'lsa, brauzer har doim unga `Origin` sarlavhasini qo'shadi.

Misol uchun, agar biz `https://javascript.info/page` dan `https://anywhere.com/request` so'rasak, sarlavhalar quyidagicha ko'rinadi:

```http
GET /request
Host: anywhere.com
*!*
Origin: https://javascript.info
*/!*
...
```

Ko'rib turganingizdek, `Origin` sarlavhasi yo'lsiz aynan manbani (domen/protokol/port) o'z ichiga oladi.

Server `Origin` ni tekshirishi mumkin va agar u bunday so'rovni qabul qilishga rozi bo'lsa, javobga `Access-Control-Allow-Origin` maxsus sarlavhasini qo'shishi mumkin. Sarlavhada ruxsat etilgan manbaa (bizning holimizda `https://javascript.info`) yoki yulduzcha `*` bo'lishi kerak. Keyin javob muvaffaqiyatli bo'ladi, aks holda bu xato.

Brauzer bu yerda ishonchli vositachi rolini o'ynaydi:
1. O'zaro kelib chiqish so'rovi bilan to'g'ri `Origin` yuborilishini ta'minlaydi.
2. U javobda `Access-Control-Allow-Origin` ruxsatini tekshiradi, agar mavjud bo'lsa, JavaScriptga javobga kirishga ruxsat beriladi, aks holda xatolik bilan ishlamay qoladi.

![](xhr-another-domain.svg)

Mana ruxsat beruvchi server javobiga misol:
```http
200 OK
Content-Type:text/html; charset=UTF-8
*!*
Access-Control-Allow-Origin: https://javascript.info
*/!*
```

## Javob sarlavhalari

O'zaro kelib chiqish so'rovi uchun, sukut bo'yicha JavaScript faqat "xavfsiz" javob sarlavhalariga kirishi mumkin:

- `Cache-Control`
- `Content-Language`
- `Content-Length`
- `Content-Type`
- `Expires`
- `Last-Modified`
- `Pragma`

Boshqa har qanday javob sarlavhasiga kirish xatolikka olib keladi.

JavaScriptga boshqa har qanday javob sarlavhasiga kirish huquqini berish uchun server `Access-Control-Expose-Headers` sarlavhasini yuborishi kerak. Unda kirish mumkin bo'lishi kerak bo'lgan xavfli sarlavha nomlarining vergul bilan ajratilgan ro'yxati mavjud.

Masalan:

```http
200 OK
Content-Type:text/html; charset=UTF-8
Content-Length: 12345
Content-Encoding: gzip
API-Key: 2c9de507f2c54aa1
Access-Control-Allow-Origin: https://javascript.info
*!*
Access-Control-Expose-Headers: Content-Encoding,API-Key
*/!*
```

Bunday `Access-Control-Expose-Headers` sarlavhasi bilan skriptga javobning `Content-Encoding` va `API-Key` sarlavhalarini o'qishga ruxsat beriladi.

## "Xavfsiz" so'rovlar

Biz har qanday HTTP usulidan foydalanishimiz mumkin: nafaqat `GET/POST`, balki `PATCH`, `DELETE` va boshqalar.

Bir muncha vaqt oldin hech kim veb-sahifa bunday so'rovlarni amalga oshirishi mumkinligini tasavvur ham qila olmadi. Shunday qilib, nostandart usulni signal sifatida ko'radigan veb-xizmatlar hali ham mavjud bo'lishi mumkin: "Bu brauzer emas". Ular kirish huquqlarini tekshirishda buni hisobga olishlari mumkin.

Shunday qilib, tushunmovchiliklarga yo'l qo'ymaslik uchun har qanday "xavfsiz" so'rov -- eski vaqtlarda amalga oshirilmagan, brauzer darhol bunday so'rovlarni qilmaydi. Birinchidan, u ruxsat so'rash uchun dastlabki "parvozdan oldin" (preflight) so'rovini yuboradi.

Parvoz oldidan so'rovda `OPTIONS` usuli qo'llaniladi, asosiy va uchta sarlavhasiz:

- `Access-Control-Request-Method` sarlavhasida xavfli so'rov usuli mavjud.
- `Access-Control-Request-Headers` sarlavhasi xavfli HTTP sarlavhalarining vergul bilan ajratilgan ro'yxatini taqdim etadi.
- `Origin` sarlavhasi so'rov qayerdan kelganligini bildiradi. (masalan, `https://javascript.info`)

Agar server so'rovlarga xizmat ko'rsatishga rozi bo'lsa, u bo'sh tana, status 200 va sarlavhalar bilan javob berishi kerak:

- `Access-Control-Allow-Origin` ruxsat berish uchun `*` yoki so'ralayotgan manbaa bo'lishi kerak, masalan, `https://javascript.info`.
- `Access-Control-Allow-Methods` ruxsat etilgan usulga ega bo'lishi kerak.
- `Access-Control-Allow-Headers` ruxsat etilgan sarlavhalar ro'yxatiga ega bo'lishi kerak.
- Bundan tashqari, `Access-Control-Max-Age` sarlavhasi ruxsatlarni keshlash uchun bir necha soniyalarni belgilashi mumkin. Shunday qilib, brauzer berilgan ruxsatlarni qondiradigan keyingi so'rovlar uchun oldindan parvoz yuborishi shart emas.

![](xhr-preflight.svg)

Keling, o'zaro kelib chiqishi `PATCH` so'rovi misolida uning qanday ishlashini bosqichma-bosqich ko'rib chiqamiz (bu usul ko'pincha ma'lumotlarni yangilash uchun ishlatiladi):

```js
let response = await fetch('https://site.com/service.json', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'API-Key': 'secret'
  }
});
```

So'rov xavfli bo'lishining uchta sababi bor (bittasi yetarli):
- `PATCH` usuli
- `Content-Type` quyidagilardan biri emas: `application/x-www-form-urlencoded`, `multipart/form-data`, `matn/plain`.
- "Xavfsiz" `API-Key` sarlavhasi.

### 1-qadam (parvozdan oldin so'rovi)

Bunday so'rovni yuborishdan avval, brauzer o'z-o'zidan parvozdan oldin so'rov yuboradi, bu quyidagicha ko'rinadi:

```http
OPTIONS /service.json
Host: site.com
Origin: https://javascript.info
Access-Control-Request-Method: PATCH
Access-Control-Request-Headers: Content-Type,API-Key
```

- Usul: `OPTIONS`.
- Yo'l -- aynan asosiy so'rov bilan bir xil: `/service.json`.
- Oʻzaro kelib chiqish maxsus sarlavhalari:
     - `Origin` -- manba kelib chiqishi.
     - `Access-Control-Request-Method` -- so'ralgan usul.
     - `Access-Control-Request-Headers` -- vergul bilan ajratilgan "xavfli" sarlavhalar ro'yxati.

### 2-qadam (parvoz oldidan javob)

Server 200 holati va sarlavhalari bilan javob berishi kerak:
- `Access-Control-Allow-Origin: https://javascript.info`
- `Access-Control-Allow-Methods: PATCH`
- `Access-Control-Allow-Headers: Content-Type,API-Key`.

Bu kelajakda muloqot qilish imkonini beradi, aks holda xatolik yuzaga keladi.

Agar server kelajakda boshqa usullar va sarlavhalarni kutsa, ularni ro'yxatga qo'shish orqali oldindan ruxsat berish mantiqan to'g'ri.

Masalan, bu javob `PUT`, `DELETE` va qo'shimcha sarlavhalarga ham ruxsat beradi:

```http
200 OK
Access-Control-Allow-Origin: https://javascript.info
Access-Control-Allow-Methods: PUT,PATCH,DELETE
Access-Control-Allow-Headers: API-Key,Content-Type,If-Modified-Since,Cache-Control
Access-Control-Max-Age: 86400
```

Endi brauzer `PATCH` `Access-Control-Allow-Methods` va `Content-Type,API-Key` `Access-Control-Allow-Headers` ro'yxatida ekanligini ko'rishi mumkin, shuning uchun u asosiy ma'lumotlarni yuboradi.

Agar bir necha soniyali `Access-Control-Max-Age` sarlavhasi bo'lsa, u holda parvozdan oldingi ruxsatnomalar berilgan vaqt uchun keshlanadi. Yuqoridagi javob 86400 soniya davomida keshlanadi (bir kun). Ushbu vaqt oralig'ida keyingi so'rovlar oldindan parvozga sabab bo'lmaydi. Ular keshlangan nafaqalarga mos deb faraz qilsak, ular to'g'ridan-to'g'ri yuboriladi.

### 3-qadam (haqiqiy so'rov)

Preflight muvaffaqiyatli bo'lsa, brauzer endi asosiy so'rovni amalga oshiradi. Bu erda jarayon xavfsiz so'rovlar bilan bir xil.

Asosiy so'rov `Origin` sarlavhasiga ega (chunki u o'zaro kelib chiqishli sarlavha):

```http
PATCH /service.json
Host: site.com
Content-Type: application/json
API-Key: secret
Origin: https://javascript.info
```

### 4-qadam (haqiqiy javob)

Server asosiy javobga `Access-Control-Allow-Origin` qo'shishni unutmasligi kerak. Muvaffaqiyatli oldindan parvoz bundan xalos qilmaydi:

```http
Access-Control-Allow-Origin: https://javascript.info
```

Keyin JavaScript asosiy server javobini o'qiy oladi.

```smart
Parvoz oldidan so'rov "sahna ortida" sodir bo'ladi, u JavaScriptga ko'rinmaydi.

JavaScript faqat asosiy so'rovga javob oladi yoki server ruxsati bo'lmasa, xatolik yuz beradi.
```

## Hisob ma'lumotlari

Sukut bo'yicha JavaScript kodi bilan boshlangan o'zaro kelib chiqish so'rovi hech qanday hisob ma'lumotlarini (cookie fayllari yoki HTTP autentifikatsiyasi) olib kelmaydi.

Bu HTTP so'rovlari uchun odatiy holdir. Odatda, `http://site.com` so'roviga ushbu domendagi barcha cookie-fayllar hamroh bo'ladi. Boshqa tomondan, JavaScript usullari bilan qilingan o'zaro kelib chiqish so'rovlari bundan mustasno.

Masalan, `fetch('http://another.com')` hech qanday cookie-fayllarni, hatto ` another.com` domeniga tegishli (!) fayllarni yubormaydi.

Nega?

Buning sababi, hisob ma'lumotlari bo'lgan so'rov ularsiz so'rovlarga qaraganda ancha kuchli. Agar ruxsat berilsa, u JavaScriptga foydalanuvchi nomidan harakat qilish va uning hisob ma'lumotlaridan foydalangan holda maxfiy ma'lumotlarga kirish huquqini beradi.

Server haqiqatan ham skriptga shunchalik ishonadimi? Keyin qo'shimcha sarlavhali hisobga olish ma'lumotlari bilan so'rovlarga aniq ruxsat berishi kerak.

Hisob ma'lumotlarini `fetch` da yuborish uchun `credentials: "include"` opsiyasini qo'shishimiz kerak, masalan:

```js
fetch('http://another.com', {
  credentials: "include"
});
```

Endi `fetch` o'sha saytga so'rov bilan `ather.com` saytidan olingan cookie-fayllarni yuboradi.

Agar server *hisob ma'lumotlari bilan* so'rovni qabul qilishga rozi bo'lsa, u javobga `Access-Control-Allow-Origin` dan tashqari `Access-Control-Allow-Credentials: true` sarlavhasini qo'shishi kerak.

Masalan:

```http
200 OK
Access-Control-Allow-Origin: https://javascript.info
Access-Control-Allow-Credentials: true
```

Esda tuting: `Access-Control-Allow-Origin` hisob ma'lumotlari bilan so'rovlar uchun yulduzcha `*` qo'llash ta'qiqlangan. Yuqorida ko'rsatilganidek, u yerda aniq kelib chiqishini ta'minlashi kerak. Bu qo'shimcha xavfsizlik chorasi bo'lib, server bunday so'rovlarni kimga topshirishini bilishini ta'minlaydi.

## Xulosa

Brauzer nuqtai nazaridan, o'zaro kelib chiqish so'rovlarining ikki turi mavjud: "xavfsiz" va boshqalar.

"Xavfsiz" so'rovlar quyidagi shartlarga javob berishi kerak:
- Usul: GET, POST yoki HEAD.
- Sarlavhalar -- biz faqat:
    - `Accept`
    - `Accept-Language`
    - `Content-Language`
    - `Content-Type` - `application/x-www-form-urlencoded`, `multipart/form-data` yoki `matn/plain` qiymati.

Muhim farq shundaki, xavfsiz so'rovlar qadim zamonlardan buyon `<form>` yoki `<script>` teglari yordamida amalga oshirilar edi, ammo uzoq vaqt davomida brauzerlar uchun xavfsiz so'rovlar imkonsiz edi.

Shunday qilib, amaliy farq shundaki, xavfsiz so'rovlar `Origin` sarlavhasi bilan darhol yuboriladi, qolganlari uchun brauzer ruxsat so'rab, "oldindan parvoz" so'rovini beradi.

**Xavfsiz so'rovlar uchun:**

- → Brauzer `Origin` sarlavhasini kelib chiqishi bilan yuboradi.
- ← Hisob ma'lumotlari bo'lmagan so'rovlar uchun (sukut bo'yicha yuborilmaydi), server quyidagilarni o'rnatishi kerak:
     - `*` ga kirish-nazorat-ruxsat berish-kelib chiqishi yoki `Origin` bilan bir xil qiymat
- ← Hisob ma'lumotlari bo'lgan so'rovlar uchun server quyidagilarni o'rnatishi kerak:
     - `Origin` bilan bir xil qiymatga `Access-Control-Allow-Origin`
     - `Access-Control-Allow-Credentials` dan `true` ga

Bundan tashqari, JavaScriptga `Cache-Control`, `Content-Language`, `Content-Type`, `Expires`, `Last-Modified` yoki `Pragma` dan tashqari har qanday javob sarlavhalariga ruxsat berish uchun server ruxsat etilganlar ro'yxatini `Access-Control-Expose-Headers` sarlavhasida ko'rsatishi kerak. 

**Xavfsiz so'rovlar uchun so'ralgandan oldin dastlabki "preflight" so'rovi beriladi:**

- → Brauzer sarlavhalari bilan bir xil URL manziliga `OPTIONS` so'rovini yuboradi:
     - `Access-Control-Request-Method` so'ragan usul.
     - `Access-Control-Request-Headers` xavfli so'ralgan sarlavhalarni ro'yxatga oladi.
- ← Server 200 holati va sarlavhalari bilan javob berishi kerak:
     - Ruxsat etilgan usullar ro'yxati bilan `Access-Control-Allow-Methods`;
     - Ruxsat etilgan sarlavhalar ro'yxati bilan `Access-Control-Allow-Headers`,
     - Ruxsatlarni keshlash uchun bir necha soniya bilan `Access-Control-Max-Age`.
- Keyin haqiqiy so'rov yuboriladi va oldingi "xavfsiz" sxema qo'llaniladi.
