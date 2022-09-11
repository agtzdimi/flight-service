import * as Joi from 'joi';
import { isNil } from 'lodash';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FlightResponseValidator {
  validate(flightResponse: unknown): boolean {
    const schema = Joi.object({
      price: Joi.number().required(),
      slices: Joi.array().required().items({
        origin_name: Joi.string().required(),
        destination_name: Joi.string().required(),
        departure_date_time_utc: Joi.date().iso().required(),
        arrival_date_time_utc: Joi.date().iso().required(),
        flight_number: Joi.string().required(),
        duration: Joi.number().required(),
      }),
    });

    return isNil(schema.validate(flightResponse).error);
  }
}
