import React, { useState, useLayoutEffect } from 'react'
import axios from 'axios'

import NavBar from '../components/NavBar'
import RecipeOverview from '../components/RecipeOverview'
import FeedbacksModal from '../components/FeedbacksModal'
import ConfirmModal from '../components/ConfirmModal'
import RecipeSuspense from '../components/RecipeSuspense'

import SearchIcon from '../assets/search-icon.png'
import RemoveIcon from '../assets/remove-icon.png'
import AllowIcon from '../assets/allow-icon.png'
import LogOutIcon from '../assets/log-out-icon.png'

function Search(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const formatDate = p.formatDate
    const handleLogOut = p.handleLogOut

    const systemTags = p.systemTags
    const filters = p.filters
    const setFilters = p.setFilters
    const searchQuery = p.searchQuery
    const setSearchQuery = p.setSearchQuery
    const handleGiveRecipePoint = p.handleGiveRecipePoint
    const handleRemoveRecipe = p.handleRemoveRecipe
    const handleAllowRecipe = p.handleAllowRecipe
    const handleFlagRecipe= p.handleFlagRecipe
    
    const [searchedRecipes, setSearchedRecipes] = useState([])
    const [isFeedbacksShown, setIsFeedbacksShown] = useState(false)
    const [prevRecipeId, setPrevRecipeId] = useState()
    const [prevTitle, setPrevTitle] = useState()
    const [prevfeedbackCount, setPrevFeedbackCount] = useState()
    const [confirmationShown, setConfirmationShown] = useState(false)
    const [isFetchingRecipes, setIsFetchingRecipes] = useState(false)
    const [moreModalShown, setMoreModalShown] = useState()

    function removeRecipe() {
        handleRemoveRecipe(user.userId, prevRecipeId)
        
        setConfirmationShown()
        
        setSearchedRecipes(searchedRecipes.filter(recipe => recipe.recipeId !== prevRecipeId))
    }
    
    function allowRecipe() {
        handleAllowRecipe(prevRecipeId)

        setConfirmationShown()

        setSearchedRecipes(searchedRecipes.filter(recipe => recipe.recipeId !== prevRecipeId))
    }

    function handleSearch() {
        if (searchQuery === "") {
            return
        }

        setIsFetchingRecipes(true)
        setSearchedRecipes([])

        axios.get('http://localhost:8080/search-recipes', { params: { userId: user.userId, searchQuery, filters, sort: user.accountType === "user" ? { createdAt: -1 } : { flagCount: 1 } } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)

                setSearchedRecipes(res.data.payload)
                setIsFetchingRecipes(false)
            })
            .catch(err => {
                setSearchedRecipes([])
                setIsFetchingRecipes(false)

                console.log(err)
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function handleEnterKey(e) {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    useLayoutEffect(() => {
        setCurrentTab('Search')
        handleSearch()
    }, [])

    if (currentTab !== 'Search') {
        return
    }

    return (
        <div className="overflow-y-scroll scrollable-div">
            <NavBar 
                user={ user } filters={ filters } 
                setFilters={ setFilters } currentTab={ currentTab } 
                setCurrentTab={ setCurrentTab } setConfirmationShown={ setConfirmationShown }
                systemTags={ systemTags }
            />
            <div className="flex flex-col gap-3 h-svh">
                <div className="flex flex-col gap-3 p-3 pr-0 h-svh">
                    {/* search */}
                    <div className="min-h-52 grid w-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        <div className="col-span-2"></div>
                        <div className="flex flex-col justify-center items-center col-span-11 h-full rounded-3xl bg-zinc-900">
                            {/* search context */}
                            <p className="text-zinc-400 text-4xl mt-7 py-1.5 pt-2 overflow-hidden text-ellipsis line-clamp-1 mx-6">
                                What are you looking up?
                            </p> 
                            {/* search bar */}
                            <div className="relative flex my-10 items-center justify-center shadow-md shadow-zinc-950 rounded-3xl m-3 w-8/12 h-10 bg-zinc-600 pointer-events-auto">
                                <div className="absolute flex ml-6 left-0 right-0 items-start justify-left pointer-events-none">
                                    <img className="w-6" src={ SearchIcon } alt="" />
                                </div>
                                <input 
                                    className="w-full px-16 h-10 rounded-3xl bg-transparent text-zinc-100 placeholder:text-zinc-400 text-center" 
                                    value={ searchQuery } onChange={ (e) => setSearchQuery(e.target.value) }
                                    onKeyDown={ e => handleEnterKey(e) }
                                    type="text" placeholder="Search LUTO"
                                />
                                <div className="absolute flex flex-row mr-2 right-0 items-last justify-right pointer-events-none">
                                    <button
                                        className="w-12 h-8 rounded-3xl text-zinc-100 hover:bg-zinc-500 pointer-events-auto" 
                                        onClick={ () => handleSearch() }
                                    >
                                        ➤
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2"></div>     
                    </div>
                    {/* content */}
                    <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        <div className="col-span-2"></div>
                        {
                            searchedRecipes &&
                            searchedRecipes.length > 0 ?
                            <div className="col-span-11 block">
                                { 
                                    searchedRecipes.map(recipe => 
                                        recipe &&
                                        <RecipeOverview
                                            key={ recipe.recipeId } user={ user }
                                            recipeId={ recipe.recipeId } recipeImage={ recipe.recipeImage } 
                                            title={ recipe.title } summary={ recipe.summary } 
                                            authorName={ recipe.userId.username } pointStatus={ recipe.pointStatus } 
                                            points={ recipe.points } feedbackCount={ recipe.feedbackCount } 
                                            dateCreated={ recipe.createdAt } recipes={ searchedRecipes } 
                                            setRecipes={ setSearchedRecipes } setPrevRecipeId={ setPrevRecipeId }
                                            setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                            handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                            moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                            handleRemoveRecipe={ handleRemoveRecipe } flagCount={ recipe.flagCount } 
                                            setConfirmationShown={ setConfirmationShown } setFeedbackCount={ setPrevFeedbackCount } 
                                            handleFlagRecipe={ handleFlagRecipe } currentTab={ currentTab } 
                                        />
                                    )
                                }
                            </div>
                            :
                            isFetchingRecipes ?
                            <div className="col-span-11 flex flex-col h-full rounded-3xl text-zinc-100">
                                <RecipeSuspense />
                                <RecipeSuspense />
                                <RecipeSuspense />
                            </div>
                            :
                            <div className="col-span-11 flex flex-col h-full p-9 rounded-3xl text-zinc-100">
                                <p className="pt-9 text-3xl text-center font-bold">
                                    Sorry, we couldn't find any recipes. <br/>Please try adjusting your search criteria.
                                </p>
                            </div>
                        }
                        <div className="col-span-2"></div>
                    </div>
                </div>
                {/* feedbacks modal */}
                {
                    isFeedbacksShown &&
                    <FeedbacksModal 
                        user={ user } recipeId={ prevRecipeId }
                        title={ prevTitle } feedbackCount={ prevfeedbackCount } 
                        setFeedbackCount={ setPrevFeedbackCount } setShowModal={ setIsFeedbacksShown } 
                        formatDate={ formatDate }
                    />
                }
                {/* confirm modal */}
                {
                    confirmationShown === "remove" &&
                    <ConfirmModal 
                        setShowModal={ setConfirmationShown } confirmAction={ removeRecipe }
                        title={ prevTitle } headerText={ "Confirm Removal" }
                        bodyText={ "Make sure to thoroughly check whether it goes against our content policy. By removing this, your user ID will be saved as the remover." }
                        icon={ RemoveIcon } isDanger={ true }
                    />
                }
                {
                    confirmationShown === "allow" &&
                    <ConfirmModal 
                        setShowModal={ setConfirmationShown } confirmAction={ allowRecipe }
                        title={ prevTitle } headerText={ "Confirm Clearance" } 
                        bodyText={ "Make sure to thoroughly check whether it is in adherance with our content policy." }
                        icon={ AllowIcon } isDanger={ false }
                    />
                }
                {
                    confirmationShown === "log out" &&
                    <ConfirmModal 
                        setShowModal={ setConfirmationShown } confirmAction={ handleLogOut }
                        headerText={ "Confirm Log Out" } bodyText={ "Are you sure you want to log out?" }
                        icon={ LogOutIcon } isDanger={ true }
                    />
                }
            </div>
        </div>
    )
}

export default Search