# Stringlar

JavaScriptda matnli ma'lumotlar string sifatida saqlanadi. Bitta belgi uchun alohida tur mavjud emas.

Stringlar uchun ichki format har doim [UTF-16](https://en.wikipedia.org/wiki/UTF-16) bo'lib, u sahifa kodlanishiga bog'liq emas.

## Quotes (Qo'shtirnoqlar)

Keling, quote turlarini esga olamiz.

Stringlar yakka qo'shtirnoq, ikkitalik qo'shtirnoq yoki backticklar ichiga kiritilishi mumkin:

```js
let single = 'single-quoted';
let double = "double-quoted";

let backticks = `backticks`;
```

Yakka va ikkitalik qo'shtirnoqlar asosan bir xil. Biroq, backticklar uni `${}` ichiga o'rash orqali istalgan ifodani string ichiga kiritish imkonini beradi:

```js run
function sum(a, b) {
  return a + b;
}

alert(`1 + 2 = ${sum(1, 2)}.`); // 1 + 2 = 3.
```

Backticklardan foydalanishning yana bir afzalligi shundaki, ular stringga bir nechta satrlarni qamrab olish imkonini beradi:

```js run
let guestList = `Guests:
 * John
 * Pete
 * Mary
`;

alert(guestList); // mehmonlar ro'yxati, bir nechta satr
```

Tabiiy ko'rinadi, to'g'rimi? Ammo yakka yoki ikkitalik qo'shtirnoqlar bu tarzda ishlamaydi.

Ulardan foydalanganimizda bir nechta qatorlardan foydalanishga harakat qilsak, xatolik paydo bo'ladi:

```js run
let guestList = "Guests: // Error: Kutilmagan NOQONUNIY token 
  * John";
```

Yakka va qo'sh qo'shtirnoqlar ko'p qatorli stringlarga bo'lgan ehtiyoj e'tiborga olinmagan til yaratilishining qadimgi davrlaridan kelib chiqqan. Backticklar ancha keyin paydo bo'ldi va shuning uchun ular ko'p qirrali.

Backticklar, shuningdek, birinchi backtickdan oldin "template function" (shablon funktsiyasi)ni belgilashga imkon beradi. Sintaksis: <code>func&#96;string&#96;</code>. `func` funktsiyasi avtomatik ravishda chaqiriladi, string va kiritilgan ifodalarni qabul qiladi va ularga ishlov bera oladi. Bu "tagged templates" (teglangan shablonlar) deb ataladi. Bu xususiyat maxsus shablonni amalga oshirishni osonlashtiradi, lekin amalda kamdan-kam qo'llaniladi. Bu haqda ko'proq ma'lumotni [qo'llanma] (mdn:/JavaScript/Reference/Template_literals#Tagged_templates)da o'qishingiz mumkin.

## Maxsus belgilar

Yakka va qo'sh qo'shtirnoqli ko'p qatorli stringlarni `\n` sifatida yozilgan "yangi qator belgisi" yordamida hali ham yaratish mumkin, bu chiziq uzilishini bildiradi:

```js run
let guestList = "Guests:\n * John\n * Pete\n * Mary";

alert(guestList); // yuqoridagi kabi mehmonlarning ko'p qatorli ro'yxati
```

Masalan, ushbu ikkita qator teng, faqatgina turlicha yozilgan:

```js run
let str1 = "Hello\nWorld"; // "yangi qator belgisi" yordamida ikki qator

// oddiy yangi qator va teskari belgilar yordamida ikkita satr
let str2 = `Hello
World`;

alert(str1 == str2); // true
```

Boshqa, ko'p uchramaydigan "maxsus" belgilar mavjud.

Quyida to'liq ro'yxat berilgan:

| Belgi | Tavsif |
|-----------|-------------|
|`\n`|Yangi qator|
|`\r`|Windows matn fayllarida ikkita belgidan iborat `\r\n` yangi uzilishni bildirsa, Windows bo'lmagan operatsion tizimda bu shunchaki `\n`. Bu tarixiy sabablarga ko'ra, Windows dasturiy ta'minotining aksariyati `\n` ni ham tushunadi.|
|`\'`, `\"`|Qo'shtirnoqlar|
|`\\`|Backslash|
|`\t`|Tab|
|`\b`, `\f`, `\v`| Backspace, Form Feed, Vertical Tab -- muvofiqligi uchun saqlanadi, undan hozirda foydalanilmaydi. |
|`\xXX`|Berilgan o'n oltilik Unicode `XX` bilan Unicode belgisi, masalan. `'\x7A'` `'z'` bilan bir xil|
|`\uXXXX`|UTF-16 kodlashda `XXXX` o'n oltilik kodli Unicode belgisi, masalan, `\u00A9` -- mualliflik huquqi `©` belgisi uchun Unicode hisoblanadi. Bu to'liq 4 ta o'n oltilik raqam bo'lishi kerak.|
|`\u{X…XXXXXX}` (1 dan 6 gacha o'n oltilik belgilar)|Berilgan UTF-32 kodlashiga ega Unicode belgisi. Ba'zi noyob belgilar 4 baytni egallagan holda ikkita Unicode belgisi bilan kodlangan bo'ladi. Shu tarzda biz uzun kodlarni kiritishimiz mumkin.|

Ko'rib turganingizdek, barcha maxsus belgilar `\` teskari chiziq belgisi bilan boshlanadi. Bundan tashqari, uni "qochish xarakteri" (escape character) deb ham atashadi.

Bu juda o'ziga xos bo'lgani uchun, agar biz satr ichida `\` teskari chiziqni ko'rsatishimiz kerak bo'lsa, biz uni ikki barobarga oshirishimiz kerak:

```js run
alert( `The backslash: \\` ); // backslash: \
```

Undan stringga qo'shtirnoq kiritmoqchi bo'lganimizda ham foydalanishimiz mumkin.
Masalan:

```js run
alert( 'I*!*\'*/!*m the Walrus!' ); // *!*I'm*/!* the Walrus!
```

Ko'rib turganingizdek, ichki qo'shtirnoqning oldiga backslash `\'`ni qo'shishimiz kerak, chunki u string tugashini bildiradi.

Albatta, faqat o'rab turuvchilar bilan bir xil bo'lgan qo'shtirnoqlardan qochish kerak. Shunday qilib, yanada elegant yechim sifatida biz qo'sh qo'shtirnoq yoki backticklarni olishimiz mumkin:

```js run
alert( "I'm the Walrus!" ); // I'm the Walrus!
```

E'tibor bering, `\` teskari chiziq JavaScript orqali stringni to'g'ri o'qish uchun xizmat qiladi va keyin yo'qoladi. Ichki xotiradagi stringda `\` mavjud bo'lmaydi. Yuqoridagi misollardan `alert` da buni aniq ko'rishingiz mumkin.

Agar satr ichida haqiqiy backslash `\`ni ko'rsatishimiz kerak bo'lsa-chi?

Buning imkoni bor, lekin uni `\\` kabi ikki barobar qilishimiz kerak:

```js run
alert( `The backslash: \\` ); // The backslash: \
```
Ushbu maxsus belgilardan tashqari, Unicode kodlari `\u…` uchun maxsus belgi ham mavjud bo'lib, u kamdan-kam qo'llaniladi va [Unicode] (info: unicode) haqidagi ixtiyoriy bo'limda yoritiladi.

## String uzunligi

 `length` xususiyati string uzunligiga ega:

```js run
alert( `My\n`.length ); // 3
```

Yodda tuting, `\n` bu yakka "maxsus" belgi, shuning uchun uzunlik aslida `3` bo'ladi.

```warn header="`length` xususiyat hisoblanadi"
Ba'zi boshqa tillardan xabari bor odamlar ba'zan `str.length` o'rniga `str.length()` deb noto'g'ri yozishadi. Bu ishlamaydi.

Yodda tuting, `str.length` bu funksiya emas, balki raqamli xususiyat. Undan keyin qavslar qo'shishning hojati yo'q.
```

## Belgilarga kirish

`pos` o'rindagi belgini olish uchun to'rburchak `[pos]` qavslardan foydalaning  yoki [str.charAt(pos)](mdn:js/String/charAt) usulini chaqiring. Birinchi belgi nol o'rindan boshlanadi:

```js run
let str = `Hello`;

// birinchi xarakter
alert( str[0] ); // H
alert( str.at(0) ); // H

// oxirgi xarakter
alert( str[str.length - 1] ); // o
alert( str.at(-1) );
```

To'rtburchak qavslar belgini olishning zamonaviy usuli hisoblanadi, `charAt` esa asosan tarixiy sabablarga ko'ra mavjud.

Ular o'rtasidagi yagona farq shundaki, agar hech qanday belgi topilmasa, `[]` `undefined` ni, `charAt` esa bo'sh stringni qaytaradi:

Ko'rib turganingizdek, ``.at(pos)` usuli salbiy pozitsiyaga ruxsat berishning afzalliklariga ega. Agar `pos` salbiy bo'lsa, u satr oxiridan boshlab hisoblanadi.

Demak, `.at(-1)` oxirgi belgi, `.at(-2)` esa undan oldingi belgi va hokazo.

Kvadrat qavslar har doim salbiy indekslar uchun  `undefined` ni qaytaradi, masalan:

```js run
let str = `Hello`;

alert( str[-2] ); // undefined
alert( str.at(-2) ); // l
```

Biz yana `for..of` yordamida belgilarni takrorlashimiz mumkin:

```js run
for (let char of "Hello") {
  alert(char); // H,e,l,l,o (char "H"ga, keyin "e" ga, so'ng "l" ga aylanadi)
}
```

## Stringlar o'zgarmasdir

JavaScriptda stringlarni o'zgartirib bo'lmaydi. Belgini o'zgartirishnig imkoni yo'q.

Keling, uning ishlamasligini ko'rsatishga harakat qilib ko'ramiz:

```js run
let str = 'Hi';

str[0] = 'h'; // error
alert( str[0] ); // ishlamaydi
```

Odatdagi vaqtinchalik yechim butunlay yangi string yaratish va uni eskisi o'rniga `str` ​​ga tayinlashdir.

Masalan:

```js run
let str = 'Hi';

str = 'h' + str[1]; // stringni almashtiring

alert( str ); // hi
```

Keyingi bo'limlarda bunga ko'proq misollar ko'rib chiqamiz.

## Holatni o'zgartirish

[toLowerCase()](mdn:js/String/toLowerCase) va [toUpperCase()](mdn:js/String/toUpperCase) metodlari holatni o'zgartirishadi:

```js run
alert( 'Interface'.toUpperCase() ); // INTERFACE
alert( 'Interface'.toLowerCase() ); // interface
```

Yoki bitta belgini kichik harf bilan yozishni xohlaganimizda ulardan foydalanishimiz mumkin:

```js run
alert( 'Interface'[0].toLowerCase() ); // 'i'
```

## substringni qidirish

String ichidan substring qidirishning bir nechta usullari mavjud.

### str.indexOf

Birinchi metod bu [str.indexOf(substr, pos)](mdn:js/String/indexOf).

U `str` dan `substr` ni qidiradi, berilgan `pos` o'rindan boshlanadi va o'xshash topilgan o'rinni yoki agar hech nima topilmasa `-1`ni qaytaradi.

Masalan:

```js run
let str = 'Widget with id';

alert( str.indexOf('Widget') ); // 0, chunki "Widget" boshida topilgan
alert( str.indexOf('widget') ); // -1, topilmadi, qidiruv katta-kichik harflarni hisobga oladi

alert( str.indexOf("id") ); // 1, "id" 1-pozitsiyada joylashgan (..idget bilan)
```

Ixtiyoriy ikkinchi parametr bizga ma'lum bir o'rindan qidirishni boshlash imkonini beradi.

Masalan, `"id"` `1`- o'rinda paydo bo'ladi. Keyingi paydo bo'lishlarini qidirish uchun qidiruvni `2`- o'rindan boshlaymiz:

```js run
let str = 'Widget with id';

alert( str.indexOf('id', 2) ) // 12
```

Agar bizni barcha paydo bo'lishlar qiziqtirsa, biz `indexOf` ni loop-da ishga tushirishimiz mumkin. Har bir yangi chaqiruv oldingi o'xshashlikdan keyingi o'rin bilan amalga oshiriladi:

```js run
let str = 'As sly as a fox, as strong as an ox';

let target = 'as'; // uni qidirib ko'ramiz

let pos = 0;
while (true) {
  let foundPos = str.indexOf(target, pos);
  if (foundPos == -1) break;

  alert( `Found at ${foundPos}` );
  pos = foundPos + 1; // keyingi pozitsiyadan qidiruvni davom ettiring
}
```

Aynan shu algoritmni qisqaroq qilib ko'rsatish mumkin:

```js run
let str = "As sly as a fox, as strong as an ox";
let target = "as";

*!*
let pos = -1;
while ((pos = str.indexOf(target, pos + 1)) != -1) {
  alert( pos );
}
*/!*
```

```smart header="`str.lastIndexOf(substr, position)`"
Shunga o'xshash stringning oxiridan boshiga qarab qidiradigan [str.lastIndexOf(substr, position)](mdn:js/String/lastIndexOf) usuli ham mavjud.

U paydo bo'lishlarni teskari tartibda ro'yhatga oladi.
```

`if` testida `indexOf` bilan bilan biroz noqulaylik bo'ladi. Uni `if`ni ichiga quyidagi kabi qo'yolmaymiz:

```js run
let str = "Widget with id";

if (str.indexOf("Widget")) {
    alert("We found it"); // ishlamaydi!
}
```

Yuqoridagi misoldagi `alert` ko'rinmaydi chunki `str.indexOf("Windget")` `0`ni qaytaradi (bu moslikni dastlabki o'rinda topilganini bildiradi). To'g'ri, lekin `if` `0` ni `false` deb hisoblaydi.

Shuning uchun, biz aslida `-1` ni tekshirishimiz kerak, quyidagidek:

```js run
let str = "Widget with id";

*!*
if (str.indexOf("Widget") != -1) {
*/!*
    alert("We found it"); // endi ishlaydi!
}
```

#### Bitwise NOT hiylasi

Bu yerda ishlatilgan qadimgi hiylalardan biri bu [bitwise NOT](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_NOT) `~` operatoridir. U raqamni 32 bitlik butun songa konvertatsiya qiladi (mavjud kasr qismni olib tashlaydi) va keyin o'zining ikkilik ko'rinishidagi barcha bitlarni teskariga o'zgartiradi.

Amalda bu oddiy narsani anglatadi: 32 bitlik butun sonlar uchun `~n` `-(n+1)`ga teng.

Masalan:

```js run
alert( ~2 ); // -3, -(2+1) bilan bir xil
alert( ~1 ); // -2, -(1+1) bilan bir xil
alert( ~0 ); // -1, -(0+1) bilan bir xil
*!*
alert( ~-1 ); // 0, -(-1+1) bilan bir xil
*/!*
```

Ko'rib turganingizdek, `~n` faqat `n == -1` bo'lganida (ya'ni har qanday 32 bitli butun `n` uchun) nolga teng.

Shunday qilib, `if (~str.indexOf("...") )` tekshiruvi faqat`indexOf` ning natijasi `-1` bo'lmaganda, boshqacha aytadigan bo'lsak, faqat moslik topilgandagina to'g'ri bo'ladi. 

Odamlar undan `indexOf` tekshiruvlarini qisqartirish uchun foydalanadilar:

```js run
let str = "Widget";

if (~str.indexOf("Widget")) {
  alert( 'Found it!' ); // ishlaydi
}
```

Odatda til xususiyatlaridan noaniq tarzda foydalanish tavsiya etilmaydi, ammo bu maxsus hiyla eski kodda keng qo'llaniladi, shuning uchun uni tushunishimiz kerak.

Esda tuting: `if (~str.indexOf(...))` "if topildi" tarzida o'qiydi.

Aniqroq qilib aytadigan bo'lsak, katta raqamlar `~` operatori tomonidan 32 bitga qisqartirilganligi sababli, `0` beradigan boshqa raqamlar ham mavjud, eng kichigi `~4294967295=0`. Agar satr unchalik uzun bo'lmasa, bunday tekshiruv to'g'ri bajariladi.

Ayni vaqtda bunday hiylani faqat eski kodda ko'rishimiz mumkin, chunki zamonaviy JavaScript `.includes` metodini beradi.

### includes, startsWith, endsWith

Zamonaviyroq [str.includes(substr, pos)](mdn:js/String/includes) metodi `str` ichida `substr` bor yoki yo'qligiga qarab `true/false`ni qaytaradi.

Agar biz moslikni tekshirishimiz zarur, lekin uning o'rni kerak bo'lmasa, bu eng to'g'ri tanlovdir.

```js run
alert( "Widget with id".includes("Widget") ); // true

alert( "Hello".includes("Bye") ); // false
```

`str.includes`ning ixtyoriy ikkinchi argumenti qidirishni boshlash o'rnini bildiradi:

```js run
alert( "Widget".includes("id") ); // true
alert( "Widget".includes("id", 3) ); // false, 3-pozitsiyadan "id" yo'q
```

[str.startsWith](mdn:js/String/startsWith) va [str.endsWith](mdn:js/String/endsWith) metodlari aynan o'zlari anglatgan narsani bajaradilar:

```js run
alert( "*!*Wid*/!*get".startsWith("Wid") ); // true, "Widget" "Wid" bilan boshlanadi
alert( "Wid*!*get*/!*".endsWith("get") ); // true, "Widget" "get" bilan tugaydi
```

## substringni olish

JavaScriptda substringni olishning 3 ta usuli mavjud: `substring`, `substr` va `slice`.

`str.slice(start [, end])`
: Stringning `start` dan `end`(o'z ichida olmaydi)gacha bo'lgan qismini qaytaradi.

    Masalan:

    ```js run
    let str = "stringify";
    alert( str.slice(0, 5) ); // 'strin', pastki qator 0 dan 5 gacha (5 dan tashqari)
    alert( str.slice(0, 1) ); // 's', 0 dan 1 gacha, lekin 1 ni o'z ichiga olmaydi, shuning uchun faqat 0 da belgi
    ```

    Agar ikkinchi argument bo'lmasa, u holda `slice` stringning oxiriga qadar boradi:

    ```js run
    let str = "st*!*ringify*/!*";
    alert( str.slice(2) ); // 'ringify', 2-o'rindan oxirigacha
    ```

    `start/end` uchun manfiy qiymatlar qo'yishning imkoni bor. Ular o'rin string oxiridan boshlab sanalishini anglatadi:

    ```js run
    let str = "strin*!*gif*/!*y";

    // o'ngdan 4-pozitsiyadan boshlang, o'ngdan 1-da tugaydi
    alert( str.slice(-4, -1) ); // 'gif'
    ```

`str.substring(start [, end])`
: Stringning `start` va `end` *o'rtasidagi* qismini qaytaradi.

    Bu deyarli `slice` bilan bir xil, ammo u `start`ga `end`dan kattaroq bo'lish imkonini beradi.
:Satrning `start` va `end` *o'rtasidagi* qismini qaytaradi (`end` dan tashqari).

    Masalan:

    ```js run
    let str = "st*!*ring*/!*ify";

    // bular pastki qator uchun bir xil
    alert( str.substring(2, 6) ); // "ring"
    alert( str.substring(6, 2) ); // "ring"

    // ...but not for slice:
    alert( str.slice(2, 6) ); // "ring" (bir xil)
    alert( str.slice(6, 2) ); // "" (bo'sh string)

    ```

    Manfiy argumentlar (slice bundan mustasno) qo'llab quvvatlanmaydi, ularga `0` sifatida qaraladi.

`str.substr(start [, length])`
: Stringning `start` dan boshlab berilgan `length` (uzunlik) ga teng qismini qaytaradi.

    Avvalgi metodlardan farqi shundaki, bu metod bizga oxirgisining o'rniga `length` ni aniqlash imkonini beradi:

    ```js run
    let str = "st*!*ring*/!*ify";
    alert( str.substr(2, 4) ); // 'ring', 2-pozitsiyadan 4 ta belgini oling
    ```

    Birinchi argument negative bo'lishi mumkin, bu oxiridan sanash kerakligini anglatadi:

    ```js run
    let str = "strin*!*gi*/!*fy";
    alert( str.substr(-4, 2) ); // 'gi', 4-pozitsiyadan 2 ta belgi oling
    ```

Keling, chalkashmaslik uchun ushbu usullarni takrorlaymiz:
    
    Bu usul til spetsifikatsiyasining [Annex B](https://tc39.es/ecma262/#sec-string.prototype.substr) B ilovasida joylashgan. Bu shuni anglatadiki, faqat brauzerda joylashgan Javascript dvigatellari uni qo'llab-quvvatlashi kerak va undan foydalanish tavsiya etilmaydi. Amalda, u hamma joyda qo'llab-quvvatlanadi.

| metod | tanlaydi... | manfiylar |
|--------|-----------|-----------|
| `slice(start, end)` | `start` dan `end` gacha (`end` kirmaydi) | manfiylarga ruxsat beradi |
| `substring(start, end)` | `start` va `end` o'rtasi | manfiy qiymatlar `0`ni anglatadi |
| `substr(start, length)` | `start` dan boshlab `length` ta belgi | manfiy `start`ga ruxsat beradi |


```smart header="Qaysi birini tanlash lozim?"

Ularning barchasi vazifani bajarishi mumkin. `substr` kichik kamchiliklarga ega: u asosiy JavaScript spetsifikatsiyasida emas, balki Annex B da tasvirlangan, bu asosan tarixiy sabablarga ko'ra mavjud bo'lgan faqat brauzer funksiyalarini qamrab oladi. Shunday qilib, brauzer bo'lmagan muhitlar uni qo'llab-quvvatlamasligi ehtimoli mavjud. Ammo amalda u hamma joyda ishlaydi.

Qolgan ikkita variantdan `slice` biroz moslashuvchan, u manfiy argumentlarga ruxsat beradi va yozishni qisqartiradi. 

Shunday qilib, ushbu uchta metoddan faqat `slice` ni eslab qolish kifoya.
```

## Stringlarni taqqoslash

Bizga <info:comparison> bo'limidan ma'lumki, stringlar alifbo tartibda belgima-belgi taqqoslanadi.

Shunga qaramay, ba'zi bir istisnolar mavjud.

1. Kichik harf har doim bosh harfdan katta:

    ```js run
    alert( 'a' > 'Z' ); // true
    ```

2. Diakritik belgilarga ega harflar "tartibdan tashqari"::

    ```js run
    alert( 'Österreich' > 'Zealand' ); // true
    ```

    Agar biz ushbu mamlakat nomlarini tartiblasak, bu g'alati natijalarga olib kelishi mumkin. Odatda odamlar `Zealand` ro'yxatda `Österreich` dan keyin kelishini kutishadi.

Nima sodir bo'lishini tushunish uchun, keling, JavaScriptda stringlarning ichki ko'rinishini ko'rib chiqamiz.

Barcha stringlar [UTF-16](https://en.wikipedia.org/wiki/UTF-16) orqali kodlangan. Ya'ni, har bir belgi tegishli raqamli kodga ega. 

Koddan belgini olish va qaytarishning maxsus metodlari mavjud.

`str.codePointAt(pos)`
: `pos` pozitsiyasidagi belgi kodini ifodalovchi kasrli raqamni qaytaradi:

    ```js run
    // turli harflar har xil kodlarga ega
    alert( "Z".codePointAt(0) ); // 90
    alert( "z".codePointAt(0) ); // 122
    alert( "z".codePointAt(0).toString(16) ); // 7a (agar bizga o'n oltilik qiymat kerak bo'lsa)
    ```

`String.fromCodePoint(code)`
: o'zining raqamli `code` (kodi) dan belgi yaratadi:

    ```js run
    alert( String.fromCodePoint(90) ); // Z
    ```

    Unicode belgilarini kodlari bo'yicha `\u` va undan keyin keluvchi o'n oltilik kod yordamida qo'shishimiz mumkin:

    ```js run
    // 90 - o'n oltilik tizimda 5a
    alert( '\u005a' ); // Z
    alert( String.fromCodePoint(0x5a) ); // Z (argument sifatida olti burchakli qiymatdan ham foydalanishimiz mumkin)
    ```

Endi `65..220` (lotin alifbosi va biroz qo'shimcha) kodlari bo'lgan belgilarni ularning stringini yasash orqali ko'rib chiqamiz:

```js run
let str = '';

for (let i = 65; i <= 220; i++) {
  str += String.fromCodePoint(i);
}
alert( str );
// Natija:
// ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
// ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜ
```

Ko'rdingizmi? Avval bosh harflar, keyin bir nechta maxsus belgilar, keyin kichik harflar va ouput ning oxiriga yaqin `Ö` keladi. 

Endi nega `a > Z` ekanligi aniq bo'ldi.

Belgilar ularning raqamli kodi bilan taqqoslanadi. Kattaroq kod belgi kattaroq ekanligini anglatadi. `a` (97) kodi `Z` (90) kodidan kattaroqdir.

- Barcha kichik harflar katta harflardan keyin keladi, chunki ularning kodlari kattaroqdir.
- `Ö` kabi ba'zi harflar asosiy alifbodan ajralib turadi. Bu yerda uning kodi `a` dan `z` gacha bo'lgan hamma narsadan kattaroqdir.

### To'g'ri taqqoslashlar [#correct-comparisons]

Stringlarni taqqoslashning "to'g'ri" algoritmi ko'ringaniga qaraganda murakkabroq, chunki alifbolar turli tillar uchun turlichadir.

Shuning uchun, brauzer taqqoslash uchun tilni bilishi lozim.

Yaxshiyamki, barcha zamonaviy brauzerlar (IE10- qo'shimcha kutubxona [Intl.js](https://github.com/andyearnshaw/Intl.js/) ni talab qiladi) xalqarolashtirish standarti [ECMA-402](http://www.ecma-international.org/ecma-402/1.0/ECMA-402.pdf) ni qo'llab-quvvatlaydi.

U turli tillardagi stringlarni ularning qoidalariga rioya qilgan holda solishtirishning maxsus metodini taqdim etadi.

[str.localeCompare(str2)](mdn:js/String/localeCompare) chaqiruvi til qoidalariga muvofiq `str` `str2` dan kichik, teng yoki katta ekanligini ko'rsatuvchi butun sonni qaytaradi:

- Agar`str` `str2`dan kichik bo'lsa, manfiy son qaytaradi.
- Agar`str` `str2`dan katta bo'lsa, musbat son qaytaradi.
- Agar ular teng bo'lsa, `0` ni qaytaradi.

Masalan:

```js run
alert( 'Österreich'.localeCompare('Zealand') ); // -1
```
Bu usul [documentation](mdn:js/String/localeCompare)da ko'rsatilgan ikkita qo'shimcha argumentga ega bo'lib, bu unga tilni aniqlash imkonini beradi (odatda muhitdan olingan bo'lib, harflar tartibi tilga bog'liq bo'ladi) va  harf sezgirligi yoki `"a"` va `"á"` ga bir xil sifatida qarash kabi qo'shimcha qoidalarni o'rnatishga imkon beradi.

## Ichki qismlar, Unicode

```warn header="Advanced knowledge"

Ushbu bo'lim stringning ichki qismlariga chuqurroq kiradi. Agar siz emoji, noyob matematik yoki ieroglif belgilar yoki boshqa noyob belgilar bilan shug'ullanishni rejalashtirgan bo'lsangiz, bu bilim siz uchun foydali bo'ladi.

Agar buni rejalashtirmagan bo'lsangiz, bo'limni o'tkazib yuborishingiz mumkin.
```

### Surrogat (o'rinbosar) jufliklar

Tez-tez ishlatiladigan barcha belgilar 2 baytlik kodlarga ega. Ko'pgina Yevropa tillaridagi harflar, raqamlar va hatto ko'pchilik ierogliflar 2 baytdan iborat.

Ammo 2 bayt faqat 65536 kombinatsiyaga ruxsat beradi va bu har bir mumkin bo'lgan belgi uchun yetarli emas. Shunday qilib, noyob belgilar "surrogat juftlik" deb nomlangan 2 baytli belgilar juftligi bilan kodlangan.

Bunday belgining uzunligi `2` ga teng:

```js run
alert( '𝒳'.length ); // 2, X MATEMATIK BELGI
alert( '😂'.length ); // 2, XURSANDchilik KO'Z YOSHLARI bor YUZ
alert( '𩷶'.length ); // 2, NOYOB Xitoy iyeroglifi
```

Yodda tuting, JavaScript yaratilgan vaqtda surrogat juftliklar mavjud emas edi va shuning uchun ularga til tomonidan to'g'ri ishlov berilmagan!

Yuqoridagi stringlarning har birida bitta belgi bor, lekin `length` `2` bo'lgan uzunlikni ko'rsatadi.

`String.fromCodePoint` va `str.codePointAt` surrogat juftliklar bilan to'g'ri shug'ullanadigan kamdan-kam matodlardir. Ular tilda yaqinda paydo bo'lgan. Ulardan avval faqat [String.fromCharCode](mdn:js/String/fromCharCode) va [str.charCodeAt](mdn:js/String/charCodeAt) mavjud edi. Bu metodlar aslida `fromCodePoint/codePointAt` bilan bir xil, ammo surrogat jufliklar bilan ishlamaydi.

Belgini olish qiyin bo'lishi mumkin, chunki surrogat juftliklar ikkita belgi sifatida ko'rib chiqiladi:

```js run
alert( '𝒳'[0] ); // g'alati belgilar...
alert( '𝒳'[1] ); // ...surrogat juftining bo'laklari
```

Yodda tuting, surrogat juftlik qismlari bir-birisiz hech qanday ma'noga ega emas. Shunday ekan, yuqoridagi misoldagi `alert`lar aslida keraksiz narsani ko'rsatadi.

Texnik jihatdan, surrogat juftlarni o'z kodlari orqali ham aniqlash mumkin: agar belgi `0xd800..0xdbff` oralig'ida kodga ega bo'lsa, u surrogat juftlikning birinchi qismidir. Keyingi belgi (ikkinchi qism) `0xdc00..0xdfff` oralig'ida kodga ega bo'lishi kerak. Ushbu intervallar standart bo'yicha faqat surrogat juftliklar uchun ajratilgan.

Yuqoridagi holatda:

```js run
// charCodeAt surrogat juftlikdan xabardor emas, shuning uchun u qismlar uchun kodlarni beradi

alert( '𝒳'.charCodeAt(0).toString(16) ); // d835, 0xd800 va 0xdbff o'rtasida
alert( '𝒳'.charCodeAt(1).toString(16) ); // dcb3, 0xdc00 va 0xdfff o'rtasida
```

Surrogat juftliklar bilan ishlashning boshqa usullarini keyinroq <info:iterable> bobida topasiz. Ehtimol, buning uchun maxsus kutubxonalar ham mavjud, ammo bu yerda taklif qilish uchun aniq hech narsa yo'q.

### Diakritik belgilar va normalizatsiya

Ko'pgina tillarda ustida/ostida belgisi bor asosiy belgidan iborat bo'lgan belgilar mavjud.

Masalan, `a` harfi `àáâäãåā` uchun asosiy belgi bo'lishi mumkin. Eng keng tarqalgan "kompozit" belgilar UTF-16 jadvalida o'z kodiga ega. Lekin ular hammasi emas, chunki mumkin bo'lgan kombinatsiyalar juda ko'p.

Ixtiyoriy kompozitsiyalarni qo'llab-quvvatlash uchun UTF-16 bizga bir nechta Unicode belgilaridan foydalanishga imkon beradi: asosiy belgidan keyin uni "bezaydigan" bir yoki bir nechta "belgi" harflar.

Masalan, agar bizda `S` va undan keyin "ustida nuqtali" maxsus belgi bo'lsa (kod `\u0307`), u Ṡ bo'lib ko'rsatiladi.

```js run
alert( 'S\u0307' ); // Ṡ
```

Agar harf ustida (yoki ostida) qo'shimcha belgi kerak bo'lsa -- bu muammo emas, shuchaki kerakli belgi harfini qo'shing.

Masalan, agar harfga "ostki nuqta" (kod `\u0323`) ni birlashtirsak , u holda biz "osti va ustida nuqtali S" ga erishamiz: `Ṩ`.

Misol uchun:

```js run
alert( 'S\u0307\u0323' ); // Ṩ
```

Bu yuqori moslashuvchanlikni ta'minlaydi, lekin ayni paytda qiziqarli muammo: ikkita belgi vizual ravishda bir xil ko'rinishi, ammo unicode turli kompozitsiyalari bilan ifodalanishi mumkin.

Misol uchun:

```js run
let s1 = 'S\u0307\u0323'; // Ṩ, S + yuqorida nuqta + pastda nuqta
let s2 = 'S\u0323\u0307'; // Ṩ, S + pastda nuqta + yuqorida nuqta

alert( `s1: ${s1}, s2: ${s2}` );

alert( s1 == s2 ); // false, garchi belgilar bir xil ko'rinsa ham (?!)
```

Buni hal qilish uchun har bir string yagona "normal" shaklga keltiradigan "Unicode normalizatsiya" algoritmi mavjud.

U [str.normalize()](mdn:js/String/normalize) orqali amalga oshiriladi.

```js run
alert( "S\u0307\u0323".normalize() == "S\u0323\u0307".normalize() ); // true
```

Qizig'i shundaki, bizning vaziyatimizda `normalize()` aslida 3 ta belgidan iborat ketma-ketlikni bittaga birlashtiradi: `\u1e68` (ikki nuqtaga ega S).

```js run
alert( "S\u0307\u0323".normalize().length ); // 1

alert( "S\u0307\u0323".normalize() == "\u1e68" ); // true
```

Aslida, har doim ham bunday emas. Sababi, `Ṩ` belgisi "yetarlicha umumiy" bo'lgani uchun UTF-16 yaratuvchilari uni asosiy jadvalga kiritishgan va unga kod berishgan.

Agar normallashtirish qoidalari va variantlari haqida ko'proq ma'lumotga ega bo'lishni istasangiz -- ular Unicode standartining ilovasida tasvirlangan: [Unicode Normalization Forms](http://www.unicode.org/reports/tr15/), lekin eng amaliy maqsadlar uchun ushbu bo'limdagi ma'lumotlar yetarli.

## Xulosa

- Quotelarning 3 turi mavjud. Backticklar satrga bir nechta satrlarni qamrab olish va `${…}` ifodalarini joylashtirish imkonini beradi.
- Biz maxsus belgilardan foydalanishimiz mumkin, masalan, `\n` qator uzilishi.
- Belgini olish uchun: `[]` dan foydalaning.
- Pastki qatorni olish uchun: `slice` yoki `substring` dan foydalaning.
- Satrni kichik/katta harflar bilan yozish uchun: `toLowerCase/toUpperCase` dan foydalaning.
- Pastki qatorni qidirish uchun: `indexOf` yoki oddiy tekshirishlar uchun `includes/startsWith/endsWith` dan foydalaning.
- Satrlarni tilga qarab solishtirish uchun: `localeCompare` dan foydalaning, aks holda ular belgilar kodlari bilan taqqoslanadi.

Stringlarda boshqa bir nechta foydali usullar mavjud:

- `str.trim()` --  stringning boshi va oxiridan bo'shliqlarni olib ("kesib") tashlaydi.
- `str.repeat(n)` -- stringni `n` marta qaytaradi.
- ...va boshqalarini [manual](mdn:js/String)da topasiz.

Satrlarda muntazam iboralar bilan qidirish/almashtirish usullari ham mavjud. Lekin bu katta mavzu, shuning uchun u alohida o'quv bo'limi <info:regular-expressions> da tushuntirilgan.

Bundan tashqari, hozircha satrlar Unicode kodlashiga asoslanganligini bilish juda muhim va shuning uchun taqqoslash bilan bog'liq muammolar mavjud. Unicode haqida batafsil ma'lumot <info:unicode> bo'limida mavjud.
