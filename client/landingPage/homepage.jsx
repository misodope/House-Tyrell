import React from 'react';
import { withRouter } from 'react-router';
import { Layout, Menu, Card, Divider } from 'antd';
const { Header, Content, Footer } = Layout;

const { Meta } = Card;

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      nextPage: false,
      current: '1',
    };
  }

  handleClick(e) {
    if (e.key === '3') {
      this.props.history.push('/login');
    }
    if (e.key === '2') {
      this.setState({
        nextPage: true,
      });
    }
    if (e.key === '1') {
      this.setState({
        nextPage: false,
      });
    }
  }

  render() {
    let showThis = <div></div>
    if (this.state.nextPage === false) {
      showThis = (<Layout className="layout">
        <Header style={{ 'padding': '0 0' }}>
          <div className="logo" />
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            onClick={(e) => this.handleClick(e)}
          >
            <Menu.Item key="1">Home</Menu.Item>
            <Menu.Item key="2">About</Menu.Item>
            <Menu.Item key="3">Demo</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: 'rgba(240, 242, 245, 1)', padding: 24, minHeight: '90vh' }}>
            <Card className="titleCard" bordered={false} style={{ background: 'rgba(240, 242, 245, 1)' }}>
              <div>
                <span className="firstHeader">
                  We
                </span>
                <span className="secondHeader">
                  Are
                </span>
                <span className="thirdHeader" style={{ color: '#e75a5b' }}>
                  OctoPOS
                </span>
              </div>
            </Card>
            <Divider />
            <Card title="Meet the Team" bordered={false} style={{ background: 'rgba(240, 242, 245, 1)' }}>
              <Card.Grid style={{ width: '25%', height: '40vh'}}>
                <Meta
                  title="Eric"
                />
                <img style={{ marginTop: '5%', marginLeft: '15%', width: '70%', height: '70%' }} src="https://avatars3.githubusercontent.com/u/32647671?s=400&u=7b3abb436a9b17e8c2da951015f41967ba58e808&v=4" />
              </Card.Grid>
              <Card.Grid style={{ width: '25%', height: '40vh'}}>
                <Meta
                  title="Xixi"
                />
                <img style={{ marginTop: '5%', marginLeft: '15%', width: '70%', height: '70%' }} src="https://s3.amazonaws.com/tyrell-pos/Fri+Mar+30+2018+19%3A48%3A25+GMT-0400+(EDT)-xixi.jpeg" />
              </Card.Grid>
              <Card.Grid style={{ width: '25%', height: '40vh'}}>
                <Meta
                  title="Manos"
                />
                <img style={{ marginTop: '5%', marginLeft: '15%', width: '70%', height: '70%' }} src="https://avatars3.githubusercontent.com/u/32654968?s=460&v=4" />
              </Card.Grid>
              <Card.Grid style={{ width: '25%', height: '40vh' }}>
                <Meta
                  title="Jerry"
                />
                  <img style={{ marginTop: '5%', marginLeft: '15%', width: '70%', height: '70%' }} src="https://s3.amazonaws.com/tyrell-pos/Fri+Mar+30+2018+19%3A48%3A25+GMT-0400+(EDT)-jerry.png" />
              </Card.Grid>
            </Card>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © Team-Tyrell 2018
        </Footer>
      </Layout>)
    } else if (this.state.nextPage === true) {
      showThis = (<Layout className="layout">
        <Header style={{ 'padding': '0 0' }}>
          <div className="logo" />
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            onClick={(e) => this.handleClick(e)}
          >
            <Menu.Item key="1">Home</Menu.Item>
            <Menu.Item key="2">About</Menu.Item>
            <Menu.Item key="3">Demo</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: 'rgba(240, 242, 245, 1)', padding: 24, minHeight: '85vh' }}>

          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © Team-Tyrell 2018
        </Footer>
      </Layout>)
    }
    return (
      <div>
        {showThis}
      </div>
    );
  }
}

export default withRouter(HomePage);
