import React from 'react';
import axios from 'axios';


export default class confirmationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'dummy': 'dummy'
    }
    this.saveChanges = this.saveChanges.bind(this);
  }

  saveChanges() {
    axios.post('/delete/employee', {employee_id: this.props.employeeId})
      .then(() => {
        this.props.deletedEmployee();
        this.props.closeDelete('deleteEmployeeModal');
      })
  }

  render() {
    return (
      <div id="deleteEmployeeModal" className="deleteEmployeeModal animated fadeIn">
        <div className="modal-content-deleteEmployee">
          <div className="modal-header-deleteEmployee">
            <div className="modal-title">Confirm Delete for Employee</div>
            <div className="modal-close" onClick={() => this.props.closeDelete('deleteEmployeeModal')}><i className="fas fa-times-circle"></i></div>
          </div>
          <div className="modal-body-deleteEmployee">
            <h3>Please confirm that you want to remove this employee and all of the employee's data.</h3>
            <div className="modal-body-employeeName">
              <h3>
                Employee Name: {this.props.employeeName}
              </h3>
            </div>
            <div className="modal-body-employeeId">
              <h3>
                Employee ID: {this.props.employeeId}
              </h3>
            </div>
            <div className="confirmOrCancelDelete">
              <div onClick={this.saveChanges} className="confirmConfirmDelete">Delete Employee</div>
              <div onClick={() => this.props.closeDelete('deleteEmployeeModal')} className="cancelConfirmDelete">Cancel</div>
            </div>
          </div>
          <div className="modal-footer-deleteEmployee">Delete Employee Information</div>

      </div>
     </div>
    )
  }
}
