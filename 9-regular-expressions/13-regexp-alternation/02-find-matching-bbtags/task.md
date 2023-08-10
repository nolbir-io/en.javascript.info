# Bbtag juftlarini toping

"bb-teg" `[tag]...[/tag]`ga o'xshaydi, bu yerda `teg`: `b`, `url` yoki `quote`dan biri.

For instance:
```
[b]text[/b]
[url]http://google.com[/url]
```

BB teglarini joylashtirish mumkin. Lekin tegni o'ziga joylashtirish mumkin emas, masalan:

```
Normal:
[url] [b]http://google.com[/b] [/url]
[quote] [b]text[/b] [/quote]

Bo'lishi mumkin emas:
[b][b]text[/b][/b]
```

Teglar qator uzilishlarini o'z ichiga olishi mumkin, bu normaldir:

```
[quote]
  [b]text[/b]
[/quote]
```

Barcha BB-teglarni ularning mazmuni bilan topish uchun regexp yarating.

Masalan:

```js
let regexp = /your regexp/flags;

let str = "..[url]http://google.com[/url]..";
alert( str.match(regexp) ); // [url]http://google.com[/url]
```

Agar teglar o'rnatilgan bo'lsa, bizga tashqi teg kerak bo'ladi (agar xohlasak, uning tarkibidagi qidiruvni davom ettiramiz):

```js
let regexp = /your regexp/flags;

let str = "..[url][b]http://google.com[/b][/url]..";
alert( str.match(regexp) ); // [url][b]http://google.com[/b][/url]
```
