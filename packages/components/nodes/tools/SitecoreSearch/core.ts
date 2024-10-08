import { Tool } from '@langchain/core/tools'
import fetch from 'node-fetch'

export const desc = `ALWAYS use this tool. This is a tool to retrieve the best matched results from Sitecore Search index based on user question. 
If the user question contains information about a specific product, add detailed description of that product to the tool query.`

// export interface Headers {
//     [key: string]: string
// }

export interface Body {
    [key: string]: any
}
export interface Body2 {
    [key: string]: any
}
export interface RequestParameters {
    //headers?: Headers
    body?: Body
    body2?: Body2
    url?: string
    description?: string
    maxOutputLength?: number
}

export class SitecoreSearchTool extends Tool {
    name = 'sitecore_search'
    url = ''
    description = desc
    maxOutputLength = Infinity
   // headers = {}
    body = {}
    body2 = {}

    constructor(args?: RequestParameters) {
        super()
        this.url = args?.url ?? this.url
        //this.headers = args?.headers ?? this.headers
        this.body = args?.body ?? this.body
        this.body2 = args?.body2 ?? this.body2
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
            let inputBody2 = {}
            if (Object.keys(this.body2).length || this.url) {
                if (this.url) inputUrl = this.url
                if (Object.keys(this.body2).length) inputBody2 = this.body2
            } else {
                const { url, data } = JSON.parse(input)
                inputUrl = url
                inputBody2 = data
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
