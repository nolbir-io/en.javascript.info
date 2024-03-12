# Cookie-fayllar, document.cookie

Cookie-fayllar to'g'ridan-to'g'ri brauzerda saqlanadigan kichik ma'lumotlar qatoridir. Ular [RFC 6265](https://tools.ietf.org/html/rfc6265) spetsifikatsiyasi bilan belgilangan HTTP protokolining bir qismidir.

Cookie-fayllar odatda veb-server tomonidan `Set-Cookie` HTTP sarlavhasi yordamida o'rnatiladi. Keyin brauzer ularni avtomatik ravishda `Cookie` HTTP sarlavhasi yordamida bir xil domenga (deyarli) har bir so'rovga qo'shadi.

Eng keng tarqalgan foydalanish holatlaridan biri autentifikatsiya hisoblanadi:

1. Tizimga kirgandan so'ng server noyob "sessiya identifikatori" bilan cookie faylini o'rnatish uchun javobda `Set-Cookie` HTTP sarlavhasidan foydalanadi.
2. Keyingi safar so'rov xuddi shu domenga yuborilganda, brauzer `Cookie` HTTP sarlavhasi yordamida cookie-faylni tarmoq orqali yuboradi.
3. Shunday qilib, server so'rovni kim qilganligini biladi.

Shuningdek, biz `document.cookie` xususiyatidan foydalanib, brauzerdan cookie-fayllarga kirishimiz mumkin.

Cookie fayllari va ularning variantlari haqida juda ko'p qiyin narsalar mavjud. Ushbu bobda biz ularni batafsil ko'rib chiqamiz.

## document.cookie dan o'qish

```online
Brauzeringiz ushbu saytdan cookie-fayllarni saqlaydimi? Ko'raylikchi:
```

```offline
Agar veb-saytda bo'lsangiz, undan cookie-fayllarni ko'rish mumkin, masalan:
```

```js run
// javascript.info saytida biz statistika uchun Google Analyticsdan foydalanamiz,
// shuning uchun ba'zi cookie fayllari bo'lishi kerak
alert( document.cookie ); // cookie1=value1; cookie2=value2;...
```

`document.cookie` qiymati `;` bilan chegaralangan `name=value` juftliklaridan iborat; Ularning har biri alohida cookie-fayl.

Muayyan cookie-faylni topish uchun biz `document.cookie` ni `;` ga bo'lishimiz va keyin kerakli ismni topishimiz mumkin. Buning uchun oddiy ifoda yoki massiv funksiyalaridan foydalanamiz.

Biz buni o'quvchi uchun mashq sifatida qoldiramiz. Shuningdek, bobning oxirida siz cookie-fayllarni boshqarish uchun yordamchi funksiyalarni topasiz.

## document.cookie ga yozish

Biz `document.cookie` ga yozishimiz mumkin. Lekin bu ma'lumotlar xususiyati emas, bu [accessor (getter/setter)](info:property-accessors) hisoblanadi.  Unga topshiriq alohida ko'rib chiqiladi.

**Document.cookie-ga yozish operatsiyasi faqat unda qayd etilgan cookie-fayllarni yangilaydi, lekin boshqa cookie-fayllarga tegmaydi.**

Masalan, bu qo'ng'iroq `user` nomi va `John` qiymatiga ega cookie faylini o'rnatadi:

```js run
document.cookie = "user=John"; // faqat 'user' deb nomlangan cookie-fayllarni yangilash
alert(document.cookie); // hamma cookie-fayllarni ko'rsatish
```

Agar siz uni ishga tushirsangiz, ehtimol siz bir nechta cookie-fayllarni ko'rasiz. Buning sababi, `document.cookie=` operatsiyasi barcha cookie-fayllarni qayta yozmaydi. U faqat aytib o'tilgan `user` cookie-faylini o'rnatadi.

Texnik jihatdan, nom va qiymat har qanday belgilarga ega bo'lishi mumkin. To'g'ri formatlashni saqlab qolish uchun ular o'rnatilgan `encodeURIComponent` funksiyasi yordamida o'chirilishi kerak:

```js run
// maxsus belgilar (bo'shliqlar), kodlash kerak
let name = "my name";
let value = "John Smith"

// cookie-faylni my%20name=John%20Smith sifatida kodlaydi
document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

alert(document.cookie); // ...; my%20name=John%20Smith
```


```warn header="Cheklovlar"
Bir nechta cheklovlar mavjud:
- `encodeURIComponent`dan keyin `name=value` juftligi 4KB dan oshmasligi kerak. Shunday qilib, biz cookie faylida katta narsalarni saqlay olmaymiz.
- Domen uchun cookie-fayllarning umumiy soni 20+ atrofida cheklangan, aniq chegara brauzerga bog'liq.
```

Cookie-fayllar bir nechta variantga ega, ularning ko'plari muhim va o'rnatilishi kerak.

Variantlar `key=value` dan keyin, `;` bilan chegaralangan, quyidagicha keltirilgan:

```js run
document.cookie = "user=John; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT"
```

## yo'lak (path)

- **`path=/mypath`**

URL yo'li prefiksi mutlaq bo'lishi kerak. Bu cookie-faylni ushbu yo'l ostidagi sahifalar uchun ochiq qiladi. Odatda u joriy yo'l hisoblanadi.

Agar cookie `path=/admin` bilan o'rnatilgan bo'lsa, u `/admin` va `/admin/something` sahifalarida ko'rinadi, lekin `/home` yoki `/adminpage` sahifalarida ko`rinmaydi.

Odatda, biz barcha veb-sayt sahifalarida cookie-fayllardan foydalanish mumkin bo'lishi uchun ildizga `path` qo'yishimiz kerak: `path=/`.

## domain

- **`domain=site.com`**

Domen cookie-faylga kirish mumkin bo'lgan joyni belgilaydi. Amalda esa, cheklovlar mavjud. Biz hech qanday domenni o'rnata olmaymiz.

**Boshqa 2-darajali domendan cookie-fayllardan foydalanishga ruxsat berishning iloji yo'q, shuning uchun `other.com` hech qachon `site.com` manzilidagi cookie-fayllarni olmaydi.**

Bu xavfsizlik cheklovi bo'lib, maxfiy ma'lumotlarni faqat bitta saytda mavjud bo'lishi kerak bo'lgan cookie-fayllarda saqlashimizga imkon beradi. 

Odatda cookie fayliga faqat uni o'rnatgan domenda kirish mumkin.

Esda tutingki, sukut bo'yicha cookie ham `forum.site.com` kabi subdomenga ham ulashilmaydi. 

```js
// Agar biz site.com veb-saytida cookie faylini o'rnatsak...
document.cookie = "user=John"

//...biz uni forum.site.com saytida ko'rmaymiz
alert(document.cookie); // user mavjud emas
```

...Lekin buni o'zgartirsa bo'ladi. Agar biz `forum.site.com` kabi subdomenlarga `site.com` da cookie-fayllar to'plamini olishga ruxsat bermoqchi bo'lsak, bu mumkin.

Buning uchun `site.com` da cookie-faylni o'rnatishda biz `domen` opsiyasini ildiz domeniga aniq belgilashimiz kerak: `domain=site.com`. Keyin barcha subdomenlar bunday cookie-fayllarni ko'radi.

Masalan:

```js
// site.com da
// cookie-faylni istalgan subdomenda foydalanish mumkin bo'lsin *.site.com:
document.cookie = "user=John; *!*domain=site.com*/!*"

// keyinroq

// forum.site.com da
alert(document.cookie); // cookie-fayl foydalanuvchisi mavjud=John
```

Tarixiy sabablarga ko'ra, `domain=.site.com` (`site.com` oldidan nuqta bilan) ham xuddi shunday ishlaydi va subdomenlardan cookie-fayllarga kirish imkonini beradi. Bu eski belgi va agar biz juda eski brauzerlarni qo'llab-quvvatlashimiz kerak bo'lsa, foydalanishimiz kerak.

Xulosa qilib aytadigan bo'lsak, `domen` opsiyasi cookie-fayllarni subdomenlarda foydalanish imkonini beradi.

## muddati tugashi, maksimal yosh

Odatda cookie faylida ushbu variantlardan biri bo'lmasa, u brauzer yopilganda yo'qoladi. Bunday cookie-fayllar "sessiya kukilari" deb ataladi.

Brauzer yopilganda cookie fayllari saqlanib qolishi uchun biz `expires` yoki `max-age` parametrlarini o'rnatishimiz mumkin.

- **`expires=Tue, 19 Jan 2038 03:14:07 GMT`**

Cookie-faylning amal qilish muddati brauzer uni avtomatik ravishda o'chirish vaqtini belgilaydi.

Sana aynan shu formatda, GMT vaqt mintaqasida bo'lishi kerak. Uni olish uchun `date.toUTCString` dan foydalanishimiz mumkin. Masalan, biz cookie-faylni 1 kun ichida tugaydigan qilib sozlaymiz:

```js
// +1 kundan keyin
let date = new Date(Date.now() + 86400e3);
date = date.toUTCString();
document.cookie = "user=John; expires=" + date;
```

Agar `expires` ni o'tmishdagi sanaga qo'ysak, cookie fayli o'chiriladi.

-  **`max-age=3600`**

Bu `expires` ga muqobil bo'lib, cookie-faylning amal qilish muddatini hozirgi paytdan boshlab bir necha soniya ichida belgilaydi.

Agar nolga yoki manfiy qiymatga o'rnatilgan bo'lsa, cookie o'chiriladi:

```js
// cookie +1 soatdan keyin o'ladi
document.cookie = "user=John; max-age=3600";

// cookie-faylni o'chirish (uning amal qilish muddati tugashiga ruxsat bering)
document.cookie = "user=John; max-age=0";
```

## xavfsiz (secure)

- **`secure`**

Cookie faqat HTTPS orqali uzatilishi kerak.

**Sukut bo'yicha, agar biz `http://site.com` manzilida cookie-fayl o'rnatgan bo'lsak, u `https://site.com` manzilida ham paydo bo'ladi va aksincha.**

Ya'ni, cookie-fayllar domenga asoslangan, ular protokollarni farqlamaydi.

Ushbu parametr bilan, agar cookie `https://site.com` tomonidan o'rnatilgan bo'lsa, u xuddi shu saytga HTTP orqali kirganda, `http://site.com` kabi ko'rinmaydi. Shunday qilib, agar cookie-faylda hech qachon shifrlanmagan HTTP orqali yuborilmasligi kerak bo'lgan maxfiy kontent bo'lsa, `secure` bayrog'i to'g'ri bo'ladi.

```js
// agar biz hozir https:// damiz
// cookie-faylni xavfsiz qilib belgilang (faqat HTTPS orqali kirish mumkin)
document.cookie = "user=John; secure";
```

## samesite (xuddi shu sayt)

Bu boshqa xavfsizlik atributi `samesite`. U XSRF (saytlararo so'rovlarni soxtalashtirish) hujumlaridan himoya qilish uchun mo'ljallangan.

Uning qanday ishlashini va qachon foydali ekanligini tushunish uchun XSRF hujumlarini ko'rib chiqamiz.

### XSRF hujumi

Tasavvur qiling, siz `bank.com` saytiga kirgansiz. Ya'ni: sizda o'sha saytdan autentifikatsiya kuki mavjud. Brauzeringiz sizni har bir so'rov bilan `bank.com` saytiga yuboradi, shunda u sizni taniydi va barcha muhim moliyaviy operatsiyalarni bajaradi.

Endi, boshqa oynada internetni ko'rib chiqayotganingizda, siz tasodifan boshqa `evil.com` saytiga kirasiz. Bu saytda xakerning hisobiga tranzaksiyani boshlaydigan maydonlar bilan `<form action="https://bank.com/pay">` shaklini `bank.com` saytiga yuboradigan JavaScript kodi mavjud.

Brauzer siz `bank.com` saytiga har safar tashrif buyurganingizda, hatto forma `evil.com` dan yuborilgan bo'lsa ham cookie fayllarini yuboradi. Shunday qilib, bank sizni tan oladi va to'lovni amalga oshiradi.

![](cookie-xsrf.svg)

Bu "Saytlararo so'rovni soxtalashtirish" (qisqasi, XSRF) hujumi.

Haqiqiy banklar, albatta, undan himoyalangan. `bank.com` tomonidan yaratilgan barcha shakllar "XSRF himoya tokeni" deb ataladigan maxsus maydonga ega bo'lib, yomon sahifa uzoq sahifani yarata olmaydi yoki undan chiqara olmaydi. U yerda shaklni yuborishi mumkin, lekin ma'lumotlarni qaytarib ololmaydi. `bank.com` sayti bunday tokenni olgan har bir shaklda tekshiradi.

Bunday himoyani amalga oshirish uchun vaqt talab etiladi. Biz har bir shaklda kerakli token maydoni mavjudligiga ishonch hosil qilishimiz kerak, shuningdek, barcha so'rovlarni tekshirishimiz lozim.

### Cookie bir xil sayt variantini kiriting

Cookie `samesite` opsiyasi bunday hujumlardan himoyalanishning yana bir usulini taqdim etadi, bu (nazariy jihatdan) "xsrf himoya tokenlari" ni talab qilmasligi kerak.

U ikkita mumkin bo'lgan qiymatga ega:

- **`samesite=strict` (qiymatsiz `samesite` bilan bir xil)**

Agar foydalanuvchi bitta saytdan tashqaridan kelgan bo'lsa, `samesite=strict` bo'lgan cookie hech qachon yuborilmaydi.

Boshqacha qilib aytadigan bo'lsak, foydalanuvchi o'z pochtasidagi havolaga amal qiladi, `evil.com` dan shaklni yuboradi yoki boshqa domendan kelib chiqadigan har qanday operatsiyani bajaradi va cookie yuborilmaydi.

Agar autentifikatsiya cookie-fayllarida `samesite` opsiyasi mavjud bo'lsa, XSRF hujumining muvaffaqiyatli bo'lish imkoniyati yo'q, chunki `evil.com` dan jo'natish cookie-fayllarsiz keladi. Shunday qilib, `bank.com` foydalanuvchini tanimaydi va to'lovni davom ettirmaydi.

Himoya juda ishonchli. Faqat `bank.com` dan kelgan operatsiyalar `samesite` cookie faylini yuboradi, masalan, `bank.com` saytidagi boshqa sahifadan ariza yuborish.

Biroz kichik noqulaylik bor.

Agar foydalanuvchi o'z qaydlaridagi kabi `bank.com` ga qonuniy havolani kuzatsa, `bank.com` ularni tanimasligidan hayratda qoladi. Darhaqiqat, bu holda `samesite=strict` cookie fayllari yuborilmaydi.

Biz ikkita cookie-fayldan foydalanishimiz mumkin: biri "umumiy tan olish" uchun, faqat "Hello, John" deyish uchun, ikkinchisi esa `samesite=strict` bilan ma'lumotlarni o'zgartirish operatsiyalari uchun. Shundan so'ng, saytdan tashqaridan kelgan odam xush kelibsiz degan xabarni ko'radi, lekin ikkinchi cookie yuborilishi uchun to'lovlar bank veb-saytidan boshlanishi kerak.

- **`samesite=lax`**

XSRF dan himoya qiluvchi va foydalanuvchi tajribasini buzmaydigan yanada qulayroq yondashuv.

Lax rejimi, xuddi `strict` kabi, brauzerga saytdan tashqaridan kelganida cookie-fayllarni yuborishni ta'qiqlaydi, lekin istisno qo'shadi.

Agar ikkala shart ham to'g'ri bo'lsa, `samesite=lax` cookie fayli yuboriladi:
1. HTTP usuli "xavfsiz" (masalan, GET, lekin POST emas).

    Xavfsiz HTTP usullarining to'liq ro'yxati [RFC7231 specification](https://tools.ietf.org/html/rfc7231) da mavjud. Asosan, bu o'qish uchun ishlatilishi kerak bo'lgan usullar, ammo ma'lumotlarni yozish uchun emas. Ular ma'lumotlarni o'zgartirish operatsiyalarini bajarmasligi kerak. Havolani kuzatib borish har doim GET, xavfsiz usuldir.

2. Amaliyot yuqori darajadagi navigatsiyani amalga oshiradi (brauzer manzil satrida URL manzilini o'zgartiradi).
    
    Bu odatda to'g'ri, lekin agar navigatsiya `<iframe>` da amalga oshirilsa, u yuqori darajali emas. Bundan tashqari, tarmoq so'rovlari uchun JavaScript usullari hech qanday navigatsiyani amalga oshirmaydi, shuning uchun ular mos kelmaydi.

Shunday qilib, `samesite=lax` bajaradigan vazifa asosan eng keng tarqalgan "URL-ga o'tish" operatsiyasida cookie-fayllarga ega bo'lishga ruxsat berishdir. Masalan, ushbu shartlarni qondiradigan eslatmalardan veb-sayt havolasini ochish ham uning ishi.

Biroq, boshqa saytdan tarmoq so'rovi yoki ariza yuborish kabi murakkabroq narsa cookie fayllarini yo'qotadi.

Agar bu sizga ma'qul bo'lsa, `samesite=lax` qo'shilishi ehtimol foydalanuvchi tajribasini buzmaydi va himoya qo'shmaydi.

Umuman olganda, `samesite` - bu ajoyib variant.

Bir nechta kamchiliklar bor:

- `samesite` juda eski brauzerlar tomonidan e'tiborga olinmaydi (qo'llab-quvvatlanmaydi), masalan, 2017-yilgi yoki shunga o'xshash.

**Shunday qilib, agar biz himoya qilish uchun faqat `samesite` ga tayansak, eski brauzerlar himoyasiz bo'ladi.**

Ammo biz `samesite` dan xsrf tokenlari kabi boshqa himoya choralari bilan birgalikda qo'shimcha mudofaa qatlamini qo'shish uchun foydalanishimiz va kelajakda eski brauzerlar o'chib qolsa, biz xsrf tokenlarini tashlab qo'yishimiz mumkin.

## httpOnly

Ushbu parametrning JavaScriptga hech qanday aloqasi yo'q, ammo to'liqlik uchun uni eslatib o'tishimiz kerak.

Veb-server cookie faylini o'rnatish uchun `Set-Cookie` sarlavhasidan foydalanadi. Bundan tashqari, u `httpOnly` opsiyasini o'rnatishi mumkin.

Ushbu parametr cookie-fayllarga JavaScriptga kirishni ta'qiqlaydi. Biz bunday cookie-faylni ko'ra olmaymiz yoki `document.cookie` yordamida uni boshqara olmaymiz.

Bu hacker sahifaga o'zining JavaScript kodini kiritganida va foydalanuvchi o'sha sahifaga kirishini kutayotganda ma'lum hujumlardan himoya qilish uchun ehtiyot chorasi sifatida ishlatiladi. Bu umuman bo'lmasligi kerak, xakerlar o'z kodlarini bizning saytimizga kirita olmasligi lozim, lekin buni amalga oshirishga imkon beradigan xatolar bo'lishi mumkin.

Odatda shunday holat yuz bersa va foydalanuvchi xakerning JavaScript kodi bo'lgan veb-sahifaga kirsa, u holda bu kod bajariladi va autentifikatsiya ma'lumotlarini o'z ichiga olgan foydalanuvchi cookie-fayllari bilan `document.cookie` ga kirish huquqiga ega bo'ladi. Bu juda yomon holat.

Lekin cookie `httpOnly` bo'lsa, `document.cookie` uni ko'rmaydi, shuning uchun u himoyalangan.

## Ilova: Cookie funksiyalari

Bu yerda cookie-fayllar bilan ishlash uchun kichik funksiyalar to'plami, `document.cookie` ni qo'lda o'zgartirishdan ko'ra qulayroq.

Buning uchun ko'plab cookie kutubxonalari mavjud, shuning uchun ular demo maqsadlarda foydalaniladi. To'liq ishlatilmaydi.

### getCookie(name)

Cookie-fayllarga kirishning eng qisqa yo'li [regular expression](info:regular-expressions) dan foydalanishdir.

`getCookie(name)` funksiyasi berilgan `name` bilan cookie-faylni qaytaradi:

```js
// berilgan nom bilan cookie faylini qaytaradi,
// yoki topilmasa, undefined ni qaytaradi
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
```

Bu yerda `new RegExp` dinamik tarzda yaratiladi, `; name=<value>` ga mos keladi.

Esda tutingki, cookie qiymati kodlangan, shuning uchun `getCookie` uni dekodlash uchun o'rnatilgan `decodeURIComponent` funksiyasidan foydalanadi.

### setCookie(nom, qiymat, variantlar)

Cookie faylining nomini sukut bo'yicha `path=/` bilan berilgan `value` ga o'rnatadi (boshqa birlamchi parametrlarni qo'shish uchun o'zgartirilishi mumkin):

```js run
function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    // agar kerak bo'lsa, bu yerda boshqa standart sozlamalarni qo'shing
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

// Foydalanish namunasi:
setCookie('user', 'John', {secure: true, 'max-age': 3600});
```

### deleteCookie(name)

Cookie-faylni o'chirish uchun biz uni salbiy amal qilish muddati bilan chaqirishimiz mumkin:

```js
function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}
```

```warn header="Yangilash yoki o'chirishda bir xil yo'l va domendan foydalanish kerak"

Iltimos, diqqat qiling: biz cookie-faylni yangilaganimizda yoki o'chirganimizda, biz uni o'rnatganimizdek aynan bir xil yo'l va domen opsiyalaridan foydalanishimiz kerak.
```

Vazifa [cookie.js](cookie.js) bilan birga bajariladi.


## Ilova: Uchinchi tomon cookie fayllari

Agar cookie foydalanuvchi tashrif buyurayotgan sahifadan boshqa domen tomonidan joylashtirilgan bo'lsa, u "uchinchi tomon" deb ataladi.

Masalan:
1. `site.com` sahifasi boshqa saytdan bannerni yuklaydi: `<img src="https://ads.com/banner.png">`.
2. Banner bilan birga `ads.com` dagi masofaviy server `id=1234` kabi cookie fayli bilan `Set-Cookie` sarlavhasini o'rnatishi mumkin. Bunday cookie `ads.com` domenidan kelib chiqadi va faqat `ads.com` da ko'rinadi:

    ![](cookie-third-party.svg)

3. Keyingi safar `ads.com` saytiga kirishda masofaviy server `id` cookie-faylini oladi va foydalanuvchini taniydi:

    ![](cookie-third-party-2.svg)

4. Bundan ham muhimi shundaki, foydalanuvchi `site.com` dan boshqa `other.com` saytiga o'tganda, u ham bannerga ega bo'lsa, `ads.com` cookie faylini oladi, chunki u `ads.com` ga tegishli. Shunday qilib, tashrif buyuruvchini tanib, saytlar orasida harakatlanayotganda uni kuzatib boradi:

    ![](cookie-third-party-3.svg)


Uchinchi tomon cookie fayllari tabiatiga ko'ra an'anaviy ravishda kuzatish va reklama xizmatlari uchun ishlatiladi. Ular boshlang'ich domenga bog'langan, shuning uchun `ads.com` bir xil foydalanuvchini turli saytlar orasida kuzatishi mumkin, agar ularning barchasi unga kirsa.

Tabiiyki, ba'zi odamlar kuzatuvni yoqtirmaydi, shuning uchun brauzerlar bunday cookie-fayllarni o'chirishga imkon beradi.

Bundan tashqari, ba'zi zamonaviy brauzerlar bunday cookie-fayllar uchun maxsus siyosatlardan foydalanadilar:
- Safari uchinchi tomon cookie fayllariga umuman ruxsat bermaydi.
- Firefox uchinchi tomon domenlarining "qora ro'yxati" bilan birga keladi, u yerda uchinchi tomon cookie fayllarini bloklaydi.


```smart
Agar biz skriptni `<script src="https://google-analytics.com/analytics.js">` kabi uchinchi tomon domenidan yuklasak va bu skript cookie faylini o'rnatish uchun `document.cookie` dan foydalansa, unda bunday cookie uchinchi tomon emas.

Agar skript cookie-faylni o'rnatgan bo'lsa, skript qayerdan kelganidan qat'iy nazar, cookie joriy veb-sahifaning domeniga tegishli.
```

## Ilova: GDPR

Bu mavzu JavaScriptga umuman aloqador emas, faqat cookie-fayllarni o'rnatishda yodda tutish kerak bo'lgan narsa.

Yevropada GDPR deb nomlangan qonun mavjud bo'lib, u veb-saytlar uchun foydalanuvchilarning maxfiyligini hurmat qilish uchun bir qator qoidalarni amalga oshiradi. Ushbu qoidalardan biri foydalanuvchidan cookie-fayllarni kuzatish uchun aniq ruxsatni talab qilishdir.

E'tibor bering, bu faqat cookie-fayllarni kuzatish/identifikatsiya qilish/avtorizatsiya qilish haqida.

Shunday qilib, agar biz ba'zi ma'lumotlarni saqlaydigan, lekin foydalanuvchini kuzatmaydigan yoki identifikatsiya qilmaydigan cookie faylini o'rnatgan bo'lsak, biz buni qilishimiz mumkin.

Ammo agar biz autentifikatsiya seansi yoki kuzatuv identifikatori bilan cookie faylini o'rnatmoqchi bo'lsak, foydalanuvchi bunga ruxsat berishi kerak.

Veb-saytlar odatda GDPRga rioya qilishning ikkita variantiga ega. Siz ikkalasini ham internetda ko'rgan bo'lsangiz kerak:

1. Agar veb-sayt faqat autentifikatsiya qilingan foydalanuvchilar uchun kuzatuv cookie-fayllarini o'rnatmoqchi bo'lsa.

    Buning uchun ro'yxatdan o'tish formasida "maxfiylik siyosatini qabul qilish" (bu cookie-fayllardan qanday foydalanilishini tavsiflaydi) kabi katakchaga ega bo'lishi, foydalanuvchi uni tekshirishi kerak, keyin veb-sayt autentlik cookie-fayllarini o'rnatishi mumkin.

2. Agar veb-sayt hamma uchun kuzatuv cookie-fayllarini o'rnatmoqchi bo'lsa.

    Buni qonuniy ravishda amalga oshirish uchun veb-sayt yangi kelganlar uchun modal "splash screen"ni ko'rsatadi va ulardan cookie-fayllarga rozi bo'lishlarini talab qiladi. Keyin veb-sayt ularni o'rnatishi va odamlarga tarkibni ko'rishiga imkon berishi mumkin. Bu yangi tashrif buyuruvchilarni bezovta qilishi mumkin. Hech kim kontent o'rniga bunday "must-click" modal ekranlarni ko'rishni yoqtirmaydi. Ammo GDPR aniq kelishuvni talab qiladi.

GDPR nafaqat cookie-fayllar, balki boshqa maxfiylik borasidagi muammolar bilan ham bog'liq, lekin bu bizning doiramizda emas.

## Xulosa

`document.cookie` cookie-fayllarga kirish imkonini beradi.
- Yozish operatsiyalari faqat unda ko'rsatilgan cookie-fayllarni o'zgartiradi.
- Ism/qiymat kodlangan bo'lishi kerak.
- Bitta cookie fayl hajmi 4KB dan oshmasligi kerak. Domenda ruxsat etilgan cookie-fayllar soni 20+ atrofida (brauzerga qarab farq qiladi).

Cookie opsiyalari:
- `path=/`, sukut bo'yicha joriy yo'l, cookie-faylni faqat shu yo'l ostida ko'rinadigan qiladi.
- `domain=site.com`, sukut bo'yicha cookie faqat joriy domenda ko'rinadi. Agar domen aniq o'rnatilgan bo'lsa, cookie subdomenlarda ko'rinadi.
- `expires` yoki `max-age` cookie-faylning amal qilish muddatini belgilaydi. Brauzer yopilganda, ularsiz cookie o'ladi.
- `secure` cookie faylini faqat HTTPSga aylantiradi.
- `samesite` brauzerga cookie-fayllarni saytdan tashqaridan kelgan so'rovlar bilan yuborishni taqiqlaydi. Bu XSRF hujumlarining oldini olishga yordam beradi.

Qo'shimcha:
- Uchinchi tomon cookie fayllari brauzer tomonidan ta'qiqlangan bo'lishi mumkin, masalan, Safari buni sukut bo'yicha bajaradi.
- Yevropa Ittifoqi fuqarolari uchun kuzatuv cookie faylini o'rnatishda GDPR ruxsat so'rashni talab qiladi.
