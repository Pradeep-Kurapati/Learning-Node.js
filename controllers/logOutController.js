const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.user = data}
}

const fsPromises = require('fs').promises;
const path = require('path')

const handleLogOut = async(req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(204);
    const refreshToken = cookies.jwt;

    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken)

    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, secure: true, sameSite: None, maxAge: 24*60*60*1000})
        return res.sendStatus(204)
    }

    const otherUsers = usersDB.users.filter(person => person.refreshToken !== refreshToken)
    const currentUser = {...foundUser, refreshToken: ''}
    userDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', users.json),
        JSON.stringify(userDB.users)
    );

        res.clearCookie('jwt', {httpOnly: true, secure: true, sameSite: None, maxAge: 24*60*60*1000})
        res.sendStatus(204);
}

module.exports = { handleLogOut }