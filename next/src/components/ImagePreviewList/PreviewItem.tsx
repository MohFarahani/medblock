import {  Skeleton, ImageListItem, ImageListItemBar, IconButton, Stack, Typography } from "@mui/material";
import { DicomData } from "@/graphql/types";
import { useDicomData } from "@/hooks/useDicomData";
import Image from 'next/image';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';

interface PreviewItemProps {
  file: DicomData;
  isSelected: boolean;
  onClick: () => void;
}

export const PreviewItem = ({ file, isSelected, onClick }: PreviewItemProps) => {
  const { data: dicomData, loading, error } = useDicomData(file.FilePath);

  if (loading) {
    return <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />;
  }

  if (error || !dicomData?.image?.data) {
    return null;
  }

  return (
    <ImageListItem 
      onClick={onClick}
      sx={{
        mb: 2,
        cursor: 'pointer',
        border: '2px solid',
        borderColor: isSelected ? 'primary.main' : 'transparent',
        '&:hover': {
          opacity: 0.8,
          '.MuiImageListItemBar-root': {
            transform: 'translateY(0)',
            opacity: 1
          }
        },
        width: '100% !important',
        aspectRatio: '4/3',
        position: 'relative',
        '.MuiImageListItemBar-root': {
          transform: 'translateY(100%)',
          opacity: 0,
          transition: 'transform 200ms ease-in-out, opacity 200ms ease-in-out'
        }
      }}
    >
      <Image 
        src={`data:image/png;base64,${dicomData.image.data}`}
        alt={`Preview - ${file.PatientName}`}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        style={{
          objectFit: 'contain'
        }}
      />
      <ImageListItemBar
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonIcon fontSize="small" />
            <Typography variant="body1">{file.PatientName}</Typography>
          </Stack>
        }
        subtitle={
          <Stack direction="row" spacing={1} alignItems="center">
            <DescriptionIcon fontSize="small" />
            <Typography variant="body2">{file.StudyDescription}</Typography>
          </Stack>
        }
        actionIcon={
          <IconButton
            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
            aria-label={`info about ${file.PatientName}`}
          >
            <InfoIcon />
          </IconButton>
        }
      />
    </ImageListItem>
  );
}; 