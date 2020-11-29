# RELE.AI Node SDK

RELE.AI Node SDK provides an easy interface to manage, create, and integrate applications to Clara.

## Create Application
Through the JS SDK:
```javascript
// first time app creation can be accessed
// from the CLI as well.
const { appId, appHash } = Releai.createNewApp({
    // app info
})
```

Through the CLI:
```bash
rb apply -c ./path/to/config.json
```

## Client Usage Examples
```javascript
// Initiate new releai bot client.
const rbc = new RBC({
    appId,
    appHash,
})

// send notification to endpoint
const response = await rb.notify(
    // send the operation key
    "new_contact",

    // send the payload
    {
        "foo": {
            "bar": 1
        }
    }
)

// handle output - JSON
console.log(response)
```

## Server Usage Example
```javascript
// initiate the bot server
const rbs = new RBS({
    appId,
    appHash,
})

// Register operation handler for a given operation
rbs.registerOperation("record_note", async (req, res) => {
    // do some logic here...

    // reply with the payload data
    res.json({
        // response payload
    })
})

// run server
rbs.listen(50003)
```