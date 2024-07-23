import React from 'react'
import FeedbackSection from './FeedbackSection'

function FeedbackModal({
    user, formatDate, 
    recipeId, title, 
    feedbackCount, setFeedbackCount, 
    setShowModal, setFeedRecipes,
    currentTab
}) {
    return (
        <div className="absolute inset-0 z-30 grid place-items-center h-full pt-3 text-zinc-100 bg-zinc-950 bg-opacity-80 overflow-y-scroll scrollable-div" 
            onMouseDownCapture={e => { 
                    const isOutsideModal = !e.target.closest('.model-inner')
                    
                    if (isOutsideModal) {
                        setShowModal(false)
                    }
                } 
            }
        >
            <div className="flex justify-center w-full h-full -mr-3 px-1.5 xl:p-0 py-20 xl:py-0 items-center">
                <div className="flex flex-col gap-3 justify-center items-center w-full overflow-hidden">
                        <p className="text-2xl font-semibold text-ellipsis line-clamp-1">
                            { title }
                        </p>
                        <FeedbackSection 
                            user={ user } recipeId={ recipeId } 
                            feedbackCount={ feedbackCount } setFeedbackCount={ setFeedbackCount } 
                            formatDate={ formatDate } setFeedRecipes={ setFeedRecipes }
                            setShowModal={ setShowModal } currentTab={ currentTab }
                        />
                </div>
            </div>
        </div>
    )
}

export default FeedbackModal