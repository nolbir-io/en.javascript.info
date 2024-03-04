# Popup lar va window usullari

Popup window - foydalanuvchiga qo'shimcha hujjat ko'rsatishning eski usullaridan biri.

Asosan, siz shunchaki quyidagi narsadan foydalanasiz:
```js
window.open('https://javascript.info/')
```

...Va u berilgan URL bilan yangi oyna ochadi. Ko'pgina zamonaviy brauzerlar alohida oynalar o'rniga yangi yorliqlarda url ochish uchun tuzilgan.

Popup lar haqiqatan ham qadim zamonlardan beri mavjud. Dastlabki g'oya asosiy oynani yopmasdan boshqa tarkibni ko'rsatish edi. Hozircha buni amalga oshirishning boshqa usullari mavjud: biz kontentni [fetch](info:fetch) yordamida dinamik ravishda yuklashimiz va uni dinamik ravishda yaratilgan `<div>`da ko'rsatishimiz mumkin. Shunday qilib, popuplar biz har kuni ishlatadigan narsa emas.

Bundan tashqari, popuplar bir vaqtning o'zida bir nechta oynani ko'rsatmaydigan mobil qurilmalarda ancha murakkab ishlaydi.

Shunga qaramay, popuplar hali ham ishlatiladigan vazifalar mavjud, masalan, OAuth avtorizatsiyasi uchun (Google/Facebook/... orqali kiring), chunki:

1. Popup - o'zining mustaqil JavaScript muhitiga ega bo'lgan alohida oyna. Shunday qilib, uchinchi tomon, ishonchli bo'lmagan saytdan popup ochish xavfsizdir.
2. Popupni ochish juda oson.
3. Popup navigatsiya qilishi (URLni o'zgartirishi) va xabarlarni ochuvchi oynaga yuborishi mumkin.

## Popupni bloklash

Ilgari, yovuz saytlar popuplarni ko'p suiiste'mol qilgan. Yomon sahifa reklamalar bilan ko'plab popuplarni ochishi mumkin. Shunday qilib, endi ko'pchilik brauzerlar popuplarni blokirovka qilishga va foydalanuvchini himoya qilishga harakat qiladi.

**Agar popup lar `onclick` kabi foydalanuvchi tomonidan qo'zg'atiladigan hodisa ishlov beruvchilaridan tashqarida chaqirilsa, ko'pchilik brauzerlar popuplarni bloklaydi**

Masalan:
```js
// popup bloklandi
window.open('https://javascript.info');

// popup blokdan chiqarildi
button.onclick = () => {
  window.open('https://javascript.info');
};
```

Shunday qilib, foydalanuvchilar popuplardan biroz himoyalangan, ammo funksionallik butunlay o'chirilmaydi.

Popup `onclick` dan, lekin `setTimeout` dan keyin ochilsa-chi? Bu biroz qiyin.

Ushbu kodni sinab ko'ring:

```js run
// 3 sekunddan keyin oching
setTimeout(() => window.open('http://google.com'), 3000);
```

Popup Chromeda ochiladi, lekin Firefoxda bloklanadi.

...Agar biz kechikishni kamaytirsak, popup Firefoxda ham ishlaydi:

```js run
// 1 sekunddan keyin oching
setTimeout(() => window.open('http://google.com'), 1000);
```

Farqi shundaki, Firefox 2000 ms yoki undan kam vaqtni qabul qiladi, ammo undan keyin "trust" ni olib tashlaydi, agar u endi "foydalanuvchi harakatidan tashqarida" deb faraz qiladi. Shunday qilib, birinchisi bloklangan, ikkinchisi esa yo'q.

## window.open

Ushbu sintaksislar `window.open(url, name, params)` popupni ochadi:

url
: Yangi oynaga yuklash uchun URL.

name
: Yangi oynaning nomi. Har bir oynada `window.name` mavjud va bu yerda popup uchun qaysi oynadan foydalanishni belgilashimiz mumkin. Agar shunday nomli oyna allaqachon mavjud bo'lsa, unda berilgan URL ochiladi, aks holda yangi oyna ochiladi.

parametrlar
: Yangi oyna uchun konfiguratsiya qatori. Unda vergul bilan ajratilgan sozlamalar mavjud. Parametrlarda bo'sh joy bo'lmasligi kerak, masalan: `width=200,height=100`.

`params` ni sozlash:

- Pozitsiya:
   - `left/top` (raqamli) -- ekrandagi oynaning yuqori chap burchagining koordinatalari. Cheklov mavjud: yangi oynani ekrandan tashqarida joylashtirish mumkin emas.
   - `width/height` (raqamli) -- yangi oynaning kengligi va balandligi. Minimal kenglik/balandlikda chegara mavjud, shuning uchun ko'rinmas oyna yaratish mumkin emas.
- Oyna xususiyatlari:
   - `menyubar` (ha/yo'q) -- yangi oynada brauzer menyusini ko'rsatadi yoki yashiradi.
   - `toolbar` (ha/yo'q) -- yangi oynada brauzer navigatsiya panelini (orqaga, oldinga, qayta yuklash va hokazo) ko'rsatadi yoki yashiradi.
   - `location` (ha/yo'q) -- yangi oynada URL maydonini ko'rsatadi yoki yashiradi. FF va IE sukut bo'yicha uni yashirishga ruxsat bermaydi.
   - `status` (ha/yo'q) -- holat panelini ko'rsatadi yoki yashiradi. Shunga qaramay, ko'pchilik brauzerlar uni ko'rsatishga majbur qiladi.
   - `resizable` (ha/yo'q) -- yangi oyna uchun o'lchamni o'zgartirishni o'chirish imkonini beradi. Tavsiya etilmaydi.
   - `scrollbars` (ha/yo'q) -- yangi oyna uchun aylantirish panellarini o'chirishga imkon beradi. Tavsiya etilmaydi.


Bundan tashqari, odatda foydalanilmaydigan bir qator kamroq qo'llab-quvvatlanadigan brauzerga xos xususiyatlar mavjud. Misollar uchun <a href="https://developer.mozilla.org/en/DOM/window.open"> window.open ni MDN</a> da tekshiring.

## Namuna: minimalist oyna

Keling, minimal funktsiyalar to'plamiga ega oynani ochaylik, ulardan qaysi biri brauzer o'chirib qo'yishini tekshiramiz:

```js run
let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;

open('/', 'test', params);
```

Bu yerda aksariyat "oyna xususiyatlari" o'chirilgan va oyna ekrandan tashqarida joylashgan. Uni ishga tushiring va aslida nima bo'lishini ko'ring. Ko'pgina brauzerlar nol `width/height` va ekran tashqarisidagi `left/top` kabi g'alati narsalarni "tuzatadi". Masalan, Chrome to'liq ekranni egallashi uchun bunday oynani to'liq kengligi/balandligi bilan ochadi.

Oddiy joylashishni aniqlash opsiyalarini va o'rtacha `width`, `height`, `left`, `top` koordinatalarini qo'shamiz:

```js run
let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=600,height=300,left=100,top=100`;

open('/', 'test', params);
```

Ko'pgina brauzerlar kerak bo'lganda yuqoridagi misolni ko'rsatadi.

O'tkazib yuborilgan sozlamalar uchun qoidalar:

- Agar `open` call da 3-argument bo'lmasa yoki u bo'sh bo'lsa, u holda standart oyna parametrlari qo'llaniladi.
- Parametrlar qatori mavjud bo'lsa-da, lekin ba'zi `yes/no` xususiyatlari o'tkazib yuborilsa, o'tkazib yuborilgan xususiyatlar `no` qiymatiga ega deb hisoblanadi. Shunday qilib, agar siz parametrlarni belgilasangiz, barcha kerakli xususiyatlarni `yes` ga aniq o'rnatganingizga ishonch hosil qiling.
- Paramlarda `left/top` bo'lmasa, brauzer oxirgi ochilgan oyna yaqinida yangi oyna ochishga harakat qiladi.
- Agar `width/height` bo'lmasa, yangi oyna oxirgi ochilgan o'lcham bilan bir xil bo'ladi.

## Oynadan popupga kirish

`open` chaqiruvi yangi oynaga havolani qaytaradi. U o'z xususiyatlarini boshqarish, joylashuvni o'zgartirish va boshqalar uchun ishlatilishi mumkin.

Ushbu misolda biz JavaScriptdan popup kontentni yaratamiz:

```js
let newWin = window.open("about:blank", "hello", "width=200,height=200");

newWin.document.write("Hello, world!");
```

Va bu yerda biz yuklangandan so'ng tarkibni o'zgartiramiz:

```js run
let newWindow = open('/', 'example', 'width=300,height=300')
newWindow.focus();

alert(newWindow.location.href); // (*) about:blank, yuklash hali boshlangani yo'q

newWindow.onload = function() {
  let html = `<div style="font-size:30px">Welcome!</div>`;
*!*
  newWindow.document.body.insertAdjacentHTML('afterbegin', html);
*/!*
};
```

Iltimos, diqqat qiling: `window.open` dan so'ng darhol yangi oyna hali yuklanmagan. Bu `(*)` qatoridagi `alert` bilan ko'rsatilgan. Shuning uchun uni o'zgartirish uchun `onload` ni kutamiz. Biz, shuningdek, `newWin.document` uchun `DOMContentLoaded` ishlov beruvchisidan foydalanishimiz mumkin.

```warn header="Bir xil kelib chiqish siyosati"
Windows bir-birining tarkibiga faqat bir xil manbadan (bir xil protokol://domen: port) kelgan taqdirdagina erkin kirishi mumkin.

Agar asosiy oyna `site.com` dan va popup `gmail.com` dan bo'lsa, foydalanuvchi xavfsizligi sababli bu mumkin emas. Tafsilotlar uchun <info:cross-window-communication> bo'limiga qarang.
```

## Popupdan oynaga kirish

Popup `window.opener` havolasidan foydalanib, "opener" oynasiga kirishi mumkin. Bu holat popuplardan tashqari barcha oynalar uchun `null` hisoblanadi.

Agar siz quyidagi kodni ishlatsangiz, u ochuvchi (joriy) oyna mazmunini "Test" bilan almashtiradi:

```js run
let newWin = window.open("about:blank", "hello", "width=200,height=200");

newWin.document.write(
  "<script>window.opener.document.body.innerHTML = 'Test'<\/script>"
);
```

Demak, derazalar orasidagi aloqa ikki tomonlama: asosiy oyna va popup bir-biriga havolaga ega.

## Popupni yopish

Windowni yopish uchun: `win.close()`.

Window yopilganini tekshirish uchun: `win.closed`.

Texnik jihatdan `close()` usuli har qanday `window` uchun mavjud, ammo `window.open()` yordamida `window` yaratilmagan bo'lsa, `window.close()` ko'pchilik brauzerlar tomonidan e'tiborga olinmaydi. Shunday qilib, u faqat popupda ishlaydi.

Agar oyna yopiq bo'lsa, `closed` xususiyati `true` hisoblanadi. Bu popup (yoki asosiy oyna) hali ham ochiq yoki yo'qligini tekshirish uchun foydalidir. Foydalanuvchi uni istalgan vaqtda yopishi mumkin va bizning kodimiz bu imkoniyatni hisobga olishi kerak.

Ushbu kod yuklanadi va keyin oynani yopadi:

```js run
let newWindow = open('/', 'example', 'width=300,height=300');

newWindow.onload = function() {
  newWindow.close();
  alert(newWindow.closed); // true
};
```


## Ko'chirish va o'lchamini o'zgartirish

Quyida oynani ko'chirish/o'lchamini o'zgartirish usullari berilgan:

`win.moveBy(x,y)`
: Oynani joriy holatga nisbatan `x` piksel o'ngga va `y` piksel pastga siljiting. Salbiy qiymatlarga ruxsat beriladi (chapga/yuqoriga siljitish uchun).

`win.moveTo(x,y)`
: Oynani ekrandagi `(x,y)` koordinatalariga o'tkazing.

`win.resizeBy(width,height)`
: Oyna hajmini joriy o'lchamga nisbatan berilgan `width/height` bo'yicha o'zgartiring. Salbiy qiymatlarga ruxsat beriladi.

`win.resizeTo(width,height)`
: Oyna hajmini berilgan o'lchamga o'zgartiring.

Shuningdek, `window.onresize` hodisasi mavjud.

```warn header="Faqat popuplar"
Suiiste'molning oldini olish uchun brauzer odatda ushbu usullarni bloklaydi. Ular faqat biz ochgan, qo'shimcha yorliqlari bo'lmagan popuplarda ishonchli ishlaydi.
```

```warn header="Kichiklashtirish/kattalashtirish yo'q"
JavaScriptda oynani kichiklashtirish yoki kattalashtirishning hech qanday usuli yo'q. Ushbu OS darajasidagi funksiyalar Frontend dasturchilaridan yashiringan.

Ko'chirish/o'lchamini o'zgartirish usullari kattalashtirilgan/kichiklashtirilgan oynalar uchun ishlamaydi.
```

## Oynani aylantirish

Biz allaqachon <info:size-and-scroll-window> bobida oynani aylantirish haqida gapirgan edik.

`win.scrollBy(x,y)`
: Joriy aylantirishga nisbatan oynani `x` piksel o'ngga va `y` pastga aylantiring. Salbiy qiymatlarga ruxsat beriladi.

`win.scrollTo(x,y)`
: Oynani berilgan koordinatalar `(x,y)`ga aylantiring.

`elem.scrollIntoView(top = true)`
: `elem` tepada (standart) yoki `elem.scrollIntoView(false)` uchun pastda ko'rinishi uchun oynani aylantiring.

Bu yerda `window.onscroll` hodisasi ham mavjud.

## Oynaga fokuslash/blur qilish

Nazariy jihatdan, oynaga fokuslash/fokusni yo'qotish uchun `window.focus()` va `window.blur()` usullari mavjud. Shuningdek, tashrif buyuruvchining diqqatini derazaga qaratib, boshqa joyga o'tishini ushlash imkonini beruvchi `focus/blur` hodisalari ham mavjud.

Ular amalda jiddiy cheklangan, chunki o'tmishda yomon sahifalar ularni suiiste'mol qilgan.

Masalan, ushbu kodga e'tibor qarating:

```js run
window.onblur = () => window.focus();
```

Agar foydalanuvchi (`window.onblur`) oynadan o'tishga harakat qilganda, u oynani diqqat markaziga qaytaradi. Maqsad foydalanuvchini `window` ichida "qulflash".

Shunday qilib, brauzerlar bunday kodni taqiqlash va foydalanuvchini reklama va yomon sahifalardan himoya qilish uchun ko'plab cheklovlarni kiritishlari kerak edi. Ular brauzerga bog'liq.

Masalan, mobil brauzer odatda `window.focus()` ni butunlay e'tiborsiz qoldiradi. Shuningdek, qalqib chiquvchi oyna yangi oynada emas, balki alohida yorliqda ochilganda ham fokuslash ishlamaydi.

Shunga qaramay, bunday qo'ng'iroqlar ishlayotgan va foydali bo'lishi mumkin bo'lgan ba'zi holatlar mavjud.

Masalan:

- Popup ochilganda, unda `newWindow.focus()` ni ishga tushirish yaxshi fikr bo'lishi mumkin. Har holda, ba'zi OS/brauzer kombinatsiyalari uchun foydalanuvchi hozir yangi oynada bo'lishini ta'minlaydi.
- Agar tashrif buyuruvchi bizning veb-ilovamizdan qachon foydalanishini kuzatmoqchi bo'lsak, `window.onfocus/onblur` ni kuzatishimiz mumkin. Bu bizga sahifa ichidagi harakatlarni, animatsiyalarni va hokazolarni toʻxtatib turish/davom etish imkonini beradi. Ammo shuni yodda tutingki, `blur` hodisasi tashrif buyuruvchining derazadan o'tganligini bildiradi, lekin ular buni baribir kuzatishi mumkin. Bu oyna fonda baribir ko'rinadi.

## Xulosa

Popuplar kamdan-kam qo'llaniladi, chunki muqobil variantlar mavjud, masalan, sahifada yoki iframe-da ma'lumotlarni yuklash va ko'rsatish.

Agar popup ochmoqchi bo'lsak, bu haqda foydalanuvchini xabardor qilish yaxshi amaliyotdir. Havola yoki tugma yaqinidagi "ochish oynasi" belgisi tashrif buyuruvchiga diqqatni o'zgartirishdan omon qolish va ikkala oynani ham yodda tutish imkonini beradi.

- Popupni `open(url, name, params)` chaqiruvi orqali ochish mumkin. U yangi ochilgan oynaga havolani qaytaradi.
- Brauzerlar foydalanuvchi harakatlaridan tashqari koddan `open` qo'ng'iroqlarni bloklaydi. Odatda foydalanuvchi ruxsat berishi uchun bildirishnoma paydo bo'ladi.
- Brauzerlar sukut bo'yicha yangi yorliq ochadi, lekin o'lchamlar taqdim etilgan bo'lsa, u popup bo'ladi.
- Popup ochuvchi oynaga `window.opener` xususiyatidan foydalanib kirishi mumkin.
- Asosiy oyna va popupning kelib chiqishi bir xil bo'lsa, bir-birini erkin o'qishi va o'zgartirishi mumkin. Aks holda, ular bir-birining joylashuvini o'zgartirishi va [xabar almashishi] mumkin (ma'lumot: o'zaro oyna aloqasi).

Popupni yopish uchun: `close()` chaqiruvidan foydalaning. Shuningdek, foydalanuvchi ularni yopishi mumkin (xuddi boshqa har qanday oyna kabi). Shundan keyin `window.closed` `true` hisoblanadi.

- `Focus()` va `blur()` usullari oynani fokuslash/fokuslashni bekor qilish imkonini beradi. Lekin ular har doim ham ishlamaydi.
- `Focus` va `blur` hodisalari oynaga kirish va chiqishni kuzatish imkonini beradi. Ammo shuni esda tutingki, deraza fon holatida ham, `blur` qilinib, xiralashgandan keyin ham ko'rinishi mumkin.
