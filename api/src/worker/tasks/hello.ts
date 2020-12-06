import { Task } from "graphile-worker"
import { hasOwnProperty } from "../../utils/has-own-property";

export interface HelloPayload {
  name: string
}

function isHelloPayload(object: unknown): object is HelloPayload {
  return typeof object === 'object' && hasOwnProperty(object, 'name') && typeof object.name === 'string'
}

export const hello: Task = function (payload, helpers) {
  if (isHelloPayload(payload)) {
    const { name } = payload
    helpers.logger.info(`Hello, ${name}`)
    return
  }
  helpers.logger.error('Unexpected payload')
}
