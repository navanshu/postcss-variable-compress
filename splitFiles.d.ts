export declare namespace variableCompressSplitFiles {
    type skip = (variableName: string) => boolean | undefined;
    type parameters = skip | string;
}
declare function map(j: import("postcss").Declaration): void;
declare function variableCompressSplitFiles(opts?: variableCompressSplitFiles.parameters[]): {
    postcssPlugin: string;
    Declaration: {
        "*": typeof map;
    };
};
export default variableCompressSplitFiles;
