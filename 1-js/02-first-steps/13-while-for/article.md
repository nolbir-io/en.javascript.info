# Looplar: while va for

Ba'zida harakatlarni takrorlashimizga to'g'ri keladi.

Masalan, ro'yxatdagi mahsulotlarni ketma-ket chiqarish yoki 1 dan 10 gacha bo'lgan har bir raqam uchun bir xil kodni ishlatish.

*Looplar* bir xil kodni ko'p marotaba qaytarishning usulidir.

## "while" loop
```smart header="The for..of va for..in looplari"
Ilg'or o'quvchilar uchun kichik e'lon.

Ushbu maqola faqat asosiy sikllar: `while`, `do..while` va `for(..;..;..)` ni qamrab oladi.

Agar siz ushbu maqolaga boshqa turdagi halqalarni qidirib kelgan bo'lsangiz, quyidagi ko'rsatkichlarga e'tibor qarating:

- Obyekt xususiyatlari ustidan aylanish uchun [for..in](info:object#forin) ga qarang.
- Massivlar va takrorlanadigan obyektlar ustida aylanish uchun [for..of](info:array#loops) va [iterables](info:iterable) ga qarang.

E'tibor bilan o'qing
```

## "while" loop

`while` loop quyidagicha sintaksisga ega:

```js
while (condition) {
  // code
  // so-called "loop body"
}
```

`Condition` rost bo'lganda, loopdagi `kod` bajariladi.

Masalan, quyidagi kod `i < 3` bo'lganda `i` ni chiqaradi:

```js run
let i = 0;
while (i < 3) { // 0, keyin 1, keyin 2 ni ko'rsatadi
  alert( i );
  i++;
}
```

Loop tanasining bitta bajarilishi *iteratsiya* deb ataladi. Yuqoridagi misoldagi loop uchta iteratsiyani amalga oshiradi.

Agar yuqoridagi misolda `i++` bo'lmasa, loop (nazariy jihatdan) abadiy takrorlanadi. Amalda brauzer bunday looplarni to'xtatish imkonini beradi va biz server tomonidagi JavaScriptda jarayonni to'xtatamiz.

Har qanday ifoda yoki o'zgaruvchi shunchaki taqqoslash emas, balki loop sharti bo'lishi mumkin: shart hisoblanadi va `while` orqali boolean qiymatga aylantiriladi.

Masalan, `while (i != 0)` ni yozishning qisqa yo'li `while (i)` dir:

```js run
let i = 3;
*!*
while (i) { // i 0 ga aylanganda shart noto'g'ri bo'ladi va sikl to'xtaydi
*/!*
  alert( i );
  i--;
}
```

````smart header="Bir qatorli body uchun figurali qavslar kerak emas"
Agar loop tanasi yagona ifodaga ega bo'lsa, u holda `{...}` figurali qavslarni tushirib qoldirishimiz mukin:
```js run
let i = 3;
*!*
while (i) alert(i--);
*/!*
```
````

## "do..while" loop

Shartni tekshirish `do..while` sintaksisi yordamida loopning asosiy qismidan *pastga* ko'chirilishi mumkin:

```js
do {
  // loop body
} while (condition);
```

Loop avval bodyni bajaradi, keyin shartni tekshiradi va true bo'lganda, uni qayta-qayta bajaraveradi.

Masalan:

```js run
let i = 0;
do {
  alert( i );
  i++;
} while (i < 3);
```

Sintaksisning bu shakli faqat shartning to'g'ri bo'lishidan qat'iy nazar, loopning tanasi **kamida bir marta** bajarilishini xohlaganimizdagina qo'llanilishi kerak. Odatda, boshqa shakl afzal ko'riladi: `while(…) {…}`.

## "for" loop

`for` loop ancha murakkab, lekin u ham eng keng foydalaniladigan looplardan biri hisoblanadi.

Bu quyidagidek ko'rinishga ega:

```js
for (begin; condition; step) {
  // ... loop body ...
}
```

Keling, ushbu qismlarning ma'nosini misollar orqali ko'rib chiqamiz. Quyidagi loop `i` uchun `alert(i)`ni `0` dan `3`(o'z ichiga olmagan holda)gacha bajaradi:

```js run
for (let i = 0; i < 3; i++) { // 0, keyin 1, keyin 2 ni ko'rsatadi
  alert(i);
}
```

Keling, `for` iborasini qismma-qism ko'rib chiqamiz:

| qism  |          |                                                                            |
|-------|----------|----------------------------------------------------------------------------|
| boshlash | `let i = 0`    | Loopga kirayotganda bir marta bajariladi.                                      |
| shart | `i < 3`| Har loop iteratsiyasi oldidan tekshiriladi. Agar yolg'on bo'lsa, bajarilish to'xtaydi.              |
| tana | `alert(i)`| Shart true bo'lganida qayta va qayta ishga tushaveradi.                         |
| bosqich | `i++`      | Har bir iteratsiyada tanadan keyin bajariladi. |

Umumiy loop algoritmi quyidagicha ishlaydi:

```
Run begin
→ (if condition → run body and run step)
→ (if condition → run body and run step)
→ (if condition → run body and run step)
→ ...
```

Ya'ni, `begin` bir marta bajariladi va keyin takrorlanadi: har bir `condition` tekshiruvidan keyin, `body` va `step*` lar bajariladi.

Agar siz looplarda yangi bo'lsangiz, misolga qaytish va u qanday ishlashini qog'ozga bosqichma-bosqich qaytadan yozish yordam berishi mumkin.

Mana, bizning holatimizda aynan nima sodir bo'ladi:

```js
// for (let i = 0; i < 3; i++) alert(i)

// run begin
let i = 0
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// ...finish, because now i == 3
```

````smart header="Inline o'zgaruvchilar deklaratsiyasi"
Bu yerda "counter" o'zgaruvchisi `i` loopda to'g'ridan-to'g'ri e'lon qilinadi. Bu "inline" o'zgaruvchilar deklaratsiyasi deb ataladi. Bunday o'zgaruvchilar faqat loop ichida ko'rinadi.

```js run
for (*!*let*/!* i = 0; i < 3; i++) {
  alert(i); // 0, 1, 2
}
alert(i); // error, bunday o'zgaruvchi yo'q
```

O'zgaruvchini aniqlash o'rniga biz mavjuddan foydalanishimiz mumkin:

```js run
let i = 0;

for (i = 0; i < 3; i++) { // mavjud o'zgaruvchidan foydalaning
  alert(i); // 0, 1, 2
}

alert(i); // 3, ko'rinarli, chunki sikldan tashqarida e'lon qilingan
```
````


### Qismlarni o'tkazib yuborish
### Skipping parts

`for` ning istalgan qismini o'tkazib yuborish mumkin.

Masalan, agar loopni boshlanishida hech narsa bajarilishini istamasak, `begin` ni tushirib qoldirsak bo'ladi.

Xuddi quyidagidek:

```js run
let i = 0; // biz i ni allaqachon e'lon qildik va tayinladik

for (; i < 3; i++) { // "begin" ni amalga oshirishga hojat yo'q
  alert( i ); // 0, 1, 2
}
```

Yana `step` qismini ham olib tashlashimiz mumkin:

```js run
let i = 0;

for (; i < 3;) {
  alert( i++ );
}
```

Bu loopni `while (i < 3)` bilan bir xil qiladi.

Biz barcha narsani olib tashlashimiz va cheksiz loop yaratamiz:

```js
for (;;) {
  // cheksiz takrorlanadi
}
```

Ikkita `for` nuqtali vergul mavjud bo'lishi kerakligini yodda tuting. Aks holda, sintaksisda xatolik kelib chiqadi.

## Loopni buzish

Odatda, loop uning sharti yolg'on bo'lgani uchun bajarilishdan to'xtaydi.

Lekin, maxsus `break` direktivi yordamida istalgan vaqt uni to'xtashga majbur qilishimiz mumkin.

Masalan, quyidagi loop foydalanuvchidan bir nechta sonlar kiritishni so'raydi, son kiritilmagan holda esa "to'xtaydi":

```js run
let sum = 0;

while (true) {

  let value = +prompt("Number kiriting", '');

*!*
  if (!value) break; // (*)
*/!*

  sum += value;

}
alert( 'Sum: ' + sum );
```

Agar foydalanuvchi bo'sh qator kiritsa yoki kiritishni bekor qilsa, `break` direktivi `(*)` qatorda faollashtiriladi. U loopni zudlik bilan to'xtatadi va boshqaruvni sikldan keyingi birinchi qatorga, ya'ni, `alert` ga o'tkazadi.

"Cheksiz halqa + kerak bo'lganda `break`, ya'ni sindirish" kombinatsiyasi holatini halqaning boshida yoki oxirida emas, balki uning o'rtasida yoki hatto tanasining bir nechta joylarida tekshirish kerak bo'lgan holatlar uchun juda mos keladi.

## Keyingi iteratsiyaga o'tish [#continue]

`continue` direktivi `break` ning "yengilroq versiyasi" dir. U butun loopni to'xtatmaydi. Buning o'rniga, u joriy iteratsiyani to'xtatadi va loopni (agar shart imkon bersa) yangisini boshlashga majbur qiladi.

Undan joriy iteratsiyani tugatib, keyingisiga o'tmoqchi bo'lganimizda foydalanishimiz mumkin.

Quyidagi loop faqat toq qiymatlarni chiqarish uchun `continue` dan foydalanadi:

```js run no-beautify
for (let i = 0; i < 10; i++) {

  // agar rost bo'lsa, tananing qolgan qismini o'tkazib yuboring
  *!*if (i % 2 == 0) continue;*/!*

  alert(i); // 1, keyin 3, 5, 7, 9
}
```

`i` ning juft qiymatlari uchun, `continue` direktivi tanani bajarilishdan to'xtatadi va nazoratni `for` ning keyingi (sonli)iteratsiyasiga o'tkazadi. Shunday qilib, `alert` faqat toq sonlar uchungina chaqiriladi.

````smart header="`continue` direktivasi joylashtirishni kamaytirishga yordam beradi"``
Toq sonlarni ko'rsatuvchi loop quyidagicha ko'rinishga ega:

```js run
for (let i = 0; i < 10; i++) {

  if (i % 2) {
    alert( i );
  }

}
```

Texnik jihatdan, bu yuqoridagi misol bilan bir xil. Albatta, biz `continue` dan foydalanish o'rniga kodni `if` blokiga o'rashimiz mumkin.

Ammo nojo'ya ta'sir sifatida, bu yana bir darajali joylashishni yaratadi (figurali qavslar ichidagi `alert` chaqiruvi). Agar `if` ichidagi kod bir necha qatordan uzun bo'lsa, bu umumiy o'qish qobiliyatini kamaytirishi mumkin.
````

````warn header="'?' o'ng tomonida 'to'xtash/davom etish' yo'q"
Esda tutingki, ifoda bo'lmagan sintaksis konstruksiyalarini `?` ternary operatori bilan ishlatib bo'lmaydi. Xususan, u yerda `break/continue` kabi direktivlarga ruxsat berilmaydi.

Masalan, ushbu kodni oladigan bo'lsak:

```js
if (i > 5) {
  alert(i);
} else {
  continue;
}
```

...va uni so'roq belgisi yordamida qayta yozamiz:

```js no-beautify
(i > 5) ? alert(i) : *!*continue*/!*; // bu yerda continue ga ruxsat berilmagan
```

...u ishlashdan to'xtaydi: sintaksisda xatolik mavjud bo'lmaydi.

Bu `if` o`rniga `?` so'roq belgisi operatoridan foydalanmaslikning yana bir sababi. 
````

// Tushunarli bo'lmadi 

## break/continue uchun teglar 

Ba'zan biz bir vaqtning o'zida bir nechta ichki loop-larni aylanib chiqishimiz kerak.

Masalan, quyidagi kodda, `(i, j)` koordinatalarini `(0, 0)` dan `(2, 2)` ga muvofiqlashtirgan holda `i` va `j` ni aylanib chiqamiz:

```js run no-beautify
for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');
 
   // Agar biz bu yerdan Done (pastda yozilgan) ga chiqishni istasak nima bo'ladi?
  }
}

alert('Done!');
```

Agar foydalanuvchi kiritishni bekor qilsa, bizga jarayonni to'xtatish usuli kerak bo'ladi.

`input` dan keyingi oddiy `break` faqatgina ichki loopni to'xtatadi. 
Bu yetarli emas, demak, labellar ularga yordam beradi!

*Label* bu loopdan avval keladigan ikki nuqtali identifikator:

```js
labelName: for (...) {
  ...
}
```

Quyidagi loopdagi `break <labelName>` ifoda labelga o'tadi:

```js run no-beautify
*!*outer:*/!* for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // bo'sh satr yoki bekor qilingan bo'lsa, ikkala ko'chadan ham chiqib ketish
    if (!input) *!*break outer*/!*; // (*)

    // qiymat bilan biror vazifa bajaring ...
  }
}

alert('Done!');
```

Yuqoridagi kodda, `break outer` `outer` deb atalgan labeldan yuqoriroqqa qaraydi va u loopdan chiqib ketadi.

Shunday qilib nazorat `(*)` dan to'g'ri `alert('Done!')` ga o'tadi.

Biz labelni alohida qatorga o'tkazishimiz ham mumkin:

```js no-beautify
outer:
for (let i = 0; i < 3; i++) { ... }
```

`continue` direktividan ham label bilan birga foydalansa bo'ladi. Bu holatda, kod bajarilishi labellangan loopning keyingi iteratsiyasiga sakraydi.

````warn header="Yorliqlar hech qanday joyga \"sakrash"ga ruxsat bermaydi"
Labellar koddagi katta o'lchamli joyga sakrashga imkon qoldirmaydi.

Masalan, buni bajarishning iloji yo'q:

```js
break label; // quyidagi labelga o'ting (ishlamaydi)

label: for (...)
```

`break` direktivi kod blokining ichida bo'lishi kerak. Texnik jihatdan, har qanday labellangan kod bloki shunday qiladi, e.g.:

```js
label: {
  // ...
  break label; // ishlaydi
  // ...
}
```
Shunga qaramay, yuqoridagi misollarda ko'rganimizdek, 99,9% breaklardan looplarning ichki qismida foydalaniladi. 

`continue` bu loop ichidagi yagona ehtimollik hisoblanadi.
````

## Xulosa

Biz looplarning uch turini ko'rib chiqdik:

- `while` -- Shart iteratsiyadan avval tekshiriladi.
- `do..while` -- Shart iteratsiyadan keyin tekshiriladi.
- `for (;;)` -- Shart har bir iteratsiyadan avval tekshiriladi, qo'shimcha sozlamalar mavjud.

"Cheksiz" looplar yaratish uchun odatda `while(true)` kontruktsiyasidan foydalaniladi. Bunday loop xuddi qolganlari singari `break` direktivi yordamida to'xtatilishi mumkin.

Agar biz joriy iteratsiyada hech narsa qilishni xohlamasak va keyingisiga o'tishni istasak, `continue` direktividan foydalanishimiz mumkin.

`break/continue` loopdan avval labellarni qo'llab quvvatlaydi. Label `break/continue` nomli ichki loopdan tashqisiga o'tishining yagona yo'lidir.
