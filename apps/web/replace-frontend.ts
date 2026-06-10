import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (path: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const webSrcDir = path.join(process.cwd(), 'src/components');

walkDir(webSrcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Role mapping arrays
    content = content.replace(/\['super-admin', 'admin', 'user'\]/g, "['owner', 'member']");
    content = content.replace(/\['super-admin', 'admin'\]/g, "['owner']");
    
    // Role string values
    content = content.replace(/=== 'super-admin'/g, "=== 'owner'");
    content = content.replace(/!== 'super-admin'/g, "!== 'owner'");
    content = content.replace(/=== "super-admin"/g, "=== 'owner'");
    content = content.replace(/!== "super-admin"/g, "!== 'owner'");
    
    content = content.replace(/=== 'admin'/g, "=== 'owner'");
    content = content.replace(/!== 'admin'/g, "!== 'owner'");
    content = content.replace(/=== "admin"/g, "=== 'owner'");
    content = content.replace(/!== "admin"/g, "!== 'owner'");
    
    content = content.replace(/=== 'user'/g, "=== 'member'");
    content = content.replace(/!== 'user'/g, "!== 'member'");
    content = content.replace(/=== "user"/g, "=== 'member'");
    content = content.replace(/!== "user"/g, "!== 'member'");

    content = content.replace(/includes\('admin'\)/g, "includes('owner')");
    content = content.replace(/includes\("admin"\)/g, "includes('owner')");
    
    // UI text replacements
    content = content.replace(/'Super Admin'/g, "'Owner'");
    content = content.replace(/"Super Admin"/g, '"Owner"');
    content = content.replace(/'Admin'/g, "'Owner'");
    content = content.replace(/"Admin"/g, '"Owner"');
    content = content.replace(/'User'/g, "'Member'");
    content = content.replace(/"User"/g, '"Member"');

    // Specific mapping assignments in AddTools, SuperAdminDashboard, WorkspacePages
    // Example: rawRole.toLowerCase() === "super-admin" ? "super-admin" : (rawRole.toLowerCase().includes("admin") ? "admin" : "user")
    content = content.replace(/rawRole\.toLowerCase\(\) === 'owner' \? 'owner' : \(rawRole\.toLowerCase\(\)\.includes\('owner'\) \? 'owner' : 'member'\)/g, "rawRole.toLowerCase().includes('owner') ? 'owner' : 'member'");
    content = content.replace(/rawRole\.toLowerCase\(\) === 'super-admin' \? 'super-admin' : \(rawRole\.toLowerCase\(\)\.includes\('admin'\) \? 'admin' : 'user'\)/g, "rawRole.toLowerCase().includes('owner') ? 'owner' : 'member'");
    content = content.replace(/rawRole\.toLowerCase\(\) === "super-admin" \? "super-admin" : \(rawRole\.toLowerCase\(\)\.includes\("admin"\) \? "admin" : "user"\)/g, "rawRole.toLowerCase().includes('owner') ? 'owner' : 'member'");
    
    content = content.replace(/storedRole === "owner" \? "owner" : \(storedRole\.includes\("owner"\) \? "owner" : "member"\)/g, "storedRole.includes('owner') ? 'owner' : 'member'");
    content = content.replace(/storedRole === 'owner' \? 'owner' : \(storedRole\.includes\('owner'\) \? 'owner' : 'member'\)/g, "storedRole.includes('owner') ? 'owner' : 'member'");

    content = content.replace(/loggedInRoleRaw\.toLowerCase\(\) === "owner" \? "owner" : \(loggedInRoleRaw\.toLowerCase\(\)\.includes\("owner"\) \? "owner" : "member"\)/g, "loggedInRoleRaw.toLowerCase().includes('owner') ? 'owner' : 'member'");
    
    // Clean up filters
    content = content.replace(/'All', 'Owner', 'Owner', 'Member', 'Active', 'Inactive'/g, "'All', 'Owner', 'Member', 'Active', 'Inactive'");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
