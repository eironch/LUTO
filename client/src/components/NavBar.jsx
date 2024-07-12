import React from 'react'
import { Link } from 'react-router-dom'

import SidebarCreate from '../components/SidebarCreate'
import SidebarTab from '../components/SidebarTab'
import SidebarProfile from '../components/SidebarProfile'
import SidebarRecipe from '../components/SidebarRecipe'

import Logo from '../assets/luto-logo-gradient.png'
import ProfileIcon from '../assets/profile-icon.png'
import CreateIcon from '../assets/create-icon.png'
import SaveIcon from '../assets/saved-icon.png'

function NavBar(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const formatDate = p.formatDate
    const setConfirmationShown = p.setConfirmationShown

    const authorName = p.authorName
    const profilePicture = p.profilePicture
    const recipeId = p.recipeId
    const recipeImage = p.recipeImage
    const setRecipeImage = p.setRecipeImage 
    const title = p.title
    const summary = p.summary
    const setSummary = p.setSummary
    const ingredients = p.ingredients
    const setIngredients = p.setIngredients
    const tags = p.tags
    const setTags = p.setTags
    const points = p.points
    const setPoints = p.setPoints
    const pointStatus = p.pointStatus
    const setPointStatus = p.setPointStatus
    const feedbackCount = p.feedbackCount
    const setFeedbackCount  = p.setFeedbackCount
    const isRecipeSaved = p.isRecipeSaved
    const publishRecipe = p.publishRecipe
    const handleSaveRecipe = p.handleSaveRecipe
    const handleGiveRecipePoint = p.handleGiveRecipePoint
    const systemTags = p.systemTags
    const filters  = p.filters
    const setFilters = p.setFilters

    return (
        <div>
            <div className="fixed flex gap-3 flex-col w-full h-svh pointer-events-none">
                {/* navbar */}
                <div className="p-3 pb-0">
                    <div className="grid gap-3 w-full min-h-16 pointer-events-none" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        {/* logo navbar side*/}
                        {
                            (
                                currentTab === "Home" || currentTab === "Search" || 
                                currentTab === "Saved" || currentTab === "Popular"
                            ) &&
                            <Link to="/home" className="pointer-events-auto rounded-3xl flex col-span-2 items-center justify-center bg-zinc-900 hover:bg-zinc-500">
                                <img className="px-4 w-48" src={ Logo } alt="" />
                            </Link>
                        }
                        {/* publish/create navbar `*/}
                        {
                            (currentTab === "Profile" || currentTab === "Create" || currentTab === "Recipe") &&
                            <>
                                {
                                    currentTab === "Create" ?
                                    <button className="col-span-2 items-center gap-4 bg-zinc-900 pointer-events-auto flex flex-row justify-center w-full h-full rounded-3xl overflow-hidden hover:bg-zinc-500" onClick={ () => { setConfirmationShown("exit") } }>
                                        <img className="px-4 w-48 " src={ Logo } alt="" />
                                    </button>
                                    :
                                    <Link to="/home" className="col-span-2 items-center gap-4 bg-zinc-900 pointer-events-auto flex flex-row justify-center w-full h-full rounded-3xl overflow-hidden hover:bg-zinc-500">
                                        <img className="px-4 w-48 " src={ Logo } alt="" />
                                    </Link>
                                }
                                <div className="col-span-2 flex items-center pointer-events-auto w-full h-full rounded-3xl overflow-hidden">
                                    {
                                        currentTab === "Profile" &&
                                        <Link to="/create" className="flex items-center p-4 gap-4 w-full h-full bg-orange-500 hover:bg-orange-400 overflow-hidden">
                                            <p className="flex text-zinc-100 text-lg w-full font-semibold">
                                                Create
                                            </p>
                                            <img className="w-8" src={ CreateIcon } alt="" />
                                        </Link>
                                    }
                                    {
                                        currentTab === "Create" &&
                                        <button className="flex items-center w-full h-full bg-zinc-600 rounded-3xl overflow-hidden">
                                            <button className={`
                                                    ${ (title && recipeImage.size && summary && (ingredients.length > 1 || ingredients[0].value)) && "bg-orange-500 hover:bg-orange-400" } 
                                                    rounded-3xl flex items-center p-4 gap-4 w-full h-full disabled:bg-zinc-900 disabled:cursor-not-allowed
                                                `} 
                                                onClick={ () => { publishRecipe() } } disabled={ !(title && recipeImage.size && summary && (ingredients.length > 1  || ingredients[0].value)) }
                                            >
                                                <p className="flex text-zinc-100 text-lg w-full font-semibold">
                                                    Publish
                                                </p>
                                                <img className="w-8" src={ CreateIcon } alt="" />
                                            </button>
                                        </button>
                                    }
                                    {
                                        currentTab === "Recipe" &&
                                        <button className={`${ isRecipeSaved ? "bg-zinc-900 hover:bg-zinc-500" : "bg-orange-500 disabled:cursor-not-allowed disabled:bg-zinc-900 hover:bg-orange-400"} flex items-center p-4 gap-4 w-full h-full rounded-3xl overflow-hidden`} 
                                            onClick={ () => handleSaveRecipe() } disabled={ !title }
                                        >
                                            <p className="flex text-zinc-100 text-lg w-full font-semibold">
                                                { isRecipeSaved ? "Unsave" :"Save" }
                                            </p>
                                            <img className="w-8" src={ SaveIcon } alt="" />
                                        </button>
                                    }
                                </div>                           
                            </>
                        }
                        {/* logo navbar middle */}
                        {
                            (
                                currentTab === "Home" || currentTab === "Search" || 
                                currentTab === "Settings" || currentTab === "Saved" || 
                                currentTab === "Popular"
                            ) &&
                            <div className={`${ (currentTab === "Recipe" && currentTab === "Settings") && "bg-zinc-900" } rounded-3xl flex items-center justify-center`} 
                                style={ { gridColumn: (currentTab === "Home" || currentTab === "Search" || currentTab === "Saved" || currentTab === "Popular") ? "span 11" : "span 13" } }
                            >
                                { 
                                    (currentTab === "Settings") &&
                                    <Link to="/home" className="fixed flex items-center pointer-events-auto left-1/2 transform -translate-x-1/2">
                                        <img className="px-4 w-48 " src={ Logo } alt="" />
                                    </Link>
                                }
                            </div>
                        }
                        {/* profile */}
                        {
                            (
                                currentTab === "Home" || currentTab === "Search" || 
                                currentTab === "Settings" || currentTab === "Saved" || 
                                currentTab === "Popular"
                            ) &&
                            <Link to={`/${ user.username }`} className={`${ user.accountType === "user" ? "bg-zinc-900 hover:bg-zinc-500" : "bg-orange-500 hover:bg-orange-400" }  col-span-2 flex items-center justify-end rounded-3xl pointer-events-auto`}>
                                { 
                                    currentTab!=="Profile" && 
                                    <p className="text-zinc-100 text-end w-full ml-3 text-xl font-semibold overflow-hidden">
                                        { user.username }
                                    </p> 
                                }
                                <img className="m-3 w-10 h-10 aspect-1 rounded-full object-cover" src={ user.profilePicture || ProfileIcon } alt="" />
                            </Link>
                        }
                    </div>
                </div>
                {/* content */}
                { 
                    (
                        currentTab === "Home" || currentTab === "Search" || 
                        currentTab === "Settings" || currentTab === "Saved" || 
                        currentTab === "Popular"
                    ) && 
                    <SidebarTab 
                        filters={ filters } setFilters={ setFilters }
                        currentTab={ currentTab } setConfirmationShown={ setConfirmationShown }
                        systemTags={ systemTags }
                    /> 
                }
                { 
                    currentTab === "Profile" && 
                    <SidebarProfile user={ user } authorName={ authorName } />
                }
                { 
                    currentTab === "Create" &&
                    (
                        <SidebarCreate
                            user={ user }    
                            setRecipeImage={ setRecipeImage || null }
                            summary={ summary || null } setSummary={ setSummary || null }
                            ingredients={ ingredients || null } setIngredients={ setIngredients || null }
                            tags={ tags || null } setTags={ setTags || null }
                            currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                            systemTags={ systemTags }
                        />
                    )
                }
                { 
                    currentTab === "Recipe" &&
                    (
                        <SidebarRecipe
                            user={ user } recipeId={ recipeId || null }
                            summary={ summary || null } recipeImage={ recipeImage || null }
                            ingredients={ ingredients || null } tags={ tags || null }
                            authorName={ authorName || null } points={ points } 
                            setPoints={ setPoints } feedbackCount={ feedbackCount } 
                            setFeedbackCount={ setFeedbackCount } currentTab={ currentTab } 
                            pointStatus={ pointStatus || null } setPointStatus={ setPointStatus || null }
                            formatDate={ formatDate || null } handleGiveRecipePoint={ handleGiveRecipePoint }
                            profilePicture={ profilePicture }
                        />
                    )
                }                 
            </div>
        </div>
    )
}


export default NavBar