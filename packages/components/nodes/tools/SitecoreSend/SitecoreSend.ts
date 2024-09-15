import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { RequestParameters, desc, SitecoreSendTool } from './core'

class SitecoreSend_Tools implements INode {
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
        this.label = 'Sitecore Send'
        this.name = 'sitecoreSend'
        this.version = 1.0
        this.type = 'SitecoreSend'
        this.icon = 'sitecoresend.png'
        this.category = 'Tools'
        this.description = 'Add user to Sitecore Send subscription list'
        this.baseClasses = [this.type, ...getBaseClasses(SitecoreSendTool)]
		this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['sitecoreSendApi']
        }
        this.inputs = [
            {
                label: 'URL',
                name: 'url',
                type: 'string',
                description:
                    'Agent will make call to this exact URL. If not specified, agent will try to figure out itself from AIPlugin if provided',
                additionalParams: true,
                optional: true
            },
            {
                label: 'Body',
                name: 'body',
                type: 'json',
                description:
                    'JSON body for the POST request. If not specified, agent will try to figure out itself from AIPlugin if provided',
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
            },
            {
                label: 'Headers',
                name: 'headers',
                type: 'json',
                additionalParams: true,
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const headers = nodeData.inputs?.headers as string
        const url = nodeData.inputs?.url as string
        const description = nodeData.inputs?.description as string
        const body = nodeData.inputs?.body as string

		const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const sitecoreSendApiKey = getCredentialParam('sitecoreSendApiKey', credentialData, nodeData)

        const obj: RequestParameters = {}
        if (url) obj.url = url
        if (description) obj.description = description
        if (headers) {
            const parsedHeaders = typeof headers === 'object' ? headers : JSON.parse(headers)
            obj.headers = parsedHeaders
        }
        if (body) {
            const parsedBody = typeof body === 'object' ? body : JSON.parse(body)
            obj.body = parsedBody
        }

        return new SitecoreSendTool(obj)
    }
}

module.exports = { nodeClass: SitecoreSend_Tools }
