# Change, input, cut, copy, paste hodisalari

Let's cover various events that accompany data updates. 

Keling, ma'lumotlar yangilanishi bilan bog'liq bo'lgan turli hodisalarni ko'rib chiqaylik.

## Hodisa: o'zgartirish (change)

`change` hodisasi element o'zgarishini tugatgandan so'ng boshlanadi.

Matn kiritish uchun bu hodisa fokusni yo'qotganda sodir bo'lishini anglatadi.

Misol uchun, biz quyidagi matn maydoniga yozayotganimizda -- hech qanday hodisa bo'lmaydi. Ammo biz fokusni boshqa joyga ko'chirsak, masalan, tugmani bossangiz -- `change` hodisasi yuz beradi:

```html autorun height=40 run
<input type="text" onchange="alert(this.value)">
<input type="button" value="Button">
```

Boshqa elementlar uchun: `select`, `input type=checkbox/radio` tanlov o'zgargandan so'ng darhol ishga tushadi:

```html autorun height=40 run
<select onchange="alert(this.value)">
  <option value="">Select something</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</select>
```
## Input hodisasi

`input` hodisasi har safar qiymat foydalanuvchi tomonidan o'zgartirilgandan keyin ishga tushadi.

Klaviatura hodisalaridan farqli o'laroq, u har qanday qiymat o'zgarishini, hatto klaviatura harakatlarini o'z ichiga olmaydi, masalan, sichqoncha bilan joylashtirish yoki matnni diktalash uchun nutqni aniqlashdan foydalanish. 

Masalan:

```html autorun height=40 run
<input type="text" id="input"> oninput: <span id="result"></span>
<script>
  input.oninput = function() {
    result.innerHTML = input.value;
  };
</script>
```

Agar biz `<input>` ning har bir modifikatsiyasini ko'rib chiqmoqchi bo'lsak, bu hodisa eng yaxshi tanlovdir.

Boshqa tomondan, `input` hodisasi klaviaturadan kiritishda va qiymat o'zgarishi bilan bog'liq bo'lmagan boshqa harakatlarda ishga tushmaydi, masalan, kiritish vaqtida `tugma:⇦` `tugma:⇨` strelka tugmachalarini bosish.

```smart header="`oninput` da hech narsaning oldini olish mumkin emas"``
`input` hodisasi qiymat o'zgartirilgandan keyin sodir bo'ladi.

Shuning uchun biz u yerda `event.preventDefault()` dan foydalana olmaymiz -- endi juda kech, hech qanday ta'sir bo'lmaydi.
```

## Cut, copy, paste hodisalari

Ushbu hodisalar qiymatni kesish/nusxalash/joylashtirishda sodir bo'ladi. 

Ular [ClipboardEvent](https://www.w3.org/TR/clipboard-apis/#clipboard-event-interfaces) sinfiga tegishli bo'lib, kesilgan/ko'pirilgan/joylashtirilgan ma'lumotlarga kirishni ta'minlaydi.  

Harakatni bekor qilish uchun `event.preventDefault()` dan ham foydalanishimiz mumkin, keyin hech narsa ko'chirilmaydi/joylashtirilmaydi.

Masalan, quyidagi kod barcha `cut/copy/paste` hodisalarini oldini oladi va biz kesish/nusxalash/qo'yishga harakat qilayotgan matnni ko'rsatadi: 

```html autorun height=40 run
<input type="text" id="input">
<script>
  input.onpaste = function(event) {
    alert("paste: " + event.clipboardData.getData('text/plain'));
    event.preventDefault();
  };

  input.oncut = input.oncopy = function(event) {
    alert(event.type + '-' + document.getSelection());
    event.preventDefault();
  };
</script>
```
Iltimos, diqqat qiling: `cut` va `copy` hodisalari ishlov beruvchilari ichida `event.clipboardData.getData(...)` ga qo'ng'iroq bo'sh qatorni qaytaradi. Buning sababi, texnik jihatdan ma'lumotlar hali buferda emas. Agar biz `event.preventDefault()` dan foydalansak, u umuman nusxalanmaydi.

Shunday qilib, yuqoridagi misol tanlangan matnni olish uchun `document.getSelection()` dan foydalanadi. Hujjat tanlash haqida batafsil ma'lumotni <info:selection-range> maqolasida topishingiz mumkin.

Faqat matnni emas, balki hamma narsani nusxalash/joylashtirish mumkin. Masalan, biz OS fayl menejerida faylni nusxalashimiz va uni joylashtirishimiz mumkin.

Buning sababi shundaki, `clipboardData` odatda sudrab olib tashlash va nusxalash/joylashtirish uchun ishlatiladigan `DataTransfer` interfeysini qo'llaydi. Bu hozir bizning doiramizdan biroz tashqarida, lekin uning usullarini [DataTransfer specification](https://html.spec.whatwg.org/multipage/dnd.html#the-datatransfer-interface) da topishingiz mumkin.

Shuningdek, almashish buferiga kirish uchun qo'shimcha asinxron API mavjud: `navigator.clipboard`. Bu haqda batafsil ma'lumot [Clipboard API and events](https://www.w3.org/TR/clipboard-apis/), [Firefox tomonidan qo'llab-quvvatlanmaydi](https://caniuse.com/async-clipboard).

### Xavfsizlik cheklovlari

Bufer OS darajasidagi "global" narsadir. Foydalanuvchi turli ilovalar o'rtasida almashishi, turli narsalarni nusxalash/joylashtirishi mumkin va brauzer sahifasi bularning barchasini ko'rmasligi kerak.

Shunday qilib, ko'pgina brauzerlar faqat ma'lum foydalanuvchi harakatlari doirasida, masalan, nusxa ko'chirish/joylashtirish va h.k.larda vaqtinchalik o'qish/yozish uchun buferga ruxsat beradi.

Firefox-dan tashqari barcha brauzerlarda `dispatchEvent` bilan "maxsus" clipboard hodisalarini yaratish ta'qiqlanadi. Va agar biz bunday hodisani yuborishga muvaffaq bo'lsak ham, spetsifikatsiyada bunday "sintetik" hodisalar clipboardga kirishni ta'minlamasligi kerakligi aniq ko'rsatilgan.

Agar kimdir `event.clipboardData` ni voqea ishlovchisida saqlashga va keyinroq unga kirishga qaror qilsa ham, u ishlamaydi.

Takrorlash uchun, [event.clipboardData](https://www.w3.org/TR/clipboard-apis/#clipboardevent-clipboarddata) faqat foydalanuvchi tomonidan boshlangan voqea ishlovchilar kontekstida ishlaydi.

Boshqa tomondan, [navigator.clipboard](https://www.w3.org/TR/clipboard-apis/#h-navigator-clipboard) har qanday kontekstda foydalanish uchun mo'ljallangan eng yangi API hisoblanadi. Agar kerak bo'lsa, foydalanuvchi ruxsatini so'raydi.

## Xulosa

Ma'lumotlarni o'zgartirish hodisalari:

| Hodisa | Tavsif | Maxsus |
|---------|----------|-------------|
| `change`| Qiymat o'zgartirildi. | Matn kiritish uchun fokusni yo'qotish triggerlari. |
| `input` | Har bir o'zgarishda matn kiritish uchun. | `change` dan farqli ravishda darhol ishga tushadi. |
| `cut/copy/paste` | Kesish/nusxalash/joylashtirish amallari. | Harakatning oldini olish mumkin. `event.clipboardData` xususiyati vaqtinchalik xotiraga kirish imkonini beradi. Firefoxdan tashqari barcha brauzerlar ham `navigator.clipboard` ni qo'llab-quvvatlaydi. |
