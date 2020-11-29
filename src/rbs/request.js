/**
 * The request object is a wrapper to the
 * gRPC call object.
 */
class Request {
    /**
     * Initiate the request object.
     * 
     * @param {ServerUnaryRequest} call - The unary request.
     */
    constructor(call) {
        this._call = call
    }

    /**
     * Return the headers from the request
     * metadata
     */
    get headers() {
        return this._call.metadata.getMap()
    }

    /**
     * Returns the operation key of the request
     * from the call data
     */
    get operationKey() {
        return this._call.request.getOperationKey()
    }

    /**
     * Returns the request payload formatted as a
     * javascript object.
     */
    get payload() {
        return this._call.request.getPayload().toJavaScript()
    }
}

// export the request class
module.exports = Request
