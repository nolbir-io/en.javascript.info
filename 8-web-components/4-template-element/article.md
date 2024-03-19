
# Template elementi

O'rnatilgan `<template>` elementi HTML belgilash shablonlari uchun saqlash joyi bo'lib xizmat qiladi. Brauzer uning mazmunini e'tiborsiz qoldiradi, faqat sintaksisning haqiqiyligini tekshiradi, lekin biz boshqa elementlarni yaratish uchun JavaScriptga kirishimiz va undan foydalanishimiz mumkin.

Nazariy jihatdan, biz HTML belgilarini saqlash uchun HTMLning biron bir joyida har qanday ko'rinmas elementni yaratishimiz mumkin. `<template>` nimasi bilan ajralib turadi?

Birinchidan, hatto u odatda to'g'ri yopish tegini talab qilsa ham uning mazmuni har qanday to'g'ri HTML bo'lishi mumkin.

Masalan, biz u yerda `<tr>` jadval qatorini qo'shamiz:
```html
<template>
  <tr>
    <td>Contents</td>
  </tr>
</template>
```

Odatda, agar biz `<tr>` ni, aytaylik, `<div>` ichiga qo'yishga harakat qilsak, brauzer noto'g'ri DOM strukturasini aniqlaydi va uni "tuzatadi", atrofida `<table>` qo'shadi. Bu biz xohlagan narsa emas. Boshqa tomondan, `<template>` aynan biz joylashtirgan narsalarni saqlaydi.

Biz uslublar va skriptlarni `<template>`ga ham qo'yishimiz mumkin:

```html
<template>
  <style>
    p { font-weight: bold; }
  </style>
  <script>
    alert("Hello");
  </script>
</template>
```

Brauzer `<template>` mazmunini "hujjatdan tashqarida" deb hisoblaydi: uslublar qo'llanilmaydi, skriptlar bajarilmaydi, `<video autoplay>` ishga tushirilmaydi va hokazo.

Biz uni hujjatga kiritganimizda kontent jonli bo'ladi (uslublar qo'llaniladi, skriptlar ishlaydi va hokazo).

## Template kiritish

Shablon mazmuni uning `content` xususiyatida [DocumentFragment](info:modifying-document#document-fragment) -- DOM tugunining maxsus turi sifatida mavjud.

Biz uni har qanday boshqa DOM tugunlari sifatida ko'rib chiqishimiz mumkin, faqat bitta maxsus xususiyatdan tashqari: biz uni biror joyga kiritganimizda o'rniga uning bolalari kiritiladi.

Masalan:

```html run
<template id="tmpl">
  <script>
    alert("Hello");
  </script>
  <div class="message">Hello, world!</div>
</template>

<script>
  let elem = document.createElement('div');

*!*
  // Shablon tarkibini bir necha marta qayta ishlatish uchun klonlang
  elem.append(tmpl.content.cloneNode(true));
*/!*

  document.body.append(elem);
  // Endi <template> dagi skript ishlaydi
</script>
```

Oldingi bobdagi Shadow DOM misolini `<template>` yordamida qayta yozamiz:

```html run untrusted autorun="no-epub" height=60
<template id="tmpl">
  <style> p { font-weight: bold; } </style>
  <p id="message"></p>
</template>

<div id="elem">Click me</div>

<script>
  elem.onclick = function() {
    elem.attachShadow({mode: 'open'});

*!*
    elem.shadowRoot.append(tmpl.content.cloneNode(true)); // (*)
*/!*

    elem.shadowRoot.getElementById('message').innerHTML = "Hello from the shadows!";
  };
</script>
```

`(*)` qatoriga `tmpl.content` ni klonlash va kiritishda uning `DocumentFragment` sifatida uning o'rniga uning bolalari (`<style>`, `<p>`) kiritiladi.

Ular DOM soyasini hosil qiladi:

```html
<div id="elem">
  #shadow-root
    <style> p { font-weight: bold; } </style>
    <p id="message"></p>
</div>
```

## Xulosa

Xulosa qilsak:

- `<template>` kontent har qanday sintaktik to'g'ri HTML bo'lishi mumkin.
- `<template>` kontent "hujjatdan tashqari" deb hisoblanadi, shuning uchun u hech narsaga ta'sir qilmaydi.
- Biz JavaScriptdan `template.content` ga kira olamiz, uni yangi komponentda qayta ishlatish uchun klonlashimiz mumkin.

`<template>` tegi juda noyob, chunki:

- Brauzer o'z ichidagi HTML sintaksisini tekshiradi (skript ichidagi shablon qatoridan foydalanishdan farqli o'laroq).
- ...Ammo baribir har qanday yuqori darajadagi HTML teglaridan foydalanishga ruxsat beradi, hatto tegishli o'ramlarsiz (masalan, `<tr>`) mantiqiy bo'lmaganlaridan ham.
- Kontent interaktiv bo'ladi: hujjatga kiritilganda skriptlar ishga tushadi, `<video autoplay>` ishlaydi va hokazo.

`<template>` elementida iteratsiya mexanizmlari, ma'lumotlarni bog'lash yoki o'zgaruvchilarni almashtirish mavjud emas, lekin biz bularni uning ustida amalga oshirishimiz mumkin.
