import * as url from 'url'

import fetch from 'node-fetch'
import * as template from 'url-template'

declare namespace Configuration {
  type Parameter = {
    name: string
  }

  type Request = {
    name: string
    path: string
    parameters: Parameter[]
    responses: string[]
  }

  type Server = {
    name: string
    url: string
  }

  type Api = {
    name: string
    servers: Server[]
    requests: Request[]
  }
}

type Configuration = {
  apis: Configuration.Api[]
}

class Request {
  private readonly path: string

  private readonly parameters: Configuration.Parameter[]

  constructor(configuration: Configuration.Request) {
    this.path = configuration.path
    this.parameters = configuration.parameters
  }

  public fetch(server: Server, ...args: any): Promise<any> {
    const path = template.parse(this.path).expand(
      this.parameters.reduce((result: any, parameter, index) => {
        result[parameter.name] = args[index]

        return result
      }, {})
    )

    return fetch(url.resolve(server.url, path)).then(response => response.json())
  }
}

class Server {
  public readonly url: string

  private api: Api

  constructor(configuration: Configuration.Server, api: Api) {
    this.url = configuration.url

    this.api = api
  }

  public request(name: string) {
    return (...args: any) => {
      return this.api.requests[name].fetch(this, ...args)
    }
  }
}

class Api {
  private servers: Record<string, Server> = {}

  public requests: Record<string, Request> = {}

  constructor(configuration: Configuration.Api) {
    configuration.servers.forEach(server => {
      this.servers[server.name] = new Server(server, this)
    })

    configuration.requests.forEach(request => {
      this.requests[request.name] = new Request(request)
    })
  }

  public server(name: string): Server {
    return this.servers[name]
  }
}

export default class Jellax {
  private readonly configuration: Configuration

  private apis: Record<string, Api> = {}

  constructor(configuration: Configuration) {
    this.configuration = configuration

    configuration.apis.forEach(api => {
      this.apis[api.name] = new Api(api)
    })
  }

  public api(name: string): Api {
    return this.apis[name]
  }
}
