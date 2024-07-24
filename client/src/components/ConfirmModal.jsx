import React from 'react'

function ConfirmModal(p) {
    const setShowModal = p.setShowModal
    const confirmAction = p.confirmAction
    const title = p.title
    const headerText = p.headerText
    const bodyText = p.bodyText
    const icon = p.icon
    const isDanger = p.isDanger

    return (
        <div className="absolute inset-0 grid place-items-center h-screen pt-3  text-zinc-100 bg-zinc-950 bg-opacity-70 overflow-y-scroll scrollable-div" 
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
                    <p className="px-6 text-2xl font-semibold text-ellipsis line-clamp-1">{ title }</p>
                }
                <div className="flex flex-col w-full rounded-3xl bg-zinc-900 overflow-hidden">
                    <div className="flex flex-row items-center p-6 gap-6 shadow-md shadow-zinc-950">
                        <img className="w-8" src={ icon } alt="" />
                        <p className="text-2xl font-semibold">
                            { headerText }
                        </p>
                    </div>
                    {/* feedback input */}
                    <div className={`${ isDanger ? "text-red-600" : "text-zinc-100" } flex flex-row p-12 gap-3 items-center text-lg font-semibold text-center`}>
                        <p className="w-full">
                            { bodyText }
                        </p>
                    </div>
                    <div className="grid grid-cols-2 p-6 pt-0 w-full">
                        <div>
                            <button className="p-3 w-32 text-lg font-bold bg-zinc-600 rounded-3xl hover:bg-zinc-500" onClick={ () => { setShowModal(false) } }>
                                Cancel
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button className={`${ isDanger ? "bg-red-700 hover:bg-red-600" : "bg-zinc-600 hover:bg-zinc-500" } p-3 w-32 text-lg font-bold rounded-3xl`}  onClick={ () => { confirmAction() } }>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal