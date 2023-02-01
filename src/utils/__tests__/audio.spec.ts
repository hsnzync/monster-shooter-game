import { Audio } from '../audio'
import { Howl } from 'howler'

const mockData = {
  path: './assets/4f557ecb4d287fc6c229.mp3',
  hasLoop: false,
  volume: 0.5,
}

let audio: Audio

describe('Audio class', () => {
  beforeEach(() => {
    audio = new Audio(mockData.path, mockData.hasLoop, mockData.volume)
    expect(audio).toBeInstanceOf(Audio)
  })

  it('should check if it has the required amount of parameters passed', () => {
    expect(audio).toEqual(mockData)
  })

  it('should have a valid audio link extension and path', () => {
    expect(audio.path).toEqual(expect.stringMatching(/\.(mp3|wav)$/))
    expect(audio.path).toEqual(
      expect.stringMatching(/^\.\/assets\/[a-z0-9]+\.(mp3|wav)$/)
    )
    expect(audio.path).toBe(mockData.path)
  })

  it('should call the play function of Howl and Audio class', () => {
    const howl = new Howl({
      src: mockData.path,
      loop: mockData.hasLoop,
      volume: mockData.volume,
    })

    const mockHowlPlay = jest.spyOn(howl, 'play')
    const mockAudioPlay = jest.spyOn(audio, 'play')
    howl.play()
    audio.play()

    expect(mockHowlPlay).toHaveBeenCalled()
    expect(mockAudioPlay).toHaveBeenCalled()
  })

  it('should call the stop function', () => {
    const mockPlay = jest.spyOn(audio, 'play')
    const mockStop = jest.spyOn(audio, 'stop')

    // Call the play function first before the stop function
    audio.play()
    expect(mockPlay).toHaveBeenCalled()

    audio.stop()
    expect(mockStop).toHaveBeenCalled()
  })

  it('should call the fade-in function', () => {
    const mockFadeIn = jest.spyOn(audio, 'fadeIn')
    const mockPlay = jest.spyOn(audio, 'play')

    // Call the play function first before the stop function
    audio.play()
    expect(mockPlay).toHaveBeenCalled()

    audio.fadeIn()
    expect(mockFadeIn).toHaveBeenCalled()
  })

  it('should call the fade-out function', () => {
    const mockFadeOut = jest.spyOn(audio, 'fadeOut')
    const mockPlay = jest.spyOn(audio, 'play')

    // Call the play function first before the stop function
    audio.play()
    expect(mockPlay).toHaveBeenCalled()

    audio.fadeOut()
    expect(mockFadeOut).toHaveBeenCalled()
  })
})
