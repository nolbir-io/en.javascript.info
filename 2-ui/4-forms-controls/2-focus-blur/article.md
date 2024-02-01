# Focusing: focus/blur

Element fokusni foydalanuvchi ustiga bosganida yoki klaviaturadagi `key:Tab` tugmasidan foydalanganda oladi. Shuningdek, sahifa yuklanganda va fokusni olishning boshqa vositalarida fokusni sukut bo'yicha elementga qo'yadigan `autofocus` HTML atributi ham mavjud.

Elementga e'tibor qaratish, odatda, "bu yerda ma'lumotlarni qabul qilishga tayyorlanish" degan ma'noni anglatadi, shu sababli bu holat biz kerakli funksiyani ishga tushirish uchun kodni ishga tushirishimiz mumkin bo'lgan vaqt hisobalandi.

Fokusni yo'qotish vaqti ("blur") yanada muhimroq bo'lishi mumkin. Bu foydalanuvchi boshqa joyni bosganda yoki keyingi shakl maydoniga o'tish uchun `key: Tab` tugmasini bosganda yoki boshqa vositalar ham mavjud.

Fokusni yo'qotish odatda: "ma'lumotlar kiritilgan" degan ma'noni anglatadi, shuning uchun biz kodni tekshirish yoki hatto serverga saqlash uchun ishlatishimiz mumkin va hokazo. 

Fokusli hodisalar bilan ishlashda muhim o'ziga xosliklar mavjud. Biz ularni davom ettirish uchun qo'limizdan kelganini qilamiz.

## focus/blur hodisalari

`Focus` hodisasi fokuslash uchun va `blur` elementi fokusni yo'qotganda chaqiriladi.

Keling, ulardan kirish maydonini tekshirish uchun foydalanaylik.

Quyidagi misolda:

- `blur` ishlov beruvchisi maydonga elektron pochta manzili kiritilganligini tekshiradi, agar kiritilmagan bo'lsa, xatoni ko'rsatadi.
- `focus` ishlov beruvchisi xato xabarini yashiradi (`blur` da u yana tekshiriladi):

```html run autorun height=60
<style>
  .invalid { border-color: red; }
  #error { color: red }
</style>

Iltimos, email ingizni kiriting: <input type="email" id="input">

<div id="error"></div>

<script>
*!*input.onblur*/!* = function() {
  if (!input.value.includes('@')) { // bu email emas
    input.classList.add('invalid');
    error.innerHTML = 'Please enter a correct email.'
  }
};

*!*input.onfocus*/!* = function() {
  if (this.classList.contains('invalid')) {
    // "error" belgisini olib tashlang, chunki foydalanuvchi biror narsani qayta kiritishni xohlaydi
    this.classList.remove('invalid');
    error.innerHTML = "";
  }
};
</script>
```

Zamonaviy HTML bizga kiritish atributlari yordamida ko'plab tekshirishlarni amalga oshirish imkonini beradi: `required`, `pattern` va boshqalar. Va ba'zida ular bizga kerak bo'lgan narsadir. JavaScript ko'proq moslashuvchanlikni xohlaganimizda ishlatilishi mumkin. Bundan tashqari, agar u to'g'ri bo'lsa, o'zgartirilgan qiymatni serverga avtomatik ravishda yuborsak bo'ladi.


## focus/blur usullari

`elem.focus()` va `elem.blur()` usullari elementga fokusni o'rnatadi/bekor qiladi.

Misol uchun, agar qiymat noto'g'ri bo'lsa, tashrif buyuruvchi kirishni tark eta olmasligini ta'minlaymiz:

```html run autorun height=80
<style>
  .error {
    background: red;
  }
</style>

Iltimos, emailingizni kiriting,: <input type="email" id="input">
<input type="text" style="width:220px" placeholder="make email invalid and try to focus here">

<script>
  input.onblur = function() {
    if (!this.value.includes('@')) { // bu email emas
      // error ni ko'rsatmoqda
      this.classList.add("error");
*!*
      // ...va focus ni orqaga qaytaring
      input.focus();
*/!*
    } else {
      this.classList.remove("error");
    }
  };
</script>
```

U Firefoxdan boshqa hamma brauzerlarda ishlaydi ([bug](https://bugzilla.mozilla.org/show_bug.cgi?id=53579)).

Agar biz kiritishga biror narsa kiritib, keyin `key:Tab` dan foydalanishga harakat qilsak yoki `<input>`dan uzoqroqqa bossak, `onblur` fokusni qaytaradi.

Esda tutingki, biz `onblur`da `event.preventDefault()` ni chaqirib "fokusni yo'qotishning oldini ololmaymiz", chunki `onblur` element fokusni yo'qotganidan *keyin* ishlaydi.

Amalda, shunga o'xshash narsani amalga oshirishdan oldin yaxshilab o'ylab ko'rish kerak, chunki biz odatda foydalanuvchiga *xatolarni ko'rsatishimiz* kerak, lekin formamizni to'ldirishda ularning rivojlanishiga to'sqinlik qilmasligimiz ham lozim. Ular birinchi navbatda boshqa maydonlarni to'ldirishni xohlashlari mumkin.

```warn header="Fokusni yo'qotish JavaScriptdan boshlangan"

Fokusni yo'qotish ko'p sabablarga ko'ra yuzaga kelishi mumkin.

Ulardan biri tashrif buyuruvchi boshqa joyni bosganda, ammo JavaScriptning o'zi ham bunga sabab bo'lishi mumkin, masalan:

- `alert` fokusni o'ziga o'zgartiradi, shuning uchun u elementda fokusni yo'qotadi (`blur` hodisasi) va `alert` o'chirilganda, fokus qaytib keladi (`focus` hodisasi). 
- Agar element DOM dan o'chirilgan bo'lsa, u ham fokusning yo'qolishiga olib keladi. Agar u keyinroq qayta o'rnatilsa, fokus qaytmaydi.

Bu xususiyatlar ba'zan `focus` ishlov beruvchilarining noto'g'ri ishlashiga olib keladi, ular kerak bo'lmaganda ishga tushadi.

Eng yaxshi retsept bu hodisalardan foydalanganda ehtiyot bo'lishdir. Agar biz foydalanuvchi tomonidan boshlangan fokusni yo'qotishni kuzatmoqchi bo'lsak, uni o'zimiz keltirib chiqarmasligimiz kerak. 
```
## Har qanday elementda focus ga ruxsat bering: tabindex

Default sababli ko'pgina elementlar fokuslashni qo'llab-quvvatlamaydi.

Ro'yxat brauzerlar orasida biroz farq qiladi, lekin bitta narsa har doim to'g'ri: tashrif buyuruvchi o'zaro aloqada bo'lishi mumkin bo'lgan elementlar uchun `focus/blur` qo'llab-quvvatlanishi kafolatlanadi: `<button>`, `<input>`, `<select>`, `<a>` va boshqalar.

Boshqa tomondan, `<div>`, `<span>`, `<jadval>` kabi biror narsani formatlash uchun mavjud bo'lgan elementlar sukut bo'yicha fokuslanmaydi. `Elem.focus()` usuli ularda ishlamaydi va `focus/blur` hodisalari hech qachon ishga tushmaydi.

Buni `tabindex` HTML-atribyuti yordamida o'zgartirish mumkin.

Har qanday elementda `tabindex` bo'lsa, u diqqat markazida bo'ladi. Atribyutning qiymati ular o'rtasida almashish uchun `key:Tab` (yoki shunga o'xshash narsa) ishlatilganda elementning tartib raqamidir.

Ya'ni, agar bizda ikkita element bo'lsa, birinchisida `tabindex="1"`, ikkinchisida `tabindex="2"` bo'ladi, so'ngra birinchi elementda `key:Tab` tugmasini bosish fokusni o'zgartiradi va focus ikkinchi elementga ko'chadi.

O'tish tartibi: `1` va undan yuqori `tabindex` li elementlar birinchi bo'lib (`tabindex` tartibida), so'ngra `tabindex` siz elementlar (masalan, oddiy `<input>`) o'tadi.

`tabindex`ga mos kelmaydigan elementlar hujjat manbasi tartibida almashtiriladi (standart tartib).

Ikkita maxsus qiymat mavjud:

- `tabindex="0"` elementni `tabindex`sizlar qatoriga qo'yadi. Ya'ni, biz elementlarni almashtirganimizda `tabindex=0` bo'lgan elementlar `tabindex ≥ 1` bo'lgan elementlardan keyin boradi.

     Odatda u elementni diqqatni jamlash uchun ishlatiladi, lekin standart almashtirish tartibini saqlang. Elementni `<input>` bilan teng shaklning bir qismiga aylantirish uchun shunday qilinadi.

- `tabindex="-1"` elementga faqat dasturiy diqqatni qaratish imkonini beradi. `key:Tab` tugmasi bunday elementlarga e'tibor bermaydi, lekin `elem.focus()` usuli ishlaydi.

Masalan, quyida ro'yxat berilgan. Birinchi elementni va `key: Tab` tugmasini bosing:

```html autorun no-beautify
Birinchi elementni va Tab tugmasini bosing. Buyurtmani kuzatib boring. E'tibor bering, ko'plab keyingi yorliqlar misoldagi iframe-dan fokusni ko'chirishi mumkin.
<ul>
  <li tabindex="1">One</li>
  <li tabindex="0">Zero</li>
  <li tabindex="2">Two</li>
  <li tabindex="-1">Minus one</li>
</ul>

<style>
  li { cursor: pointer; }
  :focus { outline: 1px dashed green; }
</style>
```

Buyurtma quyidagicha tartibda bo'ladi: `1 - 2 - 0`. Odatda, `<li>` fokuslashni qo'llab-quvvatlamaydi, biroq `tabindex` ning to'liq funksiyasi `:focus` bilan hodisalar va uslublar bilan birga uni ishga tushiradi.

```smart header="`elem.tabIndex` xususiyati ham ishlaydi"
`elem.tabIndex` xususiyatidan foydalanib, JavaScriptdan `tabindex` xususiyatini qo'shishimiz mumkin. Bu ham xuddi shunday ta'sirga ega.
```

## Delegatsiya: focusin/focusout

`focus` va `blur` hodisalari ko'piklanmaydi. 

Masalan, `<form>` ga `onfocus` ni qo'yib, uni ajratib ko'rsatish mumkin emas, masalan:

```html autorun height=80
<!-- on focusing in the form -- add the class -->
<form *!*onfocus="this.className='focused'"*/!*>
  <input type="text" name="name" value="Name">
  <input type="text" name="surname" value="Surname">
</form>

<style> .focused { outline: 1px solid red; } </style>
```
Yuqoridagi misol ishlamaydi, chunki foydalanuvchi `<input>`ga diqqatini qaratganda, `focus` hodisasi faqat shu kiritishda ishga tushadi. U ko'piklanmaydi. Shunday qilib, `form.onfocus` hech qachon ishlamaydi.

Bizda ikkita yechim bor.

Birinchidan, kulgili tarixiy xususiyat bor: `focus/blur` ko'piklanmaydi, balki suratga olish bosqichida pastga tarqaladi.

Bu ishlaydi:

```html autorun height=80
<form id="form">
  <input type="text" name="name" value="Name">
  <input type="text" name="surname" value="Surname">
</form>

<style> .focused { outline: 1px solid red; } </style>

<script>
*!*
  // ishlov beruvchini suratga olish bosqichiga qo'ying (oxirgi argument to'g'ri)
  form.addEventListener("focus", () => form.classList.add('focused'), true);
  form.addEventListener("blur", () => form.classList.remove('focused'), true);
*/!*
</script>
```

Ikkinchidan, `focusin` va `focusout` hodisalari mavjud -- `focus/blur` bilan bir xil, ammo ular pufakchali.

E'tibor bering, ular `on<event>` emas, balki `elem.addEventListener` yordamida tayinlanishi kerak.

Shunday qilib, quyida yana bir ishlaydigan variant berilmoqda:

```html autorun height=80
<form id="form">
  <input type="text" name="name" value="Name">
  <input type="text" name="surname" value="Surname">
</form>

<style> .focused { outline: 1px solid red; } </style>

<script>
*!*
  form.addEventListener("focusin", () => form.classList.add('focused'));
  form.addEventListener("focusout", () => form.classList.remove('focused'));
*/!*
</script>
```

## Xulosa

Events `focus` and `blur` trigger on an element focusing/losing focus.

Their specials are:
- They do not bubble. Can use capturing state instead or `focusin/focusout`.
- Most elements do not support focus by default. Use `tabindex` to make anything focusable.

The current focused element is available as `document.activeElement`.

`focus` va `blur` hodisalari fokuslanayotgan/fokusni yo'qotayotgan elementni ishga tushiradi.

Ularning o'ziga xos xususiyatlari:
- Ular ko'piklanmaydi. Buning o'rniga capturing holati yoki `focus/focusout` dan foydalanish mumkin.
- Aksariyat elementlar sukut bo'yicha fokusni qo'llab-quvvatlamaydi. Har qanday narsani diqqatni jamlaydigan uchun `tabindex` dan foydalaning.

Joriy fokuslangan element `document.activeElement` sifatida mavjud.
