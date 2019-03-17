// Use postbus as a message bus
import Postbus from 'postbus'

// Setup the types
type Topic = string

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
type Handler = (data: Data, topic?: Topic) => void

// Constants
const DEFAULT_TOPIC = '@'
const SEPARATOR = '/'

// A channel is just an interface into a subset of a dispatcher
class Postup {
  // Properties
  private bus: Postbus
  private topic: Topic

  // Setup the properties
  constructor(topic: Topic = DEFAULT_TOPIC, bus: Postbus = new Postbus()) {
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
  subscribe(handler: Handler): Unsubscriber {
    // Create a wrapper to test if matches
    const h = ({ data, topic }: Context): void => {
      // If this is the topic
      if (topic === this.topic) {
        return handler(data)
      }

      // Get the base
      const base = this.topic + SEPARATOR

      // If this is a subtopic
      if (topic.indexOf(base) === 0) {
        // Find the subtopic from the event main topic
        const subtopic = topic.substring(base.length)

        // Push the data to the handler
        return handler(data, subtopic)
      }
    }

    // Sunbscribe the handler
    this.bus.subscribe(h)

    // Return an unsubscriber
    return () => {
      this.bus.unsubscribe(h)
    }
  }

  // Create a channel
  channel(subtopic: Topic) {
    return new Postup(this.topic + SEPARATOR + subtopic, this.bus)
  }
}

export default Postup
