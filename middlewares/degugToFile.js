import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const debugToFile = (data, fileName = 'debug_logs.json') => {
    const logFilePath = path.join(__dirname, `../logs/${fileName}`);

    let logs = [];
    try {
        logs = JSON.parse(fs.readFileSync(logFilePath, 'utf-8')) || [];
    } catch (err) {
        console.error(`Could not read ${logFilePath}: ${err.message}`);
    }

    logs.push({
        timestamp: new Date().toISOString(),
        data
    });

    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
};

export default debugToFile;
