import React from 'react';
import { Menu, Provider, Appbar } from 'react-native-paper';

import COLOR from '../services/AppColor';

export class PaperMenu2 extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState({ visible1: false });
  }

  state = {
    visible1: false,
  };

  _navigateProfile = () => {
    this.props.onPressProfile();
    this.setState({ visible1: false });
  }

  _openMenu1 = () =>  this.setState({ visible1: true });

  _closeMenu1 = () => this.setState({ visible1: false });

  _backHome = () => {
    this.props.navigation.goBack(null);
  }

  render() {
    return (
      <Provider>
        <Appbar.Header style = {{backgroundColor: COLOR.HEADER_BG_COLOR, paddingTop: 10, marginLeft: -12}} statusBarHeight = {8}>
          <Appbar.BackAction onPress={() => this._backHome()} />
          <Appbar.Content titleStyle={{fontSize: 17, fontWeight: 'bold'}} title="RUBRIK CAB" />
          <Menu
              visible={this.state.visible1}
              onDismiss={this._closeMenu1}
              anchor={<Appbar.Action icon={'menu'} color="white" onPress={() => this._openMenu1()} />}
            >
              <Menu.Item onPress={() => this._navigateProfile()} title="Profile" />
            </Menu>
        </Appbar.Header>
      </Provider>
    );
  }
}

