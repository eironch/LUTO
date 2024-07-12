import mongoose from 'mongoose'

const Schema = mongoose.Schema

const saveSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
}, { timestamps: { createdAt: true, updatedAt: false } })

const Save = mongoose.model('Save', saveSchema)

export default Save