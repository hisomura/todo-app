import React from "react";
import {RepositoryReader, RepositoryWriter} from "./repository";

const RepositoryReaderContext = React.createContext<undefined | RepositoryReader>(undefined);
const RepositoryWriterContext = React.createContext<undefined | RepositoryWriter>(undefined);

function RepositoryProvider(props: { children: any; reader: RepositoryReader; writer: RepositoryWriter; }) {
  return (
    <RepositoryWriterContext.Provider value={props.writer}>
      <RepositoryReaderContext.Provider value={props.reader}>{props.children}</RepositoryReaderContext.Provider>
    </RepositoryWriterContext.Provider>
  );
}

function RepositoryWriterProvider(props: { children: any; writer: RepositoryWriter }) {
  return <RepositoryWriterContext.Provider value={props.writer}>{props.children}</RepositoryWriterContext.Provider>;
}

function useRepositoryReader() {
  const context = React.useContext(RepositoryReaderContext);
  if (context === undefined) {
    throw new Error("useRepositoryReader() must be used within a RepositoryProvider");
  }

  return context;
}

function useRepositoryWriter() {
  const context = React.useContext(RepositoryWriterContext);
  if (context === undefined) {
    throw new Error("useRepositoryWriter() must be used within a RepositoryProvider");
  }

  return context;
}

export {RepositoryProvider, RepositoryWriterProvider, useRepositoryReader, useRepositoryWriter};
