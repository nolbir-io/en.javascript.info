# CSS-animatsiyalar

CSS animatsiyalari umuman JavaScriptsiz oddiy animatsiyalarni bajarishga imkon beradi.

JavaScriptdan kichik kod bilan CSS animatsiyalarini boshqarish va ularni yanada yaxshilash uchun foydalanish mumkin.

## CSS o'tishlari [#css-transition]

CSS-ga o'tish g'oyasi oddiy. Biz xususiyatni va uning o'zgarishlarini qanday jonlantirish kerakligini tasvirlaymiz. Xususiyat o'zgarganda, brauzer animatsiyani bo'yaydi.

Ya'ni, bizga kerak bo'lgan narsa mulkni o'zgartirishdir va suyuqlik o'tish brauzer tomonidan amalga oshiriladi.

Masalan, quyidagi CSS 3 soniya davomida fon rangidagi o'zgarishlarni jonlantiradi:

```css
.animated {
  transition-property: background-color;
  transition-duration: 3s;
}
```

Endi agar elementda `.animated` sinfi bo'lsa, `background-color` ning har qanday o'zgarishi 3 soniya davomida jonlantiriladi.

Fonni jonlantirish uchun quyidagi tugmani bosing:

```html run autorun height=60
<button id="color">Click me</button>

<style>
  #color {
    transition-property: background-color;
    transition-duration: 3s;
  }
</style>

<script>
  color.onclick = function() {
    this.style.backgroundColor = 'red';
  };
</script>
```

CSS o'tishlarini tavsiflash uchun 4 ta xususiyat mavjud:

- `transition-property`
- `transition-duration`
- `transition-timing-function`
- `transition-delay`

Biz ularni bir zumda yoritib beramiz, hozircha shuni ta'kidlaymizki, umumiy `transition` xususiyati ularni quyidagi tartibda e'lon qilishga imkon beradi:  `property duration timing-function delay`, shuningdek, bir vaqtning o'zida bir nechta xususiyatlarni jonlantiradi.

Masalan, bu tugma ham `color` va `font-size` ni jonlantiradi:

```html run height=80 autorun no-beautify
<button id="growing">Click me</button>

<style>
#growing {
*!*
  transition: font-size 3s, color 2s;
*/!*
}
</style>

<script>
growing.onclick = function() {
  this.style.fontSize = '36px';
  this.style.color = 'red';
};
</script>
```

Endi animatsiya xususiyatlarini birma-bir yoritaylik.

## transition-property

`transition-property` da biz jonlantiriladigan xususiyatlar ro'yxatini yozamiz, masalan, `left`, `margin-left`, `height`, `color`. Yoki `all` ni yozishimiz mumkin, bu "barcha xususiyatlarni jonlantirish" degan ma'noni anglatadi.

E'tibor bering, jonlantirilmaydigan xususiyatlar mavjud. Biroq, [umumiy foydalaniladigan xususiyatlarning aksariyati animatsion](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties) hisoblanadi. 

## transition-duration

`transition-duration` da biz animatsiya qancha vaqt olishini belgilashimiz mumkin. Vaqt [CSS vaqt formatida](https://www.w3.org/TR/css3-values/#time) bo'lishi kerak: soniyalarda `s` yoki millisekundlarda `ms`.

## transition-delay

`transition-delay` da biz animatsiyadan *oldingi* kechikishni belgilashimiz mumkin. Masalan, agar o'tish kechikishi `1s` va `transition-duration` `2s` bo'lsa, u holda animatsiya xususiyat o'zgargandan keyin 1 soniyadan keyin boshlanadi va umumiy davomiylik 2 soniya bo'ladi.

Salbiy qiymatlar ham mumkin. Keyin animatsiya darhol ko'rsatiladi, lekin animatsiyaning boshlang'ich nuqtasi berilgan qiymatdan (vaqt) keyin bo'ladi. Masalan, agar `transition-delay` `-1s` va `transition-duration` `2s` bo'lsa, animatsiya yarim yo'ldan boshlanadi va umumiy davomiylik 1 soniya bo'ladi.

Bu yerda animatsiya raqamlarni CSS `translate` xususiyatidan foydalangan holda `0` dan `9` ga o'tkazadi:

[codetabs src="digits"]

`transform` xususiyati quyidagicha animatsiyalangan:

```css
#stripe.animate {
  transform: translate(-90%);
  transition-property: transform;
  transition-duration: 9s;
}
```

Yuqoridagi misolda JavaScript elementga `.animate` sinfini qo'shadi -- va animatsiya boshlanadi:

```js
stripe.classList.add('animate');
```

Biz uni o'tish davrining o'rtasida joylashgan joydan, aniq raqamdan boshlashimiz mumkin, masalan. salbiy `transition-delay` yordamida joriy soniyaga mos keladi.

Bu yerda raqamni bossangiz -- animatsiya joriy soniyadan boshlanadi:

[codetabs src="digits-negative-delay"]

JavaScript buni qo'shimcha qator bilan bajaradi:

```js
stripe.onclick = function() {
  let sec = new Date().getSeconds() % 10;
*!*
  // masalan, -3s bu yerda animatsiyani 3-sekunddan boshlab boshlaydi
  stripe.style.transitionDelay = '-' + sec + 's';
*/!*
  stripe.classList.add('animate');
};
```

## transition-timing-function

Vaqt funksiyasi animatsiya jarayoni uning vaqt jadvalida qanday taqsimlanishini tavsiflaydi. Sekin boshlanib, keyin tez ketadi yoki aksincha.

Avvaliga bu eng murakkab xususiyat bo'lib tuyuladi. Ammo bunga bir oz vaqt ajratsak, bu juda oddiy bo'ladi.

Bu xususiyat ikki turdagi qiymatlarni qabul qiladi: Bezier egri chizig'i yoki qadamlar. Keling, egri chiziqdan boshlaylik, chunki u tez-tez ishlatiladi.

### Bezier egri chizig'i

Vaqt funksiyasi shartlarni qondiradigan 4 nazorat nuqtasi bilan [Bezier egri](/bezier-egri) sifatida o'rnatilishi mumkin:

1. Birinchi nazorat nuqtasi: `(0,0)`.
2. Oxirgi nazorat nuqtasi: `(1,1)`.
3. Oraliq nuqtalar uchun `x` qiymatlari `0..1` oralig'ida bo'lishi kerak, `y` har qanday narsa bo'lishi mumkin.

CSS-da Bezier egri chizig'i sintaksisi: `kubik-bezier(x2, y2, x3, y3)`. Bu yerda biz faqat 2 va 3 nazorat nuqtalarini ko'rsatishimiz kerak, chunki birinchisi `(0,0)`, 4-chi esa `(1,1)` ga o'rnatiladi.

Vaqt funksiyasi animatsiya jarayoni qanchalik tez ketishini tavsiflaydi.

- `x` o'qi vaqt: `0` -- boshlanish, `1` -- `transition-duration` oxiri.
- `y` o'qi jarayonning tugallanishini belgilaydi: `0` -- mulkning boshlang'ich qiymati, `1` -- yakuniy qiymat.

Eng oddiy variant - animatsiya bir xil chiziqli tezlik bilan bir xilda ketayotganda. Buni `cubic-bezier(0, 0, 1, 1)` egri chizig'i bilan aniqlash mumkin.

Bu egri chiziq quyidagicha ko'rinadi:

![](bezier-linear.svg)

...Ko'rib turganimizdek, bu shunchaki to'g'ri chiziq. Vaqt (`x`) o'tishi bilan animatsiyaning tugallanishi (`y`) doimiy ravishda `0` dan `1` gacha boradi.

Quyidagi misoldagi poezd doimiy tezlik bilan chapdan o'ngga o'tadi (uni bosing):

[codetabs src="train-linear"]

CSS `transition` ushbu egri chiziqqa asoslanadi:

```css
.train {
  left: 0;
  transition: left 5s cubic-bezier(0, 0, 1, 1);
  /* 450px gacha bo'lgan poezd to'plamlarini bosing va shu bilan animatsiyani ishga tushiring */
}
```

...Va poyezd sekinlashganini qanday ko'rsata olamiz?

Biz boshqa Bezier egri chizig'idan foydalanishimiz mumkin: `kubik-bezier(0,0, 0,5, 0,5,1,0)`.

Grafik:

![](train-curve.svg)

Ko'rib turganimizdek, jarayon tez boshlanadi: egri chiziq yuqoriga ko'tariladi, keyin esa tobora sekinlashadi.

Mana vaqtni belgilash funksiyasi (poyezdni bosing):

[codetabs src="train"]

CSS:
```css
.train {
  left: 0;
  transition: left 5s cubic-bezier(0, .5, .5, 1);
  /* 450px gacha bo'lgan poezd to'plamlarini bosing va shu bilan animatsiyani ishga tushiring */
}
```

Bir nechta o'rnatilgan egri chiziqlar mavjud: `linear`, `ease`, `ease-in`, `ease-out` va `ease-in-out`.

`linear` bu `cubic-bezier(0, 0, 1, 1)` ning qisqartmasi bo'lib, biz yuqorida tasvirlab bergan to'g'ri chiziqdir.

Boshqa nomlar quyidagi `cubic-bezier` ning qisqartmasi:

| <code>ease</code><sup>*</sup> | <code>ease-in</code> | <code>ease-out</code> | <code>ease-in-out</code> |
|-------------------------------|----------------------|-----------------------|--------------------------|
| <code>(0.25, 0.1, 0.25, 1.0)</code> | <code>(0.42, 0, 1.0, 1.0)</code> | <code>(0, 0, 0.58, 1.0)</code> | <code>(0.42, 0, 0.58, 1.0)</code> |
| ![ease, figure](ease.svg) | ![ease-in, figure](ease-in.svg) | ![ease-out, figure](ease-out.svg) | ![ease-in-out, figure](ease-in-out.svg) |

`*` -- sukut bo'yicha, agar vaqt funksiyasi bo'lmasa, `ease` ishlatiladi.

Shunday qilib, biz sekinlashtiruvchi poyezdimiz uchun `ease-out` dan foydalanishimiz mumkin:

```css
.train {
  left: 0;
  transition: left 5s ease-out;
  /* o'tish bilan bir xil: chap 5s kubik-bezier(0, .5, .5, 1); */
}
```

Ammo u biroz boshqacha ko'rinadi.

**Bezier egri chizig'i animatsiyani o'z diapazonidan oshib ketishiga olib kelishi mumkin.**

Egri chiziqdagi nazorat nuqtalari har qanday `y` salbiy yoki katta koordinatalarga ega bo'lishi mumkin. Keyin Bezier egri chizig'i ham juda past yoki baland bo'lib, animatsiyani odatdagi diapazondan tashqariga chiqarishga imkon beradi.

Quyidagi misolda animatsiya kodi berilgan:

```css
.train {
  left: 100px;
  transition: left 5s cubic-bezier(.5, -1, .5, 2);
  /* 450px gacha bo'lgan poyezd to'plamlarini bosing */
}
```

`Left` xususiyati `100px` dan `400px` gacha jonlantirilishi kerak.

Ammo poyezdni bossangiz, buni ko'rasiz:

- Birinchidan, poezd *orqaga* ketadi: `left` `100px` dan kamroq bo'ladi.
- Keyin u oldinga, `400px` dan biroz uzoqroqqa boradi.
- Va keyin yana orqaga -- `400px` ga.

[codetabs src="train-over"]

Berilgan Bezier egri chizig'ining grafigiga qarasak, nima uchun bu sodir bo'lishi aniq:

![](bezier-train-over.svg)

Biz 2-nuqtaning `y` koordinatasini noldan pastga siljitdik va 3-nuqta uchun uni `1` dan oshirdik, shuning uchun egri chiziq "muntazam" kvadrantdan chiqib ketadi. `y` `standart` diapazondan tashqarida `0..1`.

Ma'lumki, `y` "animatsiya jarayonining tugashi" ni o'lchaydi. `y = 0` qiymati boshlang'ich xususiyat qiymatiga va `y = 1` -- yakuniy qiymatga mos keladi. Shunday qilib, `y<0` qiymatlari xususiyatni boshlang'ich `left` va `y>1` -- oxirgi `left` dan o'tadi.

Bu, albatta, "yumshoq" variant. Agar biz `-99` va `99` kabi `y` qiymatlarini qo'ysak, poyezd ko'proq masofadan sakrab chiqadi.

Lekin qanday qilib ma'lum bir vazifa uchun Bezier egri chizig'ini qilamiz? Buning uchun ko'plab vositalar mavjud.

- Masalan, biz buni <https://cubic-bezier.com> saytida qilishimiz mumkin.
- Brauzer ishlab chiquvchi vositalari, shuningdek, CSS-da Bezier egri chiziqlarini maxsus qo'llab-quvvatlaydi:
     1. `key:F12` (Mac:`key:Cmd+Opt+I`) yordamida ishlab chiquvchi vositalarini oching.
     2. `Elements` yorlig'ini tanlang, so'ng o'ng tarafdagi `Styles` pastki paneliga e'tibor bering.
     3. `cubic-bezier` so'zi bo'lgan CSS xossalarida bu so'z oldidan belgi bo'ladi.
     4. Egri chiziqni tahrirlash uchun ushbu belgini bosing.

### Qadamlar

Vaqt funksiyasi `steps(number of steps[, start/end])` o'tishni bir necha bosqichlarga bo'lish imkonini beradi.

Keling, buni raqamlar bilan misolda ko'rib chiqaylik.

Mana, manba sifatida hech qanday animatsiyasiz raqamlar ro'yxati:

[codetabs src = "qadam ro'yxati"]

HTMLda raqamlar chizig'i belgilangan uzunlikdagi `<div id="digits">` ichiga kiritilgan:

```html
<div id="digit">
  <div id="stripe">0123456789</div>
</div>
```

`#digit` div o'rnatilgan kenglik va chegaraga ega, shuning uchun u qizil oynaga o'xshaydi.

Biz taymer qilamiz: raqamlar birma-bir, diskret tarzda paydo bo'ladi.

Bunga erishish uchun biz `overflow: hidden` yordamida `#stripe` ni `#digit` tashqarisida yashiramiz va keyin `#stripe` ni bosqichma-bosqich chapga siljitamiz.

9 ta qadam bo'ladi, har bir raqam uchun bir qadam:

```css
#stripe.animate  {
  transform: translate(-90%);
  transition: transform 9s *!*steps(9, start)*/!*;
}
```

`steps(9, start)` ning birinchi argumenti qadamlar sonidir. Transformatsiya 9 qismga bo'linadi (har biri 10%). Vaqt oralig'i avtomatik ravishda 9 qismga bo'linadi, shuning uchun `transition: 9s` bizga butun animatsiya uchun 9 soniyani beradi - har bir raqam uchun 1 soniya.

Ikkinchi dalil ikki so'zdan biri: `start` yoki `end`.

`Start` animatsiya boshida biz birinchi qadamni darhol qilishimiz kerakligini anglatadi.

Amalda:

[codetabs src="step"]

Raqamni bosish uni darhol `1` ga (birinchi qadam) o'zgartiradi va keyingi soniyaning boshida o'zgaradi.

Jarayon quyidagicha davom etmoqda:

- `0s` -- `-10%` (birinchi o`zgarish 1-soniya boshida, darhol)
- `1s` -- `-20%`
- ...
- `8s` -- `-90%`
- (oxirgi soniya yakuniy qiymatni ko'rsatadi).

Bu yerda birinchi o'zgarish `steps` dagi `start` tufayli darhol sodir bo'ldi.

`End` muqobil qiymati o'zgarish boshida emas, balki har soniya oxirida qo'llanilishi kerakligini bildiradi.

Shunday qilib, `steps (9, end)` jarayoni quyidagicha bo'ladi:

- `0s` -- `0` (birinchi soniyada hech narsa o'zgarmaydi)
- `1s` -- `-10%` (birinchi o'zgarish 1 soniya oxirida)
- `2s` -- `-20%`
- ...
- `9s` -- `-90%`

Mana `steps(9, end)` amalda (birinchi raqam o'zgarishidan oldin pauzaga e'tibor bering):

[codetabs src="step-end"]

Shuningdek, `steps(...)` uchun oldindan belgilangan qisqartmalar ham mavjud:

- `step-start` -- `steps(1, start)` bilan bir xil. Ya'ni, animatsiya darhol boshlanadi va 1 qadamni oladi. Shunday qilib, u animatsiya bo'lmagandek darhol boshlanadi va tugaydi.
- `step-end` -- `steps(1, end)` bilan bir xil: `transition-duration` oxirida bir qadamda animatsiyani yarating.

Bu qiymatlar kamdan-kam qo'llaniladi, chunki ular haqiqiy animatsiyani emas, balki bir bosqichli o'zgarishlarni ifodalaydi. Biz ularni to'liqlik uchun bu yerda eslatib o'tamiz.

## Hodisa: "transitionend"

CSS animatsiyasi tugagach, `transitionend` hodisasi ishga tushadi.

Animatsiya bajarilgandan keyin harakatni bajarish uchun keng qo'llaniladi. Shuningdek, biz animatsiyalarga qo'shilishimiz mumkin.

Misol uchun, quyidagi misoldagi kema bosilganda u yerga va orqaga suzib keta boshlaydi, har safar o'ngga uzoqroq va uzoqroq suzadi:

[iframe src="boat" height=300 edit link]

Animatsiya har safar o'tish tugashi bilan qayta ishga tushadigan va yo'nalishni o'zgartiruvchi `go` funksiyasi bilan boshlanadi:

```js
boat.onclick = function() {
  //...
  let times = 1;

  function go() {
    if (times % 2) {
      // o'ng tomonga suzadi
      boat.classList.remove('back');
      boat.style.marginLeft = 100 * times + 200 + 'px';
    } else {
      // chap tomonga suzadi
      boat.classList.add('back');
      boat.style.marginLeft = 100 * times - 200 + 'px';
    }

  }

  go();

  boat.addEventListener('transitionend', function() {
    times++;
    go();
  });
};
```

`transitionend` uchun hodisa obyekti bir nechta o'ziga xos xususiyatlarga ega:

`event.propertyName`
: Animatsiyani tugatgan xususiyat. Agar biz bir vaqtning o'zida bir nechta xususiyatni jonlantirsak, yaxshi bo'lishi mumkin.

`event.elapsedTime`
: Animatsiya `transition-delay` siz olgan vaqt (soniyalarda).

## Keyframe lar

Biz `@keyframes` CSS qoidasi yordamida bir nechta oddiy animatsiyalarni birlashtira olamiz.

U animatsiyaning "nomi" va qoidalarini - nimani, qachon va qayerda jonlantirishni belgilaydi. Keyin `animation` xususiyatidan foydalanib, animatsiyani elementga biriktirishimiz va unga qo'shimcha parametrlarni belgilashimiz mumkin.

Mana tushuntirishlar bilan bir misol:

```html run height=60 autorun="no-epub" no-beautify
<div class="progress"></div>

<style>
*!*
  @keyframes go-left-right {        /* unga nom bering: "chapga-o'ngga" */
    from { left: 0px; }             /* chapdan animatsiya qiling: 0px */
    to { left: calc(100% - 50px); } /* chapga animatsiya qiling: 100%-50px */
  }
*/!*

  .progress {
*!*
    animation: go-left-right 3s infinite alternate;
    /* elementga "chapga-o'ngga" animatsiyasini qo'llang
        davomiyligi 3 soniya
        urinishlar soni: cheksiz
        har safar muqobil yo'nalish
    */
*/!*

    position: relative;
    border: 2px solid green;
    width: 50px;
    height: 20px;
    background: lime;
  }
</style>
```

`@keyframes` va [batafsil spetsifikatsiya](https://drafts.csswg.org/css-animations/) haqida ko'plab maqolalar mavjud.

Saytlaringizda hamma narsa doimiy harakatda bo'lmasa, sizga `@keyframes` tez-tez kerak bo'lmasligi mumkin.

## Ijro

Aksariyat CSS xususiyatlari jonlantirilishi mumkin, chunki ularning aksariyati raqamli qiymatlardir. Masalan, `width`, `color`, `font-size` ning barchasi raqamlardir. Ularni jonlantirganda, brauzer asta-sekin bu raqamlarni kvadratma-kadrga o'zgartirib, silliq effekt yaratadi.

Biroq, barcha animatsiyalar siz xohlagan darajada silliq ko'rinmaydi, chunki turli CSS xususiyatlarini o'zgartirish har xil xarajat qiladi.

Batafsil texnik tafsilotlarga ko'ra, uslub o'zgarganda brauzer yangi ko'rinishni yaratish uchun 3 bosqichdan o'tadi:

1. **Layout**: keyin har bir elementning geometriyasi va holatini qayta hisoblang,
2. **Paint**: hamma narsa o'z joyida qanday ko'rinishini, jumladan, fon, ranglarni hisoblang,
3. **Composite**: yakuniy natijalarni ekranda piksellarga aylantiring, agar mavjud bo'lsa, CSS o'zgarishlarini qo'llang.

CSS animatsiyasi paytida bu jarayon har bir kadrni takrorlaydi. Biroq, hech qachon geometriya yoki joylashuvga ta'sir qilmaydigan CSS xususiyatlari, masalan, `color`, Layout bosqichini o'tkazib yuborishi mumkin. Agar `color` o'zgarsa, brauzer hech qanday yangi geometriyani hisoblamaydi, u Paint -> Composite-ga o'tadi. Va to'g'ridan-to'g'ri kompozitga o'tadigan bir nechta xususiyatlar mavjud. <https://csstriggers.com> saytida CSS xususiyatlarining uzunroq ro'yxatini va ular qaysi bosqichlarni ishga tushirishini topishingiz mumkin.

Ayniqsa ko'p elementlar va murakkab tartibli sahifalarda hisob-kitoblar ko'p vaqt talab qilishi mumkin. Va kechikishlar aslida ko'pchilik qurilmalarda ko'rinadi, bu esa "jittery", kamroq suyuqlik animatsiyalariga olib keladi.

Layout bosqichini o'tkazib yuboradigan xususiyatlarning animatsiyalari tezroq. Paint ham o'tkazib yuborilsa, yanada yaxshi bo'ladi.

`transform` xususiyati ajoyib tanlovdir, chunki:
- CSS konvertatsiyalari butun maqsadli element qutisiga ta'sir qiladi (aylantirish, aylantirish, cho'zish, siljitish).
- CSS o'zgarishlari hech qachon qo'shni elementlarga ta'sir qilmaydi.

...Shunday qilib, brauzerlar kompozit bosqichda mavjud Layout va Paint hisoblarining "ustiga" `transform` ni qo'llaydilar.

Boshqacha qilib aytadigan bo'lsak, brauzer Layout (o'lchamlar, pozitsiyalar) ni hisoblab chiqadi, uni Paint bosqichida ranglar, fonlar va hokazolar bilan bo'yaydi va keyin unga kerak bo'lgan element qutilariga `transform` ni qo'llaydi.

`Transform` xususiyatining o'zgarishlari (animatsiyalari) hech qachon Layout va Paint bosqichlarini ishga tushirmaydi. Bundan tashqari, brauzer CSSni o'zgartirish uchun grafik tezlatgichdan (CPU yoki grafik kartadagi maxsus chip) foydalanadi va shu bilan ularni juda samarali qiladi.

Yaxshiyamki, `transform` xususiyati juda kuchli. Elementda `transform` dan foydalanib, siz uni aylantirishingiz va aylantirishingiz, cho'zishingiz va kichraytirishingiz, harakatlantirishingiz mumkin va [ko'p] (https://developer.mozilla.org/docs/Web/CSS/transform#syntax ) ishlarni bajarsangiz bo'ladi. Shunday qilib, `left/margin-left` xususiyatlari o'rniga biz `transform: translateX(...)` dan, element hajmini oshirish uchun `transform: scale` dan foydalanishimiz mumkin va hokazo.

`opacity` xususiyati ham hech qachon Layoutni ishga tushirmaydi (shuningdek, Mozilla Geckoda Paintni o'tkazib yuboradi). Biz uni ko'rsatish/yashirish yoki o'chirish/yo'q qilish effektlari uchun ishlatishimiz mumkin.

`transform` ni `opacity` bilan ajratib ko'rsatish odatda bizning ehtiyojlarimizning ko'pini hal qilishi mumkin, bu esa silliq va chiroyli ko'rinishga ega.

Masalan, bu yerda `#boat` elementini bosish `transform: translateX(300)` va `opacity: 0` bilan sinfni qo'shadi va shu bilan uni `300px` o'ngga siljitadi va yo'qoladi:

```html run height=260 autorun no-beautify
<img src="https://js.cx/clipart/boat.png" id="boat">

<style>
#boat {
  cursor: pointer;
  transition: transform 2s ease-in-out, opacity 2s ease-in-out;
}

.move {
  transform: translateX(300px);
  opacity: 0;
}
</style>
<script>
  boat.onclick = () => boat.classList.add('move');
</script>
```

Mana, `@keyframes` bilan murakkabroq misol:

```html run height=80 autorun no-beautify
<h2 onclick="this.classList.toggle('animated')">click me to start / stop</h2>
<style>
  .animated {
    animation: hello-goodbye 1.8s infinite;
    width: fit-content;
  }
  @keyframes hello-goodbye {
    0% {
      transform: translateY(-60px) rotateX(0.7turn);
      opacity: 0;
    }
    50% {
      transform: none;
      opacity: 1;
    }
    100% {
      transform: translateX(230px) rotateZ(90deg) scale(0.5);
      opacity: 0;
    }
  }
</style>
```

## Xulosa

CSS animatsiyalari bir yoki bir nechta CSS xususiyatlarini muammosiz (yoki bosqichma-bosqich) animatsiyali o'zgartirishga imkon beradi.

Ular ko'p animatsiya vazifalari uchun yaxshi. Biz animatsiyalar uchun JavaScriptdan ham foydalanishimiz mumkin, keyingi bob shu mavzuga bag'ishlangan.

JavaScript animatsiyalariga nisbatan CSS animatsiyalarining cheklovlari:

```solishtiring: plyus="CSS animatsiyalari" minus="JavaScript animatsiyalari"
+ Oddiy ishlar oddiygina bajariladi.
+ CPU uchun tez va yengil.
- JavaScript animatsiyalari moslashuvchan. Ular elementning "portlashi" kabi har qanday animatsiya mantiqini amalga oshirishi mumkin.
- Faqat mulkiy o'zgarishlar emas, biz animatsiyaning bir qismi sifatida JavaScriptda yangi elementlar yaratishimiz mumkin.
```

Ushbu bobdagi dastlabki misollarda biz `font-size`, `left`, `width`, `height` va hokazolarni jonlantiramiz. Haqiqiy hayotdagi loyihalarda yaxshi ishlash uchun `transform: scale()` va `transform: translate()` ” funksiyalaridan foydalanishimiz kerak.

Ko'pgina animatsiyalarni ushbu bobda tavsiflanganidek CSS yordamida amalga oshirish mumkin. Va `transitionend` hodisasi JavaScriptni animatsiyadan keyin ishga tushirishga imkon beradi, shuning uchun u kod bilan yaxshi birlashadi.

Ammo keyingi bobda biz murakkabroq holatlarni yoritish uchun JavaScript animatsiyalarini yaratamiz.
