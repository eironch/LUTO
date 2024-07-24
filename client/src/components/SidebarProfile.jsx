import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import ProfileIcon from '../assets/profile-icon.svg'
import SettingsIcon from '../assets/settings-icon.svg'

function SidebarProfile({
    user, authorName,
    screenSize
}) {
    const [isFollowed, setIsFollowed] = useState()
    const [followCount, setFollowCount] = useState(0)
    const [followers, setFollowers] = useState()
    const [authorBio, setAuthorBio] = useState('')
    const [authorProfilePicture, setAuthorProfilePicture] = useState()

    function handleFollowUser() {
        setIsFollowed(!isFollowed)

        axios.post(`${ process.env.REACT_APP_API_URL || 'http://172.20.10.3:8080' }/follow-user`, { userId: user.userId, authorName })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setIsFollowed(res.data.payload.isFollowed)
                setFollowCount(res.data.payload.followCount)
                setFollowers(res.data.payload.followers)
            })
            .catch(err => {
                console.log(err)
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)

                setIsFollowed(!isFollowed)
            })
    }

    function handleAuthorInfo() {
        axios.get(`${ process.env.REACT_APP_API_URL || 'http://172.20.10.3:8080' }/get-author-info`, { params: { userId: user.userId, authorName } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setIsFollowed(res.data.payload.isFollowed)
                setFollowCount(res.data.payload.followCount)
                setFollowers(res.data.payload.followers)
                setAuthorProfilePicture(res.data.payload.profilePicture)
                setAuthorBio(res.data.payload.bio)
            })
            .catch(err => {
                console.log(err)
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    useEffect(() => {
        setIsFollowed()
        setFollowCount()
        setFollowers()
        setAuthorProfilePicture()
        setAuthorBio()
        handleAuthorInfo()
    }, [authorName])

    return (
        <div className="xl:grid pl-3 pt-3 xl:pt-0 pb-0 pr-0 w-full xl:h-full overflow-hidden" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="flex flex-col gap-3 text-zinc-100 col-span-4 pointer-events-auto overflow-y-hidden xl:overflow-y-scroll overflow-x-hidden scrollable-div">
                {/* user */}
                <div className="flex flex-row p-6 gap-6 items-center text-2xl rounded-3xl bg-zinc-900">
                    <img className="w-28 h-28 aspect-1 rounded-full object-cover" src={ authorProfilePicture || ProfileIcon } alt="" />
                    <div className="grid grid-row-2 w-full gap-3 overflow-hidden">
                        <div className="flex flex-col w-full gap-3">
                            <div className="flex items-center">
                                <p className="px-1 w-full font-semibold line-clamp-1 overflow-hidden">
                                    { authorName }
                                </p>
                                {
                                    authorName === user.username &&
                                    <Link to="/settings" className="p-3 rounded-3xl hover:bg-zinc-500">
                                        <img className="w-8" src={ SettingsIcon } alt="" />
                                    </Link>
                                }
                            </div>
                            {
                                isFollowed !== undefined &&
                                user.username !== authorName &&
                                <button className={`${ isFollowed ? "text-zinc-400 border-2 border-orange-500 hover:border-orange-400" : "bg-orange-500 hover:bg-orange-400" } w-fit h-fit py-1 px-6 rounded-3xl text-lg text-center font-semibold gap-4 overflow-hidden`} onClick={ () => { handleFollowUser() } }>
                                    {
                                        isFollowed ?
                                        "Unfollow"
                                        :
                                        "Follow"
                                    }
                                </button>
                            }
                        </div>
                        {
                            followCount !== undefined &&
                            <p className="px-1 text-lg line-clamp-1">
                                { followCount } followers
                            </p>
                        }
                    </div>
                </div>
                {/* bio */}
                {
                    authorBio &&
                    <div className="flex flex-col gap-3 p-6 rounded-3xl bg-zinc-900">
                        <p className="text-2xl font-semibold">Bio</p>
                        <p className="w-full">
                            { authorBio }                        
                        </p>
                    </div>
                }
                {/* followers */}
                {
                    followers &&
                    followers.length > 0 &&
                    <div className="flex flex-col gap-3 p-3 pb-0 xl:mb-3 rounded-3xl bg-zinc-900">
                        <p className="text-2xl px-3 pt-3 font-semibold">Followers</p>
                        <div className="flex flexl-row xl:flex-col gap-3  overflow-x-scroll scrollable-div">
                            {
                                followers.map((follower, index) => 
                                    <Link to={`/${ follower.username }`} className="flex flex-row items-center min-w-fit p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500" key={ index }>
                                        <img className="w-16 h-16 aspect-1 rounded-full object-cover" src={ follower.profilePicture || ProfileIcon } alt="" />
                                        <p>{ follower.username }</p>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default SidebarProfile
