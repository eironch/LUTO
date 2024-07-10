import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import Logo from '../assets/luto-logo-white.png'

function Auth(p) {
    const user = p.user
    const setUser = p.setUser
    const showModal = p.showModal
    const setShowModal = p.setShowModal
    const setModalMessage = p.setModalMessage
    const setIsAuthenticated = p.setIsAuthenticated

    const [action, setAction] = useState('Sign In')
    const [credsCorrection, setCredsCorrection] = useState({ message: '', affected: [] })
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')
    const [isEmailVerifying, setIsEmailVerifying] = useState(true)
    const [verifyInput0, setVerifyInput0] = useState('')
    const [verifyInput1, setVerifyInput1] = useState('')
    const [verifyInput2, setVerifyInput2] = useState('')
    const [verifyInput3, setVerifyInput3] = useState('')
    const [verifyInput4, setVerifyInput4] = useState('')
    const [verifyInput5, setVerifyInput5] = useState('')
    const verifyInput0Ref = useRef(null)
    const verifyInput1Ref = useRef(null)
    const verifyInput2Ref = useRef(null)
    const verifyInput3Ref = useRef(null)
    const verifyInput4Ref = useRef(null)
    const verifyInput5Ref = useRef(null)
    const verifyInputUses = [
        { ref: verifyInput0Ref, state: [verifyInput0, setVerifyInput0] },
        { ref: verifyInput1Ref, state: [verifyInput1, setVerifyInput1] },
        { ref: verifyInput2Ref, state: [verifyInput2, setVerifyInput2] },
        { ref: verifyInput3Ref, state: [verifyInput3, setVerifyInput3] },
        { ref: verifyInput4Ref, state: [verifyInput4, setVerifyInput4] },
        { ref: verifyInput5Ref, state: [verifyInput5, setVerifyInput5] },
    ]
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const passswordAgainRef = useRef(null)
    const navigate = useNavigate()
    
    function createAccount() {
        axios.post(`http://localhost:8080/create-account`, { username: user.username, password })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                if (res.status === 202) {
                    setCredsCorrection({ message: 'Username already exists. Please choose a different username.', affected: ['username', 'password'] })
                
                } else if (res.status === 201) {
                    setUser({ username: '', userId: '', accountType: '' })
                    setPassword('')
                    setShowModal(true)
                    setModalMessage('Account Created!')
                    setCredsCorrection({ message: '', affected: [] })
                    setAction("Sign In")
                }
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function signIn() {
        axios.get(`http://localhost:8080/sign-in`, { params: { username: user.username, password }, withCredentials: true })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                if (res.status === 202) {
                    setCredsCorrection({ message: 'Incorrect username or password. Please try again.', affected: ['username', 'password'] })

                } else if (res.status === 200) {
                    setUser({ 
                        username: res.data.payload.username, 
                        userId: res.data.payload.userId, 
                        accountType: res.data.payload.accountType,
                        profilePicture: res.data.payload.profilePicture,
                        bio: res.data.payload.bio
                    })
                    setIsAuthenticated(true)
                    navigate('/')
                }
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function checkUsernameAvailable() {
        axios.get(`http://localhost:8080/check-username`, { params: { username: user.username } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                if (res.status === 202) {
                    setCredsCorrection({ message: 'Username already exists. Please try a new one.', affected: ['username'] })
                    
                    return
                }

                setIsEmailVerifying(true)
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function handleEnterKey(e, ref) {
        if (e.key !== 'Enter') {
            return
        }

        if (action === "Sign In") {
            if (document.activeElement) {
                document.activeElement.blur()
            }

            handleSignIn()

            return
        }

        if (e.target.id === "password" || e.target.id === "email") {
            focusInput(e, ref)

            return
        }

        if (document.activeElement) {
            document.activeElement.blur()
        }

        handleSignUp()
    }

    function handleSignUp() {
        if (!validateUsername(user.username)) {
            setCredsCorrection({ 
                message: 'Username must be 2-30 characters, starts with a letter or an underscore.', 
                affected: ['username'] 
            })
            
            return
        }

        if (!user.username || !password || !passwordAgain) {
            setCredsCorrection({ 
                message: 'Please provide all required details to create an account.', 
                affected: [!user.username && 'username', !email && 'email', (!password || !passwordAgain) && 'password'] 
            })

            return

        } else if (password !== passwordAgain) {
            setCredsCorrection({ 
                message: 'Passwords do not match. Please re-enter your password.', 
                affected: ['password'] 
            })

            return
        }

        checkUsernameAvailable()
    }

    function handleSignIn() {
        if (!user.username || !password) {
            setCredsCorrection({ 
                message: 'Please enter both username and password to log in.', 
                affected: [!user.username && 'username', (!password || !passwordAgain) && 'password'] 
            })

            return
        }

        signIn()
    }

    function focusInput(e, ref) {
        if (e.key === 'Enter' && ref.current) {
            ref.current.focus()
        }
    }

    function handleActionChange(action) {
        setUser({ username: '', userId: '' })
        setPassword('')
        setPasswordAgain('')
        setCredsCorrection({ message: '', affected: [] })
        setAction(action) 
    }

    function validateUsername(username) {
        const regex = /^[a-zA-Z_](?!.*?\.{2})[\w.]{1,28}[\w]$/
  
        return regex.test(username)
    }

    function handleVerifyInputChange(e, setInput, nextInputRef, prevInputRef) {
        const value = e.target.value

        if (!/^[0-9]?$/.test(value)) {
            return
        }

        setInput(value)

        if (!value) {
            return
        }

        if (!nextInputRef.current) {
            return
        }

        nextInputRef.current.focus()
    }

    function handleVerifyInputKeyDown(e, prevInputRef) {
        const value = e.target.value

        if (e.key !== 'Backspace' || value) {
            return
        }

        if (!prevInputRef.current) {
            return
        }

        prevInputRef.current.focus()
    }

    useEffect(() => {
        if (!user.username) {
            return
        }

        if (!validateUsername(user.username)) {
            setCredsCorrection({ 
                message: 'Username must be 2-30 characters, starts with a letter or an underscore.', 
                affected: ['username'] 
            })
            
            return
        }

        setCredsCorrection({ message: '', affected: [] })
    },[user])

    return (
        <div className="grid grid-cols-2 p-3 h-svh bg-gradient-to-b from-orange-500 to-orange-400 gap-3 overflow-hidden">
            <div className="flex flex-col items-center justify-center">
                <img className="" src={ Logo } alt=""/>
                <p className="mt-3 text-zinc-100 text-4xl overflow-hidden text-ellipsis line-clamp-1">Community with a Recipe.</p>
            </div>
            <div className="flex flex-col shadow-md shadow-zinc-950 bg-zinc-900 rounded-3xl justify-center py-5">
                <div className="flex flex-col items-center">
                    <h1 className="text-zinc-100 text-5xl font-bold">{ action }</h1>
                </div>
                <div className="flex flex-col mt-10 gap-3 items-center">
                    <p className="flex w-10/12 -my-3 justify-center text-red-500">
                        { credsCorrection.message }
                    </p>
                    <input 
                        className={`
                            ${credsCorrection.affected.includes('username') ? "border-red-600" : "border-zinc-100" } 
                            bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 my-3
                        `} 
                        value={ user.username } onChange={ e => { setUser({ username: e.target.value}) } } 
                        type="text" placeholder="Username"
                        onKeyDown={ e => { focusInput(e, action === "Sign Up" ? emailRef : passwordRef) } }
                    />
                    {
                        action === "Sign Up" &&
                        <input 
                            className={`${credsCorrection.affected.includes('email') ? "border-red-600" : "border-zinc-100" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 mb-3`} 
                            value={ email } onChange={ (e) => { setEmail(e.target.value) } } 
                            type="email" placeholder="Email"
                            onKeyDown={ e => { handleEnterKey(e, passwordRef) } } ref={ emailRef }
                            id="email"
                        />
                    }
                    <input 
                        className={`${credsCorrection.affected.includes('password') ? "border-red-600" : "border-zinc-100" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 mb-3`} 
                        value={ password } onChange={ (e) => { setPassword(e.target.value) } } 
                        type="password" placeholder="Password"
                        onKeyDown={ e => { handleEnterKey(e, passswordAgainRef) } } ref={ passwordRef }
                        id="password"
                    />
                    {
                        action === "Sign Up" &&
                        <input 
                            className={`${credsCorrection.affected.includes('password') ? "border-red-600" : "border-zinc-100" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 mb-3`} 
                            value={ passwordAgain } onChange={ (e) => { setPasswordAgain(e.target.value) } } 
                            type="password" placeholder="Password Again"
                            onKeyDown={ e => { handleEnterKey(e) } } ref={ passswordAgainRef }
                        />
                    }
                    
                </div>
                <div className="flex flex-col items-center mt-5">
                    <div className="grid items-center w-10/12 gap-3">
                        {
                            action === "Sign In"? 
                            <button className="shadow-md shadow-zinc-950 hover:bg-zinc-700 text-xl font-semibold rounded-3xl text-zinc-100 bg-zinc-600 p-3 w-full" onClick={ () => { handleSignIn() } }> 
                                Log In
                            </button>
                            : 
                            <button className="shadow-md shadow-zinc-950 hover:bg-zinc-700 text-xl font-semibold rounded-3xl text-center text-zinc-100 bg-zinc-600 p-3 w-full" onClick={ () => { handleSignUp() }}> 
                                Create Account
                            </button>
                        }
                    </div>
                </div>
                <div className="flex flex-col items-center mt-5"> 
                    {
                        action === "Sign In" ? 
                        <div className="grid grid-cols-3 gap-6 text-zinc-100 w-10/12">
                            <p className="text-xl py-4 text-center overflow-hidden text-ellipsis line-clamp-2">Don't have an account?</p> 
                            <button className="shadow-md shadow-zinc-950 hover:bg-zinc-700 col-span-2 text-xl font-semibold rounded-3xl text-zinc-100 bg-zinc-600 p-3 w-full" onClick={ () => { handleActionChange("Sign Up") } }> 
                                Sign Up
                            </button>
                        </div> 
                        :
                        <div className="grid grid-cols-3 gap-6 text-zinc-100 w-10/12">
                            <p className="text-xl py-4 text-center overflow-hidden text-ellipsis line-clamp-2">Already have an account?</p> 
                            <button className="shadow-md shadow-zinc-950 hover:bg-zinc-700 col-span-2 text-xl font-semibold rounded-3xl text-center text-zinc-100 bg-zinc-600 p-3 w-full" onClick={ () => { handleActionChange("Sign In") } }> 
                                Sign In
                            </button>
                        </div>
                    }
                </div>
            </div>
            {
                    isEmailVerifying &&
                    <div className="absolute inset-0 grid place-items-center h-screen pt-3 text-zinc-100 bg-zinc-950 bg-opacity-80 overflow-y-scroll scrollable-div"
                            onMouseDownCapture={e => { 
                                const isOutsideModal = !e.target.closest('.model-inner')

                                if (isOutsideModal) {
                                    setIsEmailVerifying(false)
                                }
                            } 
                        }
                    >
                        <div className="flex flex-col gap-3 justify-center items-center w-fit overflow-hidden model-inner">
                            <div className="flex flex-col w-full py-20 mx-6 gap-12 items-center rounded-3xl bg-zinc-900 overflow-hidden">
                                Verify Email
                                <div className="flex gap-2">
                                    {
                                        verifyInputUses.map((use, index, arr) =>
                                            <input 
                                                className="bg-transparent text-center border rounded-3xl p-3 w-16 h-20 caret-zinc-100 text-4xl text-zinc-100" 
                                                type="text" maxLength="1" ref={ use.ref }
                                                value={ use.state[0] } onChange={ e => { handleVerifyInputChange(e, use.state[1], index !== 5 && arr[index + 1].ref) } }
                                                onKeyDown={ e => { handleVerifyInputKeyDown(e, index !== 0 && arr[index - 1].ref)  } }
                                                onClick={ () => { 
                                                    arr.some(uses => { 
                                                        if (!uses.state[0]) {
                                                            uses.ref.current.focus()

                                                            return true
                                                        }  
                                                    }) 
                                                }}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
        </div>
    )
}

export default Auth