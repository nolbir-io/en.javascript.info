# Arrays (Massivlar)

Obyektlar kalitlangan qiymatlar to'plamini saqlash imkonini beradi. Juda soz.

Lekin ko'pincha bizga *tartibli to'plam* kerak bo'ladi, bunda 1, 2, 3-element va boshqalar mavjud. Masalan, biz biror narsa ro'yxatini saqlashimiz kerak: foydalanuvchilar, tovarlar, HTML elementlari va hokazo.

Bu yerda obyektdan foydalanish noqulay, chunki unda elementlar tartibini boshqarish metodlari majud emas. Mavjud bo'lganlar "orasiga" yangi xossa kirita olmaymiz. Obyektlar shunchaki bunday foydalanish uchun mo'ljallanmagan.

Tartiblangan to'plamlarni saqlash uchun `Array` nomli maxsus ma'lumotlar tuzilmasi mavjud.

## E'lon qilish

Bo'sh massiv yaratishning ikkita sintaksisi mavjud:

```js
let arr = new Array();
let arr = [];
```

Deyarli har doim ikkinchi sintaksisdan foydalaniladi. Dastlabki elementlarni qavslar ichida berishimiz mumkin:

```js
let fruits = ["Apple", "Orange", "Plum"];
```

Array elementlari noldan boshlab raqamlangan bo'ladi.

Biz elementni to'rtburchak qavslarda uning raqami orqali olishimiz mumkin:

```js run
let fruits = ["Apple", "Orange", "Plum"];


alert( fruits[0] ); // Apple
alert( fruits[1] ); // Orange
alert( fruits[2] ); // Plum
```

Biz elementni almashtirishimiz:

```js
fruits[2] = 'Pear'; // now ["Apple", "Orange", "Pear"]
```

...Yoki massivga yangisini qo'shishimiz mumkin:

```js
fruits[3] = 'Lemon'; // now ["Apple", "Orange", "Pear", "Lemon"]
```
Massivdagi elementlarning umumiy soni uning uzunligi `length`:

```js run
let fruits = ["Apple", "Orange", "Plum"];

alert( fruits.length ); // 3
```

Biz butun massivni ko'rsatish uchun `alert` dan ham foydalanishimiz mumkin.

```js run
let fruits = ["Apple", "Orange", "Plum"];

alert( fruits ); // Apple,Orange,Plum
```
Massiv har qanday turdagi elementlarni saqlashi mumkin.

Masalan:

```js run no-beautify
// qiymatlar aralashmasi
let arr = [ 'Apple', { name: 'John' }, true, function() { alert('hello'); } ];

// obyektni 1 indeksida oling va keyin uning nomini ko'rsating
alert( arr[1].name ); // John

// 3-indeksdagi funksiyani oling va uni ishga tushiring
arr[3](); // hello
```


````smart header="Keyingi vergul"
Array xuddi obyekt kabi vergul bilan tugashi mumkin:
```js
let fruits = [
  "Apple",
  "Orange",
  "Plum"*!*,*/!*
];
```
"Keyingi vergul" uslubi elementlarni kiritish/olib tashlashni osonlashtiradi, chunki barcha satrlar bir xil bo'ladi.
````

## Oxirgi elementlarni "at" bilan oling

[recent browser="new"]

Aytaylik, biz massivning oxirgi elementini xohlaymiz.

Ba'zi dasturlash tillari xuddi shu maqsadda salbiy indekslardan foydalanishga imkon beradi, masalan, `fruits[-1]` .

Garchi JavaScriptda u ishlamaydi. Natija `undefined` bo'ladi, chunki kvadrat qavs ichidagi indeks tom ma'noda ko'rib chiqiladi.

Biz oxirgi element indeksini aniq hisoblab, unga kirishimiz mumkin: `fruits[fruits.length - 1]`.

```js run
let fruits = ["Apple", "Orange", "Plum"];

alert( fruits[fruits.length-1] ); // Plum
```

Biroz noqulay, shunday emasmi? O'zgaruvchi nomini ikki marta yozishimiz kerak.

Yaxshiyamki, qisqaroq sintaksis mavjud: `fruits.at(-1)`:

```js run
let fruits = ["Apple", "Orange", "Plum"];

// fruits bilan bir xil [fruits.length-1]
alert( fruits.at(-1) ); // Plum
```

Boshqacha qilib tushuntiradigan bo'lsak, `arr.at(i)`:
- `arr[i]` bilan aynan bir xil, agar `i >= 0` bo'lsa.
- `i` ning manfiy qiymatlari uchun u massiv oxiridan orqaga qadam tashlaydi.

## pop/push, shift/unshift usullari

[navbat](https://en.wikipedia.org/wiki/Queue_(abstract_data_type)) massivning eng keng tarqalgan foydalanish usullaridan biridir. Kompyuter fanida bu ikkita operatsiyani qo'llab-quvvatlaydigan tartiblangan elementlar to'plamini anglatadi:

- `push` elementni oxiriga qo'shadi.
- `shift` elementni boshidan olib, navbatni oldinga siljitadi, shunda ikkinchi element birinchi bo'ladi.

![](queue.svg)

Massivlar ikkala operatsiyani ham qo'llab-quvvatlaydi.

Amalda bizga bu juda tez-tez kerak bo'ladi. Masalan, ekranda ko'rsatilishi kerak bo'lgan xabarlar navbati.

Massivlar uchun yana bir foydalanish holati mavjud -- [stack] (https://en.wikipedia.org/wiki/Stack_(abstract_data_type)) nomli ma'lumotlar strukturasi.

U ikkita operatsiyani qo'llab-quvvatlaydi:

- `push` oxiriga element qo'shadi.
- `pop` elementni oxiridan oladi.

Shunday qilib, yangi elementlar har doim "oxiridan" qo'shiladi yoki olinadi.

Stack odatda kartalar to'plami sifatida tasvirlanadi: yangi kartalar tepaga qo'shiladi yoki yuqoridan olinadi:

![](stack.svg)

Stacklar uchun eng so'nggi bosilgan element birinchi bo'lib olinadi, bu LIFO (Last-In-First-Out) tamoyili deb ham ataladi. Navbatlar uchun bizda FIFO (First-In-First-Out) mavjud.

JavaScriptdagi massivlar ham navbat, ham stack sifatida ishlashi mumkin. Ular sizga elementlarni boshidan yoki oxirigacha qo'shish/o'chirish imkonini beradi.

Kompyuter fanida bunga imkon beruvchi ma'lumotlar strukturasi [deque] (https://en.wikipedia.org/wiki/Double-ended_queue) deb ataladi.

**Massiv oxiri bilan ishlaydigan usullar:**

`pop`
: Massivning oxirgi elementini chiqaradi va uni qaytaradi:

    ```js run
    let fruits = ["Apple", "Orange", "Pear"];

    alert( fruits.pop() ); // "Pear" ni olib tashlang va uni ogohlantiring

    alert( fruits ); // Apple, Orange
    ```

    `fruits.pop()` va `fruits.at(-1)` ham massivning oxirgi elementini qaytaradi, lekin `fruits.pop()` ham massivni olib tashlash orqali o`zgartiradi.

`push`
: Elementni massiv oxiriga qo'shing:

    ```js run
    let fruits = ["Apple", "Orange"];

    fruits.push("Pear");

    alert( fruits ); // Apple, Orange, Pear
    ```

    `fruits.push(...)` chaqiruvi `fruits[fruits.length] = ...` ga teng.

**Massiv boshi bilan ishlaydigan usullar:**

`shift`
: Massivning birinchi elementini chiqaradi va uni qaytaradi:

    ```js run
    let fruits = ["Apple", "Orange", "Pear"];

    alert( fruits.shift() ); // Appleni olib tashlang va uni ogohlantiring

    alert( fruits ); // Orange, Pear
    ```

`unshift`
: Elementni massivning boshiga qo'shing:

    ```js run
    let fruits = ["Orange", "Pear"];

    fruits.unshift('Apple');

    alert( fruits ); // Apple, Orange, Pear
    ```

`Push` va `unshift` usullari bir vaqtning o'zida bir nechta elementlarni qo'shishi mumkin:

```js run
let fruits = ["Apple"];

fruits.push("Orange", "Peach");
fruits.unshift("Pineapple", "Lemon");

// ["Pineapple", "Lemon", "Apple", "Orange", "Peach"]
alert( fruits );
```

## Internals (Ichki qismlar)

Massiv - bu obyektning maxsus turi. `arr[0]` xususiyatiga kirish uchun ishlatiladigan kvadrat qavslar aslida obyekt sintaksisidan kelib chiqadi. Bu aslida `obj[key]` bilan bir xil bo'lib, bu yerda `arr` obyekt bo'lib, raqamlar esa kalit sifatida ishlatiladi.

Ular buyurtma qilingan ma'lumotlar to'plamlari bilan ishlash uchun maxsus usullarni ta'minlovchi obyektlarni kengaytiradi, shuningdek, `length` xususiyatini ham. Lekin asosiyda u hali ham obyektdir.

Esingizda bo'lsin, JavaScriptda faqat sakkizta asosiy ma'lumotlar turi mavjud (qo'shimcha ma'lumot uchun [Ma'lumotlar turlari](ma'lumot:turlar) bo'limiga qarang). Massiv - bu obyekt va shuning uchun o'zini obyekt kabi tutadi.

Misol uchun, u havola orqali ko'chiriladi:

```js run
let fruits = ["Banana"]

let arr = fruits; // mos yozuvlar bo'yicha nusxalash (ikki o'zgaruvchi bir xil massivga havola qiladi)

alert( arr === fruits ); // true

arr.push("Pear"); // massivni mos yozuvlar orqali o'zgartiring

alert( fruits ); // Banana, Pear - endi 2 ta element bor
```

...Ammo massivlarni o'ziga xos qiladigan narsa ularning ichki ko'rinishidir. Dvigatel ushbu bobdagi rasmlarda ko'rsatilganidek, o'z elementlarini ketma-ket xotira maydonida saqlashga harakat qiladi va massivlar juda tez ishlashi uchun boshqa optimallar ham mavjud.

Ammo agar biz massiv bilan "buyurtma qilingan to‘plam" kabi ishlashni to'xtatsak va u bilan oddiy obyektdek ishlay boshlasak, ularning barchasi buziladi.

Masalan, texnik jihatdan bunday qila olamiz:

```js
let fruits = []; // massiv yarating

fruits[99999] = 5; // indeks uzunligidan ancha katta bo'lgan xususiyatni tayinlang

fruits.age = 25; // ixtiyoriy nom bilan xususiyat yaratish
```
Bu mumkin, chunki massivlar ularning bazasida joylashgan obyektlardir. Biz ularga har qanday xususiyatni qo'shishimiz mumkin.

Ammo dvigatel biz massiv bilan oddiy obyekt kabi ishlayotganimizni ko'radi. Massivga xos optimallashtirishlar bunday holatlar uchun mos emas va o'chiriladi, ularning afzalliklari yo'qoladi.

Massivdan noto'g'ri foydalanish usullari:

- `arr.test = 5` kabi raqamli bo'lmagan xususiyatni qo'shing.
- hole lar yarating, masalan: `arr[0]` va keyin `arr[1000]` ni qo'shing (va ular orasida hech narsa yo'q).
- Massivni teskari tartibda to'ldiring, masalan, `arr[1000]`, `arr[999]` va hokazo.

Iltimos, massivlarni *tartiblangan ma'lumotlar* bilan ishlash uchun maxsus tuzilmalar deb tasavvur qiling. Buning uchun ular maxsus usullarni taklif qilishadi. Massivlar ketma-ket tartiblangan ma'lumotlar bilan ishlash uchun JavaScript dvigatellarida ehtiyotkorlik bilan sozlangan, ulardan shu tarzda foydalaning. Va agar sizga ixtiyoriy kalitlar kerak bo'lsa, sizda haqiqatan ham oddiy `{}` obyektini talab qilish ehtimoli yuqori.

## Ijro (performance)

`Push/pop` usullari tez ishlaydi, `shift/unshift` esa sekin.

![](array-speed.svg)

Nima uchun massivning oxiri bilan ishlash uning boshiga qaraganda tezroq? Keling, ijro paytida nima sodir bo'lishini ko'rib chiqaylik:

```js
fruits.shift(); // boshidan 1 ta elementni oling
```

`0` indeksli elementni olish va olib tashlashning o'zi yetarli emas. Boshqa elementlarni ham qayta raqamlash kerak.

The `shift` operation must do 3 things:

1. Remove the element with the index `0`.
2. Move all elements to the left, renumber them from the index `1` to `0`, from `2` to `1` and so on.
3. Update the `length` property.

`Shift` operatsiyasi 3 narsani bajarishi kerak:

1. `0` indeksli elementni olib tashlash.
2. Barcha elementlarni chapga siljitish, ularni indeksdan `1` dan `0` ga, `2` dan `1` ga va hokazo raqamlash.
3. `Length` xususiyatini yangilash.

![](array-shift.svg)

**Massivdagi elementlar qancha ko'p bo'lsa, ularni ko'chirish uchun ko'proq vaqt, xotirada ko'proq operatsiyalar kerak bo'ladi.**

Shunga o'xshash narsa ``unshift` bilan sodir bo'ladi: massivning boshiga element qo'shish uchun biz avval mavjud elementlarni indekslarini oshirib, o'ngga siljitishimiz kerak.

`Push/pop` bilan nima deyish mumkin? Ular hech narsani siljitishlari shart emas. Elementni oxiridan ajratib olish uchun `pop` usuli indeksni tozalaydi va `length` ni qisqartiradi.

`Pop` operatsiyasi uchun harakatlar:

```js
fruits.pop(); // oxiridan 1ta element oling
```

![](array-pop.svg)

**`pop` usuli hech narsani ko'chirishi shart emas, chunki boshqa elementlar o'z indekslarini saqlaydi. Shuning uchun u juda tez ishlaydi.**

Bu `push` usuli bilan o'xshashroq.

## Halqalar (loops)

Massiv elementlarini aylanishning eng qadimgi usullaridan biri indekslar ustidagi `for` siklidir:

```js run
let arr = ["Apple", "Orange", "Pear"];

*!*
for (let i = 0; i < arr.length; i++) {
*/!*
  alert( arr[i] );
}
```

Ammo massivlar uchun siklning yana bir shakli mavjud: `for..of`:

```js run
let fruits = ["Apple", "Orange", "Plum"];

// massiv elementlarini takrorlaydi
for (let fruit of fruits) {
  alert( fruit );
}
```

`For..of` joriy elementning raqamiga ruxsat bermaydi, faqat uning qiymati mavjud bo'lib, ko'p hollarda bu yetarli. Va u qisqaroq hisoblanadi.

Texnik jihatdan massivlar obyektlar bo'lganligi sababli `for..in` dan ham foydalanish mumkin:

```js run
let arr = ["Apple", "Orange", "Pear"];

*!*
for (let key in arr) {
*/!*
  alert( arr[key] ); // Apple, Orange, Pear
}
```
Lekin bu aslida yomon fikr, chunki ba'zi potensial muammolar mavjud:

1. `For..in` sikli faqat sonli xususiyatlarni emas, balki *barcha xususiyatlarni* takrorlaydi.

     Brauzerda va boshqa muhitlarda *massivlarga* o'xshab ko'rinadigan "massivga o'xshash" obyektlar mavjud. Ya'ni, ular `length` va indekslar xususiyatiga ega, lekin ular bizga odatda keraksiz boshqa raqamli bo'lmagan xususiyatlar va usullarga ham ega bo'lishi mumkin. `for..in` sikli ularni ro'yxatga oladi. Shunday qilib, agar biz massivga o'xshash obyektlar bilan ishlashimiz kerak bo'lsa, unda bu "qo'shimcha" xususiyatlar muammoga aylanishi mumkin.

2. `For..in` sikli massivlar uchun emas, balki umumiy obyektlar uchun optimallashtirilgan va shuning uchun 10-100 marta sekinroq. Albatta, bu hali ham juda tez. Tezlik faqat to'siqlarda muhim bo'lishi mumkin. Ammo baribir biz farqni bilishimiz kerak.

Umuman olganda, massivlar uchun `for..in` dan foydalanmasligimiz kerak.


## "length" haqida bir so'z

Massivni o'zgartirganimizda `length` xususiyati avtomatik ravishda yangilanadi. Aniqroq qilib aytadigan bo'lsak, bu aslida massivdagi qiymatlar soni emas, balki eng katta raqamli bitta indeksdir.

Masalan, katta indeksli bitta element katta uzunlikni beradi:

```js run
let fruits = [];
fruits[123] = "Apple";

alert( fruits.length ); // 124
```

E'tibor bering, biz odatda bunday massivlardan foydalanmaymiz.

`Length` xususiyatining yana bir qiziq tomoni shundaki, u yozilishi mumkin.

Agar biz uni qo'lda bajarsak, qiziq narsa bo'lmaydi. Ammo agar biz uni kamaytirsak, massiv kesiladi. Jarayon qaytarilmaydi, misol uchun:

```js run
let arr = [1, 2, 3, 4, 5];

arr.length = 2; // 2 ta elementga qisqartiring
alert( arr ); // [1, 2]

arr.length = 5; // length ni ortga qaytaradi
alert( arr[3] ); // undefined: qiymatlar qaytarilmaydi
```

Shunday qilib, massivni tozalashning eng oddiy usuli: `arr.length = 0;`.


## yangi Massiv() [#new-array]

Massiv yaratish uchun yana bitta sintaksis mavjud:

```js
let arr = *!*new Array*/!*("Apple", "Pear", "etc");
```

U kamdan-kam ishlatiladi, chunki kvadrat qavs `[]` qisqaroq. Bundan tashqari, u bilan murakkab xususiyat mavjud.

Agar `new Array` bitta argument, ya'ni raqam bilan chaqirilsa, u *elementlarsiz, lekin berilgan uzunlikdagi* massiv hosil qiladi.

Keling, qanday qilib uloqtirish mumkinligini ko'rib chiqaylik:

```js run
let arr = new Array(2); // [2] massivini yaratadimi?

alert( arr[0] ); // undefined! elementlar yo'q.

alert( arr.length ); // length 2
```
Bunday kutilmagan hodisalarning oldini olish uchun biz odatda kvadrat qavslardan foydalanamiz, agar biz nima qilayotganimizni bilmasak shunday qilishimiz mumkin.

## Ko'p o'lchovli massivlar (multidimensional arrays)

Massivlarda massiv bo'lgan elementlar ham bo'lishi mumkin. Biz uni ko'p o'lchovli massivlar uchun ishlatamiz, masalan, matritsalarni saqlash uchun:

```js run
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

alert( matrix[1][1] ); // 5, markaziy element
```

## toString

Massivlar vergul bilan ajratilgan elementlar ro'yxatini qaytaradigan `toString` amalga oshirish usuliga ega.

Masalan:


```js run
let arr = [1, 2, 3];

alert( arr ); // 1,2,3
alert( String(arr) === '1,2,3' ); // true
```

Shuningdek, buni ham sinab ko'ring:

```js run
alert( [] + 1 ); // "1"
alert( [1] + 1 ); // "11"
alert( [1,2] + 1 ); // "1,21"
```
Massivlarda `Symbol.toPrimitive` ham, hayotiy `valueOf` ham yo'q, ular faqat `toString` konversiyasini amalga oshiradilar, shuning uchun bu yerda `[]` bo'sh qatorga, `[1]` `"1"` va `[ 1,2]` esa `"1,2"`ga aylanadi.

Ikkilik plyus `"+"` operatori satrga biror narsa qo'shganda, u ham uni satrga aylantiradi, shuning uchun keyingi qadam quyidagicha ko'rinadi:

```js run
alert( "" + 1 ); // "1"
alert( "1" + 1 ); // "11"
alert( "1,2" + 1 ); // "1,21"
```

## Massivlarni == bilan adashtirmang

JavaScriptdagi massivlar, ba'zi boshqa dasturlash tillaridan farqli o'laroq, `==` operatori bilan taqqoslanmasligi kerak.

Bu operator massivlar uchun maxsus ishlovga ega emas, u har qanday obyektlardagi kabi ular bilan birga ishlaydi.

Keling, qoidalarni eslaymiz:

- Ikki obyekt bir xil obyektga havola qilingan taqdirdagina teng `==` hisoblanadi.
- Agar `==` argumentlaridan biri obyekt, ikkinchisi esa ibtidoiy bo'lsa, <info:object-toprimitive> bobida tushuntirilganidek, obyekt primitivga aylanadi.
- ...Bir-biriga teng bo'lgan `==` va boshqa hech narsa bo'lmagan `null` va `andefined` da bumday bo'lmaydi.

Qattiq taqqoslash `===` yanada sodda, chunki u turlarni o'zgartirmaydi.

Demak, agar biz massivlarni `==` bilan solishtirsak, aynan bir xil massivga havola qiluvchi ikkita o'zgaruvchini solishtirmasak, ular hech qachon bir xil bo`lmaydi.

Masalan:
```js run
alert( [] == [] ); // false
alert( [0] == [0] ); // false
```
Bu massivlar texnik jihatdan har xil obyektlardir. Demak, ular teng emas. `==` operatori elementlar bilan taqqoslashni amalga oshirmaydi.

Primitivlar bilan taqqoslash g'alati tuyulgan natijalarni ham berishi mumkin:

```js run
alert( 0 == [] ); // true

alert('0' == [] ); // false
```
Bu yerda ikkala holatda ham primitivni massiv obyekti bilan solishtiramiz. Shunday qilib, `[]` massivi taqqoslash maqsadida primitivga aylanadi va bo'sh `''` qatorga aylanadi.

Keyin taqqoslash jarayoni <info:type-conversions> bobida tavsiflanganidek, primitivlar bilan davom etadi:

```js run
// [] ga aylantirilgandan keyin ''
alert( 0 == '' ); // true, chunki '' 0 raqamiga aylanadi

alert('0' == '' ); // false, hech qanday turdagi konvertatsiya, turli satrlar
```
Xo'sh, massivlarni qanday solishtirish mumkin?

Bu oddiy: `==` operatoridan foydalanmang. Buning o'rniga, ularni siklda yoki keyingi bobda tushuntirilgan iteratsiya usullaridan foydalanib, elementlarni taqqoslang.

## Xulosa

Massiv - buyurtma qilingan ma'lumotlar elementlarini saqlash va boshqarish uchun mos keladigan maxsus turdagi obyekt.

Deklaratsiya:

```js
// kvadrat qavslar (odatiy)
let arr = [item1, item2...];

// yangi massiv (juda kamdan-kam)
let arr = new Array(item1, item2...);
```
`new Array(number)` ga qo'ng'iroq berilgan uzun, lekin elementlarsiz massivni yaratadi.

- `length` xossasi massiv uzunligi yoki aniqrog'i, uning oxirgi raqamli indeksi plus bitta. U massiv usullari bilan avtomatik sozlanadi.
- Agar `length` ni qo'lda qisqartiradigan bo'lsak, massiv kesiladi.

Elementlarni olish:

- `arr[0]` indeksi bo'yicha elementni olishimiz mumkin
- manfiy indekslarga ruxsat beruvchi `at(i)` usulidan ham foydalansak bo'ladi. `i` ning manfiy qiymatlari uchun u massiv oxiridan orqaga qadam tashlaydi. Agar `i >= 0` bo'lsa, u `arr[i]` bilan bir xil ishlaydi.

Biz quyidagi amallar bilan massivni deque sifatida ishlatishimiz mumkin:

- `push(...items)` oxiriga `items`ni qo'shadi.
- `pop()` elementni oxiridan olib tashlaydi va uni qaytaradi.
- `shift()` elementni boshidan olib tashlaydi va uni qaytaradi.
- `unshift(...items)` boshiga `elementlar` qo'shadi.

Massiv elementlari ustida aylanish uchun:
   - `for (let i=0; i<arr.length; i++)` -- juda tez ishlaydi, eski brauzerga mos keladi.
   - `for (item element of arr)` -- faqat elementlar uchun zamonaviy sintaksis,
   - `for (let i in arr)` -- bundan hech qachon foydalanmang.

Massivlarni solishtirish uchun `==` operatoridan (shuningdek, `>`, `<` va boshqalar) foydalanmang, chunki ular massivlar uchun maxsus ishlov berilmagan. Ular har qanday obyekt sifatida ko'rib chiqadilar va bu biz xohlagan narsa emas.

Buning o'rniga massivlarni element bo'yicha taqqoslash uchun `for..of` siklidan foydalanishingiz mumkin.

Biz massivlar bilan davom etamiz va keyingi bobda <info:array-methods> qo'shish, olib tashlash, elementlarni ajratib olish va massivlarni saralashning ko'proq usullarini o'rganamiz.