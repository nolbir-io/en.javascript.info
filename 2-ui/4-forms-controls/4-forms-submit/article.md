# Shakllar: hodisa va usulni yuborish

Shakl yuborilganda `submit` hodisasi ishga tushadi, odatda uni serverga yuborishdan oldin tekshirish yoki yuborishni bekor qilish va JavaScriptda qayta ishlash uchun ishlatiladi.

`form.submit()` usuli JavaScriptdan shakl yuborishni boshlash imkonini beradi. Biz undan dinamik ravishda o'z shakllarimizni yaratish va serverga yuborish uchun foydalanishimiz mumkin.

Keling, ularning batafsil tafsilotlarini ko'rib chiqaylik.

## Submit hodisasi

Shaklni topshirishning ikkita asosiy usuli mavjud:

1. Birinchisi -- `<input type="submit">` yoki `<input type="image">` tugmasini bosing.
2. Ikkinchisi -- kiritish maydonida `key:Enter` tugmasini bosing.

Ikkala harakat ham formadagi `submit` hodisasiga olib keladi. Ishlovchi ma'lumotlarni tekshirishi mumkin va agar xatolar mavjud bo'lsa, ularni ko'rsating va `event.preventDefault()` ni chaqiring, keyin shakl serverga yuborilmaydi.

Quyidagi shaklda:
1. Matn maydoniga o'ting va `key:Enter` tugmasini bosing.
2. `<input type="submit">` tugmasini bosing.

Har ikkala amalda ham `alert` ko‘rsatiladi va `return false` tufayli shakl hech qayerga yuborilmaydi:

```html autorun height=60 no-beautify
<form onsubmit="alert('submit!');return false">
  First: Enter in the input field <input type="text" value="text"><br>
  Second: Click "submit": <input type="submit" value="Submit">
</form>
```

````smart header="`submit` va `click` o'rtasidagi munosabat`"
Shakl kiritish maydonida `key:Enter` yordamida yuborilganda, `<input type="submit">`da `click` hodisasi ishga tushadi.

Bu juda kulgili, chunki hech qanday click yo'q edi.

Mana demo:
```html autorun height=60
<form onsubmit="return false">
 <input type="text" size="30" value="Focus here and press enter">
 <input type="submit" value="Submit" *!*onclick="alert('click')"*/!*>
</form>
```

````

## Submit usui

Shaklni serverga qo'lda yuborish uchun `form.submit()` ni chaqirishimiz mumkin.

Keyin `submit` hodisasi yaratilmaydi. Agar dasturchi `form.submit()` ni chaqirsa, skript barcha tegishli ishlovlarni allaqachon bajargan deb tahmin qilinadi.

Ba'zan bu shaklni qo'lda yaratish va yuborish uchun ishlatiladi, masalan:

```js run
let form = document.createElement('form');
form.action = 'https://google.com/search';
form.method = 'GET';

form.innerHTML = '<input name="q" value="test">';

// shakl uni topshirish uchun document da bo'lishi kerak
document.body.append(form);

form.submit();
```
