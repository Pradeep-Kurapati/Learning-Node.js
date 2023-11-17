const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.user = data}
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async(req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) res.status(400).json({'message': 'Username and password are required'})

    const duplicate = userDB.users.find(person => person.username === user);
    if(duplicate) return res.status(409).json({'message': 'Username already taken'})

    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // store the new user
        const newUser = {"username": user, "password": hashedPwd}
        userDB.setUsers([...userDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users)
        );
        console.log(userDB.users)
        res.status(201).json({'Success': `New user ${user} created!`})
    } catch(err) {
        res.status(500).json({'message': err.message})
    }
}

module.exports = { handleNewUser };