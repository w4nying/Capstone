import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SettingsIcon from '@mui/icons-material/Settings';
import { Responsive, WidthProvider, type Layout } from 'react-grid-layout/legacy';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../../index.css';

import {
  getSavedDashboardLayouts,
  resetDashboardLayouts,
  saveDashboardLayouts,
} from '../../services/dashboardPreferences';
import type { DashboardBreakpointLayouts } from '../../types/dashboard';

const ResponsiveGridLayout = WidthProvider(Responsive);

const WIDGET_VISIBILITY_STORAGE_KEY = 'dashboard-widget-visibility';

export type DashboardWidget = {
  id: string;
  title?: string;
  content: ReactNode;
  defaultLayout: DashboardBreakpointLayouts;
  defaultVisible?: boolean;
};

type DashboardShellProps = {
  dashboardKey: string;
  widgets: DashboardWidget[];
};

const asArray = (value: any) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const normalizeLayouts = (value: any): DashboardBreakpointLayouts => ({
  lg: asArray(value?.lg),
  md: asArray(value?.md),
  sm: asArray(value?.sm),
  xs: asArray(value?.xs),
  xxs: asArray(value?.xxs),
});

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

const createDefaultVisibility = (widgets: DashboardWidget[]) => {
  return widgets.reduce<Record<string, boolean>>((acc, widget) => {
    acc[widget.id] = widget.defaultVisible ?? true;
    return acc;
  }, {});
};

const getSavedWidgetVisibility = (dashboardKey: string) => {
  try {
    const raw = localStorage.getItem(WIDGET_VISIBILITY_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.[dashboardKey] ?? null;
  } catch {
    return null;
  }
};

const saveWidgetVisibility = (
  dashboardKey: string,
  visibility: Record<string, boolean>
) => {
  try {
    const raw = localStorage.getItem(WIDGET_VISIBILITY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[dashboardKey] = visibility;
    localStorage.setItem(WIDGET_VISIBILITY_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
};

export const DashboardShell = ({
  dashboardKey,
  widgets,
}: DashboardShellProps) => {
  const defaultLayouts = useMemo(() => createLayoutsFromWidgets(widgets), [widgets]);
  const defaultVisibility = useMemo(() => createDefaultVisibility(widgets), [widgets]);

  const [layouts, setLayouts] = useState<DashboardBreakpointLayouts>(defaultLayouts);
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [widgetVisibility, setWidgetVisibility] =
    useState<Record<string, boolean>>(defaultVisibility);
  const [draftWidgetVisibility, setDraftWidgetVisibility] =
    useState<Record<string, boolean>>(defaultVisibility);

  const saveTimeoutRef = useRef<number | null>(null);
  const savedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = getSavedDashboardLayouts(dashboardKey);

    if (saved && Object.keys(saved).length > 0) {
      setLayouts(normalizeLayouts(saved));
    } else {
      setLayouts(defaultLayouts);
    }
  }, [dashboardKey, defaultLayouts]);

  useEffect(() => {
    const savedVisibility = getSavedWidgetVisibility(dashboardKey);
    const mergedVisibility = {
      ...defaultVisibility,
      ...(savedVisibility ?? {}),
    };

    setWidgetVisibility(mergedVisibility);
    setDraftWidgetVisibility(mergedVisibility);
  }, [dashboardKey, defaultVisibility]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      if (savedTimeoutRef.current) {
        window.clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);

  const visibleWidgets = useMemo(() => {
    return widgets.filter((widget) => widgetVisibility[widget.id] !== false);
  }, [widgets, widgetVisibility]);

  const persistLayouts = async (nextLayouts: DashboardBreakpointLayouts) => {
    const normalized = normalizeLayouts(nextLayouts);

    setSaving(true);
    setShowSaved(false);
    setLayouts(normalized);

    try {
      await saveDashboardLayouts(dashboardKey, normalized);
      setShowSaved(true);

      if (savedTimeoutRef.current) {
        window.clearTimeout(savedTimeoutRef.current);
      }

      savedTimeoutRef.current = window.setTimeout(() => {
        setShowSaved(false);
      }, 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleLayoutChange = (
    _layout: Layout,
    allLayouts: Partial<Record<string, Layout>>
  ) => {
    const normalized = normalizeLayouts(allLayouts);
    setLayouts(normalized);

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      void persistLayouts(normalized);
    }, 250);
  };

  const openResetDialog = () => {
    setResetDialogOpen(true);
  };

  const closeResetDialog = () => {
    setResetDialogOpen(false);
  };

  const confirmReset = async () => {
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    await resetDashboardLayouts(dashboardKey);
    setLayouts(defaultLayouts);
    setResetDialogOpen(false);
    setShowSaved(false);
  };

  const openSettingsDialog = () => {
    setDraftWidgetVisibility(widgetVisibility);
    setSettingsDialogOpen(true);
  };

  const closeSettingsDialog = () => {
    setDraftWidgetVisibility(widgetVisibility);
    setSettingsDialogOpen(false);
  };

  const handleDraftVisibilityChange = (widgetId: string, checked: boolean) => {
    setDraftWidgetVisibility((prev) => ({
      ...prev,
      [widgetId]: checked,
    }));
  };

  const saveSettingsDialog = () => {
    setWidgetVisibility(draftWidgetVisibility);
    saveWidgetVisibility(dashboardKey, draftWidgetVisibility);
    setSettingsDialogOpen(false);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 24 }}>
          <Fade in={saving} unmountOnExit>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={14} thickness={6} />
              <Typography variant="body2" color="text.secondary">
                Saving layout...
              </Typography>
            </Box>
          </Fade>

          <Fade in={!saving && showSaved} unmountOnExit>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="body2" color="text.secondary">
                Layout saved
              </Typography>
            </Box>
          </Fade>

          {!saving && !showSaved && (
            <Typography variant="body2" color="text.secondary">
              Layout is saved per user
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SettingsIcon />}
            onClick={openSettingsDialog}
            sx={{
              fontWeight: 700,
              px: 2,
              borderRadius: 2,
            }}
          >
            Manage Dashboard Widgets
          </Button>

          <Button
            variant="contained"
            color="warning"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={openResetDialog}
            sx={{
              fontWeight: 700,
              px: 2,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            }}
          >
            Reset Widget Layout
          </Button>
        </Stack>
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
        compactType="vertical"
        preventCollision={false}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".dashboard-widget-drag-handle"
      >
        {visibleWidgets.map((widget) => (
          <Box
            key={widget.id}
            sx={{
              height: '100%',
              minHeight: 0,
              overflow: 'hidden',
              position: 'relative',
              '&:hover .dashboard-widget-drag-handle': {
                opacity: 1,
              },
            }}
          >
            <Box
              className="dashboard-widget-drag-handle"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1.5,
                bgcolor: 'rgba(0, 0, 0, 0.55)',
                color: '#fff',
                cursor: 'grab',
                opacity: 0,
                transition: 'opacity 0.2s ease',
                '&:active': {
                  cursor: 'grabbing',
                },
              }}
              title="Move widget"
            >
              <DragIndicatorIcon fontSize="small" />
            </Box>

            {widget.content}
          </Box>
        ))}
      </ResponsiveGridLayout>

      <Dialog
        open={settingsDialogOpen}
        onClose={closeSettingsDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Widget Settings</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1.5 }}>
            Choose which widgets you want to display on this dashboard.
          </DialogContentText>

          <Stack spacing={0.5}>
            {widgets.map((widget) => (
              <FormControlLabel
                key={widget.id}
                control={
                  <Checkbox
                    checked={draftWidgetVisibility[widget.id] !== false}
                    onChange={(e) =>
                      handleDraftVisibilityChange(widget.id, e.target.checked)
                    }
                  />
                }
                label={widget.title ?? widget.id}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeSettingsDialog} variant="text">
            Cancel
          </Button>
          <Button
            onClick={saveSettingsDialog}
            variant="contained"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={resetDialogOpen}
        onClose={closeResetDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Reset widget layout?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will restore all widgets to their default positions and sizes for this dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeResetDialog} variant="text">
            Cancel
          </Button>
          <Button
            onClick={confirmReset}
            variant="contained"
            color="error"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            Reset Layout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};