# Product Meta-fields Implementation

This Shopify Liquid theme has been enhanced to display all product meta-fields on product pages, including variant-specific meta-fields that update dynamically when variants are selected.

## Features

### ✅ Complete Meta-fields Display
- Shows all product meta-fields by default
- Displays variant-specific meta-fields
- Automatically updates when variants are selected
- Supports all Shopify meta-field types

### ✅ Dynamic Variant Support
- Meta-fields update in real-time when variants change
- No page refresh required
- Maintains product meta-fields while showing variant-specific ones

### ✅ Flexible Configuration
- Filter by namespace or specific keys
- Choose between list or grid layout
- Hide empty meta-fields
- Customizable styling and formatting

## Files Added/Modified

### New Files Created

1. **`blocks/product-metafields.liquid`**
   - Main meta-fields display block
   - Comprehensive meta-field type support
   - Configurable display options

2. **`assets/product-metafields.js`**
   - JavaScript component for dynamic updates
   - Handles variant change events
   - Formats meta-field values dynamically

3. **`snippets/product-metafields-simple.liquid`**
   - Simple snippet for displaying meta-fields
   - Can be used in other templates
   - Lightweight alternative to the full block

### Modified Files

1. **`blocks/_product-details.liquid`**
   - Added `product-metafields` to available block types

2. **`templates/product.json`**
   - Added default meta-fields block to product template
   - Configured with sensible defaults

## Usage

### Using the Meta-fields Block

The meta-fields block is now available in the theme editor under the product details section. You can:

1. **Add the block** to any product details section
2. **Configure settings**:
   - Heading and description
   - Layout (list or grid)
   - Namespace filtering
   - Key filtering
   - Display options

### Using the Simple Snippet

For custom implementations, use the snippet:

```liquid
{% render 'product-metafields-simple', product: product %}
```

With options:
```liquid
{% render 'product-metafields-simple', 
   product: product, 
   variant: variant, 
   namespace: 'custom',
   keys: 'material,size,color',
   layout: 'grid',
   show_namespace: true %}
```

## Meta-field Types Supported

The implementation supports all Shopify meta-field types:

- **Text Fields**: `single_line_text_field`, `multi_line_text_field`, `rich_text_field`
- **Numbers**: `number_integer`, `number_decimal`, `money`, `weight`, `volume`, `dimension`
- **Dates**: `date`, `date_time`
- **References**: `file_reference`, `page_reference`, `product_reference`, `collection_reference`, `variant_reference`
- **Special**: `boolean`, `url`, `json`, `rating`, `color`

## Configuration Options

### Block Settings

- **Heading**: Custom heading for the meta-fields section
- **Layout**: Choose between list or grid layout
- **Show Namespace**: Display full namespace.key format
- **Hide Empty**: Don't show meta-fields with no value
- **Namespace Filter**: Only show meta-fields from specific namespace
- **Keys Filter**: Comma-separated list of specific keys to show
- **Date Format**: Custom format for date fields
- **Image Width**: Width for file reference images

### Snippet Parameters

- `product`: Product object (required)
- `variant`: Variant object (optional, defaults to selected variant)
- `namespace`: Filter by namespace (optional)
- `keys`: Comma-separated keys to display (optional)
- `hide_empty`: Hide empty meta-fields (default: true)
- `layout`: Layout style - 'list' or 'grid' (default: 'list')
- `show_namespace`: Show namespace in labels (default: false)

## How It Works

### Static Display
1. The Liquid template renders all product and variant meta-fields
2. Meta-fields are filtered based on configuration
3. Values are formatted according to their type

### Dynamic Updates
1. JavaScript listens for variant change events
2. When a variant is selected, the component updates meta-field displays
3. Variant-specific meta-fields are shown/hidden as appropriate
4. Values are reformatted dynamically

### Event Handling
- Uses Shopify's `VariantUpdateEvent` for variant changes
- Automatically updates meta-fields without page refresh
- Maintains accessibility and SEO benefits

## Styling

The implementation includes comprehensive CSS for:
- Responsive layouts
- Grid and list displays
- Meta-field type-specific styling
- Color swatches, ratings, and other special types
- Mobile-friendly design

## Browser Support

- Modern browsers with ES6+ support
- Uses Web Components for encapsulation
- Graceful degradation for older browsers

## Performance

- Lazy loading for images
- Efficient DOM updates
- Minimal JavaScript footprint
- Optimized CSS with minimal specificity

## Customization

### Adding Custom Meta-field Types

To add support for new meta-field types, modify the `formatMetafieldValue` method in `product-metafields.js`:

```javascript
case 'custom_type':
  return `<div class="custom-format">${metafield.value}</div>`;
```

### Custom Styling

Override CSS variables or add custom styles:

```css
.product-metafields {
  --custom-color: #your-color;
}
```

## Troubleshooting

### Meta-fields Not Showing
1. Check if meta-fields have values
2. Verify namespace/key filters
3. Ensure `hide_empty_metafields` is set correctly

### Variant Updates Not Working
1. Check browser console for JavaScript errors
2. Verify variant picker is working correctly
3. Ensure meta-fields block is properly configured

### Styling Issues
1. Check CSS specificity
2. Verify theme CSS variables are available
3. Test responsive breakpoints

## Future Enhancements

Potential improvements could include:
- Search/filter functionality
- Sortable meta-fields
- Export capabilities
- Advanced formatting options
- Integration with product recommendations

## Support

This implementation follows Shopify's best practices and is compatible with:
- Shopify 2.0 themes
- All meta-field types
- Theme editor customization
- Third-party apps and extensions
