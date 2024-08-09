import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import LogoWhite from '../assets/luto-white-logo.svg'
import AllowIcon from '../assets/allow-icon.svg'
import RemoveIcon from '../assets/remove-icon.svg'

function Auth({
    user, setUser,
    setIsAuthenticated, screenSize
}) {
    const [action, setAction] = useState('Sign In')
    const [credsCorrection, setCredsCorrection] = useState({ message: '', affected: [] })
    const [verification, setVerification] = useState({ message: '', status: false })
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isEmailVerifying, setIsEmailVerifying] = useState(false)
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
        { ref: verifyInput5Ref, state: [verifyInput5, setVerifyInput5] }
    ]

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const passswordAgainRef = useRef(null)
    const navigate = useNavigate()
    
    function signUp() {
        axios.post(`${ process.env.REACT_APP_API_URL || 'http://localhost:8080' }/sign-up`, { username: user.username, password, email })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                if (res.status === 202) {
                    setCredsCorrection({ message: 'Username already exists. Please choose a different username.', affected: ['username', 'password'] })
                
                }

                setUser({ username: '', userId: '', accountType: '' })
                setPassword('')
                setCredsCorrection({ message: '', affected: [] })
                setVerification({ message: '', status: true })
                setAction("Sign In")
            })
            .catch(err => {
                setVerification({ message: '', status: false })

                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function signIn() {
        axios.get(`${ process.env.REACT_APP_API_URL || 'http://localhost:8080' }/sign-in`, { params: { username: user.username, password }, withCredentials: true })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                if (res.status === 202) {
                    return setCredsCorrection({ message: 'Incorrect username or password. Please try again.', affected: ['username', 'password'] })
                } 
                
                setUser({ 
                    username: res.data.payload.username, 
                    userId: res.data.payload.userId, 
                    accountType: res.data.payload.accountType,
                    profilePicture: res.data.payload.profilePicture,
                    bio: res.data.payload.bio
                })
                setIsAuthenticated(true)
                navigate('/')
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function checkAvailability() {
        axios.get(`${ process.env.REACT_APP_API_URL || 'http://localhost:8080' }/check-availability`, { params: { username: user.username, email } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)

                if (res.status === 204) {
                    setCredsCorrection({ message: 'Username and email address already exists. Please try a new one.', affected: ['username', 'email'] })
                    
                    return

                } else if (res.status === 203) {
                    setCredsCorrection({ message: 'Username already exists. Please try a new one.', affected: ['username'] })
                    
                    return

                } else if (res.status === 202) {
                    setCredsCorrection({ message: 'Email address already exists. Please try a new one.', affected: ['email'] })
                    
                    return
                }

                setIsEmailVerifying(true)
                sendVerificationCode()
                setCredsCorrection({ message: '', affected: [] })
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function sendVerificationCode() {
        axios.post(`${ process.env.REACT_APP_API_URL || 'http://localhost:8080' }/send-verification`, { email: email })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function verifyCode() {
        setVerification({ message: '', status: null })

        axios.get(`${ process.env.REACT_APP_API_URL || 'http://localhost:8080' }/verify-code`, { params: { email: email, code: verifyInputUses.map(use => use.state[0]).join('') } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)

                if (res.status === 203) {
                    return setVerification({ message: res.data.message, status: false })
                } else if (res.status === 202) {
                    return setVerification({ message: res.data.message, status: false })
                }

                signUp()
            })
            .catch(err => {
                setVerification({ message: '', status: false })

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
        if (!user.username || !password || !confirmPassword) {
            setCredsCorrection({ 
                message: 'Please provide all required details to create an account.', 
                affected: [!user.username && 'username', !email && 'email', (!password || !confirmPassword) && 'password'] 
            })

            return
        }
         
        if (!validateUsername(user.username)) {
            setCredsCorrection({ 
                message: 'Username must be 2-30 characters, starts with a letter or an underscore.', 
                affected: ['username'] 
            })
            
            return
        }

        if (password !== confirmPassword) {
            setCredsCorrection({ 
                message: 'Passwords do not match. Please re-enter your password.', 
                affected: ['password'] 
            })

            return
        }

        checkAvailability()
    }

    function handleSignIn() {
        if (!user.username || !password) {
            setCredsCorrection({ 
                message: 'Please enter both username and password to log in.', 
                affected: [!user.username && 'username', (!password || !confirmPassword) && 'password'] 
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
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setCredsCorrection({ message: '', affected: [] })
        setAction(action) 
    }

    function validateUsername(username) {
        const regex = /^[a-zA-Z_](?!.*?\.{2})[\w.]{1,28}[\w]$/
  
        return regex.test(username)
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email);
      }

    function handleVerifyInputChange(e, setInput, nextInputRef) {
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

    function focusVerifyInput() {
        verifyInputUses.some((use, index, arr) => { 
            if (!use.state[0] || index === arr.length - 1) {
                use.ref.current.focus()

                return true
            }

            return false
        })
    }

    useEffect(() => {
        if (!user.username) {
            return
        }

        if (action === 'Sign In') {
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


    useEffect(() => {
        if (!email) {
            return
        }

        if (!validateEmail(email)) {
            setCredsCorrection({ 
                message: 'Please enter a valid email address.', 
                affected: ['email'] 
            })
            
            return
        }

        setCredsCorrection({ message: '', affected: [] })
    },[email])


    useEffect(() => {
        verifyInputUses.forEach(use => {
            use.state[1]('')
        })
        setVerification({ message: '', status: false })

        if (isEmailVerifying) {
            focusVerifyInput()
        }
    }, [isEmailVerifying])

    useEffect(() => {
        if (verifyInput5) {
            verifyCode()
        }
    },[verifyInput5])

    return (
        <div className="flex flex-col xl:grid grid-cols-2 p-3 w-screen h-screen justify-center items-center bg-gradient-to-b from-orange-500 to-orange-400 gap-3 overflow-hidden">
            {
                screenSize > 3 &&
                <div className="flex flex-col mb-3 xl:mb-0 items-center justify-center overflow-hidden">
                    <img className="w-full" src={ LogoWhite }alt=""/>
                    <p className="py-1 xl:mt-3 text-zinc-100 text-xl md:text-3xl xl:text-4xl font-semibold overflow-hidden text-ellipsis line-clamp-1">
                        Community with a Recipe
                    </p>
                </div>
            }
            {
                screenSize < 4 && 
                <div className="absolute  inset-0 flex flex-col mt-3 justify-start items-center overflow-hidden">
                    <img className="w-52" src={ LogoWhite }alt=""/>
                </div>
            }
            <div className="relative z-10 flex flex-col w-full md:w-10/12 xl:w-full xl:h-full shadow-md shadow-zinc-950 bg-zinc-900 rounded-3xl justify-center py-5 mt-10 xl:mt-0">
                <div className="flex flex-col mt-3 items-center">
                    <h1 className="text-zinc-100 text-3xl md:text-5xl font-bold">{ action }</h1>
                </div>
                <div className="flex flex-col mt-10 items-center">
                    <div className="flex w-10/12 -mt-6 justify-center text-xs md:text-base text-center text-red-500">
                        { credsCorrection.message || <>&nbsp;</> }
                    </div>
                    <input 
                        className={`
                            ${credsCorrection.affected.includes('username') ? "border-red-600" : "border-zinc-600" } 
                            bg-transparent text-center border-2 rounded-3xl px-3 py-2 xl:py-3 w-10/12 caret-zinc-100 text-base md:text-xl text-zinc-100 my-3
                        `} 
                        value={ user.username } onChange={ e => { setUser({ username: e.target.value}) } } 
                        type="text" placeholder="Username"
                        onKeyDown={ e => { focusInput(e, action === "Sign Up" ? emailRef : passwordRef) } }
                    />
                    {
                        action === "Sign Up" &&
                        <input 
                            className={`
                                ${credsCorrection.affected.includes('email') ? "border-red-600" : "border-zinc-600" } 
                                bg-transparent text-center border-2 rounded-3xl px-3 py-2 xl:py-3 w-10/12 caret-zinc-100 text-base md:text-xl text-zinc-100 mb-3
                            `} 
                            value={ email } onChange={ (e) => { setEmail(e.target.value) } } 
                            type="email" placeholder="Email Address"
                            onKeyDown={ e => { handleEnterKey(e, passwordRef) } } ref={ emailRef }
                            id="email"
                        />
                    }
                    <input 
                        className={`
                            ${credsCorrection.affected.includes('password') ? "border-red-600" : "border-zinc-600" } 
                            bg-transparent text-center border-2 rounded-3xl px-3 py-2 xl:py-3 w-10/12 caret-zinc-100 text-base md:text-xl text-zinc-100 mb-3
                        `} 
                        value={ password } onChange={ (e) => { setPassword(e.target.value) } } 
                        type="password" placeholder="Password"
                        onKeyDown={ e => { handleEnterKey(e, passswordAgainRef) } } ref={ passwordRef }
                        id="password"
                    />
                    {
                        action === "Sign Up" &&
                        <input 
                            className={`
                                ${credsCorrection.affected.includes('password') ? "border-red-600" : "border-zinc-600" } 
                                bg-transparent text-center border-2 rounded-3xl px-3 py-2 xl:py-3 w-10/12 caret-zinc-100 text-base md:text-xl text-zinc-100 mb-3
                            `} 
                            value={ confirmPassword } onChange={ (e) => { setConfirmPassword(e.target.value) } } 
                            type="password" placeholder="Confirm Password"
                            onKeyDown={ e => { handleEnterKey(e) } } ref={ passswordAgainRef }
                        />
                    }
                    
                </div>
                <div className="flex flex-col items-center mt-6">
                    <div className="grid items-center w-10/12 gap-3">
                        {
                            action === "Sign In"? 
                            <button className="shadow-md shadow-zinc-950 hover:bg-zinc-500 text-base md:text-xl font-semibold rounded-3xl text-zinc-100 bg-zinc-600 p-2 w-full" onClick={ () => { handleSignIn() } }> 
                                Log In
                            </button>
                            : 
                            <button className="shadow-md shadow-zinc-950 hover:bg-zinc-500 text-base md:text-xl font-semibold rounded-3xl text-center text-zinc-100 bg-zinc-600 p-2 w-full" onClick={ () => { handleSignUp() }}> 
                                Create Account
                            </button>
                        }
                    </div>
                </div>
                <div className="flex flex-col items-center xl:mt-5 mb-5"> 
                    {
                        action === "Sign In" ? 
                        <div className="xl:grid grid-cols-3 gap-6 text-zinc-100 w-10/12">
                            <p className="text-base md:text-xl py-4 text-center overflow-hidden text-ellipsis line-clamp-2">Don't have an account?</p> 
                            <button className="shadow-md shadow-zinc-950 hover:bg-zinc-500 hover:border-zinc-500 col-span-2 text-base md:text-xl font-semibold rounded-3xl text-zinc-100 bg-transparent border-2 border-zinc-600 p-2 w-full" onClick={ () => { handleActionChange("Sign Up") } }> 
                                Sign Up
                            </button>
                        </div> 
                        :
                        <div className="xl:grid grid-cols-3 gap-6 text-zinc-100 w-10/12">
                            <p className="text-base md:text-xl py-4 text-center overflow-hidden text-ellipsis line-clamp-2">Already have an account?</p> 
                            <button className="shadow-md shadow-zinc-950 hover:bg-zinc-500 hover:border-zinc-500 col-span-2 text-base md:text-xl font-semibold rounded-3xl text-center text-zinc-100 bg-transparent border-2 border-zinc-600 p-2 w-full" onClick={ () => { handleActionChange("Sign In") } }> 
                                Sign In
                            </button>
                        </div>
                    }
                </div>
            </div>
            {
                    isEmailVerifying &&
                    <div className="absolute inset-0 z-[9999] grid place-items-center h-screen px-3 text-zinc-100 bg-zinc-950 bg-opacity-70 overflow-hidden"
                            onMouseDownCapture={ e => { 
                                if (screenSize < 4) {
                                    return
                                }

                                const isOutsideModal = !e.target.closest('.model-inner')
                                
                                if (isOutsideModal && verification.status) {
                                    setIsEmailVerifying(false)
                                }
                            } 
                        }
                    >
                        <div className={`${ verification.status ? "w-full md:w-10/12 xl:w-5/12" : "w-full md:w-10/12 xl:w-5/12 min-w-fit" } flex flex-col gap-3 justify-center items-center overflow-hidden model-inner`}>
                            <div className="flex flex-col w-full py-14 xl:py-20 xl:py-3 mx-6 xl:mx-9 gap-9 justify-center items-center rounded-3xl bg-zinc-900 overflow-hidden">
                              
                                {
                                    verification.status ?
                                    <>
                                        <div className="flex w-full px-6 justify-end">
                                            <button className="p-3 rounded-3xl hover:bg-zinc-600" onClick={ () => setIsEmailVerifying(false) }>
                                                <img className="min-w-4 w-4" src={ RemoveIcon } alt=""/>
                                            </button>
                                        </div>
                                        <p className="text-2xl mb-3 font-bold line-clamp-1">
                                            Account created!
                                        </p>
                                        <img className="w-24" src={ AllowIcon } alt="" />
                                    </>
                                    :
                                    <>
                                        <p className="text-xl md:text-2xl mb-3 font-bold">
                                            Verify Email Address
                                        </p>
                                        <div className="flex w-10/12 -mt-6 -mb-3 justify-center text-center text-red-500">
                                            { verification.message || <>&nbsp;</> }
                                        </div>
                                        <div className="flex gap-1 md:gap-2 justify-center hover:cursor-text" onClick={ () => { focusVerifyInput() }}>
                                            {
                                                verifyInputUses.map((use, index, arr) =>
                                                    <input 
                                                        className="bg-transparent text-center border-2 border-zinc-600 rounded-xl md:rounded-3xl w-[11%] md:w-20 h-16 md:h-24 caret-zinc-100 md:text-2xl xl:text-3xl font-bold text-zinc-100 pointer-events-none" 
                                                        type="text" maxLength="1" ref={ use.ref }
                                                        value={ use.state[0] } onChange={ e => { handleVerifyInputChange(e, use.state[1], index !== 5 && arr[index + 1].ref) } }
                                                        onKeyDown={ e => { handleVerifyInputKeyDown(e, index !== 0 && arr[index - 1].ref)  } } key={ index }
                                                        disabled={ verification.status === null }
                                                    />
                                                )
                                            }
                                        </div>
                                        {
                                            !verification.status &&
                                            <div className="flex flex-col md:flex-row text-sm md:text-base">
                                                <p className="text-zinc-400">
                                                    Resend verification code?&nbsp;
                                                </p>
                                                <button className="text-blue-400 hover:underline" onClick={ () => { 
                                                        verifyInputUses.forEach(use => {
                                                            use.state[1]('')
                                                        })
                                                        setVerification({ message: '', status: false })

                                                        sendVerificationCode()
                                                    }}
                                                >
                                                    Send again
                                                </button>
                                            </div>
                                        }
                                        <div className="flex w-fit flex-col md:flex-row justify-center items-center text-sm md:text-base overflow-hidden">
                                            <p className="text-zinc-400">
                                                The verification code was sent to
                                            </p>
                                            <p className="font-semibold mx-1 text-zinc-300">
                                                { email }
                                            </p>
                                            <button className="text-blue-400 hover:underline" onClick={ () => { 
                                                    setIsEmailVerifying(false) 
                                                    emailRef.current.focus()
                                                }}
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                }
        </div>
    )
}

export default Auth