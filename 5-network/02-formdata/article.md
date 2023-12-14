
# FormData

Ushbu bob HTML shakllarini yuborish haqida: fayllar bilan yoki fayllarsiz, qo'shimcha maydonlar bilan va hokazo.

Bunda [FormData](https://xhr.spec.whatwg.org/#interface-formdata) obyektlari yordam berishi mumkin. Siz taxmin qilganingizdek, bu HTML formasi ma'lumotlarini ko'rsatish obyektidir.

Konstruktor bu:
```js
let formData = new FormData([form]);
```

Agar HTML `form` elementi taqdim etilgan bo'lsa, u avtomatik ravishda o'z maydonlarini yozib oladi.

`FormData` ning o'ziga xos tomoni shundaki, `fetch` kabi tarmoq usullari `FormData` obyektini body sifatida qabul qilishi mumkin. U kodlangan va `Content-Type: multipart/form-data` bilan yuborilgan.

Server nuqtai nazaridan, bu odatiy shaklni yuborishga o'xshaydi.

## Oddiy form'ni yuborish

Avval oddiy form'ni yuboramiz.

Ko'rib turganingizdek, bu deyarli bitta chiziqli:

```html run autorun
<form id="formElem">
  <input type="text" name="name" value="John">
  <input type="text" name="surname" value="Smith">
  <input type="submit">
</form>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch('/article/formdata/post/user', {
      method: 'POST',
*!*
      body: new FormData(formElem)
*/!*
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

Ushbu misolda server kodi ko'rsatilmagan, chunki u bizning doiramizdan tashqarida. Server POST so'rovini qabul qiladi va "User saved", ya'ni "Foydalanuvchi saqlandi" deb javob beradi.

## FormData usullari

`FormData`dagi maydonlarni quyidagi usullar bilan o'zgartirishimiz mumkin:

- `formData.append(name, value)` - berilgan `name` va `value` bilan shakl maydonini qo'shing,
- `formData.append(name, blob, fileName)` - maydonni xuddi `<input type="file">` kabi qo'shing, uchinchi argument `fileName` fayl nomini belgilaydi (shakl maydoni nomi emas), chunki u foydalanuvchi fayl tizimidagi fayl nomi,
- `formData.delete(name)` - berilgan `name` bilan maydonni olib tashlang,
- `formData.get(name)` - berilgan `name` bilan maydon qiymatini oling,
- `formData.has(name)` - agar berilgan `name` bilan maydon mavjud bo'lsa, `true` ni qaytaradi, aks holda `false`

Shakl texnik jihatdan bir xil `name` bilan ko'p maydonlarga ega bo'lishi mumkin, shuning uchun `append`, ya'ni qo'shish uchun bir nechta qo'ng'iroqlar yana bir xil nomdagi maydonlarni qo'shadi.

Bundan tashqari, `append` bilan bir xil sintaksisga ega `set` usuli ham mavjud. Farqi shundaki, 
`.set` berilgan `name` bilan barcha maydonlarni olib tashlaydi va keyin yangi maydonni qo'shadi. Shunday qilib, u `name` bilan faqat bitta maydon mavjudligiga ishonch hosil qiladi, qolganlari xuddi `append` ga o'xshaydi:

- `formData.set(name, value)`,
- `formData.set(name, blob, fileName)`.

Shuningdek, biz `for..of` tsiklidan foydalanib, formData maydonlarini takrorlashimiz mumkin:

```js run
let formData = new FormData();
formData.append('key1', 'value1');
formData.append('key2', 'value2');

// Key/value juftlarini ro'yxatlash
for(let [name, value] of formData) {
  alert(`${name} = ${value}`); // key1 = value1, then key2 = value2
}
```

## Shaklni fayl bilan yuborish

Shakl har doim `Content-Type: multipart/form-data` sifatida yuboriladi, bu kodlash fayllarni yuborish imkonini beradi. Shunday qilib, `<input type="file">` maydonlari ham odatdagi shaklni yuborish kabi yuboriladi.

Mana shunday shaklga misol:

```html run autorun
<form id="formElem">
  <input type="text" name="firstName" value="John">
  Picture: <input type="file" name="picture" accept="image/*">
  <input type="submit">
</form>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch('/article/formdata/post/user-avatar', {
      method: 'POST',
*!*
      body: new FormData(formElem)
*/!*
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

## Blob ma'lumotlari bilan shakl yuborish

<info:fetch> bobida ko'rganimizdek, dinamik ravishda yaratilgan ikkilik ma'lumotlarni yuborish oson, masalan, `Blob` tasviri kabi. Biz uni to'g'ridan-to'g'ri `fetch` parametri "tanasi" sifatida ta'minlashimiz mumkin.

Amalda esa ko'pincha rasmni alohida emas, balki formaning bir qismi sifatida qo'shimcha maydonlar, masalan, "name" va boshqa metama'lumotlar bilan yuborish qulay.

Bundan tashqari, serverlar odatda chala ikkilik ma'lumotlarni emas, balki ko'p qismli kodlangan shakllarni qabul qilish uchun ko'proq mos keladi.

Ushbu misol `<canvas>` dan rasmni boshqa maydonlar bilan birga `FormData` yordamida shakl sifatida yuboradi:

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
      let imageBlob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));

*!*
      let formData = new FormData();
      formData.append("firstName", "John");
      formData.append("image", imageBlob, "image.png");
*/!*    

      let response = await fetch('/article/formdata/post/image-form', {
        method: 'POST',
        body: formData
      });
      let result = await response.json();
      alert(result.message);
    }

  </script>
</body>
```

`Blob` tasviri qanday qo'shilganiga e'tibor bering:

```js
formData.append("image", imageBlob, "image.png");
```

Bu xuddi formada `<input type="file" name="image">` mavjuddek tuyiladi va tashrifchi o'z fayl tizimidan `imageBlob` (2-argument) ma'lumotlari bilan `"image.png"` (3-argument) nomli faylni taqdim etdi.

Server go'yo odatdagi shaklni yubormoqchidek forma ma'lumotlarini va faylni o'qiydi.

## Xulosa

[FormData](https://xhr.spec.whatwg.org/#interface-formdata) obyektlari HTML formasini yozib olish va uni `fetch` yoki boshqa tarmoq usuli yordamida yuborish uchun ishlatiladi.

Biz HTML shaklidan `new FormData(form)` yoki umuman formasiz obyekt yaratishimiz va keyin usullar bilan maydonlarni qo'shishimiz mumkin:

- `formData.append(name, value)`
- `formData.append(name, blob, fileName)`
- `formData.set(name, value)`
- `formData.set(name, blob, fileName)`

Bu erda ikkita o'ziga xos xususiyatga e'tibor qaratamiz:

1. `Set` usuli bir xil nomdagi maydonlarni olib tashlaydi, `append` esa yo‘q. Bu ularning orasidagi yagona farq hisoblanadi.
2. Faylni yuborish uchun 3 argumentli sintaksis kerak, oxirgi argument odatda `<input type="file">` uchun foydalanuvchi fayl tizimidan olinadigan fayl nomidir.

Quyida boshqa usullarni ko'rishimiz mumkin:

- `formData.delete(name)`
- `formData.get(name)`
- `formData.has(name)`

Bo'ldi, hammasi shu!
