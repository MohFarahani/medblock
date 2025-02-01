import { useState } from 'react';
import Viewer from 'react-viewer';
import { Box } from '@mui/material';
import { DicomViewerfData } from './types';
import { ImageControls } from './ImageControls';
import { Magnifier } from './Magnifier';

interface ImageViewerProps {
  dicomData: DicomViewerfData;
  showControls?: boolean;
}

export const ImageViewer = ({ dicomData, showControls = true }: ImageViewerProps) => {
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

  return (
    <Box>
      <Box
        sx={{
          filter: `contrast(${contrast}%) brightness(${brightness}%)`,
          mb: showControls ? 2 : 0,
        }}
      >
        <Magnifier
          src={imageUrl}
          // width={dicomData.image.width}
          // height={dicomData.image.height}
          enabled={magnifierEnabled}
          magnification={magnification}
          magnifierSize={180}
          onClick={() => setVisible(true)}
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
      />
    </Box>
  );
}; 