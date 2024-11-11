# Ninja code


```quote author="Konfutsiy (Analektlar)"
O'ylamasdan o'rganish mehnatni yo'qotadi; o'rganmasdan fikrlash xavflidir.
```

O'tmishdagi dasturchi ninjalar ushbu hiyla-nayranglardan kodni targ'ib qiluvchilarning ongini charxlash uchun foydalanganlar.

Kodni ko'rib chiqish guruhlari ularni test topshiriqlaridan qidiradi.

Ninja dasturchilar ba'zan ularni dasturchi ninjalardan ham yaxshiroq ishlatishadi.

Ularni diqqat bilan o'qing va kimligingizni bilib oling - ninjami, yangi boshlovchimi yoki ehtimol kodni ko'rib chiquvchimi?


```warn header="Ironiya aniqlandi"
Ko'pchilik ninja yo'llarini kuzatishga harakat qiladi. Muvaffaqiyatli bo'lganlar juda kam.
```


## Qisqartirish - bu aqlning ruhidir

Kodni iloji boricha qisqaroq qiling. Qanday aqlli ekanligingizni ko'rsating.

Nozik til xususiyatlari sizga yo'l ko'rsatsin.

Masalan, ushbu uchlik operator `'?'`ga e'tibor bering:

```js
// taniqli JavaScript kutubxonasidan olingan
i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
```
Ajoyib, to'g'rimi? Agar shunday yozsangiz, ushbu qatorga duch kelgan va `i` qiymati nima ekanligini tushunishga harakat qilgan dasturchi quvnoq vaqt o'tkazadi. Keyin javob izlab, oldingizga keladi

Ularga qisqaroq har doim yaxshiroq ekanligini ayting. Ularni ninja yo'llariga boshlang.

## Bir harfli o'zgaruvchilar

```quote author="Laozi (Tao Te Ching)"
Dao so'zsizlikda yashirinadi. Faqat Dao yaxshi boshlangan va yaxshi yakunlandi.
```
Qisqaroq kodlashning yana bir usuli - hamma joyda bitta harfli o'zgaruvchilar nomlaridan foydalanish. `a`, `b` yoki `c` kabi.

Qisqa o'zgaruvchi kodda o'rmondagi haqiqiy ninja kabi yo'qoladi. Hech kim uni muharrirning "qidiruvi" yordamida topa olmaydi. Agar kimdir buni qilsa ham, ular `a` yoki `b` ismlari nimani anglatishini "deshifr" qila olmaydi.

...Lekin istisno bor. Haqiqiy ninja hech qachon `for` siklida hisoblagich sifatida `i` dan foydalanmaydi. Hamma joyda, lekin bu yerda emas. Atrofga qarang, yana ko'plab ekzotik harflar bor. Masalan, `x` yoki `y`.

Loop hisoblagichi sifatida ekzotik o'zgaruvchi, agar pastgi tanasi 1-2 sahifani olsa, ajoyib bo'ladi (agar iloji bo'lsa, uni uzoqroq qiling). Agar kimdir sikl ichiga chuqur nazar tashlasa, u `x` nomli o'zgaruvchi sikl hisoblagichi ekanligini tezda aniqlay olmaydi.

## Qisqartmalardan foydalaning

Agar jamoa qoidalari bir harfli va noaniq ismlardan foydalanishni ta'qiqlasa -- ularni qisqartiring, qisqartmalar qiling.

Huddi quyidagi kabi:

- `list` -> `lst`.
- `userAgent` -> `ua`.
- `browser` -> `brsr`.
- ...va boshqalar

Bunday ismlarni faqat yaxshi sezish qobiliyati bor kishi tushuna oladi. Hamma narsani qisqartirishga harakat qiling. Sizning kodingiz rivojlanishini faqat munosib odam qo'llab-quvvatlashi kerak.

## Yuqoriga uching. Abstrakt bo'ling.

```quote author="Laozi (Tao Te Ching)"
Katta maydon burchaksiz<br>
Katta kema oxirgi marta qurib bitkazildi<br>
Eng zo'r nota noyob tovush<br>
Buyuk tasvirning shakli yo'q.
```
Ism tanlashda eng mavhum so'zdan foydalanishga harakat qiling, `obj`, `data`, `value`, `item`, `elem` va boshqalar kabi.

- **O'zgaruvchining ideal nomi `data`dir.** Uni hamma joyda ishlating. Darhaqiqat, har bir o'zgaruvchida *data* mavjud, to'g'rimi?

    ...Ammo `data` allaqachon olingan bo'lsa, nima qilish kerak? `value` ni sinab ko'ring, u ham universaldir. Axir, o'zgaruvchi oxir-oqibat *qiymat* (value) ga ega bo'ladi.

- **O'zgaruvchini turi bo'yicha nomlang: `str`, `num`...*

    Ularni sinab ko'ring. Yosh dasturchi hayron bo'lishi mumkin - bunday nomlar ninja uchun haqiqatan ham foydalimi? Darhaqiqat, ha, ular foydali!

    Albatta, o'zgaruvchining nomi hali ham biror narsani anglatadi. Bu o'zgaruvchining ichida nima borligini aytadi: satr, raqam yoki boshqa narsa. Ammo begona odam kodni tushunishga harakat qilganda, ular aslida hech qanday ma'lumot yo'qligini ko'rib hayron bo'lishadi! Va oxir-oqibatda yaxshi o'ylangan kodingizni o'zgartira olmaydi.

    Qiymat turini debugging orqali aniqlash oson. Ammo o'zgaruvchining ma'nosi nima? U qaysi qator/raqamni saqlaydi?

    Yaxshi meditatsiyasiz buni aniqlashning iloji yo'q!

- **...Agar bunday nomlar bo'lmasa-chi?** Shunchaki raqam qo'shing: `data1, item2, element5`...

## Diqqat testi

Sizning kodingizni faqat chinakam diqqatli dasturchi tushunishi kerak. Lekin buni qanday tekshirish mumkin?

**Ushbu usullardan biri -- `date` va `data` kabi o'xshash o'zgaruvchilar nomlaridan foydalaning.**

Ularni siz eplay oladigan joyda aralashtirib yuboring.

Qachonki matbaa xatosi bo'lsa, bunday kodni tezda o'qish imkonsiz bo'ladi... Ehh... Biz choy ichish uchun uzoq vaqt o'tirib qoldik.


## Aqlli sinonimlar

```quote author="Laozi (Tao Te Ching)"
Aytish mumkin bo'lgan Tao abadiy Tao emas. Nomlanishi mumkin bo'lgan ism abadiy ism emas.
```

*Bir xil* narsalar uchun *o'xshash* nomlardan foydalanish hayotni yanada qiziqarli qiladi va sizning ijodingizni ommaga ko'rsatadi.

Masalan, funksiya prefikslarini ko'rib chiqing. Agar funksiya ekranda xabarni ko'rsatsa -- uni `displayMessage` kabi `display...` bilan boshlang. Va agar boshqa funksiya ekranda foydalanuvchi nomi kabi boshqa narsani ko'rsatsa, uni `show...` (`showName` kabi) bilan boshlang.

Bunday funksiyalar o'rtasida nozik farq borligini va hech qanday farq yo'qligini ayting.

Jamoaning boshqa ninjalari bilan shartnoma tuzing: agar Jon o'z kodida `display...` funksiyalarini "ko'rsata" boshlasa, Piter `render..` va Enn - `paint...` dan foydalanishi mumkin. Kod qanchalik qiziqarli va xilma-xil bo'lganiga e'tibor bering.

...Va endi hat trick!

Muhim farqlarga ega ikkita funksiya uchun -- bir xil prefiksdan foydalaning!

Masalan, `printPage(sahifa)` funksiyasi printerdan foydalanadi. `printText(matn)` funksiyasi esa matnni ekranga chiqaradi. Notanish o'quvchiga o'xshash nomli `printMessage` funksiyasi haqida yaxshilab o'ylab ko'ring: "U xabarni qayerga qo'yadi? Printergami yoki ekrangami?". Uni chinakam porlashi uchun `printMessage(xabar)` uni yangi oynada chiqarishi kerak!

## Ismlardan qayta foydalaning

```quote author="Laozi (Tao Te Ching)"
Butun bo'lingandan so'ng, qismlar<br>
ism kerak.<br>
Nomlar allaqachon yetarli.<br>
Qachon to'xtash kerakligini bilish kerak.
```
Yangi o'zgaruvchini faqat juda zarur bo'lgandagina qo'shing.

Buning o'rniga, mavjud nomlarni qayta ishlating. Ularga faqat yangi qiymatlarni yozing.

Funksiyada faqat parametr sifatida berilgan o'zgaruvchilardan foydalanishga harakat qiling.

Bu *hozir* o'zgaruvchisida aniq nima borligini aniqlashni qiyinlashtiradi. Va shuningdek, u qayerdan keladi? Maqsad kodni o'qiyotgan odamning sezgi va xotirasini rivojlantirishdir. Sezgi zaif odam kodni satr bo'yicha tahlil qilishi va har bir kod bo'limi orqali o'zgarishlarni kuzatishi kerak.

**Yondoshuvning ilg'or varianti bu qiymatni sikl yoki funksiya o'rtasida yashirincha (!) o'xshash narsa bilan almashtirishdir.**

Masalan:

```js
function ninjaFunction(elem) {
  // Elementar bilan ishlaydigan 20 qator kod

  elem = clone(elem);

  // Yana 20 ta qator, endi elementning kloni bilan ishlamoqda!
}
```
Funksiyaning ikkinchi yarmida `elem` bilan ishlamoqchi bo'lgan dasturchi hamkasbi hayratda qoladi... Faqat debugging paytida, kodni tekshirgandan so'ng, ular klon bilan ishlayotganini bilib olishadi!

Bu holat kodda muntazam ko'rinadi. Hatto tajribali ninjaga qarshi ham halokatli tuyilishi mumkin.

## O'yin-kulgi uchun pastki chiziq

O'zgaruvchilar nomlari oldiga `_` va `__` pastki chiziqlarni qo'ying. `_name` yoki `__value` kabi. Agar ularning ma'nosini bilsangiz yaxshi bo'lardi. Yoki yaxshisi, ularni faqat o'yin-kulgi uchun qo'shing, ammo bu ish umuman ma'nosiz. Yoki turli joylarda turli ma'nolarni anglatishi mumkin.

Bir o'q bilan ikkita quyonni o'ldirasiz. Birinchidan, kod uzunroq va kamroq o'qilishi mumkin bo'ladi, ikkinchidan, boshqa dasturchi pastki chiziq nimani anglatishini tushunishga uzoq vaqt sarflaydi.

Aqlli ninja kodning bir joyiga pastki chiziq qo'yadi va boshqa joylarda ularni chetlab o'tadi. Bu kodni yanada nozik qiladi va kelajakda xatolar ehtimolini oshiradi.

## Sevgingizni ko'rsating

Hamma sizning mavjudotlaringiz qanchalik ajoyibligini ko'rsin! `superElement`, `megaFrame` va `niceItem` kabi nomlar, albatta, o'quvchini xabardor qiladi.

Darhaqiqat, bir tomondan nimadir yoziladi: `super..`, `mega..`, `nice..` Lekin boshqa tomondan - bu hech qanday tafsilot keltirmaydi. O'quvchi yashirin ma'noni izlashga va pullik ish vaqtining bir yoki ikki soatiga meditatsiya qilishga qaror qilishi mumkin.

## Tashqi o'zgaruvchilarning bir-biriga mos kelishi

```iqtibos muallifi="Guan Yin Zi"
Yorug'likda bo'lganingizda, zulmatda hech narsani ko'ra olmaysiz.<br>
Qorong'ida bo'lsa, hamma narsani yorug'likda ko'rish mumkin.
```

Funksiya ichidagi va tashqarisidagi o'zgaruvchilar uchun bir xil nomlardan foydalaning. Bu juda oddiy. Yangi nomlarni ixtiro qilishga hojat yo'q.

```js
let *!*user*/!* = authenticateUser();

function render() {
  let *!*user*/!* = anotherValue();
  ...
  ...many lines...
  ...
  ... // <-- dasturchi bu erda foydalanuvchi bilan ishlashni xohlaydi va ...
  ...
}
```

`render` ichiga sakrab kirgan dasturchi tashqi ko'rinishga soya solayotgan mahalliy `user` borligini sezmay qolishi mumkin.

Keyin ular `user` bilan ishlashga urinib ko'radilar, bu tashqi o'zgaruvchi, ya'ni `authenticateUser()` natijasidir... Qopqon ochildi! Salom, tuzatuvchi...


## Hamma joyda nojo'ya ta'sirlar!

Hech narsani o'zgartirmaydigan funksiyalar mavjud, masalan `isReady()`, `checkPermission()`, `findTags()`. Ular hisob-kitoblarni amalga oshiradilar, ma'lumotlarni topadilar va qaytaradilar, ulardan tashqari hech narsani o'zgartirmaydilar. Boshqacha qilib aytganda, buni "nojo'ya ta'sirlarsiz" bajarishadi.

**Asosiy vazifadan tashqari ularga "foydali" harakatni qo'shish haqiqatdan ham chiroyli hiyladir.**

Hamkasbingiz biror narsani o'zgartirayotgan `is...`, `check` yoki `find` funksiyalarini ko'rganida hayratda qolgan ifoda sizning fikringiz chegaralarini kengaytiradi.

**Ajablanishning yana bir usuli bu nostandart natijani qaytarishdir.**

Asl fikringizni ko'rsating! `checkPermission` chaqiruvi `true/false` ni emas, balki tekshirish natijalari bilan murakkab obyektni qaytarsin.

`If (checkPermission(..))` yozishga urinayotgan ishlab chiquvchilar nima uchun bu ishlamayotganiga hayron bo'lishadi. Ularga "Hujjatlarni o'qing!" - deb ayting. Va ushbu maqolani bering.

## Kuchli funksiyalar!

``` iqtibos muallifi="Laozi (Tao Te Ching)"
Buyuk Tao hamma joyda oqadi<br>
ham chapga, ham o'ngga.
```

Funksiyani uning nomida yozilgani bilan cheklamang. Kengroq fikrlang.

Masalan, `validateEmail(email)` funksiyasi (elektron pochtaning to'g'riligini tekshirishdan tashqari) xato xabarini ko'rsatishi va elektron pochtani qayta kiritishni so'rashi mumkin.

Qo'shimcha harakatlar funksiya nomidan aniq bo'lmasligi kerak. Haqiqiy ninja koder ularni koddan aniq ko'rsatmaydi.

**Bir nechta amallarni birlashtirish kodingizni qayta ishlatishdan himoya qiladi.**

Tasavvur qiling, boshqa dasturchi faqat elektron pochtani tekshirishni xohlaydi va hech qanday xabar chiqarmaydi. Ikkalasini ham bajaradigan `validateEmail(email)` funksiyangiz ularga mos kelmaydi. Shunday qilib, ular bu haqda nimadir so'rash bilan sizning meditatsiyangizni buzmaydi.

## Xulosa

Yuqoridagi barcha "maslahatlar" haqiqiy koddan... Ba'zan, tajribali ishlab chiquvchilar tomonidan yozilgan. Balki sizdan ham tajribaliroqdir:)

- Ulardan ba'zilarini kuzatib boring va sizning kodingiz kutilmagan hodisalarga to'la bo'ladi.
- Ularning ko'pchiligiga amal qiling, shunda sizning kodingiz haqiqatan ham sizniki bo'ladi, hech kim uni o'zgartirishni xohlamaydi.
- Hammasiga ergashing va sizning kodingiz ma'rifat izlayotgan yosh dasturchilar uchun qimmatli saboq bo'ladi.
