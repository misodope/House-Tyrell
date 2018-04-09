import React from 'react';

export default class CustomizeIngredients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crossed: false,
    }

    this.crossOutItem = this.crossOutItem.bind(this);
  }

  crossOutItem() {
    this.setState({ crossed: !this.state.crossed },
      () => this.props.removeIng(this.props.ingredient, this.props.i, this.state.crossed),
    );
  }

  render() {
    return (
      <div
        onClick={this.crossOutItem}
        style={this.state.crossed ? {'text-decoration' : 'line-through', 'color': 'grey'} : {'color': 'grey'}}>
        {this.props.ingredient.ingredient_name}
      </div>
    );
  }
}
