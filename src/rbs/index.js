const os = require("os")
const fs = require("fs")
const path = require("path")
const grpc = require("@grpc/grpc-js")
const Router = require("./router")
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

    // check app id and app hash
    if (!this._confs.appId) throw new Error(`APP_ID is a required attribute`)
    if (!this._confs.appHash) throw new Error(`APP_HASH is a required attribute`)

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
      notifyHandler(this._operations, this._confs),
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
    // check if handlers object is workable
    if (handlers) {
      let routes = {}

      // get routes object
      if (handlers.constructor === Router) {
        routes = handlers.routes
      } else if (handlers.constructor === Object) {
        console.warn("Direct usage of objects as routes will be deprecated. Please use the Router object instead.")
        routes = handlers
      } else {
        throw new Error("handlers object must be of type Router or Object(deprecated)")
      }

      // iterate over the module and register the handlers
      for (const [operationKey, callback] of Object.entries(routes)) {
        this.registerOperation(operationKey, callback)
      }
    } else {
      throw new Error("handlers object must be of type Router or object (deprecated).")
    }
  }

  /**
   * Share address to tmp .env file.
   *
   * @param {string} host - Host address.
   * @param {number} port - Server port.
   */
  _shareAddr(host, port) {
    // create tmp dir
    const tmpdir = path.join(os.tmpdir(), ".rb")
    if (!fs.existsSync(tmpdir)) fs.mkdirSync(tmpdir)

    // write to tmp file
    const envfile = path.join(tmpdir, ".env.server")
    fs.writeFileSync(envfile, `RB_HOST=${host}\nRB_PORT=${port}`)
  }

  /**
   * bind to host:port
   *
   * @param {string} host - Host address.
   * @param {number} port - Server port.
   */
  _bindPort(host,port){
    this._server.bindAsync(
      `${host}:${port}`,
      this._confs.grpc.creds,
      (err, port) => {
        if (err != null) {
          logger.info(`error while trying to bind on port :${port}`)
        } else {
          logger.info(`server bind sucsses using port:${port}`)
          
          // listen on port
          this._server.start()

          // log
          logger.info({ message: "server running", port, host })
        }
      })
  }

  /**
  * Sign and start the gRPC server on the provided
  * host:port.
  *
  * @param {number} port - The port number.
  * @param {string} [host=0.0.0.0] - The target host.
  */
  listen(port, host="0.0.0.0") {
    // required for rb dev script - export port and host
    this._shareAddr(host, port)

    // init the server
    this._initGrpcServer()

    // bind to host:port
    this._bindPort(host,port)

    // log
    logger.info({ message: "server running", port, host })
  }
}

RBS.Router = require("./router")
module.exports = RBS
