
Ochilish tegi `pattern:\[(b|url|quote)]`.

Keyin yopilish yorlig'igacha hamma narsani topish uchun keling, `pattern:s` bayrog'i bilan `pattern:.*?` patternni ishlatib, har qanday belgiga, shu jumladan yangi qatorga moslashamiz va keyin yopilish tegiga orqa havola qo'shamiz.

To'liq pattern: `pattern:\[(b|url|quote)\].*?\[/\1]`.

Amalda:

```js run
let regexp = /\[(b|url|quote)].*?\[\/\1]/gs;

let str = `
  [b]hello![/b]
  [quote]
    [url]http://google.com[/url]
  [/quote]
`;

alert( str.match(regexp) ); // [b]hello![/b],[quote][url]http://google.com[/url][/quote]
```

Please note that besides escaping `pattern:[`, we had to escape a slash for the closing tag `pattern:[\/\1]`, because normally the slash closes the pattern. Esda tutingki, `pattern:[` dan qochish bilan bir qatorda `pattern:[\/\1]` yopish tegi uchun slash'dan qochishimiz kerak edi, chunki odatda slash patternni yopadi.
