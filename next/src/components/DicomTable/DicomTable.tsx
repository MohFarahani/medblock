'use client';

import { DicomData } from '@/graphql/types';
import Table from '../table/Table';
import { DicomColumns } from './DicomColumns';
import { DownloadProvider } from '@/providers/DownloadProvider';

export const DicomTable = ({ data, loading, title }: { 
  data: DicomData[],
  loading?: boolean,
  title?: string 
}) => {
  return (
    <DownloadProvider>
      <Table
        data={data}
        loading={loading}
        title={title}
        columns={DicomColumns()}
        enableSelection
      />
    </DownloadProvider>
  );
};

export default DicomTable; 