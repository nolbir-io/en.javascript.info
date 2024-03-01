libs:
  - d3
  - domtree

---

# Tanlov va range

Ushbu bobda biz hujjatdagi tanlovni, shuningdek, `<input>` kabi shakl maydonlarida tanlashni ko'rib chiqamiz.

JavaScript mavjud tanlovga kirishi, DOM tugunlarini to'liq yoki qisman tanlash/tanlovni bekor qilishi, tanlangan tarkibni hujjatdan olib tashlashi va uni tegga o'rashi mumkin.

Umumiy vazifalar uchun ba'zi retseptlarni bobning oxirida, "Xulosa" bo'limidan topishingiz mumkin. Ehtimol, bu sizning hozirgi ehtiyojlaringizni qoplaydi, lekin siz butun matnni o'qib chiqsangiz, ko'proq narsani o'rganasiz.

Asosiy `Range` va `Selection` obyektlarini tushunish oson va keyin ulardan o'zingiz xohlagan narsani qilish uchun hech qanday retsept kerak bo'lmaydi.

## Range

Tanlashning asosiy tushunchasi [Range](https://dom.spec.whatwg.org/#ranges), bu aslida bir juft "chegara nuqtalari": diapazon boshlanishi va oxiri hisoblanadi.

`Range` obyekti parametrlarsiz yaratiladi:

```js
let range = new Range();
```
Keyin `range.setStart(node, offset)` va `range.setEnd(node, offset)` yordamida tanlash chegaralarini belgilashimiz mumkin.

Siz taxmin qilganingizdek, bundan keyin biz tanlash uchun `Range` obyektlaridan foydalanamiz, lekin avval bir nechta bunday obyektlarni yaratishimiz lozim.

### Matnni qisman tanlash

Qizig'i shundaki, ikkala usulda ham birinchi argument `node` matnli tugun yoki element tugun bo'lishi mumkin va ikkinchi argumentning ma'nosi shunga bog'liq.

**Agar `node` matnli tugun bo'lsa, `offset` uning matnidagi pozitsiyasi bo'lishi kerak.**

Masalan, `<p>Hello</p>` elementini hisobga olsak, biz "ll" harflaridan iborat diapazonni quyidagicha yaratishimiz mumkin:

```html run
<p id="p">Hello</p>
<script>
  let range = new Range();
  range.setStart(p.firstChild, 2);
  range.setEnd(p.firstChild, 4);
  
  // ToString diapazoni uning mazmunini matn sifatida qaytaradi
  console.log(range); // ll
</script>
```
Bu yerda biz `<p>` ning birinchi bolasini olamiz (bu matn node hisoblanadi) va uning ichidagi matn joylarini belgilaymiz:

![](range-hello-1.svg)

### Element node tanlash

**Muqobil ravishda, agar `node` element node bo'lsa, `offset` kichik raqam bo'lishi kerak.**

Bu matn ichida biror joyda to'xtamasdan, butun tugunlarni o'z ichiga olgan diapazonlarni yaratish uchun qulay.

Masalan, bizda yanada murakkab hujjat bor:

```html autorun
<p id="p">Example: <i>italic</i> and <b>bold</b></p>
```
Quyida element va matn node lari bilan berilgan matn tuzilishiga e'tibor qarating:

<div class="select-p-domtree"></div>

<script>
let selectPDomtree = {
  "name": "P",
  "nodeType": 1,
  "children": [{
    "name": "#text",
    "nodeType": 3,
    "content": "Example: "
  }, {
    "name": "I",
    "nodeType": 1,
    "children": [{
      "name": "#text",
      "nodeType": 3,
      "content": "italic"
    }]
  }, {
    "name": "#text",
    "nodeType": 3,
    "content": " and "
  }, {
    "name": "B",
    "nodeType": 1,
    "children": [{
      "name": "#text",
      "nodeType": 3,
      "content": "bold"
    }]
  }]
}

drawHtmlTree(selectPDomtree, 'div.select-p-domtree', 690, 320);
</script>

Keling, `"Example: <i>italic</i>"` uchun ham range yaratamiz.

Ko'rib turganimizdek, bu ibora `<p>` ning aynan ikkita farzandidan iborat bo'lib, indekslari `0` va `1`:

![](range-example-p-0-1.svg)

- Boshlanish nuqtasida asosiy `node` sifatida `<p>` va offset sifatida `0` mavjud.

     Shunday qilib, biz uni `range.setStart(p, 0)` sifatida o'rnatishimiz mumkin.
- Yakuniy nuqtada asosiy `node` sifatida `<p>`, lekin offset sifatida `2` mavjud (u `offset` gacha bo'lgan diapazonni bildiradi, lekin shu jumladan emas).

     Shunday qilib, biz uni `range.setEnd(p, 2)` sifatida o'rnatishimiz mumkin.

Mana demo. Agar siz uni ishga tushirsangiz, matn tanlanganligini ko'rishingiz mumkin:

```html run
<p id="p">Example: <i>italic</i> and <b>bold</b></p>

<script>
*!*
  let range = new Range();

  range.setStart(p, 0);
  range.setEnd(p, 2);
*/!*

  // ToString diapazoni uning mazmunini teglarsiz matn sifatida qaytaradi
  console.log(range); // Example: italic

  // hujjat tanlash uchun ushbu range ni qo'llang (quyida tushuntiriladi)
  document.getSelection().addRange(range);
</script>
```
Bu yerda range ning boshlanish/tugash raqamlarini o'rnatishingiz va boshqa variantlarni o'rganishingiz mumkin bo'lgan yanada moslashuvchan test stendi berilgan:

```html run autorun
<p id="p">Example: <i>italic</i> and <b>bold</b></p>

From <input id="start" type="number" value=1> – To <input id="end" type="number" value=4>
<button id="button">Click to select</button>
<script>
  button.onclick = () => {
  *!*
    let range = new Range();

    range.setStart(p, start.value);
    range.setEnd(p, end.value);
  */!*

    // tanlovni qo'llang, bu keyinroq tushuntiriladi
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
  };
</script>
```
Masalan, bir xil `<p>` ichida `1` dan `4` gacha ofsetni tanlash bizga `<i>italic</i> va <b>bold</b>` diapazonini beradi:

![](range-example-p-1-3.svg)

```smart header="Boshlash va tugatish nodelari boshqacha bo'lishi mumkin"
Biz `setStart` va `setEnd` da bir xil nodeni ishlatishimiz shart emas. Diapazon bir-biriga bog'liq bo'lmagan ko'plab tugunlarni qamrab olishi mumkin. Hujjatning boshlanishidan keyin yakunlanishi muhim.
```

### Kattaroq fragmentni tanlash

Keling, misolimizda kattaroq tanlov qilaylik, masalan:

![](range-example-p-2-b-3.svg)

Biz buni qanday bajarishni allaqachon bilamiz. Biz faqat matn nodelarida nisbiy ofset sifatida boshlanishi va oxirini belgilashimiz kerak.

Biz diapazon yaratishimiz kerak:
- `<p>` birinchi bolada 2-pozitsiyadan boshlanadi ("Ex<b>ample:</b>" ning ikkita birinchi harfidan tashqari hammasini oladi)
- `<b>` birinchi bolada 3-pozitsiyada tugaydi («<b>bol</b>d» ning dastlabki uchta harfini oladi, lekin ortiq emas):

```html run
<p id="p">Example: <i>italic</i> and <b>bold</b></p>

<script>
  let range = new Range();

  range.setStart(p.firstChild, 2);
  range.setEnd(p.querySelector('b').firstChild, 3);

  console.log(range); // ample: italic va bol

  // ushbu rangeni tanlov uchun ishlating (keyinroq bu haqida tushuntiriladi)
  window.getSelection().addRange(range);
</script>
```
Ko'rib turganingizdek, biz xohlagan narsani qilish juda oson.

Agar biz tugunlarni bir butun sifatida qabul qilmoqchi bo'lsak, biz elementlarni `setStart/setEnd` da o'tkazishimiz mumkin. Aks holda, biz matn darajasida ishlayotgan bo'lamiz.

## Range xususiyatlari

Biz yuqorida yaratgan range obyekti quyidagi xususiyatlarga ega: 

![](range-example-p-2-b-3-range.svg)

- `startContainer`, `startOffset` -- boshlang'ich node va offset,
   - yuqoridagi misolda: `<p>` va `2` ichidagi birinchi matn nodelari.
- `endContainer`, `endOffset` -- oxirgi node vad offset,
  - yuqoridagi misolda: `<b>` va `3` ichidagi birinchi matn node.
- `collapsed` -- boolean, `true` agar diapazon bir nuqtada boshlansa va tugasa (shuning uchun diapazon ichida tarkib yo'q),
  - yuqoridagi misolda: `false`
- `commonAncestorContainer` -- diapazondagi barcha tugunlarning eng yaqin umumiy ajdodi,
  - yuqoridagi misolda: `<p>`


## Range tanlovi usullari

Diapazonlarni manipulyatsiya qilishning ko'plab qulay usullari mavjud.

Biz allaqachon `setStart` va `setEnd` ni ko'rganmiz, bu yerda boshqa shunga o'xshash usullar mavjud.

Boshlanish diapazonini belgilang:

- `setStart(node, offset)` - `node` da `offset` pozitsiyasida startni o'rnating
- `setStartBefore(node)` - `node`dan avval startni o'rnating
- `setStartAfter(node)` - `node`dan avval startni o'rnating

Range oxirini o'rnating (o'xshash usullar):

- `setEnd(node, offset)` - `node` da `offset` pozitsiyasida end ni o'rnating
- `setEndBefore(node)` - `node`dan avval end ni o'rnating
- `setEndAfter(node)` - `node` dan keyin end ni o'rnating

Texnik jihatdan `setStart/setEnd` hamma narsani qila oladi, lekin ko'proq usullar ko'proq qulaylik yaratadi.

Ushbu usullarning barchasida `node` ham matn, ham element node bo'lishi mumkin: matn nodelari uchun `offset` ko'p belgilarni o'tkazib yuboradi, element tugunlari uchun esa ko'p child nodelarini o'tkazadi.

Range yaratish uchun yanada ko'proq usullar:
- `selectNode(node)` - `node` ni tanlash uchun diapazonni o‘rnating
- `selectNodeContents(node)` - butun `node` tarkibini tanlash uchun diapazonni o'rnating
- `collapse(toStart)` agar `toStart=true` bo'lsa end=start, aks holda start=end ni o'rnating, shu bilan diapazonni qisqartiradi
- `cloneRange()` bir xil start/end bilan yangi diapazon yaratadi

## Diapazonni tahrirlash usullari

Diapazon yaratilgandan so'ng, biz quyidagi usullar yordamida uning mazmunini boshqarishimiz mumkin:

- `deleteContents()` -- hujjatdan diapazon tarkibini olib tashlang
- `extractContents()` -- Hujjatdan diapazon tarkibini olib tashlang va [DocumentFragment] sifatida qaytaring (ma'lumot: modifying-document#document-fragment)
- `cloneContents()` -- diapazon tarkibini klonlang va [DocumentFragment] sifatida qaytaring (ma'lumot: modifying-document#document-fragment)
- `insertNode(node)` -- diapazon boshidagi hujjatga `node` ni kiriting
- `surroundContents(node)` -- `node` ni diapazon tarkibiga o'rang. Buning ishlashi uchun diapazon ichidagi barcha elementlar uchun ochish va yopish teglarini o'z ichiga olishi kerak: `<i>abc` kabi qisman diapazonlar bo'lmasligi kerak.

Ushbu usullar yordamida biz tanlangan tugunlar bilan asosan hamma narsani qila olamiz.

Mana, ularni amalda ko'rish uchun sinov stendi:

```html run refresh autorun height=260
Tanlovda usullarni ishga tushirish uchun tugmalarni bosing, uni qayta o'rnatish uchun "resetExample".

<p id="p">Example: <i>italic</i> and <b>bold</b></p>

<p id="result"></p>
<script>
  let range = new Range();

  // Har bir ko'rsatilgan usul bu yerda ko'rsatilgan:
  let methods = {
    deleteContents() {
      range.deleteContents()
    },
    extractContents() {
      let content = range.extractContents();
      result.innerHTML = "";
      result.append("extracted: ", content);
    },
    cloneContents() {
      let content = range.cloneContents();
      result.innerHTML = "";
      result.append("cloned: ", content);
    },
    insertNode() {
      let newNode = document.createElement('u');
      newNode.innerHTML = "NEW NODE";
      range.insertNode(newNode);
    },
    surroundContents() {
      let newNode = document.createElement('u');
      try {
        range.surroundContents(newNode);
      } catch(e) { console.log(e) }
    },
    resetExample() {
      p.innerHTML = `Example: <i>italic</i> and <b>bold</b>`;
      result.innerHTML = "";

      range.setStart(p.firstChild, 2);
      range.setEnd(p.querySelector('b').firstChild, 3);

      window.getSelection().removeAllRanges();  
      window.getSelection().addRange(range);  
    }
  };

  for(let method in methods) {
    document.write(`<div><button onclick="methods.${method}()">${method}</button></div>`);
  }

  methods.resetExample();
</script>
```

Diapazonlarni solishtirish usullari ham mavjud, ammo ular kamdan-kam qo'llaniladi. Ular kerak bo'lganda, iltimos, [spec](https://dom.spec.whatwg.org/#interface-range) yoki [MDN manual](mdn:/api/Range) ga qarang.


## Tanlov

`Range` — tanlash diapazonlarini boshqarish uchun umumiy obyekt. Garchi, `Range` yaratish ekranida tanlovni ko'rishimizni anglatmaydi.

Biz `Range` obyektlarini yaratishimiz, ularni o'tkazishimiz mumkin – ular o'zlari vizual ravishda hech narsani tanlamaydilar.

Hujjat tanlovi `Selection` obyekti bilan ifodalanadi, uni `window.getSelection()` yoki `document.getSelection()` sifatida olish mumkin. Tanlov nol yoki undan ortiq diapazonlarni o'z ichiga oladi. Hech bo'lmaganda, [Selection API spetsifikatsiyasi](https://www.w3.org/TR/selection-api/) shunday deydi. Amalda faqat Firefox `key:Ctrl+click` (Mac uchun `key:Cmd+click`) yordamida hujjatdagi bir nechta diapazonlarni tanlashga imkon beradi.

Firefoxda yaratilgan 3 diapazonli tanlovning skrinshoti:

![](selection-firefox.svg)

Boshqa brauzerlar maksimal 1 diapazonda qo'llab-quvvatlaydi. Ko'rib turganimizdek, `Selection` usullarining ba'zilari ko'p diapazonlar bo'lishi mumkinligini anglatadi, ammo Firefoxdan tashqari barcha brauzerlarda maksimal 1 ta mavjud.

Mana joriy tanlovni (biror narsani tanlang va bosing) matn sifatida ko'rsatadigan kichik demo:

<button onclick="alert(document.getSelection())">alert(document.getSelection())</button>

## Tanlov xususiyatlari

Aytganimizdek, tanlov nazariy jihatdan bir nechta diapazonni o'z ichiga olishi mumkin. Ushbu diapazon ob'ektlarini quyidagi usul yordamida olishimiz mumkin:

- `getRangeAt(i)` -- `0` dan boshlab i-chi diapazonni oling. Firefoxdan tashqari barcha brauzerlarda faqat `0` ishlatiladi.

Bundan tashqari, ko'pincha qulaylikni ta'minlaydigan xususiyatlar mavjud.

Diapazonga o'xshab, tanlov obyekti "anchor" deb ataladigan boshiga va "focus" deb ataladigan oxiriga ega.

Asosiy tanlov xususiyatlari:

- `anchorNode` -- tanlov boshlanadigan joydagi node
- `anchorOffset` -- tanlov boshlanadigan `anchorNode` dagi ofset,
- `focusNode` -- tanlov tugaydigan node,
- `focusOffset` -- tanlov tugaydigan `focusNode` da ofset,
- `isCollapsed` -- agar tanlov hech narsani tanlamasa (bo'sh diapazon) yoki mavjud bo'lmasa, `false`.
- `rangeCount` -- tanlovdagi diapazonlar soni, Firefoxdan tashqari barcha brauzerlarda maksimal `1`.

```smart header="Tanlov tugashi/boshlanishi va diapazon"

`Range` boshlanishi/tugashi bilan solishtirganda anchor/fokus tanlashning muhim farqlari mavjud.

Ma'lumki, `Range` obyektlari har doim oxirigacha boshlanishiga ega.

Tanlovlar uchun har doim ham shunday emas.

Sichqoncha bilan biror narsani tanlash har ikki yo'nalishda ham amalga oshirilishi mumkin: "chapdan o'ngga" yoki "o'ngdan chapga".

Boshqacha qilib aytganda, sichqoncha tugmasi bosilgandan keyin u hujjatda oldinga siljiydi, so'ng uning oxiri (fokus) boshlanganidan (lanchor) keyin bo'ladi.

Masalan, foydalanuvchi sichqoncha bilan tanlashni boshlasa va "Misol" dan "kursiv" (italic) ga o'tsa:

![](selection-direction-forward.svg)

...Ammo xuddi shu tanlov orqaga qarab amalga oshirilishi mumkin edi: "kursiv" (italic) dan "Misol" (orqaga yo'nalish) ga tomon boshlab, keyin uning oxiri (fokus) boshlanishidan (lanchor) oldin bo'ladi:

![](selection-direction-backward.svg)
```

## Tanlov hodisalari

Tanlovni kuzatib borish uchun hodisalar mavjud:

- `elem.onselectstart` -- tanlov maxsus `elem` elementida (yoki uning ichida) *boshlanganda*. Masalan, foydalanuvchi sichqoncha tugmachasini bosganida va kursorni harakatlantira boshlaganda foydalaniladi.
    - Standart harakatning oldini olish tanlov boshlanishini bekor qiladi. Shunday qilib, ushbu elementdan tanlovni boshlash imkonsiz bo'ladi, lekin element hali ham tanlanishi mumkin. Visitor tanlashni boshqa joydan boshlashi kerak.
- `document.onselectionchange` -- tanlov o'zgarganda yoki boshlanganda foydalaniladi.
    - Iltimos, diqqat qiling: ushbu ishlov beruvchini faqat `document` ga o'rnatish mumkin, u undagi barcha tanlovlarni kuzatib boradi.

### Tanlovni kuzatish namunasi

Mana kichik demo. U `document` da joriy tanlovni kuzatib boradi va uning chegaralarini ko'rsatadi:

```html run height=80
<p id="p">Select me: <i>italic</i> and <b>bold</b></p>

From <input id="from" disabled> – To <input id="to" disabled>
<script>
  document.onselectionchange = function() {
    let selection = document.getSelection();

    let {anchorNode, anchorOffset, focusNode, focusOffset} = selection;

    // anchorNode va focusNode odatda matn node hisoblanadi
    from.value = `${anchorNode?.data}, offset ${anchorOffset}`;
    to.value = `${focusNode?.data}, offset ${focusOffset}`;
  };
</script>
```

### Tanlovni nusxalash namunasi

Tanlangan tarkibni nusxalashning ikkita usuli mavjud:

1. Uni matn sifatida olish uchun `document.getSelection().toString()` dan foydalanamiz.
2. Aks holda, to'liq DOMni nusxalash uchun, masalan, formatlashni davom ettirishimiz kerak bo'lsa, `getRangesAt(...)` yordamida asosiy diapazonlarni olishimiz mumkin. `Range` obyekti, o'z navbatida, `cloneContents()` usuliga ega bo'lib, uning mazmunini klonlaydi va `DocumentFragment` obyekti sifatida qaytaradi, biz uni boshqa joyga kiritishimiz mumkin.

Tanlangan tarkibni matn va DOM tugunlari sifatida nusxalash uchun namuna:

```html run height=100
<p id="p">Select me: <i>italic</i> and <b>bold</b></p>

Cloned: <span id="cloned"></span>
<br>
As text: <span id="astext"></span>

<script>
  document.onselectionchange = function() {
    let selection = document.getSelection();

    cloned.innerHTML = astext.innerHTML = "";

    // DOM tugunlarini diapazonlardan klonlash (biz bu yerda multiselectni qo‘llab-quvvatlaymiz)
    for (let i = 0; i < selection.rangeCount; i++) {
      cloned.append(selection.getRangeAt(i).cloneContents());
    }

    // Matn sifatida olish
    astext.innerHTML += selection;
  };
</script>
```

## Tanlov usullari

Biz diapazonlarni qo'shish/o'chirish orqali tanlov bilan ishlashimiz mumkin:

- `getRangeAt(i)` -- `0` dan boshlab i-chi diapazonni oling. Firefoxdan tashqari barcha brauzerlarda faqat `0` ishlatiladi.
- `addRange(range)` -- tanlovga `range` ni qo'shing. Firefoxdan tashqari barcha brauzerlar, agar tanlov allaqachon tegishli diapazonga ega bo'lsa, chaqiruvni e'tiborsiz qoldiradi.
- `removeRange(range)` -- tanlovdan `range` ni olib tashlaydi.
- `removeAllRanges()` -- hamma range ni olib tashlaydi.
- `empty()` -- `removeAllRanges` uchun taxallus.

Shuningdek, oraliq `Range` qo'ng'iroqlarisiz tanlash diapazonini to'g'ridan-to'g'ri boshqarishning qulay usullari mavjud:

- `collapse(node, offset)` -- tanlangan diapazonni berilgan `node` da, `offset` pozitsiyasida boshlanuvchi va tugaydigan yangisi bilan almashtirish.
- `setPosition(node, offset)` -- `collapse` uchun taxallus.
- `collapseToStart()` - tanlashni boshlash uchun yig'ish (bo'sh diapazon bilan almashtiring),
- `collapseToEnd()` - tanlov oxirigacha yig'ish,
- `extend(node, offset)` - tanlov markazini berilgan `node` ga, `offset` pozitsiyasiga ko'chirish,
- `setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset)` - tanlash diapazonini berilgan boshlanish `anchorNode/anchorOffset` va oxiri `focusNode/focusOffset` bilan almashtirish. Ularning orasidagi barcha tarkib tanlangan.
- `selectAllChildren(node)` -- `node` ning barcha bolalarini tanlash.
- `deleteFromDocument()` -- tanlangan tarkibni hujjatdan olib tashlash.
- `containsNode(node, allowPartialContainment = false)` -- tanlovda `node` mavjudligini tekshiradi (qisman ikkinchi argument `true` bo'lsa)

Aksariyat vazifalar uchun bu usullar juda yaxshi, asosiy `Range` obyektiga kirishning hojati yo'q.

Masalan, `<p>` paragrafining butun mazmunini tanlash:

```html run
<p id="p">Select me: <i>italic</i> and <b>bold</b></p>

<script>
  // <p> ning 0-chi bolasidan oxirgi bolasigacha tanlang
  document.getSelection().setBaseAndExtent(p, 0, p, p.childNodes.length);
</script>
```

Xuddi shu narsa diapazonlardan foydalanganda:

```html run
<p id="p">Select me: <i>italic</i> and <b>bold</b></p>

<script>
  let range = new Range();
  range.selectNodeContents(p); // yoki <p> tegini tanlash uchun Node(p) ni tanlang

  document.getSelection().removeAllRanges(); // agar bor bo'lsa, mavjud tanlovni tozalang
  document.getSelection().addRange(range);
</script>
```

```smart header="Biror narsani tanlash uchun avval mavjud tanlovni olib tashlang"
Hujjat tanlovi allaqachon mavjud bo'lsa, avval uni `removeAllRanges()` bilan bo'shating. Va keyin diapazonlarni qo'shing. Aks holda, Firefoxdan tashqari barcha brauzerlar yangi diapazonlarni e'tiborsiz qoldiradilar.

Istisno mavjud tanlov o'rnini bosuvchi ba'zi tanlash usullari ham bor, masalan, `setBaseAndExtent`.
```

## Shakl boshqaruvlarida tanlov

`Input` va `textarea` kabi shakl elementlari `Selection` yoki `Range` obyektlarisiz [tanlov uchun maxsus API](https://html.spec.whatwg.org/#textFieldSelection) beradi. Kirish qiymati HTML emas, sof matn bo'lgani uchun bunday obyektlarga ehtiyoj yo'q, hamma narsa ancha sodda.

Xususiyatlar:
- `input.selectionStart` -- tanlovning boshlanishi (yozilishi mumkin),
- `input.selectionEnd` -- tanlov oxiri (yozilishi mumkin),
- `input.selectionDirection` -- tanlov yo'nalishi, ulardan biri: "oldinga", "orqaga" yoki "yo'q" (masalan, sichqonchani ikki marta bosish bilan tanlangan bo'lsa),

Hodisalar:
- `input.onselect` -- nimadir tanlanganda ishlashni boshlaydi.

Usullar:

- `input.select()` -- matn boshqaruvidagi hamma narsani tanlaydi (`input` o'rniga `textarea` bo'lishi mumkin),
- `input.setSelectionRange(start, end, [direction])` -- tanlovni berilgan yo'nalish bo'yicha `start` dan `end` gacha oralig'iga o'zgartiring (ixtiyoriy).
- `input.setRangeText(replacement, [start], [end], [selectionMode])` -- bir qator matnni yangi matn bilan almashtiring.

    `start` va `end` argumentlari ixtiyoriy, agar taqdim etilgan bo'lsa, diapazonning boshlanishi va oxiri o'rnatiladi, aks holda foydalanuvchi tanlovi ishlatiladi.

    Oxirgi argument `selectionMode` matn almashtirilgandan so'ng tanlov qanday o'rnatilishini belgilaydi. Ehtimoliy qiymatlar:

    - `"select"` -- yangi kiritilgan matn tanlanadi.
    - `"start"` -- tanlov diapazoni kiritilgan matndan oldin qisqaradi (kursor darhol uning oldida bo'ladi).
    - `"end"` -- tanlov diapazoni kiritilgan matndan so'ng qisqaradi (kursor darhol undan keyin bo'ladi).
    - `"preserve"` -- tanlovni saqlab qolishga harakat qiladi. Bu standart.

Keling, ushbu usullarni amalda ko'rib chiqaylik.

### Namuna: tanlovni kuzatish

Masalan, ushbu kod tanlovni kuzatish uchun `onselect` hodisasidan foydalanadi:

```html run autorun
<textarea id="area" style="width:80%;height:60px">
Ushbu matnda tanlov quyidagi qiymatlarni yangilaydi.
</textarea>
<br>
<input id="from" disabled> dan – <input id="to" disabled> ga

<script>
  area.onselect = function() {
    from.value = area.selectionStart;
    to.value = area.selectionEnd;
  };
</script>
```

Iltimos, quyidagilarni yodda tuting:
- `onselect` - biror narsa tanlanganda ishga tushadi, lekin tanlov olib tashlanganda emas.
- `document.onselectionchange`- hodisa [spetsifikatsiya](https://w3c.github.io/selection-api/#dfn-selectionchange) ga ko'ra, shakl boshqaruvidagi tanlovlar uchun ishga tushmasligi kerak, chunki u `document` tanlovi va diapazonlari bilan bog'liq emas. Ba'zi brauzerlar uni yaratadi, lekin biz bunga ishonmasligimiz kerak.


### Namuna: harakatlanuvchi kursor

Biz tanlovni o'rnatadigan `selectionStart` va `selectionEnd` ni o'zgartirishimiz mumkin.

`selectionStart` va `selectionEnd` bir-biriga teng bo'lganda muhim chekka holat hisoblanadi. Keyin bu aynan kursor o'rni. Yoki boshqa so'z bilan aytganda, hech narsa tanlanmaganda, tanlov kursor joyida yopiladi.

Shunday qilib, `selectionStart` va `selectionEnd` ni bir xil qiymatga o'rnatib, kursorni siljitamiz.

Masalan:

```html run autorun
<textarea id="area" style="width:80%;height:60px">
Menga e'tibor qarating, kursor 10-pozitsiyada bo'ladi.
</textarea>

<script>
  area.onfocus = () => {
    // nol kechikish setTimeout brauzer "fokus" amali tugaganidan keyin ishga tushadi
    setTimeout(() => {
      // biz har qanday tanlovni o'rnatishimiz mumkin
      // start=end bo'lsa, kursor aynan o'sha joyda
      area.selectionStart = area.selectionEnd = 10;
    });
  };
</script>
```

### Namuna: tanlovni o'zgartirish

Tanlov mazmunini o'zgartirish uchun biz `input.setRangeText()` usulidan foydalanishimiz mumkin. Albatta, biz `selectionStart/End` ni o'qiymiz va tanlovni bilgan holda `value` ning tegishli pastki qatorini o'zgartirishimiz mumkin, lekin `setRangeText` kuchliroq va ko'pincha qulayroqdir.

Bu biroz murakkab usul. Eng oddiy bitta argumentli shaklda u foydalanuvchi tanlagan diapazonni almashtiradi va tanlovni olib tashlaydi.

Masalan, bu yerda foydalanuvchi tanlovi `*...*` bilan o'raladi:

```html run autorun
<input id="input" style="width:200px" value="Bu yerni tanlang va tugmani bosing">
<button id="button">Tanlovni yulduzcha bilan oʻrash *...*</button>

<script>
button.onclick = () => {
  if (input.selectionStart == input.selectionEnd) {
    return; // hech narsa tanlanmagan
  }

  let selected = input.value.slice(input.selectionStart, input.selectionEnd);
  input.setRangeText(`*${selected}*`);
};
</script>
```

Ko'proq argumentlar bilan biz `start` va `end` oralig'ini o'rnatishimiz mumkin.

Ushbu misoldagi kiritilgan matnda `"THIS"` ni topamiz, uni almashtiramiz va o'zgartirishni tanlangan holda qoldiramiz:

```html run autorun
<input id="input" style="width:200px" value="Replace THIS in text">
<button id="button">THIS ni almashtiring</button>

<script>
button.onclick = () => {
  let pos = input.value.indexOf("THIS");
  if (pos >= 0) {
    input.setRangeText("*THIS*", pos, pos + 4, "select");
    input.focus(); // tanlovni ko'rinadigan qilish uchun e'tibor qarating
  }
};
</script>
```

### Namuna: kursorga kiriting

Agar hech narsa tanlanmagan bo'lsa yoki biz `setRangeText` da `start` va `end` dan foydalansak, u holda yangi matn qo'shiladi, hech narsa olib tashlanmaydi.

Shuningdek, biz `setRangeText` yordamida "kursorga" biror narsa kiritishimiz mumkin.

Mana, kursor o'rniga `"HELLO"` deb yozadigan va kursorni darhol uning orqasiga qo'yadigan tugma. Agar tanlov bo'sh bo'lmasa, u almashtiriladi (biz uni `selectionStart!=selectionEnd` solishtirish orqali aniqlashimiz va buning o'rniga boshqa biror narsa qilishimiz mumkin):

```html run autorun
<input id="input" style="width:200px" value="Text Text Text Text Text">
<button id="button">Insert "HELLO" at cursor</button>

<script>
  button.onclick = () => {
    input.setRangeText("HELLO", input.selectionStart, input.selectionEnd, "end");
    input.focus();
  };    
</script>
```


## Tanlab bo'lmaydigan qilish (unselectable qilish)

Biror narsani tanlab bo'lmaydigan qilish uchun uchta usul mavjud:

1. `user-select: none` CSS xususiyatidan foydalaning.

    ```html run
    <style>
    #elem {
      user-select: none;
    }
    </style>
    <div>Selectable <div id="elem">Unselectable</div> Selectable</div>
    ```

     Bu tanlovni `elem` da boshlashga ruxsat bermaydi. Lekin foydalanuvchi tanlovni boshqa joyda boshlashi va unga `elem` ni kiritishi mumkin.

     Keyin `elem` `document.getSelection()` ning bir qismiga aylanadi, shuning uchun tanlov haqiqatda sodir bo'ladi, lekin nusxa ko'chirishda odatda uning mazmuni e'tiborga olinmaydi.


2. `onselectstart` yoki `mousedown` hodisalarida standart amalni oldini oling.

    ```html run
    <div>Selectable <div id="elem">Unselectable</div> Selectable</div>

    <script>
      elem.onselectstart = () => false;
    </script>
    ```

     Bu `elem` da tanlovni boshlashga to'sqinlik qiladi, lekin tashrif buyuruvchi uni boshqa elementda boshlashi, so'ng `elem` ga cho'zilishi mumkin.

     Tanlovni ishga tushiradigan xuddi shu amalda boshqa hodisa ishlov beruvchisi mavjud bo'lsa, anchagina qulay bo'ladi (masalan, `mousedown`). Shunday qilib, biz ziddiyatni oldini olish uchun tanlovni o'chirib qo'yamiz, shu bilan birga `elem` tarkibidan nusxa ko'chirishga ruxsat beramiz.

3. Shuningdek, biz `document.getSelection().empty()` bilan sodir bo'lgandan so'ng tanlovdan keyingi faktumni tozalashimiz mumkin. Bu kamdan-kam hollarda qo'llaniladi, chunki bu tanlov paydo bo'lganda yoki yo'qolib qolganda istalmagan nosozliklarga olib keladi.

## Havolalar

- [DOM spec: Range](https://dom.spec.whatwg.org/#ranges)
- [Selection API](https://www.w3.org/TR/selection-api/#dom-globaleventhandlers-onselectstart)
- [HTML spec: APIs for the text control selections](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#textFieldSelection)


## Xulosa

Biz tanlovlar uchun ikki xil APIni ko'rib chiqdik:

1. Hujjat uchun: `Selection` va `Range` obyektlari.
2. `Input`, `textarea` uchun: qo'shimcha usullar va xususiyatlar.

Ikkinchi API juda oddiy, chunki u matn bilan ishlaydi.

Eng ko'p ishlatiladigan retseptlar:

1. Tanlovni olish:
    ```js
    let selection = document.getSelection();

    let cloned =  /* tanlangan tugunlarni */ga klonlash uchun element;

    // keyin select.getRangeAt(0) uchun Range usullarini qo'llang
    // yoki, bu yerda bo'lgani kabi, ko'p tanlovni qo'llab-quvvatlash uchun barcha diapazonlarga qo'llang
    for (let i = 0; i < selection.rangeCount; i++) {
      cloned.append(selection.getRangeAt(i).cloneContents());
    }
    ```
2. Tanlovni sozlash:
    ```js
    let selection = document.getSelection();

    // to'g'ridan-to'g'ri:
    selection.setBaseAndExtent(...from...to...);

    // yoki biz diapazon yaratishimiz mumkin va:
    selection.removeAllRanges();
    selection.addRange(range);
    ```

Va nihoyat, kursor haqida. Kursorning tahrir qilinadigan elementlardagi joylashuvi, masalan, `<textarea>` har doim tanlov boshida yoki oxirida bo'ladi. Biz undan kursor o'rnini olish yoki `elem.selectionStart` va `elem.selectionEnd` sozlash orqali kursorni siljitish uchun foydalanishimiz mumkin.
