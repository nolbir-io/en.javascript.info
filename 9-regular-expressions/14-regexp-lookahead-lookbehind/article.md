# Lookahead va lookbehind

Ba'zan biz faqat keyin yoki undan oldin boshqa pattern bo'lgan pattern uchun mosliklarni topishimiz kerak.

Buning uchun "lookahead" va "lookbehind" deb nomlangan maxsus sintaksis mavjud bo'lib, ular birgalikda "lookaround" deb ataladi.

Boshlash uchun `subject:1 turkey costs 30€` kabi qatordan narxni topamiz. Ya'ni: raqam, keyin `subject:€` belgisi.

## Lookahead

Sintaksis: `pattern:X(?=Y)`, bu "`pattern:X` ni qidiring, lekin `pattern:Y`dan keyin mos kelsagina mos keladi" degan ma'noni anglatadi. `pattern:X` va `pattern:Y` o'rniga har qanday pattern bo'lishi mumkin.

`subject:€` bo'lgan butun son uchun regexp `pattern:\d+(?=€)` bo'ladi:

```js run
let str = "1 turkey costs 30€";

alert( str.match(/\d+(?=€)/) ); // 30, 1 raqami e'tiborga olinmaydi, chunki undan keyin € kelmaydi
```

Iltimos, diqqat qiling: oldinga qarash shunchaki sinov, `pattern:(?=...)` qavslar mazmuni `match:30` natijasiga kiritilmagan.

Biz `pattern:X(?=Y)` ni qidirganimizda, oddiy ifoda mexanizmi `pattern:X` ni topadi va undan keyin darhol `pattern:Y` mavjudligini tekshiradi. Agar shunday bo'lmasa, potentsial moslik o'tkazib yuboriladi va qidiruv davom etadi.

Keyinchalik murakkab testlar mumkin, masalan, `pattern:X(?=Y)(?=Z)`:

1. `Pattern:X`ni toping.
2. `pattern:Y` `pattern:X` dan keyin darhol ekanligini tekshiring (agar bo'lmasa o'tkazib yuboring).
3. `pattern:Z` ham `pattern:X` dan keyin ekanligini tekshiring (agar bo'lmasa o'tkazib yuboring).
4. Agar ikkala test ham o'tgan bo'lsa, `pattern:X` mos keladi, aks holda qidiruvni davom ettiring.

Boshqacha qilib aytganda, bunday pattern biz bir vaqtning o'zida `pattern:X`, `pattern:Y` va `pattern:Z` ni qidirayotganimizni anglatadi.

Bu faqat `pattern:Y` va `pattern:Z` patternlari bir-birini istisno qilmasa mumkin.

Masalan, `pattern:\d+(?=\s)(?=.*30)` `pattern:\d+` ni qidiradi, undan keyin `pattern:(?=\s)` bo'sh joy qo'yiladi va u yerda `30` hamda undan keyin `pattern:(?=.*30)` bor:

```js run
let str = "1 ta kurka 30€";

alert( str.match(/\d+(?=\s)(?=.*30)/) ); // 1
```

Bizning satrimizda `1` raqamiga to'liq mos keladi.

## Negativ lookahead

Aytaylik, biz bir xil satrdan narxni emas, balki miqdorni xohlaymiz. Bu `pattern:\d+`, keyingisi `subject:€` raqami emas.

Buning uchun salbiy ko'rinish qo'llanilishi mumkin.

Sintaksis quyidagicha: `pattern:X(?!Y)`, `pattern:Y` bo'lmasa, u `pattern:X` ni qidirishni bildiradi.

```js run
let str = "2 ta kurka 60€";

alert( str.match(/\d+\b(?!€)/g) ); // 2 (narx mos kelmadi)
```

## Lookbehind

```warn header="Lookbehind brauzeri mosligi"
Iltimos, diqqat qiling: Lookbehind Safari, Internet Explorer kabi V8 bo'lmagan brauzerlarda qo'llab-quvvatlanmaydi.
```

Lookahead "what follows" uchun shart qo'shish imkonini beradi.

Lookbehind o'xshash, lekin orqaga qaraydi. Ya'ni, agar uning oldida biror narsa bo'lsa, u patternga mos kelishiga imkon beradi.

Sintaksis:
- Positiv lookbehind: `pattern:(?<=Y)X`, `pattern:X` bilan mos keladi, lekin faqat uning oldida `pattern:Y` bo'lsa.
- NEgativ lookbehind: `pattern:(?<!Y)X`, `pattern:X` bilan mos keladi, lekin undan oldin `pattern:Y` bo'lmasa.

Masalan, narxni AQSH dollariga almashtiramiz. Dollar belgisi odatda raqamdan oldin bo'ladi, shuning uchun `$30` ni qidirish uchun biz `pattern:(?<=\$)\d+` -- `subject:$` oldidagi miqdorni ishlatamiz:

```js run
let str = "1 ta kurka $30";

// dollar belgisi qochib ketgan \$
alert( str.match(/(?<=\$)\d+/) ); // 30 (yagona raqamni o'tkazib yubordi)
```

Agar bizga miqdor kerak bo'lsa -- `subject:$` oldidan bo'lmagan raqam, u holda biz `pattern:(?<!\$)\d+` orqasida salbiy ko'rinishdan foydalanishimiz mumkin:

```js run
let str = "2 ta kurka $60";

alert( str.match(/(?<!\$)\b\d+/g) ); // 2 (narx mos kelmadi)
```

## Guruhlarni yozib olish

Odatda, qavslar ichidagi tarkib natijaning bir qismiga aylanmaydi.

Masalan, `pattern:\d+(?=€)`da `pattern:€` belgisi moslikning bir qismi sifatida olinmaydi. Bu tabiiy: biz `pattern:\d+` raqamini qidiramiz, `pattern:(?=€)` esa shunchaki test bo'lib, undan keyin `subject:€` kelishi kerak.

Ammo ba'zi hollarda biz tashqi ko'rinishdagi ifodani yoki uning bir qismini suratga olishni xohlaymiz. Bu mumkin. Faqatgina bu qismni qo'shimcha qavslarga o'rang.

Quyidagi misolda `pattern:(€|kr)` valyuta belgisi summa bilan birga olingan:

```js run
let str = "1 turkey costs 30€";
let regexp = /\d+(?=(€|kr))/; // €|kr atrofida qo'shimcha qavslar

alert( str.match(regexp) ); // 30, €
```

Va lookbehind uchun ham shunda holat:

```js run
let str = "1 turkey costs $30";
let regexp = /(?<=(\$|£))\d+/;

alert( str.match(regexp) ); // 30, $
```

## Xulosa

Lookahead va lookbehind (odatda "lookaround" deb ataladi) biror narsadan oldingi/keyin kontekstga qarab moslashmoqchi bo'lganimizda foydalidir.

Oddiy regexp uchun biz shunga o'xshash narsani qo'lda qilishimiz mumkin. Ya'ni, har qanday kontekstda hamma narsani moslashtiring va keyin tsikldagi kontekst bo'yicha filtrlang.

Esda tuting, `str.match` (`pattern:g` bayrog'isiz) va `str.matchAll` (har doim) mosliklarni `index` xususiyatiga ega massivlar sifatida qaytaradi, shuning uchun biz matnning aniq qayerda ekanligini bilib olamiz va kontekstni tekshiramiz.

Odatda lookaround qulayroqdir.

Lookaround turlari:

| Pattern            | turi             | moslik |
|--------------------|------------------|---------|
| `X(?=Y)`   | Positiv lookahead | `pattern:X` agar keyin `pattern:Y` bo'lsa |
| `X(?!Y)`   | Negativ lookahead | `pattern:X` agar keyin `pattern:Y` bo'lmasa |
| `(?<=Y)X` |  Positiv lookbehind | `pattern:X` agar keyin `pattern:Y` bo'lsa |
| `(?<!Y)X` | Negativ lookbehind | `pattern:X` agar keyin `pattern:Y` bo'lmasa |
