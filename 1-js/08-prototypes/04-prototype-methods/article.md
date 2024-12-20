
# Prototip usullari, __proto__ ega bo'lmagan obyektlar

 Ushbu bo'limning birinchi bobida prototipni o'rnatishning zamonaviy usullari mavjudligi haqida eslatib o'tgandik.

Prototipni `obj.__proto__` bilan o'rnatish yoki o'qish eskirgan hisoblanadi (faqat brauzerlar uchun mo'ljallangan JavaScript standartining "B ilovasi" ga ko'chirildi).

Prototipni olish yoki o'rnatish uchun zamonaviy usullar:
- [Object.getPrototypeOf(obj)](mdn:js/Object/getPrototypeOf) --  `obj` ning `[[Prototype]]` ini qaytaradi
- [Object.setPrototypeOf(obj, proto)](mdn:js/Object/setPrototypeOf) -- `obj` ning `[[Prototype]]` ini `proto` ga o'rnatadi.

`__proto__` dan yangi obyektni yaratishda xususiyat sifatida ishlatiladi: `{ __proto__: ... }`.

Ammo maxsus usuldan ham foydalanishimiz mumkin:

- [Object.create(proto, [descriptors])](mdn:js/Object/create) -- `[[Prototip]]` sifatida berilgan `proto` va ixtiyoriy xususiyat identifikatorlari bilan bo'sh obyekt yaratadi.

Misol uchun:

```js run
let animal = {
  eats: true
};

//prototip sifatida animal bilan yangi obyekt yarating
*!*
let rabbit = Object.create(animal); // same as {__proto__: animal} bilan bir xil
*/!*

alert(rabbit.eats); // true

*!*
alert(Object.prototipnioling(rabbit) === animal); // true
*/!*

*!*
Object.setPrototypeOf(rabbit, {}); // rabbit ning prototipini o'zgartiring {}
*/!*
```

`Object.create` usuli biroz kuchliroq, chunki u ixtiyoriy ikkinchi argument, xususiyat tavsiflovchilariga ega.

Biz u yerda yangi obyektga qo'shimcha xususiyatlarni taqdim etishimiz mumkin, masalan:

```js run
let animal = {
  eats: true
};

let rabbit = Object.create(animal, {
  jumps: {
    value: true
  }
});

alert(rabbit.jumps); // true
```

Deskriptorlar, ya'ni tavsiflovchilar havola berilgan bobda tasvirlanganidek bir xil formatda: <info:property-descriptors>. 

Obyektni klonlashni `for..in` dagi xususiyatlarni nusxalashdan ko'ra kuchliroq qilish uchun `Object.create` dan foydalanishimiz mumkin:

```js
let clone = Object.create(
  Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj)
);
```

Bu chaqiruv `obj` ning haqiqiy nusxasini yaratadi, jumladan, barcha xususiyatlar: sanab o'tiladigan va sanab bo'lmaydigan, ma'lumotlar xossalari va setter/getter lar – hamma narsa va o'ng `[[Prototype]]` ning ham nusxalaydi.  


## Qisqa tarix

`[[Prototype]]` ni boshqarishning ko'p usullari mavjud. Bu qanday yuz berdi? Va nimaga?

Bu holat tarixiy sabablar tufayli sodir bo'lgan. 

Prototip merosi dasturlash tili paydo bo'lganidan beri mavjud edi, ammo uni boshqarish usullari vaqt o'tishi bilan rivojlandi.

- Konstruktor funksiyasining `prototype` xususiyati juda ancha vaqtdan  beri ishlagan. Bu berilgan prototipga ega obyektlarni yaratishning eng qadimgi usuli.
- Keyinchalik, 2012-yilda standartda `Object.create` paydo bo'ldi. Bu berilgan prototip bilan obyektlarni yaratish qobiliyatini berdi, lekin uni olish/o'rnatish imkoniyatini bermadi. Ba'zi brauzerlar nostandart `__proto__` aksessorini joriy qildilar, bu esa dasturchilarga ko'proq moslashuvchanlikni ta'minlash uchun foydalanuvchiga istalgan vaqtda prototipni olish/o'rnatish imkonini berdi.
- 2015-yilda standartga `Object.setPrototypeOf` va `Object.getPrototypeOf` qo'shildi, ular `__proto__` bilan bir xil funksiyalarni bajarishdi. `__proto__` hamma joyda de-fakto qo'llanilganligi sababli eskirgandi va standartning B ilovasiga yo'l oldi, ya'ni: bu brauzer bo'lmagan muhitlar uchun ixtiyoriydir.
- Keyinchalik, 2022-yilda `__proto__` dan `{...}` obyekt literallarida (B ilovasidan ko'chirilgan) foydalanishga rasman ruxsat berildi, lekin getter/setter `obj.__proto__`sifatida emas ( u hali B Ilovada).

Nima uchun `__proto__` xususiyati `getPrototypeOf/setPrototypeOf` ning funksiyalari bilan almashtirildi?

Nima uchun `__proto__` qisman reabilitatsiya qilindi va undan `{...}`da foydalanishga ruxsat berildi, lekin getter/setter sifatida emas?

Bu bizdan `__proto__` nima uchun yomon ekanligini tushunishni talab qiladigan qiziq savol.

Savolimizga keyinroq javob topishimiz mumkin.

```Warn header="Don't change `[[Prototype]]` 
Agar tezlik muhim bo'lsa, mavjud obyektlarda prototipni o'zgartirmang. 
Texnik jihatdan biz istalgan vaqtda `[[Prototype]]`ni olishimiz yoki o'rnatishimiz mumkin. Lekin odatda biz uni faqat bir marta obyekt yaratish vaqtida o'rnatamiz va endi uni o'zgartirmaymiz:  `rabbit` `animal` dan meros oladi va bu o'zgarmaydi.

Va JavaScript dvigatellari buning uchun juda optimallashtirilgan. `Object.setPrototypeOf` yoki `obj.__proto__=` bilan prototipni "on-the-fly" bilan o'zgartirish juda sekin operatsiya, chunki u obyekt mulkiga kirish operatsiyalari uchun ichki optimallashtirishni buzadi. Agar nima qilayotganingizni bilmasangiz yoki JavaScript tezligi siz uchun mutlaqo muhim bo'lmasa, undan bu harakatni amalga oshirmang. 
```

## "juda oddiy" obyektlar [#juda-oddiy]

Ma'lumki, obyektlar kalit/qiymat juftlarini saqlash uchun assotsiativ massivlar sifatida ishlatilishi mumkin.

...Lekin biz foydalanuvchi tomonidan taqdim etilgan kalitlarni saqlashga harakat qilsak, (masalan, foydalanuvchi kiritgan lug'atni), qiziqarli holatga guvoh bo'lishimiz mumkin: `"__proto__"` dan boshqa hamma usullar yaxshi ishlaydi.   

Quyidagi namunani tekshirib ko'ramiz:

```js run
let obj = {};

let key = prompt("What's the key?", "__proto__");
obj[key] = "some value";

alert(obj[key]); // [object Object], not "some value"!
```

Agar foydalanuvchi `__proto__` ga matn kiritsa, 4-qatorda berilgan vazifa e'tiborga olinmaydi. 

Bu holat dasturlash sohasida bo'lmagan odamlarni biroz hayratlantirishi mumkin, lekin bizga deyarli to'liq tushunarli. `__proto__` xususiyati maxsus obyekt yoki `null` bo'lishi lozim. Zanjir prototip bo'lolmaydi. Shuning uchun ham `__proto__` zanjiri vazifasi e'tiborga olinmaydi. 

Ammo biz bunday xatti-harakatni amalga oshirishni *rejalashtirmaganmiz*, to'g'rimi? Biz kalit/qiymat juftlarini saqlamoqchimiz va `"__proto__"` nomli kalit to'g'ri saqlanmadi. Demak, bu xato!

Bu yerda oqibatlar dahshatli emas. Ammo boshqa hollarda biz `obj` da satrlar o'rniga obyektlarni saqlashimiz mumkin va keyin prototip haqiqatan ham o'zgartiriladi. Natijada, ijro butunlay kutilmagan tarzda noto'g'ri bo'ladi.

Eng yomoni -- odatda dasturchilar bunday ehtimol haqida umuman o'ylamaydilar. Bunday xatolarni sezish qiyin va hatto ular JavaScript serveri tomonidan foydalanilganda, zaifliklarga aylanadi.

Bu o'rnatilgan obyekt usuli bo'lgani sababli `obj.toString` ga tayinlanganda ham kutilmagan hodisalar yuz berishi mumkin.

Bu muammoni qanday bartaraf etsa bo'ladi?

Birinchidan, biz oddiy obyektlar o'rniga saqlash uchun `Map`, ya'ni xaritadan foydalanishga o'tishimiz mumkin, keyin hamma narsa yaxshi ishlaydi:

```js run
let map = new Map();

let key = prompt("What's the key?", "__proto__");
map.set(key, "some value");

alert(map.get(key)); // "some value" (reja qilganimizdek)
```

...Lekin qisqa bo'lganligi uchun `Object` sintaksisi ko'proq e'tiborni tortadi. 

Yaxshiyamki, biz obyektlardan *foydalana olamiz*, chunki til yaratuvchilari bu muammoni ancha oldin o'ylashgan.

Ma'lumki, `__proto__` obyektning xossasi emas, balki `Object.prototype` ning aksessuar xususiyatidir:

![](object-prototype-2.svg)

Shunday qilib, agar `obj.__proto__` o'qilsa yoki o'rnatilsa, uning prototipidan tegishli getter/setter chaqiriladi va u `[[Prototip]]`ni oladi yoki o'rnatadi.

Ushbu o'quv qo'llanmaning boshida aytib o'tilganidek: `__proto__` - `[[Prototip]]`ga kirish usuli, bu `[[Prototip]]`ning o'zi emas.

Agar obyektni assotsiativ massiv sifatida ishlatish va bunday muammolardan xalos bo'lishni rejalashtirgan bo'lsak, buni bir oz hiyla bilan amalga oshirishimiz mumkin:

```js run
*!*
let obj = Object.create(null);
// or: obj = { __proto__: null }
*/!*

let key = prompt("What's the key?", "__proto__");
obj[key] = "some value";

alert(obj[key]); // "some value"
```

`Object.create(null)` prototipsiz bo'sh obyekt yaratadi (`[[Prototip]]` `null`):

![](object-prototype-null.svg)

Demak, `__proto__` uchun irsiy getter/setter yo'q. Endi u oddiy ma'lumotlar xususiyati sifatida qayta ishlanadi, shuning uchun yuqoridagi misol to'g'ri ishlaydi.

Bunday obyektlarni "juda oddiy"  yoki "sof lug'at" obyektlari deb atashimiz mumkin, chunki ular  oddiy oddiy obyekt `{...}`dan ham soddaroqdir.

Salbiy tomoni shundaki, bunday obyektlarda o'rnatilgan obyekt usullari mavjud emas, masalan, `toString`:

```js run
*!*
let obj = Object.create(null);
*/!*

alert(obj); // Error (no toString)
```

...Lekin bu odatda assotsiativ massivlar uchun yaxshi.

E'tibor bering, obyekt bilan bog'liq usullarning aksariyati `Object.something(...)`, `Object.keys(obj)` kabilar -- prototipda emas, shuning uchun ular bunday obyektlar ustida ishlashda davom etadilar:


```js run
let chineseDictionary = Object.create(null);
chineseDictionary.hello = "你好";
chineseDictionary.bye = "再见";

alert(Object.keys(chineseDictionary)); // hello,bye
```

## Xulosa

- Berilgan prototip bilan obyekt yaratish uchun quyidagilardan foydalaning:

    - literal sintaksis: `{ __proto__: ... }`, bir nechta xususiyatlarni belgilashga imkon beradi
    - yoki [Object.create(proto, [descriptors])](mdn:js/Object/create), xususiyat deskriptorlarini belgilash imkonini beradi.

    `Object.create` obyektni barcha identifikatorlar bilan sayoz nusxalashning oson yo'lini taqdim etadi:

    ```js
    let clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
    ```

- Prototiplarni olish va o'rnatishning zamonaviy metodlari: 

    - [Object.getPrototypeOf(obj)](mdn:js/Object/getPrototypeOf) -- `obj` ning  `[[Prototype]]` ni qaytaradi  ( `__proto__` ni oluvchi bilan bir xil).
    - [Object.setPrototypeOf(obj, proto)](mdn:js/Object/setPrototypeOf) -- `obj` ning `[[Prototype]]` ni `proto` ga o'rnatadi (`__proto__` ni o'rnatuvchi bilan bir xil).

- Prototipni olish/o'rnatish o'rnatilgan  `__proto__` bilan amalga oshirish tavsiya etilmaydi, bu hozir B spetsifikatsiya tarkibidadir. 

- `Object.create(null)` yoki `{__proto__: null}` lar bilan yaratilgan prototipsiz darslarni ham tayyorladik.

  Ushbu obyektlar har qanday kalitlarni, asosan foydalanuvchi tomonidan yaratilgan kalitlarni joylashtirish uchun lug'at sifatida ishlatiladi. 

  Odatda, obyektlar o'rnatilgan metodlarni va `__proto__` ni oluvchi/o'rnatuvchi larni `Object.prototype` dan meros qilib oladi va mos kalitlarni band qilib, potensila nojo'ya ta'sirlarni keltirib chiqaradi. `null` prototipi bilan obyektlar haqiqatan ham bo'sh hisoblanadi.  
