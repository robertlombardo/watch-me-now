## Watch Me Now
_the teeny-tiny, zero-dependency object observer_
* emits on property assignments for all data types
* emits on `delete`
* emits on mutable `Array` function calls
* works on nested properties (infinitely)
* works in node as well as the browser!

#### installation:
`npm install watch-me-now --save`

#### example usage:
```javascript
const WatchMeNow = require(`watch-me-now`)

// define a callback for when changes occur
const onStateChange = ({type, current, old, path}) => {
    console.log(`\nonStateChange() - ${type}, path: ${path}`)
    console.log({current: JSON.stringify(current)})
    console.log({old: JSON.stringify(old)})
}

// instantiate an object to observe
const state = WatchMeNow({}, onStateChange)

// go nuts
state.foo = `bar`
state.foo = {bar: `baz`}
state.foo.bar = `bum`

state.foo.bar = 24601
state.foo.bar += 5 + 14

delete state.foo.bar

state.my_array = [1, 2, 3, 4, 5]
state.my_array[0] = `potato`
state.my_array.reverse()

state.foo = {nested_array: [`a`, `b`, `c`]}
state.foo.nested_array.reverse()
state.foo.nested_array.push({six_times_seven: 42})
```
