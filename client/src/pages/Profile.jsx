import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

import RecipeOverview from '../components/RecipeOverview'
import SidebarProfile from '../components/SidebarProfile'
import FeedbackModal from '../components/FeedbackModal'
import ConfirmModal from '../components/ConfirmModal'
import RecipeSuspense from '../components/RecipeSuspense'

import RemoveIcon from '../assets/remove-icon.svg'
import AllowIcon from '../assets/allow-icon.svg'
import CreateIcon from '../assets/create-icon.svg'
import LogoGradient from '../assets/luto-gradient-logo.svg'

function Profile({
    user, currentTab,
    setCurrentTab, handleGiveRecipePoint,
    formatDate, handleFlagRecipe,
    handleRemoveRecipe, handleAllowRecipe,
    screenSize
}) {
    
    const { authorName } = useParams()
    const [userRecipes, setUserRecipes] = useState([])
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
    const fetchedRecipeIdsRef = useRef(fetchedRecipeIds)

    function fetchUserRecipes(userRecipes) {
        setIsFetching(true)

        axios.get(`${ process.env.REACT_APP_API_URL || 'http://172.20.10.3:8080' }/user-recipes`, { params: { userId: user.userId, authorName, sort: user.accountType === "user" ? { createdAt: -1 } : { flagCount: 1 }, fetchedRecipeIds: fetchedRecipeIdsRef.current } })
            .then(res => {
                console.log('Status Code:', res.status)
                console.log('Data:', res.data)
        
                setIsFetching(false)

                if (res.status === 202) {
                    setIsFetchedAll(true)
                    setUserRecipes([])
                    
                    return
                }

                if (res.data.payload.length < 10) {
                    setIsFetchedAll(true)
                }

                if (userRecipes.length > 0) {
                    const combinedRecipes = [...userRecipes, ...res.data.payload];

                    combinedRecipes.forEach((recipeToMatch, indexToMatch) => {
                        combinedRecipes.forEach((recipe, index) => {
                            if (recipeToMatch.recipeId === recipe.recipeId && indexToMatch !== index) {
                                combinedRecipes.pop(index)
                            }
                        })
                    })

                    setUserRecipes(combinedRecipes)
                    setFetchedRecipeIds([...fetchedRecipeIds, ...res.data.payload.map(recipe => recipe.recipeId)])

                    return
                }

                setUserRecipes(res.data.payload)
                setFetchedRecipeIds([...fetchedRecipeIds, ...res.data.payload.map(recipe => recipe.recipeId)])
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)

                setIsFetching(false)
            })
    }
    
    function removeRecipe() {
        handleRemoveRecipe(user.userId, prevRecipeId)
        
        setConfirmationShown()

        setUserRecipes(userRecipes.filter(recipe => recipe.recipeId !== prevRecipeId))
    }

    function allowRecipe() {
        handleAllowRecipe(prevRecipeId)
        
        setConfirmationShown()
        
        setUserRecipes(userRecipes.filter(recipe => recipe.recipeId !== prevRecipeId))
    }

    useEffect(() => {
        const scrollDiv = scrollDivRef.current
        
        if (!scrollDiv) return

        function handleScroll() {
            if (isFetching || isFetchedAll) return
            const { scrollTop, scrollHeight, clientHeight } = scrollDiv

            if (scrollTop + clientHeight >= scrollHeight - (scrollHeight * 0.05)) {
                fetchUserRecipes(userRecipes)
            }
        }
            
        scrollDiv.addEventListener('scroll', handleScroll)

        return () => {
            scrollDiv.removeEventListener('scroll', handleScroll)
        }
    })

    useLayoutEffect(() => {
        fetchedRecipeIdsRef.current = fetchedRecipeIds
    }, [fetchedRecipeIds])

    useEffect(() => {
        fetchedRecipeIdsRef.current = []
        setUserRecipes([])
        fetchUserRecipes([])
        setIsFeedbacksShown(false)
    }, [authorName])

    useEffect(() => {
        setCurrentTab('Profile')
        setUserRecipes([])
        return () => {
            setIsFeedbacksShown(false)
        }
    }, [])

    if (currentTab !== 'Profile') {
        return
    }

    return (
       <div className={`${ screenSize > 2 ? "scrollable-div" : "pr-3 hide-scrollbar" } h-screen overflow-y-scroll`} ref={ scrollDivRef }>
            {/* navbar */}
            {
                screenSize <= 3 ?
                <SidebarProfile 
                    user={ user } authorName={ authorName }
                    screenSize={ screenSize }
                />
                :
                <div className="fixed flex gap-3 flex-col w-full h-dvh pointer-events-none">
                    <div className="p-3 pb-0">
                        <div className="grid gap-3 w-full min-h-16 pointer-events-none" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                            <Link to="/home" className="pointer-events-auto rounded-3xl flex col-span-2 items-center justify-center bg-zinc-900 hover:bg-zinc-500">
                                <img className="px-4 w-48" src={ LogoGradient }alt="" />
                            </Link>
                            <div className="col-span-2 pointer-events-auto">
                                <Link to="/create" className="flex items-center p-4 gap-4 w-full h-full rounded-3xl bg-orange-500 hover:bg-orange-400 overflow-hidden">
                                    <p className="flex text-zinc-100 text-lg w-full font-semibold">
                                        Create
                                    </p>
                                    <img className="w-8" src={ CreateIcon } alt="" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SidebarProfile 
                        user={ user } authorName={ authorName }
                    />
                </div>
            }
            <div className="flex flex-col p-3 pb-0 pt-0 pr-0 bg-zinc-950">
                {/* content */}
                <div className="flex xl:grid w-full h-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                    <div className="hidden xl:block xl:col-span-4"></div>
                    <div className={`${ screenSize <= 3 ? "mb-[5.75rem]" : "mb-3" } w-full xl:col-span-11 block`}>
                        { 
                            userRecipes &&
                            userRecipes.length > 0 &&
                            userRecipes.map((recipe, index) => 
                                recipe &&
                                <RecipeOverview 
                                    key={ index } user={ user } 
                                    recipeId={ recipe.recipeId } recipeImage={ recipe.recipeImage } 
                                    title={ recipe.title } summary={ recipe.summary } 
                                    authorName={ authorName } pointStatus={ recipe.pointStatus } 
                                    points={ recipe.points } recipes={ userRecipes } 
                                    setRecipes={ setUserRecipes } dateCreated={ recipe.createdAt }
                                    handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                    feedbackCount={ recipe.feedbackCount } setPrevRecipeId={ setPrevRecipeId }
                                    setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                    prevRecipeId={ prevRecipeId } prevFeedbackCount={ prevFeedbackCount } 
                                    moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                    handleFlagRecipe={ handleFlagRecipe } flagCount={ recipe.flagCount }
                                    setConfirmationShown={ setConfirmationShown } currentTab={ currentTab }
                                    screenSize={ screenSize }
                                />
                            )
                        }
                        {
                            userRecipes &&
                            (isFetching || (!isFetchedAll && (userRecipes.length > 10 || userRecipes.length === 0))) &&
                            <>
                                <RecipeSuspense screenSize={ screenSize } />
                                <RecipeSuspense screenSize={ screenSize } />
                                <RecipeSuspense screenSize={ screenSize } />
                            </>
                        }
                    </div>
                </div> 
                {/* feedbacks modal */}
                {
                    isFeedbacksShown &&
                    <FeedbackModal 
                        user={ user } recipeId={ prevRecipeId }
                        title={ prevTitle } feedbackCount={ prevFeedbackCount } 
                        setFeedbackCount={ setPrevFeedbackCount } setShowModal={ setIsFeedbacksShown } 
                        formatDate={ formatDate } setFeedRecipes={ setUserRecipes }
                        currentTab={ currentTab }
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
            </div>
       </div>
    )
}

export default Profile