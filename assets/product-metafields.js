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
    if (!event.detail?.resource) {
      return;
    }
    
    const variant = event.detail.resource;
    const variantId = variant.id;
    
    // Update the data attribute to track current variant
    this.dataset.variantMetafields = variantId;
    
    // Update meta-fields display for the selected variant
    this.updateVariantMetafields(variantId);
  }

  /**
   * Updates the meta-fields display for the selected variant
   * @param {string} variantId - The selected variant ID
   */
  updateVariantMetafields(variantId) {
    const metafieldsContainer = this.querySelector('[data-metafields-container]');
    if (!metafieldsContainer) {
      return;
    }

    // Get variant meta-fields data from the script tag
    const scriptTag = this.querySelector('[data-variant-metafields-data]');
    
    // Parse the variant meta-fields data
    let variantMetafields = {};
    if (scriptTag) {
      try {
        const allVariantData = JSON.parse(scriptTag.textContent);
        variantMetafields = allVariantData[variantId.toString()] || {};
      } catch (e) {
        console.error('ProductMetafields: Error parsing variant metafields JSON', e);
      }
    }
    
    // Hide all existing variant meta-field items
    const variantItems = metafieldsContainer.querySelectorAll('[data-metafield-type="variant"]');
    variantItems.forEach(item => {
      item.style.display = 'none';
    });
    
    // Show variant meta-fields that are different from product meta-fields
    Object.entries(variantMetafields).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        // Check if this variant meta-field is different from the product meta-field
        const productItem = metafieldsContainer.querySelector(`[data-metafield-key="${key}"][data-metafield-type="product"]`);
        const productValue = productItem ? productItem.querySelector('.product-metafields__value')?.textContent?.trim() : null;
        
        if (productValue !== value.toString()) {
          // Find or create variant meta-field item
          let variantItem = metafieldsContainer.querySelector(`[data-metafield-key="${key}"][data-metafield-type="variant"]`);
          
          if (!variantItem) {
            // Create new variant meta-field item
            variantItem = this.createVariantMetafieldItem(key, value);
            metafieldsContainer.appendChild(variantItem);
          } else {
            // Update existing variant meta-field item
            const valueElement = variantItem.querySelector('.product-metafields__value');
            if (valueElement) {
              valueElement.textContent = value;
            }
          }
          
          variantItem.style.display = '';
        }
      }
    });
  }

  /**
   * Creates a new variant meta-field item element
   * @param {string} key - The meta-field key
   * @param {*} value - The meta-field value
   * @returns {HTMLElement} - The created element
   */
  createVariantMetafieldItem(key, value) {
    const item = document.createElement('div');
    item.className = 'product-metafields__item product-metafields__item--variant';
    item.setAttribute('data-metafield-key', key);
    item.setAttribute('data-metafield-type', 'variant');
    
    const label = document.createElement('dt');
    label.className = 'product-metafields__label';
    label.textContent = this.formatMetafieldKey(key) + ':';
    
    const valueElement = document.createElement('dd');
    valueElement.className = 'product-metafields__value';
    valueElement.textContent = value;
    
    item.appendChild(label);
    item.appendChild(valueElement);
    
    return item;
  }

  /**
   * Formats a meta-field key for display (e.g., "manufactured_in" -> "Manufactured In")
   * @param {string} key - The meta-field key
   * @returns {string} - Formatted key
   */
  formatMetafieldKey(key) {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

if (!customElements.get('product-metafields-component')) {
  customElements.define('product-metafields-component', ProductMetafields);
}