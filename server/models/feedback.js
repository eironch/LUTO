import mongoose from 'mongoose'

const Schema = mongoose.Schema

const feedbackSchema = new Schema({
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
    text: {
        type: String,
        required: true
    },
    flagCount: {
        type: Number,
        default: 0
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

const Feedback = mongoose.model('Feedback', feedbackSchema)

export default Feedback