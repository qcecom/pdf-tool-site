import fs from 'fs';

const content = `# TOOL STATUS\n\n| Feature | Checks | Result | Notes | Local Report Path | Prod Report Path |\n| --- | --- | --- | --- | --- | --- |\n`;

fs.writeFileSync('TOOL_STATUS.md', content);

