import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import LogoGradient from '../assets/luto-gradient-logo.svg'
import SearchIcon from '../assets/search-icon.svg'
import RemoveIcon from '../assets/remove-icon.svg'
import FilterIcon from '../assets/filter-icon.svg'
import BackIcon from '../assets/back-icon.svg'

function NavbarTop({
    searchQuery, setSearchQuery,
    scrollDivRef, screenSize,
    isFilterShown, setIsFilterShown,
    isNavbarTopShown, setIsNavbarTopShown,
    currentTab, savedRecipeCount
}) {
    const [showSearch, setShowSearch] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    
    const searchRef = useRef(null)
    const navigate = useNavigate()

    function handleScroll() {
        const currentScrollY = scrollDivRef.current.scrollTop
        const scrollDifference = currentScrollY - lastScrollY
        
        if (currentScrollY < 80) {
            setIsNavbarTopShown(true)
        }

        if (scrollDifference > 10 && currentScrollY > 100) {
            setIsNavbarTopShown(false)
        } else if (scrollDifference < -10) {
            setIsNavbarTopShown(true)
        }

        setLastScrollY(currentScrollY)
    }

    function handleEnterKey(e) {
        if (e.key === 'Enter' && searchQuery !== "") {
            navigate('/search')
        }
    }

    useEffect(() => {
        const ref = scrollDivRef.current
 
        ref.addEventListener('scroll', handleScroll)
        
        return () => ref.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    useEffect(() => {
        if (!searchRef.current) {
            return
        }
        
        searchRef.current.focus()
    }, [showSearch])
    
    return (
        <div className="absolute z-40 xl:z-30 w-full h-dvh pointer-events-none">
            <div className={`${ isNavbarTopShown ? "translate-y-0" : "-translate-y-full" } xl:z-10 flex xl:grid gap-3 xl:p-3 w-full h-16 xl:h-fit overflow-hidden pointer-events-none transform transition-transform duration-300 ease-in-out`} style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                {
                    screenSize > 3 &&
                    <div className="col-span-2"></div>
                }
                <div className="flex col-span-11 w-full px-3 py-0 xl:py-3 items-center justify-center pointer-events-auto xl:pointer-events-none bg-zinc-900 xl:bg-transparent border-b xl:border-0 border-zinc-800">
                    {/* logo */}
                    {
                        !showSearch && currentTab === "Home" && screenSize < 4 &&
                        <div className="flex w-full xl:w-2/12 h-full">
                            <Link to="/home" className="w-fit h-full px-3 py-4 mr-3">
                                <img className="w-full h-full object-contain" src={ LogoGradient }alt="" />
                            </Link>
                        </div>
                    }
                    {
                        !showSearch && currentTab === "Popular" && screenSize < 4 &&
                        <div className="flex w-full xl:w-2/12 h-full items-center pl-3 text-zinc-100 text-lg sm:text-2xl font-bold">
                            Popular Recipes
                        </div>
                    }
                    {
                        !showSearch && currentTab === "Saved" && screenSize < 4 &&
                        <div className="flex w-full xl:w-2/12 h-full items-center pl-3 text-zinc-100 text-lg sm:text-2xl font-bold">
                            <p>Saved Recipes</p>
                            {
                                savedRecipeCount ?
                                <p className="pl-6">{ savedRecipeCount }</p>
                                :
                                <></>
                            }
                        </div>
                    }
                    {
                        showSearch && screenSize < 4 &&
                        <div className="flex w-fit h-full justify-center items-center"> 
                            <button className="w-10 p-3 mr-3 rounded-3xl hover:bg-zinc-500" onClick={ () => { setShowSearch(false) } }>
                                <img className="w-4 h-4 object-cover" src={ BackIcon } alt="" />
                            </button>
                        </div>
                    }
                    {/* search bar */}
                    {
                        ((showSearch &&  screenSize < 4) || screenSize > 3) &&
                        <div className={`${ showSearch && screenSize < 4 ? "w-full mr-3" : "w-8/12" } relative flex h-10 items-center justify-center shadow-md shadow-zinc-950 rounded-3xl bg-zinc-600`}>
                            <div className="absolute flex ml-6 left-0 right-0 items-start justify-left pointer-events-none">
                                <img className="w-6" src={ SearchIcon } alt="" />
                            </div>
                            <input 
                                className="w-full pl-16 xl:pl-28 pr-28 h-full xl:h-10 rounded-3xl bg-transparent xl:text-lg text-zinc-100 placeholder:text-zinc-400 xl:text-center pointer-events-auto" 
                                value={ searchQuery } onChange={ (e) => setSearchQuery(e.target.value) }
                                onKeyDown={ e => handleEnterKey(e) }
                                type="text" placeholder="Search LUTO"
                                ref={ searchRef }
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
                    {/* nav bar */}
                    {
                        !showSearch && screenSize < 4 &&
                        <div className="flex w-fit flex-shrink-0 xl:w-2/12 h-full justify-end items-center">
                            {
                                !showSearch && screenSize < 4 &&
                                <div className="flex w-fit h-full mr-0 sm:mr-3"> 
                                    <button className="px-3" onClick={ () => { 
                                            setShowSearch(true)
                                        }}
                                    >
                                        <img className="w-6 object-cover" src={ SearchIcon } alt="" />
                                    </button>
                                </div>
                            }
                            <div className="flex w-fit h-full justify-end items-center"> 
                                <button className="p-3" onClick={ () => setIsFilterShown(!isFilterShown) }>
                                    <img className="w-6 object-cover" src={ FilterIcon } alt="" />
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
        </div>
    )
}

export default NavbarTop