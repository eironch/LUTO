import React, { useState, useLayoutEffect, useCallback } from 'react'
import axios from 'axios'
import { debounce } from 'lodash'

import NavBar from '../components/NavBar'
import RecipeOverview from '../components/RecipeOverview'
import FeedbacksModal from '../components/FeedbacksModal'
import RecipeSuspense from '../components/RecipeSuspense'
import ConfirmModal from '../components/ConfirmModal'

import LogOutIcon from '../assets/log-out-icon.png'

function Popular(p) {
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

    const [popularRecipes, setPopularRecipes] = useState([])
    const [isFeedbacksShown, setIsFeedbacksShown] = useState(false)
    const [confirmationShown, setConfirmationShown] = useState()
    const [prevRecipeId, setPrevRecipeId] = useState()
    const [prevTitle, setPrevTitle] = useState()
    const [prevFeedbackCount, setPrevFeedbackCount] = useState()
    const [moreModalShown, setMoreModalShown] = useState()

    function fetchPopularRecipes(filters) {
        axios.get('http://localhost:8080/popular-recipes', { params: { userId: user.userId, filters } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setPopularRecipes(res.data.payload)
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)

                if (err.response.status === 400) {
                    return setPopularRecipes([])
                }
            })
    }

    const debouncedFetch = useCallback(
        debounce(() => {
            fetchPopularRecipes(filtersRef.current)
        }, 300), []
    )

    useLayoutEffect(() => {
        filtersRef.current = filters
    }, [filters])

    useLayoutEffect(() => {
        debouncedFetch()
    }, [filters, debouncedFetch])

    useLayoutEffect(() => {
        setCurrentTab('Popular')
    }, [])
    
    if (currentTab !== 'Popular') {
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
            <div className="flex flex-col pr-0 gap-3 h-svh">
                <div className="flex flex-col gap-3 p-3 pr-0">
                    {/* space for top navbar */}
                    <div className="grid w-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        <div className="col-span-2"></div>
                        <div className="col-span-11 rounded-3xl bg-zinc-900">
                            <div className="grid grid-cols-2 p-6 w-full text-zinc-100 text-5xl font-bold rounded-3xl bg-zinc-900">
                                <div className="flex px-6 pb-2.5 h-full items-center">
                                    Popular Recipes
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
                                popularRecipes &&
                                popularRecipes.length > 0 &&
                                popularRecipes.map((recipe, index) => 
                                    recipe &&
                                    <div className="flex rounded-3xl" key={ index }>
                                        <div className={`${ index + 1 !== 10 && "mb-3"  } max-w-32 w-32 rounded-l-3xl bg-zinc-900 overflow-hidden`}>
                                            <p className={`${ index + 1 === 10 ? "-ml-8" : "ml-1.5" } -mt-8 text-zinc-100`} style={ { fontSize: "13rem" } }>{ index + 1 }</p>
                                        </div>
                                        <div className={`${ index + 1 !== 10 ? "mb-0" : "-mb-3"  } w-full`}>
                                            <RecipeOverview
                                                key={ recipe.recipeId } user={ user }
                                                recipeId={ recipe.recipeId } recipeImage={ recipe.recipeImage } 
                                                title={ recipe.title } summary={ recipe.summary } 
                                                authorName={ recipe.userId.username } pointStatus={ recipe.pointStatus } 
                                                points={ recipe.points } feedbackCount={ recipe.feedbackCount } 
                                                dateCreated={ recipe.createdAt } recipes={ popularRecipes } 
                                                setRecipes={ setPopularRecipes } setPrevRecipeId={ setPrevRecipeId }
                                                setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                                prevRecipeId={ prevRecipeId } prevFeedbackCount={ prevFeedbackCount } 
                                                moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                                handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                                currentTab={ currentTab } 
                                            />
                                        </div>
                                    </div>
                                )
                            }
                            {
                                popularRecipes &&
                                (popularRecipes.length > 10 || popularRecipes.length === 0) &&
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
                        formatDate={ formatDate } setFeedRecipes={ setPopularRecipes } 
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

export default Popular