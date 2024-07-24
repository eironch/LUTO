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
        <div className="absolute z-30 grid place-items-center w-screen h-screen px-3 pt-3 pb-3 text-zinc-100 bg-zinc-950 bg-opacity-70 overflow-x-hidden overflow-y-scroll scrollable-div pointer-events-auto" 
            onMouseDownCapture={e => { 
                    const isOutsideModal = !e.target.closest('.model-inner')
                    
                    if (isOutsideModal) {
                        setShowModal(false)
                    }
                } 
            }
        >
            <div className="flex justify-center min-w-0 w-full h-full xl:-mr-3 xl:p-0 pt-20 pb-44 xl:py-0 items-center">
                <div className="flex flex-col gap-3 justify-center items-center w-full overflow-hidden">
                        <p className="text-xl xl:text-2xl font-semibold text-ellipsis line-clamp-1">
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