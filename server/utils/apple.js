//Generate JWT
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const AppleAuth = require('apple-auth'); 
const appleConfig = require('../config/apple.json'); 
const auth = new AppleAuth(appleConfig, path.join(__dirname, `../config/${appleConfig.private_key_path}`));

module.exports = {

    async appleAuthAction(res,req) {
        let { code } = req.query; 
        if (!code) { res.status(200).json(null); return; } 
        const response = await auth.accessToken(code); 
        const idToken = jwt.decode(response.id_token); 
        const sub = idToken.sub;
        return idToken;

      },
      //Initiate a request 
}