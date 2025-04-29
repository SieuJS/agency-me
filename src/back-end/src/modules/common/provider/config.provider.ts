import * as Joi from 'joi';

import { Service } from '../../tokens';
import { Config } from '../model';

export const configProvider = {

    provide: Service.CONFIG,
    useFactory: (): Config => {
        const env = process.env;
        const validationSchema = Joi.object<Config>().unknown().keys({
            
        });
        const result = validationSchema.validate(env);
        if (result.error) {
            throw new Error(`Configuration not valid: ${result.error.message}`);
        }

        return result.value;
    }

};
