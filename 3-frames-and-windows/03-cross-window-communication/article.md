# O'zaro oyna aloqasi

"Bir xil kelib chiqishi" (bir xil sayt) siyosati oyna va ramkalarning bir-biriga kirishini cheklaydi.

G'oya shundan iboratki, agar foydalanuvchining ikkita sahifasi ochiq bo'lsa: biri `john-smith.com` va boshqasi `gmail.com` bo'lsa, ular `john-smith.com` skriptini va gmail.com orqali bizning pochtamizni o'qishni xohlamasdilar. Shunday qilib, "Bir xil kelib chiqishi" siyosatining maqsadi foydalanuvchilarni ma'lumotlarni o'g'irlashdan himoya qilishdir.

## Bir xil kelib chiqish [#same-origin]

Ikkita URL manzili bir xil protokol, domen va portga ega bo'lsa, "bir xil kelib chiqish" ga ega deb aytiladi.

Bu URL manzillarning barchasi bir xil manbaaga ega:

- `http://site.com`
- `http://site.com/`
- `http://site.com/my/page.html`

Quyidagilar esa bir xil manbaaga ega emas:

- <code>http://<b>www.</b>site.com</code> (boshqa domen: `www.` mavjud)
- <code>http://<b>site.org</b></code> (boshqa domen: `.org` mavjud)
- <code><b>https://</b>site.com</code> (boshqa protokol: `https`)
- <code>http://site.com:<b>8080</b></code> (boshqa port: `8080`)

"Bir xil kelib chiqish" siyosatida shunday deyilgan:

- agar bizda boshqa oynaga havola bo'lsa, masalan. `window.open` yoki `<iframe>` ichidagi oyna tomonidan yaratilgan qalqib chiquvchi oyna (popup) va bu oyna bir xil manbadan kelgan bo'lsa, biz bu oynaga to'liq kirish huquqiga egamiz.
- aks holda, agar u boshqa manbadan kelgan bo'lsa, u holda biz ushbu oynaning hech qaysi tarkibiga, o'zgaruvchilar, hujjatlarga kira olmaymiz:. Yagona istisno bu `location`: biz uni o'zgartirishimiz mumkin (shunday qilib foydalanuvchini qayta yo'naltiramiz). Lekin biz joylashuvni *o'qiy* olmaymiz (shuning uchun foydalanuvchi hozir qayerdaligini ko'ra olmaymiz, ma'lumot sizib chiqmaydi).

### Amalda: iframe

`<iframe>` tegida o'zining alohida `document` va `window` obyektlari bo'lgan alohida o'rnatilgan oyna mavjud.

Biz ularga xususiyatlar yordamida kirishimiz mumkin:

- `<iframe>` ichidagi oynani olish uchun `iframe.contentWindow`.
- `<iframe>` ichidagi hujjatni olish uchun `iframe.contentDocument`, `iframe.contentWindow.document` qisqartmasi.

Biz o'rnatilgan oyna ichidagi biror narsaga kirganimizda, brauzer iframe bir xil kelib chiqishi borligini tekshiradi. Agar shunday bo'lmasa, kirish taqiqlanadi (`location` ga yozish bundan mustasno, bunga ruxsat beriladi).

Misol uchun, keling, `<iframe>` ga boshqa manbadan o'qish va yozishga harakat qilaylik:

```html run
<iframe src="https://example.com" id="iframe"></iframe>

<script>
  iframe.onload = function() {
    // ichki oynaga havolani olishimiz mumkin
*!*
    let iframeWindow = iframe.contentWindow; // OK
*/!*
    try {
      // ...lekin uning ichidagi hujjatga emas
*!*
      let doc = iframe.contentDocument; // ERROR
*/!*
    } catch(e) {
      alert(e); // Xavfsizlik xatosi (boshqa manba)
    }

    // shuningdek, iframe-da sahifaning URL manzilini o'qiy olmaymiz
    try {
      // Joylashuv obyektidan URL manzilini o'qib bo'lmadi
*!*
      let href = iframe.contentWindow.location.href; // ERROR
*/!*
    } catch(e) {
      alert(e); // Xavfsizlik xatosi
    }

    // ...biz joylashuvga YOZishimiz mumkin (va shu tariqa iframe-ga boshqa narsani yuklaymiz)!
*!*
    iframe.contentWindow.location = '/'; // OK
*/!*

    iframe.onload = null; // joylashuvni o'zgartirgandan keyin uni ishga tushirish uchun emas, balki ishlov beruvchini tozalang
  };
</script>
```

Yuqoridagi kod har qanday operatsiyalar uchun xatolarni ko'rsatadi:

- `iframe.contentWindow` ichki oynasiga havola olish - bunga ruxsat berilgan.
- `location` ga yozish.

Aksincha, agar `<iframe>` bir xil kelib chiqishga ega bo'lsa, biz u bilan hamma narsani qila olamiz:

```html run
<!-- iframe xuddi shu saytdan -->
<iframe src="/" id="iframe"></iframe>

<script>
  iframe.onload = function() {
    // shunchaki biror narsa qiling
    iframe.contentDocument.body.prepend("Hello, world!");
  };
</script>
```

```smart header="`iframe.onload` vs `iframe.contentWindow.onload`"
`iframe.onload` hodisasi (`<iframe>` tegida) asosan `iframe.contentWindow.onload` (o'rnatilgan oyna obyektida) bilan bir xil. O'rnatilgan oyna barcha resurslar bilan to'liq yuklanganda ishga tushadi.

...Lekin biz boshqa kelib chiqishga ega iframe uchun `iframe.contentWindow.onload` ga kira olmaymiz, shuning uchun `iframe.onload` dan foydalanamiz.
```

## Subdomenlardagi Windows: document.domain

Ta'rifga ko'ra, turli domenlarga ega bo'lgan ikkita URL turli xil kelib chiqishga ega.

Agar Windows bir xil ikkinchi darajali domenni baham ko'rsa, masalan, `john.site.com`, `peter.site.com` va `site.com` (ularning umumiy ikkinchi darajali domenlari `site.com` bo'lishi uchun) , biz brauzerdagi bu farqni e'tiborsiz qoldirishimiz mumkin, shunda ular o'zaro oyna aloqasi maqsadlarida "bir xil kelib chiqish" ga ega deb hisoblanishi mumkin.

Buni amalga oshirish uchun har bir bunday oyna kodini ishga tushirishi kerak:

```js
document.domain = 'site.com';
```

Bo'ldi, endi ular hech qanday cheklovlarsiz muloqot qiladi. Shunga qaramay, bu faqat bir xil ikkinchi darajali domenga ega sahifalar uchun mumkin.

```warn header="Eskirgan, lekin hali ham ishlamoqda"
`document.domain` xususiyati [specification] dan olib tashlanmoqda (https://html.spec.whatwg.org/multipage/origin.html#relaxing-the-same-origin-resriction). O'zaro oyna xabarlari (quyida tez orada tushuntiriladi) tavsiya etilgan almashtirishdir.

Aytgancha, hozirda barcha brauzerlar uni qo'llab-quvvatlaydi. Va qo'llab-quvvatlash `document.domain` ga tayanadigan eski kodni buzish uchun emas, balki kelajak uchun saqlanadi.
```

## Iframe: noto'g'ri hujjat tuzog'i

Iframe bir xil manbadan kelganda va biz undagi `document` ga kirishimiz mumkin bo'lsa, unda tuzoq bo'ladi. Bu o'zaro kelib chiqadigan narsalar bilan bog'liq emas, lekin bilish muhimdir.

Yaratilgandan so'ng iframe darhol hujjatga ega bo'ladi. Ammo bu hujjat unga yuklanadigan hujjatdan farq qiladi!

Shunday qilib, agar biz hujjat bilan darhol biror narsa qilsak, ehtimol bu yo'qoladi.

Mana, qarang:


```html run
<iframe src="/" id="iframe"></iframe>

<script>
  let oldDoc = iframe.contentDocument;
  iframe.onload = function() {
    let newDoc = iframe.contentDocument;
*!*
    // yuklangan hujjat dastlabki bilan bir xil emas!
    alert(oldDoc == newDoc); // false
*/!*
  };
</script>
```

Biz hali yuklanmagan iframe hujjati bilan ishlamasligimiz kerak, chunki bu *noto'g'ri hujjat*. Agar biz unga biron bir hodisa ishlov beruvchisini o'rnatsak, ular e'tiborga olinmaydi.

Hujjat mavjud bo'lgan vaqtni qanday aniqlash mumkin?

To'g'ri hujjat `iframe.onload` ishga tushganda, albatta, joyida bo'ladi. Lekin u faqat barcha resurslar bilan butun iframe yuklanganda ishga tushadi.

Biz `setInterval` da tekshiruvlar yordamida bir lahzani oldinroq tutishga harakat qilishimiz mumkin:

```html run
<iframe src="/" id="iframe"></iframe>

<script>
  let oldDoc = iframe.contentDocument;

  // har 100 ms da hujjat yangi ekanligini tekshiring
  let timer = setInterval(() => {
    let newDoc = iframe.contentDocument;
    if (newDoc == oldDoc) return;

    alert("New document is here!");

    clearInterval(timer); // setIntervalni bekor qiling, endi bunga ehtiyoj qolmaydi
  }, 100);
</script>
```

## To'plam: window.frames

`<iframe>` uchun oyna obyektini olishning muqobil usuli -- uni `window.frames` nomli to'plamdan olishdir:

- Raqam bo'yicha: `window.frames[0]` -- hujjatdagi birinchi kadr uchun oyna obyekti.
- Nomi bo'yicha: `window.frames.iframeName` -- `name="iframeName"` bilan ramka uchun oyna obyekti.

Masalan:

```html run
<iframe src="/" style="height:80px" name="win" id="iframe"></iframe>

<script>
  alert(iframe.contentWindow == frames[0]); // true
  alert(iframe.contentWindow == frames.win); // true
</script>
```

Iframe ichida boshqa iframelar bo'lishi mumkin. Tegishli `window` obyektlari ierarxiyani tashkil qiladi.

Navigatsiya havolalari:

- `window.frames` -- "children" oynalari to'plami (ichiga o'rnatilgan ramkalar uchun).
- `window.parent` -- "parent" (tashqi) oynaga havola.
- `window.top` -- eng yuqori ota-onaga havola.

Masalan:

```js run
window.frames[0].parent === window; // true
```

Joriy hujjat freym ichida ochiq yoki ochiq emasligini tekshirish uchun `top` xususiyatidan foydalanishimiz mumkin:

```js run
if (window == top) { // hozirgi window == window.top?
  alert('Skript ramkada emas, balki eng yuqori oynada joylashgan');
} else {
  alert('Skript ramkada ishlaydi!');
}
```

## "Sandbox" iframe atributi

`Sandbox` atributi `<iframe>` ichida ishonchsiz kodni bajarishiga yo'l qo'ymaslik uchun muayyan harakatlarni istisno qilishga imkon beradi. U iframe-ni boshqa manbadan kelgan deb hisoblash yoki boshqa cheklovlarni qo'llash orqali `sandbox` qiladi.

`<iframe sandbox src="...">` uchun qo'llaniladigan cheklovlarning "birlamchi to'plami" mavjud. Ammo atribut qiymati sifatida qo'llanilmasligi kerak bo'lgan cheklovlar ro'yxatini bo'sh joy bilan ajratamiz, masalan, `<iframe sandbox="allow-forms allow-popups">`.

Boshqacha qilib aytganda, bo'sh `sandbox` atributi mumkin bo'lgan eng qat'iy cheklovlarni qo'yadi, ammo biz ko'tarmoqchi bo'lganlarning bo'sh joy bilan ajratilgan ro'yxatini qo'yishimiz mumkin.

Mana cheklovlar ro'yxati:

`allow-same-origin`
: Odatiy bo'lib `sandbox` iframe uchun "boshqa manba" siyosatini majburiy olib kiradi. Boshqacha qilib aytadigan bo'lsak, hatto undagi `src` bir xil saytga ishora qilsa ham, u brauzerni `iframe` ni boshqa manbadan kelgan deb hisoblashga majbur qiladi. Skriptlar uchun barcha nazarda tutilgan cheklovlar bilan parametr ushbu xususiyatni o'chiradi.

`allow-top-navigation`
: `iframe` ga `parent.location` ni o'zgartirishga ruxsat beradi

`allow-forms`
: `iframe` dan shakllarni yuborish imkonini beradi.

`allow-scripts`
: `iframe` dan skriptlarni ishga tushirishga ruxsat beradi.

`allow-popups`
: `iframe` dan qalqib chiquvchi oymalarga (popup) `window.open` imkonini beradi

Ko'proq ma'lumot uchun [the manual](mdn:/HTML/Element/iframe) ni o'qib chiqing.

Quyidagi misolda birlamchi cheklovlar to'plamiga ega sinov muhitiga o'rnatilgan iframe ko'rsatilgan: `<iframe sandbox src="...">`. Unda JavaScript va shakl mavjud.

E'tibor bering, hech narsa ishlamaydi. Shunday qilib, standart to'plam juda qattiq:

[codetabs src="sandbox" height=140]


```smart
`"Sandbox"` atributining maqsadi faqat *qo'shimcha cheklovlar qo'shish*. Ularni olib tashlay olmaydi. Xususan, agar iframe boshqa kelib chiqishidan kelib chiqsa, u bir xil kelib chiqish cheklovlarini yumshata olmaydi.
```
## O'zaro oynalar orqali xabar almashish

`postMessage` interfeysi oynalarga qaysi manbadan bo'lishidan qat'iy nazar bir-biri bilan gaplashish imkonini beradi.

Demak, bu "Bir xil kelib chiqish" siyosatidan aylanib o'tish usuli. Bu `john-smith.com` oynasidan `gmail.com` bilan gaplashish va ma'lumot almashish imkonini beradi, lekin ular ikkalasi ham rozi bo'lsa va tegishli JavaScript funksiyalarini chaqirsagina bunday qilish mumkin. Bu foydalanuvchilar uchun xavfsizlikni yaratadi.

Interfeys ikki qismdan iborat.

### postMessage

Xabar jo'natmoqchi bo'lgan oyna qabul qiluvchi oynaning [postMessage](mdn:api/Window.postMessage) usulini chaqiradi. Boshqacha qilib aytadigan bo'lsak, agar biz `win` ga xabar yubormoqchi bo'lsak, `win.postMessage(data, targetOrigin)` ga qo'ng'iroq qilishimiz kerak.

Argumentlar:

`data`
: Yuborish uchun ma'lumotlar har qanday obyekt bo'lishi mumkin, ma'lumotlar "tuzilgan ketma-ketlashtirish algoritmi" yordamida klonlanadi. IE faqat satrlarni qo'llab-quvvatlaydi, shuning uchun biz ushbu brauzerni qo'llab-quvvatlash uchun murakkab obyektlarni `JSON.stringify` qilishimiz kerak.

`targetOrigin`
: Maqsadli oyna uchun manbani belgilaydi, shunda faqat berilgan manbadan kelgan oyna xabarni oladi.

`targetOrigin` xavfsizlik chorasidir. Esda tutingki, agar maqsadli oyna boshqa manbadan kelgan bo'lsa, biz jo'natuvchi oynasida undagi `location` ni o'qiy olmaymiz. Shunday qilib, biz hozirda mo'ljallangan oynada qaysi sayt ochiq ekanligiga ishonch hosil qila olmaymiz: foydalanuvchi uzoqlashishi mumkin va jo'natuvchi oynasi bu haqda hech qanday tasavvurga ega bo'lmaydi.

`targetOrigin` ni belgilash, agar oyna hali ham to'g'ri saytda bo'lsa, ma'lumotlarni qabul qilishini ta'minlaydi. Ma'lumotlar sezgir bo'lganda muhim ahamiyatga ega.

Masalan, bu yerda `win` xabarni faqat `http://example.com` manbasidan hujjatga ega bo'lsagina oladi:

```html no-beautify
<iframe src="http://example.com" name="example">

<script>
  let win = window.frames.example;

  win.postMessage("message", "http://example.com");
</script>
```

Agar biz bu tekshiruvni xohlamasak, `targetOrigin` ni `*` ga o'rnatishimiz mumkin.

```html no-beautify
<iframe src="http://example.com" name="example">

<script>
  let win = window.frames.example;

*!*
  win.postMessage("message", "*");
*/!*
</script>
```


### xabar

Xabarni qabul qilish uchun maqsadli oynada `message` hodisasi bo'yicha ishlov beruvchi bo'lishi kerak. U `postMessage` chaqirilganda ishga tushadi (va `targetOrigin` tekshiruvi muvaffaqiyatli amalga oshadi).

Hodisa obyekti maxsus xususiyatlarga ega:

`data`
: `postMessage` ma'lumotlari.

`origin`
: Yuboruvchining kelib chiqishi, masalan, `http://javascript.info`.

`source`
: Yuboruvchi oynasiga havola. Agar xohlasak, biz darhol `source.postMessage(...)` ni qaytarishimiz mumkin.

Ushbu ishlov beruvchini tayinlash uchun biz `addEventListener` dan foydalanishimiz kerak, `window.onmessage` qisqa sintaksisi ishlamaydi.

Mana bir misol:

```js
window.addEventListener("message", function(event) {
  if (event.origin != 'http://javascript.info') {
    // noma'lum domendan kelgan narsa, keling, bunga e'tibor bermaylik
    return;
  }

  alert( "received: " + event.data );

  // event.source.postMessage(...) dan foydalanib qayta xabar yubora oladi
});
```

To'liq namuna:

[codetabs src="postmessage" height=120]

## Xulosa

Usullarni chaqirish va boshqa oynaning mazmuniga kirish uchun avvalo unga havola qilishimiz kerak.

Qalqib chiquvchi oynalar (popup) uchun bizda quyidagi havolalar mavjud:
- Ochish oynasidan: `window.open` -- yangi oyna ochadi va unga havolani qaytaradi,
- Qalqib chiquvchi oynadan: `window.opener` -- qalqib chiquvchi oynadan ochuvchi oynasiga havola.

Iframelar uchun biz ota-ona/bolalar oynalariga quyidagi yordamida kirishimiz mumkin:
- `window.frames` -- o'rnatilgan oyna obyektlari to'plami,
- `window.parent`, `window.top` ota va yuqori oynalarga havolalar,
- `iframe.contentWindow` - `<iframe>` tegi ichidagi oyna.

Agar derazalar bir xil kelib chiqishi (host, port, protokol) bo'lsa, u holda Windows bir-biri bilan xohlagan narsani qilishi mumkin.

Aks holda, faqat mumkin bo'lgan harakatlar:
- Boshqa oynadagi `location` ni o'zgartiring (faqat yozish uchun ruxsat).
- Unga xabar yuboring.

Istisnolar quyidagilardir:
- Bir xil ikkinchi darajali domenga ega Windows: `a.site.com` va `b.site.com`. Keyin ikkalasida `document.domain='site.com'` sozlanishi ularni "bir xil kelib chiqish" holatiga keltiradi.
- Agar iframe `sandbox` atributiga ega bo'lsa, atribut qiymatida `allow-same-origin` belgilanmagan bo'lsa, u majburiy ravishda "boshqa kelib chiqish" holatiga o'tkaziladi. Bu xuddi shu saytdagi iframe-larda ishonchsiz kodni ishlatish uchun ishlatilishi mumkin.

`PostMessage` interfeysi har qanday kelib chiqishga ega bo'lgan ikkita oynaga gaplashish imkonini beradi:

1. Yuboruvchi `targetWin.postMessage(ma'lumotlar, targetOrigin)` ni chaqiradi.
2. Agar `targetOrigin` `'*'` bo'lmasa, u holda brauzer `targetWin` oynasida `targetOrigin` kelib chiqishi borligini tekshiradi.
3. Agar shunday bo'lsa, `targetWin` maxsus xususiyatlarga ega `message` hodisasini ishga tushiradi:
     - `origin` -- jo'natuvchi oynaning kelib chiqishi (masalan, `http://my.site.com`)
     - `source` -- jo'natuvchi oynasiga havola.
     - `data` -- ma'lumotlar, faqat satrlarni qo`llab-quvvatlaydigan IE dan tashqari hamma joydagi istalgan obyekt.

     Maqsadli oynada ushbu hodisa uchun ishlov beruvchini o'rnatish uchun `addEventListener` dan foydalanishimiz kerak.
