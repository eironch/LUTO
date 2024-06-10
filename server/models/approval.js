import mongoose from 'mongoose'

const Schema = mongoose.Schema

const approvalSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        require: true
    },
}, { timestamps: { createdAt: true, updatedAt: false } })

approvalSchema.index(
    { userId: 1, recipeId: 1 },
    { unique: true }
)

const Approval = mongoose.model('Approval', approvalSchema)
export default Approval