import React, { Component } from 'react'
import { styles } from '../styles'
class EndGame extends Component {
  render () {
    if (!this.props.show) {
      return null
    }
    return (
      <div style={styles.backdropStyle} >
        <div className='modal-container'>
          <div style={styles.modalStyle}>
            <div className='end-game-wrapper'>
              <div className='end-game-container noselect'>
                <div className='end-game-score-container'>
                  <div className='end-game-score'>
                    Your Total Score
                  </div>
                  <div className='end-game-score-value'>
                    {this.props.score}
                  </div>
                </div>
                <form className='end-game-form'>
                  <p className='end-game-name'>Full name</p>
                  <input name='name' type='text' className={this.props.validName ? 'end-game-input-valid' : 'end-game-input-invalid'} onChange={this.props.handleNameChange} />
                  {this.props.validName ? null : <p className='invalid-warning'>Polje ne smije ostati prazno</p>}
                  <p name='email' type='text' className='end-game-email'>Email</p>
                  <input className={this.props.validEmail ? 'end-game-input-valid' : 'end-game-input-invalid'} onChange={this.props.handleEmailChange} />
                  {this.props.validEmail ? null : <p className='invalid-warning'>Neispravan email</p>}
                  <input className='end-game-submit' type='submit' value='Submit' onClick={this.props.handleSubmit} />
                </form>
              </div>
              <div className='close-container' onClick={this.props.handleClose}>
                <img alt='close_img' src={require('../../images/x.svg')} className='close-image' />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EndGame
