const SWAP_TIME = 0.25
const FADEOUT_TIME = 0.75
const FADEIN_TIME = 0.75
const SWAP_DISTANCE = '59px'
const styles = {
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

function getStyle (x, y) {
  // if first item is selected
  if (this.state.mouseDown && this.state.x1 === x && this.state.y1 === y) {
    return styles.mouseDown
    // if first item is dragged to second item
  } else if (this.state.swap) {
    // for the first item
    if (this.state.x1 === x && this.state.y1 === y) {
      if (this.state.x1 === this.state.x2 && this.state.y1 === this.state.y2 - 1) {
        return styles.translateRight
      } else if (this.state.x1 === this.state.x2 && this.state.y1 === this.state.y2 + 1) {
        return styles.translateLeft
      } else if (this.state.x1 === this.state.x2 - 1 && this.state.y1 === this.state.y2) {
        return styles.translateDown
      }
      return styles.translateUp
    }
    // for the second item
    if (this.state.x2 === x && this.state.y2 === y) {
      if (this.state.x2 === this.state.x1 && this.state.y2 === this.state.y1 - 1) {
        return styles.translateRight
      } else if (this.state.x2 === this.state.x1 && this.state.y2 === this.state.y1 + 1) {
        return styles.translateLeft
      } else if (this.state.x2 === this.state.x1 - 1 && this.state.y2 === this.state.y1) {
        return styles.translateDown
      }
      return styles.translateUp
    }
  } else if (this.state.crash) {
    for (let i = 0; i < this.state.crashed.length; i++) {
      if (this.state.crashed[i][0] === x && this.state.crashed[i][1] === y) {
        return styles.fadeOutLonger
      }
    }
    // fade out new items
  } else if (this.state.fadeOut) {
    for (let i = 0; i < this.state.crashed.length; i++) {
      // if it's in the right column
      if (this.state.crashed[i][0] === x && this.state.crashed[i][1] > y) {
        return styles.fadeOut
      } else if (this.state.crashed[i][1] === y && this.state.crashed[i][0] === x) {
        return styles.invisible
      }
    }
  } else {
    for (let i = 0; i < this.state.crashed.length; i++) {
      // if it's in the right column
      if (this.state.crashed[i][0] === x && this.state.crashed[i][1] >= y) {
        return styles.fadeIn
      }
    }
  }
  return styles.fadeIn
}

export { getStyle, SWAP_TIME, FADEOUT_TIME, FADEIN_TIME }
