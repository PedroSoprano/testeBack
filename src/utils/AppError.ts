class AppError extends Error {
    statusCode: number
    error: string | undefined

    constructor(message: string, statusCode: number = 400, error: boolean = false){
        super()
        this.message = message
        this.statusCode = statusCode
    }
}

export default AppError