# File va FileReader

[File](https://www.w3.org/TR/FileAPI/#dfn-file) obyekti `Blob` dan meros qilib olinadi va fayl tizimi bilan bog'liq imkoniyatlar bilan kengaytiriladi.

Uni olishning ikki yo'li bor.

Birinchisi, `Blob` ga o'xshash konstruktor mavjud:

```js
new File(fileParts, fileName, [options])
```

- **`fileParts`** -- Blob/BufferSource/String qiymatlari massivi.
- **`fileName`** -- fayl nomi qatori.
- **`options`** -- ixtiyoriy obyekt:
     - **`lastModified`** -- oxirgi modifikatsiyaning vaqt tamg'asi (butun sana).

Ikkinchidan, biz ko'pincha faylni `<input type="file">` yoki drag'n'drop yoki boshqa brauzer interfeyslaridan olamiz. Bunday holda, fayl ushbu ma'lumotni OS dan oladi.

`File` `Blob` dan meros bo'lgani uchun `File` obyektlari bir xil xususiyatlarga ega, shuningdek:
- `name` -- fayl nomi,
- `lastModified` -- oxirgi o'zgartirish vaqt tamg'asi.

Shunday qilib, `<input type="file">` dan `Fayl` obyektini olishimiz mumkin:

```html run
<input type="file" onchange="showFile(this)">

<script>
function showFile(input) {
  let file = input.files[0];

  alert(`File name: ${file.name}`); // e.g my.png
  alert(`Last modified: ${file.lastModified}`); // e.g 1552830408824
}
</script>
```

```smart
Kirish bir nechta fayllarni tanlashi mumkin, shuning uchun `input.files` ular bilan massivga o'xshash obyektdir. Bu yerda bizda faqat bitta fayl bor, shuning uchun biz `input.files[0]`ni olamiz.
```

## FileReader

[FileReader](https://www.w3.org/TR/FileAPI/#dfn-filereader) `Blob` (va shuning uchun ham `Fayl`) obyektlaridan ma'lumotlarni o'qish uchun yagona maqsad bo'lgan obyektdir.

U hodisalar yordamida ma'lumotlarni yetkazib beradi, chunki diskdan o'qish vaqt talab qilishi mumkin.

Konstruktor:

```js
let reader = new FileReader(); // argumentlar yo'q
```

Asosiy usullar:

- **`readAsArrayBuffer(blob)`** -- `ArrayBuffer` ikkilik formatdagi ma'lumotlarni o'qish.
- **`readAsText(blob, [encoding])`** -- ma'lumotlarni berilgan kodlash bilan matn qatori sifatida o'qing (sukut bo'yicha `utf-8`).
- **`readAsDataURL(blob)`** -- ikkilik ma'lumotlarni o'qing va uni base64 ma'lumotlar URL manzili sifatida kodlang.
- **`abort()`** -- operatsiyani bekor qilish.

`read*` usulini tanlash biz qaysi formatni afzal ko'rishimizga va ma'lumotlardan qanday foydalanishimizga bog'liq.

- `readAsArrayBuffer` -- ikkilik fayllar uchun, past darajadagi ikkilik operatsiyalarni bajarish uchun. Kesish kabi yuqori darajadagi operatsiyalar uchun `File` `Blob` dan meros qilib olinadi, shuning uchun biz ularni o'qimasdan to'g'ridan-to'g'ri chaqirishimiz mumkin.
- `readAsText` -- matnli fayllar uchun, string olishni xohlaganimizda foydalanamiz.
- `readAsDataURL` -- biz bu ma'lumotlarni `src` da `img` yoki boshqa teg uchun ishlatmoqchi bo'lganimizda ishlatamiz. Buning uchun <info:blob> bobida muhokama qilinganidek, faylni o'qishning muqobil varianti mavjud: `URL.createObjectURL(file)`.

O'qish davom etar ekan, mavjud eventlarni ko'rib chiqamiz:
- `loadstart` -- yuklash boshlandi.
- `progress` -- o'qish jarayonida sodir bo'ladi.
- `load` -- xato yo'q, o'qish tugallandi.
- `abort` -- `abort()` chaqirildi.
- `error` -- xatolik yuz berdi.
- `loadend` -- o'qish muvaffaqiyatli yoki muvaffaqiyatsiz yakunlandi.

O'qish tugagach, natijaga quyidagi tarzda kirishimiz mumkin:
- `reader.result` - natija (agar muvaffaqiyatli bo'lsa)
- `reader.error` - xato (agar muvaffaqiyatsiz bo'lsa).

Eng ko'p ishlatiladigan hodisalar aniq `load` va `error` dir.

Mana faylni o'qishga misol:

```html run
<input type="file" onchange="readFile(this)">

<script>
function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    console.log(reader.result);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}
</script>
```

```smart header="Bloblar uchun `FileReader`"
<info:blob> bobida aytib o'tilganidek, `FileReader` nafaqat fayllarni, balki har qanday bloblarni ham o'qiy oladi.

Biz undan blobni boshqa formatga aylantirish uchun foydalanishimiz mumkin:
- `readAsArrayBuffer(blob)` -- `ArrayBuffer` ga,
- `readAsText(blob, [kodlash])` -- qatorga (`TextDecoder`ga muqobil),
- `readAsDataURL(blob)` -- base64 ma'lumotlar URL manziliga.
```


```smart header="`FileReaderSync` veb ishchilarda mavjud"
Veb ishchilar uchun [FileReaderSync] (https://www.w3.org/TR/FileAPI/#FileReaderSync) deb nomlangan `FileReader` ning sinxron varianti ham mavjud.

Uning o'qish usullari `read*` hodisalarni yaratmaydi, balki oddiy funktsiyalar kabi natijani qaytaradi.

Bu faqat Web Worker ichida, chunki Web Workers-da fayllardan o'qish paytida mumkin bo'lgan sinxron qo'ng'iroqlardagi kechikishlar unchalik ahamiyatli emas. Ular sahifaga ta'sir qilmaydi.
```

## Xulosa

`File` obyektlari `Blob` dan meros bo'lib qoladi.

`Blob` usullari va xususiyatlaridan tashqari, `File` obyektlari `name` va `lastModified` xususiyatlariga, shuningdek, fayl tizimidan o'qish uchun ichki qobiliyatga ega. Biz odatda `<input>` yoki Drag'n'Drop hodisalari (`ondragend`) kabi foydalanuvchi kiritgan `File` obyektlarini olamiz.

`FileReader` obyektlari fayl yoki blobdan uchta formatdan birida o'qishi mumkin:
- String (`readAsText`).
- `ArrayBuffer` (`readAsArrayBuffer`).
- Ma'lumotlar url, baza-64 kodlangan (`readAsDataURL`).

Ko'p hollarda biz fayl mazmunini o'qishimiz shart emas. Bloblar bilan qilganimiz kabi, biz `URL.createObjectURL(file)` bilan qisqa url yaratishimiz va uni `<a>` yoki `<img>` ga belgilashimiz mumkin. Shu tarzda faylni yuklab olish yoki rasm sifatida, canvaning bir qismi sifatida ko'rsatishimiz mumkin va hokazo.

Agar biz `File` ni tarmoq orqali jo'natmoqchi bo'lsak, bu ham oson: `XMLHttpRequest` yoki `fetch` kabi tarmoq APIsi `File` obyektlarini tabiiy ravishda qabul qiladi.
