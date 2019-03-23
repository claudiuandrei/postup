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
    chan.subscribe(data => {
      expect(data).toEqual(sent)
    })
    chan.publish(sent)
  })

  // Test event
  test('Topic is passed correctly when matching on different channels', () => {
    // Setup a channel
    const chan = new Postup()
    const subchan = chan.channel(['topic'])

    // Subscribe and publish
    chan.subscribe((data, topic) => {
      expect(topic).toEqual(['topic'])
    })
    subchan.publish({})
  })

  // Test event
  test('Topic is undefined when matching on the same channel', () => {
    // Setup a channel
    const chan = new Postup()
    const subchan = chan.channel(['topic'])

    // Subscribe and publish
    subchan.subscribe((data, topic) => {
      expect(topic).toEqual([])
    })
    subchan.publish({})
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

  // Test event
  test('Channels are the same if topics are the same', () => {
    // Setup a channel
    const base = new Postup()
    const chan1 = base.channel(['topic'])
    const chan2 = base.channel(['topic'])

    const onEvent1 = jest.fn()
    const onEvent2 = jest.fn()

    // Subscribe and publish
    chan1.subscribe(onEvent1)
    chan2.subscribe(onEvent2)
    chan2.publish({})

    expect(onEvent1).toHaveBeenCalled()
    expect(onEvent2).toHaveBeenCalled()
  })

  // Test event
  test('Channels are not the same if topics are different', () => {
    // Setup a channel
    const base = new Postup()
    const chan1 = base.channel(['topic1'])
    const chan2 = base.channel(['topic2'])

    const onEvent1 = jest.fn()
    const onEvent2 = jest.fn()

    // Subscribe and publish
    chan1.subscribe(onEvent1)
    chan2.subscribe(onEvent2)
    chan1.publish({})

    expect(onEvent1).toHaveBeenCalled()
    expect(onEvent2).not.toHaveBeenCalled()
  })
})
