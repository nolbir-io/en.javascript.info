
# Sichqoncha hodisalari

Ushbu bobda biz sichqoncha hodisalari va ularning xususiyatlari haqida batafsilroq ma'lumotga ega bo'lamiz.

Iltimos, diqqat qiling: bunday hodisalar nafaqat "sichqoncha qurilmalari" dan, balki moslik uchun taqlid qilingan telefonlar va planshetlar kabi boshqa qurilmalarida ham sodir bo'lishi mumkin.

## Sichqoncha hodisasi turlari

Biz bu voqealarning ba'zilarini allaqachon ko'rganmiz:

`mousedown/mouseup`
: Sichqoncha tugmasi element ustida bosiladi/qo'yib yuboriladi.

`mouseover/mouseout`
: Sichqoncha ko'rsatkichi elementdan yuqoriga/tashqariga chiqadi.

`mousemove`
: Har bir sichqonchaning element ustida harakatlanishi ushbu hodisani keltirib chiqaradi.

`click`
: Agar sichqonchaning chap tugmasi ishlatilsa, bir xil element ustida `mousedown`, keyin esa `mouseup` ni qo'yishdan keyin ishga tushadi.

`dblclick`
: Qisqa vaqt oralig'ida bir xil elementni ikki marta bosgandan keyin ishga tushadi. Hozirgi kunda kamdan-kam qo'llaniladi.

`contextmenu`
: Sichqonchaning o'ng tugmasi bosilganda ishga tushadi. Kontekst menyusini ochishning boshqa usullari mavjud, masalan, maxsus klaviatura tugmasidan foydalanib, u bu holatda ham ishga tushadi, shuning uchun bu sichqoncha hodisasi emas.

...Yana bir qancha hodisalar ham bor, ularni keyinroq yoritamiz.

## Hodisalar tartibi

Yuqoridagi ro'yxatda ko'rib turganingizdek, foydalanuvchi harakati bir nechta hodisalarni keltirib chiqarishi mumkin.

Masalan, chap tugmachani bosish avval `mousedown`, tugma bosilganda `mouseup` va qo'yib yuborilganda `click` ni ishga tushiradi.

Bitta harakat bir nechta hodisalarni boshlagan hollarda, ularning tartibi belgilanadi. Ya'ni, ishlov beruvchilar `mousedown` -> `mouseup` -> `click` tartibida chaqiriladi.

```online
Quyidagi tugmani bosing va voqealarni ko'rasiz. Ikki marta bosishni ham sinab ko'ring.

Quyidagi test stendida sichqonchaning barcha hodisalari qayd qilinadi va ular orasida 1 soniyadan ortiq kechikish bo'lsa, ular gorizontal qoida bilan ajratiladi.

Shuningdek, biz sichqoncha tugmachasini aniqlash imkonini beruvchi `button` xususiyatini ko'rishimiz mumkin; u haqida quyida tushuntirilgan.

<input onmousedown="return logMouse(event)" onmouseup="return logMouse(event)" onclick="return logMouse(event)" oncontextmenu="return logMouse(event)" ondblclick="return logMouse(event)" value="Click me with the right or the left mouse button" type="button"> <input onclick="logClear('test')" value="Clear" type="button"> <form id="testform" name="testform"> <textarea style="font-size:12px;height:150px;width:360px;"></textarea></form>
```
## Sichqoncha tugmasi

Bosish bilan bog'liq hodisalar har doim `button` xususiyatiga ega, bu esa sichqonchaning aniq tugmachasini olish imkonini beradi.

Biz odatda uni `click` va `contextmenu` hodisalari uchun ishlatmaymiz, chunki birinchisi faqat sichqonchaning chap tugmachasini bosganda, ikkinchisi esa faqat o'ng tugmani bosganda sodir bo'ladi.

Boshqa tomondan, `mousedown` va `mouseup` ishlov beruvchilari uchun `event.button` kerak bo'lishi mumkin, chunki bu hodisalar har qanday tugmani ishga tushiradi, shuning uchun `button` "right-mousedown" va "left-mousedown" o'rtasida farqlash imkonini beradi.

`event.button` ning ehtimoliy qiymatlari:

| Tugma holati | `event.button` |
|--------------|----------------|
| Chap tugma (asosiy) | 0 |
| O'rta tugma (yordamchi) | 1 |
| O'ng tugma (ikkinchi darajali) | 2 |
| X1 tugma (orqaga) | 3 |
| X2 tugma (oldinga) | 4 |

Ko'pgina sichqoncha qurilmalarida faqat chap va o'ng tugmalar mavjud, shuning uchun mumkin bo'lgan qiymatlar `0` yoki `2` dir. Sensorli qurilmalar ham ularga tegilganda shunga o'xshash hodisalarni keltirib chiqaradi.

Shuningdek, `event.buttons` xususiyati mavjud bo'lib, unda hozirda bosilgan barcha tugmalar butun son sifatida, har bir tugma uchun bir bitdan iborat. Amalda bu xususiyat juda kam qo'llaniladi, agar kerak bo'lsa, tafsilotlarni [MDN](mdn:/api/MouseEvent/buttons) da topishingiz mumkin.

```warn header="Eskirgan `event.which`"
Eski kod `event.which` xususiyatidan foydalanishi mumkin, bu tugmani olishning eski nostandart usuli bo'lib, mumkin bo'lgan qiymatlarga ega:

- `event.which == 1` – chap tugma,
- `event.which == 2` – o'rta tugma,
- `event.which == 3` – o'ng tugma.

Hozircha `event.which` eskirgan, biz undan foydalanmasligimiz kerak.
```
## Modifikatorlar: shift, alt, ctrl va meta

Sichqonchaning barcha hodisalari bosilgan modifikator tugmalari haqidagi ma'lumotlarni o'z ichiga oladi.

Tadbir xususiyatlari:

- `shiftKey`: `key: Shift`
- `altKey`: `key: Alt` (yoki Mac uchun `key: Opt`)
- `ctrlKey`: `key: Ctrl`
- `metaKey`: Mac uchun `key:Cmd`

Agar hodisa davomida tegishli tugma bosilsa, ular `true` hisoblanadi.

Masalan, quyidagi tugma faqat `key:Alt+Shift`+click bilan ishlaydi:

```html autorun height=60
<button id="button">Alt+Shift+Click on me!</button>

<script>
  button.onclick = function(event) {
*!*
    if (event.altKey && event.shiftKey) {
*/!*
      alert('Hooray!');
    }
  };
</script>
```

```warn header="Diqqat: Mac-da odatda `Ctrl` o'rniga `Cmd` bo'ladi"
Windows va Linuxda `key:Alt`, `key:Shift` va `key:Ctrl` o'zgartirish tugmalari mavjud. Macda yana bittasi bor: `key:Cmd`, `metaKey` xususiyatiga mos keladi.

Ko'pgina ilovalarda Windows/Linux `key:Ctrl` dan foydalanganda, Macda `key:Cmd` ishlatiladi.

Ya'ni, Windows foydalanuvchisi `key:Ctrl+Enter` yoki `key:Ctrl+A` tugmachalarini bosganda, Mac foydalanuvchisi `key:Cmd+Enter` yoki `key:Cmd+A` va hokazolarni bosadi.

Shunday qilib, agar biz `key:Ctrl`+click kabi kombinatsiyalarni qo'llab-quvvatlamoqchi bo'lsak, Mac uchun `key:Cmd`+click dan foydalanish mantiqan to'g'ri keladi. Bu Mac foydalanuvchilari uchun qulayroq.

Agar biz Mac foydalanuvchilarini `key:Ctrl`+click lariga majburlamoqchi bo'lsak ham -- bu juda qiyin. Muammo shundaki: `key: Ctrl` bilan sichqonchaning chap tugmasi MacOSda *o'ng tugmasini bosish* sifatida talqin qilinadi va u Windows/Linux kabi `click` emas, balki `contextmenu` hodisasini yaratadi.

Shunday qilib, agar biz barcha operatsion tizim foydalanuvchilari o'zlarini qulay his qilishlarini istasak, u holda `ctrlKey` bilan birga `metaKey` ni tekshirishimiz kerak.

JS-kod uchun bu `if (event.ctrlKey || event.metaKey)` ni tekshirishimiz kerakligini anglatadi.
```

```warn header="Mobil ilovalar ham mavjud"
Klaviatura kombinatsiyalari ish jarayoniga qo'shimcha sifatida yaxshi. Shunday qilib, agar tashrif buyuruvchi klaviaturadan foydalansa - ular ishlaydi.

Ammo agar ularning qurilmasida u yo'q bo'lsa, unda modifikator kalitlarisiz yashashning yo'li bo'lishi kerak.
```

## Koordinatalar: clientX/Y, pageX/Y

Barcha sichqoncha hodisalari koordinatalarni ikki xilda beradi:

1. Oynaga nisbatan: `clientX` va `clientY`.
2. Hujjatga nisbatan: `pageX` va `pageY`.

Biz allaqachon <info:koordinatalar> bobida ular orasidagi farqni ko'rib chiqdik.

Xulosa qilib aytganda, `pageX/Y` hujjatning nisbiy koordinatalari hujjatning yuqori chap burchagidan hisoblanadi va sahifa aylantirilganda o'zgarmaydi, `clientX/Y` esa joriy oynaning chap yuqori burchagidan hisoblanadi. . Sahifani aylantirganda, ular o'zgaradi.

Misol uchun, agar bizda 500x500 o'lchamdagi oyna bo'lsa va sichqoncha chap-yuqori burchakda bo'lsa, sahifa qanday aylantirilishidan qat'iy nazar, `clientX` va `clientY` `0` bo'ladi.

Va agar sichqoncha markazda bo'lsa, hujjatning qaysi joyida bo'lishidan qat'iy nazar, `clientX` va `clientY` `250` dir. Ular shu jihati bo'yicha `position:fixed` ga o'xshaydi.

````online
`clientX/clientY` ni ko'rish uchun sichqonchani kiritish maydoni ustiga suring (misol `iframe` da, shuning uchun koordinatalar `iframe` ga bog'liq):

```html autorun height=50
<input onmousemove="this.value=event.clientX+':'+event.clientY" value="Mouse over me">
```
````
## Sichqonchani bosish orqali tanlashning oldini olish

Sichqonchani ikki marta bosish ba'zi interfeyslarda bezovta bo'lishi mumkin bo'lgan yon ta'sirga ega: u matnni tanlaydi.

Misol uchun, quyidagi matnni ikki marta bosish bizning ishlov beruvchimizdan tashqari uni tanlaydi:

```html autorun height=50
<span ondblclick="alert('dblclick')">Double-click me</span>
```
Agar biror kishi sichqonchaning chap tugmachasini bosgan bo'lsa va uni qo'yib yubormasdan sichqonchani harakatlantirsa, bu ham tanlovni ko'pincha keraksiz qiladi.

Tanlovni oldini olishning bir necha yo'li mavjud, ularni <info:selection-range> bo'limida o'qishingiz mumkin.

Bunday holda, eng oqilona yo'l `mousedown` da brauzer harakatini oldini olishdir. Bu ikkala tanlovni ham oldini oladi:

```html autorun height=50
Before...
<b ondblclick="alert('Click!')" *!*onmousedown="return false"*/!*>
  Double-click me
</b>
...After
```
Endi qalin element ikki marta bosish orqali tanlanmaydi va undagi chap tugmani bosish tanlovni boshlamaydi.

Iltimos, diqqat qiling: uning ichidagi matn hali ham tanlanishi mumkin. Biroq, tanlov matnning o'zidan emas, balki undan oldin yoki keyin boshlanishi kerak. Odatda foydalanuvchilar uchun bu yaxshi.

````smart header="Nusxa ko'chirishning oldini olish"
Agar sahifamiz tarkibini nusxa ko'chirishdan himoya qilish uchun tanlovni o'chirib qo'ymoqchi bo'lsak, boshqa hodisadan foydalanishimiz mumkin: `oncopy`.

```html autorun height=80 no-beautify
<div *!*oncopy="alert('Copying forbidden!');return false"*/!*>
  Hurmatli foydalanuvchi,
  Nusxa ko'chirish qat'iyan ta'qiqlangan.
  Agar siz JS yoki HTMLni bilsangiz, hamma narsani sahifa manbasidan olishingiz mumkin.
</div>
```
Agar siz `<div>` da matn qismini nusxalashga harakat qilsangiz, bu ishlamaydi, chunki standart `oncopy` amali oldini oladi.

Albatta, foydalanuvchi sahifaning HTML-manbasiga kirish huquqiga ega va u yerdan tarkibni olishi mumkin, lekin buni qanday qilishni hamma ham bilmaydi.
````

## Xulosa

Sichqoncha hodisalari quyidagi xususiyatlarga ega:

- Tugma: `button`.
- Modifikator kalitlar (`true` agar bosilsa): `altKey`, `ctrlKey`, `shiftKey` va `metaKey` (Mac).
  - Agar siz `key:Ctrl` ni ishlatmoqchi bo'lsangiz, Mac foydalanuvchilarini unutmang, ular odatda `key:Cmd` dan foydalanadilar, shuning uchun `if (e.metaKey || e.ctrlKey)` ni tekshirgan ma'qul.

- Window-relative koordinatalar: `clientX/clientY`.
- Document-relative koordinatalar: `pageX/pageY`.

`mousedown` brauzerining standart harakati matn tanlashdir, agar u interfeys uchun mos bo'lmasa, uning oldini olish kerak.

Keyingi bobda biz ko'rsatgich harakatidan keyin sodir bo'ladigan hodisalar va uning ostidagi element o'zgarishlarini qanday kuzatish haqida batafsilroq ma'lumot beramiz.
