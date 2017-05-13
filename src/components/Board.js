import React, { Component } from 'react'
let images = ['http://i.imgur.com/dWqwijb.png', 'http://i.imgur.com/FWG4dYi.png']

class Board extends Component {
  render () {
    // const images = [img1, img2].map((src) => {
    //   const img = document.createElement('img')
    //   img.src = src
    // })
    return (
      <div>
        <table className={this.props.boardEnabled ? 'enabled' : 'disabled'}>
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
      </div>
    )
  }
}

export default Board
