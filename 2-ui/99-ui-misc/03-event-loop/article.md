
# Voqealar tsikli: mikrovazifalar va makrovazifalar

Brauzer JavaScriptdagi bajarish oqimi, shuningdek, Node.js da *voqea tsikli* (event loop) ga asoslangan.

Voqealar tsiklining qanday ishlashini tushunishni optimallashtirish uchun, ba'zan esa to'g'ri arxitektura uchun muhimdir.

Ushbu bobda biz birinchi navbatda narsalar qanday ishlashi haqida nazariy tafsilotlarni ko'rib chiqamiz va keyin bu bilimlarning amaliy qo'llanilishini ko'rib chiqamiz.

## Event Loop

*Event loop* tushunchasi juda oddiy. JavaScript dvigateli vazifalarni kutadi, ularni bajaradi va keyin uxlab, ko'proq vazifalarni kutadigan cheksiz tsikl mavjud.

Dvigatelning umumiy algoritmi:

1. Vazifalar mavjud bo'lganda:
     - eng avvalgi vazifadan boshlab ularni bajaring.
2. Vazifa paydo bo'lguncha uxlab turing, keyin 1 ga o'ting.

Bu sahifani ko'zdan kechirib biz ko'rgan narsalarimizning rasmiylashtirilishiga guvoh bo'lamiz. JavaScript mexanizmi ko'pincha hech narsa qilmaydi, u faqat skript/ishlab chiqaruvchi/hodisa faollashtirilganda ishlaydi.

Topshiriqlar namunalari:

- `<script src="...">` tashqi skript yuklanganda vazifa uni bajarishdan iborat.
- Foydalanuvchi sichqonchani harakatlantirganda, vazifa `mousemove` hodisasini jo'natish va ishlov beruvchilarni bajarishdir.
- Belgilangan `setTimeout` uchun vaqt tugagach, vazifa uni qayta chaqirishni amalga oshirishdir.
- ...va hokazo.

Vazifalar o'rnatildi -- dvigatel ularni boshqaradi -- keyin ko'proq vazifalarni kutadi (uyqu paytida va nolga yaqin protsessorni iste'mol qilishda).

Dvigatel band bo'lganda vazifa kelib, keyin navbatga qo'yilishi mumkin.

Vazifalar "makrotasklar navbati" deb ataladigan navbatni hosil qiladi (v8 atamasi):

![](eventLoop.svg)

Masalan, vosita `script` ni bajarish bilan band bo'lganida, foydalanuvchi sichqonchani siljitib, `mousemove` ga olib kelishi, `setTimeout` vaqti bo'lishi mumkin va hokazo, bu vazifalar yuqoridagi rasmda ko'rsatilganidek, navbat hosil qiladi.

Navbatdagi topshiriqlar "birinchi kelgan - birinchi xizmat qiladi" tamoyili bo'yicha ko'rib chiqiladi. Dvigatel brauzeri `script` bilan bajarilganda, u `mousemove` hodisasini, keyin `setTimeout` ishlov beruvchisini va hokazolarni boshqaradi.

Hozircha, juda oddiy, shunday emasmi?

Yana ikkita tafsilot:
1. Dvigatel vazifani bajarayotganda renderlash hech qachon sodir bo'lmaydi. Vazifaning uzoq davom etishi muhim emas. DOMga o'zgartirishlar faqat topshiriq tugagandan so'ng kiritiladi.
2. Agar vazifa juda uzoq davom etsa, brauzer foydalanuvchi hodisalarini qayta ishlash kabi boshqa vazifalarni bajara olmaydi. Shunday qilib, bir muncha vaqt o'tgach, u "Sahifa javob bermayapti" kabi ogohlantirishni ko'taradi va bu vazifani butun sahifa bilan o'ldirishni taklif qiladi. Bu juda ko'p murakkab hisob-kitoblar yoki cheksiz tsiklga olib keladigan dasturlash xatosi mavjud bo'lganda sodir bo'ladi.

Bu nazariya edi. Keling, bu bilimlarni qanday qo'llash mumkinligini ko'rib chiqaylik.

## 1-holat: protsessor talab qiladigan vazifalarni ajratish

Aytaylik, bizda protsessor talab qiladigan vazifa bor.

Misol uchun, sintaksisni ta'kidlash (ushbu sahifadagi kod misollarini ranglash uchun ishlatiladi) protsessor uchun juda og'ir. Kodni ajratib ko'rsatish uchun u tahlilni amalga oshiradi, ko'plab rangli elementlarni yaratadi, ularni ko'p vaqt talab qiladigan katta hajmdagi matn uchun hujjatga qo'shadi.

Dvigatel sintaksisni ajratib ko'rsatish bilan band bo'lsa-da, u boshqa DOM bilan bog'liq narsalarni bajara olmaydi, foydalanuvchi hodisalarini va hokazolarni qayta ishlay olmaydi. Bu hatto brauzerni biroz vaqtga "hiccib" qilishi yoki hatto "osilib qolishiga" olib kelishi mumkin, bu qabul qilinishi mumkin emas.

Katta ishni qismlarga bo'lish orqali muammolardan qochishimiz mumkin. Dastlabki 100 qatorni ajratib ko'rsating, so'ngra keyingi 100 qator uchun `setTimeout` ni (nol kechikish bilan) rejalashtiring va hokazo.

Ushbu yondashuvni ko'rsatish uchun soddalik uchun matnni ajratib ko'rsatish o'rniga `1` dan `1000000000` gacha hisoblangan funksiyani olaylik.

Agar siz quyidagi kodni ishlatsangiz, vosita bir muncha vaqt "osilib qoladi". Server tomonidagi JS uchun bu yaqqol seziladi va agar siz uni brauzerda ishlatayotgan bo'lsangiz, sahifadagi boshqa tugmalarni bosishga harakat qiling -- sanash tugaguniga qadar boshqa hech qanday hodisalar ko'rib chiqilmasligini ko'rasiz.

```js run
let i = 0;

let start = Date.now();

function count() {

  // qiyin ishlarni qiling
  for (let j = 0; j < 1e9; j++) {
    i++;
  }

  alert("Done in " + (Date.now() - start) + 'ms');
}

count();
```

Brauzer hatto "skript juda uzoq vaqt oladi" degan ogohlantirishni ham ko'rsatishi mumkin.

Keling, o'rnatilgan `setTimeout` qo'ng'iroqlari yordamida ishni ajratamiz:

```js run
let i = 0;

let start = Date.now();

function count() {

  // qiyin ishning bir qismini bajaring (*)
  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("Done in " + (Date.now() - start) + 'ms');
  } else {
    setTimeout(count); // yangi qo'ng'iroqni rejalashtiring (**)
  }

}

count();
```

Endi brauzer interfeysi "hisoblash" jarayonida to'liq ishlaydi.

Bitta `count` ishning bir qismini `(*)` bajaradi va agar kerak bo'lsa, o'zini `(**)` rejalashtiradi:

1. Birinchi yugurish hisobi: `i=1...1000000`.
2. Ikkinchi yugurish hisobi: `i=1000001..2000000`.
3. ...va boshqalar.

Agar dvigatel 1-qismni bajarish bilan band bo'lsa, yangi yon vazifa (masalan, `onclick` hodisasi) paydo bo'lsa, u navbatga qo'yiladi va 1-qism tugagach, keyingi qismdan oldin bajariladi. Vaqti-vaqti bilan `count` ijrosi orasidagi voqealar davriga qaytish JavaScript dvigatelining boshqa biror ishni bajarishi, foydalanuvchining boshqa harakatlariga munosabat bildirishi uchun yetarlicha "havo" beradi.

Shunisi e'tiborga loyiqki, ikkala variant ham -- ishni `setTimeout` ga bo'lishsiz va bo'lmasdan - tezlik bo'yicha solishtirish mumkin. Umumiy hisoblash vaqtida unchalik katta farq yo'q.

Ularni yaqinroq qilish uchun keling, yaxshilanishni amalga oshiraylik.

Biz rejalashtirishni `count()` boshiga o'tkazamiz:

```js run
let i = 0;

let start = Date.now();

function count() {

  // rejalashtirishni boshiga o'tkazing
  if (i < 1e9 - 1e6) {
    setTimeout(count); // yangi qo'ng'iroqni rejalashtiring
  }

  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("Done in " + (Date.now() - start) + 'ms');
  }

}

count();
```

Endi biz `count()` hisoblashni boshlaganimizda va ko'proq `count()` qilishimiz kerakligini ko'rganimizda, ishni bajarishdan oldin buni darhol rejalashtiramiz.

Agar siz uni ishga tushirsangiz, bu sezilarli darajada kamroq vaqt talab qilishini sezish oson.

Nega?

Bu juda oddiy: eslaganingizdek, ko'plab `setTimeout` qo'ng'iroqlari uchun brauzerda minimal kechikish 4 ms bo'ladi. `0` ni o'rnatgan bo'lsak ham, u `4ms` (yoki biroz ko'proq). Shunday qilib, biz uni qanchalik erta rejalashtirsak, u shunchalik tez ishlaydi.

Nihoyat, biz protsessor talab qiladigan vazifani qismlarga ajratdik – endi u foydalanuvchi interfeysini bloklamaydi. Va uning umumiy bajarilish muddati unchalik uzoq emas.

## Foydalanish holati 2: taraqqiyot ko'rsatkichi

Brauzer skriptlari uchun og'ir vazifalarni ajratishning yana bir afzalligi shundaki, biz taraqqiyot ko'rsatkichini ko'rsatishimiz mumkin.

Yuqorida aytib o'tilganidek, DOM-ga o'zgartirishlar, qancha vaqt ketishidan qat'iy nazar, joriy ish bajarilgandan keyingina bo'yaladi.

Bir tomondan, bu juda yaxshi, chunki bizning funksiyamiz ko'plab elementlarni yaratishi, ularni birma-bir hujjatga qo'shishi va uslublarini o'zgartirishi mumkin - tashrif buyuruvchi hech qanday "oraliq", tugallanmagan holatni ko'rmaydi. Muhim narsa, to'g'rimi?

Mana namuna, `i` dagi o'zgartirishlar funksiya tugamaguncha ko'rinmaydi, shuning uchun biz faqat oxirgi qiymatni ko'ramiz:


```html run
<div id="progress"></div>

<script>

  function count() {
    for (let i = 0; i < 1e6; i++) {
      i++;
      progress.innerHTML = i;
    }
  }

  count();
</script>
```

...Ammo biz ham vazifa davomida biror narsani ko'rsatishni xohlashimiz mumkin, masalan. taraqqiyot paneli.

Agar biz og'ir vazifani `setTimeout` yordamida qismlarga ajratsak, o'zgarishlar ularning orasiga bo'yalgan bo'ladi.

Bu yanada chiroyliroq ko'rinadi:

```html run
<div id="progress"></div>

<script>
  let i = 0;

  function count() {

    // og'ir ishning bir qismini bajaring (*)
    do {
      i++;
      progress.innerHTML = i;
    } while (i % 1e3 != 0);

    if (i < 1e7) {
      setTimeout(count);
    }

  }

  count();
</script>
```

Endi `<div>` `i` ning ortib borayotgan qiymatlarini ko'rsatadi, bu o'ziga xos taraqqiyot satri.

## 3-holatdan foydalaning: voqeadan keyin biror narsa qilish

Voqeani qayta ishlovchida biz ba'zi harakatlarni hodisa ko'tarilguncha va barcha darajalarda ko'rib chiqilguncha qoldirishga qaror qilishimiz mumkin. Biz buni kodni nol kechikish `setTimeout` bilan o'rash orqali amalga oshiramiz.

<info:dispatch-events> bobida biz bir misolni ko'rdik: maxsus hodisa `menyu-open` `setTimeout` da yuboriladi, shuning uchun u "click" hodisasi to'liq ishlov berilgandan keyin sodir bo'ladi.

```js
menu.onclick = function() {
  // ...

  // bosilgan menyu elementi ma'lumotlari bilan maxsus hodisa yarating
  let customEvent = new CustomEvent("menu-open", {
    bubbles: true
  });

  // moslashtirilgan hodisani asinxron tarzda yuboring
  setTimeout(() => menu.dispatchEvent(customEvent));
};
```

## Makrovazifalar va mikrovazifalar

Ushbu bobda tasvirlangan *makrovazifalar* bilan bir qatorda <info:microtask-queue> bobida eslatib o'tilgan *mikrotopshiriqlar* ham mavjud.

Mikrotasklar faqat bizning kodimizdan keladi. Ular odatda promise lar orqali yaratiladi: `.then/catch/finally` ishlov beruvchisining bajarilishi mikrotaskga aylanadi. Mikrovazifalar `await` so'zi bilan ham qo'llaniladi, chunki bu promise larni bajarishning yana bir shakli.

Shuningdek, mikrovazifalar navbatida bajarish uchun `func` ni navbatga qo'yuvchi maxsus `queueMicrotask(func)` funksiyasi ham mavjud.

**Har bir *makrovazifa* dan so'ng, vosita boshqa makrotopshiriqlar, renderlash yoki boshqa biror narsani ishga tushirishdan oldin *mikrovazifa* navbatdagi barcha vazifalarni darhol bajaradi.**

Masalan, qarang:

```js run
setTimeout(() => alert("timeout"));

Promise.resolve()
  .then(() => alert("promise"));

alert("code");
```

Bu yerda qanday tartib bo'ladi?

1. `code` birinchi navbatda ko'rsatiladi, chunki bu oddiy sinxron qo'ng'iroq.
2. `promise` ikkinchi o'rinni ko'rsatadi, chunki `.then` mikrovazifalar qatoridan o'tadi va joriy koddan keyin ishlaydi.
3. `timeout` oxirgi marta ko'rsatiladi, chunki bu makrotopshiriq.

Voqealar siklining yanada boy tasviri quyidagicha ko'rinadi (tartib yuqoridan pastgacha, ya'ni: avval skript, keyin mikrovazifalar, renderlash va hokazo):

![](eventLoop-full.svg)

Barcha mikrovazifalar boshqa hodisalarni qayta ishlash, ko'rsatish yoki boshqa har qanday makrotask amalga oshirilishidan oldin bajariladi.

Bu juda muhim, chunki u mikrotopshiriqlar o'rtasida dastur muhiti asosan bir xil bo'lishini kafolatlaydi (sichqoncha koordinatasi o'zgarmasligi, yangi tarmoq ma'lumotlari va boshqalar).

Agar biz funksiyani asinxron tarzda (joriy koddan keyin) bajarishni istasak, lekin o'zgarishlar kiritilgunga qadar yoki yangi hodisalarni qayta ishlashdan oldin, biz uni `queueMicrotask` yordamida rejalashtirishimiz mumkin.

Bu yerda oldingi ko'rsatilganga o'xshash "hisoblash jarayoni satri" misoli keltirilgan, lekin `setTimeout` o'rniga `queueMicrotask` ishlatiladi. Ko'rish mumkinki, u xuddi sinxron kod kabi eng oxirida taqdim etiladi: 

```html run
<div id="progress"></div>

<script>
  let i = 0;

  function count() {

    // og'ir ishning bir qismini bajaring (*)
    do {
      i++;
      progress.innerHTML = i;
    } while (i % 1e3 != 0);

    if (i < 1e6) {
  *!*
      queueMicrotask(count);
  */!*
    }

  }

  count();
</script>
```

## Xulosa

Batafsilroq hodisa tsikli algoritmi ([spetsifikatsiya] (https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model) bilan solishtirganda anchagina soddalashtirilgan):

1. *Makrovazifa* navbatdagi eng eski vazifani (masalan, "skript") o'chiring va ishga tushiring.
2. Barcha *mikrovazifalarni* bajaring:
     - Mikrovazifa navbati bo'sh bo'lmasa:
         - Eng qadimgi mikrovazifani o'chiring va ishga tushiring.
3. Agar mavjud bo'lsa, o'zgarishlarni ko'rsating.
4. Agar vazifa navbati bo'sh bo'lsa, makrotopshiriq paydo bo'lguncha kuting.
5. 1-bosqichga o'ting.

Yangi *makrovazifani* rejalashtirish uchun:
- Nol kechiktirilgan `setTimeout(f)` dan foydalaning.

Bu brauzer foydalanuvchi voqealariga munosabat bildira olishi va ular orasidagi taraqqiyotni ko'rsatishi uchun katta hisob-kitob ishlarini qismlarga bo'lish uchun ishlatilishi mumkin.

Bundan tashqari, voqea to'liq ko'rib chiqilgandan so'ng (bubbling tugallangandan) keyin harakatni rejalashtirish uchun voqea ishlov beruvchilarida foydalaniladi.

Yangi *mikrovazifani* rejalashtirish uchun
- `queueMicrotask(f)` dan foydalaning.
- Shuningdek, promise handler lar mikrovazifalar qatoriga o'tadi.

Mikrovazifalar o'rtasida foydalanuvchi interfeysi yoki tarmoq hodisalarini boshqarish yo'q: ular birin-ketin ishlaydi.

Shunday qilib, funksiyani asinxron, lekin muhit holatida bajarish uchun `queueMicrotask`ni qo'yishni xohlashingiz mumkin.

```smart header="Web Workers"
Voqealar davrini bloklamasligi kerak bo'lgan uzoq og'ir hisoblar uchun biz [Web Workers] (https://html.spec.whatwg.org/multipage/workers.html) dan foydalanishimiz mumkin.

Bu boshqa parallel oqimda kodni ishlatishning bir usuli.

Veb ishchilari asosiy jarayon bilan xabarlar almashishlari mumkin, lekin ularning o'z o'zgaruvchilari va o'z voqealar tsikli mavjud.

Veb ishchilari DOM-ga kirish imkoniga ega emaslar, shuning uchun ular asosan hisob-kitoblar uchun bir vaqtning o'zida bir nechta CPU yadrolaridan foydalanish uchun foydalidir.
```
