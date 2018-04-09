import React from 'react'
import CustomModal from './customModal.jsx'

export default class TransactionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy: '',
      modalIsOpen: false,
    }
    this.showModal = this.showModal.bind(this);
  }

  showModal() {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  }

  render() {
    return (
      <div>
        {this.state.modalIsOpen ?
          <div>{this.props.item.item_name}
            <CustomModal
              removeIng={this.props.removeIng}
              item={this.props.item}
              addIng={this.props.addIng}
              index={this.props.index}
              menuItems={this.props.menuItems}
            />
          </div>
          : <div onClick={this.showModal}>{this.props.item.item_name}</div>}
      </div>
    )
  }
}
