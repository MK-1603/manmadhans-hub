import fs from 'fs';
import path from 'path';

const replaceInFile = (filePath: string, searchStr: string | RegExp, replaceStr: string) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(new RegExp(searchStr, 'g'), replaceStr);
  fs.writeFileSync(filePath, content, 'utf8');
};

const routesDir = path.join(process.cwd(), 'src/routes');

['admin.ts', 'auth.ts', 'categories.ts', 'tools.ts', 'user-tools.ts'].forEach(file => {
  const p = path.join(routesDir, file);
  if (fs.existsSync(p)) {
    console.log(`Updating ${file}`);
    let content = fs.readFileSync(p, 'utf8');
    
    content = content.replace(/authorize\(\['super-admin', 'admin'\]\)/g, "authorize(['owner'])");
    content = content.replace(/authorize\(\['super-admin', 'admin', 'user'\]\)/g, "authorize(['owner', 'member'])");
    content = content.replace(/roles: \['super-admin', 'admin'\]/g, "roles: ['owner']");
    content = content.replace(/roles: \['super-admin', 'admin', 'user'\]/g, "roles: ['owner', 'member']");
    
    // admin.ts specific logic
    if (file === 'admin.ts') {
      content = content.replace(/targetUser\.rows\[0\]\.role === 'super-admin'/g, "targetUser.rows[0].role === 'owner'");
      content = content.replace(/Cannot purge a super-admin identity node/g, "Cannot purge an owner identity node");
      
      // Update identity ID prefixes
      content = content.replace(/let prefix = 'UID-'/g, "let prefix = 'MID-'");
      content = content.replace(/prefix = 'SID-'/g, "prefix = 'OID-'");
      content = content.replace(/prefix = 'UID-'/g, "prefix = 'MID-'");
      content = content.replace(/r\.includes\('super'\) \|\| r\.includes\('admin'\)/g, "r.includes('owner')");
    }

    fs.writeFileSync(p, content, 'utf8');
  }
});

// Update realtime.ts
const realtimePath = path.join(process.cwd(), 'src/lib/realtime.ts');
if (fs.existsSync(realtimePath)) {
  let rContent = fs.readFileSync(realtimePath, 'utf8');
  rContent = rContent.replace(/roles: \['super-admin', 'admin', 'user'\]/g, "roles: ['owner', 'member']");
  fs.writeFileSync(realtimePath, rContent, 'utf8');
}
