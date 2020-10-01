/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Query for a single element matching the CSS selector, or return null if not found. Analogous to
 * [`Document.querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
 *
 * The default `context` is `document`. Choose another element or DocumentOrShadowRoot to query within that context.
 *
 * @param selector - CSS selector
 * @param context - context to query in, or `document` by default
 */
export function querySelector(selector: string, context?: Node): Element | null;

/**
 * Query for all elements matching a CSS selector. Analogous to
 * [`Document.querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
 *
 * The default `context` is `document`. Choose another node to query within that context.
 *
 * @param selector - CSS selector
 * @param context - context to query in, or `document` by default
 */
export function querySelectorAll(selector: string, context?: Node): Element[];

/**
 * Query for all elements matching a given class name, or multiple if a whitespace-separated list is provided.
 * Analogous to
 * [`Document.getElementsByClassName`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName).
 *
 * Unlike the standard API, this returns a static array of Elements rather than a live HTMLCollection.
 *
 * The default `context` is `document`. Choose another node to query within that context.
 *
 * @param names - class name or whitespace-separated class names
 * @param context - context to query in, or `document` by default
 */
export function getElementsByClassName(names: string, context?: Node): Element[];


/**
 * Query for all elements matching a given tag name. Analogous to
 * [`Document.getElementsByTagName`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName).
 * The `"*"` query is supported.
 *
 * Unlike the standard API, this returns a static array of Elements rather than a live HTMLCollection.
 *
 * The default `context` is `document`. Choose another node to query within that context.
 *
 * @param tagName - name of the element tag
 * @param context - context to query in, or `document` by default
 */
export function getElementsByTagName(tagName: string, context?: Node): Element[];

/**
 * Query for all elements matching a given tag name and namespace. Analogous to
 * [`Document.getElementsByTagNameNS`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagNameNS).
 * The `"*"` query is supported.
 *
 * Unlike the standard API, this returns a static array of Elements rather than a live NodeList.
 *
 * The default `context` is `document`. Choose another node to query within that context.
 *
 * @param namespaceURI - namespace URI, or `"*"` for all
 * @param localName - local name, or `"*"` for all
 * @param context - context to query in, or `document` by default
 */
export function getElementsByTagNameNS(namespaceURI: string, localName: string, context?: Node): Element[];

/**
 * Query for an element matching the given ID, or null if not found. Analogous to
 * [`Document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)
 *
 * The default `context` is `document`. Choose another DocumentOrShadowRoot to query within that context.
 *
 * @param id - element ID
 * @param context - context to query in, or `document` by default
 */
export function getElementById(id: string, context?: DocumentOrShadowRoot): Element | null;

/**
 * Query for all elements matching a given name. Analogous to
 * [`Document.getElementsByName`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName)
 *
 * The default `context` is `document`. Choose another DocumentOrShadowRoot to query within that context.
 *
 * Unlike the standard API, this returns a static array of Elements rather than a live NodeList.
 *
 * @param name - element name attribute
 * @param context - context to query in, or `document` by default
 */
export function getElementsByName(name: string, context?: DocumentOrShadowRoot): Element[];

/**
 * Return true if the given Node matches the given CSS selector, or false otherwise. Analogous to
 * [`Element.closest`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)
 *
 * @param selector - CSS selector
 * @param element - element to match against
 */
export function matches(selector: string, element: Node): boolean;

/**
 * Find the closest ancestor of an element (or the element itself) matching the given CSS selector. Analogous to
 * [`Element.closest`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)
 *
 * @param selector - CSS selector
 * @param element - target element to match against, and whose ancestors to match against
 */
export function closest(selector: string, element: Node): Element | null;
