# Maxsus eventlarni yuborish

Biz nafaqat ishlov beruvchilarni belgilashimiz, balki JavaScriptdan hodisalarni ham yaratishimiz mumkin.

Maxsus hodisalar "grafik komponentlar" yaratish uchun ishlatilishi mumkin. Masalan, bizning JSga asoslangan menyumizning ildiz elementi menyu bilan nima sodir bo'lishini ko'rsatadigan voqealarni ishga tushirishi mumkin: `open` (menyu ochiq), `select` (bir element tanlangan) va hokazo. Boshqa kod voqealarni tinglaydi va menyuda nima sodir bo'layotganini kuzatadi.

Biz nafaqat o'z maqsadlarimiz uchun ixtiro qilgan mutlaqo yangi voqealarni, balki o'rnatilgan `click`, `mousedown` va hokazolarni ham yaratishimiz mumkin. Bu avtomatlashtirilgan sinov uchun foydali bo'ladi.

## Event konstruktori

O'rnatilgan voqea sinflari DOM element sinflariga o'xshash ierarxiyani tashkil qiladi. Ildiz o'rnatilgan [Event](https://dom.spec.whatwg.org/#events) sinfidir.

Biz shunday `Event` obyektlarini yaratishimiz mumkin:

```js
let event = new Event(type[, options]);
```

Argumentlar:

- *type* -- voqea turi, `"click"` kabi qator yoki o'zimizniki kabi `"my-event"`.
-   *options* -- ikkita ixtiyoriy xususiyatga ega obyekt:
   - `bubbles: true/false` -- agar `true` bo'lsa, hodisa pufakchalari paydo bo'ladi.
   - `cancelable: true/false` -- agar `true` bo`lsa, u holda "default action" ning oldini olish mumkin. Keyinchalik biz bu maxsus tadbirlar uchun nimani anglatishini ko'rib chiqamiz.

   Odatiy bo'lib ikkalasi ham noto'g'ri: `{bubbles: false, cancelable: false}`.

## dispatchEvent

Hodisa obyekti yaratilgandan so'ng, biz uni `elem.dispatchEvent(event)` chaqiruvi yordamida elementda "ishlatishimiz" kerak.

Keyin ishlovchilar unga oddiy brauzer hodisasi kabi munosabatda bo'lishadi. Agar hodisa `bubbles` bayrog'i bilan yaratilgan bo'lsa, u pufakchaga chiqadi.

Quyidagi misolda `click` hodisasi JavaScriptda boshlangan. Ishlovchi xuddi tugma bosilgandek ishlaydi:

```html run no-beautify
<button id="elem" onclick="alert('Click!');">Autoclick</button>

<script>
  let event = new Event("click");
  elem.dispatchEvent(event);
</script>
```

```smart header="event.isTrusted"
"Haqiqiy" foydalanuvchi hodisasini skript tomonidan yaratilgan voqeadan ajratishning bir usuli bor.

`event.isTrusted` xususiyati haqiqiy foydalanuvchi harakatlaridan kelib chiqadigan hodisalar uchun `true`, skript orqali yaratilgan hodisalar uchun `false` hisoblanadi.
```

## Bubbling namunasi

Biz `"hello"` nomi bilan ko'pikli hodisa yaratishimiz va uni `document` orqali ushlashimiz mumkin.

Bizga kerak bo'lgan yagona narsa `bubbles` ni `true` ga o'rnatishdir:

```html run no-beautify
<h1 id="elem">Hello from the script!</h1>

<script>
  // catch on document...
  document.addEventListener("hello", function(event) { // (1)
    alert("Hello from " + event.target.tagName); // Hello from H1
  });

  // ...dispatch on elem!
  let event = new Event("hello", {bubbles: true}); // (2)
  elem.dispatchEvent(event);

  // hujjatdagi ishlov beruvchi faollashadi va xabarni ko'rsatadi.

</script>
```


Eslatmalar:

1. Shaxsiy tadbirlarimiz uchun `addEventListener` dan foydalanishimiz kerak, chunki `on<event>` faqat o'rnatilgan hodisalar uchun mavjud, `document.onhello` ishlamaydi.
2. `bubbles:true` o'rnatilishi kerak, aks holda hodisa ko'tarilmaydi.

O'rnatilgan (`click`) va maxsus (`hello`) hodisalari uchun pufaklash mexanikasi bir xil. Qo'lga olish va qabariq bosqichlari ham mavjud.

## MouseEvent, KeyboardEvent va boshqalar

Mana, [UI Event specification](https://www.w3.org/TR/uievents) dan UI hodisalari uchun darslarning qisqa ro'yxati:
- `UIEvent`
- `FocusEvent`
- `MouseEvent`
- `WheelEvent`
- `KeyboardEvent`
- ...

Agar biz bunday tadbirlarni yaratmoqchi bo'lsak, `new Event` o'rniga ulardan foydalanishimiz kerak. Masalan, `new MouseEvent("click")`.

To'g'ri konstruktor ushbu turdagi hodisa uchun standart xususiyatlarni belgilashga imkon beradi.

Sichqoncha hodisasi uchun `clientX/clientY` kabi:

```js run
let event = new MouseEvent("click", {
  bubbles: true,
  cancelable: true,
  clientX: 100,
  clientY: 100
});

*!*
alert(event.clientX); // 100
*/!*
```
E'tibor bering: umumiy `Event` konstruktori bunga ruxsat bermaydi.

Keling, urinib ko'ramiz:

```js run
let event = new Event("click", {
  bubbles: true, // faqat bubble va cancelable
  cancelable: true, // Event konstruktorida ishlash
  clientX: 100,
  clientY: 100
});

*!*
alert(event.clientX); // undefined, noma'lum xususiyat e'tiborga olinmadi!
*/!*
```
Texnik jihatdan biz yaratgandan so'ng to'g'ridan-to'g'ri `event.clientX=100` ni belgilash orqali buni hal qilishimiz mumkin. Demak, bu qulaylik va qoidalarga rioya qilish masalasi. Brauzer tomonidan yaratilgan voqealar har doim to'g'ri turga ega.

Turli xil UI hodisalari uchun xususiyatlarning to'liq ro'yxati spetsifikatsiyada, masalan, [MouseEvent](https://www.w3.org/TR/uievents/#mouseevent).

## Odatiy tadbirlar

`"hello"` kabi mutlaqo yangi voqealar turlari uchun biz `new CustomEvent` dan foydalanishimiz kerak. Texnik jihatdan [CustomEvent](https://dom.spec.whatwg.org/#customevent) `Event` bilan bir xil, faqat bitta istisno mavjud.

Ikkinchi argumentda (obyektda) biz hodisa bilan uzatmoqchi bo'lgan har qanday maxsus ma'lumot uchun qo'shimcha `detail` xususiyatini qo'shishimiz mumkin.

Misol uchun:

```html run refresh
<h1 id="elem">Hello for John!</h1>

<script>
  // qo'shimcha tafsilotlar ishlovchiga voqea bilan birga keladi
  elem.addEventListener("hello", function(event) {
    alert(*!*event.detail.name*/!*);
  });

  elem.dispatchEvent(new CustomEvent("hello", {
*!*
    detail: { name: "John" }
*/!*
  }));
</script>
```
`detail` xususiyati har qanday ma'lumotlarga ega bo'lishi mumkin. Texnik jihatdan biz ularsiz yashashimiz mumkin edi, chunki biz uni yaratgandan so'ng oddiy `new Event` obyektiga istalgan xususiyatni belgilashimiz mumkin. Lekin `CustomEvent` boshqa hodisa xususiyatlari bilan ziddiyatlardan qochish uchun maxsus `detail` maydonini taqdim etadi.

Bundan tashqari, voqea klassi bu "qanday hodisa" ekanligini tasvirlaydi va agar voqea odatiy bo'lsa, u nima ekanligini tushunish uchun `CustomEvent` dan foydalanishimiz kerak.

## event.preventDefault()

Ko'pgina brauzer hodisalarida "standart amal" mavjud, masalan, havolaga o'tish, tanlovni boshlash va hokazo.

Yangi, moslashtirilgan hodisalar uchun, albatta, standart brauzer harakatlari yo'q, lekin bunday hodisani jo'natadigan kod hodisani ishga tushirgandan keyin nima qilish kerakligini o'z rejalariga ega bo'lishi mumkin.

`event.preventDefault()` ni chaqirish orqali voqea ishlov beruvchisi ushbu amallarni bekor qilish kerakligi haqida signal yuborishi mumkin.

Bunday holda, `elem.dispatchEvent(voqe)` ni chaqirish `false` ni qaytaradi va uni yuborgan kod bu davom etmasligi kerakligini biladi.

Keling, amaliy misolni ko'rib chiqaylik - yashirin quyon (yopish menyusi yoki boshqa narsa bo'lishi mumkin).

Quyida siz barcha manfaatdor tomonlarga quyon yashirinishini bildirish uchun `"hide"` hodisasini yuboruvchi `#rabbit` va `hide()` funksiyalarini ko'rishingiz mumkin.

Har qanday ishlov beruvchi ushbu hodisani `rabbit.addEventListener('hide',...)` yordamida tinglashi va agar kerak bo'lsa, `event.preventDefault()` yordamida amalni bekor qilishi mumkin. Shunda rabbit yo'qolmaydi:

```html run refresh autorun
<pre id="rabbit">
  |\   /|
   \|_|/
   /. .\
  =\_Y_/=
   {>o<}
</pre>
<button onclick="hide()">Hide()</button>

<script>
  function hide() {
    let event = new CustomEvent("hide", {
      cancelable: true // bayroqsiz preventDefault ishlamaydi
    });
    if (!rabbit.dispatchEvent(event)) {
      alert('The action was prevented by a handler');
    } else {
      rabbit.hidden = true;
    }
  }

  rabbit.addEventListener('hide', function(event) {
    if (confirm("Call preventDefault?")) {
      event.preventDefault();
    }
  });
</script>
```
Iltimos, diqqat qiling: hodisada `cancelable: true` belgisi bo'lishi kerak, aks holda `event.preventDefault()` chaqiruvi e'tiborga olinmaydi.

## Events-in-events sinxrondir

Odatda voqealar navbat bilan qayta ishlanadi. Ya'ni, agar brauzer `onclick` ni qayta ishlayotgan bo'lsa va yangi hodisa yuzaga kelsa, masalan, sichqonchani harakatga keltirgandan so'ng, uni qayta ishlash navbatga qo'yiladi, `onclick` ishlovi tugagandan so'ng tegishli `mousemove` ishlov beruvchilari chaqiriladi.

E'tiborga molik istisno - bu bir voqea boshqasidan boshlanganida, masalan, `dispatchEvent` yordamida bajariladi. Bunday hodisalar zudlik bilan qayta ishlanadi: yangi hodisa ishlovchilar chaqiriladi va keyin joriy hodisalarni qayta ishlash davom ettiriladi.

Misol uchun, quyidagi kodda `menu-open` hodisasi `onclick` paytida ishga tushiriladi.

U `onclick` ishlov beruvchisi tugashini kutmasdan darhol qayta ishlanadi:


```html run autorun
<button id="menu">Menu (click me)</button>

<script>
  menu.onclick = function() {
    alert(1);

    menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    }));

    alert(2);
  };

  // 1 va 2 orasida harakatlanadi
   document.addEventListener('menu-open', () => alert('nested'));
</script>
```
Chiqarish tartibi: 1 -> nested -> 2.

Esda tutingki, `menu-open` ichki hodisasi `document` ga ushlangan. Qayta ishlash tashqi kodga (`onclick`) qaytgunga qadar ichki o'rnatilgan hodisani tarqatish va qayta ishlash tugallanadi.

Bu nafaqat `dispatchEvent` haqida, balki boshqa holatlar ham mavjud. Agar hodisa ishlov beruvchisi boshqa hodisalarni qo'zg'atuvchi usullarni chaqirsa -- ular ham sinxron tarzda, ichki o'rnatilgan tartibda qayta ishlanadi.

Aytaylik, bizga yoqmaydi. Biz `menu-open` yoki boshqa ichki o'rnatilgan hodisalardan mustaqil ravishda `onclick` to'liq qayta ishlanishini xohlaymiz.

Keyin biz `onclick` ning oxiriga `dispatchEvent` (yoki boshqa hodisani qo'zg'atuvchi qo'ng'iroq) qo'yishimiz yoki, ehtimol, uni nol kechikish `setTimeout` ga o'rashimiz mumkin:

```html run
<button id="menu">Menu (click me)</button>

<script>
  menu.onclick = function() {
    alert(1);

    setTimeout(() => menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    })));

    alert(2);
  };

  document.addEventListener('menu-open', () => alert('nested'));
</script>
```
Endi `dispatchEvent` joriy kod bajarilishi tugallangandan so'ng asinxron ishlaydi, jumladan, `menu.onclick`, shuning uchun hodisa ishlov beruvchilari butunlay alohida.

Chiqish tartibi quyidagicha bo'ladi: 1 -> 2 -> nested.

## Xulosa

Koddan hodisa yaratish uchun avvalo hodisa obyektini yaratishimiz kerak.

Umumiy `Event(name, options)` konstruktori ixtiyoriy hodisa nomini va ikkita xususiyatga ega `options` obyektini qabul qiladi:
- `bubbles: true`, agar hodisa pufakchali bo'lsa.
-  `cancelable: true` agar `event.preventDefault()` ishlashi kerak bo'lsa.

`MouseEvent`, `KeyboardEvent` va boshqalar kabi mahalliy hodisalarning boshqa konstruktorlari ushbu hodisa turiga xos xususiyatlarni qabul qiladilar. Masalan, sichqoncha hodisalari uchun `clientX`.

Maxsus hodisalar uchun biz `CustomEvent` konstruktoridan foydalanishimiz kerak. Unda `detail` deb nomlangan qo'shimcha variant mavjud, biz unga hodisaga xos ma'lumotlarni belgilashimiz kerak. Keyin barcha ishlov beruvchilar unga `event.detail` sifatida kirishlari mumkin.

`Click` yoki `keydown` kabi brauzer hodisalarini yaratishning texnik imkoniyatiga qaramay, biz ulardan juda ehtiyotkorlik bilan foydalanishimiz kerak.

Biz brauzer hodisalarini yaratmasligimiz kerak, chunki bu ishlov beruvchilarni ishlatishning noto'g'ri usuli. Bu ko'pincha yomon arxitektura hisoblanadi.

Mahalliy hodisalar yaratilishi mumkin:

- Agar boshqa o'zaro ta'sir vositalarini ta'minlamasa, uchinchi tomon kutubxonalarini kerakli tarzda ishlashga majbur qilish uchun iflos hack sifatida.
- Avtomatlashtirilgan test uchun skriptdagi "tugmani bosing" va interfeys to'g'ri javob berishini ko'rish uchun.

O'z nomlarimiz bilan maxsus tadbirlar ko'pincha arxitektura maqsadlari uchun yaratiladi, bu bizning menyularimiz, slayderlarimiz, karusellarimiz va hokazolarda nima sodir bo'lishini bildirish uchun.