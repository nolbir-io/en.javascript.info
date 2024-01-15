
# Unicode, String internals

```smart header="Ilg'or bilim"
Bo'lim string ning ichki qismlariga chuqurroq kiradi. Agar siz emoji, noyob matematik, ieroglif yoki boshqa noyob belgilar bilan shug'ullanishni rejalashtirmoqchi bo'lsangiz, bu bilim siz uchun foydali bo'ladi. 
```

Bizga ma'lumki, JavaScript satrlari [Unicode] (https://en.wikipedia.org/wiki/Unicode) ga asoslangan: har bir belgi 1-4 baytlik bayt ketma-ketligi bilan ifodalanadi.

JavaScript bizga quyidagi uchta belgidan biri bilan o'n oltilik Unicode kodini ko'rsatib, satrga belgi kiritish imkonini beradi:

- `\xXX`

    `XX` qiymati `00` va `FF` orasidagi ikkita o'n oltilik raqam bo'lishi kerak, keyin `\xXX` Unicode kodi `XX` bo'lgan belgidir.

    `\xXX` belgisi faqat ikkita o'n oltilik raqamni qo'llab-quvvatlaganligi sababli, uni faqat birinchi 256 ta Unicode belgilari uchun ishlatish mumkin.

    Ushbu dastlabki 256 ta belgi lotin alifbosi, asosiy sintaksis belgilari va boshqalarni o'z ichiga oladi. Masalan, `"\x7A"` `"z"` (Unicode `U+007A`) bilan bir xil.

    ```js run
    alert( "\x7A" ); // z
    alert( "\xA9" ); // ©, mualliflik huquqi belgisi
    ```

- `\uXXXX`
    `XXXX` qiymati `0000` va `FFFF` oralig'ida bo'lgan aniq 4 olti burchakli raqam bo'lishi kerak, keyin `\uXXXX` Unicode kodi `XXXX` bo'lgan belgidir.

    Unicode qiymatlari `U+FFFF` dan katta bo'lgan belgilar ham ushbu belgi bilan ifodalanishi mumkin, ammo bu holda biz surrogat juftlik deb ataladigan juftlikdan foydalanishimiz kerak (bu bobda keyinroq surrogat juftliklar haqida gaplashamiz).

    ```js run
    alert( "\u00A9" ); // ©, 4-raqamli olti burchakli yozuvdan foydalangan holda \xA9 bilan bir xil
    alert( "\u044F" ); // я, kirill alifbosi harfi
    alert( "\u2191" ); // ↑, tepaga yo'naltirilgan o'q belgisi
    ```

- `\u{X…XXXXXX}`

    `X…XXXXXX` `0` va `10FFFF` oralig'ida 1 dan 6 baytgacha bo'lgan o'n oltilik qiymat bo'lishi kerak (Unicode tomonidan belgilangan eng yuqori kod nuqtasi). Ushbu belgi bizga barcha mavjud Unicode belgilarini osongina ko'rsatishga imkon beradi.

    ```js run
    alert( "\u{20331}" ); // 佫, noyob xitoycha belgi (uzoq Unicode)
    alert( "\u{1F60D}" ); // 😍, jilmayib turgan yuz belgisi (boshqa uzun Unicode)
    ```

## Surrogat juftliklar

Tez-tez ishlatiladigan barcha belgilar 2 baytlik kodlarga ega (4 hex raqam). Aksariyat Yevropa tillaridagi harflar, raqamlar va asosiy birlashtirilgan CJK ideografik to‘plamlari (CJK – xitoy, yapon va koreys yozuv tizimlaridan) 2 baytlik tasvirga ega. 

Dastlab, JavaScript har bir belgi uchun atigi 2 baytga ruxsat beruvchi UTF-16 kodlashiga asoslangan edi. Ammo 2 bayt faqat 65536 kombinatsiyaga ruxsat beradi va bu Unicode ning barcha mumkin bo'lgan belgilari uchun yetarli emas.

Shunday qilib, 2 baytdan ortiq talab qilinadigan noyob belgilar "surrogat juftlik" deb ataladigan 2 baytli belgilar juftligi bilan kodlangan.

Salbiy ta'sir sifatida bunday belgilarning uzunligi `2` ni tashkil qiladi:

```js run
alert( '𝒳'.length ); // 2, MATEMATIK SCRIPT BOSH HARF X
alert( '😂'.length ); // 2, XURSANDCHILIK KO'Z YOSHLARI bor YUZ
alert( '𩷶'.length ); // 2, noyob xitoycha belgi
```

Buning sababi, JavaScript yaratilgan vaqtda surrogat juftliklar mavjud bo'lmagan va shuning uchun til tomonidan to'g'ri ishlov berilmagan!

Yuqoridagi satrlarning har birida bizda bitta belgi bor, lekin `length` xususiyati `2` uzunligini ko'rsatadi.

Belgini olish ham qiyin bo'lishi mumkin, chunki til xususiyatlarining ko'pchiligi surrogat juftlarni ikkita belgi sifatida ko'rib chiqadi.

Misol uchun, bu yerda biz outputda ikkita g'alati belgini ko'rishimiz mumkin:

```js run
alert( '𝒳'[0] ); // g'alati belgilarni ko'rsatadi ...
alert( '𝒳'[1] ); // ...surrogat juftining qismlari
```

Surrogat juftlik qismlari bir-birisiz hech qanday ma'noga ega emas. Shunday qilib, yuqoridagi misoldagi ogohlantirishlar aslida axlatni ko'rsatadi. 

Texnik jihatdan, surrogat juftlarni o'z kodlari orqali ham aniqlash mumkin: agar belgi `0xd800..0xdbff` oralig'ida kodga ega bo'lsa, u surrogat juftlikning birinchi qismidir. Keyingi belgi (ikkinchi qism) `0xdc00..0xdfff` oralig'ida kodga ega bo'lishi kerak. Ushbu intervallar standart bo'yicha faqat surrogat juftliklar uchun ajratilgan. 

Shunday qilib, [String.fromCodePoint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint) va [str.codePointAt](https://developer. mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt) surrogat juftliklar bilan ishlash uchun JavaScript ga qo'shilgan.

Ular [String.fromCharCode](mdn:js/String/fromCharCode) va [str.charCodeAt](mdn:js/String/charCodeAt) bilan bir xil, biroq ular surrogat juftliklarga to'g'ri munosabatda bo'lishadi.

Bu yerda farqni ko'rish mumkin:

```js run
// charCodeAt surrogat juftligini bilmaydi, shuning uchun u 𝒳 ning 1-qismi uchun kodlarni beradi:

alert( '𝒳'.charCodeAt(0).toString(16) ); // d835

// codePointAt surrogat juftligini biladi
alert( '𝒳'.codePointAt(0).toString(16) ); // 1d4b3, surrogat juftlikning ikkala qismini o'qiydi
```

Agar biz 1-pozitsiyadan olsak (va bu juda noto'g'ri), u holda ikkalasi ham juftlikning faqat 2-qismini qaytaradi:

```js run
alert( '𝒳'.charCodeAt(1).toString(16) ); // dcb3
alert( '𝒳'.codePointAt(1).toString(16) ); // dcb3
// ma'nosiz juftlikning 2-yarmi
```

Surrogat juftliklar bilan ishlashning boshqa usullarini keyinroq <info:iterable> bobida topasiz. Ehtimol, buning uchun maxsus kutubxonalar ham mavjud, ammo bu yerda taklif qilish uchun ma'lum hech narsa yo'q. 

````warn header="Takeaway: ixtiyoriy nuqtada satrlarni ajratish xavfli"
Biz shunchaki satrni o'zboshimchalik bilan ajrata olmaymiz, `str.slice(0, 4)` ni oling va uni haqiqiy qator bo'lishini kuting, masalan:

```js run
alert( 'hi 😂'.slice(0, 4) ); //  hi [?]
```

Bu yerda biz chiqishda axlat belgisini (tabassum surrogat juftligining birinchi yarmi) ko'rishimiz mumkin.

Agar siz surrogat juftliklar bilan ishonchli ishlashni xohlasangiz, bundan xabardor bo'ling. Katta muammoga duch kelmaslik uchun hech bo'lmaganda nima sodir bo'layotganini tushunishingiz kerak.
````

##  Diakritik belgilar va normalizatsiya

Ko'pgina tillarda asosiy belgidan iborat bo'lgan belgilar mavjud bo'lib, ular ustida/ostida belgi mavjud.

Masalan, `a` harfi ushbu belgilar uchun asosiy belgi bo'lishi mumkin: `àáâäãåā`.

Eng keng tarqalgan "composite" belgilar Unicode jadvalida o'z kodiga ega, lekin ularning hammasi ham unday emas, chunki mos kombinatsiyalar juda ko'p.

Asossiz kompozitsiyalarni qo'llab-quvvatlash uchun Unicode standarti bizga bir nechta Unicode belgilaridan foydalanishga imkon beradi: asosiy belgidan keyin uni "bezaydigan" bir yoki bir nechta "belgi" belgilari. 

Misol uchun, agar bizda `S`dan keyin maxsus "yuqoridagi nuqta" belgisi (kod`\u0307`) bo'lsa, u Ṡ sifatida ko'rsatiladi.

```js run
alert( 'S\u0307' ); // Ṡ
```

Agar bizga harf ustiga (yoki uning ostida) qo'shimcha belgi kerak bo'lsa -- muammo emas, shunchaki kerakli belgini qo'shing.

`Ṩ`. Misol uchun, agar biz "dot below" belgisini qo'shsak (kod `\u0323`), u holda bizda "yuqorida va ostida nuqtali S" bo'ladi: `Ṩ`.

Masalan:

```js run
alert( 'S\u0307\u0323' ); // Ṩ
```

Bu katta moslashuvchanlikni ta'minlaydi, lekin ayni paytda aktual muammodir: ikkita belgi vizual ravishda bir xil ko'rinishi mumkin, lekin turli Unicode kompozitsiyalari bilan ifodalanadi.

Masalan:

```js run
let s1 = 'S\u0307\u0323'; // Ṩ, S + yuqorida nuqta + pastda nuqta
let s2 = 'S\u0323\u0307'; // Ṩ, S + pastda nuqta + yuqorida nuqta

alert( `s1: ${s1}, s2: ${s2}` );

alert( s1 == s2 ); // noto'g'ri, garchi belgilar bir xil ko'rinsa ham (?!)
```

Buni hal qilish uchun har bir satrni yagona "normal" shaklga keltiradigan "Unicode normalizatsiya" algoritmi mavjud.

Bu vazifa [str.normalize()](mdn:js/String/normalize) tomonidan amalga oshiriladi.

```js run
alert( "S\u0307\u0323".normalize() == "S\u0323\u0307".normalize() ); // true
```

Qizig'i shundaki, bizning vaziyatimizda `normalize()` aslida 3 ta belgidan iborat ketma-ketlikni bittaga birlashtiradi: `\u1e68` (ikki nuqta bilan S).

```js run
alert( "S\u0307\u0323".normalize().length ); // 1

alert( "S\u0307\u0323".normalize() == "\u1e68" ); // true
```

Aslida, bu har doim ham shunday emas. Sababi, `Ṩ` belgisi "yetarlicha keng tarqalgan", shuning uchun Unicode yaratuvchilari uni asosiy jadvalga kiritib, kodni berishgan.

Agar siz normallashtirish qoidalari va variantlari haqida ko'proq ma'lumotga ega bo'lishni istasangiz -- ular Unicode standartining ilovasida tasvirlangan: [Unicode Normalization Forms](https://www.unicode.org/reports/tr15/), lekin amaliy maqsadlar uchun ushbu bo'limdagi ma'lumotlar yetarli hisoblanadi.
