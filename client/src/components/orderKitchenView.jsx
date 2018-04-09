import React from 'react'
import moment from 'moment'
// import Moment from 'react-moment'

export default class OrderKitchenView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: 'kitchenOrder',
      age: '0:00',
      urgent: false
    };
  }

  componentDidMount() {
    setInterval(() => {
      let secs = moment().unix() - Date.parse(this.props.time.split('T').join(' ')) / 1000
      this.setState({
        age: `${Math.floor(secs/60)}:${secs%60 < 10 ? 0 : ''}${secs%60}`
      })
      // seconds before adding urgency
      if(secs >= 60*1.5 && !this.state.urgent) {
        this.setState({
          classes: this.state.classes + ' kitchenOldOrder',
          urgent: true,
        });
      }
    }, 1000);
  }

  render() {
    return (
      <div className={this.state.classes} onClick={() => this.props.orderUp(this.props.number)}>
        <div>{this.state.age}</div>
        <div className="kitchenOrderNumber">{this.props.number}</div>
        {this.props.foods.map(food =>
          <div>
            <div>{food[0]}</div>
            <div>
            {food[1].length > 0 &&
              <ul>
              {food[1].map(exclude =>
                <li style={{ textDecoration: 'line-through' }}>
                  {exclude}
                </li>
              )}
                </ul>
            }</div>
          </div>
        )}
      </div>
    );
  }
}
