import React from 'react'

import GivePointNegativeIcon from '../assets/give-point-negative-icon.svg'
import GivenPointNegativeIcon from '../assets/given-point-negative-icon.svg'
import GivePointPositiveIcon from '../assets/give-point-positive-icon.svg'
import GivenPointPositiveIcon from '../assets/given-point-positive-icon.svg'

function PointSection(p) {
    const handleGivePoint = p.handleGivePoint
    const pointStatus = p.pointStatus
    const points = p.points
    
    return (
        <div className="flex justify-end items-center h-fit rounded-3xl bg-zinc-600">
            <button className="flex justify-end items-center p-3 rounded-3xl hover:bg-zinc-500" onClick={ () => { handleGivePoint("negative") } }>
                <img className="min-w-10 w-10" src={ pointStatus === "negative" ? GivenPointNegativeIcon : GivePointNegativeIcon } alt="" />
            </button>
            <div className="text-zinc-100 text-lg font-semibold line-clamp-1">
                { 
                    points ?
                    <>
                        { points }<p className="hidden sm:block">&nbsp;pts.</p>
                    </>
                    :
                    <>
                        0<p className="hidden sm:block">&nbsp;pts.</p>
                    </>
                }
            </div>
            <button className="flex justify-end items-center p-3 rounded-3xl hover:bg-zinc-500" onClick={ () => { handleGivePoint("positive") } }>
                <img className="min-w-10 w-10" src={ pointStatus === "positive" ? GivenPointPositiveIcon : GivePointPositiveIcon } alt="" />
            </button>
        </div>
    )
}

export default PointSection