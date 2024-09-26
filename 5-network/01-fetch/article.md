
# Fetch

JavaScript serverga tarmoq so'rovlarini yubora oladi va kerak bo'lganda yangi ma'lumotlarni yuklashi mumkin.

Misol uchun, biz tarmoq so'rovidan quyidagi maqsadlarda foydalanishimiz mumkin:

- Buyurtma berish,
- Foydalanuvchi ma'lumotlarini yuklash,
- Serverdan so'nggi yangilanishlarni olish,
- ...va boshqalar.

...Va bularning barchasi sahifani qayta yuklamasdan bajariladi!

JavaScriptdagi tarmoq so'rovlari uchun "AJAX" (qisqartirilgan <b>A</b>sinxron <b>J</b>avaScript <b>A</b>nd <b>X</b>ML) atamasi mavjud. Biz XML dan foydalanishimiz shart emas: bu atama qadimgi davrlarda paydo bo'lgan, shuning uchun bu so'z mavjud. Siz bu atamani allaqachon eshitgan bo'lishingiz mumkin.

Tarmoq so'rovini yuborish va serverdan ma'lumot olishning bir necha yo'li mavjud.

`Fetch()` usuli zamonaviy va ko'p qirralidir, shuning uchun biz undan boshlaymiz. Bu eski brauzerlar tomonidan qo'llab-quvvatlanmaydi (polyfilled bo'lishi mumkin), lekin zamonaviy brauzerlar orasida juda yaxshi foydalaniladi.

Asosiy sintaksis:

```js
let promise = fetch(url, [options])
```

- **`url`** -- kirish uchun URL.
- **`options`** -- ixtiyoriy parametrlar: usul, sarlavhalar va boshqalar.

`options`, ya'ni variantlarsiz bu oddiy GET so'rovi bo'lib, `url` mazmunini yuklab oladi.

Brauzer so'rovni darhol boshlaydi va natijani olish uchun qo'ng'iroq kodi foydalanishi kerak bo'lgan promiseni qaytaradi.

Javob olish odatda ikki bosqichli jarayondir.

**Birinchidan, `fetch` orqali qaytarilgan `promise` o'rnatilgan [Response](https://fetch.spec.whatwg.org/#response-class) classning obyekti bilan hal qilinadi, server sarlavhalar bilan javob beradi.**

Ushbu bosqichda biz HTTP holatini tekshirishimiz mumkin, u muvaffaqiyatliligini bilish uchun, sarlavhalarni tekshiring, lekin u hali tanaga ega emas.

Agar `fetch` HTTP so'rovini amalga oshira olmasa, promise rad etiladi, masalan, tarmoq muammolari yoki bunday sayt yo'q. 404 yoki 500 kabi g'ayritabiiy HTTP holatlari xatolikka olib kelmaydi.

Javob xususiyatlarida HTTP holatini ko'rishimiz mumkin:

- **`status`** -- HTTP holat kodi, masalan, 200.
- **`ok`** -- boolean, agar HTTP holat kodi 200-299 bo'lsa, `true`.

Masalan:

```js
let response = await fetch(url);

if (response.ok) { // agar HTTP holati 200-299 bo'lsa
  // javob organini oling (usul quyida tavsiflangan)
  let json = await response.json();
} else {
  alert("HTTP-Error: " + response.status);
}
```

**Ikkinchidan, javob tanasini olish uchun qo'shimcha chaqiruv usulidan foydalanishimiz kerak.**

`Response` turli formatlarda tanaga kirish uchun promisega asoslangan bir nechta usullarni taqdim etadi:

- **`response.text()`** -- javobni o'qish va matn sifatida qaytarish
- **`response.json()`** -- javobni JSON sifatida tahlil qilish,
- **`response.formData()`** -- javobni `FormData` obyekti sifatida qaytarishs ([keyingi bobda tushuntirilgan] (ma'lumot:formdata))
- **`response.blob()`** -- javobni [Blob](info:blob) sifatida qaytarish (ikkilik sanoq sistemasidagi ma'lumotlar),
- **`response.arrayBuffer()`** -- javobni [ArrayBuffer] (info:arraybuffer-binary-arrays) sifatida qaytarish (ikkilik ma'lumotlarning past darajadagi namoyishi),
- qo'shimcha ravishda, `response.body` [ReadableStream](https://streams.spec.whatwg.org/#rs-class) obyekti ham mavjud bo'lib, u tanani bo'lakma-bo'lak o'qish imkonini beradi, keyinroq bunga doir misollar ko'ramiz.

Masalan, GitHubdan so'nggi topshiriqlarga ega JSON obyektini olaylik:

```js run async
let url = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';
let response = await fetch(url);

*!*
let commits = await response.json(); // javob tanasini o'qing va JSON sifatida tahlil qiling
*/!*

alert(commits[0].author.login);
```

Yoki `await`siz ham xuddi shunday, vazifani sof promiselar sintaksisi yordamida bajarish mumkin:

```js run
fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits')
  .then(response => response.json())
  .then(commits => alert(commits[0].author.login));
```

Javob matnini olish uchun `.json()` o'rniga `wait response.text()` ni tanlang:

```js run async
let response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits');

let text = await response.text(); // javob matnini matn sifatida o'qing

alert(text.slice(0, 80) + '...');
```

Ikkilik formatda ko'rgazmani o'qish uchun [`fetch` spetsifikatsiyasi](https://fetch.spec.whatwg.org) logotipi tasvirini olib ko'ramiz va ko'rsatish uchun ([Blob](info:blob) bo'limiga qarang. `Blob` da operatsiyalar haqida ma'lumot berilgan):

```js async run
let response = await fetch('/article/fetch/logo-fetch.svg');

*!*
let blob = await response.blob(); // Blob obyekti sifatida yuklab oling
*/!*

// Buning uchun <img> yarating
let img = document.createElement('img');
img.style = 'position:fixed;top:10px;left:10px;width:100px';
document.body.append(img);

// buni ko'rsating
img.src = URL.createObjectURL(blob);

setTimeout(() => { // uch sekunddan so'ng yashiring
  img.remove();
  URL.revokeObjectURL(img.src);
}, 3000);
```

````warn
Biz tanani o'qishning faqat bitta usulini tanlashimiz mumkin.

Agar `response.text()` bilan javob olgan bo'lsak, u holda `response.json()` ishlamaydi, chunki asosiy tarkib allaqachon qayta ishlangan.

```js
let text = await response.text(); // iste'mol qilingan javob tanasi
let parsed = await response.json(); // fail bo'ladi (allaqachon iste'mol qilingan)
```
````

## Javob sarlavhalari

Javob sarlavhalari `response.headers` da xaritaga o'xshash sarlavhalar obyektida bor.

Bu aynan xarita emas, lekin unda alohida sarlavhalarni nomi bo'yicha olish yoki ularni takrorlashning o'xshash usullari mavjud:

```js run async
let response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits');

// bitta sarlavha oling
alert(response.headers.get('Content-Type')); // application/json; charset=utf-8

// barcha sarlavhalar bo'ylab takrorlang
for (let [key, value] of response.headers) {
  alert(`${key} = ${value}`);
}
```

## So'roq sarlavhalari

`Fetch` da so'rov sarlavhasini o'rnatish uchun `headers` opsiyasidan foydalanishimiz mumkin. Unda quyidagi kabi chiquvchi sarlavhali obyekt mavjud:

```js
let response = fetch(protectedUrl, {
  headers: {
    Authentication: 'secret'
  }
});
```

...Lekin [`forbidden HTTP headers`] (https://fetch.spec.whatwg.org/#forbidden-header-name) ta'qiqlangan sarlavhalar ro'yxatida, biz ularni o'rnata olmaymiz:

- `Accept-Charset`, `Accept-Encoding`
- `Access-Control-Request-Headers`
- `Access-Control-Request-Method`
- `Connection`
- `Content-Length`
- `Cookie`, `Cookie2`
- `Date`
- `DNT`
- `Expect`
- `Host`
- `Keep-Alive`
- `Origin`
- `Referer`
- `TE`
- `Trailer`
- `Transfer-Encoding`
- `Upgrade`
- `Via`
- `Proxy-*`
- `Sec-*`

Ushbu sarlavhalar to'g'ri va xavfsiz HTTPni ta'minlaydi, shuning uchun ular faqat brauzer tomonidan boshqariladi.

## POST so'rovlari (request)

`POST` so'rovi yoki boshqa usul bilan so'rov yuborish uchun biz `fetch` opsiyalaridan foydalanishimiz kerak:

- **`method`** -- HTTP-usuli, masalan, `POST`,
- **`body`** -- so'rov tanasi, ulardan biri:
  - qator (masalan, JSON bilan kodlangan),
  - `FormData` obyekti, ma'lumotlarni  `multipart/form-data` sifatida yuborish,
  - `Blob`/`BufferSource` ikkilik ma'lumotlarni yuborish uchun,
  - [URLSearchParams](info:url), kamdan-kam qo'llaniladigan `x-www-form-urlencoded` kodlashda ma'lumotlarni yuborish.

Ko'pincha JSON formati ishlatiladi.

Masalan, ushbu kod `user` obyektini JSON sifatida taqdim etadi:

```js run async
let user = {
  name: 'John',
  surname: 'Smith'
};

*!*
let response = await fetch('/article/fetch/post/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(user)
});
*/!*

let result = await response.json();
alert(result.message);
```

Esda tuting, agar `body` so'rovi satr bo'lsa, `Content-Type` sarlavhasi sukut bo'yicha `text/plain;charset=UTF-8` ga o'rnatiladi.

Lekin, biz JSON yubormoqchi bo'lganimizda, biz JSON kodlangan ma'lumotlar uchun to'g'ri `Content-Type` ni `application/json` yuborish uchun `headers` variantidan foydalanamiz. 

## Rasm yuborish

Shuningdek, biz ikkilik ma'lumotlarni `Fetch` yordamida `Blob` yoki `BufferSource` obyektlari yordamida yuborishimiz mumkin.

Ushbu misolda `<canvas>` mavjud bo'lib, biz uning ustiga sichqonchani siljitish orqali chizishimiz mumkin. "Submit" tugmasini bosish tasvirni serverga yuboradi: 

```html run autorun height="90"
<body style="margin:0">
  <canvas id="canvasElem" width="100" height="80" style="border:1px solid"></canvas>

  <input type="button" value="Submit" onclick="submit()">

  <script>
    canvasElem.onmousemove = function(e) {
      let ctx = canvasElem.getContext('2d');
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };

    async function submit() {
      let blob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));
      let response = await fetch('/article/fetch/post/image', {
        method: 'POST',
        body: blob
      });

      // server tasdiqlash va tasvir hajmi bilan javob beradi
      let result = await response.json();
      alert(result.message);
    }

  </script>
</body>
```

Esda tuting, biz bu yerda `Content-Type` sarlavhasini qo'lda o'rnatmaymiz, chunki `Blob` obyekti o'rnatilgan turga ega (bu yerda `image/png` `toBlob` tomonidan yaratilgan). `Blob` obyektlari `Content-Type` qiymatiga aylanadi.

`Submit()` funksiyasi `async/await`siz qayta yozilishi mumkin:

```js
function submit() {
  canvasElem.toBlob(function(blob) {        
    fetch('/article/fetch/post/image', {
      method: 'POST',
      body: blob
    })
      .then(response => response.json())
      .then(result => alert(JSON.stringify(result, null, 2)))
  }, 'image/png');
}
```

## Xulosa

Oddiy fetch so'rovi ikkita `await` qo'ng'iroqlaridan iborat:

```js
let response = await fetch(url, options); // javob sarlavhalari bilan hal qiladi
let result = await response.json(); // json sifatida tanani o'qing
```

Yoki `await` siz bajaramiz:

```js
fetch(url, options)
  .then(response => response.json())
  .then(result => /* jarayon natijasi */)
```

Javob xususiyatlari:
- `response.status` -- Javobning HTTP kodi,
- `response.ok` -- `true`, agar holat 200-299 bo'lsa, 
- `response.headers` -- HTTP sarlavhalari bilan xaritaga o'xshash obyekt.

Javob tanasini olish usullari:
- **`response.text()`** -- javobni matn sifatida qaytarish,
- **`response.json()`** -- javobni JSON obyekti sifatida tahlil qilish,
- **`response.formData()`** -- javobni `FormData` obyekti sifatida qaytarish (`multipart/form-data` kodlash, keyingi bobda berilgan),
- **`response.blob()`** -- javobni [Blob](info:blob) sifatida qaytarish (ikkilik ma'lumotlar),
- **`response.arrayBuffer()`** -- javobni [ArrayBuffer] (info:arraybuffer-binary-arrays) (past darajadagi ikkilik ma'lumotlar) sifatida qaytarish

Hozir mavjud fetch variantlari:
- `method` -- HTTP-usuli,
- `headers` -- so'rov sarlavhalari bo'lgan obyekt (har qanday sarlavhaga ruxsat berilmaydi),
- `body` -- `string`, `FormData`, `BufferSource`, `Blob` yoki `UrlSearchParams` obyekti sifatida yuboriladigan (so'rov tanasi) ma'lumotlar.

Keyingi boblarda biz ko'proq variantlarni ko'ramiz va `fetch` holatlaridan foydalanamiz.
