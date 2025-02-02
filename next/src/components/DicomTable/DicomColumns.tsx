'use client';

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DicomDataTable } from '../table/types';
import ViewButton from '../ViewButton';
import { formatDateToMonthDayYear } from '@/utils/dates';
import { useDownload } from '@/providers/DownloadProvider';
import { LoadingButton } from '@mui/lab';

// Move handleDownload outside of getDefaultColumns and make it handle multiple files
const handleDownload = async (rows: DicomDataTable | DicomDataTable[]) => {
  try {
    // Convert single row to array if needed
    const filesToDownload = Array.isArray(rows) ? rows : [rows];
    
    // Download each file sequentially to avoid overwhelming the browser
    for (const row of filesToDownload) {
      const response = await fetch(`/api/download?filePath=${encodeURIComponent(row.FilePath)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to download ${row.FilePath}`);
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = row.FilePath.split('/').pop() || 'dicom-file';
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Add a small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download one or more files');
  }
};

// Update the DownloadCell component
const DownloadCell = ({ params, selectedRows }: { 
  params: GridRenderCellParams<DicomDataTable>, 
  selectedRows: DicomDataTable[] 
}) => {
  const { isLoading, setIsLoading } = useDownload();
  const isRowSelected = selectedRows.some(row => row.id === params.row.id);
  const hasOtherRowsSelected = selectedRows.length > 0 && !isRowSelected;
  const shouldShowLoading = isLoading && (isRowSelected || selectedRows.length === 0);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const rowsToDownload = selectedRows.length > 0 ? selectedRows : params.row;
      await handleDownload(rowsToDownload);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      variant="contained"
      size="small"
      color="secondary"
      onClick={handleClick}
      disabled={hasOtherRowsSelected || (isLoading && !shouldShowLoading)}
      loading={shouldShowLoading}
      loadingPosition="center"
    >
      {selectedRows.length > 0 ? `Download ${selectedRows.length} Files` : 'Download'}
    </LoadingButton>
  );
};

export const DicomColumns = (selectedRows: DicomDataTable[] = []): GridColDef<DicomDataTable>[] => {
  return [
    {
      field: 'PatientName',
      headerName: 'Patient Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'StudyDate',
      headerName: 'Study Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        return formatDateToMonthDayYear(params.row?.StudyDate);
      },
    },
    {
      field: 'SeriesDescription',
      headerName: 'Series Description',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'Modality',
      headerName: 'Modality',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'download',
      headerName: 'Download',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<DicomDataTable>) => (
        <DownloadCell params={params} selectedRows={selectedRows} />
      ),
    },
    {
      field: 'FilePath',
      headerName: 'View Image',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<DicomDataTable>) => {
        const isRowSelected = selectedRows.some(row => row.id === params.row.id);
        const hasOtherRowsSelected = selectedRows.length > 0 && !isRowSelected;

        return (
          <ViewButton
            filePath={params.row.FilePath}
            selectedFiles={selectedRows.length > 0 ? selectedRows.map(row => row.FilePath) : [params.row.FilePath]}
            routePath={selectedRows.length > 1 ? "preview/multi" : "home/preview"}
            disabled={hasOtherRowsSelected}
          />
        );
      },
    },
  ];
};