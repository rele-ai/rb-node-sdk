const grpc = require("@grpc/grpc-js")
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
            host: "https://integrations-gw.prod.bot.rele.ai",
            port: 443,
            defaultHeaders: {
                authorization: `Basic ${Buffer.from(`${userConfs.appId}:${userConfs.appHash}`).toString("base64")}`
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
     * Generate the metadata object for the request.
     * 
     * @param {object} headers - Additional metadata headers.
     * @returns {Metadata} - The metadata object.
     */
    _getMetadata(headers={}) {
        // init the md instance
        const md = new grpc.Metadata()

        // append headers
        for (const _case of [this._confs.defaultHeaders, headers]) {
            for (const [hk, hv] of Object.entries(_case)) {
                md.add(hk, hv)
            }
        }

        // return the metadata
        return md
    }

    /**
     * Notify the server on a new payload sent on to a given
     * operation key.
     * 
     * @param {string} operationKey - The operation key to send data to.
     * @param {object} payload - The payload data to send.
     * @param {object} headers - Additional headers for the request.
     * @return {Response} - Response data from the server.
     */
    notify(operationKey, payload, headers) {
        // init notify request
        const request = new NotifyRequest()

        // set operation key
        request.setOperationKey(operationKey)

        // set payload
        request.setPayload(googleProtobufStructPb.Struct.fromJavaScript(payload))
        logger.debug({ message: "sending notification request", operationKey, payload })

        // get request metadata
        const metadata = this._getMetadata(headers)

        // send request and wait for response
        return new Promise((resolve, reject) => {
            this._client.notify(request, metadata, (err, response) => {
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
