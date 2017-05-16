import React, { Component } from 'react'
import { styles } from '../styles'
class Congratulations extends Component {
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
              <input className='congratulations-finish' type='submit' value='Završi' onClick={this.props.finish} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Congratulations
