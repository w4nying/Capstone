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
import { SettingsList } from './resources/settings/SettingsList';
import { SystemSettingsProvider } from './contexts/SystemSettingsContext';
import { UserManagementList } from './components/users/UserManagementList';

const RoleDashboard = () => {
  const role = localStorage.getItem('role') as UserRole;

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'officer':
      return <OfficerDashboard />;
    case 'associate':
      return <AssociateDashboard />;
    default:
      return <AssociateDashboard />;
  }
};

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getCurrentTheme());

  useEffect(() => {
    setThemeMode(getCurrentTheme());
  }, []);

  return (
    <SystemSettingsProvider>
      <Admin
        loginPage={LoginPage}
        dataProvider={dataProvider}
        authProvider={authProvider}
        dashboard={RoleDashboard}
        layout={(props) => (
          <AppLayout
            {...props}
            onThemeChange={(mode) => setThemeMode(mode)}
          />
        )}
        theme={lightTheme}
        darkTheme={darkTheme}
        defaultTheme={themeMode}
      >
        <Resource
          name="analytics"
          list={AnalyticsList}
          show={AnalyticsShow}
          icon={AssessmentIcon}
        />
        <Resource
          name="reports"
          list={ReportsList}
          show={ReportsShow}
          icon={DescriptionIcon}
        />
        <Resource
          name="users"
          list={UserManagementList}
          icon={PeopleIcon}
        />
        <Resource
          name="settings"
          list={SettingsList}
          icon={SettingsIcon}
        />
      </Admin>
    </SystemSettingsProvider>
  );
}

export default App;