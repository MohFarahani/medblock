'use client';

import DicomPreviewLayout from "@/components/DicomPreviewLayout";
import { useGetAllDicomFiles } from "@/hooks/useGetAllDicomFiles";
import { useState } from "react";

const PreviewPage = () => {
  const { data, loading, error } = useGetAllDicomFiles();
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <DicomPreviewLayout
      files={data}
      loading={loading}
      selectedFilePath={selectedFilePath}
      onSelectImage={setSelectedFilePath}
    />
  );
};

export default PreviewPage;