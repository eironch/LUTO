import React, { useState, useRef, useLayoutEffect } from 'react'
import RemoveIcon from '../assets/remove-icon.svg'

function CustomTextarea(p) {
    const textareaRef = useRef(null)
    const [isFocused, setIsFocused] = useState(false)

    const keyIndex = p.keyIndex
    const values = p.values
    const setValues = p.setValues
    const placeholder = p.placeholder
    const maxLength = p.maxLength
    const attribute = p.attribute

    function autoResize() {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${ textarea.scrollHeight }px`
        }
    }

    useLayoutEffect(() => {
        autoResize()

        function handleResize() {
            autoResize()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [ values ])

    function updateValue(newValue) {
        setValues(values.map(value => {
            if (value.key === keyIndex) {
                value.value = newValue
            }

            return value
        }))
    }

    return (
        <textarea 
            className={`${ attribute } w-full p-3 box-border rounded-3xl overflow-hidden resize-none`}
            ref={ textareaRef } value={ values.find(value => value.key === keyIndex).value } maxLength={ maxLength }
            onChange={ e => updateValue(e.target.value) } placeholder={ placeholder } 
            spellCheck={ isFocused }
            onFocus={ () => { setIsFocused(true) } }
            onBlur={ () => { setIsFocused(false) } }
            rows={ 1 }
        />
    )
}

function SectionHeader(p) {
    const keyIndex = p.keyIndex
    const values = p.values
    const setValues = p.setValues
    const removeElement = p.removeElement

    return (
        <div className="py-6 px-3 flex flex-col justify-center items-center gap-3 mb-3 rounded-3xl bg-zinc-900">
            <CustomTextarea attribute={`${ !values.some(value => value.key === keyIndex) && "bg-zinc-600" } px-3 text-3xl font-semibold w-full focus:bg-zinc-600 bg-transparent`} 
                maxLength={ 50 } keyIndex={ keyIndex } values={ values } setValues={ setValues }
                placeholder="Enter section title here" 
            />
            <button className="p-3 text-2xl font-semibold rounded-3xl hover:bg-red-600" onClick={ () => { removeElement() } }>
                <img className="w-8" src={ RemoveIcon } alt="" />
            </button>
        </div>
    )
}

function DescriptionText(p) {
    const keyIndex = p.keyIndex
    const values = p.values
    const setValues = p.setValues
    const removeElement = p.removeElement

    return (
        <div className="py-6 px-3 flex flex-col justify-center items-center gap-6 mb-3 rounded-3xl bg-zinc-900">
            <CustomTextarea attribute={`${ !values.some(value => value.key === keyIndex) && "bg-zinc-600" } px-3 text-xl w-full focus:bg-zinc-600 bg-transparent`} 
                maxLength={ 2000 } keyIndex={ keyIndex } values={ values } setValues={ setValues }
                placeholder="Enter description text here" 
            />
            <button className="p-3 text-2xl font-semibold rounded-3xl hover:bg-red-600" onClick={ () => { removeElement() } }>
                <img className="w-8" src={ RemoveIcon } alt="" />
            </button>
        </div>
    )
}

function ImageCarousel(p) {
    const keyIndex = p.keyIndex
    const values = p.values
    const setValues = p.setValues
    const removeElement = p.removeElement

    const divRef = useRef()
    const [isNewAdded, setIsNewAdded] = useState(false)
    const elementFiles = values.find(element => element.key === keyIndex)

    useLayoutEffect(() => {
        if (divRef.current && isNewAdded) {
            divRef.current.scrollLeft = divRef.current.scrollWidth
            setIsNewAdded(false)
        }   
    }, [isNewAdded])

    function handleFileChange(e) {
        const id = e.target.name
        const key = keyIndex
        const file = e.target.files[0]
        const maxSizeInBytes = 5 * 1024 * 1024

        if (file && file.size > maxSizeInBytes) {
            // placeholder
            return alert('File size exceeds the maximum allowed limit (5MB). Please Select a smaller file.')
        } else if (!file) {
            return
        }
        
        setValues(values.map(objectArray => {
            if (objectArray.key === key) {
                const newObjectValue = objectArray.value
                newObjectValue[id] = file

                if (newObjectValue[newObjectValue.length - 1] !== '') {
                    newObjectValue.push('')
                    setIsNewAdded(true)
                }
                
                return { key: objectArray.key, value: newObjectValue }
            }

            return objectArray
        }))
    }

    return (
        <div className="pt-6 pb-3 px-6 flex flex-col justify-center items-center gap-3 mb-3 rounded-3xl overflow-hidden bg-zinc-900">
            <div className="flex flex-row w-full h-full gap-3  justify-start items-center overflow-x-scroll scrollable-div" ref={ divRef }>
                {
                    elementFiles.value.map((value, index) => (
                        <div className="w-full min-w-32 max-w-96 h-full max-h-96 min-h-32 aspect-1 overflow-y-hidden flex-none" key={ keyIndex }>
                            {
                                value &&
                                <div className="w-full h-full bg-zinc-600 rounded-3xl">
                                    <img className="w-full h-full rounded-3xl object-cover" src={ URL.createObjectURL(value) } alt="" />
                                </div>
                            }
                            <label className={`${ (value && value.length !== 1) && "opacity-0" } flex w-full h-full justify-center items-center text-2xl text-zinc-500 font-semibold border-4 border-dashed border-zinc-500 rounded-3xl cursor-pointer`} htmlFor={`${ keyIndex }-${ index }`}  key={ keyIndex + 'label'}>
                                Upload Image
                            </label>
                            <input className="hidden" id={`${ keyIndex }-${ index }`} name={ index } type="file" accept="image/*" onChange={ e => handleFileChange(e) } />
                        </div>
                    ))
                }
            </div>
            <button className="p-3 text-2xl font-semibold rounded-3xl hover:bg-red-600" onClick={ () => { removeElement() } }>
                <img className="w-8" src={ RemoveIcon } alt="" />
            </button>
        </div>
    )
}

function RecipeElement(p) {
    const keyIndex = p.keyIndex
    const contentType = p.contentType
    const addElement = p.addElement
    const elementTexts = p.elementTexts
    const setElementTexts = p.setElementTexts
    const elementFiles = p.elementFiles
    const setElementFiles = p.setElementFiles
    const recipeElements = p.recipeElements
    const setRecipeElements = p.setRecipeElements

    function removeElement() {
        setElementTexts(elementTexts.filter(element => element.key !== keyIndex))
        setElementFiles(elementFiles.filter(element => element.key !== keyIndex))
        setRecipeElements(recipeElements.filter(element => element.key !== keyIndex))
    }

    if (contentType === 'Section Header') {
        return <SectionHeader
            key={ keyIndex }
            keyIndex={ keyIndex } values={ elementTexts } 
            setValues={ setElementTexts } removeElement={ removeElement }
        />
    } else if (contentType === 'Description Text') {
        return <DescriptionText
            key={ keyIndex } 
            keyIndex={ keyIndex } values={ elementTexts } 
            setValues={ setElementTexts } removeElement={ removeElement }
        />
    } else if (contentType === 'Image Carousel') {
        return <ImageCarousel
            key={ keyIndex }
            keyIndex={ keyIndex } values={ elementFiles } addElement={ addElement }
            setValues={ setElementFiles } removeElement={ removeElement }
        />
    }
    
    return null
}

export default RecipeElement