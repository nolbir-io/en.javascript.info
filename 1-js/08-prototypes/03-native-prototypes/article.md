# Mahalliy prototiplar

`"Prototype"` xususiyati JavaScriptning o'zi tomonidan keng qo'llaniladi. Barcha o'rnatilgan konstruktor funksiyalari undan foydalanadi.

Avval tafsilotlarni ko'rib chiqaylik, keyin esa o'rnatilgan obyektlarga yangi imkoniyatlarni qo'shish uchun undan qanday foydalanishni ko'rib chiqamiz.

## Obyekt.prototipi

Aytaylik, biz bo'sh obyektni chiqaramiz:

```js run
let obj = {};
alert( obj ); // "[object Object]" ?
```

`"[object Object]"` qatorini yaratuvchi kod qayerda joylashgan? Bu o'rnatilgan `toString` usuli, lekin u qani? `obj` bo'sh!

...Ammo `obj = {}` qisqa yozuvi `obj = new Object()` bilan bir xil bo'lib, bu yerda `Object` o'rnatilgan obyekt konstruktor funksiyasi bo'lib, o'zidagi `prototype` bilan katta obyektlar, `toString` va boshqa usullarga ishora qiladi.

Bu yerda nimalar yuz berayotganini ko'rishimiz mumkin:

![](object-prototype.svg)

Qachonki `new Object()` chaqiruvi amalga oshirilganda (yoki haqiqiy obyekt `{...}` yaratilganida), undagi `[[Prototype]]`  biz oldingi bobda muhokama qilgan qoidaga muvofiq `Object.prototype` ga o'rnatiladi:

![](object-prototype-1.svg)

Shunday qilib, `obj.toString()`  chaqirilganda, usul `Object.prototype` dan olinadi.

Biz buni tekshirib ko'rishimiz mumkin:

```js run
let obj = {};

alert(obj.__proto__ === Object.prototype); // true

alert(obj.toString === obj.__proto__.toString); //true
alert(obj.toString === Object.prototype.toString); //true
```

Esda tutingki, `Object.prototype` ustidagi zanjirda boshqa `[[Prototype]]` yo'q:

```js run
alert(Object.prototype.__proto__); // null
```

## Boshqa o'rnatilgan prototiplar

`Array`, `Date`, `Function` kabi boshqa o'rnatilgan obyektlar ham prototiplarda usullarni saqlaydi.

Misol uchun, biz `[1, 2, 3]` massivini yaratganimizda, standart `new Array()` konstruktori ichki obyekt sifatida ishlatiladi. Shunday qilib, `Array.prototype` uning prototipiga aylanadi va usullarni taqdim etadi. Bu juda kam xotira egallaydigan samarali usul hisoblanadi.

Spetsifikatsiyaga ko'ra, barcha o'rnatilgan prototiplarning tepasida `Object.prototype`  mavjud. Shuning uchun ham ba'zilar "hamma narsa obyektlardan meros qoladi" deyishadi.

Umumiy rasmni ko'rishingiz mumkin (o'rnatilgan uchta moslamalar uchun):

![](native-prototypes-classes.svg)

Endi prototiplarni o'zimiz tekshirib ko'ramiz:

```js run
let arr = [1, 2, 3];

// Bu Array.prototype dan meros bo'lib qoladimi?
alert( arr.__proto__ === Array.prototype ); // true

// keyin Object.prototype danmi?
alert( arr.__proto__.__proto__ === Object.prototype ); // true

// va tepada null.
alert( arr.__proto__.__proto__.__proto__ ); // null
```

Prototiplardagi ba'zi usullar bir-biriga mos kelishi mumkin, masalan, `Array.prototype` vergul bilan ajratilgan elementlar ro'yxatini o'z ichiga olgan `toString` ga ega: 

```js run
let arr = [1, 2, 3]
alert(arr); // 1,2,3 <-- Array.prototype.toString natijasi
```

 Yuqorida aytib o'tganimizdek, `Object.prototype` da `toString` ham bor, lekin `Array.prototype` zanjirda yaqinroq, shuning uchun massiv varianti ishlatiladi.


![](native-prototypes-array-tostring.svg)

Chrome dasturchi konsoli kabi brauzer ichidagi vositalar ham merosni ko'rsatadi (o'rnatilgan obyektlar uchun `console.dir` dan foydalanish kerak bo'lishi mumkin):

![](console_dir_array.png)

Boshqa o'rnatilgan obyektlar ham huddi shunday ishlaydi. Hatto funktsiyalar -- ular o'rnatilgan  `Function` konstruktorining obyektlari bo'lib, ularning usullari (`call`/`apply` va boshqalar) `Function.prototype` dan olingan. Funksiyalarda o'ziga xos `toString` ham bor.

```js run
function f() {}

alert(f.__proto__ == Function.prototype); // true
alert(f.__proto__.__proto__ == Object.prototype); // true, obyektlardan meros oladi
```

## Sodda funksiyalar

Eng murakkab narsa satrlar, raqamlar va mantiqiy belgilar bilan sodir bo'ladi.

Eslab ko'rsak, ular obyektlar emas. Ammo ularning xususiyatlariga kirishga harakat qilsak, vaqtinchalik o'ram obyektlari o'rnatilgan `String`, `Number` va `Boolean`  konstruktorlari yordamida yaratiladi. Ular usullarni ta'minlaydi va yo'qoladi.

Ushbu obyektlar biz uchun ko'rinmas tarzda yaratilgan va ko'pchilik dvigatellar ularni optimallashtiradi, ammo spetsifikatsiya buni aynan shunday tasvirlaydi. Ushbu obyektlarning usullari `String.prototype`, `Number.prototype` va `Boolean.prototype` sifatida mavjud bo'lgan prototiplarda ham mavjud.

```warn header="Values `null` va `undefined``` qiymatlar obyekt o'ramlariga ega emas. 
`null`  va `undefined` maxsus qiymatlar bir-biridan ajralib turadi. Ularda obyekt o'ramlari yo'q, shuning uchun ular uchun usullar va xususiyatlar ham mavjud emas, shuningdek tegishli prototiplar ham yo'q.
```

##Mahalliy prototiparni o'zgartirish [#mahalliy-prototiplarning-o'zgarishi]

Mahalliy prototiplar o'zgartirilishi mumkin. Masalan, `String.prototype` ga usul qo'shsak, u barcha satrlar uchun mavjud bo'ladi:

```js run
String.prototype.show = function() {
  alert(this);
};

"BOOM!".show(); // BOOM!
```

Dasturlash jarayonida bizda yangi o'rnatilgan usullar bo'yicha g'oyalar bo'lishi va biz ularni mahalliy prototiplarga qo'shish fikriga kelishimiz mumkin. Ammo bu odatda yomon fikr sifatida qaraladi.

```ogohlantirish 
Prototiplar globaldir, shu sababli ziddiyatlar kelib chiqishi oson. Agar ikkita kutubxona `String.prototype.show` usulini qo'shsa, ulardan biri boshqasining usulini qayta yozadi.

Shunday qilib, odatda, mahalliy prototipni o'zgartirish yomon fikr hisoblanadi.
```

**Zamonaviy dasturlashda mahalliy prototiplarni o'zgartirish tasdiqlangan yagona holat mavjud. Bu polyfilling.**

Polyfilling - bu JavaScript spetsifikatsiyasida mavjud bo'lgan, ammo ma'lum bir JavaScript mexanizmi tomonidan hali qo'llab-quvvatlanmaydigan usulning o'rnini bosuvchi atama.

Keyin biz uni qo'lda amalga oshirishimiz va o'rnatilgan prototipni u bilan to'ldirishimiz mumkin.

Masalan:

```js run
if (!String.prototype.repeat) { // agar bunday usul bo'lmasa
  //uni prototipga qo'shing

  String.prototype.repeat = function(n) {
    //zanjirni n marta takrorlang

    // aslida, kod bundan biroz murakkabroq bo'lishi kerak
    // (to'liq algoritm spetsifikatsiyada bor)
    // ammo unchalik mukammal bo'lmagan polyfill ham yetarli darajada yaxshi hisoblanadi
    return new Array(n + 1).join(this);
  };
}

alert( "La".repeat(3) ); // LaLaLa
```


## Prototiplardan qarz olish

<info:call-apply-decorators#method-borrowing> Havola berilgan bobda sizlar bilan qarz olish usuli haqida gaplashgan edik.

Mana shunday qilib biz bir obyektdagi usulni boshqa obyektga ko'chiramiz.

Mahalliy prototiplarning ba'zi usulllari odatda qarz sifatida olingan bo'ladi.

Masalan, biz massivga o'xshash obyekt yaratayotgan bo'lsak, ba'zi `Array` usullaridan nusxa olishni xohlaymiz.

Masalan:

```js run
let obj = {
  0: "Hello",
  1: "world!",
  length: 2,
};

*!*
obj.join = Array.prototype.join;
*/!*

alert( obj.join(',') ); // Hello,world!
```
Bu usul rostdan ham ish beradi, chunki o'rnatilgan `join`, ya'ni qo'shilish usulining ichki algoritmi faqat to'g'ri indekslar va `length` (uzunlik) xususiyati haqida qayg'uradi. Obyekt haqiqatan ham massiv ekanligini tekshirmaydi. Ko'pgina o'rnatilgan usullar shunga o'xshaydi.

Yana bir imkoniyat `obj.__proto__` ni  `Array.prototype`ga o'rnatish orqali meros qilib olishdir, shunday qilib barcha `Array` usullari avtomatik ravishda `obj` da mavjud bo'ladi.

Agar `obj` allaqachon boshqa obyektdan meros qilib olingan bo'lsa, bu usul imkonsiz. Yodda tuting, biror obyektni faqat bir martagina meros qilib olishimiz mumkin. 

Qarz olish usullari moslashuvchan bo'lib, zarur vaqtda turli obyektlarning funksiyalarini aralashtirishga imkon beradi.

## Xulosa

- Barcha o'rnatilgan obyektlar bir xil xoidaga amal qiladi:
    - Usullar prototipda joylashtirilgan (`Array.prototype`, `Object.prototype`, `Date.prototype` va boshqalar.)
    - Obyektning o'zi faqat ma'lumotlarni saqlaydi (massiv elementlari, obyekt xususiyatlari, sana)
    - Shuningdek, primitivlar o'ramga ega obyektlarining prototiplarida usullarni saqlaydi: `Number.prototype`, `String.prototype`  va `Boolean.prototype`. Faqat `undefined` (aniqlanmagan)  va `null` o'ram obyektlariga ega emas.
    - O'rnatilgan prototiplar o'zgartirilishi yoki yangi usullar bilan to'ldirilishi mumkin. Ammo ularni o'zgartirish tavsiya etilmaydi. Yagona ruxsat etilgan holat, ehtimol, biz yangi standartni qo'shganimizda bo'lishi mumkin, ammo u hali JavaScript mexanizmi tomonidan qo'llab-quvvatlanmaydi.
