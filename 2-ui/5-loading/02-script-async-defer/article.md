
# Async, defer skriptlari

Zamonaviy veb-saytlarda skriptlar ko'pincha HTMLga qaraganda "og'irroq" bo'ladi: ularning yuklab olish hajmi kattaroq va ishlov berish vaqti ham uzoqroq.

Brauzer HTMLni yuklaganda va `<script>...</script>` tegiga duch kelgan vaqtda, u DOMni yaratishda davom eta olmaydi. U hozir skriptni bajarishi kerak. Xuddi shunday holat tashqi skriptlar uchun ham sodir bo'ladi `<script src="..."></script>`: brauzer skript yuklab olinishini kutishi, yuklab olingan skriptni bajarishi kerak va shundan keyingina u sahifaning qolgan qismini qayta ishlashi mumkin.

Bu ikkita muhim masalaga olib keladi:

1. Skriptlar ostidagi DOM elementlarini ko'ra olmaydi, shuning uchun ular ishlov beruvchilarni qo'sha olmaydi va hokazo.
2. Agar sahifaning yuqori qismida katta hajmli skript bo'lsa, u "sahifani bloklaydi". Foydalanuvchilar sahifa mazmunini yuklab olinmaguncha va ishga tushmaguncha ko'ra olmaydi:

```html run height=100
<p>...content before script...</p>

<script src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<!-- Skript yuklanguncha bu ko'rinmaydi -->
<p>...content after script...</p>
```
Buning uchun ba'zi vaqtinchalik yechimlar mavjud. Misol uchun, biz sahifaning pastki qismiga skript qo'yishimiz mumkin. Keyin u yuqoridagi elementlarni ko'radi va u sahifa tarkibini ko'rsatishni bloklamaydi:

```html
<body>
  ...all content is above the script...

  <script src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>
</body>
```

Ammo bu yechim mukammallikdan uzoqdir. Misol uchun, brauzer to'liq HTML hujjatini yuklab olgandan keyingina skriptga e'tibor beradi (va uni yuklab olishni boshlashi mumkin). Uzoq HTML hujjatlari uchun bu sezilarli kechikish bo'lish ehtimoli mavjud.

Bunday narsalar juda tez ulanishlardan foydalanadigan odamlar uchun ko'rinmaydi, lekin dunyodagi ko'p odamlar hali ham sekin internet tezligiga ega va mukammal mobil internet aloqasidan foydalanishadi.

Yaxshiyamki, biz uchun muammoni hal qiladigan ikkita `<script>` atribyutlari mavjud: ular `defer` va `async`.

## defer

The `defer` attribute tells the browser not to wait for the script. Instead, the browser will continue to process the HTML, build DOM. The script loads "in the background", and then runs when the DOM is fully built.

Here's the same example as above, but with `defer`:

`Defer` atribyuti brauzerga skriptni kutmaslikni aytadi. Buning o'rniga, brauzer HTMLni qayta ishlashni davom ettiradi, DOMni yaratadi. Skript "background" da yuklanadi va DOM to'liq qurilganida ishlaydi.

Mana yuqoridagi misol `defer` bilan quyida berilgan:

```html run height=100
<p>...content before script...</p>

<script defer src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<!-- darhol ko'rinadi -->
<p>...content after script...</p>
```

Boshqacha qilib aytadigan bo'lsak:

- `defer` bilan skriptlar hech qachon sahifani bloklamaydi.
- `defer` bilan skriptlar har doim DOM tayyor bo'lganda bajariladi (lekin `DOMContentLoaded` hodisasidan oldin).

Quyidagi misol ikkinchi qismni ko'rsatadi:

```html run height=100
<p>...content before scripts...</p>

<script>
  document.addEventListener('DOMContentLoaded', () => alert("DOM ready after defer!"));
</script>

<script defer src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<p>...content after scripts...</p>
```

1. Sahifa tarkibi darhol paydo bo'ladi.
2. `DOMContentLoaded` hodisa ishlovchisi kechiktirilgan skriptni kutadi. U faqat skript yuklab olinganda va bajarilganda ishga tushadi.

**Kechiktirilgan skriptlar odatdagi skriptlar kabi o'zlarining nisbiy tartibini saqlaydi.**

Aytaylik, bizda ikkita kechiktirilgan skript bor: `long.js` va `small.js`:

```html
<script defer src="https://javascript.info/article/script-async-defer/long.js"></script>
<script defer src="https://javascript.info/article/script-async-defer/small.js"></script>
```

Brauzerlar ish faoliyatini yaxshilash uchun sahifani skriptlar uchun skanerlaydi va ularni parallel ravishda yuklab oladi. Shunday qilib, yuqoridagi misolda ikkala skript ham parallel ravishda yuklab olinadi. `small.js` birinchi bo'lib tugaydi.

...Ammo `defer` atributi brauzerga "bloklanmaslik" ni aytishdan tashqari, nisbiy tartibning saqlanishini ta'minlaydi. Shunday qilib, `small.js` avval yuklansa ham, `long.js` bajarilgandan keyin ham kutadi va ishlaydi.

Bu JavaScript kutubxonasini va keyin unga bog'liq bo'lgan skriptni yuklashimiz kerak bo'lgan holatlar uchun muhim bo'lishi mumkin.

```smart header=""`defer` atribyuti faqat tashqi skriptlar uchun`"
Agar `<script>` tegida `src` bo'lmasa, `defer` atribyuti e'tiborga olinmaydi.
```

## async

`async` atribyuti `defer`ga biroz o'xshash. Shuningdek, u skriptni bloklanmaydigan qiladi. Ammo uning xatti-harakatlarida muhim farqlar mavjud.

`async` atributi skript butunlay mustaqil ekanligini bildiradi:

- Brauzer `async` skriptlarni bloklamaydi (masalan, `defer`).
- Boshqa skriptlar `async` skriptlarini kutmaydi va `async` skriptlar ularni kutmaydi.
- `DOMContentLoaded` va async skriptlar bir-birini kutmaydi:
     - `DOMContentLoaded` asinxron skriptdan oldin ham sodir bo'lishi mumkin (agar asinxron skript sahifa tugallangandan keyin yuklashni tugatsa)
     - ... yoki asinxron skriptdan keyin (agar asinxron skript qisqa bo'lsa yoki HTTP keshida bo'lsa)

Boshqacha qilib aytganda, `async` skriptlar fonda yuklanadi va tayyor bo'lganda ishlaydi. DOM va boshqa skriptlar ularni kutishmaydi va ular hech narsani kutishmaydi. Ular yuklanganda ishlaydigan to'liq mustaqil skriptlardir. Judayam oddiy, shunday emasmi?

Mana biz `defer` bilan ko'rgan misolimizga o'xshash misol: ikkita `long.js` va `small.js` skriptlari, ammo hozir `defer` o'rniga `async` bilan misol keltirilgan.

Ular bir-birlarini kutishmaydi. Qaysi narsa avval yuklansa (ehtimol `small.js`) -- avval ishga tushadi:

```html run height=100
<p>...content before scripts...</p>

<script>
  document.addEventListener('DOMContentLoaded', () => alert("DOM ready!"));
</script>

<script async src="https://javascript.info/article/script-async-defer/long.js"></script>
<script async src="https://javascript.info/article/script-async-defer/small.js"></script>

<p>...content after scripts...</p>
```

- Sahifa tarkibi darhol paydo bo'ladi: `async` uni bloklamaydi.
- `DOMContentLoaded` `async` dan oldin ham, keyin ham sodir bo'lishi mumkin, bu yerda hech qanday kafolat yo'q.
- Kichikroq `small.js` skripti ikkinchi o'rinda turadi, lekin ehtimol `long.js`dan oldin yuklanadi, shuning uchun `small.js` birinchi bo'lib ishlaydi. `long.js` birinchi bo'lib yuklanadi, agar keshlangan bo'lsa, u birinchi bo'lib ishlaydi. Boshqacha qilib aytganda, asinxron skriptlar "birinchi yuklash" tartibida ishlaydi.

Async skriptlar mustaqil uchinchi tomon skriptini sahifaga integratsiyalashganda juda yaxshi: hisoblagichlar, reklamalar va boshqalar, chunki ular bizning skriptlarimizga bog'liq emas va bizning skriptlarimiz ularni kutmasligi kerak:

```html
<!-- Google Analytics odatda shunday qo'shiladi -->
<script async src="https://google-analytics.com/analytics.js"></script>
```

```smart header="`async` atribyuti faqatgina tashqi skriptlar uchun mo'ljallangan"
Xuddi `defer` kabi, `<script>` tegida `src` bo'lmasa, `async` atribyuti e'tiborga olinmaydi.
```

## Dinamik skriptlar
Sahifaga skript qo'shishning yana bir muhim usuli bor.

Biz JavaScriptdan foydalanib skript yaratishimiz va uni hujjatga dinamik ravishda qo'shishimiz mumkin:

```js run
let script = document.createElement('script');
script.src = "/article/script-async-defer/long.js";
document.body.append(script); // (*)
```
Skript `(*)` hujjatga qo'shilishi bilanoq yuklashni boshlaydi.

**Dinamik skriptlar sukut bo'yicha "async" sifatida ishlaydi.**

Bu quyidagilarni anglatadi:
- Ular hech narsani kutmaydilar, ularni hech narsa kutmaydi.
- Birinchi yuklanadigan skript -- birinchi bo'lib ishlaydi ("birinchi yuklash" tartibi).

Agar `script.async=false` ni aniq belgilab qo'ysak, buni o'zgartirish mumkin. Keyin skriptlar xuddi `defer` kabi hujjat tartibida bajariladi.

Ushbu misolda `loadScript(src)` funksiyasi skript qo'shadi va `async` ni `false` ga o'rnatadi.

Shunday qilib, `long.js` har doim birinchi bo'lib ishlaydi (birinchi qo'shilganidek):

```js run
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.body.append(script);
}

// async=false tufayli long.js birinchi bo'lib ishlaydi
loadScript("/article/script-async-defer/long.js");
loadScript("/article/script-async-defer/small.js");
```

`script.async=false` bo'lmasa, skriptlar sukut bo'yicha, birinchi navbatda yuklash tartibida bajariladi (`small.js` ehtimol birinchi).

Yana, `defer` da bo'lgani kabi, biz kutubxonani va keyin unga bog'liq bo'lgan boshqa skriptni yuklamoqchi bo'lsak, buyurtma muhim ahamiyatga ega hisoblanadi.


## Xulosa

`async` ham, `defer` ham bitta umumiy narsaga ega: bunday skriptlarni yuklab olish sahifani ko'rsatishni bloklamaydi. Shunday qilib, foydalanuvchi sahifa mazmunini o'qishi va darhol sahifa bilan tanishishi mumkin.

Ammo ular orasida muhim farqlar ham mavjud:

| | Buyurtma | `DOMContentLoaded` |
|---------|---------|---------|
| `async` | *Birinchi navbatda yuklash*. Ularning hujjat tartibi -- qaysi yuklar birinchi bo'lib ishlashi muhim emas | Ahamiyatsiz. Hujjat hali to'liq yuklab olinmagan vaqtda yuklanishi va bajarilishi mumkin. Agar skriptlar kichik yoki keshlangan bo'lsa va hujjat yetarlicha uzun bo'lsa, bu sodir bo'ladi. |
| `defer` | *Hujjat buyurtmasi* (hujjatda ko'rsatilgandek). | Hujjat yuklangandan va tahlil qilingandan so'ng (kerak bo'lsa, kutishadi) `DOMContentLoaded` dan oldin bajaring. |

Amalda `defer` butun DOMga muhtoj bo'lgan skriptlar uchun ishlatiladi va ularning nisbiy bajarilish tartibi muhim.

`async` esa hisoblagichlar yoki reklamalar kabi mustaqil skriptlar uchun ishlatiladi va ularning nisbiy ijro tartibi muhim emas.

```warn header="Skriptsiz sahifa foydalanishga yaroqli bo'lishi kerak"
Iltimos, diqqat qiling: agar siz `defer` yoki `async` dan foydalanayotgan bo'lsangiz, foydalanuvchi skript yuklanishidan *oldin* sahifani ko'radi.

Bunday holda, ba'zi grafik komponentlar hali ishga tushirilmagan.

"Yuklash" belgisini qo'yishni va hali ishlamaydigan tugmalarni o'chirishni unutmang. Foydalanuvchiga sahifada nima qilishi mumkinligini va hali nima tayyorlanayotganini aniq ko'rishiga imkon bering.
```
