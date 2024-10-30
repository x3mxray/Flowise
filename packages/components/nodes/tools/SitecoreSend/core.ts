import { z } from 'zod'
import { Tool } from '@langchain/core/tools'
import fetch from 'node-fetch'

export const desc = `Use this when you want to add user to Sitecore Send Mailing List.
Input should be a json string with keys: "Name", "Email" and "Tags"
The value of "Name" is customer name. (use 'Customer' by default)
The value of "Email" is customer email.
The value of "Tags" is array of tags. (use empy list by default)
Required keys in the JSON object is "Email".`

export interface InputParameters {
    Name?: string
    Email: string
    Tags: string[]
}

export interface RequestParameters {
    listId?: string
    apiKey: string
}

export class SitecoreSendTool extends Tool {
    name = 'sitecore_send'
    url = 'https://api.sitecoresend.io/v3'
    description = desc
    requestParameters: RequestParameters

    schema = z.object({
        Email: z.string().email(),
        Name: z.string(),
        Tags: z.string().array()
    }) as any

    constructor(args?: RequestParameters) {
        super()
        this.requestParameters = args ?? ({} as RequestParameters)
    }

    /** @ignore */
    async _call(input: z.infer<typeof this.schema>) {
        try {
            if (input === undefined || input === null || typeof input !== 'object' || input.Email === undefined) {
                throw new Error('Input is invalid: ' + input)
            }

            let url = this.url + `/subscribers/${this.requestParameters.listId}/subscribe.json?apikey=${this.requestParameters.apiKey}`
            let body = {
                Name: input.Name ?? 'Customer',
                Email: input.Email,
                HasExternalDoubleOptIn: true,
                Tags: input.Tags ?? []
            }
            if (process.env.DEBUG === 'true') console.info(`Making POST API call to ${url} with body ${JSON.stringify(body)}`)

            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const response = await res.json()
            return response.Code == 0 ? 'Success' : response.Error
        } catch (error) {
            return `${error}`
        }
    }
}
