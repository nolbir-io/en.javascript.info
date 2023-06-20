# Oyna o'lchamlari va scrolling

Brauzer oynasining kengligi va balandligini qanday topamiz? Hujjatning to'liq kengligi va balandligini, shu jumladan aylantirilgan qismini qanday olamiz? JavaScript yordamida sahifani qanday aylantiramiz?

Ushbu turdagi ma'lumotlar uchun biz `<html>` tegiga mos keladigan `document.documentElement` asosiy hujjat elementidan foydalanishimiz mumkin. Ammo e'tiborga olish kerak bo'lgan qo'shimcha usullar va o'ziga xosliklar mavjud.

## Deraza kengligi/balandligi

Oyna kengligi va balandligini olish uchun biz `document.documentElement` `clientWidth/clientHeight` dan foydalanishimiz mumkin:

![](document-client-width-height.svg)

```online
Masalan, bu tugma oynangizning balandligini ko'rsatadi:

<button onclick="alert(document.documentElement.clientHeight)">alert(document.documentElement.clientHeight)</button>
```

````ogohlantiruvchi sarlavha ="Not `window.innerWidth/innerHeight`"
Brauzerlar `window.innerWidth/innerHeight` kabi xususiyatlarni ham qo'llab-quvvatlaydi. Ular biz xohlagan narsaga o'xshaydi, shuning uchun nega ularni o'rniga ishlatmaslik kerak?

Agar aylantirish paneli mavjud bo'lsa va u biroz bo'sh joy egallasa, `clientWidth/clientHeight` kenglik/balandlikni usiz taqdim etadi (uni ayiradi). Boshqacha qilib aytganda, ular hujjatning mazmuni uchun mavjud bo'lgan ko'rinadigan qismining kengligi/balandligini qaytaradi.

`window.innerWidth/innerHeight` aylantirish panelini o'z ichiga oladi.

Agar aylantirish paneli mavjud bo'lsa va u biroz bo'sh joy egallasa, bu ikki satr turli qiymatlarni ko'rsatadi:
```js run
alert( window.innerWidth ); // to'liq oyna kengligi
alert( document.documentElement.clientWidth ); // oyna kengligi minus aylantirish paneli
```

Ko'pgina hollarda, aylantirish panellari (agar mavjud bo'lsa) ichida biror narsani chizish yoki joylashtirish uchun bizga *mavjud* oyna kengligi kerak, shuning uchun biz `documentElement.clientHeight/clientWidth` dan foydalanishimiz lozim.
````

```ogohlantiruvchi sarlavha="`DOCTYPE` muhim"
Iltimos, diqqat qiling: HTMLda `<!DOCTYPE HTML>` boʻlmasa, yuqori darajadagi geometriya xususiyatlari biroz boshqacha ishlashi va g'alati narsalar bo'lishi mumkin.

Zamonaviy HTMLda biz doimo `DOCTYPE` ni yozishimiz kerak.
```

## Hujjatning kengligi/balandligi

Nazariy jihatdan, hujjatning asosiy elementi `document.documentElement` bo'lib, u barcha tarkibni qamrab olganligi sababli, hujjatning to'liq hajmini `document.documentElement.scrollWidth/scrollHeight` sifatida o'lchashimiz mumkin.

Ammo bu elementda butun sahifa uchun bu xususiyatlar mo'ljallanganidek ishlamaydi. Chrome/Safari/Opera-da, agar aylantirish bo'lmasa, `documentElement.scrollHeight` hatto `documentElement.clientHeight`dan ham kamroq bo'lishi mumkin! G'alati, to'g'rimi?

Hujjatning to'liq balandligini ishonchli tarzda olish uchun biz ushbu xususiyatlardan maksimal darajada foydalanishimiz kerak:

```js run
let scrollHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
);

alert('To'liq hujjat balandligi, aylantirilgan qismi bilan: ' + scrollHeight);
```

Nega shunday? Yaxshisi, so'ramang. Bu nomuvofiqliklar "aqlli" mantiq emas, balki qadim zamonlardan kelib chiqqan.

## Joriy sahifani oling [#page-scroll]

DOM elementlari `scrollLeft/scrollTop` xususiyatlarida joriy aylantirish holatiga ega.

Hujjatni aylantirish uchun `document.documentElement.scrollLeft/scrollTop` ko'pgina brauzerlarda ishlaydi, Safari kabi WebKit-ga asoslangan eski brauzerlardan tashqari (bug [5991](https://bugs.webkit.org/show_bug.cgi?id=5991) ), bu yerda `document.documentElement` o'rniga `document.body` dan foydalanishimiz kerak.

Yaxshiyamki, biz bu xususiyatlarni umuman eslab qolishimiz shart emas, chunki varaq `window.pageXOffset/pageYOffset` maxsus xususiyatlarida mavjud:

```js run
alert('Current scroll from the top: ' + window.pageYOffset);
alert('Current scroll from the left: ' + window.pageXOffset);
```

Bu xususiyatlar faqat o'qish uchun mo'ljallangan.

```aqlli sarlavha="Shuningdek, "oyna" xususiyatlari `scrollX` va `scrollY` sifatida ham mavjud.
Tarixiy sabablarga ko'ra ikkala xususiyat ham mavjud, ammo ular bir xil:
- `window.pageXOffset` `window.scrollX` ning taxallusidir.
- `window.pageYOffset` `window.scrollY` ning taxallusidir.
```

## Scrolling: scrollTo, scrollBy, scrollIntoView [#window-scroll]

```warn
Sahifani JavaScript bilan aylantirish uchun DOM to'liq qurilgan bo'lishi kerak.

Misol uchun, `<head>` da skript bilan sahifani aylantirmoqchi bo'lsak, u ishlamaydi.
```

Regular elements can be scrolled by changing `scrollTop/scrollLeft`.

Biz `document.documentElement.scrollTop/scrollLeft` yordamida sahifa uchun ham xuddi shunday qilishimiz mumkin (Safari bundan mustasno, bu erda `document.body.scrollTop/Left` o'rniga foydalanilishi lozim).

Shu bilan bir qatorda, oddiyroq, universal yechim bor: maxsus usullar [window.scrollBy(x,y)](mdn:api/Window/scrollBy) va [window.scrollTo(pageX,pageY)](mdn:api/Window/scrollTo) .

- `scrollBy(x,y)` usuli sahifani *joriy holatiga* nisbatan aylantiradi. Masalan, `scrollBy(0,10)` sahifani `10px` pastga aylantiradi.

    ```online
    Quyidagi tugma buni ko'rsatadi:

    <button onclick="window.scrollBy(0,10)">window.scrollBy(0,10)</button>
    ```
- `ScrollTo(pageX,pageY)` usuli sahifani *mutlaq koordinatalarga* aylantiradi, shunda ko'rinadigan qismning yuqori chap burchagida hujjatning yuqori chap burchagiga nisbatan `(pageX, pageY)` koordinatalari bo'ladi. Bu xuddi `scrollLeft/scrollTop` ni o'rnatishga o'xshaydi.

    Boshiga o'tish uchun `scrollTo(0,0)` tugmasidan foydalanishimiz mumkin.

    ```online
    <button onclick="window.scrollTo(0,0)">window.scrollTo(0,0)</button>
    ```

Ushbu usullar barcha brauzerlar uchun bir xil ishlaydi.

## scrollIntoView

To'liqlik uchun yana bir usulni ko'rib chiqamiz: [elem.scrollIntoView(top)](mdn:api/Element/scrollIntoView).

`elem.scrollIntoView(top)` ga qo'ng'iroq `elem`ni ko'rinadigan qilish uchun sahifani aylantiradi. Unda bitta dalil bor:

- Agar `top=true` (bu sukut bo'yicha) bo'lsa, oynaning yuqori qismida `elem` paydo bo'lishi uchun sahifa aylantiriladi. Elementning yuqori qirrasi oynaning yuqori qismiga to'g'ri keladi.
- Agar `top=false` bo`lsa, sahifa pastga aylanib, `elem` pastki qismida paydo bo`ladi. Elementning pastki cheti oynaning pastki qismiga to'g'ri keladi.

```online
Quyidagi tugma sahifani oynaning yuqori qismida joylashtirish uchun aylantiradi:

<button onclick="this.scrollIntoView()">this.scrollIntoView()</button>

Va bu tugma o'zini pastki qismida joylashtirish uchun sahifani aylantiradi:

<button onclick="this.scrollIntoView(false)">this.scrollIntoView(false)</button>
```

## O'tkazishni taqiqlang
Ba'zan biz hujjatni "aylanib bo'lmaydigan" qilishimiz kerak. Misol uchun, biz sahifani darhol e'tiborni talab qiladigan katta xabar bilan yopishimiz kerak bo'lganda va biz tashrif buyuruvchi hujjat bilan emas, balki ushbu xabar bilan o'zaro aloqada bo'lishini xohlaymiz.

Hujjatni aylantirib bo'lmaydigan qilish uchun `document.body.style.overflow = "hidden"` ni o'rnatish kifoya. Sahifa hozirgi aylantirish holatida "muzlaydi".

```online
Urinib ko'ring:

<button onclick="document.body.style.overflow = 'hidden'">document.body.style.overflow = 'hidden'</button>

<button onclick="document.body.style.overflow = ''">document.body.style.overflow = ''</button>

Birinchi tugma varaqni muzlatib qo'yadi, ikkinchisi esa uni qo'yib yuboradi.
```

Xuddi shu usuldan faqat `document.body` uchun emas, balki boshqa elementlar uchun aylantirishni muzlatish uchun foydalanishimiz mumkin.

Usulning kamchiligi shundaki, aylantirish paneli yo'qoladi. Agar u biroz bo'sh joy egallagan bo'lsa, demak, bu joy endi bo'sh va kontent uni to'ldirish uchun "sakrab" ketadi.

Bu biroz g'alati ko'rinadi, lekin agar biz muzlatishdan oldin va keyin `clientWidth` ni solishtirsak, uni hal qilish mumkin. Agar u ko'paygan bo'lsa (aylantirish paneli yo'qolgan bo'lsa), kontent kengligini bir xil saqlash uchun aylantirish paneli o'rniga `document.body` ga `padding` ni qo'shing.

## Xulosa

Geometriya:

- Hujjatning ko'rinadigan qismining kengligi/balandligi (tarkib maydoni kengligi/balandligi): `document.documentElement.clientWidth/clientHeight`
- butun hujjatning kengligi/balandligi, aylantirilgan qismi bilan:

    ```js
    let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    ```

Scrolling:

- Joriy varaqni o'qing: `window.pageYOffset/pageXOffset`.
- Joriy varaqni o'zgartiring:

    - `window.scrollTo(pageX,pageY)` -- mutlaq koordinatalar,
    - `window.scrollBy(x,y)` -- joriy joyga nisbatan aylantiring,
    - `elem.scrollIntoView(top)` -- `elem` ko'rinadigan qilish uchun aylantiring (oynaning yuqori/pastki qismiga tekislang).
