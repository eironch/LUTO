import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

import PointSection from './PointSection'
import FeedbackSection from '../components/FeedbackSection'

import ProfileIcon from '../assets/profile-icon.svg'
import FeedbackIcon from '../assets/feedback-icon.svg'
import TagIcon from '../assets/tag-icon.svg'
import IngredientsIcon from '../assets/ingredients-icon.svg'
import SummaryIcon from '../assets/summary-icon.svg'

function SidebarRecipe({
    user, formatDate,
    recipeId, authorName,
    profilePicture, recipeImage,
    summary, ingredients,
    tags, points,
    setPoints, pointStatus,
    setPointStatus, feedbackCount,
    setFeedbackCount, handleGiveRecipePoint,
    scrollDivRef, currentTab,
    screenSize, title
}) {
    const localRef = useRef(null)
    const sectionRef = useRef(null)

    const scrollToBottom = () => {
        if (localRef.current && sectionRef.current) {
            const offsetTop = sectionRef.current.offsetTop - localRef.current.offsetTop

            localRef.current.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            })
        }
    }
    
    async function handleGivePoint(status) {
        if (pointStatus === status) {
            status = ''
        }
        
        const { recipePointStatus, points } = await handleGiveRecipePoint(user.userId, recipeId, status)
        
        setPoints(points)
        setPointStatus(recipePointStatus)
    }
    
    useEffect(() => {
        if (scrollDivRef) {
            scrollDivRef.current = localRef.current
        }
    }, [scrollDivRef])

    return (
        <div className="pl-3 flex xl:grid w-full h-dvh overflow-hidden" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className={`${ screenSize > 3 ? "scrollable-div" : "pr-3 hide-scrollbar" } flex flex-col w-full h-full py-[4.75rem] xl:py-0 text-zinc-100 col-span-4 pointer-events-auto overflow-x-hidden overflow-y-scroll`} ref={ localRef }>
                {/* recipe image */}
                <div className="rounded-3xl bg-zinc-900">
                    {
                        screenSize < 4 &&
                        <div className="flex flex-col items-center w-full p-6 rounded-3xl bg-zinc-900">
                            <p className="text-2xl md:3xl xl:text-4xl font-bold w-full text-center">
                                { title }
                            </p>
                        </div>
                    }
                    <div className="p-2 rounded-3xl bg-gradient-to-tr from-orange-500 to-orange-400">
                        <div className="relative w-full h-auto aspect-w-2 aspect-h-2 rounded-3xl">
                            {
                                recipeImage &&
                                <img className="absolute inset-0 w-full h-full rounded-3xl object-cover" src={ recipeImage } alt="" />
                            }
                        </div>
                    </div>
                    <div className="flex p-3">
                        <div className="flex black">
                            <button className="flex gap-3 p-3 px-4 items-center justify-start rounded-3xl hover:bg-zinc-500" onClick={ () => scrollToBottom() }>
                                <div className="flex flex-row gap-3 items-center text-lg font-semibold">
                                    <img className="min-w-10 w-10" src={ FeedbackIcon } alt="" />
                                    { 
                                        feedbackCount > 0 && 
                                        <p>{ feedbackCount }</p>
                                    }
                                </div>
                            </button>
                        </div>
                        <div className="flex justify-end items-end w-full black overflow-hidden">
                            <PointSection 
                                handleGivePoint={ handleGivePoint } pointStatus={ pointStatus }
                                points={ points } screenSize={ screenSize }
                            />
                        </div>
                    </div>
                </div>
                {/* summary */}
                <div className="flex flex-col mt-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row p-6 gap-6 items-center shadow-md shadow-zinc-950">
                        <img className="w-10" src={ SummaryIcon } alt="" />
                        <p className="text-2xl font-semibold">
                            Summary
                        </p>
                    </div>
                    <p className="text-justify p-6 text-lg">
                        { summary }
                    </p>        
                </div>
                {/* ingredients */}
                <div className="flex flex-col mt-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row p-6 gap-6 items-center shadow-md shadow-zinc-950">
                        <img className="w-10" src={ IngredientsIcon } alt="" />
                        <p className="text-2xl font-semibold">Ingredients</p>
                    </div>
                    <ul className="flex flex-col p-6 gap-3 text-lg ">
                        {
                            ingredients &&
                            ingredients.map((ingredient, index) => 
                                <li className="flex px-3 text-center items-center overflow-hidden" key={ index }>
                                    <p className="pr-3 text-2xl font-bold">•</p>
                                    <p className="text-left text-lg w-full">
                                        { ingredient }
                                    </p>      
                                </li>
                            )
                        }
                    </ul>
                </div>
                {/* user */}
                <Link to={`/${ authorName }`} className="flex gap-6 flex-row items-center mt-3 p-6 rounded-3xl bg-zinc-900 hover:bg-zinc-500">
                    <img className="w-14 h-14 aspect-1 rounded-full object-cover" src={ profilePicture || ProfileIcon } alt="" />
                    <p className="text-xl font-semibold">
                        { authorName }
                    </p>
                </Link>
                {/* tags */}
                <div className="flex flex-col mt-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row p-6 gap-6 items-center shadow-md shadow-zinc-950">
                        <img className="w-10" src={ TagIcon } alt="" />
                        <p className="text-2xl font-semibold">Tags</p>
                    </div>
                    <div className="block p-5 text-md font-semibold w-full">
                        {
                            tags &&
                            (
                                tags.length === 0 ?
                                <p className="text-xl text-center">No tags provided</p>
                                :
                                tags.map((tag, index) => 
                                    <div className="inline-block m-1 px-3 py-1 w-fit bg-zinc-800 rounded-3xl" key={ index } id={ index }>
                                        { tag }
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
                {/* feedbacks */}
                <div className="mt-3 -mb-3" ref={ sectionRef }>
                    <FeedbackSection 
                        user={ user } recipeId={ recipeId } 
                        feedbackCount={ feedbackCount } setFeedbackCount={ setFeedbackCount } 
                        formatDate={ formatDate } currentTab={ currentTab }
                    />
                </div>
            </div>
        </div>
    )
}

export default SidebarRecipe