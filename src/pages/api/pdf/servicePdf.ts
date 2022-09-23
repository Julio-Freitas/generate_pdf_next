import puppeteer from "puppeteer";
import chromeLambda from "chrome-aws-lambda";

const BASE_URL_DEV = "http://localhost:3000";
const BASE_URL_PROD = "https://generate-pdf-next-nm5z.vercel.app"


const pdfUrl =
  process.env.NODE_ENV === "production" ? BASE_URL_PROD : BASE_URL_DEV;

export const generatorPDf = async (pathname: string) => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    devtools: false,
    handleSIGINT: false,
    ignoreDefaultArgs: ["--disable-extensions"],
    defaultViewport: chromeLambda.defaultViewport,
    executablePath:
      process.env.NODE_ENV === "production"
        ? await chromeLambda.executablePath
        : "/usr/bin/google-chrome-stable",
    headless:
      process.env.NODE_ENV === "production" ? chromeLambda.headless : true,
    args: [
      ...chromeLambda.args,
      "--font-render-hinting=none",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--font-render-hinting=none",
      "--disable-gpu",
      "--disable-web-security",
      "--disable-dev-profile",
      "--single-process",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--use-gl=egl"
    ],
  });
  try {
    const page = await browser.newPage();
    await page.goto(`${pdfUrl}/${pathname}`, {
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
