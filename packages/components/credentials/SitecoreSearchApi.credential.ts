import { INodeParams, INodeCredential } from '../src/Interface'

class SitecoreSearchApi implements INodeCredential {
    label: string
    name: string
    version: number
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'Sitecore Search API'
        this.name = 'sitecoreSearchApi'
        this.version = 1.0
        this.inputs = [
            {
                label: 'Sitecore Search Api Key',
                name: 'sitecoreSearchApiKey',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: SitecoreSearchApi }
