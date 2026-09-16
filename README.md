# Shopify Theme With Meta Fields

A copy of Shopify's **Horizon** theme (v3.0.1) extended to show product and
variant meta-fields written by [OneSila](https://onesila.com) on the product
page.

## Why this exists

OneSila pushes product data (specifications, attributes, dimensions, etc.) to
Shopify as meta-fields under the `onesila` namespace, on both the product and
each of its variants. Stock Shopify themes do not render these anywhere, so a
store that syncs from OneSila gets the data but the shopper never sees it.

This repository is a demo/reference theme that proves the data is there and
shows one way to display it.

## What was changed against stock Horizon

Everything outside the list below is unmodified Horizon.

- `blocks/product-metafields.liquid` (new): theme-editor block that renders
  `product.metafields.onesila` and the selected variant's
  `variant.metafields.onesila` as a definition list. Variant values that differ
  from the product value are listed first. Keys containing `amazon` are skipped
  because those are marketplace-only data that should not appear on the
  storefront. All variants' meta-fields are embedded as JSON so the page can
  switch without a reload.
- `assets/product-metafields.js` (new): web component that listens for the
  theme's `variant:update` event and re-renders the variant part of the list
  when the shopper picks another variant.
- `snippets/product-metafields-simple.liquid` (new): a standalone
  `{% render %}` snippet with namespace/key filters, for use in custom
  templates. Not wired into any template by default.
- `blocks/_product-details.liquid`: registers `product-metafields` as an
  allowed block inside the product details section.
- `templates/product.json`: adds a "Product Specifications" meta-fields block
  (grid layout, empty values shown) below the product description.
- `snippets/scripts.liquid`: loads `product-metafields.js` on product pages.

`META_FIELDS_IMPLEMENTATION.md` has the block settings, snippet parameters and
supported meta-field types in more detail.

## How to read it

This is a demo, not a plug-and-play app or a theme meant to be installed as-is.
Use it as a reference for how OneSila meta-fields can be surfaced in a Shopify
theme and copy the pieces that fit your own theme:

- Start with `blocks/product-metafields.liquid` to see how the `onesila`
  namespace is read from the product and its variants and rendered.
- Look at `assets/product-metafields.js` for the variant-switch behaviour.
- `snippets/product-metafields-simple.liquid` is the smallest self-contained
  piece if you only want a `{% render %}` snippet:

```liquid
{% render 'product-metafields-simple', product: product, namespace: 'onesila' %}
```

The meta-fields only exist on products that OneSila has synced to the store,
so nothing renders without that.

## Layout

Standard Shopify theme structure: `layout/`, `templates/`, `sections/`,
`blocks/`, `snippets/`, `assets/`, `config/`, `locales/`.
