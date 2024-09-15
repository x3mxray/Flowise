import { INodeParams, INodeCredential } from '../src/Interface'

class SitecoreSendApi implements INodeCredential {
    label: string
    name: string
    version: number
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'Sitecore Send API'
        this.name = 'sitecoreSendApi'
        this.version = 1.0
        this.inputs = [
            {
                label: 'Sitecore Send Api Key',
                name: 'sitecoreSendApiKey',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: SitecoreSendApi }
