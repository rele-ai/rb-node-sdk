/**
 * Formats list value.
 * 
 * @param {Array} values - List values to format.
 */
const formatList = (values) => {
    let ret = {
        listValue: {
            values: []
        }
    }

    // iterate over the list and format the values
    for (const item of values) {
        ret.listValue.values.push(
            formatValue(item)
        )
    }

    return ret
}

/**
 * Format custom value.
 * 
 * @param {*} value - Value to format
 */
const formatValue = (value) => {
    let ret = {}

    if (value === null || value === undefined) {
        ret = {
            "nullValue": null
        }
    } else {
        switch (value.constructor.name.toLowerCase()) {
            case "string":
                ret = {
                    "stringValue": value
                }
                break
            case "number":
                ret = {
                    "numberValue": value
                }
                break
            case "boolean":
                ret = {
                    "boolValue": value
                }
                break
            case "array":
                ret = formatList(value)
                break
            case "object":
                ret = this.format(value)
                break
            default:
                throw new Error("unexpected struct type")
        }
    }

    return ret
}

/**
 * Format the payload data according to the requirements
 * of the grpc gateway.
 * 
 * @param {object} payload - Object to format.
 */
module.exports.format = (payload) => {
    let ret = {
        structValue: {
            fields: {}
        }
    }

    // iterate over the keys and append value
    for (const [property, value] of Object.entries(payload)) {
        ret.structValue.fields[property] = formatValue(value)
    }

    return ret
}
