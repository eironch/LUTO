import React, { useState, useEffect } from 'react'

function NavbarRecipe({
    recipeTabShown, setRecipeTabShown
}) {
    const [lastScrollY, setLastScrollY] = useState(0)
    return (
        <div className="absolute z-40 flex xl:grid gap-3 w-full h-16 xl:h-fit" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="grid grid-cols-2 col-span-11 w-full py-0 pointer-events-auto bg-zinc-900 border-b border-zinc-800">
                <div className={`${ recipeTabShown === "Overview" ? "border-orange-500" : "border-zinc-900" } flex justify-center items-center border-b-2`}>
                    <button className="flex flex-col gap-1 justify-center items-center" onClick={ () => setRecipeTabShown("Overview") }>
                        <p className="text-base text-zinc-100 font-semibold">Overview</p>
                    </button>
                </div>
                <div className={`${ recipeTabShown === "Instructions" ? "border-orange-500" : "border-zinc-900" } flex justify-center items-center border-b-2`}>
                    <button className="flex flex-col gap-1 justify-center items-center" onClick={ () => setRecipeTabShown("Instructions") }>
                        <p className="text-base text-zinc-100 font-semibold">Instructions</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NavbarRecipe