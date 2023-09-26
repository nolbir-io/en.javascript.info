# Funksiya ifodalari

JavaScriptda funktsiya "sehrli til tuzilishi" emas, balki maxsus turdagi qiymatdir.

Biz ilgari ishlatgan sintaksis *Funktsiya deklaratsiyasi* deb ataladi:

```js
function sayHi() {
  alert( "Hello" );
}
```

Funksiyani yaratish uchun yana bir sintaksis mavjud bo'lib, u *Funktsiya ifodasi* deb ataladi.

Bu bizga har qanday ifoda o'rtasida yangi funksiya yaratish imkonini beradi.

Masalan:

```js
let sayHi = function() {
  alert( "Hello" );
};
```

Bu yerda biz `sayHi` o'zgaruvchisi qiymat olganini ko'rishimiz mumkin, yangi funksiya `function() { alert("Salom"); }`sifatida yozilgan.

Funksiyani yaratish topshiriq ifodasi kontekstida (`=` ning o'ng tomonida) sodir bo'lganligi sababli, bu *Funktsiya ifodasi* deb ataladi.

E'tibor bering, `function` kalit so'zidan keyin hech qanday nom yo'q. Funksiya ifodalari uchun nom qoldirilishi mumkin.

Bu yerda biz uni darhol o'zgaruvchiga tayinlaymiz, shuning uchun ushbu kod namunalarining ma'nosi bir xil: "funksiya yarating va uni `sayHi` o'zgaruvchisiga qo'ying".

Keyinchalik rivojlangan holatlarda, biz keyinroq duch keladigan funksiya yaratilishi va darhol chaqirilishi yoki keyinchalik bajarilishi uchun rejalashtirilgan bo'lishi mumkin, u hech qanday joyda saqlanmaydi, shuning uchun anonim qoladi.

## Funktsiya - bu qiymat

Yana takrorlaymiz: funksiya qanday yaratilganidan qat'iy nazar, funksiya qiymatdir. Yuqoridagi ikkala misol ham funksiyani `sayHi` o'zgaruvchisida saqlaydi.

Biz hatto `alert` yordamida bu qiymatni chop etishimiz mumkin:

```js run
function sayHi() {
  alert( "Hello" );
}

*!*
alert( sayHi ); // funksiya kodini ko'rsatadi
*/!*
```

E'tibor bering, oxirgi satr funksiyani bajarmaydi, chunki `sayHi` dan keyin qavslar yo'q. Ba'zi dasturlash tillari mavjudki, bu yerda funksiya nomini har qanaqasiga eslatish uning bajarilishiga olib keladi, ammo JavaScriptda bunday emas.

JavaScriptda funksiya qiymatdir, shuning uchun biz uni qiymat sifatida ko'rib chiqishimiz mumkin. Yuqoridagi kod uning string tasviri, ya'ni manba kodini ko'rsatadi.

Albatta, funksiya maxsus qiymatdir, ya'ni biz uni `sayHi()`deb atashimiz mumkin.

Ammo bu hali ham qiymat. Shunday qilib, biz u bilan boshqa qadriyatlar orqali ishlashimiz mumkin.

Biz funksiyani boshqa o'zgaruvchiga nusxalashimiz mumkin:

```js run no-beautify
function sayHi() {   // (1) yaratish
  alert( "Hello" );
}

let func = sayHi;    // (2) nusxalash

func(); // Hello     // (3) nusxani ishlating (u ishlaydi)!
sayHi(); // Hello    //     bu hali ham ishlaydi (nega bunday emas)
```
 
Yuqorida batafsil nima sodir bo'ldi:

1. Funktsiya deklaratsiyasi `(1)` funksiyani yaratadi va uni `sayHi` nomli o'zgaruvchiga qo'yadi.
2. `(2)` qatori uni `func` o'zgaruvchisiga ko'chiradi. Yana bir bor e'tibor bering: `sayHi` dan keyin hech qanday qavs yo'q. Agar mavjud bo'lsa, u holda `func = sayHi()` *qo'ng'iroq natijasini* `sayHi()`ni `func`ga yozadi, *funksiyaning* o'zi `sayHi` emas.
3. Endi funksiya `sayHi()` va `func()` deb nomlanishi mumkin.

Birinchi qatorda `sayHi` ni e'lon qilish uchun funksiya ifodasidan ham foydalanishimiz mumkin edi:

```js
let sayHi = function() { // (1) create
  alert( "Hello" );
};

let func = sayHi;
// ...
```

Hammasi xuddi shunday ishlaydi.


````smart header="Nega oxirida nuqtali vergul bor?"
Siz nima uchun Funktsiya ifodalari oxirida nuqta-vergul `;` qo'yiladi, lekin Funktsiya deklaratsiyasida bunday emas, deb hayron bo'lishingiz mumkin:

```js
function sayHi() {
  // ...
}

let sayHi = function() {
  // ...
}*!*;*/!*
```

Javobi oddiy: funksiya ifodasi bu yerda topshiriq ifodasi ichida `funksiya(…) {…}` shaklida yaratilgan: `sayHi = …;`. Nuqtali vergul `;` bayonot oxirida tavsiya etiladi, bu funksiya sintaksisining qismi emas.

Nuqtali verguldan oddiyroq topshiriq uchun foydalaniladi, masalan, `sayHi = 5;` bo'lsin, shuningdek, funksiya tayinlash uchun ham ishlatamiz.
````

## Callback funksiyalari

Funksiyalarni qiymat sifatida o'tkazish va funksiya ifodalaridan foydalanishning ko'proq misollarini ko'rib chiqamiz.

Biz uchta parametrli `ask(question, yes, no)` funksiyasini yozamiz:

`question`
: Savol matni

`yes`
: Agar javob "Ha" bo'lsa, ishga tushadigan funksiya

`no`
: Agar javob "Yo'q" bo'lsa, ishga tushadigan funksiya

Funksiya `question`, ya'ni savol berishi va foydalanuvchining javobiga qarab `yes()` yoki `no()` ni chaqirishi kerak:

```js run
*!*
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}
*/!*

function showOk() {
  alert( "You agreed." );
}

function showCancel() {
  alert( "You canceled the execution." );
}

// usage: showOk, showCancel funksiyalari so'rash uchun argument sifatida uzatiladi
ask("Do you agree?", showOk, showCancel);
```

Amalda, bunday funksiyalar juda foydali. Haqiqiy hayotdagi `ask` va yuqoridagi misol o'rtasidagi asosiy farq shundaki, real hayot funktsiyalari oddiy `confirm` dan ko'ra foydalanuvchi bilan muloqot qilishning murakkab usullaridan foydalanadi. Brauzerda bunday funktsiyalar odatda chiroyli ko'rinadigan savol oynasini chizadi. Lekin bu boshqa hikoya.

**`ask` ning `showOk` va `showCancel` argumentlari *callback funksiyalari* yoki shunchaki *callbacklar* (qayta qo'ng'iroqlar) deb ataladi.**

G'oya shundan iboratki, biz funksiyani o'tkazamiz va agar kerak bo'lsa, uni keyinroq "qayta chaqirish" ni kutamiz. Bizning holatda `showOk` "ha" javobi uchun qayta qo'ng'iroq va "yo'q" javobi uchun `showCancel` bo'ladi.

Ekvivalent, qisqaroq funksiyani yozish uchun funktsiya ifodalaridan foydalanishimiz mumkin:

```js run no-beautify
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}

*!*
ask(
  "Do you agree?",
  function() { alert("You agreed."); },
  function() { alert("You canceled the execution."); }
);
*/!*
```

Bu yerda funksiyalar `ask(...)` chaqiruvi ichida e'lon qilinadi. Ularning nomi yo'q va shuning uchun *anonim* deb ataladi. Bunday funksiyalarga `ask` dan tashqari kirish mumkin emas (chunki ular o'zgaruvchilarga tayinlanmagan), lekin biz bu yerda aynan shu narsani xohlaymiz.

Bunday kod bizning skriptlarimizda tabiiy ravishda paydo bo'ladi, u JavaScript ruhida mavjud.

```smart header="Funksiya \"action\""ni ifodalovchi qiymatdir.
Satrlar yoki raqamlar kabi oddiy qiymatlar *ma'lumotlarni* ifodalaydi.

Funksiyani *action* sifatida qabul qilish mumkin.

Biz uni o'zgaruvchilar orasida o'tkazishimiz va xohlaganimizda ishga tushirishimiz mumkin.
``` 


## Funktsiya ifodasi va funksiya deklaratsiyasi

Funksiya deklaratsiyasi va ifodalar o'rtasidagi asosiy farqlarni shakllantiramiz.

Birinchidan, sintaksis: kodda ularni qanday ajratish mumkin.

- *Funktsiya deklaratsiyasi:* asosiy kod oqimida alohida bayonot sifatida e'lon qilingan funksiya:

    ```js
    // Function Declaration
    function sum(a, b) {
      return a + b;
    }
    ```
- *Funksiya ifodasi:* ifoda ichida yoki boshqa sintaktik konstruksiya ichida yaratilgan funksiya. Bu yerda funksiya "assignment expression" (topshiriq ifodasi) `=` o'ng tomonida yaratilgan:

    ```js
    // Function Expression
    let sum = function(a, b) {
      return a + b;
    };
    ```

Funktsiya JavaScript dvigateli tomonidan yaratilganda yanada nozik farq bo'ladi.

**Funksiya ifodasi bajarilish unga erishilganda yaratiladi va faqat shu paytdan boshlab foydalanish mumkin bo'ladi.**

Amalga oshirish oqimi topshiriqning o'ng tomoniga o'tgandan so'ng, `let sum = function…` -- mana biz boramiz, funksiya yaratiladi va bundan buyon foydalanish mumkin (assigned, called va hokazo).

Funktsiya deklaratsiyasi boshqacha.

**Funktsiya deklaratsiyasi belgilanganidan oldinroq chaqirilishi mumkin.**

Masalan, global funksiya deklaratsiyasi qayerda bo'lishidan qat'iy nazar, butun skriptda ko'rinadi.

Bu ichki algoritmlarga bog'liq. JavaScript skriptni ishga tushirishga tayyorlanayotganda, u birinchi navbatda undagi global Funktsiya deklaratsiyasini qidiradi va funksiyalarni yaratadi. Biz buni "boshlash bosqichi" deb hisoblashimiz mumkin.

Va barcha funksiya deklaratsiyasi qayta ishlanganidan so'ng, kod bajariladi. Shunday qilib, u ushbu funksiyalarga kirish huquqiga ega.

Masalan, quyidagi kod ishlaydi:

```js run refresh untrusted
*!*
sayHi("John"); // Hello, John
*/!*

function sayHi(name) {
  alert( `Hello, ${name}` );
}
```

`sayHi` funksiya deklaratsiyasi JavaScript skriptni ishga tushirishga tayyorlanayotganda yaratiladi va uning hamma joyida ko'rinadi.

...Agar bu funksiya ifodasi bo'lsa, u ishlamaydi:

```js run refresh untrusted
*!*
sayHi("John"); // error!
*/!*

let sayHi = function(name) {  // (*) endi sehr yo'q
  alert( `Hello, ${name}` );
};
```

Funksiya ifodalari bajarilish ularga yetib kelganda yaratiladi. Bu faqat `(*)` qatorida sodir bo'ladi. Endi juda kech.

Funksiya deklaratsiyasining yana bir o'ziga xos xususiyati ularning blok doirasi.

**Qattiq rejimda funksiya deklaratsiyasi kod blokida bo‘lsa, u blokning hamma joyida ko‘rinadi. Lekin undan tashqarida emas.**

 Misol uchun, biz ishlash vaqtida oladigan `age` o'zgaruvchisiga qarab `welcome()` funksiyasini e'lon qilishimiz kerakligini tasavvur qilaylik. Va keyin biz undan biroz vaqt o'tgach foydalanishni rejalashtirmoqdamiz.

Funktsiya deklaratsiyasidan foydalansak, u mo'ljallangandek ishlamaydi:

```js run
let age = prompt("What is your age?", 18);

// funktsiyani shartli ravishda e'lon qilish
if (age < 18) {

  function welcome() {
    alert("Hello!");
  }

} else {

  function welcome() {
    alert("Greetings!");
  }

}

// ...uni keyinroq ishlatib ko'ring
*!*
welcome(); // Error: welcome aniqlanmagan
*/!*
```

Buning sababi, Funktsiya deklaratsiyasi faqat u joylashgan kod blokida ko'rinadi.

Quyida boshqa misol berilgan:

```js run
let age = 16; // misol sifatida 16 ni oling

if (age < 18) {
*!*
  welcome();               // \   (ishlaydi)
*/!*
                           //  |
  function welcome() {     //  |
    alert("Hello!");       //  |  Funktsiya deklaratsiyasi mavjud
  }                        //  |  u blokning hamma joyida e'lon qilingan
                           //  |
*!*
  welcome();               // /   (ishlaydi)
*/!*

} else {

  function welcome() {
    alert("Greetings!");
  }
}

// Mana, figurali qavslar tugadi,
// shuning uchun biz ularning ichida tuzilgan Funktsiya deklaratsiyasini ko'ra olmaymiz.

*!*
welcome(); // Error: welcome aniqlanmagan
*/!*
```

`welcome` so'zini `if` dan tashqarida ko'rsatish uchun nima qilishimiz mumkin?

To'g'ri yondashuv funksiya ifodasidan foydalanish va `if` dan tashqarida e'lon qilingan va tegishli ko'rinishga ega bo'lgan o'zgaruvchiga `welcome` ni belgilash bo'ladi.

Ushbu kod mo'ljallangan tarzda ishlaydi:

```js run
let age = prompt("What is your age?", 18);

let welcome;

if (age < 18) {

  welcome = function() {
    alert("Hello!");
  };

} else {

  welcome = function() {
    alert("Greetings!");
  };

}

*!*
welcome(); // ok now
*/!*
```

Yoki savol belgisi operatori `?` yordamida uni yanada soddalashtirishimiz mumkin:

```js run
let age = prompt("What is your age?", 18);

let welcome = (age < 18) ?
  function() { alert("Hello!"); } :
  function() { alert("Greetings!"); };

*!*
welcome(); // ok now
*/!*
```


```smart header="Funktsiya deklaratsiyasini va funksiya ifodasini qachon tanlash kerak?"

Qoida tariqasida, biz funksiyani e'lon qilishimiz kerak bo'lganda, birinchi navbatda Funksiya deklaratsiyasi sintaksisini hisobga olish kerak. Bu bizning kodimizni qanday tashkil qilishda ko'proq erkinlik beradi, chunki biz bunday funksiyalarni e'lon qilinishidan oldin chaqirishimiz mumkin.

Bu o'qish uchun ham yaxshi, chunki kodda `f(…) {…}` funksiyasini izlash `let f = function(…) {…};` ga qaraganda osonroq. Funksiya deklaratsiyasi ko'proq "ko'zni tortadi".

...Agar biron sababga ko'ra funksiya deklaratsiyasi bizga mos kelmasa yoki shartli deklaratsiya kerak bo'lsa (biz hozirgina misolni ko'rdik), u holda Funktsiya ifodasidan foydalanish kerak.
```

## Xulosa

- Funksiyalar qiymatdir. Ular kodning istalgan joyida tayinlanishi, nusxalanishi yoki e'lon qilinishi mumkin.
- Agar funksiya asosiy kod oqimida alohida bayonot sifatida e'lon qilingan bo'lsa, bu "Funktsiya deklaratsiyasi" deb ataladi.
- Agar funksiya ifodaning bir qismi sifatida yaratilgan bo'lsa, u "Funktsiya ifodasi" deb ataladi.
- Funksiya deklaratsiyasi kod bloki bajarilishidan oldin qayta ishlanadi. Ular blokning hamma joyida ko'rinadi.
- Funksiya ifodalari bajarilish oqimi ularga yetganda yaratiladi.

Ko'pgina hollarda biz funksiyani e'lon qilishimiz kerak bo'lganda, Funksiya deklaratsiyasi afzalroqdir, chunki u deklaratsiyadan oldin ko'rinadi. Bu bizga kodni tashkil qilishda ko'proq moslashuvchanlikni beradi va odatda ko'proq o'qilishi mumkin.

Shuning uchun biz Funksiya ifodasidan faqat funksiya deklaratsiyasi vazifaga mos kelmasa foydalanishimiz kerak. Biz ushbu bobda bir nechta misollarni ko'rdik va kelajakda ko'proq namunalarni ko'rib chiqamiz.