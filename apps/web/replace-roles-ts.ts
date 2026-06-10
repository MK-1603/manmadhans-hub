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

    // The TS error happens because TS infers `role: "super-admin" | "admin" | "user"` somewhere, or we are comparing it to 'owner'.
    // In `EditIdentityView.tsx`: `const loggedInRole = loggedInRoleRaw.toLowerCase() === 'owner' ? "super-admin" : (loggedInRoleRaw.toLowerCase().includes('owner') ? "admin" : "user");`
    content = content.replace(/loggedInRoleRaw\.toLowerCase\(\) === 'owner' \? "super-admin" : \(loggedInRoleRaw\.toLowerCase\(\)\.includes\('owner'\) \? "admin" : "user"\)/g, "loggedInRoleRaw.toLowerCase() === 'owner' ? 'owner' : 'member'");

    content = content.replace(/rawRole\.toLowerCase\(\) === 'owner' \? "super-admin" : \(rawRole\.toLowerCase\(\)\.includes\('owner'\) \? "admin" : "user"\)/g, "rawRole.toLowerCase().includes('owner') ? 'owner' : 'member'");
    content = content.replace(/rawRole\.toLowerCase\(\) === "super-admin" \? "super-admin" : \(rawRole\.toLowerCase\(\)\.includes\("admin"\) \? "admin" : "user"\)/g, "rawRole.toLowerCase().includes('owner') ? 'owner' : 'member'");
    content = content.replace(/rawRole\.toLowerCase\(\) === 'super-admin' \? 'super-admin' : \(rawRole\.toLowerCase\(\)\.includes\('admin'\) \? 'admin' : 'user'\)/g, "rawRole.toLowerCase().includes('owner') ? 'owner' : 'member'");
    content = content.replace(/rawRole\.toLowerCase\(\) === 'owner' \? 'super-admin' : \(rawRole\.toLowerCase\(\)\.includes\('owner'\) \? 'admin' : 'user'\)/g, "rawRole.toLowerCase().includes('owner') ? 'owner' : 'member'");

    content = content.replace(/storedRole === 'owner' \? "super-admin" : \(storedRole\.includes\('owner'\) \? "admin" : "user"\)/g, "storedRole.includes('owner') ? 'owner' : 'member'");

    // Update IdentityManagement.tsx filter rendering
    content = content.replace(/loggedInRole === 'owner' \|\| !entity\.role\?\.toLowerCase\(\)\?\.includes\('owner'\)/g, "loggedInRole === 'owner'");

    // Update SuperAdminDashboard.tsx types (which might be hardcoded as `type Role = 'super-admin' | 'admin' | 'user'`)
    content = content.replace(/roles: \['owner', 'owner', 'member'\]/g, "roles: ['owner', 'member']");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
