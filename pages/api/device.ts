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
            const response = await axios.get(`${apiUrl}/devices`, requestConfig);

            res.status(200).json(response.data);
        } else if (req.method === 'POST') {            
            const response = await axios.post(`${apiUrl}/devices`, req.body, requestConfig);

            res.status(200).json(response.data);
        } else if (req.method === 'PUT') {
            const response = await axios.put(`${apiUrl}/devices`, req.body, requestConfig);

            res.status(200).json(response.data);
        } else if (req.method === 'DELETE') {
            const response = await axios.delete(`${apiUrl}/devices/`, requestConfig);

            res.status(200).json(response.data);
        } else if (req.method === 'PATCH') {            
            const deviceId = req.body.deviceId;
            const promoId = req.body.promoCodeId;
            const existingPromoId = req.body.existingPromoId;
            let obj = {};
            if (existingPromoId) {
                // we have to remove the exisitng promo code
                obj = {
                    addedPromoId : promoId,
                    removedPromoId : existingPromoId
                }
            } else {
                obj = {
                    addedPromoId : promoId,
                    removedPromoId : ""
                }
            }            
            const response = await axios.patch(`${apiUrl}/devices/${deviceId}/promos`, obj, requestConfig);

            res.status(200).json(response.data);
        }
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error })
    }
}