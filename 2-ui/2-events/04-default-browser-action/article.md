# Brauzerning standart harakatlari

Ko'pgina hodisalar avtomatik ravishda brauzer tomonidan amalga oshiriladigan muayyan harakatlarga olib keladi.

Masalan:

- Havolani bosish - uning URL manziliga navigatsiyani boshlaydi.
- Shaklni yuborish tugmasini bosish - uni serverga yuborishni boshlaydi.
- Matn ustida sichqoncha tugmasini bosish va uni siljitish - matnni tanlaydi.

Agar biz JavaScriptda hodisani ko'rib chiqsak, brauzerning tegishli harakatini amalga oshirishni istamaymiz va uning o'rniga boshqa xatti-harakatni amalga oshirishni xohlaymiz.

## Brauzer harakatlarining oldini olish

Brauzerga uning harakat qilishini xohlamasligimizni aytishning ikki yo'li mavjud:

- Asosiy usul - `event` obyektidan foydalanish. `event.preventDefault()` usuli mavjud.
- Agar ishlov beruvchi `on<event>` (`addEventListener` tomonidan emas) yordamida tayinlangan bo'lsa, `false`ni qaytarish ham xuddi shunday ishlaydi.

Ushbu HTMLda havolani bosish navigatsiyaga olib kelmaydi, brauzer hech narsa qilmaydi:

```html autorun height=60 no-beautify
<a href="/" onclick="return false">Click here</a>
or
<a href="/" onclick="event.preventDefault()">here</a>
```
Keyingi misolda biz JavaScriptga asoslangan menyu yaratish uchun ushbu texnikadan foydalanamiz.

```warn header="Handler dan `false` ni qaytarish istisnodir"
Hodisa ishlov beruvchisi tomonidan qaytarilgan qiymat odatda e'tiborga olinmaydi.

Yagona istisno bu `on<event>` yordamida tayinlangan ishlov beruvchidan `return false` dir.

Boshqa barcha holatlarda `return` qiymati e'tiborga olinmaydi. Xususan, `true` ni qaytarishdan foyda yo'q.
```

### Namuna: menu

Quyidagi kabi sayt menyusini ko'rib chiqing:

```html
<ul id="menu" class="menu">
  <li><a href="/html">HTML</a></li>
  <li><a href="/javascript">JavaScript</a></li>
  <li><a href="/css">CSS</a></li>
</ul>
```

U CSS yordamida quyidagicha ko'rinishga ega bo'ladi:

[iframe height=70 src="menu" link edit]

Menyu elementlari `<button>` tugmalari emas, balki HTML-havolalari `<a>` sifatida amalga oshiriladi. Buning bir qancha sabablari bor, masalan:

- Ko'pchilik "o'ng tugmasini bosing" -- "yangi oynada ochish" dan foydalanishni yaxshi ko'radi. Agar biz `<button>` yoki `<span>` ishlatsak, bu ishlamaydi.
- Indekslashda qidiruv tizimlari `<a href="...">` havolalariga amal qiladi.

Shunday qilib, biz belgilashda `<a>` dan foydalanamiz. Lekin odatda biz JavaScriptda clicklarni boshqarish niyatidamiz. Shunday qilib, biz standart brauzer harakatini oldini olishimiz kerak.

Quyidagi kabi:

```js
menu.onclick = function(event) {
  if (event.target.nodeName != 'A') return;

  let href = event.target.getAttribute('href');
  alert( href ); // ...serverdan yuklanishi mumkin, UI yaratish va hokazo

*!*
  return false; // brauzer harakatini oldini olish (URLga kirmang)
*/!*
};
```
Agar `return false` ni o'tkazib yuborsak, kodimiz bajarilgandan so'ng brauzer o'zining "standart amalini" bajaradi -- `href` da URL manziliga o'tadi. Va bu harakat bizga kerak emas, chunki biz click bilan bog'liq muammoni o'zimiz hal qilamiz.

Aytgancha, bu yerda event delegatsiyasidan foydalanish menyumizni juda moslashuvchan qiladi. Biz ichki ro'yxatlarni qo'shishimiz va ularni "pastga siljitish" uchun CSS dan foydalanib uslublashimiz mumkin.

````smart header="Follow-up hodisalari"
Muayyan hodisalar bir-biriga o'tadi. Agar birinchi hodisaning oldini olsak, ikkinchisi bo'lmaydi.

Masalan, `<input>` maydonidagi `mousedown` unda diqqatni jamlashga va `focus` hodisasiga olib keladi. Agar biz `mousedown` hodisasini oldini olsak, diqqat markazida bo'lmaydi.

Quyidagi birinchi `<input>` tugmasini bosishga harakat qiling -- `focus` hodisasi sodir bo'ladi. Ammo ikkinchisini bossangiz, diqqat markazida bo'lmaydi.

```html run autorun
<input value="Focus works" onfocus="this.value=''">
<input *!*onmousedown="return false"*/!* onfocus="this.value=''" value="Click me">
```
Buning sababi, brauzer harakati `mousedown` da bekor qilinadi. Agar inputni kiritishning boshqa usulidan foydalansak, fokuslash hali ham mumkin. Masalan, birinchi kirishdan ikkinchisiga o'tish uchun `key: Tab` tugmasi, lekin endi sichqonchani bosish bilan bajarilmaydi.
````
## "passiv" ishlov beruvchi varianti

`addEventListener` ning ixtiyoriy `passiv: true` opsiyasi brauzerga ishlov beruvchi `preventDefault()` ni chaqirmoqchi emasligini bildiradi.

Nima uchun bu kerak bo'lishi mumkin?

Mobil qurilmalarda `touchmove` kabi ba'zi hodisalar mavjud (foydalanuvchi barmog'ini ekran bo'ylab harakatlantirganda), bu sukut bo'yicha aylantirishga olib keladi, lekin ishlov beruvchida `preventDefault()` yordamida aylantirishni oldini olish mumkin.

Shunday qilib, brauzer bunday hodisani aniqlaganida, u avval barcha ishlov beruvchilarni qayta ishlashi kerak, keyin esa `preventDefault` hech qanday joyda chaqirilmasa, u aylantirishni davom ettirishi mumkin. Bu UIda keraksiz kechikishlar va "jitterlar" ga olib kelishi mumkin.

`Passiv: true` opsiyalari brauzerga ishlov beruvchi aylantirishni bekor qilmoqchi emasligini bildiradi. Keyin brauzer darhol harakat qiladi va maksimal darajada ravon tajribani taqdim etadi va event shu tarzda hal qilinadi.

Ba'zi brauzerlar (Firefox, Chrome) uchun `passive` sukut bo'yicha `touchstart` va `touchmove` hodisalari uchun `true` hisoblanadi.

## event.defaultPrevented

`Event.defaultPrevented` xususiyati, agar birlamchi harakatning oldi olinsa, `true`, aks holda `false` bo'ladi.

Buning uchun qiziqarli foydalanish holati mavjud.

Esingizdami, <info:bubbling-and-capturing> bobida biz `event.stopPropagation()` haqida gapirgan edik va nima uchun bubblingni to'xtatish yomon?

Ba'zan biz boshqa hodisa ishlovchilarga voqea o'tkazilganligini bildirish uchun o'rniga `event.defaultPrevented` dan foydalanishimiz mumkin.

Keling, amaliy misolni ko'rib chiqaylik.

Odatiy bo'lib, `contextmenu` hodisasidagi brauzer (sichqonchaning o'ng tugmasi) standart variantlarga ega kontekst menyusini ko'rsatadi. Biz buni oldini olishimiz va o'zimiznikini ko'rsatishimiz mumkin, masalan:

```html autorun height=50 no-beautify run
<button>Right-click shows browser context menu</button>

<button *!*oncontextmenu="alert('Draw our menu'); return false"*/!*>
  Right-click shows our context menu
</button>
```
Endi ushbu kontekst menyusiga qo'shimcha ravishda biz hujjat bo'ylab kontekst menyusini qo'llashni xohlaymiz.

O'ng tugmasini bosgandan so'ng, eng yaqin kontekst menyusi paydo bo'ladi.

```html autorun height=80 no-beautify run
<p>Right-click here for the document context menu</p>
<button id="elem">Right-click here for the button context menu</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Button context menu");
  };

  document.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Document context menu");
  };
</script>
```
Muammo shundaki, biz `elem` ni bosganimizda ikkita menyuga ega bo'lamiz: tugma darajasidagi va (event pufakchalari) hujjat darajasidagi menyu.

Uni qanday tuzatish kerak? Yechimlardan biri shunday deb o'ylashdir: "Tugmani ishlov beruvchida sichqonchaning o'ng tugmachasini bosganimizda, uning ko'piklanishini to'xtatamiz" va `event.stopPropagation()` dan foydalanamiz:

```html autorun height=80 no-beautify run
<p>Right-click for the document menu</p>
<button id="elem">Right-click for the button menu (fixed with event.stopPropagation)</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
*!*
    event.stopPropagation();
*/!*
    alert("Button context menu");
  };

  document.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Document context menu");
  };
</script>
```
Endi tugma darajasidagi menyu mo'ljallanganidek ishlaydi, lekin narxi yuqori. Biz har qanday tashqi kod uchun sichqonchaning o'ng tugmalari haqidagi ma'lumotlarga kirishni abadiy rad etamiz, jumladan, statistikani to'playdigan hisoblagichlar va boshqalar. Bu anchagina ma'nosiz.

Muqobil yechim, agar standart harakatning oldini olgan bo'lsa, `document` ishlov beruvchisida tekshirish bo'ladimi? Agar shunday bo'lsa, unda event ko'rib chiqildi va biz bunga munosabat bildirishimiz shart emas.


```html autorun height=80 no-beautify run
<p>Right-click for the document menu (added a check for event.defaultPrevented)</p>
<button id="elem">Right-click for the button menu</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Button context menu");
  };

  document.oncontextmenu = function(event) {
*!*
    if (event.defaultPrevented) return;
*/!*

    event.preventDefault();
    alert("Document context menu");
  };
</script>
```
Endi hamma narsa ham to'g'ri ishlaydi. Agar bizda ichki elementlar mavjud bo'lsa va ularning har birining o'ziga xos kontekst menyusi bo'lsa, bu ham ishlaydi. Har bir `contextmenu` ishlov beruvchisida `event.defaultPrevented` ni tekshiring.

```smart header="event.stopPropagation() va event.preventDefault()"
Ko'rib turganimizdek, `event.stopPropagation()` va `event.preventDefault()` (shuningdek, `return false` deb ham ataladi) ikki xil narsadir. Ular bir-biriga bog'liq emas.
```

```smart header="Ichki kontekst menyusi arxitekturasi"
Ichki kontekst menyularini amalga oshirishning muqobil usullari ham mavjud. Ulardan biri `document.oncontextmenu` uchun ishlov beruvchiga ega bo'lgan yagona global obyektga ega bo'lish, shuningdek, unda boshqa ishlov beruvchilarni saqlashga imkon beruvchi usullardir.

Obyekt sichqonchaning o'ng tugmachasini bosadi, saqlangan ishlov beruvchilarni ko'rib chiqadi va mos keladiganini ishga tushiradi.

Ammo keyin kontekst menyusini xohlaydigan har bir kod qismi ushbu obyekt haqida bilishi va o'zining `contextmenu` ishlovchisi o'rniga uning yordamidan foydalanishi kerak.
```

## Xulosa

Ko'pgina standart brauzer amallari mavjud:

- `mousedown` -- tanlashni boshlaydi (tanlash uchun sichqonchani harakatlantiring).
- `<input type="checkbox">` ustiga `click` -- `input`ni tekshiradi/cheklaydi.
- `yuborish` -- forma maydonidagi `<input type="submit">` tugmasini bosish yoki `key:Enter` tugmasini bosish event sodir bo'lishiga olib keladi va brauzer undan keyin shaklni yuboradi.
- `keydown` -- tugmani bosish maydonga belgi qo'shishga yoki boshqa harakatlarga olib kelishi mumkin.
- `contextmenu` -- hodisa sichqonchaning o'ng tugmasi bilan sodir bo'ladi, amal brauzer kontekst menyusini ko'rsatishdir.
- ...va boshqalar...

Agar biz hodisani faqat JavaScript orqali boshqarishni istasak, barcha standart harakatlarni oldini olish mumkin.

Standart harakatni oldini olish uchun -- `event.preventDefault()` yoki `return false` dan foydalaning. Ikkinchi usul faqat `on<event>` bilan tayinlangan ishlov beruvchilar uchun ishlaydi.

`addEventListener` ning `passiv: true` opsiyasi brauzerga harakatning oldini olinmasligini bildiradi. Bu `touchstart` va `touchmove` kabi ba'zi mobil hodisalar uchun brauzerga aylantirishdan oldin barcha ishlov beruvchilar tugashini kutmasligi kerakligini aytish uchun foydalidir.

Agar sukut bo'yicha harakat oldini olgan bo'lsa, `event.defaultPrevented` qiymati `true`ga aylanadi, aks holda `false` bo'ladi.

```warn header="Semantik bo'ling, suiiste'mol qilmang"
Texnik jihatdan, standart harakatlarni oldini olish va JavaScriptni qo'shish orqali biz har qanday elementlarning harakatini sozlashimiz mumkin. Masalan, biz `<a>` havolasini tugma kabi ishlashi mumkin va `<button>` tugmasi havola sifatida ishlaydi (boshqa URL manziliga yo'naltirish yoki shunga o'xshash).

Ammo biz odatda HTML elementlarining semantik ma'nosini saqlashimiz kerak. Masalan, `<a>` tugma emas, navigatsiyani amalga oshirishi kerak.

"Yaxshi narsa" bo'lishdan tashqari, bu sizning HTML ingizni qulaylik nuqtayi nazaridan yaxshilaydi.

Shuningdek, `<a>` bilan misolni ko'rib chiqsak, diqqat qiling: brauzer bizga bunday havolalarni yangi oynada ochishga imkon beradi (ularni va boshqa vositalarni o'ng tugmasini bosib). Va bu odamlarga yoqadi. Agar biz tugmachani JavaScriptdan foydalanib havola sifatida ishlasak va hatto CSSdan foydalangan holda havolaga o'xshab qolsak, u holda `<a>` brauzeriga xos xususiyatlar baribir u uchun ishlamaydi.
```
