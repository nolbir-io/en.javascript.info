
# Promise'lar bilan error'larni nazorat qilish

Promise zanjirlari xatolarni hal qilishda juda yaxshi. Promise rad etilganda, boshqaruv eng yaqin rad etish ishlovchisiga o'tadi. Bu amalda ancha qulay.

Misol uchun, quyidagi kodda `fetch` URL manzili noto'g'ri kiritilgan (bunday sayt yo'q) va `.catch` errorni hal qiladi:

```js run
*!*
fetch('https://no-such-server.blabla') // rad qiladi
*/!*
  .then(response => response.json())
  .catch(err => alert(err)) // TypeError: olib bo'lmadi (matn farq qilishi mumkin)
```

Ko'rib turganingizdek, `.catch` darhol ishlashi shart emas. U bir yoki bir nechta `.then` dan keyin paydo bo'lishi mumkin.

Ehtimol, saytda hamma narsa yaxshi, lekin javob JSON haqiqiy emas. Barcha xatolarni aniqlashning eng oson yo'li zanjir oxiriga `.catch` qo'shishdir:

```js run
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise((resolve, reject) => {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser);
    }, 3000);
  }))
*!*
  .catch(error => alert(error.message));
*/!*
```

Odatda, bunday `.catch` umuman ishga tushmaydi. Yuqoridagi va'dalardan birortasi (tarmoq muammosi yoki noto'g'ri json yoki boshqasi) rad etilsa, u buni ushlaydi.

## Yashirin try..catch

Promiseni bajaruvchi va promiseni bajaruvchilarning kodi atrofida "ko'rinmas `try..catch`" mavjud. Agar istisno sodir bo'lsa, u qo'lga olinadi va rad etish sifatida qabul qilinadi.

Masalan, quyidagi kodga e'tibor bering:
```js run
new Promise((resolve, reject) => {
*!*
  throw new Error("Whoops!");
*/!*
}).catch(alert); // Error: Whoops!
```

...Bu xuddi shunday ishlaydi:

```js run
new Promise((resolve, reject) => {
*!*
  reject(new Error("Whoops!"));
*/!*
}).catch(alert); // Error: Whoops!
```

Ijrochi atrofidagi "ko'rinmas `try..catch` avtomatik ravishda xatoni ushlaydi va uni rad etilgan promise ga aylantiradi.

Bu nafaqat ijrochi funksiyada, balki uning ishlov beruvchilarida ham sodir bo'ladi. Agar biz `.then` ishlov beruvchisiga `throw` qilsak, bu rad etilgan promise ni bildiradi, shuning uchun boshqaruv eng yaqin xato ishlov beruvchisiga o'tadi.

Mana bir misol:

```js run
new Promise((resolve, reject) => {
  resolve("ok");
}).then((result) => {
*!*
  throw new Error("Whoops!"); //promise ni rad etadi
*/!*
}).catch(alert); // Error: Whoops!
```

Bu faqat `throw` iborasidan kelib chiqqan errorlar uchun emas, balki barcha errorlar uchun sodir bo'ladi. Masalan, dasturlashdagi error:

```js run
new Promise((resolve, reject) => {
  resolve("ok");
}).then((result) => {
*!*
  blabla(); // bunday funksiya yo'q
*/!*
}).catch(alert); // ReferenceError: blabla aniqlanmagan
```

Yakuniy `.catch` nafaqat aniq rad etishlarni, balki yuqoridagi ishlovchilardagi tasodifiy xatolarni ham ushlaydi.

## Rethrowing

Biz allaqachon payqaganimizdek, zanjir oxiridagi `.catch` `try..catch`ga o'xshaydi. Bizda xohlagancha `.then` ishlov beruvchilari bo'lishi mumkin, so'ngra ularning barchasidagi xatolarni qayta ishlash uchun oxirida bitta `.catch` dan foydalanamiz.

Muntazam `try..catch` da biz xatoni tahlil qilishimiz va agar uni hal qilib bo'lmasa, uni qaytadan o'tkazishimiz mumkin. Xuddi shu narsa promise'lar uchun ham mumkin.

Agar biz `.catch` ichiga `throw`qilsak, boshqaruv keyingi eng yaqin xato ishlov beruvchisiga o'tadi. Va agar biz xatoni hal qilsak va normal tugatsak, u keyingi eng yaqin muvaffaqiyatli `.then` ishlov beruvchisi bilan davom etadi.

Quyidagi misolda `.catch` errorni muvaffaqiyatli hal qiladi:

```js run
// bajarish: catch -> then
new Promise((resolve, reject) => {

  throw new Error("Whoops!");

}).catch(function(error) {

  alert("Error hal qilindi, normal davom etadi");

}).then(() => alert("Keyingi muvaffaqiyatli ishlov beruvchi ishlaydi"));
```

Bu yerda `.catch` bloki odatdagidek tugaydi. Shunday qilib, keyingi muvaffaqiyatli `.then` ishlov beruvchisi chaqiriladi.

Quyidagi misolda biz `.catch` bilan boshqa vaziyatni ko'ramiz. `(*)` ishlov beruvchisi xatoni ushlaydi va uni hal qila olmaydi (masalan, u faqat `URIError`ni qanday boshqarishni biladi), shuning uchun uni yana "throw" qiladi: 

```js run
// the execution: catch -> catch
new Promise((resolve, reject) => {

  throw new Error("Whoops!");

}).catch(function(error) { // (*)

  if (error instanceof URIError) {
    // handle it
  } else {
    alert("bunday errorni nazorat qilolmaydi");

*!*
    throw error; // u yoki boshqa errorni throw qilish keyingi catch ga o'tadi
*/!*
  }

}).then(function() {
  /* bu yerda ishlamaydi */
}).catch(error => { // (**)

  alert(`Noma'lum error sodir bo'ldi: ${error}`);
  //hech narsa qaytarmaydi => bajarish odatdagidek ketadi
});
```

Bajarish zanjir bo'ylab birinchi `.catch` `(*)`dan keyingi `(**)`ga o'tadi.

## Ko'rib chiqilmagan rejection lar, ya'ni rad etishlar
Xatoga ishlov berilmasa nima bo'ladi? Masalan, biz zanjir oxiriga `.catch` qo'shishni unutib qo'ydik:

```js untrusted run refresh
new Promise(function() {
  noSuchFunction(); // Bu yerda error (bunday funksiya yo'q)
})
  .then(() => {
    // muvaffaqiyatli promise ishlovchilar, bir yoki bir nechta
   }); // oxirida .catch bloki yo'q!
```

Error mavjud bo'lsa, promise rad etiladi va ijro eng yaqin rad etish ishlovchisiga o'tishi kerak. Lekin u bu yerda yo'q. Shunday qilib, xato "tiqilib qoladi". Uni boshqarish uchun kod mavjud emas.

Amalda, xuddi koddagi muntazam ishlov berilmagan errorlar kabi, bu holat nimadir noto'g'ri bajarilganligini anglatadi.

Muntazam xatolik yuz bersa va `try..catch` ushlanmasa nima bo'ladi? Skript konsoldagi xabar bilan o'ladi. Shunga o'xshash narsa bajarilmagan promise larni rad etish bilan sodir bo'ladi.

JavaScript mexanizmi bunday rad etishlarni kuzatib boradi va u holda global xatolik hosil qiladi. Yuqoridagi misolni ishlatsangiz, uni konsolda ko'rishingiz mumkin. 

Brauzerda biz bunday xatolarni `unhandledrejection` hodisasi yordamida aniqlashimiz mumkin:

```js run
*!*
window.addEventListener('unhandledrejection', function(event) {
  // hodisa obyekti ikkita maxsus xususiyatga ega:
  alert(event.promise); // [object Promise] - errorga sabab bo'lgan promise
  alert(event.reason); // Error: Whoops! - ishlov berilmagan error obyekti
});
*/!*

new Promise(function() {
  throw new Error("Whoops!");
}); // errorni hal qilish uchun hech qanday catch yo'q
```
Tadbir `[HTML standarti]`ning bir qismidir (https://html.spec.whatwg.org/multipage/webappapis.html#unhandled-promise-rejections).

Agar error yuzaga kelsa va `.catch` bo'lmasa, `unhandledrejection` ishlov beruvchisi ishga tushadi va error haqidagi ma'lumotga ega `event` obyektini oladi, shuning uchun biz biror narsa qilishimiz mumkin.

Odatda bunday errorlarni tuzatib bo'lmaydi, shuning uchun eng yaxshi yechim foydalanuvchini muammo haqida xabardor qilish va muammo haqida serverga xabar berishdir.

Node.js kabi brauzer bo'lmagan muhitlarda ishlov berilmagan xatolarni kuzatishning boshqa usullari mavjud.

## Xulosa

- `.catch` turli promise'lardagi xatolarni ko'rib chiqadi: ular xoh `reject()` chaqiruvi, xoh ishlov beruvchida yuborilgan xato bo'lishi mumkin.
-  agar ikkinchi argument berilgan bo'lsa, `then` (bu error ishlov beruvchisi) xuddi shu tarzda errorlarni ushlaydi.
- Biz `.catch` ni errorlarlarni hal qilmoqchi bo'lgan va ularni qanday hal qilishni biladigan joylarga joylashtirishimiz kerak. Ishlovchi errorlarni tahlil qilishi kerak (xususiy xatolik sinflari yordam beradi) va noma'lumlarni qayta o'rnatishi kerak (ehtimol ular dasturlash xatolaridir).
-Xatoni tiklashning iloji bo'lmasa, `.catch` dan umuman foydalanmaslik normal holat.
- Qanday bo'lmasin, bizda ishlov berilmagan errorlarni kuzatish va foydalanuvchini (va ehtimol bizning serverimizni) xabardor qilish uchun `unhandledrejection` hodisasi ishlov beruvchisi (brauzerlar uchun va boshqa muhitlar uchun analoglar) bo'lishi kerak, shunda bizning ilovamiz hech qachon "o'lib qolmaydi".
