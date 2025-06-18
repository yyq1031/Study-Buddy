# Lifehack

## Prerequisites
- Ensure **[Node.js](https://nodejs.org/)** (v16 or later recommended) and **npm** are installed.

## Getting Started
To set up the project, run the following commands:
```bash
# Clone the repo
git clone git@github.com:yyq1031/Lifehack.git
cd Lifehack
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Start front and backend
cd ..
npm run dev
```
---

## Environment Variables
You need to set up a `.env` file in the root directory and in the client directory:
Repeat this in both directories.
1. Make a copy of the `.env.example` file.
2. Rename the copy to `.env`.
3. Replace the placeholder values with your actual credentials.

### API Keys
- **AssemblyAI (Audio Transcription):**  
  Visit [AssemblyAI Dashboard](https://www.assemblyai.com/dashboard/overview), log in with a Google account, and copy the API key.

- **Cohere (AI Text):**  
  Visit [Cohere API Keys](https://dashboard.cohere.com/api-keys), log in with a Google account, answer the onboarding questions, and retrieve your free trial API key.

### Firebase Credentials
- Download the `firebase-server-account.json` file from the Google Drive folder/link provided in the "Other Files" field of the DevPost project submission.
- Place it inside the `server` directory.

> ⚠️ **Important:** Do **not** commit your `.env` file or `firebase-server-account.json` to version control.

---
## Required Files
After cloning the repo, ensure the following:

  - `face_expression_model-shard1`
  - `face_expression_model-weights_manifest`
  - `tiny_face_detector_model-shard1`
  - `tiny_face_detector_model-weights_manifest`

These can also be downloaded from:  
 - [face-api.js-models GitHub](https://github.com/justadudewhohacks/face-api.js-models)

---

## App Notes

- Allow **camera access** when prompted for best experience.
- **Clear cookies** and **refresh** the page when switching between student and teacher roles.

---

## Test Accounts

**Student Login**  
- Email: `admin@gmail.com`  
- Password: `lifehack`

**Teacher Login**  
- Email: `teaher@gmail.com`  
- Password: `lifehacking`

---

## Demo Video

[Watch the Demo](https://www.youtube.com/watch?v=7s5WBDwzroc)

---

### Troubleshooting
If you encounter issues with `npm install`, try cleaning dependencies and reinstalling in all relevant directories:

```bash
# In the root directory
rm -rf node_modules package-lock.json
npm install

# In the server directory
cd server
rm -rf node_modules package-lock.json
npm install
cd ..

# In the client directory
cd client
rm -rf node_modules package-lock.json
npm install
cd ..
```

> On Windows, replace `rm -rf` with `rd /s /q` for folders and `del` for files:

```bash
# Root directory
rd /s /q node_modules
del package-lock.json
npm install

# Server directory
cd server
rd /s /q node_modules
del package-lock.json
npm install
cd ..

# Client directory
cd client
rd /s /q node_modules
del package-lock.json
npm install
cd ..
```

**⚠️ CORS Errors**  
If you encounter CORS issues, check if the backend port (default `5001`) is in use. If it is, choose another port and update:
- `.env`
- `client\.env`  
accordingly.
