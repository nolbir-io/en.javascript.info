Yechim: `pattern:/"(\\.|[^"\\])*"/g`.

Navbatma-navbat

- Avval biz `pattern:"` ochilish qo'shtirnog'ini qidiramiz
- Agar bizda teskari qiyshiq chiziq `pattern:\\` bo'lsa (bu maxsus belgi bo'lgani uchun uni pattern'da ikki barobarga oshirishimiz kerak), undan keyin har qanday belgi yaxshi bo'ladi (nuqta).
- Aks holda, biz qo'shtirnoq (bu qatorning oxirini bildiradi) va backslash dan tashqari har qanday belgini olamiz (yolg'iz bacslash ga yo'l qo'ymaslik uchun, backslash faqat undan keyin boshqa belgi bilan ishlatiladi): `pattern:[^"\\]`
- ...Yakunlovchi qo'shtirnoqqacha shunday davom etadi.

Amaliy mashg'ulot:

```js run
let regexp = /"(\\.|[^"\\])*"/g;
let str = ' .. "test me" .. "Say \\"Hello\\"!" .. "\\\\ \\"" .. ';

alert( str.match(regexp) ); // "test me","Say \"Hello\"!","\\ \""
```
