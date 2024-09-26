# Tur o'zgarishi 

Ko'p hollarda operator va funksiyalar ularga berilgan qiymatlarni kerakli turga avtomatik tarzda aylantiradi. 

Misol uchun, `alert` har qanday qiymatni ko'rsatish uchun uni stringga aylantiradi. Matematik ammallar qiymatlarni number, ya'ni raqamga aylantiradi.    

Qiymatni kutilgan turga aniq tarzda aylantirishimiz kerak bo'lgan holatlar ham mavjud. 

```smart header="Hozircha obyektlar haqida gaplashmaymiz"
Bu bob obyektlarni o'z ichiga olmaydi. Hozircha faqat primitive-lar haqida gaplashamiz.

Keyinchalik, obyektlar bilan tanishganimizdan so'ng, <info:object-toprimitive> bobida biz obyektlar qanday tuzilishini ko'rib chiqamiz. 
```

## String o'zgarishi

String conversion bizga qiymatning string shakli kerak bo'lganda sodir bo'ladi.

Misol uchun, `alert(value)` qiymatni ko'rsatish uchun buni amalga oshiradi.

Shuningdek, qiymatni stringga aylantirish uchun `String(value)` funksiyani chaqirishimiz ham mumkin.

```js run
let value = true;
alert(typeof value); // boolean

*!*
value = String(value); // endi stringning qiymati "true"
alert(typeof value); // string
*/!*
```

String o'zgarishi juda aniq. `false` `"false"`ga aylanadi, `null` `"null"`ga aylanadi va hokazo.

## Raqamli konvertatsiya

Raqamli konvertatsiya matematik funksiya va ifodalarda avtomatik ravishda amalga oshadi.

Misol uchun, `/` bo'luv amali raqam bo'lmaganlarga nisbatan qo`llanilganda:

```js run
alert( "6" / "2" ); // 3, stringlar raqamlarga aylanadi
```

`value`ni raqamga aylantirish uchun `Number(value)` funksiyasidan foydalanishimiz mumkin:

```js run
let str = "123";
alert(typeof str); // string

let num = Number(str); // 123 raqamiga aylanadi

alert(typeof num); // raqam
```

Bizga matnga o'xshash shakldagi string-ga asoslangann manbadan qiymat kerak bo'lganda va raqam kiritilishi kutilganda, odatda aniq konvertatsiya talab qilinadi.

Agar string number bo'lamasa, bunday konvertatsiya natijasi `Nan` bo'ladi. Misol uchun:

```js run
let age = Number("an arbitrary string instead of a number");

alert(age); // NaN, konvertatsiya muvaffaqiyatsizlikka uchradi
```

Raqamli konvertatsiya qoidalari:

| Qiymat |  Aylanadi... |
|-------|-------------|
|`undefined`|`NaN`|
|`null`|`0`|
|<code>true&nbsp;va&nbsp;false</code> | `1` va `0` |
| `string` | Bosh va oxirdagi bo'sh joylar olib tashlanadi. Agar mavjud string bo'sh bo'lsa, natija `0` bo'ladi. Aks holda, number string-dan "o'qiladi". Xatolik `NaN`ni ko'rsatadi. |

Namunalar:

```js run
alert( Number("   123   ") ); // 123
alert( Number("123z") );      // NaN ("z" dagi raqamni o'qishda xatolik)
alert( Number(true) );        // 1
alert( Number(false) );       // 0
```

Esda tutingki, `null` va `undefined` bu yerda turli harakat qiladi: `null` nolga, `undefined` esa `NaN` ga aylanadi.

Aksariyat matematik operatorlar ham shunday konvertatsiyani amalga oshiradilar, buni keyingi bobda ko'ramiz.

## Boolean konvertatsiyasi

Boolean konvertatsiyasi eng oddiy konvertatsiya hisoblanadi.

Bu mantiqiy operatsiyalarda sodir bo'ladi (keyinchalik shart testlari va boshqa shunga o'xshash narsalarga duch kelamiz), lekin uni `Boolean(value)` ga qo'ng'iroq qilish orqali ham aniq bajarish mumkin.

Konvertatsiya qoidasi:

- Intuitiv ravishda "bo'sh" bo'lgan qiymatlar, masalan, `0` bo'sh qator, `null`, `undefined` va `NaN` `false` bo'ladi.
- Boshqa qiymatlar `true` bo'ladi.


Masalan:

```js run
alert( Boolean(1) ); // true
alert( Boolean(0) ); // false

alert( Boolean("hello") ); // true
alert( Boolean("") ); // false
```

````warn header="Yodda tuting: qiymati `\"0\"`bo'lgan string `true`ga teng"
Ba'zi tillar (jumladan PHP) `"0"`ni `false` deb qabul qiladi. Lekin JavaScriptda bo'sh bo'lmagan string doim `true`ga teng.\

```js run
alert( Boolean("0") ); // true
alert( Boolean(" ") ); // bo'shliqlar ham true (har qanday bo'sh bo'lmagan satr true)
```
````
````

## Xulosa

Eng ko'p ishlatiladigan uchta turdagi konvertatsiyalar qator, raqamga va mantiqiy konvertatsiyadir.

**`String Conversion`** -- Biror narsani chiqarganimizda sodir bo'ladi. `String(value)` orqali amalga oshirish mumkin. String-ga aylantirish oadatda primitive qiymatlar uchun aniqdir.

**`Numeric Conversion`** -- Matematik ammalda sodir bo'ladi. `Number(value)` orqali amalga oshirish mumkin.

Conversion quyidagi qoidalarga amal qiladi:

| Qiymat |  Aylanadi... |
|-------|-------------|
|`undefined`|`NaN`|
|`null`|`0`|
|<code>true&nbsp;/&nbsp;false</code> | `1 / 0` |
| `string` | String qanday bo'lsa shunday o'qiladi, ikkala tomondagi bo'sh joylar olib tashlanadi. Bo'sh string `0` ga aylanadi. Xatolik `NaN`ni qaytaradi. |

**`Boolean Conversion`** -- Mantiq operatorlarida sodir bo'ladi. `Boolean(value)` orqali amalga oshirish mumkin.

Quyidagi qoidalarga amal qilish lozim:

| Qiymat |  Aylanadi... |
|-------|-------------|
|`0`, `null`, `undefined`, `NaN`, `""` |`false`|
|boshqa har qanday qiymat| `true` |


Ushbu qoidalarning ko'pchiligini tushunish va eslab qolish oson. Odamlar odatda xato qiladigan e'tiborli istisnolar:

- `undefined` raqam sifatida `NaN`ga teng, `0`ga emas.
- `"0"` va faqat bo'shliqdan iborat stringlar `"   "` boolean sifatida truega teng.

Bu yerda obyektlar yoritilmagan. JavaScript haqida ko'proq asosiy narsalarni o'rganganimizdan so'ng, faqat obyektlarga bag'ishlangan <info:object-toprimitive> bobida ularga yana qaytamiz.
