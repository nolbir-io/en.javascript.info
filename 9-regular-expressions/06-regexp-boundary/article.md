# So'z chegarasi: \b

`pattern:\b` so'z chegarasi xuddi `pattern:^` va `pattern:$` kabi oddiy sinovdir.

Regexp mexanizmi (regexplarni qidirishni amalga oshiradigan dastur moduli) `pattern:\b` bilan uchrashganda, u satrdagi pozitsiya so'z chegarasi ekanligini tekshiradi.

So'z chegaralari sifatida tasniflanadigan uchta turli pozitsiya mavjud:

- Satr boshlanishida, agar birinchi qator belgisi `pattern:\w` so'z belgisi bo'lsa.
- Satrdagi ikkita belgi o'rtasida, ulardan biri `pattern:\w` so'z belgisi, ikkinchisi esa yo'q.
- Satr oxirida, agar oxirgi satr belgisi `pattern:\w` so'z belgisi bo'lsa.

Masalan, regexp `pattern:\bJava\b` `subject:Hello, Java!` da topiladi, bu yerda `subject:Java` mustaqil so'z bo'lib, `subject:Hello, JavaScript!`da emas.

```js run
alert( "Hello, Java!".match(/\bJava\b/) ); // Java
alert( "Hello, JavaScript!".match(/\bJava\b/) ); // null
```

`subject:Hello, Java!` qatoridagi quyidagi pozitsiyalar `pattern:\b` ga mos keladi:

![](hello-java-boundaries.svg)

Demak, u `pattern:\bHello\b` pattternga mos keladi, chunki:

1. Satr boshida birinchi test `pattern:\b` mos keladi.
2. Keyin `pattern: Hello` so'ziga mos keladi.
3. Keyin `pattern:\b` testi yana mos keladi, chunki biz `subject:o` va vergul orasidamiz.

Shunday qilib, `pattern:\bHello\b` pattern mos keladi, lekin `pattern:\bHell\b` emas (chunki `l` dan keyin so'z chegarasi yo'q) va `Java!\b` emas (chunki undov belgisi emas) `pattern:\w` so'z belgisi, shuning uchun undan keyin hech qanday so'z chegarasi mavjud emas.

```js run
alert( "Hello, Java!".match(/\bHello\b/) ); // Hello
alert( "Hello, Java!".match(/\bJava\b/) );  // Java
alert( "Hello, Java!".match(/\bHell\b/) );  // null (moslik yo'q)
alert( "Hello, Java!".match(/\bJava!\b/) ); // null (moslik yo'q)
```

Biz `pattern:\b` dan nafaqat so'zlar, balki raqamlar bilan ham foydalanishimiz mumkin.

Masalan, `pattern:\b\d\d\b` qolipi mustaqil 2 xonali raqamlarni qidiradi. Boshqacha qilib aytadigan bo'lsak, u `pattern:\w` dan farqli belgilar bilan o'ralgan 2 xonali raqamlarni qidiradi, masalan, bo'shliqlar yoki tinish belgilari (yoki matnning boshlanishi/tugashi).

```js run
alert( "1 23 456 78".match(/\b\d\d\b/g) ); // 23,78
alert( "12,34,56".match(/\b\d\d\b/g) ); // 12,34,56
```

```warn header="Word boundary`` `pattern:\b` lotin bo'lmagan alifbolar uchun ishlamaydi"
`Pattern:\b` so'z chegarasi testi joylashuvning bir tomonida `pattern:\w` va boshqa tomonda `pattern:\w` emasligini tekshiradi.

Lekin `pattern:\w` lotin harfi `a-z` (yoki raqam yoki pastki chiziq) degan ma'noni anglatadi, shuning uchun test boshqa belgilar, masalan, kirill harflari yoki ierogliflar uchun ishlamaydi.
```
