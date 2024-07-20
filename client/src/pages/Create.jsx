import React, { useState, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import Textarea from '../components/Textarea'
import NavBar from '../components/NavBar'
import RecipeElement from '../components/RecipeElement'
import ConfirmModal from '../components/ConfirmModal'

import AddIcon from '../assets/add-icon.svg'
import TextIcon from '../assets/text-icon.svg'
import SectionIcon from '../assets/section-icon.svg'
import ImageIcon from '../assets/image-icon.svg'
import BackIcon from '../assets/back-icon.svg'
import LoadingIcon from '../assets/loading-icon.svg'
import AllowIcon from '../assets/allow-icon.svg'
import RemoveIcon from '../assets/remove-icon.svg'

function ElementsModal(p) {
    const setShowModal = p.setShowModal
    const addElement = p.addElement

    return (
        <div className="absolute inset-0 grid place-items-center h-screen pt-3 text-zinc-100 bg-zinc-950 bg-opacity-80 overflow-y-scroll scrollable-div" 
            onMouseDownCapture={ e => { 
                    const isOutsideModal = !e.target.closest('.model-inner')

                    if (isOutsideModal) {
                        setShowModal(false)
                    }
                } 
            }
        >
            <div className="flex flex-col gap-3 justify-center items-center w-5/12 overflow-hidden model-inner">
                <div className="flex flex-col w-full rounded-3xl bg-zinc-900 overflow-hidden">
                    <div className="flex flex-row items-center p-6 gap-6 shadow-md shadow-zinc-950">
                        <img className="w-8" src={ AddIcon } alt="" />
                        <p className="text-2xl font-semibold">
                            Add Element
                        </p>
                    </div>
                    <div className="p-6">
                        <ul className="flex flex-col gap-3 w-full h-full scrollable-div">
                            <li>
                                <button className="flex w-full p-3 gap-3 rounded-3xl bg-zinc-600 hover:bg-zinc-500" onClick={ () => { addElement("Description Text") }}>
                                    <img className="p-3 w-24" src={ TextIcon } alt=""/>
                                    <div className="flex flex-col h-24 gap-3 justify-center overflow-hidden">
                                        <p className="w-full text-left text-xl font-semibold">Description Text</p>
                                        <p className="w-full text-left text-lg">Space for elaborating on recipe steps or additional notes.</p>
                                    </div>
                                </button>
                            </li>
                            <li>
                                <button className="flex w-full p-3 gap-3 rounded-3xl bg-zinc-600 hover:bg-zinc-500" onClick={ () => { addElement("Section Header") }}>
                                <img className="p-3 w-24" src={ SectionIcon } alt="" />
                                    <div className="flex flex-col h-24 gap-3 justify-center overflow-hidden">
                                        <p className="w-full text-left text-xl font-semibold">Section Header</p>
                                        <p className="w-full text-left text-lg">Organizes content into clear sections, such as Ingredients or Instructions.</p>
                                    </div>
                                </button>
                            </li>
                            <li>
                                <button className="flex w-full p-3 gap-3 rounded-3xl bg-zinc-600 hover:bg-zinc-500" onClick={ () => { addElement("Image Carousel") }}>
                                <img className="p-3 w-24" src={ ImageIcon } alt="" />
                                    <div className="flex flex-col h-24 gap-3 justify-center overflow-hidden">
                                        <p className="w-full text-left text-xl font-semibold">Image Carousel</p>
                                        <p className="w-full text-left text-lg">Showcases multiple photos of the recipe or its preparation steps.</p>
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

function Create(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const systemTags = p.systemTags
    
    const [publishState, setPublishState] = useState() 
    const [confirmationShown, setConfirmationShown] = useState()
    const [showModal, setShowModal] = useState(false)
    const [recipeImage, setRecipeImage] = useState(new Blob())
    const [summary, setSummary] = useState('')
    const [ingredients, setIngredients] = useState([{ key: uuidv4() }])
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState([])
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
    
    function navigateToHome() {
        navigate('/home')
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
                ingredients.filter(ingredient => ingredient.value !== '')
                    .map(ingredient => ingredient.value)
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
                    return
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

        axios.post(`http://localhost:8080/publish-recipe`, formData, { 
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
        <div>
            <NavBar
                user={ user } currentTab={ currentTab } 
                setCurrentTab={ setCurrentTab } title={ title }
                recipeImage={ recipeImage } setRecipeImage={ setRecipeImage }
                summary={ summary } setSummary={ setSummary } 
                ingredients={ ingredients } setIngredients={ setIngredients }
                tags={ tags } setTags={ setTags } 
                publishRecipe={ publishRecipe } systemTags={ systemTags }
                setConfirmationShown={ setConfirmationShown } 
            />
            <div className="pr-0 flex flex-col gap-3 p-3 h-dvh overflow-y-scroll scrollable-div bg-zinc-950">
                <div className="grid w-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                    <div className="col-span-4"></div>
                    <div className="col-span-11 flex flex-col rounded-3xl text-zinc-100">
                        <p className="text-3xl font-bold h-16 mb-3 p-6 flex items-center text-zinc-400">
                            What are you cooking?
                        </p>
                        <div className="flex flex-col items-center w-full mb-3 py-6 px-3 rounded-3xl bg-zinc-900">
                            <Textarea 
                                attribute={`${ !title && "pt-2.5 border border-red-600 bg-zinc-600" } px-3 text-4xl font-bold w-full text-center focus:bg-zinc-600 bg-transparent`} 
                                maxLength={ 200 } value={ title } setValue={ setTitle } 
                                placeholder="What is the title of your recipe?" 
                            />
                        </div>
                        {
                            recipeElements &&
                            recipeElements.map(element => 
                                <RecipeElement
                                    key={ element.key } keyIndex={ element.key } 
                                    contentType={ element.value.contentType } addElement={ addElement }
                                    elementTexts={ elementTexts } setElementTexts={ setElementTexts } 
                                    elementFiles={ elementFiles } setElementFiles={ setElementFiles }
                                    recipeElements={ recipeElements } setRecipeElements={ setRecipeElements }
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
                { 
                    showModal && 
                    <ElementsModal setShowModal={ setShowModal } addElement={ addElement } /> 
                }
                {/* confirm modal */}
                {
                    confirmationShown === "exit" &&
                    <ConfirmModal 
                        setShowModal={ setConfirmationShown } confirmAction={ navigateToHome }
                        headerText={ "Confirm Exit" } bodyText={ "Are you sure you want to exit? You will lose all your progress." }
                        icon={ BackIcon } isDanger={ true }
                    />
                }
                {
                    publishState &&
                    <div className="absolute inset-0 grid place-items-center h-screen pt-3 text-zinc-100 bg-zinc-950 bg-opacity-80 overflow-y-scroll scrollable-div"
                            onMouseDownCapture={e => { 
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
                        <div className="flex flex-col gap-3 justify-center items-center w-5/12 overflow-hidden model-inner">
                            <div className="flex flex-col w-full py-20 gap-12 items-center rounded-3xl bg-zinc-900 overflow-hidden">
                                {
                                    publishState === "publishing" &&
                                    <>
                                        <p className="w-full text-center text-2xl font-semibold">
                                            Publishing recipe...
                                        </p>
                                        <img className="animate-spin-continuous w-24" src={ LoadingIcon } alt="" />
                                    </>
                                }
                                {
                                    publishState === "published" &&
                                    <>
                                        <p className="w-full text-center text-2xl font-semibold">
                                            Your recipe is now published!
                                        </p>
                                        <img className="w-24" src={ AllowIcon } alt="" />
                                    </>
                                }
                                {
                                    publishState === "not published" &&
                                    <>
                                        <p className="w-full text-red-600 text-center text-2xl font-semibold">
                                            Your recipe is not published.<br/>Please try publishing again.
                                        </p>
                                        <img className="w-24" src={ RemoveIcon } alt="" />
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Create