kagekiri
====

Shadow-piercing `querySelectorAll()` implementation.

Usage
---

```sh
npm install --save kagekiri
```

```javascript
import { querySelector, querySelectorAll } from 'kagekiri'

// query the document
const elements = querySelectorAll('.container button')
const element = querySelector('.container button')

// or a specific element

const elements = querySelectorAll('button', otherElement)
const element = querySelector('button', otherElement)
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
