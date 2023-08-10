# Hujjatni o'zgartirish
DOM modifikatsiyasi "jonli" sahifalarni yaratish kalitidir.

Bu yerda biz "tezda" yangi elementlarni qanday yaratishni va mavjud sahifa tarkibini o'zgartirishni ko'rib chiqamiz.
## Misol: xabarni ko'rsatish

Keling, misol yordamida ko'rsatamiz. Biz sahifaga `alert`dan ko'ra yoqimliroq ko'rinadigan xabarni qo'shamiz.

Bu shunday ko'rinadi:

```html autorun height="80"
<style>
.alert {
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>

*!*
<div class="alert">
  <strong>Hi there!</strong> Siz muhim xabarni o'qidingiz.
</div>
*/!*
```

Bu HTML misoli edi. Keling, JavaScript bilan bir xil `div` ni yarataylik (styles, ya'ni uslublar allaqachon HTML/CSSda deb tasavvur qilamiz).

## Elementni yaratish

DOM tugunlarini yaratish uchun ikkita usul mavjud:
`document.createElement(tag)`
: Berilgan teg bilan yangi *element node* yaratadi:

    ```js
    let div = document.createElement('div');
    ```

`document.createTextNode(text)`
: Berilgan matn bilan yangi *matn tugunini* yaratadi:

    ```js
    let textNode = document.createTextNode('Here I am');
    ```

Ko'pincha biz xabar uchun `div` kabi element tugunlarini yaratishimiz kerak.

### Xabar yaratish

Div xabarini yaratish 3 bosqichdan iborat:

```js
// 1. <div> elementni yarating
let div = document.createElement('div');

// 2. Uning class'ini "alert" ga o'rnating
div.className = "alert";

// 3.Uni tarkib bilan to'ldiring
div.innerHTML = "<strong>Hi there!</strong> You've read an important message.";
```

Biz elementni yaratdik. Lekin hozircha u sahifada emas, faqat `div` nomli o'zgaruvchida. Shuning uchun biz buni ko'ra olmaymiz.

## Kiritish usullari

`Div` ko'rinishi uchun uni `document` ning biron bir joyiga kiritishimiz kerak. Masalan, `document.body` tomonidan havola qilingan `<body>` elementiga.

Buning uchun maxsus `append`, ya'ni qo'shish usuli mavjud: `document.body.append(div)`.

Mana to'liq kod:

```html run height="80"
<style>
.alert {
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>

<script>
  let div = document.createElement('div');
  div.className = "alert";
  div.innerHTML = "<strong>Hi there!</strong> You've read an important message.";

*!*
  document.body.append(div);
*/!*
</script>
```

Bu yerda biz `document.body` da `append` deb nom oldik, lekin boshqa elementga boshqa element qo'yish uchun `append` usulini chaqirishimiz mumkin. Masalan, biz `<div>` ga `div.append(anotherElement)` ni chaqirish orqali biror narsa qo`shishimiz mumkin.

Bu yerda qo'shimcha kiritish usullari mavjud, ular qayerga qo'yish kerakligini ko'rsatadilar:

- `node.append(...nodes or strings)` -- `node` *oxirida* nodelar yoki satrlarni qo'shing,
- `node.prepend(...nodes or strings)` -- nodelar yoki satrlarni `node` ning *boshiga* kiriting,
- `node.before(...nodes or strings)` –- nodelar yoki satrlarni `node` dan *oldin* kiriting,
- `node.after(...nodes or strings)` –- nodelar yoki satrlarni `node`dan *keyin* qo'ying,
- `node.replaceWith(...nodes or strings)` –- `node` ni berilgan nodelar yoki satrlar bilan almashtiradi.

Ushbu usullarning argumentlari kiritish uchun DOM tugunlarining ixtiyoriy ro'yxati yoki matn satrlaridir (ular avtomatik ravishda matn node'lariga aylanadi).

Keling, ularni amalda ko'ramiz.

Ro'yxatga elementlarni va undan oldingi/keyin matnni qoʻshish uchun ushbu usullardan foydalanishga misol:

```html autorun
<ol id="ol">
  <li>0</li>
  <li>1</li>
  <li>2</li>
</ol>

<script>
  ol.before('before'); // <ol> dan oldin "before" qatorini kiriting
  ol.after('after'); // <ol> dan keyin "after" qatorini kiriting

  let liFirst = document.createElement('li');
  liFirst.innerHTML = 'prepend';
  ol.prepend(liFirst); // <ol> ning boshiga liFirst ni kiriting

  let liLast = document.createElement('li');
  liLast.innerHTML = 'append';
  ol.append(liLast); // <ol> ning oxiriga liLast ni kiriting
</script>
```

Usullar nima vazifa bajarishining vizual rasmi:

![](before-prepend-append-after.svg)

Shunday qilib, yakuniy ro'yxat quyidagicha bo'ladi:

```html
before
<ol id="ol">
  <li>prepend</li>
  <li>0</li>
  <li>1</li>
  <li>2</li>
  <li>append</li>
</ol>
after
```

Aytganimizdek, bu usullar bitta qo'ng'iroqda bir nechta tugun va matn qismlarini kiritishi mumkin.

Masalan, bu yerda satr va element kiritiladi:

```html run
<div id="div"></div>
<script>
  div.before('<p>Hello</p>', document.createElement('hr'));
</script>
```

Iltimos, diqqat qiling: matn `<`, `>` kabi belgilardan to'g'ri qochish bilan "as HTML" (HTML sifatida emas), "ast text", ya'ni matn sifatida kiritiladi.

Shunday qilib, yakuniy HTML:

```html run
*!*
&lt;p&gt;Hello&lt;/p&gt;
*/!*
<hr>
<div id="div"></div>
```

Boshqacha qilib aytganda, satrlar xavfsiz tarzda kiritiladi, masalan, `elem.textContent` buni amalga oshiradi.

Shunday qilib, bu usullar faqat DOM tugunlari yoki matn qismlarini kiritish uchun ishlatilishi mumkin.

Lekin, agar biz HTML qatorini barcha teglar va ma'lumotlar `elem.innerHTML` bilan bir xil tarzda ishlaydigan "as hmtl", html sifatida kiritmoqchi bo'lsak-chi?

## insertAdjacentHTML/Text/Element

Buning uchun biz boshqa, juda ko'p qirrali usuldan foydalanishimiz mumkin: `elem.insertAdjacentHTML(qayerda, html)`.

Birinchi parametr `elem` ga nisbatan qayerga kiritish kerakligini ko'rsatuvchi kod so'zidir. Quyidagilardan biri bo'lishi kerak:

- `"beforebegin"` -- `elem` dan oldin darhol `html` ni qo'ying,
- `"afterbegin"` -- boshida `elem` ga `html` ni kiriting,
- `"beforeend"` -- oxirida `elem` ga `html` ni kiriting,
- `"afterend"` -- `elem` dan keyin darhol `html` ni qo'ying.

Ikkinchi parametr HTML qatori bo'lib, u "HTML sifatida" kiritiladi.

Masalan:

```html run
<div id="div"></div>
<script>
  div.insertAdjacentHTML('beforebegin', '<p>Hello</p>');
  div.insertAdjacentHTML('afterend', '<p>Bye</p>');
</script>
```

...Bunga olib keladi:

```html run
<p>Hello</p>
<div id="div"></div>
<p>Bye</p>
```
Shunday qilib biz sahifaga ixtiyoriy HTML qo'shishimiz mumkin.

Qo'shish variantlari rasmi:

![](insert-adjacent.svg)

Bu va oldingi rasm o'rtasidagi o'xshashlikni osongina payqashimiz mumkin. Qo'shish nuqtalari aslida bir xil, ammo bu usul HTMLni kiritadi.

Usulning ikkita ukasi bor:

- `elem.insertAdjacentText(where, text)` -- bir xil sintaksis, lekin HTML o'rniga `text` qatori "as text" deb kiritiladi,
- `elem.insertAdjacentElement(where, elem)` -- bir xil sintaksis, lekin elementni kiritadi.

Ular asosan sintaksisni "uniform" qilish uchun mavjud. Amalda ko'pincha faqat `insertAdjacentHTML` ishlatiladi. Chunki elementlar va matn uchun bizda `append/prepend/before/after` usullari mavjud -- ular yozish uchun qisqaroq va nodelarni/matn qismlarini kiritishi mumkin.

Shunday qilib, xabarni ko'rsatishning muqobil varianti:

```html run
<style>
.alert {
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>

<script>
  document.body.insertAdjacentHTML("afterbegin", `<div class="alert">
    <strong>Hi there!</strong> You've read an important message.
  </div>`);
</script>
```

## Node'ni olib tashlash

Node'ni olib tashlash uchun `node.remove()` usuli mavjud.

Keling, xabarimizni bir soniyadan keyin yo'q qilaylik:

```html run untrusted
<style>
.alert {
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>

<script>
  let div = document.createElement('div');
  div.className = "alert";
  div.innerHTML = "<strong>Hi there!</strong> You've read an important message.";

  document.body.append(div);
*!*
  setTimeout(() => div.remove(), 1000);
*/!*
</script>
```

E'tibor bering: agar biz elementni boshqa joyga *ko'chirmoqchi* bo'lsak -- uni eskisidan olib tashlashning hojati yo'q.

**Barcha kiritish usullari nodeni eski joydan avtomatik ravishda olib tashlaydi.**

Masalan, elementlarni almashtiramiz:

```html run height=50
<div id="first">First</div>
<div id="second">Second</div>
<script>
  // remove ni chaqirishga hojat yo'q
  second.after(first); // #second ni oling va undan keyin #first ni kiriting
</script>
```

## Nodelarni klonlash: cloneNode

Yana bir shunga o'xshash xabarni qanday kiritish kerak?

Biz funktsiyani yaratib, kodni u yerga qo'yishimiz mumkin. Biroq, muqobil yo'l - mavjud `div` ni *klonlash* va uning ichidagi matnni o'zgartirish (agar kerak bo'lsa).

Ba'zan bizda katta element bo'lsa, bu tezroq va sodda bo'lishi mumkin.

- `Elem.cloneNode(true)` chaqiruvi elementning "deep (chuqur)" klonini yaratadi -- barcha atribyutlar va pastki elementlar bilan. Agar biz `elem.cloneNode(false)` deb atasak, u holda klon asosiy elementlarsiz amalga oshiriladi.

Xabarni nusxalash misoli:

```html run height="120"
<style>
.alert {
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>

<div class="alert" id="div">
  <strong>Hi there!</strong> You've read an important message.
</div>

<script>
*!*
  let div2 = div.cloneNode(true); // xabarni klonlang
  div2.querySelector('strong').innerHTML = 'Bye there!'; // klonni o'zgartiring

  div.after(div2); // mavjud divdan keyin klonni ko'rsating
*/!*
</script>
```

## DocumentFragment [#document-fragment]

`DocumentFragment` - bu nodelar ro'yxatini o'tkazish uchun o'rash vazifasini bajaradigan maxsus DOM node hisoblanadi.

Biz unga boshqa nodelarni qo'shishimiz mumkin, lekin biz uni biror joyga qo'shganimizda, uning o'rniga uning kontenti kiritiladi.

Masalan, quyidagi `getListContent` keyinchalik `<ul>` ichiga kiritiladigan `<li>` elementlardan iborat fragment hosil qiladi:

```html run
<ul id="ul"></ul>

<script>
function getListContent() {
  let fragment = new DocumentFragment();

  for(let i=1; i<=3; i++) {
    let li = document.createElement('li');
    li.append(i);
    fragment.append(li);
  }

  return fragment;
}

*!*
ul.append(getListContent()); // (*)
*/!*
</script>
```
E'tibor bering, oxirgi `(*)` qatoriga biz `DocumentFragment` qo'shamiz, lekin u birlashadi, ya'ni "blends in", natijada tuzilma quyidagicha bo'ladi:

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

`DocumentFragment`kamdan-kam hollarda aniq ishlatiladi. Agar biz nodelar qatorini qaytarishimiz mumkin bo'lsa, nima uchun maxsus turdagi nodega qo'shiladi? Qayta yozilgan misol:

```html run
<ul id="ul"></ul>

<script>
function getListContent() {
  let result = [];

  for(let i=1; i<=3; i++) {
    let li = document.createElement('li');
    li.append(i);
    result.push(li);
  }

  return result;
}

*!*
ul.append(...getListContent()); // append + "..." operatori = friends!
*/!*
</script>
```

Biz `DocumentFragment` ni, asosan, [template](info:template-element) elementi kabi ba'zi tushunchalar borligi uchun eslatib o'tamiz, biz ularni keyinroq ko'rib chiqamiz.

## Old school, ya'ni eski maktab qo'shish/o'chirish usullari

[old]

Tarixiy sabablarga ko'ra mavjud bo'lgan "old school" DOM manipulyatsiyasi usullari ham mavjud.

Bu usullar haqiqatan ham qadim zamonlardan beri mavjud. Hozirda ulardan foydalanishga hech qanday asos yo'q, chunki `append`, `prepend`, `before`, `after`, `remove`, `replaceWith` kabi zamonaviy usullar ancha moslashuvchan.

Ushbu usullarni bu yerda sanab o'tishimizning yagona sababi shundaki, siz ularni ko'plab eski skriptlarda topishingiz mumkin:

`parentElem.appendChild(node)`
: `node` ni `parentElem` ning oxirgi bolasi sifatida qo'shadi.

    Quyidagi misol `<ol>` oxiriga yangi `<li>` qo'shadi:

    ```html run height=100
    <ol id="list">
      <li>0</li>
      <li>1</li>
      <li>2</li>
    </ol>

    <script>
      let newLi = document.createElement('li');
      newLi.innerHTML = 'Hello, world!';

      list.appendChild(newLi);
    </script>
    ```

`parentElem.insertBefore(node, nextSibling)`
: `NextSibling` oldidan `node`ni `parentElem` ga kiritadi.

   Quyidagi kod ikkinchi `<li>` oldiga yangi ro'yxat elementini kiritadi:

    ```html run height=100
    <ol id="list">
      <li>0</li>
      <li>1</li>
      <li>2</li>
    </ol>
    <script>
      let newLi = document.createElement('li');
      newLi.innerHTML = 'Hello, world!';

    *!*
      list.insertBefore(newLi, list.children[1]);
    */!*
    </script>
    ```
    Birinchi element sifatida `newLi` ni kiritish uchun biz buni shunday qilishimiz mumkin:

    ```js
    list.insertBefore(newLi, list.firstChild);
    ```

`parentElem.replaceChild(node, oldChild)`
: `parentElem` bolalari orasida `oldChild` `node` bilan almashtiriladi.

`parentElem.removeChild(node)`
: `node`ni `parentElem` dan olib tashlaydi (agar `node` uning bolasi bo'lsa).

  Quyidagi misol `<ol>` dan birinchi `<li>`ni olib tashlaydi:

    ```html run height=100
    <ol id="list">
      <li>0</li>
      <li>1</li>
      <li>2</li>
    </ol>

    <script>
      let li = list.firstElementChild;
      list.removeChild(li);
    </script>
    ```

Ushbu usullarning barchasi kiritilgan/olib tashlangan nodeni qaytaradi. Boshqacha qilib aytganda, `parentElem.appendChild(node)` `node`ni qaytaradi. Lekin odatda qaytarilgan qiymat ishlatilmaydi, biz faqat usulni ishga tushiramiz.

## "document.write" haqida bir so'z

Veb-sahifaga biror narsa qo'shishning yana bir juda qadimiy usuli bor: `document.write`.

Sintaksis:

```html run
<p>Somewhere in the page...</p>
*!*
<script>
  document.write('<b>Hello from JS</b>');
</script>
*/!*
<p>The end</p>
```

`document.write(html)` ga qo'ng'iroq `html` ni "hozir va shu yerda" sahifasiga yozadi. `html` qatori dinamik ravishda yaratilishi mumkin, shuning uchun u qandaydir moslashuvchan. To'liq veb-sahifa yaratish va uni yozish uchun JavaScriptdan foydalanishimiz mumkin.

Usul DOM, standartlar bo'lmagan eski vaqtlardan kelib chiqadi...  U hali ham yashaydi, chunki undan foydalanadigan skriptlar mavjud.

Muhim cheklovlar sabab zamonaviy skriptlarda biz uni kamdan-kam ko'rishimiz mumkin:

**`Document.write`ga qo'ng'iroq faqat sahifa yuklanayotganda ishlaydi.**

Agar biz uni keyinroq chaqirsak, mavjud hujjat tarkibi o'chiriladi.    

masalan:

```html run
<p>Bir soniyadan keyin bu sahifaning kontenti almashtiriladi...

</p>
*!*
<script>
  // 1 sekunddan keyin document.write
  // Bu sahifa yuklangandan keyin, shuning uchun u mavjud tarkibni o'chiradi
  setTimeout(() => document.write('<b>...By this.</b>'), 1000);
</script>
*/!*
```

Shunday qilib, biz yuqorida aytib o'tgan boshqa DOM usullaridan farqli ravishda "after loaded", ya'ni (yuklangandan keyin) bosqichda foydalanish mumkin emas.

Salbiy tomoni shu.

O'ziga xos tomoni ham bor. Texnik jihatdan, brauzer kiruvchi HTMLni o'qiyotganda ("tahlil") `document.write` chaqirilsa va u biror narsa yozsa, brauzer uni xuddi HTML matnida bo'lgani kabi iste'mol qiladi.

Shunday qilib, u juda tez ishlaydi, chunki *hech qanday DOM modifikatsiyasi mavjud emas*. U to'g'ridan-to'g'ri sahifa matniga yozadi, DOM hali qurilmagan.

Shunday qilib, agar biz HTMLga dinamik ravishda ko'p matn qo'shishimiz kerak bo'lsa va biz sahifani yuklash bosqichida bo'lsak va tezlik muhim bo'lsa, bu yordam berishi mumkin. Ammo amalda bu talablar kamdan-kam uchraydi. Va odatda biz bu usulni skriptlarda eski bo'lgani uchun ko'rishimiz mumkin.

## Xulosa

- Yangi nodelarni yaratish usullari:
    - `document.createElement(tag)` -- berilgan teg bilan element yaratadi,
    - `document.createTextNode(value)` -- matn node'ni yaratadi (kamdan-kam ishlatiladi),
    - `elem.cloneNode(deep)` -- agar `deep==true` bo'lsa barcha avlodlar bilan elementni klonlaydi.

- O'rnatish va olib tashlash:
    - `node.append(...nodes or strings)` -- oxirida `node` ga kiriting,
    - `node.prepend(...nodes or strings)` -- boshida `node`ga kiriting,
    - `node.before(...nodes or strings)` –- `node` dan oldin to'g'ri kiriting,
    - `node.after(...nodes or strings)` –- `node`dan keyin to'g'ri kiriting,
    - `node.replaceWith(...nodes or strings)` –- `node` ni almashtiring.
    - `node.remove()` –- `node` ni olib tashlang.

    Matn satrlari "matn sifatida" kiritiladi.

- Shuningdek, "old school" usullari mavjud:
    - `parent.appendChild(node)`
    - `parent.insertBefore(node, nextSibling)`
    - `parent.removeChild(node)`
    - `parent.replaceChild(newElem, node)`

    Ushbu usullarning barchasi `node` ni qaytaradi.

   - `html` faylida ba'zi HTML berilgan bo'lsa, `elem.insertAdjacentHTML(qayerda, html)` uni `where` qiymatiga qarab kiritadi:
    - `"beforebegin"` -- `elem` oldiga `html` ni qo'ying,
    - `"afterbegin"` -- boshida `elem` ga `html` ni kiriting,
    - `"beforeend"` -- oxirida `elem` ga `html` ni kiriting,
    - `"afterend"` -- `elem` dan keyin darhol `html` ni qo'ying.

    Shuningdek, matn satrlari va elementlarini kirituvchi `elem.insertAdjacentText` va `elem.insertAdjacentElement` kabi usullar mavjud, lekin ular kamdan-kam qo'llaniladi.

- Yuklash tugagunga qadar sahifaga HTML qo'shish uchun:
    - `document.write(html)`

    Sahifani yuklagandan so'ng, bunday qo'ng'iroq hujjatni o'chiradi. Bu ko'pincha eski skriptlarda ko'rinadi.
