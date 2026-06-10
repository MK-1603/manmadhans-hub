const fs = require('fs');
const file1 = 'd:/Organization/ManMadhan/Manmadhan\'S Project/Manmadhan\'S Project/Manmahan\'s-hub/apps/web/src/components/dashboard/WorkspacePages.tsx';
let content = fs.readFileSync(file1, 'utf8');

const regex = /const \[adminRes, userRes\] = await Promise\.all\(\[\s*fetch\(\$\{baseUrl\}\/api\/v1\/tools\?all=true, \{ headers \}\),\s*fetch\(\$\{baseUrl\}\/api\/v1\/user-tools\?all=true, \{ headers \}\)\s*\]\);/g;

const replacement = if (typeof navigator !== 'undefined' && !navigator.onLine) {
          throw new Error('Offline');
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const [adminRes, userRes] = await Promise.all([
          fetch(\\/api/v1/tools?all=true\, { headers, signal: controller.signal }),
          fetch(\\/api/v1/user-tools?all=true\, { headers, signal: controller.signal })
        ]);
        clearTimeout(timeoutId);;

content = content.replace(regex, replacement);

fs.writeFileSync(file1, content, 'utf8');
console.log('Fixed DailyAITools fetch logic');
