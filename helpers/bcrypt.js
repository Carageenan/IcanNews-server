const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10)

function hash(password) {
    return bcrypt.hashSync(password, salt)
}

function validatePass(password, passwordEncrypted) {
    return bcrypt.compareSync(password, passwordEncrypted)
}

module.exports = {
    hash,
    validatePass
}