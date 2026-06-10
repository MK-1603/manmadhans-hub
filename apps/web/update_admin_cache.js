const fs = require('fs');
const file1 = 'd:/Organization/ManMadhan/Manmadhan\'S Project/Manmadhan\'S Project/Manmahan\'s-hub/apps/web/src/components/dashboard/WorkspacePages.tsx';
let content = fs.readFileSync(file1, 'utf8');

// Replace loadAdminTools callback in CategoryToolsView
content = content.replace(
  /new Promise<void>\(\(resolve\) => loadAdminTools\(\(data\) => \{\s*adminT = data as Tool\[\];\s*setTools\(\[\.\.\.adminT, \.\.\.userT\]\.sort\(\(a,b\) => a\.name\.localeCompare\(b\.name\)\)\);\s*resolve\(\);\s*\}, token\)\),/g,
  "new Promise<void>((resolve) => loadAdminTools((data) => { adminT = data as Tool[]; setTools([...adminT, ...userT].sort((a,b) => a.name.localeCompare(b.name))); if (adminT.length > 0 || userT.length > 0) setLoading(false); resolve(); }, token)),"
);

fs.writeFileSync(file1, content, 'utf8');
console.log('Replaced loadAdminTools cache logic in CategoryToolsView');
