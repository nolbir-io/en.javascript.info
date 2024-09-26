# Sinfni tekshirish: "instanceof"

`instanceof` operatori obyektning ma'lum bir sinfga tegishliligini tekshirish imkonini beradi. Shuningdek, u merosni hisobga oladi.

Bunday tekshirish ko'p hollarda kerak bo'lishi mumkin. Masalan, u *polimorfik* funksiyani yaratish uchun ishlatiladi, bu argumentlarni ularning turiga qarab har xil usulda ko'rib chiqadi.

## instanceof operatori [#ref-instanceof]

Sintaksisda quyidagicha:
```js
obj instanceof Class
```

Agar `obj` `Class` yoki undan meros bo'lgan sinfga tegishli bo'lsa, u `true` ni qaytaradi.

Masalan:

```js run
class Rabbit {}
let rabbit = new Rabbit();

// bu Rabbit class, quyon sinfining obyektimi?
*!*
alert( rabbit Rabbit ning instanceof operatori ); // true
*/!*
```

Bu konstruktor funksiyalari bilan ham ishlaydi:

```js run
*!*
// class ning o'rniga
function Rabbit() {}
*/!*

alert( new Rabbit() instanceof Rabbit ); // true
```

...`Array` kabi bulit-in, ya'ni o'rnatilgan sinflar bilan ham ishlaydi:

```js run
let arr = [1, 2, 3];
alert( arr instanceof Array ); // true
alert( arr instanceof Object ); // true
```

Esda tutingki, `arr` ham `Object` sinfiga tegishli. Buning sababi, `Array`  prototip sifatida `Object` dan meros bo'lib qoladi.

Odatda, `instanceof` tekshirish uchun prototip zanjirini tekshiradi. Shuningdek, biz `Symbol.hasInstance` statik usulida maxsus mantiqni o'rnatishimiz mumkin.

`obj instanceof Class` algoritmi tahminan quyidagicha ishlaydi:

1. Agar `Symbol.hasInstance` statik usuli mavjud bo'lsa, uni shunchaki chaqiring: `Class[Symbol.hasInstance](obj)`. U `true` yoki `false` ni qaytarishi kerak va biz tugatgan bo'lamiz. Shunday qilib, biz `instanceof` harakatini sozlashimiz mumkin.

    Masalan:

    ```js run
    // o'rnatish instanceOf buni nazarda tutganini tekshiring
    // canEat xususiyatiga ega har qanday narsa hayvondir
    class Animal {
      static [Symbol.hasInstance](obj) {
        if (obj.canEat) return true;
      }
    }

    let obj = { canEat: true };

    alert(obj instanceof Animal); // true: Animal[Symbol.hasInstance](obj) chaqiriladi
    ```

2. Aksariyat sinflarda `Symbol.hasInstance` mavjud emas. Bunday holda standart mantiqdan foydalaniladi: `obj instanceOf Class` `Class.prototype` `obj` prototip zanjiridagi prototiplardan biriga teng yoki yo'qligini tekshiradi.

    Boshqacha qilib aytganda, birin-ketin solishtiriladi:
    ```js
    obj.__proto__ === Class.prototype?
    obj.__proto__.__proto__ === Class.prototype?
    obj.__proto__.__proto__.__proto__ === Class.prototype?
    ...
    // agar biron bir javob to'g'ri bo'lsa, true ni qaytaring
    //aks holda, agar biz zanjirning oxiriga yetgan bo'lsak, false ni qaytaring
    ```

   Yuqoridagi misolda `quyon.__proto__ === Rabbit.prototype`, shuning uchun darhol javob beradi.

   Meros bo'lsa, ikkinchi bosqichda moslik bo'ladi:

    ```js run
    class Animal {}
    class Rabbit extends Animal {}

    let rabbit = new Rabbit();
    *!*
    alert(rabbit instanceof Animal); // true
    */!*

    // rabbit.__proto__ === Animal.prototype (moslik yo'q)
    *!*
    // rabbit.__proto__.__proto__ === Animal.prototype (mos keldi!)
    */!*
    ```

  Mana, `rabbit instanceof Animal` ning `Animal.prototype` bilan solishtirish tasviri:

![](instanceof.svg)

 Aytgancha, [objA.isPrototypeOf(objB)](mdn:js/object/isPrototypeOf) usuli ham mavjud, agar `objA` `objB` prototiplari zanjirida biror joyda bo'lsa, `true` qaytaradi. Shunday qilib, `obj instanceof Class` testi `Class.prototype.isPrototypeOf(obj)` deb o'zgartirilishi mumkin.

 Bu kulgili, lekin `Class` konstruktorining o'zi tekshirishda qatnashmaydi! Faqat prototiplar zanjiri va `Class.prototype` muhim hisoblanadi.

Obyekt yaratilgandan keyin `prototype` xususiyati o'zgartirilsa, bu qiziqarli oqibatlarga olib kelishi mumkin.

Masalan:

```js run
function Rabbit() {}
let rabbit = new Rabbit();

// prototip o'zgartirildi
Rabbit.prototype = {};

// ...endi rabbit emas!
*!*
alert( rabbit instanceof Rabbit ); // false
*/!*
```

## Bonus: turlar uchun Object.prototype.toString

Allaqachon ma'lumki, oddiy obyektlar `[object Object]` sifatida zanjirga aylantiriladi:

```js run
let obj = {};

alert(obj); // [object Object]
alert(obj.toString()); // bir xil
```

Bu ularning `toString` ni amalga oshirishidir. Ammo `toString` ni aslida undan ham kuchliroq qiladigan yashirin xususiyat mavjud. Biz uni kengaytirilgan `typeof` va `instanceof` uchun muqobil sifatida ishlatishimiz mumkin.

G'alati tuyuladimi? Haqiqatdan ham. Keling, bir sirni oshkor qilamiz.

[Specification](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) bo'yicha o'rnatilgan `toString` obyektdan chiqarilishi va boshqa istalgan qiymat kontekstida bajarilishi mumkin va uning natijasi bu qiymatga bog'liq.

- raqamlar uchun, `[object Number]` bo'ladi
- boolean uchun, `[object Boolean]`
- `null` uchun: `[object Null]`
- `undefined`: `[object Undefined]`
- massivlar uchun: `[object Array]`
- ...va boshqalar uchun (moslashtiriladi).

Keling, buni ko'rib chiqamiz:

```js run
// qulaylik uchun toString usulini o'zgaruvchiga nusxalash
let objectToString = Object.prototype.toString;

// bu qanaqa tur?
let arr = [];

alert( objectToString.call(arr) ); // [object *!*Array*/!*]
```

Bu yerda biz [](info:call-apply-decorators) bobida tavsiflanganidek [call](mdn:js/function/call) dan `this=arr` kontekstida `objectToString` funksiyasini bajarish uchun foydalandik.

Ichki `toString` algoritmi `this` ni tekshiradi va tegishli natijani qaytaradi. Ko'proq misollarda ko'rishimiz mumkin:

```js run
let s = Object.prototype.toString;

alert( s.call(123) ); // [object Number]
alert( s.call(null) ); // [object Null]
alert( s.call(alert) ); // [object Function]
```

### Symbol.toStringTag

`toString` obyektining xatti-harakati `Symbol.toStringTag` maxsus obyekt xususiyati yordamida moslashtiriladi.

Masalan:

```js run
let user = {
  [Symbol.toStringTag]: "User"
};

alert( {}.toString.call(user) ); // [object User]
```

Ko'pgina atrof-muhitga xos obyektlar uchun bunday xususiyat mavjud. Mana bir nechta brauzerga xos misollar:

```js run
// Atrof-muhitga xos obyekt va sinf uchun toStringTag:
alert( window[Symbol.toStringTag]); // Window
alert( XMLHttpRequest.prototype[Symbol.toStringTag] ); // XMLHttpRequest

alert( {}.toString.call(window) ); // [object Window]
alert( {}.toString.call(new XMLHttpRequest()) ); // [object XMLHttpRequest]
```

Ko'rib turganingizdek, natija aynan `Symbol.toStringTag` (agar mavjud bo'lsa), `[object ...]` ichiga o'ralgan.

Oxirida "steroidlar turi" mavjud bo'lib, u nafaqat oddiy ma'lumotlar turlari uchun, balki o'rnatilgan obyektlar uchun ham ishlaydi va hatto moslashtirilishi mumkin.

Agar biz faqat tekshirish uchun emas, balki satr sifatida turni olishni xohlasak, o'rnatilgan obyektlar uchun `instanceof` o'rniga `{}.toString.call` dan foydalanamiz.

## Xulosa

Keling, biz bilgan turdagi tekshirish usullarini umumlashtiramiz:
|               | ishlaydi   |  qaytaradi      |
|---------------|-------------|---------------|
| `typeof`      | primitivlar  |  zanjir       |
| `{}.toString` | primitivlar, o'rnatilgan obyektlar, `Symbol.toStringTag` mavjud obyektlar  | zanjir |
| `instanceof`  | obyektlar    |  to'g'ri/xato   |

Ko'rib turganimizdek, `{}.toString` texnik jihatdan rivojlangan `typeof` hisoblanadi. 

Biz sinf ierarxiyasi bilan ishlayotganimizda va merosni hisobga olgan holda sinfni tekshirishni xohlayotganimizda `instanceof` operatori haqiqatan ham porlaydi. 
