/**
 * Healthcare Analytics Platform - Custom React Hook: useDataset
 * Manages active dataset state, loading indicators, and field schema.
 */

import { useState, useCallback } from 'react';

export function useDataset() {
  const [datasetName, setDatasetName] = useState<string | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectDataset = useCallback((name: string, cols: any[], rows: any[]) => {
    setDatasetName(name);
    setFields(cols);
    setData(rows);
  }, []);

  const resetDataset = useCallback(() => {
    setDatasetName(null);
    setFields([]);
    setData([]);
  }, []);

  return {
    datasetName,
    fields,
    data,
    isLoading,
    setIsLoading,
    selectDataset,
    resetDataset
  };
}
