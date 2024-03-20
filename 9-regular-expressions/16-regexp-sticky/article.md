
# Yopishqoq bayroq "y", pozitsiyada qidirish

`pattern:y` bayrog'i qidiruvni manba qatoridagi berilgan pozitsiyada bajarishga imkon beradi.

`Pattern:y` bayrog'idan foydalanish holatlarini tushunish va regexplarning usullarini yaxshiroq tushunish uchun amaliy misolni ko'rib chiqaylik.

Regexp uchun umumiy vazifalardan biri "leksik tahlil": biz matnni olamiz, masalan, dasturlash tilida uning strukturaviy elementlarini topish kerak. Misol uchun, HTMLda teglar va atributlar, JavaScript kodida esa funksiyalar, o'zgaruvchilar va boshqalar mavjud.

Leksik analizatorlarni yozish o'ziga xos vositalar va algoritmlarga ega bo'lgan maxsus sohadir, shuning uchun biz u yerga chuqur kirmaymiz, lekin umumiy vazifa bor: berilgan pozitsiyada biror narsani o'qish lozim.

Masalan, bizda `subject:let varName = "value"` kod qatori bor va biz undan `4` pozitsiyasidan boshlanadigan o'zgaruvchi nomini o'qishimiz kerak.

Biz o'zgaruvchi nomini regexp `pattern:\w+` yordamida qidiramiz. Aslida, JavaScript o'zgaruvchilar nomlari aniq moslashish uchun biroz murakkabroq regexpga muhtoj, ammo hozir bu muhim emas.

- `str.match(/\w+/)` ga qo'ng'iroq qilish faqat qatordagi birinchi so'zni topadi (`let`). Bu men aytgan narsa emas.
- Biz `pattern:g` bayrog'ini qo'shishimiz mumkin. Ammo keyin `str.match(/\w+/g)` qo'ng'irog'i matndagi barcha so'zlarni qidiradi, bizga `4` pozitsiyasida bitta so'z kerak bo'ladi. Shunga qaramay, bu ham bizga kerak bo'lgan narsa emas.

**Shunday qilib, aniq berilgan pozitsiyada regexpni qanday qidirish mumkin?**

Keling, `regexp.exec(str)` usulidan foydalanishga harakat qilaylik.

`pattern:g` va `pattern:y` bayroqlari bo'lmagan `regexp` uchun bu usul faqat birinchi moslikni qidiradi, xuddi `str.match(regexp)` kabi ishlaydi.

...Agar `pattern:g` bayrog'i bo'lsa, u `regexp.lastIndex` xususiyatida saqlangan pozitsiyadan boshlab `str` da qidiruvni amalga oshiradi. Va agar u moslikni topsa, regexp.lastIndex ni o'yindan keyin darhol indeksga o'rnatadi.

Boshqacha qilib aytganda, `regexp.lastIndex` har bir `regexp.exec(str)` qo'ng'irog'i yangi qiymatga ("oxirgi o'yindan keyin") qayta tiklanadigan qidiruv uchun boshlang'ich nuqta bo'lib xizmat qiladi. Albatta, `pattern:g` bayrog'i bo'lsa.

Shunday qilib, `regexp.exec(str)` ga ketma-ket qo'ng'iroqlar birin-ketin mos keladi.

Mana shunday qo'ng'iroqlarga misol:

```js run
let str = 'let varName'; // Keling, ushbu qatordagi barcha so'zlarni topamiz
let regexp = /\w+/g;

alert(regexp.lastIndex); // 0 (boshida lastIndex=0)

let word1 = regexp.exec(str);
alert(word1[0]); // let (birinchi so'z)
alert(regexp.lastIndex); // 3 (moslikdan keyingi pozitsiya)

let word2 = regexp.exec(str);
alert(word2[0]); // varName (ikkinchi so'z)
alert(regexp.lastIndex); // 11 (moslikdan keyingi pozitsiya)

let word3 = regexp.exec(str);
alert(word3); // null (moslik yo'q)
alert(regexp.lastIndex); // 0 (qidiruv oxirida qayta o'rnatiladi)
```

Biz tsikldagi barcha mosliklarni olishimiz mumkin:

```js run
let str = 'let varName';
let regexp = /\w+/g;

let result;

while (result = regexp.exec(str)) {
  alert( `Found ${result[0]} at position ${result.index}` );
  // 0-pozitsiyada let topildi, keyin
   // 4-pozitsiyada varName topildi
}
```

`regexp.exec` dan bunday foydalanish `str.matchAll` usuliga muqobil bo'lib, jarayonni biroz ko'proq nazorat qiladi.

Keling, vazifamizga qaytaylik.

Biz qo'lda `lastIndex` ni `4` ga o'rnatishimiz, qidiruvni berilgan pozitsiyadan boshlashimiz mumkin!

Quyidagi kabi:

```js run
let str = 'let varName = "value"';

let regexp = /\w+/g; // "g" bayrog'i bo'lmasa, lastIndex xususiyati e'tiborga olinmaydi

*!*
regexp.lastIndex = 4;
*/!*

let word = regexp.exec(str);
alert(word); // varName
```

Uraaa! Muammo yechildi! 

Biz `regexp.lastIndex = 4` pozitsiyasidan boshlab `pattern:\w+` qidiruvini amalga oshirdik.

Natija to'g'ri.

...Lekin kuting, unchalik tez emas.

Esda tuting: `regexp.exec` qo'ng'irog'i `lastIndex` pozitsiyasida qidirishni boshlaydi va keyin davom etadi. Agar `lastIndex` pozitsiyasida hech qanday so'z bo'lmasa, lekin undan keyin biror joyda bo'lsa, u topiladi:

```js run
let str = 'let varName = "value"';

let regexp = /\w+/g;

*!*
// 3-pozitsiyadan boshlab qidiruvni amalga oshiring
regexp.lastIndex = 3;
*/!*

let word = regexp.exec(str); 
// 4-pozitsiyadan moslikni toping
alert(word[0]); // varName
alert(word.index); // 4
```

Ba'zi vazifalar, shu jumladan leksik tahlil uchun bu noto'g'ri. Biz matndan keyin emas, balki aynan berilgan pozitsiyada moslikni topishimiz kerak. `Y` bayrog'i ham aynan shu maqsadda ishlatiladi.

**The flag `pattern:y` makes `regexp.exec` to search exactly at position `lastIndex`, not "starting from" it.**

Here's the same search with flag `pattern:y`:

**`pattern:y` bayrog'i `regexp.exec` ni "boshlab" emas, balki `lastIndex` pozitsiyasida aniq qidirishga majbur qiladi.**

Mana, `pattern:y` bayrog'i bilan bir xil qidiruv quyida keltirilgan:

```js run
let str = 'let varName = "value"';

let regexp = /\w+/y;

regexp.lastIndex = 3;
alert( regexp.exec(str) ); // null (3-pozitsiyada bo'sh joy bor, so'z emas)

regexp.lastIndex = 4;
alert( regexp.exec(str) ); // varName (4-pozitsiyada so'z bor)
```

Ko'rib turganimizdek, regexp `pattern:/\w+/y` `3` pozitsiyasiga mos kelmaydi (`pattern:g` bayroqdan farqli o'laroq), lekin `4` pozitsiyasiga mos keladi.

Nafaqat bu bizga kerak, balki `pattern:y` bayrog'idan foydalanishda muhim unumdorlikka ega.

Tasavvur qiling-a, bizda uzun matn bor va unda hech qanday moslik yo'q. Keyin `pattern:g` bayrog'i bilan qidiruv matn oxirigacha davom etadi, hech narsa topa olmaydi va bu faqat aniq joylashuvni tekshiradigan `pattern:y` bayroqli qidiruvga qaraganda ancha ko'proq vaqt oladi.

Leksik tahlil kabi vazifalarda, odatda, bizda nima borligini tekshirish uchun aniq pozitsiyada ko'plab qidiruvlar mavjud. `pattern:y` bayrog'idan foydalanish to'g'ri amalga oshirish va yaxshi ishlash uchun kalit hisoblanadi.
