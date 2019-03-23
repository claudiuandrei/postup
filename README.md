# Postup

## Multi channel message bus

Postup is a multi channel message bus written in TypeScript. It runs in the browser, or on the server using node.js.

### Setup

```bash
yarn add postup
```

or

```bash
npm install --save postup
```

### Usage

Before you start import the library

```javascript
import Postup from 'postup'
```

#### Basic usage

```javascript
// Setup a new bus with no buffer
const bus = new Postup()
const chan = bus.channel(['topic'])

// Data published can be anything
const context = { test: true }

// Setup a subscriber
const ubsubscribe = bus.subscribe((data, topic) => {
  console.log(data, topic) // { test: true } ["topic"]
})

// Publish some data
chan.publish(context)

// Cleanup
unsubsribe()
```

## License

[MIT](LICENSE)
