import React, { Component } from 'react'
import './App.css'
import Board from './Board'
import EndGame from './EndGame'
import Submitted from './Submitted'

const COLS = 9
const ROWS = 9
const SWAP_TIME = 0.25
const FADEOUT_TIME = 0.75
const FADEIN_TIME = 0.75
const SWAP_DISTANCE = '56px'
const MOVES_LEFT = 2

class App extends Component {
  constructor (props) {
    super()
    let items = Array.from({length: ROWS}, () => {
      return Array.from({length: COLS}, () => getRandomInt(0, 5))
    })
    this.state = {
      x1: -1,
      y1: -1,
      x2: -1,
      y2: -1,
      crashed: [{
        x: 3,
        y: 5
      },
      {
        x: 4,
        y: 5
      },
      {
        x: 5,
        y: 5
      },
      {
        x: 6,
        y: 5
      },
      {
        x: 4,
        y: 4
      },
      {
        x: 4,
        y: 3
      }],
      items: items,
      // info
      score: 0,
      movesLeft: MOVES_LEFT,
      elapsedTime: 0,
      // states
      mouseDown: false,
      dragEnter: false,
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
      submit: false
    }
    this.styles = {
      normal: {
        opacity: 1
      },
      invisible: {
        opacity: 0
      },
      mouseDown: {
        opacity: 0.7
      },
      translateRight: {
        transition: 'transform ' + SWAP_TIME + 's',
        transform: 'translate(' + SWAP_DISTANCE + ', 0px)'
      },
      translateLeft: {
        transition: 'transform ' + SWAP_TIME + 's',
        transform: 'translate(-' + SWAP_DISTANCE + ', 0px)'
      },
      translateUp: {
        transition: 'transform ' + SWAP_TIME + 's',
        transform: 'translate(0px,-' + SWAP_DISTANCE + ')'
      },
      translateDown: {
        transition: 'transform ' + SWAP_TIME + 's',
        transform: 'translate(0px, ' + SWAP_DISTANCE + ')'
      },
      fadeOut: {
        animation: 'fadeOut ' + FADEOUT_TIME + 's linear'
      },
      fadeOutLonger: {
        animation: 'fadeOut ' + (FADEOUT_TIME + 0.15) + 's linear'
      },
      fadeIn: {
        animation: 'fadeIn ' + FADEIN_TIME + 's linear'
      }
    }
    this.mouseDown = mouseDown.bind(this)
    this.dragEnter = dragEnter.bind(this)
    this.crash = crash.bind(this)
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
              dragEnter={this.dragEnter}
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
        <EndGame show={this.state.endGame} score={this.state.score}
          validName={this.state.validName} validEmail={this.state.validEmail}
          handleNameChange={this.handleNameChange} handleEmailChange={this.handleEmailChange}
          handleSubmit={this.handleSubmit}
          />
        <Submitted show={this.state.submit} />
      </div>
    )
  }
}

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

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// mouse events

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
function dragEnter (e, x, y) {
  // ovdje bi trebao ici API poziv
  if (this.state.mouseDown === true && ((this.state.x1 !== x && this.state.y1 === y) || (this.state.x1 === x && this.state.y1 !== y))) {
    console.log('swap with: (' + x + ',' + y + ')')
    this.setState({
      movesLeft: this.state.movesLeft - 1,
      mouseDown: false,
      boardEnabled: false,
      dragEnter: true,
      x2: x,
      y2: y
    })
    // ako se crasha, if crashed.length > 0
    let crash = true
    if (crash) {
      setTimeout(this.crash, SWAP_TIME * 1000)
    } else {
      setTimeout(this.resetState, SWAP_TIME * 2000)
    }
  }
}
function crash () {
  // moze biti vise crashanja
  let newItems = this.state.items.slice()
  let temp = this.state.items[this.state.x1][this.state.y1]
  newItems[this.state.x1][this.state.y1] = newItems[this.state.x2][this.state.y2]
  newItems[this.state.x2][this.state.y2] = temp
  this.setState({
    items: newItems,
    dragEnter: false,
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
    fadeOut: false,
    fadeIn: true
  })
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
    dragEnter: false,
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
    dragEnter: false,
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
    dragEnter: false,
    crash: false,
    fadeOut: false,
    fadeIn: false,
    boardEnabled: true,
    stopTimer: false,
    submit: false
  })
  setTimeout(this.addSecond, 1000)
}

function getStyle (x, y) {
  // if first item is selected
  if (this.state.mouseDown && this.state.x1 === x && this.state.y1 === y) {
    return this.styles.mouseDown
    // if first item is dragged to second item
  } else if (this.state.dragEnter) {
    // for the first item
    if (this.state.x1 === x && this.state.y1 === y) {
      if (this.state.x1 === this.state.x2 && this.state.y1 === this.state.y2 - 1) {
        return this.styles.translateRight
      } else if (this.state.x1 === this.state.x2 && this.state.y1 === this.state.y2 + 1) {
        return this.styles.translateLeft
      } else if (this.state.x1 === this.state.x2 - 1 && this.state.y1 === this.state.y2) {
        return this.styles.translateDown
      }
      return this.styles.translateUp
    }
    // for the second item
    if (this.state.x2 === x && this.state.y2 === y) {
      if (this.state.x2 === this.state.x1 && this.state.y2 === this.state.y1 - 1) {
        return this.styles.translateRight
      } else if (this.state.x2 === this.state.x1 && this.state.y2 === this.state.y1 + 1) {
        return this.styles.translateLeft
      } else if (this.state.x2 === this.state.x1 - 1 && this.state.y2 === this.state.y1) {
        return this.styles.translateDown
      }
      return this.styles.translateUp
    }
    // if it's crashing time
  } else if (this.state.crash) {
    for (let i = 0; i < this.state.crashed.length; i++) {
      if (this.state.crashed[i].x === x && this.state.crashed[i].y === y) {
        return this.styles.fadeOutLonger
      }
    }
    // fade out new items
  } else if (this.state.fadeOut) {
    for (let i = 0; i < this.state.crashed.length; i++) {
      // if it's in the right column
      if (this.state.crashed[i].y === y && this.state.crashed[i].x > x) {
        return this.styles.fadeOut
      } else if (this.state.crashed[i].y === y && this.state.crashed[i].x === x) {
        return this.styles.invisible
      }
    }
  } else {
    for (let i = 0; i < this.state.crashed.length; i++) {
      // if it's in the right column
      if (this.state.crashed[i].y === y && this.state.crashed[i].x >= x) {
        return this.styles.fadeIn
      }
    }
  }
  return this.styles.normal
}

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
