const grpc = require("grpc")
const Error = require("./error")
const Response = require("./response")
const logger = require("../utils/logger")
const { NotifyRequest } = require("../pb/integratedapp_pb")
const { IntegratedAppsClient } = require("../pb/integratedapp_grpc_pb")
const googleProtobufStructPb = require("google-protobuf/google/protobuf/struct_pb.js")

/**
 * RBC - Releai Bot Client
 * 
 * Helps you to create a simple client to rele.ai bot
 * logic.
 */
class RBC {
    /**
     * Initiate the releai bot client instance.
     * 
     * @param {object} confs - Client configurations.
     */
    constructor(confs) {
        // get full client configurations
        this._confs = this._getFullConfs(confs)
        logger.debug({
            message: "initialize RBC with user confs",
            payload: confs
        })

        this._initClient()
    }

    /**
     * Returns a full version of the configurations
     * for the RBC client.
     * 
     * @param {object} userConfs - User configurations.
     * @returns {object} - Full client configurations.
     */
    _getFullConfs(userConfs) {
        return {
            // default configs
            grpc: {
                creds: grpc.credentials.createInsecure(),
            },

            // user confs
            ...userConfs
        }
    }

    /**
     * Dial to the host target and starts the client.
     */
    _initClient() {
        this._client = new IntegratedAppsClient(
            `${this._confs.host}:${this._confs.port}`,
            this._confs.grpc.creds
        )
        logger.debug({ message: "started grpc client", addr: `${this._confs.host}:${this._confs.port}` })
    }

    /**
     * Notify the server on a new payload sent on to a given
     * operation key.
     * 
     * @param {string} operationKey - The operation key to send data to.
     * @param {object} payload - The payload data to send.
     * @return {Response} - Response data from the server.
     */
    notify(operationKey, payload) {
        // init notify request
        const request = new NotifyRequest()

        // set operation key
        request.setOperationKey(operationKey)

        // set payload
        request.setPayload(googleProtobufStructPb.Struct.fromJavaScript(payload))
        logger.debug({ message: "sending notification request", operationKey, payload })

        // send request and wait for response
        return new Promise((resolve, reject) => {
            this._client.notify(request, (err, response) => {
                logger.debug({ message: "got response from server", err, response })
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(new Response(response))
                }
            })
        })
    }
}

module.exports = RBC
