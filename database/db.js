'use strict';

// Dieses Modul stellt eine Verbindung zur CouchDB her und definiert Funktionen für grundlegende Datenbankoperationen.

// Importiert die Nano-Bibliothek, die eine einfache Nutzung von CouchDB ermöglicht.
import Nano from 'nano';

// Liest die Datenbank-URL aus den Umgebungsvariablen.
const dbUrl = process.env.COUCHDB_URL;

// Erstellt ein Nano-Objekt, das als Schnittstelle zur CouchDB dient.
const nano = Nano({url: dbUrl});

// Erstellt Datenbanken, falls sie noch nicht existieren.
const createDatabase = (dbNames) => {
    // Erstellt ein Array von Promises, eines für jede Datenbank.
    const promises = dbNames.map((dbName) => {
        // Überprüft zuerst, ob die Datenbank bereits existiert.
        return nano.db.list()
            .then((dbList) => {
                if (dbList.includes(dbName)) {
                    return Promise.resolve(`Database ${dbName} already exists.`);
                }
                // Erstellt die Datenbank, wenn sie noch nicht existiert.
                return nano.db.create(dbName)
                    .then(() => `Database ${dbName} successfully created.`);
            })
            // Fängt Fehler ab und leitet sie weiter.
            .catch((err) => Promise.reject(new Error(`Database ${dbName} could not be created: ${err.message}`)));
    });

    // Wartet darauf, dass alle Promises aufgelöst werden.
    return Promise.all(promises);
};

// Fügt ein Dokument in die angegebene Datenbank ein.
const insert = (dbName, doc) => {
    // Wählt die entsprechende Datenbank aus.
    const db = nano.db.use(dbName);

    // Erstellt ein neues Promise für den asynchronen Einfügeprozess.
    return new Promise((resolve, reject) => {
        db.insert(doc, function (err, body) {
            if (err) {
                console.error("Insert failed:", err);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
};

// Fügt mehrere Dokumente gleichzeitig in die Datenbank ein.
const insertMany = (dbName, docs) => {
    // Wählt die entsprechende Datenbank aus.
    const db = nano.db.use(dbName);

    // Prüft, ob die Eingabe gültig ist.
    if (dbName !== 'user') {
        if (!Array.isArray(docs) || docs.length === 0) {
            return Promise.reject(new Error("Invalid or empty docs array"));
        }
    }

    // Erstellt ein neues Promise für den asynchronen Masseneinfügeprozess.
    return new Promise((resolve, reject) => {
        db.bulk({docs: docs}, function (err, body) {
            if (err) {
                console.error("Bulk insert failed:", err);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
};

// Ruft eine View aus einer Design-Dokument innerhalb der Datenbank ab.
const getView = (dbName, designDoc, viewName, options = {}) => {
    // Wählt die entsprechende Datenbank aus.
    const db = nano.db.use(dbName);

    // Erstellt ein neues Promise, um die Daten asynchron abzurufen.
    return new Promise((resolve, reject) => {
        db.view(designDoc, viewName, options, (err, body) => {
            if (err) {
                console.error("Fehler beim Abrufen der View:", err);
                reject(err);
            } else {
                // body.rows enthält die eigentlichen Daten der View.
                resolve(body.rows);
            }
        }).catch(err => reject(err));
    });
};

// Führt eine Abfrage auf der Datenbank aus und gibt das Ergebnis zurück.
const find = (dbName, query) => {
    // Wählt die entsprechende Datenbank aus.
    const db = nano.db.use(dbName);

    // Erstellt ein neues Promise, um die Daten asynchron abzufragen.
    return new Promise((resolve, reject) => {
        db.find(query, (err, body) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(body.docs);
            }
        })
    });
};

// Exportiert die Funktionen für die Verwendung in anderen Modulen.
export default {
    createDatabase,
    getDatabase: (dbName) => nano.db.use(dbName),
    insert,
    insertMany,
    find,
    getView
};
