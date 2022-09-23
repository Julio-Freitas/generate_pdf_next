import { NextApiRequest, NextApiResponse } from "next";


export default async function PDF(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {



  return res.send({
    msg: 'Hellow'
  });
}
