import React from 'react';
import axios from 'axios';
import Select from 'react-select';

export default class itemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item_name: '',
      item_price: '',
      item_image: '',
      item_ingredients: [],
      item_category: '',
      categories: [],
      ingredients: [],
      categorySelect: [],
    }
    this.createItem = this.createItem.bind(this);
    this.handleIngredient = this.handleIngredient.bind(this);
    this.cancelItem = this.cancelItem.bind(this);
    this.updateCat = this.updateCat.bind(this);
    this.handleIngredientInput = this.handleIngredientInput.bind(this);
  }

  handleIngredient(item, index) {
    let clicked = document.getElementById(`modal-item_${index}`)
    clicked.style.color = (clicked.style.color === 'green') ? 'grey' : 'green';
    clicked.style.textDecoration = (clicked.style.textDecoration === 'line-through') ? '' : 'line-through'
    let input = document.getElementById(`modal-item_input${index}`)
    if (clicked.style.color === 'green') input.readOnly = false;
    if (clicked.style.color === 'grey') {
      input.readOnly = true;
      input.value = '';
    }

    if (clicked.style.color === 'green') {
      let temp = this.state.item_ingredients.slice();
      temp.push({ingredient_id: index+1, ingredient_amount: ''});
      this.setState({ item_ingredients: temp }, () => console.log('this is item_ingredients', this.state.item_ingredients))
    } else {
      let temp = this.state.item_ingredients.slice();
      let found;
      for (let i = 0; i < temp.length; i += 1) {
        if (temp[i].ingredient_id === index+1) found = i;
      }
      temp.splice(found, 1);
      this.setState({ item_ingredients: temp }, () => console.log('this is item_ingredients', this.state.item_ingredients))
    }
  }

  handleIngredientInput(amount, index) {
    let temp = this.state.item_ingredients.slice()
    let location = 0;
    for (let i = 0; i < temp.length; i ++) {
      if (temp[i].ingredient_id === index+1) location = i;
    }
    temp[location].ingredient_amount = parseFloat(amount).toFixed(2);
    this.setState({item_ingredients: temp}, () => {
      console.log('this is itemIngredients', this.state.item_ingredients)
    })
  }


  createItem() {


    let newItem = {}
    newItem['item_name'] = this.state.item_name;
    newItem['item_price'] = this.state.item_price;
    newItem['item_image'] = this.state.item_image;
    newItem['item_ingredients'] = this.state.item_ingredients;
    newItem['item_category'] = this.state.item_category;
    console.log('this is newItem', newItem);
    this.props.handleNewItem(newItem);

    let ing = this.props.ingredients.slice();

    for (let i = 0; i < ing.length; i += 1) {
      let clicked = document.getElementById(`modal-item_${i}`);
      clicked.style.color = 'grey';
      clicked.style.textDecoration = 'line-through';
      let input = document.getElementById(`modal-item_input${i}`);
      input.value = '';
    }

    this.setState({
      item_name: '',
      item_price: '',
      item_image: '',
      item_ingredients: [],
      item_category: '',
    }, () => {
      this.props.closeModal('itemModal');
    });
  }

  cancelItem() {
    this.setState({
      item_name: '',
      item_price: '',
      item_image: '',
      item_ingredients: [],
      item_category: '',
    }, () => {
      this.props.closeModal('itemModal');
    });
  }

  updateCat(val) {
    this.setState({ item_category: val }, () => {console.log('this is the new category', this.state.item_category)})
  }


  render() {
    return (
      <div id="itemModal" className="itemModal animated fadeIn">
        <div className="modal-content-manager">
          <div className="modal-header-manager">
            <div className="modal-title">Create New Item</div>
            <div className="modal-close" onClick={this.cancelItem}><i className="fas fa-times-circle"></i></div>
          </div>
          <div className="modal-body-manager">
            <input
              type="text"
              className="modal-ingredient-input"
              value={this.state.item_name}
              onChange={(e) => this.setState({ item_name: e.target.value })}
              placeholder="Enter new Item Name"
              style={{ color: 'black' }}
            />
            <input
              type="Number"
              className="modal-ingredient-input"
              value={this.state.item_price}
              onChange={(e) => this.setState({ item_price: e.target.value })}
              placeholder="Enter Item Price"
              style={{ color: 'black' }}
            />
            <div style={{ color: 'black' }}>
              <input
                type="file"
                accept='image/*'
                onChange={(e) => this.setState({ item_image: e.target.files[0] })}
                placeholder="Upload a photo"
              />
            </div>
            <div className="modal-ingredient-grid">
              {this.props.ingredients.map((ingredient, i) => {
                return (
                <div>
                  <div
                    style={{textDecoration: 'line-through', color: 'grey',}}
                    onClick={() => this.handleIngredient(ingredient, i)}
                    id={`modal-item_${i}`}>{ingredient.ingredient_name}
                  </div>
                  <div>
                    <input
                      id={`modal-item_input${i}`}
                      className="modal-ingredient-input"
                      type="Number"
                      onChange={(e) => this.handleIngredientInput(e.target.value, i)}
                      readOnly
                      placeholder='Enter Amount'
                    />
                  </div>
                </div>)
              })}
            </div>
            <div className="modal-category-select">
              <Select
                className="discountDropdown"
                options={this.props.catOptions}
                matchProp="any"
                searchable="false"
                onChange={value => this.updateCat(value.value)}
              />
            </div>
            <button type="button" onClick={this.createItem}>
              <h3 style={{ color: 'white' }}>Create Item</h3>
            </button>
          </div>
          <div className="modal-footer-manager">Please Pick</div>
        </div>
      </div>
    )
  }
}
