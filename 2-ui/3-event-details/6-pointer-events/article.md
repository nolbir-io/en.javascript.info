# Pointer voqealari

Pointer hodisalari sichqoncha, qalam/stilus, sensorli ekran va boshqalar kabi turli ko'rsatuvchi qurilmalardan ma'lumotlarni kiritishning zamonaviy usuli hisoblanadi.

## Qisqacha tarix

Keling, umumiy rasm va Pointer hodisalarining boshqa hodisa turlari orasidagi o'rnini tushunishingiz uchun qisqa tushunchaga ega bo'laylik.

- Uzoq vaqt oldin, o'tmishda faqat sichqoncha hodisalari bo'lgan.

    Keyin sensorli qurilmalar, xususan, telefonlar va planshetlar keng tarqaldi. Mavjud skriptlar ishlashi uchun ular sichqoncha hodisalarini yaratgan (va hali ham ishlab chiqaradi). Masalan, sensorli ekranga tegish `mousedown` ni hosil qiladi. Shunday qilib, sensorli qurilmalar veb-sahifalar bilan yaxshi ishladi.

     Lekin sensorli qurilmalar sichqonchadan ko'ra ko'proq imkoniyatlarga ega. Misol uchun, bir vaqtning o'zida bir nechta nuqtaga tegish mumkin ("multi-touch"). Biroq, sichqoncha hodisalari bunday ko'p teginishlarni boshqarish uchun zarur xususiyatlarga ega emas.

- Shunday qilib, teginishning o'ziga xos xususiyatlariga ega bo'lgan `touchstart`, `touchend`, `touchmove` kabi teginish hodisalari joriy etildi (biz bu erda ularni batafsil ko'rib chiqmaymiz, chunki ko'rsatgich hodisalari yanada yaxshiroq).

    Shunga qaramay, bu yetarli emasdi, chunki o'ziga xos xususiyatlarga ega bo'lgan boshqa ko'plab qurilmalar, masalan, qalamlar mavjud. Bundan tashqari, teginish va sichqoncha hodisalarini tinglaydigan kod yozish juda qiyin edi.

- Ushbu muammolarni hal qilish uchun yangi standart Pointer Events joriy etildi. U barcha turdagi ko'rsatuvchi qurilmalar uchun yagona tadbirlar to'plamini taqdim etadi.

Hozirda [Pointer Events Level 2](https://www.w3.org/TR/pointerevents2/) spesifikatsiyasi barcha asosiy brauzerlarda qo'llab-quvvatlanadi, yangiroq [Pointer Events Level 3](https://w3c.github.io/pointerevents/) ishlamoqda va asosan Pointer Events 2-darajasiga mos keladi.

Internet Explorer 10 yoki Safari 12 yoki undan pastroq versiyalar kabi eski brauzerlar uchun ishlab chiqmaguningizcha, sichqonchani yoki teginish hodisalarini boshqa ishlatishdan ma'no yo'q -- biz ko'rsatgich hodisalariga o'tishimiz mumkin.

Keyin sizning kodingiz teginish va sichqoncha qurilmalari bilan yaxshi ishlaydi.

Ya'ni, Pointer hodisalaridan to'g'ri foydalanish va kutilmagan hodisalardan qochish uchun bilish kerak bo'lgan ba'zi muhim xususiyatlar mavjud. Ushbu maqolada biz ularga e'tibor qaratamiz.

## Pointer hodisasi turlari

Pointer hodisalari sichqoncha hodisalariga o'xshab nomlanadi:

| Pointer hodisalari | O'xshash sichqoncha hodisalari |
|---------------|-------------|
| `pointerdown` | `mousedown` |
| `pointerup` | `mouseup` |
| `pointermove` | `mousemove` |
| `pointerover` | `mouseover` |
| `pointerout` | `mouseout` |
| `pointerenter` | `mouseenter` |
| `pointerleave` | `mouseleave` |
| `pointercancel` | - |
| `gotpointercapture` | - |
| `lostpointercapture` | - |

Ko'rib turganimizdek, har bir `mouse<event>` uchun shunga o'xshash rol o'ynaydigan `pointer<event>` mavjud. Shuningdek, 3 ta qo'shimcha ko'rsatgich hodisasi mavjud bo'lib, ularda tegishli `mouse...` hamkasbi yo'q, biz ularni tez orada tushuntiramiz.

```smart header="Yozgan kodimizdagi `mouse<event>` ni `pointer<event>` bilan almashtirish"
Biz kodimizdagi `mouse<event>` hodisalarini `pointer<event>` bilan almashtirishimiz va sichqoncha bilan yaxshi ishlashini kutishimiz mumkin.

Sensorli qurilmalarni qo'llab-quvvatlash ham "sehrli" tarzda yaxshilanadi. Biroq, CSS-ning ba'zi joylariga `touch-action: none` qo'shishimiz kerak bo'lishi mumkin. Biz buni quyida `pointercancel` bo'limida ko'rib chiqamiz.
```

## Pointer hodisasi xususiyatlari

Pointer hodisalari sichqoncha hodisalari bilan bir xil xususiyatlarga ega, masalan, `clientX/Y`, `target` va boshqalar:

- `pointerId` - hodisani keltirib chiqaruvchi ko'rsatgichning yagona identifikatori.

    Brauzer tomonidan yaratilgan. Stylus va multi-touch sensorli ekran kabi bir nechta ko'rsatkichlarni boshqarishga imkon beradi (misollar quyida keltirilgan).
- `pointerType` - ishora qiluvchi qurilma turi. "Sichqoncha", "qalam" yoki "touch" lardan biri string bo'lishi kerak.

    Biz bu xususiyatdan turli ko'rsatkich turlariga boshqacha munosabatda bo'lish uchun foydalanishimiz mumkin.
- `isPrimary` - birlamchi ko'rsatkich uchun (ko'p teginishdagi birinchi barmoq) `true` hisoblanadi.

Ba'zi ko'rsatkich qurilmalari aloqa maydoni va bosimini o'lchaydi, masalan, sensorli ekrandagi barmoq uchun buning uchun qo'shimcha xususiyatlar mavjud:

- `width`` - ko`rsatgich (masalan, barmoq) qurilmaga tegib turgan joyning kengligi. Qo'llab-quvvatlanmaydigan joylarda, masalan, sichqoncha uchun har doim `1` bo'ladi.
- `height` - ko'rsatgich qurilmaga tegib turgan joyning balandligi. Qo'llab-quvvatlanmaydigan joyda u har doim `1` bo'ladi.
- `pressure` - ko'rsatkich uchi bosimi, 0 dan 1 gacha. Bosimni qo'llab-quvvatlamaydigan qurilmalar uchun `0,5` (bosilgan) yoki `0` bo'lishi kerak.
- `tangensialPressure` - normallashtirilgan tangensial bosim.
- `tiltX`, `tiltY`, `twist` - qalamning sirtga nisbatan qanday joylashishini tavsiflovchi qalamga xos xususiyatlar.

Bu xususiyatlar ko'pchilik qurilmalar tomonidan qo'llab-quvvatlanmaydi, shuning uchun ular kamdan-kam qo'llaniladi. Agar kerak bo'lsa, ular haqidagi ma'lumotlarni [spetsifikatsiyada] (https://w3c.github.io/pointerevents/#pointerevent-interface) topishingiz mumkin.

## Multi-touch

Sichqoncha hodisalari umuman qo'llab-quvvatlamaydigan narsalardan biri bu ko'p teginish: foydalanuvchi o'z telefoni yoki planshetida bir vaqtning o'zida bir nechta joyga tegishi yoki maxsus imo-ishoralarni bajarishi mumkin.

Pointer hodisalari `pointerId` va `isPrimary` xususiyatlari yordamida ko'p teginish bilan ishlashga imkon beradi.

Agar foydalanuvchi sensorli ekranga bir joyda tegsa, so'ngra boshqa barmog'ini boshqa joyga qo'yganda nima sodir bo'ladi:

1. Birinchi barmoq teginishda:
     - `isPrimary=true` va ba'zi `pointerId` bilan `pointerdown`.
2. Ikkinchi barmoq va undan ko'p barmoqlar uchun (birinchi barmoq hali ham tegib turgan bo'lsa):
     - `isPrimary=false` bilan `pointerdown` va har bir barmoq uchun boshqa `pointerId`.

E'tibor bering: `pointerId` butun qurilma uchun emas, balki har bir teginish barmoq uchun belgilanadi. Agar biz bir vaqtning o'zida ekranga teginish uchun 5 ta barmoqdan foydalansak, bizda har birining tegishli koordinatalari va boshqa `pointerId` ga ega bo'lgan 5 ta `pointerdown` hodisasi bo'ladi.

Birinchi barmoq bilan bog'liq hodisalar har doim `isPrimary=true` hisoblanadi.

Biz bir nechta teginish barmoqlarini ularning `pointerId` yordamida kuzatishimiz mumkin. Agar foydalanuvchi harakatlansa va keyin barmoqni olib tashlasa, biz `pointerdown` da bo'lgani kabi bir xil `pointerId` bilan `pointermove` va `pointerup` hodisalarini olamiz.

```online
Bu yerda `pointerdown` va `pointerup` hodisalarini qayd qiluvchi demo:

[iframe src="multitouch" edit height=200]

Esda tuting: `pointerId/isPrimary` farqini ko'rish uchun siz telefon yoki planshet kabi sensorli ekranli qurilmadan foydalanayotgan bo'lishingiz kerak. Sichqoncha kabi bir teginish qurilmalari uchun barcha ko'rsatgich hodisalari uchun `isPrimary=true` bilan bir xil `pointerId` bo'ladi.
```

## Event: pointercancel

Ko'rsatkichni bekor qilish hodisasi, ya'ni `pointercancel` davom etayotgan ko'rsatkich bilan o'zaro aloqada bo'lganda ishga tushadi va keyin biror narsa sodir bo'ladi, bu esa uni to'xtatishga olib keladi, shuning uchun boshqa ko'rsatgich hodisalari yaratilmaydi.

Bunday sabablar quyidagilardir:
- Ko'rsatkich qurilmasi jismonan o'chirilgan.
- Qurilmaning yo'nalishi o'zgardi (planshet aylantirildi).
- Brauzer o'zaro ta'sirni sichqonchaning ishorasi yoki masshtab-panjarasi yoki boshqa biror narsa deb hisoblab, o'zi hal qilishga qaror qildi.

Bu bizga qanday ta'sir qilishini ko'rish uchun amaliy misolda `pointercancel` ni ko'rsatamiz.

Aytaylik, <info:mouse-drag-and-drop> maqolasining boshida bo'lgani kabi biz to'p uchun drag'n'drop-ni qo'llaymiz.

Bu yerda foydalanuvchi harakatlarining oqimi va tegishli hodisalar:

1) Foydalanuvchi sudrab olishni boshlash uchun tasvirni bosadi
     - `pointerdown` hodisasi yonadi
2) Keyin ular ko'rsatgichni siljita boshlaydilar (shunday qilib tasvirni sudrab boradilar)
     - `pointermove` yonadi, ehtimol bir necha marta
3) Va keyin mo'jiza sodir bo'ladi! Brauzer tasvirlar uchun drag'n'drop-ni qo'llab-quvvatlaydi, bu esa drag'n'drop jarayonini boshlaydi va o'z zimmasiga oladi va shu bilan `pointercancel` hodisasini yaratadi.
     - Brauzer endi tasvirni o'z-o'zidan tortib olib tashlashni boshqaradi. Foydalanuvchi hatto to'p tasvirini brauzerdan, o'zining Pochta dasturiga yoki Fayl menejeriga sudrab olib chiqishi mumkin.
     - Endi biz uchun `pointermove` hodisalari yo'q.

Demak, muammo shundaki, brauzer o‘zaro ta’sirni “o‘g‘irlaydi”: “ko‘rsatgichni bekor qilish” “sudrab tashlash” jarayonining boshida ishga tushadi va boshqa “pointermove” hodisalari yaratilmaydi.

```online
Mana, `textarea` da ko'rsatgich hodisalari (faqat `up/down`, `move` va `cancel`) login bilan sudrab olib tashlash demosi:

[iframe src="ball" height=240 edit]
```
Biz sudrab olib tashlashni o'zimiz amalga oshirmoqchimiz, shuning uchun brauzerga uni o'z zimmasiga olmasligini aytaylik.

**`pointercancel` dan saqlanish uchun brauzerning standart harakatini oldini oling.**

Biz ikkita narsani bajarishimiz kerak:

1. Mahalliy drag'n'drop sodir bo'lishining oldini oling:
     - Biz buni xuddi <info:mouse-drag-and-drop> maqolasida tasvirlanganidek, `ball.ondragstart = () => false` ni o'rnatish orqali amalga oshirishimiz mumkin.
     - Bu sichqoncha hodisalari uchun yaxshi ishlaydi.
2. Sensorli qurilmalar uchun teginish bilan bog'liq boshqa brauzer amallari mavjud (drag'n'dropdan tashqari). Ular bilan ham muammolarni oldini olish uchun:
     - CSS-da `#ball { touch-action: none }` ni o'rnatish orqali ularning oldini oling.
     - Keyin bizning kodimiz sensorli qurilmalarda ishlay boshlaydi.

Buni qilganimizdan so'ng, voqealar mo'ljallanganidek ishlaydi, brauzer jarayonni o'g'irlamaydi va `pointercancel` ni chiqarmaydi.

```online
Ushbu demo quyidagi line larni qo'shadi:

[iframe src="ball-2" height=240 edit]

Ko'ribturganingizdek, endi bu yerda boshqa `pointercancel` mavjud emas.
```

Endi biz to'pni harakatga keltirish uchun kodni qo'shishimiz mumkin va drag'n'drop sichqoncha va sensorli qurilmalar uchun ishlaydi.

## Pointer capturing

Pointer capturing pointer hodisalarining o'ziga xos xususiyatidir.

G'oya juda oddiy, lekin birinchi qarashda juda g'alati tuyulishi mumkin, chunki boshqa hech qanday hodisa turi uchun bunday narsa mavjud emas.

Asosiy usul:
- `elem.setPointerCapture(pointerId)` -- berilgan `pointerId` bilan hodisalarni `elem` bilan bog'laydi. Qo'ng'iroqdan keyin bir xil `pointerId` ga ega bo'lgan barcha ko'rsatkich voqealari hujjatning qayerida sodir bo'lishidan qat'iy nazar, maqsad sifatida `elem` ga ega bo'ladi (`elem` da sodir bo'lgandek).

Boshqacha qilib aytganda, `elem.setPointerCapture(pointerId)` berilgan `pointerId` bilan barcha keyingi hodisalarni `elem` ga qayta yo'naltiradi.

Bog'lanish olib tashlanadi:
- avtomatik ravishda `pointerup` yoki `pointercancel` hodisalari sodir bo'lganda,
- `elem` hujjatdan avtomatik ravishda olib tashlanganda,
- `elem.releasePointerCapture(pointerId)` chaqirilganda.

Endi u nima uchun yaxshi? Hayotiy misolni ko'rish vaqti keldi.

**Ko'rsatgichni suratga olish o'zaro ta'sirlarni drag-n'drop turini soddalashtirish uchun ishlatilishi mumkin.**

Keling, <info:mouse-drag-and-drop>-da tasvirlangan maxsus slayderni qanday amalga oshirish mumkinligini eslaylik.

Biz chiziq va uning ichidagi "yuguruvchi" (`thumb`)ni ifodalash uchun `slayder` elementini yasashimiz mumkin:

```html
<div class="slider">
  <div class="thumb"></div>
</div>
```

Style yordamida u quyidagicha ko'rinishda bo'ladi:

[iframe src="slider-html" height=40 edit]

<p></p>

    Sichqoncha hodisalarini o'xshash ko'rsatkich hodisalari bilan almashtirgandan so'ng ish mantig'i:

1. Foydalanuvchi slayderni bosadi `thumb` -- `pointerdown` ishga tushiriladi.
2. Keyin ular ko'rsatgichni harakatga keltiradilar -- `pointermove` ishga tushiriladi va bizning kodimiz `thumb` elementi bo'ylab harakatlanadi.
     - ...Ko'rsatkich harakatlanayotganda u slayder `thumb` elementini tark etishi mumkin, uning ustiga yoki pastiga o'ting. `thumb` ko'rsatgich bilan tekislangan holda qat'iy gorizontal harakatlanishi kerak.

Sichqoncha hodisasiga asoslangan yechimda ko'rsatgichning barcha harakatlarini kuzatish uchun, shu jumladan, `thumb` ustida/pastda bo'lganda, biz butun `document` ga `mousemove` hodisasi ishlov beruvchisini belgilashimiz kerak edi.

Biroq, bu eng toza yechim emas. Muammolardan biri shundaki, foydalanuvchi kursorni hujjat atrofida harakatlantirganda, u boshqa ba'zi elementlarda hodisa ishlov beruvchilarini (masalan, `mouseover`), mutlaqo bog'liq bo'lmagan UI funksiyalarini ishga tushirishi mumkin va biz buni xohlamaymiz.

Bu `setPointerCapture` o'ynaydigan joy.

- Biz `pointerdown` ishlov beruvchisida `thumb.setPointerCapture(event.pointerId)` ni chaqirishimiz mumkin,
- Keyin `pointerup/cancel` gacha bo'lgan kelajakdagi ko'rsatkich voqealari `thumb` qayta yo'naltiriladi.
- `pointerup` sodir bo'lganda (dragging tugallanadi), bog'lanish avtomatik ravishda o'chiriladi, biz bunga ahamiyat bermasligimiz kerak.

Shunday qilib, agar foydalanuvchi ko'rsatgichni butun hujjat bo'ylab harakatlantirsa ham, voqealar ishlov beruvchilari `thumb` bilan chaqiriladi. Shunga qaramay, hodisa obyektlarining koordinata xususiyatlari, masalan, `clientX/clientY` hali ham to'g'ri bo'ladi - suratga olish faqat `target/currentTarget` ga ta'sir qiladi.

Mana asosiy kod:

```js
thumb.onpointerdown = function(event) {
  // thumb ga barcha ko'rsatkich voqealarini (ko'rsatgichgacha) qayta yo'naltiring
  thumb.setPointerCapture(event.pointerId);

  // ko'rsatgich harakatlarini kuzatishni boshlang
  thumb.onpointermove = function(event) {
    // slayderni siljitish: thumb ni tinglang, chunki barcha ko'rsatkich voqealari unga qayta yo'naltiriladi
    let newLeft = event.clientX - slider.getBoundingClientRect().left;
    thumb.style.left = newLeft + 'px';
  };

  // ko'rsatgichda yuqoriga ko'rsatkichni kuzatishni tugatish
  thumb.onpointerup = function(event) {
    thumb.onpointermove = null;
    thumb.onpointerup = null;
    // ... shuningdek, agar kerak bo'lsa, "drag end" ni ham qayta ishlang
  };
};

// Eslatma: thumb.releasePointerCapture ni chaqirishga hojat yo'q,
// bu ko'rsatgichda avtomatik ravishda sodir bo'ladi
```

```online
To'liq namuna:

[iframe src="slider" height=100 edit]

<p></p>

Namoyishda joriy sanani ko'rsatuvchi `onmouseover` ishlov beruvchisi bilan qo'shimcha element ham mavjud.

Iltimos, diqqat qiling: bosh barmog'ingizni sudrab ketayotganda kursorni ushbu element ustiga olib borishingiz mumkin va uning ishlov beruvchisi *tetiklanmaydi*.

Shunday qilib, `setPointerCapture` tufayli sudrab olib tashlash endi nojo'ya ta'sirlardan holi.
```

Oxir-oqibat, markerni suratga olish bizga ikkita afzallik beradi:
1. Kod toza bo'ladi, chunki biz butun `document` ga ishlov beruvchilarni qo'shish/o'chirishga hojat qolmaydi. Bog'lanish avtomatik ravishda chiqariladi.
2. Hujjatda boshqa ko'rsatgich hodisalari ishlov beruvchilari mavjud bo'lsa, foydalanuvchi slayderni sudrab olib borayotganda ular tasodifan ko'rsatgich tomonidan ishga tushmaydi.

### Pointer capturing hodisalari

To'liqlik uchun bu yerda yana bir narsani eslatib o'tish kerak.

Ko'rsatkichni suratga olish bilan bog'liq ikkita hodisa mavjud:

- Element suratga olishni yoqish uchun `setPointerCapture` dan foydalanganda `gotpointercapture` yonadi.
- `lostpointercapture` qo'lga olish qo'yib yuborilganda yonadi: aniq `releasePointerCapture` chaqiruvi bilan yoki avtomatik ravishda `pointerup`/`pointercancel` da.

## Xulosa

Pointer hodisalari sichqoncha, teginish va qalam hodisalarini bir vaqtning o'zida bitta kod bilan boshqarishga imkon beradi.

Pointer hodisalari sichqoncha hodisalarini kengaytiradi. Biz hodisa nomlarida `mouse` ni `pointer` bilan almashtirishimiz mumkin va bizning kodimiz boshqa qurilmalar turlarini yaxshiroq qo'llab-quvvatlagan holda sichqoncha uchun ishlashda davom etishini kutishimiz mumkin.

Brauzer o'z-o'zidan o'g'irlash va boshqarishga qaror qilishi mumkin bo'lgan drag'n'drops va murakkab teginish shovqinlari uchun - hodisalardagi standart amalni bekor qilishni va biz jalb qiladigan elementlar uchun CSS-da `touch-action:none` ni o'rnatishni unutmang.

Pointer hodisalarining qo'shimcha qobiliyatlari quyidagilardir:

- `PointerId` va `isPrimary` yordamida multi-touchni qo'llab-quvvatlash.
- `pressure`, `width/height` va boshqalar kabi qurilmaga xos xususiyatlar.
- Pointer capturing: biz barcha ko'rsatgich hodisalarini `pointerup`/`pointercancel` gacha ma'lum bir elementga qayta yo'naltirishimiz mumkin.

Hozirda ko'rsatgich hodisalari barcha asosiy brauzerlarda qo'llab-quvvatlanadi, shuning uchun biz ularga xavfsiz o'tishimiz mumkin, ayniqsa IE10- va Safari 12- kerak bo'lmasa. Va hatto o'sha brauzerlarda ham ko'rsatgich hodisalarini qo'llab-quvvatlaydigan polifilllar mavjud.
