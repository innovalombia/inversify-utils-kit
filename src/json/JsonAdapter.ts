export type JSONOutputModel<T = any> = {
    reasonForInvalidity: string;
    result: T;
};

export interface JsonAdapter {
    parseStringToJson(input: string): JSONOutputModel;
    parseJsonStringToString(
        input: string,
        prettyFormat?: boolean
    ): JSONOutputModel<string>;
    parseJsonToString(
        input: any,
        prettyFormat?: boolean
    ): JSONOutputModel<string>;
    deserializeJson(input: string): JSONOutputModel;
    serializeJson(input: any, escapeQuotes?: boolean): JSONOutputModel<string>;
}
