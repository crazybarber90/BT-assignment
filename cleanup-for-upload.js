#!/usr/bin/env node

/**
 * Cleanup Script for Upload Preparation
 *
 * This script removes large files, build artifacts, secrets, and version control
 * to prepare the project for zipping and uploading to a review server.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Items to delete organized by category
const itemsToDelete = {
  secrets: [
    'apps/api/.env',
    'apps/frontend/.env',
  ],
  dependencies: [
    // node_modules directories will be found dynamically
  ],
  buildArtifacts: [
    'apps/frontend/.next',
    '.turbo',
    'apps/api/.turbo',
    'apps/frontend/.turbo',
  ],
  versionControl: [
    '.git',
  ],
  systemFiles: [
    // .DS_Store files will be found dynamically
  ],
};

/**
 * Get human-readable file size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get size of file or directory recursively
 */
function getSize(itemPath) {
  try {
    const stats = fs.statSync(itemPath);

    if (stats.isFile()) {
      return stats.size;
    } else if (stats.isDirectory()) {
      let totalSize = 0;
      const items = fs.readdirSync(itemPath);

      for (const item of items) {
        const fullPath = path.join(itemPath, item);
        try {
          totalSize += getSize(fullPath);
        } catch (err) {
          // Skip items that can't be accessed
        }
      }
      return totalSize;
    }
  } catch (err) {
    return 0;
  }
  return 0;
}

/**
 * Delete file or directory recursively
 */
function deleteItem(itemPath) {
  try {
    if (fs.existsSync(itemPath)) {
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(itemPath);
      }
      return true;
    }
  } catch (err) {
    console.error(`${colors.red}Error deleting ${itemPath}: ${err.message}${colors.reset}`);
    return false;
  }
  return false;
}

/**
 * Find all node_modules directories in the project
 */
function findNodeModules(dir = '.', found = []) {
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);

      try {
        const stats = fs.statSync(fullPath);

        if (item === 'node_modules' && stats.isDirectory()) {
          found.push(fullPath);
          // Don't traverse into node_modules
          continue;
        }

        // Skip .git as it will be deleted anyway
        if (item === '.git') {
          continue;
        }

        if (stats.isDirectory()) {
          findNodeModules(fullPath, found);
        }
      } catch (err) {
        // Skip items that can't be accessed
      }
    }
  } catch (err) {
    // Skip directories that can't be read
  }

  return found;
}

/**
 * Find all .DS_Store files in the project
 */
function findDSStoreFiles(dir = '.', found = []) {
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);

      // Skip node_modules and .git as they'll be deleted anyway
      if (item === 'node_modules' || item === '.git') {
        continue;
      }

      try {
        const stats = fs.statSync(fullPath);

        if (item === '.DS_Store') {
          found.push(fullPath);
        } else if (stats.isDirectory()) {
          findDSStoreFiles(fullPath, found);
        }
      } catch (err) {
        // Skip items that can't be accessed
      }
    }
  } catch (err) {
    // Skip directories that can't be read
  }

  return found;
}

/**
 * Main cleanup function
 */
async function cleanup() {
  console.log(`${colors.bold}${colors.cyan}
╔═══════════════════════════════════════════════════════╗
║   Project Cleanup Script for Upload Preparation      ║
╚═══════════════════════════════════════════════════════╝
${colors.reset}`);

  // Find all node_modules directories
  console.log(`${colors.blue}Scanning for node_modules directories...${colors.reset}`);
  const nodeModulesDirs = findNodeModules();
  if (nodeModulesDirs.length > 0) {
    itemsToDelete.dependencies = nodeModulesDirs;
  }

  // Find .DS_Store files
  console.log(`${colors.blue}Scanning for .DS_Store files...${colors.reset}`);
  const dsStoreFiles = findDSStoreFiles();
  if (dsStoreFiles.length > 0) {
    itemsToDelete.systemFiles = dsStoreFiles;
  }

  // Calculate total size before deletion
  console.log(`${colors.blue}Calculating sizes...${colors.reset}\n`);

  let totalSize = 0;
  const itemsInfo = [];

  // Process each category
  for (const [category, items] of Object.entries(itemsToDelete)) {
    const categoryName = category.replace(/([A-Z])/g, ' $1').trim();
    console.log(`${colors.yellow}${colors.bold}${categoryName.toUpperCase()}:${colors.reset}`);

    for (const item of items) {
      if (fs.existsSync(item)) {
        const size = getSize(item);
        totalSize += size;
        itemsInfo.push({ path: item, size, category });

        const sizeStr = formatBytes(size);
        console.log(`  ${colors.red}✗${colors.reset} ${item} ${colors.magenta}(${sizeStr})${colors.reset}`);
      } else {
        console.log(`  ${colors.blue}○${colors.reset} ${item} ${colors.blue}(not found)${colors.reset}`);
      }
    }
    console.log('');
  }

  console.log(`${colors.bold}${colors.yellow}Total size to be deleted: ${formatBytes(totalSize)}${colors.reset}\n`);

  // Perform deletion
  console.log(`${colors.cyan}Starting cleanup...${colors.reset}\n`);

  let deletedCount = 0;
  let deletedSize = 0;

  for (const itemInfo of itemsInfo) {
    const { path: itemPath, size } = itemInfo;
    process.stdout.write(`Deleting ${itemPath}... `);

    if (deleteItem(itemPath)) {
      deletedCount++;
      deletedSize += size;
      console.log(`${colors.green}✓${colors.reset}`);
    } else {
      console.log(`${colors.red}✗${colors.reset}`);
    }
  }

  // Summary
  console.log(`\n${colors.bold}${colors.green}
╔═══════════════════════════════════════════════════════╗
║                  Cleanup Complete!                    ║
╚═══════════════════════════════════════════════════════╝
${colors.reset}`);

  console.log(`${colors.green}✓ Deleted ${deletedCount} items${colors.reset}`);
  console.log(`${colors.green}✓ Freed up ${formatBytes(deletedSize)}${colors.reset}`);
  console.log(`\n${colors.cyan}Your project is now ready to be zipped and uploaded!${colors.reset}`);
  console.log(`${colors.yellow}Note: Run 'bun install' and setup .env files to restore the project.${colors.reset}\n`);
}

// Run the cleanup
cleanup().catch((err) => {
  console.error(`${colors.red}${colors.bold}Fatal error: ${err.message}${colors.reset}`);
  process.exit(1);
});
