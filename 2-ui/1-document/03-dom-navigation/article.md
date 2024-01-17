libs:
  - d3
  - domtree

---


# DOM bo'ylab yurish

DOM bizga elementlar va ularning mazmuni bilan hamma narsani qilish imkonini beradi, lekin birinchi navbatda tegishli DOM obyektiga erishishimiz kerak.

DOMdagi barcha operatsiyalar `document` obyektidan boshlanadi. Bu DOMga asosiy "kirish nuqtasi" hisoblanadi. Undan biz istalgan node ga kirishimiz mumkin.

Quyida DOM node lari o'rtasida sayohat qilish imkonini beruvchi havolalar rasmi berilgan:

![](dom-links.svg)

Keling, ularni batafsilroq muhokama qilamiz.

## Yuqorida: hujjat elementi va tanasi

Eng yuqori daraxt node lari to'g'ridan-to'g'ri `document` xususiyatlari sifatida mavjud:

`<html>` = `document.documentElement`
: Hujjatning eng yuqori node lari `document.documentElement` hisoblanadi. Bu `<html>` tegining DOM tugunidir.

`<body>` = `document.body`
: Yana bir keng tarqalgan DOM tugunlari `<body>` elementidir -- `document.body`.

`<head>` = `document.head`
: `<head>` tegi `document.head` sifatida mavjud.

````warn header=`"E'tibor beramiz: `document.body` `null` bo'lishi mumkin"`
Skript ishlayotgan vaqtda mavjud bo'lmagan elementga kira olmaydi.

Xususan, agar skript `<head>` ichida bo'lsa, u holda `document.body` mavjud emas, chunki brauzer uni hali o'qimagan hisoblanadi.

Shunday qilib, quyidagi misolda birinchi `alert` `null` ni ko'rsatadi:

```html run
<html>

<head>
  <script>
*!*
    alert( "From HEAD: " + document.body ); // null, bu yerda hali <body> mavjud emas
*/!*
  </script>
</head>

<body>

  <script>
    alert( "From BODY: " + document.body ); // HTMLBodyElement, endi mavjud
  </script>

</body>
</html>
```
````

```smart header="DOM dunyosida `null` \"mavjud emas\" degan ma'noni anglatadi.
DOMda "null" qiymati "mavjud emas" yoki "bunday node yo'q" degan ma'noni anglatadi.
```

## Children: childNodes, firstChild, lastChild

Biz bundan keyin ikkita atamani ishlatamiz: 

- **Child nodes (yoki children)** -- bevosita bola bo'lgan elementlar. Boshqacha qilib aytganda, ular aynan berilgan joyga joylashtirilgan. Masalan, `<head>` va `<body>` `<html>` elementining bolalaridir.
- **Descendants** (avlodlar) -- berilgan bir joyga joylashtirilgan barcha elementlar, shu jumladan, bolalar, ularning bolalari va boshqalar.

Masalan, bu yerda `<body>` `<div>` va `<ul>` bolalari (va bir nechta bo'sh matn node lari) mavjud:

```html run
<html>
<body>
  <div>Begin</div>

  <ul>
    <li>
      <b>Information</b>
    </li>
  </ul>
</body>
</html>
```

...Va `<body>` avlodlari nafaqat bevosita `<div>`, `<ul>`, balki `<li>` (`<ul>` ning bolasi) va <b>` (`<li>` ning bolasi) kabi chuqurroq o`rnatilgan elementlar hamdir. Ular butun pastki daraxtdir.

**`childNodes` to'plamida barcha nodelar, jumladan, matn nodelari ro'yxati keltirilgan.**

Quyidagi berilgan misol `document.body` ning bolalarini ko'rsatadi:

```html run
<html>
<body>
  <div>Begin</div>

  <ul>
    <li>Information</li>
  </ul>

  <div>End</div>

  <script>
*!*
    for (let i = 0; i < document.body.childNodes.length; i++) {
      alert( document.body.childNodes[i] ); // Text, DIV, Text, UL, ..., SCRIPT
    }
*/!*
  </script>
  ...more stuff...
</body>
</html>
```

Bu yerda qiziqarli tafsilotga e'tibor bering. Agar yuqoridagi misolni ishlatsak, oxirgi ko'rsatilgan element `<script>` bo'ladi. Aslida, hujjat quyida ko'proq narsalarga ega, ammo skriptni bajarish vaqtida brauzer uni hali o'qimaganligi uchun skript uni ko'rmaydi.

**`firstChild` va `lastChild` xususiyatlari birinchi va oxirgi bolalarga tezkor kirish imkonini beradi.**

Ular shunchaki qisqartmalar. Agar bola node lari mavjud bo'lsa, unda quyidagilar har doim to'g'ri bo'ladi:
```js
elem.childNodes[0] === elem.firstChild
elem.childNodes[elem.childNodes.length - 1] === elem.lastChild
```

Bundan tashqari, har qanday bola nodelari mavjudligini tekshirish uchun `elem.hasChildNodes()` maxsus funksiyasi mavjud.

### DOM to'plamlari

Ko'rib turganimizdek, `childNodes` massivga o'xshaydi, lekin aslida bu massiv emas, balki *to'plam* -- massivga o'xshash maxsus takrorlanadigan obyektdir.

Ikkita muhim natijalar mavjud:

1. Biz uni takrorlash uchun `for..of` dan foydalanishimiz mumkin:
  ```js
  for (let node of document.body.childNodes) {
    alert(node); // to'plamdagi hamma node larni ko'rsatadi
  }
  ```
 Buning sababi, u takrorlanadigan (kerak bo'lganda, `Symbol.iterator` xususiyatini taqdim etadi).

2. Massiv (array) usullari ishlamaydi, chunki u massiv emas:
  ```js run
  alert(document.body.childNodes.filter); // aniqlanmagan (filter usuli mavjud emas!)
  ```

 Birinchi narsa ajoyib. Ikkinchisiga chidasa bo'ladi, chunki biz massiv usullarini xohlasak, to'plamdan "haqiqiy" massiv yaratish uchun `Array.from` dan foydalanishimiz mumkin:

  ```js run
  alert( Array.from(document.body.childNodes).filter ); // function
  ```

```warn header="DOM to'plamlari faqat o'qish uchun"
DOM to'plamlari va yana ko'p narsalar -- bu bobda keltirilgan *barcha* navigatsiya xususiyatlari faqat o'qish uchun mo'ljallangan.

Biz `childNodes[i] = ...`ni belgilab, bolani boshqa narsa bilan almashtira olmaymiz.

DOMni o'zgartirish boshqa usullarni talab qiladi, biz ularni keyingi bobda ko'ramiz.
```

```warn header="DOM to'plamlari jonli"
Kichik istisnolardan tashqari deyarli barcha DOM to'plamlari *jonli*. Boshqacha qilib aytganda, ular DOMning hozirgi holatini aks ettiradi.

Agar biz `elem.childNodes` havolasini saqlasak va DOMga node larni qo'shsak/o'chirsak, ular avtomatik ravishda to'plamda paydo bo'ladi.
```

````warn header="To'plamlarni ko'chirish uchun `for..in` dan foydalanmang"
To'plamlar `for..of` yordamida takrorlanadi. Ba'zan odamlar buning uchun `for..in` dan foydalanishga harakat qilishadi.

Iltimos, bunday qilmang. `For..in` sikli barcha sanab o'tiladigan xususiyatlarni takrorlaydi. To'plamlarda biz odatda olishni istamaydigan kamdan-kam ishlatiladigan "qo'shimcha" xususiyatlar mavjud:

```html run
<body>
<script>
  // 0, 1, uzunlik, element, qiymatlar va boshqalarni ko'rsatadi.
  for (let prop in document.body.childNodes) alert(prop);
</script>
</body>
````

## Siblings, ya'ni (birodarlar) va ota-onalar

*Siblings* bir ota-onaning farzandlari bo'lgan node lardir.

Masalan, bu yerda `<head>` va `<body>` siblings hisoblanadi:

```html
<html>
  <head>...</head><body>...</body>
</html>
```

- `<body>` `<head>`ning "keyingi" yoki "o'ng" sibling deb aytiladi,
- `<head>` `<body>`ning "oldingi" yoki "chap" sibling deb aytiladi.

Keyingi sibling `nextSibling` xususiyatida, oldingisi esa `previousSibling` da.

Ota-ona `parentNode` sifatida mavjud.

Masalan:

```js run
// <body> ning ota-onasi <html>
alert( document.body.parentNode === document.documentElement ); // true

// <head> dan keyin <body> keladi
alert( document.head.nextSibling ); // HTMLBodyElement

// <body> dan avval <head> keladi
alert( document.body.previousSibling ); // HTMLHeadElement
```

## Faqat elementli navigatsiya

Yuqorida sanab o'tilgan navigatsiya xususiyatlari *barcha* tugunlarga tegishli. Misol uchun, `childNodes` da biz ikkala matn node larini, element node larini va agar mavjud bo'lsa, sharh nodelarini ko'rishimiz mumkin.

Ammo ko'p vazifalar uchun biz matn yoki sharh tugunlarini xohlamaymiz. Biz teglarni ifodalovchi va sahifa strukturasini tashkil etuvchi element nodelarini manipulyatsiya qilmoqchimiz.

Shunday qilib, keling, faqat *element tugunlarini* hisobga oladigan ko'proq navigatsiya havolalarini ko'rib chiqaylik:

![](dom-links-elements.svg)

Havolalar yuqorida keltirilganlarga o'xshash, faqat ichida `Element` so'zi mavjud:

- `children` -- faqat element tugunlari bo'lgan nodelar.
- `firstElementChild`, `lastElementChild` -- birinchi va oxirgi element bolalar.
- `previousElementSibling`, `nextElementSibling` -- qo'shni elementlar.
- `parentElement` -- ota-ona elementi.

````smart header="Nega `parentElement`?Ota-ona element *bo'lmasligi* mumkinmi?»
`parentElement` xususiyati "element" ota-onasini, `parentNode` esa "har qanday node" ota-onasini qaytaradi. Bu xususiyatlar odatda bir xil: ikkalasi ham ota-onani oladi.

Bunda `document.documentElement` da istisno mavjud:

```js run
alert( document.documentElement.parentNode ); // document
alert( document.documentElement.parentElement ); // null
```

Sababi `document.documentElement` (`<html>`) da ildiz nodening ota-onasi sifatida `document` mavjud, lekin `document` element node emas, shuning uchun `parentNode` uni qaytaradi, `parentElement` esa qaytarmaydi.

Bu tafsilot biz ixtiyoriy element `elem`dan `<html>`ga o'tishni xohlaganimizda foydali bo'lishi mumkin, lekin `document`ga emas:
```js
while(elem = elem.parentElement) { // <html> gacha ko'taring
  alert( elem );
}
```
````

Yuqoridagi misollardan birini o'zgartiramiz: `childNodes` ni `children` bilan almashtiring. Endi u faqat elementlarni ko'rsatadi:

```html run
<html>
<body>
  <div>Begin</div>

  <ul>
    <li>Information</li>
  </ul>

  <div>End</div>

  <script>
*!*
    for (let elem of document.body.children) {
      alert(elem); // DIV, UL, DIV, SCRIPT
    }
*/!*
  </script>
  ...
</body>
</html>
```

## Ko'proq havolalar: table lar [#dom-navigation-tables]

Hozirgacha biz asosiy navigatsiya xususiyatlarini tasvirlab berdik.
DOM elementlarining ayrim turlari qulaylik uchun ularning turiga xos qo'shimcha xususiyatlarni taqdim etishi mumkin.

Jadvallar bunga ajoyib misol bo'lib, ayniqsa muhim ishni ifodalaydi:

**`<table>`** elementi (yuqorida keltirilganlarga qo'shimcha ravishda) quyidagi xususiyatlarni qo'llab-quvvatlaydi:
- `table.rows` -- jadvalning `<tr>` elementlari to`plami.
- `table.caption/tHead/tFoot` -- `<caption>`, `<thead>`, `<tfoot>` elementlariga havolalar.
- `table.tBodies` -- `<tbody>` elementlar to'plami (standartga ko'ra ko'p bo'lishi mumkin, lekin har doim kamida bitta bo'ladi -- HTML manbasida bo'lmasa ham, brauzer uni DOMga joylashtiradi). 

**`<thead>`, `<tfoot>`, `<tbody>`** elementlar `rows`, ya'ni satrlar xususiyatini ta'minlaydi:
- `tbody.rows` -- ichidagi `<tr>` to'plami.

**`<tr>`:**
- `tr.cells` -- berilgan `<tr>` ichidagi `<td>` va `<th>` hujayralar to`plami.
- `tr.sectionRowIndex` -- berilgan `<tr>` ning qo'shimcha `<thead>/<tbody>/<tfoot>` ichidagi o'rni (indeks).
- `tr.rowIndex` -- umumiy jadvaldagi `<tr>` soni (jadvalning barcha satrlari bilan birga).

**`<td>` and `<th>`:**
- `td.cellIndex` -- o'rab turgan `<tr>` ichidagi katak soni.

Foydalanish misoli:

```html run height=100
<table id="table">
  <tr>
    <td>one</td><td>two</td>
  </tr>
  <tr>
    <td>three</td><td>four</td>
  </tr>
</table>

<script>
  // get td with "two" (birinchi qator, ikkinchi ustun)
  let td = table.*!*rows[0].cells[1]*/!*;
  td.style.backgroundColor = "red"; // uni belgilab o'ting
</script>
```

Spesifikatsiya: [jadval ma'lumotlari](https://html.spec.whatwg.org/multipage/tables.html).

HTML shakllari uchun qo'shimcha navigatsiya xususiyatlari ham mavjud. Biz ularni keyinroq shakllar bilan ishlashni boshlaganimizda ko'rib chiqamiz.

## Xulosa

DOM tugunini hisobga olgan holda, biz navigatsiya xususiyatlaridan foydalanib, uning yaqin qo'shnilariga borishimiz mumkin.

Ularning ikkita asosiy to'plami mavjud: 

- Hamma node lar uchun: `parentNode`, `childNodes`, `firstChild`, `lastChild`, `previousSibling`, `nextSibling`.
- Faqat element node lari uchun: `parentElement`, `children`, `firstElementChild`, `lastElementChild`, `previousElementSibling`, `nextElementSibling`.

DOM elementlarining ayrim turlari, masalan, jadvallar, ularning tarkibiga kirish uchun qo'shimcha xususiyatlar va to'plamlarni taqdim eting.
