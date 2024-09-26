# Bubbling va capturing

Keling, namunaviy misol bilan boshlaylik.

Bu ishlov beruvchi `<div>` ga tayinlangan, lekin `<em>` yoki `<code>` kabi ichki o'rnatilgan tegni bosganingizda ham ishlaydi:

```html autorun height=60
<div onclick="alert('The handler!')">
  <em>If you click on <code>EM</code>, the handler on <code>DIV</code> runs.</em>
</div>
```
Bu biroz g'alati emasmi? Agar haqiqiy click `<em>` da bo'lsa, nima uchun `<div>` da handler ishlayapti?

## Bubbling

Bubbling prinsipi oddiy.

**Elementda hodisa sodir bo'lganda, avval ishlov beruvchilarni, so'ngra ota-onasini, so'ngra butunlay boshqa ajdodlarni ishga tushiradi.**

Aytaylik, bizda har birida ishlov beruvchisi bo'lgan `FORM > DIV > P` 3 ta ichki element mavjud:

```html run autorun
<style>
  body * {
    margin: 10px;
    border: 1px solid blue;
  }
</style>

<form onclick="alert('form')">FORM
  <div onclick="alert('div')">DIV
    <p onclick="alert('p')">P</p>
  </div>
</form>
```
Ichki `<p>` ustiga bosish avval `onclick`ni ishga tushiradi:
1. Mana bu `<p>`.
2. Keyin tashqi `<div>`da.
3. Keyin tashqi `<form>`.
4. Va hokazo yuqoriga qarab `document` obyektigacha.

![](event-order-bubbling.svg)

Shunday qilib, agar biz `<p>` tugmachasini bossak, biz 3 ta ogohlantirishni ko'ramiz: `p` -> `div` -> `form`.

Jarayon "bubbling" deb ataladi, chunki hodisalar suvdagi qabariq kabi ichki elementdan ota-onalar orqali yuqoriga ko'tariladi.

```warn header="*Deyarli* barcha hodisalar bubble hisoblanadi."
Ushbu frazadagi "almost" asosiy kalitso'z hisoblanadi.

Masalan, `focus` hodisasi pufakchaga aylanmaydi. Boshqa misollar ham bor, ular bilan ham keyinroq tanishamiz. Ammo baribir bu qoidadan ko'ra istisno, aksariyat hodisalar pufakchaga (bubble) aylanadi.
```

## event.target

Asosiy elementdagi ishlov beruvchi har doim uning qayerda sodir bo'lganligi haqida ma'lumot olishi mumkin.

**Hodisaga sabab bo'lgan eng chuqur joylashtirilgan element *target* elementi deb ataladi, unga `event.target` sifatida kirish mumkin.**

`This` (=`event.currentTarget`) dan farqlarga e`tibor bering:

- `event.target` -- hodisani boshlagan "maqsadli" element, u ko'piklanish jarayonida o'zgarmaydi.
- `bu` -- "joriy" element bo'lib, unda hozirda ishlayotgan ishlov beruvchi mavjud.

Misol uchun, agar bizda bitta `form.onclick` ishlov beruvchisi bo'lsa, u forma ichidagi barcha click larni "tutib olishi" mumkin. Bosish qayerda sodir bo'lishidan qat'iy nazar, u `<form>` ga qadar pufakchaga chiqadi va ishlov beruvchini ishga tushiradi.

`form.onclick` ishlov beruvchisida:

- `this` (=`event.currentTarget`) `<form>` elementidir, chunki ishlov beruvchi unda ishlaydi.
- `event.target` - bosilgan shakl ichidagi haqiqiy element.

Tekshirib ko'ring:

[codetabs height=220 src="bubble-target"]

`event.target` `this` ga teng bo'lishi mumkin -- bosish to'g'ridan-to'g'ri `<form>` elementida amalga oshirilganda sodir bo`ladi.

## Ko'pik (bubbling)ni to'xtatish

Ko'pikli hodisa maqsad elementdan to'g'ridan-to'g'ri yuqoriga ko'tariladi. Odatda u `<html>` gacha yuqoriga, keyin esa `document` obyektiga boradi va ba'zi hodisalar hatto `window` gacha yetib boradi va yo'ldagi barcha ishlov beruvchilarni chaqiradi.

Ammo har qanday ishlov beruvchi hodisa to'liq qayta ishlangan deb qaror qilishi va ko'pikni to'xtatishi mumkin.

Buning usuli `event.stopPropagation()`.

Masalan, agar siz `<button>` tugmasini bossangiz `body.onclick` ishlamaydi:

```html run autorun height=60
<body onclick="alert(`the bubbling doesn't reach here`)">
  <button onclick="event.stopPropagation()">Click me</button>
</body>
```

```smart header="event.stopImmediatePropagation()"
Agar elementda bitta hodisa bo'yicha bir nechta hodisa ishlov beruvchilari bo'lsa, ulardan biri ko'pikni to'xtatsa ham, qolganlari bajariladi.

Boshqacha qilib aytganda, `event.stopPropagation()` yuqoriga siljishni to'xtatadi, lekin joriy elementda boshqa barcha ishlov beruvchilar ishlaydi.

Ko'pikni to'xtatish va joriy elementdagi ishlov beruvchilarning ishlashini oldini olish uchun `event.stopImmediatePropagation()` usuli mavjud. Undan keyin boshqa ishlovchilar bajarilmaydi.
```

```warn header="Keraksiz ko'pikni to'xtatmang!"
Ko'piklash qulay. Haqiqiy ehtiyojsiz buni to'xtatmang: aniq va me'moriy jihatdan yaxshilab o'ylang.

Ba'zan `event.stopPropagation()` yashirin tuzoqlarni yaratadi, ular keyinchalik muammoga aylanishi mumkin.

Masalan:

1. Biz ichki o'rnatilgan menyu yaratamiz. Har bir pastki menyu o'z elementlarini bosish bilan ishlaydi va tashqi menyu ishga tushmasligi uchun `stopPropagation` ni chaqiradi.
2. Keyinchalik biz foydalanuvchilarning xatti-harakatlarini (odamlar bosgan joyni) kuzatish uchun butun oyna bo'ylab chertishlarni qo'lga kiritishga qaror qilamiz. Ba'zi analitik tizimlar buni amalga oshiradi. Odatda kod barcha clicklarni ushlab turish uchun `document.addEventListener('click'...)` dan foydalanadi.
3. Bizning analitikimiz `stopPropagation` tugmasi bosishlar to'xtatilgan hududda ishlamaydi. Afsuski, bizda "o'lik zona" bor.

Odatda ko'pikni oldini olishning hojati yo'q. U talab qiladigan vazifani boshqa usullar bilan hal qilish mumkin. Ulardan biri maxsus tadbirlardan foydalanishdir, biz ularni keyinroq ko'rib chiqamiz. Shuningdek, biz ma'lumotlarimizni bitta ishlov beruvchidagi `event` obyektiga yozib, boshqasida o'qishimiz mumkin, shuning uchun biz ota-onalarga ishlov beruvchilarga quyida qayta ishlash haqida ma'lumot beramiz.
```


## Capturing

Hodisalarni qayta ishlashning "capturing" deb nomlangan yana bir bosqichi mavjud. Haqiqiy kodda kamdan-kam qo'llaniladi, lekin ba'zida foydali bo'lishi mumkin.

Standart [DOM Events](https://www.w3.org/TR/DOM-Level-3-Events/) hodisa tarqalishning 3 bosqichini tavsiflaydi:

1. Rasmga tushirish bosqichi -- hodisa elementga tushadi.
2. Maqsadli bosqich -- hodisa maqsadli elementga yetdi.
3. Ko'piklanish bosqichi -- hodisa elementdan pufakchaga chiqadi.

Jadval ichidagi `<td>` chertish hodisasi uchun `(1)`, nishon `(2)` va ko`pikli `(3)` bosqichlarining spetsifikatsiyadan olingan surati:

![](eventflow.svg)

Ya'ni: `<td>` tugmachasini bosish uchun hodisa avval ajdodlar zanjiri orqali elementga o'tadi (tutish bosqichi), so'ngra nishonga yetib boradi va u yerda ishga tushadi (maqsadli faza), keyin esa yuqoriga ko'tariladi (ko'piklanish bosqichi), yo'lda ishlovchilarni chaqiradi.

Hozirgacha biz faqat qabariq haqida gapirgan edik, chunki capturing bosqichi kamdan-kam qo'llaniladi.

Aslida, suratga olish bosqichi biz uchun ko'rinmas edi, chunki ishlov beruvchilar `on<event>`-property yoki HTML atributlari yordamida yoki ikki argumentli `addEventListener(voqea, ishlov beruvchi)` yordamida qo'shilgan suratga olish haqida hech narsa bilishmaydi, ular faqat 2 va 3-bosqichlarda ishlaydi.

Rasmga tushirish bosqichidagi hodisani qo'lga olish uchun biz ishlov beruvchining `capture` parametrini `true` ga o'rnatishimiz kerak:

```js
elem.addEventListener(..., {capture: true})

// yoki, faqat "true" taxallus {capture: true}
elem.addEventListener(..., true)
```
`capture` variantining ikkita mumkin bo'lgan qiymati mavjud:

- Agar u `false` (standart) bo'lsa, ishlov beruvchi pufaklash bosqichiga o'rnatiladi.
- Agar u `true` bo'lsa, ishlov beruvchi suratga olish bosqichiga o'rnatiladi.


Esda tutingki, rasmiy ravishda 3 faza mavjud bo'lsada, 2-bosqich ("maqsadli bosqich": hodisa elementga yetib bordi) alohida ko'rib chiqilmaydi: o'sha bosqichda ushlab turish va ko'pikli fazalardagi ishlov beruvchilar ishga tushadi.

Keling, suratga olish va pufaklashni amalda ko'rib chiqaylik:

```html run autorun height=140 edit
<style>
  body * {
    margin: 10px;
    border: 1px solid blue;
  }
</style>

<form>FORM
  <div>DIV
    <p>P</p>
  </div>
</form>

<script>
  for(let elem of document.querySelectorAll('*')) {
    elem.addEventListener("click", e => alert(`Capturing: ${elem.tagName}`), true);
    elem.addEventListener("click", e => alert(`Bubbling: ${elem.tagName}`));
  }
</script>
```
Kod qaysi biri ishlayotganini ko'rish uchun hujjatdagi *har bir* elementga bosish ishlov beruvchilarini o'rnatadi.

Agar siz `<p>` tugmasini bossangiz, ketma-ketlik quyidagicha bo'ladi:

1. `HTML` -> `BODY` -> `FORM` -> `DIV -> P` (qo'lga olish bosqichi, birinchi tinglovchi):
2. `P` -> `DIV` -> `FORM` -> `BODY` -> `HTML` (ko`pikli faza, ikkinchi tinglovchi).

E'tibor bering, `P` ikki marta paydo bo'ladi, chunki biz ikkita tinglovchini o'rnatdik: yozib olish va puflash. Maqsad birinchi bosqichning oxirida va ikkinchi bosqichning boshida tetiklanadi.

Hodisa ushlangan bosqich sonini bildiruvchi `event.eventPhase` xususiyati mavjud. Ammo u kamdan-kam qo'llaniladi, chunki biz buni odatda ishlov beruvchida bilamiz.

```smart header="handler ni olib tashlash uchu , `removeEventListener` ga bir xil bosqichlar kerak"
Agar bizda `addEventListener(..., true)` bo'lsa, ishlov beruvchini to'g'ri olib tashlash uchun `removeEventListener(..., true)` da bir xil bosqichni eslatib o'tishimiz kerak.
```

````smart header="Xuddi shu element va bir xil fazadagi tinglovchilar belgilangan tartibda ishlaydi"
Agar bizda `addEventListener` bilan bir xil elementga tayinlangan bir xil fazada bir nechta hodisa ishlov beruvchilari bo'lsa, ular yaratilgan tartibda ishlaydi:

```js
elem.addEventListener("click", e => alert(1)); // birinchi bo'lib ishga tushishi kafolatlangan
elem.addEventListener("click", e => alert(2));
```
````

```smart header="`event.stopPropagation()` capturing vaqtida bubbling sodir bo'lishining oldini oladi"
`event.stopPropagation()` usuli va undagi sibling `event.stopImmediatePropagation()` ham suratga olish bosqichida chaqirilishi mumkin. Keyin nafaqat capturing, balki bubbling ham to'xtatiladi.

Boshqacha qilib aytadigan bo'lsak, odatda hodisa avval pastga ("capturing"), keyin esa yuqoriga ("bubbling") tushadi. Agar suratga olish bosqichida `event.stopPropagation()` chaqirilsa, hodisa sayohati to'xtaydi, hech qanday ko'pik paydo bo'lmaydi.
```


## Xulosa

Voqea sodir bo'lganda -- u sodir bo'ladigan eng ko'p joylashtirilgan element "maqsadli element" (`event.target`) sifatida etiketlanadi.

- Keyin hodisa hujjat ildizidan `event.target` ga o'tadi va yo'lda `addEventListener(..., true)` bilan tayinlangan ishlov beruvchilarni chaqiradi (`true` bu `{capture: true}` qisqartmasi) .
- Keyin ishlovchilar maqsad elementning o'zida chaqiriladi.
- Keyin hodisa `event.target` dan ildizga ko'tariladi va `on<event>`, HTML atributlari va `addEventListener` yordamida tayinlangan ishlov beruvchilarni 3-argumentsiz yoki `false/{capture:false} 3-argumenti bilan chaqiradi. `.

Har bir ishlov beruvchi `event` obyekti xususiyatlariga kirishi mumkin:

- `event.target` -- hodisani yaratgan eng chuqur element.
- `event.currentTarget` (=`this`) -- hodisani boshqaradigan joriy element (uning ishlovchisi mavjud)
- `event.eventPhase` -- joriy bosqich (capturing=1, target=2, bubbling=3).

Har qanday hodisa ishlov beruvchisi `event.stopPropagation()` ni chaqirish orqali hodisani to'xtatishi mumkin, lekin bu tavsiya etilmaydi, chunki biz yuqorida, ehtimol, butunlay boshqa narsalar uchun kerak emasligiga ishonchimiz komil emas.

The capturing phase is used very rarely, usually we handle events on bubbling. And there's a logical explanation for that.

In real world, when an accident happens, local authorities react first. They know best the area where it happened. Then higher-level authorities if needed.

The same for event handlers. The code that set the handler on a particular element knows maximum details about the element and what it does. A handler on a particular `<td>` may be suited for that exactly `<td>`, it knows everything about it, so it should get the chance first. Then its immediate parent also knows about the context, but a little bit less, and so on till the very top element that handles general concepts and runs the last one.

Bubbling and capturing lay the foundation for "event delegation" -- an extremely powerful event handling pattern that we study in the next chapter.

Capturing bosqichi juda kamdan-kam qo'llaniladi, odatda biz ko'pikli hodisalarni ko'rib chiqamiz va buning mantiqiy izohi bor.

Haqiqiy dunyoda, baxtsiz hodisa yuz berganda, birinchi navbatda mahalliy hokimiyatlar harakat qilishadi. Ular voqea sodir bo'lgan hududni yaxshiroq bilishadi. Keyin, agar kerak bo'lsa, yuqori darajadagi organlar ishga kirishadi.

Hodisa ishlov beruvchilari uchun ham xuddi shunday. Muayyan elementga ishlov beruvchini o'rnatadigan kod element va uning nima qilishi haqida maksimal tafsilotlarni biladi. Muayyan `<td>` dagi ishlov beruvchi aynan `<td>` uchun mos bo'lishi mumkin, u bu haqda hamma narsani biladi, shuning uchun u birinchi navbatda imkoniyatga ega bo'lishi kerak. Keyin uning bevosita ota-onasi ham kontekst haqida biladi, lekin bir oz kamroq, umumiy tushunchalarni boshqaradigan va oxirgisini boshqaradigan eng yuqori elementgacha ma'lumotga ega.

Bubblingh va capturing "event delegatsiyasi" uchun asos bo'ladi -- biz keyingi bobda hodisalarni boshqarishning juda kuchli namunasini o'rganamiz.
