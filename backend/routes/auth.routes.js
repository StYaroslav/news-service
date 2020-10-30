const {Router} = require('express')
const User = require('../db/models/User')
const config = require('config')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = Router()

router.post(
    '/register',
    [
        check('email', "Invalid email!").isEmail(),
        check('password', "Password should contain at least 5 symbols").isLength({min: 5})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid registration data!'
                })
            }

            const { email, login, password} = req.body

            const candidate = await User.findOne({$or: [{ email }, { login }]})

            if (candidate) {
                return res.status(400).json({message: 'User with such email or login is already exist!'})
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const user = new User({email, password: hashedPassword, login})

            await user.save()

            res.status(201).json({message: "User created successfully!"})

        } catch (e) {
            res.status(500).json({message: "Something go wrong, try again"})
        }
    })

router.post(
    '/login',
    [
        check('email', "Enter correct email!").normalizeEmail().isEmail(),
        check('password', "Enter correct password!").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid login data!'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({ email })

            if(!user) {
                return res.status(400).json({ message: "Incorrect email or password!" })
            }

            const isValid = await bcrypt.compare(password, user.password)

            if(!isValid) {
                return res.status(400).json({ message: "Incorrect email or password!" })
            }

            const token = jwt.sign( // Generating jwt token
                { userId: user.id },
                config.get('jwtKey'),
                { expiresIn: '1h' }
            )

            if(!user.isVerified) {
                return res.status(400).json({ message: "Confirm email to login!" })
            }

            res.json({ token, userId: user.id })


        } catch (e) {
            res.status(500).json({message: "Something go wrong, try again"})
        }
    })

module.exports = router