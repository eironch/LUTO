import React, { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react'
import axios from 'axios'
import { debounce } from 'lodash'

import NavBar from '../components/NavBar'
import RecipeOverview from '../components/RecipeOverview'
import SearchBar from '../components/SearchBar'
import FeedbacksModal from '../components/FeedbacksModal'
import ConfirmModal from '../components/ConfirmModal'
import RecipeSuspense from '../components/RecipeSuspense'

import RemoveIcon from '../assets/remove-icon.png'
import AllowIcon from '../assets/allow-icon.png'
import LogOutIcon from '../assets/log-out-icon.png'

function Home(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const formatDate = p.formatDate
    const handleLogOut = p.handleLogOut

    const systemTags = p.systemTags
    const filters = p.filters
    const setFilters = p.setFilters
    const filtersRef = p.filtersRef
    const searchQuery = p.searchQuery
    const setSearchQuery = p.setSearchQuery
    const handleGiveRecipePoint = p.handleGiveRecipePoint
    const handleFlagRecipe = p.handleFlagRecipe
    const handleRemoveRecipe = p.handleRemoveRecipe
    const handleAllowRecipe = p.handleAllowRecipe

    const [feedRecipes, setFeedRecipes] = useState([])
    const [isFeedbacksShown, setIsFeedbacksShown] = useState(false)
    const [confirmationShown, setConfirmationShown] = useState()
    const [prevRecipeId, setPrevRecipeId] = useState()
    const [prevTitle, setPrevTitle] = useState()
    const [prevFeedbackCount, setPrevFeedbackCount] = useState()
    const [moreModalShown, setMoreModalShown] = useState()
    const [fetchedRecipeIds, setFetchedRecipeIds] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [isFetchedAll, setIsFetchedAll] = useState(false)
    const scrollDivRef = useRef(null)

    function removeRecipe() {
        handleRemoveRecipe(user.userId, prevRecipeId)
        
        setConfirmationShown()

        setFeedRecipes(feedRecipes.filter(recipe => recipe.recipeId !== prevRecipeId))
    }

    function allowRecipe() {
        handleAllowRecipe(prevRecipeId)
        
        setConfirmationShown()
        
        setFeedRecipes(feedRecipes.filter(recipe => recipe.recipeId !== prevRecipeId))
    }

    function fetchFeedRecipes(filters) {
        setIsFetching(true)
        
        axios.get('http://localhost:8080/feed-recipes', { params: { userId: user.userId, filters, sort: user.accountType === "user" ? { createdAt: -1 } : { flagCount: 1 }, fetchedRecipeIds }})
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setIsFetching(false)

                if (res.status === 202) {
                    setIsFetchedAll(true)

                    return
                }

                if (res.data.payload.length < 10) {
                    setIsFetchedAll(true)
                }

                setFeedRecipes(feedRecipes.length > 0 ? [...feedRecipes, ...res.data.payload] : res.data.payload)
                setFetchedRecipeIds([...fetchedRecipeIds, ...res.data.payload.map(recipe => recipe.recipeId)])
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)

                setIsFetching(false)
            })
    }

    const debouncedFetch = useCallback(
        debounce(() => {
            setFeedRecipes([])
            setFetchedRecipeIds([])
            setIsFetchedAll(false)
            fetchFeedRecipes(filtersRef.current)
        }, 300), []
    )

    useLayoutEffect(() => {
        filtersRef.current = filters
    }, [filters])

    useLayoutEffect(() => {
        debouncedFetch()
    }, [filters, debouncedFetch])

    useLayoutEffect(() => {
        setCurrentTab('Home')
    }, [])

    useEffect(() => {
        const scrollDiv = scrollDivRef.current
        
        if (!scrollDiv) return

        function handleScroll() {
            if (isFetching || isFetchedAll) return
            const { scrollTop, scrollHeight, clientHeight } = scrollDiv

            if (scrollTop + clientHeight >= scrollHeight - (scrollHeight * 0.05)) {
                fetchFeedRecipes(filters)
            }
        }
            
        scrollDiv.addEventListener('scroll', handleScroll)

        return () => {
            scrollDiv.removeEventListener('scroll', handleScroll)
        }
    })
    
    if (currentTab !== 'Home') {
        return
    }

    return (
        <div className="overflow-y-scroll scrollable-div" ref={ scrollDivRef }>
            <NavBar 
                user={ user } filters={ filters } 
                setFilters={ setFilters } currentTab={ currentTab } 
                setCurrentTab={ setCurrentTab } setConfirmationShown={ setConfirmationShown }
                systemTags={ systemTags }
            />
            <div className="flex flex-col pr-0 gap-3 h-svh">
                <div className="flex flex-col gap-3 p-3 pr-0">
                    {/* space for top navbar */}
                    <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        <div className="col-span-2"></div>
                        <div className="col-span-11 h-16 rounded-3xl bg-zinc-900"></div>
                        <div className="col-span-2"></div>     
                    </div>
                    {/* content */}
                    <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        <div className="col-span-2"></div>
                        <div className="col-span-11 block -mb-3">
                            { 
                                feedRecipes &&
                                feedRecipes.length > 0 &&
                                feedRecipes.map(recipe => 
                                    recipe &&
                                    <RecipeOverview
                                        key={ recipe.recipeId } user={ user }
                                        recipeId={ recipe.recipeId } recipeImage={ recipe.recipeImage } 
                                        title={ recipe.title } summary={ recipe.summary } 
                                        authorName={ recipe.userId.username } pointStatus={ recipe.pointStatus } 
                                        points={ recipe.points } feedbackCount={ recipe.feedbackCount } 
                                        dateCreated={ recipe.createdAt } recipes={ feedRecipes } 
                                        setRecipes={ setFeedRecipes } setPrevRecipeId={ setPrevRecipeId }
                                        setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                        prevRecipeId={ prevRecipeId } prevFeedbackCount={ prevFeedbackCount } 
                                        moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                        handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                        handleFlagRecipe={ handleFlagRecipe } flagCount={ recipe.flagCount }
                                        setConfirmationShown={ setConfirmationShown } currentTab={ currentTab }
                                    />
                                )
                            }
                            {
                                (isFetching || !isFetchedAll && (feedRecipes.length > 10 || feedRecipes.length === 0)) &&
                                <>
                                    <RecipeSuspense />
                                    <RecipeSuspense />
                                    <RecipeSuspense />
                                </>
                            }
                        </div>
                        <div className="col-span-2"></div>
                    </div>
                </div>
                {/* search */} 
                <SearchBar searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } />
                {/* feedbacks modal */}
                {
                    isFeedbacksShown &&
                    <FeedbacksModal 
                        key={ prevRecipeId }  user={ user } recipeId={ prevRecipeId }
                        title={ prevTitle } feedbackCount={ prevFeedbackCount } 
                        setFeedbackCount={ setPrevFeedbackCount } setShowModal={ setIsFeedbacksShown } 
                        formatDate={ formatDate } setFeedRecipes={ setFeedRecipes } 
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

export default Home