import React, { Component } from 'react'

class Submitted extends Component {
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
                <div className='congatulations'>
                  Čestitamo!
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Submitted
