import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { debounce } from 'lodash'

import SidebarTab from '../components/SidebarTab'
import RecipeOverview from '../components/RecipeOverview'
import FeedbackModal from '../components/FeedbackModal'
import RecipeSuspense from '../components/RecipeSuspense'
import ConfirmModal from '../components/ConfirmModal'

import LogOutIcon from '../assets/log-out-icon.svg'
import ProfileIcon from '../assets/profile-icon.svg'
import LogoGradient from '../assets/luto-gradient-logo.svg'

function Saved({
    user, currentTab,
    setCurrentTab, formatDate,
    handleLogOut, systemTags,
    filters, setFilters,
    filtersRef, handleGiveRecipePoint,
    screenSize
}) {
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

        axios.get(`${ process.env.APP_API_URL || 'http://localhost:8080' }/saved-recipes`, { params: { userId: user.userId, filters, fetchedRecipeIds  } })
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
        <div className="pr-3 xl:pr-0 hide-scrollbar xl:scrollable-div overflow-y-scroll " ref={ scrollDivRef }>
            {/* navbar */}
            {
                screenSize > 3 &&
                <div className="fixed flex gap-3 flex-col w-full h-dvh pointer-events-none">
                    <div className="p-3 pb-0">
                        <div className="grid gap-3 w-full min-h-16 pointer-events-none" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                            {/* logo navbar side*/}
                            <Link to="/home" className="pointer-events-auto rounded-3xl flex col-span-2 items-center justify-center bg-zinc-900 hover:bg-zinc-500">
                                <img className="px-4 w-48" src={ LogoGradient }alt="" />
                            </Link>
                            {/* logo navbar middle */}
                            <div className="rounded-3xl flex items-center justify-center" 
                                style={ { gridColumn: (currentTab === "Home" || currentTab === "Search" || currentTab === "Saved" || currentTab === "Popular") ? "span 11" : "span 13" } }
                            >
                                { 
                                    (currentTab === "Settings") &&
                                    <Link to="/home" className="fixed flex items-center pointer-events-auto left-1/2 transform -translate-x-1/2">
                                        <img className="px-4 w-48 " src={ LogoGradient }alt="" />
                                    </Link>
                                }
                            </div>
                            {/* profile */}
                            <Link to={`/${ user.username }`} className={`${ user.accountType === "user" ? "bg-zinc-900 hover:bg-zinc-500" : "bg-orange-500 hover:bg-orange-400" }  col-span-2 flex items-center justify-end rounded-3xl pointer-events-auto`}>
                                { 
                                    currentTab!=="Profile" && 
                                    <p className="text-zinc-100 text-end w-full ml-3 text-xl font-semibold overflow-hidden">
                                        { user.username }
                                    </p> 
                                }
                                <img className="m-3 w-10 h-10 aspect-1 rounded-full object-cover" src={ user.profilePicture || ProfileIcon } alt="" />
                            </Link>
                        </div>
                    </div>
                    <SidebarTab 
                        filters={ filters } setFilters={ setFilters }
                        currentTab={ currentTab } setConfirmationShown={ setConfirmationShown }
                        systemTags={ systemTags }
                    /> 
                </div>
            }
            <div className="flex flex-col pr-0 gap-3 h-dvh">
                <div className="flex flex-col gap-3 p-3 pr-0 pb-20 xl:pb-0">
                    {/* space for top navbar */}
                    <div className="flex xl:grid w-full gap-3 xl:h-16" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        {
                            screenSize > 3 &&
                            <div className="col-span-2"></div>
                        }
                        <div className="w-full col-span-11 xl:h-16 p-6 xl:p-3 rounded-3xl bg-zinc-900">
                            <div className="flex w-full gap-3 items-center text-zinc-100 text-3xl font-bold rounded-3xl">
                                <div className="flex pl-6 xl:pl-9 w-full h-full items-center">
                                    Saved Recipes
                                </div>
                                <div className="flex pr-9 xl:pr-12 h-full justify-end items-center">
                                    {
                                        (savedRecipes && savedRecipes.length > 0) &&
                                        savedRecipes.length
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            screenSize > 3 &&
                            <div className="col-span-2"></div>
                        }    
                    </div>
                    {/* content */}
                    <div className="flex xl:grid w-full h-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        {
                            screenSize > 3 &&
                            <div className="col-span-2"></div>
                        }
                        <div className="w-full col-span-11 block">
                            {
                                savedRecipes &&
                                savedRecipes.length > 0 &&
                                savedRecipes.map(recipe => 
                                    recipe &&
                                    <RecipeOverview
                                        key={ recipe.recipeId } user={ user }
                                        recipeId={ recipe.recipeId } recipeImage={ recipe.recipeImage } 
                                        title={ recipe.title } summary={ recipe.summary } 
                                        authorName={ recipe.userId.username } recipePointStatus={ recipe.pointStatus } 
                                        points={ recipe.points } feedbackCount={ recipe.feedbackCount } 
                                        createdAt={ recipe.createdAt } recipes={ savedRecipes } 
                                        setRecipes={ setSavedRecipes } setPrevRecipeId={ setPrevRecipeId }
                                        setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                        prevRecipeId={ prevRecipeId } prevFeedbackCount={ prevFeedbackCount } 
                                        moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                        handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                        currentTab={ currentTab } screenSize={ screenSize }
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
                        {
                            screenSize > 3 &&
                            <div className="col-span-2"></div>
                        }
                    </div>
                </div>
                {/* feedbacks modal */}
                {
                    isFeedbacksShown &&
                    <FeedbackModal 
                        key={ prevRecipeId }  user={ user } recipeId={ prevRecipeId }
                        title={ prevTitle } feedbackCount={ prevFeedbackCount } 
                        setFeedbackCount={ setPrevFeedbackCount } setShowModal={ setIsFeedbacksShown } 
                        formatDate={ formatDate } setFeedRecipes={ setSavedRecipes }
                        currentTab={ currentTab }
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