kagekiri
====

Shadow DOM-piercing `querySelector()` / `querySelectorAll()` implementation.

Usage
---

Install:

```sh
npm install --save kagekiri
```

Query the `document` or a specific element:

```javascript
import { querySelector, querySelectorAll } from 'kagekiri'

// query the document
const elements = querySelectorAll('.container button')
const element = querySelector('.container button')

// or a specific element
const elements = querySelectorAll('button', otherElement)
const element = querySelector('button', otherElement)
```

How it works
---

`kagekiri` parses the CSS selector using [postcss-selector-parser](https://www.npmjs.com/package/postcss-selector-parser). Then it queries the entire DOM tree, traverses any `shadowRoot`s it may find, and checks the selector from children to ancestors (the same way a browser would).

Note that it only works on open shadow DOM. Closed shadow DOM cannot be traversed.

Slotted elements are considered to be children of their slots (inside the shadow DOM) rather than children of their host components. If you don't want this behavior, you can use the normal `querySelector()`/`querySelectorAll()` API.

See the tests for full supported CSS features.

The name
---

陰 _kage_ (shadow) + 切り _kiri_ (cut).

Roughly, "shadow-cutter."

Build
---

```sh
npm run build
```

Test
---

```sh
npm test
```

Debug:

```sh
npm run test:debug
```

Lint:

```sh
npm run lint
```

Fix most lint issues:

```sh
npm run lint:fix
```
