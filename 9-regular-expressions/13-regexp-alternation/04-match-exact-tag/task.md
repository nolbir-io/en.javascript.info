# To'liq tegni toping

`<style...>` tegini topish uchun regexp yozing. U to'liq tegga mos kelishi kerak: unda `<style>` atributlari bo'lmasligi yoki ularning bir nechtasi `<style type="..." id="...">` bo'lishi mumkin.

...Lekin regexp `<styler>` bilan mos kelmasligi kerak!

Masalan:

```js
let regexp = /your regexp/g;

alert( '<style> <styler> <style test="...">'.match(regexp) ); // <style>, <style test="...">
```
