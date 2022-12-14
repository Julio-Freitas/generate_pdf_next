import { NextApiRequest, NextApiResponse } from "next";
import { generatorPDf } from "./servicePdf";

export default async function PDF(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method, body } = req;
  const pdf = await generatorPDf(body.pathName || 'profiler');
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=reports.pdf");
  if (method === "POST" && body.pathName) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reports.pdf");
    return res.send(pdf);
  }

  return res.send(pdf);
}
