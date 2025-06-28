import { createContext, useContext } from 'react';

type RemoveChildFunction = (id: number) => void;
type CloneChildFunction = (id: number) => void;

type ContextType = {
  removeChild: RemoveChildFunction;
  cloneChild: CloneChildFunction;
};

// Default no-op implementations for safety
const ScanPageContext = createContext<ContextType>({
    removeChild: () => {},
    cloneChild: () => {},
});

export const ScanPageContextExporter = () => useContext(ScanPageContext);

export default ScanPageContext;