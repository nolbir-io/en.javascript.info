# Orbital (samoviy) balandlikdan

Ushbu bo'limda "veb komponentlar" uchun zamonaviy standartlar to'plami tasvirlangan.

Hozirda ushbu standartlar ishlab chiqilmoqda. Ba'zi xususiyatlar yaxshi qo'llab-quvvatlanadi va zamonaviy HTML/DOM standartiga integratsiyalangan, boshqalari esa hali loyiha bosqichida. Siz har qanday brauzerda misollarni sinab ko'rishingiz mumkin. Google Chrome, ehtimol, bu xususiyatlar bilan eng yangilangan variantdir. O'ylab ko'ring, buning sababi Google dan boshqa varianlar mavzuga aloqador ko'plab texnik xususiyatlarga ega emas.

## O'rtada umumiylik bormi...

Butun komponent g'oyasi yangi narsa emas. U ko'plab ramkalarda va boshqa joylarda qo'llaniladi.

Amalga oshirish tafsilotlariga o'tishdan oldin, insoniyatning ushbu buyuk yutug'iga nazar tashlang:

![](satellite.jpg)

Bu Xalqaro kosmik stansiya (XKS).

Va ichkarida shunday harakat bajarilgan (taxminan):

![](satellite-expanded.jpg)

Xalqaro kosmik stansiya:
- Ko'plab komponentlardan tashkil topgan.
- Har bir komponent, o'z navbatida, ichida juda ko'p mayda detallarga ega.
- Komponentlar aksariyat veb-saytlarga qaraganda ancha murakkab.
- Komponentlar xalqaro miqyosda, turli mamlakatlardan kelgan, turli tillarda gaplashadigan jamoalar tomonidan ishlab chiqilgan.

...Va bu narsa uchadi, odamlarni koinotda tirik saqlaydi!

Bunday murakkab qurilmalar qanday yaratilgan?

Rivojlanishimizni bir xil darajadagi ishonchli va kengaytiriladigan qilish uchun qanday tamoyillarni olishimiz mumkin? Hech bo'lmaganda, unga yaqinini ololamizmi?

## Komponent tuzilishi

Murakkab dasturiy ta'minotni ishlab chiqishning taniqli qoidasi - bu murakkab dasturiy ta'minotni yaratmaslik.

Agar biror narsa murakkab bo'lib qolsa -- uni oddiyroq qismlarga bo'ling va eng aniq tarzda ulang.

**Yaxshi arxitektor - bu murakkabni soddalashtira oladigan arxitektor**

Biz foydalanuvchi interfeysini vizual komponentlarga ajratishimiz mumkin: ularning har biri sahifada o'z o'rniga ega, yaxshi tasvirlangan vazifani boshqalardan alohida "bajara oladi".

Keling, veb-saytni ko'rib chiqaylik, masalan, Twitter.

Tabiiyki, u ham tarkibiy qismlarga bo'linadi:

![](web-components-twitter.svg)

1. Yuqori navigatsiya.
2. Foydalanuvchi ma'lumotlari.
3. Takliflarga amal qiling.
4. Shaklni yuborish.
5. (shuningdek, 6, 7) -- xabarlar.

Komponentlar subkomponentlarga ega bo'lishi mumkin, masalan, xabarlar yuqori darajadagi "xabarlar ro'yxati" komponentining qismlari bo'lishi, bosiladigan foydalanuvchi rasmining o'zi komponent bo'lishi mumkin va hokazo.

Komponent nimaligi haqida qanday qilib bir qarorga kelishimiz mumkin? Bu sezgi, tajriba va sog'lom fikrdan kelib chiqadi. Odatda bu alohida vizual obyekt bo'lib, biz uning nima qilishi va sahifa bilan o'zaro ta'siri nuqtayi nazaridan tasvirlashimiz mumkin. Yuqoridagi holatda, sahifada bloklar mavjud, ularning har biri o'z rolini o'ynaydi, bu komponentlarni bajarish mantiqiy hisoblanadi. 

Komponentda quyidagilar mavjud:
- O'zining JavaScript klassi.
- DOM tuzilishi, faqat o'z sinfi tomonidan boshqariladi, tashqi kod unga kira olmaydi ("inkapsulyatsiya" printsipi).
- Komponentga qo'llaniladigan CSS uslublari.
- API: hodisalar, sinf usullari va boshqalar, boshqa komponentlar bilan o'zaro ta'sir qilish.

Yana bir bor takrorlaymiz, butun "komponent" narsa alohida narsa emas.

Ularni qurish uchun ko'plab ramkalar va rivojlanish metodologiyalari mavjud, ularning har biri o'z qo'ng'iroqlari va hushtaklariga ega. Odatda, maxsus CSS klasslari va konventsiyalari "komponent hissini" ta'minlash uchun ishlatiladi, masalan, CSS miqyosi va DOM inkapsulyatsiyasi. 

"Veb komponentlar" buning uchun o'rnatilgan brauzer imkoniyatlarini ta'minlaydi, shuning uchun biz ularga boshqa taqlid qilishimiz shart emas.

- [Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements) -- maxsus HTML elementlarini aniqlash uchun.
- [Shadow DOM](https://dom.spec.whatwg.org/#shadow-trees) -- komponent uchun boshqalardan yashiringan ichki DOM yaratish.
- [CSS Scoping](https://drafts.csswg.org/css-scoping/) --  faqat komponentning Shadow DOM ichida qo'llaniladigan uslublarni e'lon qilish.
- [Event retargeting](https://dom.spec.whatwg.org/#retarget) - maxsus komponentlarni ishlab chiqishga yaxshiroq moslashtirish uchun boshqa kichik narsalar.

 Keyingi bobda biz "Maxsus elementlar", ya'ni o'z-o'zidan yaxshi bo'lgan veb-komponentlarning asosiy va yaxshi qo'llab-quvvatlanadigan xususiyatini tafsilotlarini ko'rib chiqamiz.
