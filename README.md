# 📖 Ny Baiboly

Application mobile de lecture de la **Bible malgache**, conçue avec **React Native + Expo**.
L'application permet de consulter les livres, chapitres et versets de la Bible, même **hors connexion**, avec plusieurs fonctionnalités pour améliorer l'expérience de lecture.

## ✨ Fonctionnalités

* 📚 Lecture complète de la Bible
* 📖 Navigation par livre, chapitre et verset
* 🔎 Recherche de passages
* 📝 Sélection et sauvegarde de versets
* 📌 Archives des passages consultés
* 🗒️ Création et gestion de notes personnelles
* 🎨 Personnalisation de l'apparence
* 🌙 Mode clair et mode sombre
* 🔤 Personnalisation de la taille du texte
* 🌍 Interface multilingue :

  * 🇲🇬 Malagasy
  * 🇫🇷 Français
  * 🇬🇧 English
* 📱 Interface adaptée aux appareils mobiles
* 📴 Fonctionnement hors ligne grâce aux données locales
* 💾 Stockage local avec SQLite

## 🛠️ Technologies utilisées

### Frontend

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/)
* [Expo Router](https://docs.expo.dev/router/introduction/)
* TypeScript

### Stockage

* SQLite avec `expo-sqlite`
* Données bibliques stockées localement
* Gestion locale des notes et archives

### Interface

* React Native
* Context API
* Support du thème clair/sombre
* Interface responsive

## 📂 Structure du projet

```text
ny-baiboly/
├── app/
│   ├── (baiboly)/
│   │   ├── index.tsx
│   │   ├── book.tsx
│   │   ├── chapter.tsx
│   │   └── ...
│   │
│   ├── (form)/
│   │   ├── note-input.tsx
│   │   └── ...
│   │
│   ├── details/
│   │   └── ...
│   │
│   └── _layout.tsx
│
├── assets/
│   ├── images/
│   ├── json/
│   └── ...
│
├── components/
│   ├── AppHeader.tsx
│   ├── ...
│   └── ...
│
├── constants/
│   ├── colors.ts
│   ├── text.ts
│   └── ...
│
├── context/
│   ├── app-context.tsx
│   ├── db-context.tsx
│   └── ...
│
├── database/
│   ├── ...
│   └── ...
│
├── hooks/
│   └── ...
│
├── utils/
│   ├── ...
│   └── ...
│
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Installation

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

* Node.js
* npm
* Git
* Android Studio pour le développement Android
* Expo CLI / Expo

### Cloner le projet

```bash
git clone <URL_DU_REPOSITORY>
cd ny-baiboly
```

### Installer les dépendances

```bash
npm install
```

## ▶️ Lancer l'application

### Démarrer Expo

```bash
npm start
```

ou :

```bash
npx expo start
```

### Android

```bash
npm run android
```

ou :

```bash
npx expo run:android
```

### Web

```bash
npm run web
```

## 🗄️ Base de données

L'application utilise **SQLite** pour conserver localement certaines données.

La base peut notamment contenir :

### `images`

Stockage des images utilisées par l'application.

| Colonne       | Description      |
| ------------- | ---------------- |
| `id`          | Identifiant      |
| `uri`         | URI de l'image   |
| `image_index` | Index de l'image |
| `created_at`  | Date de création |

### `colors`

Gestion des couleurs personnalisées.

| Colonne       | Description            |
| ------------- | ---------------------- |
| `id`          | Identifiant            |
| `bg`          | Couleur d'arrière-plan |
| `text`        | Couleur du texte       |
| `borderColor` | Couleur de bordure     |
| `colorIndex`  | Index de la couleur    |

### `archives`

Sauvegarde des passages consultés.

| Colonne       | Description          |
| ------------- | -------------------- |
| `id`          | Identifiant          |
| `book_number` | Numéro du livre      |
| `chapter`     | Numéro du chapitre   |
| `verses`      | Versets sélectionnés |
| `created_at`  | Date de création     |

Les versets peuvent être enregistrés sous forme de tableau de nombres dans l'application :

```ts
number[]
```

Exemple :

```ts
[8, 9, 10]
```

### `notes`

Gestion des notes personnelles.

| Colonne       | Description      |
| ------------- | ---------------- |
| `id`          | Identifiant      |
| `book_number` | Numéro du livre  |
| `chapter`     | Chapitre         |
| `verse`       | Verset           |
| `text`        | Texte de la note |
| `title`       | Titre            |
| `content`     | Contenu          |
| `created_at`  | Date de création |

## 📖 Données bibliques

Les données de la Bible sont utilisées localement afin de permettre la lecture sans connexion Internet.

La structure principale comprend :

```text
Bible
 ├── Books
 │    ├── Chapters
 │    │    └── Verses
 │    │
 │    └── ...
 └── ...
```

Chaque livre possède notamment :

```ts
{
  id: number;
  name: string;
  nr: number;
}
```

Les livres sont séparés entre :

* **Ancien Testament** : livres 1 à 39
* **Nouveau Testament** : livres 40 à 66

## 🌍 Langues

L'application dispose d'une interface multilingue.

| Code | Langue        |
| ---- | ------------- |
| `mg` | Malagasy 🇲🇬 |
| `fr` | Français 🇫🇷 |
| `en` | English 🇬🇧  |

Exemple :

```ts
getTranslation("mg")
getTranslation("fr")
getTranslation("en")
```

## 🎨 Thème

L'utilisateur peut choisir entre :

* ☀️ Mode clair
* 🌙 Mode sombre
* 📱 Mode système

Le thème est géré globalement à travers le contexte de l'application.

## 📝 Notes et annotations

L'application permet d'associer des notes à des passages bibliques.

Une note peut être liée à :

```text
Livre → Chapitre → Verset
```

Les utilisateurs peuvent ainsi conserver leurs réflexions ou commentaires directement dans l'application.

## 📌 Archives

Les passages sélectionnés peuvent être sauvegardés dans les archives.

Par exemple :

```ts
{
  book_number: 10,
  chapter: 4,
  verses: [8, 9, 10]
}
```

L'application peut ensuite récupérer le texte correspondant aux versets sélectionnés.

## 🔎 Recherche

La recherche permet de retrouver rapidement des passages dans les données bibliques locales.

Elle peut être utilisée pour rechercher :

* un livre
* un chapitre
* un verset
* un mot ou une expression

## 🔐 Confidentialité

L'application privilégie le stockage local.

Les notes, archives et préférences de l'utilisateur sont conservées localement sur l'appareil lorsque les fonctionnalités correspondantes sont utilisées.

Aucune connexion Internet permanente n'est nécessaire pour la lecture de la Bible.

## 📱 Compatibilité

L'application est principalement développée pour :

* Android 📱
* iOS 🍎

Une version Web peut également être lancée pour le développement et certains tests.

## 🧪 Développement

Pour vérifier le code :

```bash
npm run lint
```

Pour démarrer le serveur Expo :

```bash
npm start
```

Pour reconstruire l'application Android après une modification native :

```bash
npx expo prebuild
```

Puis :

```bash
npx expo run:android
```

## 📦 Build Android

Pour générer une version Android :

```bash
cd android
gradlew.bat assembleRelease
```

Le fichier APK généré se trouve généralement dans :

```text
android/app/build/outputs/apk/release/
```

## 🗺️ Roadmap

Les fonctionnalités peuvent évoluer progressivement :

* [x] Lecture de la Bible
* [x] Navigation livres / chapitres / versets
* [x] Mode sombre
* [x] Multilingue
* [x] Fonctionnement hors ligne
* [x] Archives
* [x] Notes
* [ ] Amélioration de la recherche
* [ ] Synchronisation optionnelle
* [ ] Partage de versets
* [ ] Personnalisation avancée de la lecture
* [ ] Audio Bible
* [ ] Plans de lecture
* [ ] Notifications quotidiennes

## 🤝 Contribution

Les contributions sont les bienvenues.

1. Forker le projet
2. Créer une branche :

```bash
git checkout -b feature/nouvelle-fonctionnalite
```

3. Effectuer les modifications
4. Committer :

```bash
git commit -m "feat: ajout d'une nouvelle fonctionnalité"
```

5. Pousser la branche :

```bash
git push origin feature/nouvelle-fonctionnalite
```

6. Créer une Pull Request

## 📄 Licence

Ce projet est développé à des fins d'apprentissage et de développement d'une application mobile de lecture biblique.

Les données bibliques utilisées dans le projet peuvent être soumises à leurs propres conditions de licence ou de distribution. Vérifiez les droits associés aux sources des textes avant toute redistribution.

---

## 👨‍💻 Développement

Projet développé avec ❤️ avec :

**React Native · Expo · TypeScript · SQLite**

> 📖 Lire, méditer et conserver ses passages bibliques préférés, directement depuis son téléphone — même hors connexion.
