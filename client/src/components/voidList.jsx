import React from 'react';

export default class VoidList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
    this.selectItem = this.selectItem.bind(this);
  }

  selectItem(item) {
    this.setState({ selected: !this.state.selected }, () => {
      if (this.state.selected) {
        this.props.selectedList.push(item);
        this.props.updateSelectedList(this.props.selectedList);
      } else {
        this.props.selectedList.splice(this.props.selectedList.indexOf(item), 1);
        this.props.updateSelectedList(this.props.selectedList);
      }
    });
  }

  render() {
    return (
      <div 
        onClick={() => this.selectItem(this.props.item)}
        style={this.state.selected ? {'color': 'red'} : {'color': 'grey'}}>
          {this.props.item}
      </div>
    )
  }
}
