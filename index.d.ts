declare type Skip = (variableName: string) => boolean | undefined;
declare type Parameters = Skip | string;
declare function map(j: import('postcss').Declaration): void;
declare function variableCompress(opts?: Parameters[]): {
    postcssPlugin: string;
    Declaration: {
        '*': typeof map;
    };
};
declare namespace variableCompress {
    var postcss: boolean;
}
export = variableCompress;
