import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import { useEffect, useState } from 'react';
import { authProvider, UserRole } from './providers/authProvider';
import { dataProvider } from './providers/dataProvider';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { OfficerDashboard } from './components/dashboard/OfficerDashboard';
import { AssociateDashboard } from './components/dashboard/AssociateDashboard';
import { AppLayout } from './components/layout/AppLayout';
import { lightTheme, darkTheme } from './theme';

import {
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import { AnalyticsList } from './resources/analytics/AnalyticsList';
import { AnalyticsShow } from './resources/analytics/AnalyticsShow';
import { ReportsList } from './resources/reports/ReportsList';
import { ReportsShow } from './resources/reports/ReportsShow';

const RoleDashboard = () => {
  const role = localStorage.getItem('role') as UserRole;

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'officer':
      return <OfficerDashboard />;
    case 'associate':
    default:
      return <AssociateDashboard />;
  }
};

function App() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user?.theme) {
      setThemeMode(user.theme);
    }
  }, []);

  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={RoleDashboard}
      layout={AppLayout}
      loginPage={LoginPage}
      title="MAS Dashboard System"
      requireAuth
      theme={themeMode === 'dark' ? darkTheme : lightTheme}
    >
      {(permissions) => (
        <>
          <Resource
            name="analytics"
            list={AnalyticsList}
            show={AnalyticsShow}
            edit={permissions === 'associate' ? undefined : EditGuesser}
            create={permissions === 'associate' ? undefined : EditGuesser}
            icon={AssessmentIcon}
            options={{ label: 'Analytics' }}
          />

          <Resource
            name="reports"
            list={ReportsList}
            show={ReportsShow}
            edit={permissions === 'associate' ? undefined : EditGuesser}
            create={permissions === 'associate' ? undefined : EditGuesser}
            icon={DescriptionIcon}
            options={{ label: 'Reports' }}
          />

          {(permissions === 'admin' || permissions === 'officer') && (
            <Resource
              name="users"
              list={ListGuesser}
              edit={permissions === 'admin' ? EditGuesser : undefined}
              icon={PeopleIcon}
              options={{ label: 'User Management' }}
            />
          )}

          {permissions === 'admin' && (
            <Resource
              name="settings"
              list={ListGuesser}
              edit={EditGuesser}
              icon={SettingsIcon}
              options={{ label: 'System Settings' }}
            />
          )}
        </>
      )}
    </Admin>
  );
}

export default App;