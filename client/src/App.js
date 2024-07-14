import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import { format, getYear } from 'date-fns'

import Auth from './pages/Auth'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Search from './pages/Search'
import Recipe from './pages/Recipe'
import Create from './pages/Create'
import Saved from './pages/Saved'
import Popular from './pages/Popular'

import Modal from './components/Modal'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [isLoading, setIsLoading] = useState(true) 
  const [user, setUser] = useState({ username: '', userId: '', profilePicture: '', bio: ''})
  const [modalMessage, setModalMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentTab, setCurrentTab] = useState('Home')
  const [filters, setFilters] = useState()
  const filtersRef = useRef(filters)
  const [searchQuery, setSearchQuery] = useState("")
  const systemTags = [
    'American',
    'Appetizer',
    'Baking',
    'Barbecue',
    'Beans',
    'Beef',
    'Breakfast',
    'Brunch',
    'Chinese',
    'Chicken',
    'Christmas',
    'Dessert',
    'Difficult',
    'Dinner',
    'Dairy-Free',
    'Easter',
    'Easy',
    'Egg-Free',
    'Fall',
    'Fish',
    'French',
    'Fruits',
    'Frying',
    'Gluten-Free',
    'Greek',
    'Grilling',
    'Halloween',
    'High-Protein',
    'Holiday',
    'Indian',
    'Italian',
    'Japanese',
    'Keto',
    'Korean',
    'Lunch',
    'Low-Carb',
    'Lentils',
    'Lunch',
    'Medium (30 to 60 minutes)',
    'Mediterranean',
    'Mexican',
    'Middle Eastern',
    'Moderate',
    'Nut-Free',
    'Party',
    'Paleo',
    'Pasta',
    'Peanut-Free',
    'Picnic',
    'Pescatarian',
    'Pork',
    'Potluck',
    'Pressure cooking',
    'Quick (under 30 minutes)',
    'Quinoa',
    'Rice',
    'Roasting',
    'Sesame-Free',
    'Shellfish-Free',
    'Side Dish',
    'Slow-cooking',
    'Snack',
    'Soy-Free',
    'Spanish',
    'Spring',
    'Steaming',
    'Summer',
    'Thai',
    'Thanksgiving',
    'Tofu',
    'Tree-Nut-Free',
    'Vegan',
    'Vegetarian',
    'Vegetables',
    'Very Quick (under 15 minutes)',
    'Winter',
    'Whole30'
  ]

  async function handleGiveRecipePoint(userId, recipeId, pointStatus) {
    return await axios.post('http://localhost:8080/give-point', { userId, recipeId, pointStatus })
      .then(res => {
        console.log('Status Code:', res.status)
        console.log('Data:', res.data)
        
        return { recipePointStatus: res.data.payload.pointStatus, points: res.data.payload.points.points }
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  function handleFlagRecipe(userId, recipeId) {
    axios.post('http://localhost:8080/flag-recipe', { userId, recipeId })
      .then(res => {
        console.log('Status Code:' , res.status)
        console.log('Data:', res.data)
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  function handleRemoveRecipe(removerUserId, recipeId) {
    axios.post('http://localhost:8080/remove-recipe', { removerUserId, recipeId })
      .then(res => {
        console.log('Status Code:' , res.status)
        console.log('Data:', res.data)
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  function handleAllowRecipe(recipeId) {
    axios.post('http://localhost:8080/allow-recipe', { recipeId })
      .then(res => {
        console.log('Status Code:' , res.status)
        console.log('Data:', res.data)
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  function handleLogOut() {
    axios.get('http://localhost:8080/log-out', { withCredentials: true })
      .then(res => {
        console.log('Status Code:' , res.status)
        console.log('Data:', res.data)

        setIsAuthenticated(false)
        setUser({ username: '', userId: ''})
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  function handleSaveFilters() {
    axios.post('http://localhost:8080/save-filters', { userId: user.userId, filters })
      .then(res => {
        console.log('Status Code:' , res.status)
        console.log('Data:', res.data)
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  function handleGetPreferences() {
    axios.get('http://localhost:8080/get-preferences', { params: { userId: user.userId } })
      .then(res => {
        console.log('Status Code:' , res.status)
        console.log('Data:', res.data)

        setFilters(res.data.payload.preferences.filters)
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  useLayoutEffect(() => {
    axios.get(`http://localhost:8080/check-auth`, { withCredentials: true })
      .then(res => {
          console.log('Status Code:' , res.status)
          console.log('Data:', res.data)
          
          setIsLoading(false)
          setUser({ 
            username: res.data.payload.username, 
            userId: res.data.payload.userId,
            accountType: res.data.payload.accountType,
            profilePicture: res.data.payload.profilePicture,
            bio: res.data.payload.bio
          })
          setIsAuthenticated(res.data.isAuthenticated)
      })
      .catch(error => {
          if (error.res) {
              console.log('Error Status:', error.res.status)
              console.log('Error Data:', error.res.data)
          } else if (error.request) {
              console.log('Error Request:', error.request)
          } else {
              console.log('Error Message:', error.message)
          }

          setIsLoading(false)
          setIsAuthenticated(false)
      })
  }, [])

  useEffect(() => {
    if (isAuthenticated && filters) {
      handleSaveFilters()
    }
  }, [filters])

  useEffect(() => {
    if (isAuthenticated) {
      handleGetPreferences()
    }
  }, [isAuthenticated])

  function calculateDiffInTime(dateNow, pastDate, unitsOfTime) {
    const diffInMilliseconds = dateNow - pastDate
    const diffInTime = Math.floor(diffInMilliseconds / (1000 * unitsOfTime))
    
    return diffInTime
  }

  function formatDate(dateCreated) {
    const dateNow = new Date()
    
    if (getYear(dateCreated) > getYear(dateNow)) {
      return format(dateCreated, 'PP')
    }
    
    const diffInDays = calculateDiffInTime(dateNow, dateCreated, 60 * 60 * 24)
    if (diffInDays >= 7) {
      return format(dateCreated, 'MMMM d')
    }

    if (diffInDays > 0) {
      return `${ diffInDays } ${ diffInDays === 1 ? 'day ago' : 'days ago' }`
    }
    
    const diffInHours = calculateDiffInTime(dateNow, dateCreated, 60 * 60)
    if (diffInHours > 0) {
      return `${ diffInHours } ${ diffInHours === 1 ? 'hour ago' : 'hours ago' }`
    }

    const diffInMinutes = calculateDiffInTime(dateNow, dateCreated, 60)
    if (diffInMinutes > 0) {
      return `${ diffInMinutes } ${ diffInMinutes === 1 ? 'minute ago' : 'minutes ago' }`
    }

    const diffInSeconds = calculateDiffInTime(dateNow, dateCreated)
    if (diffInSeconds > 0) {
      return `${ diffInSeconds } ${ diffInSeconds === 1 ? 'second ago' : 'seconds ago' }`
    }

    return 'just now'
  }

  return (
    <>
      {
        isLoading? 
        <></>
        :
        isAuthenticated ?
        <>
            <Routes>
              <Route path="/home" element={ 
                  <Home
                    setIsAuthenticated={ setIsAuthenticated } user={ user } 
                    currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                    filters={ filters } setFilters={ setFilters } 
                    filtersRef={ filtersRef } handleGiveRecipePoint={ handleGiveRecipePoint } 
                    formatDate={ formatDate } searchQuery={ searchQuery } 
                    setSearchQuery={ setSearchQuery } handleFlagRecipe={ handleFlagRecipe } 
                    handleRemoveRecipe={ handleRemoveRecipe } handleAllowRecipe={ handleAllowRecipe } 
                    handleLogOut={ handleLogOut } systemTags={ systemTags }
                  />
                }
              />
              <Route path="/:authorName" element={ 
                  <Profile 
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab } handleGiveRecipePoint={ handleGiveRecipePoint } 
                    formatDate={ formatDate } searchQuery={ searchQuery } 
                    setSearchQuery={ setSearchQuery } handleRemoveRecipe={ handleRemoveRecipe } 
                    handleAllowRecipe={ handleAllowRecipe } handleFlagRecipe={ handleFlagRecipe }
                  />
                }
              />
              <Route path="/settings" element={ 
                  <Settings 
                    user={ user } setUser={ setUser }
                    currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                    handleLogOut={ handleLogOut } setShowModal={ setShowModal } 
                    setModalMessage={ setModalMessage } 
                  />
                } 
              />
              <Route path="/search" element={ 
                  <Search 
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab } filters={ filters }
                    setFilters={ setFilters } formatDate={ formatDate }
                    handleGiveRecipePoint={ handleGiveRecipePoint } handleFlagRecipe={ handleFlagRecipe }
                    searchQuery={ searchQuery } setSearchQuery={ setSearchQuery }
                    handleRemoveRecipe={ handleRemoveRecipe } handleAllowRecipe={ handleAllowRecipe }
                    handleLogOut={ handleLogOut } systemTags={ systemTags }
                  /> 
                } 
              />
              <Route path="/create" element={ 
                  <Create
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab } systemTags={ systemTags }
                  />
                } 
              />
              <Route path="/recipe/:recipeId" element={ 
                  <Recipe 
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab } formatDate={ formatDate }
                    handleGiveRecipePoint={ handleGiveRecipePoint }
                  /> 
                } 
              />
              <Route path="/saved" element={ 
                  <Saved 
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab } filters={ filters }
                    setFilters={ setFilters } formatDate={ formatDate }
                    filtersRef={ filtersRef } handleGiveRecipePoint={ handleGiveRecipePoint } 
                    handleFlagRecipe={ handleFlagRecipe } handleLogOut={ handleLogOut }
                    systemTags={ systemTags }
                  /> 
                } 
              />
              <Route path="/popular" element={ 
                  <Popular 
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab } filters={ filters }
                    setFilters={ setFilters } formatDate={ formatDate }
                    filtersRef={ filtersRef } handleGiveRecipePoint={ handleGiveRecipePoint } 
                    handleFlagRecipe={ handleFlagRecipe } handleLogOut={ handleLogOut }
                    systemTags={ systemTags }
                  /> 
                } 
              />
              <Route path="/" element={ 
                  <Navigate to="/home" />
                } 
              />
            </Routes>
        </>
        :
        <Auth 
          isAuthenticated={ isAuthenticated } setIsAuthenticated={ setIsAuthenticated } 
          user={ user } setUser={ setUser }    
        />
      }
      <Modal 
        showModal={ showModal } setShowModal={ setShowModal } 
        modalMessage={ modalMessage } setModalMessage={ setModalMessage } 
      />
    </>
  )
}

export default App
