# Element hajmi va aylantirish (scrolling)

Element kengligi, balandligi va boshqa geometrik xususiyatlari haqidagi ma'lumotlarni o'qish imkonini beruvchi ko'plab JavaScript xususiyatlari mavjud.

Ular bizga ko'pincha JavaScriptda elementlarni ko'chirish yoki joylashtirishda kerak bo'ladi.

## Namunaviy element

Xususiyatlarni namoyish qilish uchun namunaviy element sifatida biz quyida keltirilgan elementdan foydalanamiz:

```html no-beautify
<div id="example">
  ...Text...
</div>
<style>
  #example {
    width: 300px;
    height: 200px;
    border: 25px solid #E8C48F;
    padding: 20px;
    overflow: auto;
  }
</style>
```
Unda chegara, to'ldirish va aylantirish mavjud va u to'liq xususiyatlar to'plami. Hech qanday chekka, ya'ni margin mavjud emas, chunki ular elementning o'zi emas va ular uchun maxsus xususiyatlar yo'q.

Element quyidagicha ko'rinishda bo'ladi:

![](metric-css.svg)

Hujjatni [berilgan havolada ochishingiz mumkin:](sandbox:metric). 

```smart header="O'tkazish paneli, ya'ni scrollbarga e'tibor bering"
Yuqoridagi rasmda elementda aylantirish paneli mavjud bo'lgan eng murakkab holat ko'rsatilgan. Ba'zi brauzerlar (barchasi emas) kontentdan (yuqorida "tarkib kengligi" deb belgilangan) olib, u uchun joy ajratadi.

Shunday qilib, aylantirish panelisiz kontent kengligi `300px` bo'lardi, agar aylantirish paneli kengligi `16px` bo'lsa (kengligi qurilmalar va brauzerlarda farq qilishi mumkin), u holda faqat `300 - 16 = 284px` qoladi va biz buni hisobga olishimiz kerak. Shuning uchun bu bobdagi misollarda aylantirish paneli bor deb taxmin qilinadi. Busiz, ba'zi hisob-kitoblar oddiyroq.
```

```smart header="`padding-bottom` maydoni matn bilan to'ldirilishi mumkin"`
Odatda illyustratsiyalarimizda to'ldirishlar bo'sh ko'rsatiladi, lekin elementda matn ko'p bo'lsa va u to'lib toshgan bo'lsa, brauzerlar `padding-bottom` qismida "overflowing" matnni ko'rsatadi, bu normal holat.
```

## Geometriya

Mana, geometriya xususiyatlariga ega umumiy rasm:

![](metric-all.svg)

Ushbu xususiyatlarning qiymatlari texnik jihatdan raqamlardir, ammo bu raqamlar "piksellar" dir, shuning uchun bu piksel o'lchovlari hisoblanadi.

Keling, elementning tashqi qismidan boshlab xususiyatlarni o'rganishni boshlaylik.

## offsetParent, offsetLeft/Top

Bu xususiyatlar kamdan-kam hollarda kerak, ammo baribir ular "eng tashqi" geometrik xususiyatlar, shuning uchun biz ulardan boshlaymiz.

`offsetParent` brauzer ko'rsatish paytida koordinatalarni hisoblash uchun foydalanadigan eng yaqin ajdoddir.

Bu eng yaqin ajdod, u quyidagilardan biri:

1. CSS-pozitsiyali (`position` esa `absolute`, `relative`, `fixed` yoki `sticky`), yoki
2. `<td>`, `<th>`, or `<table>`,  yoki
3. `<body>`.

`offsetLeft/offsetTop` xususiyatlari `offsetParent` yuqori chap burchagiga nisbatan x/y koordinatalarini beradi.

Quyidagi misolda ichki `<div>` `<main>` `offsetParent` va `offsetLeft/offsetTop` o`zining yuqori chap burchagidan (`180`) siljiydi:

```html run height=10
<main style="position: relative" id="main">
  <article>
    <div id="example" style="position: absolute; left: 180px; top: 180px">...</div>
  </article>
</main>
<script>
  alert(example.offsetParent.id); // main
  alert(example.offsetLeft); // 180 (note: a number, not a string "180px")
  alert(example.offsetTop); // 180
</script>
```

![](metric-offset-parent.svg)

 `offsetParent` `null` bo'lsa, bir nechta holatlar mavjud:

1. Ko'rsatilmagan elementlar uchun (`display:none` yoki hujjatda yo'q).
2. `<body>` va `<html>` uchun.
3. `position:fixed` bo'lgan elementlar uchun.

## offsetWidth/Height

Endi elementning o'ziga o'tamiz.

Bu ikki xususiyat eng oddiy hisoblanadi. Ular elementning "tashqi" kengligi/balandligini ta'minlaydi. Boshqacha qilib aytganda, uning to'liq o'lchami chegaralardir.

![](metric-offset-width-height.svg)

Bizning namunaviy elementimiz uchun:

- `offsetWidth = 390` -- tashqi kenglik ichki CSS-kengligi (`300px`) va to'ldirishlar (`2 * 20px`) va chegaralar (`2 * 25px`) sifatida hisoblanishi mumkin.
- `offsetHeight = 290` -- tashqi balandlik.

````smart header="Geometrik xususiyatlari ko'rsatilmagan elementlar uchun zero/null"
Faqatgina geometrik xususiyatlari ko'rsatilgan elementlar uchun hisoblanadi.

Agar elementda (yoki uning ajdodlaridan birida) `display:none` bo'lsa yoki hujjatda bo'lmasa, barcha geometriya xususiyatlari nolga teng (yoki `offsetParent` uchun `null`).

Masalan, biz element yaratganimizda `offsetParent` `null`, `offsetWidth`, `offsetHeight` esa `0` bo'ladi, lekin uni hali hujjatga kiritmaganmiz yoki u (yoki uning ajdodi) `display:none`.

Biz bundan element yashirin yoki yo'qligini tekshirish uchun foydalanishimiz mumkin, masalan:

```js
function isHidden(elem) {
  return !elem.offsetWidth && !elem.offsetHeight;
}
```
Esda tutingki, bunday `isHidden` ekrandagi, lekin nol o'lchamga ega bo'lgan elementlar uchun `true` qiymatini qaytaradi.
````

## clientTop/Left

Elementning ichida bizda chegaralar mavjud.

Ularni o'lchash uchun `clientTop` va `clientLeft` xususiyatlari mavjud.

Masalan:

- `clientLeft = 25` -- chap chegara kengligi
- `clientTop = 25` -- yuqori chegara kengligi

![](metric-client-left-top.svg)

...Ammo aniqrog'i, bu xususiyatlar chegara kengligi/balandligi emas, balki tashqi tomondan ichki tomonning nisbiy koordinatalaridir.

Farqi nima?

Hujjat o'ngdan chapga (operatsion tizim arab yoki ibroniy tillarida) bo'lganda ko'rinadi. O'tkazish paneli o'ngda emas, balki chap tomonda joylashadi, so'ngra `clientLeft` o'tish paneli kengligini ham o'z ichiga oladi. 

Bunday holda, `clientLeft` `25` emas, balki aylantirish paneli kengligi `25 + 16 = 41` bo'ladi.

Mana ibroniy tilida misol:

![](metric-client-left-top-rtl.svg)

## clientWidth/Height

Bu xususiyatlar element chegaralari ichidagi maydon hajmini ta'minlaydi.

Ular tarkib kengligini to'ldirish bilan birga o'z ichiga oladi, lekin aylantirish panelisiz ishlaydi:

![](metric-client-width-height.svg)

Yuqoridagi rasmda birinchi navbatda `clientHeight` ni ko'rib chiqamiz.

Gorizontal aylantirish paneli yo'q, shuning uchun bu chegaralar ichidagi narsalarning yig'indisi: CSS balandligi `200px` va yuqori va pastki to'ldirishlar (`2 * 20px`) jami `240px` bo'ladi.

Endi `clientWidth` -- bu yerda kontent kengligi `300px` emas, `284px`, chunki `16px` aylantirish panelida joylashgan. Shunday qilib, yig'indi `284px` va chap va o'ng to'ldirishlar, jami `324px`.

**Agar to'ldirishlar bo'lmasa, `clientWidth/Height` tarkib maydoni hisoblanadi, ichki qismida chegaralar va aylantirish paneli (agar mavjud bo'lsa) bo'ladi.**
![](metric-client-width-nopadding.svg)

Shunday qilib, to'ldirish bo'lmasa, kontent maydoni hajmini olish uchun `clientWidth/clientHeight` dan foydalanishimiz mumkin.

## scrollWidth/Height

Bu xususiyatlar `clientWidth/clientHeight` kabi, lekin ular tashqariga aylantirilgan (yashirin) qismlarni ham o'z ichiga oladi:

![](metric-scroll-width-height.svg)

Yuqoridagi rasmga diqqat qiling:

- `scrollHeight = 723` -- aylantirilgan qismlarni o'z ichiga olgan kontent maydonining to'liq ichki balandligi.
- `scrollWidth = 324` -- to'liq ichki kenglik, bu yerda bizda gorizontal aylantirish yo'q, shuning uchun u `clientWidth` ga teng.

Biz ushbu xususiyatlardan elementni to'liq kengligi/balandligigacha kengaytirish uchun foydalanishimiz mumkin.

Shunga o'xshash:

```js
// elementni to'liq kontent balandligiga kengaytiring
element.style.height = `${element.scrollHeight}px`;
```

```online
Elementni kengaytirish uchun tugmani bosing:

<div id="element" style="width:300px;height:200px; padding: 0;overflow: auto; border:1px solid black;">text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text</div>

<button style="padding:0" onclick="element.style.height = `${element.scrollHeight}px`">element.style.height = `${element.scrollHeight}px`</button>
```

## scrollLeft/scrollTop

`scrollLeft/scrollTop` xossalari elementning yashirin, aylantirilgan qismining kengligi/balandligidir.

Quyidagi rasmda vertikal aylantirishli blok uchun `scrollHeight` va `scrollTop` ni ko'rishimiz mumkin.

![](metric-scroll-top.svg)

Boshqacha qilib aytganda, `scrollTop` - "qancha yuqoriga aylantirilganini" bildiradi.

````smart header="`scrollLeft/scrollTop` o'zgartirilishi mumkin"
Bu yerda geometriya xususiyatlarining aksariyati faqat o'qish uchun mo'ljallangan, lekin `scrollLeft/scrollTop` o'zgartirilishi mumkin va brauzer elementni aylantiradi.

```online
Agar siz quyidagi elementni bossangiz, `elem.scrollTop += 10` kodi bajariladi. Bu element tarkibini "10px" pastga aylantiradi.

<div onclick="this.scrollTop+=10" style="cursor:pointer;border:1px solid black;width:100px;height:80px;overflow:auto">Click<br>Me<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9</div>
```

`scrollTop` ni `0` yoki `1e9` kabi katta qiymatga o'rnatish elementni mos ravishda eng yuqori/pastki tomonga aylantiradi.
````

## CSSdan kenglik/balandlikni olmang

Biz hozirgina kenglik, balandlik va masofalarni hisoblash uchun ishlatilishi mumkin bo'lgan DOM elementlarining geometriya xususiyatlarini ko'rib chiqdik.

Ammo <info:styles-and-classes> bobidan bilganimizdek, biz `getComputedStyle` yordamida CSS balandligi va kengligini o'qishimiz mumkin.

Xo'sh, nega `getComputedStyle` bilan elementning kengligini o'qimaslik kerak?

```js run
let elem = document.body;

alert( getComputedStyle(elem).width ); // element uchun CSS kengligini ko'rsatish
```

Buning o'rniga nima uchun geometriya xususiyatlarini ishlatishimiz kerak? Buning ikkita sababi bor:

1. Birinchidan, CSS `width/height` boshqa xususiyatga bog'liq: `box-sizing` bu CSS kengligi va balandligi "nima ekanligini" belgilaydi. CSS maqsadlari uchun `box-sizing` ni o'zgartirish bunday JavaScriptni buzishi mumkin.
2. Ikkinchidan, CSS `width/height` `auto` bo'lishi mumkin, masalan, inline element uchun:

    ```html run
    <span id="elem">Hello!</span>

    <script>
    *!*
      alert( getComputedStyle(elem).width ); // auto
    */!*
    </script>
    ```

    CSS nuqtai nazaridan, `width:auto` mutlaqo normaldir, ammo JavaScriptda biz hisob-kitoblarda foydalanishimiz mumkin bo'lgan `px`dagi aniq o'lchamga muhtojmiz. Shunday qilib, bu erda CSS kengligi foydasiz.

Va yana bir sabab bor: aylantirish paneli. Ba'zan aylantirish panelisiz yaxshi ishlaydigan kod u bilan xato qiladi, chunki aylantirish paneli ba'zi brauzerlarda kontentdan bo'sh joy oladi. Shunday qilib, kontent uchun mavjud bo'lgan haqiqiy kenglik CSS kengligidan *kamroq*. Va `clientWidth/clientHeight` buni hisobga oladi.

...Lekin `getComputedStyle(elem).width` bilan vaziyat boshqacha. Ba'zi brauzerlar (masalan, Chrome) haqiqiy ichki kenglikni qaytaradi, minus aylantirish paneli va ulardan ba'zilari (masalan, Firefox) -- CSS kengligi (aylantirish paneliga e'tibor bermang). Brauzerlar o'rtasidagi bunday farqlar `getComputedStyle` dan foydalanmaslik, aksincha geometriya xususiyatlariga tayanish uchun sababdir.

```online
Agar sizning brauzeringiz aylantirish paneli uchun bo'sh joy ajratsa (ko'pchilik Windows brauzerlari shunday qiladi), uni quyida sinab ko'rishingiz mumkin.

[iframe src="cssWidthScroll" link border=1]

Matnli elementda CSS `width:300px` mavjud.

Ish stolida Windows OS, Firefox, Chrome, Edge hammasi aylantirish paneli uchun joy ajratadi, ammo Firefox `300px` ko'rsatadi, Chrome va Edge esa kamroq. Buning sababi, Firefox CSS kengligini qaytaradi va boshqa brauzerlar "haqiqiy" kenglikni qaytaradi.
```
Shuni esda tutingki, ta'riflangan farq faqat JavaScriptdan `getComputedStyle(...).width` ni o'qish bilan bog'liq, vizual ravishda hamma narsa to'g'ri.

## Xulosa

Elementlar quyidagi geometrik xususiyatlarga ega:

- `offsetParent` -- eng yaqin joylashgan ajdoddir yoki `td`, `th`, `table`, `body`.
- `offsetLeft/offsetTop` -- `offsetParent`ning yuqori chap chetiga nisbatan koordinatalar.
- `offsetWidth/offsetHeight` -- Chegaralarni o'z ichiga olgan elementning "tashqi" kengligi/balandligi.
- `clientLeft/clientTop` -- yuqori chap tashqi burchakdan yuqori chap ichki (tarkib + to'ldirish) burchagigacha bo'lgan masofalar. Chapdan o'ngga OS uchun ular har doim chap/yuqori chegaralarning kengligidir. O'ngdan chapga OS uchun vertikal aylantirish paneli chapda, shuning uchun `clientLeft` uning kengligini ham o'z ichiga oladi.
- `clientWidth/clientHeight` -- tarkibning kengligi/balandligi, shu jumladan to'ldirishlar, lekin aylantirish panelisiz.
- `scrollWidth/scrollHeight` -- kontentning kengligi/balandligi, xuddi `clientWidth/clientHeight` kabi, balki elementning aylanib o'tilgan, ko'rinmas qismini ham o'z ichiga oladi.
- `scrollLeft/scrollTop` -- elementning yuqori chap burchagidan boshlab aylantirilgan yuqori qismining kengligi/balandligi.

Barcha xususiyatlar faqat o'qish uchun mo'ljallangan, `scrollLeft/scrollTop`dan tashqari, brauzer o'zgartirilsa, elementni aylantiradi.
