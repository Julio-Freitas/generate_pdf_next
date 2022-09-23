// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getProfiler } from "../../../lib/profilers";
import { APi } from "./types";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APi>
) {
  const { method, body } = req;
  const { profiler_id } = req.query;

  const profilers = await getProfiler();
  const filterP = profilers.data.filter((p) => p.id === Number(profiler_id));

  if (method === "GET") {
    res.status(200).json({ data: filterP });
  }
}
