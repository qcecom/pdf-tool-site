# pdf-tool-site

A fast, minimal PDF tool running fully in your browser. Merge, split and compress PDFs without uploading anything.

## Development

```bash
pnpm install
pnpm dev
```

Type checking, linting and build:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Notes

- Files larger than **50MB** will trigger a warning; consider splitting first.
- All processing happens client-side. Your PDFs never leave your device.
