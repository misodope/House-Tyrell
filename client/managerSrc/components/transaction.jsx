  import React from 'react';
// import ReactModal from 'react-modal';
import CustomModal from './customModal.jsx';
import TransactionItem from './transactionItem.jsx'
import SaleControl from './saleControl.jsx';



export default class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1,
      itemTotal: 0,
      modalIsOpen: false,
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }




  render() {
    let showDiscount = null;
    if (this.props.discount > 0) {
      showDiscount = <div style={{ 'gridRow': '4', 'gridColumn': '4', color: 'rgb(149, 152, 150)' }}>{(this.props.discount)}% Discount</div>;
    }
    return (

      <div className='transactionGrid'>

        <div className='transactionGridItemsManager'>
          <button onClick={() => this.props.openModal('confirmationModal')} className='saveChanges'>Save Changes</button>
          <button onClick={() => this.props.openModal('discardModal')} className='discardChanges'>Discard Changes</button>
        </div>

        <div className='transactionGridFooter'>
          <div style={{ gridRow: '1', gridColumn: '4' }}>{this.props.tax.toFixed(2)} Tax </div>
          <div style={{ gridRow: '2', gridColumn: '4' }}>{this.props.total.toFixed(2)} subTotal </div>
          <div style={{ gridRow: '3', gridColumn: '4' }}>{(this.props.total + this.props.tax - ((this.props.total + this.props.tax) * (this.props.discount / 100))).toFixed(2)} Total </div>
          {showDiscount}
        </div>

        <div className="saleControlGrid" style={{ gridRow: '6', height: '100%' }}>
          <SaleControl
            total={this.props.total}
            tax={this.props.tax}
            discount={this.props.discount}
            openDiscountModal={this.props.openDiscountModal}
            transactionComplete={this.props.transactionComplete}
            transactionItems={this.props.transactionItems}
            openVoidModal={this.props.openVoidModal}
          />
        </div>
      </div>
    )
  }
}

// (<ReactModal
//                 isOpen={this.state.modalIsOpen}
//                 onAfterOpen={this.afterOpenModal}
//                 onRequestClose={this.closeModal}
//                 contentLabel="Example Modal"
//               >
//                 <button onClick={this.closeModal}>close</button>
//                <div>I am a modal</div>
//              </ReactModal>, )
