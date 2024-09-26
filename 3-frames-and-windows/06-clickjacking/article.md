# Clickjacking hujumi

`Clickjacking` hujumi yomon sahifaga tashrif buyuruvchi nomidan "jabrlanuvchi sayt" ni bosish imkonini beradi*.

Ko'pgina saytlar shu tarzda buzilgan, jumladan Twitter, Facebook, Paypal va boshqalar. Ularning barchasi tuzatilgan, albatta.

## Fikr

Fikr juda oddiy.

Facebook yordamida clickjacking qilish qanday amalga oshirilgan:

1. Mehmon yovuz sahifaga jalb qilinadi. Qanday bo'lishi muhim emas.
2. Sahifada zararsiz ko'rinishdagi havola mavjud ("hozir boyib keting" yoki "bu yerni bosing, juda kulgili" kabi).
3. O'sha havola ustiga facebook.com saytidagi `src` bilan shaffof `<iframe>` sahifasi shunday joylashadiki, "Like" tugmasi o'sha havola ustida joylashgan. Odatda bu `z-index` bilan amalga oshiriladi.
4. Havolani bosishga urinayotganda, tashrif buyuruvchi aslida tugmani bosadi.

## Namoyish

Mana, yomon sahifa qanday ko'rinishda bo'ladi. Aniqroq qilish uchun, `<iframe>` ni yarim shaffof tarzda ko'ramiz (haqiqiy yomon sahifalarda u to'liq shaffof):

```html run height=120 no-beautify
<style>
iframe { /* jabrlanuvchi saytidan iframe */
  width: 400px;
  height: 100px;
  position: absolute;
  top:0; left:-20px;
*!*
  opacity: 0.5; /* haqiqiy shaffoflikda: 0 */
*/!*
  z-index: 1;
}
</style>

<div>Hozir boyib ketish uchun bosing:</div>

<!-- Jabrlanuvchi saytidan url -->
*!*
<iframe src="/clickjacking/facebook.html"></iframe>

<button>Bu yerni bosing!</button>
*/!*

<div>...Va siz ajoyibsiz (aslida men ajoyib xakerman)!</div>
```

Hujumning to'liq namunasi:

[codetabs src="clickjacking-visible" height=160]

Bu yerda bizda yarim shaffof `<iframe src="facebook.html">` bor va misolda biz uning tugma ustida turganini ko'rishimiz mumkin. Tugmani bosish aslida iframeni bosadi, lekin bu foydalanuvchiga ko'rinmaydi, chunki iframe shaffof.

Natijada, agar tashrif buyuruvchi Facebookda avtorizatsiya qilingan bo'lsa ("remember me" odatda yoqilgan), keyin u "Like" qo'shadi. Twitterda bu "Follow" tugmasi bo'ladi.

Mana xuddi shu misol, lekin haqiqatga yaqinroq, `<iframe>` uchun `shaffoflik:0` bilan:

[codetabs src="clickjacking" height=160]

Hujum qilishimiz kerak bo'lgan narsa -- `<iframe>`ni yomon sahifaga shunday joylashtirish, tugma to'g'ridan-to'g'ri havola ustida joylashgan. Shunday qilib, foydalanuvchi havolani bosganida, ular aslida tugmani bosadilar. Buni odatda CSS bilan qilish mumkin.

```smart header="Clickjacking bosish uchun, klaviatura uchun emas"
Hujum faqat sichqonchaning harakatlariga ta'sir qiladi (yoki shunga o'xshash, mobil telefondagi tap kabi).

Klaviaturaga kiritishni qayta yo'naltirish juda qiyin. Texnik jihatdan, agar bizda buzish uchun matn maydoni bo'lsa, biz iframe-ni matn maydonlari bir-birining ustiga chiqadigan tarzda joylashtirishimiz mumkin. Shunday qilib, tashrif buyuruvchi sahifada ko'rgan kirishga e'tibor qaratmoqchi bo'lsa, ular aslida iframe ichidagi kirishga e'tibor qaratadi.

Ammo bitta muammo bor. Mehmon yozgan hamma narsa yashirin bo'ladi, chunki iframe ko'rinmaydi.

Odamlar odatda ekranda chop etilayotgan yangi belgilarni ko'ra olmasalar, yozishni to'xtatadilar.
```

## Eski maktab himoyasi (zaif)

Eng qadimgi himoya bu JavaScriptning bir qismi bo'lib, sahifani ramkada ochishni taqiqlaydi ("framebusting" deb ataladi).

Bu shunday ko'rinishga ega:

```js
if (top != window) {
  top.location = window.location;
}
```

Ya'ni: deraza tepada emasligini aniqlasa, u avtomatik ravishda o'zini tepaga aylantiradi.

Bu ishonchli himoya emas, chunki uni buzishning ko'plab usullari mavjud. Keling, bir nechtasini yoritaylik.

### Yuqori navigatsiyani bloklash

Biz [beforeunload](info:onload-ondomcontentloaded#window.onbeforeunload) hodisa ishlovchisida `top.location` oʻzgarishi natijasida yuzaga kelgan o'tishni bloklashimiz mumkin.

Yuqori sahifa (xakerga tegishli) unga quyidagi kabi oldini oluvchi ishlov beruvchini o'rnatadi:

```js
window.onbeforeunload = function() {
  return false;
};
```

`iframe` `top.location` ni o'zgartirishga harakat qilganda, tashrif buyuruvchi undan ketishni xohlaysizmi degan xabarni oladi.

Aksariyat hollarda tashrifchi salbiy javob beradi, chunki ular iframe haqida bilishmaydi - ular faqat yuqori sahifani ko'rishlari mumkin, ketish uchun hech qanday sabab yo'q. Shunday qilib, `top.location` o'zgarmaydi!

Amalda:

[codetabs src="top-location"]

### Sandbox atribyuti

`Sandbox` atribyuti tomonidan cheklangan narsalardan biri bu navigatsiya. Sinovlangan iframe `top.location` ni o'zgartirmasligi mumkin.

Shunday qilib, biz iframe-ni `sandbox="allow-scripts allow-forms"` bilan qo'shishimiz mumkin. Bu cheklovlarni yumshatadi, skriptlar va shakllarga ruxsat beradi. Lekin biz `allow-top-navigation` ni o'tkazib yuboramiz, shuning uchun `top.location` ni o'zgartirish ta'qiqlanadi.

Mana kod:

```html
<iframe *!*sandbox="allow-scripts allow-forms"*/!* src="facebook.html"></iframe>
```

Bu oddiy himoya bilan ishlashning boshqa usullari ham mavjud.

## X-Frame-Options

Server tomonidagi `X-Frame-Options` sarlavhasi sahifani ramka ichida ko'rsatishga ruxsat berishi yoki ta'qiqlashi mumkin.

U aynan HTTP sarlavhasi sifatida yuborilishi kerak: agar HTML `<meta>` tegida topilsa, brauzer uni e'tiborsiz qoldiradi. Shunday qilib, `<meta http-equiv="X-Frame-Options"...>` hech narsa qilmaydi.

Sarlavha 3 ta qiymatga ega:


`DENY`
: Hech qachon sahifani ramka ichida ko'rsatmang.

`SAMEORIGIN`
: Agar asosiy hujjat bir xil manbadan kelgan bo'lsa, ramka ichida ruxsat bering.

`ALLOW-FROM domain`
: Agar asosiy hujjat berilgan domendan bo'lsa, ramka ichida ruxsat bering.

Masalan, Twitter `X-Frame-Options: SAMEORIGIN` dan foydalanadi.

````online
Quyida natijani ko'rishingiz mumkin:

```html
<iframe src="https://twitter.com"></iframe>
```

<!-- elektron kitob: prerender/ chrome boshsiz qoliplar va bu iframe-da vaqt tugashi -->
<iframe src="https://twitter.com"></iframe>

Brauzeringizga qarab, yuqoridagi `iframe` bo'sh yoki brauzer ushbu sahifada shu tarzda harakatlanishiga ruxsat bermasligi haqida sizni ogohlantiradi.
````

## O'chirilgan funksiya bilan ko'rsatilmoqda

`X-Frame-Options` sarlavhasi salbiy ta'sirga ega. Garchi ularda jiddiy sabablar bo'lsa ham, boshqa saytlar bizning sahifamizni ramkada ko'rsata olmaydi.

Demak, boshqa yechimlar ham bor... Masalan, biz sahifani `<div>` uslublari `height: 100%; width: 100%;` bilan "qoplashimiz" mumkin, shuning uchun u barcha bosishlarni ushlab turadi. Agar `window == top` bo'lsa yoki biz himoyaga muhtoj emasligimizni aniqlasak, bu `<div>` olib tashlanishi kerak.

Quyidagiga o'xshash narsa:

```html
<style>
  #protector {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99999999;
  }
</style>

<div id="protector">
  <a href="/" target="_blank">Go to the site</a>
</div>

<script>
  // agar yuqori oyna boshqa manbadan bo'lsa, xato bo'ladi
  // lekin bu yerda hammasi yaxshi
  if (top.document.domain == document.domain) {
    protector.remove();
  }
</script>
```

Namuna:

[codetabs src="protector"]

## Samesite cookie atribyuti

`Samesite` cookie fayli atributi klik hujumlarning ham oldini oladi.

Bunday atributga ega cookie veb-saytga faqat ramka orqali emas, balki to'g'ridan-to'g'ri ochilgan bo'lsa yuboriladi. Qo'shimcha ma'lumotni <info:cookie#samesite> bo'limida topishingiz mumkin.

Agar Facebook kabi sayt autentifikatsiya cookie-faylida `samesite` atribyutiga ega bo'lsa, shunday hodisa yuz beradi:

```
Set-Cookie: authorization=secret; samesite
```

...Unda Facebook boshqa saytdan iframe-da ochilganda bunday cookie-fayl yuborilmaydi. Shunday qilib, hujum muvaffaqiyatsiz bo'ladi.

Cookie-fayllardan foydalanilmaganda `samesite` cookie atributi ta'sir qilmaydi. Bu boshqa veb-saytlarga iframelarda bizning ommaviy, autentifikatsiya qilinmagan sahifalarimizni osongina ko'rsatishga imkon berishi mumkin.

Biroq, bir nechta cheklangan holatlarda clickjacking hujumlariga ruxsat berishi mumkin. Masalan, IP-manzillarni tekshirish orqali takroriy ovoz berishni oldini oluvchi anonim so'rovnoma veb-sayti, cookie-fayllardan foydalangan holda foydalanuvchilarni autentifikatsiya qilmagani uchun clickjackingga qarshi himoyasiz bo'lishi mumkin.

## Xulosa

Clickjacking – foydalanuvchilarni nima bo'layotganini bilmay turib, qurbonlar saytiga bosishga "aldash" usulidir. Agar bosish bilan faollashtirilgan muhim harakatlar mavjud bo'lsa, bu xavfli.

Xaker o'z yovuz sahifasiga havolani xabarda joylashtirishi yoki boshqa usullar bilan o'z sahifasiga tashrif buyuruvchilarni jalb qilishi mumkin. Juda ham ko'p farqlar mavjud.

Bir nuqtai nazardan -- hujum "chuqur emas": xakerning qilayotgan ishining hammasi bir marta bosishni to'xtatishdir. Ammo boshqa nuqtai nazardan, agar xaker bosgandan so'ng boshqa boshqaruv paydo bo'lishini bilsa, ular foydalanuvchini ularni bosishga majburlash uchun ayyor xabarlardan foydalanishlari mumkin.

Hujum juda xavflidir, chunki biz foydalanuvchi interfeysini yaratganimizda, odatda, xaker tashrif buyuruvchi nomidan bosishini taxmin qilmaymiz. Shunday qilib, zaifliklarni mutlaqo kutilmagan joylardan topish mumkin.

- Kadrlar ichida ko'rish uchun mo'ljallanmagan sahifalarda (yoki butun veb-saytlarda) `X-Frame-Options: SAMEORIGIN` dan foydalanish tavsiya etiladi.
- Agar sahifalarimiz iframelarda ko'rsatilishiga ruxsat bermoqchi bo'lsak, lekin baribir xavfsiz bo'lib qolmoqchi bo'lsak, `<div>` qoplamasidan foydalaning.
