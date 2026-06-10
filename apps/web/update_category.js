const fs = require('fs');

const file1 = 'd:/Organization/ManMadhan/Manmadhan\'S Project/Manmadhan\'S Project/Manmahan\'s-hub/apps/web/src/components/dashboard/WorkspacePages.tsx';
let content1 = fs.readFileSync(file1, 'utf8');

const regex1 = /const loadUserTools = async \(\) => \{[\s\S]*?try \{ userT = JSON\.parse\(cachedUserTools\); setTools\(\[\.\.\.adminT, \.\.\.userT\]\); \} catch\(e\) \{\}[\s\S]*?catch \(err\) \{\}\n      \};/g;

const replacement1 = const loadUserTools = async () => {
        const cachedUserTools = localStorage.getItem('offline_registry_data');
        if (cachedUserTools) {
          try { 
            userT = JSON.parse(cachedUserTools); 
            setTools([...adminT, ...userT]); 
            setLoading(false); // fast fail loading
          } catch(e) {}
        }
        try {
          if (typeof navigator !== 'undefined' && !navigator.onLine) {
            throw new Error('Offline');
          }
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const userRes = await fetch(\\/api/v1/user-tools?all=true\, {
            headers: { Authorization: \Bearer \\ },
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          const userData = await userRes.json();
          if (userData.tools) {
            userT = userData.tools;
            setTools([...adminT, ...userT]);
            localStorage.setItem('offline_registry_data', JSON.stringify(userData.tools));
          }
        } catch (err) {}
      };;

content1 = content1.replace(regex1, replacement1);

fs.writeFileSync(file1, content1, 'utf8');
console.log('Updated loadUserTools inside CategoryToolsView');
