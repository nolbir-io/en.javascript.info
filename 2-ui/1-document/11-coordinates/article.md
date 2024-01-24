# Koordinatalar

Elementlarni harakatlantirish uchun biz koordinatalar haqida bilishimiz kerak.

Ko'pgina JavaScript usullari ikkita koordinatali tizimdan biri bilan ishlaydi:

1. **Relative to the window** - `position:fixed` ga o'xshash, oynaning yuqori/chap chetidan hisoblangan.
     - biz bu koordinatalarni `clientX/clientY` deb belgilaymiz, bunday nomning sababi voqea xususiyatlarini o'rganganimizda keyinroq aniq bo'ladi.
2. **Relative to the document** - hujjat ildizidagi `position:absolute` ga o'xshash, hujjatning yuqori/chap chetidan hisoblangan.
     - biz ularni `pageX/pageY` deb belgilaymiz.

Oynaning yuqori/chap burchagi hujjatning yuqori/chap burchagi bo'lishi uchun sahifa eng boshiga aylantirilsa, bu koordinatalar bir-biriga teng bo'ladi. Lekin hujjat siljishidan so'ng elementlarning oynaga nisbatan koordinatalari o'zgaradi, chunki elementlar oyna bo'ylab harakatlanadi, hujjatga nisbatan esa o'zgarishsiz qoladi.

Ushbu rasmda biz hujjatdagi nuqtani olamiz va uning koordinatalarini aylantirishdan oldin (chapda) va undan keyin (o'ngda) ko'rsatamiz:

![](document-and-window-coordinates-scrolled.svg)

Hujjat aylantirilganda:
- `pageY` - hujjatning nisbiy koordinatasi o'zgarishsiz qoldi, u hujjatning yuqori qismidan sanaladi (endi o'chirildi).
- `clientY` - oynaning nisbiy koordinatasi o'zgardi (arrow qisqardi), chunki xuddi shu nuqta deraza tepasiga yaqinlashdi.

## Element koordinatalari: getBoundingClientRect

`elem.getBoundingClientRect()` usuli `elem`ni o'rnatilgan [DOMRect](https://www.w3.org/TR/geometry-1/#domrect) sinfining obyekti sifatida qamrab olgan minimal to'rtburchak uchun oyna koordinatalarini qaytaradi.

Asosiy `DOMRect` xususiyatlari:

- `x/y` -- oynaga nisbatan to'rtburchaklar kelib chiqishining X/Y koordinatalari,
- `width/height` -- to'rtburchakning kengligi/balandligi (salbiy bo'lishi mumkin).

Bundan tashqari, olingan xususiyatlar mavjud:

- `top/bottom` -- Yuqori/pastki to'rtburchaklar qirrasi uchun Y-koordinata,
- `left/right` -- Chap/o'ng to'rtburchaklar qirrasi uchun X-koordinata.

```online
Masalan, oyna koordinatalarini ko'rish uchun ushbu tugmani bosing:

<p><input id="brTest" type="button" value="Get coordinates using button.getBoundingClientRect() for this button" onclick='showRect(this)'/></p>

<script>
function showRect(elem) {
  let r = elem.getBoundingClientRect();
  alert(`x:${r.x}
y:${r.y}
width:${r.width}
height:${r.height}
top:${r.top}
bottom:${r.bottom}
left:${r.left}
right:${r.right}
`);
}
</script>

Agar siz sahifani aylantirsangiz va takrorlasangiz, oynaga nisbatan tugma o'rni o'zgarganda uning oyna koordinatalari (agar vertikal aylantirsangiz `y/top/bottom`) ham o'zgarishini sezasiz.
```

Mana `elem.getBoundingClientRect()` ning rasmi:

![](coordinates.svg)

Ko'rib turganingizdek, `x/y` va `width/height` to'rtburchakni to'liq tavsiflaydi. Ulardan olingan xususiyatlarni osongina hisoblash mumkin:

- `left = x`
- `top = y`
- `right = x + width`
- `bottom = y + height`

Iltimos, quyidagilarni yozib oling:

- Koordinatalar o'nli kasrlar bo'lishi mumkin, masalan, `10,5`. Bu normal holat, ichki brauzer hisob-kitoblarda kasrlardan foydalanadi. `style.left/top` ga o'rnatilganda ularni yaxlitlash shart emas.
- Koordinatalar salbiy bo'lishi mumkin. Misol uchun, sahifa `elem` hozir oynaning tepasida bo'ladigan tarzda aylantirilsa, `elem.getBoundingClientRect().top` salbiy hisoblanadi.

```smart header="Nega olingan xususiyatlar kerak? Nima uchun `x/y` bo'lsa, `top/left` mavjud?"
Matematik jihatdan, to'rtburchak o'zining boshlang'ich nuqtasi `(x,y)` va yo'nalish vektori `(width, height)` bilan yagona aniqlanadi. Shunday qilib, qo'shimcha olingan xususiyatlardan qulaylik uchun foydalaniladi.

Texnik jihatdan `width/height` manfiy bo'lishi mumkin, bu "yo'naltirilgan" to'rtburchakka imkon beradi, masalan, to'g'ri belgilangan boshlanish va oxiri bilan sichqonchani tanlashni ko'rsatish.

Salbiy `width/height` qiymatlari to'rtburchakning pastki o'ng burchagidan boshlanib, keyin chapdan yuqoriga "o'sib borishini" bildiradi.

Here's a rectangle with negative `width` and `height` (e.g. `width=-200`, `height=-100`):
Mana salbiy `width` va `height` ga ega to'rtburchak (masalan, `width=-200`, `height=-100`):

![](coordinates-negative.svg)

Ko'rib turganingizdek, bunday holatda `left/top` `x/y` ga teng emas.

Amalda, `elem.getBoundingClientRect()` har doim ijobiy kenglik/balandlikni qaytaradi, bu yerda biz faqat salbiy `width/height` ni nima uchun takrorlanayotgan bu xususiyatlar aslida dublikat emasligini tushunishingiz uchun eslatib o'tamiz.
```

```warn header="Internet Explorer: `x/y` qo'llab-quvvatlanmaydi"
Tarixiy sabablar tufayli internet explorer `x/y` xususiyatlarini qo'llab-quvatlamaydi.

Shunday qilib, biz polyfill yasashimiz mumkin (`DomRect.prototype` da oluvchilarni qo'shish) yoki shunchaki `top/left` dan foydalanishimiz mumkin, chunki ular har doim ijobiy `width/height` uchun `x/y` bilan bir xil bo'ladi, xususan, `elem.getBoundingClientRect()` natijasi bunga yorqin misol.
```

```warn header="O'ng/pastki koordinatalar CSS joylashuv xususiyatlaridan farq qiladi"
Oynaning nisbiy koordinatalari va CSS `position:fixed` o'rtasida aniq o'xshashliklar mavjud.

Lekin CSS joylashuvida `right` xususiyati o'ng chetidan masofani, `bottom` xususiyati esa pastki chetidan masofani bildiradi.

Agar biz yuqoridagi rasmga qarasak, JavaScriptda bunday emasligini ko'rishimiz mumkin. Barcha oyna koordinatalari, shu jumladan, yuqori chap burchakdan hisoblanadi.
```

## elementFromPoint(x, y) [#elementFromPoint]

`document.elementFromPoint(x, y)` ni chaqirish `(x, y)` oyna koordinatalarida eng ko'p joylashtirilgan elementni qaytaradi.

Sintaksis:

```js
let elem = document.elementFromPoint(x, y);
```
Masalan, quyidagi kod oynaning o'rtasida joylashgan element tegini ajratib ko'rsatadi va chiqaradi:

```js run
let centerX = document.documentElement.clientWidth / 2;
let centerY = document.documentElement.clientHeight / 2;

let elem = document.elementFromPoint(centerX, centerY);

elem.style.background = "red";
alert(elem.tagName);
```

Oyna koordinatalaridan foydalanganligi sababli, element joriy aylantirish holatiga qarab farq qilishi mumkin.

````warn header="Derazadan tashqari koordinatalar uchun `elementFromPoint` `null`ni qaytaradi"
`document.elementFromPoint(x,y)` usuli faqat `(x,y)` ko'rinadigan maydon ichida bo'lsa ishlaydi.

Agar koordinatalardan birortasi manfiy bo'lsa yoki oyna kengligi/balandligidan oshsa, u `null`ni qaytaradi.

Buni tekshirmasak, yuzaga kelishi mumkin bo'lgan odatiy xato:

```js
let elem = document.elementFromPoint(x, y);
// agar koordinatalar oynadan tashqarida bo'lsa, element = null hisoblanadi
*!*
elem.style.background = ''; // Error!
*/!*
```
````

## "fixed" position dan aniqlash uchun foydalanish
Ko'pincha biror narsani joylashtirish uchun bizga koordinatalar kerak bo'ladi.

Element yaqinidagi biror narsani ko'rsatish uchun biz uning koordinatalarini olish uchun `getBoundingClientRect` dan, so'ngra CSS `position` dan `left/top` (yoki `right/bottom`) bilan birga foydalanishimiz mumkin.

Masalan, quyidagi `createMessageUnder(elem, html)` funksiyasi `elem` ostidagi xabarni ko'rsatadi:

```js
let elem = document.getElementById("coords-show-mark");

function createMessageUnder(elem, html) {
  // xabar elementini yarating
  let message = document.createElement('div');
  // Bu yerda uslub uchun CSS sinfidan foydalanish yaxshiroqdir
  message.style.cssText = "position:fixed; color: red";

*!*
  // koordinatalarni belgilang, "px" haqida ham unutmang!
  let coords = elem.getBoundingClientRect();

  message.style.left = coords.left + "px";
  message.style.top = coords.bottom + "px";
*/!*

  message.innerHTML = html;

  return message;
}

// Foydalanilishi:
// uni hujjatga 5 soniya davomida qo'shing
let message = createMessageUnder(elem, 'Hello, world!');
document.body.append(message);
setTimeout(() => message.remove(), 5000);
```

```online
Uni ishga tushirish uchun tugmani bosing:

<button id="coords-show-mark">id="coords-show-mark" li tugma, </button> ostida xabar paydo bo'ladi
```
Kod xabarni chap, o'ng, pastda ko'rsatish uchun o'zgartirilishi mumkin, "uni o'chirish" uchun CSS animatsiyalarini qo'llang. Bu oson, chunki bizda elementning barcha koordinatalari va o'lchamlari mavjud.

Ammo muhim tafsilotga e'tibor bering: sahifa aylantirilganda, xabar tugmachadan uzoqlashadi.

Sababi aniq: xabar elementi `position:fixed` ga tayanadi, shuning uchun sahifa aylanayotganda u oynaning bir joyida qoladi.

Buni o'zgartirish uchun biz hujjatga asoslangan koordinatalar va `position:absolute` dan foydalanishimiz kerak.

## Dokument koordinatalari [#getCoords]

Hujjatning nisbiy koordinatalari hujjatning oynadan emas, balki yuqori chap burchagidan boshlanadi.

CSS da oyna koordinatalari `position:fixed` ga mos keladi, hujjat koordinatalari esa yuqoridagi `position:absolute` ga o'xshaydi.

Hujjatning ma'lum bir joyiga biror narsani qo'yish uchun biz `position:absolute` va `top/left` dan foydalanishimiz mumkin, shunda u sahifani aylantirish paytida o'sha yerda qoladi, lekin birinchi navbatda bizga to'g'ri koordinatalar kerak.

Elementning hujjat koordinatalarini olishning standart usuli yo'q, ammo uni yozish oson.

Ikki koordinata tizimi quyidagi formula bilan bog'lanadi:
- `pageY` = `clientY` + hujjatning aylantirilgan vertikal qismining balandligi.
- `pageX` = `clientX` + hujjatning aylantirilgan gorizontal qismining kengligi.

`getCoords(elem)` funksiyasi `elem.getBoundingClientRect()` dan oyna koordinatalarini oladi va ularga joriy varaqni qo'shadi:

```js
// elementning hujjat koordinatalarini olish
function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset
  };
}
```
Agar yuqoridagi misolda biz uni `position: absolute` bilan ishlatgan bo'lsak, u holda xabar aylantirish elementi yonida qoladi.

O'zgartirilgan `createMessageUnder` funksiyasi:

```js
function createMessageUnder(elem, html) {
  let message = document.createElement('div');
  message.style.cssText = "*!*position:absolute*/!*; color: red";

  let coords = *!*getCoords(elem);*/!*

  message.style.left = coords.left + "px";
  message.style.top = coords.bottom + "px";

  message.innerHTML = html;

  return message;
}
```

## Xulosa

Sahifaning har qanday nuqtasi koordinatalariga ega:

1. Oynaga nisbatan -- `elem.getBoundingClientRect()`.
2. Hujjatga nisbatan -- `elem.getBoundingClientRect()` va u joriy sahifani ham aylantiradi.

Oyna koordinatalarini `position:fixed` bilan ishlatish juda yaxshi, hujjat koordinatalari esa `position:absolute` bilan yaxshi ishlaydi.

Ikkala koordinata tizimining ham ijobiy va salbiy tomonlari bor: CSS `position` `absolute` va `fixed` kabi bizga bir yoki boshqasi kerak bo'ladigan paytlar bor.
