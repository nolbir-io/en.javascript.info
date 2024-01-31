# Shakl xususiyatlari va usullari

`<input>` kabi shakllar va boshqaruv elementlari juda ko'p maxsus xususiyat va hodisalarga ega.

Shakllar bilan ishlash biz ularni o'rganganimizda ancha qulayroq bo'ladi.

## Navigatsiya: shakl va elementlar

Hujjat shakllari maxsus `document.forms` to'plamining a'zolaridir.

Bu *"nomli to'plam"* deb ataladi: u ham nomlangan, ham buyurtma qilingan. Shaklni olish uchun hujjatdagi nom yoki raqamdan foydalanishimiz mumkin.

```js no-beautify
document.forms.my; // name bilan shakl="my"
document.forms[0]; // hujjatdagi birinchi shakl
```
Agar bizda forma mavjud bo'lsa, har qanday element nomli `form.elements` to'plamida mavjud bo'ladi.

Masalan:

```html run height=40
<form name="my">
  <input name="one" value="1">
  <input name="two" value="2">
</form>

<script>
  // shaklni oling
  let form = document.forms.my; // <shakl nomi="my"> element

  // element ni oling
  let elem = form.elements.one; // <input name="one"> element

  alert(elem.value); // 1
</script>
```
Xuddi shu nomga ega bo'lgan bir nechta elementlar bo'lishi mumkin. Bu radio tugmalari va tasdiqlash qutilari uchun odatiy holdir.

Bunday holda, `form.elements[name]` *to'plam* bo'ladi. Masalan:

```html run height=40
<form>
  <input type="radio" *!*name="age"*/!* value="10">
  <input type="radio" *!*name="age"*/!* value="20">
</form>

<script>
let form = document.forms[0];

let ageElems = form.elements.age;

*!*
alert(ageElems[0]); // [object HTMLInputElement]
*/!*
</script>
```

Ushbu navigatsiya xususiyatlari teg tuzilishiga bog'liq emas. Barcha boshqaruv elementlari, ular shaklda qanchalik chuqur bo'lishidan qat'iy nazar, `form.elements` da mavjud.


````smart header="\"subforms\" kabi fieldset lari"
Shakl ichida bir yoki bir nechta `<fieldset>` elementlar bo'lishi mumkin. Shuningdek, ular ichida shakl boshqaruvlarini ro'yxatlaydigan `elements` xususiyati mavjud.

masalan:

```html run height=80
<body>
  <form id="form">
    <fieldset name="userFields">
      <legend>info</legend>
      <input name="login" type="text">
    </fieldset>
  </form>

  <script>
    alert(form.elements.login); // <input name="login">

*!*
    let fieldset = form.elements.userFields;
    alert(fieldset); // HTMLFieldSetElement

    // biz formadan ham, maydonlar to'plamidan ham nom bo'yicha kiritishimiz mumkin
    alert(fieldset.elements.login == form.elements.login); // true
*/!*
  </script>
</body>
```
````

````warn header="Qisqaroq belgi: `form.name`"
Bizda qisqaroq belgi bor: biz elementga `form[index/name]` sifatida kirishimiz mumkin.

Boshqacha qilib aytganda, `form.elements.login` o'rniga `form.login` ni yozish mumkin.

Bu ham ishlaydi, lekin kichik muammo bor: agar biz biror elementga kirib, uning nomini o'zgartirsak, u hali ham eski nom ostida (shuningdek, yangi nom ostida ham) mavjud bo'ladi.

Buni misolda ko'rish oson:

```html run height=40
<form id="form">
  <input name="login">
</form>

<script>
  alert(form.elements.login == form.login); // true, bir xil <input>

  form.login.name = "username"; // input ning nomini o'zgartiring

  // form.elements name ni yangiladi:
  alert(form.elements.login); // undefined
  alert(form.elements.username); // input

*!*
  // forma ikkala nomga ham ruxsat beradi: yangi va eski
  alert(form.username == form.login); // true
*/!*
</script>
```

Biroq, bu odatda muammo emas, chunki biz shakl elementlarining nomlarini kamdan-kam o'zgartiramiz.

````

## Backreference: element.form

Har qanday element uchun forma `element.form` sifatida mavjud. Shunday qilib, forma barcha elementlarga, elementlar esa shaklga havola qiladi.

Mana rasm:

![](form-navigation.svg)

Masalan:

```html run height=40
<form id="form">
  <input type="text" name="login">
</form>

<script>
*!*
  // form -> element
  let login = form.login;

  // element -> form
  alert(login.form); // HTMLFormElement
*/!*
</script>
```

## Shakl elementlari

Keling, shakl boshqaruvlari haqida gapiraylik.

### input va textarea

Biz ularning qiymatiga checkbox lar va radio tugmalar uchun `input.value` (string) yoki `input.checked` (boolean) sifatida kirishimiz mumkin.

Quyidagi kabi:

```js
input.value = "New value";
textarea.value = "New text";

input.checked = true; // checkbox yoki radio tugmachasi uchun
```

```warn header="`textarea.value` dan foydalaning, `textarea.innerHTML` dan emas"
Esda tutingki, `<textarea>...</textarea>` o'z qiymatini ichki HTML sifatida saqlasa ham, unga kirish uchun hech qachon `textarea.innerHTML` dan foydalanmasligimiz kerak.

U joriy qiymatni emas, balki faqat dastlab sahifada bo'lgan HTMLni saqlaydi.
```

### select va option

`<select>` elementi uchta muhim xususiyatga ega:

1. `select.options` -- `<option>` subelementlari to'plami,
2. `select.value` -- joriy tanlangan `<option>`ning *qiymati*,
3. `select.selectedIndex` -- joriy tanlangan `<option>`ning *raqami*.

Ular `<select>` uchun qiymat belgilashning uch xil usulini taqdim etadi:

1. Tegishli `<option>` elementini toping (masalan, `select.options` orasida) va uning `option.selected` qiymatini `true` qilib belgilang.
2. Agar biz yangi qiymatni bilsak: `select.value` ni yangi qiymatga o'rnating.
3. Agar biz yangi variant raqamini bilsak: shu raqamga `select.selectedIndex` ni o'rnating.

Mana uchta usulning bir misoli:

```html run
<select id="select">
  <option value="apple">Apple</option>
  <option value="pear">Pear</option>
  <option value="banana">Banana</option>
</select>

<script>
  // uchala qator ham bir xil vazifani bajaradi
  select.options[2].selected = true; 
  select.selectedIndex = 2;
  select.value = 'banana';
  // Iltimos, diqqat qiling: variantlar noldan boshlanadi, shuning uchun indeks 2 uchinchi variantni bildiradi.
</script>
```
Boshqa ko'pgina boshqaruv elementlaridan farqli o'laroq, `<select>` `multiple` atribyutiga ega bo'lsa, bir vaqtning o'zida bir nechta variantni tanlash imkonini beradi. Biroq, bu atribyut kamdan-kam qo'llaniladi.

Bir nechta tanlangan qiymatlar uchun qiymatlarni sozlashning birinchi usulidan foydalaning: `<option>` subelementlaridan `selected` xususiyatini qo'shish/o'chirish.

Ko'p tanlovdan tanlangan qiymatlarni qanday olish mumkinligiga misol:

```html run
<select id="select" *!*multiple*/!*>
  <option value="blues" selected>Blues</option>
  <option value="rock" selected>Rock</option>
  <option value="classic">Classic</option>
</select>

<script>
  // multi-select dan barcha tanlangan qiymatlarni oling
  let selected = Array.from(select.options)
    .filter(option => option.selected)
    .map(option => option.value);

  alert(selected); // blues,rock  
</script>
```

`<select>` elementining toʻliq spetsifikatsiyasi <https://html.spec.whatwg.org/multipage/forms.html#the-select-element> spetsifikatsiyasida mavjud.

### yangi Option

[spetsifikatsiyada](https://html.spec.whatwg.org/multipage/forms.html#the-option-element) `<option>` elementini yaratish uchun chiroyli qisqa sintaksis mavjud:

```js
option = new Option(text, value, defaultSelected, selected);
```

Bu sintaksis ixtiyoriy. Biz `document.createElement('option')` dan foydalanishimiz va atribyutlarni qo'lda o'rnatishimiz mumkin. Shunga qaramay, u qisqaroq bo'ladi, quyida parametrlar berilgan:

- `text` -- option ichidagi matn,
- `value` -- option ning qiymati,
- `defaultSelected` -- agar `true` bo'lsa, `selected` HTML atribyuti yaratiladi,
- `selected` -- agar `true` bo'lsa, option tanlanadi.

`defaultSelected` va `selected` o'rtasidagi farq shundaki, `defaultSelected` HTML-atributini o`rnatadi (buni `option.getAttribute('selected'))` yordamida olishimiz mumkin, `selected` esa parametr tanlangan yoki tanlanmaganligini belgilaydi.

Amalda, odatda, _both_ qiymatlarni `true` yoki `false` qilib belgilash kerak. (Yoki ularni o'tkazib yubormang; ikkalasi ham default bo'yicha `false`.)

Misol uchun, bu yerda yangi "unselected" variant berilgan:

```js
let option = new Option("Text", "value");
// <option value="value">Text</option> ni yaratadi
```

Bir xil variant, lekin tanlangan:

```js
let option = new Option("Text", "value", true, true);
```

Variant elementlari xususiyatlarga ega:

`option.selected`
: option tanlangan.

`option.index`
: Variantning `<select>`dagi boshqalar qatori soni.

`option.text`
: Variantning matn tarkibi (tashrif buyuruvchi tomonidan ko'riladi).

## Havolalar

- Spesifikatsiya: <https://html.spec.whatwg.org/multipage/forms.html>.

## Xulosa

Shakl navigatsiyasi:

`document.forms`
: Shakl `document.forms[name/index]` sifatida mavjud.

`form.elements`  
: Shakl elementlari `form.elements[name/index]` sifatida mavjud, yoki `form[name/index]` dan foydalanishimiz mumkin. `elements` xususiyati `<fieldset>` uchun ham ishlaydi.

`element.form`
: Elementlar `form` xususiyatida o'z shakllariga havola qiladi.

Qiymat `input.value`, `textarea.value`, `select.value` va boshqalar sifatida mavjud (belgilash qutilari va radio tugmalar uchun qiymat tanlangan yoki yo'qligini aniqlash uchun `input.checked` dan foydalaning.)

`<select>` uchun qiymatni `select.selectedIndex` indeksi yoki `select.options` variantlar to'plami orqali ham olish mumkin.

Bu shakllar bilan ishlashni boshlash uchun asoslar. Qo'llanmada biz ko'plab misollarni ko'ramiz.

Keyingi bobda biz har qanday elementda sodir bo'lishi mumkin bo'lgan, lekin asosan shakllarda ko'rib chiqiladigan `focus` va `blur` hodisalarini ko'rib chiqamiz.
