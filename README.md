kagekiri [![build status](https://circleci.com/gh/salesforce/kagekiri.svg?style=svg)](https://circleci.com/gh/salesforce/kagekiri)
====

Shadow DOM-piercing query APIs. Supports:

| API                      |     Interface     | Support |
|--------------------------|-------------------|:------:|
| `querySelector`          | Element, Document |    ✅    |
| `querySelectorAll`       | Element, Document |    ✅    |
| `getElementsByClassName` | Element, Document |    ✅    |
| `getElementsByTagName`   | Element, Document |    ✅    |
| `getElementsByTagNameNS` | Element, Document |    ✅    |
| `getElementById`         |      Document     |    ✅    |
| `getElementsByName`      |      Document     |    ✅    |
| `matches`                |      Element      |    ✅    |
| `closest`                |      Element      |    ✅    |


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

Example
---

A custom element:

```html
<my-component></my-component>
<script>
  class MyComponent extends HTMLElement {
    constructor() {
      super()
      const shadowRoot = this.attachShadow({mode: 'open'})
      shadowRoot.innerHTML = '<span class="hello">Hello</span>'
    }
  }
  customElements.define('my-component', MyComponent)
</script>
```

It renders as:

```html
<my-component>
  <!-- shadow root (open) -->
  <span class="hello">Hello</span>
</my-component>
```

You can't query the `.hello` element:

```js
document.querySelector('.hello')    // undefined 😞
document.querySelectorAll('.hello') // empty 😞
```

But with `kagekiri` you can!

```js
kagekiri.querySelector('.hello')    // <span> 😃
kagekiri.querySelectorAll('.hello') // [<span>] 😃
```

Your can even query _across_ the shadow boundary!

```js
kagekiri.querySelector('my-component .hello')   // <span> 😃
kagekiri.querySelector('my-component > .hello') // <span> 😃
```

<!-- begin API -->


## API

### closest

▸ **closest**(`selector`: string, `context`: Node): Element \| null



Find the closest ancestor of an element (or the element itself) matching the given CSS selector. Analogous to
[`Element.closest`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`selector` | string | CSS selector |
`context` | Node | target element to match against, and whose ancestors to match against  |

**Returns:** Element \| null

___

### getElementById

▸ **getElementById**(`id`: string, `context?`: DocumentOrShadowRoot): Element \| null



Query for an element matching the given ID, or null if not found. Analogous to
[`Document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)

The default `context` is `document`. Choose another DocumentOrShadowRoot to query within that context.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`id` | string | element ID |
`context?` | DocumentOrShadowRoot | context to query in, or `document` by default  |

**Returns:** Element \| null

___

### getElementsByClassName

▸ **getElementsByClassName**(`names`: string, `context?`: Node): Element[]



Query for all elements matching a given class name, or multiple if a whitespace-separated list is provided.
Analogous to
[`Document.getElementsByClassName`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName).

Unlike the standard API, this returns a static array of Elements rather than a live HTMLCollection.

The default `context` is `document`. Choose another node to query within that context.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`names` | string | class name or whitespace-separated class names |
`context?` | Node | context to query in, or `document` by default  |

**Returns:** Element[]

___

### getElementsByName

▸ **getElementsByName**(`name`: string, `context?`: DocumentOrShadowRoot): Element[]



Query for all elements matching a given name. Analogous to
[`Document.getElementsByName`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName)

The default `context` is `document`. Choose another DocumentOrShadowRoot to query within that context.

Unlike the standard API, this returns a static array of Elements rather than a live NodeList.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | string | element name attribute |
`context?` | DocumentOrShadowRoot | context to query in, or `document` by default  |

**Returns:** Element[]

___

### getElementsByTagName

▸ **getElementsByTagName**(`tagName`: string, `context?`: Node): Element[]



Query for all elements matching a given tag name. Analogous to
[`Document.getElementsByTagName`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName).
The `"*"` query is supported.

Unlike the standard API, this returns a static array of Elements rather than a live HTMLCollection.

The default `context` is `document`. Choose another node to query within that context.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`tagName` | string | name of the element tag |
`context?` | Node | context to query in, or `document` by default  |

**Returns:** Element[]

___

### getElementsByTagNameNS

▸ **getElementsByTagNameNS**(`namespaceURI`: string, `localName`: string, `context?`: Node): Element[]



Query for all elements matching a given tag name and namespace. Analogous to
[`Document.getElementsByTagNameNS`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagNameNS).
The `"*"` query is supported.

Unlike the standard API, this returns a static array of Elements rather than a live NodeList.

The default `context` is `document`. Choose another node to query within that context.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`namespaceURI` | string | namespace URI, or `"*"` for all |
`localName` | string | local name, or `"*"` for all |
`context?` | Node | context to query in, or `document` by default  |

**Returns:** Element[]

___

### matches

▸ **matches**(`selector`: string, `context`: Node): boolean



Return true if the given Node matches the given CSS selector, or false otherwise. Analogous to
[`Element.closest`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`selector` | string | CSS selector |
`context` | Node | element to match against  |

**Returns:** boolean

___

### querySelector

▸ **querySelector**(`selector`: string, `context?`: Node): Element \| null



Query for a single element matching the CSS selector, or return null if not found. Analogous to
[`Document.querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

The default `context` is `document`. Choose another element or DocumentOrShadowRoot to query within that context.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`selector` | string | CSS selector |
`context?` | Node | context to query in, or `document` by default  |

**Returns:** Element \| null

___

### querySelectorAll

▸ **querySelectorAll**(`selector`: string, `context?`: Node): Element[]



Query for all elements matching a CSS selector. Analogous to
[`Document.querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)

The default `context` is `document`. Choose another node to query within that context.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`selector` | string | CSS selector |
`context?` | Node | context to query in, or `document` by default  |

**Returns:** Element[]


<!-- end API -->

How it works
---

`kagekiri` parses the CSS selector using [postcss-selector-parser](https://www.npmjs.com/package/postcss-selector-parser). Then it queries the entire DOM tree, traverses any `shadowRoot`s it may find, and checks the selector from children to ancestors (the same way a browser would).

Note that it only works on open shadow DOM. Closed shadow DOM cannot be traversed.

Slotted elements are considered to be children of their slots (inside the shadow DOM) rather than children of their host components. If you don't want this behavior, you can use the normal DOM APIs (e.g. `document.querySelector()` or `document.querySelectorAll()`).

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

Build TypeScript-based API docs using `kagekiri.d.ts`, inject them into the README:

```sh
npm run typedoc
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

Test bundle size:

```sh
npm run test:bundlesize
```
