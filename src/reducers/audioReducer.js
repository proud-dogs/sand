import createBeeper from '../audio/createBeeper'
import rampAudioNode from '../audio/rampAudioNode'
import disconnectBeeper from '../audio/disconnectBeeper'
import setSourceFrequency from '../audio/setSourceFrequency'
import sineTable from '../audio/sineTable'
import { INITIAL_FREQUENCY, BUFFER_LENGTH } from '../constants'

const addBeeper = ({ beepers, buffer, muted }, frequency, data, rampDuration) => {
  const newBeeper = createBeeper(frequency, 0.3, data, rampDuration);
  rampAudioNode(beepers[0].gainNode, 0, rampDuration)

  return { beepers: [newBeeper, ...beepers], buffer: data, muted }
}

const cleanupBeepers = ({ beepers, buffer, muted }) => ({
  beepers: beepers.reduce((result, beeper) => {
    if (beeper.gainNode.gain.value === 0) {
      disconnectBeeper(beeper)
      return result
    }
    return [...result, beeper]
  }, []),
  buffer,
  muted
})

const setBeeperFrequency = ({ beepers, buffer, muted }, frequency) => {
  const [currentBeeper] = beepers
  setSourceFrequency(currentBeeper.source, frequency, buffer)
  return { beepers, buffer, muted }
}
const amplitude = x => ({ value: x })
const amplitudes = sineTable(BUFFER_LENGTH).map(amplitude)
const data = amplitudes.map(({ value }) => value)

const toggleMute = ({ beepers, buffer, muted }) => ({
  beepers,
  buffer,
  muted: !muted
})

const initialState = {
  beepers : [createBeeper(INITIAL_FREQUENCY, 0.3, data, 0.5)],
  buffer: data,
  muted: true
}

const audio = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_BEEPER':
      return addBeeper(state,
        action.frequency,
        action.buffer,
        action.rampDuration
      )
    case 'CLEAN_UP_BEEPERS':
      return cleanupBeepers(
        state
      )
    case 'SET_BEEPER_FREQUENCY':
      return setBeeperFrequency(state,
        action.frequency
      )
    case 'TOGGLE_MUTE':
      return toggleMute(
        state
      )
    default:
      return state
  }
}

export default audio
