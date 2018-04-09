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
    if (this.state.ingredients.length === 0) {
      axios.get('/fetch/ingredients', { params: this.props.item })
      .then((res) => {
        console.log('this is res.data\n', res.data)
        this.setState({ ingredients: res.data })
      })
    }
  }



  render() {
    return (
      <div>{this.state.ingredients.map((ingredient, i) =>
        <CustomizeIngredients
          removeIng={this.props.removeIng}
          ingredient={ingredient}
          i={i}
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
