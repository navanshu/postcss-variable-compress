export declare namespace variableCompress {
    type skip = (variableName: string) => boolean | undefined;
    type map = {
        [key: string]: string;
    };
    type parameters = skip | map | string;
}
