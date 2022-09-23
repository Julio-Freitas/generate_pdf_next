import puppeteer from "puppeteer";
import chromeLambda from "chrome-aws-lambda";

const BASE_URL = "http://localhost:3000";

export const generatorPDf = async (pathname: string) => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    devtools: false,
    handleSIGINT: false,
    ignoreDefaultArgs: ["--disable-extensions"],
    defaultViewport: chromeLambda.defaultViewport,
    executablePath: await chromeLambda.executablePath,
    headless: chromeLambda.headless,
    args: [...chromeLambda.args],
  });
  try {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/${pathname}`, {
      waitUntil: ["domcontentloaded", "load", "networkidle2"],
    });
    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      format: "A4",
      displayHeaderFooter: true,
      printBackground: true,
      margin: { top: 0, left: 0, right: 0, bottom: 0 },
      headerTemplate: "<div></div>",
      footerTemplate:
        '<div class="footer" style="font-size: 11px;color: #8872B2;margin: 15px 500px;clear:both;position: relative;top: 20px;font-family: Roboto;font-weight: bold; "><span class="pageNumber"></span></div>',
    });
    await page.close();
    return pdfBuffer;
  } catch (error) {
    return error;
  } finally {
    browser.disconnect();
    await browser.close();
  }
};
