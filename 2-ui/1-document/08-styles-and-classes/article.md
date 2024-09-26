# Uslublar va sinflar (styles and classes)

JavaScriptning uslublar va sinflar bilan ishlash usullarini ko'rib chiqishdan avval muhim qoidani yodga olaylik. Yetarli darajada tushunasiz, deb umid qilaman, lekin biz hali ham buni eslatib o'tishimiz kerak.

Elementni shakllantirishning odatda ikkita usuli mavjud:

1. CSSda sinf yaratish va uni qo'shish: `<div class="...">`
2. Xususiyatlarni to'g'ridan-to'g'ri `style` ga yozish: `<div style="...">`.

JavaScript ikkala sinf va `style` xususiyatlarini o'zgartirishi mumkin.

Biz har doim CSS sinflarini `style` dan afzal ko'rishimiz kerak. Ikkinchisini faqat sinflar "bajara olmasa" ishlatish kerak.

Misol uchun, agar biz elementning koordinatalarini dinamik ravishda hisoblab chiqsak va ularni JavaScriptdan o'rnatmoqchi bo'lsak, `style` qabul qilinadi, masalan:

```js
let top = /* murakkab hisob-kitoblar */;
let left = /* murakkab hisob-kitoblar */;

elem.style.left = left; // e.g '123px', ish vaqtida hisoblab chiqilgan
elem.style.top = top; // e.g '456px'
```
Boshqa hollarda, masalan, matnni qizil rangga aylantirish, fon belgisini qo'shishni CSSda tavsiflang va keyin sinfni qo'shing (JavaScript buni qila oladi). Bu yanada moslashuvchan va qo'llab-quvvatlash osonroq.

## className va classList

Sinfni o'zgartirish skriptlarda eng ko'p ishlatiladigan amallardan biridir.

Avvalgi paytlar JavaScriptda cheklov mavjud edi: `"class"` kabi ajratilgan so'z obyekt xususiyati bo'la olmasdi. Bu cheklov hozir mavjud emas, lekin o'sha paytda `elem.class` kabi `"class"` xususiyatiga ega bo'lolmasdi.

Shunday qilib, sinflar uchun o'xshash ko'rinishdagi `"className"` xususiyati joriy etildi: `elem.className` `"sinf"` atributiga mos keladi.

Masalan:

```html run
<body class="main page">
  <script>
    alert(document.body.className); // main page (asosiy sahifa)
  </script>
</body>
```
Agar biz `elem.className` ga biror narsa tayinlasak, u butun sinflar qatorini almashtiradi. Ba'zida bu bizga kerak bo'ladi, lekin ko'pincha biz bitta sinfni qo'shish/o'chirishni xohlaymiz.

Bizda buning uchun `elem.classList` xususiyati mavjud:

`Elem.classList` - bu bitta sinfning `add/remove/toggle` usullariga ega maxsus obyektdir.

Masalan:

```html run
<body class="main page">
  <script>
*!*
    // add a class
    document.body.classList.add('article');
*/!*

    alert(document.body.className); // main page article
  </script>
</body>
```

Shunday qilib, biz `className` yordamida to'liq sinf qatorida yoki `classList` yordamida alohida sinflarda ishlashimiz mumkin. Tanlagan narsamiz ehtiyojlarimizga bog'liq.

`classList` metodlari:

- `elem.classList.add/remove("class")` -- sinfni qo'shadi/o'chiradi.
- `elem.classList.toggle("class")` -- agar mavjud bo'lmasa, sinfni qo'shadi, aks holda uni o'chiradi.
- `elem.classList.contains("class")` -- berilgan sinfni tekshiradi, `true/false` ni qaytaradi.

Bundan tashqari, `classList` takrorlanadi, shuning uchun biz barcha sinflarni `for..of` bilan ro'yxatga olishimiz mumkin, masalan:

```html run
<body class="main page">
  <script>
    for (let name of document.body.classList) {
      alert(name); // main, and then page
    }
  </script>
</body>
```

## Element stili

`elem.style` xossasi ``style`` atributida yozilgan narsaga mos keladigan obyektdir. `elem.style.width="100px"` sozlanishi `style` atributida `width:100px` qatori bo'lgandek ishlaydi.

Ko'p so'zli xususiyat uchun camelCase ishlatiladi:

```js no-beautify
background-color  => elem.style.backgroundColor
z-index           => elem.style.zIndex
border-left-width => elem.style.borderLeftWidth
```

Masalan:

```js run
document.body.style.backgroundColor = prompt('background color?', 'green');
```

````smart header="Prefiksli xususiyatlar"
`-moz-border-radius`, `-webkit-border-radius` kabi brauzer-prefiksli xususiyatlar ham xuddi shu qoidaga amal qiladi: chiziqcha katta harfni bildiradi.

Masalan:

```js
button.style.MozBorderRadius = '5px';
button.style.WebkitBorderRadius = '5px';
```
````

## Uslub xususiyatini tiklash 

Ba'zan uslub xususiyatini tayinlashni va keyinroq uni olib tashlashni xohlaymiz.

Masalan, elementni yashirish uchun biz `elem.style.display = "none"` ni o'rnatishimiz mumkin.

Keyinroq biz `style.display` o'rnatilmagandek olib tashlashni xohlashimiz mumkin. `delete elem.style.display` o'rniga biz unga bo'sh qatorni belgilashimiz kerak: `elem.style.display = ""`.

```js run
// agar biz ushbu kodni ishga tushirsak, <body> xira ko'rinadi
document.body.style.display = "none"; // hide

setTimeout(() => document.body.style.display = "", 1000); // normal holatiga qaytadi
```
Agar biz `style.display` ni bo'sh qatorga o'rnatsak, go'yo bunday `style.display` xususiyati umuman mavjud emasdek, brauzer CSS sinflari va uning o'rnatilgan uslublarini odatdagidek qo'llaydi.

Buning uchun `elem.style.removeProperty('style property')` maxsus usuli ham mavjud. Shunday qilib, biz quyidagi xususiyatni olib tashlashimiz mumkin:

```js run
document.body.style.background = 'red'; //fonni qizil rangga o'rnating
setTimeout(() => document.body.style.removeProperty('background'), 1000); // 1 soniyadan keyin fonni olib tashlang
```

````smart header="``style.cssText` bilan to'liq qayta yozish`"
Odatda, biz individual uslub xususiyatlarini belgilash uchun `style.*` dan foydalanamiz. Biz `div.style="color: red; width: 100px"` kabi to'liq uslubni o'rnatolmaymiz, chunki `div.style` obyekt bo'lib, u faqat o'qish uchun mo'ljallangan.

To'liq uslubni satr sifatida o'rnatish uchun `style.cssText` maxsus xususiyati mavjud:

```html run
<div id="div">Button</div>

<script>
  // biz bu yerda "important" kabi maxsus uslub bayroqlarini o'rnatishimiz mumkin
  div.style.cssText=`color: red !important;
    background-color: yellow;
    width: 100px;
    text-align: center;
  `;

  alert(div.style.cssText);
</script>
```
Bu xususiyat kamdan-kam qo'llaniladi, chunki bunday tayinlash barcha mavjud uslublarni olib tashlaydi: u qo'shmaydi, balki ularni almashtiradi. Vaqti-vaqti bilan kerakli narsani o'chirib tashlashi mumkin, ammo mavjud uslubni o'chirmasligimizni bilsak, biz undan yangi elementlar uchun xavfsiz foydalanishimiz mumkin.

 Buni xuddi shunday atributni o'rnatish orqali ham amalga oshirish mumkin: `div.setAttribute('style', 'color: red...')`.
````

## Birliklarga e'tibor bering

Qiymatlarga CSS birliklarini qo'shishni unutmang.

Masalan, biz `elem.style.top` ni `10` ga emas, balki `10px` ga qo'yishimiz kerak. Aks holda u ishlamaydi:

```html run height=100
<body>
  <script>
  *!*
    // ishlamaydi!
    document.body.style.margin = 20;
    alert(document.body.style.margin); // '' (bo'sh satr, topshiriq e'tiborga olinmaydi)
  */!*

    // endi CSS birligini (px) qo'shing - va u ishlaydi
    document.body.style.margin = '20px';
    alert(document.body.style.margin); // 20px

    alert(document.body.style.marginTop); // 20px
    alert(document.body.style.marginLeft); // 20px
  </script>
</body>
```
Iltimos, diqqat qiling: brauzer oxirgi satrlardagi `style.margin` xususiyatini "ochadi" va undan `style.marginLeft` va `style.marginTop` xulosalarini chiqaradi.

## Computed style lar: getComputedStyle

Shunday qilib, uslubni o'zgartirish oson. Lekin uni qanday *o'qish* kerak?

Masalan, biz elementning o'lchamini, chegaralarini, rangini bilishni xohlaymiz. Buni qanday qilish kerak?

**"style" xususiyati faqat "style" atribyutining qiymati bo'yicha hech qanday CSS kaskadisiz ishlaydi.**

Shunday qilib, biz `elem.style` yordamida CSS sinflaridan kelgan hech narsani o'qiy olmaymiz.

Masalan, bu erda "uslub" chegarani ko'rmaydi:

```html run height=60 no-beautify
<head>
  <style> body { color: red; margin: 5px } </style>
</head>
<body>

  The red text
  <script>
*!*
    alert(document.body.style.color); // bo'sh
    alert(document.body.style.marginTop); // bo'sh
*/!*
  </script>
</body>
```

...Ammo, aytaylik, marjni `20px` ga oshirish kerak bo'lsa-chi? Biz uning hozirgi qiymatini xohlaymiz.

Bizda buning uchun `getComputedStyle` metodi mavjud.

Sintaksis:

```js
getComputedStyle(element, [pseudo])
```

element
: Qiymatni o'qish uchun element.

pseudo
: Agar kerak bo'lsa, psevdoelement, masalan, `::before` mavjud. Bo'sh satr yoki argument yo'qligi elementning o'zini anglatadi.

Natijada `elem.style` kabi uslublarga ega obyekt paydo bo`ldi, lekin endi u barcha CSS sinflariga bog'liq.

Masalan:

```html run height=100
<head>
  <style> body { color: red; margin: 5px } </style>
</head>
<body>

  <script>
    let computedStyle = getComputedStyle(document.body);

    // endi biz undan chekka va rangni o'qiy olamiz

    alert( computedStyle.marginTop ); // 5px
    alert( computedStyle.color ); // rgb(255, 0, 0)
  </script>

</body>
```

```smart header="Hisoblangan va hal qilingan qiymatlar"
[CSS] da ikkita tushuncha mavjud (https://drafts.csswg.org/cssom/#resolved-values):

1. *computed* uslub qiymati barcha CSS qoidalari va CSS merosi qo'llanilgandan keyingi qiymat, CSS kaskadi natijasidir. U `height: 1em` yoki `font-size: 125%` kabi ko'rinishi mumkin.
2. *Resolved* uslubi qiymati elementga oxirida qo'llaniladigan qiymatdir. `1em` yoki `125%` kabi qiymatlar nisbiydir. Brauzer hisoblangan qiymatni oladi va barcha birliklarni qat'iy va mutlaq qiladi, masalan: `height:20px` yoki `shrift-size:16px`. Geometriya xususiyatlari uchun hal qilingan qiymatlar suzuvchi nuqtaga ega bo'lishi mumkin, masalan, `font-size: 50,5px`.

Uzoq vaqt oldin `getComputedStyle` hisoblangan qiymatlarni olish uchun yaratilgan edi, ammo hal qilingan qiymatlar ancha qulayroq ekanligi ma'lum bo'ldi va standart o'zgardi.

Shunday qilib, bugungi kunda `getComputedStyle` aslida xususiyatning hal qilingan qiymatini qaytaradi, odatda geometriya uchun `px`da.
```

````warn header="`getComputedStyle` xususiyatning to'liq nomini talab qiladi"

Biz har doim o'zimizga kerakli xususiyatni so'rashimiz kerak, masalan, `paddingLeft`, `marginTop` yoki `borderTopWidth`. Aks holda, to'g'ri natija kafolatlanmaydi.

Masalan, agar `paddingLeft/paddingTop` xossalari mavjud bo'lsa, `getComputedStyle(elem).padding` uchun nimani olishimiz kerak? Hech narsa yo'qmi yoki ma'lum to'ldirishlardan "yaratilgan" qiymatmi? Bu yerda standart qoida yo'q.
````

```smart header="`:visited` havolalariga qo'llaniladigan uslublar berkitilgan!"
Tashrif qilingan havolalar `:visited` CSS pseudo-klassi yordamida ranglanishi mumkin.

Ammo `getComputedStyle` bu rangga kirishga ruxsat bermaydi, chunki aks holda ixtiyoriy sahifa foydalanuvchining havolaga tashrif buyurganligini sahifada yaratish va uslublarni tekshirish orqali bilib olishi mumkin.

JavaScript may not see the styles applied by `:visited`. And also, there's a limitation in CSS that forbids applying geometry-changing styles in `:visited`. That's to guarantee that there's no side way for an evil page to test if a link was visited and hence to break the privacy.

JavaScript `:visited` tomonidan qo'llaniladigan uslublarni ko'rmasligi mumkin. Shuningdek, CSSda `:visited` da geometriyani o'zgartiruvchi uslublarni qo'llashni taqiqlovchi cheklov mavjud. Bu yovuz sahifaning havolaga tashrif buyurilganligini tekshiradi va shu sababli maxfiylikni buzish uchun hech qanday yo'l yo'qligini kafolatlaydi.
```

## Xulosa

Sinflarni boshqarish uchun ikkita DOM xususiyati mavjud:

- `className` -- string qiymati, barcha sinflarni boshqarish uchun yaxshi. 
- `classList` -- obyekt `add/remove/toggle/contains` usullari bilan alohida sinflar uchun mos.

Stil, ya'ni uslublarni o'zgartirish:

- `style` xususiyati camelCased uslublariga ega obyektdir. Uni o'qish va yozish `"style"` atribyutidagi individual xususiyatlarni o'zgartirish bilan bir xil ma'noga ega. `important` va boshqa noyob narsalarni qanday qo'llashni ko'rish uchun [MDN] (mdn:api/CSSStyleDeclaration) da usullar ro'yxati mavjud.

- `style.cssText` xususiyati butun `"style"` atributiga, to`liq uslublar qatoriga mos keladi.

Yechilgan uslublarni o'qish uchun (barcha sinflarga nisbatan, barcha CSS qo'llanilgandan va yakuniy qiymatlar hisoblab chiqilgandan so'ng):

- `getComputedStyle(elem, [pseudo])` ular bilan uslubga o'xshash obyektni faqat o'qiladigan tarzda qaytaradi.
