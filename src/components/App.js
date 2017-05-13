import React, { Component } from 'react'
// import { bounce } from 'react-animations'
// import Radium from 'radium'
import './App.css'
import Board from './Board'

const COLS = 9
const ROWS = 9
const SWAP_TIME = 0.25
const FADEOUT_TIME = 0.75
const FADEIN_TIME = 0.75
const SWAP_DISTANCE = '50px'

class App extends Component {
  constructor (props) {
    super()
    let items = Array.from({length: ROWS}, () => {
      return Array.from({length: COLS}, () => getRandomInt(0, 1))
    })
    this.state = {
      items: items,
      x1: -1,
      y1: -1,
      x2: -1,
      y2: -1,
      crashed: [{
        x: 8,
        y: 0
      },
      {
        x: 8,
        y: 1
      },
      {
        x: 8,
        y: 2
      }],
      mouseDown: false,
      dragEnter: false,
      crash: false,
      fadeOut: false,
      fadeIn: false,
      boardEnabled: true
    }
    this.styles = {
      normal: {
        opacity: 1
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
      fadeIn: {
        animation: 'fadeIn ' + FADEIN_TIME + 's linear'
      }
    }
    this.mouseDown = mouseDown.bind(this)
    this.dragEnter = dragEnter.bind(this)
    this.crash = crash.bind(this)
    this.fadeOut = fadeOut.bind(this)
    this.fadeIn = fadeIn.bind(this)
    this.resetState = resetState.bind(this)
    this.getStyle = getStyle.bind(this)
  }

  render () {
    return (
      <div className='App'>
        <Board
          items={this.state.items}
          boardEnabled={this.state.boardEnabled}
          mouseDown={this.mouseDown}
          mouseUp={this.resetState}
          dragEnter={this.dragEnter}
          getStyle={this.getStyle}
          />
      </div>
    )
  }
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
      setTimeout(this.resetState, 300)
    }
    // ako se ne crasha
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
    crash: true
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
  let newItems = Array.from({length: ROWS}, () => {
    return Array.from({length: COLS}, () => getRandomInt(0, 1))
  })
  this.setState({
    fadeOut: false,
    fadeIn: true
  })
  setTimeout(this.resetState, FADEIN_TIME * 1000)
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
    dragEnter: false,
    boardEnabled: true,
    crash: false,
    fadeOut: false,
    fadeIn: false
  })
}

function getStyle (x, y) {
  // if first item is selected
  if (this.state.mouseDown && this.state.x1 === x && this.state.y1 === y) {
    return this.styles.fadeOut
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
        return this.styles.fadeOut
      }
    }
    // fade out new items
  } else if (this.state.fadeIn) {
    for (let i = 0; i < this.state.crashed.length; i++) {
      // if it's in the right column
      if (this.state.crashed[i].y === y && this.state.crashed[i].x >= x) {
        return this.styles.fadeIn
      }
    }
  } else {
    for (let i = 0; i < this.state.crashed.length; i++) {
      // if it's in the right column
      if (this.state.crashed[i].y === y && this.state.crashed[i].x >= x) {
        return this.styles.fadeOut
      }
    }
  }
  return this.styles.normal
}

export default App
