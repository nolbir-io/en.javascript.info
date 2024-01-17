# Qidirilmoqda: getElement*, querySelector*

Elementlar bir-biriga yaqin bo'lsa, DOM navigatsiya xususiyatlari juda yaxshi. Agar ular bo'lmasa-chi? Sahifaning ixtiyoriy elementini qanday olish mumkin?

Buning uchun qo'shimcha qidiruv usullari mavjud.

## document.getElementById yoki shunchaki id

Agar element `id` atributiga ega bo'lsa, qayerda bo'lishidan qat'iy nazar, biz elementni `document.getElementById(id)` usuli yordamida olishimiz mumkin. 

Masalan:

```html run
<div id="elem">
  <div id="elem-content">Element</div>
</div>

<script>
  // element ni oling
*!*
  let elem = document.getElementById('elem');
*/!*

  // orqa fonni qizil rang qiling
  elem.style.background = 'red';
</script>
```

Bundan tashqari, elementga havola qiluvchi `id` nomi bilan atalgan global o'zgaruvchi mavjud:

```html run
<div id="*!*elem*/!*">
  <div id="*!*elem-content*/!*">Element</div>
</div>

<script>
  // elem - id="elem" mavjud DOM-elementga havola
  elem.style.background = 'red';

  // id="elem-content" ichida defis bor, shuning uchun u o'zgaruvchi nomi bo'lishi mumkin emas
  // ...lekin biz unga kvadrat qavslar yordamida kirishimiz mumkin: window['elem-content']
</script>
```

...Agar biz bir xil nomli JavaScript o'zgaruvchisini e'lon qilmasak, u ustuvor bo'ladi:

```html run untrusted height=0
<div id="elem"></div>

<script>
  let elem = 5; // endi element <div id="elem"> ga havola emas, balki 5 dir

  alert(elem); // 5
</script>
```

```warn header="Iltimos, elementlarga kirish uchun id nomli global oʻzgaruvchilardan foydalanmang”
Bu xatti-harakat [spetsifikatsiyada] tasvirlangan (https://html.spec.whatwg.org/multipage/window-object.html#named-access-on-the-window-object), lekin u asosan moslik uchun qo'llab-quvvatlanadi. .

Brauzer JS va DOM nom maydonlarini aralashtirish orqali bizga yordam berishga harakat qiladi. Bu HTML ichiga kiritilgan oddiy skriptlar uchun mos, lekin umuman olganda yaxshi narsa emas. Nomlashda ziddiyatlar paydo bo'lishi mumkin. Bundan tashqari, JS kodini o'qiganda va HTML ko'rinmasa, o'zgaruvchining qayerdan kelgani aniq bo'lmaydi. 

Agar element qayerdan kelgani aniq bo'lsa, bu yerda o'quv qo'llanmada biz qisqalik uchun elementga to'g'ridan-to'g'ri murojaat qilish uchun `id` dan foydalanamiz. 

Real hayotda "document.getElementById" afzal ko'rilgan usul.
```

```smart header="`Id` noyob bo'lishi kerak`
`Id` noyob bo'lishi lozim. Hujjatda berilgan `id` bilan faqat bitta element bo'lishi mumkin.

Agar bir xil `id` ga ega bo'lgan bir nechta elementlar mavjud bo'lsa, uni ishlatadigan usullarning xatti-harakatlarini oldindan aytib bo'lmaydi, masalan, `document.getElementById`. Bunday elementlardan istalgan birini tasodifiy qaytarishi mumkin. Shuning uchun, iltimos, qoidaga rioya qiling va `id` ni noyob saqlang.
```

```warn header="Faqat `document.getElementById`, `anyElem.getElementById` emas"
`getElementById` usuli faqat `document` obyektida chaqirilishi mumkin. U butun hujjatda berilgan `id` ni qidiradi.
```

## querySelectorAll [#querySelectorAll]

Hozirgacha eng ko'p qirrali usul `elem.querySelectorAll(css)` berilgan CSS selektoriga mos keladigan `elem` ichidagi barcha elementlarni qaytaradi. 

Bu yerda biz oxirgi bolalar bo'lgan barcha `<li>` elementlarni qidiramiz:

```html run
<ul>
  <li>The</li>
  <li>test</li>
</ul>
<ul>
  <li>has</li>
  <li>passed</li>
</ul>
<script>
*!*
  let elements = document.querySelectorAll('ul > li:last-child');
*/!*

  for (let elem of elements) {
    alert(elem.innerHTML); // "test", "passed"
  }
</script>
```

Bu usul haqiqatan ham kuchli, chunki har qanday CSS selektoridan foydalanish mumkin.

```smart header="Pseudo-sinflardan ham foydalanishi mumkin"
CSS selektoridagi `:hover` va `:active` kabi psevdosinflar ham qo`llab-quvvatlanadi. Masalan, `document.querySelectorAll(':hover')` to'plamni ko'rsatgich hozir tugagan elementlar bilan qaytaradi (ichiga joylashtirish tartibida: eng tashqi `<html>`dan eng ko'p o'rnatilganiga).
```

## querySelector [#querySelector]

`elem.querySelector(css)` ga qo'ng'iroq berilgan CSS selektori uchun birinchi elementni qaytaradi.

Boshqacha qilib aytganda, natija `elem.querySelectorAll(css)[0]` bilan bir xil, lekin ikkinchisi *barcha* elementlarni qidiradi va birini tanlaydi, `elem.querySelector` esa faqat bittasini qidiradi. Shunday qilib, yozish tezroq va qisqaroq davom etadi.

## matches

Avvalgi usullar DOMni qidirishayotgan edi. 

[elem.matches(css)](https://dom.spec.whatwg.org/#dom-element-matches) hech narsani qidirmaydi, u faqat `elem` berilgan CSS selektoriga mos kelishini tekshiradi. U `true` yoki `false` ni qaytaradi.

Usul biz elementlarni (masalan, massivda yoki biror narsada) takrorlayotganimizda va bizni qiziqtirgan narsalarni filtrlashga harakat qilganimizda foydali bo'ladi.

Masalan:

```html run
<a href="http://example.com/file.zip">...</a>
<a href="http://ya.ru">...</a>

<script>
  // document.body.children o'rniga har qanday to'plam bo'lishi mumkin
  for (let elem of document.body.children) {
*!*
    if (elem.matches('a[href$="zip"]')) {
*/!*
      alert("The archive reference: " + elem.href );
    }
  }
</script>
```

## closest

Elementning *ajdodlari*: ota-ona, ota-onaning ota-onasi, uning ota-onasi va boshqalardir. Ajdodlar birgalikda elementdan tepaga qadar ota-onalar zanjirini tashkil qiladi. 

`elem.closest(css)` usuli CSS selektorga mos keladigan eng yaqin ajdodni qidiradi. `Elem` ning o'zi ham qidiruvga kiritilgan.

Boshqacha qilib aytganda, `closest` usuli elementdan yuqoriga ko'tariladi va har bir ota-onani tekshiradi. Agar u selektorga mos kelsa, qidiruv to'xtaydi va ajdod qaytariladi. 

Masalan:

```html run
<h1>Contents</h1>

<div class="contents">
  <ul class="book">
    <li class="chapter">Chapter 1</li>
    <li class="chapter">Chapter 2</li>
  </ul>
</div>

<script>
  let chapter = document.querySelector('.chapter'); // LI

  alert(chapter.closest('.book')); // UL
  alert(chapter.closest('.contents')); // DIV

  alert(chapter.closest('h1')); // null (chunki h1 ajdod emas)
</script>
```

## getElementsBy*

Teg, sinf va boshqalar bo'yicha tugunlarni qidirishning boshqa usullari ham mavjud.

Bugungi kunda ular asosan tarixdir, chunki `querySelector` kuchliroq va yozish uchun qisqaroq.

Shunday qilib, biz ularni asosan to'liqligi uchun ko'rib chiqamiz, siz ularni hali ham eski skriptlarda topishingiz mumkin.

- `elem.getElementsByTagName(tag)` berilgan teg bilan elementlarni qidiradi va ularning to'plamini qaytaradi. `Tag` parametri, shuningdek, "har qanday teglar" uchun yulduz `"*"` bo'lishi mumkin.
- `elem.getElementsByClassName(className)` berilgan CSS sinfiga ega elementlarni qaytaradi.
- `document.getElementsByName(name)` berilgan `name` atribyutiga ega bo'lgan elementlarni hujjat bo'ylab qaytaradi. Ular juda kam ishlatiladi.

Masalan:
```js
//hujjatdagi barcha divlarni oling
let divs = document.getElementsByTagName('div');
```

Jadval ichidagi barcha `input` teglarini topamiz:

```html run height=50
<table id="table">
  <tr>
    <td>Your age:</td>

    <td>
      <label>
        <input type="radio" name="age" value="young" checked> 18 dan kamroq
      </label>
      <label>
        <input type="radio" name="age" value="mature"> 18 dan 50 gacha
      </label>
      <label>
        <input type="radio" name="age" value="senior"> 60 dan ko'proq
      </label>
    </td>
  </tr>
</table>

<script>
*!*
  let inputs = table.getElementsByTagName('input');
*/!*

  for (let input of inputs) {
    alert( input.value + ': ' + input.checked );
  }
</script>
```

```warn header=" `\"s\"` harfini unutmang!
Ayrim dasturchilar ba'zan `"s"` harfini unutadi, ya'ni, ular <code>getElement<b>s</b>ByTagName</code> o'rniga `getElementByTagName` ni chaqirishga harakat qilishadi.

`getElementById` da `"s"` harfi mavjud emas, chunki u bitta elementni qaytaradi. Ammo `getElementsByTagName` elementlar to'plamini qaytaradi, shuning uchun ichida `"s"` mavjud.
```

````warn header="Bu element emas, balki to'plamni qaytaradi!"
Yana bir keng tarqalgan xato - bu yozish:

```js
// ishlamaydi
document.getElementsByTagName('input').value = 5;
```

Bu ishlamaydi, chunki u kirishlar *to'plamini* oladi va uning ichidagi elementlarga emas, balki unga qiymat beradi.

Biz to'plamni takrorlashimiz yoki uning indeksi bo'yicha elementni olishimiz va keyin quyidagicha belgilashimiz kerak:

```js
// ishlashi kerak (agar input mavjud bo'lsa)
document.getElementsByTagName('input')[0].value = 5;
```
````

`.article` elementlarni izlang:

```html run height=50
<form name="my-form">
  <div class="article">Article</div>
  <div class="long article">Long article</div>
</form>

<script>
  // nom atributi bo'yicha toping
  let form = document.getElementsByName('my-form')[0];

  // forma ichidan sinf bo'yicha toping
   let articles = form.getElementsByClassName('maqola');
   ogohlantirish(maqolalar.uzunlik); // 2, "maqola" sinfiga ega ikkita element topildi
</script>
```

## Jonli to'plamlar

Barcha `"getElementsBy*"` usullari *jonli* to'plamni qaytaradi. Bunday to'plamlar har doim hujjatning joriy holatini aks ettiradi va u o'zgarganda "avtomatik yangilanadi".

Quyidagi misolda ikkita skript mavjud.

1. Birinchisi `<div>` to`plamiga havola yaratadi. Hozircha uning uzunligi `1`.
2. Ikkinchi skriptlar brauzer yana bir `<div>` bilan uchrashgandan keyin ishlaydi, shuning uchun uning uzunligi `2`.

```html run
<div>First div</div>

<script>
  let divs = document.getElementsByTagName('div');
  alert(divs.length); // 1
</script>

<div>Second div</div>

<script>
*!*
  alert(divs.length); // 2
*/!*
</script>
```

Aksincha, `querySelectorAll` *statik* to'plamni qaytaradi. Bu elementlarning qat'iy massiviga o'xshaydi.

Agar biz uni o'rniga ishlatsak, ikkala skript `1` ni chiqaradi:


```html run
<div>First div</div>

<script>
  let divs = document.querySelectorAll('div');
  alert(divs.length); // 1
</script>

<div>Second div</div>

<script>
*!*
  alert(divs.length); // 1
*/!*
</script>
```

Endi biz farqni osongina ko'rishimiz mumkin. Hujjatda yangi `div` paydo bo'lgandan keyin statik to'plam oshmadi.

## Xulosa

DOM da node larni qidirishning 6 ta asosiy usuli mavjud:

<table>
<thead>
<tr>
<td>Method</td>
<td>Searches by...</td>
<td>Can call on an element?</td>
<td>Live?</td>
</tr>
</thead>
<tbody>
<tr>
<td><code>querySelector</code></td>
<td>CSS-selector</td>
<td>✔</td>
<td>-</td>
</tr>
<tr>
<td><code>querySelectorAll</code></td>
<td>CSS-selector</td>
<td>✔</td>
<td>-</td>
</tr>
<tr>
<td><code>getElementById</code></td>
<td><code>id</code></td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td><code>getElementsByName</code></td>
<td><code>name</code></td>
<td>-</td>
<td>✔</td>
</tr>
<tr>
<td><code>getElementsByTagName</code></td>
<td>tag or <code>'*'</code></td>
<td>✔</td>
<td>✔</td>
</tr>
<tr>
<td><code>getElementsByClassName</code></td>
<td>class</td>
<td>✔</td>
<td>✔</td>
</tr>
</tbody>
</table>

Hozirgacha eng ko'p ishlatiladiganlar `querySelector` va `querySelectorAll`dir, ammo `getElement(s)By*` vaqti-vaqti bilan foydali bo'lishi yoki eski skriptlarda topilishi mumkin.

Shuningdek:

- `elem` berilgan CSS selektoriga mos kelishini tekshirish uchun `elem.matches(css)` mavjud.
- Berilgan CSS selektorga mos keladigan eng yaqin ajdodni izlash uchun `elem.closest(css)` ishlatiladi. `Elem` ning o'zi ham tekshiriladi.

Keling, bu yerda bolaning ota-ona munosabatlarini tekshirishning yana bir usulini eslatib o'tamiz, chunki bu ba'zan foydalidir:
- `elemA.contains(elemB)`, agar `elemB` `elemA` (`elemA` avlodi) ichida bo'lsa yoki `elemA==elemB` bo'lsa, true ni qaytaradi.
