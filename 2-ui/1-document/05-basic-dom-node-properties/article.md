# Node xususiyatlari: turi, teglari va mazmuni

Keling, DOM node larini chuqurroq ko'rib chiqaylik.

Ushbu bobda biz ularning nima ekanligini va eng ko'p ishlatiladigan xususiyatlarini bilib olamiz.

## DOM node klasslari

Turli DOM nodelari turli xil xususiyatlarga ega bo'lishi mumkin. Masalan, `<a>` tegiga mos keladigan element node havola bilan, `<input>` ga mos keladigan element esa kiritish bilan bog'liq va ko'plab xususiyatlarga ega. Matn tugunlari element tugunlari bilan bir xil emas, ammo ularning barchasi o'rtasida umumiy xususiyatlar va usullar ham mavjud, chunki DOM nodelarining barcha sinflari yagona ierarxiyani tashkil qiladi. 

Har bir DOM node tegishli o'rnatilgan klassga mansub. 

Ierarxiyaning ildizi [EventTarget](https://dom.spec.whatwg.org/#eventtarget), [Node](https://dom.spec.whatwg.org/#interface-node) tomonidan meros qilib olingan va boshqa DOM nodelari undan meros oladi.

Quyida rasm va tushuntirishlar berilgan:

![](dom-class-hierarchy.svg)

Sinflar:

- [EventTarget](https://dom.spec.whatwg.org/#eventtarget) -- hamma narsa uchun ildiz "abstract", ya'ni mavhum sinfdir.

    Bu sinfning obyektlari hech qachon yaratilmaydi. U asos bo'lib xizmat qiladi, shuning uchun barcha DOM nodelari "events", ya'ni hodisalar deb ataladigan narsalarni qo'llab-quvvatlaydi, biz ularni keyinroq o'rganamiz.

- [Node](https://dom.spec.whatwg.org/#interface-node) -- shuningdek, DOM nodelari uchun asos bo'lib xizmat qiladigan "abstract" sinfdir.

  U asosiy daraxt funksiyalarini ta'minlaydi: `parentNode`, `nextSibling`, `childNodes` va boshqalar (ular oluvchilar). `Node` sinfining obyektlari hech qachon yaratilmaydi, ammo undan meros oladigan boshqa sinflar ham bor (va shuning uchun `Node` funksiyasini meros qilib oladi). 

- [Document](https://dom.spec.whatwg.org/#interface-document), tarixiy sabablarga ko'ra ko'pincha `HTMLDocument` tomonidan meros qilib olinadi (garchi so'nggi spetsifikatsiyalar buni talab qilmasa ham) - bu butun hujjat hisoblanadi. 

    `document` global obyekti aynan shu sinfga tegishli. U DOMga kirish nuqtasi bo'lib xizmat qiladi.

- [CharacterData](https://dom.spec.whatwg.org/#interface-characterdata) -- meros qilib olingan "abstract" sinf.
    - [Text](https://dom.spec.whatwg.org/#interface-text) --  elementlar ichidagi matnga mos keladigan sinf, masalan, `<p>Hello</p>` ichida `Hello`.
    - [Comment](https://dom.spec.whatwg.org/#interface-comment) -- sharhlar uchun sinf. Ular ko'rsatilmaydi, lekin har bir sharh DOM a'zosiga aylanadi.

- [Element](https://dom.spec.whatwg.org/#interface-element) -- DOM elementlari uchun asosiy sinfdir. 

  
   U `nextElementSibling`, `children` kabi element darajasida navigatsiyani va `getElementsByTagName`, `querySelector` kabi qidiruv usullarini taqdim etadi.

    Brauzer nafaqat HTML, balki XML va SVG ni ham qo'llab-quvvatlaydi. Shunday qilib, `Element` klassi aniqroq sinflar uchun asos bo'lib xizmat qiladi: `SVGElement`, `XMLElement` va `HTMLElement` (bu yerda ular bizga kerak emas). 
- Nihoyat, [HTMLElement](https://html.spec.whatwg.org/multipage/dom.html#htmlelement) barcha HTML elementlari uchun asosiy sinfdir. Biz ko'pincha u bilan ishlaymiz.

    U aniq HTML elementlari tomonidan meros qilib olingan:
    - [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) -- `<input>` elementlari uchun sinf,
    - [HTMLBodyElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlbodyelement) -- `<body>` elementlari uchun sinf,
    - [HTMLAnchorElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlanchorelement) -- `<a>` elementlari uchun sinf,
    - ...va boshqalar.

O'ziga xos xususiyat va usullarga ega bo'lishi mumkin, o'z sinflari bor bo'lgan boshqa ko'plab teglar mavjud, ammo ba'zi elementlar, masalan, `<span>`, `<section>`, `<article>` da o'ziga xos xususiyatlar mavjud emas, shuning uchun ular `HTMLElement` klassi misollari hisoblanadi.

Demak, berilgan node ning xossalari va usullarining to'liq to'plami meros zanjiri natijasida yuzaga keladi.

Masalan, `<input>` elementi uchun DOM obyektini ko'rib chiqaylik. U [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) sinfiga tegishli.

U xususiyatlar va usullarni superpozitsiya sifatida oladi (meros tartibida keltirilgan):

- `HTMLInputElement` -- bu sinf kirishga xos xususiyatlarni ta'minlaydi,
- `HTMLElement` -- umumiy HTML element usullarini (getter/setterlarni) taqdim etadi,
- `Element` -- umumiy element usullarini taqdim etadi,
- `Node` -- umumiy DOM node xususiyatlarini ta'minlaydi,
- `EventTarget` -- tadbirlarni qo'llab-quvvatlaydi (qoplanishi kerak),
 ...va nihoyat u `Object` dan meros bo'ladi, shuning uchun `hasOwnProperty` kabi "oddiy obyekt" usullari ham mavjud.

DOM node klassi nomini ko'rish uchun obyekt odatda `constructor` xususiyatiga ega ekanligini eslashimiz mumkin. U sinf konstruktoriga murojaat qiladi va `constructor.name` uning nomi hisoblanadi:

```js run
alert( document.body.constructor.name ); // HTMLBodyElement
```

...yoki uni biz shunchaki `toString` qilishmiz mumkin:

```js run
alert( document.body ); // [object HTMLBodyElement]
```

Merosni tekshirish uchun `instanceof` dan ham foydalanishimiz mumkin:

```js run
alert( document.body instanceof HTMLBodyElement ); // true
alert( document.body instanceof HTMLElement ); // true
alert( document.body instanceof Element ); // true
alert( document.body instanceof Node ); // true
alert( document.body instanceof EventTarget ); // true
```

Ko'rib turganimizdek, DOM tugunlari oddiy JavaScript obyektlaridir. Ular meros uchun prototipga asoslangan sinflardan foydalanadilar.

Brauzerda `console.dir(elem)` bilan elementni chiqarish orqali ham buni ko'rish oson. Konsolda siz `HTMLElement.prototype`, `Element.prototype` va hokazolarni ko`rishingiz mumkin.

```smart header="`console.dir(elem)` versus `console.log(elem)`"
Ko'pgina brauzerlar ishlab chiquvchi vositalarida ikkita buyruq: `console.log` va `console.dir` ni qo'llab-quvvatlaydi. Ular o'z argumentlarini konsolga chiqaradilar. JavaScript obyektlari uchun ham bu buyruqlar odatda xuddi shunday qiladi.

Ammo DOM elementlari uchun ular boshqacha: 

- `console.log(elem)` DOM daraxti elementini ko'rsatadi.
- `console.dir(elem)` elementni DOM obyekti sifatida ko'rsatadi, uning xususiyatlarini o'rganish uchun yaxshi.

Buni `document.body` da sinab ko'ring.
```

````smart header="spek da IDL"
Spetsifikatsiyada DOM sinflari JavaScript yordamida tasvirlanmagan, lekin odatda tushunish oson bo'lgan maxsus [Interfeys tavsifi tili](https://en.wikipedia.org/wiki/Interface_description_language) (IDL) bilan tavsiflanadi.

IDL da barcha xossalar o'z turlari bilan oldinga qo'yiladi, masalan, `DOMString`, `boolean` va boshqalar.

Undan bir parcha, izohlar bilan:

```js
// HTMLInputElement ni aniqlang
*!*
// ":" belgisi HTMLInputElement HTMLElementdan meros bo'lib qolganligini anglatadi
*/!*
interface HTMLInputElement: HTMLElement {
  // Bu yerda <input> elementlarining xossalari va usullari bor

*!*
  // "DOMString" xususiyat qiymati satr ekanligini bildiradi
*/!*
  DOMString atribyutini qabul qilish;
   atribyut DOMString alt;
   DOMString atribyutini avtoto'ldirish;
   atribyut DOMString qiymati;

*!*
  // mantiqiy qiymat xususiyati (true/false)
  attribyut boolean autofokus;
*/!*
  ...
*!*
  // usul: "void" bu usul hech qanday qiymat qaytarmasligini bildiradi
*/!*
  void select();
  ...
}
```
````

## "nodeType" xususiyati

`NodeType` xususiyati DOM tugunining "turini" olishning yana bir "eski uslub" usulini taqdim etadi.

U raqamli qiymatga ega:
- `elem.nodeType == 1` element node lar uchun,
- `elem.nodeType == 3` matnli node lar uchun,
- `elem.nodeType == 9` dokument obyektlari uchun,
- [spetsifikatsiyada] bir nechta boshqa qiymatlar mavjud (https://dom.spec.whatwg.org/#node).

Masalan:

```html run
<body>
  <script>
  let elem = document.body;

  // Keling, tekshiramiz: elementda qanday turdagi node mavjud?
  alert(elem.nodeType); // 1 => element

  // va uning birinchi bolasi...
  alert(elem.firstChild.nodeType); // 3 => text

  // dokument obyekti uchun, type, ya'ni tur 9
  alert( document.nodeType ); // 9
  </script>
</body>
```

Zamonaviy skriptlarda node turini ko'rish uchun `instanceof` va boshqa sinfga asoslangan testlardan foydalanishimiz mumkin, lekin ba'zida `nodeType` oddiyroq. Biz faqat `nodeType` ni o'qiy olamiz, uni o'zgartirmaymiz.

## Tag: nodeName va tagName

DOM tugunini hisobga olsak, biz uning teg nomini `nodeName` yoki `tagName` xususiyatlaridan o'qishimiz mumkin:

Masalan:

```js run
alert( document.body.nodeName ); // BODY
alert( document.body.tagName ); // BODY
```

`tagName` and `nodeName` o'rtasida farq bormi?

Albatta, farq ularning nomlarida aks etadi, lekin haqiqatan ham farqlar biroz nozik.

- `tagName` xususiyati faqatgina `Element` node lari uchun mavjud.
- `nodeName` har qanday `Node` uchun aniqlanadi:
    - elementlar uchun bu `tagName` bilan bir xil ma'noni anglatadi.
    - boshqa node turlari uchun (matn, sharh va boshqalar) node turiga ega bo'lgan qatorga ega.

Boshqacha qilib aytganda, `tagName` faqat element tugunlari tomonidan qo'llab-quvvatlanadi (u `Element` sinfidan kelib chiqqani uchun), `nodeName` esa boshqa tugun turlari haqida biror narsa aytishi mumkin.

Misol uchun, keling, `tagName` va `nodeName`ni `document` va kommentariya, ya'ni sharh tugunini solishtiramiz:


```html run
<body><!-- comment -->

  <script>
    // comment uchun
    alert( document.body.firstChild.tagName ); // aniqlanmagan (element emas)
    alert( document.body.firstChild.nodeName ); // #comment

    // document uchun
    alert( document.tagName ); // aniqlanmagan (element emas)
    alert( document.nodeName ); // #document
  </script>
</body>
```

Agar biz faqat elementlar bilan shug'ullanadigan bo'lsak, biz `tagName` va `nodeName` dan foydalanishimiz mumkin, buning farqi yo'q.

```smart header="Teg nomi XML rejimidan tashqari har doim katta harf bo'ladi"
Brauzerda hujjatlarni qayta ishlashning ikkita rejimi mavjud: HTML va XML. Odatda HTML rejimi veb-sahifalar uchun ishlatiladi. XML rejimi brauzer sarlavhali XML-hujjatni olganida yoqiladi: `Content-Type: application/xml+xhtml`.

HTML rejimida `tagName/nodeName` har doim katta harf bilan yoziladi: Ushbu `<body>` yoki `<BoDy>` uchun.

XML rejimida ish "xuddi shunday" saqlanadi. Hozirgi kunda XML rejimi kamdan-kam qo'llaniladi.
```


## innerHTML (ichkiHTML): mazmunlari

UShbu [innerHTML](https://w3c.github.io/DOM-Parsing/#the-innerhtml-mixin) xususiyat HTMLni element ichidagi satr, ya'ni string sifatida olish imkonini beradi.

Biz ham uni o'zgartirishimiz mumkin. Shunday qilib, bu sahifani o'zgartirishning eng kuchli usullaridan biridir.

Namuna `document.body` ning mazmunini ko'rsatadi va keyin uni to'liq almashtiradi:

```html run
<body>
  <p>A paragraph</p>
  <div>A div</div>

  <script>
    alert( document.body.innerHTML ); // joriy tarkibni o'qing
    document.body.innerHTML = 'The new BODY!'; // uni almashtiring
  </script>

</body>
```

Biz noto'g'ri HTML kiritishga urinib ko'rishimiz mumkin, brauzer xatolarimizni tuzatadi:

```html run
<body>

  <script>
    document.body.innerHTML = '<b>test'; // tegni yopish esdan chiqibdi
    alert( document.body.innerHTML ); // <b>test</b> (fixed)
  </script>

</body>
```

```smart header="Skriptlar bajarilmaydi"
Agar `innerHTML` hujjatga `<script>` tegini kiritsa, u HTMLning bir qismiga aylanadi, lekin bajarilmaydi.
```

### Beware: "innerHTML+=" to'liq qayta yozishni amalga oshiradi

Biz HTMLni `elem.innerHTML+="more html"` yordamida elementga qo'shishimiz mumkin.

Mana bunday:

```js
chatDiv.innerHTML += "<div>Hello<img src='smile.gif'/> !</div>";
chatDiv.innerHTML += "How goes?";
```

Lekin biz buni qilishda juda ehtiyot bo'lishimiz kerak, chunki sodir bo'layotgan narsa qo'shimcha *emas*, balki to'liq qayta yozishdir.

Texnik jihatdan, bu ikki chiziq xuddi shunday qiladi:

```js
elem.innerHTML += "...";
// yozish uchun qisqaroq usul:
*!*
elem.innerHTML = elem.innerHTML + "..."
*/!*
```

Boshqacha qilib aytganda, `innerHTML+=` bunday qiladi:

1. Eski tarkib o'chiriladi.
2. Buning o'rniga yangi `innerHTML` yoziladi (eski va yangining birikmasi).

Kontent "nollangan" va noldan qayta yozilganligi sababli barcha rasmlar va boshqa resurslar qayta yuklanadi**.

Yuqoridagi `chatDiv` misolida `chatDiv.innerHTML+="How goes?"` qatori HTML tarkibini qayta yaratadi va `smile.gif`ni qayta yuklaydi (u keshlangan deb umid qilamiz). Agar `chatDiv` da boshqa matn va tasvirlar ko'p bo'lsa, qayta yuklash aniq ko'rinadi.

Ba'zi kamchiliklar ham mavjud. Misol uchun, agar mavjud matn sichqoncha bilan tanlangan bo'lsa, ko'pchilik brauzerlar `innerHTML` ni qayta yozishda tanlovni olib tashlaydi. Va agar tashrif buyuruvchi tomonidan kiritilgan matn bilan `<input>` bo'lsa, u holda matn o'chiriladi va hokazo. 

Yaxshiyamki, `innerHTML`dan tashqari HTML qo'shishning boshqa usullari ham mavjud va biz ularni tez orada o'rganib chiqamiz.

## outerHTML (tashqi HTML): elementdagi to'liq HTML

`OuterHTML` xususiyati elementning to'liq HTMLni o'z ichiga oladi. Bu `innerHTML` va elementning o'ziga o'xshash.

Quyida misol keltirilgan:

```html run
<div id="elem">Hello <b>World</b></div>

<script>
  alert(elem.outerHTML); // <div id="elem">Hello <b>World</b></div>
</script>
```

**Beware: `innerHTML` dan farqli o'laroq, `outerHTML` ga yozish elementni o'zgartirmaydi. Buning o'rniga, uni DOMda almashtiradi.**

Ha, bu biroz g'alati tuyuladi, shuning uchun biz bu yerda alohida eslatma yaratamiz. E'tibor bering.

Misolni ko'rib chiqing:

```html run
<div>Hello, world!</div>

<script>
  let div = document.querySelector('div');

*!*
  // div.outerHTML ni with <p>...</p> bilan almashtiring
*/!*
  div.outerHTML = '<p>A new element</p>'; // (*)

*!*
  // Wow! 'div' hanuz bir xil!
*/!*
  alert(div.outerHTML); // <div>Hello, world!</div> (**)
</script>
```

Judayam oddiy, to'g'rimi?

`(*)` qatorida `div` ni `<p>A new element</p>` bilan almashtirdik. Tashqi hujjatda (DOM) biz `<div>` o'rniga yangi tarkibni ko'rishimiz mumkin. Lekin, biz `(**)` qatorida ko'rib turganimizdek, eski `div` o'zgaruvchining qiymati o'zgarmagan!

`OuterHTML` tayinlanishi DOM elementini o'zgartirmaydi (bu holda 'div' o'zgaruvchisi tomonidan havola qilingan obyekt), lekin uni DOM'dan olib tashlaydi va uning o'rniga yangi HTMLni kiritadi.

Shunday qilib, `div.outerHTML=...` da nima sodir bo'ldi:
- `div` hujjatdan olib tashlandi.
-  Uning o'rniga yana bir HTML `<p>A New element</p>` qo'yildi.
- `div` hali ham eski qiymatiga ega. Yangi HTML hech qanday o'zgaruvchiga saqlanmadi.

Bu yerda xato qilish juda oson: `div.outerHTML` ni o'zgartiring va `div` bilan xuddi yangi tarkibga egadek ishlashda davom eting. Lekin bunday narsa `innerHTML` uchun to'g'ri, lekin `outerHTML` uchun emas. 
 
Biz `elem.outerHTML` ga yozishimiz mumkin, lekin shuni yodda tutishimiz kerakki, u biz yozayotgan elementni (`elem`) o'zgartirmaydi. Uning o'rniga yangi HTMLni qo'yadi. DOM so'rovi orqali yangi elementlarga havolalar olishimiz mumkin.

## nodeValue/data: text node tarkibi

`innerHTML` xususiyati faqat element node lari uchun amal qiladi.

Matn node lari kabi boshqa node turlari ham o'xshash xususiyatlarga ega, masalan: `nodeValue` va `data` xususiyatlari. Bu ikkalasi amaliy foydalanish uchun deyarli bir xil, faqat kichik spetsifikatsiyada farqlar mavjud. Shunday qilib, biz `data` dan foydalanamiz, chunki u qisqaroq.

Matn node ning mazmunini va sharhni o'qishga misol:

```html run height="50"
<body>
  Hello
  <!-- Comment -->
  <script>
    let text = document.body.firstChild;
*!*
    alert(text.data); // Hello
*/!*

    let comment = text.nextSibling;
*!*
    alert(comment.data); // Comment
*/!*
  </script>
</body>
```

Matn node lari uchun biz ularni o'qish yoki o'zgartirish sababni tasavvur qilishimiz mumkin, lekin nima uchun bizga sharhlar kerak?

Ba'zida dasturchilar HTML ichiga ma'lumot yoki shablon ko'rsatmalarini joylashtiradilar, masalan:

```html
<!-- if isAdmin -->
  <div>Welcome, Admin!</div>
<!-- /if -->
```

...Keyin JavaScript uni `data`  xususiyatidan o'qiy oladi va o'rnatilgan ko'rsatmalarni qayta ishlaydi.

## textContent: sof matn

`TextContent` element ichidagi *matn* ga, ya'ni faqat matn, barcha minus `<teglar>` ga kirish imkonini beradi.

Masalan:

```html run
<div id="news">
  <h1>Headline!</h1>
  <p>Martians attack people!</p>
</div>

<script>
  // Headline! Martians attack people!
  alert(news.textContent);
</script>
```

Ko'rib turganimizdek, faqat matn qaytariladi, go'yo barcha `<teg>` lar  kesilgandek, lekin ulardagi matn saqlanib qolgan.

Amalda bunday matnni o'qish kamdan-kam hollarda kerak.

**`textContent` ga yozish ancha foydali, chunki u matnni "xavfsiz usulda" yozish imkonini beradi.**

Aytaylik, bizda ixtiyoriy qator bor, masalan, foydalanuvchi kiritgan va uni ko'rsatmoqchi.

- `innerHTML` bilan biz uni barcha HTML teglari bilan "HTML sifatida" kiritamiz.
- `TextContent` bilan biz uni "matn sifatida" kiritamiz, barcha belgilar tom ma'noda ko'rib chiqiladi.

Ikkalasini solishtiring:

```html run
<div id="elem1"></div>
<div id="elem2"></div>

<script>
  let name = prompt("What's your name?", "<b>Winnie-the-Pooh!</b>");

  elem1.innerHTML = name;
  elem2.textContent = name;
</script>
```

1. Birinchi `<div>` "as HTMl", ya'ni "HTML sifatida" nomini oladi: barcha teglar tegga aylanadi, shuning uchun biz qalin (bold) ismni ko'ramiz.
2. Ikkinchi `<div>` "matn sifatida" nomini oladi, shuning uchun biz tom ma'noda `<b>Winnie-Puh!</b>`ni ko'ramiz.

Ko'p hollarda biz foydalanuvchidan matnni kutamiz va uni matn sifatida ko'rib chiqamiz. Biz saytimizda kutilmagan HTMLni xohlamaymiz. `TextContent` ga berilgan topshiriq aynan shunday qiladi. 

## "hidden", ya'ni yashirin xususiyat

"Hidden" atribyuti va DOM xususiyati elementning ko'rinadigan yoki ko'rinmasligini belgilaydi.

Biz uni HTMLda ishlatishimiz yoki JavaScriptdan foydalanib belgilashimiz mumkin, masalan:

```html run height="80"
<div>Quyidagi ikkala div ham yashirin</div>

<div hidden>With the attribute "hidden"</div>

<div id="elem">JavaScript "hidden" xususiyatini tayinladi</div>

<script>
  elem.hidden = true;
</script>
```

Texnik jihatdan `hidden` `style="display:none"` bilan bir xil ishlaydi, lekin yozish uchun qisqaroq.

Mana miltillovchi (blinking) element:


```html run height=50
<div id="elem">A blinking element</div>

<script>
  setInterval(() => elem.hidden = !elem.hidden, 1000);
</script>
```

## Ko'proq xususiyatlar

DOM elementlari, shuningdek, qo'shimcha xususiyatlarga ega, xususan, sinfga bog'liq bo'lganlar:

- `value` -- `<input>`, `<select>` va `<textarea>` uchun qiymat (`HTMLInputElement`, `HTMLSelectElement`...).
- `href` -- `<a href="...">` (`HTMLAnchorElement`) uchun "href".
- `id` -- barcha elementlar uchun "id" atributining qiymati ('HTMLElement').
- ...va boshqalar...

Masalan:

```html run height="80"
<input type="text" id="elem" value="value">

<script>
  alert(elem.type); // "text"
  alert(elem.id); // "elem"
  alert(elem.value); // value
</script>
```

Ko'pgina standart HTML atribyutlari mos keladigan DOM xususiyatiga ega va biz unga shunday kirishimiz mumkin.

Agar biz ma'lum bir sinf uchun qo'llab-quvvatlanadigan xususiyatlarning to'liq ro'yxatini bilmoqchi bo'lsak, ularni spetsifikatsiyada topishimiz mumkin. Masalan, `HTMLInputElement` <https://html.spec.whatwg.org/#htmlinputelement> da hujjatlashtirilgan.

Yoki biz ularni tezda olishni istasak yoki aniq brauzer spetsifikatsiyasiga qiziqsak -- biz har doim `console.dir(elem)` yordamida elementni chiqarishimiz va xususiyatlarni o'qishimiz mumkin. Brauzer ishlab chiquvchi vositalarining Elementlar yorlig'ida "DOM xususiyatlari" bilan tanishing. 

## Xulosa 

Har bir DOMdagi node ma'lum bir classga tegishli. Class lar ierarxiyani tashkil qiladi. Xususiyat va usullarning to'liq to'plami meros natijasida yuzaga keladi.

DOM node ning asosiy xususiyatlari:

`nodeType`
: Biz undan matn yoki element node ekanligini bilish uchun foydalanishimiz mumkin. U raqamli qiymatga ega: elementlar uchun `1`, matn tugunlari uchun`3` va boshqa tugun turlari uchun yana bir nechta. Ular faqat o'qiladi.

`nodeName/tagName`
: Elementlar uchun teg nomi (XML rejimidan tashqari katta harflar bilan). Element bo'lmagan nodelar uchun `nodeName` nima ekanligini tasvirlab beradi. Ular faqat o'qiladi.

`innerHTML`
: Elementning HTML tarkibi. O'zgartirilishi mumkin.

`outerHTML`
: Elementdagi to'liq HTML. `elem.outerHTML` ga yozish operatsiyasi `elem` ning o'ziga tegmaydi. Buning o'rniga u tashqi kontekstda yangi HTML bilan almashtiriladi.

`nodeValue/data`
: Element bo'lmagan node ning mazmuni (matn, sharh). Bu ikkisi deyarli bir xil, odatda biz `data` dan foydalanamiz. O'zgartirish mumkin.

`textContent`
: Element ichidagi matn: HTML barcha `<tags>` ni minusga o'zgartiradi. Unga yozish matnni element ichiga qo'yadi, barcha maxsus belgilar va teglar aynan matn sifatida ko'rib chiqiladi. Foydalanuvchi tomonidan yaratilgan matnni xavfsiz kiritishi va keraksiz HTML qo'shimchalaridan himoya qilishi mumkin.

`hidden`
: `True` ga sozlanganda, CSS `display:none` bilan bir xil ishlaydi.

DOM node lari class dan tashqari boshqa xususiyatlarga ham ega. Masalan, `<input>` elementlari (`HTMLInputElement`) `value`, `type` ni qo`llab-quvvatlaydi, `<a>` elementlari (`HTMLanchorElement`) `href` va boshqalarni qo`llab-quvvatlaydi. Ko'pgina standart HTML atribyutlari mos keladigan DOM xususiyatiga ega.

Biroq, HTML atribyutlari va DOM xossalari har doim ham bir xil emas, buni keyingi bobda ko'rib chiqamiz.
