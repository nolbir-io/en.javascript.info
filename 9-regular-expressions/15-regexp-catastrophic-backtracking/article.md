# Falokatli orqaga qaytish

Ba'zi oddiy iboralar oddiy ko'rinadi, lekin juda uzoq vaqt va hatto JavaScript dvigatelini "osib qo'yishi" mumkin.

Ertami-kechmi ko'pchilik dasturchilar vaqti-vaqti bilan bunday xatti-harakatlarga duch kelishadi. Odatiy alomat -- muntazam ifoda ba'zan yaxshi ishlaydi, lekin ba'zi qatorlar uchun u "osilib qoladi" va 100% protsessorni iste'mol qiladi.

Bunday holda, veb-brauzer skriptni o'chirib, sahifani qayta yuklashni taklif qiladi. Albatta bu yaxshi narsa emas.

Bundan ham yomoni server tomonidagi JavaScript uchun bunday regexp server jarayonini osib qo'yishi mumkin. Shuning uchun biz buni albatta ko'rib chiqishimiz kerak.

## Namuna

Aytaylik, bizda satr bor va uning har biridan keyin ixtiyoriy bo'sh joy qoldirilgan `pattern:\w+` so'zlaridan iborat yoki yo'qligini tekshirmoqchimiz.

Regexp yaratishning aniq usuli bu so'zdan keyin ixtiyoriy bo'sh joy bo'lgan `pattern:\w+\s?` va keyin uni `*` bilan takrorlashdir.

Bu bizni regexp `pattern:^(\w+\s?)*$`ga olib boradi, u `pattern:^`chizig'i boshida boshlanib, `pattern:$` oxirida tugaydigan nol yoki undan ortiq so'zlarni bildiradi.

Amaliy namuna:

```js run
let regexp = /^(\w+\s?)*$/;

alert( regexp.test("A good string") ); // true
alert( regexp.test("Bad characters: $@#") ); // false
```

Regexp ishlayotganga o'xshaydi. Natija to'g'ri. Ba'zi satrlarda bu ko'p vaqt talab etadi. JavaScript dvigateli 100% protsessor sarfi bilan "osib turdi".

Agar siz quyidagi misolni ishga tushirsangiz, ehtimol siz hech narsani ko'rmaysiz, chunki JavaScript shunchaki "osilib qoladi". Veb-brauzer voqealarga munosabat bildirishni to'xtatadi, UI ishlashni to'xtatadi (ko'pchilik brauzerlar faqat aylantirishga ruxsat beradi). Biroz vaqt o'tgach, u sahifani qayta yuklashni taklif qiladi. Shuning uchun ehtiyot bo'ling:

```js run
let regexp = /^(\w+\s?)*$/;
let str = "Ko'p vaqt talab qiladigan yoki hatto ushbu regexpni osib qo'yadigan kirish qatori!";

// ko'p vaqt talab qiladi
alert( regexp.test(str) );
```

Shuni ta'kidlash lozimki, ba'zi oddiy ibora dvigatellari bunday qidiruvni samarali boshqarishi mumkin, masalan, 8.8 dan boshlanadigan V8 dvigatel versiyasi buni amalga oshirishi mumkin (shuning uchun Google Chrome 88 bu yerda osilib qolmaydi), Firefox brauzeri esa osilib qoladi.

## Soddalashtirilgan misol

Nima bo'ldi? Nima uchun muntazam ifoda osilib qoladi?

Buni tushunish uchun misolni soddalashtiramiz: `pattern:\s?` bo'shliqlarini olib tashlang. Keyin u `pattern:^(\w+)*$` bo'ladi.

Va narsalarni yanada aniqroq qilish uchun `pattern:\w` ni `pattern:\d` bilan almashtiramiz. Olingan muntazam ifoda hali ham osilib turadi, masalan:

```js run
let regexp = /^(\d+)*$/;

let str = "012345678901234567890123456789z";

// uzoq vaqt talab etadi (ehtiyot bo'ling!)
alert( regexp.test(str) );
```

Xo'sh, regexp bilan nima noto'g'ri?

Birinchidan, regexp `pattern:(\d+)*` biroz g'alati ekanligini sezish mumkin. `pattern:*` miqdoriy ko'rsatkichi begona ko'rinadi. Agar raqamni xohlasak, `pattern:\d+` dan foydalanishimiz mumkin.

Haqiqatan ham, regexp sun'iydir; oldingi misolni soddalashtirib oldik. Ammo sekin bo'lishining sababi bir xil. Keling, buni tushunib olaylik, keyin oldingi misol aniq bo'ladi.

`subject:123456789z` qatorida `pattern:^(\d+)*$` qidirish paytida nima sodir bo'ladi (aniqlik uchun biroz qisqartirilgan, oxirida `subject:z` raqamli bo'lmagan belgiga e'tibor bering, bu muhim ), nega bu qadar uzoq davom etadi?

Demak, regexp mexanizmi nima qiladi:

1. Birinchidan, regexp mexanizmi qavslar tarkibini topishga harakat qiladi: `pattern:\d+` raqami. Plyus `pattern:+` sukut bo'yicha ochko'zdir, shuning uchun u barcha raqamlarni sarflaydi:

    ```
    \d+.......
    (123456789)z
    ```

     Barcha raqamlar iste'mol qilingandan so'ng, `pattern:\d+` topilgan deb hisoblanadi (`match:123456789`).

     Keyin `pattern:(\d+)*` yulduz miqdori qo'llaniladi. Ammo matnda boshqa raqamlar yo'q, shuning uchun yulduz hech narsa bermaydi.

     Naqshdagi keyingi belgi qator oxiri `pattern:$`dir. Lekin matnda bizda `subject:z` o'rniga, mos keladigan narsa yo'q:

    ```
               X
    \d+........$
    (123456789)z
    ```

2. Hech qanday moslik yo'qligi sababli, `pattern:+` ochko'z kvanti takrorlanish sonini kamaytiradi, bir belgi orqaga qaytaradi.

     Endi `pattern:\d+` oxirgisidan tashqari barcha raqamlarni oladi (`match:12345678`):
    ```
    \d+.......
    (12345678)9z
    ```
3. Keyin vosita qidiruvni keyingi pozitsiyadan davom ettirishga harakat qiladi (`match: 12345678` dan keyin).

     Yulduzcha `pattern:(\d+)*` qo'llanilishi mumkin -- u yana bitta `pattern:\d+`, `match:9` raqamini beradi:

    ```

    \d+.......\d+
    (12345678)(9)z
    ```

    Dvigatel yana `pattern:$` bilan moslashishga harakat qiladi, lekin muvaffaqiyatsiz bo'ladi, chunki u o'rniga `subject:z` javob beradi:

    ```
                 X
    \d+.......\d+
    (12345678)(9)z
    ```


4. Hech qanday mos kelmaydi, shuning uchun vosita takrorlanish sonini kamaytiradigan orqaga qaytishda davom etadi. Orqaga qaytish odatda shunday ishlaydi: oxirgi ochko'z miqdoriy belgi minimal darajaga yetguncha takrorlash sonini kamaytiradi. Keyin oldingi ochko'z miqdoriy ko'rsatkichi kamayadi va hokazo.

     Barcha mumkin bo'lgan kombinatsiyalarga harakat qilinadi. Mana ularning misollari.

     Birinchi `pattern:\d+` raqami 7 ta raqamdan, keyin esa 2 ta raqamdan iborat:

    ```
                 X
    \d+......\d+
    (1234567)(89)z
    ```

    Birinchi raqam 7 ta raqamdan, so'ngra har biri 1 raqamdanli ikkita raqamdan iborat:
    
    ```
                   X
    \d+......\d+\d+
    (1234567)(8)(9)z
    ```

    Birinchi raqam 6 ta raqamdan, keyin esa 3 ta raqamdan iborat:
    
    ```
                 X
    \d+.......\d+
    (123456)(789)z
    ```

    Birinchi raqam 6 ta raqamdan, keyin esa 2 ta raqamdan iborat:

    ```
                   X
    \d+.....\d+ \d+
    (123456)(78)(9)z
    ```

    ...Va hokazo.

`123456789` raqamlar ketma-ketligini raqamlarga bo'lishning ko'plab usullari mavjud. Aniq bo'lish uchun <code>2<sup>n</sup>-1</code> mavjud, bu yerda `n` ketma-ketlikning uzunligi.

- `123456789` uchun bizda `n=9` bor, bu 511 ta kombinatsiyani beradi.
- `n=20` uzunroq ketma-ketlik uchun taxminan bir million (1048575) kombinatsiya mavjud.
- `n=30` uchun - ming marta ko'p (1073741823 kombinatsiya).

Ularning har birini sinab ko'rish, qidiruvning shunchalik uzoq davom etishining sababidir.

## So'zlar va satrlarga qaytish

Xuddi shunday holat bizning birinchi misolimizda ham sodir bo'ladi, biz `subject:An input thats!` qatorida `pattern:^(\w+\s?)*$` namunasi bo'yicha so'zlarni qidirganda sodir bo'ladi.

Buning sababi shundaki, so'z bitta `pattern:\w+` yoki ko'p sifatida ifodalanishi mumkin:

```
(input)
(inpu)(t)
(inp)(u)(t)
(in)(p)(ut)
...
```

Inson uchun hech qanday mos kelmasligi aniq, chunki satr undov belgisi `!` bilan tugaydi, lekin oddiy ibora oxiridada `pattern:\w` so'z belgisi yoki `pattern:\s` bo'sh joy kutiladi. Ammo dvigatel buni bilmaydi.

U regexp `pattern:(\w+\s?)*` satrni qanday "iste'mol qilishi" mumkin bo'lgan barcha kombinatsiyalarni sinab ko'radi, jumladan `pattern:(\w+\s)*` va ularsiz `pattern:(\ w+)*` (chunki bo'shliqlar `pattern:\s?` ixtiyoriy). Bunday kombinatsiyalar ko'p bo'lgani uchun (biz buni raqamlar bilan ko'rganmiz), qidiruv juda ko'p vaqtni oladi.

Nima qilsa bo'ladi?

Biz dangasa rejimini yoqishimiz kerakmi?

Afsuski, bu yordam bermaydi: agar `pattern:\w+` ni `pattern:\w+?` bilan almashtirsak, regexp hali ham osilib qoladi. Kombinatsiyalar tartibi o'zgaradi, lekin ularning umumiy soni emas.

Ba'zi muntazam ifodali dvigatellarda murakkab sinovlar va chekli avtomatlashtirishlar mavjud bo'lib, ular barcha kombinatsiyalardan o'tishdan qochish yoki uni ancha tezlashtirish imkonini beradi, lekin ko'pchilik dvigatellarda bunday emas va bu har doim ham yordam bermaydi.

## Qanday tuzatish kerak?

Muammoni hal qilishning ikkita asosiy usuli mavjud.

Birinchisi, mumkin bo'lgan kombinatsiyalar sonini kamaytirishdir.

Oddiy iborani `pattern:^(\w+\s)*\w*$` shaklida qayta yozish orqali bo'sh joyni ixtiyoriy bo'lmagan holga keltiramiz - biz istalgan sonli so'zlardan keyin bo'sh joy `pattern:(\w+\s)*`, so'ngra (ixtiyoriy) yakuniy so'z `pattern:\w*` ni qidiramiz.

Ushbu regexp avvalgisiga teng (xuddi shunday) va yaxshi ishlaydi:

```js run
let regexp = /^(\w+\s)*\w*$/;
let str = "Ko'p vaqt talab qiladigan yoki hatto bu regexni osib qo'yadigan kirish qatori!";

alert( regexp.test(str) ); // false
```

Nima uchun muammo yo'qoldi?

Buning sababi, endi bo'sh joy majburiydir.

Oldingi regexp, agar bo'sh joy qoldirilsa, `pattern:(\w+)*` bo'lib, bir so'z ichida `\w+` ko'p birikmalariga olib keladi.

Shunday qilib, `subject:input` `pattern:\w+` ning ikkita takrorlanishi sifatida mos kelishi mumkin, masalan:

```
\w+  \w+
(inp)(ut)
```

Yangi pattern boshqacha: `pattern:(\w+\s)*` bo'sh joy qo'yilgan so'zlarning takrorlanishini bildiradi! `subject:input` qatorini `pattern:\w+\s`ning ikki marta takrorlanishi sifatida moslab bo'lmaydi, chunki bo'sh joy majburiydir.

Ko'p (aslida ko'pchilik) kombinatsiyalarni sinash uchun zarur bo'lgan vaqt endi tejaladi.

## Orqaga qaytishning oldini olish

Regexpni qayta yozish har doim ham qulay emas. Yuqoridagi misolda bu oson edi, lekin buni qanday qilish har doim ham aniq emas.

Bundan tashqari, qayta yozilgan regexp odatda murakkabroq va bu yaxshi emas. Regexps qo'shimcha harakatlarsiz yetarlicha murakkab darajada.

Yaxshiyamki, muqobil yondashuv mavjud. Biz miqdoriy belgi uchun orqaga qaytishni ta'qiqlashimiz mumkin.

Muammoning ildizi shundaki, regexp mexanizmi inson uchun noto'g'ri bo'lgan ko'plab kombinatsiyalarni sinab ko'radi.

Masalan, regexp `pattern:(\d+)*$` inson uchun `pattern:+` orqaga qaytmasligi aniq. Agar bitta `pattern:\d+` ni ikkita alohida `pattern:\d+\d+` bilan almashtirsak, hech narsa o'zgarmaydi:

```
\d+........
(123456789)!

\d+...\d+....
(1234)(56789)!
```

Va asl misolda `pattern:^(\w+\s?)*$` biz `pattern:\w+` da orqaga qaytishni taqiqlashni xohlashimiz mumkin. Ya'ni, `pattern:\w+` mumkin bo'lgan maksimal uzunlik bilan butun so'zga mos kelishi kerak. `pattern:\w+` da takrorlar sonini kamaytirish yoki uni ikki so'z `pattern:\w+\w+` va hokazolarga bo'lishning hojati yo'q.

Zamonaviy muntazam ifoda dvigatellari buning uchun egalik kvantifikatorlarini qo'llab-quvvatlaydi. Doimiy miqdor bildiruvchilardan keyin `pattern:+` qo'shsak, ega bo'ladi. Ya'ni, biz `pattern:\d+` o'rniga `pattern:\d++` dan `pattern:+` orqaga qaytishini to'xtatamiz.

Egalik kvantlovchilari aslida "muntazam"larga qaraganda soddaroq. Ular hech qanday orqaga chekinmasdan iloji boricha ko'proq mos keladi. Orqaga qaytishsiz qidiruv jarayoni oson.

Qavslar ichidagi orqaga qaytishni o'chirib qo'yish usuli - "atom tutuvchi guruhlar" ham mavjud.

...Ammo yomon xabar shundaki, afsuski, JavaScriptda ular qo'llab-quvvatlanmaydi.

Biz ularga taqlid qilishimiz mumkin, ammo "lookaheadni o'zgartirish" dan foydalanamiz.

### Lookahead qutqaradi!

Shunday qilib, biz haqiqiy ilg'or mavzularga keldik. Biz `pattern:+` kabi miqdor ko'rsatkichini orqaga qaytmaslikni xohlaymiz, chunki ba'zida orqaga qaytish hech qanday ma'noga ega emas.

`Pattern:\w` ning iloji boricha ko'proq takrorlanishini orqaga qaytarmasdan olish uchun namuna: `pattern:(?=(\w+))\1`. Albatta, `pattern:\w` o'rniga boshqa pattern olishimiz mumkin.

Bu g'alati tuyuladi, lekin aslida bu juda oddiy transformatsiya.

Keling, uni shifrlaymiz:

- Lookahead `pattern:?=` joriy holatdan boshlab eng uzun `pattern:\w+` so'zini kutadi.
- `pattern:?=...` bo'lgan qavslar tarkibi dvigatel tomonidan yodlanmagan, shuning uchun `pattern:\w+` ni qavs ichiga o'rang. Keyin dvigatel ularning mazmunini eslab qoladi
- ...Va uni `pattern:\1` sifatida ko'rsatishga ruxsat bering.

Ya'ni: biz oldinga qaraymiz - va agar `pattern:\w+` so'zi bo'lsa, uni `pattern:\1` sifatida moslang.

Nega? Buning sababi, look ahead `pattern:\w+` so'zini bir butun sifatida topadi va biz uni `pattern:\1` bilan patternga kiritamiz. Shunday qilib, biz mohiyatan egalik plyus `pattern:+` kvantifikatorini amalga oshirdik. U faqat butun `pattern:\w+` so'zini qamrab oladi, uning bir qismini emas.

Masalan, `subject:JavaScript` so'zida u nafaqat `match:Java` ga mos kelishi mumkin, balki qolgan naqshga mos kelishi uchun `match:Script`ni ham qoldirishi mumkin.

Mana ikkita patternni taqqoslash:

```js run
alert( "JavaScript".match(/\w+Script/)); // JavaScript
alert( "JavaScript".match(/(?=(\w+))\1Script/)); // null
```

1. Birinchi variantda `pattern:\w+` avval `mavzu:JavaScript` so'zini to'liq qamrab oladi, so'ngra `pattern:+` qolgan qismiga mos kelishga harakat qilish uchun xarakter bo'yicha belgilarni orqaga qaytaradi, to oxirigacha muvaffaqiyatga erishadi (qachonki `pattern:\w+` `mos: Java`ga mos kelsa).
2. Ikkinchi variantda `pattern:(?=(\w+))` oldinga qaraydi va `subject:JavaScript` so'zini topadi, bu naqshga `pattern:\1` bilan bir butun sifatida kiritilgan, shuning uchun qoladi. Undan keyin `subject:Script` ni topishning iloji yo'q.

Agar undan keyin `pattern:+` uchun orqaga qaytishni taqiqlash kerak bo'lsa, `pattern:\w` o'rniga `pattern:(?=(\w+))\1` ga murakkabroq muntazam iborani qo'yishimiz mumkin.

```smart
Berilgan maqolada egalik kvantifikatorlari va lookahead o'rtasidagi bog'liqlik haqida ko'proq ma'lumot berilgan [Regex: LookAhead yordamida atomik guruhlashni (va egalik kvantifikatorlarini) taqlid qilish](https://instanceof.me/post/52245507631/regex-emulate-atomic-grouping-with-lookhead) va [Atom guruhlarini taqlid qilish](https://blog.stevenlevithan.com/archives/mimic-atomic-groups).
```

Keling, orqaga qaytishni oldini olish uchun birinchi misolni lookahead yordamida qayta yozamiz:

```js run
let regexp = /^((?=(\w+))\2\s?)*$/;

alert( regexp.test("A good string") ); // true

let str = "Ko'p vaqt talab qiladigan yoki hatto ushbu regexpni osib qo'yadigan kirish qatori!";

alert( regexp.test(str) ); // false, tez ishlaydi!
```

Bu yerda `pattern:\1` o'rniga `pattern:\2` ishlatiladi, chunki qo'shimcha tashqi qavslar mavjud. Raqamlar bilan aralashmaslik uchun biz qavslarga nom berishimiz mumkin, masalan, `pattern:(?<word>\w+)`.

```js run
// qavslar ?<word> deb nomlanadi, \k<word> deb havola qilinadi
let regexp = /^((?=(?<word>\w+))\k<word>\s?)*$/;

let str = "Ko'p vaqt talab qiladigan yoki hatto bu regexpni osib qo'yadigan kirish qatori!";

alert( regexp.test(str) ); // false

alert( regexp.test("To'g'ri string") ); // true
```

Ushbu maqolada tasvirlangan muammo "halokatli orqaga qaytish" deb ataladi.

Biz uni hal qilishning ikkita usulini ko'rib chiqdik:
- Mumkin kombinatsiyalar sonini kamaytirish uchun regexpni qayta yozing.
- Orqaga qaytishning oldini olish.
