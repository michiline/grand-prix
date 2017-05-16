import React, { Component } from 'react'

class Restart extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hover: false
    }
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }
  onMouseEnter () {
    this.setState({
      hover: true
    })
  }
  onMouseLeave () {
    this.setState({
      hover: false
    })
  }
  render () {
    return (
      <button className='restart-container noselect' onClick={this.props.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div className='restart-outer-div'>
          <img className='restart-img' alt='restart-img' src={this.state.hover ? require('../../images/restart-hover.svg') : require('../../images/restart.svg')} />
          <div className={this.state.hover ? 'restart hover' : 'restart'}>Restart</div>
        </div>
      </button>
    )
  }
}

export default Restart
