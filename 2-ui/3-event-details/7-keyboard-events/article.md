# Keyboard: keydown va keyup

Klaviaturaga kirishdan oldin, zamonaviy qurilmalarda "biror narsani kiritish" ning boshqa usullari mavjudligini unutmang. Masalan, odamlar nutqni aniqlashdan (ayniqsa, mobil qurilmalarda) sichqoncha bilan nusxa ko'chirish/joylashtirish jarayonida foydalanadilar.

Shunday qilib, agar biz `<input>` maydoniga biron-bir kirishni kuzatmoqchi bo'lsak, u holda klaviatura hodisalari yetarli emas. `<input>` maydonidagi o'zgarishlarni istalgan usulda kuzatish uchun `input` deb nomlangan yana bir hodisa mavjud va bunday vazifa uchun yaxshiroq tanlov bo'lishi mumkin. Biz buni keyinroq <info:events-change-input> bobida ko'rib chiqamiz.

Klaviatura amallarini bajarishni xohlaganimizda klaviatura hodisalaridan foydalanish kerak (virtual klaviatura ham hisobga olinadi). Masalan, `key:Up` va `key:Down` strelka tugmachalari yoki tezkor tugmalar (jumladan, tugmalar birikmasi) bilan reaksiyaga kirishish uchun.


## Teststand [#keyboard-test-stand]

```offline
Klaviatura hodisalarini yaxshiroq tushunish uchun bemalol [teststand](sandbox:keyboard-dump) dan foydalanishingiz mumkin.
```

```online
Klaviatura hodisalarini yanada yaxshiroq tushunish uchun quyidagi teststand dan foydalaning.

Matn maydonida turli tugmalar birikmalarini sinab ko'ring.

[codetabs src="keyboard-dump" height=480]
```


## Keydown va keyup

`keydown` hodisalari tugma bosilganda, so'ngra `keyup` qo'yib yuborilganda sodir bo'ladi.

### event.code va event.key

Hodisa obyektining `key` xususiyati belgini olishga imkon beradi, hodisa obyektining `code` xususiyati esa "fizik kalit kodini" olish imkonini beradi.

Masalan, bir xil tugmachani `key:Z` `key:Shift` bilan yoki bo'lmasdan bosish mumkin. Bu bizga ikki xil belgini beradi: kichik `z` va katta `Z`.

`Event.key` aynan zarur belgi va u boshqacha bo'ladi. Ammo `event.code` bir xil:

| Key          | `event.key` | `event.code` |
|--------------|-------------|--------------|
| `key:Z`      |`z` (kichik harf)         |`KeyZ`        |
| `key:Shift+Z`|`Z` (katta harf)          |`KeyZ`        |

Agar foydalanuvchi turli tillarda ishlayotgan bo'lsa, boshqa tilga o'tish `"Z"` o'rniga butunlay boshqa belgiga aylanadi. Bu `event.key` qiymatiga aylanadi, `event.code` esa har doim bir xil `"KeyZ"` bo'ladi.

```smart header="\"KeyZ\" va boshqa kalit kodlari"
Har bir tugma klaviaturadagi joylashuviga bog'liq bo'lgan kodga ega. Kalit kodlari [UI Voqealar kodi spetsifikatsiyasida] (https://www.w3.org/TR/uievents-code/) tasvirlangan.

Masalan:
- Harf tugmalarida ushbu kodlar mavjud: `"Key<letter>"`: `"KeyA"`, `"KeyB"`.
- Raqamli kalitlarda esa ushbu kodlar mavjud: `"Digit<number>"`: `"Digit0"`, `"Digit1"`.
- Maxsus kalitlar o'zlarining nomlari bilan kodlangan: `"Enter"`, `"Backspace"`, `"Tab"` va hokazo.

Bir nechta keng tarqalgan klaviatura sxemalari mavjud va spetsifikatsiya ularning har biri uchun kalit kodlarini beradi.

Ko'proq kodlar uchun [spetsning alfanumerik bo'limini](https://www.w3.org/TR/uievents-code/#key-alphanumeric-section) o'qing yoki shunchaki [teststand](#klaviatura-test-stend)da yuqoridagi tugmani bosing.
```

```warn header="Vaziyat muhim: `\"keyZ\"` emas, `\"KeyZ\"`"
Aniq ko'rinadi, lekin odamlar hali ham shu narsada xato qiladilar.

Iltimos, noto'g'ri yozishdan qoching: bu `keyZ` emas, `KeyZ`. `event.code=="keyZ"` kabi tekshirish ishlamaydi: `"Key"` ning birinchi harfi katta bo'lishi kerak.
```

Agar kalit hech qanday belgi bermasa-chi? Masalan, `key: Shift`, `key: F1` yoki boshqalar. Ushbu kalitlar uchun `event.key` tahminan `event.code` bilan bir xil:

| Key          | `event.key` | `event.code` |
|--------------|-------------|--------------|
| `key:F1`      |`F1`          |`F1`        |
| `key:Backspace`      |`Backspace`          |`Backspace`        |
| `key:Shift`|`Shift`          |`ShiftRight` yoki `ShiftLeft`        |

Esda tutingki, `event.code` aynan qaysi tugma bosilishini belgilaydi. Masalan, ko'pgina klaviaturalarda chap va o'ng tomonda ikkita `key: Shift` tugmalari mavjud. `Event.code` qaysi biri bosilganligini aniq aytadi va `event.key` kalitning "ma'nosi" uchun javob beradi,masalan, bu nima ("Shift").

Aytaylik, biz tezkor tugmani ishlatmoqchimiz: `key:Ctrl+Z` (yoki Mac uchun `key:Cmd+Z`). Ko'pgina matn muharrirlari unga "Bekor qilish" amalini o'rnatadilar. Biz `keydown` da tinglovchini o'rnatishimiz va qaysi tugma bosilganligini tekshirishimiz mumkin.

Bu yerda bir dilemma bor: bunday tinglovchida biz `event.key` yoki `event.code` qiymatini tekshirishimiz kerakmi?

Bir tomondan, `event.key` qiymati belgi bo'lib, u tilga qarab o'zgaradi. Agar tashrif buyuruvchi OSda bir nechta tilga ega bo'lsa va ular o'rtasida almashsa, bir xil kalit turli belgilarni beradi. Shuning uchun `event.code` ni tekshirish mantiqan to'g'ri keladi, bu har doim bir xil bo'ladi.

Huddi quyidagi kabi:

```js run
document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
    alert('Undo!')
  }
});
```
Boshqa tomondan, `event.code` bilan bog'liq muammo bor. Turli xil klaviatura tartiblari uchun bir xil tugma turli belgilarga ega bo'lishi mumkin.

Misol uchun, quyida AQSh tartibi ("QWERTY") va uning ostidagi nemis sxemasi ko'rsatilgan ("QWERTZ") (Vikipediyadan):

![](us-layout.svg)

![](german-layout.svg)

Xuddi shu kalit uchun AQSh tartibida `Z` mavjud, nemis tilida esa `Y` (harflar almashtiriladi).

`Event.code` so'zma-so'z nemislar `Y` tugmachasini bosganda `KeyZ` ga teng bo'ladi.

Agar biz kodimizda `event.code == 'KeyZ'` ni tekshirsak, nemislar uchun `key:Y` tugmachasini bosganlarida bunday test o'tadi.

Bu juda g'alati tuyuladi, lekin shunday. [spetsifikatsiya](https://www.w3.org/TR/uievents-code/#table-key-code-alphanumeric-writing-system) bunday xatti-harakatni aniq eslatib o'tadi.

Shunday qilib, `event.code` kutilmagan tartib uchun noto'g'ri belgiga mos kelishi mumkin. Turli xil tartibdagi bir xil harflar turli xil jismoniy kalitlarga mos kelishi va turli kodlarga olib kelishi mumkin. Yaxshiyamki, bu faqat bir nechta kodlar bilan sodir bo'ladi, masalan, `keyA`, `keyQ`, `keyZ` (ko'rganimizdek) va `Shift` kabi maxsus tugmalar bilan sodir bo`lmaydi. Ro'yxatni [specification](https://www.w3.org/TR/uievents-code/#table-key-code-alphanumeric-writing-system) da topishingiz mumkin.

Tartibga bog'liq belgilarni ishonchli kuzatish uchun `event.key` yaxshiroq yo'l hisoblanadi.

Boshqa tomondan, `event.code` har doim bir xil bo'lib, jismoniy kalit joylashuviga bog'liq bo'lib qolishning afzalliklariga ega. Shunday qilib, unga tayanadigan tezkor tugmalar hatto tilni almashtirishda ham yaxshi ishlaydi.

Tartibga bog'liq kalitlarni boshqarishni xohlaymizmi? Keyin `event.key` - eng ajoyib yo'ldir.

Yoki biz tilni o'zgartirgandan keyin ham tezkor tugma ishlashini xohlaymizmi? Keyin `event.code` yaxshiroq bo'lishi mumkin.

## Avtomatik takrorlash

Agar tugma yetarlicha uzoq vaqt davomida bosilsa, u "avtomatik takrorlashni" boshlaydi: `keydown` qayta-qayta ishga tushadi va u bo'shatilganda biz nihoyat `keyup` ni olamiz. Shunday qilib, ko'p `keydown` va bitta `keyup` odatiy holdir.

Avtomatik takrorlash orqali ishga tushirilgan hodisalar uchun hodisa obyektida `event.repeat` xususiyati `true` ga o'rnatiladi.

## Standart harakatlar

Standart harakatlar turlicha bo'ladi, chunki klaviatura tomonidan boshlanishi mumkin bo'lgan ko'plab narsalar mavjud.

Masalan:

- Ekranda belgi paydo bo'ladi (eng aniq natija).
- Belgi o'chiriladi (`key: Delete` tugmasi).
- Sahifa aylantiriladi (`key:PageDown` tugmasi).
- Brauzer "Sahifani saqlash" dialogini ochadi (`key: Ctrl+S`)
-  ...va hokazo.

`keydown` bo'yicha standart amalni oldini olish, operatsion tizimga asoslangan maxsus kalitlar bundan mustasno, ularning aksariyatini bekor qilishi mumkin. Masalan, Windowsda `key:Alt+F4` joriy brauzer oynasini yopadi. JavaScriptda standart amalni oldini olish orqali uni to'xtatishning hech qanday usuli yo'q.

Masalan, quyidagi `<input>` telefon raqamini kutadi, shuning uchun u `+`, `()` yoki `-` raqamlaridan tashqari kalitlarni qabul qilmaydi:

```html autorun height=60 run
<script>
function checkPhoneKey(key) {
  return (key >= '0' && key <= '9') || ['+','(',')','-'].includes(key);
}
</script>
<input *!*onkeydown="return checkPhoneKey(event.key)"*/!* placeholder="Phone, please" type="tel">
```

Bu yerda `onkeydown` ishlov beruvchisi bosilgan tugmani tekshirish uchun `checkPhoneKey` dan foydalanadi. Agar u to'g'ri bo'lsa (`0..9` yoki `+-()`dan biri), u holda `true`, aks holda `false`ni qaytaradi.

Ma'lumki, DOM xususiyati yoki yuqoridagi kabi atribut yordamida tayinlangan hodisa ishlovchisidan qaytarilgan `false` qiymati standart harakatni oldini oladi, shuning uchun testdan o'tmagan kalitlar uchun `<input>` da hech narsa ko'rinmaydi. (Qaytilgan `true` qiymat hech narsaga ta'sir qilmaydi, faqat `false` ni qaytarishi muhim).

Esda tutingki, `key:Backspace`, `key:Left`, `key:Right` kabi maxsus tugmalar kiritishda ishlamaydi. Bu `checkPhoneKey` qattiq filtrining salbiy ta'siri. Bu tugmalar `false` ni qaytaradi.

`key:Left`, `key:Right` va `key:Delete`, `key:Backspace` strelka tugmalariga ruxsat berish orqali filtrni biroz yumshatamiz:

```html autorun height=60 run
<script>
function checkPhoneKey(key) {
  return (key >= '0' && key <= '9') ||
    ['+','(',')','-',*!*'ArrowLeft','ArrowRight','Delete','Backspace'*/!*].includes(key);
}
</script>
<input onkeydown="return checkPhoneKey(event.key)" placeholder="Phone, please" type="tel">
```
Endi arrow lar va o'chirish yaxshi ishlaydi.

Bizda kalit filtri mavjud bo'lsa ham, sichqonchani o'ng tugmasini bosib, + Paste tugmachasini bosib, istalgan narsani kiritishingiz mumkin. Mobil qurilmalar qiymatlarni kiritish uchun boshqa vositalarni taqdim etadi. Demak, filtr 100% ishonchli emas.

Muqobil yondashuv `oninput` hodisasini kuzatish bo'ladi - u har qanday o'zgartirishdan *keyin* ishga tushiriladi. U yerda biz yangi `input.value` ni tekshirishimiz va uni o'zgartirishimiz/yaroqsiz bo'lsa `<input>` ni ajratib ko'rsatishimiz mumkin. Yoki ikkala hodisa ishlov beruvchisini birgalikda ishlatsak bo'ladi.

## Meros

Ilgari `keypress` hodisasi, shuningdek, hodisa obyektining `keyCode`, `charCode`, `which` xususiyatlari bo'lgan.

Ular bilan ishlashda brauzerning nomuvofiqligi shunchalik ko'p ediki, spetsifikatsiyani ishlab chiquvchilarda ularning barchasini bekor qilish va yangi, zamonaviy hodisalarni yaratishdan boshqa iloji yo'q edi (yuqorida ushbu bobda tasvirlangan). Eski kod hali ham ishlaydi, chunki brauzerlar ularni qo'llab-quvvatlamoqda, ammo ulardan boshqa foydalanishga mutlaqo hojat yo'q.

## Mobil klaviaturalar

Rasmiy ravishda IME (Input-method Editor) deb nomlanuvchi virtual/mobil klaviaturalardan foydalanilganda W3C standarti KeyboardEvent [`e.keyCode` `229`] bo'lishi kerakligini bildiradi (https://www.w3.org/TR/ uievents/#determine-keydown-keyup-keyCode) va [`e.key` `"Undefined"` bo'lishi kerak](https://www.w3.org/TR/uievents-key/#key-attr-values) .

Garchi ushbu klaviaturalarning ba'zilari hali ham `e.key`, `e.code`, `e.keyCode` uchun to'g'ri qiymatlardan foydalanishi mumkin bo'lsada, strelkalar yoki orqaga siljish kabi ba'zi tugmalarni bosganda, hech qanday kafolat yo'q, shuning uchun klaviatura mantig'i mobil qurilmalarda har doim ham ishlamasligi mumkin.

## Xulosa

Tugmachani bosish har doim klaviatura hodisasini yaratadi, xoh u belgili tugmalar bo'lsin, xoh `key:Shift` yoki `key:Ctrl` va boshqalar kabi maxsus tugmalar, faqatgina istisno - bu ba'zan noutbuk klaviaturasida taqdim etiladigan `key: Fn` tugmasi. Buning uchun klaviatura hodisasi yo'q, chunki u ko'pincha operatsion tizimga qaraganda pastroq darajada amalga oshiriladi.

Klaviatura hodisalari: 

- `keydown` -- tugmani bosganingizda (agar tugma uzoq bosilsa, avtomatik takrorlanadi),
- `keyup` -- kalitni qo'yib yuborishda.

Klaviatura hodisasining asosiy xususiyatlari:

- `code` -- klaviaturadagi kalitning jismoniy joylashuviga xos bo'lgan "kalit kodi" (`"KeyA"`, `"Left Left"` va boshqalar).
- `key` -- belgi (`"A"`, `"a"` va boshqalar), `key:Esc` kabi belgi bo'lmagan kalitlar uchun odatda `code` bilan bir xil qiymatga ega.

Ilgari, klaviatura hodisalari ba'zan ariza maydonlarida foydalanuvchi kiritishini kuzatish uchun ishlatilgan. Bu ishonchli emas, chunki kirish turli manbalardan kelishi mumkin. Bizda har qanday kiritishni boshqarish uchun `input` va `change` hodisalari mavjud (bu mavzu <info:events-change-input> bo'limida yoritilgan). Ular har qanday kiritishdan, jumladan nusxa ko'chirish yoki nutqni aniqlashdan keyin ishga tushadi.

Biz klaviaturani chindan ham xohlaganimizda klaviatura hodisalaridan, masalan, tezkor tugmalar yoki maxsus tugmalar bilan reaksiyaga kirishishda foydalanishimiz kerak. 
