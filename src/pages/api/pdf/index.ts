import { NextApiRequest, NextApiResponse } from "next";
import { generatorPDf } from "./servicePdf";

export default async function PDF(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method, body } = req;
  if (method === "POST" && body.pathName) {
    const pdf = await generatorPDf(body.pathName);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reports.pdf");
    return res.send(pdf);
  }

  return res.send({
    message: "Não foi possível gerar o PDF....",
  });
}
