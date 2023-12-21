

# Tanishtiruv: callbacks (qayta chaqiruvlar)

```warn header="Biz bu yerdagi misollarda brauzer usullaridan foydalanamiz"
Qayta chaqiruvlar, va'dalar va boshqa mavhum tushunchalardan foydalanishni ko'rsatish uchun biz brauzerning ba'zi usullaridan foydalanamiz: xususan, skriptlarni yuklash va oddiy hujjatlarni manipulyatsiya qilish kabilar bunga misol bo'ladi.

Agar siz ushbu usullar bilan tanish bo'lmasangiz va ularning misollarda qo'llanilishi sizni chalkashtirsa, siz o'quv qo'llanmaning [keyingi qismi](/hujjat) dan bir necha bobni o'qib chiqishingiz mumkin.

Shunga qaramay, biz baribir narsalarni aniqlashtirishga harakat qilamiz. Brauzerda juda murakkab narsa bo'lmaydi.
```

Ko'p funksiyalar *asinxron* harakatlarni rejalashtirish imkonini beruvchi JavaScript xost muhitlari tomonidan taqdim etiladi. Boshqacha qilib aytadigan bo'lsak, biz hozir boshlayotgan harakatlar keyinroq tugaydi.

Masalan, shunday funksiyalardan biri `setTimeout` funksiyasidir.

Asinxron harakatlarning boshqa real misollari mavjud, masalan, skriptlar va modullarni yuklash (ularni keyingi boblarda ko'rib chiqamiz).

Berilgan `src` bilan skriptni yuklaydigan `loadScript(src)` funksiyasini ko'rib chiqing:

```js
function loadScript(src) {
  // <script> tegini yaratadi va uni sahifaga qo'shadi
  // bu berilgan src bilan skriptni yuklashni boshlaydi va tugallangach ishga tushadi
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}
```

U hujjatga yangi, dinamik ravishda yaratilgan, berilgan `src` bilan `<script src="...">` tegini kiritadi. Brauzer uni avtomatik ravishda yuklashni boshlaydi va tugallangandan keyin ishlaydi.

Biz ushbu funksiyadan quyidagicha foydalanishimiz mumkin:
```js
// berilgan yo'lda skriptni yuklang va bajaring
loadScript('/my/script.js');
```

Skript "asinxron" bajariladi, chunki u hozir yuklashni boshlaydi, lekin funksiya allaqachon tugaganidan keyin ishlaydi.

Agar `loadScript(...)` ostida biron-bir kod bo'lsa, u skriptni yuklashni tugatishini kutmaydi.

```js
loadScript('/my/script.js');
// loadScript ostidagi kod
// skript yuklanishi tugashini kutmaydi
// ...
```

Aytaylik, yangi skript yuklanishi bilanoq foydalanishimiz kerak. U yangi funktsiyalarni e'lon qiladi va biz ularni ishga tushirishni xohlaymiz.

Ammo buni `loadScript(...)` chaqiruvidan keyin darhol qilsak, bu ishlamaydi:

```js
loadScript('/my/script.js'); // skriptda "newFunction() {...} funksiyasi mavjud"

*!*
newFunction(); // bunday funksiya yo'q
*/!*
```

Tabiiyki, brauzerda skriptni yuklash uchun vaqt yo'q edi. Hozircha `loadScript` funksiyasi yuklamaning tugallanishini kuzatish usulini taqdim etmaydi. Skript yuklanadi va oxir-oqibat ishlaydi, hammasi shu. Lekin biz bu qachon sodir bo'lishini bilishni, ushbu skriptdagi yangi funksiyalar va o'zgaruvchilardan foydalanishni xohlaymiz.

Skript yuklanganda bajarilishi kerak bo'lgan `loadScript` ga ikkinchi argument sifatida `callback` funksiyasini qo'shamiz:

```js
function loadScript(src, *!*callback*/!*) {
  let script = document.createElement('script');
  script.src = src;

*!*
  script.onload = () => callback(script);
*/!*

  document.head.append(script);
}
```

`Onload` hodisasi <info:onload-onerror#loading-a-script> maqolasida tasvirlangan, u asosan skript yuklangandan va bajarilgandan so'ng funksiyani bajaradi.

Endi biz skriptdan yangi funksiyalarni chaqirmoqchi bo'lsak, buni callback' ka yozishimiz kerak:

```js
loadScript('/my/script.js', function() {
  // qayta qo'ng'iroq skript yuklangandan keyin ishlaydi
  newFunction(); // demak endi bu ishlaydi
  ...
});
```

Asosiy fikr: ikkinchi argument vazifa tugallanganidan keyin ishlaydigan funksiya (odatda anonim) hisoblanadi.

Mana haqiqiy skript bilan ishlaydigan misol:
```js run
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;
  script.onload = () => callback(script);
  document.head.append(script);
}

*!*
loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', script => {
  alert(`Cool, the script ${script.src} is loaded`);
  alert( _ ); // _ yuklangan skriptda e'lon qilingan funksiyadir
});
*/!*
```

Bu asinxron dasturlashning "callback' ka asoslangan" uslubi deb ataladi. Biror narsani asinxron tarzda bajaradigan funktsiya "callback" argumentini taqdim etishi kerak, bu yerda biz funksiyani tugallangandan keyin ishga tushiramiz.

Bu yerda biz buni `loadScript` da qildik, lekin, albatta, bu umumiy yondashuv edi.

## Callback da callback usulini amalga oshirish

Qanday qilib ikkita skriptni ketma-ket yuklashimiz mumkin: birinchisidan boshlash kerakmi yoki ikkinchisidanmi?

Tabiiy yechim ikkinchi `loadScript` qo'ng'iroqni qayta qo'ng'iroqqa qo'yish bo'ladi, masalan:

```js
loadScript('/my/script.js', function(script) {

  alert(`Cool, the ${script.src} yuklangan, yana bitta yuklaymiz`);

*!*
  loadScript('/my/script2.js', function(script) {
    alert(`Ajoyib, ikkinchi skript yuklandi`);
  });
*/!*

});
```

Tashqi `loadScript` tugallangandan so'ng, callback ichki callbackni boshlaydi.

Yana bitta skriptni xohlayapmiz, nima bo'ladi...?

```js
loadScript('/my/script.js', function(script) {

  loadScript('/my/script2.js', function(script) {

*!*
    loadScript('/my/script3.js', function(script) {
      // ...barcha skriptlar yuklangandan keyin davom eting
    });
*/!*

  });

});
```

Shunday qilib, har bir yangi harakat callback ichida joylashgan. Bu bir nechta amallar uchun yaxshi, lekin ko'pchilik uchun ma'qul emas, shuning uchun tez orada boshqa variantlarni ko'ramiz.

## Xatolarni nazorat qilish

Yuqoridagi misollarda biz xatolarni hisobga olmadik. Agar skript yuklanmasa nima bo'ladi? Bizning callback'larimiz bunga javob berishi kerak.
Bu yerda yuklash xatolarini kuzatuvchi `loadScript` ning takomillashtirilgan versiyasi:

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

*!*
  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`${src}` uchun skriptni yuklash xatosi));
*/!*

  document.head.append(script);
}
```

Muvaffaqiyatli yuklash uchun `callback (null, script)` va aks holda, `callback (error)` ni chaqiradi.

Foydalanish:
```js
loadScript('/my/script.js', function(error, script) {
  if (error) {
    // error ni nazorat qilish
  } else {
    // skript muvaffaqiyatli yuklandi
  }
});
```

Yana bir bor, biz `loadScript` uchun ishlatgan retsept aslida juda keng tarqalgan. Bu "error-birinchi callback" uslubi deb ataladi.

Konvensiya quyidagilardan iborat:
1. `Callback` ning birinchi argumenti, agar u yuzaga kelgan bo'lsa, error uchun ajratilgan. Keyin `callback(err)` chaqiriladi.
2. Ikkinchi dalil (agar kerak bo'lsa, keyingilari) muvaffaqiyatli natija uchun zarur. Keyin `callback(null, result1, result2…)`  chaqiriladi.

Yagona `callback` funksiyasi xatolar haqida xabar berish va natijalarni qaytarish uchun ishlatiladi.

## Halokat piramidasi

Bir qarashda, bu asenxron kodlash uchun qulay yondashuv kabi ko'rinadi va haqiqatan ham shunday. Bir yoki ikkita ichki callback'lar uchun u yaxshi ko'rinadi. 

Ammo birin-ketin bajariladigan bir nechta asinxron harakatlar uchun bizda shunday kod bo'ladi:

```js
loadScript('1.js', function(error, script) {

  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', function(error, script) {
      if (error) {
        handleError(error);
      } else {
        // ...
        loadScript('3.js', function(error, script) {
          if (error) {
            handleError(error);
          } else {
  *!*
            // ...barcha skriptlar yuklangandan keyin davom eting (*)
  */!*
          }
        });

      }
    });
  }
});
```

Yuqoridagi kodda:
1. Biz `1.js` ni yuklaymiz, agar error bo'lmasa...
2. Biz `2.js` ni yuklaymiz, agar error bo'lmasa...
3. Biz `3.js` ni yuklaymiz, agar error bo'lmasa, boshqa `(*)` ni bajaring.

Qo'ng'iroqlar ko'proq o'rnatilgan bo'lsa, kod chuqurroq bo'lib boradi va uni boshqarish tobora qiyinlashadi, ayniqsa bizda `...` o'rniga haqiqiy kod mavjud bo'lsa, u ko'proq sikllar, shartli bayonotlar va hokazolarni o'z ichiga olishi mumkin.

Bu ba'zan "do'zaxni qayta chaqirish" yoki "halokat piramidasi" deb ataladi.

<!--
loadScript('1.js', function(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', function(error, script) {
      if (error) {
        handleError(error);
      } else {
        // ...
        loadScript('3.js', function(error, script) {
          if (error) {
            handleError(error);
          } else {
            // ...
          }
        });
      }
    });
  }
});
-->

![](callback-hell.svg)

Ichki qo'ng'iroqlar "piramidasi" har bir asinxron harakat bilan o'ngga o'sadi. Tez orada u nazoratdan chiqib ketadi.

Shunday qilib, kodlashning bu usuli unchalik yaxshi emas.

Har bir harakatni mustaqil funksiyaga aylantirish orqali muammoni yengillashtirishga harakat qilishimiz mumkin, masalan:

```js
loadScript('1.js', step1);

function step1(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', step2);
  }
}

function step2(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('3.js', step3);
  }
}

function step3(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...barcha skriptlar yuklangandan keyin davom eting (*)
  }
}
```

Ko'rdingizmi? U xuddi shu ishni bajaradi va endi chuqur joylashtirishga hojat yo'q, chunki biz har bir amalni alohida yuqori darajadagi funksiyaga aylantirdik.

U ishlaydi, lekin kod yirtilgan elektron jadvalga o'xshaydi. O'qish qiyin va uni o'qiyotganda bo'laklar orasida ko'z sakrash kerakligini payqagandirsiz. Bu hol ayniqsa o'quvchi kod bilan tanish bo'lmasa va qayerga ko'z yugurtirishni bilmasa juda noqulay.

Shuningdek, `step*` nomli funksiyalarning barchasi bir martalik qo'llaniladi, ular faqat "halokat piramidasi"dan qochish uchun yaratilgan. Hech kim ularni harakat zanjiridan tashqarida qayta ishlatmaydi. Demak, bu yerda bir oz nom maydoni chalkashliklari bor.

Biz yaxshiroq narsaga ega bo'lishni xohlaymiz.

Yaxshiyamki, bunday piramidalardan qochishning boshqa usullari mavjud. Eng yaxshi usullardan biri keyingi bobda tasvirlangan "va'dalar" dan foydalanishdir.