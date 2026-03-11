import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Update Profile Picture</DialogTitle>

      <DialogContent>
        <Stack spacing={3} alignItems="center" sx={{ pt: 1 }}>
          <Avatar
            src={preview || undefined}
            sx={{ width: 110, height: 110, fontSize: 32 }}
          >
            {!preview ? initials : null}
          </Avatar>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Upload a JPG, PNG, or WEBP image smaller than 2MB.
          </Typography>

          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCameraIcon />}
          >
            Choose Image
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleFileChange}
            />
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'space-between' }}>
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleRemove}
            disabled={saving}
          >
            Remove
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving || !preview}
            >
              Save
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};