import { app } from "./app"

const port = process.env.PORT || 3003

const server = app.listen(port, () => {
    console.log(`App iniciado na porta ${port}`)
})

process.on("SIGINT", () => {
    server.close()
    console.log("App finalizado")
})