# DOM soyasi

Shadow DOM inkapsulatsiya uchun xizmat qiladi. Bu komponentga o'zining "soya" DOM daraxtiga ega bo'lishiga imkon beradi, unga asosiy hujjatdan tasodifiy kirish mumkin emas, mahalliy uslub qoidalari bo'lishi lozim.

## O'rnatilgan soyali DOM

Murakkab brauzer boshqaruvlari qanday yaratilgani va uslublanishi haqida hech o'ylab ko'rganmisiz?

`<input type="range">` kabi:

<p>
<input type="range">
</p>

Brauzer ularni chizish uchun ichki DOM/CSS dan foydalanadi. Ushbu DOM tuzilishi odatda bizga ko'rinmaydi, lekin biz buni ishlab chiquvchi vositalarida ko'rishimiz mumkin. Masalan, Chrome da biz Dev Toolsdagi "Foydalanuvchi agenti soya DOMni ko'rsatish" opsiyasini yoqishimiz kerak.  

Keyin `<input type="range">` quyidagicha ko'rinadi:

![](shadow-dom-range.png)

`#shadow-root` ostida ko'rayotgan narsangiz "shadow DOM" deb ataladi.

Muntazam JavaScript chaqiruvlari yoki selektorlari orqali biz o'rnatilgan soyali DOM elementlarini ololmaymiz. Bu oddiy bolalar emas, balki kuchli inkapsulatsiya texnikasi hisoblanadi.

Yuqoridagi misolda biz `pseudo` foydali atribyutini ko'rishimiz mumkin. Bu nostandart, tarixiy sabablarga ko'ra mavjud. Biz CSS bilan uning uslubi pastki elementlaridan foydalanishimiz mumkin, masalan:

```html run autorun
<style>
/* make the slider track red */
input::-webkit-slider-runnable-track {
  background: red;
}
</style>

<input type="range">
```

Yana bir bor ta'kidlaymizki, `pseudo` - bu nostandart atribut. Xronologik jihatdan, brauzerlar avval boshqaruv elementlarini amalga oshirish uchun ichki DOM tuzilmalari bilan tajriba o'tkazishni boshladilar, keyin esa vaqt o'tgach, soya DOM standartlashtirildi, bu biz dasturchilarga xuddi shunday qilish imkonini beradi.

Keyinchalik, [DOM spec](https://dom.spec.whatwg.org/#shadow-trees) va boshqa tegishli spetsifikatsiyalar bilan qamrab olingan zamonaviy soyali DOM standartidan foydalanamiz. 

## Soya daraxti (shadow tree)

DOM elementi ikki xil DOM pastki daraxtiga ega bo'lishi mumkin:

1. Light tree (yorug'lik daraxti) -- oddiy DOM pastki daraxti, HTML bolalaridan yaratilgan. Oldingi boblarda ko'rgan barcha pastki daraxtlar "light" edi.
2. Shadow tree -- HTMLda aks ettirilmagan, begona ko'zlardan berkitilgan yashirin DOM pastki daraxti.

Agar element ikkalasiga ega bo'lsa, brauzer faqat soya daraxtini ko'rsatadi. Ammo biz soya va yorug'lik daraxtlari o'rtasida ham qandaydir kompozitsiyani o'rnatishimiz mumkin. Tafsilotlarni keyinroq <info:slots-composition> bobida ko'rib chiqamiz.

Soya daraxti shaxsiy elementlarda komponentning ichki qismlarini yashirish va komponentlarning mahalliy uslublarini qo'llash uchun ishlatilishi mumkin.

Masalan, ushbu `<show-hello>` elementi ichki DOMni soya daraxtida yashiradi:

```html run autorun height=60
<script>
customElements.define('show-hello', class extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `<p>
      Hello, ${this.getAttribute('name')}
    </p>`;
  }  
});
</script>

<show-hello name="John"></show-hello>
```

Natijada paydo bo'lgan DOM Chrome dev asboblarida shunday ko'rinadi, barcha kontent "#shadow-root" ostida joylashgan:

![](shadow-dom-say-hello.png)

Birinchidan, `elem.attachShadow({rejim: …})` ga qo'ng'iroq qilish soya daraxtini yaratadi.

Ikkita cheklov mavjud:
1. Biz har bir element uchun faqat bitta soya ildizini yaratishimiz mumkin.
2. `Elem` moslashtirilgan element yoki quyidagilardan biri bo'lishi kerak: "article", "aside", "blockquote", "body", "div", "footer", "h1..h6", "header", "main" "nav", "p", "section" yoki "span". `<img>` kabi boshqa elementlar soya daraxtini joylashtira olmaydi.

`mode` opsiyasi inkapsulatsiya darajasini belgilaydi. U ikkita qiymatdan biriga ega bo'lishi kerak:
- `"open"` -- soya ildizi `elem.shadowRoot` sifatida mavjud.

  Har qanday kod `elem` soya daraxtiga kirishi mumkin.
- `"closed"` -- `elem.shadowRoot` har doim `null`.

  Biz DOM soyasiga faqat `attachShadow` tomonidan qaytarilgan (va, ehtimol, sinf ichida yashiringan) havola orqali kira olamiz. `<input type="range">` kabi brauzerda joylashgan soya daraxtlari yopiq. Ularga kirishning iloji yo'q.

`attachShadow` tomonidan qaytarilgan [soya ildizi](https://dom.spec.whatwg.org/#shadowroot) elementga o'xshaydi: uni to'ldirish uchun biz `innerHTML` yoki DOM usullaridan, masalan, `append` dan foydalanishimiz mumkin.

Soya ildiziga ega element "soya daraxti xosti (mezboni)" deb ataladi va soya ildizi `host` xususiyati sifatida mavjud:

```js
// {mode: "open"} deb faraz qilsak, aks holda elem.shadowRoot null hisoblanadi
alert(elem.shadowRoot.host === elem); // true
```

## Inkapsulatsiya

Shadow DOM asosiy hujjatdan ajratilgan:

1. Soya DOM elementlari yorug'lik DOM dan `querySelector`ga ko'rinmaydi. Xususan, Shadow DOM elementlari yorug'lik DOMdagilarga zid keladigan identifikatorlarga ega bo'lishi mumkin. Ular faqat soya daraxti ichida noyob bo'lishi kerak.
2. Shadow DOM o'zining uslublar jadvaliga ega. Tashqi DOM uslubi qoidalari qo'llanilmaydi.

Masalan:

```html run untrusted height=40
<style>
*!*
  /* hujjat uslubi #elem (1) ichidagi soya daraxtiga taalluqli emas */
*/!*
  p { color: red; }
</style>

<div id="elem"></div>

<script>
  elem.attachShadow({mode: 'open'});
*!*
    // soya daraxtining o'ziga xos uslubi bor (2)
*/!*
  elem.shadowRoot.innerHTML = `
    <style> p { font-weight: bold; } </style>
    <p>Hello, John!</p>
  `;

*!*
  // <p> faqat soya daraxti ichidagi so'rovlardan ko'rinadi (3)
*/!*
  alert(document.querySelectorAll('p').length); // 0
  alert(elem.shadowRoot.querySelectorAll('p').length); // 1
</script>  
```

1. Hujjatdagi uslub soya daraxtiga ta'sir qilmaydi.
2. ...Ammo ichkaridan uslub ishlaydi.
3. Soya daraxtida elementlarni olish uchun biz daraxt ichidan so'rashimiz kerak.

## Havolalar

- DOM: <https://dom.spec.whatwg.org/#shadow-trees>
- Moslik: <https://caniuse.com/#feat=shadowdomv1>
- Shadow DOM ko'plab boshqa spetsifikatsiyalarda qayd etilgan, masalan, [DOM Parsing](https://w3c.github.io/DOM-Parsing/#the-innerhtml-mixin) soya ildizida `innerHTML` mavjudligini bildiradi.


## Xulosa

Shadow DOM - mahalliy komponentli DOM yaratish usuli.

1. `shadowRoot = elem.attachShadow({rejim: ochiq|yopiq})` -- `elem` uchun soya DOM yaratadi. Agar `mode="open"` bo'lsa, u holda `elem.shadowRoot` xususiyati sifatida foydalanish mumkin.
2. Biz `shadowRoot` ni `innerHTML` yoki boshqa DOM usullari yordamida to'ldirishimiz mumkin.

Shadow DOM elementlari:
- O'z identifikatorlari maydoniga ega,
- `querySelector` kabi asosiy hujjatdagi JavaScript selektorlariga ko'rinmaydi,
- Uslublardan asosiy hujjatdan emas, faqat soya daraxtidan foydalanadi.

Shadow DOM, agar mavjud bo'lsa, "light DOM" (oddiy bolalar) o'rniga brauzer tomonidan taqdim etiladi. <info:slots-composition> bo'limida biz ularni qanday tuzishni ko'rib chiqamiz.
