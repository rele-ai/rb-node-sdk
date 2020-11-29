const logger = require("../utils/logger")

/**
 * Validate incoming requests from gateway.
 * 
 * @param {Request} request - Internal request object.
 * @param {Response} response - Internal response object.
 * @param {object} serverConfs - The server configs.
 */
module.exports.authorizedRequest = (request, response, serverConfs) => {
    try {
        // get auth token
        const { authorization } = request.headers
    
        // check if header exists
        if (authorization) {
            // decode header
            const [tokenType, token] = authorization.split(" ")
            const decodedToken = Buffer.from(token, "base64").toString()
            const [appId, appHash] = decodedToken.split(":")
    
            // verify token type, app id, and app hash
            if (tokenType === "Basic" && appId === serverConfs.appId && appHash === serverConfs.appHash) {
                logger.debug({ message: "access granted" })
                return true
            }
        }
    } catch (error) {
        logger.error({ message: "exception when parsing authorization header", error })
    }

    logger.info({ message: "unauthorized access" })
    response.send(401, "unauthorized access")
    return false
}
