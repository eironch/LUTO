import mongoose from 'mongoose'

const Schema = mongoose.Schema

const verificationSchema = new Schema({
    email: {
        type: String
    },
    code: {
        type: String
    },
    expiresAt: {
        type: Date
    }
})

const Verification = mongoose.model('Verification', verificationSchema)

export default Verification