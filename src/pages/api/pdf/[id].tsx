import { NextApiRequest, NextApiResponse } from "next";
import { generatorPDf } from "./servicePdf";

export default async function PDF(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method, body, query } = req;
  const { id } = query;

  const pdf = await generatorPDf(`profiler/${id}`);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=reports.pdf");

  if (method === "POST" && body.pathName) {
    const pdf = await generatorPDf(`${body.pathName}/${id}`);
    return res.send(pdf);
  }

  return res.send(pdf);
}
