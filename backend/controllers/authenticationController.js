const User = require('../db/models/User')
const {validationResult} = require('express-validator')
const transporter = require('../mail-config/mailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


exports.confirm_email = async function (req, res) {
    try {
        const decodedToken = jwt.verify(req.params.token, process.env.EMAIL_TOKEN_SECRET)
        let user = await User.findOne({_id: decodedToken.userId})

        if (!user) {
            res.json({message: "Failed to verify email"})
        }

        user.isVerified = true
        await user.save()
    } catch (e) {
        return res.json(e)
    }

    return res.redirect("http://localhost:4200/api/users/register")
}

exports.user_register = async function (req, res) {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid registration data!'
            })
        }

        const {email, login, password} = req.body

        const candidate = await User.findOne({$or: [{email}, {login}]})

        if (candidate) {
            return res.status(400).json({message: 'User with such email or login is already exist!'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({email, password: hashedPassword, login})

        await user.save()

        /* Sending verification Email */
        const emailToken = jwt.sign(
            {
                userId: user.id
            },
            process.env.EMAIL_TOKEN_SECRET,
            {
                expiresIn: '10m'
            },
            (err, emailToken) => {
                const url = `http://localhost:5000/api/users/confirm/${emailToken}`
                transporter.sendMail({
                    to: user.email,
                    subject: "Confirm Email",
                    html: `Please click the link below to confirm your email: <a href="${url}">${url}</a>`
                })
            }
        )

        res.status(201).json({message: "User created successfully!", user: user})

    } catch (e) {
        res.status(500).json({message: "Something go wrong, try again"})
    }
}

exports.user_login = async function (req, res) {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid login data!'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: "Incorrect email or password!"})
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return res.status(400).json({message: "Incorrect email or password!"})
        }

        if (!user.isVerified) {
            return res.status(400).json({message: "Confirm email to login!"})
        }

        const token = jwt.sign( // Generating jwt token
            {userId: user.id},
            process.env.USER_TOKEN_SECRET,
            {expiresIn: '1h'}
        )

        res.json({token})


    } catch (e) {
        res.status(500).json({message: "Something go wrong, try again"})
    }
}