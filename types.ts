export type SkipFunction = (variableName: string) => boolean | undefined;
export type VariableCompressParameters = SkipFunction | string;
export interface BuildHistory {
    variables: [string,string][];
  }
  