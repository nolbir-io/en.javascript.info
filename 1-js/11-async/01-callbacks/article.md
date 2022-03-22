

# Tanishtirish: qayta chaqirish (callbacks)

```warn header="Bu yerda biz browserning ichidagi funksiyalardan foydalanamiz"
Callback, promise va boshqa mavhum konseptlardan (yani tushunchalardan) foydalanishni ko'rsatish uchun biz bazi browser ichki funksiyalaridan foydalanamiz: asosan scriptlarni yuklashda va oddiy dokument boshqaruvlarida.

Agar siz bu funksiyalar bilan tanish bo'lmasangiz va ularning misollarda ishlatilishi sizga chalkashtiradigan bo'lsa, unda siz keyingi [next part](/document) bo'limning bazi darslarini ko'rip chiqishingiz kerak.
```

JavaScriptning ko'plab funksiyalari sizga *asynchronous* (asinxron) ishlarni bajarishga imkon beradi. Boshqacha qilib aytganda, asinxron biz hozir boshlagan, lekin keyinroq tugallanadigan ishlar hisoblanadi.

Misol uchun, shunday funksiyalrning biri bu `setTimeout` dir.

Boshqa asinxron ishlarham bor misol uchun: script larni yuklash va modullar (keyinga chapterda o'rganamiz).

Masalan, `loadScript(src)` funktsiyasini ko'rib chiqing:

```js
function loadScript(src) {
  // creates a <script> tag and append it to the page
  // this causes the script with given src to start loading and run when complete
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}
```

Funktsiyaning maqsadi yangi skriptni yuklashdir. Hujjatga `<script src ="… ">` qo'shilganda, brauzer uni yuklaydi va bajaradi.

Biz buni quyidagicha ishlatishimiz mumkin:

```js
// skriptni yuklaydi va bajaradi
loadScript('/my/script.js');
```

Funktsiya "asinxron" deb nomlanadi, chunki harakat (skriptni yuklash) hozir emas, keyinroq tugaydi.

If there's any code below `loadScript(…)`, it doesn't wait until the script loading finishes.

Agar  `loadScript(…)` ostida kode bo'lsa, u script yuklanilishi tugashini kutmaydi.

```js
loadScript('/my/script.js');
// the code below loadScript
// doesn't wait for the script loading to finish
// ...
```

Endi yangi skript yuklanganda undan foydalanishni xohlaymiz deylik. Ehtimol, u yangi funktsiyalarni e'lon qiladi, shuning uchun ularni boshqarishni xohlaymiz.

Ammo biz buni `loadScript(...)` chaqirig'idan so'ng darhol qilsak, bu ishlamaydi:

```js
loadScript('/my/script.js'); // the script has "function newFunction() {…}"

*!*
newFunction(); // no such function!
*/!*
```

Tabiiyki, brauzer skriptni yuklashga ulgurmagan bo'lishi mumkin. Shunday qilib, yangi funktsiyani darhol chaqirish muvaffaqiyatsiz tugadi. Hozirda `loadScript` funktsiyasi yukni tugatilishini kuzatish usulini ta'minlamaydi. Skript yuklanadi va oxir-oqibat ishlaydi, barchasi shu. Ammo biz bu qachon yuz berishini bilishni, ushbu buyruq faylidagi yangi funktsiyalar va o'zgaruvchamlardan foydalanishni xohlaymiz.

Skript yuklanganda bajarilishi kerak bo'lgan `loadScript` ga ikkinchi argument sifatida `callback` funktsiyasini qo'shamiz:

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

Endi biz skriptdan yangi funktsiyalarni chaqirmoqchi bo'lsak, uni qayta chaqiruvda (callbackda) yozishimiz kerak:

```js
loadScript('/my/script.js', function() {
  // the callback runs after the script is loaded
  newFunction(); // so now it works
  ...
});
```

Mana shu g'oya: ikkinchi argument - bu harakat tugagandan so'ng ishlaydigan (odatda noma'lum) funktsiya.

Haqiqiy skript bilan ishlaydigan misol:

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
  alert( _ ); // function declared in the loaded script
});
*/!*
```

Bu "qayta chaqiruvga asoslangan" asinxron dasturlash uslubi deb ataladi. Biror narsani asinxron ravishda bajaradigan funktsiya `callback` argumentini berishi kerak, bu yerda biz uni tugatgandan so'ng bajaramiz.

Bu yerda biz buni `loadScript` da qildik, ammo, albatta, bu umumiy yondashuv.

## Qayta chaqiruvda qayta chaqiruv (Callback in callback)

Qanday qilib biz ikkita skriptni ketma-ket yuklashimiz mumkin: birinchisi, so'ngra ikkinchisi?

Tabiiy yechim qayta chaqiruvning ichiga ikkinchi `loadScript` chaqiruvini qo'yishdir:

```js
loadScript('/my/script.js', function(script) {

  alert(`Cool, the ${script.src} is loaded, let's load one more`);

*!*
  loadScript('/my/script2.js', function(script) {
    alert(`Cool, the second script is loaded`);
  });
*/!*

});
```

Tashqi `loadScript` tugagandan so'ng, qayta chaqiruv ichki qismini boshlaydi.

Agar biz yana bitta skriptni xohlasakchi...?

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

Shunday qilib, har bir yangi harakat qayta chaqiruv ichida. Bu ozgina harakatlar uchun yaxshi, ammo ko'pchilik uchun yaxshi emas, shuning uchun boshqa variantlarni tez orada ko'rib chiqamiz.

## Xatolarni boshqarish (Handling errors)

Yuqoridagi misollarda biz xatolarni hisobga olmadik. Agar skriptni yuklash muvaffaqiyatsiz tugasachi? Bizning chaqiruvimiz bunga munosabat bildirishi kerak.

Yuklash xatolarini kuzatadigan `loadScript` ning takomillashtirilgan versiyasi:

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

*!*
  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error for ${src}`));
*/!*

  document.head.append(script);
}
```

Muvaffaqiyatli yuklash uchun `callback(null, script)` ni chaqiradi va aks holda `callback(error)` ni chaqiradi.

Foydalanish:
```js
loadScript('/my/script.js', function(error, script) {
  if (error) {
    //xatolarni boshqarish (handle error)
  } else {
    //skript muvaffaqiyatli yuklandi (script loaded successfully)
  }
});
```

Yana bir marta, biz `loadScript` uchun ishlatgan retsept aslida juda keng tarqalgan. Bu "birinchi xato qayta chaqiruvini qilish" uslubi deb nomlanadi.

Qoidalar quyidagicha:
1. Agar `callback` ning birinchi argumenti, agar u paydo bo'lsa, xato uchun saqlanadi. Keyin `callback(err)` chaqiriladi.
2. Ikkinchi argument (agar kerak bo'lsa, keyingisiyam) muvaffaqiyatli natija uchun. Keyin `callback(null, result1, result2…)` chaqiriladi.

Shunday qilib, bitta `callback` funktsiyasi xatolarni xabar qilish va natijalarni qaytarish uchun ishlatiladi.

## Halokat piramidasi (Pyramid of Doom)

Bir qarashda, bu asinxron kodni yozishning ishchi usuli. Va haqiqatan ham shunday. Bir yoki ehtimol ikkita ichki chaqiruvlar uchun yaxshi bo'ladi.

Ammo ketma-ket keladigan bir nechta asinxron harakatlar uchun bizda shunday kod bo'ladi:

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
1. Biz `1.js` ni yuklaymiz, keyin xato bo'lmasa.
2. Biz `2.js` ni yuklaymiz, keyin xato bo'lmasa.
3. Biz `3.js` ni yuklaymiz, keyin xato bo'lmasa. -- boshqa narsa bajarish `(*)`.

Chaqiruvlar uyasi ko'payib borishi bilan, kod yanada chuqurlashadi va boshqarish tobora qiyinlashib boradi, ayniqsa, agar bizda `...` o'rniga haqiqiy kod bo'lsa, bu ko'proq tsiklarni, shartli bayonotlarni va boshqalarni o'z ichiga olishi mumkin.

Buni ba'zida "halokat piramidasi" deb atashadi.

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

Ichki chaqiruvlarning "piramidasi" har bir asinxron harakat bilan o'ng tomonga o'sib boradi. Tez orada u nazoratdan chiqib ketadi.

Shunday qilib, kodlashning bu usuli juda yaxshi emas.

Muammoni engillashtirish uchun har qanday harakatni mustaqil funktsiyaga aylantirishimiz mumkin, masalan:

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

Ko'ryapsizmi? Xuddi shu narsani qiladi va endi chuqur uyalar yo'q, chunki biz har bir harakatni alohida yuqori darajadagi funktsiyaga aylantirdik.

U ishlaydi, lekin kod yirtilib ketgan elektron jadvalga o'xshaydi. O'qish qiyin, va ehtimol siz uni o'qiyotganingizda buyumlar orasidan ko'z bilan sakrash kerakligini payqadingiz. Bu noqulay, ayniqsa o'quvchi kodni yaxshi bilmasa va qayerga ko'z bilan sakrashni bilmasa.

Shuningdek, `step*` deb nomlangan funktsiyalar bir martalik ishlatiladi, ular faqat "halokat piramidasi" ni oldini olish uchun yaratilgan. Hech kim ularni harakatlar zanjiridan tashqarida qayta ishlatmoqchi emas. Shunday qilib, bu yerda bir oz nom maydonida tartibsizlik mavjud.

Yaxshiroq yo'lni topish kerak.

Baxtimizga, bunday piramidalardan saqlanishning boshqa usullari mavjud. Keyingi bobda tasvirlangan "va'dalar" dan foydalanish eng yaxshi usullardan biridir.
