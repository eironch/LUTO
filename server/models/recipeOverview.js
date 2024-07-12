import mongoose from 'mongoose'

const Schema = mongoose.Schema

const recipeOverviewSchema = new Schema({
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: {
        type: [String],
    },
    recipeImage:{
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
    },
}, { timestamps: true })

const RecipeOverview = mongoose.model('RecipeOverview', recipeOverviewSchema)

export default RecipeOverview