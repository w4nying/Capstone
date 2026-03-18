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
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../../index.css';

import {
  getSavedDashboardLayouts,
  resetDashboardLayouts,
  saveDashboardLayouts,
} from '../../services/dashboardPreferences';
import type { DashboardBreakpointLayouts } from '../../types/dashboard';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';

const ResponsiveGridLayout = WidthProvider(Responsive);

const WIDGET_VISIBILITY_STORAGE_KEY = 'dashboard-widget-visibility';
const OPEN_WIDGET_SETTINGS_EVENT = 'open-dashboard-widget-settings';

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

type WidgetVisibility = Record<string, boolean>;

const asArray = <T,>(value: T[] | T | null | undefined): T[] => {
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

const cloneLayoutItem = (item: any) => ({ ...item });

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
    layouts.lg = [...(layouts.lg ?? []), ...asArray(widget.defaultLayout.lg).map(cloneLayoutItem)];
    layouts.md = [...(layouts.md ?? []), ...asArray(widget.defaultLayout.md).map(cloneLayoutItem)];
    layouts.sm = [...(layouts.sm ?? []), ...asArray(widget.defaultLayout.sm).map(cloneLayoutItem)];
    layouts.xs = [...(layouts.xs ?? []), ...asArray(widget.defaultLayout.xs).map(cloneLayoutItem)];
    layouts.xxs = [...(layouts.xxs ?? []), ...asArray(widget.defaultLayout.xxs).map(cloneLayoutItem)];
  });

  return layouts;
};

const createDefaultVisibility = (widgets: DashboardWidget[]): WidgetVisibility => {
  return widgets.reduce<WidgetVisibility>((acc, widget) => {
    acc[widget.id] = widget.defaultVisible ?? true;
    return acc;
  }, {});
};

const getSavedWidgetVisibility = (dashboardKey: string): WidgetVisibility | null => {
  try {
    const raw = localStorage.getItem(WIDGET_VISIBILITY_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.[dashboardKey] ?? null;
  } catch {
    return null;
  }
};

const saveWidgetVisibility = (dashboardKey: string, visibility: WidgetVisibility) => {
  try {
    const raw = localStorage.getItem(WIDGET_VISIBILITY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[dashboardKey] = visibility;
    localStorage.setItem(WIDGET_VISIBILITY_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
};

const mergeBreakpointLayouts = (defaults: any[] = [], existing: any[] = []) => {
  const existingMap = new Map(existing.map((item) => [item.i, item]));
  const merged: any[] = [];
  const seen = new Set<string>();

  defaults.forEach((item) => {
    const savedItem = existingMap.get(item.i);
    merged.push(cloneLayoutItem(savedItem ?? item));
    seen.add(item.i);
  });

  existing.forEach((item) => {
    if (!seen.has(item.i)) {
      merged.push(cloneLayoutItem(item));
      seen.add(item.i);
    }
  });

  return merged;
};

const mergeLayouts = (
  widgets: DashboardWidget[],
  existing?: DashboardBreakpointLayouts | null
): DashboardBreakpointLayouts => {
  const defaults = normalizeLayouts(createLayoutsFromWidgets(widgets));
  const current = normalizeLayouts(existing);

  return {
    lg: mergeBreakpointLayouts(defaults.lg, current.lg),
    md: mergeBreakpointLayouts(defaults.md, current.md),
    sm: mergeBreakpointLayouts(defaults.sm, current.sm),
    xs: mergeBreakpointLayouts(defaults.xs, current.xs),
    xxs: mergeBreakpointLayouts(defaults.xxs, current.xxs),
  };
};

const mergeIntoCurrentLayouts = (
  current: DashboardBreakpointLayouts,
  incoming: DashboardBreakpointLayouts
): DashboardBreakpointLayouts => {
  const mergeOne = (currentItems: any[] = [], incomingItems: any[] = []) => {
    const incomingMap = new Map(incomingItems.map((item) => [item.i, item]));
    const result: any[] = [];
    const seen = new Set<string>();

    currentItems.forEach((item) => {
      result.push(cloneLayoutItem(incomingMap.get(item.i) ?? item));
      seen.add(item.i);
    });

    incomingItems.forEach((item) => {
      if (!seen.has(item.i)) {
        result.push(cloneLayoutItem(item));
        seen.add(item.i);
      }
    });

    return result;
  };

  return {
    lg: mergeOne(current.lg, incoming.lg),
    md: mergeOne(current.md, incoming.md),
    sm: mergeOne(current.sm, incoming.sm),
    xs: mergeOne(current.xs, incoming.xs),
    xxs: mergeOne(current.xxs, incoming.xxs),
  };
};

const filterLayoutsByVisibility = (
  layouts: DashboardBreakpointLayouts,
  visibility: WidgetVisibility
): DashboardBreakpointLayouts => ({
  lg: (layouts.lg ?? []).filter((item: any) => visibility[item.i] !== false),
  md: (layouts.md ?? []).filter((item: any) => visibility[item.i] !== false),
  sm: (layouts.sm ?? []).filter((item: any) => visibility[item.i] !== false),
  xs: (layouts.xs ?? []).filter((item: any) => visibility[item.i] !== false),
  xxs: (layouts.xxs ?? []).filter((item: any) => visibility[item.i] !== false),
});

export const DashboardShell = ({
  dashboardKey,
  widgets,
}: DashboardShellProps) => {
  const { getBooleanSetting } = useSystemSettings();

  const personalizationEnabled = getBooleanSetting(
    'Personalization Enabled',
    true
  );
  const autoSaveDashboardLayout = getBooleanSetting(
    'Auto-save Dashboard Layout',
    true
  );

  const defaultVisibility = useMemo(() => createDefaultVisibility(widgets), [widgets]);

  const [layouts, setLayouts] = useState<DashboardBreakpointLayouts>(() =>
    mergeLayouts(widgets)
  );
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [widgetVisibility, setWidgetVisibility] = useState<WidgetVisibility>(defaultVisibility);
  const [draftWidgetVisibility, setDraftWidgetVisibility] =
    useState<WidgetVisibility>(defaultVisibility);

  const saveTimeoutRef = useRef<number | null>(null);
  const savedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const savedLayouts = getSavedDashboardLayouts(dashboardKey);
    const mergedLayouts = mergeLayouts(widgets, savedLayouts);

    const savedVisibility = getSavedWidgetVisibility(dashboardKey);
    const mergedVisibility = {
      ...defaultVisibility,
      ...(savedVisibility ?? {}),
    };

    setLayouts(mergedLayouts);
    setWidgetVisibility(mergedVisibility);
    setDraftWidgetVisibility(mergedVisibility);
    setHasUnsavedChanges(false);
  }, [dashboardKey, widgets, defaultVisibility]);

  useEffect(() => {
    setLayouts((current) => mergeLayouts(widgets, current));
  }, [widgets]);

  useEffect(() => {
    if (!personalizationEnabled) return;

    const handleOpenWidgetSettings = () => {
      setDraftWidgetVisibility(widgetVisibility);
      setSettingsDialogOpen(true);
    };

    window.addEventListener(OPEN_WIDGET_SETTINGS_EVENT, handleOpenWidgetSettings);
    return () => {
      window.removeEventListener(OPEN_WIDGET_SETTINGS_EVENT, handleOpenWidgetSettings);
    };
  }, [widgetVisibility, personalizationEnabled]);

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

  const visibleLayouts = useMemo(() => {
    return filterLayoutsByVisibility(layouts, widgetVisibility);
  }, [layouts, widgetVisibility]);

  const persistLayouts = async (nextLayouts: DashboardBreakpointLayouts) => {
    const normalized = normalizeLayouts(nextLayouts);

    setSaving(true);
    setShowSaved(false);
    setLayouts(normalized);

    try {
      await saveDashboardLayouts(dashboardKey, normalized);
      window.dispatchEvent(new Event('dashboardLayoutChanged'));
      setShowSaved(true);
      setHasUnsavedChanges(false);

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

  const handleManualSave = async () => {
    await persistLayouts(layouts);
  };

  const handleLayoutChange = (_layout: any, allLayouts: any) => {
    if (!personalizationEnabled) return;

    const normalizedIncoming = normalizeLayouts(allLayouts);

    setLayouts((current) => {
      const merged = mergeIntoCurrentLayouts(current, normalizedIncoming);

      if (autoSaveDashboardLayout) {
        if (saveTimeoutRef.current) {
          window.clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = window.setTimeout(() => {
          void persistLayouts(merged);
        }, 250);
      } else {
        setShowSaved(false);
        setHasUnsavedChanges(true);
      }

      return merged;
    });
  };

  const openResetDialog = () => {
    if (!personalizationEnabled) return;
    setResetDialogOpen(true);
  };

  const closeResetDialog = () => {
    setResetDialogOpen(false);
  };

  const confirmReset = async () => {
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    const resetLayouts = mergeLayouts(widgets);

    await resetDashboardLayouts(dashboardKey);
    setLayouts(resetLayouts);
    setResetDialogOpen(false);
    setShowSaved(false);
    setHasUnsavedChanges(false);
    window.dispatchEvent(new Event('dashboardLayoutChanged'));
  };

  const openSettingsDialog = () => {
    if (!personalizationEnabled) return;

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

  const saveSettingsDialog = async () => {
    const nextVisibility = { ...draftWidgetVisibility };

    setWidgetVisibility(nextVisibility);
    saveWidgetVisibility(dashboardKey, nextVisibility);
    setSettingsDialogOpen(false);
    setShowSaved(false);

    if (autoSaveDashboardLayout) {
      setSaving(true);

      try {
        await saveDashboardLayouts(dashboardKey, layouts);
        window.dispatchEvent(new Event('dashboardLayoutChanged'));
        setShowSaved(true);
        setHasUnsavedChanges(false);

        if (savedTimeoutRef.current) {
          window.clearTimeout(savedTimeoutRef.current);
        }

        savedTimeoutRef.current = window.setTimeout(() => {
          setShowSaved(false);
        }, 2000);
      } finally {
        setSaving(false);
      }
    } else {
      setHasUnsavedChanges(true);
    }
  };

  const showSavingUi = personalizationEnabled && autoSaveDashboardLayout;

  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          {showSavingUi && (
            <>
              <Fade in={saving} unmountOnExit>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Saving layout...
                  </Typography>
                </Stack>
              </Fade>

              <Fade in={showSaved && !saving} unmountOnExit>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <CheckCircleIcon fontSize="small" color="success" />
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    Layout saved
                  </Typography>
                </Stack>
              </Fade>

              {!saving && !showSaved && (
                <Typography variant="body2" color="text.secondary">
                  Layout is saved per user
                </Typography>
              )}
            </>
          )}

          {!personalizationEnabled && (
            <Typography variant="body2" color="text.secondary">
              Dashboard personalization is disabled by system settings
            </Typography>
          )}

          {personalizationEnabled && !autoSaveDashboardLayout && !hasUnsavedChanges && (
            <Typography variant="body2" color="text.secondary">
              Auto-save layout is disabled by system settings
            </Typography>
          )}

          {personalizationEnabled && !autoSaveDashboardLayout && hasUnsavedChanges && (
            <Typography variant="body2" color="warning.main" fontWeight={600}>
              You have unsaved layout changes
            </Typography>
          )}
        </Stack>

        {personalizationEnabled && (
          <Stack direction="row" spacing={1.25} flexWrap="wrap">
            {!autoSaveDashboardLayout && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleManualSave}
                disabled={!hasUnsavedChanges || saving}
                sx={{
                  fontWeight: 700,
                  px: 2,
                  borderRadius: 2,
                }}
              >
                Save Layout
              </Button>
            )}

            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={openSettingsDialog}
              sx={{
                fontWeight: 700,
                px: 2,
                borderRadius: 2,
              }}
            >
              Manage Widgets
            </Button>

            <Button
              variant="contained"
              color="warning"
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
        )}
      </Stack>

      <ResponsiveGridLayout
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={90}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        layouts={visibleLayouts as any}
        onLayoutChange={handleLayoutChange}
        compactType="vertical"
        preventCollision={false}
        isDraggable={personalizationEnabled}
        isResizable={personalizationEnabled}
      >
        {visibleWidgets.map((widget) => (
          <Box
            key={widget.id}
            sx={{
              height: '100%',
              cursor: personalizationEnabled ? 'grab' : 'default',
              '&:active': {
                cursor: personalizationEnabled ? 'grabbing' : 'default',
              },
            }}
          >
            {widget.content}
          </Box>
        ))}
      </ResponsiveGridLayout>

      <Dialog
        open={settingsDialogOpen}
        onClose={closeSettingsDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Manage Widgets</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Choose which widgets you want to display on this dashboard.
          </DialogContentText>

          <Stack spacing={1}>
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

        <DialogActions>
          <Button onClick={closeSettingsDialog}>Cancel</Button>
          <Button variant="contained" onClick={saveSettingsDialog}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={resetDialogOpen} onClose={closeResetDialog} fullWidth maxWidth="xs">
        <DialogTitle>Reset widget layout?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will restore all widgets to their default positions and sizes for this
            dashboard.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeResetDialog}>Cancel</Button>
          <Button color="warning" variant="contained" onClick={confirmReset}>
            Reset Layout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};