import React from 'react'

function NavbarRecipe({
    recipeTabShown, setRecipeTabShown
}) {
    return (
        <div className="absolute z-40 flex xl:grid gap-3 w-full h-16 xl:h-fit" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="grid grid-cols-2 col-span-11 w-full py-0 pointer-events-auto bg-zinc-900 border-b border-zinc-800">
                <div className={`${ recipeTabShown === "Overview" ? "text-orange-400 border-orange-500" : "text-zinc-100 border-zinc-900" } flex justify-center items-center border-b-2`}>
                    <button className="flex flex-col gap-1 w-full h-full justify-center items-center" onClick={ () => setRecipeTabShown("Overview") }>
                        <p className="text-base  font-semibold">Overview</p>
                    </button>
                </div>
                <div className="absolute flex inset-0 w-full h-full justify-center items-center pointer-events-none">
                    <span className="w-0.5 h-10 bg-zinc-800"></span>
                </div>
                <div className={`${ recipeTabShown === "Instructions" ? "text-orange-400 border-orange-500" : "text-zinc-100 border-zinc-900" } flex justify-center items-center border-b-2`}>
                    <button className="flex flex-col gap-1 w-full h-full justify-center items-center" onClick={ () => setRecipeTabShown("Instructions") }>
                        <p className="text-base font-semibold">Instructions</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NavbarRecipe