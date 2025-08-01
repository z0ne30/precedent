# Images Directory

This directory contains all images used in the personal website.

## Directory Structure

### `/logos/`
- Contains logo files and branding assets
- Current files: `llogo.png`

### `/gallery/`
- Contains personal photos, project screenshots, and portfolio images
- Place any images you want to display in image carousels or galleries here

### `/backgrounds/`
- Contains background images, textures, and decorative elements
- Use for hero sections, page backgrounds, or visual elements

## Usage Guidelines

1. **File Naming**: Use descriptive, lowercase names with hyphens
   - Good: `mountain-hiking-2024.jpg`
   - Avoid: `IMG_1234.jpg`

2. **File Formats**: 
   - Use `.jpg` for photos
   - Use `.png` for logos/graphics with transparency
   - Use `.webp` for optimized web images

3. **File Sizes**: 
   - Optimize images before uploading
   - Keep file sizes reasonable for web performance

4. **Organization**: 
   - Place files in appropriate subdirectories
   - Consider creating additional subdirectories if needed

## Next.js Image Optimization

When using these images in your components, use Next.js Image component:

```jsx
import Image from 'next/image';

// Example usage
<Image 
  src="/images/gallery/your-image.jpg" 
  alt="Description" 
  width={800} 
  height={600} 
/>
```

This ensures automatic optimization, lazy loading, and responsive images.
