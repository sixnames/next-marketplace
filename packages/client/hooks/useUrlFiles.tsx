import { AssetType } from '../generated/apolloComponents';
import { useEffect, useState } from 'react';
import { getAllFilesFromUrlsList } from '../utils/assetHelpers';

function useUrlFiles(assets: AssetType[] | null, format?: string) {
  const [files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    async function getImageThumb() {
      if (assets) {
        setFiles(await getAllFilesFromUrlsList(assets, format));
      }
    }

    getImageThumb().catch((e) => console.log(e));
  }, [assets, format]);

  return files;
}

export default useUrlFiles;
