import React from 'react';


export default class discardModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'dummy': 'dummy'
    }
    this.discardChanges = this.discardChanges.bind(this);
  }

  discardChanges() {
    console.log('discarding changes')
    this.props.discardChanges();
    this.props.closeModal('discardModal');
  }

  render() {
    return (
      <div id="discardModal" className="discardModal animated fadeIn">
        <div className="modal-content-discard">
          <div className="modal-header-discard">
            <div className="modal-title">Discard Changes</div>
            <div className="modal-close" onClick={() => this.props.closeModal('discardModal')}><i className="fas fa-times-circle"></i></div>
          </div>
          <div className="modal-body-discard">
            <h3>Please confirm to discard your changes.</h3>
            <div className="confirmOrCancel">
              <div onClick={this.discardChanges} className="confirmDiscard">Discard Changes</div>
              <div onClick={() => this.props.closeModal('discardModal')} className="cancelDiscard">Cancel</div>
            </div>
          </div>
          <div className="modal-footer-discard">A</div>

      </div>
     </div>
    )
  }
}
