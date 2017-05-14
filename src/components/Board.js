import React, { Component } from 'react'
let images = [require('../../images/ic-usb.svg'), require('../../images/ic-chip.svg'), require('../../images/ic-magnifying-glass.svg'), require('../../images/ic-mouse.svg'), require('../../images/ic-settings.svg'), require('../../images/ic-folder.svg')]

class Board extends Component {
  render () {
    // const images = [img1, img2].map((src) => {
    //   const img = document.createElement('img')
    //   img.src = src
    // })
    return (
      <table className={this.props.boardEnabled ? 'enabled board' : 'disabled board'}>
        <tbody>
          {
            this.props.items.map((row, x) => {
              return (
                <tr key={x}>
                  {
                    row.map((item, y) => {
                      return (
                        <td key={x * 10 + y}>
                          <img
                            className='ic_item'
                            id={'{"x":' + x + ',"y":' + y + '}'}
                            alt='img' src={images[item]}
                            onMouseDown={(e) => { this.props.mouseDown(e, x, y) }}
                            onMouseUp={(e) => { this.props.mouseUp(e, x, y) }}
                            onDragEnter={(e) => { this.props.dragEnter(e, x, y) }}
                            style={this.props.getStyle(x, y)}
                            />
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}

export default Board
