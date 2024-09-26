# Shadow DOM uslubi

Shadow DOM `<style>` va `<link rel="stylesheet" href="...">` teglarini o'z ichiga olishi mumkin. Ikkinchi holda, uslublar jadvallari HTTP-keshlanadi, shuning uchun ular bir xil shablonni ishlatadigan bir nechta komponentlar uchun qayta yuklab olinmaydi.

Umumiy qoida sifatida mahalliy uslublar faqat shadow tree ichida ishlaydi, hujjat uslublari esa undan tashqarida. Ammo bir nechta istisnolar mavjud.

## :host

`:host` selektori soya hostini (soya daraxtini o'z ichiga olgan element) tanlash imkonini beradi.

Masalan, biz markazda bo'lishi kerak bo'lgan `<custom-dialog>` elementini yaratmoqdamiz. Buning uchun biz `<custom-dialog>` elementining o'zini uslublashimiz kerak.

`:host` aynan shunday qiladi:

```html run autorun="no-epub" untrusted height=80
<template id="tmpl">
  <style>
    /* uslub ichkaridan moslashtirilgan dialog elementiga qo'llaniladi */
    :host {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <slot></slot>
</template>

<script>
customElements.define('custom-dialog', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'}).append(tmpl.content.cloneNode(true));
  }
});
</script>

<custom-dialog>
  Hello!
</custom-dialog>
```

## Kaskad (Cascading)

Soya host (`<custom-dialog>` o'zi) yorug'lik DOMda joylashgan, shuning uchun unga CSS hujjat qoidalari ta'sir qiladi.

Hujjatda ham, `:host` ham mahalliy sifatida uslublangan xususiyat mavjud bo'lsa, hujjat uslubi ustunlikka ega bo'ladi.

Masalan, agar hujjatda quyidagilar bo'lsa:
```html
<style>
custom-dialog {
  padding: 0;
}
</style>
```
...Keyin `<custom-dialog>` to'ldirishsiz bo'ladi.

Bu juda qulay, chunki biz uning `:host` qoidasida "standart" komponent uslublarini o'rnatishimiz va keyin ularni hujjatda osongina bekor qilishimiz mumkin.

Istisno mahalliy xususiyat `!important` deb belgilangan bo'lsa, bunday xususiyatlar uchun mahalliy uslublar ustunlik qiladi.


## :host(selector)

`:host` bilan bir xil, lekin faqat soya xosti `selector` bilan mos kelsagina qo'llaniladi.

Masalan, biz `<custom-dialog>`ni faqat `centered` atribyutiga ega bo'lsa, markazlashtirmoqchimiz:

```html run autorun="no-epub" untrusted height=80
<template id="tmpl">
  <style>
*!*
    :host([centered]) {
*/!*
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-color: blue;
    }

    :host {
      display: inline-block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <slot></slot>
</template>

<script>
customElements.define('custom-dialog', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'}).append(tmpl.content.cloneNode(true));
  }
});
</script>


<custom-dialog centered>
  Centered!
</custom-dialog>

<custom-dialog>
  Not centered.
</custom-dialog>
```

Endi qo'shimcha markazlashtirish uslublari faqat birinchi dialog oynasiga qo'llaniladi: `<custom-dialog centered>`.

Xulosa qilib aytganda, komponentning asosiy elementini uslublash uchun `:host`- selektorlar oilasidan foydalanishimiz mumkin. Ushbu uslublar (agar `!important` bo`lmasa) hujjat tomonidan bekor qilinishi mumkin.

## Slotli kontentni uslublash

Endi uyalar (slot) bilan bog'liq vaziyatni ko'rib chiqaylik.

Slotli elementlar engil DOM dan keladi, shuning uchun ular hujjat uslublaridan foydalanadilar. Mahalliy uslublar ajratilgan tarkibga ta'sir qilmaydi.

Quyidagi misolda, tirqishli `<span>` hujjat uslubiga ko'ra qalin, lekin mahalliy uslubdan `background` olinmaydi:
```html run autorun="no-epub" untrusted height=80
<style>
*!*
  span { font-weight: bold }
*/!*
</style>

<user-card>
  <div slot="username">*!*<span>John Smith</span>*/!*</div>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
*!*
      span { background: red; }
*/!*
      </style>
      Name: <slot name="username"></slot>
    `;
  }
});
</script>
```

Natija qalin, ammo qizil emas.

Agar biz komponentimizdagi tirqishli (slotted) elementlarni uslublashni istasak, ikkita variant mavjud.

Birinchidan, biz `<slot>` ning o'zini uslublashimiz va CSS merosiga tayanishimiz mumkin:

```html run autorun="no-epub" untrusted height=80
<user-card>
  <div slot="username">*!*<span>John Smith</span>*/!*</div>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
*!*
      slot[name="username"] { font-weight: bold; }
*/!*
      </style>
      Name: <slot name="username"></slot>
    `;
  }
});
</script>
```

Bu yerda `<p>Jon Smit</p>` qalin bo'ladi, chunki CSS merosi `<slot>` va uning mazmuni o'rtasida amal qiladi. Ammo CSSning o'zida barcha xususiyatlar meros qilib olinmaydi. 

Yana bir variant `::slotted(selector)` psevdo-sinfdan foydalanishdir. U ikkita shart asosida elementlarga mos keladi:

1. Bu tirqishli element bo'lib, yorug'lik DOM dan keladi. Slot nomi muhim emas. Har qanday tirqishli element, lekin faqat elementning o'zi, uning bolalari emas.
2. Element `selector` ga mos keladi.

Bizning misolimizda `::slotted(div)` aynan `<div slot="username">`ni tanlaydi, lekin uning bolalarini emas:

```html run autorun="no-epub" untrusted height=80
<user-card>
  <div slot="username">
    <div>John Smith</div>
  </div>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
*!*
      ::slotted(div) { border: 1px solid red; }
*/!*
      </style>
      Name: <slot name="username"></slot>
    `;
  }
});
</script>
```

Esda tuting, `::slotted` selektori slotga boshqa tusha olmaydi. Bu selektorlar yaroqsiz:

```css
::slotted(div span) {
  /* bizning tirqishli <div> bunga mos kelmaydi */
}

::slotted(div) p {
  /* yorug'lik DOM ichiga kira olmaydi */
}
```

Bundan tashqari, `::slotted` faqat CSSda ishlatilishi mumkin. Biz uni `querySelector` da ishlata olmaymiz.

## Maxsus xususiyatlarga ega CSS ilgaklari

Asosiy hujjatdagi komponentning ichki elementlarini qanday qilib uslublaymiz?

`:host` kabi selektorlar `<custom-dialog>` yoki `<user-card>` uchun qoidalarni qo'llaydi, lekin ularning ichida soyali DOM elementlarini qanday uslublash kerak?

Hujjatdagi soyali DOM uslublariga bevosita ta'sir ko'rsatadigan selektor yo'q. Ammo biz komponentimiz bilan o'zaro ta'sir qilish usullarini oshkor qilganimizdek, uni uslublash uchun CSS o'zgaruvchilarini (maxsus CSS xususiyatlari) ochishimiz mumkin.

**Maxsus CSS xususiyatlari barcha darajalarda ham yorug'lik, ham soyada mavjud.**

Masalan, soyali DOM da biz `--user-card-field-color` CSS o'zgaruvchisidan maydonlarni uslublash uchun foydalanishimiz mumkin va tashqi hujjat uning qiymatini belgilaydi:

```html
<style>
  .field {
    color: var(--user-card-field-color, black);
    /* agar --user-card-field-color aniqlanmagan bo'lsa, qora rangdan foydalaning */
  }
</style>
<div class="field">Name: <slot name="username"></slot></div>
<div class="field">Birthday: <slot name="birthday"></slot></div>
```

Keyin biz ushbu xususiyatni `<user-card>` uchun tashqi hujjatda e'lon qilishimiz mumkin:

```css
user-card {
  --user-card-field-color: green;
}
```

Maxsus CSS xususiyatlari soyali DOM orqali o'tadi, ular hamma joyda ko'rinadi, shuning uchun ichki `.field` qoidasi undan foydalanadi.

Mana to'liq misol:

```html run autorun="no-epub" untrusted height=80
<style>
*!*
  user-card {
    --user-card-field-color: green;
  }
*/!*
</style>

<template id="tmpl">
  <style>
*!*
    .field {
      color: var(--user-card-field-color, black);
    }
*/!*
  </style>
  <div class="field">Name: <slot name="username"></slot></div>
  <div class="field">Birthday: <slot name="birthday"></slot></div>
</template>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.append(document.getElementById('tmpl').content.cloneNode(true));
  }
});
</script>

<user-card>
  <span slot="username">John Smith</span>
  <span slot="birthday">01.01.2001</span>
</user-card>
```



## Xulosa

Shadow DOM `<style>` yoki `<link rel="stylesheet">` kabi uslublarni o`z ichiga olishi mumkin.

Mahalliy uslublar ta'sir qilishi mumkin:
- soya daraxti,
- `:host` va `:host()` psevdoklasslari bilan soyali host,
- tirqishli elementlar (yengil DOM dan keladi), `::slotted(selector)` tirqishli elementlarni o'zlari tanlash imkonini beradi, lekin ularning bolalarini emas.

Hujjat uslublari quyidagilarga ta'sir qilishi mumkin:
- soya hosti (tashqi hujjatda joylashgani kabi)
- tirqishli elementlar va ularning mazmuni (bu tashqi hujjatda ham mavjud)

Agar CSS xususiyatlari ziddiyatli va `!important` deb belgilanmagan bo'lsa, odatda hujjat uslublari ustunlikka ega bo'ladi. Keyin mahalliy uslublar ustunlikka ega.

CSS maxsus xususiyatlari soyali DOM orqali o'tadi. Ular komponentni shakllantirish uchun "ilgaklar" sifatida ishlatiladi:

1. Komponent `var(--component-name-title, <default value>)` kabi asosiy elementlarni uslublash uchun maxsus CSS xususiyatidan foydalanadi.
2. Komponent muallifi ushbu xususiyatlarni ishlab chiquvchilar uchun nashr etadi, ular boshqa ommaviy komponent usullari bilan bir xil ahamiyatga ega.
3. Ishlab chiquvchi sarlavhani uslublashni xohlasa, ular soya xostiga yoki undan yuqorisiga `--component-name-title` CSS xususiyatini tayinlaydi.
4. Foyda!
