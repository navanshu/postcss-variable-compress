declare type Skip = (variableName: string) => boolean | undefined;
declare type Parameters = Skip | string;
declare function map(j: import('postcss').Declaration): void;
declare function variableCompressSplitFiles(opts?: Parameters[]): {
    postcssPlugin: string;
    Declaration: {
        '*': typeof map;
    };
};
declare namespace variableCompressSplitFiles {
    var postcss: boolean;
}
export = variableCompressSplitFiles;
