
# Maxsus elementlar

Biz o'z uslublari va xususiyatlari, hodisalari va boshqalar bilan sinfimiz tomonidan tasvirlangan maxsus HTML elementlarini yaratishimiz mumkin.

Maxsus element aniqlangandan so'ng, biz uni o'rnatilgan HTML elementlari bilan teng ravishda ishlatishimiz mumkin.

Bu ajoyib, chunki HTML lug'ati boy, lekin cheksiz emas. `<easy-tabs>`, `<sliding-carousel>`, `<beautiful-upload>` mavjud emas... Bizga kerak bo'lishi mumkin bo'lgan boshqa teg haqida o'ylab ko'ring.

Biz ularni maxsus sinf bilan belgilashimiz va keyin ularni har doim HTMLning bir qismi bo'lgandek ishlatishimiz mumkin.

Maxsus elementlarning ikki turi mavjud:

1. **Avtonom moslashtirilgan elementlar** -- mavhum `HTMLElement` sinfini kengaytiruvchi "butunlay yangi" elementlar.
2. **Moslashtirilgan ichki elementlar** -- `HTMLButtonElement` va hokazolar asosida moslashtirilgan tugma kabi o'rnatilgan elementlarni kengaytirish.

Avval avtonom elementlarni ko'rib chiqamiz, so'ngra moslashtirilgan o'rnatilgan elementlarga o'tamiz.

Maxsus element yaratish uchun biz brauzerga u haqida bir nechta tafsilotlarni aytib berishimiz kerak: uni qanday ko'rsatish, element sahifaga qo'shilganda yoki o'chirilganda nima qilish lozimligi va hokazo.

Bu maxsus usullar bilan sinf yaratish orqali amalga oshiriladi. Bu juda oson, chunki bir nechta usullar mavjud va ularning barchasi ixtiyoriy.

Quyida to'liq ro'yxat bilan eskiz keltirilgan:

```js
class MyElement extends HTMLElement {
  constructor() {
    super();
    // element yaratilgan
  }

  connectedCallback() {
    // element hujjatga qo'shilganda brauzer ushbu usulni chaqiradi
     // (agar element qayta-qayta qo'shilsa/o'chirilgan bo'lsa, ko'p marta chaqirilishi mumkin)
  }

  disconnectedCallback() {
     // element hujjatdan olib tashlanganida brauzer ushbu usulni chaqiradi
     // (agar element qayta-qayta qo'shilsa/o'chirilgan bo'lsa, ko'p marta chaqirilishi mumkin)
  }

  static get observedAttributes() {
    return [/* o'zgarishlarni kuzatish uchun atribut nomlari qatori */];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // yuqorida sanab o'tilgan atributlardan biri o'zgartirilganda chaqiriladi
  }

  adoptedCallback() {
     // element yangi hujjatga ko'chirilganda chaqiriladi
     // (document.adoptNode da sodir bo'ladi, juda kam ishlatiladi)
  }

  // boshqa element usullari va xususiyatlari bo'lishi mumkin
}
```

Shundan so'ng biz elementni ro'yxatdan o'tkazishimiz kerak:

```js
// brauzerga <my-element>-ga bizning yangi sinfimiz tomonidan xizmat qilishini bildiring 
customElements.define("my-element", MyElement);
```

Endi `<my-element>` tegli har qanday HTML elementlari uchun `MyElement` namunasi yaratiladi va yuqorida aytib o'tilgan usullar chaqiriladi. Shuningdek, biz JavaScriptda `document.createElement('mey-element')` ni yaratishimiz mumkin.

```smart header="Maxsus element nomi defisdan iborat bo'lishi kerak `-`"
Maxsus element nomi defis `-` bo'lishi kerak, masalan, `my-elemnt` va `supper-button` haqiqiy nomlar, lekin `myelement` emas.

Bu o'rnatilgan va maxsus HTML elementlari o'rtasida nom ziddiyatlari bo'lmasligini ta'minlash uchun mo'ljallangan.
```

## Namuna: "time-formatted"

Masalan, HTMLda sana/vaqt uchun `<time>` elementi allaqachon mavjud. Lekin u o'z-o'zidan formatlashni amalga oshirmaydi.

Keling, vaqtni chiroyli, tilni biladigan formatda ko'rsatadigan `<time-formatted>` elementini yarataylik: 


```html run height=50 autorun="no-epub"
<script>
*!*
class TimeFormatted HTMLElementni kengaytiradi { // (1)
*/!*

  connectedCallback() {
    let date = new Date(this.getAttribute('datetime') || Date.now());

    this.innerHTML = new Intl.DateTimeFormat("default", {
      year: this.getAttribute('year') || undefined,
      month: this.getAttribute('month') || undefined,
      day: this.getAttribute('day') || undefined,
      hour: this.getAttribute('hour') || undefined,
      minute: this.getAttribute('minute') || undefined,
      second: this.getAttribute('second') || undefined,
      timeZoneName: this.getAttribute('time-zone-name') || undefined,
    }).format(date);
  }

}

*!*
customElements.define("time-formatted", TimeFormatted); // (2)
*/!*
</script>

<!-- (3) -->
*!*
<time-formatted datetime="2019-12-01"
*/!*
  year="numeric" month="long" day="numeric"
  hour="numeric" minute="numeric" second="numeric"
  time-zone-name="short"
></time-formatted>
```

1. Sinfda faqat bitta `connectedCallback()` usuli mavjud -- sahifaga `<time-formatted>` elementi qo'shilganda (yoki HTML tahlilchisi uni aniqlaganda) brauzer uni chaqiradi va u o'rnatilgan [Intl-dan foydalanadi. .DateTimeFormat](mdn:/JavaScript/Reference/Global_Objects/DateTimeFormat) yaxshi formatlangan vaqtni ko'rsatish uchun brauzerlarda yaxshi qo'llab-quvvatlanadigan ma'lumotlar formatlagichi hisoblanadi.
2. Biz yangi elementimizni `customElements.define(tag, class)` orqali ro'yxatdan o'tkazishimiz kerak.
3. Va keyin biz undan hamma joyda foydalanishimiz mumkin.


```smart header="Shaxsiy elementlarni yangilash"
Agar brauzer `customElements.define` dan oldin `<time-formatted>` elementlarga duch kelsa, bu xato emas. Lekin element har qanday nostandart teg kabi hali noma'lum. 

Bunday `undefined` elementlarni CSS selektori `:not(:defined)` yordamida uslublash mumkin.

`customElement.define` chaqirilganda, ular "yangilanadi": `TimeFormatted` ning yangi namunasi
har biri uchun yaratiladi va `connectedCallback` chaqiriladi. Ular `:defined` ga aylanadi.

Maxsus elementlar haqida ma'lumot olish uchun quyidagi usullar mavjud:
- `customElements.get(name)` -- berilgan `name` bilan maxsus element uchun sinfni qaytaradi,
- `customElements.whenDefined(name)` -- berilgan `name` bilan moslashtirilgan element aniqlanganda hal qiluvchi (qiymatsiz) promiseni qaytaradi. 
```

```smart header="`ConnectedCallback`da ko'rsatilmoqda, `construktor`da emas`"
Yuqoridagi misolda element tarkibi `connectedCallback` da ko'rsatilgan (yaratilgan).

Nima uchun `construktor` da emas?

Sababi oddiy: `construktor` ni chaqirishga hali erta. Element yaratildi, lekin brauzer bu bosqichda atributlarni hali qayta ishlamadi/tayinlamadi: `getAttribute` ga qo'ng'iroqlar `null` ni qaytaradi. Shunday qilib, biz u yerda render qila olmaymiz.

Bundan tashqari, agar siz bu haqda o'ylab ko'rsangiz, ishlash nuqtai nazaridan yaxshiroq - ishni haqiqatan ham kerak bo'lguncha kechiktirishingiz mumkin.

`ConnectedCallback` element hujjatga qo'shilganda ishga tushadi. Boshqa elementga qo'shilgan child emas, balki sahifaning bir qismiga aylanadi. Shunday qilib, biz alohida DOM qurishimiz, elementlarni yaratishimiz va ularni keyinchalik foydalanish uchun tayyorlashimiz mumkin. Ular faqat sahifaga kiritilganda ko'rsatiladi.
```

## Atribyutlarni kuzatish

`<time-formatted>` joriy tatbiqida, element ko'rsatilgandan so'ng, boshqa atribyut o'zgarishlari ta'sir qilmaydi. Bu HTML elementi uchun noodatiy. Odatda, `a.href` kabi atribyutni o'zgartirganimizda, o'zgarish darhol ko'rinib turishini kutamiz. Keling, buni tuzataylik.

`observedAttributes()` statik qabul qiluvchida ularning ro'yxatini taqdim etish orqali atribyutlarni kuzatishimiz mumkin. Bunday atribyutlar uchun ular o'zgartirilganda `attributeChangedCallback` chaqiriladi. U boshqa, ro'yxatga olinmagan atribyutlar uchun ishga tushmaydi (bu samaradorlik sabablari bilan bog'liq).

Mana yangi `<time-formatted>`, atribyutlar o'zgarganda avtomatik yangilanadi:

```html run autorun="no-epub" height=50
<script>
class TimeFormatted HTMLElement ni kengaytiradi {

*!*
  render() { // (1)
*/!*
    let date = new Date(this.getAttribute('datetime') || Date.now());

    this.innerHTML = new Intl.DateTimeFormat("default", {
      year: this.getAttribute('year') || undefined,
      month: this.getAttribute('month') || undefined,
      day: this.getAttribute('day') || undefined,
      hour: this.getAttribute('hour') || undefined,
      minute: this.getAttribute('minute') || undefined,
      second: this.getAttribute('second') || undefined,
      timeZoneName: this.getAttribute('time-zone-name') || undefined,
    }).format(date);
  }

*!*
  connectedCallback() { // (2)
*/!*
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

*!*
  static get observedAttributes() { // (3)
*/!*
    return ['datetime', 'year', 'month', 'day', 'hour', 'minute', 'second', 'time-zone-name'];
  }

*!*
  attributeChangedCallback(name, oldValue, newValue) { // (4)
*/!*
    this.render();
  }

}

customElements.define("time-formatted", TimeFormatted);
</script>

<time-formatted id="elem" hour="numeric" minute="numeric" second="numeric"></time-formatted>

<script>
*!*
setInterval(() => elem.setAttribute('datetime', new Date()), 1000); // (5)
*/!*
</script>
```

1. Renderlash mantig'i `render()` yordamchi usuliga o'tkaziladi.
2. Element sahifaga kiritilganda uni bir marta chaqiramiz.
3. `observedAttributes()` ro'yxatidagi atribyutni o'zgartirish uchun `attributeChangedCallback` ishga tushiriladi.
4. ...va elementni qayta ko'rsatadi.
5. Oxirida biz osongina jonli taymerni yaratishimiz mumkin.

## Buyurtma berish

HTML tahlilchisi DOMni qurganda, elementlar birin-ketin, bolalardan oldin ota-onalar tomonidan qayta ishlanadi. Masalan, bizda `<outer><inner></inner></outer>` bo'lsa, u holda avval `<outer>` elementi yaratiladi va DOMga ulanadi, keyin esa `<inner>`.

Bu maxsus elementlar uchun muhim oqibatlarga olib keladi.

Misol uchun, agar maxsus element `connectedCallback` da `innerHTML` ga kirishga harakat qilsa, u hech narsa olmaydi:

```html run height=40
<script>
customElements.define('user-info', class extends HTMLElement {

  connectedCallback() {
*!*
    alert(this.innerHTML); // bo'sh (*)
*/!*
  }

});
</script>

*!*
<user-info>John</user-info>
*/!*
```

Agar siz uni ishga tushirsangiz, `alert` bo'sh bo'ladi.

Aynan shu sahnada bolalar yo'qligi sababli, DOM tugallanmagan. HTML tahlilchisi `<user-info>` maxsus elementini bog'ladi va o'z bolalariga o'tmoqchi, lekin ular hali ulanmagan.

Agar biz ma'lumotni maxsus elementga o'tkazmoqchi bo'lsak, atribyutlardan foydalanishimiz mumkin. Ular darhol mavjud bo'ladi.

Yoki bizga haqiqatan ham bolalar kerak bo'lsa, biz ularga kirishni nol kechikish `setTimeout` bilan kechiktirishimiz mumkin.

Bu quyidagicha ishlaydi:

```html run height=40
<script>
customElements.define('user-info', class extends HTMLElement {

  connectedCallback() {
*!*
    setTimeout(() => alert(this.innerHTML)); // John (*)
*/!*
  }

});
</script>

*!*
<user-info>John</user-info>
*/!*
```

Endi `(*)` qatoridagi `alert` "John" ni ko'rsatadi, chunki biz uni HTML tahlili tugallangandan keyin asinxron tarzda ishga tushiramiz. Agar kerak bo'lsa, biz bolalarni qayta ishlashimiz va ishga tushirishni tugatishimiz mumkin.

Boshqa tomondan, bu yechim ham mukammal emas. Agar ichki o'rnatilgan maxsus elementlar o'zlarini ishga tushirish uchun `setTimeout` dan ham foydalansa, ular navbatda turishadi: birinchi navbatda tashqi `setTimeout`, keyin esa ichki.

Shunday qilib, tashqi element ishga tushirishni ichki elementdan oldin tugatadi.

Keling, buni misolda ko'rsatamiz:

```html run height=0
<script>
customElements.define('user-info', class extends HTMLElement {
  connectedCallback() {
    alert(`${this.id} connected.`);
    setTimeout(() => alert(`${this.id} initialized.`));
  }
});
</script>

*!*
<user-info id="outer">
  <user-info id="inner"></user-info>
</user-info>
*/!*
```

Chiqish tartibi:

1. tashqi bog'langan.
2. ichki bog'langan.
3. tashqi ishga tushirilgan.
4. ichki ishga tushirilgan.

Tashqi element `(3)` ishga tushirishni ichki `(4)`dan oldin tugatganini aniq ko'rishimiz mumkin.

Ichki elementlar tayyor bo'lgandan keyin ishga tushiriladigan o'rnatilgan qayta qo'ng'iroq yo'q. Agar kerak bo'lsa, biz buni o'zimiz amalga oshirishimiz mumkin. Masalan, ichki elementlar `initialized` kabi hodisalarni yuborishi va tashqi elementlar ularni tinglashi va ularga munosabat bildirishi mumkin.

## Moslashtirilgan o'rnatilgan elementlar

Biz yaratadigan yangi elementlar, masalan, `<time-formatted>`, hech qanday bog'langan semantikaga ega emas. Ular qidiruv tizimlariga noma'lum va maxsus imkoniyatlar qurilmalari ularni boshqara olmaydi.

Ammo bunday narsalar muhim bo'lishi mumkin. Masalan, qidiruv tizimi biz haqiqatda vaqtni ko'rsatayotganimizni bilishdan manfaatdor bo'ladi. Agar biz maxsus turdagi tugma yaratayotgan bo'lsak, nega mavjud `<button>` funksiyasidan qayta foydalanmasligimiz kerak?

Biz o'rnatilgan HTML elementlarini ularning sinflaridan meros qilib kengaytirishimiz va sozlashimiz mumkin.

Misol uchun, quyida `HTMLButtonElement` tugmalariga doir misollar berilgan, keling, ularni ko'rib chiqamiz.

1. `HTMLButtonElement` ni sinfimiz bilan kengaytiring:

    ```js
    class HelloButton extends HTMLButtonElement { /* maxsus element usuli */ }
    ```

2. `customElements.define` ga uchinchi argumentni keltiring, u tegni belgilaydi:
    ```js
    customElements.define('hello-button', HelloButton, *!*{extends: 'button'}*/!*);
    ```    
   Bir xil DOM sinfga ega bo'lgan turli teglar bo'lishi mumkin, shuning uchun `extends` ni belgilash kerak.

3. Oxirida, bizning maxsus elementimizdan foydalanish uchun oddiy `<button>` tegini kiriting, lekin unga `is="hello-button"` ni qo'shing:
    ```html
    <button is="hello-button">...</button>
    ```

Quyida to'liq misol berilgan:

```html run autorun="no-epub"
<script>
// "Hello" degan tugmani bosing
class HelloButton extends HTMLButtonElement {
*!*
  constructor() {
*/!*
    super();
    this.addEventListener('click', () => alert("Hello!"));
  }
}

*!*
customElements.define('hello-button', HelloButton, {extends: 'button'});
*/!*
</script>

*!*
<button is="hello-button">Click me</button>
*/!*

*!*
<button is="hello-button" disabled>Disabled</button>
*/!*
```

Bizning yangi tugma o'rnatilgan tugmani kengaytiradi. Shunday qilib, u bir xil uslublar va `disabled` atribyuti kabi standart xususiyatlarni saqlaydi.

## Havolalar

- HTML yashash standarti: <https://html.spec.whatwg.org/#custom-elements>.
- Moslik: <https://caniuse.com/#feat=custom-elementsv1>.

## Xulosa

Maxsus elementlar ikki xil bo'lishi mumkin:

1. "Avtonom" -- `HTMLElement`ni kengaytiruvchi yangi teglar.

Ta'rif sxemasi:
    
    ```js
    class MyElement HTMLElement ni kengaytiradi {
      constructor() { super(); /* ... */ }
      connectedCallback() { /* ... */ }
      disconnectedCallback() { /* ... */  }
      static get observedAttributes() { return [/* ... */]; }
      attributeChangedCallback(name, oldValue, newValue) { /* ... */ }
      adoptedCallback() { /* ... */ }
     }
    customElements.define('my-element', MyElement);
    /* <my-element> */
    ```

2. "Moslashtirilgan o'rnatilgan elementlar" -- mavjud elementlarning kengaytmalari.

    HTMLda yana bitta `.define` argumenti va `is="..."` talab qilinadi:
    ```js
    class MyButton extends HTMLButtonElement { /*...*/ }
    customElements.define('my-button', MyElement, {extends: 'button'});
    /* <button is="my-button"> */
    ```

Maxsus elementlar brauzerlar orasida yaxshi qo'llab-quvvatlanadi. Polyfill <https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs> mavjud.
