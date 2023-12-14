# Belgilar to'plami

Amaliy vazifani ko'rib chiqing -- bizda `"+7(903)-123-45-67"` kabi telefon raqamimiz bor va uni sof raqamlarga aylantirishimiz kerak: `79031234567`.

Buning uchun biz raqam bo'lmagan har qanday narsani topishimiz va o'chirishimiz mumkin. Belgilar klasslari bunga yordam beradi.

*belgilar klassi* - bu ma'lum bir to'plamdagi har qanday belgiga mos keladigan maxsus belgi.

Boshlash uchun keling, "raqamli" klassni o'rganamiz. U `pattern:\d` shaklida yozilgan va "har qanday bitta raqam" ga mos keladi.

Masalan, telefon raqamidagi birinchi sonni topamiz:

```js run
let str = "+7(903)-123-45-67";

let regexp = /\d/;

alert( str.match(regexp) ); // 7
```

`pattern:g` bayrog'isiz oddiy ibora faqat birinchi moslikni qidiradi, ya'ni birinchi raqam `pattern:\d`.

Barcha raqamlarni topish uchun `pattern:g` bayrog'ini qo'shamiz:

```js run
let str = "+7(903)-123-45-67";

let regexp = /\d/g;

alert( str.match(regexp) ); // oʻyinlar massivi: 7,9,0,3,1,2,3,4,5,6,7

// keling, ularning faqat raqamlardan iborat telefon raqamini tuzamiz:
alert( str.match(regexp).join('') ); // 79031234567
```

Bu raqamlar uchun belgilar klassi edi. Boshqa belgilar klasslari ham mavjud.

Eng ko'p ishlatiladiganlar:

`pattern:\d` ("d" "raqam"dan olingan)
: Raqam: `0` dan `9` gacha bo`lgan belgi.

`pattern:\s` ("s" "bo'sh joy"dan olingan)
: Bo'sh joy belgisi: bo'shliqlar, tablar `\t`, yangi qatorlar `\n` va `\v`, `\f` va `\r` kabi bir nechta noyob belgilarni o`z ichiga oladi.

`pattern:\w` ("w" "so'z"dan olingan)
: "So'zli" belgi: lotin alifbosidagi harf yoki raqam yoki pastki chiziq `_`. Lotin bo'lmagan harflar (kirill yoki hindi kabi) `pattern:\w` ga tegishli emas.

Misol uchun, `pattern:\d\s\w` "raqam"dan keyin "boʻsh joy"dan keyin "soʻzli belgi"ni bildiradi, masalan, `match:1 a`.

**Regexp oddiy belgilar va belgilar klasslarini o'z ichiga olishi mumkin.**

Masalan, `pattern:CSS\d` `match:CSS` qatoriga o`zidan keyingi raqam bilan mos keladi:

```js run
let str = "Is there CSS4?";
let regexp = /CSS\d/

alert( str.match(regexp) ); // CSS4
```

Shuningdek, biz ko'plab belgilar sinflaridan foydalanishimiz mumkin:

```js run
alert( "I love HTML5!".match(/\s\w\w\w\w\d/) ); // ' HTML5'
```

Moslik (har bir regexp belgilar sinfi mos keladigan natija belgisiga ega):

![](love-html5-classes.svg)

## Teskari klasslar

Har bir belgilar klassi uchun bir xil harf bilan belgilangan, lekin katta harf bilan yozilgan "teskari klass" mavjud.

"Teskari" (inverse) uning boshqa barcha belgilarga mos kelishini anglatadi, masalan:

`pattern:\D`
: Raqamsiz: `pattern:\d`dan tashqari har qanday belgi, masalan, harf.

`pattern:\S`
: Bo'shliqsiz: `pattern:\s`dan tashqari har qanday belgi, masalan, harf.

`pattern:\W`
: So'zsiz belgi: `pattern:\w`dan boshqa har qanday narsa, masalan, lotin bo'lmagan harf yoki bo'sh joy.

Bobning boshida biz `subject:+7(903)-123-45-67` kabi qatordan faqat raqamlardan iborat telefon raqamini qanday yasashni ko'rib chiqdik: barcha raqamlarni toping va ularga qo'shing.

```js run
let str = "+7(903)-123-45-67";

alert( str.match(/\d/g).join('') ); // 79031234567
```

Muqobil, qisqaroq yo'l - `pattern:\D` bo'lmagan raqamlarni topish va ularni satrdan olib tashlash:

```js run
let str = "+7(903)-123-45-67";

alert( str.replace(/\D/g, "") ); // 79031234567
```

## Nuqta "har qanday belgi"

Nuqta `pattern:.` - bu "yangi qatordan tashqari har qanday belgi"ga mos keladigan maxsus belgilar klassidir.

Masalan:

```js run
alert( "Z".match(/./) ); // Z
```

Yoki regexpning o'rtasida:

```js run
let regexp = /CS.4/;

alert( "CSS4".match(regexp) ); // CSS4
alert( "CS-4".match(regexp) ); // CS-4
alert( "CS 4".match(regexp) ); // CS 4 (bo'sh joy ham belgi hisoblanadi)
```
E'tibor bering, nuqta "har qanday belgi" degan ma'noni anglatadi, ammo "belgining yo'qligi" emas. Unga mos keladigan belgi bo'lishi kerak:

```js run
alert( "CS4".match(/CS.4/) ); // null, mos kelmaydi, chunki nuqta uchun belgi yo'q
```

### "S" bayrog'i bo'lgan har qanday belgi kabi nuqta qo'ying

Odatda nuqta `\n` yangi qator belgisiga mos kelmaydi.

Masalan, regexp `pattern:A.B` `match:A` va keyin `match:B` ga ular orasidagi istalgan belgi bilan mos keladi, yangi qator `\n` tashqari:

```js run
alert( "A\nB".match(/A.B/) ); // null (moslik yo'q)
```

Biz nuqtaning tom ma'noda "har qanday belgi" ma'nosini bildirishini xohlaydigan ko'p holatlar mavjud, yangi qator ham bor.

`pattern:s` bayroqchasi shunday qiladi. Agar regexpda mavjud bo'lsa, nuqta `pattern:.` tom ma'noda har qanday belgiga mos keladi:

```js run
alert( "A\nB".match(/A.B/s) ); // A\nB (mos keladi!)
```

````warn header="IE da qo'llab-quvvatlanmaydi"
IE’da `pattern:s` bayrog‘i qo‘llab-quvvatlanmaydi.

Yaxshiyamki, hamma joyda ishlaydigan alternativa bor. Biz "har qanday belgi"ga mos kelish uchun `pattern:[\s\S]` kabi regexp dan foydalanishimiz mumkin (bu pattern <info:regexp-character-sets-and-ranges> maqolasida yoritiladi).

```js run
alert( "A\nB".match(/A[\s\S]B/) ); // A\nB (mos keladi!)
```

`pattern:[\s\S]` pattern so'zma-so'z shunday deydi: "bo'sh joy belgisi YOKI bo'sh joy belgisi emas". Boshqacha aytganda, "har qanday narsa". Biz boshqa bir juft qo'shimcha sinflardan foydalanishimiz mumkin, masalan, `pattern:[\d\D]`, bu muhim emas. Yoki `pattern:[^]` -- hech narsadan boshqa har qanday belgiga mos kelishini bildiradi.

Agar biz ikkala turdagi "nuqtalar"ni bir xil naqshda bo'lishini istasak, biz ushbu hiyladan foydalanishimiz mumkin: haqiqiy nuqta `pattern:.` odatiy tarzda harakat qiladigan ("yangi qatorni o'z ichiga olmaydi"), shuningdek, "har qanday belgi"ga mos keladigan usul. " `pattern:[\s\S]` yoki shunga o'xshash.
````

````warn header="Bo'shliqlarga e'tibor bering"
Odatda biz bo'shliqlarga kam e'tibor beramiz. Biz uchun `mavzu: 1-5` va `mavzu: 1 - 5` qatorlari deyarli bir xil.

Ammo agar regexp bo'sh joyni hisobga olmasa, u ishlamay qolishi mumkin.

Keling, defis bilan ajratilgan raqamlarni topishga harakat qilaylik:

```js run
alert( "1 - 5".match(/\d-\d/) ); // null, moslik yo'q!
```

Regexp `pattern:\d - \d` ga bo'shliqlar qo'shib, uni tuzatamiz:

```js run
alert( "1 - 5".match(/\d - \d/) ); // 1 - 5, endi u ishlaydi
// yoki biz \s class dan foydalanishimiz mumkin:
alert( "1 - 5".match(/\d\s-\s\d/) ); // 1 - 5, bu ham ishlaydi
```

** Bo'shliq - bu belgi. Boshqa belgilar bilan teng ahamiyatga ega.**

Biz oddiy iboraga bo'sh joy qo'sha olmaymiz yoki olib tashlay olmaymiz va u xuddi shunday ishlashini kutamiz.

Boshqacha qilib aytganda, muntazam iborada barcha belgilar, bo'shliqlar ham muhimdir.
````

## Xulosa

Quyidagi belgilar klasslari mavjud:

- `pattern:\d` -- raqamlar.
- `pattern:\D` -- raqamlar bo'lmagan.
- `pattern:\s` -- bo'sh joy belgilari, yorliqlar, yangi qatorlar.
- `pattern:\S` -- `pattern:\s`dan tashqari hammasi.
- `pattern:\w` -- Lotin harflari, raqamlar, pastki chiziq `'_'`.
- `pattern:\W` -- `pattern:\w`dan tashqari hammasi.
- `pattern:.` -- har qanday belgi, agar regexp ``s'` bayrog'i bo'lsa, aks holda har qanday belgi, `\n` yangi qatordan tashqari.

...Hali bu hammasi emas!

JavaScript tomonidan satrlar uchun ishlatiladigan Unicode kodlash belgilar uchun ko'plab xususiyatlarni beradi, masalan: harf qaysi tilga tegishli (agar u harf bo'lsa), tinish belgilari va hokazo.

Biz ushbu xususiyatlar bo'yicha ham qidirishimiz mumkin. Buning uchun `pattern:u` belgisi kerak, bu mavzu keyingi maqolada muhokama qilinadi.
