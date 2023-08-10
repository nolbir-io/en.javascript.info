# Resumable faylni yuklash (yuklashda kelgan joyidan davom etiladi)

`Fetch` usuli bilan faylni yuklash juda oson.

Ulanish uzilganidan keyin yuklashni qanday davom ettirish mumkin? Buning uchun o'rnatilgan variant yo'q, lekin bizda uni amalga oshirish uchun qismlar mavjud.

Qayta tiklanadigan yuklashlar yuklash jarayonini ko'rsatishi kerak, chunki biz katta fayllarni kutmoqdamiz (agar davom ettirishimiz kerak bo'lsa). Shunday qilib, `fetch` yuklash jarayonini kuzatishga imkon bermagani uchun biz [XMLHttpRequest](info:xmlhttprequest) dan foydalanamiz.

## Unchalik foydali bo'lmagan progress hodisasi

Yuklashni davom ettirish uchun ulanish uzilib qolguncha qancha yuklanganligini bilishimiz kerak.

Yuklash jarayonini kuzatish uchun `xhr.upload.onprogress` mavjud.

Afsuski, bu yerda yuklashni davom ettirish bizga yordam bermaydi, chunki u maʼlumotlar *sent* qilinganda, ya'ni yuborilganda ishga tushadi, lekin u server tomonidan qabul qilinganmi? Brauzer buni bilmaydi.

Ehtimol, u mahalliy tarmoq proksi-serveri tomonidan buferlangan bo'lishi mumkin yoki masofaviy server jarayoni o'lib qolgan va ularni qayta ishlay olmadi yoki u o'rtada yo'qolgan va qabul qiluvchiga etib bormagan.

Shuning uchun bu hodisa faqat yaxshi taraqqiyot satrini ko'rsatish uchun foydalidir.

Yuklashni davom ettirish uchun biz server tomonidan qabul qilingan baytlar sonini *aniq* bilishimiz kerak. Va buni faqat server aytishi mumkin, shuning uchun biz qo'shimcha so'rov yuboramiz.

## Algoritm

1. Birinchidan, biz yuklaydigan faylni to'g'ri aniqlash uchun fayl identifikatorini yarating:
    ```js
    let fileId = file.name + '-' + file.size + '-' + file.lastModified;
    ```
    Bu rezyumeni yuklash, serverga nima davom ettirayotganimizni aytish uchun kerak.

    Agar nom yoki o'lcham yoki oxirgi o'zgartirish sanasi o'zgarsa, boshqa `fileId` bo'ladi.

2. Serverga qancha bayt borligini so'rab so'rov yuboring, masalan:
    ```js
    let response = await fetch('status', {
      headers: {
        'X-File-Id': fileId
      }
    });

    // Serverda shuncha ko'p bayt bor
    let startByte = +await response.text();
    ```

    Bu server `X-File-Id` sarlavhasi bo'yicha yuklangan fayllarni kuzatadi deb taxmin qiladi. Bu vazifa server tomonida amalga oshirilishi kerak.

    Agar fayl serverda hali mavjud bo'lmasa, server javobi `0` bo'lishi kerak

3. Keyin, biz `startByte` dan faylni yuborish uchun `Blob` usuli `slice` dan foydalanishimiz mumkin:
    ```js
    xhr.open("POST", "upload");

    // Fayl identifikatori, shuning uchun server qaysi faylni yuklashimizni biladi
    xhr.setRequestHeader('X-File-Id', fileId);

    // Biz davom ettirayotgan bayt, shuning uchun server davom etayotganimizni biladi
    xhr.setRequestHeader('X-Start-Byte', startByte);

    xhr.upload.onprogress = (e) => {
      console.log(`Uploaded ${startByte + e.loaded} of ${startByte + e.total}`);
    };

    // fayl input.files[0] yoki boshqa manbadan bo'lishi mumkin
    xhr.send(file.slice(startByte));
    ```

    Bu yerda biz serverga ikkala fayl identifikatorini `X-File-Id` sifatida yuboramiz, shuning uchun u qaysi faylni yuklayotganimizni biladi, va boshlang'ich baytni `X-Start-Byte` deb biladi, shuning uchun biz uni dastlab yuklamayotganimizni biladi, lekin jarayon davom etmoqda.

    Server o'z yozuvlarini tekshirishi kerak va agar ushbu fayl yuklangan bo'lsa va joriy yuklangan o'lcham aynan `X-Start-Bayt` bo'lsa, unga ma'lumotlarni qo'shing.


Bu yerda Node.js da yozilgan mijoz va server kodi bilan demo berilgan.

U ushbu saytda faqat qisman ishlaydi, chunki Node.js Nginx nomli boshqa serverning orqasida joylashgan bo'lib, yuklamalarni buferlaydi va to'liq tugallanganda ularni Node.js ga uzatadi.

Ammo siz uni yuklab olishingiz va to'liq namoyish qilish uchun mahalliy ravishda ishga tushirishingiz mumkin:

[codetabs src="upload-resume" height=200]

Ko'rib turganimizdek, zamonaviy tarmoq usullari o'z imkoniyatlari bo'yicha fayl menejerlariga yaqin -- sarlavhalar ustidan nazorat, taraqqiyot ko'rsatkichi, fayl qismlarini yuborish va boshqalar.

Biz qayta yuklash va boshqa ko'p narsalarni amalga oshirishimiz mumkin.