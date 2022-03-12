const responseMessage = (response, isSuccess = true) => {
    return (
        {
            status: isSuccess ? "success" : "error",
            response: response
        }
    )
}


module.exports = responseMessage