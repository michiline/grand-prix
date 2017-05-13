import React, { Component } from 'react'
// import { bounce } from 'react-animations'
// import Radium from 'radium'
import './App.css'
import Board from './Board'

const COLS = 9
const ROWS = 9

class App extends Component {
  constructor (props) {
    super()
    let items = Array.from({length: ROWS}, () => {
      return Array.from({length: COLS}, () => getRandomInt(0, 1))
    })
    this.state = {
      items: items,
      firstItem: {
        x: -1,
        y: -1
      },
      secondItem: {
        x: -1,
        y: -1
      },
      mouseDown: false,
      dragEnter: false
    }
    this.styles = {
      normal: {
        opacity: 1
      },
      mouseDown: {
        opacity: 0.7
      },
      translateRight: {
        transition: 'transform 0.3s',
        transform: 'translate(50px, 0px)'
      },
      translateLeft: {
        transition: 'transform 0.3s',
        transform: 'translate(-50px, 0px)'
      },
      translateUp: {
        transition: 'transform 0.3s',
        transform: 'translate(0px, -50px)'
      },
      translateDown: {
        transition: 'transform 0.3s',
        transform: 'translate(0px, 50px)'
      }
    }
    this.mouseDown = mouseDown.bind(this)
    this.mouseUp = mouseUp.bind(this)
    this.dragEnter = dragEnter.bind(this)
    this.getStyle = getStyle.bind(this)
    this.resetState = resetState.bind(this)
  }

  render () {
    return (
      <div className='App'>
        <Board
          items={this.state.items}
          mouseDown={this.mouseDown}
          mouseUp={this.mouseUp}
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

function mouseDown (e, x, y) {
  if (this.state.mouseDown === false) {
    this.setState({
      mouseDown: true,
      firstItem: {
        x: x,
        y: y
      }
    })
    console.log('1st item: (' + x + ',' + y + ')')
  }
}
function mouseUp (e, x, y) {
  this.setState({
    mouseDown: false,
    dragEnter: false,
    firstItem: {
      x: -1,
      y: -1
    },
    secondItem: {
      x: -1,
      y: -1
    }
  })
}
function dragEnter (e, x, y) {
  if (this.state.mouseDown === true && ((this.state.firstItem.x !== x && this.state.firstItem.y === y) || (this.state.firstItem.x === x && this.state.firstItem.y !== y))) {
    console.log('swap with: (' + x + ',' + y + ')')
    this.setState({
      mouseDown: false,
      dragEnter: true,
      secondItem: {
        x: x,
        y: y
      }
    })
    setTimeout(this.resetState, 300)
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
    dragEnter: false
  })
}

function getStyle (x, y) {
  if (this.state.mouseDown && this.state.firstItem.x === x && this.state.firstItem.y === y) {
    return this.styles.mouseDown
  } else if (this.state.dragEnter) {
    if (this.state.firstItem.x === x && this.state.firstItem.y === y) {
      if (this.state.firstItem.x === this.state.secondItem.x && this.state.firstItem.y === this.state.secondItem.y - 1) {
        return this.styles.translateRight
      } else if (this.state.firstItem.x === this.state.secondItem.x && this.state.firstItem.y === this.state.secondItem.y + 1) {
        return this.styles.translateLeft
      } else if (this.state.firstItem.x === this.state.secondItem.x - 1 && this.state.firstItem.y === this.state.secondItem.y) {
        return this.styles.translateDown
      }
      return this.styles.translateUp
    }
    if (this.state.secondItem.x === x && this.state.secondItem.y === y) {
      if (this.state.secondItem.x === this.state.firstItem.x && this.state.secondItem.y === this.state.firstItem.y - 1) {
        return this.styles.translateRight
      } else if (this.state.secondItem.x === this.state.firstItem.x && this.state.secondItem.y === this.state.firstItem.y + 1) {
        return this.styles.translateLeft
      } else if (this.state.secondItem.x === this.state.firstItem.x - 1 && this.state.secondItem.y === this.state.firstItem.y) {
        return this.styles.translateDown
      }
      return this.styles.translateUp
    }
  } else {
    return this.styles.normal
  }
}

export default App
