import React from 'react'
import { Link, useParams } from 'react-router-dom'

import HomeIcon from '../assets/home-icon.svg'
import PopularIcon from '../assets/popular-icon.svg'
import SavedIcon from '../assets/saved-icon.svg'
import CreateIcon from '../assets/create-icon.svg'
import ProfileIcon from '../assets/profile-icon.svg'

function NavbarBot({ user, currentTab }) {
    const { authorName } = useParams()

    return (
        <div className="fixed z-40 flex top-0 right-0 bottom-0 left-0 p-0 pointer-events-none">
            <div className="flex w-full h-dvh p-0 justify-center items-end">
                <div className="relative flex w-full min-h-20 h-20 p-1 gap-3 bg-zinc-900 pointer-events-auto border-t border-zinc-800">
                    <Link to="/home" className={`${ currentTab==="Home" && "bg-zinc-600" } flex flex-col justify-center items-center gap-2 p-2 overflow-hidden w-full rounded-3xl hover:bg-zinc-500`}>
                        <img className="w-8" src={ HomeIcon } alt="" />
                        {/* <p className="text-zinc-100 text-xs font-semibold">Home</p> */}
                    </Link>
                    <Link to="/popular" className={`${ currentTab==="Popular" && "bg-zinc-600" } flex flex-col justify-center items-center gap-2 p-2 overflow-hidden w-full rounded-3xl hover:bg-zinc-500`}>
                        <img className="w-8" src={ PopularIcon } alt="" />
                        {/* <p className="text-zinc-100 text-xs font-semibold">Popular</p> */}
                    </Link>
                    <Link to="/create" className={`${ currentTab==="Create" && "bg-zinc-600" } flex flex-col justify-center items-center gap-2 p-2 overflow-hidden w-full rounded-3xl hover:bg-zinc-500`}>
                        <img className="w-8" src={ CreateIcon } alt="" />
                        {/* <p className="text-zinc-100 text-xs font-semibold">Create</p> */}
                    </Link>
                    <Link to="/saved" className={`${ currentTab==="Saved" && "bg-zinc-600" } flex flex-col justify-center items-center gap-2 p-2 overflow-hidden w-full rounded-3xl hover:bg-zinc-500`}>
                        <img className="w-8" src={ SavedIcon } alt="" />
                        {/* <p className="text-zinc-100 text-xs font-semibold">Saved</p> */}
                    </Link>
                    <Link to={`/${ user.username }`} className={`${ currentTab==="Profile" && authorName === user.username && "bg-zinc-600" } flex flex-col justify-center items-center gap-2 p-2 overflow-hidden w-full rounded-3xl hover:bg-zinc-500`}>
                        <img className="w-8 rounded-3xl" src={ user.profilePicture  || ProfileIcon } alt="" />
                        {/* <p className="text-zinc-100 text-xs font-semibold">Profile</p> */}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NavbarBot