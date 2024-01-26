
# Event delegatsiyasi

Capturing va bubbling bizga *event delegatsiyasi* deb nomlangan hodisalarni boshqarishning eng kuchli vazifalaridan birini amalga oshirishga imkon beradi.

G'oya shundan iboratki, agar bizda shunga o'xshash tarzda ishlov beradigan ko'plab elementlar bo'lsa, ularning har biriga ishlov beruvchini belgilash o'rniga, ularning umumiy ajdodiga bitta ishlov beruvchini qo'yamiz.

Ishlovchida biz voqea qayerda sodir bo'lganini ko'rish va uni boshqarish uchun `event.target` ni olamiz.

Keling, bir misolni ko'rib chiqaylik -- qadimgi Xitoy falsafasini aks ettiruvchi [Ba-Gua diagrammasi](http://en.wikipedia.org/wiki/Ba_gua).

Mana:

[iframe height=350 src="bagua" edit link]

HTML quyidagicha ko'rinishda bo'ladi:

```html
<table>
  <tr>
    <th colspan="3"><em>Bagua</em> Chart: Direction, Element, Color, Meaning</th>
  </tr>
  <tr>
    <td class="nw"><strong>Northwest</strong><br>Metal<br>Silver<br>Elders</td>
    <td class="n">...</td>
    <td class="ne">...</td>
  </tr>
  <tr>...shu turdagi yana 2 qator...</tr>
  <tr>...shu turdagi yana 2 qator...</tr>
</table>
```

Jadvalda 9 ta katak bor, lekin 99 yoki 9999 bo'lishi mumkin, bu muhim emas.

**Bizning vazifamiz bosish orqali `<td>` katakchasini ajratib ko'rsatishdir.**

Har bir `<td>`ga (ko'p bo'lishi mumkin) `onclick` ishlov beruvchisini tayinlash o'rniga, biz `<table>` elementida "hammasini tutib olish" ishlov beruvchisini o'rnatamiz.

U bosilgan elementni olish va uni ta'kidlash uchun `event.target` dan foydalanadi.

Kod quyida berilgan:

```js
let selectedTd;

*!*
table.onclick = function(event) {
  let target = event.target; // click qayoqda edi?

  if (target.tagName != 'TD') return; // TD ustida emasmi? Bunday holda bu bizga qiziq emas

  highlight(target); // uni begilang
};
*/!*

function highlight(td) {
  if (selectedTd) { // mavjud belgilashlarni olib tashlang
    selectedTd.classList.remove('highlight');
  }
  selectedTd = td;
  selectedTd.classList.add('highlight'); // yangi td ni belgilang
}
```
Bunday kod jadvalda nechta katak borligiga ahamiyat bermaydi. Biz `<td>` ni istalgan vaqtda dinamik ravishda qo'shishimiz/o'chirishimiz mumkin va ajratib ko'rsatish hali ham ishlaydi.

Shunga qaramay, bir kamchilik bor.

Bosish `<td>` da emas, balki uning ichida sodir bo'lishi mumkin.

Bizning holatda, agar HTML ichiga nazar tashlasak, `<td>` ichida `<strong>` kabi ichki o'rnatilgan teglarni ko'rishimiz mumkin:

```html
<td>
*!*
  <strong>Northwest</strong>
*/!*
  ...
</td>
```

Tabiiyki, agar bu `<strong>` ustida click sodir bo'lsa, u `event.target` qiymatiga aylanadi.

![](bagua-bubble.svg)

table.onclick` ishlov beruvchisida biz shunday `event.target`ni olishimiz va bosish `<td>` ichida bo'lgan yoki yo'qligini aniqlashimiz kerak.

Mana yaxshilangan kod:

```js
table.onclick = function(event) {
  let td = event.target.closest('td'); // (1)

  if (!td) return; // (2)

  if (!table.contains(td)) return; // (3)

  highlight(td); // (4)
};
```
Tushuntirishlar:
1. `elem.closest(selector)` usuli selektorga mos keladigan eng yaqin ajdodni qaytaradi. Bizning holatimizda biz manbaa elementidan yuqoriga qarab `<td>` ni qidiramiz.
2. Agar `event.target` biror `<td>` ichida bo'lmasa, qo'ng'iroq darhol qaytadi, chunki hech narsa qilish shart emas.
3. Ichki jadvallar bo'lsa, `event.target` `<td>` bo'lishi mumkin, lekin ular joriy jadvaldan tashqarida joylashgan. Shunday qilib, biz bu haqiqatan ham *bizning jadvalimiz* `<td>` ekanligini tekshiramiz.
4. Va agar shunday bo'lsa, uni belgilang.

Natijada, biz tez va samarali belgilangan kodga ega bo'ldik, bu jadvaldagi `<td>` umumiy soniga ahamiyat bermaydi.

## Delegatsiya misoli: belgilash, ya'ni mark updagi harakatlar

Eventlar delegatsiyasi uchun boshqa foydalanish ham mavjud.

Aytaylik, biz "Saqlash", "Yuklash", "Izlash" va boshqalar tugmalari bilan menyu yaratmoqchimiz. Va `save, `load`, `search` usullariga ega obyekt bor... Ularni qanday moslashtirish mumkin?

Birinchi g'oya har bir tugma uchun alohida ishlov beruvchini belgilash bo'lishi mumkin. Lekin yanada oqlangan yechim bor. Biz butun menyu uchun ishlov beruvchini va qo'ng'iroq qilish usuliga ega tugmalar uchun `data-action` atribyutlarini qo'shishimiz mumkin:

``` html
<button *!*data-action="save"*/!*>Saqlash uchun bosing</button>
```

Ishlovchi atribyutni o'qiydi va usulni bajaradi. Ishchi misolni ko'rib chiqing:

```html autorun height=60 run untrusted
<div id="menu">
  <button data-action="save">Save</button>
  <button data-action="load">Load</button>
  <button data-action="search">Search</button>
</div>

<script>
  class Menu {
    constructor(elem) {
      this._elem = elem;
      elem.onclick = this.onClick.bind(this); // (*)
    }

    save() {
      alert('saving');
    }

    load() {
      alert('loading');
    }

    search() {
      alert('searching');
    }

    onClick(event) {
*!*
      let action = event.target.dataset.action;
      if (action) {
        this[action]();
      }
*/!*
    };
  }

  new Menu(menu);
</script>
```

Esda tutingki, `this.onClick` `(*)`da `this` bilan bog'langan. Bu juda muhim, chunki aks holda uning ichidagi `this` `Menu` obyektiga emas, DOM elementiga (`elem`) murojaat qiladi va `this[action]` bizga kerak bo'lgan narsa bo'lmaydi.

Xo'sh, delegatsiya bizga bu yerda qanday afzalliklarni beradi?

``` solishtiring
+ Har bir tugmaga ishlov beruvchi tayinlash uchun kod yozishimiz shart emas. Faqatgina usul yarating va uni belgilashga qo'ying.
+ HTML tuzilishi moslashuvchan, biz istalgan vaqtda tugmalarni qo'shishimiz/o'chirishimiz mumkin.
```

Biz ``.action-save`, `.action-load` sinflaridan ham foydalanishimiz mumkin, ammo `data-action` atributi semantik jihatdan yaxshiroq va biz uni CSS qoidalarida ham ishlatishimiz mumkin.

## "Xulq-atvor", ya'ni behavior namunasi

Shuningdek, biz maxsus atributlar va sinflar bilan *deklarativ ravishda* elementlarga "behavior" qo'shish uchun hodisa delegatsiyasidan foydalanishimiz mumkin.

Shakl ikki qismdan iborat:
1. Biz elementga uning xatti-harakatlarini tavsiflovchi maxsus atribyut qo'shamiz.
2. Hujjat bo'ylab ishlov beruvchi hodisalarni kuzatib boradi va agar biror hodisa atributlangan elementda sodir bo'lsa -- amalni bajaradi.

### Behavior: Counter

Misol uchun, bu yerda `data-counter` atribyuti tugmalarga xatti-harakatni qo'shadi: "click qiymatini oshirish":

```html run autorun height=60
Counter: <input type="button" value="1" data-counter>
Yana bitta counter: <input type="button" value="2" data-counter>

<script>
  document.addEventListener('click', function(event) {

    if (event.target.dataset.counter != undefined) { // agar atribyut mavjud bo'lsa...
      event.target.value++;
    }

  });
</script>
```

Agar biz tugmani bossak -- uning qiymati ortadi. Bu yerda tugmalar emas, balki umumiy yondashuv muhim ahamiyatga ega.

`Data counter` da biz xohlagancha ko'p atribyutlar bo'lishi mumkin. Biz istalgan vaqtda HTMLga yangilarini qo'sha olamiz. Tadbir delegatsiyasidan foydalanib, biz HTMLni "kengaytirdik", yangi xatti-harakatni tavsiflovchi atribyutni qo'shdik.

```warn header="Hujjat darajasidagi ishlovchilar uchun -- har doim `addEventListener`"
`document` obyektiga hodisa ishlov beruvchisini tayinlaganimizda, biz doimo `document.on<event>` emas, `addEventListener` dan foydalanishimiz kerak, chunki ikkinchisi ziddiyatlarni keltirib chiqaradi: yangi ishlov beruvchilar eskilarining ustiga yozadi.

Haqiqiy loyihalar uchun kodning turli qismlari tomonidan o'rnatilgan `document` da ko'plab ishlov beruvchilar mavjudligi odatiy holdir.
```

### Behavior: Toggler
Behaviorning yana bir misoli. `Data-toggle-id` atributiga ega elementni bosish berilgan `id`ga ega elementni ko'rsatadi/yashiradi:

```html autorun run height=60
<button *!*data-toggle-id="subscribe-mail"*/!*>
  Obuna shaklini ko'rsatish
</button>

<form id="subscribe-mail" hidden>
  Your mail: <input type="email">
</form>

<script>
*!*
  document.addEventListener('click', function(event) {
    let id = event.target.dataset.toggleId;
    if (!id) return;

    let elem = document.getElementById(id);

    elem.hidden = !elem.hidden;
  });
*/!*
</script>
```
Keling, nima qilganimizni yana bir bor eslatib o'tamiz. Endi elementga almashtirish funksiyasini qo'shish uchun JavaScriptni bilishning hojati yo'q, shunchaki `data-toggle-id` atributidan foydalaning.

Bu haqiqatan ham qulay bo'lishi mumkin -- har bir bunday element uchun JavaScriptda kod yozish kerak emas. Faqat behavior dan foydalaning. Hujjat darajasidagi ishlov beruvchi uni sahifaning istalgan elementi uchun ishlaydi.

Biz bir elementda bir nechta xatti-harakatlarni birlashtira olamiz.

"Behavior" namunasi JavaScript-ning mini-fragmentlariga muqobil bo'lishi mumkin.

## Xulosa

Event delegatsiyasi juda zo'r! Bu DOM hodisalari uchun eng foydali pattern lardan biri.

Ko'pincha shunga o'xshash elementlar uchun bir xil ishlov berishni qo'shish maqsadida ishlatiladi, lekin buning uchun emas.

Algoritm:

1. Idishning ustiga bitta ishlov beruvchini qo'ying.
2. Ishlovchida -- `event.target` manba elementini tekshiring.
3. Agar voqea bizni qiziqtirgan element ichida sodir bo'lgan bo'lsa, event ni boshqaring.

Foydasi:

```Solishtiring
+ Ishga tushirishni soddalashtiradi va xotirani tejaydi: ko'p ishlov beruvchilarni qo'shishning hojati yo'q.
+ Kamroq kod: elementlarni qo'shish yoki o'chirishda ishlov beruvchilarni qo'shish/o'chirish kerak emas.
+ DOM modifikatsiyalari: biz `innerHTML` va shunga o'xshash elementlarni ommaviy qo'shishimiz/o'chirishimiz mumkin.
```
Delegatsiya ham o'z kamchiliklariga ega, albatta:

```Solishtiring
- Birinchidan, event bubbling bo'lishi kerak. Ba'zi event lar ko'piklanmaydi. Bundan tashqari, past darajadagi ishlov beruvchilar `event.stopPropagation()` dan foydalanmasligi kerak.
- Ikkinchidan, delegatsiya protsessor yukini qo'shishi mumkin, chunki konteyner darajasidagi ishlov beruvchi bizni qiziqtiradimi yoki yo'qmi, konteynerning istalgan joyidagi hodisalarga munosabat bildiradi. Lekin odatda yuk ahamiyatsiz, shuning uchun biz buni hisobga olmaymiz.
```
