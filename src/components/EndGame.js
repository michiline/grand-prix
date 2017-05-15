import React, { Component } from 'react'

class EndGame extends Component {
  render () {
    if (this.props.show === false) {
      return null
    }
    let modalStyle = {
      display: 'table-cell',
      verticalAlign: 'middle',
      height: '100%',
      width: '100%',
      zIndex: '9999'
    }
    let backdropStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '0px',
      left: '0px',
      zIndex: '9998',
      background: 'rgba(0, 0, 0, 0.3)'
    }
    return (
      <div style={backdropStyle} >
        <div className='modal-container'>
          <div style={modalStyle}>
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
          </div>
        </div>
      </div>
    )
  }
}

export default EndGame
