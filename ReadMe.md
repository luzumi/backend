# Inhaltsverzeichnis

- [Einleitung](#einleitung)
- [Datenbanken](#datenbanken)
    - [Countries](#countries)
    - [Leagues](#leagues)
    - [User](#user)
- [APIs](#apis)

## Einleitung

Dieses Dokument beschreibt die Struktur und die Datenmodelle, die in diesem Projekt verwendet werden.

## Datenbanken

### User

### Countries


Die `Countries`-Datenbank enthält Informationen über verschiedene Länder. Jeder Eintrag in der Datenbank hat die folgenden Felder:

```json
{
  "_id": "2d5387dcb25f68f40020919439013ff4",
  "_rev": "1-8121511ac793f7f7b17676c51c269119",
  "name": "Albania",
  "code": "AL",
  "flag": "https://media-4.api-sports.io/flags/al.svg",
  "leagues": [
    {
      "id": 311,
      "name": "1st Division",
      "type": "League",
      "logo": "https://media-4.api-sports.io/football/leagues/311.png"
    },
    {
      "id": 310,
      "name": "Superliga",
      "type": "League",
      "logo": "https://media-4.api-sports.io/football/leagues/310.png"
    }
  ]
}
```

### Leagues
```json
{
  "_id": "2d5387dcb25f68f400209194390757f7",
  "_rev": "1-376da8c0459de814e983113432eed141",
  "league": {
    "id": 310,
    "name": "Superliga",
    "type": "League",
    "logo": "https://media-4.api-sports.io/football/leagues/310.png"
  },
  "country": {
    "name": "Albania",
    "code": "AL",
    "flag": "https://media-4.api-sports.io/flags/al.svg"
  },
  "seasons": [
    {
      "year": 2011,
      "start": "2011-09-10",
      "end": "2012-05-12",
      "current": false,
      "coverage": {
        "fixtures": {
          "events": true,
          "lineups": true,
          "statistics_fixtures": false,
          "statistics_players": false
        },
        "standings": true,
        "players": true,
        "top_scorers": true,
        "top_assists": true,
        "top_cards": true,
        "injuries": false,
        "predictions": true,
        "odds": false
      }
    },
    {
      "year": 2012,
      "start": "2012-08-24",
      "end": "2013-05-11",
      "current": false,
      "coverage": {
        "fixtures": {
          "events": true,
          "lineups": true,
          "statistics_fixtures": false,
          "statistics_players": false
        },
        "standings": true,
        "players": true,
        "top_scorers": true,
        "top_assists": true,
        "top_cards": true,
        "injuries": false,
        "predictions": true,
        "odds": false
      }
    }
  ]
}
```

### Grundlage für die md-Datei:

- **Inhaltsverzeichnis**: Ich habe einen Abschnitt namens "Inhaltsverzeichnis" eingefügt, der Links zu den Hauptabschnitten des Dokuments enthält.

- **Code-Formatierung**: Um Code schön formatiert darzustellen, können Sie ihn zwischen drei Backticks (\`\`\`) einfügen und die Sprache (in diesem Fall `json` für JSON-Format) angeben.

- **Anker-Links**: In Markdown erstellen Überschriften automatisch Anker-Links. Sie können diese verwenden, um innerhalb des Dokuments zu navigieren. Zum Beispiel würde `[Countries](#countries)` zum Abschnitt "Countries" springen.


