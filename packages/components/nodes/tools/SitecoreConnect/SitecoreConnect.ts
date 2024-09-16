import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { RequestParameters, desc, SitecoreConnectTool } from './core'

class SitecoreConnect_Tools implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]
	
	
    constructor() {
        this.label = 'Sitecore Connect'
        this.name = 'SitecoreConnect'
        this.version = 1.0
        this.type = 'SitecoreConnect'
        this.icon = 'sitecore_connect.png'
        this.category = 'Tools'
        this.description = 'Send a webhook event to Sitecore Connect'
        this.baseClasses = [this.type, ...getBaseClasses(SitecoreConnectTool)]
		
        this.inputs = [
            {
                label: 'Webhook Address',
                name: 'url',
                type: 'string',
                description: 'Webhook Address of Sitecore Connect event',
                additionalParams: false,
                optional: false
            },
            {
                label: 'Request attributes',
                name: 'body',
                type: 'json',
                description: 'Request parameters',
                additionalParams: true,
                optional: true
            },
            {
                label: 'Description',
                name: 'description',
                type: 'string',
                rows: 4,
                default: desc,
                description: 'Acts like a prompt to tell agent when it should use this tool',
                additionalParams: true,
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        //const headers = nodeData.inputs?.headers as string
        const url = nodeData.inputs?.url as string
        const description = nodeData.inputs?.description as string
        const body = nodeData.inputs?.body as string

        const obj: RequestParameters = {}
        if (url) obj.url = url
        if (description) obj.description = description
        // if (headers) {
        //     const parsedHeaders = typeof headers === 'object' ? headers : JSON.parse(headers)
        //     obj.headers = parsedHeaders
        // }
        if (body) {
            const parsedBody = typeof body === 'object' ? body : JSON.parse(body)
            obj.body = parsedBody
        }
       
        return new SitecoreConnectTool(obj)
    }
}

module.exports = { nodeClass: SitecoreConnect_Tools }
