import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
        type: String
    },
    refreshToken: {
        type: String,
        unique: true,
    },
}, { timestamps: true })
// placeholder
const secretKey = "luto-app"

function generateRefreshToken(userId, username) {
    return jwt.sign({ userId, username}, secretKey, { expiresIn: '30d' })
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