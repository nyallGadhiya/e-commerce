const firebasestorage = require('multer-firebase-storage');
const multer = require('multer');
const admin = require('./firebase.config');
const serviceAccount = require('/etc/secrets/e-commerce-85ac6-firebase-adminsdk-9qvqw-7ac6118575.json');


const storage = firebasestorage({
    bucketName: 'e-commerce-85ac6.appspot.com',
    credentials: admin.credential.cert(serviceAccount),
    unique:true,
    public:true
});

const upload = multer({ storage: storage });

module.exports = upload;