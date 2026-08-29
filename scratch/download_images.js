import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_TO_DOWNLOAD = [
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2023/10/160-1.jpg', filename: 'hero-bg.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/09.jpg', filename: 'product-09.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2023/10/02-37.jpg', filename: 'product-09-hover.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/03.jpg', filename: 'product-03.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/10.jpg', filename: 'product-10.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2023/10/02-41.jpg', filename: 'product-10-hover.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/11.jpg', filename: 'product-11.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2023/10/02-4.jpg', filename: 'product-11-hover.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/12.jpg', filename: 'product-12.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2023/10/02-7.jpg', filename: 'product-12-hover.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/15.jpg', filename: 'product-15.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2023/10/02-47.jpg', filename: 'product-15-hover.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/19.jpg', filename: 'product-19.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/09-300x391.jpg', filename: 'cat-bras.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/03-300x391.jpg', filename: 'cat-panties.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/10-300x391.jpg', filename: 'cat-lingerie-sets.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/15-300x391.jpg', filename: 'cat-sleepwear.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/11-300x391.jpg', filename: 'cat-swimwear.jpg' },
  { url: 'https://demos.codezeel.com/wordpress/WCM08/WCM080194/default/wp-content/uploads/2024/03/12-300x391.jpg', filename: 'cat-shapewear.jpg' },
];

const destDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => reject(err));
    });
  });
}

async function run() {
  console.log('Downloading demo images to public/images...');
  for (const item of IMAGES_TO_DOWNLOAD) {
    const dest = path.join(destDir, item.filename);
    try {
      await downloadFile(item.url, dest);
      console.log(`Downloaded ${item.filename}`);
    } catch (err) {
      console.error(`Error downloading ${item.filename}:`, err.message);
    }
  }
  console.log('Download complete!');
}

run();
