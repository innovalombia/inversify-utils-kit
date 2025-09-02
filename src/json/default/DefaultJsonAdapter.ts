import 'reflect-metadata';

import { injectable } from 'inversify';

import { JSONOutputModel, JsonAdapter } from '../JsonAdapter';

@injectable()
export class DefaultJsonAdapter implements JsonAdapter {
    parseStringToJson(input: string): JSONOutputModel {
        try {
            const result = JSON.parse(input);
            return {
                result,
                reasonForInvalidity: ''
            };
        } catch (e: any) {
            return {
                result: input,
                reasonForInvalidity: e.message
            };
        }
    }

    parseJsonStringToString(
        input: string,
        prettyFormat = true
    ): JSONOutputModel<string> {
        const jsonParsed = this.parseStringToJson(input);
        if (jsonParsed.reasonForInvalidity) {
            return jsonParsed;
        }
        return this.parseJsonToString(jsonParsed.result, prettyFormat);
    }

    parseJsonToString(
        input: any,
        prettyFormat = true
    ): JSONOutputModel<string> {
        try {
            const result = prettyFormat
                ? JSON.stringify(input, null, '\t')
                : JSON.stringify(input);
            return {
                result,
                reasonForInvalidity: ''
            };
        } catch (e: any) {
            return {
                result: input,
                reasonForInvalidity: e.message
            };
        }
    }

    deserializeJson(input: string): JSONOutputModel {
        if (!input) {
            return {
                result: '',
                reasonForInvalidity: 'Input is empty'
            };
        }
        try {
            const strInput = input.replace(/^"|"$/g, '').replace(/\\"/g, '"');
            const result = JSON.parse(strInput);
            return {
                result,
                reasonForInvalidity: ''
            };
        } catch (e: any) {
            return {
                result: input,
                reasonForInvalidity: e.message
            };
        }
    }

    serializeJson(
        input: any,
        escapeQuotes: boolean = false
    ): JSONOutputModel<string> {
        const jsonParsed = this.parseJsonToString(input, false);
        if (jsonParsed.reasonForInvalidity) {
            return jsonParsed;
        }

        const result = jsonParsed.result;
        if (escapeQuotes) {
            return {
                result: result.replaceAll('"', '\\"'),
                reasonForInvalidity: ''
            };
        }
        return {
            result,
            reasonForInvalidity: ''
        };
    }
}
