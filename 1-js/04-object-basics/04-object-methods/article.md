# Obyekt usullari, "this"

Obyektlar odatda foydalanuvchilar, buyurtmalar va boshqalar kabi haqiqiy hayotdagi alohida birliklarni ifodalashda yaratiladi:

```js
let user = {
  name: "John",
  age: 30
};
```

Haqiqiy hayotda foydalanuvchi *harakat qila oladi*: savatdan biror narsani tanlash, tizimga kirish, chiqish va h.k.

Amallar JavaScriptda xususiyatlardagi funksiyalar orqali ifodalanadi.

## Uslublarga misollar

Boshlanishiga, `user`ga salom aytishni o'rgatamiz:

```js run
let user = {
  name: "John",
  age: 30
};

*!*
user.sayHi = function() {
  alert("Hello!");
};
*/!*

user.sayHi(); // Hello!
```

Bu yerda, funksiya yaratish va uni obyektning `user.sayHi` xususiyatiga belgilash uchun funksiya ifodasidan foydalandik.

Endi uni "user.sayHi()" deb atash mumkin. Foydalanuvchi endi gapira oladi!

Obyektning xususiyati bo'lgan funksiya uning *usul*i deb ataladi.

Shunday qilib, bizda `user` obyektining `sayHi` usuli mavjud.

Albatta, oldindan e'lon qilingan funksiyani usul sifatida ishlatish mumkin, misol uchun:

```js run
let user = {
  // ...
};

*!*
// first, declare
function sayHi() {
  alert("Hello!");
}

// then add as a method
user.sayHi = sayHi;
*/!*

user.sayHi(); // Hello!
```

```smart header="Obyektga yo'naltirilgan dasturlash"
Mustaqil birliklarni ko'rsatish uchun obyektlar yordamida kod yozganimizda, bu [obyektga yo'naltirilgan dasturlash](https://en.wikipedia.org/wiki/Object-oriented_programming) deb ataladi, qisqacha: "OOP" (object oriented programming).

OOP - bu katta va o'ziga xos qiziqarli fandir. To'g'ri birliklarni qanday tanlash mumkin? Ular orasida o'zaro ta'sirni qanday tashkil qilish kerak? Bu arxitektura va mavzu bo'yicha ko'plab yaxshi kitoblar mavjud, misol uchun "Dizayn tamoyillari": Qayta foydalanish mumkin bo'lgan obyektga yo'naltirilgan dasturiy ta'minot elementlari" E. Gamma, R. Helm, R.Johnson, J. Vissides lar tomonidan yoki G. Boochning "Obyektga yo'naltirilgan tahlil va ilovalar bilan loyihalash" va boshqalar.
```
### Metodning qisqartmasi

Obyekt asl ma'nolaridagi uslublar uchun qisqaroq sintaksis mavjud:

```js
// bu obyektlar xuddi shu ishni bajaradi

user = {
  sayHi: function() {
    alert("Hello");
  }
};

// Usul qisqartmasi yaxshiroq ko'rinyapti, to'g'rimi?
user = {
*!*
  sayHi() { // "sayHi: function(){...}" bilan bir xil
*/!*
    alert("Hello");
  }
};
```

Ko'rsatilgandek, `function` ni tushirib qoldirib, shunchaki `sayHi()` deb yozishimiz mumkin.

Aslini olganda, yozuvlar tizimi to'liq bir xil emas. Obyektni meros qilib olish bilan bog'liq ba'zi nozik farqlar mavjud (bu keyinroq muhokama qilinadi), ammo hozircha ular muhim emas. Deyarli barcha hollarda qisqaroq sintaksisga ustunlik beriladi.

## usullarda "this"

Obyekt usuli o'z ishini bajarish uchun obyektda saqlangan ma'lumotlarga kirishi kerakligi odatiy holdir.

Masalan, `user.sayHi()` ichidagi kod `user` nomini talab qilishi mumkin.

**Obyektga kirish uchun usul `this` kalit so'zidan foydalanishi mumkin.**

`this` qiymati "nuqtadadan oldin"gi obyekt bo'lib, u usulni chaqirishda ishlatiladi.

Misol uchun:

```js run
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    // "this" bu "joriy obyekt"
    alert(this.name);
*/!*
  }

};

user.sayHi(); // John
```

Bu yerda `user.sayHi()` bajarilayotganda `this` qiymati `user` vazifasini bajaradi.

Aslini olganda, obyektga tashqi o'zgaruvchi yordamida havola qilish orqali `this`siz ham kirish mumkin:

```js
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    alert(user.name); // "this" o'rniga "user"

*/!*
  }

};
```

...Ammo bunday kod ishonchsiz. Agar biz `user`ni boshqa o'zgaruvchiga nusxalashni hohlasak, masalan. `admin = user` va `user` ni boshqa biror narsa bilan yozsak, keyin u noto'g'ri obyektga kirib qoladi.


Bu quyida ko'rsatilgan:

```js run
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    alert( user.name ); // xatoga olib keladi
*/!*
  }

};


let admin = user;
user = null; // narsalarni ravshan qilish uchun ustiga yozing

*!*
admin.sayHi(); // TypeError: nullning "name" xususiyatini o'qib bo'lmaydi
*/!*
```

Agar biz "ogohlantirish" ichida "user.name" o'rniga "thhis.name" dan foydalansak, kod ishlaydi.

## "this" bog'lanmagan

JavaScript da `this` kalit so'zi boshqa dasturlash tillaridan farqli ravishda ishlaydi. U obyektning usuli bo'lmasa ham, har qanday funktsiyada ishlatilishi mumkin.


Quyidagi misolda sintaksis xatosi yo'q:

```js
function sayHi() {
  alert( *!*this*/!*.name );
}
```

`This` qiymati kontekstga qarab ish vaqti davomida baholanadi.

Misol uchun, bu yerda bir xil funktsiya ikki xil obyektga tayinlangan va chaqiruvlarda har xil "this" mavjud:

```js run
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert( this.name );
}

*!*
// ikkita obyektda bir xil funksiyadan foydalaning
user.f = sayHi;
admin.f = sayHi;
*/!*

// bu chaqiruvlarda boshqacha "this" mavjud
// Funksiya ichidagi "this" - "nuqtadan oldingi" obyekt
user.f(); // John  (this == user)
admin.f(); // Admin  (this == admin)

admin['f'](); // Administrator (nuqta yoki kvadrat qavslar usulga kirishi - muhim emas)
```

Qoida oddiy: agar `obj.f()` chaqirilsa, u holda `f` chaqiruvi paytida `this` `obj` bo'ladi. Shunday qilib, yuqoridagi misolda u yoki `user` yoki `admin`.

````smart header="Obyektsiz qo'ng'iroq qilish: `this == aniqlanmagan`"
Funksiyani obyektsiz ham chaqirishimiz mumkin:

```js run
function sayHi() {
  alert(this);
}

sayHi(); // aniqlanmagan
```

Bu holda `this` qat'iy rejimda `undefined`, ya'ni aniqlanmagan. Agar `this.name` ga kirishga harakat qilsak, xatolik yuz beradi.

Qat'iy bo'lmagan rejimda "this"ning qiymati *global obyekt* bo'ladi. (brauzerdagi `window`, biz uni [](info:global-object) bobida keyinroq ko'rib chiqamiz). Bu tarixiy xatti-harakatlar bo'lib, `"strict fixes`, ya'ni qat'iy tuzatishlardan foydalanadi.

Odatda bunday chaqiruv dasturlash xatosi hisoblanadi. Agar funksiya ichida "this" bo'lsa, u obyekt kontekstida chaqirilishini kutadi.
````

```smart header="`bog'lanmagan this` ning oqibati"
Agar siz boshqa dasturlash tilidan kelgan bo'lsangiz, ehtimol siz "bog'langan "this" g'oyasiga o'rganib qolgansiz, bunda obyektda aniqlangan usullar har doim o'sha obyektga ishora qiluvchi `this` ga ega.

JavaScriptda `this` "bepul", uning qiymati chaqiruv vaqtida baholanadi va usul qayerda e'lon qilinganiga bog'liq emas, balki qaysi obyekt "nuqtadan oldin" kelganiga bog'liq.

`this` baholangan ish vaqti tushunchasi ham o'z ijobiy tomonlari va kamchiliklarga ega. Bir tomondan, funksiya turli obyektlar uchun qayta ishlatilishi mumkin. Boshqa tomondan, katta moslashuvchanlik xatolar uchun ko'proq imkoniyatlar yaratadi.

Bu yerda bizning vazifamiz til dizayn qarori yaxshi yomonligini aniqlashda emas. Ulardan qanday foydalanishni, foyda olishni va muammolardan chetda turishni o'rganamiz. 

```

## Ko'rsatkich funksiyalarida "this" yo'q

O'q funksiyalari maxsusdir: ularda o'zlarining `this`lari yo'q. Agar biz bunday funksiyadan `this` ga murojaat qilsak, u tashqi "normal" funksiyadan olinadi.

Masalan, bu yerda `arrow()` tashqi `user.sayHi()` usulidan `this` foydalanadi:

```js run
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  }
};

user.sayHi(); // Ilya
```

Bu ko'rsatkich funksiyalarining o'ziga xos xususiyati bo'lib, u bizga alohida `this` emas, o'rniga uni tashqi kontekstdan olmoqchi bo'lganimizda foydali bo'ladi. Keyinchalik <info:arrow-functions> bobida biz ko'rsatkich funksiyalariga chuqurroq kirib boramiz.

## Xulosa

- Obyekt xususiyatlarida saqlanadigan funktsiyalar "usullar" deb ataladi.
- Usullar obyektlarga "object.doSomething()" kabi "harakat qilish" imkonini beradi.
- Usullar obyektga "this" deb murojaat qilishi mumkin.

"this" qiymati ish vaqtida aniqlanadi.
- Funksiya e'lon qilinganda, u "this" dan foydalanishi mumkin, lekin bu `this` funksiya chaqirilmaguncha hech qanday qiymatga ega bo'lmaydi.
- Funksiyani obyektlar o'rtasida nusxalash mumkin.
- "Usul" sintaksisida funksiya chaqirilganda: `object.method()`, chaqiruv paytida `this` qiymati `object` bo'ladi.

E'tibor bering, ko'rsatkich funksiyalari maxsusdir: ularda "this" yo'q. `This` ga ko'rsatkich funksiyasi ichida kirilsa, u tashqaridan olinadi.

