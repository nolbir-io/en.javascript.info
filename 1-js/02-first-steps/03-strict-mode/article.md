# Zamonaviy "use strict"

Uzoq vaqt davomida JavaScript moslik muammosisiz rivojlandi. Tilga yangi xususiyatlar qo'shildi, eski funksiyalar esa o'zgarmadi.

Bu mavjud kodni hech qachon buzmaslik foydasiga ega edi. Ammo salbiy tomoni shundaki, JavaScript dasturchilari tomonidan qilingan har qanday xato yoki nomukammal qaror dasturlash tilida abadiy qolib ketgan.

Bu 2009-yilgacha ECMAScript 5 (ES5) paydo bo'lgunga qadar shunday edi. U tilga yangi xususiyatlarni qo'shdi va mavjudlarini o'zgartirdi. Eski kodning ishlashini ta'minlash uchun bunday o'zgartirishlarning aksariyati sukut bo'yicha o'chirilgan. Siz ularni `"use strict"` maxsus ko'rsatmasi bilan faollashtirishingiz kerak.

## "use strict"

Ko'rsatma string ga o'xshaydi: `"use strict"` yoki `'use strict'`. Agar u skriptning yuqori qismida joylashgan bo'lsa, butun skript "zamonaviy" usulda ishlaydi.

Misol uchun:
```js
"use strict";

// bu kod zamonaviy usulda ishlaydi
...
```

Tez orada biz funksiyalar (buyruqlarni guruhlash usuli) ni o'rganamiz, shuning uchun funksiya boshida `"use strict"` ni qo'yishimiz mumkinligini oldindan aytib o'tamiz. Buni bajarish faqat ushbu funksiyadagina qat'iy rejimni yoqadi. Lekin ko'pchilik dasturchilar uni butun skript uchun ishlatishadi.

```warn header=`"Iltimos \"use strict"\ skriptlaringizning yuqori qismida ekanligiga ishonch hosil qiling, aks holda qat'iy rejim yoqilmasligi mumkin."

Bu yerda qat'iy rejim yoqilmagan:

```js no-strict
alert("some code");
// quyidagi "use strict" e'tiborga olinmaydi -- u yuqorida bo'lishi kerak

"use strict";

// qat'iy rejim yoqilmagan
```

Faqat `"use strict"`ni ustidagi izohlar ko'rinishi mumkin.

```warn header="`use strict`ni bekor qilishning hech qanday usuli yo'q"
Dvigatelni eski holatiga qaytaradigan "no use strict" kabi hech qanday ko'rsatma mavjud emas.

Qat'iy rejimga kirganimizdan so'ng, orqaga qaytish yo'q.


## Brauzer konsoli

Kodni ishga tushurish uchun [developer console](info:devtools) dan foydalanganingizda, `use strict` to'g'ridan-to'gri ishlamasligiga e'tibor bering.

Ba'zan, `use strict` ni qo'llashdagi o'zgarishlar orqali siz noto'g'ri natijalarga duch kelishingiz mumkin.

Xo'sh, aslida konsolda "qat'iy rejim" dan qanday foydalanish kerak?

Birinchi, bir nechta satrlarni kiritish uchun `key:Shift+Enter` tugmalarini bosishga va yuqorisiga `use strict` ni qo'yishga urinib ko'ring, masalan:

```js
'use strict'; <Shift+Enter yangi satr uchun>
//  ...sizning kodingiz
<Enter ishga tushirish uchun>
```

U ko'pgina brauzerlarda, jumladan, Firefox va Chromeda ishlaydi.

Agar bunday bo'lmasa, masalan, eski brauzerda, "use strict" ni ta'minlashning yomon, ammo ishonchli usuli mavjud. Uni shunday o'ramga soling:

```js
(function() {
  'use strict';

  // ...bu yerda sizning kodingiz...
})()
```

## "use strict" dan foydalanishimiz kerakmi?

Savol aniq javobga egadek tuyuladi, ammo unday emas.

Skriptlarni `"use strict"`.... bilan boshlashni tavsiya qilish mumkin, lekin ushbu harakat aynan nimasi bilan ajralib turishini bilasizmi?

Zamonaviy JavaScript "sinflar" va "modullar" - ilg'or til tuzilmalarini (biz ularga albatta yetib boramiz) qo'llab quvvatlaydi, ular "use strict" ni avtomatik ravishda yoqadi. Shunday qilib, agar biz ulardan foydalansak, "use strict" ni qo'shishimiz shart bo'lmaydi.

**Demak, hozircha `"use strict";` shunchaki, skriptlaringizning yuqori qismidagi mehmon. Keyinchalik, kodingiz sinflar va modullar ichida joylashganda, uni olib tashlashingiz mumkin.**

Hozircha "use strict" haqida umumiy ma'lumotga ega bo'ldik.

Keyingi boblarda til xususiyatlarini o'rganar ekanmiz, biz qat'iy va eski rejimlar o'rtasidagi farqni ko'rib chiqamiz. Yaxshiyamki, ular ko'p emas va aslida hayotimizni yaxshilashga xizmat qiladi.

Agar boshqacha ko'rsatilmagan bo'lsa (juda kamdan-kam hollarda), ushbu qo'llanmadagi barcha misollar qat'iy rejimni nazarda tutadi.
