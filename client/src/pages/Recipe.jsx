import React, { useState, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import NavBar from '../components/NavBar'

function Recipe(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const formatDate = p.formatDate

    const handleGiveRecipePoint = p.handleGiveRecipePoint

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
    const [pointStatus, setPointStatus] = useState(p.pointStatus)

    function handleSaveRecipe() {
        setIsRecipeSaved(!isRecipeSaved)

        axios.post('http://localhost:8080/save-recipe', { userId: user.userId, recipeId })
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
        axios.get('http://localhost:8080/get-recipe', { params: { recipeId, userId: user.userId } })
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
        <div>
            <NavBar 
                user={ user } recipeId={ recipeId } 
                recipeImage = { recipeImage } title={ title } 
                summary={ summary } ingredients={ ingredients } 
                tags={ tags } authorName = { authorName }
                points={ points } setPoints={ setPoints } 
                feedbackCount={ feedbackCount } setFeedbackCount={ setFeedbackCount }
                currentTab={ currentTab } setCurrentTab={ setCurrentTab }
                isRecipeSaved={ isRecipeSaved } formatDate={ formatDate } 
                pointStatus={ pointStatus } setPointStatus={ setPointStatus }
                handleSaveRecipe={ handleSaveRecipe } handleGiveRecipePoint={ handleGiveRecipePoint }
                profilePicture={ profilePicture }
            />
            <div className="pr-0 flex flex-col gap-3 p-3 pb-0 h-dvh overflow-y-scroll scrollable-div bg-zinc-950">
                <div className="grid w-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                    <div className="col-span-4"></div>
                    <div className="col-span-11 flex flex-col rounded-3xl text-zinc-100">
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
                                                        <div className="w-96 h-96 aspect-w-2 flex-none" key={ index }>
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
        </div>
    )
}

export default Recipe