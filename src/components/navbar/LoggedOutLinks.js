import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';

import { APP_SCREEN } from '../../store/CONSTANTS';

class LoggedOutLinks extends React.Component {
  render() {
    console.log("current screen:" + this.props.currentScreen);
    var link = <NavLink to="/register">Register</NavLink>;
    if(this.props.currentScreen === APP_SCREEN.REGISTER_SCREEN)
      link = <NavLink to="/login">Login</NavLink>;

    return (
      <ul className="right" >
        <li>{ link }</li>
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  currentScreen: state.manager.currentScreen
});

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(LoggedOutLinks);