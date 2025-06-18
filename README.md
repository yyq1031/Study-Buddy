# Lifehack

To set up the project and assuming npm is installed correctly, run these commands:

```bash
git clone git@github.com:yyq1031/Lifehack.git
npm install

cd server
npm install
cd ..

cd client
npm install
cd ..

npm run dev
```

Environment Variables

You need to set up a .env file in the root directory.

    Make a copy of the .env.example file in the root directory.

    Rename the copy to .env.

    Replace the placeholder values with your actual credentials.
    For errors related to CORS, please set the port to a port that is not currently running any applications. This can be found under Networking in the browser.
    To generate API key for Assembly AI for audio transcription, visit https://www.assemblyai.com/dashboard/overview and login using google account to get the API key.
    To generate API key for cohere, visit https://dashboard.cohere.com/api-keys to login to gmail account and select the options to a series of questions. 
    After the dashboard is loaded, find the AI keys generation on the left navigation bar.

    🔐 Note: Do not commit your .env file to version control.
    
Create and place the firebaseAdmin.js file containing the following info in server:

    
    const admin = require("firebase-admin");
    const serviceAccount = require("./firebase-server-account.json");

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    const db = admin.firestore();

    module.exports = { admin, db };



Ensure that after git clone there is a public folder in client that contains a subfolder called models. Models should contain face_expression_model-shard1, face_expression_model-weights_manifest, tiny_face_detector_model-shard1, and tiny_face_detector_model-weights_manifest. These models can also be found at https://github.com/justadudewhohacks/face-api.js-models.
    
    
Demo Video can be found at: https://www.youtube.com/watch?v=7s5WBDwzroc
