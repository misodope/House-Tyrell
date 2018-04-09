
import React from 'react';
import sendReceipt from '../../helpers/sendEmail.js';

class EmailAddressModal extends React.Component {
  constructor() {
    super();
    this.state = {
      emailAddress: '',
    };
  }



  render() {
    return (
      <div id="emailModal" className="discountModal animated fadeIn">
        <div className="modal-content">
          <div className="modal-header">Please enter your e-mail address<div className="discountClose" onClick={() => closeModal('emailModal')}>&times;</div></div>
          <div className="modal-body">
            <form onSubmit={() =>  }>
              <input type="text" placeholder="Enter your e-mail address" onChange={e => this.setState({ emailAddress: e.target.value })}/>
              <button type="submit">Send</button>
            </form>
          </div>
          <div className="modal-footer"> Thank you for your business!</div>
        </div>
      </div>
    )
  }
}

export default EmailAddressModal;
