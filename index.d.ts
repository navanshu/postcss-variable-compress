export declare namespace variableCompress {
    type skip = (variableName: string) => boolean | undefined;
    type parameters = skip | string;
}
declare function map(j: import("postcss").Declaration): void;
export declare function variableCompress(opts?: variableCompress.parameters[]): {
    postcssPlugin: string;
    Declaration: {
        "*": typeof map;
    };
};
export {};
