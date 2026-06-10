const fs = require('fs');

const file1 = 'd:/Organization/ManMadhan/Manmadhan\'S Project/Manmadhan\'S Project/Manmahan\'s-hub/apps/web/src/components/dashboard/WorkspacePages.tsx';
let content = fs.readFileSync(file1, 'utf8');

// Replace instances like: try { setUserTools(JSON.parse(cachedUserTools)); } catch(e) {}
content = content.replace(
  /try\s*\{\s*setUserTools\(JSON\.parse\(cachedUserTools\)\);\s*\}\s*catch\(e\)\s*\{\}/g,
  "try { setUserTools(JSON.parse(cachedUserTools)); setLoading(false); } catch(e) {}"
);

// Replace instances like: try { userT = JSON.parse(cachedUserTools); setTools([...adminT, ...userT]); } catch(e) {}
content = content.replace(
  /try\s*\{\s*userT\s*=\s*JSON\.parse\(cachedUserTools\);\s*setTools\(\[\.\.\.adminT,\s*\.\.\.userT\]\);\s*\}\s*catch\(e\)\s*\{\}/g,
  "try { userT = JSON.parse(cachedUserTools); setTools([...adminT, ...userT]); if (adminT.length > 0 || userT.length > 0) setLoading(false); } catch(e) {}"
);

fs.writeFileSync(file1, content, 'utf8');
console.log('Replaced cache loading states with regex!');
