import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import Navbar from './components/navbar/Navbar.js';
import RegisterScreen from './components/register_screen/RegisterScreen.js';
import LoginScreen from './components/login_screen/LoginScreen.js';
import HomeScreen from './components/explore_screen/HomeScreen.js';
import RoutineList from './components/routines_list_screen/RoutineList.js';
import RoutineScreen from './components/routine_screen/RoutineScreen.js';
import NewsfeedRoutine from './components/explore_routines_screen/NewsfeedRoutine.js';
import DatabaseTester from './test/DatabaseTester.js';

class App extends Component {
  render() {
    const { auth } = this.props;
    if (auth.isLoaded) {
      return (
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/" component={HomeScreen} />
              <Route path="/register" component={RegisterScreen} />
              <Route path="/login" component={LoginScreen} />
              <Route path="/myroutines" component={RoutineList} />
              <Route path="/routine/:id" component={RoutineScreen} />
              <Route path="/explore/:username/:id" component={NewsfeedRoutine} />
              <Route path="/test" component={DatabaseTester} />
              <Route path="/:any" component={HomeScreen} />
            </Switch>
          </div>
        </BrowserRouter>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
});

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(App);