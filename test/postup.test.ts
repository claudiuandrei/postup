import Postup from '../src/postup'

// Convert
describe('Postup', () => {
  // Test simple string
  test('When matching pattern the subscription should be triggered', () => {
    // Setup a channel
    const chan = new Postup()

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Subscribe and publish
    chan.subscribe(onEvent)
    chan.publish({})

    // Test if the event function has been called
    expect(onEvent).toHaveBeenCalled()
  })

  // Test data
  test('Data is passed correctly when matching', () => {
    // Setup a channel
    const chan = new Postup()

    // On event trigger a jest fn
    const sent = {
      accountType: 'free'
    }

    // Subscribe and publish
    chan.subscribe(({ data }) => {
      expect(data).toEqual(sent)
    })
    chan.publish(sent)
  })

  // Test event
  test('Topic is passed correctly when matching', () => {
    // Setup a channel
    const chan = new Postup({ topic: 'topic' })

    // Subscribe and publish
    chan.subscribe(({ topic }) => {
      expect(topic).toEqual('topic')
    })
    chan.publish({})
  })

  // Test event
  test('Subtopic is passed correctly when matching', () => {
    // Setup a channel
    const chan = new Postup()
    const subchan = chan.channel('subtopic')

    // Subscribe and publish
    chan.subscribe(({ subtopic }) => {
      expect(subtopic).toEqual('subtopic')
    })
    subchan.publish({})
  })

  // Test event
  test('Subtopic is undefined when not matching', () => {
    // Setup a channel
    const chan = new Postup()

    // Subscribe and publish
    chan.subscribe(({ subtopic }) => {
      expect(subtopic).toBeUndefined()
    })
    chan.publish({})
  })

  // Test event
  test('Multiple listeners are triggered', () => {
    // Setup a channel
    const chan = new Postup()

    // On event trigger a jest fn
    const onEvent1 = jest.fn()
    const onEvent2 = jest.fn()

    // Subscribe and publish
    chan.subscribe(onEvent1)
    chan.subscribe(onEvent2)
    chan.publish({})

    // Test if the event function has been called
    expect(onEvent1).toHaveBeenCalled()
    expect(onEvent2).toHaveBeenCalled()
  })

  // Test event
  test('Unsubscriber should unsubscribe future dispatches', () => {
    // Setup a channel
    const chan = new Postup()

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Subscribe and publish
    const unsubscribe = chan.subscribe(onEvent)

    // Unsubscribe
    unsubscribe()

    // Publish
    chan.publish({})

    // Test if the event function has been called
    expect(onEvent).not.toHaveBeenCalled()
  })

  // Test simple string
  test('When matching pattern the subscription should be triggered', () => {
    // Setup a channel
    const chan = new Postup().channel('channel')

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Subscribe and publish
    chan.subscribe(onEvent)
    chan.publish({})

    // Test if the event function has been called
    expect(onEvent).toHaveBeenCalled()
  })

  // Test simple string
  test('When matching pattern the dispatcher subscription should be triggered on channel dispatch', () => {
    // Setup a channel
    const chan = new Postup()
    const subchan = chan.channel('channel')

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Subscribe and publish
    chan.subscribe(onEvent)
    subchan.publish({})

    // Test if the event function has been called
    expect(onEvent).toHaveBeenCalled()
  })
})
