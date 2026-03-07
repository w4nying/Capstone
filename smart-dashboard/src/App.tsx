import { Admin, Resource } from 'react-admin';
import { useEffect, useState } from 'react';
import {
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import {
  authProvider,
  getCurrentTheme,
  ThemeMode,
  UserRole,
} from './providers/authProvider';
import { dataProvider } from './providers/dataProvider';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { OfficerDashboard } from './components/dashboard/OfficerDashboard';
import { AssociateDashboard } from './components/dashboard/AssociateDashboard';
import { AppLayout } from './components/layout/AppLayout';
import { lightTheme, darkTheme } from './theme';
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
  const [themeMode, setThemeMode] = useState<ThemeMode>(getCurrentTheme());

  useEffect(() => {
    const syncTheme = () => {
      setThemeMode(getCurrentTheme());
    };

    window.addEventListener('themeChanged', syncTheme);

    return () => {
      window.removeEventListener('themeChanged', syncTheme);
    };
  }, []);

  return (
    <Admin
      loginPage={LoginPage}
      authProvider={authProvider}
      dataProvider={dataProvider}
      dashboard={RoleDashboard}
      layout={(props) => <AppLayout {...props} onThemeChange={setThemeMode} />}
      theme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme={themeMode}
    >
      {(permissions) => (
        <>
          {(permissions === 'admin' || permissions === 'officer') && (
            <Resource
              name="analytics"
              list={AnalyticsList}
              show={AnalyticsShow}
              icon={AssessmentIcon}
            />
          )}

          <Resource
            name="reports"
            list={ReportsList}
            show={ReportsShow}
            icon={DescriptionIcon}
          />

          {permissions === 'admin' && (
            <>
              <Resource name="users" list={AnalyticsList} icon={PeopleIcon} />
              <Resource name="settings" list={ReportsList} icon={SettingsIcon} />
            </>
          )}
        </>
      )}
    </Admin>
  );
}

export default App;