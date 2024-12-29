import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Item from '../models/item.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanupUploads = async () => {
  try {
    // Get path to uploads directory (going up one level from utils)
    const uploadsDir = path.join(__dirname, '../uploads');
    
    // Get all files in uploads directory
    const files = fs.readdirSync(uploadsDir);
    
    // Get all image filenames from database
    const items = await Item.find({}, 'image');
    const usedImages = items.map(item => item.image);
    
    console.log(`Starting cleanup: Found ${files.length} files and ${usedImages.length} database entries`);

    // Delete files that aren't referenced in database
    for (const file of files) {
      if (!usedImages.includes(file)) {
        fs.unlink(path.join(uploadsDir, file), err => {
          if (err) console.error(`Error deleting file ${file}:`, err);
          else console.log(`Deleted unused file: ${file}`);
        });
      }
    }

    console.log('Cleanup complete');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

// Run cleanup daily
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
setInterval(cleanupUploads, CLEANUP_INTERVAL);

// Also export for manual running if needed
export default cleanupUploads;