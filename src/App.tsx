import React, { } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { CREATE_ACCOUNT_PAGE_PATH, LANDING_PAGE_PATH } from './config/config';
import LandingPage from './pages/landingPage';
import CreateAccountPage from './pages/createAccountPage';

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path={LANDING_PAGE_PATH}>
          <LandingPage />
        </Route>
        <Route exact path={CREATE_ACCOUNT_PAGE_PATH}>
          <CreateAccountPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
