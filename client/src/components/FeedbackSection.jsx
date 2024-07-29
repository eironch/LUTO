import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import Textarea from '../components/Textarea'

import ProfileIcon from '../assets/profile-icon.svg'
import RemoveIcon from '../assets/remove-icon.svg'
import FeedbackIcon from '../assets/feedback-icon.svg'

function FeedbackSection({
    user, formatDate, 
    recipeId, feedbackCount, 
    setFeedbackCount, setShowModal,
    currentTab
}) {
    const [userFeedback, setUserFeedback] = useState()
    const [feedbacks, setFeedbacks] = useState()

    function getFeedbacks() {
        setFeedbackCount(0)

        axios.get(`${ process.env.REACT_APP_API_URL || 'http://172.20.10.3:8080' }/get-feedbacks`, { params: { recipeId } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setFeedbackCount(feedbackCount + 1)
                setFeedbacks(res.data.payload.feedbacks)
                setFeedbackCount(res.data.payload.feedbackCount.feedbackCount)
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function submitFeedback() {
        setUserFeedback('')

        axios.post(`${ process.env.REACT_APP_API_URL || 'http://172.20.10.3:8080' }/submit-feedback`, { userId: user.userId, recipeId, text: userFeedback })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)

                getFeedbacks()
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    useEffect(() => {
        getFeedbacks()
    }, [])

    return (
        <div className={`${ currentTab === "Recipe" ? "xl:w-full" : "md:w-10/12 xl:w-5/12" } flex flex-col w-full mb-3 rounded-3xl bg-zinc-900 overflow-hidden model-inner`}>
            {/* header */}
            <div className="flex items-center p-6 gap-3 shadow-md shadow-zinc-950">
                <div className="flex gap-6 items-center w-full">
                    <img className="w-10" src={ FeedbackIcon } alt="" />
                    <p className={`${ currentTab !== "Recipe" && "hidden sm:block" } text-2xl font-semibold`}>Feedbacks</p>
                    <p className="flex pr-3 text-2xl font-semibold sm:justify-end w-full">
                        { feedbackCount > 0 && feedbackCount }
                    </p>
                </div>
                {
                    currentTab !== "Recipe" &&
                    <div className="flex flex-grow justify-end">
                        <button className="p-3 rounded-3xl hover:bg-zinc-600" onClick={ () => setShowModal(false) }>
                            <img className="min-w-4 w-4" src={ RemoveIcon } alt=""/>
                        </button>
                    </div>
                }
            </div>
            {/* feedback input */}
            <div className={`${ feedbacks && feedbacks.length > 0 ? "-mb-6" : "-mb-3" } flex flex-row items-center p-6 gap-3`}>
                <img className="hidden sm:block w-12 h-12 aspect-1 rounded-full object-cover" src={ user.profilePicture || ProfileIcon } alt="" />
                <div className="flex flex-row w-full items-center gap-3">
                    <Textarea 
                        attribute="w-full text-justify text-md bg-zinc-600 focus:bg-zinc-600" 
                        maxLength={ 500 } value={ userFeedback || "" } setValue={ setUserFeedback }
                        placeholder="Got Feedbacks?"
                    />
                    <button className={`${ userFeedback ? "hover:bg-zinc-500 bg-zinc-600" : "bg-zinc-800" } p-3 rounded-3xl disabled:cursor-not-allowed`} 
                        disabled={ !userFeedback } onClick={ () => { submitFeedback() } }
                    >
                        Send
                    </button>
                </div>
            </div>
            {/* user feedbacks */}
            {
                feedbacks &&
                feedbacks.length > 0 ?
                <div className="flex flex-col p-6 gap-6">
                    {
                        feedbacks.map(feedback => 
                            <Feedback 
                                key={ feedback._id } username={ feedback.userId.username }
                                feedbackId={ feedback._id } text={ feedback.text } 
                                createdAt={ feedback.createdAt } formatDate={ formatDate }
                                profilePicture={ feedback.userId.profilePicture }
                            />
                        )
                    }
                </div>
                :
                <div className="pb-3"></div>
            }
        </div>
    )
}

function Feedback({
    username, profilePicture,
    text, createdAt,
    formatDate
}) {
    const [formattedDate, setFormattedDate] = useState()

    useEffect(() => {
        setFormattedDate(formatDate(new Date(createdAt)))
    })

    return (
        <div className="flex flex-row gap-4">
            <Link to={`/${ username }`} className="h-full w-12">
                <img className="w-10 h-10 aspect-1 rounded-full object-cover" src={ profilePicture || ProfileIcon } alt="" />
            </Link >
            <div className="flex flex-col gap-1 w-full">
                <div className="flex flex-row font-semibold">
                    <div className="flex flex-row items-center w-full">
                        <Link to={`/${ username }`} className="hover:underline">
                            { username }
                        </Link>
                        &nbsp;
                        <p className="text-sm text-zinc-400">
                            • said { formattedDate }
                        </p>
                    </div>
                </div>
                <p>{ text }</p>
            </div>
        </div>
    )
}

export default FeedbackSection