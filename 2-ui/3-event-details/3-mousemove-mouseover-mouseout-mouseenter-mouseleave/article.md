# Sichqonchani surish: mouseover/out, mouseenter/leave
Sichqoncha elementlar orasida harakat qilganda sodir bo'ladigan hodisalar haqida batafsilroq to'xtalib o'tamiz.

## Events mouseover/mouseout, relatedTarget
`mouseover` hodisasi sichqoncha ko'rsatkichi element ustiga kelganda va `mouseout` chiqib ketganda sodir bo'ladi.

![](mouseover-mouseout.svg)

Bu hodisalar maxsus, chunki ular `relatedTarget` xususiyatiga ega. Bu xususiyat `target` ni to'ldiradi. Sichqoncha bir elementni boshqasiga qoldirganda, ulardan biri `target`, ikkinchisi esa `relatedTarget` bo'ladi.

`mouseover` uchun:

- `event.target` -- sichqonchaning ustiga kelgan elementdir.
- `event.relatedTarget` -- sichqoncha chiqqan element hisoblanadi (`relatedTarget` -> `target`).

`mouseout` uchun teskari: 

- `event.target` -- sichqoncha qoldirgan elementdir.
- `event.relatedTarget` -- sichqonchani qoldirgan ko'rsatgich ostidagi yangi element (`target` -> `relatedTarget`).

```online
Quyidagi misolda har bir yuz va uning xususiyatlari alohida elementlardir. Sichqonchani harakatlantirganda matn maydonida sichqoncha hodisalarini ko'rishingiz mumkin.

Har bir hodisa `target` va `relatedTarget` haqida ma'lumotga ega:

[codetabs src="mouseoverout" height=280]
```

```warn header="`relatedTarget` `null` bo'lishi mumkin`"
`relatedTarget` xususiyati `null` bo'lishi mumkin.

Bu normal holat va sichqonchaning boshqa elementdan emas, balki derazadan kelganligini anglatadi. Yoki u derazadan chiqib ketgan.

Kodimizda `event.relatedTarget` dan foydalanganda bu imkoniyatni yodda tutishimiz kerak. Agar biz `event.relatedTarget.tagName` ga kirsak, xatolik yuz beradi.
```
## Elementlarni o'tkazib yuborish

Sichqoncha harakatlanayotganda `mousemove` hodisasi ishga tushadi. Lekin bu har bir piksel hodisaga olib keladi degani emas.

Brauzer vaqti-vaqti bilan sichqonchaning holatini tekshiradi. Va agar u o'zgarishlarni sezsa, voqealarni boshlaydi.

Bu shuni anglatadiki, agar tashrif buyuruvchi sichqonchani juda tez harakatlantirsa, ba'zi DOM elementlari o'tkazib yuborilishi mumkin:

![](mouseover-mouseout-over-elems.svg)

Agar sichqoncha yuqorida tasvirlanganidek `#FROM` dan `#TO` elementlariga juda tez harakatlansa, oraliq `<div>` elementlarni (yoki ularning ayrimlarini) o'tkazib yuborish mumkin. `mouseout` hodisasi `#FROM` tugmachasida, so'ngra `#TO` tugmachasida darhol `mouseover` bilan boshlanadi.

Bu ishlash uchun yaxshi, chunki oraliq elementlar ko'p bo'lishi mumkin. Biz, albatta, har birining ichiga va tashqarisiga ishlov berishni xohlamaymiz.

Boshqa tomondan, shuni yodda tutishimiz kerakki, sichqoncha ko'rsatkichi yo'lda barcha elementlarga "tashrif buyurmaydi". U "sakrashi" mumkin.

Xususan, ko'rsatgich derazadan sahifaning o'rtasiga sakrab tushishi mumkin. Bunday holda `relatedTarget` `null` bo'ladi, chunki u "hech qayerdan" kelmagan:

![](mouseover-mouseout-from-outside.svg)

```online
Siz buni quyidagi test stendida "live" orqali tekshirishingiz mumkin.

Undagi HTMLda ikkita ichki element mavjud: `<div id="child">` `<div id="parent">` ichida joylashgan. Agar siz sichqonchani ularning ustiga tez sursangiz, u holda faqat bola div hodisalarni yoki ota-onani tetiklashi yoki umuman hodisalar bo'lmasligi mumkin.

Shuningdek, kursorni boladagi `div` ga olib boring va keyin uni ota-onadan pastga siljiting. Agar harakat yetarlicha tez bo'lsa, unda asosiy element e'tiborga olinmaydi. Sichqoncha asosiy elementni sezmasdan kesib o'tadi.

[codetabs height=360 src="mouseoverout-fast"]
```

```smart header="Agar `mouseover` ishga tushirilsa, `mouseout` bo'lishi kerak"

Sichqoncha tez harakatlansa, oraliq elementlar e'tiborga olinmasligi mumkin, ammo biz aniq bilamiz: agar ko'rsatgich biror elementga "rasmiy" kiritilgan bo'lsa (`mouseover` hodisasi hosil qilingan), uni tark etgandan so'ng biz doimo `mouseout` ni olamiz.
```

## Child ketayotganda mouseout hodisasi

`mouseout` ning muhim xususiyati -- ko'rsatgich elementdan uning avlodiga o'tganda ishga tushadi, masalan, ushbu HTMLda `#parent` dan `#child` gacha:

```html
<div id="parent">
  <div id="child">...</div>
</div>
```
Agar biz `#parent` da bo'lsak va kursorni `#child` ichiga chuqurroq olib borsak, biz `#parent` da `mouseout` ni olamiz!

![](mouseover-to-child.svg)

Bu g'alati tuyulyapti, ammo buni osongina tushuntirish mumkin.

**Brauzer mantig'iga ko'ra, sichqoncha kursori istalgan vaqtda faqat *bitta* element ustida bo'lishi mumkin -- eng ko'p joylashtirilgan va z-indeks bo'yicha yuqorida.**

Shunday qilib, agar u boshqa elementga (hatto avlodga) kirsa, u avvalgisini qoldiradi.

Voqeani qayta ishlashning yana bir muhim tafsilotiga e'tibor bering.

Nasldagi `mouseover` hodisasi paydo bo'ladi. Shunday qilib, agar `#parent` da `mouseover` ishlov beruvchisi bo'lsa, u ishga tushadi:

![](mouseover-bubble-nested.svg)

```online
Buni quyidagi misolda juda yaxshi ko'rishingiz mumkin: `<div id="child">` `<div id="parent">` ichida joylashgan. Hodisa tafsilotlarini chiqaradigan `#parent` elementida `mouseover/out` ishlov beruvchilari mavjud.

Agar siz sichqonchani `#parent` dan `#child` ga o'tkazsangiz, `#parent` da ikkita hodisani ko'rasiz:
1. `mouseout [target: parent]` (ota-onadan chapda), keyin
2. `mouseover [target: child]` (bolaning oldiga kelib, ko'tariladi).

[codetabs height=360 src="mouseoverout-child"]
```
Ko'rsatilgandek, pointer `#parent` elementdan `#child` ga o'tganda, ikkita ishlov beruvchi ota-elementda ishga tushadi: `mouseout` va `mouseover`:

```js
parent.onmouseout = function(event) {
  /* event.target: parent element */
};
parent.onmouseover = function(event) {
  /* event.target: child element (bubbled) */
};
```
**Agar biz ishlov beruvchilar ichida `event.target` ni tekshirmasak, sichqoncha ko'rsatkichi `#parent` elementini tark etgan va keyin darhol uning ustiga qaytgandek tuyulishi mumkin.**

Lekin unday emas! Ko'rsatkich hali ham ota-ona ustida, u faqat bola elementiga chuqurroq o'tdi.

Agar asosiy elementni tark etishda ba'zi harakatlar mavjud bo'lsa, masalan. animatsiya `parent.onmouseout` da ishlaydi, biz odatda ko'rsatgich `#parent` ga chuqurroq kirganda buni xohlamaymiz.

Bunga yo'l qo'ymaslik uchun biz ishlov beruvchida `relatedTarget` ni tekshirishimiz mumkin va agar sichqoncha hali ham element ichida bo'lsa, bunday hodisaga e'tibor bermang.

Shu bilan bir qatorda, biz boshqa hodisalardan ham foydalanishimiz mumkin: `mouseenter` va `mouseleave`, biz hozir ko'rib chiqamiz, chunki ularda bunday muammolar yo'q.

## Mouseenter va mouseleave hodisalari

`mouseenter/mouseleave` hodisalari `mouseover/mouseout` bilan o'xshash. Ular sichqoncha ko'rsatkichi elementga kirganda/chiqqanda ishga tushadi.

Ammo ikkita muhim farq bor:

1. Element ichidagi avlodlarga/avlodlarga o'tishlar hisobga olinmaydi.
2. `mouseenter/mouseleave` hodisalari ko'piklanmaydi.

Bu hodisalar juda oddiy.

Ko'rsatkich elementga kirganda -- `mouseenter` ishga tushadi. Element yoki uning avlodlari ichidagi ko'rsatkichning aniq joylashuvi muhim emas.

Ko'rsatkich elementni tark etganda -- `mouseleave` ishga tushadi.

```online
Bu misol yuqoridagiga o'xshaydi, lekin endi yuqori elementda `mouseover/mouseout` o'rniga `mouseenter/mouseleave` mavjud.

Ko'rib turganingizdek, faqat yaratilgan hodisalar ko'rsatgichni yuqori elementning ichiga va tashqarisiga o'tkazish bilan bog'liq. Ko'rsatkich bolaga va orqaga qaytsa, hech narsa sodir bo'lmaydi. Avlodlar orasidagi o'tishlar e'tiborga olinmaydi.

[codetabs height=340 src="mouseleave"]
```

## Hodisa delegatsiyasi

`Mouseenter/leave` hodisalari juda oddiy va ulardan foydalanish oson. Ammo ular ko'piklanmaydi. Shuning uchun biz ular bilan hodisa delegatsiyasidan foydalana olmaymiz.

Tasavvur qiling-a, biz sichqonchani jadval kataklari uchun kiritish/chiqishni boshqarishni xohlaymiz. Va yuzlab hujayralar mavjud.

Tabiiy yechim -- ishlov beruvchini `<table>` ga o'rnatish va u yerda hodisalarni qayta ishlash. Lekin `mouseenter/leave` pufakchalari chiqmaydi. Shunday qilib, agar bunday hodisa `<td>` da sodir bo'lsa, uni faqat o'sha `<td>` da ishlov beruvchi tuta oladi.

`<table>` da `mouseenter/leave` uchun ishlov beruvchilar faqat ko'rsatgich jadvalga bir butun sifatida kirganda/chiqqanda ishga tushadi. Uning ichidagi o'tishlar haqida hech qanday ma'lumot olishning iloji yo'q.

Shunday qilib, keling, `mouseover/mouseout` dan foydalanamiz.

Sichqoncha ostidagi elementni ta'kidlaydigan oddiy ishlov beruvchilardan boshlaylik:

```js
// pointer ostidagi elementni ajratib ko'rsatamiz
table.onmouseover = function(event) {
  let target = event.target;
  target.style.background = 'pink';
};

table.onmouseout = function(event) {
  let target = event.target;
  target.style.background = '';
};
```

```online
Mana, ular harakatda. Sichqoncha ushbu jadvalning elementlari bo'ylab sayohat qilganda, joriy elementi ta'kidlanadi:

[codetabs height=480 src="mouseenter-mouseleave-delegation"]
```
Bizning holatlarimizda biz `<td>` jadval kataklari orasidagi o'tishlarni boshqarishni xohlaymiz: hujayraga kirish va undan chiqish. Boshqa o'tishlar, masalan, hujayra ichida yoki biron bir hujayradan tashqarida, bizni qiziqtirmaydi. Keling, ularni filtrlaymiz.

Biz nima qila olamiz:

- O'zgaruvchida hozirda ta'kidlangan `<td>`ni eslab qoling, keling, uni `currentElem` deb ataymiz.
- `mouseover` -- agar biz hali ham joriy `<td>` ichida bo'lsak, hodisani e'tiborsiz qoldiring.
- `mouseout`-da -- joriy `<td>`ni tark qilmagan bo'lsak, e'tibor bermang.

Mana, barcha mumkin bo'lgan vaziyatlarni hisobga oladigan kod misoli:

[js src="mouseenter-mouseleave-delegation-2/script.js"]

Yana bir bor muhim xususiyatlarni eslab o'tamiz:
1. Jadval ichidagi istalgan `<td>` ni kiritish/chiqishni boshqarish uchun voqea delegatsiyasidan foydalanadi. Shunday qilib, u pufakchali bo'lmagan `mouseenter/leave` o'rniga `mouseover/out` ga tayanadi va shuning uchun hech qanday delegatsiyaga ruxsat bermaydi.
2. `<td>` ning avlodlari o'rtasida harakatlanish kabi qo'shimcha hodisalar filtrlanadi, shuning uchun `onEnter/Leave` faqat ko'rsatgich butunlay `<td>` dan chiqsa yoki kirsa ishlaydi.

```online
Mana barcha tafsilotlar bilan to'liq misol:

[codetabs height=460 src="mouseenter-mouseleave-delegation-2"]

Kursorni jadval katakchalari ichiga va tashqarisiga va ularning ichida harakatlantirishga harakat qiling. Tez yoki sekin - muhim emas. Oldingi misoldan farqli o'laroq, faqat `<td>` butunlay ajratib ko'rsatilgan.
```

## Xulosa

Biz `mouseover`, `mouseout`, `mousemove`, `mouseenter` va `mouseleave` hodisalarini ko'rib chiqdik.

Ushbu qoidalarni eslab qolganimiz ma'qul:

- Sichqonchaning tez harakati oraliq elementlarni o'tkazib yuborishi mumkin.
- `mouseover/out` va `mouseenter/leave` hodisalari qo'shimcha `relatedTarget` xususiyatiga ega. Bu `target` ni to'ldiruvchi element.

`mouseover/out` hodisalari, hatto ota elementdan pastki elementga o'tganimizda ham tetiklanadi. Brauzer sichqonchani bir vaqtning o'zida faqat bitta element ustida bo'lishi mumkinligini tahmin qiladi -- eng chuqur element.

`mouseenter/leave` hodisalari bu jihatdan farqlanadi: ular faqat sichqoncha butun elementga kirib-chiqganda ishga tushadi. Bundan tashqari, ular ko'piklanmaydi.
