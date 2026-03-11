import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import { getCurrentUser } from '../../providers/authProvider';
import { removeProfileAvatar, saveProfileAvatar } from '../../services/profileService';

type ProfileAvatarDialogProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getInitials = (name?: string, username?: string) => {
  const source = name?.trim() || username?.trim() || 'U';
  const parts = source.split(' ').filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
};

export const ProfileAvatarDialog = ({
  open,
  onClose,
  onSaved,
}: ProfileAvatarDialogProps) => {
  const currentUser = getCurrentUser();
  const [preview, setPreview] = useState<string>(currentUser?.avatar || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setPreview(getCurrentUser()?.avatar || '');
    }
  }, [open]);

  const initials = useMemo(
    () => getInitials(currentUser?.fullName, currentUser?.username),
    [currentUser]
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please upload an image smaller than 2MB.');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setPreview(base64);
    } catch (error) {
      console.error('Failed to read file:', error);
      alert('Unable to read the selected image.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await saveProfileAvatar(preview);
    setSaving(false);
    onSaved?.();
    onClose();
  };

  const handleRemove = async () => {
    setSaving(true);
    setPreview('');
    await removeProfileAvatar();
    setSaving(false);
    onSaved?.();
    onClose();
  };

  const hasAvatar = Boolean(preview);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: (theme) => ({
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${
            theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'
          }`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 24px 50px rgba(0,0,0,0.35)'
              : '0 24px 50px rgba(15,23,42,0.10)',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #111827 0%, #0f172a 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }),
      }}
    >
      <DialogTitle
        sx={(theme) => ({
          px: 3,
          py: 2.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${
            theme.palette.mode === 'dark' ? '#1f2937' : '#e5e7eb'
          }`,
        })}
      >
        <Box sx={{ pr: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.25 }}>
            Profile Picture
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            Add, change, or remove your avatar
          </Typography>
        </Box>

        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3.25 }}>
        <Stack spacing={3.25} alignItems="center">
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={preview || undefined}
              sx={(theme) => ({
                width: 124,
                height: 124,
                fontSize: 34,
                fontWeight: 800,
                bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0',
                color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 14px 30px rgba(0,0,0,0.35)'
                    : '0 14px 30px rgba(15,23,42,0.10)',
              })}
            >
              {!preview ? initials : null}
            </Avatar>

            <IconButton
              component="label"
              size="small"
              sx={(theme) => ({
                position: 'absolute',
                right: -2,
                bottom: -2,
                width: 34,
                height: 34,
                border: `1px solid ${
                  theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'
                }`,
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#374151' : '#f8fafc',
                },
              })}
            >
              <EditIcon sx={{ fontSize: 16 }} />
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileChange}
              />
            </IconButton>
          </Box>

          <Box sx={{ textAlign: 'center', maxWidth: 420, px: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.75 }}>
              {currentUser?.fullName || currentUser?.username || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload a JPG, PNG, or WEBP image smaller than 2MB.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ width: '100%' }}
          >
            <Button
              fullWidth
              variant="outlined"
              component="label"
              startIcon={<PhotoCameraIcon />}
              sx={{
                borderRadius: 2.5,
                py: 1.2,
                px: 2,
              }}
            >
              {hasAvatar ? 'Choose another image' : 'Choose image'}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileChange}
              />
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSave}
              disabled={saving || !preview}
              sx={{
                borderRadius: 2.5,
                py: 1.2,
                px: 2,
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={(theme) => ({
          px: 3,
          py: 2.25,
          borderTop: `1px solid ${
            theme.palette.mode === 'dark' ? '#1f2937' : '#e5e7eb'
          }`,
          justifyContent: 'space-between',
          gap: 1.5,
        })}
      >
        <Button
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={handleRemove}
          disabled={saving || !hasAvatar}
          sx={{
            borderRadius: 2.5,
            px: 1.5,
          }}
        >
          Remove
        </Button>

        <Button
          onClick={onClose}
          disabled={saving}
          sx={{
            borderRadius: 2.5,
            px: 1.5,
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};