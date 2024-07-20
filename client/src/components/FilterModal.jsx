import React, { useState, useLayoutEffect } from 'react'
import { debounce } from 'lodash'

import FilterIcon from '../assets/filter-icon.svg'
import SearchIcon from '../assets/search-icon.svg'

function FilterModal({
    systemTags, filters, 
    setFilters
}) {
    const [searchValue, setSearchValue] = useState('')
    const [tagChoices, setTagChoices] = useState(systemTags)

    function addTag(e) {
        const index = e.target.id
        const tag = tagChoices[index]

        if (!filters.includes(tag)) {
            setFilters([...filters, tag])
        }
    }

    function removeTag(e) {
        const index = e.target.id
        const tag = filters[index]

        setFilters(filters.filter(recipeTag => recipeTag !== tag))
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
        <div className="absolute inset-0 z-0 grid place-items-center text-zinc-100 bg-zinc-950 bg-opacity-80 overflow-hidden">
            <div className="inset-0 flex justify-center w-full h-full p-3 py-20 items-center overflow-hidden">
                <div className="flex w-full h-full py-3 justify-center items-center">
                    <div className="flex flex-col h-full w-10/12 text-zinc-100 rounded-3xl col-span-2 bg-zinc-900 overflow-hidden pointer-events-auto">
                        <div className="flex p-6 gap-3 shadow-md shadow-zinc-950 flex-row items-center">
                            <img  className="w-8" src={ FilterIcon } alt="" />
                            <p className="text-2xl font-bold">
                                Filter
                            </p>
                        </div>
                        {/* selected tags */}
                        {
                            filters &&
                            <div className="flex flex-col pl-6 pr-3 pt-3 pb-6 gap-3 scrollable-div overflow-y-scroll overflow-x-hidden">
                                <div className="font-semibold gap-3">
                                    {
                                        filters.map((tag, index) => 
                                            <button className="m-1 px-3 py-1 w-fit bg-zinc-600 rounded-3xl hover:bg-zinc-500" key={ index } id={ index } onClick={ e => { removeTag(e) } }>
                                                { tag }
                                            </button>
                                        )
                                    }
                                </div>
                                {
                                    filters.length > 0 &&
                                    <button className="px-3 py-2 text-red-500 font-semibold rounded-3xl shadow-md shadow-zinc-950 bg-zinc-600 hover:bg-zinc-500" onClick={ () => setFilters([]) }>
                                        Clear filters
                                    </button>
                                }
                                {/* search input */}
                                <div className="relative flex w-full items-center justify-center shadow-md shadow-zinc-950 rounded-3xl bg-zinc-600">
                                    <div className="absolute flex ml-4 left-0 right-0 items-start justify-left pointer-events-none">
                                        <img className="w-6" src={ SearchIcon } alt="" />
                                    </div>
                                    <input className="w-full px-14 h-10 rounded-3xl bg-transparent text-zinc-100 text-start"
                                        value={ searchValue } onChange={ e => setSearchValue(e.target.value) } type="text" placeholder="Search tags"
                                    />
                                </div>
                                {/* tags */}
                                <div className="font-semibold gap-3">
                                    {
                                        tagChoices.map((tag, index) => {
                                            let isAdded 
                                            if (filters) {
                                                isAdded = filters.find(recipeTag => recipeTag === tag)
                                            } else {
                                                isAdded = false
                                            }
                                            
                                            return (
                                                <button className={`${ isAdded ? "bg-zinc-800" : "bg-zinc-700 hover:bg-zinc-500" } m-1 px-3 py-1 w-fit rounded-3xl`} 
                                                    disabled={ isAdded } key={ index } id={ index } onClick={ e => { addTag(e) } }
                                                >
                                                    { tag }
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterModal