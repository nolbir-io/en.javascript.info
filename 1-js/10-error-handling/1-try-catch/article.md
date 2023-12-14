# Xatolarni nazorat qilish, "try...catch" (sinab ko'rish...tutish)
Biz dasturlashda qanchalik zo'r bo'lishimizdan qat'iy nazar, ba'zida skriptlarimizda xatolar bo'ladi. Ular bizning xatolarimiz, kutilmagan foydalanuvchi kiritilishi, serverning noto'g'ri javobi va boshqa minglab sabablarga ko'ra yuzaga kelishi mumkin.

Odatda, skript xatolik yuz berganda uni konsolga chop etayotganda "o'ladi" (darhol to'xtaydi).

Ammo `try...catch` sintaksis konstruksiyasi mavjud bo'lib, u bizga xatolarni “tutib olish” imkonini beradi, shunda skript o'lish o'rniga yanada oqilona ishlay oladi.

## "try...catch" sintaksisi

`try... catch` konstruktsiyasi ikkita asosiy blokdan iborat: `try` va `catch`:

```js
try {

  // code...

} catch (err) {

  // xatolarni nazorat qilish

}
```

Bu shunday ishlaydi:

1. Birinchidan, `try {...}` dagi kod bajariladi.
2. Agar xatoliklar bo'lmasa, `catch (err)` e'tiborga olinmaydi: `try` ni bajarish oxiriga yetib, `catch` ni o'tkazib yuborish bilan davom etadi.
3. Agar xato ro'y bersa, u holda `try` ijrosi to'xtatiladi va boshqaruv `catch (err)` ning boshiga o'tadi. `err` o'zgaruvchisi (biz u uchun istalgan nomdan foydalanishimiz mumkin) nima sodir bo'lganligi haqidagi tafsilotlar bilan xato obyektini o'z ichiga oladi.

![](try-catch-flow.svg)

Shunday qilib, `try {...}` blokidagi xatolik skriptni o'ldirmaydi -- bizda uni `catch` da hal qilish imkoniyati mavjud.

Quyida bir nechta misollarni ko'rib chiqamiz.

- Xatosiz misol:  `alert` `(1)` and `(2)`:

    ```js run
    try {

      alert(' try blokining boshlanishi');  // *!*(1) <--*/!*

      // ...bu yerda xato yo'q

      alert('try blokining tugashi');   // *!*(2) <--*/!*

    } catch (err) {

      alert('Catch hisobga olinmadi, chunki bu yerda hech qanday xato mavjud emas edi); // (3)

    }
    ```
- Xato mavjud bo'lgan misol: `(1)` and `(3)`:

    ```js run
    try {

      ogohlantirish('try blokining boshlanishi');  // *!*(1) <--*/!*

    *!*
      lalala; // xato, variable aniqlanmagan!
    */!*

      alert(' try blokining tugashi (hech qachon yetishilmadi)');  // (2)

    } catch (err) {

      alert(`Error, ya'ni xato paydo bo'ldi!`); // *!*(3) <--*/!*

    }
    ```


````warn header (0gohlantiruvchi sarlavha)="`try...catch` faqatgina ish vaqtidagi xatolar uchun ishlaydi"
`Try... catch` ishlashi uchun kod ishga tushirilishi kerak. Boshqacha qilib aytganda, u haqiqiy JavaScript bo'lishi kerak.

Agar kod sintaktik jihatdan noto'g'ri bo'lsa, ishlamaydi, masalan, unda nomunosib figurali qavslar mavjud:

```js run
try {
  {{{{{{{{{{{{
} catch (err) {
  alert("Mexanizm bu kodni tushuna olmaydi, u yaroqsiz");
}
```
JavaScript mexanizmi avval kodni o'qiydi va keyin uni ishga tushiradi. O'qish bosqichida yuzaga keladigan xatolar "parse-time" xatolari deb ataladi va ularni tuzatib bo'lmaydi (kod ichidan). Buning sababi, mexanizm kodni tushunolmaydi.

Shunday qilib, `try... catch` faqat haqiqiy kodda yuzaga keladigan xatolarni ko'rib chiqishi mumkin. Bunday xatolar "runtime errors" yoki ba'zan "exceptions", ya'ni istisnolar deb ataladi.
````


````ogohlantiruvchi sarlavha="`try...catch` sinxron tarzda ishlaydi"
Agar exception "rejalashtirilgan" kodda, masalan, "setTimeout" da sodir bo'lsa, "try...catch" buni tushunmaydi:

```js run
try {
  setTimeout(function() {
    noSuchVariable; // script shu yerda tugaydi
  }, 1000);
} catch (err) {
  alert( "won't work" );
}
```

Buning sababi, funksiyaning o'zi keyinroq, vosita allaqachon "try... catch" konstruktsiyasini tark etganda bajariladi.

Rejalashtirilgan funktsiya ichidagi istisnoni olishi uchun "try... catch" ushbu funktsiya ichida bo'lishi kerak:
```js run
setTimeout(function() {
  try {    
    noSuchVariable; // try...catch xatoni topdi!
  } catch {
    alert( "error shu yerda topildi" );
  }
}, 1000);
```
````

## Error, ya'ni xato obyektlar

Xatolik yuz berganda, JavaScript u haqidagi ma'lumotlarni o'z ichiga olgan obyektni yaratadi. Keyin obyekt `catch` ga argument sifatida uzatiladi:

```js
try {
  // ...
} catch (err) { // <-- "error obyekti" err ning o'rniga boshqa so'zdan foydalanishi ham mumkin
  // ...
}
```

Barcha o'rnatilgan xatolar uchun xato obyekti ikkita asosiy xususiyatga ega:

`name`(nom)
: Xato nomi. Masalan, aniqlanmagan o'zgaruvchi uchun `"ReferenceError"`.

`message` (xabar)
: Xato tafsilotlari haqida matnli xabar.

Aksariyat muhitlarda mavjud bo'lgan boshqa nostandart xususiyatlar mavjud. Eng ko'p ishlatiladigan va qo'llab-quvvatlanadiganlardan biri:

`stack` (to'plam)
: Joriy qo'ng'iroqlar to'plami: xatoga olib kelgan ichki qo'ng'iroqlar ketma-ketligi haqida ma'lumotga ega bo'lgan qator. Nosozliklarni tuzatish uchun ishlatiladi.

Masalan:

```js run untrusted
try {
*!*
  lalala; // xato, chunki variable, ya'ni o'zgaruvchi aniqlanmagan!
*/!*
} catch (err) {
  alert(err.name); // ReferenceError
  alert(err.message); // lalala aniqlanmagan
  alert(err.stack); // ReferenceError: lalala (...call stack)da aniqlanmagan

  // Xatoni ham bir butun sifatida ko'rsatishi mumkin
  // Xato "name: message" sifatida satrga aylantiriladi
  alert(err); // ReferenceError: lalala is not defined
}
```

## Ixtiyoriy "catch" bilan birlashtirish

[oxirgi brauzer=yangi]

Agar bizga xato tafsilotlari kerak bo'lmasa, `catch` uni o'tkazib yuborishi mumkin:

```js
try {
  // ...
} catch { // <-- without (err) 
  // ...
}
```

## "try...catch" dan foydalanish

Keling, `try... catch` ga doir haqiqiy hayotiy misol ko'rib chiqaylik.

 Bizga ma'lumki, JavaScript JSON kodlangan qiymatlarni o'qish uchun [JSON.parse(str)](mdn:js/JSON/parse) usulini qo'llab-quvvatlaydi.

 Odatda u tarmoq orqali, serverdan yoki boshqa manbadan olingan ma'lumotlarni dekodlash uchun ishlatiladi.

Biz uni qabul qilamiz va `JSON.parse` ni quyidagicha chaqiramiz:

```js run
let json = '{"name":"John", "age": 30}'; // serverdagi ma'lumot

*!*
let user = JSON.parse(json); // matn ko'rinishini JS obyektiga aylantirish
*/!*

// endi foydalanuvchi satrdagi xususiyatlarga ega obyektdir
alert( user.name ); // John
alert( user.age );  // 30
```

 JSON haqida batafsil ma'lumotni <info:json> bo'limida topishingiz mumkin.

**Agar `json` not'o'g'ri tuzilgan bo'lsa, `JSON.parse` xatolik hosil qiladi, shuning uchun skript “o`ladi”.**

Faqat shu bilan kifoyalanamizmi? Albatta yo'q!

Shunday qilib, agar ma'lumotlarda biror narsa noto'g'ri bo'lsa, ishlab chiquvchi konsoli ochilmaguncha tashrif buyuruvchi buni hech qachon bilmaydi. Va odamlar hech qanday xato xabarisiz biror narsa "shunchaki o'lganini" yoqtirmaydi.

Xatoni tuzatish uchun `try... catch` dan foydalanamiz:

```js run
let json = "{ bad json }";

try {

*!*
  let user = JSON.parse(json); // <-- error paydo bo'lganida...
*/!*
  alert( user.name ); // ishlamaydi

} catch (err) {
*!*
  // ... .ijro bu yerga o'tadi
  alert( "Uzr so'raymiz, ma'lumotlarda xatolik bor, biz bu haqda yana bir bor so'rashga harakat qilamiz." );
  alert( err.name );
  alert( err.message );
*/!*
}
```

Bu yerda biz `catch` blokidan faqat xabarni ko'rsatish uchun foydalanamiz, lekin biz ko'proq narsani qila olamiz: yangi tarmoq so'rovini yuborish, tashrif buyuruvchiga muqobil taklif qilish, xato haqida ma'lumotni ro'yxatga olish vositasiga yuborish, ... . Hammasi shunchaki o'lishdan ko'ra yaxshiroq.

## O'z xatolarimizdan xalos bo'lish

 Agar `json` sintaktik jihatdan to'g'ri bo'lsa-da, lekin talab qilinadigan `name` xususiyatiga ega bo`lmasa-chi?

Bunga o'xshab:

```js run
let json = '{ "age": 30 }'; // tugallanmagan ma'lumot

try {

  let user = JSON.parse(json); // <-- error yo'q
*!*
  alert( user.name ); // name yo'q!
*/!*

} catch (err) {
  alert( "bajarmaydi" );
}
```

Bu yerda `JSON.parse` normal ishlaydi, lekin `name` yo`qligi aslida biz uchun xato.

Xatolarni qayta ishlashni birlashtirish uchun biz `throw` operatoridan foydalanamiz.
### "Throw" operatori

`Throw` operatori xatolik hosil qiladi.

Sintaksis:

```js
throw <error object>
```

Texnik jihatdan biz har qanday narsani xato obyekti sifatida ishlatishimiz mumkin. Bu hatto raqam yoki satr kabi primitiv blok ham bo'lishi mumkin, lekin obyektlardan afzalroq `name` va `message` xususiyatlariga ega bo'lgan ma'qul (o'rnatilgan xatolarga biroz mos bo'lish uchun).

JavaScript-da standart xatolar uchun ko'plab o'rnatilgan konstruktorlar mavjud: `Error`, `SyntaxError`, `ReferenceError`, `TypeError` va boshqalar. Ulardan xato obyektlarini yaratishda ham foydalanishimiz mumkin.

Ularning sintaksisi:

```js
let error = new Error(message);
// or
let error = new SyntaxError(message);
let error = new ReferenceError(message);
// ...
```

O'rnatilgan xatolar uchun (hech qanday obyekt uchun emas, faqat xatolar uchun) `name` xossasi aynan konstruktor nomidir. Va shuningdek, `message` argumentdan olingan.

Masalan:

```js run
let error = new Error("o_O kabi hodisalar sodir bo'ladi");

alert(error.name); // Xato
alert(error.message); // o_O kabi hodisalar sodir bo'ladi
```

Keling, `JSON.parse` qanday xatolik yaratishini ko'rib chiqaylik:

```js run
try {
  JSON.parse("{ bad json o_O }");
} catch (err) {
*!*
  alert(err.name); // SyntaxError
*/!*
  alert(err.message); // JSONda 2-pozitsiyada kutilmagan b tokeni
}
```

Ko'rib turganimizdek, bu `SyntaxError` hisoblanadi.

Va bizning holatlarimizda `name` ning yo'qligi xatodir, chunki foydalanuvchilarda `name` bo'lishi lozim.

Demak, sinab ko'ramiz:

```js run
let json = '{ "age": 30 }'; // nomukammal ma'lumot

try {

  let user = JSON.parse(json); // <-- error yo'q

  if (!user.name) {
*!*
    throw new SyntaxError("Nomukammal ma'lumot: name yo'q"); // (*)
*/!*
  }

  alert( user.name );

} catch (err) {
  alert( "JSON Error: " + err.message ); // JSON Error: Nomukammal ma'lumot: name yo'q
}
```
`(*)` qatorida `throw` operatori berilgan `message`(xabar) bilan `SyntaxError` hosil qiladi, xuddi JavaScriptning o'zi uni yaratgandek. `try` ning bajarilishi darhol to'xtaydi va boshqaruv oqimi `catch` ga o'tadi.

Endi `catch` barcha xatolar, `JSON.parse` ni ham qayta ishlash uchun yagona joyga aylandi.

## Rethrowing

Yuqoridagi misolda biz noto'g'ri ma'lumotlarni qayta ishlash uchun `try... catch` dan foydalanamiz. Lekin `try {...}` blokida yana *boshqa kutilmagan xatoliklar* yuzaga kelishi mumkinmi? Faqat bu "noto'g'ri ma'lumotlar" emas, balki dasturlash xatosi (o'zgaruvchi aniqlanmagan) yoki boshqalar kabi bo'lishi mumkin.
Masalan:

```js run
let json = '{ "age": 30 }'; // nomukammal ma'lumot

try {
  user = JSON.parse(json); // <-- user dan oldin "let" unutib qoldirilgan

  // ...
} catch (err) {
  alert("JSON Error: " + err); // JSON Error: ReferenceError: user (foydalanuvchi) aniqlanmagan
  // (aslida JSON Error yo'q)
}
```
Hamma narsa bo'lishi mumkin. Dasturchilar ham xato qiladi. Hatto millionlab odamlar tomonidan o'n yildan beri foydalanilayotgan ochiq manbali yordamchi dasturlarda ham to'satdan xato aniqlanishi mumkin, bu esa dahshatli xakerliklarga olib keladi.

Bizning holatimizda "noto'g'ri ma'lumotlar" errorni topish uchun `try... catch` qo'yiladi. Lekin o'z tabiatiga ko'ra, `catch` `try`dan *barcha* errorni oladi. Bu yerda kutilmagan error yuz beradi, lekin baribir oʻsha `JSON Error` xabarini koʻrsatadi. Bu noto'g'ri va kodni disk raskadrovka qilishni qiyinlashtiradi.

Bunday muammolarni oldini olish uchun biz "rethrowing" texnikasidan foydalanishimiz mumkin. Qoida esa oddiy:

**Catch faqat o‘zi bilgan error larni qayta ishlashi va qolganlarini “rethrow” qilishi kerak.**

"Rethrowing" texnikasini quyidagicha batafsilroq tushuntirish mumkin:

1. Catch hamma error larni topadi.
2. `catch (err) {...}` blokida we analyze the error object `err` error obyektini analiz qilamiz.
3. Agar buni hal qilolmasak, `throw err` , ya'ni error ni qoldirib ketamiz.

Odatda biz error ning turini `instanceof` operatoridan foydalangan holda tekshiramiz.

```js run
try {
  user = { /*...*/ };
} catch (err) {
*!*
  if (err instanceof ReferenceError) {
*/!*
    alert('ReferenceError'); // Aniqlanmagan o'zgaruvchiga kirish uchun "ReferenceError"
  }
}
```

Error sinfi nomini `err.name` xususiyatidan ham olishimiz mumkin. Bu barcha mahalliy error larda mavjud. Yana bir variant - `err.constructor.name` ni o'qish.

Quyidagi kodda biz `catch` faqat `SyntaxError` ni boshqarishi uchun qayta o'rnatishdan foydalanamiz:

```js run
let json = '{ "age": 30 }'; // nomukammal ma'lumot
try {

  let user = JSON.parse(json);

  if (!user.name) {
    throw new SyntaxError("Nomukammal ma'lumot: name yo'q");
  }

*!*
  blabla(); // kutilmagan error
*/!*

  alert( user.name );

} catch (err) {

*!*
  if (err instanceof SyntaxError) {
    alert( "JSON Error: " + err.message );
  } else {
    throw err; // rethrow (*)
  }
*/!*

}
```

`Catch` blokining ichidan `(*)` qatoriga yuborilgan xatolik `try...catch`dan “tushadi” va tashqi `try...catch` konstruksiyasi (agar mavjud bo‘lsa) tomonidan ushlanishi mumkin yoki skriptni o'ldiradi.

Shunday qilib, `catch` bloki aslida qanday hal qilishni biladigan xatolarni ko'rib chiqadi va qolganlarini "o'tkazib yuboradi".

Quyidagi berilgan misol shu kabi error lar yana bitta yuqori darajali `try...catch` yordamida topiladi.

```js run
function readData() {
  let json = '{ "age": 30 }';

  try {
    // ...
*!*
    blabla(); // error!
*/!*
  } catch (err) {
    // ...
    if (!(err instanceof SyntaxError)) {
*!*
      throw err; // rethrow (buni nima qilishni bilmadim)
*/!*
    }
  }
}

try {
  readData();
} catch (err) {
*!*
  alert( "External catch got: " + err ); // buni endi uddaladim!
*/!*
}
```
 Yuqoridagi `readData` faqatgina `SyntaxError` ni nazorat qiloladi, tashqaridagi `try...catch` esa hamma bloklarni nazoratga oladi. 

## try...catch...finally(vanihoyat)

To'xtang, bu hali hammasi emas.

`try... catch` konstruktsiyasida yana bitta kod bandi bo'lishi mumkin: `finally`.

Agar u mavjud bo'lsa, u barcha sinflarda ishlaydi:

- `try` dan keyin, agar error bo'lmasa,
- `catch` dan keyin, agar error mavjud bo'lsa.

Kengaytirilgan sintaksis quyidagicha bo'ladi:

```js
*!*try*/!* {
   ... kodni ishlatishga harakat qiladi ...
} *!*catch*/!* (err) {
   ... error larni nazorat qiladi ...
} *!*finally*/!* {
   ... doimiy ishlaydi ...
}
```

Ushbu kodni ishlatishga harakat qilib ko'ring:

```js run
try {
  alert( 'try' );
  if (confirm('error ga duch keldingizmi?')) BAD_CODE();
} catch (err) {
  alert( 'catch' );
} finally {
  alert( 'finally' );
}
```

Kodni ishlatishning ikkita yo'li bor:

1. Agar siz “Errorga duch keldingizmi?” savoliga ga “Ha” deb javob bersangiz, u holda `try -> catch -> finally` ni qo'llang.
2. Agar yo'q desangiz, unda `try -> finally` ni qo'llang.

`finally` bandi ko'pincha biror narsani qilishni boshlaganimizda va har qanday natijada uni yakunlashni xohlayotganimizda ishlatiladi.

Masalan, biz Fibonachchi raqamlari funksiyasi `fib(n)` qancha vaqt sarflaganini o'lchamoqchimiz. Tabiiyki, biz o'lchashni ishga tushirishdan oldin boshlashimiz va keyin tugatishimiz mumkin. Ammo funksiyani chaqirish paytida xatolik yuz bersa nima bo'ladi? Xususan, quyidagi kodda `fib(n)` ni amalga oshirish manfiy yoki butun son bo'lmagan raqamlar uchun xatolikni qaytaradi.

`finally` bandi nima bo'lishidan qat'iy nazar o'lchovlarni tugatish uchun ajoyib joy.

Bu yerda `finally` har ikkala holatda ham vaqt to'g'ri o'lchanishini kafolatlaydi -- `fib` muvaffaqiyatli bajarilgan taqdirda va unda xato bo'lgan taqdirda:

```js run
let num = +prompt("Butun musbat sonni kiritdingizmi?", 35)

let diff, natija;

function fib(n) {
  if (n < 0 || Math.trunc(n) != n) {
    throw new Error("Manfiy bo'lmasligi kerak, shuningdek butun son ham bo'lishi kerak.");
  }
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

let start = sana.now();

try {
  natija = fib(num);
} catch (err) {
  natija = 0;
*!*
} finally {
  diff = Sana.now() - start;
}
*/!*

alert(result || "error sodir bo'ldi");

alert(`bajarish ${diff}ms vaqtni oldi`);
```

Kodni `prompt` ga `35` ni kiritish orqali tekshirishingiz mumkin – u `try` (sinab ko'rish) dan keyin `finally` normal tarzda ishlaydi. Keyin `-1`ni kiriting -- darhol xatolik yuz beradi va bajarish `0ms` tezlikda davom etadi. Ikkala o'lchov ham to'g'ri bajarilgan.

Boshqacha qilib aytganda, funksiya `return` yoki `throw` bilan tugashi mumkin, bu muhim emas. `Finally` bandi ikkala holatda ham bajariladi.


```aqlli sarlavha ="Variables (o'zgaruvchilar) mahalliydir `try...catch...finally`"
E'tibor bering, yuqoridagi koddagi `result` va `diff` o'zgaruvchilari `try... catch` dan *oldin* e'lon qilingan.

Aks holda, agar biz `try` blokida `let` deb e`lon qilsak, let faqat uning ichida ko'rinadi.
```

````aqlli sarlavha="`finally` va `return`"
“Finally” bandi “try...catch” dan *har qanday* chiqish uchun ishlaydi. Bunga aniq "return" kiradi.

 Quyidagi misolda “try” da “return” mavjud. Bunday holda, "finally" boshqaruv elementi tashqi kodga qaytishidan oldin bajariladi.

```js run
funksiya func() {

  try {
*!*
    return 1;
*/!*

  } catch (err) {
    /* ... */
  } finally {
*!*
    alert( 'finally' );
*/!*
  }
}

alert( func() ); // Birinchi finally dan alert ishlaydi, keyin esa bu
```
````

````aqlli sarlavha="`try...finally`"

`catch` bandisiz `try...finally` konstruktsiyasi ham foydalidir. Biz buni bu yerda xatoliklarni bartaraf etishni istamaganimizda qo'llaymiz, lekin biz boshlagan jarayonlar yakunlanganiga ishonch hosil qilishni xohlaymiz.

```js
funksiya func() {
  // bajarilishi kerak bo'lgan narsani qilishni boshlang (masalan, o'lchovlar)
  try {
    // ...
  } finally {
    // hamma narsa o'lsa ham bu ishni tugating
  }
}
```
Yuqoridagi kodda "try" ichidagi xatolik har doim paydo bo'ladi, chunki "catch" yo'q. Lekin “finally” ijro oqimi funksiyani tark etishidan oldin ishlaydi.
````

## Global catch

```ogohlantiruvchi sarlavha="Atrof-muhitga xos"
Ushbu bo'limdagi ma'lumotlar asosiy JavaScriptning bir qismi emas.
```
Tasavvur qilaylik, bizda `try... catch` dan tashqari jiddiy xatolik yuz berdi va skript dasturlash xatosi yoki boshqa dahshatli narsa kabi o‘lib qoldi. 

Bunday hodisalarga munosabat bildirishning yo'li bormi? Biz xatoni qayd qilishni, foydalanuvchiga biror narsani ko'rsatishni xohlashimiz mumkin (odatda ular xato xabarlarini ko'rmaydi) va hokazo.

Spetsifikatsiyada hech narsa yo'q, lekin muhitlar odatda buni ta'minlaydi, chunki bu haqiqatan ham foydali. Masalan, Node.js da buning uchun [`process.on("uncaughtException")`](https://nodejs.org/api/process.html#process_event_uncaughtexception) mavjud. Brauzerda esa, aniqlanmagan xatolik yuz berganda ishga tushadigan maxsus [window.onerror](mdn:api/GlobalEventHandlers/onerror) xususiyatiga funksiya belgilashimiz mumkin.

Sintaksis:

```js
window.onerror = function(message, url, line, col, error) {
  // ...
};
```

`message` (xabar)
: Error message.

`url`
: Xatolik yuz bergan skriptning URL manzili.

`line`, `col`
: Error yuz bergan satr va ustun raqamlari.

`error`
: Error obyekt.

Masalan:

```html-da ishonchsiz yangilanish balandligi = 1
<script>
*!*
  window.onerror = function(message, url, line, col, error) {
    alert(`${message}\n At ${line}:${col} of ${url}`);
  };
*/!*

  function readData() {
    badFunc(); // Voy, qandaydir xatolik ro'y berdi!
  }

  readData();
</script>
```

`window.onerror` global ishlov beruvchisining roli odatda skriptning bajarilishini tiklash emas -- bu dasturlash xatolarida imkonsiz bo'lishi mumkin, balki xato xabarini ishlab chiquvchilarga yuborishdir.

<https://errorception.com> yoki <https://www.muscula.com> kabi bunday holatlar uchun xatoliklarni qayd etishni ta'minlaydigan veb-xizmatlar ham mavjud.

Ular bunday ishlaydi:

1. Biz xizmatda ro'yxatdan o'tamiz va sahifalarga joylashtirish uchun ulardan JS (yoki skript URL manzili) bo'lagini olamiz.
2. Ushbu JS skripti maxsus `window.onerror` funksiyasini o'rnatadi.
3. Xatolik yuzaga kelganda, u bu haqda xizmatga tarmoq so'rovini yuboradi.
4. Biz xizmat veb-interfeysiga kirishimiz va xatolarni ko'rishimiz mumkin.
## Xulosa

`try...catch` konstruksiyasi ish vaqtidagi xatolarni boshqarish imkonini beradi. Bu tom ma'noda kodni ishga tushirishga "sinab ko'rish" va unda yuzaga kelishi mumkin bo'lgan xatolarni "tutish" imkonini beradi.

Sintaksis:

```js
try {
  // bu kodni ishlatish
} catch (err) {
  // agar xatolik yuz bergan bo'lsa, bu yerga o'ting
   // err - err obyekti
} finally {
  // har qanday holatda ham urinib ko'ring / qo'lga oling (try/catch)
}
```

There may be no `catch` section or no `finally`, so shorter constructs `try...catch` and `try...finally` are also valid.
`Catch` bo‘limi yoki `finally` mavjud bo‘lmasligi mumkin, shuning uchun qisqaroq `try... catch` va `try... finally` ham amal qiladi.

Error obyektlar quyidagi xususiyatlarga ega:

- `message` -- inson tomonidan o'qilishi mumkin bo'lgan xato xabari.
- `name` -- the string with error name (error constructor name). error name bilan satr (error konstruktor nomi).
- `stack` (nostandart, lekin yaxshi qo'llab-quvvatlanadigan) -- error yaratish vaqtidagi stack.

Agar error obyekti kerak bo'lmasa, `catch (err) {` o'rniga `catch {` dan foydalanib uni o'tkazib yuborishimiz mumkin.

Shuningdek, biz `throw` operatori yordamida o'z xatolarimizni yaratishimiz mumkin. Texnik jihatdan `throw` argumenti har qanday bo'lishi mumkin, lekin odatda bu o'rnatilgan `Error` sinfidan meros bo'lgan xato obyektidir. Keyingi bobda xatolarni kengaytirish haqida ko'proq ma'lumotlarga ega bo'lamiz.

*Rethrowing* xatolarni qayta ishlashning juda muhim namunasidir: `catch` bloki odatda ma'lum bir xato turini qanday hal qilishni kutadi va biladi, shuning uchun u bilmagan xatolarni qayta tiklashi kerak.

Agar bizda `try...catch` bo'lmasa ham, ko'pchilik muhitlar "tushib qolgan" xatolarni aniqlash uchun "global" xato ishlov beruvchisini o'rnatishga imkon beradi. Brauzerda bu "window.onerror" deb berilgan.
