const grpc = require("grpc")
const logger = require("../utils/logger")
const middlewares = require("./middlewares")
const { notifyHandler } = require("./handlers")
const { IntegratedAppsService } = require("../pb/integratedapp_grpc_pb")

/**
 * RBS - Releai Bot Server
 *
 * Helps you to create a simple integrated application
 * with rele.ai.
 */
class RBS {
    /**
     * Initiate the releai bot server instance.
     *
     * @param {object} confs - Server configurations.
     */
    constructor(confs) {
        // get full server configurations
        this._confs = this._getFullConfs(confs)
        logger.debug({
            message: "initialize RBS with user confs",
            payload: confs
        })

        // init operations object
        this._operations = {}
    }

    /**
     * Initiate the gRPC server and handler
     */
    _initGrpcServer() {
        // init the server
        this._server = new grpc.Server(this._confs.grpc.serverInit)
        logger.debug({ message: "starting grpc server" })

        // add the main handler
        this._server.addService(
            // register the service
            IntegratedAppsService,

            // register the handler
            notifyHandler(this._operations, this._confs)
        )
        logger.debug({ message: "initiated notification handler" })
    }

    /**
     * Returns a full version of the server configurations
     * contact to the user configs.
     *
     * @param {object} userConfs - The user configurations.
     * @returns {object} - Server configurations.
     */
    _getFullConfs(userConfs) {
        return {
            // default settings
            grpc: {
                serverInit: {
                    "grpc.max_receive_message_length": 30000000,
                    "grpc.max_send_message_length": 30000000
                },
                creds: grpc.ServerCredentials.createInsecure(),
            },
            middlewares: middlewares,

            // override with user confs
            ...userConfs
        }
    }

    /**
     * Register a new handler for the application.
     *
     * @param {string} operationKey - The operation key name.
     * @param {Function} callback - The handler for the request.
     */
    registerOperation(operationKey, callback) {
        logger.info({ message: "registering operation handler", operationKey })
        this._operations[operationKey] = callback
    }

    /**
     * Register the provided handlers.
     *
     * @param {object} handlers - Handlers object.
     */
    use(handlers) {
        // iterate over the module and register the handlers
        for (const [operationKey, callback] of Object.entries(handlers)) {
            this.registerOperation(operationKey, callback)
        }
    }

    /**
     * Sign and start the gRPC server on the provided
     * host:port.
     *
     * @param {number} port - The port number.
     * @param {string} [host=0.0.0.0] - The target host.
     */
    listen(port, host="0.0.0.0") {
        // init the server
        this._initGrpcServer()

        // bind to host:port
        this._server.bind(`${host}:${port}`, this._confs.grpc.creds)

        // listen on port
        this._server.start()

        // log
        logger.info({ message: "server running", port, host })
    }
}

module.exports = RBS
