import { Tool } from '@langchain/core/tools'
import fetch from 'node-fetch'

export const desc = `This is a tool to send a webhook event to Sitecore Connect.`


export interface Body {
    [key: string]: any
}

export interface RequestParameters {
    body?: Body
    url?: string
    description?: string
    maxOutputLength?: number
}

export class SitecoreConnectTool extends Tool {
    name = 'sitecore_connect'
    url = ''
    description = desc
    maxOutputLength = Infinity
    body = {}

    constructor(args?: RequestParameters) {
        super()
        this.url = args?.url ?? this.url
        this.body = args?.body ?? this.body
        this.description = args?.description ?? this.description
        this.maxOutputLength = args?.maxOutputLength ?? this.maxOutputLength
    }

    /** @ignore */
    async _call(input: string) {
        try {
            let inputUrl = ''
            let inputBody = {}
            if (Object.keys(this.body).length || this.url) {
                if (this.url) inputUrl = this.url
                if (Object.keys(this.body).length) inputBody = this.body
            } else {
                const { url, data } = JSON.parse(input)
                inputUrl = url
                inputBody = data
            }
           
            if (process.env.DEBUG === 'true') console.info(`Making POST API call to ${inputUrl} with body ${JSON.stringify(inputBody)}`)

            const res = await fetch(inputUrl, {
                method: 'POST',
                //headers: this.headers,
                body: JSON.stringify(inputBody)
            })

            const text = await res.text()
            return text.slice(0, this.maxOutputLength)
        } catch (error) {
            return `${error}`
        }
    }
}
