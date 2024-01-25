# Brauzer hodisalari bilan tanishuv

*Hodisa* nimadir sodir bo'lganligi haqidagi signaldir. Barcha DOM tugunlari bunday signallarni yaratadi (lekin voqealar DOM bilan cheklanmaydi).

Quyida eng foydali DOM voqealari ro'yxati keltirilgan, ularni ko'rib chiqishingiz mumkin:

**Sichqoncha hodisalari:**
- `click` -- sichqoncha elementni bosganda (sensorli ekranli qurilmalar uni teginish orqali hosil qiladi).
- `contextmenu` -- sichqoncha elementni o'ng tugmasini bosganda,
- `mouseover` / `mouseout` -- sichqoncha kursori elementga kelganda/qolganida,
- `mousedown` / `mouseup` -- element ustida sichqoncha tugmasi bosilganda / qo'yib yuborilganda,
- `mousemove` -- sichqonchani harakatlantirilganida ishlaydi.

**Klaviatura hodisalari:**
- `keydown` va `keyup` -- klaviatura tugmasi bosilganda va qo'yib yuborilganda ishlaydi.

**Shakl elementi hodisalari:**
- `submit` -- tashrif buyuruvchi `<form>` ni topshirganda.
- `focus` -- tashrif buyuruvchi diqqatni biror elementga qaratganda, masalan, `<input>`da ishlaydi.

**Dokument hodisalari:**
- `DOMContentLoaded` -- HTML yuklangan va ishlov berilganda, DOM to'liq qurilgan hisoblanadi.
**CSS hodisalari:**
- `transitionend` -- CSS-animatsiya yakunlanganda.

Yana boshqa ko'plab hodisalar mavjud. Muayyan hodisalar haqida keyingi boblarda batafsilroq ma'lumot beramiz.

## Hodisalar boshqaruvchilari

Hodisalarga munosabat bildirish uchun biz *handler* ni belgilashimiz mumkin -- voqea sodir bo'lganda ishlaydigan funksiya.

Ishlovchilar foydalanuvchi harakatlarida JavaScript kodini ishga tushirish usulidir.

Ishlovchini tayinlashning bir necha yo'li mavjud. Keling, ularni eng oddiyidan boshlab ko'rib chiqamiz.

### HTML-attribyuti

Ishlovchi HTML da `on<event>` nomli atribyut bilan o'rnatilishi mumkin.

Masalan, `input` uchun `click` ishlov beruvchisini belgilayotganda `onclick` dan foydalanishimiz mumkin, quyidagi misolga e'tibor bering:

```html run
<input value="Click me" *!*onclick="alert('Click!')"*/!* type="button">
```
Sichqonchani bosgandan so'ng, `onclick` ichidagi kod ishlaydi.

E'tibor bering, `onclick` ichida biz bitta tirnoqdan foydalanamiz, chunki atributning o'zi qo'shtirnoq ichida. Agar biz kod atribut ichida ekanligini unutib qo'ysak va uning ichida qo'shtirnoq qo'shsak, masalan: `onclick="alert("Click!")"`, u to'g'ri ishlamaydi.

HTML-atribyut juda ko'p kod yozish uchun qulay joy emas, shuning uchun biz JavaScript funksiyasini yaratib, uni o'sha yerda chaqirganimiz ma'qul.

Bu yerda click `countRabbits()` funksiyasini ishga tushiradi:

```html autorun height=50
<script>
  function countRabbits() {
    for(let i=1; i<=3; i++) {
      alert("Rabbit number " + i);
    }
  }
</script>

<input type="button" *!*onclick="countRabbits()"*/!* value="Count rabbits!">
```
Bizga ma'lumki, HTML atributlari nomlari katta-kichik harflarga bog'liq emas, shuning uchun `ONCLICK` ham `onClick` va `onCLICK` kabi ishlaydi... Lekin odatda atributlar kichik harflar bilan yoziladi: `onclick`.

### DOM xususiyati

Biz `on<event>` DOM xususiyatidan foydalanib ishlov beruvchini tayinlashimiz mumkin.

Masalan, `elem.onclick`:

```html autorun
<input id="elem" type="button" value="Click me">
<script>
*!*
  elem.onclick = function() {
    alert('Thank you');
  };
*/!*
</script>
```
Agar ishlov beruvchi HTML-atribyut yordamida tayinlangan bo'lsa, u holda brauzer uni o'qiydi, atribyut tarkibidan yangi funksiya yaratadi va uni DOM xususiyatiga yozadi.

Shunday qilib, bu yo'l aslida oldingisiga o'xshaydi.

Ushbu ikkita kod qismi bir xil ishlaydi:

1. Faqat HTML:

    ```html autorun height=50
    <input type="button" *!*onclick="alert('Click!')"*/!* value="Button">
    ```
2. HTML + JS:

    ```html autorun height=50
    <input type="button" id="button" value="Button">
    <script>
    *!*
      button.onclick = function() {
        alert('Click!');
      };
    */!*
    </script>
    ```

Birinchi misolda HTML atributi `button.onclick` ni ishga tushirish uchun ishlatiladi, ikkinchi misolda esa -- skript, ikkalasining farqi shu.

**Faqat bitta `onclick` xususiyati mavjud bo‘lgani uchun biz bir nechta hodisa ishlov beruvchisini tayinlay olmaymiz.**

Quyidagi misolda JavaScript bilan ishlov beruvchini qo'shish mavjud ishlov beruvchini qayta yozadi:

```html run height=50 autorun
<input type="button" id="elem" onclick="alert('Before')" value="Click me">
<script>
*!*
  elem.onclick = function() { // mavjud ishlov beruvchining ustiga yozadi
    alert('After'); // faqat shu ko'rsatiladi
  };
*/!*
</script>
```
Handler ni olib tashlash uchun -- `elem.onclick = null` ni belgilang.

## Elementga kirish: this

Ishlovchi ichidagi `this` qiymati element hisoblanadi. Unda ishlov beruvchi bor.

Quyidagi kodda `button` o'z tarkibini `this.innerHTML` yordamida ko'rsatadi:

```html height=50 autorun
<button onclick="alert(this.innerHTML)">Click me</button>
```

## Yuz berish ehtimoli bor xatolar

Agar siz hodisalar bilan ishlashni boshlayotgan bo'lsangiz -- ba'zi nozikliklarga e'tibor bering.

Biz mavjud funksiyani ishlov beruvchi sifatida o'rnatishimiz mumkin:

```js
function sayThanks() {
  alert('Thanks!');
}

elem.onclick = sayThanks;
```

Ammo ehtiyot bo'ling: funksiya `sayThanks()` emas, balki `sayThanks` sifatida tayinlanishi kerak.

```js
// to'g'ri
button.onclick = sayThanks;

// xato
button.onclick = sayThanks();
```
Qavslar qo'shsak, `sayThanks()` funksiya chaqiruviga aylanadi. Demak, oxirgi satr aslida funksiya bajarilishining *natijasini* oladi, ya’ni `undefined` (funksiya hech narsani qaytarmaydi) va uni `onclick` ga tayinlaydi. Bu ishlamayapti.

...Boshqa tomondan, belgilashda bizga qavslar kerak:

```html
<input type="button" id="button" onclick="sayThanks()">
```
Farqni tushuntirish oson. Brauzer atribyutni o'qiganda, atribut tarkibidan tanasi bilan ishlov beruvchi funksiyasini yaratadi.

Shunday qilib, belgilash quyidagi xususiyatni yaratadi:

```js
button.onclick = function() {
*!*
  sayThanks(); // <-- atribut mazmuni bu yerga tushadi
*/!*
};
```

**Ishlov beruvchilar uchun `setAttribute` dan foydalanmang**

Bunday chaqiruv ishlamaydi:

```js run no-beautify
// <body> dagi click xatolarni keltirib chiqaradi
// atributlar har doim satr bo'lgani uchun funksiya satrga aylanadi
document.body.setAttribute('onclick', function() { alert(1) });
```
**DOM-xususiyat ishi muhim.**

Handlerni `elem.ONCLICK` emas, balki `elem.onclick` ga tayinlang, chunki DOM xususiyatlari katta-kichik harflarga sezgir.

## addEventListener

Ishlovchilarni tayinlashning yuqorida aytib o'tilgan usullarining asosiy muammosi shundaki, biz *bitta hodisaga bir nechta ishlov beruvchilarni tayinlay olmaymiz*.

Aytaylik, bizning kodimizning bir qismi bosish tugmachasini ajratib ko'rsatishni xohlaydi, ikkinchisi esa xuddi shu bosish orqali xabarni ko'rsatishni xohlaydi.

Buning uchun biz ikkita hodisa ishlov beruvchisini tayinlamoqchimiz. Ammo yangi DOM xususiyati mavjud elementning ustiga yoziladi:

```js no-beautify
input.onclick = function() { alert(1); }
// ...
input.onclick = function() { alert(2); } // avvalgi handlerni almashtiring
```
Veb-standartlarni ishlab chiquvchilar buni uzoq vaqt oldin tushunishgan va bunday cheklovlar bilan bog'liq bo'lmagan `addEventListener` va `removeEventListener` maxsus usullaridan foydalangan holda ishlov beruvchilarni boshqarishning muqobil usulini taklif qilishgan.

Ishlovchi qo'shish uchun sintaksis:

```js
element.addEventListener(event, handler, [options]);
```

`event`
: Event nomi, masalan, `"click"`.

`handler`
: Handler funksiyasi.

`options`
: Xususiyatlarga ega qo'shimcha ixtiyoriy obyekt:
     - `once`: agar `true` bo'lsa, u ishga tushirilgandan so'ng tinglovchi avtomatik ravishda o'chiriladi.
     - `capture`: voqeani boshqarish bosqichi, bu mavzu keyinroq <info:bubbling-and-capturing> bobida yoritiladi. Tarixiy sabablarga ko'ra, `options` ham `false/true` bo'lishi mumkin, bu `{capture: false/true}` bilan bir xil.
     - `passive`: agar `true` bo'lsa, ishlov beruvchi `preventDefault()` ni chaqirmaydi, buni keyinroq <info:default-browser-action> da tushuntiramiz.

Ishlovchini olib tashlash uchun "removeEventListener" dan foydalaning:

```js
element.removeEventListener(event, handler, [options]);
```

````warn header="Olib tashlash bir xil funksiyani talab qiladi"
Ishlovchini olib tashlash uchun biz tayinlangan funksiyani o'tkazishimiz kerak.

Bu ishlamaydi:

```js no-beautify
elem.addEventListener( "click" , () => alert('Thanks!'));
// ....
elem.removeEventListener( "click", () => alert('Thanks!'));
```
Ishlovchi olib tashlanmaydi, chunki `removeEventListener` boshqa funksiyani oladi -- xuddi shu kod bilan, lekin bu muhim emas, chunki u boshqa funksiya obyekti hisoblanadi.

Mana to'g'ri yo'l:

```js
function handler() {
  alert( 'Thanks!' );
}

input.addEventListener("click", handler);
// ....
input.removeEventListener("click", handler);
```

Iltimos, diqqat qiling -- agar biz funksiyani o'zgaruvchida saqlamasak, uni o'chira olmaymiz. `addEventListener` tomonidan tayinlangan ishlov beruvchilarni "qayta o'qish" uchun hech qanday usul yo'q.
````
`addEventListener` ga bir nechta qo'ng'iroqlar unga bir nechta ishlov beruvchilarni qo'shish imkonini beradi, masalan:

```html run no-beautify
<input id="elem" type="button" value="Click me"/>

<script>
  function handler1() {
    alert('Thanks!');
  };

  function handler2() {
    alert('Thanks again!');
  }

*!*
  elem.onclick = () => alert("Hello");
  elem.addEventListener("click", handler1); // Thanks!
  elem.addEventListener("click", handler2); // Thanks again!
*/!*
</script>
```
Yuqoridagi misolda ko'rib turganimizdek, biz DOM-xususiyati va `addEventListener` yordamida *ikkalasi*ning ishlov beruvchilarini o'rnatishimiz mumkin. Ammo, biz ushbu usullardan faqat bittasini ishlatamiz.

````warn header="Ba'zi hodisalar uchun ishlov beruvchilar faqat `addEventListener` bilan ishlaydi"
DOM-xususiyati orqali tayinlab bo'lmaydigan hodisalar mavjud. Faqat `addEventListener` bilan buni bajarishimiz mumkin.

Hujjat yuklanganda va DOM qurilganda ishga tushadigan `DOMContentLoaded` hodisasi bunga yorqin misol.
```js
// hech qachon ishlamaydi
document.onDOMContentLoaded = function() {
  alert("DOM built");
};
```

```js
// bunday usulda ishlaydi
document.addEventListener("DOMContentLoaded", function() {
  alert("DOM built");
});
```
Demak, `addEventListener` eng universal variant. Garchi bunday hodisalar qoida emas, balki istisno hisoblanadi.
````

## Hodisa obyekti

Hodisani to'g'ri boshqarish uchun biz nima bo'lganligi haqida ko'proq bilishni xohlaymiz, faqat "click" yoki "keydown" emas, balki ko'rsatgich koordinatalari qanaqaligi, qaysi tugma bosilgani Va hokazo.

Voqea sodir bo'lganda, brauzer *hodisa obyektini* yaratadi, unga tafsilotlarni kiritadi va ishlov beruvchiga argument sifatida uzatadi.

Hodisa obyektidan ko'rsatgich koordinatalarini olish misoli:

```html run
<input type="button" value="Click me" id="elem">

<script>
  elem.onclick = function(*!*event*/!*) {
    // hodisa turini, elementni va bosish koordinatalarini ko'rsatish
    alert(event.type + " at " + event.currentTarget);
    alert("Coordinates: " + event.clientX + ":" + event.clientY);
  };
</script>
```

`event` obyektining ayrim xususiyatlari:

`event.type`
: Event type, bu yerda u `"click"`.

`event.currentTarget`
:Eventni boshqargan element. Bu aynan `this` bilan bir xil, agar ishlov beruvchi arrow funksiyasi bo'lmasa yoki undagi `this` boshqa biror narsa bilan bog'langan bo'lmasa, biz `event.currentTarget` dan elementni olishimiz mumkin.

`event.clientX` / `event.clientY`
: Kursorning oynaga nisbiy koordinatalari, ko'rsatgich hodisalari uchun.

Ko'proq xususiyatlar mavjud. Ularning ko'pchiligi hodisa turiga bog'liq: klaviatura hodisalari bir xususiyatlar to'plamiga ega, ko'rsatgich hodisalari - boshqasi, biz ularni keyinroq turli hodisalar tafsilotlariga o'tganimizda o'rganamiz.

````smart header="Event obyekti HTML handler larida ham mavjud"
Agar biz HTMLda ishlov beruvchini tayinlasak, biz `event` obyektidan ham foydalanishimiz mumkin, masalan:

```html autorun height=60
<input type="button" onclick="*!*alert(event.type)*/!*" value="Event type">
```
Bunday qilish mumkin, chunki brauzer atributni o'qiganda, u shunday ishlov beruvchini yaratadi: `function(event) { alert(event.type) }`. Ya'ni: uning birinchi argumenti `"event"` deb ataladi va tanasi atribyutdan olinadi.
````


## Obyekt ishlovchilari: handleEvent

 Biz `addEventListener` yordamida faqat funksiyani emas, balki obyektni hodisa ishlovchisi sifatida belgilashimiz mumkin. Voqea sodir bo'lganda, uning `handleEvent` usuli chaqiriladi.

Masalan:


```html run
<button id="elem">Click me</button>

<script>
  let obj = {
    handleEvent(event) {
      alert(event.type + " at " + event.currentTarget);
    }
  };

  elem.addEventListener('click', obj);
</script>
```
Ko'rib turganimizdek, `addEventListener` obyektni ishlov beruvchi sifatida qabul qilganda, voqea sodir bo'lgan taqdirda `obj.handleEvent(event)` ni chaqiradi.

Shuningdek, biz maxsus sinf obyektlaridan foydalanishimiz mumkin, masalan:


```html run
<button id="elem">Click me</button>

<script>
  class Menu {
    handleEvent(event) {
      switch(event.type) {
        case 'mousedown':
          elem.innerHTML = "Mouse button pressed";
          break;
        case 'mouseup':
          elem.innerHTML += "...and released.";
          break;
      }
    }
  }

*!*
  let menu = new Menu();

  elem.addEventListener('mousedown', menu);
  elem.addEventListener('mouseup', menu);
*/!*
</script>
```
Bu yerda bir xil obyekt ikkala hodisani ham boshqaradi. Iltimos, `addEventListener` yordamida tinglash uchun voqealarni aniq sozlashimiz kerakligini unutmang. `menu` obyekti bu yerda faqat `mousedown` va `mouseup`ni oladi, boshqa turdagi hodisalarni emas.

`handleEvent` usuli barcha ishni mustaqil bajarishi shart emas. Buning o'rniga boshqa hodisaga xos usullarni chaqirishi mumkin, masalan:

```html run
<button id="elem">Click me</button>

<script>
  class Menu {
    handleEvent(event) {
      // mousedown -> onMousedown
      let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
      this[method](event);
    }

    onMousedown() {
      elem.innerHTML = "Mouse button pressed";
    }

    onMouseup() {
      elem.innerHTML += "...and released.";
    }
  }

  let menu = new Menu();
  elem.addEventListener('mousedown', menu);
  elem.addEventListener('mouseup', menu);
</script>
```
Endi voqea ishlov beruvchilari aniq ajratilgan, buni qo'llab-quvvatlash osonroq bo'lishi mumkin.

## Xulosa

Hodisa ishlov beruvchilarini tayinlashning 3 usuli mavjud:

1. HTML atributi: `onclick="..."`.
2. DOM xususiyati: `elem.onclick = function`.
3. Usullar: qo'shish uchun `elem.addEventListener(event, handler[, phase])`, olib tashlash uchun `removeEventListener`.

HTML atributlari juda kam ishlatiladi, chunki HTML tegining o'rtasida joylashgan JavaScript biroz g'alati va begona ko'rinadi. Shuningdek, u yerda juda ko'p kod yozish mumkin emas.

DOM xususiyatlaridan foydalanish mumkin, lekin biz muayyan hodisa uchun bir nechta ishlov beruvchini tayinlay olmaymiz. Ko'p hollarda bu cheklov bosilmaydi. 

Oxirgi yo'l eng moslashuvchan, lekin yozish uchun ham eng uzundir. Faqatgina u bilan ishlaydigan bir nechta hodisalar mavjud, masalan, `transitionend` va `DOMContentLoaded` (qoplanadi). Bundan tashqari, `addEventListener` obyektlarni hodisalarni qayta ishlovchi sifatida qo'llab-quvvatlaydi. Bunday holda, hodisa sodir bo'lganda `handleEvent` usuli chaqiriladi.

Ishlovchini qanday tayinlaganingizdan qat'iy nazar, u birinchi argument sifatida hodisa obyektini oladi. Ushbu obyekt nima sodir bo'lganligi haqidagi tafsilotlarni o'z ichiga oladi.

Biz keyingi boblarda umumiy voqealar va turli xil voqealar haqida ko'proq bilib olamiz.