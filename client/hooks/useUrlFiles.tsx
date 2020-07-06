import { AssetType } from '../generated/apolloComponents';
import { useEffect, useState } from 'react';
import { getAllFilesFromUrlsList } from '../utils/assetHelpers';

function useUrlFiles(assets: AssetType[] | null) {
  const [files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    async function getImageThumb() {
      if (assets) {
        setFiles(await getAllFilesFromUrlsList(assets));
      }
    }

    getImageThumb();
  }, [assets]);

  return files;
}

export default useUrlFiles;
