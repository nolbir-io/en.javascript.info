
# Primitiv (sodda) konversiya qilish obyekti

Obyektlar `obj1 + obj2` yordamida qo'shilsa, `obj1 - obj2` bilan ayirilsa yoki `alert(obj)` yordamida chop etilsa nima bo'ladi?

JavaScript sizga operatorlarning obyektlarda qanday ishlashini sozlash imkonini bermaydi. Ruby yoki C++ kabi ba'zi boshqa dasturlash tillaridan farqli o'laroq, biz qo'shish (yoki boshqa operatorlar) bilan ishlash uchun maxsus obyekt usulini amalga oshira olmaymiz.

Bunday amallar bajarilganda obyektlar avtomatik ravishda primitivlarga aylantiriladi, so'ngra operatsiya shu primitivlar ustida amalga oshiriladi va natijada primitiv qiymat olinadi.

Bu muhim cheklov: `obj1 + obj2` (yoki boshqa matematik operatsiya) natijasi boshqa obyekt bo'lishi mumkin emas!

Masalan, biz vektorlar yoki matritsalarni (yutuqlar yoki boshqa narsalarni) ifodalovchi obyektlarni yarata olmaymiz, ularni qo'shamiz va natijada "jamlangan" obyektni kutamiz. Bunday me'moriy yutuqlar avtomatik ravishda "mavzudan tashqarida" bo'ladi.

Shunday qilib, biz bu yerda texnik jihatdan ko'p ish qila olmasligimiz sababli, haqiqiy loyihalarda obyektlar bilan matematika mavjud emas. Bu holat bir necha istisnolarni hisobga olmaganda kodlash xatosi tufayli kamdan-kam sodir bo'ladi.

Ushbu bobda biz obyekt qanday qilib primitivga o'tishini va uni qanday sozlashni ko'rib chiqamiz.

Bizning ikkita maqsadimiz bor:

1. Bu bizga kodlash xatosi va bunday operatsiya tasodifiy sodir bo'lgan taqdirda nima sodir bo'lishini tushunishga imkon beradi.
2. Bunday operatsiyalar mumkin bo'lgan va yaxshi ko'rinadigan istisnolar mavjud. Masalan, sanalarni ayirish yoki solishtirish (`Data` obyektlari). Biz ular bilan keyinroq tanishamiz.

## Konversiya qilish qoidalari

<info:type-conversions> bobida biz primitivlarni son, satr va mantiqiy konversiya qilish qoidalarini ko'rib chiqdik. Lekin biz obyektlar uchun bo'sh joy qoldirdik. Endi usullar va belgilar haqida bilganimizdek, ularni to'ldirish mumkin bo'ladi.

1. Booleanga hech qanday konversiya yo'q. Barcha obyektlar mantiqiy kontekstda `true`(haqiqiy) bo'lib, shunchalik oddiy. Faqat raqamli va qatorli konversiyalar mavjud.
2. Raqamli konversiya obyektlarni ayirish yoki matematik funktsiyalarni qo'llashda sodir bo'ladi. Masalan, `Date` obyektlarini (<info:date> bobida yoritiladi) ayirish mumkin va `date1 - date2` natijasi ikki sana orasidagi vaqt farqidir.
3. String konvertatsiyasiga kelsak, bu odatda `alert(obj)` va shunga o'xshash kontekstlarda obyektni chiqarganimizda sodir bo'ladi.

Biz maxsus obyekt usullaridan foydalangan holda satr va raqamli konvertatsiyani o'zimiz amalga oshirishimiz mumkin.

Endi texnik tafsilotlarga to'xtalib o‘tamiz, chunki bu mavzuni chuqur yoritishning yagona yo'lidir.

## Maslahatlar

Qaysi konversiyani qo'llashni JavaScript qanday hal qiladi?

Turli vaziyatlarda sodir bo'ladigan turdagi konvertatsiya qilishning uchta varianti mavjud. Ular [spetsifikatsiyada] (https://tc39.github.io/ecma262/#sec-toprimitive) tasvirlanganidek, "maslahatlar" (hints) deb nomlanadi:

`"string"`
: `alert` kabi string kutilayotgan obyektda operatsiyani bajarayotganda obyektni stringga konversiya qilish mumkin:

    ```js
    // output
    alert(obj);

    // obyektni xususiyat kaliti sifatida ishlatish
    anotherObj[obj] = 123;
    ```

`"number"`
: Obyektni raqamga o'tkazishni ko'rib chiqamiz, masalan, matematika bilan shug'ullanayotganimizda:
    ```js
    // aniq konversiya
    let num = Number(obj);

    // maths (binary plus bundan mustasno)
    let n = +obj; // unary plus
    let delta = date1 - date2;

    // kamroq/ko'proq taqqoslash
    let greater = user1 > user2;
    ```

    Ko'pgina o'rnatilgan matematik funksiyalar ham bunday konvertatsiyani o'z ichiga oladi.

`"default"`
: Operator qaysi turni kutishiga "ishonchsiz" bo'lganda kamdan-kam hollarda paydo bo'ladi.

   Masalan, binary plus `+` ham satrlar (ularni birlashtiradi), ham raqamlar (ularni qo'shadi) bilan ishlashi mumkin. Shunday qilib, agar binary plus obyektni argument sifatida qabul qilsa, uni aylantirish uchun `"default"` maslahatidan foydalanadi.

    Bundan tashqari, agar obyekt `==` yordamida satr, raqam yoki belgi bilan taqqoslansa, nima konvertatsiya qilinishi kerakligi ham aniq emas, shuning uchun `"default"` maslahati ishlatiladi.

    ```js
    // binary plus "default" maslahatdan foydalanadi
    let total = obj1 + obj2;

    // obj == number "default" maslahatdan foydalanadi
    if (user == 1) { ... };
    ```
  
    `<` `>` kabi katta va kichik taqqoslash operatorlari ham satrlar, ham raqamlar bilan ishlashi mumkin. Shunday bo'lsa-da, ular `"default"` emas, balki `"number"` maslahatidan foydalanadilar. Bu tarixiy sabablarga ko'ra shunday bajariladi.

  Amalda esa, narsalar biroz sodda.

Bitta holatdan tashqari barcha o'rnatilgan obyektlar (`Date` obyekti, buni keyinroq bilib olamiz) `"default"` konvertatsiyani xuddi `"number"`ga o'xshash tarzda amalga oshiradi. Va, ehtimol, biz ham xuddi shunday qilishimiz kerak.

Shunday bo'lsa-da, barcha 3 maslahat haqida bilish muhim, tez orada nima uchun ekanligini bilib olamiz.

**Konversiyani amalga oshirish uchun JavaScript uchta obyekt usulini topishga va chaqirishga harakat qiladi:**

1. `obj[Symbol.toPrimitive](maslahat)` - `Symbol.toPrimitive` (tizim belgisi) ramziy kaliti bilan usulni chaqiring, agar shunday usul mavjud bo`lsa,
2. Aks holda, maslahat `"string"` bo'lsa
     - Nima bo'lishidan qat'iy nazar `obj.toString()" yoki "obj.valueOf()"` ni chaqirib ko'ring.
3. Aks holda, maslahat `"number"` yoki `"default"` bo'lsa
     - `obj.valueOf()` yoki `obj.toString()` ni chaqirib ko`ring.

## Symbol.toPrimitive

Birinchi usuldan boshlaylik. `Symbol.toPrimitive` nomli o'rnatilgan belgi mavjud bo‘lib, u konvertatsiya usulini nomlash uchun ishlatilishi kerak, masalan:

```js
obj[Symbol.toPrimitive] = function(hint) {
  // Bu obyektni primitivga aylantirish uchun kod mavjud
  // Primitiv qiymat qaytarilishi kerak
  // hint (maslahat) = "string", "number" va "default" dan biri
};
```

Agar `Symbol.toPrimitive` usuli mavjud bo'lsa, u barcha maslahatlar uchun ishlatiladi va boshqa usullar kerak emas.

Masalan, bu yerda `user` obyekti uni amalga oshiradi:

```js run
let user = {
  name: "John",
  money: 1000,

  [Symbol.toPrimitive](hint) {
    alert(`hint: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};

// konvertatsiya demosi:
alert(user); // hint: string -> {name: "John"}
alert(+user); // hint: number -> 1000
alert(user + 500); // hint: default -> 1500
```

Koddan ko'rinib turibdiki, `user` konvertatsiyaga qarab o'zini o'zi tavsiflovchi qatorga yoki pul miqdoriga aylanadi. `user[Symbol.toPrimitive]` yagona usuli barcha konversiya holatlarini ko'rib chiqadi.

## toString/valueOf

Agar `Symbol.toPrimitive` bo'lmasa, JavaScript `toString` va `valueOf` usullarini topishga harakat qiladi:

- `String` uchun maslahat: `toString` usulini chaqiring va agar u mavjud bo'lmasa yoki u ibtidoiy qiymat o'rniga obyektni qaytarsa, `valueOf` ga qo'ng'iroq qiling (shuning uchun `toString` satrni o'zgartirish uchun ustuvorlikka ega).
- Boshqa maslahatlar uchun: `valueOf` ga qo'ng'iroq qiling va agar u mavjud bo'lmasa yoki u primitiv qiymat o'rniga obyektni qaytarsa, `toString` ga qo'ng'iroq qiling (shuning uchun `valueOf` matematika uchun ustunlikka ega).

`toString` va `valueOf` usullari qadim zamonlardan beri mavjud. Ular ramzlar emas (ramzlar uzoq vaqt oldin mavjud emas edi), balki "muntazam" string nomli usullardir. Ular konversiyani amalga oshirish uchun muqobil "eski uslub" usulini taqdim etadi.

Ushbu usullar primitiv qiymatni qaytarishi kerak. Agar `toString` yoki `valueOf` obyektni qaytarsa, u e'tiborga olinmaydi (xuddi hech qanday usul yo'qligi kabi).

Odatda, oddiy obyekt quyidagi `toString` va `valueOf` usullariga ega:

- `toString` usuli `"[object Object]"` usulini qaytaradi.
- `valueOf` usuli obyektning o'zini qaytaradi.

Quyida namuna ko'rsatilgan:

```js run
let user = {name: "John"};

alert(user); // [object Object]
alert(user.valueOf() === user); // true
```

Shunday qilib, agar biz `alert` yoki shunga o'xshash obyektni satr sifatida ishlatishga harakat qilsak, default bo'yicha biz `[object Object]` ni ko'ramiz.

Odatiy `valueOf` bu yerda faqat to'liqlik uchun, chalkashliklarga yo'l qo'ymaslik uchun eslatib o'tilgan. Ko'rib turganingizdek, u obyektning o'zini qaytaradi va shuning uchun e'tiborga olinmaydi. Sababini so'ramang, bu tarixiy sabablarga ko'ra shunaqa. Demak, biz u mavjud emas deb tahmin qilishimiz mumkin.

Keling, konvertatsiyani sozlash uchun ushbu usullarni amalga oshiramiz.

Masalan, bu yerda `user` `Symbol.toPrimitive` o'rniga `toString` va `valueOf` kombinatsiyasidan foydalangan holda yuqoridagi kabi vazifani amalga oshiradi:

```js run
let user = {
  name: "John",
  money: 1000,

  // for hint="string"
  toString() {
    return `{name: "${this.name}"}`;
  },

  // for hint="number" yoki "default"
  valueOf() {
    return this.money;
  }

};

alert(user); // toString -> {name: "John"}
alert(+user); // valueOf -> 1000
alert(user + 500); // valueOf -> 1500
```

Ko'rib turganimizdek, xatti-harakatlar `Symbol.toPrimitive` va oldingi misol bir xil.

Ko'pincha biz barcha ibtidoiy konvertatsiyalarni boshqarish uchun yagona "barchasini qo'lga oladigan" joyni xohlaymiz. Bunday holda, biz faqat `toString` ni amalga oshirishimiz mumkin, masalan:

```js run
let user = {
  name: "John",

  toString() {
    return this.name;
  }
};

alert(user); // toString -> John
alert(user + 500); // toString -> John500
```
`Symbol.toPrimitive` va `valueOf` bo'lmasa, `toString` barcha primitiv konvertatsiyalarni boshqaradi.

### Konvertatsiya har qanday primitiv turni qaytarishi mumkin

Barcha primitiv-konversiya usullari haqida bilish kerak bo'lgan muhim narsa shundaki, ular "ishora qilingan" primitivni qaytarishi shart emas.

`toString` aynan satrni qaytaradimi yoki `Symbol.toPrimitive` usuli ``number`` maslahati uchun raqam qaytaradimi yoki yo`qmi, nazorat qilinmaydi.

Yagona majburiy narsa: bu usullar obyektni emas, balki primitivni qaytarishi kerak.

```smart header="Tarixiy eslatmalar"

Tarixiy sabablarga ko'ra, agar `toString` yoki `valueOf` obyektni qaytarsa, xato bo'lmaydi, lekin bunday qiymat e'tiborga olinmaydi (masalan, usul mavjud bo'lmaganda). Buning sababi, qadimgi davrlarda JavaScript-da yaxshi "error" tushunchasi bo'lmagan.

Bundan farqli ravishda, `Symbol.toPrimitive` qattiqroq, u *primitivni qaytarishi kerak*, aks holda xatolik yuz beradi.
```

## Keyingi konvertatsiyalar

Bizga ma'lumki, ko'pgina operatorlar va funktsiyalar turdagi konversiyalarni amalga oshiradilar, masalan. `*` ko`paytirish operandlarini raqamlarga aylantiradi.

Agar obyektni argument sifatida topshirsak, hisob-kitoblarning ikki bosqichi mavjud:
1. Obyekt primitivga aylantiriladi (yuqorida tavsiflangan qoidalardan foydalangan holda).
2. Agar keyingi hisob-kitoblar uchun zarur bo'lsa, natijada olingan primitiv ham konvertatsiya qilinadi.

Masalan:

```js run
let obj = {
  // toString boshqa usullar mavjud bo'lmaganda barcha konversiyalarni boshqaradi
  toString() {
    return "2";
  }
};

alert(obj * 2); // 4, obyekt ibtidoiy "2" ga aylantirildi, keyin ko'paytirish uni raqamga aylantirdi
```

1. `obj * 2` ko'paytmasi avval obyektni primitivga aylantiradi (bu ``2`` qatori).
2. Keyin `"2" * 2` `2 * 2` ga aylanadi (satr raqamga aylantiriladi).

Ikkilik plyus bir xil vaziyatda satrlarni birlashtiradi, chunki u satrni mamnuniyat bilan qabul qiladi:

```js run
let obj = {
  toString() {
    return "2";
  }
};

alert(obj + 2); // 22 ("2" + 2), primitivga aylantirish => birlashma qatorini qaytardi
```

## Xulosa

Obyektni primitivga o'zgartish ko'plab o'rnatilgan funksiyalar va qiymat sifatida primitivni kutadigan operatorlar tomonidan avtomatik ravishda chaqiriladi.

Uning 3 turi (maslahatlari) mavjud:
- `"string"` ( `alert` va string kerak bo'lgan boshqa operatsiyalar uchun)
- `"number"` (matematika uchun)
- `"default"` (bir nechta operatorlar, odatda obyektlar uni `number` bilan bir xil tarzda amalga oshiradilar)

Spetsifikatsiyada qaysi operator qaysi maslahatdan foydalanishi aniq tasvirlangan.

Konversiya algoritmi:

1. Agar usul mavjud bo'lsa, `obj[Symbol.toPrimitive](hint)` ga qo'ng'iroq qiling,
2. Aks holda hint `"string"` bo'lsa
     - `obj.toString()` yoki `obj.valueOf()` ni chaqirib ko'ring, nima bo'lishidan qat'iy nazar.
3. Aks holda hint `"number"` yoki `"defaultt"` bo'lsa
     - `obj.valueOf()` yoki `obj.toString()` ga qo'ng'iroq qilib ko`ring.

Bu usullarning barchasi ishlash uchun primitivni qaytarishi kerak (agar belgilangan bo'lsa).

Amalda, ko'pincha `obj.toString()` ni ro'yxatga olish yoki debugging maqsadlarida obyektning "odam o'qiy oladigan" ko'rinishini qaytarishi kerak bo'lgan satrlarni o'zgartirish uchun "hammasini tutish" usuli sifatida qo'llash kifoya.
