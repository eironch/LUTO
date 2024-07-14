import React, { useState, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import debounce from 'lodash.debounce'

import Textarea from './Textarea'

import ProfileIcon from '../assets/profile-icon.png'
import ApproveIcon from '../assets/approve-icon.png'
import FeedbackIcon from '../assets/feedback-icon.png'
import AddIcon from '../assets/add-icon.png'
import SearchIcon from '../assets/search-icon.png'
import TagIcon from '../assets/tag-icon.png'
import IngredientsIcon from '../assets/ingredients-icon.png'
import SummaryIcon from '../assets/summary-icon.png'
import GivePointNegativeIcon from '../assets/give-point-negative-icon.png'
import GivePointPositiveIcon from '../assets/give-point-positive-icon.png'

function IngredientForm(p) {
    const keyIndex = p.keyIndex
    const ingredients = p.ingredients
    const setIngredients = p.setIngredients

    const [ingredientValue, setIngredientValue] = useState('')
    const ingredient = ingredients.find(ingredient => ingredient.key === keyIndex).value

    useLayoutEffect(() => {
        const newIngredients = [...ingredients]
        newIngredients.forEach(ingredient => {
            if (ingredient.key === keyIndex) {
                ingredient.value = ingredientValue
            }
        })
        
        setIngredients(newIngredients)
    }, [ingredientValue])

    return (
        <li className="flex rounded-3xl text-center items-center">
            <p className="flex items-center px-3 text-2xl font-bold">
                •
            </p>
            <input className={`${ (ingredient === "") ? "bg-zinc-600 border border-red-600" : "bg-zinc-900" } p-3 w-full rounded-3xl focus:bg-zinc-600 hover:bg-zinc-600`} 
                value={ ingredientValue } onChange={ e => setIngredientValue(e.target.value) } 
                placeholder="What Ingredient?" maxLength={ 30 }
            />
        </li>
    )
}

function SidebarCreate(p) {
    const user = p.user

    const setRecipeImage = p.setRecipeImage
    const summary = p.summary
    const setSummary = p.setSummary
    const ingredients = p.ingredients
    const setIngredients = p.setIngredients
    const tags = p.tags
    const setTags = p.setTags
    const systemTags = p.systemTags
    const [preRecipeImage, setPreRecipeImage] = useState()
    const [searchValue, setSearchValue] = useState('')
    const [tagChoices, setTagChoices] = useState([])
    

    function addTag(e) {
        const index = e.target.id
        const tag = tagChoices[index]

        if (!tags.includes(tag)) {
            setTags([...tags, tag])
        }
    }

    function removeTag(e) {
        const index = e.target.id
        const tag = tags[index]

        setTags(tags.filter(recipeTag => recipeTag !== tag))
    }

    function addIngredient() {
        const newIngredients = [...ingredients]
        setIngredients([...newIngredients.filter(ingredient => ingredient.value.length > 0), { key: uuidv4(), value: '' }])
    }

    function handleFileChange(e) {
        const file = e.target.files[0]
        const maxSizeInBytes = 5 * 1024 * 1024

        if (file && file.size > maxSizeInBytes) {
            // log
            return alert('File size exceeds the maximum allowed limit (25MB). Please Select a smaller file.')
        }

        setPreRecipeImage(file)
        setRecipeImage(file)
    }

    const handleTagSearch = debounce(input => {
        if (!input) {
            return handlePopularTags()
        }
        
        setTagChoices(systemTags.filter(tag => 
            new RegExp(`.*${ input }.*`, 'i').test(tag)
        ))
    }, 300)

    function handlePopularTags() {
        setTagChoices(systemTags)
    }

    useLayoutEffect(() => {
        handleTagSearch(searchValue)
    }, [searchValue])

    useLayoutEffect(() => {
        handlePopularTags()
    }, [])
    
    return (
        <div className="pl-3 grid w-full h-full overflow-hidden" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="flex overflow-x-hidden overflow-y-scroll h-full scrollable-div flex-col text-zinc-100 col-span-4 pointer-events-auto">
                {/* recipe image */}
                <div className="mb-3 rounded-3xl bg-zinc-900">
                    <div className="p-2 rounded-3xl bg-gradient-to-tr from-orange-500 to-orange-400">
                        <div className="relative w-full h-auto aspect-w-2 aspect-h-2">
                            {
                                preRecipeImage &&
                                <div className="bg-orange-300 rounded-3xl">
                                    <img className="absolute inset-0 w-full h-full rounded-3xl object-cover" src={ URL.createObjectURL(preRecipeImage) } alt="" />
                                </div>
                            }
                            <label className={`${ preRecipeImage && "opacity-0" } flex justify-center items-center text-2xl font-semibold border-4 border-dashed border-zinc-200 rounded-3xl cursor-pointer`} htmlFor="fileInput">
                                Upload Image
                            </label>
                            <input className="hidden" id="fileInput" type="file" accept="image/*" onChange={ e => handleFileChange(e) } />
                        </div>
                    </div>
                    <div className="flex p-3">
                        <div className="flex">
                            <div className="flex gap-3 px-4 py-2 items-center justify-start rounded-3xl">
                                <div className="flex flex-row gap-3 items-center text-lg font-semibold">
                                    <img className="min-w-10 w-10" src={ FeedbackIcon } alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-end w-full overflow-hidden">
                            <div className="flex justify-end items-center h-fit rounded-3xl bg-zinc-600">
                                <div className="flex justify-end items-center p-3 gap-4 rounded-3xl">
                                    <img className="min-w-10 w-10" src={ GivePointNegativeIcon } alt="" />
                                </div>
                                <p className="text-zinc-100 text-lg font-semibold line-clamp-1">
                                    0 pts.
                                </p>
                                <div className="flex justify-end items-center p-3 gap-4 rounded-3xl">
                                    <img className="min-w-10 w-10" src={ GivePointPositiveIcon } alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* summary */}
                <div className="flex flex-col mb-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row p-6 gap-6 items-center shadow-md shadow-zinc-950">
                        <img className="w-10" src={ SummaryIcon } alt="" />
                        <p className="text-2xl font-semibold">
                            Summary
                        </p>
                    </div>
                    <div className="flex flex-col p-3">
                        <Textarea 
                            attribute={`${summary ?  "bg-transparent" : "pt-2.5 bg-zinc-600 border border-red-600"} text-justify text-lg focus:bg-zinc-600`} 
                            maxLength={ 300 } value={ summary || "" } setValue={ setSummary }
                            placeholder="What would you describe your dish?"
                        />
                        <p className="flex p-3 w-full justify-end">
                            {`${ summary ? summary.length : "0" }/300`}
                        </p>
                    </div>
                </div>
                {/* ingredients */}
                <div className="flex flex-col mb-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row p-6 gap-6 items-center shadow-md shadow-zinc-950">
                        <img className="w-10" src={ IngredientsIcon } alt="" />
                        <p className="text-2xl font-semibold">Ingredients</p>
                    </div>
                    <ul className="text-lg flex flex-col gap-1 p-6 pt-3">
                        {
                            ingredients &&
                            ingredients.map(ingredient => 
                                <IngredientForm 
                                    value={ ingredient.value } key={ ingredient.key } keyIndex={ ingredient.key } 
                                    ingredients={ ingredients } setIngredients={ setIngredients } 
                                />
                            )
                        }
                        <button className="flex justify-center p-3 my-3 rounded-3xl shadow-md shadow-zinc-950 bg-zinc-600 hover:bg-zinc-500" onClick={ () => addIngredient() }>
                            <img className="w-5" src={ AddIcon } alt="" />
                        </button>
                    </ul>
                </div>
                {/* user */}
                <div className="flex gap-6 flex-row items-center mb-3 p-6 rounded-3xl bg-zinc-900">
                    <img className="w-14 h-14 rounded-full object-cover" src={ user.profilePicture || ProfileIcon } alt="" />
                    <p className="text-xl font-semibold">
                        { user.username }
                    </p>
                </div>
                {/* tags */}
                <div className="flex flex-col mb-3 gap-3 rounded-3xl bg-zinc-900">
                    {/* header */}
                    <div className="flex flex-row gap-6 p-6 mb-3 items-center shadow-md shadow-zinc-950">
                        <img className="w-10" src={ TagIcon } alt="" />
                        <p className="text-2xl font-semibold">Tags</p>
                    </div>
                    {/* selected tags */}
                    {
                        tags &&
                        tags.length > 0 &&
                        <div className="block px-6 text-md font-semibold w-full">
                            {
                                tags.map((tag, index) => 
                                    <button className="m-1 px-3 py-1 w-fit bg-zinc-600 rounded-3xl hover:bg-zinc-500" key={ index } id={ index } onClick={ e => { removeTag(e) } }>
                                        { tag }
                                    </button>
                                )
                            }
                        </div>
                    }
                    {
                        tags.length > 0 &&
                        <button className="mx-6 py-2 font-semibold rounded-3xl shadow-md shadow-zinc-950 bg-zinc-600 hover:bg-zinc-500" onClick={ () => setTags([]) }>
                            Clear filters
                        </button>
                    }
                    {/* search input */}
                    <div className="flex flex-row px-6 gap-3 items-center">
                        {
                            !searchValue && <p className="text-xl font-bold">Popular</p>
                        }
                        <div className="relative flex w-full items-center justify-center rounded-3xl shadow-md shadow-zinc-950 bg-zinc-600">
                            <div className="absolute flex ml-4 left-0 right-0 items-start justify-left pointer-events-none">
                                <img className="w-6" src={ SearchIcon } alt="" />
                            </div>
                            <input className="w-full h-10 px-14 rounded-3xl bg-transparent text-zinc-100 text-start"
                                value={ searchValue } onChange={ e => setSearchValue(e.target.value) } type="text" placeholder="Search tags"
                            />
                        </div>
                    </div>
                    {/* tags */}
                    <div className="block px-6 pb-6 text-md font-semibold w-full">
                        {
                            tags &&
                            tagChoices.map((tag, index) => {
                                const isAdded = tags.find(recipeTag => recipeTag === tag)

                                return (
                                    <button className={`${ isAdded ? "bg-zinc-700" : "bg-zinc-600 hover:bg-zinc-500" } m-1 px-3 py-1 w-fit rounded-3xl`} 
                                        disabled={ isAdded } key={ index } id={ index } onClick={ e => { addTag(e) } }
                                    >
                                        { tag }
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SidebarCreate