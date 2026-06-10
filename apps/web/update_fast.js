const fs = require('fs');

// 1. Update WorkspacePages.tsx
const file1 = 'd:/Organization/ManMadhan/Manmadhan\'S Project/Manmadhan\'S Project/Manmahan\'s-hub/apps/web/src/components/dashboard/WorkspacePages.tsx';
let content1 = fs.readFileSync(file1, 'utf8');

const target1 = "        await loadAdminTools((data) => {\n          adminT = data as Tool[];\n          setTools([...adminT, ...userT]);\n        }, token);";
const replace1 = "        await loadAdminTools((data) => {\n          adminT = data as Tool[];\n          setTools([...adminT, ...userT]);\n          if (adminT.length > 0) setLoading(false);\n        }, token);";

content1 = content1.split(target1).join(replace1);

fs.writeFileSync(file1, content1, 'utf8');
console.log('Updated WorkspacePages callbacks');

// 2. Update workspaceData.ts loadCategories
const file2 = 'd:/Organization/ManMadhan/Manmadhan\'S Project/Manmadhan\'S Project/Manmahan\'s-hub/apps/web/src/lib/workspaceData.ts';
let content2 = fs.readFileSync(file2, 'utf8');

const target2 = "    const res = await fetch(\\/api/v1/categories\);";
const replace2 = "    if (typeof navigator !== 'undefined' && !navigator.onLine) { throw new Error('Offline'); }\n    const controller = new AbortController();\n    const timeoutId = setTimeout(() => controller.abort(), 4000);\n    const res = await fetch(\\/api/v1/categories\, { signal: controller.signal });\n    clearTimeout(timeoutId);";

content2 = content2.split(target2).join(replace2);

fs.writeFileSync(file2, content2, 'utf8');
console.log('Updated loadCategories offline check');
