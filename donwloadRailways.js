const fs = require("fs");
const path = require("path");
const axios = require("axios");

const BASE_URL = "https://railwayapp-strapi-production-fd05.up.railway.app";
const DEST_DIR = "./downloaded";

async function downloadFile(fileUrl, dest) {
  const writer = fs.createWriteStream(dest);
  const response = await axios.get(fileUrl, { responseType: "stream" });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function processFolder(folderId) {
  const apiUrl = `${BASE_URL}/file-system/folder?path=/${folderId}`;

  try {
    const response = await axios.get(apiUrl);
    const folder = response.data;

    if (!folder || !folder.name) {
      console.log(`⚠️  Folder ${folderId} has no name. Skipping.`);
      return true;
    }

    const folderName = folder.name.replace(/[<>:"/\\|?*]/g, "_"); // bezpieczna nazwa
    const folderPath = path.join(DEST_DIR, folderName);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    console.log(`📁 Folder ${folderId}: ${folderName}`);

    if (!folder.files || folder.files.length === 0) {
      console.log(`  ⚠️  No files in folder ${folderId}`);
      return true;
    }

    for (const file of folder.files) {
      const filename = file.name.replace(/[<>:"/\\|?*]/g, "_");
      const fileUrl = BASE_URL + file.url;
      const dest = path.join(folderPath, filename);
      console.log(`  ⬇️  Downloading ${filename}`);
      await downloadFile(fileUrl, dest);
    }

    return true;

  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log(`✅ Finished. No more folders after ID ${folderId - 1}.`);
      return false;
    }
    console.error(`❌ Error on folder ${folderId}:`, err.message);
    return false;
  }
}

async function downloadAllFolders(startId = 1) {
  let folderId = startId;
  while (true) {
    const keepGoing = await processFolder(folderId);
    if (!keepGoing) break;
    folderId++;
  }
}

downloadAllFolders();
