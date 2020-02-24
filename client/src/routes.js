// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const FFxAuditReport = React.lazy(() => import('./views/FFxAuditReport/FFxAuditReport'));
const FFxAuditData = React.lazy(() => import('./views/FFxAuditData/FFxAuditData'));
const FFxTechReport = React.lazy(() => import('./views/FFxTechReport/FFxTechReport'));
const FFxTechData = React.lazy(() => import('./views/FFxTechData/FFxTechData'));
const PFxTechReport = React.lazy(() => import('./views/PFxTechReport/PFxTechReport'));
const PFxTechData = React.lazy(() => import('./views/PFxTechData/PFxTechData'));
const Settings = React.lazy(() => import('./views/Settings/Settings'));
const Staff = React.lazy(() => import('./views/Staff/Staff'));
const Venue = React.lazy(() => import('./views/Venue/Venue'));
const Logout = React.lazy(() => import('./views/Logout/Logout'));

const routes = [
  { path: '/', exact: true, name: 'Home',  permission: ["ffxAuditPermission", "ffxTechPermission", "pfxTechPermission", "ffxAuditDataPermission", "ffxTechDataPermission", "pfxTechDataPermission", "extrasPermission"],  component: Dashboard },
  { path: '/dashboard', name: 'Dashboard',  permission: ["ffxAuditPermission", "ffxTechPermission", "pfxTechPermission", "ffxAuditDataPermission", "ffxTechDataPermission", "pfxTechDataPermission", "extrasPermission"], component: Dashboard },
  { path: '/ffxauditreport', name: 'FFxAuditReport',  permission: ["ffxAuditPermission"],  component: FFxAuditReport },
  { path: '/ffxauditdata', name: 'FFxAuditData',  permission: ["ffxAuditDataPermission"], component: FFxAuditData },
  { path: '/ffxtechreport', name: 'FFxTechReport',  permission: ["ffxTechPermission"], component: FFxTechReport },
  { path: '/ffxtechdata', name: 'FFxTechData',  permission: ["ffxTechDataPermission"], component: FFxTechData },
  { path: '/pfxtechreport', name: 'PFxTechReport',  permission: ["pfxTechPermission"], component: PFxTechReport },
  { path: '/pfxtechdata', name: 'PFxTechData',  permission: ["pfxTechDataPermission"], component: PFxTechData },
  { path: '/staff', name: 'Staff',  permission: ["extrasPermission"], component: Staff },
  { path: '/settings', name: 'Settings',  permission: ["extrasPermission"], component: Settings },
  { path: '/venue', name: 'Venue',  permission: ["extrasPermission"], component: Venue },
];

export default routes;
