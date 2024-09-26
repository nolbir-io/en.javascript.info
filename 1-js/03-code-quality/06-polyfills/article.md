# Polyfilllar va transpilerlar

JavaScript tili muntazam rivojlanib boradi. Tilga yangi takliflar doimiy ravishda berib boriladi, ular analiz qilinadi va agar munosib topilsa, <https://tc39.github.io/ecma262/> da ro'yxatga va [specification](http://www.ecma-international.org/publications/standards/Ecma-262) da rivojlanishga qo'shiladi.  

JavaScript engine ortidagi jamoalarda birinchi o'rinda nimani amalga oshirish borasida o'zlarining g'oyalari mavjud. Ular rejadagi takliflarni amalga oshirishga va allaqachon qo'llanmada paydo bo'lgan narsalarni kechiktirishga qaror qilishi mumkin, chunki ular qiziqarli emas yoki bajarish mushkul. 

Shu sabab engineda standardning faqat bir qismini amalga oshirishini ko'rish ko'p uchraydigan holat. 

Tilning xususiyatlariga bo'lgan qo'llab-quvvatlashning joriy holatini ko'rishga yaxshi sahifa <https://kangax.github.io/compat-table/es6/> (u katta, o'rganadigan narsa hali ko'p).

Dastuchi sifatida, biz eng so'nggi xususiyatlardan foydalanishni xohlaymiz. Yaxshi narsalar qancha ko'p bo'lsa - shuncha yaxshi! 

Boshqa tomondan olib qaraganda, zamonaviy kodlarimizni hali so'ngi xususiyatlarni tushunmaydigan eski enginelarda qanday ishlatish mumkin?

Buning uchun ikkita vosita mavjud:
1. Transpilerlar.
2. Polyfill lar.

Bu bo'limda, bizning maqsadimiz ular qanday ishlash mohiyatini va ularning veb dasturlashdagi o'rnini bilib olish.  

## Transpilerlar

A [transpiler](https://en.wikipedia.org/wiki/Source-to-source_compiler) maxsus dasturiy ta'minot bo'lagi bo'lib, u bir kod manbasini boshqa bir kod manbasiga tarjima qiladi. U zamonaviy kodni tahlil qila oladi (o'qiydi va tushunadi) va eskirgan enginelarda ham ishlashi uchun uni eski sintaksis tuzilmasida qaytadan yozib chiqadi.  

Misol uchun, JavaScriptda 2020-yildan avval "nolga teng birlashtiruvchi operator" yo'q edi `??`. Shuning uchun, agar tashriv buyuruvchi eskirgan brauzerdan foydalansa, u `height = height ?? 100` ga o'xshagan kodlarni tushunmasligi mumkin. 

Transpiler kodimizni analiz qiladi va `height ?? 100` ni `(height !== undefined && height !== null) ? height : 100` ning ichiga qayta yozib chiqadi.

```js
// transpiler ni amalga oshirishdan avval
height = height ?? 100;

// transpiler ni amalga oshirgandan keyin
height = (height !== undefined && height !== null) ? height : 100;
```

Endi yozilgan kod eski JavaScript enginelariga mos keladi.  

Odatda dasturchi transpilerni o'z kompyuterida ishga tushiradi, va transpile bo'lgan koddan serverda foydalanadi. 

Nomlar haqida gap  ketganda, [Babel](https://babeljs.io) eng mashhur transpirlerlardan biri hisoblanadi. 

[webpack](https://webpack.js.org/) kabi zamonaviy proyekt qurish tizimlari transpilerni barcha kod o'zgarishlarida avtomatik ishga tushirish uchun vositalar bilan ta'minlaydi, shuning uchun ularni dasturlash jarayoniga biriktirish juda ososn.  

## Polyfill lar

Yangi til xususiyatlari nafaqat sintaksis tuzilmalar va operatorlarni, balki ichki funksiyalarni ham o'z ichiga olishi mumkin. 

Misol uchun, `Math.trunc(n)` sonning o'nlik qismi "kesuvchi" funksiyadir, masalan, u `Math.trunc(1.23)`  `1` ga qaytadi.

Ba'zi (juda eskirgan) JavaScript enginelarida `Math.trunc` funksiyasi mavjud emas, shuning uchun bunday kod ishlamaydi. 

Gap sintaksis o'zgarishlari emas, balki yangi funksiyalar haqida ketayotgan ekan, bu yerda biror narsani tranpile qilishning hojati yo'q. Biz faqat yetishmayotgan funksiyani e'lon qilishimiz kerak.

Yangi funksiyalar qo'shadigan va ularni yangilaydigan script "polyfill" deb ataladi. U bo'shliqni "to'ldiradi" va yetishmayotgan amallarni qo'shadi. 

Aynan bu holat uchun,  `Math.trunc` uchun polyfill uni amalga oshiradigan scriptdir, quyidagi misolga e'tibor bering:

```js
if (!Math.trunc) { // agar bunday funksiya bo'lmasa
  // uni amalga oshiradi
  Math.trunc = function(number) {
    // Math.ceil va Math.floor exist xatto qadimgi JavaScript enginelarida ham mavjud
    // Ular qo'llanmada keyinroq o'rganib chiqiladi
    return number < 0 ? Math.ceil(number) : Math.floor(number);
  };
}
```

JavaScript juda o'zgaruvchan til hisoblanadi, scriptlar istalgan funksiyani qo'shishi/o'zgartirishi mumkin, xatto ichki funksiyalarni ham. 

Polyfillning ikkita qiziqarli kutubxonasi mavjud: 
- [core js](https://github.com/zloirock/core-js) ko'p narsani qo'llab-quvvatlaydi, faqat kerakli xususiyatlarni kiritish imkonini beradi.
- [polyfill.io](http://polyfill.io) xususiyatlar va foydalanuvchi brauzeriga qarab, polifill ga ega skript bilan ta'minlaydigan xizmat.

## Xulosa

Bu bo'limda sizni zamonaviy va xatto eng so'nggi til xususiyatlarini o'rganishga undaymiz, agar ular hali JavaScript enginelari tomonidan qo'llab quvvatlanmasa ham. 

Transpiler dan foydalanish yodingizdan chiqmasin (agar zamonaviy sintaksis yoki operatorlardan foydalansangiz) va polyfillardan (yetishmayotgan funksiyalarni qo'shish uchun). Bular kod ishlashini kafolatlaydi. 

Masalan, keyinroq JavaScript bilan tanishib chiqqaningizda, siz kod qurish tizimini [webpack](https://webpack.js.org/)ga asoslangan holda [babel-loader](https://github.com/babel/babel-loader) plugini bilan tashkil etishingiz mumkin bo'ladi. 

Quyida turli funksiyalarni qo'llab-quvvatlashning hozirgi holatini ko'rsatadigan yaxshi manbaalar berilgan:

- <https://kangax.github.io/compat-table/es6/> -faqat JavaScript uchun.
- <https://caniuse.com/> - brauzerga oid funksiyalar uchun.

P.S. Google Chrome odatda til funksiyalari bo'yicha eng so'nggisi hisoblanadi, agar o'quv qo'llanma versiyasi muvaffaqiyatsiz bo'lsa, uni sinab koʻring. Ko'pgina o'quv versiyalari har qanday zamonaviy brauzer bilan ishlaydi.
