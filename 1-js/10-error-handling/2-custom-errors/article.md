# Odatiy va davom etadigan error'lar

Biz dasturlayotganimizda vazifalarimizda noto'g'ri ketishi mumkin bo'lgan aniq narsalarni aks ettirish uchun ko'pincha o'z xatolarimizni sinflarga ajratishga muhtojmiz. Tarmoq operatsiyalaridagi xatolar uchun bizga `HttpError`, ma'lumotlar bazasi operatsiyalari uchun `DbError`, qidiruv operatsiyalari uchun `NotFoundError` va boshqalar kerak bo'lishi mumkin.

Bizning xatolarimiz `message`, `name`, va `stack` kabi afzalroq bo'lgan asosiy xato xususiyatlarini qo'llab-quvvatlashi kerak. Ammo ular o'zlarining boshqa xususiyatlariga ham ega bo'lishi mumkin, masalan. `HttpError` obyektlari `404` yoki `403` yoki `500` kabi qiymatga ega `statusCode` xususiyatiga ega bo'lishi mumkin.

JavaScript har qanday argument bilan `throw` dan foydalanishga imkon beradi, shuning uchun texnik jihatdan bizning maxsus error sinflarimiz `Error` dan meros bo'lishi shart emas. Agar biz meros qilib olsak, xato obyektlarini aniqlash uchun `obj instanceof Error` dan foydalanish mumkin bo'ladi. Shuning uchun undan meros olish yaxshiroqdir.

Ilova o'sib borishi bilan bizning xatolarimiz tabiiy ravishda ierarxiyani tashkil qiladi. Masalan, `HttpTimeoutError` bloki `HttpError` dan meros bo'lishi mumkin va hokazo.

## Davom etadigan Error

Misol sifatida, foydalanuvchi ma'lumotlari bilan JSONni o'qishi kerak bo'lgan `readUser(json)` funksiyasini ko'rib chiqaylik.

Mana yaroqli `json` qanday ko'rinishiga misol:
```js
let json = `{ "name": "John", "age": 30 }`;
```

Ichkarida biz `JSON.parse` dan foydalanamiz. Agar u noto'g'ri tuzilgan `json` ni qabul qilsa, u `SyntaxError` ni chiqaradi. Lekin `json` sintaktik jihatdan to'g'ri bo'lsa ham, bu uning haqiqiy foydalanuvchi ekanligini anglatmaydi, to'g'rimi? U kerakli ma'lumotlarni o'tkazib yuborishi mumkin. Masalan, foydalanuvchilarimiz uchun muhim bo'lgan `name` va `age` xususiyatlariga ega bo'lmasligi mumkin.

Bizning `readUser(json)` funksiyamiz nafaqat JSONni o'qiydi, balki ma'lumotlarni tekshiradi ("tasdiqlaydi"). Agar kerakli maydonlar bo'lmasa yoki format noto'g'ri bo'lsa, bu xato hisoblanadi. Bu `SyntaxError` emas, chunki ma'lumotlar sintaktik jihatdan to'g'ri, lekin boshqa turdagi xatodir. Biz uni `ValidationError` deb nomlaymiz va u uchun sinf yaratamiz. Bunday xato, shuningdek, huquqbuzarlik maydoni haqidagi ma'lumotni ham o'z ichiga olishi kerak.

Bizning `ValidationError` sinfimiz `Error` sinfidan meros olishi kerak.

`Error` sinfi o'rnatilgan, ammo biz nimani kengaytirayotganimizni tushunishimiz uchun uning taxminiy kodi:

```js
// JavaScriptning o'zi tomonidan belgilangan o'rnatilgan Error sinfi uchun "psevdokod"
class Error {
  constructor(message) {
    this.message = message;
    this.name = "Error"; // (turli o'rnatilgan xato sinflari uchun turli nomlar)
    this.stack = <call stack>; // nostandart, lekin ko'pchilik muhitlar uni qo'llab-quvvatlaydi
   }
}
```

Endi undan `ValidationError` ni meros qilib olamiz va uni amalda sinab ko'ramiz:

```js ishonchsiz ishlaydi
*!*
class ValidationError extends Error {
*/!*
  constructor(message) {
    super(message); // (1)
    this.name = "ValidationError"; // (2)
  }
}

function test() {
  throw new ValidationError("Whoops!");
}

try {
  test();
} catch(err) {
  alert(err.message); // Voy!
  alert(err.name); // ValidationError
  alert(err.stack); // har biri uchun qator raqamlari bilan ichki chaqiruvlar ro'yxati
}
```

Iltimos, diqqat qiling: `(1)` qatorida biz parent konstruktorni chaqiramiz. JavaScript bizdan bolalar konstruktorida `super` deb chaqirishimizni talab qiladi, shuning uchun bu majburiydir. Parent konstruktor `message` xususiyatini o'rnatadi.

Parent konstruktor `name` xususiyatini ham `Error` ga o'rnatadi, shuning uchun `(2)` qatorida biz uni to'g'ri qiymatga qaytaramiz.

Keling, uni `readUser(json)` da ishlatishga harakat qilaylik:

```js run
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// Foydalanish
function readUser(json) {
  let user = JSON.parse(json);

  if (!user.age) {
    throw new ValidationError("Maydon yo'q: age");
  }
  if (!user.name) {
    throw new ValidationError("Maydon yo'q: name");
  }

  return user;
}

// try..catch bilan ishlash misoli

try {
  let user = readUser('{ "age": 25 }');
} catch (err) {
  if (err instanceof ValidationError) {
*!*
    alert("Noto'g'ri ma'lumotlar: " + err.message); // Noto'g'ri ma'lumotlar: Maydon yo'q: name
*/!*
  } else if (err instanceof SyntaxError) { // (*)
    alert("JSON Syntax Error: " + err.message);
  } else {
    throw err; // noma'lum error, uni rethrow qilish lozim (**)
  }
}
```

 Yuqoridagi koddagi `try..catch` bloki `ValidationError` va `JSON.parse` dan o'rnatilgan `SyntaxError` bilan ishlaydi.

Iltimos, `(*)` qatoridagi muayyan xato turini tekshirish uchun `instanceof` dan qanday foydalanishimizni ko'rib chiqing.

`err.name` ga ham e'tibor qaratishimiz mumkin, masalan:

```js
// ...
// instanceof o'rniga (SyntaxError)
} else if (err.name == "SyntaxError") { // (*)
// ...
```

`Instanceof` versiyasi ancha yaxshi, chunki kelajakda biz `ValidationError` ni kengaytiramiz, uning `PropertyRequiredError` kabi kichik turlarini yaratamiz. Va `instanceof` tekshiruvi yangi irsiy sinflar uchun ishlashda davom etadi. Demak, bu kelajakka ishonchdir.

Bundan tashqari, agar `catch` noma'lum xatoga javob bersa, uni `(**)` qatoriga qaytarishi ham muhimdir. `Catch` bloki faqat tekshirish va sintaksis xatolarini qanday boshqarishni biladi, boshqa turdagi xatolar (koddagi xato yoki boshqa noma'lum sabablarga ko'ra) tushib qolishi kerak.

## Keyingi meros

`ValidationError` sinfi juda umumiydir. Ko'p narsa noto'g'ri ketishi mumkin. Xususiyat yo'q yoki u noto'g'ri formatda bo'lishi mumkin (masalan, raqam o'rniga `age` qatori qiymati). Keling, mavjud bo'lmagan xususiyatlar uchun aniqroq `PropertyRequiredError` sinfini yarataylik. Unda etishmayotgan mulk haqida qo'shimcha ma'lumotlar bo'ladi.

```js run
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

*!*
class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super("Property yo'q: " + property);
    this.name = "PropertyRequiredError";
    this.property = property;
  }
}
*/!*

// Foydalanish
function readUser(json) {
  let user = JSON.parse(json);

  if (!user.age) {
    throw new PropertyRequiredError("age");
  }
  if (!user.name) {
    throw new PropertyRequiredError("name");
  }

  return user;
}

// try..catch msiollari bilan ishlash

try {
  let user = readUser('{ "age": 25 }');
} catch (err) {
  if (err instanceof ValidationError) {
*!*
    alert("Noto'g'ri ma'lumot: " + err.message); // Noto'g'ri ma'lumot: Property yo'q: name
    alert(err.name); // PropertyRequiredError
    alert(err.property); // name
*/!*
  } else if (err instanceof SyntaxError) {
    alert("JSON Syntax Error: " + err.message);
  } else {
    throw err; // noma'lum error, uni rethrow qilish kerak
  }
}
```

Yangi `PropertyRequiredError` sinfidan foydalanish oson: biz faqat xususiyat nomini kiritishimiz kerak: `new PropertyRequiredError(property)`. Odam o'qiy olishi mumkin bo'lgan `message` konstruktor tomonidan ishlab chiqariladi.

Esda tutingki, `PropertyRequiredError` konstruktoridagi `this.name` yana qo'lda tayinlangan. Bu biroz zerikarli bo'lishi mumkin -- har bir maxsus xato sinfida `this.name = <class name>` belgilanadi. Biz `this.name = this.constructor.name` ni belgilaydigan o'zimizning "asosiy error" sinfini yaratish orqali undan xalos bo'lishimiz mumkin. Va keyin bizning barcha odatiy xatolarimiz undan meros qilib olinadi.

Keling, uni `MyError` deb nomlaymiz.

Mana `MyError` va boshqa maxsus xato sinflari bilan soddalashtirilgan kod:

```js run
class MyError extends Error {
  constructor(message) {
    super(message);
*!*
    this.name = this.constructor.name;
*/!*
  }
}

class ValidationError extends MyError { }

class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super("Property yo'q: " + property);
    this.property = property;
  }
}

// name to'g'ri
alert( new PropertyRequiredError("field").name ); // PropertyRequiredError
```

Endi maxsus xatolar ancha qisqaroq, ayniqsa `ValidationError`, chunki biz konstruktordagi `"this.name = ..."` qatoridan qutuldik.

## O'rash istisnolari

Yuqoridagi koddagi `readUser` funksiyasining maqsadi “foydalanuvchi ma'lumotlarini o'qish”dir. Jarayonda turli xil xatolar bo'lishi mumkin. Hozir bizda `SyntaxError` va  `ValidationError` mavjud, ammo kelajakda `readUser` funksiyasi o'sishi va boshqa turdagi xatolarni keltirib chiqarishi mumkin.

`readUser` deb nomlanuvchi kod bu xatolarni hal qilishi kerak. Hozirda u `catch` blokida sinfni tekshiradigan va ma'lum xatolarni boshqaradigan va noma'lumlarni qayta tiklaydigan bir nechta`"if` dan foydalanadi.

Sxema quyidagicha:

```js
try {
  ...
  readUser()  // potentsial error manbai
  ...
} catch (err) {
  if (err instanceof ValidationError) {
    // validation error' larni hal qilish
  } else if (err instanceof SyntaxError) {
    // syntax error' larni hal qilish
  } else {
    throw err; // noma'lum error, uni rethrow qilish kerak
  }
}
```

Yuqoridagi kodda biz ikki turdagi error'larni ko'rishimiz mumkin, ammo biz o'ylagandan ham ko'proq error mavjud bo'lishi mumkin.

Agar `readUser` funksiyasi bir necha turdagi xatoliklarni keltirib chiqarsa, biz o'zimizga savol berishimiz kerak: haqiqatan ham har safar xatolik turlarini birma-bir tekshirib ko'rishni xohlaymizmi?

Ko'pincha javob "Yo'q": biz "barchasidan bir daraja yuqori" bo'lishni xohlaymiz. Biz shunchaki "ma'lumotlarni o'qish xatosi" bor yoki yo'qligini bilishni istaymiz -- nima uchun aynan shunday bo'lganligi ko'pincha ahamiyatsiz (xato xabari buni tasvirlaydi). Yoki undan ham yaxshisi, zarur vaqtda biz xato tafsilotlarini olishning yo'lini xohlaymiz.

Biz bu yerda tasvirlab beradigan texnika "o'rash istisnolari" deb ataladi.

1. Umumiy "ma'lumotlarni o'qish" xatosini ko'rsatish uchun yangi `ReadError` sinfini yaratamiz.
2. `ReadUser` funksiyasi uning ichida yuzaga kelgan `ValidationError` va `SyntaxError` kabi ma'lumotlarni o'qish xatolarini ushlaydi va buning o'rniga `ReadError` hosil qiladi.
3. `ReadError` obyekti o'zining `cause` xususiyatida asl xatoga havolani saqlab qoladi.

Keyin `readUser` ni chaqiradigan kod har qanday ma'lumotni o'qish xatolarini emas, balki faqat `ReadError` ni tekshirishi kerak bo'ladi. Va agar u xato haqida batafsilroq ma'lumotga muhtoj bo'lsa, u `cause` xususiyatini tekshirishi mumkin. 

Mana bu kod `ReadError` ni aniqlaydi va uning `readUser` va `try..catch` da qo'llanilishini ko‘rsatadi:

```js run
class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = 'ReadError';
  }
}

class ValidationError extends Error { /*...*/ }
class PropertyRequiredError extends ValidationError { /* ... */ }

function validateUser(user) {
  if (!user.age) {
    throw new PropertyRequiredError("age");
  }

  if (!user.name) {
    throw new PropertyRequiredError("name");
  }
}

function readUser(json) {
  let user;

  try {
    user = JSON.parse(json);
  } catch (err) {
*!*
    if (err instanceof SyntaxError) {
      throw new ReadError("Syntax Error", err);
    } else {
      throw err;
    }
*/!*
  }

  try {
    validateUser(user);
  } catch (err) {
*!*
    if (err instanceof ValidationError) {
      throw new ReadError("Validation Error", err);
    } else {
      throw err;
    }
*/!*
  }

}

try {
  readUser('{bad json}');
} catch (e) {
  if (e instanceof ReadError) {
*!*
    alert(e);
    // Haqiqiy error: SyntaxError: 1-pozitsiyada JSONda kutilmagan b tokeni
    alert("Original error: " + e.cause);
*/!*
  } else {
    throw e;
  }
}
```

Yuqoridagi kodda `readUser` aynan ta'riflanganidek ishlaydi -- sintaksis va tekshirish xatolarini ushlaydi va o'rniga `ReadError` xatolarini chiqaradi (noma'lum xatolar odatdagidek qaytadan ochiladi).

Shunday qilib, tashqi kod `Instanceof ReadError`ni tekshiradi va tamom. Barcha mumkin bo'lgan xato turlarini sanab o'tishga hojat yo'q.

Yondashuv "o'rash istisnolari" deb ataladi, chunki biz "past darajadagi" istisnolarni olamiz va ularni mavhumroq bo'lgan `ReadError` ga "o'raymiz". U obyektga yo'naltirilgan dasturlashda keng qo'llaniladi.

## Xulosa

- Biz odatda `Error` va boshqa o'rnatilgan xato sinflaridan meros olishimiz mumkin. Biz faqat `name` xususiyati haqida o'ylashimiz va `super` ni chaqirishni unutmasligimiz lozim.
- Muayyan xatolarni tekshirish uchun `instanceof` dan foydalanishimiz mumkin. U meros bilan ham ishlaydi. Ammo ba'zida bizda uchinchi tomon kutubxonasidan xatolik obyekti paydo bo'ladi va uning sinfini olishning oson yo'li yo'q. Keyin bunday tekshiruvlar uchun `name` xususiyatidan foydalaniladi.
- Istisnolarni o'rash keng tarqalgan texnikadir: funksiya past darajadagi istisnolarni boshqaradi va turli xil past darajadagi xatolar o'rniga yuqori darajadagi xatolar yaratadi. Yuqoridagi misollarda past darajadagi istisnolar ba'zan `err.cause` kabi obyektning xususiyatlariga aylanadi, lekin bu qat'iy talab qilinmaydi.
