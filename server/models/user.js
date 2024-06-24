import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

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
    bio: {
        type: String
    },
    userType: {
        type: String,
        required: true,
        default: 'user'
    },
    refreshToken: {
        type: String,
        unique: true,
        require: true
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