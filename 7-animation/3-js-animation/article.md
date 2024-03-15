# JavaScript animatsiyalari

JavaScript animatsiyalari CSS qila olmaydigan narsalarni boshqarishi mumkin.

Masalan, Bezier egri chizig'idan farqli vaqt funksiyasi yoki animatsiya bilan murakkab yo'l bo'ylab harakatlanish shular jumlasiga kiradi.

## setIntervaldan foydalanish

Animatsiya ramkalar ketma-ketligi sifatida amalga oshirilishi mumkin -- odatda HTML/CSS xususiyatlariga kichik o'zgarishlar kiritiladi.

Masalan, `style.left` ni `0px` dan `100px` ga o'zgartirish elementni siljitadi. Va agar biz uni `setInterval` da `2px` ga o'zgartirib, soniyasiga 50 marta kichik kechikish bilan oshirsak, u silliq ko'rinadi. Bu kinodagi kabi printsip: uni silliq ko'rinishi uchun soniyasiga 24 ta kadr yetarli.

Pseudo-kod quyidagicha ko'rinishi mumkin:

```js
let timer = setInterval(function() {
  if (animation complete) clearInterval(timer);
  else increase style.left by 2px
}, 20); // 2px ga har 20ms ga o'zgaradi, soniyada taxminan 50 ta frame
```

Animatsiyaning to'liq namunasi:

```js
let start = Date.now(); // boshlanish vaqtini eslab qoling

let timer = setInterval(function() {
  // boshlangandan beri qancha vaqt o'tdi?
  let timePassed = Date.now() - start;

  if (timePassed >= 2000) {
    clearInterval(timer); // 2 soniyadan keyin animatsiyani tugating
    return;
  }

  // Vaqt o'tishi bilan animatsiyani chizing
  draw(timePassed);

}, 20);

// 0 dan 2000 gacha bo'lgan vaqt o'tishi bilan
// chap 0px dan 400px gacha qiymatlarni oladi
function draw(timePassed) {
  train.style.left = timePassed / 5 + 'px';
}
```

Namunani ko'rish uchun quyidagi linkni bosing:

[codetabs height=200 src="move"]

## requestAnimationFrame dan foydalanish

Tasavvur qilaylik, bizda bir vaqtning o'zida bir nechta animatsiyalar ishlaydi.

Agar biz ularni alohida-alohida ishga tushiradigan bo'lsak, har birida `setInterval(..., 20)` bo'lsa ham, brauzer har `20ms`ga qaraganda tez-tez bo'yashga to'g'ri keladi.

Buning sababi, ular turli xil boshlanish vaqtlariga ega, shuning uchun "har 20 ms" turli animatsiyalar o'rtasida farq qiladi. Intervallar bir xil emas. Shunday qilib, biz `20ms` ichida bir nechta mustaqil urunishlarga ega bo'lamiz.

Boshqacha qilib aytganda, bu:

```js
setInterval(function() {
  animate1();
  animate2();
  animate3();
}, 20)
```

...Uchta mustaqil qo'ng'iroqdan osonroq:

```js
setInterval(animate1, 20); // mustaqil animatsiyalar
setInterval(animate2, 20); // skriptning turli qismlarida
setInterval(animate3, 20);
```

Brauzer uchun qayta chizishni osonlashtirish va shuning uchun CPU yukini kamroq yuklash hamda yumshoqroq ko'rinish uchun ushbu bir nechta mustaqil qayta chizmalar birgalikda guruhlangan bo'lishi kerak.

Yana bir narsani yodda tuting. Ba'zida protsessor haddan tashqari ko'p yuklanadi yoki kamroq qayta chizish uchun boshqa sabablar ham bor (masalan, brauzer yorlig'i yashiringanida), shuning uchun biz uni har 20 ms'da ishga tushirmasligimiz kerak.

Ammo JavaScriptda bu haqda qanday bilamiz? `requestAnimationFrame` funksiyasini ta'minlovchi [Animation timing](https://www.w3.org/TR/animation-timing/) spetsifikatsiyasi mavjud. Bu barcha va hatto biz o'ylagandan ham ko'proq muammolarni hal qiladi.

Sintaksis:
```js
let requestId = requestAnimationFrame(callback)
```

Bu brauzer animatsiya qilmoqchi bo'lganda, `callback` funksiyasini eng yaqin vaqtda ishga tushirishni rejalashtiradi.

Agar biz `callback` dagi elementlarda o'zgarishlar qilsak, ular boshqa `requestAnimationFrame` qo'ng'iroqlari va CSS animatsiyalari bilan birga guruhlanadi. Shunday qilib, ko'pchilik o'rniga bitta geometriyani qayta hisoblash va qayta bo'yash bo'ladi.

Qaytarilgan `requestId` qiymati qo'ng'iroqni bekor qilish uchun ishlatilishi mumkin:
```js
// qayta qo'ng'iroqning rejalashtirilgan bajarilishini bekor qilish
cancelAnimationFrame(requestId);
```

`callback` sahifa yuklanishining boshidan millisekundlarda o'tgan bitta vaqt argumentni oladi. Bu vaqtni [performance.now()](mdn:api/Performance/now) orqali ham olish mumkin.

Protsessor haddan tashqari yuklanmagan yoki noutbuk batareyasi deyarli zaryadsizlanmagan bo'lsa yoki boshqa sabab bo'lmasa, odatda `callback` tezda ishga tushadi.

Quyidagi kod `requestAnimationFrame` uchun dastlabki 10 ta ishga tushirish orasidagi vaqtni ko'rsatadi. Odatda bu 10-20 ms ni tashkil etadi:

```html run height=40 refresh
<script>
  let prev = performance.now();
  let times = 0;

  requestAnimationFrame(function measure(time) {
    document.body.insertAdjacentHTML("beforeEnd", Math.floor(time - prev) + " ");
    prev = time;

    if (times++ < 10) requestAnimationFrame(measure);
  })
</script>
```

## Strukturaviy animatsiya

Endi biz `requestAnimationFrame` asosida yanada universal animatsiya funksiyasini yaratishimiz mumkin:

```js
function animate({timing, draw, duration}) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction 0 dan 1 gacha boradi
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    //joriy animatsiya holatini hisoblang
    let progress = timing(timeFraction)

    draw(progress); // uni chizing

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}
```

`animate` funksiyasi animatsiyani mohiyatan tavsiflovchi 3 ta parametrni qabul qiladi:

`duration`
: Animatsiyaning umumiy vaqti. `1000` kabi.

`timing(timeFraction)`
: Vaqt funksiyasi, masalan, o'tgan vaqtning ulushini (boshlanishda `0`, oxirida `1`) oladigan va animatsiya tugallanishini (Bezier egri chizig'idagi `y` kabi) qaytaruvchi `transition-timing-function` kabi CSS xususiyati hisoblanadi.

    Masalan, chiziqli funksiya animatsiya bir xil tezlikda davom etishini anglatadi:
    
    ```js
    function linear(timeFraction) {
      return timeFraction;
    }
    ```

    Uning chizmasi:
    ![](linear.svg)

    Bu xuddi `transition-timing-function: linear` kabi. Quyida ko'rsatilgan qiziqarli variantlar mavjud.

`draw(progress)`
: Animatsiya tugallanish holatini qabul qiluvchi va uni chizuvchi funksiya. `Progress=0` qiymati animatsiyaning boshlanish holatini, `progress=1` esa yakuniy holatni bildiradi.

    Bu aslida animatsiyani chiqaradigan funksiya.

    U elementni siljitishi mumkin:
    ```js
    function draw(progress) {
      train.style.left = progress + 'px';
    }
    ```

    ...Yoki boshqa biror narsa qiling, biz har qanday narsani, har qanday tarzda jonlantirishimiz mumkin.

Funksiyamizdan foydalanib, `width` elementini `0` dan `100%` gacha jonlantiramiz.

Demo uchun elementni bosing:

[codetabs height=60 src="width"]

U uchun maxsus kod:

```js
animate({
  duration: 1000,
  timing(timeFraction) {
    return timeFraction;
  },
  draw(progress) {
    elem.style.width = progress * 100 + '%';
  }
});
```

CSS animatsiyasidan farqli o'laroq, biz bu yerda har qanday vaqt funksiyasini va istalgan chizma funksiyasini bajarishimiz mumkin. Vaqt funksiyasi Bezier egri chiziqlari bilan cheklanmaydi. Va `draw` xususiyatlardan tashqariga chiqishi, olovli animatsiya yoki boshqa narsalar uchun yangi elementlar yaratishi mumkin.

## Vaqt funksiyalari

Biz yuqorida eng oddiy, chiziqli vaqt funksiyasini ko'rdik.

Keling, ularni ko'proq ko'rib chiqaylik. Ular qanday ishlashini ko'rish uchun turli vaqt funksiyalariga ega harakat animatsiyalarini sinab ko'ramiz.

### N ning darajasi

Agar biz animatsiyani tezlashtirmoqchi bo'lsak, `n` darajasida `progress` dan foydalanishimiz mumkin.

Masalan, parabolik egri chiziq:

```js
function quad(timeFraction) {
  return Math.pow(timeFraction, 2)
}
```

Chizma:

![](quad.svg)

Namunalarni amalda ko'rib chiqing (faollashtirish uchun bosing):

[iframe height=40 src="quad" link]

...Yoki kubik egri chiziq yoki undan ham kattaroq `n`. Darajani oshirish uni yanayam tezlashtiradi.

Mana `5` darajasidagi `progress` grafigi:

![](quint.svg)

Amalda:

[iframe height=40 src="quint" link]

### Yoy (the arc)

Funksiya:

```js
function circ(timeFraction) {
  return 1 - Math.sin(Math.acos(timeFraction));
}
```

Chizma:

![](circ.svg)

[iframe height=40 src="circ" link]

### Back: kamondan otish (bow shooting)

Bu funksiya "kamon otish" ni bajaradi. Avval biz "kamonni tortamiz", keyin esa "otamiz".

Oldingi funksiyalardan farqli o'laroq, u qo'shimcha `x` parametriga, "elastiklik koeffitsientiga" bog'liq. "Kamonni tortish" masofasi u bilan belgilanadi.

Kod:

```js
function back(x, timeFraction) {
  return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x)
}
```

**`x = 1.5` uchun chizma:**

![](back.svg)

Animatsiya uchun biz uni `x` qiymati bilan ishlatamiz. `x = 1,5` uchun misol:

[iframe height=40 src="back" link]

### Sakrash

Tasavvur qiling, biz to'pni tashlayapmiz. U pastga tushadi, keyin bir necha marta orqaga qaytib, to'xtaydi.

`Bounce` funksiyasi ham xuddi shunday qiladi, lekin teskari tartibda: "sakrash" darhol boshlanadi. Buning uchun bir nechta maxsus koeffitsientlardan foydalaniladi:

```js
function bounce(timeFraction) {
  for (let a = 0, b = 1; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
    }
  }
}
```

Amalda:

[iframe height=40 src="bounce" link]

### Elastik animatsiya

"Boshlang'ich diapazon" uchun qo'shimcha `x` parametrini qabul qiluvchi yana bir "elastik" funksiya.

```js
function elastic(x, timeFraction) {
  return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction)
}
```

**`x=1.5` uchun chizma:**
![](elastic.svg)

`x=1.5` uchun namuna:

[iframe height=40 src="elastic" link]

## Orqaga qaytarish: osonlik*

Shunday qilib, bizda vaqt funksiyalari to'plami mavjud. Ularning bevosita qo'llanilishi "easeIn" deb ataladi.

Ba'zan biz animatsiyani teskari tartibda ko'rsatishimiz kerak. Bu "easeOut" transformatsiyasi bilan amalga oshiriladi.

### easeOut

"EaseOut" rejimida `timing` funksiyasi `timingEaseOut` o'ramiga qo'yiladi:

```js
timingEaseOut(timeFraction) = 1 - timing(1 - timeFraction)
```

Boshqacha qilib aytadigan bo'lsak, bizda "odatiy" vaqt funksiyasini oladigan va uning atrofidagi o'ramni qaytaradigan "o'zgartirish" funksiyasi `makeEaseOut` mavjud:

```js
// vaqt funksiyasini qabul qiladi, o'zgartirilgan variantni qaytaradi
function makeEaseOut(timing) {
  return function(timeFraction) {
    return 1 - timing(1 - timeFraction);
  }
}
```

Misol uchun, biz yuqorida tavsiflangan `bounce` funksiyasini olib, uni qo'llashimiz mumkin:

```js
let bounceEaseOut = makeEaseOut(bounce);
```

Keyin sakrash animatsiyaning boshida emas, balki oxirida bo'ladi. Bundan ham yaxshiroq ko'rinadi:

[codetabs src="bounce-easeout"]

Bu yerda transformatsiya funksiyaning harakatini qanday o'zgartirishini ko'rishimiz mumkin:

![](bounce-inout.svg)

Agar boshida animatsiya effekti bo'lsa, masalan, sakrash -- u oxirida ko'rsatiladi.

Yuqoridagi grafikda <span style="color:#EE6B47">muntazam sakrash</span> qizil rangga ega va <span style="color:#62C0DC">easeOut sakrash</span> ko'k rangda berilgan.

- Muntazam sakrash -- obyekt pastdan sakraydi, so'ng oxirida keskin yuqoriga sakrab chiqadi.
- `easeOut` dan so'ng -- avval tepaga sakrab chiqadi, so'ng u yerga sakraydi.

### easeInOut

Effektni animatsiyaning boshida ham, oxirida ham ko'rsatishimiz mumkin. Transformatsiya "easeInOut" deb nomlanadi.

Vaqt funksiyasini hisobga olgan holda, biz animatsiya holatini quyidagicha hisoblaymiz:

```js
if (timeFraction <= 0.5) { // animatsiyaning birinchi yarmi
  return timing(2 * timeFraction) / 2;
} else { // animatsiyaning ikkinchi yarmi
  return (2 - timing(2 * (1 - timeFraction))) / 2;
}
```

O'rovchi kod:

```js
function makeEaseInOut(timing) {
  return function(timeFraction) {
    if (timeFraction < .5)
      return timing(2 * timeFraction) / 2;
    else
      return (2 - timing(2 * (1 - timeFraction))) / 2;
  }
}

bounceEaseInOut = makeEaseInOut(bounce);
```

`bounceEaseInOut` ning amalda qo'llanilishi:

[codetabs src="bounce-easeinout"]

"EaseInOut" transformatsiyasi ikkita grafikni bittaga birlashtiradi: animatsiyaning birinchi yarmi uchun `easeIn` (muntazam) va ikkinchi qismi uchun `easeOut` (teskari).

Vaqtni belgilash funksiyasining `easeIn`, `easeOut` va `easeInOut` grafiklarini solishtirsak, samara aniq ko'rinadi:

![](circ-ease.svg)

- <span style="color:#EE6B47">Red</span> `circ` ning doimiy varianti(`easeIn`).
- <span style="color:#8DB173">Green</span> -- `easeOut`.
- <span style="color:#62C0DC">Blue</span> -- `easeInOut`.

Ko'rib turganimizdek, animatsiyaning birinchi yarmining grafigi kichraytirilgan `easeIn`, ikkinchi yarmi esa kichraytirilgan `easeOut`. Natijada, animatsiya xuddi shunday effekt bilan boshlanadi va tugaydi.

## Yanada qiziqroq "draw"

Elementni ko'chirish o'rniga biz boshqa biror narsa qilishimiz mumkin. Bizga kerak bo'lgan narsa - to'g'ri chizilgan `draw` ni yozish.

Bu yerda jonlantirilgan "sakrab" matn terish ko'rsatilgan:

[codetabs src="text"]

## Xulosa

CSS yaxshi ishlay olmaydigan yoki qattiq nazoratga muhtoj bo'lgan animatsiyalar uchun JavaScript yordam berishi mumkin. JavaScript animatsiyalari `requestAnimationFrame` orqali amalga oshirilishi kerak. Ushbu o'rnatilgan usul brauzer qayta bo'yashni tayyorlayotganda ishga tushirish uchun qayta qo'ng'iroq qilish funksiyasini sozlash imkonini beradi. Odatda bu juda tez ishlaydi, lekin aniq vaqt brauzerga bog'liq.

Agar sahifa fonda bo'lsa, qayta bo'yash umuman bo'lmaydi, shuning uchun qayta qo'ng'iroq bajarilmaydi: animatsiya to'xtatiladi va resurslarni iste'mol qilmaydi. Bu judayam ajoyib

Ko'pgina animatsiyalarni o'rnatish uchun yordamchi `animate` funksiyasi:

```js
function animate({timing, draw, duration}) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction 0 dan 1 gacha boradi
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // joriy animatsiya holatini hisoblang
    let progress = timing(timeFraction);

    draw(progress); // uni chizing

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}
```

Variantlar:

- `duration` -- ms dagi jami animatsiya vaqti.
- `timing` -- animatsiya jarayonini hisoblash funksiyasi. 0 dan 1 gacha bo'lgan vaqt kasrini oladi, odatda 0 dan 1 gacha animatsiya jarayonini qaytaradi.
- `draw` -- animatsiyani chizish funksiyasi.

Albatta, biz uni yaxshilashimiz, qo'ng'iroq va hushtaklarni qo'shishimiz mumkin edi, lekin JavaScript animatsiyalari har kuni qo'llanilmaydi. Ular qiziqarli va nostandart narsalarni qilish uchun ishlatiladi. Shunday qilib, kerak bo'lganda kerakli xususiyatlarni qo'shishni xohlaysiz.

JavaScript animatsiyalari har qanday vaqt funksiyasidan foydalanishi mumkin. Biz ularni yanada ko'p qirrali qilish uchun ko'plab misollar va o'zgarishlarni ko'rib chiqdik. CSSdan farqli o'laroq, biz bu yerda Bezier egri chiziqlari bilan cheklanmaymiz.

Xuddi shu narsa `draw` haqida: biz faqat CSS xususiyatlarini emas, balki hamma narsani jonlantirishimiz mumkin.
