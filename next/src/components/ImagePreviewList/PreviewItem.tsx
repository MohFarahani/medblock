import { Box, Skeleton } from "@mui/material";
import { DicomData } from "@/graphql/types";
import { useDicomData } from "@/hooks/useDicomData";
import Image from 'next/image';

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
    <Box 
      onClick={onClick}
      sx={{
        mb: 2,
        cursor: 'pointer',
        border: '2px solid',
        borderColor: isSelected ? 'primary.main' : 'transparent',
        '&:hover': {
          opacity: 0.8
        },
        position: 'relative',
        width: '100%',
        aspectRatio: '4/3'
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
    </Box>
  );
}; 