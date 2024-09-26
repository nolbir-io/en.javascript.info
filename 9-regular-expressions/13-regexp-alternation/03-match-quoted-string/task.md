# Qo'shtirnoqli qatorlarni toping

Ikkita qo'shtirnoq ichidagi satrlarni topish uchun regexp yarating `subject:"..."`.

Satrlar JavaScript satrlari kabi qochishni qo'llab-quvvatlashi kerak. Masalan, qo'shtirnoqlarni `subject:\"` yangi qatorni `subject:\n`, backslash ni esa `subject:\\` sifatida kiritish mumkin.

```js
let str = "Just like \"here\".";
```

Shuni esda tutingki, `subject:\"` qochib ketgan qo'shtirnoq qatorni tugatmaydi.

Shunday qilib, biz yo'lda qochib ketgan qo'shtirnoqlarga e'tibor bermasdan, bir qo'shtirnoqdan ikkinchisiga qidirishimiz kerak.

Bu vazifaning muhim qismi, aks holda bu ahamiyatsiz bo'lar edi.

Mos keladigan satrlarga misollar:
```js
.. *!*"test me"*/!* ..  
.. *!*"Say \"Hello\"!"*/!* ... (qochib ketgan ichki quotelar)
.. *!*"\\"*/!* ..  (ichida ikkita backslash)
.. *!*"\\ \""*/!* ..  (ikki tomonlama backslash va ichkarida qochib ketgan quote)
```

JavaScriptda biz ularni to'g'ridan-to'g'ri satrga o'tkazish uchun backslashni ikki barobarga oshirishimiz kerak, masalan:

```js run
let str = ' .. "test me" .. "Say \\"Hello\\"!" .. "\\\\ \\"" .. ';

// xotiradagi qator
alert(str); //  .. "test me" .. "Say \"Hello\"!" .. "\\ \"" ..
```
