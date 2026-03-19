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
  getCurrentUser,
  ThemeMode,
  UserRole,
} from './providers/authProvider';
import { dataProvider } from './providers/dataProvider';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { OfficerDashboard } from './components/dashboard/OfficerDashboard';
import { AssociateDashboard } from './components/dashboard/AssociateDashboard';
import { AppLayout } from './components/layout/AppLayout';
import { UserManagementList } from './components/users/UserManagementList';
import { lightTheme, darkTheme } from './theme';
import { AnalyticsList } from './resources/analytics/AnalyticsList';
import { AnalyticsShow } from './resources/analytics/AnalyticsShow';
import { ReportsList } from './resources/reports/ReportsList';
import { ReportsShow } from './resources/reports/ReportsShow';
import { SettingsList } from './resources/settings/SettingsList';
import { SystemSettingsProvider } from './contexts/SystemSettingsContext';

const RoleDashboard = () => {
  const role = getCurrentUser()?.role || 'associate';

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
  const [role, setRole] = useState<UserRole>(getCurrentUser()?.role || 'associate');

  useEffect(() => {
    const syncTheme = () => {
      setThemeMode(getCurrentTheme());
    };

    const syncRole = () => {
      setRole(getCurrentUser()?.role || 'associate');
    };

    syncTheme();
    syncRole();

    window.addEventListener('themeChanged', syncTheme);
    window.addEventListener('storage', syncTheme);

    window.addEventListener('authChanged', syncRole);
    window.addEventListener('storage', syncRole);

    return () => {
      window.removeEventListener('themeChanged', syncTheme);
      window.removeEventListener('storage', syncTheme);

      window.removeEventListener('authChanged', syncRole);
      window.removeEventListener('storage', syncRole);
    };
  }, []);

  return (
    <SystemSettingsProvider>
      <Admin
        key={`${themeMode}-${role}`}
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

        {(role === 'admin' || role === 'officer') && (
          <Resource
            name="users"
            list={UserManagementList}
            icon={PeopleIcon}
          />
        )}

        {role === 'admin' && (
          <Resource
            name="settings"
            list={SettingsList}
            icon={SettingsIcon}
          />
        )}
      </Admin>
    </SystemSettingsProvider>
  );
}

export default App;