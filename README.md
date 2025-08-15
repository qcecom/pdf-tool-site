# ATS-ready CV PDF Toolkit

Fast, private CV PDF tools — ATS-ready in minutes. No upload, no sign-up.

## Tools
- **Compress** – shrink PDF size
- **Merge** – combine multiple PDFs
- **ATS Export** – extract plain text
- **OCR** – scan PDFs (free 1/day)
- **JD Match** – compare CV text with a job description (free 1/day)

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
