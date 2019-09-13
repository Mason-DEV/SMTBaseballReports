import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dash';
import FFxAuditReport from './FFxAudit/FFxAuditReports';


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Dashboard} />
      <Route exact path='/AuditReportPage' component={FFxAuditReport} />
    </Switch>
  </main>
)

export default Main;