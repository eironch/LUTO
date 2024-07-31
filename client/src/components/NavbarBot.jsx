import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import HomeIcon from '../assets/home-icon.svg'
import PopularIcon from '../assets/popular-icon.svg'
import SavedIcon from '../assets/saved-icon.svg'
import CreateIcon from '../assets/create-icon.svg'
import ProfileIcon from '../assets/profile-icon.svg'

function NavbarBot({ 
    user, currentTab, 
    setConfirmation
}) {
    const { authorName } = useParams()
    const navigate = useNavigate()

    return (
        <div className="absolute z-[60] flex bottom-0 left-0 right-0 p-0 pointer-events-none">
            <div className="flex w-full h-dvh p-0 justify-center items-end">
                <div className="relative flex w-full min-h-16 h-16 p-1 gap-3 bg-zinc-900 pointer-events-auto border-t border-zinc-800">
                    <button className={`${ currentTab==="Home" && "bg-zinc-600" } flex flex-col justify-center items-center gap-2 p-2 overflow-hidden w-full rounded-3xl hover:bg-zinc-500`} onClick={ () => currentTab !== "Create" ? navigate("/home") : setConfirmation({ shown: "exit", destination: "/home" }) }>
                        <img className="w-7" src={ HomeIcon } alt="" />
                    </button>
                    <button className={`${ currentTab==="Popular" && "bg-zinc-600" } flex flex-col justify-center items-center gap-2 p-2 overflow-hidden w-full rounded-3xl hover:bg-zinc-500`} onClick={ () => currentTab !== "Create" ? navigate("/popular") : setConfirmation({ shown: "exit", destination: "/popular" }) }>
                        <img className="w-7" src={ PopularIcon } alt="" />
                    </button>
                    <button className={`${ currentTab==="Create" && "bg-zinc-600" } flex flex-col justify-center items-center gap-2 p-2 overflow-hidden w-full rounded-3xl hover:bg-zinc-500`} onClick={ () => currentTab !== "Create" && navigate("/create") }>
                        <img className="w-7" src={ CreateIcon } alt="" />
                    </button>
                    <button className={`${ currentTab==="Saved" && "bg-zinc-600" } flex flex-col justify-center items-center gap-2 p-2 overflow-hidden w-full rounded-3xl hover:bg-zinc-500`} onClick={ () => currentTab !== "Create" ? navigate("/saved") : setConfirmation({ shown: "exit", destination: "/saved" }) }>
                        <img className="w-7" src={ SavedIcon } alt="" />
                    </button>
                    <button className={`${ currentTab==="Profile" && authorName === user.username && "bg-zinc-600" } flex flex-col justify-center items-center gap-2 p-2 overflow-hidden w-full rounded-3xl hover:bg-zinc-500`} onClick={ () => currentTab !== "Create" ? navigate(`/${ user.username }`) : setConfirmation({ shown: "exit", destination: `/${ user.username }` }) }>
                        <img className="w-7 rounded-3xl" src={ user.profilePicture  || ProfileIcon } alt="" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NavbarBot