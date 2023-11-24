const fs = require('fs');
const path = require('path');

function saveFile(filePath, content) {
    const outputDir = path.dirname(filePath);
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

module.exports = {
    saveFile
};