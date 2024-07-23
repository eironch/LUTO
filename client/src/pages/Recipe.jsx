import React, { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

import SidebarRecipe from '../components/SidebarRecipe'

import LogoGradient from '../assets/luto-gradient-logo.svg'
import SaveIcon from '../assets/saved-icon.svg'
import SummaryIcon from '../assets/summary-icon.svg'
import TextIcon from '../assets/text-icon.svg'

function Recipe({
    user, currentTab,
    setCurrentTab, formatDate,
    handleGiveRecipePoint, screenSize
}) {
    const { recipeId } = useParams()
    const [authorName, setAuthorName] = useState()
    const [profilePicture, setProfilePicture] = useState()
    const [recipeImage, setRecipeImage] = useState()
    const [title, setTitle] = useState()
    const [summary, setSummary] = useState()
    const [ingredients, setIngredients] = useState()
    const [tags, setTags] = useState()
    const [recipeElements, setRecipeElements] = useState()
    const [points, setPoints] = useState()
    const [feedbackCount, setFeedbackCount] = useState()
    const [isRecipeSaved, setIsRecipeSaved] = useState()
    const [pointStatus, setPointStatus] = useState()
    const [isNavbarRecipeShown, setIsNavbarRecipeShown] = useState(true)
    const [recipeTabShown, setRecipeTabShown] = useState('Overview')
    
    const scrollDivRef = useRef(null) 

    function handleSaveRecipe() {
        setIsRecipeSaved(!isRecipeSaved)

        axios.post(`${ process.env.APP_API_URL || 'http://localhost:8080' }/save-recipe`, { userId: user.userId, recipeId })
            .then(res => {
                console.log('Status Code:', res.status)
                console.log('Data:', res.data)
                
                setIsRecipeSaved(res.data.payload.isSaved)
            })
            .catch(err => {
                setIsRecipeSaved(!isRecipeSaved)
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    useLayoutEffect(() => {
        axios.get(`${ process.env.APP_API_URL || 'http://localhost:8080' }/get-recipe`, { params: { recipeId, userId: user.userId } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setAuthorName(res.data.payload.userInfo.username)
                setProfilePicture(res.data.payload.userInfo.profilePicture)
                setRecipeImage(res.data.payload.recipeContents.recipeImage)
                setTitle(res.data.payload.recipeContents.title)
                setSummary(res.data.payload.recipeContents.summary)
                setIngredients(res.data.payload.recipeContents.ingredients)
                setTags(res.data.payload.recipeContents.tags)
                setRecipeElements(res.data.payload.recipeContents.recipeElements)
                setPoints(res.data.payload.recipeContents.points)
                setPointStatus(res.data.payload.recipeStatus.pointStatus)
                setFeedbackCount(res.data.payload.recipeContents.feedbackCount)
                setIsRecipeSaved(res.data.payload.recipeStatus.isSaved)
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }, [recipeId])

    useLayoutEffect(() => {
        setCurrentTab('Recipe')
    }, [])

    if (currentTab !== 'Recipe') {
        return
    }

    return (
        <div className="flex h-dvh">
            {
                screenSize > 3 &&
                <div className="fixed flex gap-3 flex-col w-full h-dvh pointer-events-none">
                    {/* navbar */}
                    <div className="p-3 pb-0">
                        <div className="grid gap-3 w-full min-h-16 pointer-events-none" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                            {/* publish/create navbar `*/}
                            <Link to="/home" className="col-span-2 items-center gap-4 bg-zinc-900 pointer-events-auto flex flex-row justify-center w-full h-full rounded-3xl overflow-hidden hover:bg-zinc-500">
                                <img className="px-4 w-48 " src={ LogoGradient }alt="" />
                            </Link>
                            <div className="col-span-2 pointer-events-auto">
                                <button className={`${ isRecipeSaved ? "bg-zinc-900 hover:bg-zinc-500" : "bg-orange-500 disabled:cursor-not-allowed disabled:bg-zinc-900 hover:bg-orange-400"} flex items-center p-4 gap-4 w-full h-full rounded-3xl overflow-hidden`} 
                                    onClick={ () => handleSaveRecipe() } disabled={ !title }
                                >
                                    <p className="flex text-zinc-100 text-lg w-full font-semibold">
                                        { isRecipeSaved ? "Unsave" :"Save" }
                                    </p>
                                    <img className="w-8" src={ SaveIcon } alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
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
                </div>
            }
            {
                recipeTabShown === "Overview" &&
                <SidebarRecipe
                    user={ user } recipeId={ recipeId || null }
                    summary={ summary || null } recipeImage={ recipeImage || null }
                    ingredients={ ingredients || null } tags={ tags || null }
                    authorName={ authorName || null } points={ points } 
                    setPoints={ setPoints } feedbackCount={ feedbackCount } 
                    setFeedbackCount={ setFeedbackCount } currentTab={ currentTab } 
                    pointStatus={ pointStatus || null } setPointStatus={ setPointStatus || null }
                    formatDate={ formatDate || null } handleGiveRecipePoint={ handleGiveRecipePoint }
                    profilePicture={ profilePicture } scrollDivRef={ scrollDivRef }
                />   
            }
            {
                recipeTabShown === "Instructions" &&
                <div className="flex flex-col gap-3 pl-3 pr-3 xl:pr-0 pb-20 xl:pb-0 pt-20 xl:pt-0 h-dvh bg-zinc-950 overflow-y-scroll hide-scrollbar xl:scrollable-div" ref={ scrollDivRef }>
                    <div className="flex xl:grid pt-3 w-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        {
                            screenSize > 3 &&
                            <div className="col-span-4"></div>
                        }
                        <div className="col-span-11 flex flex-col w-full rounded-3xl text-zinc-100">
                            {
                                title &&
                                <div className="flex flex-col items-center w-full mb-3 p-6 rounded-3xl bg-zinc-900">
                                    <p className="text-4xl font-bold w-full text-center">
                                        { title }
                                    </p>
                                </div>
                            }
                            {
                                recipeElements &&
                                recipeElements.length > 0 &&
                                recipeElements.map((element, key) => {
                                    if (element.contentType === "Section Header") {
                                        return (
                                            <div className="py-6 px-3 flex flex-col gap-3 mb-3 rounded-3xl bg-zinc-900" key={ key }>
                                                <p className="px-3 text-3xl font-semibold w-full text-justify">
                                                    { element.text }
                                                </p>
                                            </div>
                                        )
                                    } else if (element.contentType === "Description Text") {
                                        return (
                                            <div className="py-6 px-3 flex flex-col gap-3 mb-3 rounded-3xl bg-zinc-900" key={ key }>
                                                <p className="px-3 text-xl w-full text-justify">
                                                    { element.text }
                                                </p>
                                            </div>
                                        )
                                    } else if (element.contentType === "Image Carousel") {
                                        return (
                                            <div className="pt-6 pb-3 px-6 flex flex-col justify-center items-center gap-3 mb-3 rounded-3xl overflow-hidden bg-zinc-900" key={ key }>
                                                <div className={`${ element.files.length > 2 ? "lg:justify-start" : "lg:justify-center" } flex flex-row w-full h-full gap-3 items-center overflow-x-scroll scrollable-div md:justify-start`}>
                                                    {
                                                        element.files.map((file, index) => (
                                                            <div className="w-48 md:w-96 h-48 md:h-96 aspect-w-2 flex-none" key={ index }>
                                                                <div className="bg-zinc-600 rounded-3xl">
                                                                    <img className="absolute inset-0 w-full h-full rounded-3xl object-cover" src={ file } alt="" />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }

                                    return null
                                })
                            }
                        </div>
                    </div>
                </div>
            }
            {/* NavBar */} 
            <NavbarRecipe
                user={ user } recipeId={ recipeId || null }
                summary={ summary || null } recipeImage={ recipeImage || null }
                ingredients={ ingredients || null } tags={ tags || null }
                authorName={ authorName || null } points={ points } 
                setPoints={ setPoints } feedbackCount={ feedbackCount } 
                setFeedbackCount={ setFeedbackCount } currentTab={ currentTab } 
                pointStatus={ pointStatus || null } setPointStatus={ setPointStatus || null }
                formatDate={ formatDate || null } handleGiveRecipePoint={ handleGiveRecipePoint }
                profilePicture={ profilePicture } scrollDivRef={ scrollDivRef }
                isNavbarRecipeShown={ isNavbarRecipeShown } setIsNavbarRecipeShown={ setIsNavbarRecipeShown }
                recipeTabShown={ recipeTabShown } setRecipeTabShown={ setRecipeTabShown }
            />
        </div>
    )
}

function NavbarRecipe({
    scrollDivRef, isNavbarRecipeShown,
    setIsNavbarRecipeShown, recipeTabShown, 
    setRecipeTabShown
}) {
    const [lastScrollY, setLastScrollY] = useState(0)

    function handleScroll() {
        const currentScrollY = scrollDivRef.current.scrollTop
        const scrollDifference = currentScrollY - lastScrollY
        
        if (currentScrollY < 80) {
            setIsNavbarRecipeShown(true)
        }

        if (scrollDifference > 10 && currentScrollY > 100) {
            setIsNavbarRecipeShown(false)
        } else if (scrollDifference < -10) {
            setIsNavbarRecipeShown(true)
        }

        setLastScrollY(currentScrollY)
    }

    useEffect(() => {
        if (!scrollDivRef.current) {
            return
        }
        scrollDivRef.current.addEventListener('scroll', handleScroll)
        
        return () => {
            if (!scrollDivRef.current) {
                return
            }

            scrollDivRef.current.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY, scrollDivRef, recipeTabShown])

    return (
        <div className={`${ isNavbarRecipeShown ? "translate-y-0" : "-translate-y-full" } absolute z-40 flex xl:grid gap-3 w-full h-20 xl:h-fit overflow-hidden pointer-events-none transform transition-transform duration-300 ease-in-out`} style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="grid grid-cols-2 col-span-11 w-full px-3 py-0 pointer-events-auto bg-zinc-900 border-b border-zinc-800">
                <div className="flex justify-center items-center">
                    <button className="flex flex-col gap-1 justify-center items-center" onClick={ () => setRecipeTabShown("Overview") }>
                        <p className="text-base text-zinc-100 font-semibold">Overview</p>
                    </button>
                </div>
                <div className="flex justify-center items-center">
                    <button className="flex flex-col gap-1 justify-center items-center" onClick={ () => setRecipeTabShown("Instructions") }>
                        <p className="text-base text-zinc-100 font-semibold">Instructions</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Recipe