
# Promise zanjiri

Keling, <info:callbacks> bobida aytilgan muammoga qaytaylik: bizda birin-ketin bajarilishi kerak bo'lgan asinxron vazifalar ketma-ketligi mavjud - masalan, skriptlarni yuklash. Qanday qilib uni yaxshi kodlashimiz mumkin?

Promise'lar buni amalga oshirish uchun bir nechta retseptlar beradi.

Ushbu bobda biz promise zanjirini ko'rib chiqamiz.

Bu shunday ko'rinadi:

```js run
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000); // (*)

}).then(function(result) { // (**)

  alert(result); // 1
  return result * 2;

}).then(function(result) { // (***)

  alert(result); // 2
  return result * 2;

}).then(function(result) {

  alert(result); // 4
  return result * 2;

});
```

G'oya shundan iboratki, natija `.then` ishlov beruvchilar zanjiri orqali o'tadi.

Mana oqim:
1. Dastlabki promise 1 soniyada hal qilinadi `(*)`,
2. Keyin `.then` ishlov beruvchisi `(**)` deb ataladi, bu esa o'z navbatida yangi promise yaratadi (`2` qiymati bilan hal qilinadi).
3. Keyingi `then` `(***)` oldingisining natijasini oladi, uni qayta ishlaydi (ikki marta) va keyingi ishlov beruvchiga uzatadi.
4. ...va boshqalar.

Natija ishlov beruvchilar zanjiri bo'ylab uzatilganda, biz `alert`(ogohlantirish) qo'ng'iroqlari ketma-ketligini ko'rishimiz mumkin: `1` -> `2` -> `4`.

![](promise-then-chain.svg)

Hammasi ishlaydi, chunki `.then` ga har bir qo‘ng‘iroq yangi promise'ni qaytaradi, shuning uchun biz keyingi `.then`ni chaqira olamiz.

Ishlovchi qiymatni qaytarsa, u o'sha promise'ning natijasi bo'ladi, shuning uchun keyingi `.then` u bilan chaqiriladi.

**Klassik yangi boshlovchi error: texnik jihatdan biz bitta promise'ga ko'p `.then` qo'shishimiz mumkin. Bu zanjirband emas.**

Masalan:
```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});
```

Bu yerda qilgan ishimiz bir promise'ga bir nechta ishlovchilardir. Ular natijani bir-biriga o'tkazmaydi; Buning o'rniga ular mustaqil ravishda qayta ishlaydilar.

Mana rasm (yuqoridagi zanjir bilan solishtiring):

![](promise-then-many.svg)

Xuddi shu promise bo'yicha hamma `.then` bir xil natijaga erishadi -- bu promise'ning natijasi. Shunday qilib, yuqoridagi kodda barcha `alert` bir xil ko'rsatiladi: "1".

Amalda bizga bir promise uchun bir nechta ishlovchilar kamdan-kam hollarda kerak bo'ladi. Zanjirlash ko'proq qo'llaniladi.

## Promise'larni qaytarish

`.then(handler)` da ishlatiladigan ishlov beruvchi promise yaratishi va qaytarishi mumkin.

Bunday holda, keyingi ishlov beruvchilar u o'rnashguncha kutishadi va keyin uning natijasini olishadi.

Masalan:

```js run
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000);

}).then(function(result) {

  alert(result); // 1

*!*
  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => resolve(result * 2), 1000);
  });
*/!*

}).then(function(result) { // (**)

  alert(result); // 2

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) {

  alert(result); // 4

});
```

Bu yerda birinchi `.then` `1`ni ko'rsatadi va `(*)` qatorida `new promise(...)`ni qaytaradi. Bir soniyadan so'ng u hal qilinadi va natija (`resolve` argumenti, bu yerda `result * 2`) ikkinchi `.then` ning ishlov beruvchisiga uzatiladi. Bu ishlov beruvchi `(**)` qatorida joylashgan bo‘lib, u `2` ni ko‘rsatadi va xuddi shu ishni bajaradi.

Shunday qilib, chiqish avvalgi misoldagi kabi bo'ladi: 1 -> 2 -> 4, lekin endi `alert` qo'ng'iroqlari orasida 1 soniya kechikish bilan amalga oshadi.

Promise'larni qaytarish bizga asinxron harakatlar zanjirini yaratishga imkon beradi.

## Masalan: loadScript

Keling, skriptlarni ketma-ket yuklash uchun [oldingi bobda] (info:promise-basics#loadscript) va’da qilingan `loadScript` bilan ushbu xususiyatdan foydalanamiz:

```js run
loadScript("/article/promise-chaining/one.js")
  .then(function(script) {
    return loadScript("/article/promise-chaining/two.js");
  })
  .then(function(script) {
    return loadScript("/article/promise-chaining/three.js");
  })
  .then(function(script) {
    // skriptlarda e'lon qilingan funksiyalardan foydalaning
     // ular haqiqatan ham yuklanganligini ko'rsatish lozim
    one();
    two();
    three();
  });
```
Ushbu kodni o'q funktsiyalari bilan biroz qisqartirish mumkin:

```js run
loadScript("/article/promise-chaining/one.js")
  .then(script => loadScript("/article/promise-chaining/two.js"))
  .then(script => loadScript("/article/promise-chaining/three.js"))
  .then(script => {
    // skriptlar yuklangan bo'lsa, biz u yerda e'lon qilingan funktsiyalardan foydalanishimiz mumkin
    one();
    two();
    three();
  });
```

Bu yerda har bir `loadScript` qo'ng'irog'i va'dani qaytaradi va keyingi `.then` u hal qilinganda ishlaydi. Keyin u keyingi skriptni yuklashni boshlaydi. Shunday qilib, skriptlar birin-ketin yuklanadi.

Biz zanjirga ko'proq asinxron harakatlar qo'shishimiz mumkin. E'tibor bering, kod hali ham "tekis" - u o'ngga emas, pastga o'sadi. “Halokat piramidasi”ning belgilari yo‘q.

Texnik jihatdan biz har bir `loadScript` ga `.then` ni to'g'ridan-to'gri qo'shishimiz mumkin, masalan:

```js run
loadScript("/article/promise-chaining/one.js").then(script1 => {
  loadScript("/article/promise-chaining/two.js").then(script2 => {
    loadScript("/article/promise-chaining/three.js").then(script3 => {
      // bu funksiya script1, script2 va script3 oʻzgaruvchilariga kirish huquqiga ega
      one();
      two();
      three();
    });
  });
});
```

Bu kod xuddi shunday qiladi: 3 ta skriptni ketma-ket yuklaydi. Ammo u "o'ngga o'sadi". Shunday qilib, bizda callback'lar bilan bir xil muammo bor.

Promise'larni ishlata boshlagan odamlar ba'zan zanjirband qilishni bilishmaydi, shuning uchun ular buni shunday yozadilar. Umuman olganda, zanjirga ustunlik beriladi.

Ba'zan to'g'ridan-to'g'ri `.then` ni yozish yaxshi bo'ladi, chunki ichki o'rnatilgan funksiya tashqi doiraga kirish huquqiga ega. Yuqoridagi misolda eng ko'p o'rnatilgan callback `script1`, `script2`, `script3` barcha o'zgaruvchilarga kirish huquqiga ega. Ammo bu qoida emas, balki istisno.


````aqlli sarlavha="Thenables"(keyin bajarilishi mumkin narsalar)
Aniqroq qilib aytadigan bo'lsak, ishlov beruvchi aniq va'dani emas, balki "thenable" deb ataladigan obyektni - ".then" usuliga ega ixtiyoriy obyektni qaytarishi mumkin. Bu promise bilan bir xil munosabatda bo'ladi.

G'oya shundan iboratki, uchinchi tomon kutubxonalari o'zlarining "promise'ga mos" obyektlarini amalga oshirishadi. Ular kengaytirilgan usullar to'plamiga ega bo'lishi mumkin, lekin mahalliy promise'lar bilan ham mos kelishi mumkin, chunki ular ".then" ni amalga oshiradilar.

Mana "thenable" obyektiga misol:

```js run
class Thenable {
  constructor(num) {
    this.num = num;
  }
  then(resolve, reject) {
    alert(resolve); // function() { native code }
    // resolve with this.num*2 after the 1 second
    setTimeout(() => resolve(this.num * 2), 1000); // (**)
  }
}

new Promise(resolve => resolve(1))
  .then(result => {
*!*
    return new Thenable(result); // (*)
*/!*
  })
  .then(alert); // shows 2 after 1000ms
```

JavaScript `(*)` qatoridagi `.then` ishlov beruvchisi tomonidan qaytarilgan obyektni tekshiradi: agar unda `then` nomli chaqiriladigan usul bo`lsa, u argument sifatida `resolve`, `reject` mahalliy funksiyalarini ta`minlovchi bu usulni chaqiradi (shunga o`xshash ijrochiga) va ulardan biri chaqirilguncha kutadi. Yuqoridagi `resolve(2)` misolda 1 soniyadan keyin `(**)` chaqiriladi. Keyin natija zanjir bo'ylab pastga uzatiladi.

Bu xususiyat bizga `Promise` dan meros bo'lmasdan, maxsus obyektlarni promise zanjirlari bilan birlashtirish imkonini beradi.
````


## Kattaroq misol: fetch (olib kelish)

Frontend dasturlashda promise'lar ko'pincha tarmoq so'rovlari uchun ishlatiladi. Shunday qilib, keling, buning kengaytirilgan misolini ko'rib chiqaylik.

Biz masofaviy serverdan foydalanuvchi haqidagi ma'lumotlarni yuklash uchun [fetch](info:fetch) usulidan foydalanamiz. Unda [alohida boblarda](ma'lumot:fetch) yoritilgan ko'plab ixtiyoriy parametrlar mavjud, ammo asosiy sintaksis juda oddiy:

```js
let promise = fetch(url);
```

Bu `url` ga tarmoq so'rovini yuboradi va promise'ni qaytaradi. Masofaviy server sarlavhalar bilan javob berganda promise `response`(javob) obyekti *to'liq javob yuklab olinmasidan oldin* hal qilinadi.

To'liq javobni o'qish uchun biz `response.text()` usulini chaqirishimiz kerak: u to'liq matn masofaviy serverdan yuklab olinganda hal bo'ladigan va'dani qaytaradi va natijada o'sha matn mavjud hisoblanadi.

Quyidagi kod `user.json` ga so'rov yuboradi va uning matnini serverdan yuklaydi:

```js run
fetch('/article/promise-chaining/user.json')
  // .then masofaviy server javob berganida ishlaydi
  .then(function(response) {
    // answer.text() to'liq javob matni bilan hal qilinadigan yangi va'dani qaytaradi
    // qachonki u yuklanganda
    return response.text();
  })
  .then(function(text) {
    // ...and here's the content of the remote file
    alert(text); // {"name": "iliakan", "isAdmin": true}
  });
```

`Fetch` dan qaytarilgan `response` obyekti, shuningdek, masofaviy ma'lumotlarni o'qiydigan va JSON sifatida tahlil qiluvchi `response.json()` usulini ham o'z ichiga oladi. Bizning holatlarimizda bu yanada qulayroq, shuning uchun unga o'taylik.

Qisqartirish uchun strelka funksiyalaridan ham foydalanamiz:

```js run
// yuqoridagi kabi, lekin respond.json() masofaviy tarkibni JSON sifatida tahlil qiladi
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => alert(user.name)); // iliakan, foydalanuvchi nomi olindi
```

Endi yuklangan foydalanuvchi bilan nimadir qilaylik.

Masalan, biz GitHub-ga yana bitta so'rov yuborishimiz, foydalanuvchi profilini yuklashimiz va avatarni ko'rsatishimiz mumkin:

```js run
// user.json uchun so'rov yuboring
fetch('/article/promise-chaining/user.json')
  // Uni json sifatida yuklang
  .then(response => response.json())
  // GitHub-ga so'rov yuboring
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  // Javobni json sifatida yuklang
  .then(response => response.json())
  // Avatar tasvirini (githubUser.avatar_url) 3 soniya davomida ko'rsating (yoki uni animatsiyalashtiring, ya'ni jonlantiring)
  .then(githubUser => {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => img.remove(), 3000); // (*)
  });
```

Kod ishlaydi; tafsilotlar haqidagi sharhlarni ko'ring. Biroq, unda mumkin bo'lgan muammo bor, bu promise'lardan foydalanishni boshlaganlar uchun odatiy error hisoblanadi.

`(*)` qatoriga qarang: avatar koʻrsatilib, o'chirilgandan *keyin* qanday qilib biz biror narsa qilishimiz mumkin? Masalan, biz ushbu foydalanuvchini yoki boshqa biror narsani tahrirlash uchun shaklni ko'rsatmoqchimiz. Hozircha buning iloji yo'q.

Zanjirni uzaytirish uchun biz avatarni ko'rsatishni tugatgandan so'ng hal bo'ladigan promise'ni qaytarishimiz kerak.

Shunga o'xshash:

```js run
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
*!*
  .then(githubUser => new Promise(function(resolve, reject) { // (*)
*/!*
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
*!*
      resolve(githubUser); // (**)
*/!*
    }, 3000);
  }))
  // 3 soniyadan keyin ishga tushadi
  .then(githubUser => alert(`Quyidagi blokni ko'rsatishni yakunladi ${githubUser.name }`));
```

Ya'ni, `(*)` qatoridagi `.then` ishlov beruvchisi endi `setTimeout` `(**)` da `resolve(githubUser)` chaqiruvidan so'ng hal bo'ladigan yangi promise'ni qaytaradi. Zanjirdagi keyingi `.then` buni kutadi.

Yaxshi amaliyot sifatida, asenxron harakat har doim va'dani qaytarishi kerak. Bu undan keyin harakatlarni rejalashtirish imkonini beradi; zanjirni hozir kengaytirishni rejalashtirmasak ham, keyinroq kerak bo'lishi mumkin.

Va nihoyat, kodni qayta foydalanish mumkin bo'lgan funksiyalarga bo'lishimiz mumkin:

```js run
function loadJson(url) {
  return fetch(url)
    .then(response => response.json());
}

function loadGithubUser(name) {
  return loadJson(`https://api.github.com/users/${name}`);
}

function showAvatar(githubUser) {
  return new Promise(function(resolve, reject) {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-misoli";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser);
    }, 3000);
  });
}

// Bulardan foydalaning:
loadJson('/article/promise-chaining/user.json')
  .then(user => loadGithubUser(user.name))
  .then(showAvatar)
  .then(githubUser => alert(`Quyidagi blokni ko'rsatishni yakunladi ${githubUser.name}`));
  // ...
```

## Xulosa

Agar `.then` (yoki `catch/finally`, muhim emas) ishlov beruvchisi `promise`ni qaytarsa, zanjirning qolgan qismi hal bo'lguncha kutadi. Bu sodir bo'lganda, uning natijasi (yoki undagi error) keyin uzatiladi.

Mana toʻliq rasm:

![](promise-handler-variants.svg)
