import React, { Component } from 'react'
import { styles } from '../styles'
class EndGame extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hoverClose: false,
      hoverSubmit: false
    }
    this.onMouseEnterClose = this.onMouseEnterClose.bind(this)
    this.onMouseLeaveClose = this.onMouseLeaveClose.bind(this)
    this.onMouseEnterSubmit = this.onMouseEnterSubmit.bind(this)
    this.onMouseLeaveSubmit = this.onMouseLeaveSubmit.bind(this)
  }
  onMouseEnterClose () {
    this.setState({
      hoverClose: true
    })
  }
  onMouseLeaveClose () {
    this.setState({
      hoverClose: false
    })
  }
  onMouseEnterSubmit () {
    this.setState({
      hoverSubmit: true
    })
  }
  onMouseLeaveSubmit () {
    this.setState({
      hoverSubmit: false
    })
  }
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
                    Konačan broj bodova!
                  </div>
                  <div className='end-game-score-value'>
                    {this.props.score}
                  </div>
                </div>
                <form className='end-game-form'>
                  <p className='end-game-name'>Ime i prezime</p>
                  <input name='name' type='text' className={this.props.validName ? 'end-game-input-valid' : 'end-game-input-invalid'} onChange={this.props.handleNameChange} />
                  {this.props.validName ? null : <p className='invalid-warning'>Polje ne smije ostati prazno</p>}
                  <p name='email' type='text' className='end-game-email'>Email</p>
                  <input className={this.props.validEmail ? 'end-game-input-valid' : 'end-game-input-invalid'} onChange={this.props.handleEmailChange} />
                  {this.props.validEmail ? null : <p hidden={this.props.validEmail ? 'true' : 'false'} className='invalid-warning'>Neispravan email</p>}
                  <input className={this.state.hoverSubmit ? 'end-game-submit hover-submit' : 'end-game-submit'} type='submit' value='Pošalji' onClick={this.props.handleSubmit} onMouseEnter={this.onMouseEnterSubmit} onMouseLeave={this.onMouseLeaveSubmit} />
                </form>
              </div>
              <div className='close-container' onClick={this.props.handleClose} onMouseEnter={this.onMouseEnterClose} onMouseLeave={this.onMouseLeaveClose}>
                <img alt='close_img' src={this.state.hoverClose ? require('../../images/x-hover.svg') : require('../../images/x.svg')} className='close-image' />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EndGame
