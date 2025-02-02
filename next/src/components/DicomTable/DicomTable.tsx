'use client';

import { DicomData } from '@/graphql/types';
import Table from '../table/Table';
import { DicomColumns } from './DicomColumns';
import { DownloadProvider } from '@/providers/DownloadProvider';
import { useState } from 'react';

export const DicomTable = ({ data, loading, title }: { 
  data: DicomData[],
  loading?: boolean,
  title?: string 
}) => {
  const [selectedRows, setSelectedRows] = useState<DicomDataTable[]>([]);

  return (
    <DownloadProvider>
      <Table
        data={data}
        loading={loading}
        title={title}
        columns={DicomColumns(selectedRows)}
        enableSelection
        onSelectionChange={(rows) => setSelectedRows(rows as DicomDataTable[])}
      />
    </DownloadProvider>
  );
};

export default DicomTable; 