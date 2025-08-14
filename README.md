# pdf-tool-site
A fast, minimal, and easy-to-use PDF tool website built with Vite + React and deployed on Netlify. Supports merging, splitting, compressing, and converting PDFs.

## Environment Variables

`MOCK_PROGRESS` – set to `1` to enable mocked upload and processing progress for local development. When enabled, API routes under `/api/upload`, `/api/process`, and `/api/status` simulate the complete job lifecycle with Server-Sent Events.
