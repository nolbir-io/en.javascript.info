libs:
  - 'https://cdn.jsdelivr.net/npm/idb@3.0.2/build/idb.min.js'

---

# IndexedDB

IndexedDB brauzerga o'rnatilgan ma'lumotlar bazasi bo'lib, `localStorage` dan ancha kuchliroqdir.

- Deyarli har qanday qiymatlarni kalitlar, bir nechta kalit turlari bo'yicha saqlaydi.
- Ishonchliligi uchun tranzaktsiyalarni qo'llab-quvvatlaydi.
- Asosiy diapazon so'rovlarini, indekslarni qo'llab-quvvatlaydi.
- `localStorage`ga qaraganda ancha katta hajmdagi ma'lumotlarni saqlashi mumkin.

An'anaviy mijoz-server ilovalari uchun bu quvvat odatda haddan tashqari ko'p. IndexedDB ServiceWorkers va boshqa texnologiyalar bilan birlashtirilgan oflayn ilovalar uchun mo'ljallangan.

<https://www.w3.org/TR/IndexedDB> spetsifikatsiyasida tasvirlangan IndexedDB ning mahalliy interfeysi voqealarga asoslangan.

Shuningdek, <https://github.com/jakearchibald/idb> kabi promisega asoslangan o'ram yordamida `async/await` dan foydalanishimiz mumkin. Bu juda qulay, lekin o'ram mukammal emas, u barcha holatlar uchun voqealar o'rnini bosa olmaydi. Shunday qilib, biz voqealardan boshlaymiz va keyin IndexedDb haqida tushunchaga ega bo'lganimizdan so'ng, biz o'ramdan foydalanamiz.

```smart header="Ma'lumotlar qayerda?"
Texnik jihatdan ma'lumotlar odatda tashrif buyuruvchining uy katalogida brauzer sozlamalari, kengaytmalar va boshqalar bilan birga saqlanadi.

Turli xil brauzerlar va OS darajasidagi foydalanuvchilarning har biri o'zining mustaqil xotirasiga ega.
```

## Ma'lumotlar bazasini ochish

IndexedDB bilan ishlashni boshlash uchun biz avval ma'lumotlar bazasini `open` ochishimiz va ularga ulanishimiz kerak.

Sintaksis:

```js
let openRequest = indexedDB.open(name, version);
```

- `name` -- satr, ma`lumotlar bazasi nomi.
- `version` -- musbat butun son versiyasi, sukut bo'yicha `1` (quyida tushuntirilgan).

Bizda turli nomlarga ega ko'plab ma'lumotlar bazalari bo'lishi mumkin, ammo ularning barchasi joriy kelib chiqishi (domen/protokol/port) ichida mavjud. Turli veb-saytlar bir-birining ma'lumotlar bazalariga kira olmaydi.

Qo'ng'iroq `openRequest` obyektini qaytaradi, biz undagi voqealarni tinglashimiz kerak:
- `success`: ma'lumotlar bazasi tayyor, `openRequest.result` da "ma'lumotlar bazasi obyekti" mavjud, biz undan keyingi qo'ng'iroqlar uchun foydalanishimiz kerak.
- `error`: ochilmadi.
- `upgradeneeded`: ma'lumotlar bazasi tayyor, lekin uning versiyasi eskirgan (pastga qarang).

**IndexedDB server tomonidagi ma'lumotlar bazalarida mavjud bo'lmagan "sxema versiyalarini yaratish" o'rnatilgan mexanizmiga ega.**

Server tomonidagi ma'lumotlar bazalaridan farqli o'laroq, IndexedDB mijoz tomoni bo'lib, ma'lumotlar brauzerda saqlanadi, shuning uchun biz, dasturchilar, unga to'liq vaqtli kirish imkoniga ega emasmiz. Shunday qilib, biz ilovamizning yangi versiyasini nashr qilganimizda va foydalanuvchi bizning veb-sahifamizga tashrif buyurganida, ma'lumotlar bazasini yangilashimiz kerak bo'lishi mumkin.

Agar mahalliy ma'lumotlar bazasi versiyasi `open` da ko'rsatilganidan kamroq bo'lsa, `upgradeneeded` maxsus hodisasi ishga tushiriladi va biz versiyalarni solishtirishimiz va kerak bo'lganda ma'lumotlar tuzilmalarini yangilashimiz mumkin.

`Upgradeneeded` hodisasi ma'lumotlar bazasi hali mavjud bo'lmaganda ham ishga tushadi (texnik jihatdan uning versiyasi `0`), shuning uchun biz ishga tushirishni amalga oshirishimiz mumkin.

Aytaylik, biz ilovamizning birinchi versiyasini nashr qildik.

Keyin biz ma'lumotlar bazasini `1` versiyasi bilan ochishimiz va ishga tushirishni `upgradeneeded` ishlov beruvchida quyidagicha bajarishimiz mumkin:

```js
let openRequest = indexedDB.open("store", *!*1*/!*);

openRequest.onupgradeneeded = function() {
  // agar mijozda ma'lumotlar bazasi bo'lmasa, ishga tushiriladi
   // ... ishga tushirishni amalga oshiring...
};

openRequest.onerror = function() {
  console.error("Error", openRequest.error);
};

openRequest.onsuccess = function() {
  let db = openRequest.result;
  // db obyekti yordamida ma'lumotlar bazasi bilan ishlashni davom ettiring
};
```

Keyin, keyinroq, biz 2-versiyasini nashr etamiz.

Biz uni `2` versiyasi bilan ochishimiz va yangilashni quyidagicha amalga oshirishimiz mumkin:

```js
let openRequest = indexedDB.open("store", *!*2*/!*);

openRequest.onupgradeneeded = function(event) {
  // mavjud ma'lumotlar bazasi versiyasi 2 dan kam (yoki u mavjud emas)
  let db = openRequest.result;
  switch(event.oldVersion) { // mavjud db versiyasi
    case 0:
     // 0 versiyasi mijozda ma'lumotlar bazasi yo'qligini anglatadi
    // ishga tushirishni amalga oshiring
    case 1:
      // mijozning 1-versiyasi bor edi
       // yangilash
  }
};
```

Iltimos, diqqat qiling: joriy versiyamiz `2` bo'lgani uchun `onupgradeneeded` ishlov beruvchisi `0` versiyasi uchun kod bo'limiga ega bo'lib, u birinchi marta kirayotgan va ma'lumotlar bazasiga ega bo'lmagan foydalanuvchilar uchun, shuningdek `1` versiyasi uchun yangilash maqsadida mos keladi.

Shundan so'ng, agar `onupgradeneeded` ishlov beruvchisi xatosiz tugasa, `openRequest.onsuccess` ishga tushadi va ma'lumotlar bazasi muvaffaqiyatli ochilgan hisoblanadi.

Ma'lumotlar bazasini o'chirish uchun:

```js
let deleteRequest = indexedDB.deleteDatabase(name)
// deleteRequest.onsuccess/onerror natijani kuzatib boradi
```

```warn header="Biz eski ochiq qo'ng'iroq versiyasidan foydalanib ma'lumotlar bazasini ocha olmaymiz"
Agar joriy foydalanuvchi ma'lumotlar bazasi `open` qo'ng'iroqqa qaraganda yuqoriroq versiyaga ega bo'lsa, masalan, mavjud ma'lumotlar bazasi versiyasi `3` bo'lib, biz ochishga `open (...2)` harakat qilamiz, keyin bu xato `openRequest.onerror` ishga tushiriladi.

Bu kamdan-kam uchraydi, lekin tashrif buyuruvchi eskirgan JavaScript kodini yuklaganida sodir bo'lishi mumkin, masalan, proksi keshdan. Shunday qilib, kod eski, lekin uning ma'lumotlar bazasi yangi.

Xatolardan himoyalanish uchun `db.version` ni tekshirib, sahifani qayta yuklashni taklif qilishimiz kerak. Hech qachon bunday muammolarga duch kelmaslik uchun eski kodni yuklamaslik uchun to'g'ri HTTP keshlash sarlavhalaridan foydalaning.
```

### Parallel yangilash muammosi

Versiyalash haqida gapirar ekanmiz, keling, kichik bir muammoni hal qilaylik.

Aytaylik:
1. Mehmon saytimizni brauzer yorlig'ida ochdi, ma'lumotlar bazasi versiyasi `1`.
2. Keyin biz yangilanishni chiqardik, shuning uchun bizning kodimiz yangiroq.
3. Va keyin o'sha mehmon bizning saytimizni boshqa yorliqda ochadi.

Shunday qilib, ma'lumotlar bazasining `1` versiyasiga ochiq ulanishga ega bo'lgan yorliq mavjud, ikkinchisi esa `upgradeneeded` ishlov beruvchisida uni `2` versiyasiga yangilashga harakat qiladi.

Muammo shundaki, ma'lumotlar bazasi ikkita yorliq o'rtasida taqsimlanadi, chunki u bir xil sayt, bir xil kelib chiqishga ega. Va bu ikkala versiya `1` va `2` bo'lishi mumkin emas. `2` versiyasiga yangilashni amalga oshirish uchun 1-versiyaga barcha ulanishlar, shu jumladan, birinchi yorliqdagi ulanishlar yopilishi kerak.

Buni tashkil qilish uchun `versionchange` hodisasi "eskirgan" ma'lumotlar bazasi obyektida ishga tushadi. Biz buni tinglashimiz va eski ma'lumotlar bazasi ulanishini yopishimiz kerak (va ehtimol yangilangan kodni yuklash uchun sahifani qayta yuklashni taklif qilamiz).

Agar biz `versionchange` hodisasini tinglamasak va eski ulanishni yopmasak, ikkinchi, yangi ulanish amalga oshirilmaydi. `OpenRequest` obyekti `success` o'rniga `blocked` hodisasini chiqaradi. Shunday qilib, ikkinchi yorliq ishlamaydi.

Quyida parallel yangilashni to'g'ri boshqarish uchun kod berilgan. U `onversionchange` ishlov beruvchisini o'rnatadi, agar joriy ma'lumotlar bazasi ulanishi eskirgan bo'lsa (db versiyasi boshqa joyda yangilangan) ishga tushadi va ulanishni yopadi.

```js
let openRequest = indexedDB.open("store", 2);

openRequest.onupgradeneeded = ...;
openRequest.onerror = ...;

openRequest.onsuccess = function() {
  let db = openRequest.result;

  *!*
  db.onversionchange = function() {
    db.close();
    alert("Ma'lumotlar bazasi eskirgan, sahifani qayta yuklang.")
  };
  */!*

  // ...db tayyor, undan foydalanishingiz mumkin...
};

*!*
openRequest.onblocked = function() {
  // Agar biz onversionchange ni to'g'ri bajarsak, bu hodisa ishga tushmasligi kerak

  // bu xuddi shu ma'lumotlar bazasiga boshqa ochiq ulanish mavjudligini bildiradi
   // va db.onversionchange ishga tushirilgandan keyin u yopilmadi
};
*/!*
```

...Boshqacha qilib aytganda, bu yerda biz ikkita narsani qilamiz:

1. `db.onversionchange` tinglovchisi ma'lumotlar bazasining joriy versiyasi eskirgan bo'lsa, parallel yangilash urinishi haqida bizga xabar beradi.
2. `openRequest.onblocked` tinglovchisi bizga qarama-qarshi vaziyat haqida xabar beradi: boshqa joyda eskirgan versiyaga ulanish mavjud va u yopilmaydi, shuning uchun yangi ulanishni amalga oshirib bo'lmaydi.

Biz `db.onversionchange` da ishlarni yanada chiroyliroq hal qilishimiz va ulanish yopilishidan oldin tashrif buyuruvchidan ma'lumotlarni saqlashni taklif qilishimiz mumkin.

Yoki `db.onversionchange` da ma'lumotlar bazasini yopmaslik, balki tashrif buyuruvchini ogohlantirish uchun `onblocked` ishlov beruvchisidan (yangi tabda) foydalanish, unga yangiroq versiyani yuklash mumkin emasligini ayting, ular boshqa yorliqlarni yopadilar.

Ushbu yangilanishlar to'qnashuvi kamdan-kam hollarda sodir bo'ladi, lekin bizning skriptimiz jim bo'lib ketishining oldini olish uchun hech bo'lmaganda `onblocked` ishlov beruvchisiga ega bo'lishimiz kerak.

## Obyektlar do'koni

IndexedDBda biror narsani saqlash uchun bizga *obyektlar do'koni* kerak.

Obyektlar do'koni IndexedDB ning asosiy tushunchasidir. Boshqa ma'lumotlar bazalaridagi o'xshashlar "jadvallar" yoki "to'plamlar" deb ataladi. Bu ma'lumotlar saqlanadigan joy. Ma'lumotlar bazasida bir nechta do'kon bo'lishi mumkin: biri foydalanuvchilar uchun, ikkinchisi tovarlar uchun va hokazo.

"Obyekt do'koni" deb nomlanishiga qaramay, primitivlar ham saqlanishi mumkin.

**Biz deyarli har qanday qiymatni, shu jumladan murakkab obyektlarni saqlashimiz mumkin.**

IndexedDB obyektni klonlash va saqlash uchun [standart serializatsiya algoritmidan](https://www.w3.org/TR/html53/infrastructure.html#section-structuredserializeforstorage) foydalanadi. Bu `JSON.stringify`ga o'xshaydi, lekin kuchliroq, ko'proq ma'lumotlar turlarini saqlashga qodir.

Saqlab bo'lmaydigan obyektga misol: dumaloq havolalarga ega obyektdir. Bunday obyektlarni ketma-ket qilib bo'lmaydi. `JSON.stringify` ham bunday obyektlar uchun bajarilmaydi.

**Do'kondagi har bir qiymat uchun noyob `key` bo'lishi kerak.**

Kalit shu turlardan biri bo'lishi kerak - raqam, sana, qator, ikkilik yoki massiv. Bu noyob identifikator hisoblanib, biz kalit orqali qiymatlarni qidirishimiz/o'chirishimiz/yangilashimiz mumkin.

![](indexeddb-structure.svg)

Tez orada ko'rib turganimizdek, biz do'konga `localStorage` ga o'xshash qiymat qo'shganda kalitni taqdim qilishimiz mumkin. Ammo biz obyektlarni saqlaganimizda, IndexedDB obyekt xususiyatini kalit sifatida sozlash imkonini beradi, bu esa ancha qulayroqdir. Yoki biz kalitlarni avtomatik yaratishimiz mumkin.

Lekin birinchi navbatda obyektlar do'konini yaratishimiz kerak.

Obyektlar do'konini yaratish sintaksisi:

```js
db.createObjectStore(name[, keyOptions]);
```

E'tibor bering, operatsiya sinxron, `await` shart emas.

- `name` do'kon nomi, masalan, kitoblar uchun `"books"`,
- `keyOptions` ikki xususiyatdan biriga ega ixtiyoriy obyekt:
   - `keyPath` -- IndexedDB kalit sifatida foydalanadigan obyekt xususiyatiga yo'l, masalan, `id`.
   - `autoIncrement` -- agar `true` bo'lsa, yangi saqlangan obyekt uchun kalit avtomatik ravishda doimiy ravishda oshib boruvchi raqam sifatida yaratiladi.

Agar biz `keyOptions` ni bermasak, keyinroq obyektni saqlashda kalitni aniq ko'rsatishimiz kerak bo'ladi.

Masalan, ushbu obyektlar do'koni kalit sifatida `id` xususiyatidan foydalanadi:

```js
db.createObjectStore('books', {keyPath: 'id'});
```

**Obyektlar do'konini faqat DB versiyasini yangilash vaqtida `upgradeneeded` ishlov beruvchida yaratish/o'zgartirish mumkin.**

Bu texnik cheklov. Ishlovchidan tashqarida biz ma'lumotlarni qo'shish/o'chirish/yangilash imkoniyatiga ega bo'lamiz, lekin obyektlar do'konlarini faqat versiyani yangilash vaqtida yaratish/o'chirish/o'zgartirishi mumkin.

Ma'lumotlar bazasi versiyasini yangilash uchun ikkita asosiy yondashuv mavjud:

1. Biz har bir versiyani yangilash funksiyalarini amalga oshirishimiz mumkin: 1 dan 2 gacha, 2 dan 3 gacha, 3 dan 4 gacha va hokazo. Keyin `upgradeneeded` da biz versiyalarni (masalan, eski 2, hozir 4) solishtirishimiz va har bir versiyani ishga tushirishimiz mumkin. Har bir oraliq versiya uchun bosqichma-bosqich yangilanishlar mavjud (2 dan 3 gacha, keyin 3 dan 4 gacha).
2. Yoki biz shunchaki ma'lumotlar bazasini tekshirishimiz mumkin: `db.objectStoreNames` sifatida mavjud obyektlar do'konlari ro'yxatini oling. Bu obyekt [DOMStringList](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#domstringlist) bo'lib, mavjudligini tekshirish uchun `contains(name)` usulini taqdim etadi. Va keyin nima bor va nima yo'qligiga qarab yangilanishlarni amalga oshirishimiz mumkin.

Kichik ma'lumotlar bazalari uchun ikkinchi variant oddiyroq bo'lishi mumkin.

Mana ikkinchi yondashuvning namunasi:

```js
let openRequest = indexedDB.open("db", 2);

// versiya tekshiruvisiz ma'lumotlar bazasini yaratish/yangilash
openRequest.onupgradeneeded = function() {
  let db = openRequest.result;
  if (!db.objectStoreNames.contains('books')) { // "books" kitob do'koni mavjud bo'lmasa
    db.createObjectStore('books', {keyPath: 'id'}); // uni yarating
  }
};
```

Obyekt do'konini o'chirish:

```js
db.deleteObjectStore('books')
```

## Tranzaktsiyalar

"Tranzaksiya" atamasi umumiy bo'lib, ko'plab ma'lumotlar bazalarida qo'llaniladi.

Tranzaktsiya - bu hammasi muvaffaqiyatli yoki barchasi muvaffaqiyatsiz bo'lishi kerak bo'lgan operatsiyalar guruhi.

Misol uchun, biror kishi biror narsa sotib olayotganda, bizga quyidagilar kerak:

1. Ularning hisobidan pulni olib tashlang.
2. Buyumni ularning inventariga qo'shing.

Agar biz 1-operatsiyani yakunlasak, juda yomon bo'lardi, keyin esa biror narsa noto'g'ri bo'ladi, masalan, chiroq o'chadi va biz 2-ni bajara olmaymiz. Ikkalasi ham muvaffaqiyatli bo'lishi kerak (sotib olish to'liq, yaxshi!) yoki ikkalasi ham muvaffaqiyatsiz bo'lishi kerak (hech bo'lmaganda odam pulini saqlab qolgan, shuning uchun ular qayta urinib ko'rishlari mumkin).

Tranzaktsiyalar buni kafolatlaydi.

**Barcha ma'lumotlar operatsiyalari IndexedDBdagi tranzaksiya doirasida amalga oshirilishi kerak.**

Tranzaksiyani boshlash uchun:

```js
db.transaction(store[, type]);
```

- `store` tranzaksiya kirishi uchun mo'ljallangan do'kon nomi, masalan, `"books"`. Agar biz bir nechta do'konlarga kirmoqchi bo'lsak, do'kon nomlari qatori bo'lishi mumkin.
- `type` - tranzaksiya turi, quyidagilardan biri:
   -`readonly` -- faqat o'qish mumkin, sukut bo'yicha.
   - `readwrite` -- faqat ma'lumotlarni o'qish va yozish mumkin, lekin obyektlar do'konlarini yaratish/o'chirish/o'zgartirish mumkin emas.

Bundan tashqari, `versionchange` tranzaksiya turi mavjud: bunday tranzaktsiyalar hamma narsani amalga oshirishi mumkin, lekin biz ularni qo'lda yarata olmaymiz. IndexedDB ma'lumotlar bazasini ochishda `upgradeneeded` ishlov beruvchisi uchun avtomatik ravishda `versionchange` tranzaktsiyasini yaratadi. Shuning uchun bu biz ma'lumotlar bazasi strukturasini yangilashimiz, obyektlar do'konlarini yaratish/o'chirishimiz mumkin bo'lgan yagona joy.

```smart header="Nima uchun har xil turdagi operatsiyalar mavjud?"
Ishlash tranzaktsiyalarni `readonly` va `readwrite` deb belgilashga sabab bo'ladi.

Ko'plab `readonly` tranzaksiyalari bir vaqtning o'zida bir do'konga kirishi mumkin, ammo `readwrite` tranzaksiyalari kirishi mumkin emas. `Readwrite` tranzaksiyasi do'konni yozish uchun "qulflaydi". Xuddi shu do'konga kirishdan oldin keyingi tranzaksiya avvalgisi tugashini kutishi kerak.
```

Tranzaktsiya tuzilgandan so'ng, biz do'konga quyidagi kabi element qo'shishimiz mumkin:

```js
let transaction = db.transaction("books", "readwrite"); // (1)

// uni ishlatish uchun obyekt do'konini oling
*!*
let books = transaction.objectStore("books"); // (2)
*/!*

let book = {
  id: 'js',
  price: 10,
  created: new Date()
};

*!*
let request = books.add(book); // (3)
*/!*

request.onsuccess = function() { // (4)
  console.log("Do'konga kitob qo'shildi", request.result);
};

request.onerror = function() {
  console.log("Error", request.error);
};
```

Asosan to'rtta qadam mavjud:

1. `(1)` da u kirishi kerak bo'lgan barcha do'konlarni eslatib, tranzaksiya yarating.
2. `(2)` da `transaction.objectStore(name)` yordamida do'kon obyektini oling.
3. `(3)` da `books.add(book)` obyektlar do'konida so'rovni bajaring.
4. ...So'rovning muvaffaqiyati/xatosi `(4)` bilan ishlang, agar kerak bo'lsa, boshqa so'rovlarni ham qilishimiz mumkin va hokazo.

Obyektlar do'konlari qiymatni saqlashning ikkita usulini qo'llab-quvvatlaydi:

- **put(value, [key])**
    Do'konga `value` qo'shing. `key` faqat obyektlar do'konida `keyPath` yoki `autoIncrement` opsiyasi bo'lmasa taqdim etiladi. Agar bir xil kalitga ega qiymat allaqachon mavjud bo'lsa, u almashtiriladi.

- **add(value, [key])**
    `put` bilan bir xil, lekin bir xil kalitga ega qiymat allaqachon mavjud bo'lsa, so'rov bajarilmaydi va `"ConstraintError"` nomi bilan xatolik hosil bo'ladi.

Ma'lumotlar bazasini ochishga o'xshab, biz so'rov yuborishimiz mumkin: `books.add(book)` va keyin `success/error` hodisalarini kutishimiz mumkin.

- `add` qo'shish uchun `request.result` yangi obyektning kalitidir.
- Xato `request.error` da (mavjud bo'lsa).

## Tranzaktsiyalarning avtomatik bajarilishi

Yuqoridagi misolda biz tranzaksiyani boshladik va `add` so'rovini qildik. Ammo yuqorida aytib o'tganimizdek, tranzaktsiyada bir nechta bog'langan so'rovlar bo'lishi mumkin, ularning barchasi muvaffaqiyatli yoki barchasi muvaffaqiyatsiz bo'lishi kerak. Boshqa so'rovlarsiz tranzaksiyani tugallangan deb qanday belgilaymiz?

Qisqa javob: biz buni qilmaymiz.

Spetsifikatsiyaning keyingi 3.0 versiyasida tranzaksiyani yakunlashning amaliy usuli bo'lishi mumkin, ammo u hozir 2.0 da yo'q.

**Barcha tranzaksiya so'rovlari tugagach va [microtasks queue](info:microtask-queue) bo'sh bo'lsa, u avtomatik ravishda amalga oshiriladi.**

Odatda, tranzaksiya uning barcha so'rovlari bajarilganda va joriy kod tugallanganda amalga oshiriladi deb tahmin qilishimiz mumkin.

Shunday qilib, yuqoridagi misolda tranzaktsiyani tugatish uchun maxsus qo'ng'iroq kerak emas.

Tranzaktsiyalarni avtomatik bajarish printsipi muhim salbiy ta'sirga ega. Biz tranzaksiya o'rtasida `fetch`, `setTimeout` kabi asinxron operatsiyani kirita olmaymiz. IndexedDB tranzaktsiyani bular bajarilguncha kutmaydi.

Quyidagi kodda `(*)` qatoridagi `request2` bajarilmaydi, chunki tranzaksiya allaqachon amalga oshirilgan va unda hech qanday so'rov amalga oshirilmaydi:

```js
let request1 = books.add(book);

request1.onsuccess = function() {
  fetch('/').then(response => {
*!*
    let request2 = books.add(anotherBook); // (*)
*/!*
    request2.onerror = function() {
      console.log(request2.error.name); // TransactionInactiveError
    };
  });
};
```

Buning sababi, `fetch` asinxron operatsiya, makrotopshiriqdir. Brauzer makrotopshiriqlarni bajarishni boshlashdan oldin tranzaksiyalar yopiladi.

IndexedDB spetsifikatsiyasi mualliflari tranzaktsiyalar qisqa muddatli bo'lishi kerak deb hisoblashadi. Ko'pincha ishlash sabablari uchun shunday.

Ta'kidlash joizki, `readwrite` tranzaksiyalari yozish uchun do'konlarni "qulflaydi". Shunday qilib, agar ilovaning bir qismi `books` obyektlari do'konida `readwrite` ni boshlagan bo'lsa, xuddi shunday qilishni xohlaydigan boshqa qismi kutishi kerak: yangi tranzaksiya birinchisi tugaguniga qadar kutib turadi. Agar tranzaktsiyalar uzoq davom etsa, bu g'alati kechikishlarga olib kelishi mumkin.

Xo'sh, nima qilish kerak?

Yuqoridagi misolda biz yangi so'rov `(*)` oldidan yangi `db.transaction` qilishimiz mumkin.

Agar biz operatsiyalarni bitta tranzaksiyada birlashtirmoqchi bo'lsak, IndexedDB tranzaksiyalari va "boshqa" asinxron narsalarni ajratib qo'yish yaxshiroq bo'ladi.

Birinchidan, `fetch` ni amalga oshiring, agar kerak bo'lsa, ma'lumotlarni tayyorlang, keyin tranzaksiya yarating va barcha ma'lumotlar bazasi so'rovlarini bajaring, shundan so'ng u ishlaydi.

Muvaffaqiyatli yakunlanish momentini aniqlash uchun biz `transaction.oncomplete` hodisasini tinglashimiz mumkin:

```js
let transaction = db.transaction("books", "readwrite");

// ...operatsiyalarni amalga oshiring...

transaction.oncomplete = function() {
  console.log("Tranzaktsiya tugallangan");
};
```

Faqat `complete` tranzaksiyaning butunligicha saqlanishini kafolatlaydi. Shaxsiy so'rovlar muvaffaqiyatli bo'lishi mumkin, lekin oxirgi yozish operatsiyasi noto'g'ri ketishi mumkin (masalan, I/O xatosi yoki biror narsa).

Tranzaktsiyani qo'lda bekor qilish uchun qo'ng'iroq qiling:

```js
transaction.abort();
```

Bu undagi so'rovlar tomonidan qilingan barcha o'zgarishlarni bekor qiladi va `transaction.onabort` hodisasini ishga tushiradi.

## Qayta ishlash xatosi

Yozish so'rovlari muvaffaqiyatsiz bo'lishi mumkin.

Buni nafaqat biz tomonda yuzaga kelishi mumkin bo'lgan xatolar, balki tranzaksiyaning o'zi bilan bog'liq bo'lmagan sabablarga ko'ra ham kutish kerak. Masalan, saqlash kvotasi oshib ketishi mumkin. Shuning uchun biz bunday vaziyatni hal qilishga tayyor bo'lishimiz kerak.

**Muvaffaqiyatsiz so'rov avtomatik ravishda tranzaksiyani va uning barcha o'zgarishlarini bekor qiladi.**

Ba'zi hollarda, mavjud o'zgarishlarni bekor qilmasdan, muvaffaqiyatsizlikni hal qilishni (masalan, boshqa so'rovni sinab ko'rish) va tranzaksiyani davom ettirishni xohlashimiz mumkin. `request.onerror` ishlov beruvchisi `event.preventDefault()` ga qo'ng'iroq qilish orqali tranzaksiyani bekor qilishning oldini oladi.

Quyidagi misolda yangi kitob mavjud bo'lgan bir xil kalit (`id`) bilan qo'shilgan. `store.add` usuli bu holda ``ConstraintError`` hosil qiladi. Biz buni tranzaksiyani bekor qilmasdan hal qilamiz:

```js
let transaction = db.transaction("books", "readwrite");

let book = { id: 'js', price: 10 };

let request = transaction.objectStore("books").add(book);

request.onerror = function(event) {
  // ConstraintError bir xil identifikatorga ega obyekt allaqachon mavjud bo'lganda yuzaga keladi
  if (request.error.name == "ConstraintError") {
    console.log("Book with such id already exists"); // xatoni hal qiling
    event.preventDefault(); // tranzaktsiyani bekor qilmang
    // kitob uchun boshqa kalitdan foydalanasizmi?
  } else {
    // kutilmagan xatolik, uni hal qila olmaysiz
     // tranzaksiya to'xtatiladi
  }
};

transaction.onabort = function() {
  console.log("Error", transaction.error);
};
```

### Event delegatsiyasi

Har bir so'rov uchun bizga onerror/onsuccess kerakmi? Har safar emas. Buning o'rniga biz event delegatsiyasidan foydalanishimiz mumkin.

**Indekslangan DB hodisalardagi bubble: `request` -> `transaction` -> `database`.**

Barcha voqealar qo'lga olish va ko'pikli DOM hodisalaridir, lekin odatda faqat ko'pikli bosqich ishlatiladi.

Shunday qilib, biz hisobot berish yoki boshqa maqsadlarda `db.onerror` ishlov beruvchisi yordamida barcha xatolarni aniqlashimiz mumkin:

```js
db.onerror = function(event) {
  let request = event.target; // xatoga sabab bo'lgan so'rov

  console.log("Error", request.error);
};
```

...Agar xatolik to'liq hal qilinsa nima bo'ladi? Biz bu haqda xabar bermoqchi emasmiz.

Biz `request.onerror` da `event.stopPropagation()` dan foydalanib, `db.onerror` ni to'xtatishimiz mumkin.

```js
request.onerror = function(event) {
  if (request.error.name == "ConstraintError") {
    console.log("Bunday identifikatorli kitob allaqachon mavjud"); // xatoni hal qiling
    event.preventDefault(); // tranzaksiyani bekor qilmang
    event.stopPropagation(); // xatolikka yo'l qo'ymang, uni "chaynang"
  } else {
     // hech narsa qilmang
     // tranzaksiya bekor qilinadi
     // biz transaction.onabort dagi xatoni bartaraf etishimiz mumkin 
  }
};
```

## Qidiruv

Obyektlar do'konida qidiruvning ikkita asosiy turi mavjud:

1. Asosiy qiymat yoki asosiy diapazon bo'yicha. Bizning "books" xotiramizda `book.id` qiymati yoki qiymatlar diapazoni bo'lishi mumkin.
2. Boshqa obyekt maydoni bo'yicha, masalan, `book.price`. Bu "index" deb nomlangan qo'shimcha ma'lumotlar tuzilmasini talab qildi.

### Kalit orqali

Avval qidiruvning birinchi turi bilan shug'ullanamiz: kalit bo'yicha.

Qidiruv usullari ham aniq kalit qiymatlarini, ham "qiymatlar diapazoni" deb ataladigan obyektlarni qo'llab-quvvatlaydi -- [IDBKeyRange](https://www.w3.org/TR/IndexedDB/#keyrange) ular qabul qilinadigan "key range" ni belgilaydi.

`IDBKeyRange` obyektlari quyidagi chaqiruvlar yordamida yaratiladi:

- `IDBKeyRange.lowerBound(pastki, [ochiq])` ma'nosi: `≥lower` (yoki `open` rost bo'lsa `>lower`)
- `IDBKeyRange.upperBound(yuqori, [ochiq])` ma'nosi: `≤upper` (yoki `ochiq` rost bo'lsa `<upper`)
- `IDBKeyRange.bound(pastki, yuqori, [lowerOpen], [upperOpen])` degani: `lower` va `upper` orasida. Agar ochiq bayroqlar rost bo'lsa, tegishli kalit diapazonga kiritilmaydi.
- `IDBKeyRange.only(key)` -- faqat bitta `key` dan iborat diapazon, kamdan-kam ishlatiladi.

Tez orada ulardan foydalanishning amaliy misollarini ko'rib chiqamiz.

Haqiqiy qidiruvni amalga oshirish uchun quyidagi usullar mavjud. Ular aniq kalit yoki asosiy diapazon bo'lishi mumkin bo'lgan `query` argumentini qabul qiladilar:

- `store.get(query)` -- kalit yoki diapazon bo'yicha birinchi qiymatni qidiring.
- `store.getAll([query], [count])` -- barcha qiymatlarni qidiring, agar berilgan bo'lsa, `count` bilan cheklang.
- `store.getKey(query)` -- so'rovni qanoatlantiradigan birinchi kalitni, odatda diapazonni qidiring.
- `store.getAllKeys([query], [count])` -- so'rovni qondiradigan barcha kalitlarni qidiring, odatda diapazon, agar berilgan bo'lsa, `count` gacha.
- `store.count([query])` -- so'rovni qondiradigan kalitlarning umumiy sonini, odatda diapazonni oling.

Masalan, do'konimizda juda ko'p kitoblar bor. Esda tutingki, `id` maydoni kalit hisoblanadi, shuning uchun bu usullarning barchasi `id` bo'yicha qidirishi mumkin.

So'rov namunalari:

```js
// bitta kitobni oling
books.get('js')

// 'css' <= id <= 'html' mavjud kitobni oling
books.getAll(IDBKeyRange.bound('css', 'html'))

// id < 'html' mavjud kitobni oling
books.getAll(IDBKeyRange.upperBound('html', true))

// hamma kitoblarni oling
books.getAll()

// id > 'js' bo'lgan hamma kalitlarni oling
books.getAllKeys(IDBKeyRange.lowerBound('js', true))
```

```smart header="Obyektlar do'koni har doim tartiblangan"
Obyektlar do'koni qiymatlarni ichki kalit bo'yicha tartiblaydi.

Shunday qilib, ko'p qiymatlarni qaytaradigan so'rovlar ularni har doim kalit tartibi bo'yicha tartiblangan holda qaytaradi.
```

### Indeks yordamida maydon bo'yicha

Boshqa obyekt maydonlari bo'yicha qidirish uchun biz "index" deb nomlangan qo'shimcha ma'lumotlar strukturasini yaratishimiz kerak.

Indeks - ma'lum bir obyekt maydonini kuzatib boradigan do'konga "qo'shimcha". Ushbu maydonning har bir qiymati uchun u ushbu qiymatga ega bo'lgan obyektlar uchun kalitlar ro'yxatini saqlaydi. Quyida batafsilroq rasm bo'ladi.

Sintaksis:

```js
objectStore.createIndex(name, keyPath, [options]);
```

- **`name`** -- indeks nomi,
- **`keyPath`** -- indeks kuzatishi kerak bo'lgan obyekt maydoniga yo'l (biz shu maydon bo'yicha qidiramiz),
- **`option`** -- xususiyatlariga ega ixtiyoriy obyekt:
  - **`unique`** -- agar rost bo'lsa, do'konda `keyPath` da berilgan qiymatga ega faqat bitta obyekt bo'lishi mumkin. Agar biz dublikat qo'shmoqchi bo'lsak, indeks xato hosil qilish orqali buni amalga oshiradi.
  - **`multiEntry`** -- faqat `keyPath` dagi qiymat massiv bo'lsa ishlatiladi. Bunday holda, sukut bo'yicha indeks butun massivni kalit sifatida ko'rib chiqadi. Ammo agar `multiEntry` rost bo'lsa, indeks ushbu massivdagi har bir qiymat uchun do'kon obyektlari ro'yxatini saqlaydi. Shunday qilib, massiv a'zolari indeks kalitlariga aylanadi.

Bizning misolimizda biz `id` tugmasi bo'lgan kitoblarni saqlaymiz.

Aytaylik, biz `price` bo'yicha qidirmoqchimiz.

Birinchidan, biz indeks yaratishimiz kerak. Bu xuddi obyektlar do'koni kabi `upgradeneeded` da bajarilishi kerak:

```js
openRequest.onupgradeneeded = function() {
  // biz bu yerda, versionchange tranzaksiyasida indeks yaratishimiz kerak
  let books = db.createObjectStore('books', {keyPath: 'id'});
*!*
  let index = books.createIndex('price_idx', 'price');
*/!*
};
```

- Indeks `price` maydonini kuzatib boradi.
- Narx noyob emas, bir xil narxdagi bir nechta kitoblar bo'lishi mumkin, shuning uchun biz `unique` variantni belgilamaymiz.
- Narx massiv emas, shuning uchun `multiEntry` belgisi qo'llanilmaydi.

Tasavvur qiling, bizdagi `inventory` da 4 ta kitob bor. Mana `index` nima ekanligini ko'rsatadigan rasm:

![](indexeddb-index.svg)

Aytganimizdek, `price` ning har bir qiymati uchun indeks (ikkinchi argument) ushbu narxga ega bo'lgan kalitlar ro'yxatini saqlaydi.

Indeks avtomatik ravishda yangilanib turadi, biz bu haqida qayg'urishimiz shart emas.

Endi, biz ma'lum bir narxni qidirmoqchi bo'lganimizda, indeksga xuddi shu qidiruv usullarini qo'llaymiz:

```js
let transaction = db.transaction("books"); // readonly
let books = transaction.objectStore("books");
let priceIndex = books.index("price_idx");

*!*
let request = priceIndex.getAll(10);
*/!*

request.onsuccess = function() {
  if (request.result !== undefined) {
    console.log("Books", request.result); // price = 10 bo'lgan kitoblar to'plami
  } else {
    console.log("No such books");
  }
};
```

Biz diapazonlarni yaratish va arzon/qimmat kitoblarni qidirish uchun `IDBKeyRange` dan ham foydalanishimiz mumkin:

```js
// price <= 5 bo'lgan kitoblarni toping
let request = priceIndex.getAll(IDBKeyRange.upperBound(5));
```

Indekslar kuzatilayotgan obyekt maydoni bo'yicha ichki tartiblangan, bizning holatlarimizda `price` hisoblanadi. Shunday qilib, biz qidiruvni amalga oshirganimizda, natijalar `price` bo'yicha ham tartiblanadi.

## Do'kondan o'chirish

`delete` usuli so'rov orqali o'chirish uchun qiymatlarni qidiradi, qo'ng'iroq formati `getAll` ga o'xshaydi:

- **`delete(query)`** -- so'rov orqali mos qiymatlarni o'chirish.

Masalan:

```js
// kitobni id = 'js' bilan o'chirib tashlang
books.delete('js');
```

Agar biz kitoblarni narx yoki boshqa obyekt maydoniga asoslangan holda o'chirmoqchi bo'lsak, avval indeksdagi kalitni topib, keyin `delete` ni chaqirishimiz kerak:

```js
// price = 5 bo'lgan kalitni toping
let request = priceIndex.getKey(5);

request.onsuccess = function() {
  let id = request.result;
  let deleteRequest = books.delete(id);
};
```

To delete everything:

```js
books.clear(); // saqlash joyini tozalang.
```

## Kursorlar

`getAll/getAllKeys` kabi usullar kalitlar/qiymatlar qatorini qaytaradi.

Ammo obyekt xotirasi mavjud xotiradan kattaroq bo'lishi mumkin. Keyin `getAll` barcha yozuvlarni massiv sifatida ololmaydi.

Nima qilsa bo'ladi?

Kursorlar bu muammoni hal qilish uchun vositalarni taqdim etadi.

**Cursor* - bu so'rov berilgan obyekt xotirasini aylanib o'tuvchi va bir vaqtning o'zida bitta kalit/qiymatni qaytaruvchi, shu bilan xotirani tejaydigan maxsus obyekt.**

Obyektlar do'koni kalit bo'yicha ichki tartiblanganligi sababli, kursor do'kon bo'ylab kalitlar tartibida yuradi (sukut bo'yicha o'sish).

Sintaksis:

```js
// getAll kabi, lekin kursor bilan:
let request = store.openCursor(query, [direction]);

// qiymatlarni emas, balki kalitlarni olish uchun (masalan, getAllKeys): store.openKeyCursor
```

- **`query`** bu `getAll` kabi kalit yoki kalit diapazonidir.
- **`direction`** ixtiyoriy argument bo'lib, undan foydalanish tartibi:
   - `"next"` -- sukut bo'yicha, kursor eng past tugma bilan yozuvdan yuqoriga chiqadi.
   - `"prev"` -- teskari tartib: eng katta kalitli yozuvdan pastga.
   - `"nextunique"`, `"prevunique"` -- yuqoridagi kabi, lekin bir xil kalit bilan yozuvlarni o'tkazib yuboring (faqat indekslar ustidagi kursorlar uchun, masalan, narxi=5 bo'lgan bir nechta kitoblar uchun faqat birinchisi qaytariladi).

**Kursorning asosiy farqi shundaki, `request.onsuccess` bir necha marta ishga tushadi: har bir natija uchun bir marta.**

Kursordan qanday foydalanishga misol:

```js
let transaction = db.transaction("books");
let books = transaction.objectStore("books");

let request = books.openCursor();

// kursor tomonidan topilgan har bir kitob uchun chaqirilgan
request.onsuccess = function() {
  let cursor = request.result;
  if (cursor) {
    let key = cursor.key; // book key (id field)
    let value = cursor.value; // book obyekti
    console.log(key, value);
    cursor.continue();
  } else {
    console.log("Boshqa kitoblar yo'q");
  }
};
```

Kursorning asosiy usullari quyidagilardir:

- `advance(count)` -- kursorni `count` marta oldinga siljiting, qiymatlarni o'tkazib yuboring.
- `continue([key])` -- kursorni diapazonga mos keladigan keyingi qiymatga o'tkazing (yoki agar berilgan bo'lsa, darhol `key` dan so'ng).

Kursorga mos keladigan qiymatlar ko'proq bo'ladimi yoki yo'qmi -- `onsuccess` deb chaqiriladi va `result` biz kursorni keyingi yozuvga yoki `undefined` ga ko'rsatishimiz mumkin.

Yuqoridagi misolda kursor obyektlarni saqlash uchun yaratilgan.

Ammo biz indeks ustiga kursor yasashimiz ham mumkin. Esda tutganimizdek, indekslar obyekt maydoni bo'yicha qidirish imkonini beradi. Indekslar ustidagi kursorlar obyektlarni saqlash joylari bilan bir xil ishlaydi - ular bir vaqtning o'zida bitta qiymatni qaytarish orqali xotirani tejashadi.

Indekslar ustidagi kursorlar uchun `cursor.key` indeks kaliti (masalan, narx) va biz obyekt kaliti uchun `cursor.primaryKey` xususiyatidan foydalanishimiz kerak:

```js
let request = priceIdx.openCursor(IDBKeyRange.upperBound(5));

// har bir yozuv uchun chaqirilgan
request.onsuccess = function() {
  let cursor = request.result;
  if (cursor) {
    let primaryKey = cursor.primaryKey; // keyingi obyekt do'kon kaliti (id maydoni)
    let value = cursor.value; // keyingi obyektni saqlash obyekti (kitob obyekti)
    let key = cursor.key; // keyingi indeks kaliti (narx)
    console.log(key, value);
    cursor.continue();
  } else {
    console.log("Boshqa kitoblar yo'q");
  }
};
```

## Promise o'rami

Har bir so'rovga `onsuccess/onerror` qo'shish juda mashaqqatli vazifadir. Ba'zan biz voqea delegatsiyasidan foydalanib, hayotimizni osonlashtira olamiz, masalan, butun tranzaktsiyalar bo'yicha ishlov beruvchilarni o'rnating, lekin `async/await` ancha qulayroq.

Keling, ushbu bobda <https://github.com/jakearchibald/idb> nozik va'dali qog'ozdan foydalanamiz. U [promisified](info:promisify) IndexedDB usullari bilan global `idb` obyektini yaratadi.

Keyin, `onsuccess/onerror` o'rniga biz shunday yozishimiz mumkin:

```js
let db = await idb.openDB('store', 1, db => {
  if (db.oldVersion == 0) {
    // ishga tushirishni amalga oshiring
    db.createObjectStore('books', {keyPath: 'id'});
  }
});

let transaction = db.transaction('books', 'readwrite');
let books = transaction.objectStore('books');

try {
  await books.add(...);
  await books.add(...);

  await transaction.complete;

  console.log('jsbook saved');
} catch(err) {
  console.log('error', err.message);
}
```

Shunday qilib, bizda barcha shirin "oddiy async kod" va "try..catch" narsalar mavjud.

### Xatolikni tuzating

Agar biz xatoni sezmasak, u eng yaqin tashqi `try..catch` tugmasigacha tushib ketadi.

Tugallanmagan xato `window` obyektida "ishlab chiqilmagan va'dani rad etish" hodisasiga aylanadi.

Biz bunday xatolar bilan shug'ullanishimiz mumkin:

```js
window.addEventListener('unhandledrejection', event => {
  let request = event.target; // IndexedDB mahalliy so'rov obyekti
  let error = event.reason; //  Ishlanmagan xato obyekti, xuddi request.error
  ...report about the error...
});
```

### "Faol bo'lmagan tranzaksiya" tuzog'i

Biz allaqachon bilganimizdek, tranzaksiya brauzer joriy kod va mikrovazifalar bilan bajarilishi bilanoq avtomatik ravishda amalga oshiriladi. Shunday qilib, agar biz tranzaksiya o'rtasiga `fetch` kabi *makrotask* qo'ysak, tranzaksiya uning tugashini kutmaydi. Bu faqat avtomatik ravishda amalga oshiriladi. Shunday qilib, undagi keyingi so'rov muvaffaqiyatsiz bo'ladi.

Promise paketi va `async/wait` uchun vaziyat bir xil.

Tranzaktsiyaning o'rtasida `fetch` misoli:

```js
let transaction = db.transaction("inventory", "readwrite");
let inventory = transaction.objectStore("inventory");

await inventory.add({ id: 'js', price: 10, created: new Date() });

await fetch(...); // (*)

await inventory.add({ id: 'js', price: 10, created: new Date() }); // Error
```

`Fetch` `(*)` dan keyingi `inventory.add` bajarilmaydi, chunki tranzaksiya allaqachon amalga oshirilgan va o'sha vaqtda yopilgan.

Vaqtinchalik yechim mahalliy IndexedDB bilan ishlashda bo'lgani kabi: yangi tranzaktsiyani amalga oshiring yoki shunchaki narsalarni ajratib oling.

1. Ma'lumotlarni tayyorlang va avvalo barcha kerakli narsalarni oling.
2. Keyin ma'lumotlar bazasida saqlang.

### Mahalliy obyektlarni olish

O'ram ichki IndexedDB so'rovini bajaradi, unga `onerror/onsuccess` qo'shadi va natijani rad etuvchi/hal qiladigan va'dani qaytaradi.

Bu ko'pincha yaxshi ishlaydi. Misollar <https://github.com/jakearchibald/idb> lib sahifasida berilgan.

Kamdan kam hollarda, bizga asl `request` obyekti kerak bo'lganda, biz unga promisening `promise.request` xususiyati sifatida kirishimiz mumkin:

```js
let promise = books.add(book); // promise ni oling (uning natijasini kutmang)
let request = promise.request; // mahalliy so'rov obyekti
let transaction = request.transaction; // mahalliy tranzaksiya obyekti

// ... bir nechta mahalliy IndexedDB voodoo qiling ...

let result = await promise; // agar kerak bo'lsa
```

## Xulosa

IndexedDB ni "steroidlardagi mahalliy saqlash" deb hisoblash mumkin. Bu oddiy kalit-qiymatli ma'lumotlar bazasi, oflayn ilovalar uchun yetarlicha kuchli, ammo ulardan foydalanish oson.

Eng yaxshi qo'llanma bu spetsifikatsiyadir, [hozirgi](https://www.w3.org/TR/IndexedDB-2/) 2.0, lekin [3.0](https://w3c.github.io/IndexedDB/) da ham bir nechta usullar mavjud, (bu unchalik farq qilmaydi) qisman qo'llab-quvvatlanadi. 

Asosiy foydalanishni bir necha iboralar bilan tavsiflash mumkin:

1. [idb](https://github.com/jakearchibald/idb) kabi promise o'ramini oling.
2. Ma'lumotlar bazasini oching: `idb.openDb(name, version, onupgradeneeded)`
     - `onupgradeneeded` ishlov beruvchisida obyekt xotiralari va indekslarini yarating yoki kerak bo'lsa versiyani yangilang.
3. Murojaatlar uchun:
     - `db.transaction('books')` tranzaksiyasini yarating (agar kerak bo'lsa o'qing).
     - `transaction.objectStore('books')` obyektlar do'konini oling.
4. Keyin kalit orqali qidirish uchun to'g'ridan-to'g'ri obyekt do'konidagi usullarni chaqiring.
     - Obyekt maydoni bo'yicha qidirish uchun indeks yarating.
5. Agar ma'lumotlar xotiraga sig'masa, kursordan foydalaning.

Mana kichik demo ilova:

[codetabs src="books" current="index.html"]
