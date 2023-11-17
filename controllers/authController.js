const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.user = data}
}

const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config();

const handleLogin = async(req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) res.status(400).json({'message': 'Username and password are required'})

    const foundUser = userDB.users.find(person => person.username === user)

    if(!foundUser) return res.sendStatus(401)

    const match = bcrypt.compare(foundUser.password, pwd)

    if (match) {
        const accessToken = jwt.sign(
            {"username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        ); 
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        ); 

        // saving refresh token with other users
        const otherUsers = userDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = {...foundUser, refreshToken};
        userDB.setUsers(([...otherUsers, currentUser]));
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users)
        );
        res.cookie('jwt', refreshToken, {httpOnly: true, secure: true, sameSite: None, maxAge: 24*60*60*1000})
        res.json({accessToken})
    } else {
        res.sendStatus(409);
    }

}

module.exports = { handleLogin }    
