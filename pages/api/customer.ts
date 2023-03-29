import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "next-auth/jwt";
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
            const response = await axios.get(`${apiUrl}/getUsers`, requestConfig);

            res.status(200).json(response.data);
        } else if (req.method === 'POST') {                        
            const response = await axios.post(`${apiUrl}/createUser`, req.body, requestConfig);

            res.status(200).json(response.data);
        } else if (req.method === 'PATCH') {            
            const response = await axios.patch(`${apiUrl}/updateUser`, req.body, requestConfig);

            res.status(200).json(response.data);
        }
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error })
    }
}