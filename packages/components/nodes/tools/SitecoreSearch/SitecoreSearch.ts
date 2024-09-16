import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { RequestParameters, desc, SitecoreSearchTool } from './core'

class SitecoreSearch_Tools implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
	credential: INodeParams
    inputs: INodeParams[]
	
	
    constructor() {
        this.label = 'Sitecore Search'
        this.name = 'SitecoreSearch'
        this.version = 1.0
        this.type = 'SitecoreSearch'
        this.icon = 'sitecoresearch.png'
        this.category = 'Tools'
        this.description = 'Search documents in Sitecore Search/Discover'
        this.baseClasses = [this.type, ...getBaseClasses(SitecoreSearchTool)]
		this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['sitecoreSearchApi']
        }
        this.inputs = [
            {
                label: 'URL',
                name: 'url',
                type: 'string',
                description: 'Base URL for Sitecore Search API',
                additionalParams: false,
                optional: false
            },
            {
                label: 'widget.items',
                name: 'body',
                type: 'json',
                description:
                    'JSON body for `widget.items` parameter',
                additionalParams: true,
                optional: true
            },
            {
                label: 'context',
                name: 'body2',
                type: 'json',
                description:
                    'JSON body for `context` parameter',
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
            // ,
            // {
            //     label: 'Headers',
            //     name: 'headers',
            //     type: 'json',
            //     additionalParams: true,
            //     optional: true
            // }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        //const headers = nodeData.inputs?.headers as string
        const url = nodeData.inputs?.url as string
        const description = nodeData.inputs?.description as string
        const body = nodeData.inputs?.body as string
        const body2 = nodeData.inputs?.body2 as string

		const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const serpApiKey = getCredentialParam('sitecoreSearchApiKey', credentialData, nodeData)

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
        if (body2) {
            const parsedBody2 = typeof body2 === 'object' ? body : JSON.parse(body2)
            obj.body2 = parsedBody2
        }
        return new SitecoreSearchTool(obj)
    }
}

module.exports = { nodeClass: SitecoreSearch_Tools }
