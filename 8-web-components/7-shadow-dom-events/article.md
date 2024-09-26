# Shadow DOM va hodisalar

Soya daraxti orqasidagi g'oya komponentning ichki amalga oshirish tafsilotlarini qamrab olishdir.

Aytaylik, bosish hodisasi `<user-card>` komponentining soyali DOM ichida sodir bo'ladi. Ammo asosiy hujjatdagi skriptlar DOMning soyali ichki qismlari haqida hech qanday tasavvurga ega emas, ayniqsa ular komponent uchinchi tomon kutubxonasidan olingan bo'lsa.

Shunday qilib, tafsilotlarni inkapsulatsiya qilish uchun brauzer voqeani *qayta nishonga oladi*.


**DOM soyasida sodir bo'ladigan hodisalar komponentdan tashqarida ushlanganda maqsad sifatida host elementiga ega bo'ladi.**

Mana oddiy misol:

```html run autorun="no-epub" untrusted height=60
<user-card></user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<p>
      <button>Click me</button>
    </p>`;
    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

document.onclick =
  e => alert("Outer target: " + e.target.tagName);
</script>
```

Agar siz tugmani bossangiz, xabarlar:

1. Ichki maqsad: `BUTTON` -- ichki hodisa ishlov beruvchisi to'g'ri nishonni, soya DOM ichidagi elementni oladi.
2. Tashqi maqsad: `USER-CARD` -- hujjat hodisasi ishlov beruvchisi maqsad sifatida soya hostini oladi.

Voqeani qayta yo'naltirish - bu juda yaxshi narsa, chunki tashqi hujjat komponentning ichki qismlari haqida bilishi shart emas. O'z nuqtai nazaridan, voqea `<user-card>` da sodir bo'ldi.

**Agar hodisa jismonan yorug'lik DOMda yashovchi tirqishli elementda sodir bo'lsa, retargeting amalga oshirilmaydi.**

Misol uchun, agar foydalanuvchi quyidagi misoldagi `<span slot="username">` tugmasini bosgan bo'lsa, hodisa maqsadi aynan shu `span` elementi bo'lib, u soya va yorug'lik ishlov beruvchilari uchun ishlatiladi:

```html run autorun="no-epub" untrusted height=60
<user-card id="userCard">
*!*
  <span slot="username">John Smith</span>
*/!*
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div>
      <b>Name:</b> <slot name="username"></slot>
    </div>`;

    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

userCard.onclick = e => alert(`Outer target: ${e.target.tagName}`);
</script>
```

Agar ``Jon Smith`` tugmasi bosilgan bo'lsa, ichki va tashqi ishlov beruvchilar uchun maqsad `<span slot="username">` bo`ladi. Bu yengil DOM elementi, shuning uchun qayta yo'naltirish yo'q.

Boshqa tomondan, agar bosish soya DOM dan kelib chiqqan elementda sodir bo'lsa, masalan, `<b>Ism</b>` da, DOM soyasidan pufakchaga chiqqanda, undagi `event.target` `<user-card>` ga qaytariladi.

## Bubbling, event.composedPath()

Hodisalarni ko'tarish maqsadida tekislangan DOM ishlatiladi.

Shunday qilib, agar bizda tirqishli element bo'lsa va uning ichida biron bir voqea sodir bo'lsa, u `<slot>` gacha va undan keyin yuqoriga ko'tariladi.

Asl hodisa maqsadiga to'liq yo'l, barcha soya elementlari bilan `event.composedPath()` yordamida olinishi mumkin. Usul nomidan ko'rinib turibdiki, u yo'l kompozitsiyadan so'ng olinadi.

Yuqoridagi misolda tekislangan DOM quyidagicha:

```html
<user-card id="userCard">
  #shadow-root
    <div>
      <b>Name:</b>
      <slot name="username">
        <span slot="username">John Smith</span>
      </slot>
    </div>
</user-card>
```


Shunday qilib, `<span slot="username">` tugmasini bosish uchun `event.composedPath()` ga qo'ng'iroq qatorni qaytaradi: [`span`, `slot`, `div`, `shadow-root`, `user-card`, `body`, `html`, `document`, `window`]. Bu aynan kompozitsiyadan keyin tekislangan DOMdagi maqsadli elementning asosiy zanjiri.

```warn header="Soya daraxti tafsilotlari faqat `{mode:'open'}` daraxtlar uchun berilgan`"
Agar soya daraxti `{mode: 'closed'}` bilan yaratilgan bo'lsa, u holda tuzilgan yo'l hostdan boshlanadi: `user-card` va undan yuqori.

Bu soyali DOM bilan ishlaydigan boshqa usullarga o'xshash printsip. Yopiq daraxtlarning ichki qismlari butunlay yashiringan.
```


## event.composed

Aksariyat voqealar soyali DOM chegarasidan muvaffaqiyatli o'tadi. Bunday bo'lmagan voqealar kam.

Bu `composed` hodisa obyekti xususiyati bilan boshqariladi. Agar bu `true` bo'lsa, voqea chegarani kesib o'tadi. Aks holda, uni faqat DOM soyasining ichidan tutish mumkin.

Agar [UI Voqealari spetsifikatsiyasi](https://www.w3.org/TR/uievents) ni ko'rib chiqsangiz, aksariyat voqealar `composed: true` bo'ladi:

- `blur`, `focus`, `focusin`, `focusout`,
- `click`, `dblclick`,
- `mousedown`, `mouseup` `mousemove`, `mouseout`, `mouseover`,
- `wheel`,
- `beforeinput`, `input`, `keydown`, `keyup`.

Barcha teginish hodisalari va ko‘rsatgich hodisalari ham `composed: true`.

Ba'zi hodisalar mavjud bo'lsa-da, `composed: false`:

- `mouseenter`, `mouseleave` (ular umuman bubble qilmaydi, ya'ni pufaklanmaydi),
- `load`, `unload`, `abort`, `error`,
- `select`,
- `slotchange`.

Ushbu hodisalarni faqat hodisa nishoni joylashgan bir xil DOM ichidagi elementlarda tutish mumkin.

## Maxsus hodisalar

Biz maxsus hodisalarni jo'natganimizda, komponentdan pufakcha ko'tarilishi va chiqib ketishi uchun `bubbles` va `composed` xususiyatlarini ham `true` ga o'rnatishimiz kerak.

Masalan, biz bu yerda `div#outer` soya DOMida `div#inner` ni yaratamiz va unda ikkita hodisani ishga tushiramiz. Faqat `composed: true` ga ega bo'lgan kishi uni hujjatdan tashqarida joylashtiradi:

```html run untrusted height=0
<div id="outer"></div>

<script>
outer.attachShadow({mode: 'open'});

let inner = document.createElement('div');
outer.shadowRoot.append(inner);

/*
div(id=outer)
  #shadow-dom
    div(id=inner)
*/

document.addEventListener('test', event => alert(event.detail));

inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
*!*
  composed: true,
*/!*
  detail: "composed"
}));

inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
*!*
  composed: false,
*/!*
  detail: "not composed"
}));
</script>
```

## Xulosa

Voqealar faqat DOM chegaralarini kesib o'tadi, agar ularning `composed` bayrog'i `true` ga o'rnatilgan bo'lsa.

Tegishli spetsifikatsiyalarda ta'riflanganidek, o'rnatilgan hodisalar asosan `composed: true` ga ega:

- UI hodisalari <https://www.w3.org/TR/uievents>.
- Touch hodisalari <https://w3c.github.io/touch-events>.
- Pointer hodisalari <https://www.w3.org/TR/pointerevents>.
- ...Va hokazo.

Ayrim o'rnatilgan hodisalar `composed: false` ga ega:

- `mouseenter`, `mouseleave` (bular ham pufaklanmaydi),
- `load`, `unload`, `abort`, `error`,
- `select`,
- `slotchange`.

Ushbu hodisalarni faqat bitta DOM ichidagi elementlarda tutish mumkin.

Agar biz `CustomEvent` ni jo'natadigan bo'lsak, unda `composed: true` ni aniq belgilashimiz kerak.

Iltimos, esda tutingki, ichki komponentlar bo'lsa, bitta soya DOM boshqasiga joylashtirilishi mumkin. Bunday holda tuzilgan voqealar barcha soyali DOM chegaralari orqali pufakchaga aylanadi. Shunday qilib, agar voqea faqat bevosita qo'shuvchi komponent uchun mo'ljallangan bo'lsa, biz uni soya xostiga ham yuborishimiz va `composed: false` ni o'rnatishimiz mumkin. Keyin u DOM soyasining tarkibiy qismidan chiqib ketadi, lekin yuqori darajadagi DOMga ko'tarilmaydi.
