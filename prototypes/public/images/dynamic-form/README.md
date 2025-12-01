# Dynamic Form Images

Place your slide images in this directory.

## Usage in Slide Components

Reference images using the path `/images/dynamic-form/your-image.png`

Example:
```vue
<img src="/images/dynamic-form/slide1-main.png" alt="Slide 1" />
```

## Recommended Structure

```
dynamic-form/
├── slide1-image1.png
├── slide1-image2.png
├── slide2-image1.png
├── slide2-image2.png
└── ...
```

## Notes
- Images in the `public` folder are served as-is at the root URL
- Use absolute paths starting with `/` when referencing them
- Supported formats: PNG, JPG, SVG, WebP, etc.
