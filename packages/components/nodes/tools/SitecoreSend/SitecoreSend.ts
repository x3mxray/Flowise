import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { RequestParameters, SitecoreSendTool } from './core'

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
        this.description = 'Add user to Sitecore Send Mailing List'
        this.baseClasses = [this.type, ...getBaseClasses(SitecoreSendTool)]
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['sitecoreSendApi']
        }
        this.inputs = [
            {
                label: 'List ID',
                name: 'listId',
                type: 'string'
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const sitecoreSendApiKey = getCredentialParam('sitecoreSendApiKey', credentialData, nodeData)

        const obj: RequestParameters = {
            apiKey: sitecoreSendApiKey
        }
        if (nodeData.inputs?.listId) obj.listId = nodeData.inputs?.listId

        return new SitecoreSendTool(obj)
    }
}

module.exports = { nodeClass: SitecoreSend_Tools }
