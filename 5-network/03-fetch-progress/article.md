
# Fetch: Yuklab olish jarayoni
`Fetch` usuli *download*, ya'ni yuklab olish jarayonini kuzatish imkonini beradi.

Iltimos, diqqat qiling: hozirda `fetch` uchun *upload* jarayonini kuzatishning imkoni yo'q. Buning uchun [XMLHttpRequest](info:xmlhttprequest) dan foydalaning, biz buni keyinroq ko'rib chiqamiz.

Yuklab olish jarayonini kuzatish uchun biz `response.body` xususiyatidan foydalanishimiz mumkin. Bu `ReadableStream` -- bo'lajak tanani bo'laklar  bilan ta'minlaydigan maxsus obyekt. O'qilishi mumkin bo‘lgan oqimlar [Streams API](https://streams.spec.whatwg.org/#rs-class) spetsifikatsiyasida tasvirlangan.

`response.text()`, `response.json()` va boshqa usullardan farqli o'laroq, `response.body` o'qish jarayoni ustidan to'liq nazoratni ta`minlaydi va biz istalgan vaqtda qancha sarflanganligini hisoblashimiz mumkin.

Mana `response.body` javobini o'qiydigan kod eskizi:

```js
// response.json() va boshqa usullar o'rniga
const reader = response.body.getReader();

// tana yuklab olish paytida loop cheksiz 
while(true) {
  // done oxirgi bo'lak uchun true
  // qiymat - parchalardan iborat baytlar uchun Uint8Array
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  console.log(`Received ${value.length} bytes`)
}
```

`await reader.read()` chaqiruvining natijasi ikkita xususiyatga ega obyektdir:
- **`done`** -- `true` o'qish tugallanganda, aks holda `false`.
- **`value`** -- yozilgan bayt massivi: `Uint8Array`.

```smart
Streams API shuningdek, `for await..of` tsikli bilan `ReadableStream` orqali asinxron iteratsiyani tavsiflaydi, lekin u hali keng qo'llab-quvvatlanmaydi (qarang [brauzer muammolari](https://github.com/whatwg/streams/issues/778#issuecomment -461341033)), shuning uchun biz `while` tsiklidan foydalanamiz.
```

Yuklash tugaguniga qadar, ya'ni `done` `true` bo'lgunga qadar biz tsikldagi javob qismlarini olamiz.

Rivojlanishni qayd qilish uchun biz har bir qabul qilingan `value` fragmentining uzunligini hisoblagichga qo'shishimiz kerak.

Mana, javobni oladigan va konsoldagi taraqqiyotni qayd etadigan to'liq ish misoli va qo'shimcha tushuntirishlarni ko'rib chiqishimiz mumkin:

```js run async
// 1-qadam: yuklashni boshlang va readerni oling
let response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits?per_page=100');

const reader = response.body.getReader();

// 2-qadam: umumiy uzunlikni oling
const contentLength = +response.headers.get('Content-Length');

// 3-qadam: ma'lumotlarni o'qing
let receivedLength = 0; //hozirda shuncha ko'p baytlarni qabul qilib oldi
let chunks = []; // Qabul qilingan ikkilik bo'laklar qatori (tanani o'z tarkibiga oladi)
while(true) {
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  chunks.push(value);
  receivedLength += value.length;

  console.log(`Received ${receivedLength} of ${contentLength}`)
}

// 4-qadam: bo'laklarni bitta Uint8Arrayga birlashtiring
let chunksAll = new Uint8Array(receivedLength); // (4.1)
let position = 0;
for(let chunk of chunks) {
	chunksAll.set(chunk, position); // (4.2)
	position += chunk.length;
}

// 5-qadam: satrga dekodlang
let result = new TextDecoder("utf-8").decode(chunksAll);

// Biz tugatdik!
let commits = JSON.parse(result);
alert(commits[0].author.login);
```

Keling, buni bosqichma-bosqich tushuntirib beraylik:

1. Biz odatdagidek `fetch` ni bajaramiz, lekin `response.json()` deb chaqirish o'rniga `response.body.getReader()` oqim o'quvchisini olamiz.

    E'tibor bering, biz bir xil javobni o'qish uchun ikkala usuldan ham foydalana olmaymiz: natijani olish uchun o'quvchi yoki javob usulidan foydalaning.
2. O'qishdan oldin biz `Content-Length` sarlavhasidan to'liq javob uzunligini aniqlashimiz mumkin.

    U o'zaro kelib chiqish so'rovlarida mavjud boʻlmasligi mumkin (<info:fetch-crossorigin> bobiga qarang) va texnik jihatdan server uni sozlashi shart emas. Ammo odatda u o'z joyida bo'ladi.
3. Ish tugaguniga qadar `await reader.read()` ga qo'ng'iroq qiling.

    Javob qismlarini `chunks` massivida yig'amiz. Bu juda muhim, chunki javob tugagach, biz uni `response.json()` yoki boshqa usul yordamida "qayta oʻqiy olmaymiz" (siz urinib ko'rishingiz mumkin, xatolik yuz beradi).
4. Oxirida bizda `chunks`, ya'ni bo'laklar mavjud -- ular `Uint8Array` bayt qismlari massivi. Biz ularni yagona natijaga qo'shishimiz kerak. Afsuski, ularni birlashtiradigan yagona usul yo'q, shuning uchun buni amalga oshiradigan ba'zi kodlardan foydalanamiz:
    1. Biz `chunksAll = new Uint8Array(receivedLength)` ni yaratamiz -- birlashtirilgan uzunlikdagi bir xil turdagi massiv.
    2. Keyin `.set(chunk, position)` usulidan foydalanib, undagi har bir `chunk` dan birin-ketin nusxa ko'chiramiz.
5. Bizda `chunksAll`da natija bor. Bu satr emas, balki bayt massividir.

    String yaratish uchun biz ushbu baytlarni sharhlashimiz kerak. O'rnatilgan [TextDecoder](info:text-decoder) aynan shunday qiladi. Agar kerak bo'lsa, biz uni `JSON.parse` qilishimiz mumkin.

    Agar bizga satr o'rniga ikkilik tarkib kerak bo'lsachi? Bu yanada oddiyroq. 4 va 5-bosqichlarni barcha bo'laklardan `Blob` hosil qiluvchi bitta qator bilan almashtiring:
    ```js
    let blob = new Blob(chunks);
    ```

Oxirida biz natijaga ega bo'lamiz (string yoki blob sifatida, nima qulay bo'lishidan qat'iy nazar) va jarayondagi taraqqiyotni kuzatamiz.

Yana bir bor eslatib o'tamizki, bu *download* jarayoni uchun emas (`fetch` bilan endi b uning imkoni yo'q), undan faqat *download* jarayoni uchun foydalaniladi.

Bundan tashqari, agar o'lcham noma'lum bo'lsa, biz tsiklda `receivedLength` ni tekshirib, `chunks` xotirani to'ldirib yubormasligi uchun ma'lum chegaraga yetgandan so'ng uni sindirishimiz kerak. 