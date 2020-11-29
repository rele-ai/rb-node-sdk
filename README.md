# RELE.AI Node SDK

RELE.AI Node SDK provides an easy interface to manage, create, and integrate applications to Clara.

## Client Usage Examples
```javascript
// first time app creation can be accessed
// from the CLI as well.
const { appId, appHash } = Releai.createNewApp({
    ...<app info>
})

// Initiate new releai bot client.
const rbc = new Releai({
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

```