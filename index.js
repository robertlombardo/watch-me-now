const WatchMeNow = (me, changeCallback, path=``) => {
    return new Proxy(me, {
        set: (watched, key, val) => {
            if (typeof val === `function`) throw `WatchMeNow does not accept functions on observed objects`

            const old = shallowCopy(watched)

            switch (typeof val) {
                case `object`:
                    if (Array.isArray(val)) extendMutableArrayFuncs(val, watched, changeCallback, path, key)

                    // proxy any nested objects as well 
                    watched[key] = WatchMeNow(val, changeCallback, `${path}.${key}`)

                    // override any nested arrays
                    if (watched.propertyIsEnumerable(key)) {
                        for (let nested_key in val) {
                            const nested_val = val[nested_key]
                            if (Array.isArray(nested_val)) extendMutableArrayFuncs(nested_val, val, changeCallback, path, key)
                        }
                    }

                    break

                default:
                    watched[key] = val
            }

            changeCallback({
                type    : `PROPERTY_SET`,
                current : shallowCopy(watched), 
                old,
                path,
                key,
            })

            return true
        },

        deleteProperty: (watched, key) => {
            if (key in watched) {
                const old = shallowCopy(watched)

                delete watched[key]
                
                changeCallback({
                    type    : `PROPERTY_DELETE`,
                    current : shallowCopy(watched),
                    old,
                    path,
                    key,
                })
            }
        }
    })
}
module.exports = WatchMeNow

const shallowCopy = obj => JSON.parse(JSON.stringify(obj))

const extendMutableArrayFuncs = (array, watched, changeCallback, path, key) => {
    // extend mutable Array methods to invoke callback when changes are made
    [
        `fill`,
        `pop`,
        `push`,
        `reverse`,
        `shift`,
        `sort`,
        `splice`,
        `unshift`,
    ].forEach(func_name => {
        Object.defineProperty(array, func_name, {
            value: (...args) => {
                const old = shallowCopy(watched)

                // call normal Array behavior
                const res = Array.prototype[func_name].apply(array, args)
                
                changeCallback({
                    type    : `ARRAY_FUNC_${func_name}`,
                    current : shallowCopy(watched),
                    old,
                    path,
                    key,
                })
                
                return res
            },
            writable: true
        })
    })
}
