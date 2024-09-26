# Scrolling

`Scroll` hodisasi sahifa yoki elementni aylantirishga munosabat bildirish imkonini beradi. Bu yerda biz bajara oladigan ko'pgina yaxshi narsalar mavjud.

Masalan:
- Foydalanuvchi hujjatning qayerda joylashganiga qarab qo'shimcha boshqaruv elementlari yoki ma'lumotlarni ko'rsatish/yashirish.
- Foydalanuvchi sahifani oxirigacha aylantirganda ko'proq ma'lumotlarni yuklash.

Quyida joriy varaqni ko'rsatish uchun kichik funksiya berilgan:

```js autorun
window.addEventListener('scroll', function() {
  document.getElementById('showScroll').innerHTML = window.pageYOffset + 'px';
});
```

```online
Amaliy misol:

Current scroll = <b id="showScroll">scroll the window</b>
```

`Scroll` hodisasi `window` da ham, scroll qilsa bo'ladigan elementlarda ham ishlaydi.

## Scrolling ning oldini olish

Qanday qilib biz biror narsani aylantirib bo'lmaydigan qilamiz?

`onscroll` tinglovchisida `event.preventDefault()` dan foydalanib, scrolling ning oldini ololmaymiz, chunki u aylantirish allaqachon sodir bo'lgandan *keyin* ishga tushadi.

Lekin biz aylantirishni keltirib chiqaradigan hodisada `event.preventDefault()` orqali aylantirishni oldini olishimiz mumkin, masalan, `key:pageUp` va `key:pageDown` uchun `keydown` hodisasidan foydalanamiz.

Agar biz ushbu hodisalarga hodisa ishlov beruvchisini qo'shsak va unda `event.preventDefault()` bo'lsa, scroll qilish boshlanmaydi.

O'tkazishni boshlashning ko'plab usullari mavjud, CSS dagi `overflow` xususiyatidan foydalanish ishonchliroq.

Mana bir nechta vazifalarni hal qilishingiz yoki `onscroll` ilovalarini ko'rib chiqishingiz mumkin.
