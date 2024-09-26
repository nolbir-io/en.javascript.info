# Ochko'z va dangasa kvantlar (quantifiers)

Miqdor ko'rsatkichlari birinchi qarashda juda oddiy, lekin aslida ular qiyin bo'lishi mumkin.

Agar biz `pattern:/\d+/` dan murakkabroq narsani qidirmoqchi bo'lsak, qidiruv qanday ishlashini tushunishimiz kerak.

Misol tariqasida quyidagi topshiriqni olaylik.

Bizda matn bor va barcha qo'shtirnoqlarni `"..."` guillemet belgilari bilan almashtirishimiz kerak: `«...»`. Ular ko'plab mamlakatlarda tipografiya uchun afzallik beriladi.

Masalan: `"Hello, world"` `«Hello, world»`ga aylanishi kerak. Boshqa qo'shtirnoqlar ham bor, masalan, `„Witam, świat!”` (Polsha) yoki `「你好，世界」` (xitoycha), lekin vazifamiz uchun `«...»` ni tanlaymiz.

Birinchi vazifamiz bu quoted qilingan satrlarni topish va keyin ularni almashtirishimiz mumkin.

`Pattern:/".+"/g` (iqtibos, keyin biror narsa, keyin boshqa iqtibos) kabi oddiy ibora yaxshi mosdek tuyulishi mumkin, lekin unday emas!

Keling, sinab ko'raylik: 

```js run
let regexp = /".+"/g;

let str = 'a "witch" and her "broom" is one';

alert( str.match(regexp) ); // "witch" and her "broom" ("jodugar" va uning "supurgisi")
```

...Ko'rib turibmizki, u mo'ljallangandek ishlamayapti!

Ikkita `match:"witch"` va `match:"broom` ni topish o'rniga, u bittasini topadi: `match:"witch" and her "broom"`.

Buni "hamma yomonliklarning sababi ochko'zlik" deb ta'riflash mumkin.

## Ochko'z qidiruv (Greedy search)

Moslikni topish uchun muntazam ifoda mexanizmi quyidagi algoritmdan foydalanadi:

- Satrdagi har bir pozitsiya uchun
     - O'sha holatda patternga mos kelishga harakat qiling.
     - Agar mos kelmasa, keyingi pozitsiyaga o'ting.

Ushbu keng tarqalgan so'zlar regexp nima uchun muvaffaqiyatsizlikka uchraganini aniq ko'rsatmaydi, shuning uchun `pattern:".+"` pattern uchun qidiruv qanday ishlashini batafsil ko'rib chiqamiz.

1. Birinchi pattern belgisi `pattern:"` quotedir.

     Muntazam ifoda mexanizmi uni `subject:a "witch" and her "broom" is one` manba satrining nol holatida topishga harakat qiladi, lekin u yerda `subject:a` bor, shuning uchun tezkor moslik yo'q.

     Keyin u oldinga siljiydi: manba satrining keyingi pozitsiyalariga o'tadi va u yerda naqshning birinchi belgisini topishga harakat qiladi, yana muvaffaqiyatsizlikka uchraydi va nihoyat 3-pozitsiyadagi quote ni topadi:

    ![](witch_greedy1.svg)

2. Quote aniqlanadi, keyin vosita qolgan pattern uchun moslikni topishga harakat qiladi. U mavzu satrining qolgan qismi `pattern:.+"` ga mos kelishini tekshirishga harakat qiladi. 

    Bizning holatda keyingi naqsh belgisi `pattern:.` (nuqta) bo'ladi. U "yangi satrdan tashqari har qanday belgi" ni bildiradi, shuning uchun keyingi qatordagi `match: 'w'` harfi mos keladi:

    ![](witch_greedy2.svg)

3. Keyin nuqta `pattern:.+` kvantifikatori tufayli takrorlanadi. Muntazam ifoda mexanizmi o'yinga birin-ketin belgilar qo'shadi.

     ...Qachongacha? Barcha belgilar nuqtaga mos keladi, shuning uchun u faqat satr oxiriga yetganda to'xtaydi:

    ![](witch_greedy3.svg)

4. Endi dvigatel `pattern:.+` takrorlashni tugatdi va patternning keyingi belgisini topishga harakat qiladi. Bu `pattern:"` quote hisoblanadi. Lekin muammo bor: string tugadi, boshqa belgilar yo'q!

     Muntazam ifoda mexanizmi juda ko'p `pattern:.+` olganini tushunadi va *orqaga qaytishni* boshlaydi.

     Boshqacha qilib aytganda, u kvant uchun moslikni bitta belgiga qisqartiradi:

    ![](witch_greedy4.svg)

     Endi `pattern:.+` satr tugashidan oldin bir belgi tugaydi va naqshning qolgan qismini shu pozitsiyadan moslashtirishga harakat qiladi, deb taxmin qilinadi.

     Agar u yerda iqtibos bo'lsa, qidiruv tugaydi, lekin oxirgi belgi `subject:'e'`, shuning uchun moslik yo'q.

5. ...Shunday qilib, vosita `pattern:.+` takrorlanish sonini yana bir belgiga kamaytiradi:

    ![](witch_greedy5.svg)

    `pattern:'"'` quote `subject:'n'` bilan mos kelmaydi.

6. Dvigatel orqaga qaytishda davom etadi: u naqshning qolgan qismi (bizning holimizda `pattern:'"'`) mos kelguncha `pattern:'.'` uchun takrorlanish sonini kamaytiradi:

    ![](witch_greedy6.svg)

7. Uchrashuv yakunlandi.

8. Shunday qilib, birinchi o'yin `match:"witch" and her "broom"`. Agar oddiy iborada `pattern:g` belgisi bo'lsa, qidiruv birinchi o'yin tugagan joydan davom etadi. `subject:is one` qatorining qolgan qismida qo'shtirnoq mavjud emas, shuning uchun boshqa natijalar yo'q.

Ehtimol, bu biz kutmagan narsadir, lekin u shunday ishlaydi.

**Greedy rejimida (sukut bo'yicha) miqdoriy belgi imkon qadar ko'p marta takrorlanadi.**

Regexp mexanizmi mos keladigan `pattern:.+` uchun iloji boricha ko'proq belgilar qo'shadi va agar patternning qolgan qismi mos kelmasa, ularni birma-bir qisqartiradi.

Bizning vazifamiz uchun biz boshqa narsani xohlaymiz. Bu yerda dangasa rejimi yordam berishi mumkin.

## Lazy rejimi

Miqdor ko'rsatkichlarining dangasa rejimi greedy rejimiga qarama-qarshidir. Buning ma'nosi: "minimal marta takrorlash".

Miqdor ko'rsatkichidan keyin `pattern:'?'` so'roq belgisini qo'yish orqali uni yoqishimiz mumkin, shunda u `pattern:*?` yoki `pattern:+?` yoki hatto `pattern:` uchun `pattern:??` bo'ladi. ?'`.

Aniqroq qilish uchun: odatda savol belgisi `pattern:?` o'z-o'zidan kvantdir (nol yoki bitta), lekin *boshqa kvantdan keyin (yoki hatto o'zidan)* qo'shilsa, u boshqa ma'noga ega bo'ladi -- mos keladigan dangasadan ochko'zga rejimni o'zgartiradi.

Regexp `pattern:/".+?"/g` mo'ljallanganidek ishlaydi: u `match:"witch"` va `match:"broom"` ni topadi:

```js run
let regexp = /".+?"/g;

let str = 'a "witch" and her "broom" is one';

alert( str.match(regexp) ); // "witch", "broom"
```

O'zgarishlarni aniq tushunish uchun keling, qidiruvni bosqichma-bosqich kuzatamiz.

1. Birinchi qadam bir xil: u 3-pog'onada `pattern:'"'` boshlanish namunasini topadi:

    ![](witch_greedy1.svg)

2. Keyingi qadam ham shunga o'xshash: vosita nuqta `pattern:'` uchun moslikni topadi:

    ![](witch_greedy2.svg)

3. Va endi qidiruv boshqacha ketmoqda. Bizda `pattern:+?` uchun dangasa rejimi borligi sababli, vosita nuqtani yana bir marta moslashtirishga urinmaydi, lekin to'xtab qoladi va hozirda `pattern:'"'` patternning qolgan qismiga mos kelishga harakat qiladi:

    ![](witch_lazy3.svg)

   Agar u yerda iqtibos bo'lsa, qidiruv tugaydi, lekin `'i'` bor, shuning uchun hech qanday moslik yo'q.
4. Keyin muntazam ifoda mexanizmi nuqta uchun takrorlash sonini oshiradi va yana bir marta urinib ko'radi:

    ![](witch_lazy4.svg)

   Yana muvaffaqiyatsizlik. Keyin takrorlashlar soni yana va yana ko'paytiriladi ...
5. ...Patternning qolgan qismiga mos kelgunga qadar:

    ![](witch_lazy5.svg)

6. Keyingi qidiruv joriy o'yin oxiridan boshlanadi va yana bitta natija beradi:

    ![](witch_lazy6.svg)

Ushbu misolda biz dangasa rejimi `pattern:+?` uchun qanday ishlashini ko'rdik. `pattern:*?` va `pattern:??` kvantifikatorlari xuddi shunday ishlaydi -- regexp mexanizmi faqat naqshning qolgan qismi berilgan pozitsiyaga mos kelmasa, takrorlash sonini oshiradi.

**Dangasalik faqat `?` bilan kvant uchun yoqilgan.**

Boshqa miqdor ko'rsatkichlari ochko'z bo'lib qolmoqda.

Masalan:

```js run
alert( "123 456".match(/\d+ \d+?/) ); // 123 4
```

1. `pattern:\d+` pattern imkon qadar ko'proq raqamlarni moslashtirishga harakat qiladi (ochko'zlik rejimi), shuning uchun u `match:123`ni topadi va to'xtaydi, chunki keyingi belgi bo'sh joy `pattern:' '`.
2. Keyingi patternda bo'sh joy bor, u mos keladi.
3. Shuningdek, `pattern:\d+?` bor. Miqdor ko'rsatkichi dangasa rejimda, shuning uchun u bir raqam `match: 4` ni topadi va qolgan pattern mos kelishini tekshirishga harakat qiladi.

     ...Lekin `pattern:\d+?` dan keyin patternda hech narsa yo'q.

     Dangasa rejimi keraksiz hech narsani takrorlamaydi. Pattern tugadi, shuning uchun biz tugatdik. Bizda `match: 123 4` bor.

```smart header="Optimizatsiyalar"
Zamonaviy muntazam ifoda dvigatellari tezroq ishlash uchun ichki algoritmlarni optimallashtirishi mumkin. Shunday qilib, ular tavsiflangan algoritmdan biroz boshqacha ishlaydi.

Ammo muntazam iboralar qanday ishlashini tushunish va muntazam iboralar yaratish uchun bu haqda bilishimiz shart emas. Ular faqat narsalarni optimallashtirish uchun ichki tarzda ishlatiladi.

Murakkab muntazam iboralarni optimallashtirish qiyin, shuning uchun qidiruv xuddi tasvirlanganidek ishlashi mumkin.
```

## Muqobil yondashuv

Regexplar bilan bir xil narsani bajarishning bir nechta usullari mavjud.

Bizning holatda biz dangasa rejimisiz quoted qilingan satrlarni regexp `pattern:"[^"]+"` yordamida topishimiz mumkin:

```js run
let regexp = /"[^"]+"/g;

let str = 'a "witch" and her "broom" is one';

alert( str.match(regexp) ); // "witch", "broom"
```

Regexp `pattern:"[^"]+"` to'g'ri natijalar beradi, chunki u qo'shtirnoq `pattern:'"'` keyin bir yoki bir nechta quote siz `pattern:[^"]` va keyin yakunlovchi iqtibos hisoblanadi.

Regexp mexanizmi `pattern:[^"]+` ni qidirganda, u yopilish quote ga to'g'ri kelganda takrorlashni to'xtatadi va biz ham ishni yakunlaymiz.

E'tibor bering, bu mantiq dangasa kvantlar o'rnini bosa olmaydi!

Bu shunchaki boshqacha. Ba'zida bizga u yoki bu narsa kerak bo'ladi.

**Keling, dangasa kvantlar ishlamay qolgan va bu variant to'g'ri ishlayotgan misolni ko'rib chiqaylik.**

Masalan, biz `<a href="..." class="doc">` shaklidagi havolalarni istalgan `href` bilan topmoqchimiz.

Qaysi muntazam ifodani ishlatish kerak?

Birinchi g'oya `pattern:/<a href=".*" class="doc">/g` bo'lishi mumkin.

Keling, buni tekshiramiz:
```js run
let str = '...<a href="link" class="doc">...';
let regexp = /<a href=".*" class="doc">/g;

// Works!
alert( str.match(regexp) ); // <a href="link" class="doc">
```

Bu ishladi. Ammo keling, matnda havolalar ko'p bo'lsa nima bo'lishini ko'rib chiqamiz.

```js run
let str = '...<a href="link1" class="doc">... <a href="link2" class="doc">...';
let regexp = /<a href=".*" class="doc">/g;

// Whoops! Bitta maydonda ikkita havola!
alert( str.match(regexp) ); // <a href="link1" class="doc">... <a href="link2" class="doc">
```

Endi natija bizning "jodugarlar" (witches) misolimiz bilan bir xil sababga ko'ra noto'g'ri. `pattern:.*` miqdoriy belgi juda ko'p belgi oldi.

Moslik quyidagicha ko'rinadi:

```html
<a href="....................................." class="doc">
<a href="link1" class="doc">... <a href="link2" class="doc">
```

`pattern:.*?` kvantini dangasa qilib, patternni o'zgartiramiz:

```js run
let str = '...<a href="link1" class="doc">... <a href="link2" class="doc">...';
let regexp = /<a href=".*?" class="doc">/g;

// Ishladi!
alert( str.match(regexp) ); // <a href="link1" class="doc">, <a href="link2" class="doc">
```

Endi u ishlayotganga o'xshaydi, ikkita moslik bor:

```html
<a href="....." class="doc">    <a href="....." class="doc">
<a href="link1" class="doc">... <a href="link2" class="doc">
```

...Lekin buni yana bitta matn kiritishda sinab ko'raylik:

```js run
let str = '...<a href="link1" class="wrong">... <p style="" class="doc">...';
let regexp = /<a href=".*?" class="doc">/g;

// Noto'g'ri moslik!
alert( str.match(regexp) ); // <a href="link1" class="wrong">... <p style="" class="doc">
```

Endi bu muvaffaqiyatsiz. O'yinda nafaqat havola, balki undan keyingi ko'plab matnlar, jumladan `<p...>` ham mavjud.

Nega?

Bu sodir bo'layotgan narsa:

1. Avval regexp start `match:<a href="` havolasini topadi.
2. Keyin `pattern:.*?` ni qidiradi: bitta belgini oladi (dangasalik bilan!), `pattern:" class="doc">` (yo'q) uchun mosligini tekshiring.
3. Keyin yana bir belgini `pattern:.*?` ichiga oladi va hokazo... oxiri `match:" class="doc">` ga yetguncha davom etadi.

Ammo muammo shundaki: bu boshqa tegdagi `<a...>` havolasidan tashqarida `<p>`. Biz xohlagan narsa emas.

Matnga mos keladigan o'yin surati:

```html
<a href="..................................." class="doc">
<a href="link1" class="wrong">... <p style="" class="doc">
```

Demak, `<a href="...something..." class="doc">` ni izlash uchun namuna kerak, ammo ochko'z va dangasa variantlarda ham muammolar mavjud.

To'g'ri variant quyidagicha bo'lishi mumkin: `pattern:href="[^"]*"`. U `href` atribyutidagi barcha belgilarni va faqat bizga kerak bo'lgan narsalarni eng yaqin qo'shtirnoqqacha oladi.

Ishlayotgan misol:

```js run
let str1 = '...<a href="link1" class="wrong">... <p style="" class="doc">...';
let str2 = '...<a href="link1" class="doc">... <a href="link2" class="doc">...';
let regexp = /<a href="[^"]*" class="doc">/g;

// Works!
alert( str1.match(regexp) ); // null, moslik yo'q, bu to'g'ri
alert( str2.match(regexp) ); // <a href="link1" class="doc">, <a href="link2" class="doc">
```

## Xulosa

Miqdor ko'rsatkichlari ikkita ish rejimiga ega:

Ochko'z
: Odatiy bo'lib, oddiy ifoda mexanizmi miqdoriy belgini imkon qadar ko'p marta takrorlashga harakat qiladi. Masalan, `pattern:\d+` barcha mumkin bo'lgan raqamlarni sarflaydi. Ko'proq iste'mol qilish imkonsiz bo'lganda (raqamlar yoki string oxiri yo'q), keyin u patternning qolgan qismiga mos kelishda davom etadi. Agar mos kelmasa, u takrorlash sonini kamaytiradi (orqaga qaytish) va yana urinib ko'radi.

Dangasa
: Miqdor ko'rsatkichidan keyin `pattern:?` savol belgisi bilan faollashtirilgan. Regexp mexanizmi miqdoriy belgining har bir takrorlanishidan oldin naqshning qolgan qismiga mos kelishga harakat qiladi.

Ko'rib turganimizdek, dangasa rejimi ochko'z qidiruvdan "panatseya" emas. Muqobil variant `pattern:"[^"]+"` dagi kabi istisnolar bilan "nozik sozlangan" ochko'z qidiruvdir.
