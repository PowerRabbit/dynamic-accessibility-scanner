"use client";

import { createContext, useContext } from 'react';

type RemoveChildFunction = (id: number, type: string) => void;

type ContextType = {
  removeEntry?: RemoveChildFunction;
};

const ScanPageContext = createContext<ContextType>({

});

export const ScanPageContextExporter = () => useContext(ScanPageContext);

export default ScanPageContext;