const Imagekit = require('imagekit');

const imagekit = new Imagekit({
    publicKey: process.env.DB_PUBLIC_KEY,
    privateKey: process.env.DB_PRIVATE_KEY,
    urlEndpoint: process.env.DB_URL_ENDPOINT
})

module.exports = imagekit;