
# Mutatsiya kuzatuvchisi

`MutationObserver` o'rnatilgan obyekt bo'lib, u DOM elementini kuzatadi va o'zgarishlarni aniqlaganida qayta qo'ng'iroqni amalga oshiradi.

Biz avval sintaksisni ko'rib chiqamiz, so'ngra bunday narsa qayerda foydali bo'lishi mumkinligini ko'rish uchun real foydalanish holatini o'rganamiz.

## Sintaksis

`MutationObserver` dan foydalanish oson.

Birinchidan, biz qayta qo'ng'iroq qilish funksiyasi bilan kuzatuvchi yaratamiz:

```js
let observer = new MutationObserver(callback);
```

Va keyin uni DOM node ga biriktiring:

```js
observer.observe(node, config);
```
`config` - bu "qanday turdagi o'zgarishlarga munosabat bildirish kerak" degan mantiqiy parametrlarga ega obyekt:
- `childList` -- `node` ning bevosita bolalaridagi o'zgarishlar,
- `subtree` -- `node` ning barcha avlodlarida,
- `atributlar` -- `node` atribyutlari,
- `attributeFilter` -- faqat tanlanganlarini kuzatish uchun atribyut nomlari massivi.
- `characterData` -- `node.data` (matn mazmuni) kuzatilishi kerakmi,

Bir nechta boshqa variantlar:
- `attributeOldValue` -- agar `true` bo'lsa, atributning eski va yangi qiymatini qayta qo'ng'iroqqa o'tkazing (pastga qarang), aks holda faqat yangisini (`attributes` varianti kerak),
- `characterDataOldValue` -- agar `true` bo'lsa, qayta qo'ng'iroq qilish uchun `node.data` ning ham eski, ham yangi qiymatini o'tkazing (pastga qarang), aks holda faqat yangisini o'tkazing, (`characterData` parametri kerak).

Keyin har qanday o'zgarishlardan so'ng `callback` amalga oshiriladi: o'zgarishlar birinchi argumentda [MutationRecord](https://dom.spec.whatwg.org/#mutationrecord) obyektlar ro'yxati sifatida va kuzatuvchining o'zi ikkinchi dalil sifatida uzatiladi.

[MutationRecord](https://dom.spec.whatwg.org/#mutationrecord) obyektlari quyidagi xususiyatlarga ega:

- `tip` -- mutatsiya turlaridan biri
     - `"attributes"`: atribut o'zgartirildi
     - `"characterData"`: o'zgartirilgan ma'lumotlar, matn tugunlari uchun ishlatiladi,
     - `"childList"`: qo'shilgan/o'chirilgan yordamchi elementlar,
- `target` -- o'zgarish sodir bo'lgan joy: `"attributes"` uchun element yoki `"characterData"` uchun matnli tugun yoki `"childList"` mutatsiyasi uchun element,
- `addedNodes/removedNodes` -- qo'shilgan/o'chirilgan tugunlar,
- `previousSibling/nextSibling` -- qo'shilgan/o'chirilgan tugunlarning oldingi va keyingi birodarlari,
- `attributeName/attributeNamespace` -- o'zgartirilgan atributning nomi/nom maydoni (XML uchun),
- `oldValue` -- oldingi qiymat, faqat atribut yoki matn o'zgarishlari uchun, agar mos variant `attributeOldValue`/`characterDataOldValue` o'rnatilgan bo'lsa.

Masalan, bu yerda `contentEditable` atributiga ega `<div>`. Bu atribyut bizga diqqatni unga qaratish va tahrir qilish imkonini beradi.

```html run
<div contentEditable id="elem">Click and <b>edit</b>, please</div>

<script>
let observer = new MutationObserver(mutationRecords => {
  console.log(mutationRecords); // console.log(o'zgartirishlar)
});

// atribyutlardan tashqari hamma narsani kuzating
observer.observe(elem, {
  childList: true, // bevosita bolalarni kuzating
  subtree: true, // va quyi avlodlarni ham
  characterDataOldValue: true // qayta qo'ng'iroq qilish uchun eski ma'lumotlarni uzating
});
</script>
```
Agar biz ushbu kodni brauzerda ishga tushirsak, u holda berilgan `<div>`ga e'tibor qarating va `<b>tahrir</b>` ichidagi matnni o'zgartiring, `console.log` bitta mutatsiyani ko'rsatadi:

```js
mutationRecords = [{
  type: "characterData",
  oldValue: "edit",
  target: <text node>,
  // boshqa xususiyatlar bo'sh
}];
```
Agar biz yanada murakkab tahrirlash operatsiyalarini amalga oshirsak, masalan. `<b>edit</b>` ni olib tashlang, mutatsiya hodisasi bir nechta mutatsiya yozuvlarini o'z ichiga olishi mumkin:

```js
mutationRecords = [{
  type: "childList",
  target: <div#elem>,
  removedNodes: [<b>],
  nextSibling: <text node>,
  previousSibling: <text node>
  // boshqa xususiyatlar bo'sh
}, {
  type: "characterData"
  target: <text node>
   // ...mutatsiya tafsilotlari brauzer bunday olib tashlashni qanday boshqarishiga bog'liq
   // u ikkita qo'shni matnli "edit" va "please" tugunlarini bitta tugunga birlashtirishi mumkin
   // yoki ular alohida matn tugunlarini qoldiradi
}];
```

Demak, `MutationObserver` DOM pastki daraxtidagi har qanday o'zgarishlarga munosabat bildirish imkonini beradi.

## Integratsiya uchun foydalanish

Bunday narsa qachon foydali bo'lishi mumkin?

Vaziyatni tasavvur qiling-a, siz foydali funksiyalarni o'z ichiga olgan uchinchi tomon skriptini qo'shishingiz kerak, lekin ayni paytda u keraksiz narsalarni bajaradi, masalan, reklamalarni ko'rsatadi `<div class="ads">Keruvchi reklamalar</div>`.

Tabiiyki, uchinchi tomon skriptida uni olib tashlash uchun hech qanday mexanizm mavjud emas.

`MutationObserver` yordamida biz DOMda keraksiz element qachon paydo bo'lishini aniqlashimiz va uni olib tashlashimiz mumkin.

Boshqa holatlar ham borki, uchinchi tomon skripti hujjatimizga biror narsa qo'shsa va biz bu sodir bo'lganda sahifamizni moslashtirishni, biror narsaning hajmini dinamik ravishda o'zgartirishni va hokazolarni aniqlashni xohlaymiz.

`MutationObserver` buni amalga oshirishga imkon beradi.

## Arxitektura uchun foydalanish

`MutationObserver` arxitektura nuqtai nazaridan yaxshi bo'lgan holatlar ham mavjud.

Aytaylik, biz dasturlash haqida veb-sayt yaratyapmiz. Tabiiyki, maqolalar va boshqa materiallar manba kodi parchalarini o'z ichiga olishi mumkin.

HTML belgilashdagi bunday parcha quyidagicha ko'rinadi:

```html
...
<pre class="language-javascript"><code>
  // here's the code
  let hello = "world";
</code></pre>
...
```
Yaxshiroq o'qilishi va shu bilan birga uni chiroyli qilish uchun biz saytimizda JavaScript sintaksisini ajratib ko'rsatish kutubxonasidan foydalanamiz, masalan, [Prism.js](https://prismjs.com/). Prizmada yuqoridagi parcha uchun sintaksik ta'kidlashni olish uchun `Prism.highlightElem(pre)` chaqiriladi, u bunday `pre` elementlarning mazmunini tekshiradi va siz ko'rgan narsaga o'xshash ushbu elementlarga rangli sintaksisni ajratib ko'rsatish uchun maxsus teglar va uslublar qo'shadi, ular sahifada berilgan misollarga o'xshash.

Ushbu ta'kidlash usulini qachon ishlatishimiz kerak? Xo'sh, biz buni DOMContentLoaded hodisasida qilishimiz yoki skriptni sahifaning pastki qismiga qo'yishimiz mumkin. Bizning DOM tayyor bo'lganda, biz `pre[class*="language"]` elementlarni qidirishimiz va ularda `Prism.highlightElem` ni chaqirishimiz mumkin:

```js
// sahifadagi barcha kod parchalarini ajratib ko'rsating
document.querySelectorAll('pre[class*="language"]').forEach(Prism.highlightElem);
```
Hozircha hamma narsa oddiy, to'g'rimi? Biz HTML-da kod parchalarini topamiz va ularni ajratib ko'rsatamiz.

Endi davom etaylik. Aytaylik, biz serverdan materiallarni dinamik ravishda olmoqchimiz. Buning usullarini [keyinroq qo'llanmada] o'rganamiz (info:fetch). Hozircha faqat HTML maqolasini veb-serverdan olishimiz va uni talab bo'yicha ko'rsatishimiz muhim:

```js
let article = /* serverdan yangi tarkibni oling */
articleElem.innerHTML = article;
```
Yangi `article` HTML kod parchalarini o'z ichiga olishi mumkin. Biz ularga `Prism.highlightElem` ni chaqirishimiz kerak, aks holda ular ajratib ko'rsatilmaydi.

**Dinamik yuklangan maqola uchun "Prism.highlightElem" ni qayerda va qachon chaqirish kerak?**

Biz ushbu qo'ng'iroqni maqolani yuklaydigan kodga qo'shishimiz mumkin, masalan:

```js
let article = /* serverdan yangi tarkibni olish */
articleElem.innerHTML = article;

*!*
let snippets = articleElem.querySelectorAll('pre[class*="language-"]');
snippets.forEach(Prism.highlightElem);
*/!*
```
...Ammo, tasavvur qiling-a, biz kodda kontentimizni yuklaydigan ko'plab joylar – maqolalar, viktorinalar, forum postlari va boshqalar bo'lsa. Yuklagandan so'ng kontentdagi kodni ajratib ko'rsatish uchun ta'kidlash chaqiruvini hamma joyda qo'yishimiz kerakmi? Bu qulay emas.

Va agar kontent uchinchi tomon moduli tomonidan yuklangan bo'lsa-chi? Misol uchun, bizda boshqa birov tomonidan yozilgan, kontentni dinamik ravishda yuklaydigan forumimiz bor va biz unga sintaksisni ajratib ko'rsatishni qo'shmoqchimiz. Hech kim uchinchi tomon skriptlarini tuzatishni yoqtirmaydi.

Yaxshiyamki, boshqa variant ham bor.

Kod parchalari sahifaga qachon kiritilganligini avtomatik aniqlash va ularni ajratib ko'rsatish uchun `MutationObserver` dan foydalanishimiz mumkin.

Shunday qilib, biz ta'kidlash funksiyasini bir joyda boshqarib, uni birlashtirish zaruratidan xalos qilamiz.

### Dinamik ta'kidlash demosi

Mana ish misoli.

Agar siz ushbu kodni ishga tushirsangiz, u quyidagi elementni kuzatishni va u yerda paydo bo'ladigan har qanday kod parchalarini ajratib ko'rsatishni boshlaydi:

```js run
let observer = new MutationObserver(mutations => {

  for(let mutation of mutations) {
    // yangi tugunlarni ko'rib chiqing, ta'kidlash uchun biror narsa bormi?

    for(let node of mutation.addedNodes) {
      // biz faqat elementlarni kuzatamiz, boshqa node larni o'tkazib yuboramiz (masalan, matn node lari)
      if (!(node instanceof HTMLElement)) continue;

      // kiritilgan elementni kod parchasi ekanligini tekshiring
      if (node.matches('pre[class*="language-"]')) {
        Prism.highlightElement(node);
      }

      // yoki ehtimol uning pastki daraxtida kod parchasi bormi?
      for(let elem of node.querySelectorAll('pre[class*="language-"]')) {
        Prism.highlightElement(elem);
      }
    }
  }

});

let demoElem = document.getElementById('highlight-demo');

observer.observe(demoElem, {childList: true, subtree: true});
```
Quyida, HTML-element va JavaScript mavjud bo'lib, uni `innerHTML` yordamida dinamik ravishda to'ldiradi.

Iltimos, oldingi kodni (yuqorida, ushbu elementni kuzatadi) va keyin quyidagi kodni ishga tushiring. Siz `MutationObserver` parchani qanday aniqlashini va ajratib ko'rsatishini ko'rasiz.

<p id="highlight-demo" style="border: 1px solid #ddd">A demo-element with <code>id="highlight-demo"</code>, run the code above to observe it.</p>

Quyidagi kod o'zining `innerHTML` ini to'ldiradi, bu esa `MutationObserver` ning reaksiyaga kirishishiga va uning mazmunini ajratib ko'rsatishiga olib keladi:

```js run
let demoElem = document.getElementById('highlight-demo');

// kod parchalari bilan tarkibni dinamik ravishda kiritish
demoElem.innerHTML = `A code snippet is below:
  <pre class="language-javascript"><code> let hello = "world!"; </code></pre>
  <div>Another one:</div>
  <div>
    <pre class="language-css"><code>.class { margin: 5px; } </code></pre>
  </div>
`;
```
Endi bizda `MutationObserver` mavjud bo'lib, u kuzatilgan elementlardagi yoki butun `document` dagi barcha highlight ni kuzatishi mumkin. Biz HTMLga kod parchalarini o'ylamasdan qo'shishimiz/o'chirishimiz mumkin.

## Qo'shimcha usullar

Node ni kuzatishni to'xtatishning bir usuli bor:

- `observer.disconnect()` -- kuzatishni to'xtatadi.

Kuzatishni to'xtatganimizda, ba'zi o'zgarishlar hali kuzatuvchi tomonidan qayta ishlanmagan bo'lishi mumkin. Bunday hollarda biz ushbu usuldan foydalanamiz.

- `observer.takeRecords()` -- qayta ishlanmagan mutatsiya yozuvlari ro'yxatini oladi - sodir bo'lgan, lekin qayta qo'ng'iroq ularni ko'rib chiqmadi.

Ushbu usullar birgalikda ishlatilishi mumkin, masalan:

```js
// qayta ishlanmagan mutatsiyalar ro'yxatini oling
// uzilishdan oldin chaqirilishi kerak,
// agar siz so'nggi ishlov berilmagan mutatsiyalar haqida qayg'ursangiz
let mutationRecords = observer.takeRecords();

// o'zgarishlarni kuzatishni to'xtating
observer.disconnect();
...
```


```smart header="`observer.takeRecords()` tomonidan qaytarilgan yozuvlar ishlov berish navbatdan olib tashlanadi`"
Qayta qo'ng'iroq `observer.takeRecords()` tomonidan qaytarilgan yozuvlar uchun chaqirilmaydi.
```

```smart header="Garbage collection ning o'zaro ta'siri"
Kuzatuvchilar ichki tugunlarga zaif havolalardan foydalanadilar. Agar tugun DOMdan olib tashlansa va unga yetib bo'lmaydigan bo'lib qolsa, u axlat yig'ish mumkin.

DOM tugunining kuzatilishining o'zi axlat yig'ishga to'sqinlik qilmaydi.
```

## Xulosa  

`MutationObserver` DOMdagi o'zgarishlarga - atribyutlarga, matn tarkibiga va elementlarni qo'shish/o'chirishga javob berishi mumkin.

Biz undan kodimizning boshqa qismlari tomonidan kiritilgan o'zgarishlarni kuzatish, shuningdek, uchinchi tomon skriptlari bilan integratsiya qilish uchun foydalanishimiz mumkin.

`MutationObserver` har qanday o'zgarishlarni kuzatishi mumkin. "Nimani kuzatish kerak" konfiguratsiyasi parametrlari resurslarni keraksiz qayta qo'ng'iroqlarga sarflash uchun emas, balki optimallashtirish uchun ishlatiladi.