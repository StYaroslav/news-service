const {Schema, model, Types} = require('mongoose')

const userSchema = new Schema ({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: {
        type: Boolean,
        defaultValue: false
    },
    isVerified: {
        type: Boolean,
        defaultValue: false
    },
    articles: [{
        article: { type: Types.ObjectId, ref: 'Article' },
        mark: { type: String, defaultValue: '1'}
    }],
    profile: [{
        tag: String,
        weight: Number
    }],
   cluster: { type: Types.ObjectId, ref: 'Cluster' },
   verificationToken: { type: Types.ObjectId, ref: 'Token'}
});

module.exports = model('User', userSchema)