import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT 

app.use('/api/v1/auth', authRoutes)

app.listen(PORT, () => {
    console.log("Server running on this " + PORT)
})