
# Eski "var"

```smart header="Ushbu maqola eski skriptlarni tushunish uchun"
Ushbu maqolada berilgan ma'lumotlar eski skriptlarni tushunish uchun foydalidir.

Biz yangi kodni shunday yozmaymiz.
```

[O'zgaruvchilar](info:variables) haqidagi birinchi bobda biz o'zgaruvchilarni e'lon qilishning uchta usulini aytib o'tdik:

1. `let`
2. `const`
3. `var`

`Var` deklaratsiyasi `let` ga o'xshaydi. Ko'pincha biz `let` ni `var` bilan yoki aksincha o'zgartirishimiz mumkin va bu usulning ishlashini biroz kutamiz:

```js run
var message = "Hi";
alert(message); // Hi
```

Ammo ichki `var` juda qadim zamonlarda foydalanilgan g'alati elemntdir. U odatda zamonaviy skriptlarda ishlatilmaydi, lekin hali ham eski skriptlarda saqlanib qolgan.

Agar siz bunday skriptlar bilan uchrashishni rejalashtirmasangiz, ushbu bobni o'tkazib yuborishingiz yoki o'qishni kechiktirishingiz mumkin.

Boshqa tomondan, g'alati errorlarga yo'l qo'ymaslik uchun eski skriptlarni `var` dan `let` ga ko'chirishda farqlarni tushunish muhimdir.

## "var" blok doirasiga ega emas

`var` bilan e'lon qilingan o'zgaruvchilar funksiya yoki global miqyosda bo'ladi. Ular bloklar orqali ko'rinadi.

Masalan:

```js run
if (true) {
  var test = true; // "let" o'rniga "var" dan foydalanish
}

*!*
alert(test); // true, o'zgaruvchi ifdan keyin yashaydi
*/!*
```

`var` kod bloklarini e'tiborsiz qoldirganligi sababli bizda `test` global o'zgaruvchisi mavjud.

Agar biz `var test` o'rniga `let test` dan foydalansak, o'zgaruvchi faqat `if` ichida ko'rinadi:

```js run
if (true) {
  let test = true; // "let" ishlatish
}

*!*
alert(test); // ReferenceError: test aniqlanmagan
*/!*
```

Looplar uchun ham xuddi shunday: `var` blokli yoki loop-lokal bo'lishi mumkin emas:

```js
for (var i = 0; i < 10; i++) {
  var one = 1;
  // ...
}

*!*
alert(i);   // 10, "i" sikldan keyin ko'rinadi, bu global o'zgaruvchidir
alert(one); // 1, "one" sikldan keyin ko'rinadi, bu global o'zgaruvchidir
*/!*
```

Agar kod bloki funksiya ichida bo'lsa, u holda `var` funksiya darajasidagi o'zgaruvchiga aylanadi:

```js run
function sayHi() {
  if (true) {
    var phrase = "Hello";
  }

  alert(phrase); // ishlaydi
}

sayHi();
alert(phrase); // ReferenceError: phrase aniqlanmagan
```

Ko'rib turganimizdek, `var` `if`, `for` yoki boshqa kod bloklari orqali o'tadi. Buning sababi, uzoq vaqt oldin JavaScriptda bloklarda leksik muhit yo'q edi va `var` buning qoldig'i hisoblanadi.

## "var" qayta deklaratsiyalarga toqat qiladi

Agar biz bir xil o'zgaruvchini `let` bilan ikki marta bir xil doirada e'lon qilsak, bu error:

```js run
let user;
let user; // SyntaxError: 'user' allaqachon e'lon qilingan
```

`Var` yordamida biz o'zgaruvchini istalgan marta qayta e'lon qilishimiz mumkin. Agar biz allaqachon e'lon qilingan o'zgaruvchi bilan `var` dan foydalansak, u e'tiborga olinmaydi:

```js run
var user = "Pete";

var user = "John"; // bu "var" hech narsa qilmaydi (allaqachon e'lon qilingan)
// ...u error keltirib chiqarmaydi

alert(user); // John
```

## "var" o'zgaruvchilari ulardan foydalanish ostida e'lon qilinishi mumkin

`var` deklaratsiyalari funksiya ishga tushganda (yoki globallar uchun skript boshlanganda) qayta ishlanadi.

Boshqacha qilib aytadigan bo'lsak, `var` o'zgaruvchilari, ta'rif qayerda bo'lishidan qat'iy nazar, funksiya boshidan aniqlanadi (ta'rif ichki funksiyada bo'lmasa).

Shunday qilib, bu kod:

```js run
function sayHi() {
  phrase = "Hello";

  alert(phrase);

*!*
  var phrase;
*/!*
}
sayHi();
```

...Texnik jihatdan bu bilan bir xil (yuqoridagi `var phrase` ko'chirildi):

```js run
function sayHi() {
*!*
  var phrase;
*/!*

  phrase = "Hello";

  alert(phrase);
}
sayHi();
```

...Yoki bu kabi (esda tuting, kod bloklari e'tiborga olinmaydi):

```js run
function sayHi() {
  phrase = "Hello"; // (*)

  *!*
  if (false) {
    var phrase;
  }
  */!*

  alert(phrase);
}
sayHi();
```

Odamlar bunday xatti-harakatni "hoisting" (ko'tarish) deb ham atashadi, chunki barcha `var` funksiyaning yuqori qismiga "hoited bo'ladi" (ko'tariladi).

Shunday qilib, yuqoridagi misolda `if (false)` tarmog'i hech qachon bajarilmaydi, lekin bu muhim ahamiyat kasb etmaydi. Uning ichidagi `var` funksiyaning boshida qayta ishlanadi, shuning uchun `(*)` momentida o'zgaruvchi mavjud.

**Deklaratsiyalar ko'tariladi, ammo topshiriqlar emas.**

Buni eng yaxshisi misol bilan tushunishdir:

```js run
function sayHi() {
  alert(phrase);  

*!*
  var phrase = "Hello";
*/!*
}

sayHi();
```

`var phrase = "Hello"` qatorida ikkita amal mavjud:

1. O'zgaruvchi deklaratsiyasi `var`
2. O'zgaruvchi tayinlanishi `=`.

Deklaratsiya funksiyani bajarish boshlanishida ("hoisted") qayta ishlanadi, ammo topshiriq har doim paydo bo'lgan joyda ishlaydi. Shunday qilib, kod asosan shunday ishlaydi:

```js run
function sayHi() {
*!*
  var phrase; // deklaratsiya boshida ishlaydi ...
*/!*

  alert(phrase); // aniqlanmagan

*!*
  phrase = "Hello"; // ...topshiriq - bajarilish unga yetib kelganida.
*/!*
}

sayHi();
```

Barcha `var` deklaratsiyalari funksiya boshlanishida qayta ishlanganligi sababli, biz ularga istalgan joyda murojaat qilishimiz mumkin. Ammo o'zgaruvchilar topshiriqlargacha aniqlanmagan.

Yuqoridagi ikkala misolda `alert` xatosiz ishlaydi, chunki `phrase` o'zgaruvchisi mavjud. Ammo uning qiymati hali tayinlanmagan, shuning uchun u `undefined` bo'lib ko'rinadi.

## IIFE

Ilgari, faqat `var` bo'lgani uchun va u blok darajasida ko'rinmaydi, dasturchilar unga taqlid qilish usulini ixtiro qildilar. Ular qilgan ish "darhol chaqirilgan funksiya ifodalari" ("immediately-invoked function expressions" IIFE deb qisqartirilgan) deb nomlandi.

Bu biz hozir foydalanishimiz kerak bo'lgan narsa emas, lekin siz ularni eski skriptlarda topishingiz mumkin.

IIFE quyidagicha ko'rinadi:

```js run
(function() {

  var message = "Hello";

  alert(message); // Hello

})();
```

Bu yerda funksiya ifodasi yaratiladi va darhol chaqiriladi. Shunday qilib, kod darhol ishlaydi va o'zining shaxsiy o'zgaruvchilariga ega.

Funksiya ifodasi `(function {...})` qavs bilan o'ralgan, chunki JavaScript mexanizmi asosiy kodda `"function"` bilan uchrashganda, u buni funksiya deklaratsiyasining boshlanishi sifatida tushunadi. Ammo funksiya deklaratsiyasining nomi bo'lishi kerak, shuning uchun bunday kod xato beradi:

```js run
// Funktsiyani e'lon qilishga va darhol chaqirishga harakat qiladi
function() { // <-- SyntaxError: Funksiya bayonotlari funksiya nomini talab qiladi

  var message = "Hello";

  alert(message); // Hello

}();
```

Agar biz: "yaxshi, ism qo'shamiz" desak ham, bu ishlamaydi, chunki JavaScript Funksiya deklaratsiyasini darhol chaqirishga ruxsat bermaydi:

```js run
// quyidagi qavslar tufayli sintaksis xatosi
function go() {

}(); // <-- Funktsiya deklaratsiyasini darhol chaqira olmaysiz
```

Shunday qilib, funksiya atrofidagi qavslar JavaScriptga funksiya boshqa ifoda kontekstida yaratilganligini ko'rsatish uchun hiyla-nayrangdir va shuning uchun bu Funksiya ifodasiga nom kerak emas va darhol chaqirilishi mumkin.

JavaScriptga Funktsiya ifodasini nazarda tutayotganimizni bildirish uchun qavslardan tashqari boshqa usullar ham mavjud:

```js run
// IIFE yaratish usullari

*!*(*/!*function() {
  alert("Funksiya atrofidagi qavslar");
}*!*)*/!*();

*!*(*/!*function() {
  alert("Hamma narsa atrofidagi qavslar");
}()*!*)*/!*;

*!*!*/!*function() {
  alert("Bitwise NOT operatori ifodani boshlaydi");
}();

*!*+*/!*function() {
  alert("Unary plus ifodani boshlaydi");
}();
```

Yuqoridagi barcha holatlarda biz Funksiya ifodasini e'lon qilamiz va uni darhol ishga tushiramiz. Yana bir bor eslatib o'tamiz: bugungi kunda bunday kodni yozish uchun hech qanday sabab yo'q.

## Xulosa

`var` ning `let/const` ga nisbatan ikkita asosiy farqi mavjud:

1. `var` o'zgaruvchilar blok doirasiga ega emas, chunki ularning ko'rinishi joriy funktsiyaga o'xshash. Agar funktsiyadan tashqarida e'lon qilingan bo'lsa, global hisoblanadi.
2. `var` deklaratsiyalar funksiya boshlanishida qayta ishlanadi (globallar uchun skript boshlanishi).

Global obyekt bilan bog'liq yana bir juda kichik farq bor, biz uni keyingi bobda ko'rib chiqamiz.

Bu farqlar `var` ni ko'pincha `let`dan ham yomonroq qiladi. Blok darajasidagi o'zgaruvchilar ajoyib narsa. Shuning uchun `let` standartga ancha oldin kiritilgan va hozirda o'zgaruvchini e'lon qilishning asosiy usuli (`const` bilan birga) hisoblanadi.
