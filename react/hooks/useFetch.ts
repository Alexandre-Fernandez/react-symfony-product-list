import { useEffect, useRef, useState } from "react"

export enum ContentType {
	NONE = "",
	JSON = "application/json",
	FORM_DATA = "multipart/form-data"
}
export enum HttpMethod {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	PATCH = "PATCH",
	DELETE = "DELETE"
}

type FetchState<T=any,E=any> = {
	data?: T | -1,
	error?: E
}

type RequestJwt = string | null

type RequestBodyData = any[] | {
	[key: string|number]: any
}

type Request = {
	url: RequestInfo,
	method: HttpMethod,
	jwt: RequestJwt,
	data: RequestBodyData,
	contentType: ContentType
}

type createFetchRequestType<T=Request> = (
	url?: RequestInfo, 
	method?: HttpMethod, 
	jwt?: RequestJwt,
	data?: RequestBodyData,
	contentType?: ContentType
) => T

export const createFetchRequest: createFetchRequestType = ( 
	url: RequestInfo = "", 
	method = HttpMethod.GET, 
	jwt = null,
	data: RequestBodyData = [],
	contentType = ContentType.NONE, 
): Request => ({url, method, jwt, data, contentType})

export const useFetchRequest = (initalRequest: Request): [ 
	Request, createFetchRequestType<void>
] => { 
	const [fetchRequest, _setFetchRequest] = useState(initalRequest)
	const setFetchRequest: createFetchRequestType<void> = (
		url: RequestInfo = "", 
		method = HttpMethod.GET, 
		jwt = null,
		data: RequestBodyData = [],
		contentType = ContentType.NONE, 
	) => {
		const request = createFetchRequest(url, method, jwt, data, contentType)
		_setFetchRequest(request)
	}
	return [fetchRequest, setFetchRequest]
}

const bodifyRequestData = (data: RequestBodyData, contentType: ContentType) => {
	let body = null
	switch(contentType) {
		case ContentType.JSON:
			body = JSON.stringify(data)
			break
		case ContentType.FORM_DATA:
			const formData = new FormData()
			for(const key in data) {
				formData.set(key, String(data[key]))
			}
			body = formData
			break
	}
	return body
}

const createHeaders = (jwt: RequestJwt, contentType: ContentType) => {
	const headers = new Headers()
	if(jwt) {headers.set("Authorization", `Bearer ${jwt}`)}
	if(contentType !== ContentType.NONE && contentType !== ContentType.FORM_DATA) headers.set(
		"Content-Type", contentType // setting multipart/form-data breaks the request (for some reason)
	)
	return headers
}

// data = -1, if fetched data response is empty but ok
export const useFetch = <T=any>(req: Request): FetchState<T> => {
	const [data, setData] = useState<FetchState<T>>({})
	const didUnmountRef = useRef(false)

	useEffect(() => {
		didUnmountRef.current = false
		
		if(req.url) fetch(req.url, {
			method: req.method,
			headers: createHeaders(req.jwt, req.contentType),
			body: req.method !== HttpMethod.GET 
			? bodifyRequestData(req.data, req.contentType) 
			: undefined
		})
		.then(res => {
			if(didUnmountRef.current) throw "Unmounted component"
			return Promise.all([res.text(), Promise.resolve(res.ok)])
		})
		.then(([text, ok]) => {
			try { 
				const data = JSON.parse(text) 
				if(!ok) return setData({error: data})
				if(data) return setData({data})
				return setData({data: -1})
			}
			catch(err) { 
				if(ok) return setData({data: -1}) // empty responses
				if(text) return setData({error: text})
				return setData({error: "Could not fetch the server data"})
			}
		})
		.catch(err => !didUnmountRef.current && setData({error: err}))
		
		return () => { didUnmountRef.current = true }
	}, [req])
	
	return data
}

export default useFetch