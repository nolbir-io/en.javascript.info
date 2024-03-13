# Bezier egri chizig'i

Bezier egri chiziqlari kompyuter grafikasida shakllarni chizish, CSS animatsiyasi va boshqa ko'plab joylarda qo'llaniladi.

Ular juda oddiy narsa, bir marta o'rganishga arziydi va keyin vektor grafikasi va ilg'or animatsiyalar dunyosida o'zingizni qulay his qilasiz.

```smart header="Iltimos, qandaydir nazariya"
Ushbu maqolada Bezier egri chiziqlari nima ekanligi haqida nazariy, ammo juda zarur tushuncha berilgan, [keyingi] (info:css-animations#bezier-curve) esa ularni CSS animatsiyalari uchun qanday ishlatishimiz mumkinligini ko'rsatadi.

Iltimos, kontseptsiyani o'qish va tushunish uchun vaqt ajrating, bu sizga yaxshi xizmat qiladi.
```

## Boshqarish nuqtalari

[Bezier egri](https://en.wikipedia.org/wiki/B%C3%A9zier_curve) nazorat nuqtalari bilan aniqlanadi.

2, 3, 4 yoki undan ko'p bo'lishi mumkin.

Masalan, ikkita nuqta egri chizig'i:

![](bezier2.svg)

Uch nuqtali egri chiziq:

![](bezier3.svg)

To'rt nuqta egri chizig'i:

![](bezier4.svg)

Agar siz ushbu egri chiziqlarga diqqat bilan qarasangiz, darhol ko'rishingiz mumkin:

1. **Nuqtalar har doim ham egri chiziqda bo'lavermaydi.** Bu mutlaqo normal holat, keyinroq egri chiziq qanday qurilganini ko'ramiz.
2. **Egri chiziqning tartibi nuqtalar soniga minus bittaga teng**.
Ikki nuqta uchun chiziqli egri chiziq (bu to'g'ri chiziq), uchta nuqta uchun - kvadratik egri (parabolik), to'rt nuqta uchun - kub egri.
3. **Egri chiziq har doim nazorat nuqtalarining [qavariq korpusi](https://en.wikipedia.org/wiki/Convex_hull) ichida joylashgan:**

    ![](bezier4-e.svg) ![](bezier3-e.svg)

Ushbu oxirgi xususiyat tufayli kompyuter grafikasida kesishish testlarini optimallashtirish mumkin. Qavariq korpuslar kesishmasa, egri chiziqlar ham kesishmaydi. Shunday qilib, birinchi navbatda qavariq korpuslarning kesishishini tekshirish juda tez "kesishmasiz" natijani berishi mumkin. Qavariq korpuslarning kesishishini tekshirish ancha oson, chunki ular to'rtburchaklar, uchburchaklar va boshqalar (yuqoridagi rasmga qarang), egri chiziqqa qaraganda ancha sodda raqamlar hisoblanadi.

**Bezier egri chizmalarining asosiy qiymati -- nuqtalarni siljitish orqali egri chiziq *intuitiv ravishda ravshan tarzda o'zgaradi*.**

Quyidagi misolda sichqoncha yordamida boshqaruv nuqtalarini siljitishga harakat qiling:

[iframe src="demo.svg?nocpath=1&p=0,0,0.5,0,0.5,1,1,1" height=370]

**E'tibor berganingizdek, egri chiziq 1 -> 2 va 3 -> 4 tangensial chiziqlar bo'ylab cho'zilgan.**

Biroz mashqdan so'ng kerakli egri chiziqni olish uchun nuqtalarni qanday joylashtirish kerakligi aniq bo'ladi. Va bir nechta egri chiziqlarni birlashtirib, biz deyarli hamma narsani olishimiz mumkin.

Mana, quyida bir nechta misollar berilgan:

![](bezier-car.svg) ![](bezier-letter.svg) ![](bezier-vase.svg)

## De Casteljau algoritmi

Bezier egri chiziqlari uchun matematik formula bor, lekin keling, uni biroz keyinroq yoritamiz, chunki
[De Casteljau algoritmi](https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm) matematik ta'rif bilan bir xil bo'lib, uning qanday tuzilganligini vizual ravishda ko'rib chiqamiz.

Avval 3 nuqtali misolni ko'rib chiqaylik.

Mana demo va tushuntirish.

Boshqaruv nuqtalarini (1,2 va 3) sichqoncha bilan siljitish mumkin. Uni ishga tushirish uchun "play" tugmasini bosing.

[iframe src="demo.svg?p=0,0,0.5,1,1,0&animate=1" height=370]

**De Casteljauning 3 nuqtali bezier egri chizig'ini qurish algoritmi:**

1. Nazorat nuqtalarini chizing. Yuqoridagi demoda ular etiketlangan: `1`, `2`, `3`.
2. 1 -> 2 -> 3 nazorat nuqtalari orasidagi segmentlarni yarating. Yuqoridagi namoyishda ular <span style="color:#825E28">jigarrang</span>.
3. `t` parametri `0` dan `1` ga o'tadi. Yuqoridagi misolda `0,05` qadami qo'llaniladi: tsikl `0, 0,05, 0,1, 0,15, ... 0,95, 1` dan oshib ketadi.

   Ushbu `t` qiymatlarining har biri uchun:

    - Har bir <span style="color:#825E28">jigarrang</span> segmentida biz boshidan `t` ga proportsional masofada joylashgan nuqtani olamiz. Ikki segment bo'lgani uchun bizda ikkita nuqta bor.

        Masalan, `t=0` uchun -- ikkala nuqta segmentlar boshida, `t=0,25` uchun esa -- boshidan segment uzunligining 25% ida, `t=0,5` uchun -- 50 bo'ladi. %(o'rtada), `t=1` uchun -- segmentlar oxirida.

    - Nuqtalarni ulang. Quyidagi rasmda birlashtiruvchi segment <span style="color:#167490">ko'k</span> rangga bo'yalgan.


| `t=0.25` uchun             | `t=0.5` uchun            |
| ------------------------ | ---------------------- |
| ![](bezier3-draw1.svg)   | ![](bezier3-draw2.svg) |

4. Endi <span style="color:#167490">ko'k</span> segmentida `t` ning bir xil qiymatiga proportsional masofadagi nuqtani oling. Ya'ni, `t=0,25` (chapdagi rasm) uchun segmentning chap choragi oxirida, `t=0,5` (o'ngdagi rasm) uchun esa segmentning o'rtasida nuqta bor. Yuqoridagi rasmlarda bu nuqta <span style="color:red">qizil</span>.

5. `t` `0` dan `1` gacha ishlaganda, `t` ning har bir qiymati egri chiziqqa nuqta qo'shadi. Bunday nuqtalar to'plami Bezier egri chizig'ini hosil qiladi. U yuqoridagi rasmlarda qizil va parabolik tasvirlangan.

Bu 3 ochko uchun jarayon edi. Ammo 4 ochko uchun ham xuddi shunday.

4 ball uchun demo (nuqtalarni sichqoncha bilan siljitish mumkin):

[iframe src="demo.svg?p=0,0,0.5,0,0.5,1,1,1&animate=1" height=370]

4 ball uchun algoritm:

- Boshqaruv nuqtalarini segmentlar bo'yicha ulang: 1 -> 2, 2 -> 3, 3 -> 4. 3 ta <span style="color:#825E28">jigarrang</span> segmentlar bo'ladi.
- `0` dan `1` oralig'idagi har bir `t` uchun:
     - Biz boshidan `t` ga proportsional masofada ushbu segmentlar bo'yicha ochkolarni olamiz. Bu nuqtalar ulangan, shuning uchun bizda ikkita <span style="color:#0A0">yashil segment</span> mavjud.
     - Bu segmentlarda biz `t` ga proportsional nuqtalarni olamiz. Biz bitta <span style="color:#167490">koʻk segment</span> olamiz.
     - Moviy segmentda biz `t` ga proportsional nuqtani olamiz. Yuqoridagi misolda bu <span style="color:red">qizil</span>.
- Bu nuqtalar birgalikda egri chiziq hosil qiladi.

Algoritm rekursiv bo'lib, har qanday nazorat nuqtalari uchun umumlashtirilishi mumkin.

N nazorat nuqtalari berilgan:

1. Biz ularni dastlab N-1 segmentlarini olish uchun bog'laymiz.
2. Keyin `0` dan `1` gacha bo'lgan har bir `t` uchun `t` ga proportsional masofadagi har bir segmentdan nuqta olib, ularni bog`laymiz. N-2 segmentlari bo'ladi.
3. Faqat bitta nuqta qolguncha 2-bosqichni takrorlang.

Bu nuqtalar egri chiziq hosil qiladi.

```online
**Segmentlar va egri chiziq qanday qurilganligini aniq ko'rish uchun misollarni ishga tushiring va pauza qiling.**
```


`y=1/t` ga o'xshash egri chiziq:

[iframe src="demo.svg?p=0,0,0,0.75,0.25,1,1,1&animate=1" height=370]

Zig-zag boshqaruv nuqtalari ham yaxshi ishlaydi:

[iframe src="demo.svg?p=0,0,1,0.5,0,0.5,1,1&animate=1" height=370]

Loop qilish mumkin:

[iframe src="demo.svg?p=0,0,1,0.5,0,1,0.5,0&animate=1" height=370]

Silliq bo'lmagan Bezier egri chizig'i (ha, bu ham mumkin):

[iframe src="demo.svg?p=0,0,1,1,0,1,1,0&animate=1" height=370]

```online
Algoritm tavsifida tushunarsiz narsa bo'lsa, yuqoridagi jonli misollarda egri chiziq qanday qurilishini ko'ring.
```

Algoritm rekursiv bo'lgani uchun biz har qanday tartibdagi Bezier egri chiziqlarini qurishimiz mumkin, ya'ni: 5, 6 yoki undan ortiq nazorat nuqtalari yordamida. Ammo amalda ko'p fikrlar kamroq foydali. Odatda biz 2-3 ball olamiz va murakkab chiziqlar uchun bir nechta egri chiziqlarni yopishtiramiz. Buni ishlab chiqish va hisoblash osonroq.

```smart header="Berilgan nuqtalar *orqali* egri chiziq qanday chiziladi?"
Bezier egri chizig'ini belgilash uchun nazorat nuqtalaridan foydalaniladi. Ko'rib turganimizdek, ular birinchi va oxirgilardan tashqari egri chiziqda emas.

Ba'zan bizda yana bir vazifa bor: *bir nechta nuqtalar orqali* egri chiziq chizish, shunda ularning barchasi bitta silliq egri chiziqda bo'ladi. Bu vazifa [interpolyatsiya](https://en.wikipedia.org/wiki/Interpolation) deb nomlanadi va bu yerda biz uni qamrab olmaymiz.

Bunday egri chiziqlar uchun matematik formulalar mavjud, masalan, [Lagrange polinomi](https://en.wikipedia.org/wiki/Lagrange_polynomial). Kompyuter grafikasida [spline interpolation](https://en.wikipedia.org/wiki/Spline_interpolation) ko'pincha ko'p nuqtalarni bog'laydigan silliq egri chiziqlarni qurish uchun ishlatiladi.
```

## Matematika

Bezier egri chizig'ini matematik formula yordamida tasvirlash mumkin.

Ko'rib turganimizdek, buni bilishning hojati yo'q, ko'pchilik sichqoncha bilan nuqtalarni siljitish orqali egri chiziq chizadi. Agar siz matematikaga qiziqsangiz - ajoyib.

<code>P<sub>i</sub></code> nazorat nuqtalarining koordinatalarini hisobga olgan holda: birinchi nazorat nuqtasi koordinatalariga ega <code>P<sub>1</sub> = (x<sub>1</sub>) sub>, y<sub>1</sub></code>, ikkinchisi: <code>P<sub>2</sub> = (x<sub>2</sub>, y<sub>2 </sub>)</code> va hokazo, egri chiziq koordinatalari `[0,1]` segmentidan `t` parametriga bog'liq bo'lgan tenglama bilan tavsiflanadi.

- 2 nuqtali egri formulasi:

    <code>P = (1-t)P<sub>1</sub> + tP<sub>2</sub></code>
- 3 ta nazorat nuqtasi uchun:

    <code>P = (1−t)<sup>2</sup>P<sub>1</sub> + 2(1−t)tP<sub>2</sub> + t<sup>2</sup>P<sub>3</sub></code>
- 4 ta nazorat nuqtasi uchun:

    <code>P = (1−t)<sup>3</sup>P<sub>1</sub> + 3(1−t)<sup>2</sup>tP<sub>2</sub>  +3(1−t)t<sup>2</sup>P<sub>3</sub> + t<sup>3</sup>P<sub>4</sub></code>


Bu vektor tenglamalari. Boshqacha qilib aytganda, mos keladigan koordinatalarni olish uchun `P` o'rniga `x` va `y` qo'yishimiz mumkin.

Masalan, 3 nuqtali egri chiziq `(x, y)` nuqtalari orqali hosil bo'ladi:

- <code>x = (1−t)<sup>2</sup>x<sub>1</sub> + 2(1−t)tx<sub>2</sub> + t<sup>2</sup>x<sub>3</sub></code>
- <code>y = (1−t)<sup>2</sup>y<sub>1</sub> + 2(1−t)ty<sub>2</sub> + t<sup>2</sup>y<sub>3</sub></code>

<code>x<sub>1</sub>, y<sub>1</sub>, x<sub>2</sub>, y<sub>2</sub>, x<sub>3 o'rniga </sub>, y<sub>3</sub></code> biz 3 ta nazorat nuqtasining koordinatalarini qo'yishimiz kerak, so'ngra `t` `0`dan `1`ga o'tganda, `t` ning har bir qiymati uchun egri chiziqning `(x,y)` ga ega bo'lamiz.

Masalan, agar nazorat nuqtalari `(0,0)`, `(0,5, 1)` va `(1, 0)` bo'lsa, tenglamalar quyidagicha bo'ladi:

- <code>x = (1−t)<sup>2</sup> * 0 + 2(1−t)t * 0.5 + t<sup>2</sup> * 1 = (1-t)t + t<sup>2</sup> = t</code>
- <code>y = (1−t)<sup>2</sup> * 0 + 2(1−t)t * 1 + t<sup>2</sup> * 0 = 2(1-t)t = –2t<sup>2</sup> + 2t</code>

Endi `t` `0` dan `1` gacha ishlaganda, har bir `t` uchun `(x,y)` qiymatlar to'plami bunday nazorat nuqtalari uchun egri chiziq hosil qiladi.

## Xulosa

Bezier egri chiziqlari ularning nazorat nuqtalari bilan belgilanadi.

Biz Bezier egri chizig'ining ikkita ta'rifini ko'rdik:

1. Chizish jarayonidan foydalanish: De Kastelyau algoritmi.
2. Matematik formulalardan foydalanish.

Bezier egri chizig'ining yaxshi xususiyatlari:

- Boshqaruv nuqtalarini siljitish orqali sichqoncha yordamida silliq chiziqlar chizishimiz mumkin.
- Murakkab shakllar bir nechta Bezier egri chiziqlaridan tayyorlanishi mumkin.

Foydalanishi:

- Kompyuter grafikasi, modellashtirish, vektor grafik muharrirlarida shriftlar Bezier egri chiziqlari bilan tavsiflanadi.
- Veb-ishlab chiqishda -- Canvas va SVG formatidagi grafikalar uchun. Aytgancha, yuqoridagi "jonli" misollar SVG da yozilgan. Ular aslida parametr sifatida turli nuqtalar berilgan yagona SVG hujjatidir. Siz uni alohida oynada ochishingiz va manbani ko'rishingiz mumkin: [demo.svg](demo.svg?p=0,0,1,0.5,0,0.5,1,1&animate=1).
- CSS animatsiyasi animatsiya yo'li va tezligini tasvirlash uchun mo'ljallangan.