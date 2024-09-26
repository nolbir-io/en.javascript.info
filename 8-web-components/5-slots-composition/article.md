# Shadow DOM uyalari, kompozitsiya

Yorliqlar, menyular, rasm galereyalari va boshqalar kabi komponentlarning ko'p turlari ko'rsatish uchun tarkibga muhtoj.

Xuddi o'rnatilgan brauzer `<select>` `<option>` elementlarini kutganidek, bizning `<custom-tabs>` tab mazmunining haqiqiy uzatilishini va `<custom-menu>` menyu elementlarini kutishi mumkin.

`<custom-menu>` dan foydalanadigan kod quyidagicha ko'rinishga ega:

```html
<custom-menu>
  <title>Candy menu</title>
  <item>Lollipop</item>
  <item>Fruit Toast</item>
  <item>Cup Cake</item>
</custom-menu>
```

...Keyin bizning komponentimiz uni to'g'ri ko'rsatishi kerak, berilgan sarlavha va elementlarga ega bo'lgan chiroyli menyu, menyu voqealarini boshqarish va hokazo.

Uni qanday amalga oshirish lozim?

Biz element tarkibini tahlil qilishga va DOM tugunlarini dinamik ravishda nusxalashga-qayta tartibga solishga harakat qilamiz. Bu mumkin, lekin agar biz elementlarni DOM soyasiga o'tkazayotgan bo'lsak, hujjatdagi CSS uslublari u yerda qo'llanilmaydi, shuning uchun vizual uslub yo'qolishi mumkin. Bundan tashqari, bu ba'zi kodlashni talab qiladi.

Yaxshiyamki, bunday qilishimiz shart emas. Shadow DOM `<slot>` elementlarini qo'llab-quvvatlaydi, ular avtomatik ravishda yorug'lik DOM dan tarkib bilan to'ldiriladi.

## Nomlangan uyalar (Named slots)

Keling, uyalar qanday ishlashini oddiy misolda ko'rib chiqaylik.

Bu yerda `<user-card>` soya DOM yorug'lik DOMdan to'ldirilgan ikkita uyani taqdim etadi:

```html run autorun="no-epub" untrusted height=80
<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <div>Name:
*!*
        <slot name="username"></slot>
*/!*
      </div>
      <div>Birthday:
*!*
        <slot name="birthday"></slot>
*/!*
      </div>
    `;
  }
});
</script>

<user-card>
  <span *!*slot="username"*/!*>John Smith</span>
  <span *!*slot="birthday"*/!*>01.01.2001</span>
</user-card>
```

DOM soyasida `<slot name="X">` "qo'shish nuqtasini" belgilaydi, bu `slot="X"`li elementlar ko'rsatiladigan joy.

Keyin brauzer "kompozitsiya" ni amalga oshiradi: u yorug'lik DOM dan elementlarni oladi va ularni DOM soyasining mos keladigan joylarida ko'rsatadi. Oxir-oqibat, biz xohlagan ma'lumotlar bilan to'ldirilishi mumkin bo'lgan komponentga egamiz.

Skriptdan keyingi DOM tuzilishi kompozitsiyani hisobga olmagan holda:

```html
<user-card>
  #shadow-root
    <div>Name:
      <slot name="username"></slot>
    </div>
    <div>Birthday:
      <slot name="birthday"></slot>
    </div>
  <span slot="username">John Smith</span>
  <span slot="birthday">01.01.2001</span>
</user-card>
```

Biz DOM soyasini yaratdik, shuning uchun u `#shadow-root` ostida. Endi elementda yorug'lik va soya DOM mavjud.

Renderlash maqsadida, soyali DOMdagi har bir `<slot name="...">` uchun brauzer DOM yorug'ligida bir xil nomdagi `slot="..."` ni qidiradi. Ushbu elementlar uyalar ichida ko'rsatilgan:

![](shadow-dom-user-card.svg)

Natija "tekislangan" DOM deb ataladi:

```html
<user-card>
  #shadow-root
    <div>Name:
      <slot name="username">
        <!-- tirqishli element uyaga kiritiladi -->
        <span slot="username">John Smith</span>
      </slot>
    </div>
    <div>Birthday:
      <slot name="birthday">
        <span slot="birthday">01.01.2001</span>
      </slot>
    </div>
</user-card>
```

...Lekin tekislangan DOM faqat renderlash va hodisalarni boshqarish uchun mavjud. Bu "virtual". Hamma narsa shunday ko'rsatiladi, lekin hujjatdagi tugunlar aslida harakatlanmaydi!

Agar biz `querySelectorAll` ni ishga tushirsak, buni osongina tekshirish mumkin: tugunlar hali ham o'z joylarida.

```js
// yengil DOM <span> tugunlari hali ham bir joyda, `<user-card>` ostida
alert( document.querySelectorAll('user-card span').length ); // 2
```

Shunday qilib, tekislangan DOM uyalar kiritish orqali soyali DOMdan olingan. Brauzer uni ko'rsatadi va uslublarni meros qilib olish, hodisalarni tarqatish uchun foydalanadi (bu haqda keyinroq). Ammo JavaScript tekislashdan oldin hujjatni "xuddi shunday" ko'radi.

````warn header="Faqat yuqori darajadagi bolalar slot=\"...\" atributiga ega bo'lishi mumkin"
`Slot="..."` atributi faqat soyali hostning bevosita bolalari uchun amal qiladi (bizning misolimizda `<user-card>` elementi). Ichki elementlar uchun u e'tiborga olinmaydi.

Masalan, bu yerda ikkinchi `<span>` e'tiborga olinmaydi (chunki u `<user-card>` ning yuqori darajali bolasi emas):
```html
<user-card>
  <span slot="username">John Smith</span>
  <div>
    <!-- yaroqsiz slot, user-cardning bevosita bolasi bo'lishi kerak -->
    <span slot="birthday">01.01.2001</span>
  </div>
</user-card>
```
````

Agar yorug'lik DOMda bir xil slot nomiga ega bir nechta elementlar mavjud bo'lsa, ular birin-ketin uyaga qo'shiladi.

Masalan, quyidagi kabi:

```html
<user-card>
  <span slot="username">John</span>
  <span slot="username">Smith</span>
</user-card>
```

Bu yassilangan DOMni `<slot name="username">` ichidagi ikkita element bilan beradi:

```html
<user-card>
  #shadow-root
    <div>Name:
      <slot name="username">
        <span slot="username">John</span>
        <span slot="username">Smith</span>
      </slot>
    </div>
    <div>Birthday:
      <slot name="birthday"></slot>
    </div>
</user-card>
```

## Slot zaxira tarkibi

Agar biz `<slot>` ichiga biror narsa qo'ysak, u zaxira, "default" tarkibga aylanadi. Brauzer yorug'lik DOMda mos keladigan to'ldiruvchi bo'lmasa, buni ko'rsatadi.

Masalan, DOM soyasining ushbu qismida, agar ochiq DOMda `slot="username"` bo'lmasa, `Anonymous` ko'rsatiladi.

```html
<div>Name:
  <slot name="username">Anonymous</slot>
</div>
```

## Birlamchi uyasi: birinchi nomsiz (Default slot: first unnamed)

Soya DOMda nomi bo'lmagan birinchi `<slot>` bu "standart" slotdir. U yorug'lik DOM dan boshqa joyga o'rnatilmagan barcha tugunlarni oladi.

Misol uchun, foydalanuvchi haqidagi barcha o'rinsiz ma'lumotlarni ko'rsatadigan `<user-card>` ga standart slotni qo'shamiz:

```html run autorun="no-epub" untrusted height=140
<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
    <div>Name:
      <slot name="username"></slot>
    </div>
    <div>Birthday:
      <slot name="birthday"></slot>
    </div>
    <fieldset>
      <legend>Other information</legend>
*!*
      <slot></slot>
*/!*
    </fieldset>
    `;
  }
});
</script>

<user-card>
*!*
  <div>I like to swim.</div>
*/!*
  <span slot="username">John Smith</span>
  <span slot="birthday">01.01.2001</span>
*!*
  <div>...And play volleyball too!</div>
*/!*
</user-card>
```

Barcha ajratilmagan DOM tarkibi "Boshqa ma'lumotlar" maydoniga kiradi.

Elementlar birin-ketin uyaga qo'shiladi, shuning uchun ikkala tirqishsiz ma'lumot bo'lagi ham standart uyada joylashgan.

Yassilangan DOM quyidagicha ko'rinadi:

```html
<user-card>
  #shadow-root
    <div>Name:
      <slot name="username">
        <span slot="username">John Smith</span>
      </slot>
    </div>
    <div>Birthday:
      <slot name="birthday">
        <span slot="birthday">01.01.2001</span>
      </slot>
    </div>
    <fieldset>
      <legend>Other information</legend>
*!*
      <slot>
        <div>I like to swim.</div>
        <div>...And play volleyball too!</div>
      </slot>
*/!*
    </fieldset>
</user-card>
```

## Menyu misoli

Endi bob boshida tilga olingan `<custom-menu>`ga qaytaylik.

Elementlarni tarqatish uchun biz slotlardan foydalanishimiz mumkin.

Mana `<custom-menu>` uchun belgi:

```html
<custom-menu>
  <span slot="title">Candy menu</span>
  <li slot="item">Lollipop</li>
  <li slot="item">Fruit Toast</li>
  <li slot="item">Cup Cake</li>
</custom-menu>
```

Tegishli slotlarga ega soyali DOM shabloni:

```html
<template id="tmpl">
  <style> /* menu styles */ </style>
  <div class="menu">
    <slot name="title"></slot>
    <ul><slot name="item"></slot></ul>
  </div>
</template>
```

1. `<span slot="title">` `<slot name="title">` ichiga kiradi.
2. `<custom-menu>`da juda ko'p `<li slot="item">` bor, ammo shablonda faqat bitta `<slot name="item">` mavjud. Shunday qilib, bu kabi barcha `<li slot="item">` birin-ketin `<slot name="item">` ga qo'shiladi va shu bilan ro'yxat hosil bo'ladi.

Yassilangan DOM quyidagicha bo'ladi:

```html
<custom-menu>
  #shadow-root
    <style> /* menu styles */ </style>
    <div class="menu">
      <slot name="title">
        <span slot="title">Candy menu</span>
      </slot>
      <ul>
        <slot name="item">
          <li slot="item">Lollipop</li>
          <li slot="item">Fruit Toast</li>
          <li slot="item">Cup Cake</li>
        </slot>
      </ul>
    </div>
</custom-menu>
```

Yaroqli DOMda `<li>` `<ul>` ning bevosita bolasi bo'lishi kerakligini payqash mumkin. Lekin bu yassilangan DOM, u komponent qanday ko'rsatilishini tasvirlaydi, bu yerda bunday narsa tabiiy ravishda sodir bo'ladi.

Biz ro'yxatni ochish/yopish uchun `click` ishlov beruvchisini qo'shishimiz kerak va `<custom-menu>` tayyor:

```js
customElements.define('custom-menu', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});

    // tmpl soyali DOM shablonidir (yuqorida)
    this.shadowRoot.append( tmpl.content.cloneNode(true) );

    // biz yengil DOM tugunlarini tanlay olmaymiz, shuning uchun uyaga bosish bilan ishlov beraylik
    this.shadowRoot.querySelector('slot[name="title"]').onclick = () => {
      // menyuni ochish/yopish
      this.shadowRoot.querySelector('.menu').classList.toggle('closed');
    };
  }
});
```

Quyida to'liq namuna keltirilgan:

[iframe src="menu" height=140 edit]

Albatta, biz unga qo'shimcha hodisalar, usullar va boshqa funktsiyalarni qo'shishimiz mumkin.

## Slotlarni yangilash

Agar tashqi kod menyu elementlarini dinamik ravishda qo'shish/o'chirishni xohlasa nima bo'ladi?

**Brauzer slotlarni kuzatib boradi va agar tirqishli elementlar qo'shilsa/o'chirilgan bo'lsa, tasvirni yangilaydi.**

Bundan tashqari, yengil DOM tugunlaridan nusxa ko'chirilmaydi, balki faqat slotlarda ko'rsatiladi, ular ichidagi o'zgarishlar darhol ko'rinadi.

Shunday qilib, renderni yangilash uchun hech narsa qilishimiz shart emas. Agar komponent kodi slot o'zgarishlari haqida bilmoqchi bo'lsa, u holda `slotchange` hodisasi mavjud.

Masalan, bu yerda menyu elementi 1 soniyadan keyin dinamik ravishda kiritiladi va sarlavha 2 soniyadan keyin o'zgaradi:

```html run untrusted height=80
<custom-menu id="menu">
  <span slot="title">Candy menu</span>
</custom-menu>

<script>
customElements.define('custom-menu', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div class="menu">
      <slot name="title"></slot>
      <ul><slot name="item"></slot></ul>
    </div>`;

    // shadowRoot voqea ishlov beruvchilariga ega emas, shuning uchun birinchi child dan foydalaning
    this.shadowRoot.firstElementChild.addEventListener('slotchange',
      e => alert("slotchange: " + e.target.name)
    );
  }
});

setTimeout(() => {
  menu.insertAdjacentHTML('beforeEnd', '<li slot="item">Lollipop</li>')
}, 1000);

setTimeout(() => {
  menu.querySelector('[slot="title"]').innerHTML = "New menu";
}, 2000);
</script>
```

Ko'rsatuvchi menyu har safar bizning aralashuvimizsiz yangilanadi.

Bu yerda ikkita `slotchange` hodisasi mavjud:

1. Boshlashda:

     `slotchange: title` darhol ishga tushadi, chunki yorug'lik DOMdan `slot="title"` mos keladigan uyaga tushadi.
2. 1 soniyadan keyin:

     Yangi `<li slot="item">` qo'shilganda `slotchange: element` ishga tushadi.

Esda tuting: `slot="title"` mazmuni o'zgartirilganda 2 soniyadan so'ng `slotchange` hodisasi bo'lmaydi. Buning sababi, slot o'zgarishi yo'q. Biz tirqishli element ichidagi tarkibni o'zgartiramiz, bu boshqa narsa.

Agar biz DOM yorug'ligining ichki modifikatsiyalarini JavaScriptdan kuzatmoqchi bo'lsak, buni umumiyroq mexanizm yordamida ham bajarish mumkin: [MutationObserver](info:mutation-observer).

## Slot API

Va nihoyat, slot bilan bog'liq JavaScript usullarini eslatib o'tamiz.

Yuqorida aytib o'tganimizdek, JavaScript "haqiqiy" DOMga tekislanmasdan qaraydi. Agar soya daraxtida `{mode: 'open'}` bo'lsa, unda biz uyaga qaysi elementlar tayinlanganligini va aksincha, uning ichidagi element bo'yicha slotni aniqlashimiz mumkin:

- `node.assignedSlot` -- `node` tayinlangan `<slot>` elementini qaytaradi.
- `slot.assignedNodes({flatten: true/false})` -- Slotga tayinlangan DOM tugunlari. Sukut bo'yicha `flatten` parametri `false` hisoblanadi. Agar `true` aniq o'rnatilgan bo'lsa, u yassilangan DOMga chuqurroq qaraydi, agar ichki komponentlar o'rnatilgan bo'lsa, ichki o'rnatilgan slotlarni va tugun belgilanmagan bo'lsa, zaxira kontentni qaytaradi.
- `slot.assignedElements({flatten: true/false})` -- Slotga tayinlangan DOM elementlari (yuqoridagi kabi, faqat element tugunlari).

Ushbu usullar bizga faqat ajratilgan tarkibni ko'rsatish emas, balki uni JavaScriptda kuzatish kerak bo'lganda foydalidir.

Masalan, agar `<custom-menu>` komponenti nimani ko'rsatayotganini bilmoqchi bo'lsa, u `slotchange` ni kuzatishi va `slot.assignedElements` dan elementlarni olishi mumkin:

```html run untrusted height=120
<custom-menu id="menu">
  <span slot="title">Candy menu</span>
  <li slot="item">Lollipop</li>
  <li slot="item">Fruit Toast</li>
</custom-menu>

<script>
customElements.define('custom-menu', class extends HTMLElement {
  items = []

  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div class="menu">
      <slot name="title"></slot>
      <ul><slot name="item"></slot></ul>
    </div>`;

    // Slot tarkibi o'zgarganda tetiklanadi
*!*
    this.shadowRoot.firstElementChild.addEventListener('slotchange', e => {
      let slot = e.target;
      if (slot.name == 'item') {
        this.items = slot.assignedElements().map(elem => elem.textContent);
        alert("Items: " + this.items);
      }
    });
*/!*
  }
});

// elementlar 1 soniyadan keyin yangilanadi
setTimeout(() => {
  menu.insertAdjacentHTML('beforeEnd', '<li slot="item">Cup Cake</li>')
}, 1000);
</script>
```


## Xulosa

Odatda, agar elementda DOM soyasi bo'lsa, undagi yorug'lik DOM ko'rsatilmaydi. Slotlar DOM soyasining belgilangan joylarida yengil DOM elementlarini ko'rsatishga imkon beradi.

Ikki xil slot mavjud:

- Nomlangan uyalar: `<slot name="X">...</slot>` -- `slot="X"` bilan yengil bolalarni oladi.
- Standart slot: nomsiz birinchi `<slot>` (keyingi nomsiz uyalar e'tiborga olinmaydi) -- tirqishsiz yorug'lik bolalarini oladi.
- Agar bir xil slot uchun elementlar ko'p bo'lsa -- ular ketma-ket qo'shiladi.
- `<slot>` elementining mazmuni zaxira sifatida ishlatiladi. Slot uchun yengil bolalar bo'lmasa ko'rsatiladi.

Slotli elementlarni ularning slotlari ichida ko'rsatish jarayoni "kompozitsiya", natija "tekislangan DOM" deb ataladi.

Tarkibi tugunlarni ko'chirmaydi, JavaScript nuqtai nazaridan DOM hali ham bir xil.

JavaScript quyidagi usullar yordamida slotlarga kirishi mumkin:
- `slot.assignedNodes/Elements()` -- `slot` ichidagi tugunlarni/elementlarni qaytaradi.
- `node.assignedSlot` -- teskari xususiyat, tugun bo'yicha slotni qaytaradi.

Agar biz nimani ko'rsatayotganimizni bilmoqchi bo'lsak, biz slot tarkibini quyidagi yordamida kuzatishimiz mumkin:
- `slotchange` hodisasi -- slot birinchi marta to'ldirilganda va har qanday qo'shish/o'chirish/almashtirishda tirqishli elementni ishga tushiradi, lekin uning bolalari emas. Slot - `event.target`.
- [MutationObserver](info:mutation-observer) slot tarkibiga chuqurroq kirib, undagi o'zgarishlarni kuzating.

Endi DOM soyasida yorug'lik DOM elementlarini qanday ko'rsatishni bilganimizdan so'ng, ularni qanday qilib to'g'ri shakllantirishni ko'rib chiqamiz. Asosiy qoida shundaki, soya elementlari ichkarida, yorug'lik elementlari esa tashqarida, ammo sezilarli istisnolar mavjud.

Tafsilotlarni keyingi bobda ko'ramiz.
