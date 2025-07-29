import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
    constructor(private readonly configService: ConfigService) { }

    /**
     * @param key  env key
     * @param defaultValue 
     * @returns boolean
     */
    getAsBoolean(key: string, defaultValue?: boolean): boolean {
        const value: string = this.configService.get<string>(key, defaultValue?.toString());
        if (value === undefined) {
            return defaultValue ?? false;
        }
        return value.toLowerCase() === 'true' || value === '1';
    }

    /**
     * @param key env key
     * @param defaultValue 
     * @returns number
     */
    getAsNumber(key: string, defaultValue?: number): number {
        const value = this.configService.get<string>(key, defaultValue?.toString());
        if (value === undefined) {
            return defaultValue ?? 0;
        }
        const parsedValue = Number(value);
        if (Number.isNaN(parsedValue)) {
            return defaultValue ?? 0;
        }
        return parsedValue;
    }

    /**
     * @param key  env key
     * @param defaultValue 
     * @returns string
     */
    getAsString(key: string, defaultValue?: string): string {
        return this.configService.get<string>(key, defaultValue);
    }
}
