import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Responsive, WidthProvider, type Layout } from 'react-grid-layout/legacy';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
  getSavedDashboardLayouts,
  resetDashboardLayouts,
  saveDashboardLayouts,
} from '../../services/dashboardPreferences';
import type { DashboardBreakpointLayouts } from '../../types/dashboard';

const ResponsiveGridLayout = WidthProvider(Responsive);

export type DashboardWidget = {
  id: string;
  title?: string;
  content: ReactNode;
  defaultLayout: DashboardBreakpointLayouts;
};

type DashboardShellProps = {
  dashboardKey: string;
  widgets: DashboardWidget[];
};

const asArray = (value: any) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const createLayoutsFromWidgets = (
  widgets: DashboardWidget[]
): DashboardBreakpointLayouts => {
  const layouts: DashboardBreakpointLayouts = {
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
  };

  widgets.forEach((widget) => {
    layouts.lg = [...(layouts.lg ?? []), ...asArray(widget.defaultLayout.lg)];
    layouts.md = [...(layouts.md ?? []), ...asArray(widget.defaultLayout.md)];
    layouts.sm = [...(layouts.sm ?? []), ...asArray(widget.defaultLayout.sm)];
    layouts.xs = [...(layouts.xs ?? []), ...asArray(widget.defaultLayout.xs)];
    layouts.xxs = [...(layouts.xxs ?? []), ...asArray(widget.defaultLayout.xxs)];
  });

  return layouts;
};

export const DashboardShell = ({ dashboardKey, widgets }: DashboardShellProps) => {
  const defaultLayouts = useMemo(() => createLayoutsFromWidgets(widgets), [widgets]);
  const [layouts, setLayouts] = useState<DashboardBreakpointLayouts>(defaultLayouts);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = getSavedDashboardLayouts(dashboardKey);

    if (saved && Object.keys(saved).length > 0) {
      setLayouts(saved);
    } else {
      setLayouts(defaultLayouts);
    }
  }, [dashboardKey, defaultLayouts]);

  const persistLayouts = async (nextLayouts: DashboardBreakpointLayouts) => {
    setSaving(true);
    setLayouts(nextLayouts);
    await saveDashboardLayouts(dashboardKey, nextLayouts);
    setSaving(false);
  };

  const handleLayoutChange = (
    _layout: Layout,
    allLayouts: Partial<Record<string, Layout>>
  ) => {
    setLayouts(allLayouts as unknown as DashboardBreakpointLayouts);
  };

  const handleDragStop = async () => {
    await persistLayouts(layouts);
  };

  const handleResizeStop = async () => {
    await persistLayouts(layouts);
  };

  const handleReset = async () => {
    await resetDashboardLayouts(dashboardKey);
    setLayouts(defaultLayouts);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {saving ? 'Saving layout...' : 'Layout is saved per user'}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={handleReset}
        >
          Reset layout
        </Button>
      </Stack>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts as any}
        breakpoints={{ lg: 1200, md: 900, sm: 600, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={90}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable
        isResizable
        draggableHandle=".dashboard-widget-drag-handle"
        compactType="vertical"
        preventCollision={false}
        onLayoutChange={handleLayoutChange}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
      >
        {widgets.map((widget) => (
          <Box key={widget.id}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              {widget.title ? (
                <CardHeader
                  className="dashboard-widget-drag-handle"
                  title={widget.title}
                  sx={{
                    cursor: 'move',
                    userSelect: 'none',
                    '& .MuiCardHeader-title': {
                      fontSize: '1rem',
                      fontWeight: 600,
                    },
                  }}
                />
              ) : null}

              <CardContent sx={{ height: widget.title ? 'calc(100% - 72px)' : '100%' }}>
                {widget.content}
              </CardContent>
            </Card>
          </Box>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
};