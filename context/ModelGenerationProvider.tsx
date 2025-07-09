import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GeneratingModel {
  id: string;
  thumbnailUri: string;
  status: 'generating' | 'completed' | 'failed';
}

interface ModelGenerationContextType {
  generatingModels: GeneratingModel[];
  addGeneratingModel: (thumbnailUri: string) => void;
  updateModelStatus: (id: string, status: 'completed' | 'failed') => void;
}

const ModelGenerationContext = createContext<ModelGenerationContextType | undefined>(undefined);

export const ModelGenerationProvider = ({ children }: { children: ReactNode }) => {
  const [generatingModels, setGeneratingModels] = useState<GeneratingModel[]>([]);

  const addGeneratingModel = (thumbnailUri: string) => {
    const newModel: GeneratingModel = {
      id: Date.now().toString(), // Simple unique ID
      thumbnailUri,
      status: 'generating',
    };
    setGeneratingModels((prev) => [...prev, newModel]);
  };

  const updateModelStatus = (id: string, status: 'completed' | 'failed') => {
    setGeneratingModels((prev) =>
      prev.map((model) => (model.id === id ? { ...model, status } : model))
    );
  };

  return (
    <ModelGenerationContext.Provider
      value={{
        generatingModels,
        addGeneratingModel,
        updateModelStatus,
      }}
    >
      {children}
    </ModelGenerationContext.Provider>
  );
};

export const useModelGeneration = () => {
  const context = useContext(ModelGenerationContext);
  if (context === undefined) {
    throw new Error('useModelGeneration must be used within a ModelGenerationProvider');
  }
  return context;
};