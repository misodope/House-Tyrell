import React from 'react';

export default class RemoveItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'dummy': ''
    }
    this.removeItem = this.removeItem.bind(this);
  }
  
  removeItem() {
    this.props.handleRemoveConfirm();
  }


  render() {
    return (
      <div id="removeItemModal" className="removeItemModal animated fadeIn">
        <div className="modal-content-removeItem">
          <div className="modal-header-removeItem">
            <div className="modal-title">Remove Item</div>
            <div className="modal-close" onClick={() => this.props.closeModal('removeItemModal')}><i className="fas fa-times-circle"></i></div>
          </div>
          <div className="modal-body-removeItem">
            <h3>Please Confirm to remove this item</h3>
            <div className="confirmOrCancel">
              <div onClick={this.removeItem} className="confirmConfirm">Remove Item</div>
              <div onClick={() => this.props.closeModal('removeItemModal')} className="cancelConfirm">Cancel</div>
            </div>
          </div>
          <div className="modal-footer-removeItem">A</div>
      </div>
     </div>
    )
  }
}
