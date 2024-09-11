import express from 'express'
import dotenv from 'dotenv'

import cookieParser from 'cookie-parser'
// routes
import authRoutes from '../backend/routes/auth.route.js'
import { connectDb } from './db/db.js'
import { handleError } from './middleware/handleError.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT 
app.use(express.json())
app.use(cookieParser())
app.use(handleError)

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    connectDb()
    console.log("Server running on this " + PORT)
})