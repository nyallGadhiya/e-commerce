const admin = require('firebase-admin');
const serviceAccount = require('/etc/secrets/e-commerce-85ac6-firebase-adminsdk-9qvqw-7ac6118575.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://e-commerce-85ac6.appspot.com'
}); 



module.exports = admin;