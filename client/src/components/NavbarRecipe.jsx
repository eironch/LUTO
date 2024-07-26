import React, { useState, useEffect } from 'react'

function NavbarRecipe({
    scrollDivRef, isNavbarRecipeShown,
    setIsNavbarRecipeShown, recipeTabShown, 
    setRecipeTabShown
}) {
    const [lastScrollY, setLastScrollY] = useState(0)

    function handleScroll() {
        const currentScrollY = scrollDivRef.current.scrollTop
        const scrollDifference = currentScrollY - lastScrollY
        
        if (currentScrollY < 80) {
            setIsNavbarRecipeShown(true)
        }

        if (scrollDifference > 10 && currentScrollY > 100) {
            setIsNavbarRecipeShown(false)
        } else if (scrollDifference < -10) {
            setIsNavbarRecipeShown(true)
        }

        setLastScrollY(currentScrollY)
    }

    useEffect(() => {
        if (!scrollDivRef.current) {
            return
        }
        scrollDivRef.current.addEventListener('scroll', handleScroll)
        
        return () => {
            if (!scrollDivRef.current) {
                return
            }

            scrollDivRef.current.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY, scrollDivRef, recipeTabShown])

    return (
        <div className={`${ isNavbarRecipeShown ? "translate-y-0" : "-translate-y-full" } absolute z-40 flex xl:grid gap-3 w-full h-20 xl:h-fit overflow-hidden pointer-events-none transform transition-transform duration-300 ease-in-out`} style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="grid grid-cols-2 col-span-11 w-full px-3 py-0 pointer-events-auto bg-zinc-900 border-b border-zinc-800">
                <div className="flex justify-center items-center">
                    <button className="flex flex-col gap-1 justify-center items-center" onClick={ () => setRecipeTabShown("Overview") }>
                        <p className="text-base text-zinc-100 font-semibold">Overview</p>
                    </button>
                </div>
                <div className="flex justify-center items-center">
                    <button className="flex flex-col gap-1 justify-center items-center" onClick={ () => setRecipeTabShown("Instructions") }>
                        <p className="text-base text-zinc-100 font-semibold">Instructions</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NavbarRecipe