import React from 'react';

export default class RemoveCategoryConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'dummy': ''
    }
  }

  render() {
    return (
      <div id="removeCatModal" className="removeCatModal animated fadeIn">
        <div className="modal-content-removeCat">
          <div className="modal-header-removeCat">
            <div className="modal-title">Remove Category</div>
            <div className="modal-close" onClick={() => this.props.closeModal('removeCatModal')}><i className="fas fa-times-circle"></i></div>
          </div>
          <div className="modal-body-removeCat">
            <h3>Please Confirm to remove this category</h3>
            <div className="confirmOrCancel">
              <div onClick={this.props.confirmCategoryConfirm} className="confirmConfirm">Remove Category</div>
              <div onClick={() => this.props.closeModal('removeCatModal')} className="cancelConfirm">Cancel</div>
            </div>
          </div>
          <div className="modal-footer-removeCat">A</div>
      </div>
     </div>
    )
  }
}
