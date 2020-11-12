const {Router} = require('express')
const {check} = require('express-validator')
const router = Router()
const authenticationController = require('../controllers/authenticationController')


/* api/users/register */
router.post(
    '/register',
    [
        check('email', "Invalid email!").isEmail(),
        check('password', "Password should contain at least 5 symbols").isLength({min: 5})
    ], authenticationController.user_register)


/* api/users/login */
router.post(
    '/login',
    [
        check('email', "Enter correct email!").normalizeEmail().isEmail(),
        check('password', "Enter correct password!").exists()
    ], authenticationController.user_login)


/* api/users/confirm/:token */
router.get('/confirm/:token', authenticationController.confirm_email)


// router.get('/', authenticateToken, async (req, res) => {
//     const users = await User.find({_id: req.user.userId})
//     res.json(users)
// })
//
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//
//     if (!token) {
//         return res.status(401).json("Ooops something go wrong!")
//     } else {
//         jwt.verify(token, process.env.USER_TOKEN_SECRET, (err, user) => {
//             if (err) {
//                 return res.status(403).json("Invalid token")
//             }
//             req.user = user
//             next()
//         })
//     }
// }

module.exports = router