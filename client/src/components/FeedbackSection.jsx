import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Textarea from '../components/Textarea'

import ProfileIcon from '../assets/profile-icon.svg'
import MoreIcon from '../assets/more-icon.svg'
import FeedbackIcon from '../assets/feedback-icon.svg'

function Feedback(p) {
    const username = p.username
    const profilePicture = p.profilePicture
    const text = p.text
    const createdAt = p.createdAt
    const formatDate = p.formatDate

    const [formattedDate, setFormattedDate] = useState()

    useEffect(() => {
        setFormattedDate(formatDate(new Date(createdAt)))
    })

    return (
        <div className="flex flex-row gap-4">
            <div className="h-full w-12">
                <img className="w-10 h-10 aspect-1 rounded-full object-cover" src={ profilePicture || ProfileIcon } alt="" />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <div className="flex flex-row font-semibold">
                    <div className="flex flex-row items-center w-full">
                        <span>{ username }&nbsp;</span>
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

function FeedbackSection(p) {
    const user = p.user
    const formatDate = p.formatDate
    
    const recipeId = p.recipeId
    const feedbackCount = p.feedbackCount
    const setFeedbackCount = p.setFeedbackCount
    
    const [userFeedback, setUserFeedback] = useState()
    const [feedbacks, setFeedbacks] = useState()
    
    function getFeedbacks() {
        setFeedbackCount(0)

        axios.get('http://localhost:8080/get-feedbacks', { params: { recipeId } })
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

        axios.post('http://localhost:8080/submit-feedback', { userId: user.userId, recipeId, text: userFeedback })
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
        <div className="flex flex-col w-full mb-3 rounded-3xl bg-zinc-900 overflow-hidden">
            {/* header */}
            <div className="flex flex-row items-center p-6 gap-6 shadow-md shadow-zinc-950">
                <img className="w-10" src={ FeedbackIcon } alt="" />
                <p className="text-2xl font-semibold">Feedbacks</p>
                <p className="flex pr-3 text-2xl font-semibold justify-end w-full">
                    { feedbackCount > 0 && feedbackCount }
                </p>
            </div>
            {/* feedback input */}
            <div className="flex flex-row items-center p-6 -mb-3 gap-3">
                <img className="w-12 h-12 aspect-1 rounded-full object-cover" src={ user.profilePicture || ProfileIcon } alt="" />
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

export default FeedbackSection