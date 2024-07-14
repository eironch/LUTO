import React from 'react'

import RemoveIcon from '../assets/remove-icon.png'

function LoadingModal(p) {
    const setShowModal = p.setShowModal
    const confirmAction = p.confirmAction
    const title = p.title

    return (
        <div className="absolute inset-0 grid place-items-center h-screen pt-3 text-zinc-100 bg-zinc-950 bg-opacity-80 overflow-y-scroll scrollable-div" 
            onMouseDownCapture={ e => { 
                    const isOutsideModal = !e.target.closest('.model-inner')

                    if (isOutsideModal) {
                        setShowModal(false)
                    }
                } 
            }
        >
            <div className="flex flex-col gap-3 justify-center items-center w-5/12 overflow-hidden model-inner">
                {
                    title &&
                    <p className="px-6 text-xl font-semibold text-ellipsis line-clamp-1">
                        { title }
                    </p>
                }
                <div className="flex flex-col w-full rounded-3xl bg-zinc-900 overflow-hidden">
                    <div className="flex flex-row items-center p-6 gap-6 shadow-md shadow-zinc-950">
                        <img className="w-10" src={ RemoveIcon } alt="" />
                        <p className="text-2xl font-semibold">
                            Confirm Recipe Removal
                        </p>
                    </div>
                    {/* feedback input */}
                    <div className="flex flex-row p-6 gap-3 items-center text-lg font-semibold text-red-600 text-center">
                        <p className="">
                            Make sure to thoroughly check whether it goes against our content policy. 
                            By removing this, your user ID will be saved as the remover.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 p-6 pt-3 w-full">
                        <div>
                            <button className="p-3 w-32 text-lg font-bold bg-zinc-600 rounded-3xl hover:bg-zinc-500" onClick={ () => { setShowModal(false) } }>
                                Cancel
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button className="p-3 w-32 text-lg font-bold bg-red-700 rounded-3xl hover:bg-red-600"  onClick={ () => { confirmAction() } }>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingModal