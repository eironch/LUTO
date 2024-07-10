import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import axios from 'axios'
import { debounce } from 'lodash'

import NavBar from '../components/NavBar'
import RecipeOverview from '../components/RecipeOverview'
import FeedbacksModal from '../components/FeedbacksModal'
import RecipeSuspense from '../components/RecipeSuspense'
import ConfirmModal from '../components/ConfirmModal'

import LogOutIcon from '../assets/log-out-icon.png'

function Saved(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const formatDate = p.formatDate
    const handleLogOut = p.handleLogOut

    const systemTags = p.systemTags
    const filters = p.filters
    const setFilters = p.setFilters
    const filtersRef = p.filtersRef
    const handleGiveRecipePoint = p.handleGiveRecipePoint

    const [savedRecipes, setSavedRecipes] = useState([])
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

    function fetchSavedRecipes(filters) {
        setIsFetching(true)

        axios.get('http://localhost:8080/saved-recipes', { params: { userId: user.userId, filters, fetchedRecipeIds  } })
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

                setSavedRecipes(savedRecipes.length > 0 ? [...savedRecipes, ...res.data.payload] : res.data.payload)
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
            setSavedRecipes([])
            setFetchedRecipeIds([])
            setIsFetchedAll(false)
            fetchSavedRecipes(filtersRef.current)
        }, 300), []
    )

    useLayoutEffect(() => {
        filtersRef.current = filters
    }, [filters])

    useLayoutEffect(() => {
        debouncedFetch()
    }, [filters, debouncedFetch])

    useLayoutEffect(() => {
        setCurrentTab('Saved')
    }, [])

    useEffect(() => {
        const scrollDiv = scrollDivRef.current
        
        if (!scrollDiv) return

        function handleScroll() {
            if (isFetching || isFetchedAll) return
            const { scrollTop, scrollHeight, clientHeight } = scrollDiv

            if (scrollTop + clientHeight >= scrollHeight - (scrollHeight * 0.05)) {
                fetchSavedRecipes(filters)
            }
        }
            
        scrollDiv.addEventListener('scroll', handleScroll)

        return () => {
            scrollDiv.removeEventListener('scroll', handleScroll)
        }
    })
    
    if (currentTab !== 'Saved') {
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
                        <div className="col-span-11 h-16 rounded-3xl bg-zinc-900">
                            <div className="grid grid-cols-2 w-full h-16 text-zinc-100 text-4xl font-bold rounded-3xl bg-zinc-900">
                                <div className="flex px-9 pb-1.5 h-full items-center">
                                    Saved Recipes
                                </div>
                                <div className="flex px-12 pb-1 h-full justify-end items-center ">
                                    {
                                        (savedRecipes && savedRecipes.length > 0) &&
                                        savedRecipes.length
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2"></div>     
                    </div>
                    {/* content */}
                    <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        <div className="col-span-2"></div>
                        <div className="col-span-11 block">
                            {
                                savedRecipes &&
                                savedRecipes.length > 0 &&
                                savedRecipes.map(recipe => 
                                    recipe &&
                                    <RecipeOverview
                                        key={ recipe.recipeId } user={ user }
                                        recipeId={ recipe.recipeId } recipeImage={ recipe.recipeImage } 
                                        title={ recipe.title } summary={ recipe.summary } 
                                        authorName={ recipe.userId.username } pointStatus={ recipe.pointStatus } 
                                        points={ recipe.points } feedbackCount={ recipe.feedbackCount } 
                                        dateCreated={ recipe.createdAt } recipes={ savedRecipes } 
                                        setRecipes={ setSavedRecipes } setPrevRecipeId={ setPrevRecipeId }
                                        setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                        prevRecipeId={ prevRecipeId } prevFeedbackCount={ prevFeedbackCount } 
                                        moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                        handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                        currentTab={ currentTab } 
                                    />
                                )
                            }
                            {
                                savedRecipes &&
                                (isFetching || !isFetchedAll && (savedRecipes.length > 10 || savedRecipes.length === 0)) &&
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
                {/* feedbacks modal */}
                {
                    isFeedbacksShown &&
                    <FeedbacksModal 
                        key={ prevRecipeId }  user={ user } recipeId={ prevRecipeId }
                        title={ prevTitle } feedbackCount={ prevFeedbackCount } 
                        setFeedbackCount={ setPrevFeedbackCount } setShowModal={ setIsFeedbacksShown } 
                        formatDate={ formatDate } setFeedRecipes={ setSavedRecipes } 
                    />
                }
                {/* confirm modal */}
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

export default Saved