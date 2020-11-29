/**
 * Defines the client error object
 */
class Error {
    /**
     * Initiate the error object from the response.
     * 
     * @param {*} err - Response error from the server.
     */
    constructor(err) {
        this._err = err
    }

    /**
     * Returns the error code
     */
    get code() {
        return this._err.code
    }

    /**
     * Returns the error message
     */
    get message() {
        return this._err.details
    }
}

// export class
module.exports = Error
