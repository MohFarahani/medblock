import { useState } from 'react';
import Viewer from 'react-viewer';
import { Box } from '@mui/material';
import { DicomViewerfData } from './types';
import { ImageControls } from './ImageControls';
import { Magnifier } from './Magnifier';

interface ImageViewerProps {
  dicomData: DicomViewerfData;
  showControls?: boolean;
  showModal?: boolean;
}

export const ImageViewer = ({ dicomData, showControls = true, showModal = true }: ImageViewerProps) => {
  const [visible, setVisible] = useState(false);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [magnification, setMagnification] = useState(2);

  const handleReset = () => {
    setContrast(100);
    setBrightness(100);
    setMagnifierEnabled(false);
    setMagnification(2);
  };

  const imageUrl = `data:image/png;base64,${dicomData.image.data}`;

  const handleImageClick = () => {
    if (showModal) {
      setVisible(true);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `dicom-image-${dicomData.StudyDate || 'download'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box
        sx={{
          filter: `contrast(${contrast}%) brightness(${brightness}%)`,
          mb: showControls ? 2 : 0,
          position: 'relative', 
          display: 'inline-block',
        }}
      >
        <Magnifier
          src={imageUrl}
          enabled={magnifierEnabled}
          magnification={magnification}
          magnifierSize={180}
          onClick={handleImageClick}
        />
      </Box>

      {showControls && (
        <ImageControls
          contrast={contrast}
          brightness={brightness}
          magnifierEnabled={magnifierEnabled}
          magnification={magnification}
          onContrastChange={setContrast}
          onBrightnessChange={setBrightness}
          onMagnifierToggle={() => setMagnifierEnabled(!magnifierEnabled)}
          onMagnificationChange={setMagnification}
          onReset={handleReset}
        />
      )}

      {showModal && (
        <Viewer
          visible={visible}
          onClose={() => setVisible(false)}
          images={[{
            src: imageUrl,
            alt: 'DICOM Image'
          }]}
          zoomable
          rotatable
          scalable
          downloadable
          noNavbar
          zoomSpeed={0.2}
          defaultSize={{
            width: dicomData.image.width,
            height: dicomData.image.height
          }}
          noToolbar={false}
          customToolbar={(config) => {
            config.forEach(item => {
              if (item.key === 'download') {
                item.onClick = handleDownload;
              }
            });
            return config;
          }}
        />
      )}
    </Box>
  );
}; 