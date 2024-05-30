import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Image from '../assets/placeholder-img.png'
import DiscussionIcon from '../assets/discussion-icon.png'
import ApproveIcon from '../assets/approve-icon.png'
import ApprovedIcon from '../assets/approved-icon.png'

function RecipeOverview(p) {
    const [isApproved, setIsApproved] = useState(p.isApproved)
    const user = p.user
    const username = p.username
    const recipeId = p.recipeId
    const title = p.title
    const summary = p.summary
    const postApproveRecipe = p.postApproveRecipe

    function approveRecipe() {
        postApproveRecipe(user.userId, recipeId)
        setIsApproved(!isApproved)
    }

    return (
        <div className="grid grid-cols-12 mb-3 rounded-3xl bg-zinc-900 overflow-hidden">
            {/* recipe image */}
            <Link to={`/recipe/${ recipeId }`}  className="flex col-span-4 rounded-3xl p-2 shadow-zinc-950 shadow-right bg-gradient-to-br from-orange-600 to-orange-400">
                <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden">
                    <img className="w-full h-full rounded-3xl object-cover" src={ Image } alt="" />
                </div>
            </Link>
            {/* recipe content */}
            <div className="col-span-8 flex flex-col">
                <div className="flex flex-col w-full min-h-64 gap-3">
                    <Link to={`/recipe/${ recipeId }`} className="mx-6 mt-6 pt-0.5 text-zinc-100 text-3xl font-bold line-clamp-2 hover:underline">{ title }</Link>
                    <p className="mx-6 text-zinc-400 text-lg overflow-hidden text-ellipsis line-clamp-1">{ username }’s Recipe • February 8</p>
                    <p className="mx-6 text-zinc-100 text-lg text-ellipsis overflow-hidden line-clamp-4">{ summary }</p>
                </div>
                <div className="flex mb-6 ml-6 h-full gap-6">
                    <div className="flex items-end w-full text-zinc-100 text-lg overflow-hidden">
                        <button className="flex items-center px-4 py-2 gap-4 rounded-3xl hover:bg-zinc-500">
                            <img className="w-10" src={ DiscussionIcon } alt="" />
                            <p>1.1k</p>
                        </button>
                    </div>
                    <div className="flex justify-end items-end w-full mr-6 gap-4 text-zinc-100 text-lg overflow-hidden">
                        <button className="flex justify-end items-center px-4 py-2 gap-4 rounded-3xl hover:bg-zinc-500" onClick={ () => { approveRecipe() } }>
                            <p>1.1k</p>
                            <img className="w-10" src={ isApproved ? ApprovedIcon : ApproveIcon } alt="" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipeOverview