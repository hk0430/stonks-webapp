import React, { Component } from 'react'

class Modal extends Component {
    getStyle = () => {
        console.log("changing modal style");
        return {
            zIndex: this.props.modalState ? '1' : '0'
        }
    }

    render() {
        return (
            <div className="modal" style={this.getStyle()}>
                <div className="modal-content">
                    <p className="inside_modal">New Option Flow</p><br/>
                    <button className="modal_button" onClick={this.props.deleteList}>Submit</button>
                    <button className="modal_button" onClick={this.props.hideModal}>Cancel</button>
                </div>
            </div>
        )
    }
}

export default Modal;