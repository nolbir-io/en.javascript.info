# Brauzer muhiti, texnik xususiyatlari

JavaScript tili dastlab veb-brauzerlar uchun yaratilgan. O'shandan beri u ko'p foydalaniladigan va platformalarga ega bo'lgan tilga aylandi.

Platforma brauzer, veb-server yoki boshqa *host* yoki JavaScriptni ishga tushira olsa, hatto "aqlli" qahva mashinasi bo'lishi mumkin. Ularning har biri platformaga xos funksiyalarni ta'minlaydi. JavaScript spetsifikatsiyasi buni *host muhiti* deb ataydi.

Host muhiti til yadrosiga qo'shimcha ravishda o'z obyektlari va funktsiyalarini ta'minlaydi, veb-brauzerlar veb-sahifalarni boshqarish vositalarini beradi, node.js server tomonidagi xususiyatlarni taqdim etadi va hokazo.

JavaScript veb-brauzerda ishlayotganida bizda nima borligini ko'rib chiqamiz:

![](windowObjects.svg)
 
`window` deb nomlangan "ildiz" obyekti mavjud. Uning ikkita roli bor:

1. Birinchidan, bu <info:global-object> bobida tavsiflanganidek, JavaScript kodi uchun global obyektdir.
2. Ikkinchidan, u "brauzer oynasi" ni ifodalaydi va uni boshqarish usullarini taqdim etadi.
Masalan, biz uni global obyekt sifatida ishlatishimiz mumkin: 

```js run global
function sayHi() {
  alert("Hello");
}

// global funksiyalar global obyektning usullari:
window.sayHi();
```

Va biz uni oyna balandligini ko'rsatish maqsadida brauzer oynasi sifatida ishlatishimiz mumkin:

```js run
alert(window.innerHeight); // ichki oyna balandligi
```

Ko'proq oynaga xos usullar va xususiyatlar mavjud, biz ularni keyinroq ko'rib chiqamiz.

## DOM (Dokument obyekti modeli)

Dokument obyekti modeli yoki qisqacha DOM barcha sahifa mazmunini o'zgartirish mumkin bo'lgan obyektlar sifatida ifodalaydi.

`document` obyekti sahifaning asosiy "kirish nuqtasi" hisoblanadi. Uning yordamida biz sahifadagi biror narsani o'zgartirishimiz yoki yaratishimiz mumkin.

Masalan:
```js run
// fon rangini qizil rangga o'zgartiring
document.body.style.background = "red";

// 1 soniyadan keyin uni qayta o'zgartiring
setTimeout(() => document.body.style.background = "", 1000);
```

Bu yerda biz `document.body.style` dan foydalandik, lekin yana ko'p narsa bor. Xususiyatlar va usullar spetsifikatsiyada tasvirlangan: [DOM Living Standard](https://dom.spec.whatwg.org).

```smart header="DOM faqatgina brauzerlar uchun mo'ljallanmagan"
DOM spetsifikatsiyasi hujjatning tuzilishini tushuntiradi va uni boshqarish uchun obyektlarni taqdim etadi. DOM dan foydalanadigan brauzer bo'lmagan asboblar ham mavjud.

Masalan, HTML sahifalarni yuklaydigan va ularni qayta ishlovchi server tomonidagi skriptlar ham DOM dan foydalanishi mumkin. Ular spetsifikatsiyaning faqat bir qismini qo'llab-quvvatlashi mumkin.
```

```smart header ="Styling uchun CSSOM"
Bundan tashqari, CSS qoidalari va uslublar jadvallari uchun [CSS Object Model (CSSOM)](https://www.w3.org/TR/cssom-1/) alohida spetsifikatsiya mavjud bo'lib, ular qanday qilib obyektlar sifatida ko'rsatilishini va qanday amalga oshirilishini, qanday o'qilishi va yozilishini tushuntiradi. 

Hujjat uchun uslub qoidalarini o'zgartirganda CSSOM DOM bilan birgalikda ishlatiladi. Amalda, CSSOM kamdan-kam talab qilinadi, chunki biz ayrim hollarda JavaScriptdan CSS qoidalarini o'zgartirishimiz kerak (odatda biz CSS sinflarini qo'shamiz/o'chiramiz, ularning CSS qoidalarini o'zgartirmaymiz), lekin bunday qilish ham mumkin.
```

## BOM (Brauzer Obyekt Modeli)

Brauzer obyekt modeli (BOM) hujjatdan tashqari hamma narsa bilan ishlash uchun brauzer (xost muhiti) tomonidan taqdim etilgan qo'shimcha obyektlarni ifodalaydi.

Masalan:

- [navigator](mdn:api/Window/navigator) obyekti brauzer va operatsion tizim haqida fon ma'lumotlarini taqdim etadi. Ko'pgina xususiyatlar mavjud, ammo eng mashhur ikkitasi: `navigator.userAgent` -- joriy brauzer va `navigator.platform` -- platforma haqida (Windows/Linux/Mac va boshqalarni farqlashga yordam beradi).
- [location](mdn:api/Window/location) obyekti bizga joriy URL manzilini o'qish imkonini beradi va brauzerni yangisiga yo'naltirishi mumkin.

Quyida `locaton`, ya'ni joylashuv obyektidan qanday foydalanishimiz mumkinligi tushuntirilgan:

```js run
alert(location.href); // joriy URL ni ko'rsating
if (confirm("Go to Wikipedia?")) {
  location.href = "https://wikipedia.org"; // brauzerni boshqa URL manziliga yo'naltiring
}
```

`alert/confirm/prompt` funksiyalari ham BOMning bir qismidir: ular hujjat bilan bevosita bog'liq emas, balki foydalanuvchi bilan muloqot qilishning sof brauzer usullarini ifodalaydi.

```smart header ="Spesifikatsiyalar"
BOM umumiy [HTML spetsifikatsiyasining] bir qismidir (https://html.spec.whatwg.org).

 Ha, siz buni to'g'ri eshitdingiz. <https://html.spec.whatwg.org> saytidagi HTML spetsifikatsiyasi nafaqat "HTML tili" (teglar, atributlar) haqida, balki bir qator obyektlar, usullar va brauzerga xos DOM kengaytmalarini ham qamrab oladi. Bu "keng ma'noda HTML". Bundan tashqari, ba'zi qismlar <https://spec.whatwg.org> ro'yxatida qo'shimcha xususiyatlar mavjud.
```

## Xulosa

Standartlar haqida gapiradigan bo'lsak:

DOM spetsifikatsiyasi
: Hujjat tuzilishi, manipulyatsiyalar va hodisalarni tavsiflaydi: <https://dom.spec.whatwg.org>.

CSSOM spetsifikatsiyasi
: Uslublar jadvallari va uslublar qoidalari, ular bilan manipulyatsiyalar va ularni hujjatlar bilan bog'lash tavsifini ifodalaydi: <https://www.w3.org/TR/cssom-1/>.

HTML spesifikatsiyasi
: HTML tilini (masalan, teglar) va shuningdek, BOMni (brauzer obyekt modeli) tavsiflaydi -- turli xil brauzer funktsiyalari: `setTimeout`, `alert`, `location` va boshqalar: <https://html.spec.whatwg. org>. U DOM spetsifikatsiyasini oladi va ko'plab qo'shimcha xususiyatlar va usullar bilan kengaytiradi.

Bundan tashqari, ba'zi sinflar <https://spec.whatwg.org/> da alohida tavsiflangan.

Iltimos, ushbu havolalarga e'tibor bering, chunki o'rganish uchun juda ko'p narsa borki, hamma narsani qamrab olish va hammasini eslab qolish mumkin emas. 

Xususiyat yoki usul haqida o'qishni istasangiz, <https://developer.mozilla.org/en-US/> manzilidagi Mozilla qo'llanmasi ham yaxshi manbadir, lekin mos keladigan xususiyatlar yaxshiroq bo'lishi mumkin: u ko'pincha murakkab va o'qish uchun uzoq vaqt talab etadi, lekin sizning fundamental bilimlaringizni mustahkamlaydi.

Biror narsani topish uchun ko'pincha "WHATWG [term]" yoki "MDN [term]" internet qidiruvidan foydalanish qulay, masalan, <https://google.com?q=whatwg+localstorage>, <https://google. com?q=mdn+localstorage>.

Endi biz DOMni o'rganishga kirishamiz, chunki hujjat UIda markaziy rol o'ynaydi.