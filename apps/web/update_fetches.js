const fs = require('fs');
const file1 = 'd:/Organization/ManMadhan/Manmadhan\'S Project/Manmadhan\'S Project/Manmahan\'s-hub/apps/web/src/components/dashboard/WorkspacePages.tsx';
let content1 = fs.readFileSync(file1, 'utf8');

const target1 = "        const userRes = await fetch(${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools?all=true, {\n          headers: { Authorization: Bearer  }\n        });";
const replace1 = "        if (typeof navigator !== 'undefined' && !navigator.onLine) { throw new Error('Offline'); }\n        const controller = new AbortController();\n        const timeoutId = setTimeout(() => controller.abort(), 4000);\n        const userRes = await fetch(${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools?all=true, {\n          headers: { Authorization: Bearer  },\n          signal: controller.signal\n        });\n        clearTimeout(timeoutId);";

content1 = content1.split(target1).join(replace1);

const target2 = "          const userRes = await fetch(${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools?all=true, {\n            headers: { Authorization: Bearer  }\n          });";
const replace2 = "          if (typeof navigator !== 'undefined' && !navigator.onLine) { throw new Error('Offline'); }\n          const controller = new AbortController();\n          const timeoutId = setTimeout(() => controller.abort(), 4000);\n          const userRes = await fetch(${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools?all=true, {\n            headers: { Authorization: Bearer  },\n            signal: controller.signal\n          });\n          clearTimeout(timeoutId);";

content1 = content1.split(target2).join(replace2);

const target3 = "        const [adminRes, userRes] = await Promise.all([\n          fetch(${baseUrl}/api/v1/tools?all=true, { headers }),\n          fetch(${baseUrl}/api/v1/user-tools?all=true, { headers })\n        ]);";
const replace3 = "        if (typeof navigator !== 'undefined' && !navigator.onLine) { throw new Error('Offline'); }\n        const controller2 = new AbortController();\n        const timeoutId2 = setTimeout(() => controller2.abort(), 4000);\n        const [adminRes, userRes] = await Promise.all([\n          fetch(${baseUrl}/api/v1/tools?all=true, { headers, signal: controller2.signal }),\n          fetch(${baseUrl}/api/v1/user-tools?all=true, { headers, signal: controller2.signal })\n        ]);\n        clearTimeout(timeoutId2);";

content1 = content1.split(target3).join(replace3);

fs.writeFileSync(file1, content1, 'utf8');
console.log('Replacements completed successfully.');
