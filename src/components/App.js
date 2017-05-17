import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import Board from './Board'
import EndGame from './EndGame'
import Restart from './Restart'
import Congratulations from './Congratulations'
import { getStyle, SWAP_TIME, FADEOUT_TIME, FADEIN_TIME } from '../styles'

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
      round: 0,
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
      timeoutId: 0,
      animationId: 0,
      gameOver: false,
      // end game
      name: '',
      email: '',
      validName: true,
      validEmail: true,
      submitted: false,
      reqStart: 0
    }
    this.mouseDown = mouseDown.bind(this)
    this.swap = swap.bind(this)
    this.crash = crash.bind(this)
    this.crashStacked = crashStacked.bind(this)
    this.fadeOut = fadeOut.bind(this)
    this.fadeIn = fadeIn.bind(this)
    this.mouseUp = mouseUp.bind(this)
    this.resetState = resetState.bind(this)
    this.resetStateAndTimer = resetStateAndTimer.bind(this)
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
            <div className='score'>Bodovi</div>
            <div className='score-value'>{this.state.score}</div>
            <div className='line' />
            <div className='moves-left'>Potez<div className='moves-left-text-style'>{this.state.round}</div></div>
            <div className='line' />
            <div className='time-elapsed'>Vrijeme<div className={changeColor(this.state.elapsedTime)}>{parseTime(this.state.elapsedTime)}</div></div>
          </div>
        </div>
        <Restart onClick={this.restart} />
        <EndGame
          show={this.state.endGame}
          score={this.state.score}
          validName={this.state.validName}
          validEmail={this.state.validEmail}
          handleNameChange={this.handleNameChange}
          handleEmailChange={this.handleEmailChange}
          handleSubmit={this.handleSubmit}
          handleClose={this.restart}
          />
        <Congratulations show={this.state.submitted} finish={this.restart} />
      </div>
    )
  }
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
      col2: y,
      steps: true
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
        gameOver: response.data.gameOver,
        steps: response.data.steps,
        newRound: response.data.round,
        animationId: setTimeout(this.crash, Math.floor(SWAP_TIME * 500 - time))
      })
      clearTimeout(this.state.timeoutId)
    }).catch(err => {
      if (err.response) {
        console.log(err.response.data)
      }
      this.setState({
        animationId: setTimeout(this.resetState, SWAP_TIME * 1000)
      })
    })
    console.log('swap with: (' + x + ',' + y + ')')
    this.setState({
      mouseDown: false,
      boardEnabled: false,
      swap: true,
      x2: x,
      y2: y
    })
  }
}
function crash () {
  let step = this.state.steps.shift()
  let newItems = step.board
  let newScore = step.totalScore
  this.setState({
    items: this.state.stack ? this.state.newItems : this.state.swappedItems,
    newItems: newItems,
    crashed: step.groupedMatches,
    swap: false,
    crash: true,
    newScore: newScore,
    animationId: setTimeout(this.fadeOut, FADEOUT_TIME * 1000)
  })
  clearTimeout(this.state.timeoutId)
}
function crashStacked () {
  this.setState({
    stack: true
  })
  this.crash()
}
function fadeOut () {
  this.setState({
    crash: false,
    fadeOut: true,
    score: this.state.newScore,
    animationId: setTimeout(this.fadeIn, FADEOUT_TIME * 1000)
  })
}
function fadeIn () {
  // new items should be here
  this.setState({
    items: this.state.newItems,
    fadeOut: false,
    fadeIn: true
  })
  // if there are more steps
  if (this.state.steps.length >= 1) {
    this.setState({
      animationId: setTimeout(this.crashStacked, FADEIN_TIME * 1000)
    })
    // if this was the last move
  } else {
    // update score, round, continue
    this.setState({
      round: this.state.newRound
    })
    if (this.state.gameOver) {
      console.log('game over')
      this.setState({
        animationId: setTimeout(this.endGame, FADEIN_TIME * 1000)
      })
    } else {
      this.setState({
        animationId: setTimeout(this.resetStateAndTimer, FADEIN_TIME * 1000)
      })
    }
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
    mouseDown: false,
    swap: false,
    swapBack: false,
    crash: false,
    stack: false,
    fadeOut: false,
    fadeIn: false,
    boardEnabled: true
  })
  clearTimeout(this.state.timeoutId)
  setTimeout(this.addSecond, 1000)
}
function resetStateAndTimer () {
  this.setState({
    elapsedTime: 0
  })
  this.resetState()
}
function endGame () {
  this.setState({
    fadeIn: false,
    boardEnabled: true,
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
  if (!this.state.boardEnabled) {
    return
  }
  axios.post('http://jobfair.srolija.com/game/new', {
    token: 'axilis'
  }).then((response) => {
    this.setState({
      items: response.data.board,
      token: response.data.gameToken,
      swappedItems: [],
      newItems: [],
      x1: -1,
      y1: -1,
      x2: -1,
      y2: -1,
      crashed: [],
      score: 0,
      newScore: 0,
      round: 0,
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
      timeoutId: 0,
      gameOver: false,
      // end game
      name: '',
      email: '',
      validName: true,
      validEmail: true,
      submitted: false,
      reqStart: 0
    })
  })
  clearTimeout(this.state.timeoutId)
  this.addSecond()
}

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
    axios.post('http://jobfair.srolija.com/candidate', {
      name: this.state.name,
      email: this.state.email
    }).then(response => {
      console.log(response.data)
      this.setState({
        endGame: false,
        submitted: true
      })
    }).catch(err => {
      console.log(err)
    })
  } else {
    this.setState({
      validName: validName,
      validEmail: validEmail
    })
  }
  e.preventDefault()
}
// ***************** helper functions *****************
function addSecond () {
  this.setState({
    timeoutId: setTimeout(this.addSecond, 1000),
    elapsedTime: this.state.elapsedTime + 1
  })
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

function changeColor (elapsedTime) {
  if (elapsedTime <= 2) {
    return 'time-elapsed-text-style green'
  } else if (elapsedTime <= 4) {
    return 'time-elapsed-text-style yellow'
  } else {
    return 'time-elapsed-text-style red'
  }
}

export default App
