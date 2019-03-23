// Use postbus as a message bus
import Postbus from 'postbus'

// Setup the types
type Topic = Array<string>

// Data published
type Data = any

// Context that
type Context = {
  data: Data
  topic: Topic
}

// Unsubscriber
type Unsubscriber = () => void

// Handler
type Subscriber = (data: Data, topic: Topic) => void

// A channel is just an interface into a subset of a dispatcher
class Postup {
  // Properties
  private bus: Postbus
  private topic: Topic

  // Setup the properties
  constructor(bus: Postbus = new Postbus(), topic: Topic = []) {
    this.bus = bus
    this.topic = topic
  }

  // Publish
  publish(data: Data): void {
    this.bus.publish({
      data,
      topic: this.topic
    })
  }

  // Subscribe
  subscribe(subscriber: Subscriber): Unsubscriber {
    // Create a handler out of the subscriber
    const handler = ({ data, topic }: Context): void => {
      if (this.topic.every((v, k) => v === topic[k])) {
        return subscriber(data, topic.slice(this.topic.length))
      }
    }

    // Sunbscribe the handler
    this.bus.subscribe(handler)

    // Return an unsubscriber
    return () => {
      this.bus.unsubscribe(handler)
    }
  }

  // Create a channel
  channel(topic: Topic) {
    return new Postup(this.bus, [...this.topic, ...topic])
  }
}

export default Postup
