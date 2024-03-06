# TextDecoder va TextEncoder

Ikkilik ma'lumotlar aslida string bo'lsa-chi? Masalan, biz matnli ma'lumotlarga ega faylni oldik.

O'rnatilgan [TextDecoder](https://encoding.spec.whatwg.org/#interface-textdecoder) obyekti bufer va kodlashni hisobga olgan holda qiymatni haqiqiy JavaScript qatoriga o'qish imkonini beradi.

Biz avval uni yaratishimiz kerak:
```js
let decoder = new TextDecoder([label], [options]);
```

- **`label`** -- sukut bo'yicha `utf-8` kodlash, lekin `big5`, `windows-1251` va boshqa ko'plab dasturlar ham qo'llab-quvvatlanadi.
- **`options`** -- ixtiyoriy obyekt:
   - **`fatal`** -- mantiqiy, agar `true` bo'lsa, yaroqsiz (dekodlanmaydigan) belgilar uchun istisno qiling, aks holda (standart) ularni `\uFFFD` belgisi bilan almashtiring.
   - **`ignoreBOM`** -- mantiqiy, agar `true` bo'lsa, BOMni e`tiborsiz qoldiring (ixtiyoriy bayt-tartibli Unicode belgisi), kamdan-kam talab qilinadi.

... Va keyin dekodlash:

```js
let str = decoder.decode([input], [options]);
```

- **`input`** -- dekodlash uchun `BufferSource`.
- **`options`** -- ixtiyoriy obyekt:
   - **`stream`** -- oqimlarni dekodlash uchun true, `decoder` kiruvchi ma'lumotlar bo'laklari bilan qayta-qayta chaqirilganda shunday hisoblanadi. Bunday holda, ko'p baytli belgi vaqti-vaqti bilan qismlarga bo'linishi mumkin. Bu opsiya `TextDecoder` ga "tugallanmagan" belgilarni eslab qolish va keyingi bo'lak kelganda ularni dekodlash uchun buyruq beradi.

Masalan:

```js run
let uint8Array = new Uint8Array([72, 101, 108, 108, 111]);

alert( new TextDecoder().decode(uint8Array) ); // Hello
```


```js run
let uint8Array = new Uint8Array([228, 189, 160, 229, 165, 189]);

alert( new TextDecoder().decode(uint8Array) ); // 你好
```

Biz buferning bir qismini uning uchun pastki qator ko'rinishini yaratish orqali dekodlashimiz mumkin:


```js run
let uint8Array = new Uint8Array([0, 72, 101, 108, 108, 111, 0]);

// string o'rtada
// hech narsadan nusxa ko'chirmasdan, uning ustida yangi ko'rinish yaratish
let binaryString = uint8Array.subarray(1, -1);

alert( new TextDecoder().decode(binaryString) ); // Hello
```

## TextEncoder

[TextEncoder](https://encoding.spec.whatwg.org/#interface-textencoder) teskari ishni bajaradi -- satrni baytga aylantiradi.

Sintaksis:

```js
let encoder = new TextEncoder();
```

U qo'llab-quvvatlaydigan yagona kodlash "utf-8" dir.

Uning ikkita usuli bor:
- **`encode(str)`** -- stringdan `Uint8Array`ni qaytaradi.
- **`encodeInto(str, destination)`** -- `str`ni `Uint8Array` bo'lishi kerak bo'lgan `destination`ga kodlaydi.

```js run
let encoder = new TextEncoder();

let uint8Array = encoder.encode("Hello");
alert(uint8Array); // 72,101,108,108,111
```
