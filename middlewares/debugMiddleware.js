import fs from 'fs';
import path from 'path';


const debugMiddleware = (req, res, next) => {
    // Debug-Informationen ausgeben
    console.log('--- Debug Middleware ---');

    // Speicherort definieren
    const logFilePath = path.join(__dirname, '../logs/debug_logs.json');

    // Aktuelle Debug-Informationen
    const currentDebugInfo = {
        timestamp: new Date().toISOString(),
        session: req.session,
        user: req.user,
        body: req.body,
        response: res,
        // Weitere Informationen können hier hinzugefügt werden
    };

    // Lesen der vorhandenen Log-Daten
    fs.readFile(logFilePath, {encoding: 'utf8', flag: 'a+'}, (readErr, data) => {
        if (readErr) {
            console.error(`Fehler beim Lesen der Log-Datei: ${readErr.message}`);
            return next();
        }

        let logs = [];
        if (data) {
            try {
                logs = JSON.parse(data);
            } catch (parseErr) {
                console.error(`Fehler beim Parsen der Log-Datei: ${parseErr.message}`);
                return next();
            }
        }

        // Aktuelle Debug-Informationen anhängen
        logs.push(currentDebugInfo);

        // Log-Daten in der JSON-Datei speichern
        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (writeErr) => {
            if (writeErr) {
                console.error(`Fehler beim Speichern der Log-Datei: ${writeErr.message}`);
            } else {
                console.log('Debug-Informationen wurden erfolgreich gespeichert.');
            }

            // Weiterleitung an die nächste Middleware im Stapel
            next();
        });
    });
};

export default debugMiddleware;
