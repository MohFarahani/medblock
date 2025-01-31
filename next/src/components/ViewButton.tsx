// ViewButton.tsx
'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ViewButtonProps {
  filePath: string;
  routePath: string;
}

const ViewButton = ({ filePath, routePath }: ViewButtonProps) => {
  const router = useRouter();

  const handleViewImage = () => {
    // Encode the filePath to handle special characters in URLs
    const encodedFilePath = encodeURIComponent(filePath);
    router.push(`/${routePath}?filePath=${encodedFilePath}`);
  };

  return (
    <Button
      variant="contained"
      size="small"
      color="secondary"
      onClick={handleViewImage}
    >
      View
    </Button>
  );
};

export default ViewButton;