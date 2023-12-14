libs:
  - d3
  - domtree

---

# DOM daraxti

HTML hujjatining asosi teglardir.

Document Object Model (DOM) ga ko'ra, har bir HTML tegi obyekt hisoblanadi. O'rnatilgan teglar qo'shilgan tegning "bolalari" dir. Teg ichidagi matn ham obyekt hisoblanadi.

Ushbu obyektlarning barchasiga JavaScript yordamida kirish mumkin va biz ulardan sahifani o'zgartirish uchun foydalanishimiz mumkin.

Masalan, `document.body` `<body>` tegini ifodalovchi obyektdir.

Ushbu kodni ishga tushirish `<body>`ni 3 soniya davomida qizil rangga aylantiradi:

```js run
document.body.style.background = 'red'; // orqa fonni qizil qiling

setTimeout(() => document.body.style.background = '', 3000); // ortga qaytaring
```

Bu yerda biz `document.body` fon rangini o'zgartirish uchun `style.background` dan foydalandik, ammo boshqa ko'plab xususiyatlar mavjud, masalan:

- `innerHTML` -- Node ning HTML tarkibi.
- `offsetWidth` -- node kengligi(piksel o'lchamda)
- ...va boshqalar.

Tez orada biz DOMni manipulyatsiya qilishning ko'proq usullarini bilib olamiz, lekin birinchi navbatda uning tuzilishi haqida ma'lumotga ega bo'lishimiz kerak.

## DOM bilan bog'liq misol

Keling, quyidagi oddiy hujjatdan boshlaymiz:

```html run no-beautify
<!DOCTYPE HTML>
<html>
<head>
  <title>About elk</title>
</head>
<body>
  The truth about elk.
</body>
</html>
```

The DOM represents HTML as a tree structure of tags. Here's how it looks:

<div class="domtree"></div>

<script>
let node1 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n  "},{"name":"TITLE","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"About elk"}]},{"name":"#text","nodeType":3,"content":"\n"}]},{"name":"#text","nodeType":3,"content":"\n"},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n  The truth about elk.\n"}]}]}

drawHtmlTree(node1, 'div.domtree', 690, 320);
</script>

```online
Yuqoridagi rasmda siz element tugunlarini bosishingiz mumkin va ularning bolalari ochiladi/yiqiladi.
```

Har bir daraxt nodelari obyektdir.

Teglar *element nodelari* (yoki shunchaki elementlar) bo‘lib, daraxt strukturasini tashkil qiladi: `<html>` ildizda, keyin `<head>` va `<body>` uning bolalari va hokazo.

Elementlar ichidagi matn `#text` deb belgilangan *matn node larini* hosil qiladi. Matn node ida faqat satr mavjud. Uning bolalari bo'lmasligi mumkin va har doim daraxtning bargi hisoblanadi.

Masalan, `<title>` tegida `` Elk haqida`` matni mavjud.

Matn nodelaridagi maxsus belgilarga e'tibor bering:

- yangi qator: `↵` (JavaScriptda `\n` sifatida ma'lum)
- bo'sh joy: `␣`

Bo'shliqlar va yangi qatorlar harflar va raqamlar kabi to'liq haqiqiy belgilardir. Ular matn tugunlarini hosil qiladi va DOMning bir qismiga aylanadi. Masalan, yuqoridagi misolda `<head>` tegi `<title>` oldidan ba'zi bo'shliqlarni o'z ichiga oladi va bu matn `#text` node'iga aylanadi (u yangi qator va faqat ayrim bo'shliqlarni o`z ichiga oladi).

Faqat ikkita yuqori darajadagi istisnolar mavjud:
1. `<head>` oldidagi boʻshliqlar va yangi qatorlar tarixiy sabablarga ko'ra e'tiborga olinmaydi.
2. Agar biz `</body>` dan keyin biror narsa qo'ysak, u avtomatik ravishda oxirida `body` ichiga ko'chiriladi, chunki HTML spetsifikatsiyasi barcha kontent `<body>` ichida bo'lishini talab qiladi. Demak, `</body>` dan keyin bo'sh joy bo'lishi mumkin emas.

Boshqa hollarda hamma narsa oddiy -- agar hujjatda bo'shliqlar bo'lsa (xuddi har qanday belgilar kabi), ular DOM-da matn node'lariga aylanadi va agar biz ularni olib tashlasak, u holda bo'lmaydi.

Bu yerda faqat bo'sh joy uchun matn tugunlari yo'q:

```html no-beautify
<!DOCTYPE HTML>
<html><head><title>About elk</title></head><body>The truth about elk.</body></html>
```

<div class="domtree"></div>

<script>
let node2 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[{"name":"TITLE","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"About elk"}]}]},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"The truth about elk."}]}]}

drawHtmlTree(node2, 'div.domtree', 690, 210);
</script>

```aqlli sarlavha="Satrning boshlanishi/tugashidagi bo'shliqlar va faqat bo'sh joyli matn tugunlari odatda asboblarda yashirinadi"
DOM bilan ishlaydigan brauzer asboblari (tez orada yoritiladi) odatda matn boshida/oxirida bo'sh joy va teglar orasidagi bo'sh matn nodelarini (satr uzilishlari) ko'rsatmaydi.

Dasturchilar vositalari shu tarzda ekran maydonini tejaydi.

Boshqa DOM rasmlarida, ba'zida ular ahamiyatsiz bo'lsa, ularni o'tkazib yuboramiz. Bunday bo'shliqlar odatda hujjatning qanday ko'rsatilishiga ta'sir qilmaydi.
```

## Avtomatik tuzatish

Agar brauzer noto'g'ri tuzilgan HTMLga duch kelsa, DOMni yaratishda uni avtomatik ravishda tuzatadi.

Masalan, yuqori teg har doim `<html>` bo'ladi. Hujjatda mavjud bo'lmasa ham, u DOMda mavjud bo'ladi, chunki brauzer uni yaratadi. Huddi shu narsa `<body>` uchun ham amal qiladi.

Misol tariqasida, agar HTML fayli bitta `"Hello"` so'zi bo'lsa, brauzer uni `<html>` va `<body>` ichiga o'rab oladi va kerakli `<head>`ni qo'shadi va DOM fayli quyidagidek bo'ladi:


<div class="domtree"></div>

<script>
let node3 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[]},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"Hello"}]}]}

drawHtmlTree(node3, 'div.domtree', 690, 150);
</script>

DOMni yaratishda brauzerlar hujjatdagi xatolarni avtomatik ravishda qayta ishlaydi, teglarni yopadi va hokazo.

Yopilmagan teglar bilan hujjat:

```html no-beautify
<p>Hello
<li>Mom
<li>and
<li>Dad
```

...Brauzer teglarni o'qiyotganda va yetishmayotgan qismlarni tiklaganda oddiy DOMga aylanadi:

<div class="domtree"></div>

<script>
let node4 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[]},{"name":"BODY","nodeType":1,"children":[{"name":"P","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"Hello"}]},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"Mom"}]},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"and"}]},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"Dad"}]}]}]}

drawHtmlTree(node4, 'div.domtree', 690, 360);
</script>

````ogohlantiruvchi sarlavha="Jadvallarda har doim `<tbody>` mavjud"
Qiziqarli "maxsus holat" - bu jadvallar. DOM spetsifikatsiyasiga ko'ra ular `<tbody>` tegiga ega bo'lishi kerak, ammo HTML matni uni o'tkazib yuborishi mumkin. Keyin brauzer avtomatik ravishda DOM da `<tbody>` ni yaratadi.

HTML uchun:

```html no-beautify
<table id="table"><tr><td>1</td></tr></table>
```

DOM-strukturasi quyidagicha bo'ladi:
<div class="domtree"></div>

<script>
let node5 = {"name":"TABLE","nodeType":1,"children":[{"name":"TBODY","nodeType":1,"children":[{"name":"TR","nodeType":1,"children":[{"name":"TD","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"1"}]}]}]}]};

drawHtmlTree(node5,  'div.domtree', 600, 200);
</script>

Ko'ryapsizmi? `<tbody>` kutilmaganda paydo bo'ldi. Ajablanmaslik uchun jadvallar bilan ishlayotganda buni yodda tutishimiz kerak.
````

## Boshqa node turlari

Elementlar va matn tugunlaridan tashqari yana bir qancha node turlari mavjud.

Masalan,izohlar:

```html
<!DOCTYPE HTML>
<html>
<body>
  The truth about elk.
  <ol>
    <li>An elk is a smart</li>
*!*
    <!-- comment -->
*/!*
    <li>...and cunning animal!</li>
  </ol>
</body>
</html>
```

<div class="domtree"></div>

<script>
let node6 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[]},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n  The truth about elk.\n  "},{"name":"OL","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n    "},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"An elk is a smart"}]},{"name":"#text","nodeType":3,"content":"\n    "},{"name":"#comment","nodeType":8,"content":"comment"},{"name":"#text","nodeType":3,"content":"\n    "},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"...and cunning animal!"}]},{"name":"#text","nodeType":3,"content":"\n  "}]},{"name":"#text","nodeType":3,"content":"\n\n\n"}]}]};

drawHtmlTree(node6, 'div.domtree', 690, 500);
</script>

Biz bu yerda ikkita matn tugunlari orasida `#comment` deb belgilangan yangi daraxt node turini ko'rishimiz mumkin -- *comment node'ni*.

Biz o'ylashimiz mumkin: nima uchun izoh DOMga qo'shilgan? Bu vizual tasvirga hech qanday ta'sir qilmaydi. Ammo bir qoida bor -- agar biror narsa HTMLda bo'lsa, u ham DOM daraxtida bo'lishi kerak.

**HTMLdagi hamma narsa, hatto sharhlar ham DOMning bir qismiga aylanadi.**

Hatto HTMLning eng boshida joylashgan `<!DOCTYPE...>` direktivasi ham DOM node'idir. U DOM daraxtida `<html>` dan oldin joylashgan. Bu haqda kam odam biladi. Biz bu nodega tegmoqchi emasmiz, hatto uni diagrammalarga ham chizmaymiz, lekin u bu yerda mavjud.

Butun hujjatni ifodalovchi `document` obyekti rasmiy ravishda DOM tugunidir.

[12 ta node turi] mavjud (https://dom.spec.whatwg.org/#node). Amalda biz odatda ulardan 4 tasi bilan ishlaymiz:

1. `document` -- DOM-ga "kirish nuqtasi".
2. element nodes -- HTML-teglar, daraxt qurilish bloklari.
3. text nodes -- matnlarni o'z tarkibiga oladi.
4. comments -- ba'zan biz ma'lumotni u yerga qo'yishimiz mumkin, u ko'rsatilmaydi, lekin JS uni DOMdan o'qiy oladi.

## O'zingiz uchun ko'rib chiqing

DOM tuzilishini real vaqtda koʻrish uchun [Live DOM Viewer] (https://software.hixie.ch/utilities/js/live-dom-viewer/) ni sinab koʻring. Hujjatni kiriting va u bir zumda DOM sifatida paydo bo'ladi.

DOM-ni o'rganishning yana bir usuli - bu brauzer developer vositalaridan foydalanish. Aslida, biz ulardan ishlab chiqishda foydalanamiz.

Buning uchun [elk.html](elk.html) veb-sahifasini oching, brauzer ishlab chiquvchi vositalarini yoqing va Elementlar yorlig'iga o'ting.

Bu shunday ko'rinishi kerak:

![](elk.svg)

Siz DOMni ko'rishingiz, elementlarni bosishingiz, ularning tafsilotlarini ko'rishingiz mumkin va hokazo.

Iltimos, ishlab chiquvchi vositalaridagi DOM tuzilishi soddalashtirilganligini unutmang. Matn nodelari xuddi matn sifatida ko'rsatiladi. Va umuman "bo'sh" (faqat bo'sh joy) matn nodelari yo'q. Bu yaxshi, chunki biz ko'pincha element nodelariga qiziqamiz.

Yuqori chap burchakdagi <span class="devtools" style="background-position:-328px -124px"></span> tugmasini bosish sichqoncha (yoki boshqa ko'rsatgich qurilmalari) yordamida veb-sahifadan tugunni tanlash va uni "teskhirish" imkonini beradi (Elementlar yorlig'ida unga o'ting). Bu bizda ulkan HTML sahifaga (va tegishli katta DOM) ega bo'lganda va undagi ma'lum bir elementning o'rnini ko'rishni xohlayotganda juda yaxshi ishlaydi.

Buni amalga oshirishning yana bir usuli - veb-sahifani o'ng tugmasini bosib, kontekst menyusida "Inspect" ni tanlash.

![](inspect.svg)

Asboblarning o'ng qismida quyidagi kichik yorliqlar mavjud:
- **Uslublar** -- biz CSS joriy element qoidasiga qoida bo'yicha qo'llanilishini ko'rishimiz mumkin, jumladan o'rnatilgan qoidalar (kulrang). Deyarli hamma narsani o'z o'rnida tahrirlash mumkin, masalan, quyidagi qutining o'lchamlari / chekkalari / to'ldirishlari.
- **Computed** -- xususiyat bo'yicha elementga qo'llaniladigan CSS-ni ko'rish uchun: har bir xususiyat uchun biz uni beradigan qoidani ko'rishimiz mumkin (jumladan, CSS merosi va boshqalar).
- **Voqea tinglovchilari** -- DOM elementlariga biriktirilgan voqea tinglovchilarini ko'rish uchun (biz ularni o'quv qo'llanmaning keyingi qismida ko'rib chiqamiz).
- ...va hokazo.

Ularni o'rganishning eng yaxshi usuli - bu atrofni bosish. Aksariyat qiymatlarni joyida tahrirlash mumkin.

## Konsol bilan o'zaro aloqa

Biz DOM bilan ishlaganimizda, unga JavaScript-ni ham qo'llashni xohlashimiz mumkin. Masalan: tugunni oling va natijani ko'rish maqsadida uni o'zgartirish uchun kodni ishga tushiring. Elementlar yorlig'i va konsol o'rtasida sayohat qilish uchun bir nechta maslahatlar berilgan.

Boshlash uchun:

1. Elementlar ilovasida birinchi `<li>` ni tanlang.
2. `Klaviatura: Esc` tugmasini bosing -- u Elementlar yorlig'i ostidagi konsolni ochadi.

Endi oxirgi tanlangan element `$0` sifatida mavjud, avval tanlangan `$1` va hokazo.

Biz ularga buyruqlar berishimiz mumkin. Masalan, `$0.style.background = 'red'' tanlangan ro'yxat elementini qizil rangga aylantiradi, masalan:

![](domconsole0.svg)

Konsoldagi Elements-dan tugunni shunday olish mumkin.

Orqaga yo'l ham bor. Agar DOM tuguniga havola qiluvchi o'zgaruvchi mavjud boʻlsa, uni Elementlar panelida ko'rish uchun Konsolda `inspect(node)` buyrug'idan foydalanishimiz mumkin.

Yoki biz faqat konsolda DOM tugunini chiqarishimiz va quyida `document.body` kabi "in-place" ni o'rganishimiz mumkin:

![](domconsole1.svg)

Bu, albatta, debugging maqsadlari uchun. Keyingi bobdan boshlab biz JavaScript-dan foydalanib DOM-ga kiramiz va uni o'zgartiramiz.

Brauzer ishlab chiquvchi vositalari ishlab chiqishda katta yordam beradi: biz DOMni o'rganishimiz, narsalarni sinab ko'rishimiz va nima noto'g'ri ekanligini ko'rishimiz mumkin.

## Xulosa

HTML/XML hujjati brauzer ichida DOM daraxti sifatida taqdim etiladi.

- Teglar element nodelariga aylanadi va strukturani tashkil qiladi.
- Matn matn nodelariga aylanadi.
- ...va hokazo, HTMLdagi hamma narsa DOMda o'z o'rniga ega, hatto sharhlar ham.

DOMni tekshirish va uni qo'lda o'zgartirish uchun ishlab chiquvchi vositalaridan foydalanishimiz mumkin.

Bu yerda biz asoslarni, eng ko'p ishlatiladigan va boshlash uchun muhim harakatlarni ko'rib chiqdik. <https://developers.google.com/web/tools/chrome-devtools> sahifasida Chrome Developer Tools haqida keng qamrovli hujjatlar mavjud. Asboblarni o'rganishning eng yaxshi usuli - bu yerga va u yerga bosish, menyularni o'qish: ko'pchilik variantlar aniq. Keyinchalik, ular haqida umumiy ma'lumotga ega bo'lganingizda, hujjatlarni o'qing va qolganlarini oling.

DOM nodelarida ular orasida sayohat qilish, ularni o'zgartirish, sahifa bo'ylab harakatlanish va boshqalarni ta'minlaydigan xususiyatlar va usullar mavjud. Keyingi boblarda ular haqida to'xtalamiz.
