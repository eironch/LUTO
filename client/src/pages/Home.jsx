import React, { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { debounce } from 'lodash'

import SidebarTab from '../components/SidebarTab'
import RecipeOverview from '../components/RecipeOverview'
import NavbarTop from '../components/NavbarTop'
import FeedbackModal from '../components/FeedbackModal'
import ConfirmModal from '../components/ConfirmModal'
import RecipeSuspense from '../components/RecipeSuspense'
import FilterModal from '../components/FilterModal'

import RemoveIcon from '../assets/remove-icon.svg'
import AllowIcon from '../assets/allow-icon.svg'
import LogOutIcon from '../assets/log-out-icon.svg'
import ProfileIcon from '../assets/profile-icon.svg'
import LogoGradient from '../assets/luto-gradient-logo.svg'

function Home({
    user, currentTab,
    setCurrentTab, formatDate,
    handleLogOut, systemTags,
    filters, setFilters,
    filtersRef, searchQuery,
    setSearchQuery, handleGiveRecipePoint,
    handleFlagRecipe, handleRemoveRecipe,
    handleAllowRecipe, screenSize
}) {
    const [feedRecipes, setFeedRecipes] = useState([])
    const [isNavbarTopShown, setIsNavbarTopShown] = useState(true)
    const [isFeedbacksShown, setIsFeedbacksShown] = useState(false)
    const [confirmationShown, setConfirmationShown] = useState()
    const [prevRecipeId, setPrevRecipeId] = useState()
    const [prevTitle, setPrevTitle] = useState()
    const [prevFeedbackCount, setPrevFeedbackCount] = useState()
    const [moreModalShown, setMoreModalShown] = useState()
    const [fetchedRecipeIds, setFetchedRecipeIds] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [isFetchedAll, setIsFetchedAll] = useState(false)
    const [isFilterShown, setIsFilterShown] = useState(false)

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
        
        axios.get(`${ process.env.REACT_APP_API_URL || 'http://172.20.10.3:8080' }/feed-recipes`, { params: { userId: user.userId, filters, sort: user.accountType === "user" ? { createdAt: -1 } : { flagCount: 1 }, fetchedRecipeIds }})
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
        }, 1000), []
    )

    useEffect(() => {
        filtersRef.current = filters
    }, [filters])

    useEffect(() => {
        debouncedFetch()
    }, [filters, debouncedFetch])

    useEffect(() => {
        if (isFeedbacksShown && !isNavbarTopShown) {
            setIsNavbarTopShown(true)
        }
    }, [isNavbarTopShown, isFeedbacksShown])

    useEffect(() => {
        setCurrentTab('Home')

        return () => {
            setIsFeedbacksShown(false)
        }
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
        <div className={`${ screenSize > 2 ? "scrollable-div" : "pr-3 hide-scrollbar" } w-screen h-screen overflow-y-scroll`} ref={ scrollDivRef }>
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
            <div className="flex flex-col h-screen pr-0">
                <div className="flex flex-col gap-0 xl:gap-3 p-3 pt-0 pr-0 pb-20 xl:pb-0">
                    {/* space for top navbar */}
                    <div className="flex xl:grid w-full gap-3 min-h-20 pt-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        {
                            screenSize > 3 &&
                            <div className="col-span-2"></div>
                        }
                        <div className="col-span-11 w-full rounded-3xl bg-transparent xl:bg-zinc-900"></div>
                        {
                            screenSize > 3 &&
                            <div className="col-span-2"></div>
                        }  
                    </div>
                    {/* content */}
                    <div className="flex xl:grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        {
                            screenSize > 3 &&
                            <div className="col-span-2"></div>
                        }
                        <div className="col-span-11 w-full mb-3 xl:-mt-3">
                            { 
                                feedRecipes &&
                                feedRecipes.length > 0 &&
                                feedRecipes.map(recipe => 
                                    recipe &&
                                    <RecipeOverview
                                        key={ recipe.recipeId } user={ user }
                                        recipeId={ recipe.recipeId } recipeImage={ recipe.recipeImage } 
                                        title={ recipe.title } summary={ recipe.summary } 
                                        authorName={ recipe.userId.username } recipePointStatus={ recipe.pointStatus } 
                                        points={ recipe.points } feedbackCount={ recipe.feedbackCount } 
                                        createdAt={ recipe.createdAt } recipes={ feedRecipes } 
                                        setRecipes={ setFeedRecipes } setPrevRecipeId={ setPrevRecipeId }
                                        setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                        prevRecipeId={ prevRecipeId } prevFeedbackCount={ prevFeedbackCount } 
                                        moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                        handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                        handleFlagRecipe={ handleFlagRecipe } flagCount={ recipe.flagCount }
                                        setConfirmationShown={ setConfirmationShown } currentTab={ currentTab }
                                        screenSize={ screenSize }
                                    />
                                )
                            }
                            {
                                (isFetching || !isFetchedAll && (feedRecipes.length > 10 || feedRecipes.length === 0)) &&
                                <>
                                    <RecipeSuspense screenSize={ screenSize } />
                                    <RecipeSuspense screenSize={ screenSize } />
                                    <RecipeSuspense screenSize={ screenSize } />
                                </>
                            }
                        </div>
                        {
                            screenSize > 3 &&
                            <div className="col-span-2"></div>
                        }
                    </div>
                </div>
                {/* search */} 
                <NavbarTop 
                    searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } 
                    scrollDivRef={ scrollDivRef } screenSize={ screenSize }
                    isFilterShown={ isFilterShown } setIsFilterShown={ setIsFilterShown }
                    isNavbarTopShown={ isNavbarTopShown } setIsNavbarTopShown={ setIsNavbarTopShown }
                />
            </div>
            <div className="absolute inset-0 z-30 h-screen pointer-events-none">
                {/* filter modal */}
                {
                    isFilterShown &&
                    screenSize < 4 &&
                    <FilterModal 
                        filters={ filters } setFilters={ setFilters }
                        systemTags={ systemTags } setIsFilterShown={ setIsFilterShown }
                    />
                }
                {/* feedbacks modal */}
                {
                    isFeedbacksShown &&
                    <FeedbackModal 
                        key={ prevRecipeId }  user={ user } recipeId={ prevRecipeId }
                        title={ prevTitle } feedbackCount={ prevFeedbackCount } 
                        setFeedbackCount={ setPrevFeedbackCount } setShowModal={ setIsFeedbacksShown } 
                        formatDate={ formatDate } setFeedRecipes={ setFeedRecipes }
                        currentTab={ currentTab } screenSize={ screenSize }
                    />
                }
                {/* confirm modal */}
                {
                    confirmationShown === "remove" &&
                    <ConfirmModal 
                        setShowModal={ setConfirmationShown } confirmAction={ removeRecipe }
                        title={ prevTitle } headerText={ "Confirm Removal" }
                        bodyText={ "Make sure to thoroughly check whether it goes against our content policy. By removing this, your user ID will be saved as the remover." }
                        icon={ RemoveIcon } isDanger={ true } screenSize={ screenSize }
                    />
                }
                {
                    confirmationShown === "allow" &&
                    <ConfirmModal 
                        setShowModal={ setConfirmationShown } confirmAction={ allowRecipe }
                        title={ prevTitle } headerText={ "Confirm Clearance" } 
                        bodyText={ "Make sure to thoroughly check whether it is in adherance with our content policy." }
                        icon={ AllowIcon } isDanger={ false } screenSize={ screenSize }
                    />
                }
                {
                    confirmationShown === "log out" &&
                    <ConfirmModal 
                        setShowModal={ setConfirmationShown } confirmAction={ handleLogOut }
                        headerText={ "Confirm Log Out" } bodyText={ "Are you sure you want to log out?" }
                        icon={ LogOutIcon } isDanger={ true } screenSize={ screenSize }
                    />
                }
            </div>
        </div>
    )
}

export default Home