import React from 'react';
import axios from 'axios';
import CustomizeIngredients from './customizeIngredients.jsx'

export default class CustomModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: [],
    };
  }

  componentWillMount() {
    console.log('this is props.item', this.props.item)
    // if (this.state.ingredients.length === 0) {
    axios.get('/fetch/items/ingredients', { params: {id: this.props.item.id} })
    .then((res) => {
      console.log('this is results', res.data);
      this.setState({ ingredients: res.data })
    })
    // }
  }



  render() {
    return (
      <div>{this.state.ingredients.map((ingredient, i) =>
        <CustomizeIngredients
          menuItems={this.props.menuItems}
          removeIng={this.props.removeIng}
          addIng={this.props.addIng}
          ingredient={ingredient}
          i={i}
          item={this.props.item}
          index={this.props.index}
        />)}
      </div>
    )
  }
}


/*
<div
  style={{'text-decoration': 'line-through'}}
  onClick={() => console.log(ingredient)}>{ingredient.ingredient_name}</div>
*/
