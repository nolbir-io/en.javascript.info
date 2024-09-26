# Sichqoncha hodisalari bilan Drag'n'Drop qilish

Drag'n'Drop - bu ajoyib interfeys yechimi. Biror narsani sudrab olib tashlash ko'p ishlarni bajarishning aniq va oddiy usulidir, bu usuldan hujjatlarni nusxalash va ko'chirishdan (fayl menejerlarida bo'lgani kabi) buyurtma berishgacha (elementlarni savatga tashlash) foydalanish mumkin.

Zamonaviy HTML standartida `dragstart`, `dragend` va hokazo kabi maxsus hodisalarga ega bo'lgan [Drag and Drop haqida bo'lim](https://html.spec.whatwg.org/multipage/interaction.html#dnd) mavjud.

Ushbu hodisalar bizga drag'n'dropning maxsus turlarini qo'llab-quvvatlashga imkon beradi, masalan, OS fayl boshqaruvchisidan faylni sudrab olib, uni brauzer oynasiga tushirish. Keyin JavaScript bunday fayllar tarkibiga kirishi mumkin.

Ammo mahalliy Drag voqealari ham cheklovlarga ega. Misol uchun, biz ma'lum bir hududdan tortib olishni oldini ololmaymiz. Bundan tashqari, biz tortishni faqat "gorizontal" yoki "vertikal" qila olmaymiz. Boshqa ko'plab drag'n'drop vazifalari mavjud bo'lib, ular yordamida bajarib bo'lmaydi. Bundan tashqari, bunday hodisalar uchun mobil qurilmalarni qo'llab-quvvatlash juda zaif.

Shunday qilib, biz sichqoncha hodisalari yordamida Drag'n'Drop-ni qanday amalga oshirishni ko'rib chiqamiz.

## Drag'n'Drop algoritmi

Drag'n'Drop asosiy algoritmi quyidagicha ko'rinishda bo'ladi:

1. `mousedown` da - agar kerak bo'lsa, elementni siljitish uchun tayyorlang (uning klonini yarating, unga sinf qo'shing yoki boshqa narsa).
2. Keyin `mousemove` tugmachasida `left/top` ni `position:absolute` bilan almashtirib, uni siljiting.
3. `mouseup` da - drag'n'dropni tugatish bilan bog'liq barcha amallarni bajaring.

Bular asoslar. Keyinchalik biz boshqa xususiyatlarni qanday qo'shishni ko'rib chiqamiz, masalan, biz ularni sudrab o'tayotganda joriy asosiy elementlarni ajratib ko'rsatishimiz mumkin.

Bu yerda to'pni sudrab borishning amalga oshirilishi:

```js
ball.onmousedown = function(event) {
  // (1) harakatga tayyorlang: z-indeksi bo'yicha vazifani mutlaq va tepada bajaring
  ball.style.position = 'absolute';
  ball.style.zIndex = 1000;

  // uni har qanday joriy ota-onadan to'g'ridan-to'g'ri tanaga ko'chiring
  // uni tanaga nisbatan tekis joylashtiring
  document.body.append(ball);

  // to'pni (pageX, pageY) koordinatalarida markazlashtiradi
  function moveAt(pageX, pageY) {
    ball.style.left = pageX - ball.offsetWidth / 2 + 'px';
    ball.style.top = pageY - ball.offsetHeight / 2 + 'px';
  }

  // mutlaq joylashtirilgan to'pimizni ko'rsatgich ostida harakatlantiring
  moveAt(event.pageX, event.pageY);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // (2) to'pni sichqoncha bilan harakatlantiring
  document.addEventListener('mousemove', onMouseMove);

  // (3) to'pni tashlang, keraksiz ishlov beruvchilarni olib tashlang
  ball.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    ball.onmouseup = null;
  };

};
```
Agar biz kodni ishga tushirsak, g'alati narsani sezishimiz mumkin. Tortish va tushirishning boshida to'p "vilkalar" qiladi: biz uning "klonini" sudrab boshlaymiz.

```online
Mana amaldagi misol:

[iframe src="ball" height=230]

Sichqoncha bilan sudrab tashlashga harakat qiling va siz bunday xatti-harakatni ko'rasiz.
```
Buning sababi, brauzerda tasvirlar va boshqa ba'zi elementlar uchun o'ziga xos sudrab olib tashlash yordami mavjud. U avtomatik ravishda ishlaydi va biznikiga zid keladi.

Uni o'chirish uchun:

```js
ball.ondragstart = function() {
  return false;
};
```

Endi hammasi yaxshi ishlaydi.

```online
Amaldagi misol:

[iframe src="ball2" height=230]
```
Yana bir muhim jihat -- biz `mousemove` ni `ball` da emas, `document` da kuzatib boramiz. Bir qarashda sichqoncha har doim to'p ustida turgandek tuyulishi mumkin va biz unga `mousemove` tugmachasini qo'yishimiz mumkin.

Ammo biz eslaganimizdek, `mousemove` tez-tez ishga tushadi, lekin har bir piksel uchun emas. Shunday qilib, tez harakat qilgandan so'ng, ko'rsatgich to'pdan hujjatning o'rtasida (yoki hatto derazadan tashqarida) sakrashi mumkin.

Shuning uchun biz uni qo'lga olish uchun `document` ni tinglashimiz kerak.

## To'g'ri joylashishni aniqlash

Yuqoridagi misollarda to'p har doim uning markazi ko'rsatkich ostida bo'lishi uchun harakatlantiriladi:

```js
ball.style.left = pageX - ball.offsetWidth / 2 + 'px';
ball.style.top = pageY - ball.offsetHeight / 2 + 'px';
```
Yomon emas, lekin salbiy ta'siri bor. Drag'n'dropni boshlash uchun biz to'pning istalgan joyida `mousedown` ni bosishimiz mumkin. Ammo agar uni chetidan "olib qo'ysa", to'p birdan "sakrab" sichqoncha ko'rsatgichi ostida markazga aylanadi.

Ko'rsatkichga nisbatan elementning dastlabki siljishini saqlasak yaxshi bo'lardi.

Misol uchun, agar biz to'pning chetidan sudrab olishni boshlasak, u holda ko'rsatgich sudralayotganda chetida qolishi kerak.

![](ball_shift.svg)


  Keling, algoritmimizni yangilaymiz:

1. Mehmon tugmani bosganda (`mousedown`) - `shiftX/shiftY` o'zgaruvchilarida ko'rsatgichdan to'pning chap-yuqori burchagigacha bo'lgan masofani eslab qoling. Surish paytida biz bu masofani ushlab turamiz.

     Ushbu siljishlarni olish uchun biz koordinatalarni ayirishimiz mumkin:

    ```js
    // onmousedown
    let shiftX = event.clientX - ball.getBoundingClientRect().left;
    let shiftY = event.clientY - ball.getBoundingClientRect().top;
    ```

2. Keyin sudrab ketayotganda biz to'pni ko'rsatgichga nisbatan bir xil siljishda joylashtiramiz, masalan:

    ```js
    // onmousemove
    // to'pning pozitsiyasi: mutlaq
    ball.style.left = event.pageX - *!*shiftX*/!* + 'px';
    ball.style.top = event.pageY - *!*shiftY*/!* + 'px';
    ```

Yaxshiroq joylashuvga ega yakuniy kod:

```js
ball.onmousedown = function(event) {

*!*
  let shiftX = event.clientX - ball.getBoundingClientRect().left;
  let shiftY = event.clientY - ball.getBoundingClientRect().top;
*/!*

  ball.style.position = 'absolute';
  ball.style.zIndex = 1000;
  document.body.append(ball);

  moveAt(event.pageX, event.pageY);

  // to'pni (pageX, pageY) koordinatalari bo'yicha harakatlantiradi
   // dastlabki siljishlarni hisobga olgan holda
  function moveAt(pageX, pageY) {
    ball.style.left = pageX - *!*shiftX*/!* + 'px';
    ball.style.top = pageY - *!*shiftY*/!* + 'px';
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // mousemove da to'pni siljiting
  document.addEventListener('mousemove', onMouseMove);

  // to'pni tashlang, keraksiz ishlov beruvchilarni olib tashlang
  ball.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    ball.onmouseup = null;
  };

};

ball.ondragstart = function() {
  return false;
};
```

```online
Amalda (inside `<iframe>`):

[iframe src="ball3" height=230]
```
Agar to'pni uning o'ng pastki burchagidan sudrab olib borsak, farq ayniqsa sezilarli bo'ladi. Oldingi misolda to'p ko'rsatgich ostida "sakrab o'tadi". Endi u ko'rsatgichni joriy holatdan bemalol kuzatib boradi.

## Potentsial pasayish maqsadlari (droppables)

Oldingi misollarda to'pni qolish uchun "har qanday joyga" tashlab yuborish mumkin edi. Haqiqiy hayotda biz odatda bitta elementni olib, boshqasiga tashlaymiz. Masalan, "fayl" "papka" yoki boshqa narsa.

Mavhum gapiradigan bo'lsak, biz "tortib olinadigan" elementni olamiz va uni "tashlab olinadigan" elementga tushiramiz.

Biz quyidagilarni bilishimiz kerak:
- Drag'n'Drop oxirida element tushirilgan joy -- tegishli amalni bajarish uchun,
- va ajratib ko'rsatishimiz uchun sudrab o'tayotganimizni biling.

Yechim qiziqarli va biroz qiyin, shuning uchun uni shu yerda yoritamiz.

Birinchi fikr nima bo'lishi mumkin? Ehtimol, potentsial tushiriladigan narsalarga `mouseover/mouseup` ishlov beruvchilarini o'rnatish kerakmi?

Lekin bu ishlamayapti.

Muammo shundaki, biz sudrab ketayotganimizda, sudrab olinadigan element har doim boshqa elementlardan yuqori bo'ladi. Va sichqoncha hodisalari faqat yuqori elementda sodir bo'ladi, uning ostidagi elementlarda emas.

Masalan, quyida ikkita `<div>` elementi mavjud, qizili ko'kning tepasida (to'liq qoplaydi). Ko'k rangda hodisani ushlashning iloji yo'q, chunki qizil rang tepada:

```html run autorun height=60
<style>
  div {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 0;
  }
</style>
<div style="background:blue" onmouseover="alert('never works')"></div>
<div style="background:red" onmouseover="alert('over red!')"></div>
```

Draggable element bilan ham xuddi shunday. To'p har doim boshqa elementlarning tepasida bo'ladi, shuning uchun unda voqealar sodir bo'ladi. Pastki elementlarga qanday ishlov beruvchilarni o'rnatmasak ham, ular ishlamaydi.

Shuning uchun potentsial tushiriladigan qurilmalarga ishlov beruvchilarni qo'yish haqidagi dastlabki g'oya amalda ishlamaydi. Ular yugurmaydilar.

Xo'sh, nima qilish kerak?

`document.elementFromPoint(clientX, clientY)` deb nomlangan usul mavjud. U berilgan oynaning nisbiy koordinatalarida eng ko'p joylashtirilgan elementni qaytaradi (yoki agar berilgan koordinatalar oynadan tashqarida bo'lsa `null`). Agar bir xil koordinatalarda bir-biriga o'xshash bir nechta elementlar mavjud bo'lsa, eng yuqori qismi qaytariladi.

Ko'rsatgich ostida tushishi mumkin bo'lgan potentsialni aniqlash uchun biz uni har qanday sichqoncha hodisasi ishlov beruvchilarida ishlatishimiz mumkin, masalan:

```js
// sichqoncha hodisasi ishlov beruvchisida
ball.hidden = true; // (*) biz tortadigan elementni yashiring

let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
// elemBelow - to'p ostidagi element, uni tashlab yuborish mumkin

ball.hidden = false;
```
Iltimos, diqqat qiling: `(*)` chaqiruvidan oldin to'pni yashirishimiz kerak. Aks holda biz odatda ushbu koordinatalarda to'pga ega bo'lamiz, chunki u ko'rsatgich ostidagi yuqori element: `elemBelow=ball`. Shunday qilib, biz uni yashiramiz va darhol yana ko'rsatamiz.

Biz ushbu koddan istalgan vaqtda qaysi element ustida "uchib ketayotganimizni" tekshirishimiz mumkin. Va bu sodir bo'lganda tushishni boshqaring.

"Droppable" elementlarni topish uchun `onMouseMove` ning kengaytirilgan kodi:

```js
// Biz hozir uchib o'tayotganimiz potentsial
let currentDroppable = null;

function onMouseMove(event) {
  moveAt(event.pageX, event.pageY);

  ball.hidden = true;
  let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
  ball.hidden = false;

   // sichqonchani siljitish hodisalari derazadan tashqariga chiqishi mumkin (to'p ekrandan tashqariga tortilganda)
   // agar clientX/clientY oynadan tashqarida bo'lsa, elementFromPoint nullni qaytaradi
  if (!elemBelow) return;

  // potentsial tushiriladiganlar "droppable" klassi bilan etiketlanadi (boshqa mantiq bo'lishi mumkin)
  let droppableBelow = elemBelow.closest('.droppable');

  if (currentDroppable != droppableBelow) {
    // biz uchib kiramiz yoki uchib chiqamiz ...
     // Eslatma: ikkala qiymat ham null bo'lishi mumkin
     // currentDroppable=null, agar biz ushbu hodisadan oldin tushirish mumkin bo'lmagan bo'lsak (masalan, bo'sh joy ustida)
     // droppableBelow=null, agar biz hozir, ushbu tadbir davomida, tushirish imkoniyatidan oshib ketmasak

    if (currentDroppable) {
      // tushirilishi mumkin bo'lgan "flying out" ni qayta ishlash mantig'i (highlightni olib tashlash)
      leaveDroppable(currentDroppable);
    }
    currentDroppable = droppableBelow;
    if (currentDroppable) {
      // droppable "flying in" ni qayta ishlash mantiqi
      enterDroppable(currentDroppable);
    }
  }
}
```
Quyidagi misolda to'pni futbol darvozasi ustidan sudrab olib borishda gol ta'kidlangan.

[codetabs height=250 src="ball4"]

Endi bizda butun jarayon davomida `currentDroppable` o'zgaruvchisida uchib o'tayotgan joriy "drop target" mavjud va undan ajratib ko'rsatish yoki boshqa narsalarni ishlatishimiz mumkin.

## Xulosa

Biz asosiy Drag and Drop algoritmini ko'rib chiqdik.

Asosiy komponentlar:

1. Hodisalar oqimi: `ball.mousedown` -> `document.mousemove` -> `ball.mouseup` (native `ondragstart` ni bekor qilishni unutmang).
2. Drag startda -- elementga nisbatan ko'rsatgichning dastlabki siljishini eslab qoling: `shiftX/shiftY` va uni sudrab olib borishda saqlang.
3. `document.elementFromPoint` yordamida ko'rsatgich ostidagi tushiriladigan elementlarni aniqlang.

Biz bu poydevorga ko'p narsalarni qo'yishimiz mumkin.

- `mouseup` da biz tushishni intellektual tarzda yakunlashimiz mumkin: ma'lumotlarni o'zgartirish, elementlarni harakatlantirish.
- Biz uchib o'tayotgan elementlarni ajratib ko'rsatishimiz mumkin.
- Biz sudrab olishni ma'lum bir maydon yoki yo'nalish bo'yicha cheklashimiz mumkin.
- Biz `mousedown/up` uchun hodisa delegatsiyasidan foydalanishimiz mumkin. `event.target` ni tekshiradigan keng maydonli hodisa ishlov beruvchisi Drag'n'Drop-ni yuzlab elementlar uchun boshqarishi mumkin.
- Va hokazo.

Uning ustida arxitektura quruvchi ramkalar mavjud: `DragZone`, `Droppable`, `Draggable` va boshqa sinflar. Ularning aksariyati yuqorida tavsiflanganlarga o'xshash ishlarni qiladi, shuning uchun ularni hozir tushunish oson bo'lishi kerak. Yoki o'zingizni aylantiring, chunki buni amalga oshirish juda oson, ba'zida uchinchi tomon yechimini moslashtirishdan ko'ra osonroq.
