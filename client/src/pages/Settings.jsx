import React, { useState, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import NavBar from '../components/NavBar'
import ConfirmModal from '../components/ConfirmModal'
import Textarea from '../components/Textarea'
import SidebarTab from '../components/SidebarTab'

import LogOutIcon from '../assets/log-out-icon.png'
import ProfileIcon from '../assets/profile-icon.png'
import Logo from '../assets/luto-logo-gradient.png'

function Settings({
    user, setUser,
    currentTab, setCurrentTab,
    handleLogOut, setShowModal,
    setModalMessage, screenSize
}) {
    const [confirmationShown, setConfirmationShown] = useState()
    const [isChangingPassword, setIsChangingPassword] = useState()
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')
    const [bio, setBio] = useState(user.bio || '')
    const inputRef = useRef(null)
    const buttonRef = useRef(null)

    function focusInput(e, ref) {
        if (e.key === 'Enter' && ref.current) {
            ref.current.focus()
        }
    }

    function handleChangePassword() {
        axios.post(`http://localhost:8080/change-password`, { userId: user.userId, password })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)

                setPassword('')
                setPasswordAgain('')
                setIsChangingPassword(false)
                setShowModal(true)
                setModalMessage('Password successfully changed.')
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function handleFileChange(e) {
        const file = e.target.files[0]
        const maxSizeInBytes = 5 * 1024 * 1024

        if (file && file.size > maxSizeInBytes) {
            // placeholder
            return alert('File size exceeds the maximum allowed limit (5MB). Please Select a smaller file.')
        } else if (!file) {
            return
        }
        
        setUser({...user, profilePicture: URL.createObjectURL(file)})

        const formData = new FormData()

        formData.append('userId', user.userId)
        formData.append('file-profile', file)

        axios.post(`http://localhost:8080/change-profile-picture`, formData, { 
                headers: { 'Content-Type': 'multipart/form-data' } 
            })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)

                setShowModal(true)
                setModalMessage('Profile picture successfully changed.')
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function handleChangeBio() {
        axios.post(`http://localhost:8080/change-bio`, { userId: user.userId, bio })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)

                setShowModal(true)
                setModalMessage('Bio successfully changed.')
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    useLayoutEffect(() => {
        setCurrentTab('Settings')
        setIsChangingPassword(false)
    }, [])

    if (currentTab !== 'Settings') {
        return
    }

    return (
        <div className="overflow-y-scroll xl:overflow-y-hidden scrollable-div">
            {/* navbar */}
            {
                screenSize > 3 &&
                <div className="fixed flex gap-3 flex-col w-full h-svh pointer-events-none">
                    <div className="p-3 pb-0">
                        <div className="grid gap-3 w-full min-h-16 pointer-events-none" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                            {/* logo navbar middle */}
                            <div className="rounded-3xl flex items-center justify-center bg-zinc-900" style={ { gridColumn: "span 13" } }>
                                { 
                                    (currentTab === "Settings") &&
                                    <Link to="/home" className="fixed flex items-center pointer-events-auto left-1/2 transform -translate-x-1/2">
                                        <img className="px-4 w-48 " src={ Logo } alt="" />
                                    </Link>
                                }
                            </div>
                            {/* profile */}
                            <Link to={`/${ user.username }`} className={`${ user.accountType === "user" ? "bg-zinc-900 hover:bg-zinc-500" : "bg-orange-500 hover:bg-orange-400" }  col-span-2 flex items-center justify-end rounded-3xl pointer-events-auto`}>
                                { 
                                    currentTab!=="Profile" && 
                                    <p className="text-zinc-100 text-end w-full ml-3 text-xl font-semibold overflow-hidden">
                                        { user.username }
                                    </p> 
                                }
                                <img className="m-3 w-10 h-10 aspect-1 rounded-full object-cover" src={ user.profilePicture || ProfileIcon } alt="" />
                            </Link>
                        </div>
                    </div>
                    <SidebarTab currentTab={ currentTab } /> 
                </div>
            }
            <div className="h-svh">
                <div className={`${ isChangingPassword ? "xl:h-full" : "md:h-full" } flex flex-col gap-3 p-3 pr-0 xl:pr-3 bg-zinc-950`}>
                    {/* space for top navbar */}
                    {
                        screenSize > 3 &&
                        <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                            <div className="col-span-11 h-16" style={ { gridColumn:  "span 13" } }></div>
                            <div className="col-span-2"></div>     
                        </div>
                    }
                    {/* content */}
                    <div className="flex flex-col xl:grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        {
                            screenSize > 3 &&
                            <div className="col-span-2"></div>
                        }
                        <div className="flex flex-col w-full h-full p-9 gap-9 bg-zinc-900 rounded-3xl text-zinc-100" style={ { gridColumn: "span 13" } }>
                            <div className="flex flex-col gap-3">
                                <p className="text-3xl font-bold">Account Settings</p>
                                <p className="text-lg text-zinc-400 font-semibold">Account Preferences</p>
                            </div>
                            <div className="flex flex-col h-fit">
                                <p className="text-xl font-semibold">Change Password</p>
                                <div className={`${ isChangingPassword ? "flex flex-col" : "flex flex-col md:grid md:grid-cols-5" }`}>
                                    <div className="col-span-2 flex flex-row h-full p-3 px-0 items-center">
                                        <p className="text-zinc-400">Pasword must be at least 8 characters long</p>
                                    </div>
                                    <div className={`${ isChangingPassword ? "justify-center items-center" : "items-center md:items-end justify-end" } col-span-3 flex flex-col xl:flex-row gap-3`}>
                                        {
                                            isChangingPassword ?
                                            <>
                                                <div className="flex flex-col xl:flex-row w-full gap-3 p-3">
                                                    <input 
                                                        className={`${ password !== passwordAgain && "border-red-600" } bg-transparent text-center border rounded-3xl p-3 w-full caret-zinc-100 text-xl text-zinc-100`} 
                                                        value={ password } onChange={ e => { setPassword(e.target.value) } } 
                                                        type="password" placeholder="Password"
                                                        onKeyDown={ e => { focusInput(e, inputRef) } }
                                                    />
                                                    <input 
                                                        className={`${ password !== passwordAgain && "border-red-600" } bg-transparent text-center border rounded-3xl p-3 w-full caret-zinc-100 text-xl text-zinc-100`} 
                                                        value={ passwordAgain } onChange={ e => { setPasswordAgain(e.target.value) } } 
                                                        type="password" placeholder="Password Again" ref={ inputRef }
                                                        onKeyDown={ e => { focusInput(e, buttonRef) } }
                                                    />
                                                </div>
                                                <button 
                                                    className={`${ password && passwordAgain && password === passwordAgain ? "hover:bg-zinc-500" : "" } p-3 max-w-44 w-11/12 rounded-3xl bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-800`} 
                                                    disabled={ password !== passwordAgain || password === "" || passwordAgain === "" } ref={ buttonRef }
                                                    onClick={ () => { handleChangePassword() } }
                                                >
                                                    Change
                                                </button>
                                            </>
                                            :
                                            <button className="p-3 max-w-44 w-11/12 rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => { setIsChangingPassword(true) } }>
                                                Change
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p className="text-xl font-semibold">Change Profile Picture</p>
                                <div className="flex flex-col gap-3 items-center md:grid md:grid-cols-2">
                                    <img className="w-24 h-24 object-cover rounded-full" src={ user.profilePicture || ProfileIcon } alt="" />
                                    <div className="flex w-full justify-center md:justify-end items-center">
                                        <button className="flex p-3 max-w-44 w-11/12 rounded-3xl bg-zinc-700 hover:bg-zinc-500">
                                            <label className="w-full h-fit justify-center border-zinc-500 rounded-3xl cursor-pointer" htmlFor="input">
                                                Upload Image
                                            </label>
                                            <input className="hidden" id="input" type="file" accept="image/*" onChange={ e => handleFileChange(e) } />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p className="text-xl font-semibold">Change Bio</p>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="w-full">
                                        <Textarea 
                                            attribute="px-3 text-lg w-full bg-zinc-600 focus:bg-zinc-600" 
                                            maxLength={ 200 } value={ bio } setValue={ setBio } 
                                            placeholder="How would you describe yourself?" 
                                        />
                                    </div>
                                    <div className="flex md:w-64 justify-center md:justify-end">
                                        <button className="p-3 max-w-44 w-11/12 h-fit rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => { handleChangeBio() } }>
                                            Change Bio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            screenSize <= 3 &&
                            <button className="flex flex-row w-full gap-3 p-6 mb-20 xl:mb-0 items-center overflow-hidden rounded-3xl bg-zinc-900 hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950" onClick={ () => { setConfirmationShown('log out') } }>
                                <p className="w-full text-start text-red-500 text-lg font-semibold">Log Out</p>
                                <img className="w-8" src={ LogOutIcon } alt="" />
                            </button>
                        }
                    </div>
                    {/* confirm modal */}
                    {
                        confirmationShown === "log out" &&
                        <ConfirmModal 
                            setShowModal={ setConfirmationShown } confirmAction={ handleLogOut }
                            headerText={ "Confirm Log Out" } bodyText={ "Are you sure you want to log out?" }
                            icon={ LogOutIcon } isDanger={ true }
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default Settings