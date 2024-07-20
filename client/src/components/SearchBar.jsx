import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import LogoGradient from '../assets/luto-gradient-logo.svg'
import SearchIcon from '../assets/search-icon.svg'
import RemoveIcon from '../assets/remove-icon.svg'
import FilterIcon from '../assets/filter-icon.svg'
import BackIcon from '../assets/back-icon.svg'

function SearchBar({
    searchQuery, setSearchQuery,
    scrollDivRef, screenSize,
    isFilterShown, setIsFilterShown
}) {
    const [showSearchBar, setShowSearchBar] = useState(false)
    const [show, setShow] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    
    const searchBarRef = useRef(null)
    const navigate = useNavigate()

    function handleScroll() {
        const currentScrollY = scrollDivRef.current.scrollTop
        const scrollDifference = currentScrollY - lastScrollY
        
        if (currentScrollY < 70) {
            setShow(true)
        }

        if (scrollDifference > 10 && currentScrollY > 100) {
            setShow(false)
        } else if (scrollDifference < -10) {
            setShow(true)
        }

        setLastScrollY(currentScrollY)
    }

    function handleEnterKey(e) {
        if (e.key === 'Enter' && searchQuery !== "") {
            navigate('/search')
        }
    }

    useEffect(() => {
        scrollDivRef.current.addEventListener('scroll', handleScroll)
        
        return () => {
            if (!scrollDivRef.current) {
                return
            }

            scrollDivRef.current.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY])

    useEffect(() => {
        if (!searchBarRef.current) {
            return
        }
        
        searchBarRef.current.focus()
    }, [showSearchBar])

    return (
        <div className={`${ show ? "translate-y-0" : "-translate-y-full" } absolute z-10 flex xl:grid gap-3 xl:p-3 w-full h-20 xl:h-fit overflow-hidden pointer-events-none transform transition-transform duration-300 ease-in-out`} style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            {
                screenSize > 3 &&
                <div className="col-span-2"></div>
            }
            <div className="flex col-span-11 w-full px-3 py-0 xl:py-3 items-center justify-center pointer-events-auto xl:pointer-events-none bg-zinc-900 xl:bg-transparent border-b xl:border-0 border-zinc-800">
                {
                    !showSearchBar && screenSize < 4 &&
                    <div className="flex w-full xl:w-2/12 h-full">
                        <Link to="/home" className="w-fit h-full px-3 py-4 mr-3">
                            <img className="w-full h-full object-contain" src={ LogoGradient }alt="" />
                        </Link>
                    </div>
                }
                {
                    showSearchBar && screenSize < 4 &&
                    <div className="flex w-fit h-full justify-center items-center"> 
                        <button className="w-10 p-3 mr-3 rounded-3xl hover:bg-zinc-500" onClick={ () => { setShowSearchBar(false) } }>
                            <img className="w-4 h-4 object-cover" src={ BackIcon } alt="" />
                        </button>
                    </div>
                }
                {/* search bar */}
                {
                    ((showSearchBar &&  screenSize < 4) || screenSize > 3) &&
                    <div className={`${ showSearchBar && screenSize < 4 ? "w-full mr-3" : "w-8/12" } relative flex h-10 items-center justify-center shadow-md shadow-zinc-950 rounded-3xl bg-zinc-600`}>
                        <div className="absolute flex ml-6 left-0 right-0 items-start justify-left pointer-events-none">
                            <img className="w-6" src={ SearchIcon } alt="" />
                        </div>
                        <input 
                            className="w-full pl-16 xl:pl-28 pr-28 h-full xl:h-10 rounded-3xl bg-transparent xl:text-lg text-zinc-100 placeholder:text-zinc-400 xl:text-center pointer-events-auto" 
                            value={ searchQuery } onChange={ (e) => setSearchQuery(e.target.value) }
                            onKeyDown={ e => handleEnterKey(e) }
                            type="text" placeholder="Search LUTO"
                            ref={ searchBarRef }
                        />
                        <div className="absolute flex flex-row mr-2 right-0 items-last justify-right pointer-events-none">
                            <button
                                className="flex justify-center items-center w-12 h-8 rounded-3xl text-zinc-100 hover:bg-zinc-500 pointer-events-auto" 
                                onClick={ () => searchQuery !== "" && navigate('/search') }
                            >
                                ➤
                            </button>
                        </div>
                        {
                            searchQuery &&
                            <div className="absolute flex mr-28 pr-2 w-full justify-end pointer-events-none">
                                <button className="p-2 rounded-3xl hover:bg-zinc-500 pointer-events-auto" onClick={ () => setSearchQuery('') }>
                                    <img className="w-4" src={ RemoveIcon } alt=""/>
                                </button>
                            </div>
                        }
                    </div>
                }
                {
                    !showSearchBar && screenSize < 4 &&
                    <div className="flex w-full xl:w-2/12 h-full justify-end items-center">
                        {
                            !showSearchBar && screenSize < 4 &&
                            <div className="flex w-fit h-full mr-0 sm:mr-3"> 
                                <button className="px-3" onClick={ () => { 
                                        setShowSearchBar(true)
                                    }}
                                >
                                    <img className="w-8 h-8 object-cover" src={ SearchIcon } alt="" />
                                </button>
                            </div>
                        }
                        <div className="flex w-fit h-full justify-end items-center"> 
                            <button className="p-3" onClick={ () => setIsFilterShown(!isFilterShown) }>
                                <img className="w-8 h-8 object-cover" src={ FilterIcon } alt="" />
                            </button>
                        </div>
                    </div>
                }
            </div>
            {
                screenSize > 3 &&
                <div className="col-span-2"></div>
            }
        </div>
    )
}

export default SearchBar