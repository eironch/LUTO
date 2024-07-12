import mongoose from 'mongoose'

const Schema = mongoose.Schema

const preferenceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filters: {
        type: [String],
        default: []
    },
    isDarkMode: {
        type: Boolean,
        default: false,
    },
}, { timestamps: { createdAt: true, updatedAt: false } })

const Preference = mongoose.model('Preference', preferenceSchema)

export default Preference