const fs = require('fs');

const file1 = 'd:/Organization/ManMadhan/Manmadhan\'S Project/Manmadhan\'S Project/Manmahan\'s-hub/apps/web/src/components/dashboard/WorkspacePages.tsx';
let content1 = fs.readFileSync(file1, 'utf8');

const target1 = "        if (cachedUserTools) {\n          try { \n            userT = JSON.parse(cachedUserTools); \n            setTools([...adminT, ...userT]); \n          } catch(e) {}\n        }";
const replace1 = "        if (cachedUserTools) {\n          try { \n            userT = JSON.parse(cachedUserTools); \n            setTools([...adminT, ...userT]); \n            if (adminT.length > 0 || userT.length > 0) setLoading(false);\n          } catch(e) {}\n        }";

content1 = content1.split(target1).join(replace1);

// Also handle the other formatting:
const target2 = "        if (cachedUserTools) {\n          try { setUserTools(JSON.parse(cachedUserTools)); } catch(e) {}\n        }";
const replace2 = "        if (cachedUserTools) {\n          try { setUserTools(JSON.parse(cachedUserTools)); setLoading(false); } catch(e) {}\n        }";

content1 = content1.split(target2).join(replace2);

fs.writeFileSync(file1, content1, 'utf8');
console.log('Updated WorkspacePages userTools callbacks');
