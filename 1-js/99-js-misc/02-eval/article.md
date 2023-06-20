# Eval: kod qatorini ishga tushiring
O'rnatilgan `eval` funksiyasi kodlar qatorini bajarishga imkon beradi.
Sintaksis:

```js
let result = eval(code);
```

Masalan:

```js run
let code = 'alert("Hello")';
eval(code); // Hello
```

Kodlar qatori uzun bo'lishi mumkin, unda qatorlar, funktsiyalar deklaratsiyasi, o'zgaruvchilar va boshqalar mavjud.

`Eval`ning natijasi oxirgi gapning natijasidir.

Masalan:
```js run
let value = eval('1+1');
alert(value); // 2
```

```js run
let value = eval('let i = 0; ++i');
alert(value); // 1
```

Eval qilingan, ya'ni baholangan kod joriy leksik muhitda bajariladi, shuning uchun u tashqi o'zgaruvchilarni ko'rishi mumkin:

```js run no-beautify
let a = 1;

function f() {
  let a = 2;

*!*
  eval('alert(a)'); // 2
*/!*
}

f();
```

U tashqi o'zgaruvchilarni ham o'zgartirishi mumkin:

```js untrusted refresh run
let x = 5;
eval("x = 10");
alert(x); // 10, qiymati o'zgartirildi
```

Qattiq rejimda `eavl`, ya'ni baholash o'zining leksik muhitiga ega. Shunday qilib, eval ichida e'lon qilingan funksiyalar va o'zgaruvchilar tashqarida ko'rinmaydi:

```js untrusted refresh run
// eslatma: sukut bo'yicha ishga tushiriladigan misollarda "qat'iy foydalanish" yoqilgan

eval("let x = 5; function f() {}");

alert(typeof x); // aniqlanmagan (bunday o'zgaruvchi yo'q)
// f funktsiyasi ham ko'rinmaydi
```

`use strict` bo'lmasa, `eval` o'z leksik muhitiga ega emas, shuning uchun biz `x` va `f` ni tashqarida ko`ramiz.

## "eval" dan foydalanish

Zamonaviy dasturlashda `eval` juda kam qo'llaniladi. Ko'pincha "eval yomon" deb aytiladi.

Sababi oddiy: uzoq vaqt oldin JavaScript ancha kuchsiz dasturlash tili bo'lgan, ko'p narsalarni faqat `eval` bilan bajarish mumkin edi. Ammo bu vaqt o'n yil oldin o'tmiahda qoldi.

Hozirda `eval` dan foydalanish uchun deyarli hech qanday sabab yo'q. Agar kimdir undan foydalanayotgan bo'lsa, uni zamonaviy til konstruktsiyasi yoki [JavaScript Module](info:modules) bilan almashtirishi mumkin.

E'tibor bering, uning tashqi o'zgaruvchilarga kirish qobiliyatining bir qancha salbiy tomonlari mavjud.

Kod minifikatorlari (JS ishlab chiqarishga kirishidan oldin ishlatiladigan asboblar, kodi siqish uchun) kodni kichikroq qilish uchun mahalliy o'zgaruvchilar nomini qisqartiradi (masalan, `a`, `b` va hokazo). Bu odatda xavfsizdir, agar `eval` ishlatilmasa, chunki mahalliy o'zgaruvchilarga baholangan kod qatoridan kirish mumkin. Shunday qilib, minifikatorlar `eval` dan ko'rinadigan barcha o'zgaruvchilar nomini o'zgartirmaydi. Bu kodni siqish nisbatiga salbiy ta'sir qiladi.

`Eval` ichidagi tashqi mahalliy o'zgaruvchilardan foydalanish ham yomon dasturlash amaliyoti hisoblanadi, chunki bu kodni saqlashni qiyinlashtiradi.

Bunday muammolardan butunlay xavfsiz bo'lishning ikki yo'li mavjud.

**Agar baholangan kod tashqi o'zgaruvchilardan foydalanmasa, iltimos, `eval` ni `window.eval(...)` sifatida chaqiring:**

Shunday qilib, kod global miqyosda bajariladi:

```js untrusted refresh run
let x = 1;
{
  let x = 5;
  window.eval('alert(x)'); // 1 (global o'zgaruvchi)
}
```

**Agar baholangan kodga mahalliy o'zgaruvchilar kerak boʻlsa, `eval` ni `new function` ga o'zgartiring va ularni argument sifatida o'tkazing:**

```js run
let f = new Function('a', 'alert(a)');

f(5); // 5
```

`new function` konstruksiyasi <info:new-function> bobida tushuntirilgan. U global miqyosda ham satrdan funksiya yaratadi. Shunday qilib, u mahalliy o'zgaruvchilarni ko'ra olmaydi. Lekin ularni yuqoridagi misoldagidek argument sifatida ochiq-oydin o'tkazish aniq.

## Xulosa

`Eval(code)` ga qo'ng'iroq kod qatorini ishga tushiradi va oxirgi bayonotning natijasini qaytaradi.
- Zamonaviy JavaScript-da kamdan-kam qo'llaniladi, chunki odatda kerak emas.
- Tashqi mahalliy o'zgaruvchilarga kira oladi. Bu yomon amaliyot deb hisoblanadi.
- Buning o'rniga, kodni global miqyosda `eval` qilish, ya'ni baholash uchun `window.eval(code)` dan foydalaning.
- Yoki, agar sizning kodingizga tashqi ma'lumotlar kerak bo'lsa, `new function` dan foydalaning va uni argument sifatida uzating.
