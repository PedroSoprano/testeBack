import * as express from "express"
import * as cors from "cors"
import * as logger from "morgan"
import usersRoutes from "./routes/users.routes"
import { authenticateToken } from "./middlewares/auth.middleware"
import booksRoutes from "./routes/boooks.routes"
import { loginRoutes } from "./routes/login.routes"


export const app = express()

app.use(express.json())
app.use(cors())
app.use(logger("dev"))

app.use("/signin", loginRoutes)
app.use("/users", authenticateToken,usersRoutes)
app.use("/books", authenticateToken,booksRoutes)
