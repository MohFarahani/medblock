import { Box, IconButton, Slider, Paper, Tooltip, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BrightnessIcon from '@mui/icons-material/Brightness6';
import ContrastIcon from '@mui/icons-material/Contrast';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import React from 'react';
import { MagnifierControls } from './MagnifierControls';
import { IMAGE_CONTROLS } from '@/constants/ui';

interface ImageControlsProps {
  contrast: number;
  brightness: number;
  magnifierEnabled: boolean;
  magnification: number;
  onContrastChange: (value: number) => void;
  onBrightnessChange: (value: number) => void;
  onMagnifierToggle: () => void;
  onMagnificationChange: (value: number) => void;
  onReset: () => void;
}

export const ImageControls = React.memo(({
  contrast,
  brightness,
  magnifierEnabled,
  magnification,
  onContrastChange,
  onBrightnessChange,
  onMagnifierToggle,
  onMagnificationChange,
  onReset,
}: ImageControlsProps) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        height: '100%',
      }}
    >
      <Accordion defaultExpanded={false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            '&.MuiAccordionSummary-root': {
              minHeight: 48,
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TuneIcon />
            <Typography>Image Controls</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'flex-start' },
              gap: 3 
            }}
          >
            {/* Image Controls */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              width: { xs: '100%', sm: 'auto' }
            }}>
              <MagnifierControls
                magnifierEnabled={magnifierEnabled}
                magnification={magnification}
                onMagnifierToggle={onMagnifierToggle}
                onMagnificationChange={onMagnificationChange}
              />

              {/* Contrast Control */}
              <Box sx={IMAGE_CONTROLS.CONTROL_CONTAINER}>
                <Tooltip title="Contrast">
                  <ContrastIcon sx={{ mr: 2 }} />
                </Tooltip>
                <Slider
                  value={contrast}
                  onChange={(_, value) => onContrastChange(value as number)}
                  min={0}
                  max={200}
                  sx={IMAGE_CONTROLS.SLIDER}
                  aria-label="Contrast"
                />
              </Box>

              {/* Brightness Control */}
              <Box sx={IMAGE_CONTROLS.CONTROL_CONTAINER}>
                <Tooltip title="Brightness">
                  <BrightnessIcon sx={{ mr: 2 }} />
                </Tooltip>
                <Slider
                  value={brightness}
                  onChange={(_, value) => onBrightnessChange(value as number)}
                  min={0}
                  max={200}
                  sx={IMAGE_CONTROLS.SLIDER}
                  aria-label="Brightness"
                />
              </Box>
            </Box>

            {/* Reset Button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
              <Tooltip title="Reset All">
                <IconButton onClick={onReset}>
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
});

ImageControls.displayName = 'ImageControls'; 