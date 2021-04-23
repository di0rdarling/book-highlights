import React, { } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { LANDING_PAGE_PATH } from './config/config';
import LandingPage from './pages/landingPage';

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path={LANDING_PAGE_PATH}>
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
