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
    chan.subscribe('test', onEvent)
    chan.publish('test', {})

    // Test if the event function has been called
    expect(onEvent).toHaveBeenCalled()
  })

  // Test simple string
  test('When not matching pattern the subscription should not be triggered', () => {
    // Setup a channel
    const chan = new Postup()

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Subscribe and publish
    chan.subscribe('test2', onEvent)
    chan.publish('test1', {})

    // Test if the event function has been called
    expect(onEvent).not.toHaveBeenCalled()
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
    chan.subscribe('test', ({ data }) => {
      expect(data).toEqual(sent)
    })
    chan.publish('test', sent)
  })

  // Test event
  test('Topic is passed correctly when matching', () => {
    // Setup a channel
    const chan = new Postup({ topic: 'topic' })

    // Subscribe and publish
    chan.subscribe('test', ({ topic }) => {
      expect(topic).toEqual('topic/test')
    })
    chan.publish('test', {})
  })

  // Test event
  test('Subtopic is passed correctly when matching', () => {
    // Setup a channel
    const chan = new Postup()

    // Subscribe and publish
    chan.subscribe('test', ({ subtopic }) => {
      expect(subtopic).toEqual('test')
    })
    chan.publish('test', {})
  })

  // Test event
  test('Regex matches the event correctly', () => {
    // Setup a channel
    const chan = new Postup()

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Subscribe and publish
    chan.subscribe('t(.*)t', onEvent)
    chan.publish('test', {})

    // Test if the event function has been called
    expect(onEvent).toHaveBeenCalled()
  })

  // Test event
  test('Regex does not match incorrect events', () => {
    // Setup a channel
    const chan = new Postup()

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Subscribe and publish
    chan.subscribe('(.*)te', onEvent)
    chan.publish('test', {})

    // Test if the event function has been called
    expect(onEvent).not.toHaveBeenCalled()
  })

  // Test event
  test('Multiple listeners are triggered', () => {
    // Setup a channel
    const chan = new Postup()

    // On event trigger a jest fn
    const onEvent = jest.fn()
    const onRegex = jest.fn()

    // Subscribe and publish
    chan.subscribe('test', onEvent)
    chan.subscribe('.*', onRegex)
    chan.publish('test', {})

    // Test if the event function has been called
    expect(onEvent).toHaveBeenCalled()
    expect(onRegex).toHaveBeenCalled()
  })

  // Test event
  test('Unsubscriber should unsubscribe future dispatches', () => {
    // Setup a channel
    const chan = new Postup()

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Subscribe and publish
    const unsubscriber = chan.subscribe('test', onEvent)
    unsubscriber()
    chan.publish('test', {})

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
    chan.subscribe('test', onEvent)
    chan.publish('test', {})

    // Test if the event function has been called
    expect(onEvent).toHaveBeenCalled()
  })

  // Test simple string
  test('When matching pattern the channel subscription should be triggered on dispatcher dispatch', () => {
    // Setup a channel
    const chan = new Postup()
    const subchan = chan.channel('channel')

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Subscribe and publish
    subchan.subscribe('test', onEvent)
    chan.publish('channel/test', {})

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
    chan.subscribe('channel/test', onEvent)
    subchan.publish('test', {})

    // Test if the event function has been called
    expect(onEvent).toHaveBeenCalled()
  })
})
