import mongoose from 'mongoose'

const Schema = mongoose.Schema

const flagSchema = new Schema({
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

const Flag = mongoose.model('Flag', flagSchema)

export default Flag