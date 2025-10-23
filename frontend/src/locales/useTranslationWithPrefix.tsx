import { useTranslation } from 'react-i18next';

function useTranslationWithPrefix(prefix: string) {
  return useTranslation(undefined, { keyPrefix: prefix });
}

export default useTranslationWithPrefix;
