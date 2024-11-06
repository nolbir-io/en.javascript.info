# Funksiyalar

Ko'pincha biz skriptning ayrim joylarida o'xshash harakatni bajarishimiz kerak.

Misol uchun, tashrif buyuruvchi tizimga kirganda, tizimdan chiqqanda va ehtimol boshqa joyda yaxshi ko'rinadigan xabarni ko'rsatishimiz lozim.

Funksiyalar dasturning asosiy "qurilish bloklari" dir. Ular kodni takrorlanmasdan ko'p marta chaqirish imkonini beradi.

 Biz allaqachon `ogohlantirish (xabar)`,(alert message) `proompt(message, default)` (so'rov (xabar, standart))" va `confirm (question)`, ya'ni tasdiqlash (savol) kabi o'rnatilgan funksiyalarning misollarini ko'rganmiz. Ammo biz o'zimizning funksiyalarimizni ham yaratishimiz mumkin.

## Funksiya deklaratsiyasi

Funksiya yaratish uchun biz *funksiya deklaratsiyasi* dan foydalanamiz.

U quyidagi ko'rinishda bo'ladi:

```js
function showMessage() {
  alert( 'Hello everyone!' );
}
```
Avval `funksiya` kalit so'zi, so'ngra *funksiya nomi*, so'ngra qavslar orasidagi *parametrlar* ro'yxati (vergul bilan ajratilgan, yuqoridagi misolda bo'sh, misollarni keyinroq ko'rib chiqamiz) va nihoyat yozilgan kodga e'tibor qaratamiz. Figurali qavslar orasi "funksiya tanasi" deb ham ataladi.

```js
function name(parameter1, parameter2, ... parameterN) {
 // body
}
```

Bizning yangi funksiyamiz uning nomi bilan chaqirilishi mumkin: `showMessage()`.

Masalan:

```js run
function showMessage() {
  alert( 'Hello everyone!' );
}

*!*
showMessage();
showMessage();
*/!*
```
 
`showMessage()` chaqiruvi funksiya kodini bajaradi. Bu yerda biz xabarni ikki marta ko'ramiz.

Ushbu misol funksiyalarning asosiy maqsadlaridan biri - kodni takrorlashdan qochishni aniq ko'rsatib beradi.

Agar xabarni yoki xabar ko'rinishini o'zgartirishimiz kerak bo'lsa, kodni bitta joyda uni chiqaradigan funksiyada o'zgartirish kifoya qiladi.

## Local variables (Mahalliy o'zgaruvchilar)

Funksiya ichida e'lon qilingan o'zgaruvchi faqat shu funksiya ichida ko'rinadi.

Masalan:

```js run
function showMessage() {
*!*
  let message = "Hello, I'm JavaScript!"; // local variable
*/!*

  alert( message );
}

showMessage(); // Hello, I'm JavaScript!

alert( message ); // <-- Error! O'zgaruvchi funksiya uchun mahalliydir.
```

## Tashqi o'zgaruvchilar

Funksiya tashqi o'zgaruvchiga ham kirishi mumkin, masalan:

```js run no-beautify
let *!*userName*/!* = 'John';

function showMessage() {
  let message = 'Hello, ' + *!*userName*/!*;
  alert(message);
}

showMessage(); // Hello, John
```

Funksiya tashqi o'zgaruvchiga to'liq kirish huquqiga ega. Buni ham o'zgartirishi mumkin.

Masalan:

```js run
let *!*userName*/!* = 'John';

function showMessage() {
  *!*userName*/!* = "Bob"; // (1) tashqi o'zgaruvchini o'zgartirdi

  let message = 'Hello, ' + *!*userName*/!*;
  alert(message);
}

alert( userName ); // *!*John*/!* funksiya chaqiruvidan oldin

showMessage();

alert( userName ); // *!*Bob*/!*, qiymat funksiya tomonidan o'zgartirildi
```

Tashqi o'zgaruvchi faqat mahalliy bo'lmasa ishlatiladi.

Masalan, quyidagi kodda funksiya mahalliy `userName` dan foydalanadi. Tashqi ko'rinish e'tiborga olinmaydi:

```js run
let userName = 'John';

function showMessage() {
*!*
  let userName = "Bob"; // mahalliy o'zgaruvchini e'lon qilish
*/!*

  let message = 'Hello, ' + userName; // *!*Bob*/!*
  alert(message);
}

// funksiya o'z foydalanuvchi nomini yaratadi va ishlatadi
showMessage();

alert( userName ); // *!*John*/!*, o'zgarishsiz, funksiya tashqi o'zgaruvchiga kira olmadi
```

```smart header="Global variables" (Global o'zgaruvchilar)
Har qanday funksiyadan tashqarida e'lon qilingan o'zgaruvchilar, masalan, yuqorida berilgan koddagi tashqi `userName` *global* deb ataladi.

Global o'zgaruvchilar har qanday funksiyadan ko'rinadi (agar mahalliy o'zgaruvchi tomonidan soya qilinmasa).

Global o'zgaruvchilardan foydalanishni minimallashtirish yaxshi amaliyotdir. Zamonaviy kodda globallar kam yoki umuman yo'q. Aksariyat o'zgaruvchilar ularning funksiyalarida joylashgan. Ba'zan ular loyiha darajasidagi ma'lumotlarni saqlash uchun foydali bo'lishi mumkin.
```

## Parametrlar

Parametrlar yordamida funksiyalarga asossiz ma'lumotlarni o'tkazishimiz mumkin.

Quyidagi misolda funksiya ikkita parametrga ega: `from` va `text`.

```js run
function showMessage(*!*from, text*/!*) { // parameterlar: from, text
  alert(from + ': ' + text);
}

*!*showMessage('Ann', 'Hello!');*/!* // Ann: Hello! (*)
*!*showMessage('Ann', "What's up?");*/!* // Ann: What's up? (**)
```

Funksiya `(*)` va `(**)` qatorlarda chaqirilganda, berilgan qiymatlar `from` va `text` mahalliy o'zgaruvchilarga ko'chiriladi. Keyin funksiya ulardan foydalanadi.

Yana bir misol: bizda `from` o'zgaruvchisi bor va uni funksiyaga o'tkazamiz. Iltimos, diqqat qiling: funksiya `from` dan o'zgaradi, lekin o'zgarish tashqarida ko'rinmaydi, chunki funksiya har doim qiymatning nusxasini oladi:

```js run
function showMessage(from, text) {

*!*
  from = '*' + from + '*'; // "from"ni chiroyli ko'rinishga keltiring
*/!*

  alert( from + ': ' + text );
}

let from = "Ann";

showMessage(from, "Hello"); // *Ann*: Hello

//"from" qiymati bir xil, funksiya mahalliy nusxani o'zgartirdi
alert( from ); // Ann
```

Qiymat funksiya parametri sifatida uzatilsa, u *argument* deb ham ataladi.

Boshqacha qilib aytganda, ushbu atamalarni to'g'ri ifodalash uchun:

- Parametr - bu funksiya deklaratsiyasida qavslar ichida ko'rsatilgan o'zgaruvchidir (bu e'lon qilish muddati).
- Argument bu funksiya chaqirilganda unga uzatiladigan qiymatdir (bu chaqiruv vaqti muddati).

Biz funksiya parametrlarini sanab o'tamiz, keyin ularni o'tish argumentlari deb ataymiz.

Yuqoridagi misolda shunday deyish mumkin: `showMessage` funksiyasi ikkita parametr bilan e'lon qilinadi, keyin ikkita argument bilan chaqiriladi: ``from`` va `Hello`.


## Default values (Standart qiymatlar)

Agar funksiya chaqirilsa, lekin argument taqdim etilmasa, mos keladigan qiymat `undefined` (aniqlanmagan) bo'ladi.

Masalan, yuqorida aytib o'tilgan `showMessage(from, text)` funksiyasini bitta argument bilan chaqirish mumkin:

```js
showMessage("Ann");
```

Bu xato emas. Bunday qo'ng'iroq `"*Ann*: undefined"`ni chiqaradi. `text` qiymati o'tkazilmagani uchun u `undefined` bo'ladi.

Funksiya deklaratsiyasida parametr uchun "standart" (agar foydalanish uchun o'tkazib yuborilmagan bo'lsa) qiymatini `=` yordamida belgilashimiz mumkin:

```js run
function showMessage(from, *!*text = "no text given"*/!*) {
  alert( from + ": " + text );
}

showMessage("Ann"); // Ann: matn berilmagan
```

Endi `text` parametri o'tkazilmasa, u `no text given` (matn berilmagan) qiymatini oladi.

Agar parametr mavjud bo'lsa, standart qiymat ham o'tadi, lekin qat'iy ravishda `undefined` ga teng, masalan:

```js
showMessage("Ann", undefined); // Ann: matn berilmagan
```

Bu yerda `"no text given"` satr mavjud, lekin u murakkabroq ifoda, u faqat parametr yetishmayotgan bo'lsa baholanadi va tayinlanadi. Shunday qilib, bu vazifani bajarish ham mumkin:

```js run
function showMessage(from, text = anotherFunction()) {
  // anotherFunction() matn berilmagan taqdirdagina bajariladi
  // uning natijasi matn qiymatiga aylanadi
}
```

```smart header="Evaluation of default parameters" ("Standart parametrlarni baholash")
JavaScriptda har safar funksiya tegishli parametrsiz chaqirilganda standart parametr baholanadi.

Yuqoridagi misolda `text` parametri taqdim etilgan bo'lsa, `atherFunction()` umuman chaqirilmaydi.

Boshqa tomondan, u har safar `text` yo'qolganda mustaqil ravishda chaqiriladi.
```

````smart header="Default parameters in old JavaScript code" (Eski JavaScript kodidagi standart parametrlar")

Bir necha yil oldin, JavaScript standart parametrlar uchun sintaksisni qo'llab-quvvatlamagan. Shuning uchun odamlar ularni aniqlashning boshqa usullaridan foydalanganlar.

Hozirgi kunda biz ularni eski skriptlarda uchratishimiz mumkin.

Masalan, `undefined` uchun aniq tekshirish:

```js
function showMessage(from, text) {
*!*
  if (text === undefined) {
    text = 'no text given';
  }
*/!*

  alert( from + ": " + text );
}
```

...Or using the `||` operator:

```js
function showMessage(from, text) {
  // Agar matn qiymati noto'g'ri bo'lsa, standart qiymatni belgilang
  // bu matn == "" umuman matn yo'qligi bilan bir xil ekanligini nazarda tutadi
  text = text || 'no text given';
  ...
}
```
````


### Muqobil standart parametrlar

Ba'zan funktsiya e'lon qilinganidan keyingi bosqichda parametrlar uchun standart qiymatlarni belgilash muhim.

Funksiyani bajarish jarayonida parametr berilgan yoki yo'qligini `undefined` bilan solishtirish orqali tekshirishimiz mumkin:

```js run
function showMessage(text) {
  // ...

*!*
  if (text === undefined) { // agar parametr yetishmayotgan bo'lsa
    text = 'empty message';
  }
*/!*

  alert(text);
}

showMessage(); // bo'sh xabar
```

...Yoki `||` operatoridan foydalanishimiz mumkin:

```js
function showMessage(text) {
  // agar matn aniqlanmagan yoki noto'g'ri bo'lsa, uni "empty" qiling
  text = text || 'empty';
  ...
}
```

Zamonaviy JavaScript dvigatellari [nullish coalescing operator](info:nullish-coalescing-operator) `??` ni qo'llab-quvvatlaydi, `0` kabi noto'g'ri qiymatlarning ko'pchiligi "normal" hisoblanadi:

```js run
function showCount(count) {
  // agar raqam aniqlanmagan yoki null bo'lsa, "unknown" ("noma'lum") ni ko'rsating
  alert(count ?? "unknown");
}

showCount(0); // 0
showCount(null); // unknown
showCount(); // unknown
```

## Qiymatni qaytarish

Funksiya natija sifatida qiymatni chaqiruvchi kodga qaytarishi mumkin.

Eng oddiy misol ikkita qiymatni jamlaydigan funksiya bo'lishi mumkin:

```js run no-beautify
function sum(a, b) {
  *!*return*/!* a + b;
}

let result = sum(1, 2);
alert( result ); // 3
```

`Return` direktivasi funktsiyaning istalgan joyida bo'ladi. Bajarish unga yetganda, funksiya to'xtaydi va qiymat chaqiruvchi kodga qaytariladi (yuqoridagi `result` tayinlangan).

Bitta funktsiyada `return` ko'p bo'lishi mumkin. Masalan:

```js run
function checkAge(age) {
  if (age >= 18) {
*!*
    return true;
*/!*
  } else {
*!*
    return confirm('Do you have permission from your parents?');
*/!*
  }
}

let age = prompt('How old are you?', 18);

if ( checkAge(age) ) {
  alert( 'Access granted' );
} else {
  alert( 'Access denied' );
}
```

Qiymatsiz `return` dan foydalanish mumkin. Bu funksiyaning darhol chiqishiga olib keladi.

Masalan:

```js
function showMovie(age) {
  if ( !checkAge(age) ) {
*!*
    return;
*/!*
  }

  alert( "Showing you the movie" ); // (*)
  // ...
}
```
Yuqoridagi kodda, agar `checkAge(age)` `false` qiymatini qaytarsa, `showMovie` `alert` ga o'tmaydi.

````smart header="A function with an empty `return` or without it returns `undefined`" 
Agar funksiya qiymatni qaytarmasa, u xuddi `undefined` ni qaytargandek bo'ladi:

```js run
function doNothing() { /* empty */ }

alert( doNothing() === undefined ); // true
```

Bo'sh `return` ham `return undefined` bilan bir xil:

```js run
function doNothing() {
  return;
}

alert( doNothing() === undefined ); // true
```
````

````warn header="Hech qachon "qaytish" va qiymat o'rtasida yangi qator qo'shmang"
`Return` dagi uzoq ifoda uchun uni alohida qatorga qo'yish jozibador bo'lishi mumkin, masalan:

```js
return
 (some + long + expression + or + whatever * f(a) + f(b))
```
Bu ishlamaydi, chunki JavaScript "qaytish" dan keyin nuqta-vergulni oladi. Bu xuddi quyidagidek ishlaydi:

```js
return*!*;*/!*
 (some + long + expression + or + whatever * f(a) + f(b))
```

Shunday qilib, u samarali ravishda "empty return" ga aylanadi.

Agar qaytarilgan ifodani bir nechta satrlar bo'ylab o'tishini xohlasak, uni `return` bilan bir qatordan boshlashimiz kerak. Yoki hech bo'lmaganda ochilish qavslarini quyidagicha qo'ying:

```js
return (
  some + long + expression
  + or +
  whatever * f(a) + f(b)
  )
```
Va u biz kutgandek ishlaydi.
````

## Funksiyani nomlash [#function-naming]

Funksiyalar - bu harakatlar. Shuning uchun ularning nomi odatda fe'ldir. U qisqa, iloji boricha aniq bo'lishi va funksiya nima qilishini tasvirlab berishi kerak, shunda kodni o'qiyotgan kishi funksiya nima qilayotgani haqida ko'rsatma oladi.

Harakatni noaniq tasvirlaydigan og'zaki prefiks bilan funksiyani boshlash keng tarqalgan amaliyotdir. Prefikslarning ma'nosi bo'yicha jamoa ichida kelishuv bo'lishi kerak.

Masalan, `"show"` bilan boshlanadigan funksiyalar odatda biror narsani ko'rsatadi.

...bilan boshlanadigan funksiyalar

- `"get…"` -- qiymatni qaytaradi,
- `"calc…"` -- nimanidir hisoblaydi,
- `"create…"` -- nimanidir yaratadi,
- `"check…"` -- biror narsani tekshirib, booleanni qaytaradi va h.k.

Yuqoridagi nomlarga misollar:

```js no-beautify
showMessage(..)     // xabarni ko'rsating
getAge(..)          // yoshni qaytaradi (buni qandaydir tarzda oladi)
calcSum(..)         // summani hisoblab chiqadi va natijani qaytaradi
createForm(..)      // shakl yaratadi (va odatda uni qaytaradi)
checkPermission(..) // ruxsatni tekshiradi, true/false ni qaytaradi
```

Prefikslar o'rnatilgan bo'lsa, funksiya nomiga qarash uning qanday ishni bajarishini va qanday qiymatni qaytarishini tushunish imkonini beradi.

```smart header="Bir funksiya -- bir harakat"
Funksiya o'z nomi bilan taklif qilingan narsani bajarishi kerak, boshqasini emas.

Ikki mustaqil harakat odatda ikkita funksiyaga loyiqdir, hatto ular odatda birgalikda chaqirilsa ham (bu holda biz bu ikkalasini chaqiradigan uchinchi funksiyani yaratishimiz mumkin).

Ushbu qoidani buzishning bir nechta misollari:

- `getAge` -- yoshi bilan `alert` ko'rsatsa yomon bo'lardi (faqat olish kerak).
- `createForm` -- agar u hujjatni o'zgartirsa, unga shakl qo'shsa yomon bo'ladi (faqat uni yaratish va qaytarish kerak).
- `checkPermission` -- `kirish ruxsat berilgan/rad etilgan` xabarini ko'rsatsa, yomon bo'lardi (faqat tekshirishni amalga oshirish va natijani qaytarish kerak).

Ushbu misollar prefikslarning umumiy ma'nolarini nazarda tutadi. Siz va sizning jamoangiz boshqa ma'nolar bo'yicha kelisha olasiz, lekin odatda ular unchalik farq qilmaydi. Qanday bo'lmasin, siz prefiks nimani anglatishini, prefiksli funksiya nimani amalga oshirishi va nima qila olmasligini aniq tushunishingiz lozim. Barcha bir xil prefiksli funksiyalar qoidalarga bo'ysunishi va jamoa bilimlarni baham ko'rishi kerak.
```

```smart header="Ultra qisqa funksiya nomlari"
*Juda tez-tez* ishlatiladigan funksiyalar ba'zan ultraqisqa nomlarga ega.

Masalan, [jQuery](https://jquery.com/) ramkasi `$` bilan funksiyani belgilaydi. [Lodash](https://lodash.com/) kutubxonasi `_` nomli asosiy funksiyasiga ega.

Bu istisnolar. Odatda funksiya nomlari qisqa va tavsiflovchi bo'lishi kerak.
```

## Funksiyalar == Izohlar

Funksiyalar qisqa bo'lishi va aniq bir ishni bajarishi kerak. Agar bu narsa katta bo'lsa, funksiyani bir nechta kichikroq funksiyalarga bo'lish bunga arziydi. Ba'zan bu qoidaga rioya qilish unchalik oson bo'lmasligi mumkin, lekin bu, albatta, yaxshi narsa.

Alohida funksiyani sinab ko'rish va debug (disk raskadrovka) qilish oson emas -- uning mavjudligi ajoyib izohdir!

Misol uchun, quyidagi ikkita `showPrimes(n)` funksiyasini solishtiring. Har biri `n` gacha [tub sonlarni](https://en.wikipedia.org/wiki/Prime_number) chiqaradi.

Birinchi variant yorliqdan foydalanadi:

```js
function showPrimes(n) {
  nextPrime: for (let i = 2; i < n; i++) {

    for (let j = 2; j < i; j++) {
      if (i % j == 0) continue nextPrime;
    }

    alert( i ); // tub son
  }
}
```

Ikkinchi variantda birlamchilikni tekshirish uchun qo'shimcha `isPrime(n)` funksiyasidan foydalaniladi:

```js
function showPrimes(n) {

  for (let i = 2; i < n; i++) {
    *!*if (!isPrime(i)) continue;*/!*

    alert(i);  // a prime
  }
}

function isPrime(n) {
  for (let i = 2; i < n; i++) {
    if ( n % i == 0) return false;
  }
  return true;
}
```
Ikkinchi variantni tushunish osonroq, shunday emasmi? Kod qismi o'rniga biz harakat nomini ko'ramiz (`isPrime`). Ba'zan odamlar bunday kodni *o'zini tavsiflash* deb atashadi.

Shunday qilib, biz ularni qayta ishlatish niyatimiz bo'lmasa ham, funksiyalar yaratilishi mumkin. Ular kodni tuzadilar va uni o'qish imkoniyatini yaratadi.

## Xulosa

Funksiya deklaratsiyasi quyidagicha ko'rinadi:

```js
function name(parameters, delimited, by, comma) {
  /* code */
}
```

- Funksiyaga parametr sifatida berilgan qiymatlar uning mahalliy o'zgaruvchilariga ko'chiriladi.
- Funksiya tashqi o'zgaruvchilarga kirishi mumkin. Ammo u faqat ichkaridan ishlaydi. Funksiyadan tashqaridagi kod mahalliy o'zgaruvchilarni ko'rmaydi.
- Funksiya qiymatni qaytarishi mumkin. Agar shunday bo'lmasa, uning natijasi `undefined` hisoblanadi.

Kodni toza va tushunarli qilish uchun funksiyada tashqi o'zgaruvchilardan emas, asosan mahalliy o'zgaruvchilar va parametrlardan foydalanish tavsiya etiladi.

Parametrlarni oladigan, ular bilan ishlaydigan va natija qaytaradigan funksiyani tushunish har doim parametrlarga ega bo'lmagan, ammo tashqi o'zgaruvchilarni yon ta'sir sifatida o'zgartiradigan funksiyaga qaraganda osonroqdir.

Funksiyani nomlash:

- Nom funksiya nima qilishini aniq tasvirlab berishi kerak. Kodda funksiya chaqiruvini ko'rganimizda, yaxshi nom bizga darhol nima qilishini va qaytib kelishini tushunish imkonini beradi.
- Funksiya - bu harakat, shuning uchun funksiya nomlari odatda og'zaki bo'ladi.
- `create…`, `show…`, `get…`, `check…` va boshqalar kabi ko'plab taniqli funksiya prefikslari mavjud. Funksiya nima qilishini ko'rsatish uchun ulardan foydalaning.

Funksiyalar skriptlarning asosiy qurilish bloklari hisoblanadi. Endi biz asoslarni ko'rib chiqdik, shuning uchun biz ularni yaratish va ishlatishni boshlashimiz mumkin. Ammo bu faqat yo'lning boshlanishi. Biz ularga ko'p marta qaytamiz va ularning ilg'or xususiyatlariga chuqurroq kirib boramiz.