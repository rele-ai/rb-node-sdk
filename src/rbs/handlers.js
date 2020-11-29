const Request = require("./request")
const Response = require("./response")

/**
 * NotifyHandler manages the incoming
 * requests per operation key.
 *
 * @param {object} operations - The handler operations.
 * @param {object} serverConfs - The server configs.
 * @returns {object} - gRPC handler callback.
 */
module.exports.notifyHandler = (operations, serverConfs) => ({
    /**
     * Handle notify request based on the operation key
     * data provided in the request.
     */
    notify: (call, callback) => {
        // define the request object
        let request = new Request(call)
    
        // define the response object
        let response = new Response(request.operationKey, callback)
    
        // execute middlewares
        for (const mw of Object.values(serverConfs.middlewares)) {
            // execute middleware and stop handler in case of
            // blocked request
            if (mw(request, response)) {
                return
            }
        }
    
        // iterate over the operations and register them
        return operations[request.operationKey](request, response)
    }    
})