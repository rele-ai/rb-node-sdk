const logger = require("../utils/logger")

/**
 * RB Router object to manage
 * the different handlers
 */
class Router {
  #routes
  #options

  /**
   * Initiate the router
   */
  constructor(opt = {}) {
    this.#options = opt
    this.#routes = {}
  }

  /**
   * Return the routes.
   */
  get routes() {
    return this.#routes
  }

  /**
   * Disable direct overwriting of routes.
   */
  set routes(_) {
    console.error(`Unable to directly overwrite routes. Use the .use() function instead to register a single route at a time.`)
  }

  /**
   * Add a route functions.
   *
   * @param {string} name - The app action key.
   * @param {Function} callback - The handler callback.
   */
  use(name, callback) {
    // make sure the route is not registered twice
    if (this.#routes[name]) {
      logger.warn(`Route ${name} has already been registered`)
      return
    }

    // register route
    this.#routes[name] = callback
  }
}

// export default router
module.exports = Router
