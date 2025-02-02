import { Box, IconButton, Slider, Paper, Tooltip, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BrightnessIcon from '@mui/icons-material/Brightness6';
import ContrastIcon from '@mui/icons-material/Contrast';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';

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

export const ImageControls = ({
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
              {/* Magnifier Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Tooltip title="Zoom Out" placement="top">
                  <IconButton 
                    size="small"
                    onClick={() => onMagnificationChange(Math.max(magnification - 0.5, 1.5))}
                    disabled={!magnifierEnabled}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Box sx={{ width: 8 }} /> {/* Spacer */}

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Toggle Magnifier">
                    <IconButton 
                      onClick={onMagnifierToggle}
                      color={magnifierEnabled ? "primary" : "default"}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>

                  {magnifierEnabled && (
                    <Box sx={{ 
                      fontSize: '0.75rem', 
                      textAlign: 'center',
                      minWidth: '40px',
                      height: '1rem',
                      color: 'text.secondary',
                      fontWeight: 500,
                      mx: 1
                    }}>
                      {(magnification * 100).toFixed(0)}%
                    </Box>
                  )}
                </Box>

                <Box sx={{ width: 8 }} /> {/* Spacer */}

                <Tooltip title="Zoom In" placement="top">
                  <IconButton 
                    size="small"
                    onClick={() => onMagnificationChange(Math.min(magnification + 0.5, 6))}
                    disabled={!magnifierEnabled}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Contrast Control */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                width: '100%'
              }}>
                <Tooltip title="Contrast">
                  <ContrastIcon sx={{ mr: 2 }} />
                </Tooltip>
                <Slider
                  value={contrast}
                  onChange={(_, value) => onContrastChange(value as number)}
                  min={0}
                  max={200}
                  sx={{ 
                    maxWidth: { sm: 200 },
                    width: '100%'
                  }}
                  aria-label="Contrast"
                />
              </Box>

              {/* Brightness Control */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                width: '100%'
              }}>
                <Tooltip title="Brightness">
                  <BrightnessIcon sx={{ mr: 2 }} />
                </Tooltip>
                <Slider
                  value={brightness}
                  onChange={(_, value) => onBrightnessChange(value as number)}
                  min={0}
                  max={200}
                  sx={{ 
                    maxWidth: { sm: 200 },
                    width: '100%'
                  }}
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
}; 