# XMLHttpRequest

`XMLHttpRequest` JavaScriptda HTTP so'rovlarini amalga oshirish imkonini beruvchi o'rnatilgan brauzer obyektidir.

Nomida "XML" so'zi bo'lishiga qaramay, u nafaqat XML formatida, balki har qanday ma'lumotlarda ham ishlashi mumkin. Biz fayllarni yuklash/yuklab olish, taraqqiyotni kuzatish va boshqa ko'p narsalarni qilishimiz mumkin.

Hozirda `XMLHttpRequest` ni biroz bekor qiladigan yana bir zamonaviy `fetch` usuli mavjud.

Zamonaviy veb-dasturlashda `XMLHttpRequest` uchta sababga ko'ra ishlatiladi:

1. Tarixiy sabablar: biz `XMLHttpRequest` bilan mavjud skriptlarni qo'llab-quvvatlashimiz kerak.
2. Biz eski brauzerlarni qo'llab-quvvatlashimiz kerak va polifilllardan foydalanmasligimiz lozim (skriptlarni mayda saqlash maqsadida).
3. Yuklash jarayonini kuzatish uchunBizga `fetch` hali qila olmaydigan narsa kerak.

Bu tanish tuyuladimi? Ha bo'lsa, `XMLHttpRequest` bilan davom eting. Aks holda, <info:fetch> sahifasiga tashrif buyuring.

## Asoslar

XMLHttpRequest ikkita ish rejimiga ega: sinxron va asinxron.

Keling, birinchi navbatda asinxronni ko'rib chiqaylik, chunki u ko'pchilik hollarda qo'llaniladi.

So'rovni bajarish uchun bizga 3 qadam kerak:

1. `XMLHttpRequest` yarating:
    ```js
    let xhr = new XMLHttpRequest();
    ```
    Konstruktorning argumentlari yo'q.

2. Uni `new XMLHttpRequest`dan keyin ishga tushiring:
    ```js
    xhr.open(method, URL, [async, user, password])
    ```

    Ushbu usul so'rovning asosiy parametrlarini belgilaydi:

     - `method` -- HTTP usuli. Odatda `"GET"` yoki `"POST"`.
     - `URL` -- so'rov uchun URL manzil, string, [URL](info:url) obyekti bo'lishi mumkin.
     - `async` -- agar aniq `false` o'rnatilgan bo'lsa, so'rov sinxron bo'ladi, biz buni birozdan keyin ko'rib chiqamiz.
     - `user`, `password` -- asosiy HTTP autentsiyasi uchun login va parol (agar kerak bo'lsa).

     E'tibor bering, `open` (ochiq) qo'ng'iroq, uning nomidan farqli o'laroq, ulanishni ochmaydi. U faqat so'rovni sozlaydi, lekin tarmoq faoliyati faqat `send` (yuborish) chaqiruvi bilan boshlanadi.

3. Uni yuboring.

    ```js
    xhr.send([body])
    ```

     Ushbu usul ulanishni ochadi va so'rovni serverga yuboradi. Ixtiyoriy `body` parametri so'rovning asosiy qismini o'z ichiga oladi.

     `GET` kabi ba'zi so'rov usullarida tana yo'q. Va ulardan ba'zilari `POST` kabi ma'lumotlarni serverga yuborish uchun `body` dan foydalanadi. Buning misollarini keyinroq ko'rib chiqamiz.

4. Javob uchun `xhr` hodisalarini tinglang.

     Ushbu uchta hodisa eng ko'p qo'llaniladi:
     - `load` -- so'rov tugallanganda (hatto HTTP holati 400 yoki 500 bo'lsa ham) va javob to'liq yuklab olinganda.
     - `error` -- so'rovni amalga oshirib bo'lmaganda, masalan, tarmoq ishlamay qolganda yoki URL yaroqsiz bo'lsa.
     - `progress` -- javob yuklanayotganda vaqti-vaqti bilan ishga tushadi, qancha yuklanganligi haqida xabar beradi.

    ```js
    xhr.onload = function() {
      alert(`Loaded: ${xhr.status} ${xhr.response}`);
    };

    xhr.onerror = function() { // faqat so'rov umuman amalga oshirilmasa, ishga tushadi
      alert(`Network Error`);
    };

    xhr.onprogress = function(event) { // davriy ravishda ishlaydi
      // event.loaded - qancha bayt yuklab olinganini ko'rsatadi
      // event.lengthComputable = server Content-Length sarlavhasini yuborgan bo'lsa true
      // event.total - baytlarning umumiy soni (agar uzunlik hisoblash mumkin bo'lsa)
      alert(`Received ${event.loaded} of ${event.total}`);
    };
    ```

Mana to'liq misol. Quyidagi kod URLni serverdan `/article/xmlhttprequest/example/load` manziliga yuklaydi va jarayonni chop etadi:

```js run
// 1. Yangi XMLHttpRequest obyektini yarating.
let xhr = new XMLHttpRequest();

// 2. Uni konfiguratsiyalang: /article/.../load uchun GET-so'rov
xhr.open('GET', '/article/xmlhttprequest/example/load');

// 3. So'rovni tarmoq orqali yuboring
xhr.send();

// 4. Bu javob olinganidan keyin chaqiriladi
xhr.onload = function() {
  if (xhr.status != 200) { // javobning HTTP holatini tahlil qilish
    alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
  } else { // natijani ko'rsating
    alert(`Done, got ${xhr.response.length} bytes`); // javob server javobidir
  }
};

xhr.onprogress = function(event) {
  if (event.lengthComputable) {
    alert(`Received ${event.loaded} of ${event.total} bytes`);
  } else {
    alert(`Received ${event.loaded} bytes`); // Kontent uzunligi yo'q
  }

};

xhr.onerror = function() {
  alert("Request failed");
};
```

Server javob bergandan so'ng, biz natijani quyidagi `xhr` xususiyatlarida olishimiz mumkin:

`status`
: HTTP status kodi (raqam): `200`, `404`, `403` and boshqalar, HTTP bo'lmagan xatolik holatida `0` bo'lishi mumkin.

`statusText`
: HTTP holat xabari (string): odatda `200` uchun `OK`, `404` uchun `Not Found`, `403` uchun `Forbidden` va hokazo.

`response` (eski skriptlar `responseText` dan foydalanishi mumkin)
: Server javob tanasi.

Tegishli xususiyatdan foydalanib, biz kutish vaqtini ham belgilashimiz mumkin:

```js
xhr.timeout = 10000; // ms da kutish vaqti, 10 soniya
```

Belgilangan vaqt ichida so'rov bajarilmasa, u bekor qilinadi va `timeout` hodisasi boshlanadi.

````smart header="URL qidiruv parametrlari"
URL manziliga `?name=value` kabi parametrlarni qo'shish va to'g'ri kodlashni ta'minlash uchun biz [URL](info:url) obyektidan foydalanishimiz mumkin:

```js
let url = new URL('https://google.com/search');
url.searchParams.set('q', 'test me!');

// 'q' parametri kodlangan
xhr.open('GET', url); // https://google.com/search?q=test+me%21
```

````

## Javob turi

Javob formatini sozlash uchun `xhr.responseType` xususiyatidan foydalanishimiz mumkin:

- `""` (default) -- string sifatida oling,
- `"text"` -- string sifatida oling,
- `"arraybuffer"` -- `ArrayBuffer` sifatida oling (ikkilik ma'lumotlar uchun <info:arraybuffer-binary-arrays> bo'limiga qarang),
- `"blob"` -- `Blob` sifatida oling (ikkilik ma'lumotlar uchun <info:blob> bo'limiga qarang),
- `"document"` -- XML hujjati (XPath va boshqa XML usullaridan foydalanishi mumkin) yoki HTML hujjati (qabul qilingan ma'lumotlarning MIME turiga asoslangan) sifatida oling.
- `"json"` -- JSON sifatida oling (avtomatik ravishda tahlil qilinadi).

Masalan, javobni JSON sifatida olamiz:

```js run
let xhr = new XMLHttpRequest();

xhr.open('GET', '/article/xmlhttprequest/example/json');

*!*
xhr.responseType = 'json';
*/!*

xhr.send();

// berilgan response {"message": "Hello, world!"}
xhr.onload = function() {
  let responseObj = xhr.response;
  alert(responseObj.message); // Hello, world!
};
```

```smart
Eski skriptlarda siz `xhr.responseText` va hatto `xhr.responseXML` xususiyatlarini ham topishingiz mumkin.

Ular string yoki XML hujjatini olish uchun tarixiy sabablarga ko'ra mavjud. Hozirgi kunda biz `xhr.responseType` formatini o'rnatishimiz va yuqorida ko'rsatilgandek `xhr.response` olishimiz kerak.
```

## Tayyor holatlar

`XMLHttpRequest` davom etar ekan, holatlar o'rtasida o'zgaradi. Joriy holatga `xhr.readyState` sifatida kirish mumkin.

Barcha shtatlar, [spetsifikatsiyada](https://xhr.spec.whatwg.org/#states) berilgan:

```js
UNSENT = 0; // boshlang'ich holati
OPENED = 1; // open chaqirildi
HEADERS_RECEIVED = 2; // javob sarlavhalari qabul qilindi
LOADING = 3; // javob yuklanmoqda (ma'lumotlar paketi qabul qilinadi)
DONE = 4; // so'rov to'liq
```

`XMLHttpRequest` obyekti ularni `0` -> `1` -> `2` -> `3` -> ... -> `3` -> `4` tartibda sayohat qiladi. `3` holati har safar ma'lumotlar paketi tarmoq orqali qabul qilinganda takrorlanadi.

Biz ularni `readstatechange` hodisasi yordamida kuzatishimiz mumkin:

```js
xhr.onreadystatechange = function() {
  if (xhr.readyState == 3) {
    // yuklanmoqda
  }
  if (xhr.readyState == 4) {
    // so'rov yakunlandi
  }
};
```

Siz `readstatechange` tinglovchilarini haqiqatdan ham eski kodda topishingiz mumkin, bu tarixiy sabablarga ko'ra mavjud, chunki `load` va boshqa hodisalar bo'lmagan vaqtlar bo'lgan. Hozirgi vaqtda `load/error/progress` ishlov beruvchilari uning eskirishiga sabab bo'ladi.

## Bekor qilish so'rovi

Biz istalgan vaqtda so'rovni bekor qilishimiz mumkin. `xhr.abort()` ga qo'ng'iroq buni amalga oshiradi:

```js
xhr.abort(); // so'rovni tugatish
```

Bu `abort` hodisasini ishga tushiradi va `xhr.status` `0` ga aylanadi.

## Sinxron so'rovlar

Agar `open` usulidagi uchinchi parametr `async` `false` ga o'rnatilgan bo'lsa, so'rov sinxron tarzda amalga oshiriladi.

Boshqacha qilib aytganda, JavaScriptni bajarish `send()` da pauza qilinadi va `alert` yoki `prompt` buyruqlari kabi javob olinganda davom etadi. 

Mana qayta yozilgan misol, `open` ning uchinchi parametri `false`:

```js
let xhr = new XMLHttpRequest();

xhr.open('GET', '/article/xmlhttprequest/hello.txt', *!*false*/!*);

try {
  xhr.send();
  if (xhr.status != 200) {
    alert(`Error ${xhr.status}: ${xhr.statusText}`);
  } else {
    alert(xhr.response);
  }
} catch(err) { // onerror o'rniga
  alert("Request failed");
}
```

Bu yaxshi ko'rinishi mumkin, ammo sinxron qo'ng'iroqlar kamdan-kam qo'llaniladi, chunki ular yuklash tugaguniga qadar sahifa ichidagi JavaScriptni bloklaydi. Ba'zi brauzerlarda aylantirish imkonsiz bo'lib qoladi. Agar sinxron qo'ng'iroq juda ko'p vaqt talab qilsa, brauzer "osilgan" veb-sahifani yopishni taklif qilishi mumkin.

`XMLHttpRequest` ning ko'plab ilg'or imkoniyatlari, masalan, boshqa domendan so'rov yuborish yoki vaqt tugashini belgilash, sinxron so'rovlar uchun mavjud emas. Bundan tashqari, siz ko'rib turganingizdek, rivojlanish ko'rsatkichi yo'q.

Bularning barchasi tufayli sinxron so'rovlar juda kam ishlatiladi, deyarli hech qachon ishlatilmasligi ham mumkim. Biz ular haqida boshqa gapirmaymiz.

## HTTP sarlavhalari

`XMLHttpRequest` javobdan mos sarlavhalarni yuborish va sarlavhalarni o'qish imkonini beradi.

HTTP sarlavhalari uchun 3 ta usul mavjud:

`setRequestHeader(name, value)`
: Berilgan `name` hamda `value` bilan so'rov sarlavhasini o'rnatadi.

    Masalan:

    ```js
    xhr.setRequestHeader('Content-Type', 'application/json');
    ```

    ```warn header="Sarlavhalar cheklovlari"
     Bir nechta sarlavhalar faqat brauzer tomonidan boshqariladi, masalan, `Referer` va `Host`.
     To'liq ro'yxat [spetsifikatsiyada] (https://xhr.spec.whatwg.org/#the-setrequestheader()-method) berilgan.

     `XMLHttpRequest` foydalanuvchi xavfsizligi va so'rovning to'g'riligi uchun ularni o'zgartirishga ruxsat etilmaydi.
    ```

    ````warn header="Sarlavhani olib tashlab bo‘lmadi"
    
     `XMLHttpRequest` ning yana bir o'ziga xos xususiyati shundaki, `setRequestHeader` ni bekor qilib bo'lmaydi.

     Sarlavha o'rnatilgandan so'ng, u o'rnatiladi. Qo'shimcha qo'ng'iroqlar sarlavhaga ma'lumot qo'shadi, uning ustiga yozilmaydi.

    Masalan:

    ```js
    xhr.setRequestHeader('X-Auth', '123');
    xhr.setRequestHeader('X-Auth', '456');

    // sarlavha quyidagicha bo'ladi:
    // X-Auth: 123, 456
    ```
    ````

`getResponseHeader(name)`
: Berilgan `name` bilan javob sarlavhasini oladi (`Set-Cookie` va `Set-Cookie2`dan tashqari).

    Masalan:

    ```js
    xhr.getResponseHeader('Content-Type')
    ```

`getAllResponseHeaders()`
: `Set-Cookie` va `Set-Cookie2` dan tashqari barcha javob sarlavhalarini qaytaradi.

    Sarlavhalar bitta qator sifatida qaytariladi, masalan:

    ```http
    Cache-Control: max-age=31536000
    Content-Length: 4260
    Content-Type: image/png
    Date: Sat, 08 Sep 2012 16:53:16 GMT
    ```

     Sarlavhalar orasidagi chiziq uzilishi har doim `"\r\n"` (OSga bog'liq emas), shuning uchun biz uni alohida sarlavhalarga osongina ajratishimiz mumkin. Nom va qiymat o'rtasidagi ajratuvchi har doim ikki nuqtadan keyin bo'sh joy qo'yiladi `": "`. Bu spetsifikatsiyada belgilangan.

     Shunday qilib, agar biz nom/qiymat juftliklari bo'lgan obyektni olishni istasak, biz biroz JSni kiritishimiz kerak.

     Shunga o'xshash (agar ikkita sarlavha bir xil nomga ega bo'lsa, ikkinchisi avvalgisining ustiga yoziladi deb hisoblaymiz):

    ```js
    let headers = xhr
      .getAllResponseHeaders()
      .split('\r\n')
      .reduce((result, current) => {
        let [name, value] = current.split(': ');
        result[name] = value;
        return result;
      }, {});

    // headers['Content-Type'] = 'image/png'
    ```

## POST, FormData

POST so'rovini yuborish uchun biz o'rnatilgan [FormData](mdn:api/FormData) obyektidan foydalanishimiz mumkin.

Sintaksis:

```js
let formData = new FormData([form]); // obyektni yaratadi, ixtiyoriy ravishda <form> dan to'ldiring
formData.append(name, value); // maydonni qo'shadi
```

Biz uni yaratamiz, ixtiyoriy ravishda formadan to'ldiramiz, agar kerak bo'lsa, qo'shimcha maydonlarni `append` qilamiz, ya'ni "qo'shamiz" va keyin:

1. `xhr.open('POST', ...)` – `POST` usulidan foydalaning.
2. Shaklni serverga yuborish uchun `xhr.send(formData)`.

Masalan:

```html run refresh
<form name="person">
  <input name="name" value="John">
  <input name="surname" value="Smith">
</form>

<script>
  // formadan FormDatani oldindan to'ldiring
  let formData = new FormData(document.forms.person);

  // yana bitta maydon qo'shing
  formData.append("middle", "Lee");

  // uni yuboring
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/article/xmlhttprequest/post/user");
  xhr.send(formData);

  xhr.onload = () => alert(xhr.response);
</script>
```

Shakl `multipart/form-data` kodlash bilan yuboriladi.

Agar bizga JSON ko'proq yoqsa, `JSON.stringify` va string sifatida yuboring.

Shunchaki `Content-Type: application/json` sarlavhasini o'rnatishni unutmang, server tomonidagi ko‘plab ramkalar u bilan JSONni avtomatik ravishda dekodlaydi:

```js
let xhr = new XMLHttpRequest();

let json = JSON.stringify({
  name: "John",
  surname: "Smith"
});

xhr.open("POST", '/submit')
xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

xhr.send(json);
```

`.send(body)` usuli juda hamma narsaga mos keladi. U deyarli har qanday `body`ni, shu jumladan, `Blob` va `BufferSource` obyektlarini yuborishi mumkin.

## Yuklash jarayoni

`Progress` hodisasi faqat yuklab olish bosqichida ishga tushadi.

Ya'ni: agar biz biror narsani `POST` qilsak, `XMLHttpRequest` avval ma'lumotlarimizni yuklaydi (so'rovning asosiy qismi), keyin javobni yuklab oladi.

Agar biz katta narsalarni yuklayotgan bo'lsak, biz yuklash jarayonini kuzatishdan ko'proq manfaatdormiz. Lekin `xhr.onprogress` bu yerda yordam bermaydi.

Yuklash hodisalarini kuzatish uchun faqat usullarisiz boshqa obyekt mavjud: `xhr.upload`.

U `xhr` ga o'xshash hodisalarni yaratadi, lekin `xhr.upload` ularni faqat yuklashda ishga tushiradi:

- `loadstart` -- yuklashni boshladi.
- `progress` -- yuklash paytida vaqti-vaqti bilan ishga tushadi.
- `abort` -- yuklash to'xtatildi.
- `error` -- HTTP bilan bog'liq bo'lmagan xato.
- `load` -- yuklash muvaffaqiyatli yakunlandi.
- `timeout` -- yuklash vaqti tugadi (agar `taymout` xususiyati o'rnatilgan bo'lsa).
- `loadend` -- yuklash muvaffaqiyatli yoki xato bilan yakunlandi.

Handlerlar uchun namuna:

```js
xhr.upload.onprogress = function(event) {
  alert(`Uploaded ${event.loaded} of ${event.total} bytes`);
};

xhr.upload.onload = function() {
  alert(`Yuklash muvaffaqiyatli yakunlandi.`);
};

xhr.upload.onerror = function() {
  alert(`Yuklash paytida xatolik yuz berdi: ${xhr.status}`);
};
```

Mana haqiqiy hayot misoli: fayl yuklanishi ko'rsatilgan jarayon:

```html run
<input type="file" onchange="upload(this.files[0])">

<script>
function upload(file) {
  let xhr = new XMLHttpRequest();

  // yuklash jarayonini kuzatish
*!*
  xhr.upload.onprogress = function(event) {
    console.log(`Uploaded ${event.loaded} of ${event.total}`);
  };
*/!*

  // trekning tugallanishi: ham muvaffaqiyatli yoki yo'q
  xhr.onloadend = function() {
    if (xhr.status == 200) {
      console.log("success");
    } else {
      console.log("error " + this.status);
    }
  };

  xhr.open("POST", "/article/xmlhttprequest/post/upload");
  xhr.send(file);
}
</script>
```

## O'zaro kelib chiqish so'rovlari

`XMLHttpRequest` [fetch] (info:fetch-crossorigin) bilan bir xil CORS siyosatidan foydalanib, o'zaro kelib chiqish so'rovlarini amalga oshirishi mumkin.

Xuddi `fetch` kabi, sukut bo'yicha u cookie fayllari va HTTP avtorizatsiyasini boshqa manbaga yubormaydi. Ularni yoqish uchun `xhr.withCredentials` ni `true` qilib belgilang:

```js
let xhr = new XMLHttpRequest();
*!*
xhr.withCredentials = true;
*/!*

xhr.open('POST', 'http://anywhere.com/request');
...
```

O'zaro kelib chiqish sarlavhalari haqida batafsil ma'lumot olish uchun <info:fetch-crossorigin> bobini ko'zdan kechiring.


## Xulosa

`XMLHttpRequest` bilan GET so'rovining odatiy kodi:

```js
let xhr = new XMLHttpRequest();

xhr.open('GET', '/my/url');

xhr.send();

xhr.onload = function() {
  if (xhr.status != 200) { // HTTP error?
    // handle error
    alert( 'Error: ' + xhr.status);
    return;
  }

  // javobni xhr.response dan oling
};

xhr.onprogress = function(event) {
  // taraqqiyot haqida hisobot
  alert(`Loaded ${event.loaded} of ${event.total}`);
};

xhr.onerror = function() {
  // HTTP bo'lmagan xatoni boshqarish (masalan, tarmoq uzilishi)
};
```

Haqiqatan ham ko'proq eventlar mavjud, [zamonaviy spetsifikatsiya](https://xhr.spec.whatwg.org/#events) ularni ro'yxatlaydi (hayot tsikli tartibida):

- `loadstart` -- so'rov boshlandi.
- `progress` -- javobning ma'lumotlar paketi keldi, hozirda butun javob tanasi `response` da berilgan.
- `abort` -- so'rov `xhr.abort()` chaqiruvi bilan bekor qilindi.
- `error` -- ulanishda xatolik yuz berdi, masalan, noto'g'ri domen nomi. 404 kabi HTTP-xatolar uchun bu sodir bo'lmaydi.
- `load` -- so'rov muvaffaqiyatli yakunlandi.
- `timeout` -- so'rov vaqt tugashi sababli bekor qilindi (faqat u o'rnatilgan bo'lsa sodir bo'ladi).
- `loadend` -- `load`, `error`, `timeout` yoki `abort` dan keyin ishga tushadi.

`Error`, `abort`, `timeout` va `load` hodisalari bir-birini istisno qiladi. Ulardan faqat bittasi sodir bo'lishi mumkin.

Eng ko'p ishlatiladigan hodisalar yukning tugallanishi (`load`), yuklanishning noto'g'riligi (`error`) yoki biz bitta `loadend` ishlov beruvchisidan foydalanishimiz va nima bo'lganini ko'rish uchun so'rov obyekti `xhr` xususiyatlarini tekshirishimiz mumkin.

Biz allaqachon boshqa `readstatechange` hodisani ko'rdik. Tarixiy jihatdan, u ancha avval, spetsifikatsiyalar hal bo'lishidan oldin paydo bo'lgan. Hozirgi vaqtda uni ishlatishning hojati yo'q, biz uni yangi hodisalar bilan almashtira olamiz, lekin uni ko'pincha eski skriptlarda topish mumkin.

Agar yuklashni maxsus kuzatishimiz kerak bo'lsa, `xhr.upload` obyektidagi xuddi shu voqealarni tinglashimiz kerak.
