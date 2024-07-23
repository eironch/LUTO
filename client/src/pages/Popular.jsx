import React, { useState, useLayoutEffect, useCallback } from 'react'
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

function Popular({
    user, currentTab,
    setCurrentTab, formatDate,
    handleLogOut, systemTags,
    filters, setFilters,
    filtersRef, handleGiveRecipePoint,
    screenSize
}) {
    const [popularRecipes, setPopularRecipes] = useState([])
    const [isFeedbacksShown, setIsFeedbacksShown] = useState(false)
    const [confirmationShown, setConfirmationShown] = useState()
    const [prevRecipeId, setPrevRecipeId] = useState()
    const [prevTitle, setPrevTitle] = useState()
    const [prevFeedbackCount, setPrevFeedbackCount] = useState()
    const [moreModalShown, setMoreModalShown] = useState()

    function fetchPopularRecipes(filters) {
        axios.get(`${ process.env.APP_API_URL || 'http://localhost:8080' }/popular-recipes`, { params: { userId: user.userId, filters } })
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
        <div className="pr-3 xl:pr-0 hide-scrollbar xl:scrollable-div overflow-y-scroll ">
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
                    <div className="flex xl:grid w-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        {
                            screenSize > 3 &&
                            <div className="col-span-2"></div>
                        }
                        <div className="w-full col-span-11 rounded-3xl bg-zinc-900">
                            <div className="flex p-6 w-full text-zinc-100 text-3xl xl:text-5xl font-bold rounded-3xl bg-zinc-900">
                                <p className="px-6 w-full h-full text-center md:text-start">
                                    Popular Recipes
                                </p>
                            </div>
                        </div>
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
                        <div className="w-full col-span-11 block">
                            {
                                popularRecipes &&
                                popularRecipes.length > 0 &&
                                popularRecipes.map((recipe, index) => 
                                    recipe &&
                                    <div className="flex flex-col md:flex-row rounded-3xl" key={ index }>
                                        <div className="w-full md:max-w-32 md:w-32 mb-0 md:mb-3 rounded-t-3xl rounded-b-none md:rounded-bl-3xl md:rounded-r-none bg-zinc-900 overflow-hidden">
                                            <p className={`${ index + 1 === 10 ? "md:-ml-8" : "md:ml-1.5" } w-full md:-mt-8 text-center md:text-start text-zinc-100`} style={ { fontSize: screenSize > 1 ? "13rem" : "5rem"} }>{ index + 1 }</p>
                                        </div>
                                        <div className={`${ index + 1 !== 10 ? "mb-0" : "xl:-mb-3"  } w-full`}>
                                            <RecipeOverview
                                                key={ recipe.recipeId } user={ user }
                                                recipeId={ recipe.recipeId } recipeImage={ recipe.recipeImage } 
                                                title={ recipe.title } summary={ recipe.summary } 
                                                authorName={ recipe.userId.username } recipePointStatus={ recipe.pointStatus } 
                                                points={ recipe.points } feedbackCount={ recipe.feedbackCount } 
                                                createdAt={ recipe.createdAt } recipes={ popularRecipes } 
                                                setRecipes={ setPopularRecipes } setPrevRecipeId={ setPrevRecipeId }
                                                setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                                prevRecipeId={ prevRecipeId } prevFeedbackCount={ prevFeedbackCount } 
                                                moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                                handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                                currentTab={ currentTab } screenSize={ screenSize }
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
                        formatDate={ formatDate } setFeedRecipes={ setPopularRecipes }
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

export default Popular