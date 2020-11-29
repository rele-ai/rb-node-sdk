/**
 * Export the tools required for the SDK
 */
module.exports = {
    /**
     * CLI interface and utils.
     */
    cli: require("./cli"),

    /**
     * Formatter utils from json to struct
     * json format that is accepted by the integrations
     * gateway.
     */
    format: require("./utils").format,

    /**
     * gRPC based rele.ai bot client.
     */
    RBC: require("./rbc"),

    /**
     * gRPC based rele.ai bot server
     */
    RBS: require("./rbs"),
}