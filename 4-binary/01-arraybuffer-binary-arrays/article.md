# ArrayBuffer, ikkilik massivlar

Veb-dasturlashda biz ikkilik ma'lumotlarga asosan fayllar bilan ishlashda (yaratish, yuklash, yuklab olish) duch kelamiz. Yana bir odatiy foydalanish holati tasvirni qayta ishlashdir.

JavaScriptda buning hammasi mumkin va ikkilik operatsiyalar yuqori samaradorlikka ega.

Biroz chalkashlik bor, chunki sinflar ko'p. Ulardan bir nechtasini nomlaymiz:
- `ArrayBuffer`, `Uint8Array`, `DataView`, `Blob`, `Fayl` va boshqalar.

JavaScriptda ikkilik ma'lumotlar boshqa tillarga nisbatan nostandart tarzda amalga oshiriladi. Ammo biz narsalarni tartibga solsak, hamma narsa juda oddiy bo'ladi.

**Asosiy ikkilik obyekt `ArrayBuffer` -- qat'iy uzunlikdagi qo'shni xotira maydoniga havola.**

Biz uni shunday yaratamiz:
```js run
let buffer = new ArrayBuffer(16); // 16 uzunlikdagi bufer yarating
alert(buffer.byteLength); // 16
```

Bu 16 baytlik qo'shni xotira maydonini ajratadi va uni nol bilan oldindan to'ldiradi.

```warn header="`ArrayBuffer` nimaningdir massivi emas"
Keling, chalkashlikning mumkin bo'lgan manbasini yo'q qilaylik. `ArrayBuffer` ning `Array` bilan umumiyligi yo'q:
- Uning uzunligi qat'iy, biz uni oshira olmaymiz yoki kamaytira olmaymiz.
- Xotirada aynan shuncha joy egallaydi.
- Alohida baytlarga kirish uchun `bufer[indeks]` emas, balki boshqa "view" obyekti kerak bo'ladi.
```

`ArrayBuffer` xotira maydonidir. Unda nima saqlanadi? Unda hech qanday ma'lumot yo'q. Baytlarning oddiy ketma-ketligi hisoblanadi.

**`ArrayBuffer`ni boshqarish uchun biz "view" obyektidan foydalanishimiz kerak.**

Ko'rish obyekti o'z-o'zidan hech narsani saqlamaydi. Bu `ArrayBuffer` da saqlangan baytlarning talqinini beruvchi "ko'zoynaklar".

Masalan:

- **`Uint8Array`** -- `ArrayBuffer` dagi har bir baytni 0 dan 255 gacha bo'lgan mumkin bo'lgan qiymatlari bilan alohida raqam sifatida ko'rib chiqadi (bayt 8 bit, shuning uchun u faqat shuncha ko'p sig'ishi mumkin). Bunday qiymat "8 bitli belgisiz butun son" deb ataladi.
- **`Uint16Array`** -- har 2 baytni 0 dan 65535 gacha bo'lgan mumkin bo'lgan qiymatlari bilan butun son sifatida ko'rib chiqadi. Bu "16 bitli belgisiz butun son" deb ataladi.
- **`Uint32Array`** -- har 4 baytni 0 dan 4294967295 gacha bo'lgan mumkin bo'lgan qiymatlari bilan butun son sifatida ko'rib chiqadi. Bu "32 bitli belgisiz butun son" deb ataladi.
- **`Float64Array`** -- har 8 baytni <code>5.0x10<sup>-324</sup></code> dan <code>1.8x10<sup> gacha bo'lgan mumkin bo'lgan qiymatlari bilan suzuvchi nuqtali raqam sifatida ko'radi. 308</sup></code>.

Shunday qilib, 16 baytlik `ArrayBuffer` dagi ikkilik ma'lumotlar 16 "kichik raqamlar" yoki 8 ta kattaroq raqamlar (har biri 2 bayt) yoki undan 4 ta kattaroq (har biri 4 bayt) yoki 2 suzuvchi nuqtali qiymatlar yuqori aniqlik  sifatida talqin qilinishi mumkin (har biri 8 bayt).

![](arraybuffer-views.svg)

`ArrayBuffer` asosiy obyekt, hamma narsaning ildizi, xom ikkilik ma'lumotlardir.

Agar biz unga yozmoqchi bo'lsak yoki uni takrorlamoqchi bo'lsak, deyarli har qanday operatsiya uchun biz ko'rinishdan foydalanishimiz kerak, masalan:

```js run
let buffer = new ArrayBuffer(16); // 16 uzunlikdagi bufer yarating

*!*
let view = new Uint32Array(buffer); // buferni 32 bitli butun sonlar ketma-ketligi sifatida ko'rib chiqing

alert(Uint32Array.BYTES_PER_ELEMENT); // Bir butun son uchun 4 bayt
*/!*

alert(view.length); // 4, u shunchalik ko'p sonlarni saqlaydi
alert(view.byteLength); // 16, baytdagi o'lcham

// keling, qiymatni yozamiz
view[0] = 123456;

// qiymatlar ustidan takrorlash
for(let num of view) {
  alert(num); // 123456, then 0, 0, 0 (4 values total)
}

```

## TypedArray

Bu barcha ko'rinishlar uchun umumiy atama (`Uint8Array`, `Uint32Array` va h.k.) [TypedArray](https://tc39.github.io/ecma262/#sec-typedarray-objects). Ular bir xil usullar va xususiyatlar to'plamiga ega.

Esda tuting, `TypedArray` deb nomlangan konstruktor yo'q, bu `ArrayBuffer` bo'yicha ko'rinishlardan birini ifodalovchi oddiy "soyabon" atamasi: `Int8Array`, `Uint8Array` va hokazo, to'liq ro'yxat tez orada paydo bo'ladi.

Agar siz `new TypedArray` kabi biror narsani ko'rsangiz, bu `new Int8Array`, `new Uint8Array` va boshqalarni anglatadi.

Yozilgan massivlar odatdagi massivlar kabi ishlaydi: indekslarga ega va takrorlanadigan.

Yozilgan massiv konstruktori (`Int8Array` yoki `Float64Array` bo'lishidan qat'iy nazar) argument turlariga qarab o'zini boshqacha tutadi.

Argumentlarning 5 ta varianti mavjud:

```js
new TypedArray(buffer, [byteOffset], [length]);
new TypedArray(object);
new TypedArray(typedArray);
new TypedArray(length);
new TypedArray();
```

1. Agar `ArrayBuffer` argumenti taqdim etilsa, uning ustida ko'rinish yaratiladi. Biz allaqachon sintaksisdan foydalanganmiz.

     Ixtiyoriy ravishda biz (standart bo'yicha 0) va `length` (standart bo'yicha bufer oxirigacha) dan boshlash uchun `byteOffset` ni taqdim etishimiz mumkin, keyin ko'rinish `bufer` ning faqat bir qismini qamrab oladi.

2. Agar `Array` yoki massivga o'xshash obyekt berilgan bo'lsa, u bir xil uzunlikdagi terilgan massivni yaratadi va tarkibni ko'chiradi.

     Biz undan massivni ma'lumotlar bilan oldindan to'ldirish uchun foydalanishimiz mumkin:
    ```js run
    *!*
    let arr = new Uint8Array([0, 1, 2, 3]);
    */!*
    alert( arr.length ); // 4, bir xil uzunlikdagi ikkilik massiv yaratildi
    alert( arr[1] ); // 1, berilgan qiymatlar 4 bayt (imzosiz 8 bitli integerlar) bilan to'ldirilgan
    ```
3. Agar boshqa `TypedArray` taqdim etilsa, u xuddi shunday qiladi: bir xil uzunlikdagi terilgan massivni yaratadi va qiymatlarni nusxalaydi. Agar kerak bo'lsa, qiymatlar jarayonda yangi turga aylantiriladi.
    ```js run
    let arr16 = new Uint16Array([1, 1000]);
    *!*
    let arr8 = new Uint8Array(arr16);
    */!*
    alert( arr8[0] ); // 1
    alert( arr8[1] ); // 232, 1000 nusxa ko'chirmoqchi bo'ldi, lekin 1000 tani 8 bitga sig'dira olmadi (quyida tushuntirishlar berilgan)
    ```

4. Raqamli argument uchun `length` -- shuncha elementlarni o'z ichiga olgan terilgan massivni yaratadi. Uning bayt uzunligi `length` bitta `TypedArray.BYTES_PER_ELEMENT` elementidagi baytlar soniga ko'paytiriladi:
    ```js run
    let arr = new Uint16Array(4); // 4 ta butun son uchun terilgan massiv yarating
    alert( Uint16Array.BYTES_PER_ELEMENT ); // Har bir butun son uchun 2 bayt
    alert( arr.byteLength ); // 8 (baytdagi hajm)
    ```

5. Argumentlarsiz nol uzunlikdagi terilgan massiv hosil qiladi.

Biz to'g'ridan-to'g'ri `TypedArray` ni `ArrayBuffer` ni eslatmasdan yaratishimiz mumkin. Lekin ko'rinish asosiy `ArrayBuffer` siz mavjud bo'lolmaydi, shuning uchun birinchisidan tashqari barcha holatlarda avtomatik ravishda yaratiladi (ta'minlanganda).

Asosiy `ArrayBuffer` ga kirish uchun `TypedArray` da quyidagi xususiyatlar mavjud:
- `bufer` -- `ArrayBuffer` ga murojaat qiladi.
- `byteLength` -- `ArrayBuffer` uzunligi.

Shunday qilib, biz har doim bir ko'rinishdan ikkinchisiga o'tishimiz mumkin:
```js
let arr8 = new Uint8Array([0, 1, 2, 3]);

// xuddi shu ma'lumotlarning boshqa ko'rinishi
let arr16 = new Uint16Array(arr8.buffer);
```

Quyida yozilgan massivlar ro'yxati berilgan:

- `Uint8Array`, `Uint16Array`, `Uint32Array` -- 8, 16 va 32 bitli butun sonlar uchun.
   - `Uint8ClampedArray` -- 8-bitli integerlar uchun ularni topshiriq bo'yicha "qisqichlaydi" (pastga qarang).
- `Int8Array`, `Int16Array`, `Int32Array` -- imzolangan butun sonlar uchun (manfiy bo'lishi mumkin).
- `Float32Array`, `Float64Array` -- 32 va 64 bitli imzolangan suzuvchi nuqtali raqamlar uchun.

```warn header="`int8` yoki shunga o'xshash yagona qiymatli turlar yo'q"
E'tibor bering, `Int8Array` kabi nomlarga qaramay, JavaScriptda `int` yoki `int8` kabi yagona qiymatli tur mavjud emas.

Bu mantiqan to'g'ri, chunki `Int8Array` bu individual qiymatlar massivi emas, balki `ArrayBuffer` dagi ko'rinishdir.
```

### Chegaradan tashqari xatti-harakatlar

Chegaradan tashqari qiymatni terilgan massivga yozishga harakat qilsak nima bo'ladi? Hech qanday xato bo'lmaydi. Ammo qo'shimcha bitlar kesiladi.

Masalan, 256 ni `Uint8Array` ga qo'yishga harakat qilaylik. Ikkilik shaklda 256 `100000000` (9 bit) ni tashkil qiladi, lekin `Uint8Array` har bir qiymat uchun faqat 8 bitni ta'minlaydi, bu mavjud diapazonni 0 dan 255 gacha qiladi.

Kattaroq raqamlar uchun faqat eng o'ngdagi (kam ahamiyatli) 8 bit saqlanadi, qolganlari esa kesiladi:

![](8bit-integer-256.svg)

Shunday qilib, biz nolga erishamiz.

257 uchun ikkilik shakl `100000001` (9 bit), eng o'ngdagi 8 tasi saqlanadi, shuning uchun biz massivda `1` ga ega bo'lamiz:

![](8bit-integer-257.svg)

Boshqacha qilib aytganda, 2<sup>8</sup> moduli saqlanadi.

Mana demo:

```js run
let uint8array = new Uint8Array(16);

let num = 256;
alert(num.toString(2)); // 100000000 (binary representation)

uint8array[0] = 256;
uint8array[1] = 257;

alert(uint8array[0]); // 0
alert(uint8array[1]); // 1
```

`Uint8ClampedArray` bu jihatdan alohida, uning xatti-harakati boshqacha. U 255 dan katta bo'lgan har qanday raqam uchun 255 ni, manfiy son uchun esa 0 ni saqlaydi. Ushbu xatti-harakatlar tasvirni qayta ishlash uchun foydalidir.

## TypedArray usullari

`TypedArray`da e'tiborga molik istisnolardan tashqari oddiy `Array` usullari mavjud.

Biz `map`, `slice`, `find`, `reduce` va boshqalarni takrorlashimiz mumkin.

Biz qila olmaydigan bir nechta narsa bor:

- `splice` yo'q – biz qiymatni "o'chirib tashlay olmaymiz", chunki terilgan massivlar buferdagi ko'rinishlardir va bular xotiraning doimiy, qo'shni sohalaridir. Biz qila oladigan yagona narsa - nol belgilash.
- `Concat` usuli yo'q.

Ikkita qo'shimcha usul mavjud:

- `arr.set(fromArr, [offset])` barcha elementlarni `fromArr` dan `arr`gacha, `offset` pozitsiyasidan boshlab ko'chiradi (sukut bo'yicha 0).
- `arr.subarray([begin, end])` `begin` dan `end`gacha (eksklyuziv) bir xil turdagi yangi ko'rinish hosil qiladi. Bu `slice` usuliga o'xshaydi (bu ham qo'llab-quvvatlanadi), lekin hech narsa nusxa ko'chirmaydi -- berilgan ma'lumotlar bo'lagida ishlash uchun faqat yangi ko'rinish yaratadi.

Bu usullar terilgan massivlarni nusxalash, ularni aralashtirish va mavjudlaridan yangi massivlar yaratishga ruxsat beradi.



## DataView

[DataView](mdn:/JavaScript/Reference/Global_Objects/DataView) `ArrayBuffer` ustidagi maxsus o'ta moslashuvchan "untyped" ko'rinishdir. Bu istalgan formatdagi istalgan ofsetdagi ma'lumotlarga kirish imkonini beradi.

- Terilgan massivlar uchun konstruktor qaysi formatda ekanligini belgilaydi. Butun massiv bir xil bo'lishi kerak. I-raqam `arr[i]`.
- `DataView` yordamida biz ma'lumotlarga `.getUint8(i)` yoki `.getUint16(i)` kabi usullar bilan kiramiz. Qurilish vaqti o'rniga usulni chaqirish vaqtida formatni tanlaymiz.

Sintaksis:

```js
new DataView(buffer, [byteOffset], [byteLength])
```

- **`bufer`** -- asosiy `ArrayBuffer`. Yozilgan massivlardan farqli o'laroq, `DataView` o'z-o'zidan bufer yaratmaydi. Biz uni tayyor qilishimiz kerak.
- **`byteOffset`** -- ko'rinishning boshlang'ich bayt pozitsiyasi (sukut bo'yicha 0).
- **`byteLength`** -- ko'rinishning bayt uzunligi (sukut bo'yicha `bufer` oxirigacha).

Misol uchun, bu yerda biz bir xil buferdan turli formatdagi raqamlarni chiqaramiz:

```js run
// 4 baytlik ikkilik massiv, ularning barchasi 255 maksimal qiymatga ega
let buffer = new Uint8Array([255, 255, 255, 255]).buffer;

let dataView = new DataView(buffer);

// 0 ofsetda 8 bitli raqamni oling
alert( dataView.getUint8(0) ); // 255

// endi 0 ofsetida 16 bitli raqamni oling, u 2 baytdan iborat bo'lib, birgalikda 65535 deb talqin qilinadi
alert( dataView.getUint16(0) ); // 65535 (eng katta 16 bitli imzosiz int)

// ofset 0 da 32 bitli raqamni oling
alert( dataView.getUint32(0) ); // 4294967295 (eng katta 32-bitli imzosiz int)

dataView.setUint32(0, 0); // 4 baytlik raqamni nolga o'rnating, shuning uchun barcha baytlarni 0 ga qo'ying
```

`DataView` aralash formatdagi ma'lumotlarni bir xil buferda saqlaganimizda juda yaxshi. Masalan, biz juftliklar ketma-ketligini (16-bit integer, 32-bit float) saqlaganimizda, `DataView` ularga osongina kirish imkonini beradi.

## Xulosa

`ArrayBuffer` - asosiy obyekt, doimiy uzunlikdagi qo'shni xotira maydoniga havola.

`ArrayBuffer` da deyarli har qanday operatsiyani bajarish uchun bizga view kerak.

- U `TypedArray` ham bo'lishi mumkin:
 - `Uint8Array`, `Uint16Array`, `Uint32Array` -- 8, 16 va 32 bitli belgisiz butun sonlar uchun.
     - `Uint8ClampedArray` -- 8-bitli tamsayılar uchun ularni topshiriq bo'yicha "clamp" qiladi.
     - `Int8Array`, `Int16Array`, `Int32Array` -- imzolangan butun sonlar uchun (salbiy bo'lishi mumkin).
     - `Float32Array`, `Float64Array` -- 32 va 64 bitli imzolangan suzuvchi nuqtali raqamlar uchun.
- Yoki `DataView` -- formatni belgilash usullaridan foydalanadigan ko'rinish, masalan, `getUint8(ofset)`.

Ko'pgina hollarda biz to'g'ridan-to'g'ri terilgan massivlarni yaratamiz va ishlaymiz, `ArrayBuffer` ni "umumiy maxraj" sifatida qoldiramiz. Biz unga `.bufer` sifatida kirishimiz va kerak bo'lsa, boshqa ko'rinishni yaratishimiz mumkin.

Ikkilik ma'lumotlarda ishlaydigan usullarni tavsiflashda qo'llaniladigan ikkita qo'shimcha atama ham mavjud:
- `ArrayBufferView` - bu barcha ko'rinishlar uchun soyabon atama.
- `BufferSource` - bu `ArrayBuffer` yoki `ArrayBufferView` uchun umumiy atama.

Bu atamalarni keyingi boblarda ko'rib chiqamiz. `BufferSource` eng keng tarqalgan atamalardan biridir, chunki u "har qanday ikkilik ma'lumotlar" -- `ArrayBuffer` yoki uning ustidagi ko'rinishni anglatadi.

Mana bir cheatsheet:

![](arraybuffer-view-buffersource.svg)
