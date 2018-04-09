import React from 'react';
import axios from 'axios';

export default class CategoryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category_name: ''
    }
    this.createCategory = this.createCategory.bind(this);
    this.cancelCategory = this.cancelCategory.bind(this);
  }

  createCategory() {
    // axios.post('/create/category', { category_name: this.state.category_name })
    //   .then(() => {
    //     this.setState({ category_name: '' },
    //     () => {
    //       this.props.getCategories();
    //       this.props.closeModal('categoryModal');
    //     })
    //   })
    let newCategory = {};
    newCategory['category_name'] = this.state.category_name;
    this.props.handleNewCategory(newCategory);
    this.setState({ category_name: '' }, () => {
      this.props.closeModal('categoryModal')
    })
  }

  cancelCategory() {
    this.setState({ category_name: ''}, () => {
      this.props.closeModal('categoryModal')
    })
  }

  render() {
    return (
      <div id="categoryModal" className="categoryModal animated fadeIn">
        <div className="modal-content-category">
          <div className="modal-header-category">
            <div className="modal-title">Create Category</div>
            <div className="modal-close" onClick={this.cancelCategory}><i className="fas fa-times-circle"></i></div>

          </div>
          <div className="modal-body-category">
            <input
              type="text"
              value={this.state.category_name}
              onChange={(e) => this.setState({ category_name: e.target.value }, () => console.log(this.state.category_name))}
              placeholder="Enter new Category Name"
              style={{ color: 'black' }}
            />
            <button type="button" onClick={this.createCategory} >
              <h3 style={{ color: 'white' }}>Create Category</h3>
            </button>
          </div>
          <div className="modal-footer-category">Please Pick</div>
        </div>
      </div>
    )
  }
}
