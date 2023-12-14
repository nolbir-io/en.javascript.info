Pattern boshlanishi aniq: `pattern:<style`.

...Ammo biz shunchaki `pattern:<style.*?>` ni yoza olmaymiz, chunki `match:<styler>` unga mos keladi.

Bizga `match:<style`dan keyin bo'sh joy, so'ngra ixtiyoriy ravishda boshqa narsa yoki `match:>` tugashi kerak.

Regexp tilida: `pattern:<style(>|\s.*?>)`.

Amaliy:

```js run
let regexp = /<style(>|\s.*?>)/g;

alert( '<style> <styler> <style test="...">'.match(regexp) ); // <style>, <style test="...">
```
