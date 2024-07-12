import mongoose from 'mongoose'

const Schema = mongoose.Schema

const elementSchema = new Schema({
    contentType: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    },
    files: {
        type: [String],
    },
}, { _id: false })

const archiveSchema = new Schema({
    removerUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipeImage:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String
    },
    ingredients: {
        type: [String],
        required: true
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

const Archive = mongoose.model('Archive', archiveSchema)

export default Archive