import React, { useState, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { debounce } from 'lodash'

import HomeIcon from '../assets/home-icon.svg'
import PopularIcon from '../assets/popular-icon.svg'
import SavedIcon from '../assets/saved-icon.svg'
import CreateIcon from '../assets/create-icon.svg'
import SettingsIcon from '../assets/settings-icon.svg'
import FilterIcon from '../assets/filter-icon.svg'
import SearchIcon from '../assets/search-icon.svg'
import LogOutIcon from '../assets/log-out-icon.svg'

function SidebarTab({ 
    currentTab, systemTags, 
    filters, setFilters, 
    setConfirmationShown 
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
        <div className="p-3 pt-0 grid w-full gap-3 h-full overflow-hidden" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="flex flex-col col-span-2 rounded-3xl bg-zinc-900 pointer-events-auto">
                <div className="flex items-center flex-col gap-3 m-3">
                    <Link to="/home" className={`${ currentTab==="Home" && "bg-zinc-600 shadow-md shadow-zinc-950" } flex flex-row items-center gap-3 2xl:gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950`}>
                        <img className="w-8" src={ HomeIcon } alt="" />
                        <p className="text-zinc-100 text-sm 2xl:text-lg font-semibold">Home</p>
                    </Link>
                    <Link to="/popular" className={`${ currentTab==="Popular" && "bg-zinc-600 shadow-md shadow-zinc-950" } flex flex-row items-center gap-3 2xl:gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950`}>
                        <img className="w-8" src={ PopularIcon } alt="" />
                        <p className="text-zinc-100 text-sm 2xl:text-lg font-semibold">Popular</p>
                    </Link>
                    <Link to="/saved" className={`${ currentTab==="Saved" && "bg-zinc-600 shadow-md shadow-zinc-950" } flex flex-row items-center gap-3 2xl:gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950`}>
                        <img className="w-8" src={ SavedIcon } alt="" />
                        <p className="text-zinc-100 text-sm 2xl:text-lg font-semibold">Saved</p>
                    </Link>
                    <Link to="/create" className={`${ currentTab==="Create" && "bg-zinc-600 shadow-md shadow-zinc-950" } flex flex-row items-center gap-3 2xl:gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950`}>
                        <img className="w-8" src={ CreateIcon } alt="" />
                        <p className="text-zinc-100 text-sm 2xl:text-lg font-semibold">Create</p>
                    </Link>
                </div>
                <div className="flex flex-col gap-3 m-3 h-full justify-end">
                    <Link to="/settings" className={`${ currentTab==="Settings" && "bg-zinc-600 shadow-md shadow-zinc-950" } flex flex-row items-center gap-3 2xl:gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950`}>
                        <img className="w-8" src={ SettingsIcon } alt="" />
                        <p className="text-zinc-100 text-sm 2xl:text-lg font-semibold">Settings</p>
                    </Link>
                    <button className="flex flex-row items-center gap-3 2xl:gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950" onClick={ () => { setConfirmationShown('log out') } }>
                        <img className="w-8" src={ LogOutIcon } alt="" />
                        <p className="text-zinc-100 text-sm 2xl:text-lg font-semibold">Log Out</p>
                    </button>
                </div>
            </div>
            <div className="col-span-11"></div>
            {/* filters */}
            {
                currentTab !== "Settings" &&
                <div className="bg-zinc-900 flex flex-col text-zinc-100 rounded-3xl col-span-2 overflow-hidden pointer-events-auto">
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
                                <input className="w-full pl-14 h-10 rounded-3xl bg-transparent text-zinc-100 text-start"
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
                                            <button className={`${ isAdded ? "bg-zinc-800" : "bg-zinc-600 hover:bg-zinc-500" } m-1 px-3 py-1 w-fit rounded-3xl`} 
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
            }  
        </div>
    )
}

export default SidebarTab