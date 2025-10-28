import { Component } from '@theme/component';
import { VariantUpdateEvent } from '@theme/events';

/**
 * A custom element that manages product meta-fields display and updates them when variants change.
 */
export default class ProductMetafields extends Component {
  connectedCallback() {
    super.connectedCallback();
    
    // Listen for variant update events
    document.addEventListener('variant:update', this.handleVariantUpdate.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Remove event listener
    document.removeEventListener('variant:update', this.handleVariantUpdate.bind(this));
  }

  /**
   * Handles variant update events to refresh meta-fields display
   * @param {VariantUpdateEvent} event - The variant update event
   */
  handleVariantUpdate(event) {
    if (!event.detail?.variant) return;
    
    const variant = event.detail.variant;
    const variantId = variant.id;
    
    // Update the data attribute to track current variant
    this.dataset.variantMetafields = variantId;
    
    // Update meta-fields display if variant has different meta-fields
    this.updateVariantMetafields(variant);
  }

  /**
   * Updates the meta-fields display for the selected variant
   * @param {Object} variant - The selected variant object
   */
  updateVariantMetafields(variant) {
    const metafieldsContainer = this.querySelector('.product-metafields__list');
    if (!metafieldsContainer) return;

    // Get variant meta-fields
    const variantMetafields = variant.metafields || {};
    
    // Update existing variant meta-field items
    const variantItems = metafieldsContainer.querySelectorAll('[data-metafield-namespace][data-metafield-key]');
    
    variantItems.forEach(item => {
      const namespace = item.dataset.metafieldNamespace;
      const key = item.dataset.metafieldKey;
      
      // Check if this is a variant meta-field (not product meta-field)
      const metafieldKey = `${namespace}.${key}`;
      const variantMetafield = variantMetafields[metafieldKey];
      
      if (variantMetafield !== undefined) {
        // Update the value display
        const valueElement = item.querySelector('.product-metafields__value');
        if (valueElement) {
          valueElement.innerHTML = this.formatMetafieldValue(variantMetafield);
        }
        
        // Show/hide the item based on whether it has a value
        if (variantMetafield && variantMetafield.value !== null && variantMetafield.value !== '') {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      }
    });
  }

  /**
   * Formats a meta-field value for display
   * @param {Object} metafield - The meta-field object
   * @returns {string} - Formatted HTML string
   */
  formatMetafieldValue(metafield) {
    if (!metafield || metafield.value === null || metafield.value === '') {
      return '';
    }

    switch (metafield.type) {
      case 'file_reference':
        if (metafield.value.alt) {
          return `<img src="${metafield.value.url}" alt="${metafield.value.alt}" width="300" height="auto" loading="lazy">`;
        } else {
          return `<a href="${metafield.value.url}" target="_blank" rel="noopener">${metafield.value.url.split('/').pop()}</a>`;
        }
      
      case 'page_reference':
      case 'product_reference':
      case 'collection_reference':
      case 'variant_reference':
        return `<a href="${metafield.value.url}">${metafield.value.title}</a>`;
      
      case 'url':
        return `<a href="${metafield.value}" target="_blank" rel="noopener">${metafield.value}</a>`;
      
      case 'json':
        return `<pre class="product-metafields__json">${JSON.stringify(metafield.value, null, 2)}</pre>`;
      
      case 'boolean':
        const booleanClass = metafield.value ? 'product-metafields__boolean--true' : 'product-metafields__boolean--false';
        const booleanSymbol = metafield.value ? '✓' : '✗';
        return `<span class="product-metafields__boolean ${booleanClass}">${booleanSymbol}</span>`;
      
      case 'date':
      case 'date_time':
        return new Date(metafield.value).toLocaleDateString();
      
      case 'number_integer':
      case 'number_decimal':
        return metafield.value.toLocaleString();
      
      case 'money':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(metafield.value.amount / 100);
      
      case 'rating':
        return `<div class="product-metafields__rating">
          <span class="product-metafields__rating-value">${metafield.value.value}</span>
          <span class="product-metafields__rating-scale">/ ${metafield.value.scale_max}</span>
        </div>`;
      
      case 'color':
        return `<div class="product-metafields__color">
          <span class="product-metafields__color-swatch" style="background-color: ${metafield.value}"></span>
          <span class="product-metafields__color-value">${metafield.value}</span>
        </div>`;
      
      case 'multi_line_text_field':
        return `<div class="product-metafields__multiline">${metafield.value.replace(/\n/g, '<br>')}</div>`;
      
      case 'rich_text_field':
        return `<div class="product-metafields__richtext">${metafield.value}</div>`;
      
      default:
        return metafield.value.toString();
    }
  }
}

if (!customElements.get('product-metafields-component')) {
  customElements.define('product-metafields-component', ProductMetafields);
}
