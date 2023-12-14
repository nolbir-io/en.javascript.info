
# Xususiy va himoyalangan xususiyatlar va usullar
Obyektga yo'naltirilgan dasturlashning eng muhim tamoyillaridan biri bu -- ichki interfeysni tashqi interfeysdan ajratishdir.

Bu "salom dunyo" ilovasidan ko'ra murakkabroq narsalarni ishlab chiqishda "kerakli" amaliyotdir.

Buni tushunish uchun rivojlanishdan uzilib, ko‘zimizni real dunyoga qarataylik.

Odatda, biz foydalanadigan qurilmalar juda murakkab. Ammo ichki interfeysni tashqi interfeysdan ajratish ularni muammosiz ishlatishga imkon beradi.

## Hayotiy misol

Masalan, qahva mashinasi. Tashqi tomondan qaraganda oddiy ko'rinadi: tugma, displey, bir nechta teshik... Va, albatta, natijasi esa - ajoyib qahva! :)

![](coffee.jpg)

Lekin ichkarida... (ta'mirlash qo'llanmasidan rasm)

![](coffee-inside.jpg)

Tafsilotlar juda ko'p. Lekin biz hech narsani bilmasdan foydalanishimiz mumkin.

Qahva mashinalari juda ishonchli, shunday emasmi? Biz uni yillar davomida ishlatishimiz mumkin va agar biror narsa noto'g'ri bo'lsa, uni ta'mirlash uchun olib kelamiz.

Kofe mashinasining ishonchliligi va soddaligining siri -- barcha detallar yaxshi sozlangan va ichida *yashirin* ekanligidadir.

If we remove the protective cover from the coffee machine, then using it will be much more complex (where to press?), and dangerous (it can electrocute). Agar qahva mashinasidan himoya qopqog'ini olib tashlasak, uni ishlatish ancha murakkab (keyin qayerga bosish kerak?) va xavfli (elektr toki urishi mumkin) bo'ladi.

Ko'rib turganimizdek, dasturlashda obyektlar qahva mashinalariga o'xshaydi.

Ammo ichki tafsilotlarni yashirish uchun biz himoya qoplamasidan emas, balki til va konvensiyalarning maxsus sintaksisidan foydalanamiz.

## Ichki va tashqi interfeys

Obyektga yo'naltirilgan dasturlashda xususiyatlar va usullar ikki guruhga bo'linadi:

- *Ichki interfeys* -- usullar va xususiyatlar, sinfning boshqa usullaridan foydalanish mumkin, lekin tashqaridan emas.
- *Tashqi interfeys* -- Sinfdan tashqarida ham foydalanish mumkin bo'lgan usullar va xususiyatlar.

Agar qahva mashinasi bilan o'xshatishni davom ettiradigan bo'lsak - ichkarida nima yashiringanini ko'rishimiz mumkon: qozon trubkasi, isitish elementi va boshqalar - uning ichki interfeysi hisoblanadi.

Obyektning ishlashi uchun ichki interfeys ishlatiladi, uning detallari bir-biridan foydalanadi. Masalan, isitish elementiga qozon trubkasi biriktirilgan.

Ammo tashqaridan qahva mashinasi himoya qopqog'i bilan yopilgan, shuning uchun hech kim ularga yetib bormaydi. Tafsilotlar yashirin va kirish imkonsiz. Biz uning xususiyatlaridan tashqi interfeys orqali foydalanishimiz mumkin.

Shunday qilib, obyektdan foydalanish uchun faqat uning tashqi interfeysini bilish kerak. Biz uning ichida qanday ishlashini umuman bilmasligimiz mumkin va bu juda yaxshi holat.

Bu umumiy kirish edi.

JavaScript-da obyekt maydonlarining ikki turi mavjud (xususiyatlar va usullar):

- Ommaviy: istalgan joydan foydalanish mumkin. Ular tashqi interfeysni o'z ichiga oladi. Shu paytgacha biz faqat davlat mulki va usullaridan foydalanardik.
- Shaxsiy: faqat sinf ichidan foydalanish mumkin. Bu ichki interfeys uchun.

Ko'pgina boshqa tillarda ham "himoyalangan" maydonlar mavjud: faqat sinf ichidan va uni kengaytiradiganlardan foydalanish mumkin (masalan, shaxsiy, lekin meros qilib olgan sinflardan kirish). Ular ichki interfeys uchun ham foydalidir. Ular ma'lum ma'noda xususiylardan ko'ra kengroqdir, chunki biz odatda ularga kirish uchun merosxo'r sinflarni xohlaymiz.

Himoyalangan maydonlar JavaScript-da til darajasida amalga oshirilmaydi, lekin amalda ular juda qulay, shuning uchun ularga taqlid qilinadi.

Endi biz JavaScriptda ushbu turdagi barcha xususiyatlarga ega qahva mashinasini yaratamiz. Qahva mashinasi juda ko'p tafsilotlarga ega, biz ularni oddiy bo'lishi uchun modellamaymiz (garchi mumkin bo'lsa ham).

## "Suv miqdori" ni himoya qilish

Keling, oddiy qahva mashinasi sinfini yarataylik:

```js run
class CoffeeMachine {
  waterAmount = 0; // tarkibidagi suv miqdori

  constructor(power) {
    this.power = power;
    alert( `Created a coffee-machine, power: ${power}` );
  }

}

// kofe mashinasini yaratish
let coffeeMachine = new CoffeeMachine(100);

// add water
coffeeMachine.waterAmount = 200;
```

Hozirda `waterAmount` va `power` xususiyatlari ochiq. Biz ularni tashqaridan istalgan qiymatga osongina olishimiz/o'rnatishimiz mumkin.

Uni koʻproq nazorat qilish uchun `waterAmount` xususiyatini himoyalanganga oʻzgartiramiz. Misol uchun, biz hech kim uni noldan pastga qo'yishini xohlamaymiz.

**Himoyalangan xususiyatlar odatda pastki chiziq bilan prefikslanadi `_`.**

Bu til darajasida qo'llanilmaydi, lekin dasturchilar o'rtasida bunday xususiyatlar va usullarga tashqaridan kirish mumkin emasligi haqida taniqli konventsiya mavjud.

Demak, bizning xususiyatimiz `_waterAmount`, suv miqdori deb nomlanadi.

```js run
class CoffeeMachine {
  _waterAmount = 0;

  set waterAmount(value) {
    if (value < 0) {
      value = 0;
    }
    this._waterAmount = value;
  }

  get waterAmount() {
    return this._waterAmount;
  }

  constructor(power) {
    this._power = power;
  }

}

// kofe mashinasini yaratish
let coffeeMachine = new CoffeeMachine(100);

// add water
coffeeMachine.waterAmount = -10; // _waterAmount, ya'ni suv miqdori 0 bo'ladi, -10 emas
```

Endi kirish nazorat ostida, shuning uchun suv miqdorini noldan pastga o'rnatish imkonsiz bo'ladi.

## Faqat o'qish uchun "quvvat"(power)

`Power` xususiyati uchun uni faqat o'qish uchun qilaylik. Ba'zan shunday bo'ladiki, xususiyat faqat yaratilish vaqtida o'rnatilishi va keyin hech qachon o'zgartirilmasligi kerak.

 Kofe mashinasi uchun aynan shunday: quvvat hech qachon o'zgarmaydi.

Buning uchun biz faqat qabul qiluvchini yaratishimiz kerak, lekin sozlagichni emas:

```js run
class CoffeeMachine {
  // ...

  constructor(power) {
    this._power = power;
  }

  get power() {
    return this._power;
  }

}

// kofe mashinasini yaratish
let coffeeMachine = new CoffeeMachine(100);

alert(`Power is: ${coffeeMachine.power}W`); // Quvvat: 100W

coffeeMachine.power = 25; // Xato (o'rnatuvchi yo'q)
```

````aqlli sarlavha="Oluvchi/o'rnatuvchi funksiyalar"
 Bu yerda biz  oluvchi/ o'rnatuvchi sintaksisidan foydalandik.

Lekin ko'pincha `get.../set...` funksiyalariga afzallik beriladi, masalan:

```js
class CoffeeMachine {
  _waterAmount = 0;

  *!*setWaterAmount(value)*/!* {
    if (value < 0) value = 0;
    this._waterAmount = value;
  }

  *!*getWaterAmount()*/!* {
    return this._waterAmount;
  }
}

new CoffeeMachine().setWaterAmount(100);
```

Bu biroz uzunroq ko'rinadi, lekin funksiyalar yanada moslashuvchan. Ular bir nechta dalillarni qabul qilishlari mumkin (hatto hozir ularga kerak bo'lmasa ham).

Boshqa tomondan, get/set sintaksisi qisqaroq, shuning uchun qat'iy qoida yo'q, bu sizning qaroringizga bog'liq.
````

```aqlli sarlavha="Himoyalangan maydonlar meros qilib olinadi"
Agar biz “MegaMachine extensions CoffeeMachine” sinfini meros qilib olsak, yangi sinf usullaridan “this._waterAmount” yoki “this._power” ga kirishimizga hech narsa to'sqinlik qilmaydi.

Shunday qilib, muhofaza qilinadigan maydonlar tabiiy ravishda meros qilib olinadi. Shaxsiylardan farqli o'laroq, biz quyida ko'rib chiqamiz.
```

## Private "#waterLimit"

[so'nggi brauzer=yo'q] 

Deyarli standartda tayyor JavaScript taklifi mavjud bo'lib, u xususiy xususiyatlar va usullarni til darajasida qo'llab-quvvatlaydi.

Xususiylar `#` bilan boshlanishi kerak. Ularga faqat sinf ichidan kirish mumkin.

Masalan, bu yerda shaxsiy `#waterLimit` xususiyati va suvni tekshirishning shaxsiy usuli `#fixWaterAmount` ni ko'rib chiqamiz:

```js run
class CoffeeMachine {
*!*
  #waterLimit = 200;
*/!*

*!*
  #fixWaterAmount(value) {
    if (value < 0) return 0;
    if (value > this.#waterLimit) return this.#waterLimit;
  }
*/!*

  setWaterAmount(value) {
    this.#waterLimit = this.#fixWaterAmount(value);
  }

}

let coffeeMachine = new CoffeeMachine();

*!*
// sinfdan tashqaridagi shaxsiy ma'lumotlarga kira olmaydi
coffeeMachine.#fixWaterAmount(123); // Xato
coffeeMachine.#waterLimit = 1000; // Xato
*/!*
```

Til darajasida `#` maydon shaxsiy ekanligini bildiruvchi maxsus belgidir. Biz unga tashqaridan yoki irsiy sinflardan kira olmaymiz.

Xususiy maydonlar ijtimoiy maydonlar bilan zid emas. Bizda bir vaqtning o'zida shaxsiy `#waterAmount` va umumiy `waterAmount` maydonlari bo'lishi mumkin.

Masalan, `waterAmount` ni `#waterAmount` uchun yordamchi qilib olaylik:

```js run
class CoffeeMachine {

  #waterAmount = 0;

  get waterAmount() {
    return this.#waterAmount;
  }

  set waterAmount(value) {
    if (value < 0) value = 0;
    this.#waterAmount = value;
  }
}

let machine = new CoffeeMachine();

machine.waterAmount = 100;
alert(machine.#waterAmount); // Error
```

Himoyalanganlardan farqli o'laroq, xususiy maydonlar tilning o'zi tomonidan amalga oshiriladi. Bu yaxshi narsa.

Agar biz `CoffeeMachine` dan meros oladigan bo‘lsak, `#waterAmount` ga to‘g‘ridan-to‘g‘ri kira olmaymiz. Biz `waterAmount` oluvchi/o'rnatuvchiga tayanishimiz kerak:

```js
class MegaCoffeeMachine extends CoffeeMachine {
  method() {
*!*
    alert( this.#waterAmount ); // Xato: faqat qahva mashinasidan kirish mumkin
*/!*
  }
}
```

Ko'pgina stsenariylarda bunday cheklash juda jiddiy. Agar biz `CoffeeMachine` ni kengaytirsak, uning ichki qismlariga kirish uchun qonuniy sabablarimiz bo'lishi mumkin. Shuning uchun himoyalangan maydonlar til sintaksisi tomonidan qo'llab-quvvatlanmasa ham, ko'proq ishlatiladi.

````ogohlantiruvchi sarlavha=""Shaxsiy maydonlar this [name], bu nom sifatida mavjud emas"
Xususiy maydonlar alohida joylashgan.  

Ma'lumki, biz odatda `this[name]` yordamida maydonlarga kira olamiz:

```js
class User {
  ...
  sayHi() {
    let fieldName = "name";
    alert(`Hello, ${*!*this[fieldName]*/!*}`);
  }
}
```

Shaxsiy maydonlarda bu mumkin emas: `this['#name']` ishlamaydi. Bu maxfiylikni ta'minlash uchun sintaktik cheklovdir.
````

## Xulosa

OOP nuqtayi nazaridan, ichki interfeysning tashqi interfeysdan chegaralanishi [encapsulation] (https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)) deb ataladi.

U quyidagi foydalarni beradi:

Foydalanuvchilar o'zlarini oyog'iga otib yubormasliklari uchun himoya
: Tasavvur qiling-a, kofe mashinasidan foydalanadigan dasturchilar jamoasi bor. U "Best CoffeeMachine" kompaniyasi tomonidan ishlab chiqarilgan va yaxshi ishlaydi, ammo himoya qopqog'i olib tashlangan. Shunday qilib, ichki interfeys ochiladi.

    Barcha ishlab chiquvchilar madaniyatli -- ular qahva mashinasidan maqsadli foydalanishadi. Ammo ulardan biri, Jon, o'zini eng aqlli deb qaror qildi va qahva mashinasining ichki qismlarini biroz o'zgartirdi. Shunday qilib, qahva mashinasi ikki kundan keyin ishdan chiqdi.

    Bu, albatta, Jonning aybi emas, balki ayb himoya qopqog'ini olib tashlagan va Jonga o'z manipulyatsiyasiga ruxsat bergan odamdadir.

    Dasturlashda ham xuddi shunday. Agar sinf foydalanuvchisi tashqaridan o'zgartirish uchun mo'ljallanmagan narsalarni o'zgartirsa - oqibatlari oldindan aytib bo'lmaydi.

Qo'llab-quvvatlanadigan holat
 : Dasturlashdagi vaziyat haqiqiy qahva mashinasiga qaraganda ancha murakkab, chunki biz uni bir marta sotib olmaymiz. Kod doimiy ravishda ishlab chiqiladi va takomillashtiriladi.

    **Agar biz ichki interfeysni qat'iy chegaralasak, u holda sinfni ishlab chiquvchisi foydalanuvchilarni xabardor qilmasdan ham o'zining ichki xususiyatlari va usullarini erkin o'zgartirishi mumkin.**

    Agar siz bunday sinfni ishlab chiquvchi bo'lsangiz, shaxsiy usullarni xavfsiz tarzda qayta nomlash, parametrlarini o'zgartirish va hatto olib tashlash mumkinligini bilish juda yaxshi, chunki hech qanday tashqi kod ularga bog'liq emas.

    Foydalanuvchilar uchun yangi versiya chiqqanda, u ichki jihatdan to'liq ta'mirlanishi mumkin, ammo tashqi interfeys bir xil bo'lsa, uni yangilash oson.

Murakkablikni yashirish
: Odamlar oddiy narsalardan foydalanishni yaxshi ko'radilar. Hech bo'lmaganda tashqaridan. Ichidagi narsa boshqa narsadir.

    Dasturchilar bundan mustasno emas.

    **Amalga kiritish tafsilotlari yashirin bo‘lsa va oddiy, yaxshi hujjatlashtirilgan tashqi interfeys mavjud bo'lsa, bu har doim qulay.**

Ichki interfeysni yashirish uchun biz himoyalangan yoki shaxsiy xususiyatlardan foydalanamiz:

- Himoyalangan maydonlar `_` bilan boshlanadi. Bu til darajasida qo'llanilmagan taniqli konventsiya. Dasturchilar faqat `_` bilan boshlangan maydonga uning sinfi va undan meros bo'lgan sinflarga kirishlari kerak.
- Shaxsiy maydonlar `#` bilan boshlanadi. JavaScript bizga faqat sinf ichidagilarga kirishimiz mumkinligiga ishonch hosil qiladi.

Hozirda shaxsiy maydonlar brauzerlar orasida yaxshi qo'llab-quvvatlanmaydi, lekin ularni ko'p to'ldirish mumkin.
