# RELE.AI Node SDK

RELE.AI Node SDK provides an easy interface to manage, create, and integrate applications to Clara.

## Create Application
Please visit: https://github.com/rele-ai/cli

## Client Usage Examples
```javascript
const { RBC } = require("@releai/rb-node-sdk")

// Initiate new releai bot client.
const rbc = new RBC({
    appId,
    appHash,
})

// send notification to endpoint
const response = await rbc.notify(
    // send the operation key
    "new_contact",

    // send the payload
    {
        "foo": {
            "bar": 1
        }
    },

    // send additional headers
    {
        "example-header-key": "value"
    }
)

// handle output - JSON
console.log(response)
```

## REST Formatter Example
```javascript
const { format } = require("@releai/rb-node-sdk")

// format payload to gRPC struct format
const payload = format({
    // payload
})
```

## Server Usage Example
```javascript
const { RBS } = require("@releai/rb-node-sdk")

// initiate the bot server
const rbs = new RBS({
    appId,
    appHash,
})

// Register operation handler for a given operation
rbs.registerOperation("record_note", async (req, res) => {
    // do some logic here...

    // reply with the payload data
    res.send(200, {
        // response payload
    })
})

// run server
rbs.listen(50003)
```