import React, { Component } from 'react'
import { styles } from '../styles'
class Congratulations extends Component {
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
    if (this.props.show === false) {
      return null
    }

    return (
      <div style={styles.backdropStyle} >
        <div className='modal-container'>
          <div style={styles.modalStyle}>
            <div className='end-game-container noselect'>
              <div className='end-game-score-container'>
                <p className='congratulations'>
                  Čestitamo!
                </p>
              </div>
              <p className='congratulations-text'>
                Uspješno ste poslali rezultat svoje igre!
              </p>
              <input className={this.state.hover ? 'congratulations-finish hover-submit' : 'congratulations-finish'} type='submit' value='Završi' onClick={this.props.finish} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Congratulations
