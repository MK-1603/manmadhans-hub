const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src', 'components', 'pages', 'home');
console.log('Dir path is:', dirPath);

try {
  const files = fs.readdirSync(dirPath);
  console.log('Files in directory:', files);
  
  const srcName = files.find(f => f.toLowerCase() === 'home-page.tsx');
  const destName = files.find(f => f.toLowerCase() === 'home.tsx') || 'Home.tsx';
  
  if (!srcName) {
    console.error('Could not find home-page.tsx case-insensitively.');
    process.exit(1);
  }
  
  const srcPath = path.join(dirPath, srcName);
  const destPath = path.join(dirPath, destName);
  
  let content = fs.readFileSync(srcPath, 'utf8');
  content = content.replace('export default function HomePage()', 'export default function HomeContent()');
  
  fs.writeFileSync(destPath, content, 'utf8');
  console.log('Successfully copied', srcName, 'to', destName, 'and renamed default export.');
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
