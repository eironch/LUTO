import React from 'react'
import FeedbackSection from './FeedbackSection'

function FeedbackModal(p) {
    const user = p.user
    const formatDate = p.formatDate

    const recipeId = p.recipeId
    const title = p.title
    const feedbackCount = p.feedbackCount
    const setFeedbackCount = p.setFeedbackCount
    const setShowModal = p.setShowModal
    const setFeedRecipes = p.setFeedRecipes
    
    return (
        <div className="absolute inset-0 grid place-items-center h-screen pt-3 text-zinc-100 bg-zinc-950 bg-opacity-80 overflow-y-scroll scrollable-div" 
            onMouseDownCapture={e => { 
                    const isOutsideModal = !e.target.closest('.model-inner')

                    if (isOutsideModal) {
                        setShowModal(false)
                    }
                } 
            }
        >
            <div className="flex justify-center w-full h-full -mr-3 items-center">
                <div className="flex flex-col gap-3 justify-center items-center w-5/12 overflow-hidden model-inner">
                        <p className="px-6 text-2xl font-semibold text-ellipsis line-clamp-1">
                            { title }
                        </p>
                        <FeedbackSection 
                            user={ user } recipeId={ recipeId } 
                            feedbackCount={ feedbackCount } setFeedbackCount={ setFeedbackCount } 
                            formatDate={ formatDate } setFeedRecipes={ setFeedRecipes }
                        />
                </div>
            </div>
        </div>
    )
}

export default FeedbackModal