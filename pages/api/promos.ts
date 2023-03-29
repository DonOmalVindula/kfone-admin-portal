import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from 'next'

const secret = process.env.NEXTAUTH_SECRET
const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {    
    try {
        const tokenObj: any = await getToken({ req, secret });
        
        const requestConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${tokenObj.accessToken}`
            }
        }
        if (req.method === 'GET') {
            const response = await axios.get(`${apiUrl}/promos`, requestConfig);

            res.status(200).json(response.data);
        } else if (req.method === 'POST') {            
            const response = await axios.post(`${apiUrl}/promos`, req.body, requestConfig);

            res.status(200).json(response.data);
        } else if (req.method === 'DELETE') {
            const id = req?.body?.id;
            
            const response = await axios.delete(`${apiUrl}/promos/${id}`, requestConfig);

            res.status(200).json(response.data);
        }
    } catch (error) {
        console.log("error: " + JSON.stringify(error));
        
        res.status(500).json({ statusCode: 500, message: error })
    }
}