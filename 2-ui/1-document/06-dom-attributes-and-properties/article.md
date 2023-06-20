# Atributlar va xususiyatlar

Brauzer sahifani yuklaganida, u HTMLni "o'qiydi" (boshqa so'z: "ajraladi") va undan DOM obyektlarini yaratadi. Element nodelari uchun ko'pgina standart HTML atributlari avtomatik ravishda DOM obyektlarining xususiyatlariga aylanadi.

Masalan, teg `<body id="page">` bo'lsa, DOM obyektida `body.id="page"` bo'ladi.

Lekin atribut-xususiyat xaritasi birma-bir emas! Ushbu bobda biz bu ikki tushunchani bir-biridan ajratishga, ular bilan qanday ishlashni, qachon bir xil va qachon farq qilishini ko'rib chiqamiz.

## DOM xususiyatlari

Biz allaqachon o'rnatilgan DOM xususiyatlarini ko'rganmiz. Ko'p bor. Lekin texnik jihatdan hech kim bizni cheklamaydi va agar yetarli bo'lmasa, biz o'zimiznikini qo'shishimiz mumkin.

DOM tugunlari oddiy JavaScript obyektlaridir. Biz ularni o'zgartirishimiz mumkin.

Masalan, `document.body` da yangi xususiyat yarataylik:

```js run
document.body.myData = {
  name: 'Caesar',
  title: 'Imperator'
};

alert(document.body.myData.title); // Imperator
```

shuningdek biz usul ham qo'shishimiz mumkin:

```js run
document.body.sayTagName = function() {
  alert(this.tagName);
};

document.body.sayTagName(); // BODY (usuldagi "this" qiymati - document.body)
```

Shuningdek, biz `Element.prototype` kabi o'rnatilgan prototiplarni o'zgartirishimiz va barcha elementlarga yangi usullarni qo'shishimiz mumkin:

```js run
Element.prototype.sayHi = function() {
  alert(`Hello, I'm ${this.tagName}`);
};

document.documentElement.sayHi(); // Hello, I'm HTML
document.body.sayHi(); // Hello, I'm BODY
```

Shunday qilib, DOM xossalari va usullari xuddi oddiy JavaScript obyektlari kabi ishlaydi:

- Ular har qanday qiymatga ega bo'lishi mumkin.
- Ular katta-kichik harflarga sezgir (`elem.NoDeTyPe` emas, `elem.nodeType` yozing).

## HTML atribyutlari

HTMLda teglar atributlarga ega bo'lishi mumkin. Brauzer teglar uchun DOM obyektlarini yaratish uchun HTMLni tahlil qilganda, u *standart* atributlarni taniydi va ulardan DOM xususiyatlarini yaratadi.

Shunday qilib, element `id` yoki boshqa *standart* atribyutiga ega bo'lsa, tegishli xususiyat yaratiladi. Ammo atribut nostandart bo'lsa, bu sodir bo'lmaydi.

Masalan:
```html run
<body id="test" something="non-standard">
  <script>
    alert(document.body.id); // test
*!*
    // nostandart atribut xususiyatni bermaydi
    alert(document.body.something); // aniqlanmagan
*/!*
  </script>
</body>
```

E'tibor bering, bir element uchun standart atribut boshqasi uchun noma'lum bo'lishi mumkin. Misol uchun, `"type"` `<input>` ([HTMLInputElement](https://html.spec.whatwg.org/#htmlinputelement)) uchun standart, lekin `<body>` ([HTMLBodyElement] uchun emas. (https://html.spec.whatwg.org/#htmlbodyelement)). Standart atribyutlar tegishli element sinfi spetsifikatsiyasida tasvirlangan.

Quyidagi misolni ko'rib chiqamiz:
```html run
<body id="body" type="...">
  <input id="input" type="text">
  <script>
    alert(input.type); // text
*!*
    alert(body.type); // aniqlanmagan: DOM xususiyati yaratilmagan, chunki u nostandart
*/!*
  </script>
</body>
```

Shunday qilib, agar atribut nostandart bo'lsa, u uchun DOM xususiyati bo'lmaydi. Bunday atributlarga kirishning yo'li bormi?

Albatta. Barcha atributlarga quyidagi usullar yordamida kirish mumkin:

- `elem.hasAttribute(name)` -- mavjudligini tekshiradi.
- `elem.getAttribute(name)` -- qiymatni oladi.
- `elem.setAttribute(name, value)` -- qiymatni o'rnatadi.
- `elem.removeAttribute(name)` -- atribyutni olib tashlaydi.

Ushbu usullar HTMLda yozilgan narsalar bilan to'liq ishlaydi.

Shuningdek, `elem.attributes` yordamida barcha atributlarni o'qish mumkin: o'rnatilgan [Attr](https://dom.spec.whatwg.org/#attr) sinfiga tegishli obyektlar to'plami, `name` va `qiymat` xususiyatlari.

Bu yerda nostandart xususiyatni o'qish demosi:

```html run
<body something="non-standard">
  <script>
*!*
    alert(document.body.getAttribute('something')); // non-standard
*/!*
  </script>
</body>
```

HTML atributlari quyidagi xususiyatlarga ega:

- Ularning nomi katta-kichik harflarni sezmaydi (`id` `ID` bilan bir xil).
- Ularning qiymatlari doimo satrdir.

Mana atributlar bilan ishlashning kengaytirilgan demosi:

```html run
<body>
  <div id="elem" about="Elephant"></div>

  <script>
    alert( elem.getAttribute('About') ); // (1) 'Elephant', reading

    elem.setAttribute('Test', 123); // (2), writing

    alert( elem.outerHTML ); // (3), atribut HTMLda ekanligini tekshiring (ha)

    for (let attr of elem.attributes) { // (4) hammasini ro'yxatga oling
      alert( `${attr.name} = ${attr.value}` );
    }
  </script>
</body>
```

Esda tuting:

1. `getAttribute('About')` -- bu yerda birinchi harf katta, HTMLda esa hammasi kichik. Lekin bu muhim emas: atribyut nomlari katta-kichik harflarga sezgir emas.
2. Biz atribyutga har qanday narsani belgilashimiz mumkin, lekin u satrga aylanadi. Shunday qilib, bizda qiymat sifatida "123" mavjud.
3. Barcha atributlar, jumladan, biz oʻrnatgan atributlar `outerHTML` da koʻrinadi.
4. `Atribyutlar` to'plami takrorlanadi va elementning barcha atribyutlariga (standart va nostandart) `name` va `value` xususiyatlariga obyektlar sifatida ega.

## Xususiyat-atribyutlarni sinxronlashtirish

Standart atribut o'zgarganda, tegishli xususiyat avtomatik yangilanadi va (ba'zi istisnolardan tashqari) aksincha yangilanmaydi.

Quyidagi misolda `id` atribyut sifatida o'zgartirilgan va biz xususiyat ham o'zgarganini ko'rishimiz mumkin. Va keyin bir xil orqaga qaytaramiz:

```html run
<input>

<script>
  let input = document.querySelector('input');

  // atribyut => xususiyat
  input.setAttribute('id', 'id');
  alert(input.id); // id (yangilangan)

  // xususiyat => atribyut
  input.id = 'newId';
  alert(input.getAttribute('id')); // newId (yangilangan)
</script>
```

Ammo istisnolar mavjud, masalan, `input.value` faqat atribyut -> xususiyatdan sinxronlanadi, lekin orqaga emas:

```html run
<input>

<script>
  let input = document.querySelector('input');

  // atribyut => xususiyat
  input.setAttribute('value', 'text');
  alert(input.value); // text

*!*
  // NOT property => attribute
  input.value = 'newValue';
  alert(input.getAttribute('value')); // text (yangilanmagan!)
*/!*
</script>
```

Yuqoridagi misolda:
- `value` atribyutini o'zgartirish xususiyatni yangilaydi.
- Lekin xususiyat o'zgarishi atribyutga ta'sir qilmaydi.

Bu "xususiyat" aslida foydali bo'lishi mumkin, chunki foydalanuvchi harakatlari `value` ning o'zgarishiga olib kelishi mumkin va undan keyin, agar biz HTML'dan "asl" qiymatni tiklamoqchi bo'lsak, u atribyutda bo'ladi.

## DOM xususiyatlari yoziladi

DOM xususiyatlari har doim ham satrlar emas. Masalan, `input.checked` xususiyati (belgilash qutilari uchun) mantiqiy hisoblanadi:

```html run
<input id="input" type="checkbox" checked> checkbox

<script>
  alert(input.getAttribute('checked')); // atribut qiymati: bo'sh satr
  alert(input.checked); // xususiyat qiymati: true
</script>
```

Boshqa misollar ham bor. `style` atributi qatordir, lekin `style` xususiyati obyektdir:

```html run
<div id="div" style="color:red;font-size:120%">Hello</div>

<script>
  // string
  alert(div.getAttribute('style')); // color:red;font-size:120%

  // object
  alert(div.style); // [object CSSStyleDeclaration]
  alert(div.style.color); // red
</script>
```

Aksariyat xususiyatlar qatorlardir.

Juda kamdan-kam hollarda, hatto DOM xossa turi qator bo'lsa ham, u atributdan farq qilishi mumkin. Masalan, `href` DOM xususiyati har doim *to'liq* URL bo'ladi, hatto atributda nisbiy URL yoki shunchaki `#hash` bo'lsa ham.

Quyida misol keltirilgan:

```html height=30 run
<a id="a" href="#hello">link</a>
<script>
  // attribute
  alert(a.getAttribute('href')); // #hello

  // property
  alert(a.href ); // http://site.com/page#hello shaklida to'liq URL
</script>
```

Agar bizga HTMLda yozilganidek `href` yoki boshqa atribut qiymati kerak bo'lsa, biz `getAttribute` dan foydalanishimiz mumkin.


## Nostandart atributlar, ma'lumotlar to'plami

HTML yozishda biz juda ko'p standart atributlardan foydalanamiz. Lekin nostandart, odatiy bo'lganlar haqida nima deyish mumkin? Birinchidan, ular foydali yoki yo'qligini bilib olaylik. Nima uchun?

Ba'zan nostandart atributlar HTML-dan JavaScript-ga maxsus ma'lumotlarni uzatish yoki JavaScript-ning HTML-elementlarini "belgilash" uchun ishlatiladi.

Mana bunday:

```html run
<!-- Bu erda "name" ni ko'rsatish uchun divni belgilang -->
<div *!*show-info="name"*/!*></div>
<!-- va bu yerda yoshni -->
<div *!*show-info="age"*/!*></div>

<script>
  // kod belgili elementni topadi va so'ralgan narsani ko'rsatadi
  let user = {
    name: "Pete",
    age: 25
  };

  for(let div of document.querySelectorAll('[show-info]')) {
    // maydonga tegishli ma'lumotlarni kiriting
    let field = div.getAttribute('show-info');
    div.innerHTML = user[field]; // birinchi Pit "name", keyin 25 "age" ga
  }
</script>
```

Bundan tashqari, ular elementni uslublash uchun ishlatilishi mumkin.

Masalan, bu yerda tartib holati uchun `order-state` atribyuti ishlatiladi:

```html run
<style>
  /* uslublar "order-state" maxsus atributiga tayanadi */
  .order[order-state="new"] {
    color: green;
  }

  .order[order-state="pending"] {
    color: blue;
  }

  .order[order-state="canceled"] {
    color: red;
  }
</style>

<div class="order" order-state="new">
  A new order.
</div>

<div class="order" order-state="pending">
  A pending order.
</div>

<div class="order" order-state="canceled">
  A canceled order.
</div>
```

Nima uchun atributdan foydalanish `.order-state-new`, `.order-state-pending`, `.order-state-canceled` kabi sinflarga ega bo'lishdan afzalroq bo'ladi ?

Chunki atributni boshqarish qulayroqdir. Holatni o'zgartirish oson:

```js
// eskisini olib tashlash/yangi sinf qo'shishdan ko'ra biroz oddiyroq
div.setAttribute('order-state', 'canceled');
```

Lekin maxsus atributlar bilan bog'liq muammo bo'lishi mumkin. Agar biz o'z maqsadlarimiz uchun nostandart atributdan foydalansak va keyinroq standart uni kiritib, biror narsa qilishga majbur qilsa nima bo'ladi? HTML tili tirik, u o'sib boradi va ishlab chiquvchilarning ehtiyojlariga mos keladigan ko'proq atributlar paydo bo'ladi. Bunday holatda kutilmagan oqibatlar bo'lishi mumkin.

Mojarolarni oldini olish uchun [data-*](https://html.spec.whatwg.org/ mavjud. #embedding-custom-non-visible-data-with-the-data-*-attributes) attributes.

**"Data-" bilan boshlangan barcha atributlar dasturchilar foydalanishi uchun ajratilgan. Ular `dataset` xususiyatida mavjud.**

Masalan, agar `elem` `data-about` atribyutiga ega bo'lsa, u `elem.dataset.about` sifatida mavjud.

Mana bunday:

```html run
<body data-about="Elephants">
<script>
  alert(document.body.dataset.about); // Elephants
</script>
```

`Data-order-state` kabi ko'p so'z atributlari tuya shaklida bo'ladi: `dataset.orderState`.

Bu yerda qayta yozilgan "order state" misoli:

```html run
<style>
  .order[data-order-state="new"] {
    color: green;
  }

  .order[data-order-state="pending"] {
    color: blue;
  }

  .order[data-order-state="canceled"] {
    color: red;
  }
</style>

<div id="order" class="order" data-order-state="new">
  A new order.
</div>

<script>
  // read
  alert(order.dataset.orderState); // new

  // modify
  order.dataset.orderState = "pending"; // (*)
</script>
```

`Data-*` atributlaridan foydalanish maxsus ma`lumotlarni uzatishning haqiqiy va xavfsiz usuli hisoblanadi.

E'tibor bering, biz nafaqat o'qishimiz, balki ma'lumotlar atribyutlarini ham o'zgartirishimiz mumkin. Keyin CSS ko'rinishni mos ravishda yangilaydi: oxirgi qatordagi `(*)` yuqoridagi misolda rangni ko'k rangga o'zgartiradi.

## Xulosa

- Atributlar -- HTMLda yozilgan narsa.
- Xususiyatlar -- bu DOM obyektlarida mavjud.

Kichik taqqoslash:

|            | Xususiyatlar | Atribyutlar |
|------------|------------|------------|
|Type|Istalgan qiymat, standart xususiyatlar spetsifikatsiyada tasvirlangan turlarga ega|qator|
|Name|Name harflar katta-kichikligiga sezgir|Name katta-kichik harflarga sezgir emas|

Atributlar bilan ishlash usullari:

- `elem.hasAttribute(name)` -- mavjudlikni tekshiradi.
- `elem.getAttribute(name)` -- qiymatni oladi.
- `elem.setAttribute(name, value)` -- qiymatni o'rnatadi.
- `elem.removeAttribute(name)` -- atribyutni qaytarib oladi.
- `elem.attributes` barcha atribbyutlarning to'plami.

Aksariyat hollarda DOM xususiyatlaridan foydalanish afzalroqdir. Biz atributlarga faqat DOM xossalari bizga mos kelmasa, atributlar kerak bo'lganda murojaat qilishimiz kerak, masalan:

- Bizga nostandart atribut kerak. Ammo agar u `data-` bilan boshlansa, biz `dataset` dan foydalanishimiz kerak.
- Biz HTMLda "yozilgan" qiymatini o'qishni xohlaymiz. DOM xususiyatining qiymati boshqacha bo'lishi mumkin, masalan, `href` xususiyati har doim to'liq URL bo'ladi va biz "asl" qiymatni olishni xohlashimiz mumkin.
