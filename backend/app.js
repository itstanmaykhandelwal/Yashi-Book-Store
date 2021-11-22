const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const errorMiddleware = require("./middleware/error")

app.use(express.json())
app.use(cookieParser())

// Route Imports
const product = require("./routes/product")
const user = require("./routes/user")

app.use("/api/v1",product)
app.use("/api/v1",user)

// Middleware for error
app.use(errorMiddleware)

module.exports = app