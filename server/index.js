import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import mongoose, { Types }  from 'mongoose'
import multer from 'multer'
import { bucket } from './firebaseAdmin.js'
import { v4 as uuidv4 } from 'uuid'
import { google } from 'googleapis'
import nodemailer from 'nodemailer'

import User from './models/user.js'
import Preference from './models/preference.js'
import Recipe from './models/recipe.js'
import RecipeOverview from './models/recipeOverview.js'
import Point from './models/point.js'
import Feedback from './models/feedback.js'
import Save from './models/save.js'
import Flag from './models/flag.js'
import Archive from './models/archive.js'
import Follow from './models/follow.js'
import Verification from './models/verification.js'

app.listen(config.PORT, () => {
    console.log('Connected to backend.')
}) 

app.get('/', (req, res) => {
    res.json('good mourning.')
})

console.log("1")
const app = express()
const upload = multer({ storage: multer.memoryStorage() })
const oAuth2Client = new google.auth.OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN })

app.use(express.json())
app.use(cors(
    // {origin: config.ORIGIN,
    // credentials: true}
))
app.use(cookieParser())
console.log("1")