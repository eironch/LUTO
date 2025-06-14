import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

let config
try {
    config = await import('../secrets.js')
} catch (error) {
    try {
        config = await import('../config.js')
    } catch (error) {
        throw error
    }
}

const Schema = mongoose.Schema

const userSchema = new Schema({ 
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        default: 'user'
    },
    followCount: {
        type: Number,
        default: 0
    },
    profilePicture:{
        type: String
    },
    bio: {
        type: String,
        default: ''
    },
    refreshToken: {
        type: String,
        unique: true
    },
}, { timestamps: true })

function generateRefreshToken(userId, username) {
    return jwt.sign({ userId, username}, config.SECRET_KEY, { expiresIn: '30d' })
}

userSchema.pre('save', function(next) {
    const user = this
    
    user.refreshToken = generateRefreshToken(user.userId, user.username)
    next()
})

userSchema.pre('save', function(next) {
    const user = this
    if (!user.isModified('password')) return next()

    bcrypt.hash(user.password, 8, (err, hash) => {
        if (err) return next(err)
        user.password = hash
        next()
    })
})

const User = mongoose.model('User', userSchema)

export default User