import React, { useState, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import Textarea from '../components/Textarea'
import RecipeElement from '../components/RecipeElement'
import ConfirmModal from '../components/ConfirmModal'
import SidebarCreate from '../components/SidebarCreate'
import NavbarRecipe from '../components/NavbarRecipe'

import LogoGradient from '../assets/luto-gradient-logo.svg'
import CreateIcon from '../assets/create-icon.svg'
import AddIcon from '../assets/add-icon.svg'
import TextIcon from '../assets/text-icon.svg'
import SectionIcon from '../assets/section-icon.svg'
import ImageIcon from '../assets/image-icon.svg'
import BackIcon from '../assets/back-icon.svg'
import LoadingIcon from '../assets/loading-icon.svg'
import AllowIcon from '../assets/allow-icon.svg'
import RemoveIcon from '../assets/remove-icon.svg'

function Create({
    user, currentTab,
    setCurrentTab, systemTags,
    screenSize, confirmation,
    setConfirmation
}) {
    const [publishState, setPublishState] = useState() 
    const [showModal, setShowModal] = useState(false)
    const [recipeImage, setRecipeImage] = useState(new Blob())
    const [summary, setSummary] = useState('')
    const [ingredients, setIngredients] = useState([{ key: uuidv4(), value: '', refIndex: 0 }])
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState([])
    const [recipeTabShown, setRecipeTabShown] = useState('Overview')
    
    const navigate = useNavigate()

    const keys = [uuidv4(), uuidv4()]

    const [elementTexts, setElementTexts] = useState([
        { key: keys[0], value: '' },
        { key: keys[1], value: '' }
    ])
    const [elementFiles, setElementFiles] = useState([
        { key: keys[0], value: [''] },
        { key: keys[1], value: [''] }
    ])
    const [recipeElements, setRecipeElements] = useState([
        { key: keys[0], value:{ contentType: 'Image Carousel' } },
        { key: keys[1], value:{ contentType: 'Description Text' } }
    ])
    
    function navigateToDestination() {
        setConfirmation({ show: '', destination: '' })
        navigate(confirmation.destination)
    }

    function addElement(contentType) {
        const keyIndex = uuidv4()

        setShowModal(false)
        setElementTexts([...elementTexts, { key: keyIndex, value: '' }])
        setElementFiles([...elementFiles, { key: keyIndex, value: [''] }])
        setRecipeElements([...recipeElements, { key: keyIndex, value:{ contentType } }])
    }

    function publishRecipe() {
        const formData = new FormData()

        formData.append('userId', user.userId)
        formData.append('recipeImage', recipeImage)
        formData.append('title', title)
        formData.append('summary', summary)
        
        if (ingredients) {
            formData.append('ingredients', JSON.stringify(
                ingredients.filter(
                    ingredient => ingredient.value !== ''
                ).map(ingredient => ingredient.value)
            ))
        }

        if (tags) {
            formData.append('tags', JSON.stringify(tags))
        }

        formData.append('recipeElements', JSON.stringify(
            recipeElements.map((element, objectIndex) => {
                const contentType = recipeElements.find(
                    elementContent => elementContent.key === element.key
                ).value.contentType
                
                const text = elementTexts.find(
                    elementContent => elementContent.key === element.key
                ).value
                
                const preFiles = elementFiles.find(
                    elementContent => elementContent.key === element.key
                ).value
                
                if (text === '' && preFiles[0] === '') {
                    return null
                }

                if (preFiles.length > 1 || preFiles[0] !== '') {
                    preFiles.forEach((file, arrayIndex) => {
                       if (file !== '') {
                        formData.append(`files-${ objectIndex }-${ arrayIndex }`, file)
                       }
                    })
                }
                
                return { contentType, text, filesLength: preFiles.length - 1, files: [] }
            }
        )))

        setPublishState('publishing')

        axios.post(`${ process.env.REACT_APP_API_URL || 'http://172.20.10.3:8080' }/publish-recipe`, formData, { 
                headers: { 'Content-Type': 'multipart/form-data' } 
            })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)

                setPublishState('published')
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)

                setPublishState('not published')
            })
    }

    useLayoutEffect(() => {
        setCurrentTab('Create')
    }, [])

    if (currentTab !== 'Create') {
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
                            <button className="col-span-2 items-center gap-4 bg-zinc-900 pointer-events-auto flex flex-row justify-center w-full h-full rounded-3xl overflow-hidden hover:bg-zinc-500" onClick={ () => { setConfirmation({ shown: "exit", destination: "/home" }) } }>
                                <img className="px-4 w-48 " src={ LogoGradient }alt="" />
                            </button>
                            <div className="col-span-2 pointer-events-auto">
                                <button className={`
                                        ${ (title && recipeImage.size && summary && ingredients.some(ingredient => ingredient.value !== "")) && "bg-orange-500 hover:bg-orange-400" } 
                                        rounded-3xl flex items-center p-4 gap-4 w-full h-full disabled:bg-zinc-800 disabled:cursor-not-allowed
                                    `} 
                                    onClick={ () => { publishRecipe() } } disabled={ !(title && recipeImage.size && summary && ingredients.some(ingredient => ingredient.value !== "")) }
                                >
                                    <p className="flex text-zinc-100 text-lg w-full font-semibold">
                                        Publish
                                    </p>
                                    <img className="w-8" src={ CreateIcon } alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <SidebarCreate
                        user={ user }    
                        setRecipeImage={ setRecipeImage || null }
                        summary={ summary || null } setSummary={ setSummary || null }
                        ingredients={ ingredients || null } setIngredients={ setIngredients || null }
                        tags={ tags || null } setTags={ setTags || null }
                        currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                        systemTags={ systemTags }
                    />   
                </div>
            }
            {
                recipeTabShown === "Overview" && screenSize < 3 &&
                <SidebarCreate
                    user={ user }    
                    setRecipeImage={ setRecipeImage || null }
                    summary={ summary || null } setSummary={ setSummary || null }
                    ingredients={ ingredients || null } setIngredients={ setIngredients || null }
                    tags={ tags || null } setTags={ setTags || null }
                    currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                    systemTags={ systemTags } title={ title }
                    setTitle={ setTitle } screenSize={ screenSize }
                />   
            }
            {
                (recipeTabShown === "Instructions" || screenSize > 3) &&
                <div className={`${ screenSize > 3 ? "scrollable-div" : "pr-3 hide-scrollbar" } pr-0 flex flex-col gap-3 p-3 py-[4.75rem] xl:py-0 w-full h-dvh overflow-y-scroll bg-zinc-950`}>
                    <div className="flex xl:grid w-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        {
                            screenSize > 3 &&
                            <div className="col-span-4"></div>
                        }
                        <div className="w-full col-span-11 flex flex-col rounded-3xl text-zinc-100">
                            
                            {
                                screenSize > 3 &&
                                <>
                                    <p className="text-2xl xl:text-3xl font-bold h-16 mb-3 p-6 flex items-center text-zinc-400">
                                        What are you cooking?
                                    </p>
                                    <div className="flex flex-col items-center w-full mb-3 py-6 px-3 rounded-3xl bg-zinc-900">
                                        <Textarea 
                                            attribute={`${ !title && "pt-2.5 border border-red-600 bg-zinc-600" } px-3 text-2xl md:3xl xl:text-4xl font-bold w-full text-center focus:bg-zinc-600 bg-transparent`} 
                                            maxLength={ 200 } value={ title } setValue={ setTitle } 
                                            placeholder="What is the title of your recipe?" 
                                        />
                                    </div>
                                </>
                            }
                            {
                                recipeElements &&
                                recipeElements.map(element => 
                                    <RecipeElement
                                        key={ element.key } keyIndex={ element.key } 
                                        contentType={ element.value.contentType } addElement={ addElement }
                                        elementTexts={ elementTexts } setElementTexts={ setElementTexts } 
                                        elementFiles={ elementFiles } setElementFiles={ setElementFiles }
                                        recipeElements={ recipeElements } setRecipeElements={ setRecipeElements }
                                        screenSize={ screenSize }
                                    />
                                )
                            }
                            <button className="flex items-center w-full p-6 rounded-3xl bg-orange-500 hover:bg-orange-400" onClick={ () => { setShowModal(true) } }>
                                <div className="flex w-full justify-center">
                                    <img className="w-10" src={ AddIcon } alt=""/>
                                </div>
                            </button>
                        </div>     
                    </div>
                </div>
            }
            {
                publishState &&
                <div className="absolute z-[9999] inset-0 grid place-items-center h-screen text-zinc-100 bg-zinc-950 bg-opacity-70"
                        onMouseDownCapture={e => { 
                            if (screenSize < 4) {
                                return
                            } 

                            if (publishState === 'published') {
                                navigate('/home')

                                return
                            }

                            const isOutsideModal = !e.target.closest('.model-inner')
                            
                            if (isOutsideModal && publishState !== 'publishing') {
                                setPublishState()
                            }
                        } 
                    }
                >
                    <div className="flex flex-col justify-center items-center w-full md:w-10/12 xl:w-5/12 px-3 overflow-hidden model-inner">
                        <div className="flex flex-col w-full pb-16 pt-8 items-center rounded-3xl bg-zinc-900 overflow-hidden">
                            {
                                publishState === "publishing" &&
                                <div className="flex flex-col w-full pt-8 items-center">
                                    <p className="w-full mb-12 text-center text-xl xl:text-2xl font-semibold">
                                        Publishing recipe...
                                    </p>
                                    <img className="animate-spin-continuous w-24" src={ LoadingIcon } alt="" />
                                </div>
                            }
                            {
                                publishState === "published" &&
                                <div className="flex flex-col w-full items-center">
                                    <div className="flex w-full px-6 mb-6 justify-end">
                                        <button className="p-3 rounded-3xl hover:bg-zinc-600" onClick={ () => navigate('/home') }>
                                            <img className="min-w-4 w-4" src={ RemoveIcon } alt=""/>
                                        </button>
                                    </div>
                                    <p className="w-full mb-12 text-center text-xl xl:text-2xl font-semibold">
                                        Your recipe is now published!
                                    </p>
                                    <img className="w-24" src={ AllowIcon } alt="" />
                                </div>
                            }
                            {
                                publishState === "not published" &&
                                <div className="flex flex-col w-full items-center">
                                    <div className="flex w-full px-6 mb-6 justify-end">
                                        <button className="p-3 rounded-3xl hover:bg-zinc-600" onClick={ () => setPublishState() }>
                                            <img className="min-w-4 w-4" src={ RemoveIcon } alt=""/>
                                        </button>
                                    </div>
                                    <p className="w-full mb-12 text-red-600 text-center text-xl xl:text-2xl font-semibold">
                                        Your recipe is not published.<br/>Please try publishing again.
                                    </p>
                                    <img className="w-24" src={ RemoveIcon } alt="" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
            {/* confirm modal */}
            {
                confirmation.shown === "exit" &&
                <div className="absolute z-[70] h-screen w-screen">
                    <ConfirmModal 
                        setShowModal={ setConfirmation } confirmAction={ navigateToDestination }
                        headerText={ "Confirm Exit" } bodyText={ "Are you sure you want to exit? You will lose all your progress for this recipe." }
                        icon={ BackIcon } isDanger={ true } screenSize={ screenSize }
                    />
                </div>
            }
            {/* add element modal */}
            { 
                showModal && 
                <ElementsModal 
                    setShowModal={ setShowModal } addElement={ addElement } 
                    screenSize={ screenSize }
                /> 
            }
            {/* navbar */}
            {
                screenSize < 4 &&
                <NavbarRecipe recipeTabShown={ recipeTabShown } setRecipeTabShown={ setRecipeTabShown }/>
            }
        </div>
    )
}

function ElementsModal({
    setShowModal, addElement,
    screenSize
}) {
    return (
        <div className="absolute z-30 flex xl:grid place-items-center w-screen h-screen px-3 py-16 xl:py-0 text-zinc-100 bg-zinc-950 bg-opacity-70 overflow-hidden" 
            onMouseDownCapture={ e => { 
                    if (screenSize < 4) {
                        return
                    } 
                    
                    const isOutsideModal = !e.target.closest('.model-inner')

                    if (isOutsideModal) {
                        setShowModal(false)
                    }
                } 
            }
        >
            <div className="flex flex-col gap-3 w-full xl:w-5/12 justify-center items-center overflow-hidden model-inner">
                <div className="flex flex-col w-full h-full rounded-3xl bg-zinc-900 overflow-hidden">
                    <div className="flex flex-row items-center p-6 gap-3 shadow-md shadow-zinc-950">
                        <img className="w-8 mr-3" src={ AddIcon } alt="" />
                        <p className="text-2xl font-semibold">
                            Add Element
                        </p>
                        <div className="flex flex-grow justify-end">
                            <button className="p-3 rounded-3xl hover:bg-zinc-600" onClick={ () => setShowModal(false) }>
                                <img className="min-w-4 w-4" src={ RemoveIcon } alt=""/>
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <ul className="flex flex-col gap-3 w-full h-full scrollable-div">
                            <li>
                                <button className="flex w-full p-3 gap-3 rounded-3xl bg-zinc-600 hover:bg-zinc-500" onClick={ () => { addElement("Description Text") }}>
                                    <img className="p-3 w-20 xl:w-24" src={ TextIcon } alt=""/>
                                    <div className="flex flex-col h-20 xl:h-24 xl:gap-3 justify-center overflow-hidden">
                                        <p className="w-full text-left text-base xl:text-xl font-semibold">Description Text</p>
                                        <p className="w-full text-left text-sm xl:text-lg">Space for elaborating on recipe steps or additional notes.</p>
                                    </div>
                                </button>
                            </li>
                            <li>
                                <button className="flex w-full p-3 gap-3 rounded-3xl bg-zinc-600 hover:bg-zinc-500" onClick={ () => { addElement("Section Header") }}>
                                <img className="p-3 w-20 xl:w-24" src={ SectionIcon } alt="" />
                                    <div className="flex flex-col h-20 xl:h-24 xl:gap-3 justify-center overflow-hidden">
                                        <p className="w-full text-left text-base xl:text-xl font-semibold">Section Header</p>
                                        <p className="w-full text-left text-sm xl:text-lg">Organizes content into clear sections, such as Ingredients or Instructions.</p>
                                    </div>
                                </button>
                            </li>
                            <li>
                                <button className="flex w-full p-3 gap-3 rounded-3xl bg-zinc-600 hover:bg-zinc-500" onClick={ () => { addElement("Image Carousel") }}>
                                <img className="p-3 w-20 xl:w-24" src={ ImageIcon } alt="" />
                                    <div className="flex flex-col h-20 xl:h-24 xl:gap-3 justify-center overflow-hidden">
                                        <p className="w-full text-left text-base xl:text-xl font-semibold">Image Carousel</p>
                                        <p className="w-full text-left text-sm xl:text-lg">Showcases multiple photos of the recipe or its preparation steps.</p>
                                    </div>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>       
    )
}

export default Create