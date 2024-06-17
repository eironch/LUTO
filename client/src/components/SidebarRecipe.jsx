import React from 'react'
import { Link } from 'react-router-dom'

import ProfilePicture from '../assets/profile-picture.png'
import ApproveIcon from '../assets/approve-icon.png'
import FeedbackIcon from '../assets/feedback-icon.png'
import TagIcon from '../assets/tag-icon.png'
import IngredientsIcon from '../assets/ingredients-icon.png'
import SummaryIcon from '../assets/summary-icon.png'
import Feedback from './Feedback'

function SidebarRecipe(p) {
    const authorName = p.authorName
    const recipeImage = p.recipeImage
    const summary = p.summary
    const ingredients = p.ingredients
    const tags = p.tags

    return (
        <div className="pl-3 grid w-full h-full overflow-hidden" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="flex overflow-x-hidden overflow-y-scroll h-full scrollable-div flex-col text-zinc-100 col-span-4 pointer-events-auto">
                {/* Recipe Image */}
                <div className="p-2 mb-3 rounded-3xl bg-gradient-to-tr from-orange-500 to-orange-400">
                    <div className="relative w-full h-auto aspect-w-2 aspect-h-2 rounded-3xl">
                        {
                            recipeImage &&
                            <img className="absolute inset-0 w-full h-full rounded-3xl object-cover" src={ recipeImage } alt="" />
                        }
                    </div>
                    <div className="grid grid-cols-2 pt-2">
                        <div className="flex">
                            <div className="flex gap-3 px-4 py-2 items-center justify-start rounded-3xl hover:bg-orange-400">
                                <button className="hover:underline">
                                    <img className="w-10" src={ FeedbackIcon } alt="" />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex gap-3 px-4 py-2 items-center rounded-3xl hover:bg-orange-400">
                                <button>
                                    <img className="w-10" src={ ApproveIcon } alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* User */}
                <Link to={`/${ authorName }`} className="flex gap-6 flex-row items-center mb-3 p-6 rounded-3xl bg-zinc-900 hover:bg-zinc-500">
                    <img className="w-14" src={ ProfilePicture } alt="" />
                    <p className="text-xl font-semibold">
                        { authorName }
                    </p>
                </Link>
                {/* Summary */}
                <div className="flex flex-col mb-3 rounded-3xl bg-zinc-900">
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
                {/* Ingredients */}
                <div className="flex flex-col mb-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row p-6 gap-6 items-center shadow-md shadow-zinc-950">
                        <img className="w-10" src={ IngredientsIcon } alt="" />
                        <p className="text-2xl font-semibold">Ingredients</p>
                    </div>
                    <ul className="flex flex-col p-6 gap-3 text-lg ">
                        {
                            ingredients &&
                            ingredients.map((ingredient, index) => 
                                <li className="flex px-3 rounded-3xl text-center items-center" key={ index }>
                                    <p className="pr-3  text-2xl font-bold">•</p>
                                    <p className="text-lg">{ ingredient }</p>      
                                </li>
                            )
                        }
                    </ul>
                </div>
                {/* Tags */}
                <div className="flex flex-col mb-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row p-6 gap-6 items-center shadow-md shadow-zinc-950">
                        <img className="w-10" src={ TagIcon } alt="" />
                        <p className="text-2xl font-semibold">Tags</p>
                    </div>
                    <div className="block p-6 text-md font-semibold w-full">
                        {
                            tags &&
                            tags.map((tag, index) => 
                                <div className="inline-block m-1 px-3 py-1 w-fit bg-zinc-800 rounded-3xl" key={ index } id={ index }>
                                    { tag }
                                </div>
                            )
                        }
                    </div>
                </div>
                {/* Feedbacks */}
                <div className="flex flex-col mb-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row items-center p-6 gap-6 shadow-md shadow-zinc-950">
                        <img className="w-10" src={ FeedbackIcon } alt="" />
                        <p className="text-2xl font-semibold">Feedbacks</p>
                        <p className="flex text-xl font-semibold justify-end w-full"></p>
                    </div>
                    <div className="flex flex-col p-6 gap-6">
                        <Feedback user={ { username: "Anonymous" } }/>
                        <Feedback user={ { username: "Anonymous" } }/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SidebarRecipe