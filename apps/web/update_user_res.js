const fs = require('fs');
const file1 = 'd:/Organization/ManMadhan/Manmadhan\'S Project/Manmadhan\'S Project/Manmahan\'s-hub/apps/web/src/components/dashboard/WorkspacePages.tsx';
let content = fs.readFileSync(file1, 'utf8');

const regex = /const userRes = await fetch\(\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:4000'\}\/api\/v1\/user-tools\?all=true, \{\s*headers: \{ Authorization: Bearer \$\{token\} \}\s*\}\);/g;

const replacement = if (typeof navigator !== 'undefined' && !navigator.onLine) {
          throw new Error('Offline');
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const userRes = await fetch(\\/api/v1/user-tools?all=true\, {
          headers: { Authorization: \Bearer \\ },
          signal: controller.signal
        });
        clearTimeout(timeoutId);;

content = content.replace(regex, replacement);

fs.writeFileSync(file1, content, 'utf8');
console.log('Fixed all userRes fetches');
