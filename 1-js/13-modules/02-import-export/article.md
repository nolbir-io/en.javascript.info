# Eksport va Import

Eksport va import direktivalari bir nechta sintaktik variantlarga ega.

Oldingi maqolada biz oddiy foydalanishni ko'rdik, endi ko'proq misollar bilan tanishamiz.

## Deklaratsiyadan oldin eksport qilish

Biz har qanday deklaratsiyani variable, funksiya yoki sinf bo'lsin, uning oldiga `export` qo'yish orqali eksport qilingan deb belgilashimiz mumkin.

Masalan, bu yerda barcha narsa eksport qilinadi:

```js
// array (massiv) ni eksport qilish
*!*export*/!* let months = ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// konstantalarni eksport qilish
*!*export*/!* const MODULES_BECAME_STANDARD_YEAR = 2015;

// sinfni eksport qilish
*!*export*/!* class User {
  constructor(name) {
    this.name = name;
  }
}
```

````smart header="Eksport sinfi/funksiyasidan keyin nuqta-vergul yo'q"
Esda tutingki, sinf yoki funksiya oldidagi `export` uni [funksiya ifodasi]ga aylantirmaydi (ma'lumot: funksiya-ifodalar). Eksport qilingan bo'lsa ham, bu hali ham funksiya deklaratsiyasi hisoblanadi.

Ko'pgina JavaScript uslubiy qo'llanmalari funksiya va sinf deklaratsiyasidan keyin nuqta-vergul qo'yishni tavsiya etmaydi.

Shuning uchun `export class` va `export function` oxirida nuqta-vergul qo'yishga hojat yo'q:

```js
export function sayHi(user) {
  alert(`Hello, ${user}!`);
} *!* // no ; at the end */!*
```

````

## Deklaratsiyadan tashqari eksport qilish

Bundan tashqari, biz `export` ni alohida qo'yishimiz mumkin.

Bu yerda biz avval e'lon qilamiz va keyin eksport qilamiz:
```js
// 📁 say.js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

function sayBye(user) {
  alert(`Bye, ${user}!`);
}

*!*
export {sayHi, sayBye}; // eksport qilingan o'zgaruvchilar ro'yxati
*/!*
```

...Yoki texnik jihatdan biz `export` funksiyasini ham yuqoriga qo'yishimiz mumkin.

## Import *

Odatda, `import {...}` figurali qavslarga import qilinadigan narsalar ro'yxatini quyidagicha qo'yamiz:

```js
// 📁 main.js
*!*
import {sayHi, sayBye} from './say.js';
*/!*

sayHi('John'); // Hello, John!
sayBye('John'); // Bye, John!
```

Ammo import qilinadigan narsa ko'p bo'lsa, biz hammasini `import * as <obj>` yordamida obyekt sifatida import qilishimiz mumkin, masalan:

```js
// 📁 main.js
*!*
import * as say from './say.js';
*/!*

say.sayHi('John');
say.sayBye('John');
```

Bir qarashda, "hamma narsani import qilish" juda ajoyib narsa bo'lib tuyuladi, yozish uchun qisqa, nima uchun biz import qilishimiz kerak bo'lgan narsalarni aniq sanab o'tamiz? 

Bir nechta sabablarni ko'rib chiqaylik.

1. Import qilinadigan narsalarni aniq ro'yxatga olish qisqaroq nomlarni beradi: `say.sayHi()` o'rniga `sayHi()`.
2. Importlarning aniq ro'yxati kod tuzilmasi: nima va qayerda ishlatilishi haqida yaxshiroq ma'lumot beradi. Bu kodni qo'llab-quvvatlash va qayta ishlashni osonlashtiradi.

```smart header="Ortiqcha import qilishdan qo'rqmang"
[webpack](https://webpack.js.org/) va boshqalar kabi zamonaviy qurilish vositalari modullarni birlashtiradi va yuklashni tezlashtirish uchun ularni optimallashtiradi. Ular, shuningdek, foydalanilmagan importni olib tashlaydilar. 

Masalan, agar siz katta kod kutubxonasidan * ni kutubxona sifatida import qilsangiz va keyin bir nechta usullardan foydalansangiz, foydalanilmaganlar [(https://github.com/webpack/webpack/tree/main/ misollar/harmony-used#examplejs) optimallashtirilgan to'plamga qo'shilmaydi].
```

## Import "as"

Turli nomlar ostida import qilish uchun `as` dan ham foydalanishimiz mumkin.

Masalan, qisqalik uchun `sayHi` ni mahalliy `hi` o'zgaruvchisiga import qilamiz va `sayBye` ni `bye` sifatida import qilamiz:

```js
// 📁 main.js
*!*
import {sayHi as hi, sayBye as bye} from './say.js';
*/!*

hi('John'); // Hello, John!
bye('John'); // Bye, John!
```

## Export "as"

Xuddi shunday sintaksis `export` uchun ham mavjud.

Keling, funksiyalarni `hi` va `bye` sifatida eksport qilaylik:

```js
// 📁 say.js
...
export {sayHi as hi, sayBye as bye};
```

Endi `hi` va `bye` importda qo'llaniladigan tashqi shaxslar uchun rasmiy nomlardir:

```js
// 📁 main.js
import * as say from './say.js';

say.*!*hi*/!*('John'); // Hello, John!
say.*!*bye*/!*('John'); // Bye, John!
```

## Standart eksport

Amalda, asosan, ikki xil modul mavjud.

1. Yuqoridagi `say.js` kabi kutubxona, funksiyalar to'plamini o'z ichiga olgan modullar.
2. Yagona obyektni e'lon qiladigan modullar, masalan, `user.js` moduli faqat `class User`ni eksport qiladi.

Har bir "narsa" o'z modulida joylashishi uchun asosan ikkinchi yondashuv afzalroqdir.

Tabiiyki, bu juda ko'p fayllarni talab qiladi, chunki hamma narsa o'z modulini xohlaydi, lekin bu umuman muammo emas. Agar fayllar yaxshi nomlangan va papkalarga tuzilgan bo'lsa, kod navigatsiyasi osonroq bo'ladi.

Modullar "har bir modul uchun bitta narsa" usulini yaxshiroq ko'rsatish uchun maxsus `export default` ("standart eksport") sintaksisini taqdim etadi.

Eksport qilinadigan obyektdan oldin `export default` ni qo'ying:

```js
// 📁 user.js
export *!*default*/!* class User { // shunchaki "default" ni qo'shing
  constructor(name) {
    this.name = name;
  }
}
```

Har bir faylda faqat bitta `export default` bo'lishi mumkin.

...Va keyin uni figurali qavslarsiz import qiling:

```js
// 📁 main.js
import *!*User*/!* from './user.js'; // not {User}, just User

new User('John');
```

 Figurali qavssiz importlar yanada chiroyli ko'rinadi. Modullardan foydalanishni boshlashda keng tarqalgan xato - bu figurali qavslarni umuman unutishdir. Esda tuting: `import` nomli eksport uchun jingalak qavslarga muhtoj va birlamchi qavslar uchun ularga kerak emas.

| Nomli eksport | Standart export |
|--------------|----------------|
| `export class User {...}` | `export default class User {...}` |
| `import {User} from ...` | `import User from ...`|

Texnik jihatdan biz bitta modulda standart va nomli eksportga ega bo'lishimiz mumkin, lekin amalda odamlar odatda ularni aralashtirmaydi. Modulda nomli eksport yoki standart eksport mavjud bo'lgan.

Har bir faylda ko'pi bilan bitta standart eksport bo'lgani sababli eksport qilinadigan obyekt nomi bo'lmasligi mumkin.

Masalan, bularning barchasi to'liq yaroqli standart eksportlar: 

```js
export default class { // sinf nomi yo'q
  constructor() { ... }
}
```

```js
export default function(user) { // funksiya nomi yo'q
  alert(`Hello, ${user}!`);
}
```

```js
// o'zgaruvchini yaratmasdan bitta qiymatni eksport qilish
export default ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
```

 Nom ko'rsatmaslik yaxshi, chunki har bir faylda faqat bitta `export default` mavjud, shuning uchun figurali qavslarsiz `import` nimani import qilishni biladi.

`default` bo'lmasa, bunday eksportda error mavjud bo'ladi:

```js
export class { // Error! (standart bo'lmagan eksportga nom kerak)
  constructor() {}
}
```

### "Standart" nom

Ba'zi hollarda standart eksportga murojaat qilish uchun `default` kalit so'zi ishlatiladi.

Masalan, funksiyani uning ta'rifidan alohida eksport qilish uchun:

```js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// xuddi funktsiyadan oldin "export default" ni qo'shgandek
export {sayHi as default};
```

Yoki boshqa vaziyat, deylik, `user.js` moduli bitta asosiy "standart" narsani va bir nechta nomlanganlarini eksport qiladi (kamdan-kam hollarda, lekin shunday bo'ladi): 

```js
// 📁 user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

export function sayHi(user) {
  alert(`Hello, ${user}!`);
}
```

Quyida standart eksportni nomli eksport bilan birga import qilish usuli ko'rsatilgan:

```js
// 📁 main.js
import {*!*default as User*/!*, sayHi} from './user.js';

new User('John');
```

Va nihoyat, agar `*` hamma narsa obyekt sifatida import qilinsa, u holda `default` xususiyati aynan standart eksport hisoblanadi:

```js
// 📁 main.js
import * as user from './user.js';

let User = user.default; // standart eksport
new User('John');
```

### Standart eksportga qarshi so'z

Nomlangan eksportlar aniq. Ular import qiladigan narsalarni aniq nomlashadi, shuning uchun ular haqda ma'lumotga egaligimiz yaxshi holat.

Nomlangan eksportlar import qilish uchun bizni to'g'ri nomdan foydalanishga majbur qiladi: 

```js
import {User} from './user.js';
// import {MyUser} ishlamaydi, nomi {User} bo'lishi kerak
```

...Standart eksport uchun biz import qilishda har doim nomni tanlaymiz:

```js
import User from './user.js'; // ishlaydi
import MyUser from './user.js'; // bu ham ishlaydi
// Har qanday narsani import qilish mumkin... va u hali ham ishlaydi
```
Shunday qilib, jamoa a'zolari bir xil narsani import qilish uchun turli nomlardan foydalanishlari mumkin va bu yaxshi emas.

Odatda, bunga yo'l qo'ymaslik va kodni izchil saqlash uchun import qilingan o'zgaruvchilar fayl nomlariga mos kelishi kerakligi qoidasi mavjud, masalan: 

```js
import User from './user.js';
import LoginForm from './loginForm.js';
import func from '/path/to/func.js';
...
```

Shunga qaramay, ba'zi jamoalar buni sukut eksportining jiddiy kamchiligi deb hisoblashadi. Shuning uchun ular har doim nomlangan eksportlardan foydalanishni afzal ko'radilar. Faqat bitta narsa eksport qilingan bo'lsa ham, u `default`, ya'ni standart holda nom ostida eksport qilinadi.

Bu, shuningdek, qayta eksport qilishni biroz osonlashtiradi.

## Reeksport, ya'ni qayta eksport qilish

"Re-export" sintaksisi `export ... from ...` narsalarni import qilish va darhol eksport qilish imkonini beradi (ehtimol boshqa nom ostida), masalan:

```js
export {sayHi} from './say.js'; // sayHi ni reeksport qilish

export {default as User} from './user.js'; // defaultni reeksport qilish
```

Bu nima uchun kerak bo'ladi? Keling, amaliy foydalanish misolini ko'rib chiqaylik.

Tasavvur qiling, biz "paket" yozyapmiz: ko'p modulli papka, ba'zi funksiyalari tashqariga eksport qilinadi (NPM kabi vositalar bizga bunday paketlarni nashr qilish va tarqatish imkonini beradi, lekin ulardan foydalanishimiz shart emas), va boshqa paketli modullarda ichki foydalanish uchun ko'pgina modullar faqat "yordamchilar"dir. 

Fayl tuzilishi quyidagicha bo'lishi mumkin:
```
auth/
    index.js
    user.js
    helpers.js
    tests/
        login.js
    providers/
        github.js
        facebook.js
        ...
```

Biz bitta kirish nuqtasi orqali paketning funksionalligini oshkor qilmoqchimiz.

Boshqacha qilib aytganda, bizning paketimizdan foydalanmoqchi bo'lgan shaxs faqat "asosiy fayl" `auth/index.js` dan import qilishi kerak.

Mana bunday:

```js
import {login, logout} from 'auth/index.js'
```

"Asosiy fayl", `auth/index.js` paketimizda taqdim qilmoqchi bo'lgan barcha funksiyalarni eksport qiladi.

G'oya shundan iboratki, bizning paketimizdan foydalanadigan begonalar, boshqa dasturchilar uning ichki tuzilishiga aralashmasliklari, paketimiz jildidagi fayllarni qidirishlari kerak. Biz faqat `auth/index.js` da kerakli narsalarni eksport qilamiz va qolganlarini begona ko'zlardan yashiramiz.

Haqiqiy eksport qilingan funksiya paketlar orasida tarqalgani uchun biz uni `auth/index.js` ga import qilishimiz va undan eksport qilishimiz mumkin:

```js
// 📁 auth/index.js

// login/logout ni import qiling va ularni darhol eksport qiling
import {login, logout} from './helpers.js';
export {login, logout};

// Standartni foydalanuvchi sifatida import qiling va uni eksport qiling
import User from './user.js';
export {User};
...
```

Endi paketimiz foydalanuvchilari `auth/index.js` dan {login} ni import qilishlari mumkin.

`export... from ...` sintaksisi bunday import-eksport uchun qisqaroq belgidir:

```js
// 📁 auth/index.js
// login/logout ni reeksport qiling
export {login, logout} from './helpers.js';

// standart eksportni foydalanuvchi sifatida qayta eksport qiling
export {default as User} from './user.js';
...
```

`export ... from` ning `import/export` dan sezilarli farqi shundaki, qayta eksport qilingan modullar joriy faylda mavjud emas. Shunday qilib, yuqoridagi `auth/index.js` misolida biz qayta eksport qilingan `login/logout` funksiyalaridan foydalana olmaymiz.

### Standart eksportni reeksport qilish

Qayta eksport qilishda standart eksport alohida ishlov berishni talab qiladi.

Aytaylik, `user.js` da `export default class User` mavjud va uni qayta eksport qilmoqchimiz:

```js
// 📁 user.js
export default class User {
  // ...
}
```

U bilan ikkita muammoga duch kelishimiz mumkin:

1. `export User from './user.js'` ishlamaydi. Bu sintaksis xatosiga olib keladi.

    Standart eksportni qayta eksport qilish uchun yuqoridagi misolda bo'lgani kabi `export {default as User}` ni yozishimiz kerak.

2. `export * from './user.js'` faqat nomli eksportlarni qayta eksport qiladi, lekin birlamchiga e'tibor bermaydi.

    Agar biz nomli va standart eksportlarni qayta eksport qilmoqchi bo'lsak, ikkita bayonot kerak bo'ladi:
    ```js
    export * from './user.js'; // nomli eksportlarni reeksport qilish
    export {default} from './user.js'; // standart eksportni qayta eksport qilish
    ```

Standart eksportni qayta eksport qilishning bunday g'alati holatlari ba'zi ishlab chiquvchilar sukut bo'yicha eksportni yoqtirmasliklari va nomlanganlarini afzal ko'rishlarining sabablaridan biridir.

## Xulosa

Bu yerda biz ushbu va oldingi maqolalarda ko'rib chiqqan barcha `export` turlari berilgan.

 Siz ularni o'qib, nimani anglatishini eslab, o'rganganlaringizni tekshirishingiz mumkin:

- Sinf/funksiya/.. deklaratsiyasidan oldin:
  - `export [default] class/function/variable ...`
- Mustaqil eksport:
  - `export {x [as y], ...}`.
- Qayta eksport qilish:
  - `export {x [as y], ...} from "module"`
  - `export * from "module"` (standartlarni reeksport qilmaydi).
  - `export {default [as y]} from "module"` (standartlarni reeksport qiladi).

Import:

- Nomli eksportlarni import qilish
  - `import {x [as y], ...} from "module"`
- Standart eksportni import qilish
  - `import x from "module"`
  - `import {default as x} from "module"`
- Hamma narsani import qilish:
  - `import * as obj from "module"`
- Modulni import qiling (uning kodi ishlaydi), lekin uning eksportlarini o'zgaruvchilarga tayinlamang:
  - `import "module"`

Biz `import/export` iboralarini skriptning yuqori yoki pastki qismiga qo'yishimiz mumkin, bu muhim emas.

Shunday qilib, texnik jihatdan bu kod yaxshi:
```js
sayHi();

// ...

import {sayHi} from './say.js'; // fayl oxirida import qiling
```

Amalda import odatda faylning boshida bo'ladi, lekin bu faqat qulaylik uchun.

**Import/eksport bayonotlari `{...}` ichida ishlamasligini yodda tuting.**

Bu kabi shartli import ishlamaydi:
```js
if (something) {
  import {sayHi} from "./say.js"; // Error: import yuqori darajada bo'lishi kerak
}
```

...Agar biz shartli ravishda biror narsani import qilishimiz kerak bo'lsa-chi? Yoki to'g'ri vaqtda? Masalan, modulni so'rov bo'yicha, haqiqatan ham kerak bo'lganda yuklaysizmi?

Keyingi maqolada dinamik importni ko'rib chiqamiz. 
