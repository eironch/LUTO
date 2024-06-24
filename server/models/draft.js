import mongoose from 'mongoose'

const Schema = mongoose.Schema

const elementSchema = new Schema({
    contentType: {
        type: String,
        require: true,
    },
    text: {
        type: String,
    },
    files: {
        type: [String],
    },
}, { _id: false })

const draftSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    recipeImage:{
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true,
    },
    summary: {
        type: String
    },
    ingredients: {
        type: [String]
    },
    tags: {
        type: [String]
    },
    recipeElements: {
        type: [elementSchema]
    },
    points: {
        type: Number,
        default: 0
    },
    feedbackCount: {
        type: Number,
        default: 0
    },
    flagCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true })

const Draft = mongoose.model('Draft', draftSchema)
export default Draft