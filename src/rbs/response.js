const grpc = require("@grpc/grpc-js")
const { NotifyResponse } = require("../pb/integratedapp_pb")
const googleProtobufStructPb = require("google-protobuf/google/protobuf/struct_pb.js")

/**
 * The response object is a wrapper around the
 * gRPC callback function.
 */
class Response {
    /**
     * Initiate the response object.
     * 
     * @param {string} operationKey - The request operation key.
     * @param {Function} callback - The callback function.
     */
    constructor(operationKey, callback) {
        this._operationKey = operationKey
        this._callback = callback
    }

    /**
     * Send a response to the client with the provided
     * code, operation key and payload.
     * 
     * @param {number} code - The response code.
     * @param {object|string} payload - The payload data.
     */
    send(code, payload) {
        // handle error messages
        if (code >= 400) {
            this._callback({
                code: code,
                status: grpc.status.INTERNAL,
                message: payload,
            })
        } else {
            // init the notify response data
            const response = new NotifyResponse()

            // set operation key
            response.setOperationKey(this._operationKey)

            // set payload
            response.setPayload(googleProtobufStructPb.Struct.fromJavaScript(payload))

            // handle ok responses
            this._callback(null, response)
        }
    }
}

// export the response
module.exports = Response
