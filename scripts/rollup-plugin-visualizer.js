import { writeFileSync } from 'fs';
import { gzipSync } from 'zlib';

export function visualizer(options = {}) {
  const { filename = 'dist/stats.html', title = 'Bundle Stats' } = options;
  return {
    name: 'visualizer',
    generateBundle(_options, bundle) {
      const rows = Object.values(bundle)
        .filter((file) => file.type === 'chunk')
        .map((file) => {
          const code = file.code || '';
          const gzip = gzipSync(code).length;
          return `<tr><td>${file.fileName}</td><td>${gzip}</td></tr>`;
        })
        .join('');
      const html = `<!DOCTYPE html><html><head><title>${title}</title></head><body><table><tr><th>File</th><th>Gzip Size</th></tr>${rows}</table></body></html>`;
      writeFileSync(filename, html);
    }
  };
}
