import React from 'react';

export default class CustomizeIngredients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crossed: false,
    }
    this.crossOutItem = this.crossOutItem.bind(this);
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
  }

  componentDidMount() {

  }

  remove() {
    this.setState({ crossed: !this.state.crossed}, () => {
      this.props.removeIng(this.props.ingredient, this.props.i, this.state.crossed, this.props.index)
    })
  }

  add() {
    this.setState({ crossed: !this.state.crossed}, () => {
      this.props.addIng(this.props.ingredient, this.props.i, this.state.crossed, this.props.index)
    })
  }

  crossOutItem() {
    this.setState({ crossed: !this.state.crossed} , () => {
      if (this.state.crossed) {
        this.remove()
      } else {
        this.add()
      }
    })

  }

  render() {
    console.log('this is props in customize ingredients', this.props)
    return (
      <div
        onClick={this.state.crossed ? this.add : this.remove}
        style={this.state.crossed ? {'text-decoration' : 'line-through', 'color': 'grey'} : {'color': 'grey'}}>
        {this.props.ingredient.ingredient_name}
      </div>
    );
  }
}
