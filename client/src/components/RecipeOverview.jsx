import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

import PointSection from './PointSection'

import FeedbackIcon from '../assets/feedback-icon.svg'
import RemoveIcon from '../assets/remove-icon.svg'
import AllowIcon from '../assets/allow-icon.svg'

function RecipeOverview({
    user, currentTab,
    formatDate, recipes,
    setRecipes, authorName,
    recipeId, prevRecipeId,
    title, summary,
    recipeImage, points,
    feedbackCount, prevFeedbackCount,
    setPrevRecipeId, setPrevTitle,
    setIsFeedbacksShown, handleGiveRecipePoint,
    moreModalShown, setMoreModalShown,
    handleFlagRecipe, flagCount,
    setConfirmationShown, createdAt,
    recipePointStatus, screenSize
}) {
    const dateCreated = new Date(createdAt)
    const [pointStatus, setPointStatus] = useState(recipePointStatus)
    const [formattedDate, setFormattedDate] = useState('')
    const mobileButtonRef = useRef(null)
    const desktopButtonRef = useRef(null)

    function handleClickOutside(e) {
        if (mobileButtonRef.current.contains(e.target) || desktopButtonRef.current.contains(e.target)) {
            if (moreModalShown === recipeId) {
                setMoreModalShown(recipeId)
            } else {
                setMoreModalShown(null)
            }
        } else {
            setMoreModalShown(null)
        }
    }

    useEffect(() => {
        if (moreModalShown === recipeId) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [moreModalShown])

    async function handleGivePoint(status) {
        if (pointStatus === status) {
            status = ''
        }
        
        const { recipePointStatus, points } = await handleGiveRecipePoint(user.userId, recipeId, status)
        
        setRecipes(recipes.map(recipe => {
            if (recipe.recipeId === recipeId) {
                recipe.points = points
            }

            return recipe
        }))
        
        setPointStatus(recipePointStatus)
    }

    function handlePrevFeedbacks() {
        setPrevRecipeId(recipeId)
        setPrevTitle(title)
        setIsFeedbacksShown(true)
    }

    function handleRemove() {
        setPrevRecipeId(recipeId)
        setPrevTitle(title)
        setConfirmationShown("remove")
    }

    function handleRecipe() {
        setPrevRecipeId(recipeId)
        setPrevTitle(title)
        setConfirmationShown("allow")
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

    useEffect(() => {
        if (prevRecipeId === recipeId) {
            setRecipes(recipes.map(recipe => {
                if (recipe.recipeId === recipeId) {
                    return { ...recipe, recipeId: recipe.recipeId, feedbackCount: prevFeedbackCount }
                }
                
                return recipe
            }))
        }
    }, [prevFeedbackCount])

    return (
        <>
            {/* mobile */}
            <div className={`${ currentTab === "Popular" ? "rounded-t-none rounded-b-3xl xl:rounded-3xl" : "rounded-3xl mt-3" } block md:hidden bg-zinc-900`}>
                <div className="flex flex-col w-full gap-3 p-6 pb-3">
                    <div className="flex gap-3 items-center">
                        {
                            screenSize > 3 ?
                            <Link to={`/recipe/${ recipeId }`} className="pb-1 w-full text-zinc-100 text-2xl xl:text-3xl font-bold line-clamp-2 hover:underline">
                                { title }
                            </Link>
                            :
                            <p className="pb-1 w-full text-zinc-100 text-2xl xl:text-3xl font-bold line-clamp-2">
                                { title }
                            </p>
                        }
                        <div className="relative flex h-full justify-center items-center text-zinc-100">
                            <button className="w-10 h-10 text-lg rounded-3xl hover:bg-zinc-500" onClick={ () => handleShowMoreModal() } ref={ mobileButtonRef }>
                                •••
                            </button>
                            {
                                moreModalShown === recipeId &&
                                <div className="absolute z-10 flex py-3 mt-28 mr-24 w-36 rounded-3xl bg-zinc-600 shadow-md shadow-zinc-950 overflow-hidden">
                                    <button className="p-3 w-full text-left font-semibold text-red-600 hover:bg-zinc-500" onClick={ () => flagRecipe() }>
                                        Flag Content
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="flex flex-row -mt-2 text-base xl:text-lg overflow-hidden text-clip text-zinc-400">
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
                </div>
                {/* recipe image */}
                <Link to={`/recipe/${ recipeId }`}  className="relative z-0 flex col-span-4 rounded-3xl p-2 shadow-zinc-950 shadow-right bg-gradient-to-br from-orange-600 to-orange-400">
                    <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden">
                        <img className="w-full h-full rounded-3xl object-cover" src={ recipeImage } alt="" />
                    </div>
                </Link>
                <div className="px-6 py-3">
                    <p className="text-zinc-100 text-base xl:text-lg text-ellipsis overflow-hidden line-clamp-4">
                        { summary }
                    </p>
                </div>
                <div className="flex pb-3 ml-3 h-full">
                    <div className="flex items-end w-40 text-zinc-100 text-lg font-semibold overflow-hidden">
                        <button className="flex items-center p-3 px-4 gap-4 rounded-3xl hover:bg-zinc-500" onClick={ () => handlePrevFeedbacks() }>
                            <img className="min-w-10 w-10" src={ FeedbackIcon } alt="" />
                            { 
                                feedbackCount > 0 && 
                                <p>{ feedbackCount }</p>
                            }
                        </button>
                    </div>
                    <div className="flex justify-end items-end w-full mr-3 gap-3 text-zinc-100 text-lg font-semibold overflow-hidden">
                        {
                            user.accountType === "user" || currentTab === "Popular" || currentTab === "Saved" ?
                            <PointSection 
                                handleGivePoint={ handleGivePoint } pointStatus={ pointStatus }
                                points={ points } screenSize={ screenSize }
                            />
                            :
                            <div className="flex justify-end items-center rounded-3xl bg-zinc-600">
                                <button className="flex justify-end items-center p-4 rounded-3xl hover:bg-red-700" onClick={ () => { handleRemove() } }>
                                    <img className="min-w-8 w-8" src={ RemoveIcon } alt="" />
                                </button>
                                <p>
                                    { flagCount } flags
                                </p>
                                <button className="flex justify-end items-center p-4 rounded-3xl hover:bg-zinc-500" onClick={ () => { handleRecipe() } }>
                                    <img className="min-w-8 w-8" src={ AllowIcon } alt="" />
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {/* desktop */}
            <div className={`${ currentTab === "Popular" ? "rounded-r-3xl" : "rounded-3xl" } hidden md:grid grid-cols-12 mt-3 w-full bg-zinc-900 overflow-hidden`}>
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
                            <div className="relative flex mr-6 mt-6 h-full justify-center items-center text-zinc-100">
                                <button className="w-10 h-10 text-lg rounded-3xl hover:bg-zinc-500" onClick={ () => handleShowMoreModal()} ref={ desktopButtonRef }>
                                    •••
                                </button>
                                {
                                    moreModalShown === recipeId &&
                                    <div className="absolute flex py-3 mt-28 mr-24 w-36 rounded-3xl bg-zinc-600 shadow-md shadow-zinc-950 overflow-hidden">
                                        <button className="p-3 w-full text-left font-semibold text-red-600 hover:bg-zinc-500" onClick={ () => flagRecipe() }>
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
                        <p className="mx-6 text-zinc-100 text-lg text-ellipsis overflow-hidden line-clamp-4 md:line-clamp-3 2xl:line-clamp-4">
                            { summary }
                        </p>
                    </div>
                    <div className="flex mb-6 ml-6 h-full gap-6">
                        <div className="flex items-end w-40 text-zinc-100 text-lg font-semibold overflow-hidden">
                            <button className="flex items-center p-3 px-4 gap-4 rounded-3xl hover:bg-zinc-500" onClick={ () => handlePrevFeedbacks() }>
                                <img className="min-w-10 w-10" src={ FeedbackIcon } alt="" />
                                { 
                                    feedbackCount > 0 && 
                                    <p>{ feedbackCount }</p>
                                }
                            </button>
                        </div>
                        <div className="flex justify-end items-end w-full mr-6 gap-3 text-zinc-100 text-lg font-semibold overflow-hidden">
                            {
                                user.accountType === "user" || currentTab === "Popular" || currentTab === "Saved" ?
                                <PointSection 
                                    handleGivePoint={ handleGivePoint } pointStatus={ pointStatus }
                                    points={ points } screenSize={ screenSize }
                                />
                                :
                                <div className="flex justify-end items-center rounded-3xl bg-zinc-600">
                                    <button className="flex justify-end items-center p-4 rounded-3xl hover:bg-red-700" onClick={ () => { handleRemove() } }>
                                        <img className="min-w-8 w-8" src={ RemoveIcon } alt="" />
                                    </button>
                                    <p>
                                        { flagCount } flags
                                    </p>
                                    <button className="flex justify-end items-center p-4 rounded-3xl hover:bg-zinc-500" onClick={ () => { handleRecipe() } }>
                                        <img className="min-w-8 w-8" src={ AllowIcon } alt="" />
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecipeOverview