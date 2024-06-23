import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import FeedbackIcon from '../assets/feedback-icon.png'
import ApproveIcon from '../assets/approve-icon.png'
import ApprovedIcon from '../assets/approved-icon.png'

function RecipeOverview(p) {
    const user = p.user
    const recipes = p.recipes
    const setRecipes = p.setRecipes
    const authorName = p.authorName
    const recipeId = p.recipeId
    const title = p.title
    const summary = p.summary
    const recipeImage = p.recipeImage
    const points = p.points
    const feedbackCount = p.feedbackCount
    const setPrevRecipeId = p.setPrevRecipeId
    const setPrevTitle = p.setPrevTitle
    const setIsFeedbacksShown = p.setIsFeedbacksShown
    const handleApproveRecipe = p.handleApproveRecipe
    const formatDate = p.formatDate
    const moreModalShown = p.moreModalShown
    const setMoreModalShown = p.setMoreModalShown
    const handleFlagRecipe = p.handleFlagRecipe

    const dateCreated = new Date(p.dateCreated)
    const [isApproved, setIsApproved] = useState(p.isApproved)
    const [formattedDate, setFormattedDate] = useState('')
    const modalRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                setMoreModalShown()
            }
        }

        if (moreModalShown === recipeId) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [moreModalShown])

    async function handleApprove() {
        const { isApproved, points } = await handleApproveRecipe(user.userId, recipeId)
        
        setRecipes(recipes.map(recipe => {
            if (recipe.recipeId._id === recipeId) {
                recipe.recipeId.points = points
            }

            return recipe
        }))
        
        setIsApproved(isApproved)
    }

    function handlePrevFeedbacks() {
        setPrevRecipeId(recipeId)
        setPrevTitle(title)
        setIsFeedbacksShown(true)
    }

    function handleShowMoreModal() {
        if (moreModalShown !== recipeId) {
            setMoreModalShown(recipeId)
        } else {
            setMoreModalShown()
        }
    }

    function flagRecipe() {
        handleFlagRecipe(user.userId, recipeId)
        setMoreModalShown()
    }

    useLayoutEffect(() => {
        setFormattedDate(formatDate(dateCreated))
    }, [])

    return (
        <div className="grid grid-cols-12 mb-3 rounded-3xl bg-zinc-900 overflow-hidden">
            {/* recipe image */}
            <Link to={`/recipe/${ recipeId }`}  className="flex col-span-4 rounded-3xl p-2 shadow-zinc-950 shadow-right bg-gradient-to-br from-orange-600 to-orange-400">
                <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden">
                    <img className="w-full h-full rounded-3xl object-cover" src={ recipeImage } alt="" />
                </div>
            </Link>
            {/* recipe content */}
            <div className="col-span-8 flex flex-col">
                <div className="flex flex-col w-full min-h-64 gap-3">
                    <div className="flex gap-3 items-center">
                        <Link to={`/recipe/${ recipeId }`} className="ml-6 mt-6 pb-1 w-full text-zinc-100 text-3xl font-bold line-clamp-2 hover:underline">
                            { title }
                        </Link>
                        <div className="relative flex mr-10 mt-6 h-full justify-center items-center text-zinc-100">
                            <button className="w-10 h-10 text-lg rounded-3xl hover:bg-zinc-500" onClick={ () => handleShowMoreModal()} ref={ buttonRef }>
                                •••
                            </button>
                            {
                                moreModalShown === recipeId &&
                                <div className="absolute flex p-3 mt-28 mr-24 w-36 rounded-3xl bg-zinc-700 shadow-md shadow-zinc-950" ref={ modalRef }>
                                    <button className="p-3 w-full text-left font-semibold text-red-600 rounded-3xl hover:bg-zinc-500" onClick={ () => flagRecipe() }>
                                        Flag Content
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="flex flex-row mx-6 -m-1 text-lg overflow-hidden text-clip text-zinc-400">
                        <Link to={`/${ authorName }`} className="hover:underline">
                            { authorName }
                        </Link>
                        <p className="line-clamp-1">
                            ’s recipe •&nbsp;
                        </p>
                        <p className="line-clamp-1">
                            { formattedDate }
                        </p>
                    </div>
                    <p className="mx-6 text-zinc-100 text-lg text-ellipsis overflow-hidden line-clamp-4">
                        { summary }
                    </p>
                </div>
                <div className="flex mb-6 ml-6 h-full gap-6">
                    <div className="flex items-end w-full text-zinc-100 text-lg font-semibold overflow-hidden">
                        <button className="flex items-center px-4 py-2 gap-4 rounded-3xl hover:bg-zinc-500" onClick={ () => handlePrevFeedbacks() }>
                            <img className="min-w-10 w-10" src={ FeedbackIcon } alt="" />
                            { 
                                feedbackCount > 0 && 
                                <p>{ feedbackCount }</p>
                            }
                        </button>
                    </div>
                    <div className="flex justify-end items-end w-full mr-6 gap-4 text-zinc-100 text-lg font-semibold  overflow-hidden">
                        <button className="flex justify-end items-center px-4 py-2 gap-4 rounded-3xl hover:bg-zinc-500" onClick={ () => { handleApprove() } }>
                            { 
                                points > 0 && 
                                <p>{ points }</p>
                            }
                            <img className="min-w-10 w-10" src={ isApproved ? ApprovedIcon : ApproveIcon } alt="" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipeOverview