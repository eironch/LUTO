import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

import SidebarRecipe from '../components/SidebarRecipe'
import NavbarRecipe from '../components/NavbarRecipe'

import LogoGradient from '../assets/luto-gradient-logo.svg'
import SaveIcon from '../assets/saved-icon.svg'

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
    const [recipeTabShown, setRecipeTabShown] = useState('Overview')
    const [recipeFound, setRecipeFound] = useState()
    
    const scrollDivRef = useRef(null) 

    function handleSaveRecipe() {
        setIsRecipeSaved(!isRecipeSaved)

        axios.post(`${ process.env.REACT_APP_API_URL || 'http://localhost:8080' }/save-recipe`, { userId: user.userId, recipeId })
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

    useEffect(() => {
        axios.get(`${ process.env.REACT_APP_API_URL || 'http://localhost:8080' }/get-recipe`, { params: { recipeId, userId: user.userId } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setRecipeFound(true)
                
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
                if (err.response.status === 400) {
                    setRecipeFound(false)
                }
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
        <div className="flex h-screen">
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
                            {
                                recipeFound !== false &&
                                <div className="col-span-2 pointer-events-auto">
                                    <button className={`${ isRecipeSaved ? "bg-zinc-900 hover:bg-zinc-500" : "bg-orange-500 disabled:cursor-not-allowed disabled:bg-zinc-800 hover:bg-orange-400"} flex items-center p-4 gap-4 w-full h-full rounded-3xl overflow-hidden`} 
                                        onClick={ () => handleSaveRecipe() } disabled={ !recipeFound }
                                    >
                                        {
                                            recipeFound &&
                                            <>
                                                <p className="flex text-zinc-100 text-lg w-full font-semibold">
                                                    { isRecipeSaved ? "Unsave" :"Save" }
                                                </p>
                                                <img className="w-8" src={ SaveIcon } alt="" />
                                            </>
                                        }
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                    {
                        recipeFound !== false ?
                        <SidebarRecipe
                            user={ user } recipeId={ recipeId }
                            summary={ summary } recipeImage={ recipeImage }
                            ingredients={ ingredients } tags={ tags }
                            authorName={ authorName } points={ points } 
                            setPoints={ setPoints } feedbackCount={ feedbackCount } 
                            setFeedbackCount={ setFeedbackCount } currentTab={ currentTab } 
                            pointStatus={ pointStatus } setPointStatus={ setPointStatus }
                            formatDate={ formatDate } handleGiveRecipePoint={ handleGiveRecipePoint }
                            profilePicture={ profilePicture } screenSize={ screenSize }
                        />     
                        :
                        <div className="absolute flex w-screen h-screen justify-center items-center text-zinc-100 text-4xl font-bold">Sorry, no sssuch recipe found.</div>
                    } 
                </div>
            }
            {
                recipeTabShown === "Overview" && screenSize < 4 &&
                recipeFound !== false &&
                <SidebarRecipe
                    user={ user } recipeId={ recipeId }
                    summary={ summary } recipeImage={ recipeImage }
                    ingredients={ ingredients } tags={ tags }
                    authorName={ authorName } points={ points } 
                    setPoints={ setPoints } feedbackCount={ feedbackCount } 
                    setFeedbackCount={ setFeedbackCount } currentTab={ currentTab } 
                    pointStatus={ pointStatus } setPointStatus={ setPointStatus }
                    formatDate={ formatDate } handleGiveRecipePoint={ handleGiveRecipePoint }
                    profilePicture={ profilePicture } scrollDivRef={ scrollDivRef }
                    screenSize={ screenSize } title={ title }
                />
            }
            {
                screenSize < 4 && recipeFound === false &&
                <div className="absolute flex w-screen h-screen justify-center items-center text-zinc-100 text-lg md:text-2xl font-bold pointer-events-none">
                    Sorry, no such recipe found.
                </div>
            }
            {
                (recipeTabShown === "Instructions" || screenSize > 3) &&
                <div className={`${ screenSize > 3 ? "scrollable-div" : "pr-3 hide-scrollbar" } flex flex-col gap-3 pl-3 py-[4.75rem] xl:py-0 w-screen h-dvh bg-zinc-950 overflow-y-scroll`} ref={ scrollDivRef }>
                    <div className="flex xl:grid w-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        {
                            screenSize > 3 &&
                            <div className="col-span-4"></div>
                        }
                        <div className="xl:col-span-11 flex flex-col w-full xl:mb-3 -mt-3 xl:mt-0 rounded-3xl text-zinc-100">
                            {
                                title &&
                                screenSize > 3 &&
                                <div className="flex flex-col items-center w-full mt-3 p-6 rounded-3xl bg-zinc-900">
                                    <p className="text-2xl md:3xl xl:text-4xl font-bold w-full text-center">
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
                                            <div className="py-6 px-3 flex flex-col gap-3 mt-3 rounded-3xl bg-zinc-900" key={ key }>
                                                <p className="px-3 text-3xl font-semibold w-full">
                                                    { element.text }
                                                </p>
                                            </div>
                                        )
                                    } else if (element.contentType === "Description Text") {
                                        return (
                                            <div className="py-6 px-3 flex flex-col gap-3 mt-3 rounded-3xl bg-zinc-900" key={ key }>
                                                <p className="px-3 text-xl w-full">
                                                    { element.text }
                                                </p>
                                            </div>
                                        )
                                    } else if (element.contentType === "Image Carousel") {
                                        return (
                                            <div className="pt-6 pb-3 px-6 flex flex-col justify-center items-center gap-3 mt-3 rounded-3xl overflow-hidden bg-zinc-900" key={ key }>
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
            {/* save button */}
            <div className="absolute z-[9999] inset-0 flex w-screen h-screen pb-[4.75rem] pr-3 justify-end items-end pointer-events-none">
                <button className={`${ isRecipeSaved ? "bg-zinc-600 hover:bg-zinc-500" : "bg-orange-500 disabled:cursor-not-allowed disabled:bg-zinc-800 hover:bg-orange-400"} flex bottom-0 right-0 items-center p-4 gap-4 w-14 h-14 rounded-3xl overflow-hidden pointer-events-auto`} 
                    onClick={ () => handleSaveRecipe() } disabled={ !recipeFound }
                >
                    <img className="w-8" src={ SaveIcon } alt="" />
                </button>
            </div>
            {/* nav bar */} 
            {
                screenSize < 4 && recipeFound !== false &&
                <NavbarRecipe recipeTabShown={ recipeTabShown } setRecipeTabShown={ setRecipeTabShown }/>
            }
        </div>
    )
}

export default Recipe