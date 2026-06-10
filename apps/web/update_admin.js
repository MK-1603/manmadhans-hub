const fs = require('fs');

const file1 = 'd:/Organization/ManMadhan/Manmadhan\'S Project/Manmadhan\'S Project/Manmahan\'s-hub/apps/web/src/components/dashboard/WorkspacePages.tsx';
let content = fs.readFileSync(file1, 'utf8');

// For loadAdminTools where adminT is set
content = content.replace(
  /await loadAdminTools\(\(data\) => \{\s*adminT = data as Tool\[\];\s*setTools\(\[\.\.\.adminT, \.\.\.userT\]\);\s*\}, token\);/g,
  "await loadAdminTools((data) => { adminT = data as Tool[]; setTools([...adminT, ...userT]); if (adminT.length > 0) setLoading(false); }, token);"
);

// For loadAdminTools in ExploreTools:
content = content.replace(
  /await loadAdminTools\(\(tools\) => setAdminTools\(tools as Tool\[\]\), token\);/g,
  "await loadAdminTools((tools) => { setAdminTools(tools as Tool[]); if (tools.length > 0) setLoading(false); }, token);"
);

// For loadCategories in ExploreCategories:
content = content.replace(
  /await loadCategories\(\(data\) => setCategories\(data\)\);/g,
  "await loadCategories((data) => { setCategories(data); if (data.length > 0) setLoadingTaxonomy(false); });"
);

fs.writeFileSync(file1, content, 'utf8');
console.log('Replaced all blocking loading logic with fast-fails!');
