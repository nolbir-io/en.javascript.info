
# Modullar bilan tanishuv

Ilovamiz kattalashib borar ekan, biz uni bir nechta fayllar,  ya'ni "modullar"ga bo'lishni xohlaymiz. Modul ma'lum bir maqsad uchun sinf yoki funksiyalar kutubxonasini o'z ichiga olishi mumkin.

Uzoq vaqt davomida JavaScript til darajasidagi modul sintaksisisiz mavjud edi. Bu muammo hisoblanmas, dastlab skriptlar kichik va sodda bo'lganligi sababli modullar kerak emasdi.

Ammo oxir-oqibat skriptlar tobora murakkablashdi, shuning uchun hamjamiyat kodni modullarga, modullarni talab bo'yicha yuklash uchun maxsus kutubxonalarga ajratishning turli usullarini ixtiro qildi.

Ba'zilarini nomlash uchun (tarixiy sabablarga ko'ra):

- [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) -- eng qadimiy modul tizimlaridan biri, dastlab kutubxona tomonidan amalga oshirilgan [require.js](https://requirejs.org/).
- [CommonJS](https://wiki.commonjs.org/wiki/Modules/1.1) -- Node.js serveri uchun yaratilgan modul tizimi.
- [UMD](https://github.com/umdjs/umd) -- AMD va CommonJS bilan mos keluvchi, universal sifatida tavsiya etilgan yana bir modul tizimi.

Endi bularning barchasi asta-sekin tarixning bir qismiga aylandi, lekin biz ularni hali ham eski skriptlarda uchratishimiz mumkin.

Til darajasidagi modul tizimi standartda 2015-yilda paydo bo'lgan, o'shandan beri asta-sekin rivojlanib bordi va endi barcha asosiy brauzerlar va Node.js tomonidan qo'llab-quvvatlanadi. Shunday qilib, biz bundan buyon zamonaviy JavaScript modullarini o'rganamiz.

## Modul o'zi nima?

Modul shunchaki fayl bo'lib, bitta skript bitta moduldir. Hammasi oddiy narsalar.

Modullar bir-birini yuklashi va funksiyalarni almashish, bir modulning funksiyalarini boshqasidan chaqirish uchun maxsus `export` va `import` direktivlaridan (yo'riqnoma, ko'rsatma) foydalanishi mumkin:

- `export` kalit so'zi joriy moduldan tashqaridan kirish mumkin bo'lgan o'zgaruvchilar va funksiyalarni belgilaydi.
- `import` boshqa modullardan funksiyalarni import qilishga imkon beradi.

Masalan, funksiyani eksport qiluvchi `sayHi.js` faylimiz bo'lsa:

```js
// 📁 sayHi.js
export function sayHi(user) {
  alert(`Hello, ${user}!`);
}
```

...Keyin boshqa fayl import qilishi va undan foydalanishi mumkin:

```js
// 📁 main.js
import {sayHi} from './sayHi.js';

alert(sayHi); // function...
sayHi('John'); // Hello, John!
```

`Import` direktivasi modulni joriy faylga nisbatan `./sayHi.js` yo'li bilan yuklaydi va mos o'zgaruvchiga eksport qilingan `sayHi` funksiyasini tayinlaydi.

Keling, misolni brauzerda ishga tushiramiz.

Modullar maxsus kalit so'zlar va funksiyalarni qo'llab-quvvatlagani uchun biz brauzerga `<script type="module">` atribyutidan foydalanib, skript modul sifatida ko'rib chiqilishi kerakligini tayinlashimiz kerak.

Mana bunday:

[kod jadvallari src="say" balandlik="140" hozirgi="index.html"]

Brauzer avtomatik ravishda import qilingan modulni oladi va baholaydi (agar kerak bo'lsa, uni import qiladi) va keyin skriptni ishga tushiradi.

```ogohlantiruvchi sarlavha="Modullar mahalliy emas, faqat HTTP(lar) orqali ishlaydi"
Agar siz `file://` protokoli orqali veb-sahifani mahalliy sifatida ochishga harakat qilsangiz, `import/export` direktivalari ishlamayotganini ko'rasiz. Mahalliy veb-serverdan foydalaning, masalan, [static-server](https://www.npmjs.com/package/static-server#getting-started) yoki muharriringizning VS kabi “jonli server” qobiliyatidan foydalaning. Modullarni sinash uchun [Jonli server kengaytmasi](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) kodini kiriting.
```

## Asosiy modul xususiyatlari

Modullarda "oddiy" skriptlardan nimasi farq qiladi?

Brauzer va server tomonidagi JavaScript uchun ham amal qiladigan asosiy xususiyatlar mavjud.

### Har doim "qat'iy foydalaning"

Modullar har doim qattiq rejimda ishlaydi. Masalan, e'lon qilinmagan o'zgaruvchiga tayinlash xatolikka olib keladi.
```html run
<script type="module">
  a = 5; // error
</script>
```

### Modul darajasidagi qamrov

Har bir modul o'zining yuqori darajadagi ko'lamiga ega. Boshqacha qilib aytganda, modulning yuqori darajadagi o'zgaruvchilari va funktsiyalari boshqa skriptlarda ko'rinmaydi.

Quyidagi misolda ikkita skript import qilingan va `hello.js` `user.js` da e'lon qilingan `user` 
o'zgaruvchisidan foydalanishga harakat qiladi. Bu urinish muvaffaqiyatsiz, chunki bu alohida modul (konsolda xatolikni ko'rishingiz mumkin):

[kod jadvallari src="scopes" balandlik="140" hozirgi="index.html"]

Modullar tashqaridan kirishni xohlagan narsani `export` qilishlari va kerakli narsalarni `import` qilishlari kerak.

- `user.js` `user` o'zgaruvchisini eksport qilishi kerak.
- `hello.js` uni `user.js` modulidan import qilishi kerak.

Boshqacha qilib aytganda, modullar bilan biz global o'zgaruvchilarga tayanish o'rniga import/eksportdan foydalanamiz.

Bu to'g'ri variant:

[kod jadvallari src="faoliyat doiralari" balandlik="140" hozirgi="hello.js"]

Brauzerda, agar HTML sahifalari haqida gapiradigan bo'lsak, har bir `<script type="module">` uchun mustaqil yuqori darajali qamrov ham mavjud.

Mana bir sahifada ikkita skript, ikkalasi ham `type="modul"`. Ular bir-birining yuqori darajadagi o'zgaruvchilarini ko'rmaydilar:

```html run
<script type="module">
  // O'zgaruvchi faqat ushbu modul skriptida ko'rinadi
  let user = "John";
</script>

<script type="module">
  *!*
  alert(user); // Error: user aniqlanmagan
  */!*
</script>
```

```smart
Brauzerda biz uni "window" xususiyatiga aniq belgilash orqali oyna darajasidagi o'zgaruvchini global qilishimiz mumkin, masalan. `window.user = "Jon"`.

Keyin barcha skriptlar uni "type="module" bilan ham, unsiz ham ko'radi.

Ya'ni, bunday global o'zgaruvchilarni qilish ta'qiqlangan . Iltimos, buning oldini olishga harakat qiling.
```

### Modul kodi faqat birinchi marta import qilinganida baholanadi

Agar bir xil modul bir nechta boshqa modullarga import qilinsa, uning kodi birinchi importda faqat bir marta bajariladi. Keyin uning eksporti barcha keyingi importchilarga beriladi.

Bir martalik baholash biz bilishimiz kerak bo'lgan muhim oqibatlarga olib keladi.

Keling, bir nechta misollarni ko'rib chiqaylik.

Birinchidan, agar modul kodini bajarish xabarni ko'rsatish kabi nojo'ya ta'sirlarni keltirib chiqarsa, uni bir necha marta import qilish uni faqat bir marta ishga tushiradi -- birinchi marta:

```js
// 📁 alert.js
alert("Module is evaluated!");
```

```js
// Xuddi shu modulni turli fayllardan import qiling

// 📁 1.js
import `./alert.js`; // Modul baholandi!

// 📁 2.js
import `./alert.js`; // (hech narsani ko'rsatmaydi)
```

Ikkinchi import hech narsani ko'rsatmaydi, chunki modul allaqachon baholangan.

Qoida bor: modulga xos ichki ma'lumotlar tuzilmalarini yaratish, ishga tushirish uchun yuqori darajadagi modul kodidan foydalanish kerak. Agar biror narsani bir necha marta chaqirishimiz kerak bo'lsa, biz uni yuqoridagi `sayHi` bilan bajarganimiz kabi funksiya sifatida eksport qilishimiz kerak.

Endi chuqurroq misolni ko'rib chiqaylik.

Aytaylik, modul obyektni eksport qiladi:

```js
// 📁 admin.js
export let admin = {
  name: "John"
};
```

Agar ushbu modul bir nechta fayllardan import qilingan bo'lsa, modul faqat birinchi marta baholanadi, `admin` obyekti yaratiladi va keyin barcha import qiluvchilarga uzatiladi.

Barcha importchilar aynan bitta va yagona `admin` obyektini oladi:

```js
// 📁 1.js
import {admin} from './admin.js';
admin.name = "Pete";

// 📁 2.js
import {admin} from './admin.js';
alert(admin.name); // Pete

*!*
// 1.js va 2.js ikkalasi ham bir xil administrator obyektiga havola qiladi
// 1.js da kiritilgan o'zgarishlar 2.js da ko'rinadi
*/!*
```

Ko'rib turganingizdek, `1.js` import qilingan `admin`dagi `name` xususiyatini o'zgartirganda, `2.js` yangi `admin.name`ni ko'rishi mumkin.

Buning sababi, modul faqat bir marta bajariladi. Eksportlar yaratiladi va keyin importerlar o'rtasida taqsimlanadi, shuning uchun `admin` obyektini biror narsa o'zgartirsa, boshqa importchilar buni ko'radi.

**Bunday xatti-harakatlar aslida juda qulay, chunki u modullarni *configure* qilish, ya'ni sozlash imkonini beradi.**

Boshqacha qilib aytganda, modul sozlashni talab qiladigan umumiy funksionallikni ta'minlashi mumkin. Masalan, autentifikatsiya uchun hisob ma'lumotlari kerak. Keyin u tashqi kodni tayinlash uchun konfiguratsiya obyektini eksport qilishi mumkin.

Mana klassik ketma-ketlik:
1. Modul ba'zi konfiguratsiya vositalarini eksport qiladi, masalan, konfiguratsiya obyektini.
2. Birinchi importda uni ishga tushiramiz, uning xossalariga yozamiz. Yuqori darajadagi dastur skripti buni amalga oshirishi mumkin.
3. Keyingi importlar moduldan foydalanadi.

Masalan, `admin.js` moduli maʼlum funksiyalarni (masalan, autentifikatsiya) ta'minlashi mumkin, lekin hisob ma'lumotlari `config` obyektiga tashqaridan kelishini kutishi mumkin:

```js
// 📁 admin.js
export let config = { };

export function sayHi() {
  alert(`Xizmat qilishga tayyor, ${config.user}!`);
}
```

Bu yerda `admin.js` `config` obyektini eksport qiladi (dastlab bo'sh, lekin birlamchi xususiyatlarga ham ega bo'lishi mumkin).

Keyin ilovamizning birinchi skripti `init.js` da biz undan `config` ni import qilamiz va `config.user` ni o‘rnatamiz:

```js
// 📁 init.js
import {config} from './admin.js';
config.user = "Pete";
```

...Endi `admin.js` moduli sozlandi.

Boshqa importchilar unga qo'ng'iroq qilishlari mumkin va u joriy foydalanuvchini to'g'ri ko'rsatadi:

```js
// 📁 another.js
import {sayHi} from './admin.js';

sayHi(); // Xizmat qilishga tayyor, *!*Pete*/!*!
```


### import.meta

`import.meta` obyekti joriy modul haqidagi ma'lumotlarni o'z ichiga oladi.

Uning mazmuni atrof-muhitga bog'liq. Brauzerda u skriptning URL manzilini yoki HTML ichida bo'lsa joriy veb-sahifa URL manzilini o'z ichiga oladi:

```html run height=0
<script type="module">
  alert(import.meta.url); // URL skripti
  // ichki skript uchun - joriy HTML-sahifaning URL manzili
</script>
```

### Modulda "this" aniqlanmagan

Bu kichik xususiyat, ammo to'liqlik uchun biz buni eslatib o'tishimiz kerak.

Modulda yuqori darajadagi `this` aniqlanmagan.

Uni modul bo'lmagan skriptlar bilan solishtiring, bu yerda `this` global obyekt:

```html run height=0
<script>
  alert(this); // deraza
</script>

<script type="module">
  alert(this); // aniqlanmagan
</script>
```

## Brauzerga xos xususiyatlar

Bundan tashqari, `type="module"`li skriptlarning oddiy skriptlarga nisbatan brauzerga xos bir qancha farqlari mavjud.

Agar siz birinchi marta o'qiyotgan bo'lsangiz yoki brauzerda JavaScript dan foydalanmasangiz, hozircha ushbu bo'limni o'tkazib yuborishingiz mumkin.

### Modul skriptlari defer qilinadi, ya'ni kechiktiriladi

Modul skriptlari tashqi va inline skriptlar uchun *har doim* kechiktiriladi, `defer` atribyuti ([](info:script-async-defer) bobida tavsiflangan) bilan bir xil ta`sir qiladi.

Boshqacha qilib aytganda:
- tashqi modul skriptlarini yuklab olish `<script type="module" src="...">` HTML ishlovini bloklamaydi, ular boshqa resurslar bilan parallel ravishda yuklanadi.
- modul skriptlari HTML hujjati to'liq tayyor bo'lguncha kutadi (hatto ular kichik bo'lsa ham va HTMLdan tezroq yuklanadi) va keyin ishga tushadi.
- skriptlarning nisbiy tartibi saqlanadi: hujjatda birinchi bo'lgan skriptlar birinchi bo'lib bajariladi.

Yon ta'sir sifatida modul skriptlari har doim to'liq yuklangan HTML sahifani, shu jumladan ularning ostidagi HTML elementlarini `ko'radi`.

Masalan:

```html run
<script type="module">
*!*
  alert(typeof button); // obyekt: skript quyidagi tugmani "ko'rishi" mumkin
*/!*
  // modullar kechiktirilganda, skript butun sahifa yuklangandan keyin ishlaydi
</script>

Quyidagi oddiy skript bilan solishtiring:

<script>
*!*
  alert(typeof button); // button aniqlanmagan, skript quyidagi elementlarni ko'ra olmaydi
*/!*
  // muntazam skriptlar sahifaning qolgan qismi qayta ishlanishidan oldin darhol ishlaydi
</script>

<button id="button">Button</button>
```

Iltimos, diqqat qiling: ikkinchi skript aslida birinchisidan oldin ishlaydi! Shunday qilib, biz avval `aniqlanmagan`, keyin esa `obyekt` ni ko'ramiz.

Buning sababi, modullar kechiktirilgan, shuning uchun biz hujjatning qayta ishlanishini kutamiz. Oddiy skript darhol ishlaydi, shuning uchun biz birinchi navbatda uning chiqishini ko'ramiz.

Modullardan foydalanganda biz shuni bilishimiz kerakki, HTML sahifa yuklanganda paydo bo'ladi va JavaScript modullari undan keyin ishlaydi, shuning uchun foydalanuvchi JavaScript ilovasi tayyor bo'lgunga qadar sahifani ko'rishi, ammo ayrim funksiyalar hali ishlamasligi mumkin. Biz "yuklash ko'rsatkichlari"ni qo'yishimiz kerak, aks holda tashrif buyuruvchi bu bilan chalkashmasligiga ishonch hosil qilishimiz lozim.

### Asinxron ichki skriptlarda ishlaydi

Modul bo'lmagan skriptlar uchun `async` atribyuti faqat tashqi skriptlarda ishlaydi. Async skriptlar tayyor bo'lganda, boshqa skriptlar yoki HTML hujjatidan mustaqil ravishda darhol ishlaydi.

Modul skriptlari uchun u ichki skriptlarda ham ishlaydi.

Misol uchun, quyida joylashgan ichki skriptda `async` mavjud, shuning uchun u hech narsani kutmaydi.

U importni amalga oshiradi (`./analytics.js`ni oladi) va tayyor bo'lganda ishlaydi, hatto HTML hujjati hali tugamagan bo'lsa yoki boshqa skriptlar hali kutilayotgan bo'lsa ham.

Bu hisoblagichlar, reklamalar, hujjat darajasidagi voqealar tinglovchilari kabi hech narsaga bog'liq bo'lmagan funksionallik uchun yaxshi.

```html
<!-- barcha bog'liqliklar olinadi (analytics.js) va skript ishlaydi-->
<!-- hujjat yoki boshqa <script> teglarini kutmaydi -->
<script *!*async*/!* type="module">
  import {counter} from './analytics.js';

  counter.count();
</script>
```

### tashqi skriptlar

`type="module"`ga ega tashqi skriptlar ikki jihatdan farqlanadi:

1. Xuddi shu `src` bilan tashqi skriptlar faqat bir marta ishlaydi:
    ```html
    <!-- my.js skripti faqat bir marta olinadi va bajariladi-->
    <script type="module" src="my.js"></script>
    <script type="module" src="my.js"></script>
    ```

2. Boshqa manbadan (masalan, boshqa saytdan) olingan tashqi skriptlar <info:fetch-crossorigin> bobida tavsiflanganidek [CORS](mdn:Web/HTTP/CORS) sarlavhalarini talab qiladi. Boshqacha qilib aytadigan bo'lsak, modul skripti boshqa manbadan olingan bo'lsa, masofaviy server olib kirishga ruxsat beruvchi `Access-Control-Allow-Origin` sarlavhasini taqdim etishi kerak.
    ```html
    <!-- another-site.com yetkazib berishi kerak
    Access-Control-Allow-Origin -->
    <!-- yo'qsa, skript bajarilmaydi -->
    <script type="module" src="*!*http://another-site.com/their.js*/!*"></script>
    ```

    Bu sukut bo'yicha yaxshiroq xavfsizlikni ta'minlaydi.

### "Bare" modullarga ruxsat berilmaydi

Brauzerda `import` nisbiy yoki mutlaq URL manzilini olishi kerak. Hech qanday yo'lsiz modullar `bare` modullar deb ataladi. Bunday modullarga `import` da ruxsat berilmaydi.

Masalan, ushbu `import` yaroqsiz hisoblanadi:
```js
import {sayHi} from 'sayHi'; // Error, "bare" modul
// modulda yo'l bo'lishi kerak, masalan. './sayHi.js' yoki modul qayerda bo'lishidan qat'iy nazar
```

Node.js yoki bundle vositalari kabi ba'zi muhitlar hech qanday yo'lsiz bare modullarga ruxsat beradi, chunki ular modullarni va ularni nozik sozlash uchun ilgaklarni topishning o'z usullariga ega. Ammo brauzerlar hali bare modullarni qo'llab-quvvatlamaydi.

### Moslik, "nomodule"

Eski brauzerlar `type="module"` ni tushunmaydilar. Noma'lum turdagi skriptlar e'tiborga olinmaydi. Ular uchun `nomodule` atribyutidan foydalanib, zaxirani ta'minlash mumkin:

```html run
<script type="module">
  alert("Zamonaviy brauzerlarda ishlaydi");
</script>

<script nomodule>
  alert("Zamonaviy brauzerlar ham type=module, ham nomodulni bilishadi, shuning uchun buni o'tkazib yuboring")
  alert("Eski brauzerlar noma'lum type=modulli skriptni e'tiborsiz qoldiradilar, lekin buni amalga oshiradilar.");
</script>
```

## Build tools

Haqiqiy hayotda brauzer modullari kamdan-kam hollarda "xom" shaklida qo'llaniladi. Odatda, biz ularni [Webpack](https://webpack.js.org/) kabi maxsus vosita bilan birlashtiramiz va ishlab chiqarish serveriga joylashtiramiz.

Bundlerlardan foydalanishning afzalliklaridan biri -- ular modullarni qanday hal qilish bo'yicha ko'proq nazoratni ta'minlaydi, bare modullarga imkon beradi va CSS/HTML modullari kabi boshqa ko'p narsalarni beradi.

Qurilish asboblari quyidagilarni bajaradi:

1. HTML-dagi `<script type="module">` ichiga qo'yish uchun mo'ljallangan "asosiy" modulni oling.
2. Uning bog'liqligini tahlil qiling: import, keyin yana import va boshqalar.
3. Barcha modullar (yoki sozlanishi mumkin boʻlgan bir nechta fayl) bilan bitta fayl yarating, mahalliy `import` qoʻngʻiroqlarini bundler funksiyalari bilan almashtiring, shunda u ishlaydi. HTML/CSS modullari kabi "maxsus" modul turlari ham qo'llab-quvvatlanadi.
4. Jarayonda boshqa o'zgarishlar va optimallashtirishlar qo'llanilishi mumkin:
    - Olib bo'lmaydigan kod olib tashlandi.
    - foydalanilmagan eksport olib tashlandi ("tree-shaking").
    - `Konsol` va `debugger` kabi ishlab chiqishga oid bayonotlar olib tashlandi.
    - Zamonaviy JavaScript sintaksisi [Babel](https://babeljs.io/) yordamida o'xshash funksiyaga ega eskisiga o'zgartirilishi mumkin.
    - Olingan fayl kichiklashtiriladi (bo'shliqlar olib tashlanadi, o'zgaruvchilar qisqaroq nomlar bilan almashtiriladi va hokazo).

Agar biz to'plam vositalaridan foydalansak, skriptlar bitta faylga (yoki bir nechta faylga) yig'ilganligi sababli, ushbu skriptlar ichidagi `import/eksport` iboralari maxsus bundler funksiyalari bilan almashtiriladi. Shunday qilib, hosil bo'lgan "bundled" skripti hech qanday `import/eksport` ni o'z ichiga olmaydi, u `type="module` ni talab qilmaydi va biz uni oddiy skriptga qo'yishimiz mumkin:

```html
<!-- Webpack kabi vositadan bundle.js ni oldik -->
<script src="bundle.js"></script>
```

Ya'ni, mahalliy modullardan ham foydalanish mumkin. Shunday qilib, biz bu yerda Webpack dan foydalanmaymiz: uni keyinroq sozlashingiz mumkin.

## Xulosa

Xulosa qiladigan bo'lsak, asosiy tushunchalar quyidagicha:

1. Modul - bu fayl. `Import/eksport` ishlashi uchun brauzerlarga `<script type="module">` kerak. Modullar bir nechta farqlarga ega:
    - Sukut bo'yicha kechiktirilgan.
     - Asinxron ichki skriptlarda ishlaydi.
     - Tashqi skriptlarni boshqa manbadan (domen/protokol/port) yuklash uchun CORS sarlavhalari kerak.
     - Ikki nusxadagi tashqi skriptlar e'tiborga olinmaydi.
2. Modullar o'zlarining mahalliy yuqori darajadagi qamroviga ega va `import/eksport` orqali almashinish funksiyalariga ega.
3. Modullar har doim `qat'iy foydalanadi`.
4. Modul kodi faqat bir marta bajariladi. Eksport bir marta yaratiladi va importchilar o'rtasida taqsimlanadi.

Modullardan foydalanganda har bir modul funksionallikni amalga oshiradi va uni eksport qiladi. Keyin uni kerakli joyga to'g'ridan-to'g'ri import qilish uchun `import` dan foydalanamiz. Brauzer skriptlarni avtomatik ravishda yuklaydi va baholaydi.

Ishlab chiqarishda odamlar ko'pincha ishlash va boshqa sabablarga ko'ra modullarni birlashtirish uchun [Webpack](https://webpack.js.org) kabi to'plamlardan foydalanadilar.

Keyingi bobda biz modullarning ko'proq misollarini va narsalarni qanday eksport qilish/import qilish mumkinligini ko'rib chiqamiz.
