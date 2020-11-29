/**
 * Defines the client response object
 */
class Response {
    /**
     * Initiate the response obejct.
     * 
     * @param {NotifyResponse} response - The response from the server.
     */
    constructor(response) {
        this._response = response
    }

    /**
     * Returns the operation key of the response
     * from the server response.
     */
    get operationKey() {
        return this._response.getOperationKey()
    }

    /**
     * Returns the payload as JS object from 
     * the server response.
     */
    get payload() {
        return this._response.getPayload().toJavaScript()
    }
}

// export class
module.exports = Response
