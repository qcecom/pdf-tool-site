# ATS-ready CV PDF Toolkit

Fast, private CV PDF tools — ATS-ready in minutes. No upload, no sign-up.

## Tools
- **Compress** – shrink PDF size
- **Merge** – combine multiple PDFs
- **ATS Export** – extract plain text
- **OCR** – scan PDFs (free 1/day)
- **JD Match** – compare CV text with a job description (free 1/day)

### Compress presets

| Preset | Pipeline | Notes |
| --- | --- | --- |
| Smart | Lossless for text-heavy; OCR for scans | Balanced quality |
| ATS-safe | Keeps text/OCR for parsing | May be larger |
| Email <2MB | Smart with target size ~2MB | |
| Smallest | Rasterizes pages (lossy, not searchable) | Smallest size |

## Development

```bash
npm install
npm run dev
```

Type checking, linting and build:

```bash
npm run typecheck
npm run lint
npm run build
```

## Env flags
- `VITE_AI_ENABLED` – enable AI features (default `false`)
- `VITE_BILLING_ENABLED` – mock billing flows (default `false`)
- `VITE_ANALYTICS_ENABLED` – optional analytics (default `false`)

## Privacy
All processing happens in your browser with Web Workers and ArrayBuffer transfer. No files are uploaded or stored.

## Limits
Free tier allows one OCR and one JD match per day. Counts reset daily in `localStorage`.

## Offline
The app works offline after the first load. PDFs are never cached.

## Compression profiles

The compressor offers three profiles:

- **Lossless / Structure only** – re-saves the PDF and strips metadata while preserving all vector graphics and text.
- **Image-aware (recommended)** – intended to recompress embedded images while keeping text and vector content. Defaults to 150 DPI images at JPEG quality 0.72 and converts photographic PNGs to JPEG. Metadata and thumbnails are stripped and fonts compacted.
- **Smallest (image-only)** – rasterises every page to a JPEG image. Output is tiny but text becomes an image. **Not ATS-friendly.**

The compressor will return the original file when optimisation gains are under ~2 % to avoid accidental size inflation. If the reduction is under 5 % the UI shows “Already optimised / No meaningful reduction”.
