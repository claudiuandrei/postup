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
  subtopic: Topic
}

// Unsubscriber
type Unsubscriber = () => void

// Handler
type Handler = (context: Context) => void

// Base topic
const BASE_TOPIC = '@'

// A channel is just an interface into a subset of a dispatcher
class Postup {
  // Properties
  private bus: Postbus
  private topic?: Topic

  // Setup the properties
  constructor({ bus = new Postbus(), topic = BASE_TOPIC }: { bus?: Postbus; topic?: Topic } = {}) {
    this.bus = bus
    this.topic = topic
  }

  // Publish
  publish(subtopic: Topic, data: Data): void {
    this.bus.publish({
      topic: `${this.topic}/${subtopic}`,
      data
    })
  }

  // Subscribe
  subscribe(subtopic: Topic, handler: Handler): Unsubscriber {
    // Create the matching regex for this subscription
    const regex: RegExp = new RegExp(`^${`${this.topic}/${subtopic}`}$`, 'i')

    // Create a wrapper to test if matches
    const h: Handler = ({ topic, data }: Context): void => {
      // Only notify handlers if the topic matches
      if (regex.test(topic)) {
        // Find the subtopic from the event main topic
        const subtopic = topic.replace(new RegExp(`^${this.topic}/`, 'i'), '')

        // Push the data to the handler
        handler({
          data,
          topic,
          subtopic
        })
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
    return new Postup({ bus: this.bus, topic: `${this.topic}/${subtopic}` })
  }
}

export default Postup
