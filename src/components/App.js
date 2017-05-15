import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import Board from './Board'
import EndGame from './EndGame'
import Submitted from './Submitted'
import { getStyle, SWAP_TIME, FADEOUT_TIME, FADEIN_TIME } from '../item-styles'

const MOVES_LEFT = 5

class App extends Component {
  constructor (props) {
    super()
    this.state = {
      token: '',
      steps: [],
      items: [],
      swappedItems: [],
      newItems: [],
      x1: -1,
      y1: -1,
      x2: -1,
      y2: -1,
      crashed: [],
      score: 0,
      newScore: 0,
      movesLeft: MOVES_LEFT,
      elapsedTime: 0,
      // states
      mouseDown: false,
      swap: false,
      crash: false,
      fadeOut: false,
      fadeIn: false,
      endGame: false,
      boardEnabled: true,
      stopTimer: false,
      // end game
      name: '',
      email: '',
      validName: true,
      validEmail: true,
      submit: false,
      reqStart: 0
    }
    this.mouseDown = mouseDown.bind(this)
    this.swap = swap.bind(this)
    this.crashSwapped = crashSwapped.bind(this)
    this.crashStacked = crashStacked.bind(this)
    this.fadeOut = fadeOut.bind(this)
    this.fadeIn = fadeIn.bind(this)
    this.mouseUp = mouseUp.bind(this)
    this.resetState = resetState.bind(this)
    this.restart = restart.bind(this)
    this.endGame = endGame.bind(this)
    this.getStyle = getStyle.bind(this)
    this.addSecond = addSecond.bind(this)
    setTimeout(this.addSecond, 1000)
    // end game screen
    this.handleNameChange = handleNameChange.bind(this)
    this.handleEmailChange = handleEmailChange.bind(this)
    this.handleSubmit = handleSubmit.bind(this)
  }

  componentDidMount () {
    axios.post('http://jobfair.srolija.com/game/new', {
      token: 'axilis'
    }).then((response) => {
      this.setState({
        items: response.data.board,
        token: response.data.gameToken
      })
    })
  }

  render () {
    return (
      <div className='App main'>
        <div className='header noselect'>
          <div className='ic_logo'>
            <img alt='ic_logo' src={require('../../images/ic-logo.svg')} />
          </div>
        </div>
        <div className='center'>
          <div className='board-outer-div'>
            <Board
              items={this.state.items}
              boardEnabled={this.state.boardEnabled}
              mouseDown={this.mouseDown}
              mouseUp={this.mouseUp}
              swap={this.swap}
              getStyle={this.getStyle}
              />
          </div>
          <div className='info noselect'>
            <div className='score'>Score</div>
            <div className='score-value'>{this.state.score}</div>
            <div className='line' />
            <div className='moves-left'>Moves Left <div className='moves-left-text-style'>{this.state.movesLeft}</div></div>
            <div className='line' />
            <div className='time-elapsed'>Time Elapsed <div className='time-elapsed-text-style'>{parseTime(this.state.elapsedTime)}</div></div>
          </div>
        </div>
        <button className='restart-container noselect' onClick={this.restart}>
          <div className='restart-outer-div'>
            <img className='restart-img' alt='restart-img' src={require('../../images/restart.png')} />
            <div className='restart'>Restart</div>
          </div>
        </button>
        <EndGame
          show={this.state.endGame}
          score={this.state.score}
          validName={this.state.validName}
          validEmail={this.state.validEmail}
          handleNameChange={this.handleNameChange}
          handleEmailChange={this.handleEmailChange}
          handleSubmit={this.handleSubmit}
          />
        <Submitted show={this.state.submit} />
      </div>
    )
  }
}
// ***************** helper functions *****************
function addSecond () {
  if (!this.state.stopTimer) {
    this.setState({
      elapsedTime: this.state.elapsedTime + 1
    })
  }
  setTimeout(this.addSecond, 1000)
}

function parseTime (time) {
  let min, sec
  if (time < 10) {
    min = '00'
    sec = '0' + time
  } else if (time < 60) {
    min = '00'
    sec = '' + time
  } else {
    min = Math.floor(time / 60)
    sec = time % 60
    if (sec < 10) {
      sec = '0' + sec
    } else {
      sec = '' + sec
    }
    if (min < 10) {
      min = '0' + min
    } else {
      min = '' + min
    }
  }
  return min + ':' + sec
}

// // ***************** game states *****************
function mouseDown (e, x, y) {
  if (this.state.mouseDown === false) {
    this.setState({
      mouseDown: true,
      x1: x,
      y1: y
    })
    console.log('1st item: (' + x + ',' + y + ')')
  }
}
function swap (e, x, y) {
  // if swap is allowed
  if (this.state.mouseDown === true && ((this.state.x1 !== x && this.state.y1 === y) || (this.state.x1 === x && this.state.y1 !== y))) {
    this.setState({
      reqStart: window.performance.now()
    })
    axios.post('http://jobfair.srolija.com/game/swap', {
      token: this.state.token,
      row1: this.state.x1,
      col1: this.state.y1,
      row2: x,
      col2: y
    }).then((response) => {
      // swap successful, make it permanent
      let end = window.performance.now()
      let time = end - this.state.reqStart
      let swappedItems = this.state.items.slice()
      let temp = this.state.items[this.state.x1][this.state.y1]
      swappedItems[this.state.x1][this.state.y1] = swappedItems[this.state.x2][this.state.y2]
      swappedItems[this.state.x2][this.state.y2] = temp
      this.setState({
        swappedItems: swappedItems,
        stopTimer: true,
        steps: response.data.steps,
        newScore: response.data.totalScore,
        newRound: response.data.round
      })
      setTimeout(this.crashSwapped, Math.floor(SWAP_TIME * 500 - time))
    }).catch((err) => {
      // swap unsuccessful, swap back items
      console.log(err)
      setTimeout(this.resetState, SWAP_TIME * 1000)
    })
    console.log('swap with: (' + x + ',' + y + ')')
    this.setState({
      movesLeft: this.state.movesLeft - 1,
      mouseDown: false,
      boardEnabled: false,
      swap: true,
      x2: x,
      y2: y
    })
  }
}
function crashSwapped () {
  let step = this.state.steps.shift()
  let newItems = step.board
  this.setState({
    items: this.state.swappedItems,
    newItems: newItems,
    crashed: step.groupedMatches,
    swap: false,
    crash: true,
    stopTimer: true
  })
  setTimeout(this.fadeOut, FADEOUT_TIME * 1000)
}
function crashStacked () {
  let step = this.state.steps.shift()
  let newItems = step.board
  this.setState({
    items: this.state.newItems,
    newItems: newItems,
    crashed: step.groupedMatches,
    swap: false,
    crash: true,
    stopTimer: true
  })
  setTimeout(this.fadeOut, FADEOUT_TIME * 1000)
  // setTimeout(this.resetState, FADEOUT_TIME * 1000)
}
function fadeOut () {
  this.setState({
    crash: false,
    fadeOut: true
  })
  setTimeout(this.fadeIn, FADEOUT_TIME * 1000)
}
function fadeIn () {
  // new items should be here
  this.setState({
    items: this.state.newItems,
    fadeOut: false,
    fadeIn: true
  })
  if (this.state.steps.length >= 1) {
    setTimeout(this.crashStacked, FADEIN_TIME * 1000)
  }
  if (this.state.movesLeft === 0) {
    console.log('end game')
    setTimeout(this.endGame, FADEIN_TIME * 1000)
  } else {
    setTimeout(this.resetState, FADEIN_TIME * 1000)
  }
}
function resetState () {
  this.setState({
    firstItem: {
      x: -1,
      y: -1
    },
    secondItem: {
      x: -1,
      y: -1
    },
    elapsedTime: 0,
    mouseDown: false,
    swap: false,
    swapBack: false,
    crash: false,
    fadeOut: false,
    fadeIn: false,
    boardEnabled: true,
    stopTimer: false
  })
}
function endGame () {
  this.setState({
    fadeIn: false,
    boardEnabled: false,
    endGame: true,
    stopTimer: true
  })
}
function mouseUp () {
  this.setState({
    firstItem: {
      x: -1,
      y: -1
    },
    secondItem: {
      x: -1,
      y: -1
    },
    mouseDown: false,
    swap: false,
    crash: false,
    fadeOut: false,
    fadeIn: false,
    boardEnabled: true,
    stopTimer: false
  })
}
function restart () {
  this.setState({
    firstItem: {
      x: -1,
      y: -1
    },
    secondItem: {
      x: -1,
      y: -1
    },
    // should add new game API call
    score: 0,
    movesLeft: MOVES_LEFT,
    elapsedTime: 0,
    mouseDown: false,
    swap: false,
    crash: false,
    fadeOut: false,
    fadeIn: false,
    boardEnabled: true,
    stopTimer: false,
    submit: false
  })
  setTimeout(this.addSecond, 1000)
}
// ***************** API calls *****************

// ***************** end screen *****************
function handleNameChange (event) {
  this.setState({
    name: event.target.value
  })
}
function handleEmailChange (event) {
  this.setState({
    email: event.target.value
  })
}
function handleSubmit (e) {
  let validName = this.state.name.length !== 0
  let validEmail = /(.+)@(.+){2,}\.(.+){2,}/.test(this.state.email)

  if (validEmail && validName) {
    // API post submit
    this.setState({
      endGame: false,
      submit: true
    })
  } else {
    this.setState({
      validName: validName,
      validEmail: validEmail
    })
  }
  e.preventDefault()
}

export default App
