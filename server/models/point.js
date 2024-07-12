import mongoose from 'mongoose'

const Schema = mongoose.Schema

const pointSchema = new Schema({
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
    pointStatus: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Point = mongoose.model('Point', pointSchema)

export default Point