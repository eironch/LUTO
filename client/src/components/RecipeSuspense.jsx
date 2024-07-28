import React from 'react'

function RecipeSuspense({ screenSize }) {
    return (
        <>
            {
                screenSize < 2 &&
                <div className="flex flex-col mt-3 w-full rounded-3xl bg-zinc-900">
                    <span className="mx-3 my-3 h-20 rounded-3xl bg-zinc-600"></span>
                    <div className="flex flex-row w-full col-span-4 rounded-3xl p-2 shadow-zinc-950 shadow-right bg-zinc-600">
                        <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden"></div>
                    </div>
                    <div className="col-span-8 flex flex-col">
                        <div className="flex flex-col w-full h-full">
                            <span className="mx-3 mt-3 h-20 rounded-3xl bg-zinc-600"></span>
                            <div className="flex flex-row mx-3 my-3 gap-3 h-20 rounded-3xl">
                                <span className="w-full h-full rounded-3xl bg-zinc-600"></span>
                                <span className="w-full h-full rounded-3xl bg-zinc-600"></span>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                screenSize > 1 &&
                <div className="grid grid-cols-12 mt-3 w-full rounded-3xl bg-zinc-900">
                    <div className="flex flex-row w-full col-span-4 rounded-3xl p-2 shadow-zinc-950 shadow-right bg-zinc-600">
                        <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden"></div>
                    </div>
                    <div className="col-span-8 flex flex-col">
                        <div className="flex flex-col w-full h-full">
                            <span className="mx-6 mt-6 h-32 rounded-3xl bg-zinc-600"></span>
                            <span className="mx-6 mt-3 h-full bg-zinc-600 rounded-3xl text-lg"></span>
                            <div className="flex flex-row mx-6 mb-6 mt-3 gap-6 h-32 rounded-3xl">
                                <span className="w-full h-full rounded-3xl bg-zinc-600"></span>
                                <span className="w-full h-full rounded-3xl bg-zinc-600"></span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default RecipeSuspense