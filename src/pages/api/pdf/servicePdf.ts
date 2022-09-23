import puppeteer, { Browser, Page } from "puppeteer-core";
import chromeLambda from "chrome-aws-lambda";

const BASE_URL_DEV = "http://localhost:3000";
const BASE_URL_PROD = "https://generate-pdf-next-nm5z.vercel.app";

type chromeExecPathsTypes = {
  [key: string]: string;
};

const pdfUrl =
  process.env.NODE_ENV === "production" ? BASE_URL_PROD : BASE_URL_DEV;

export async function getOptions() {
  const isDev = !process.env.AWS_REGION;
  let options;

  const chromeExecPaths: chromeExecPathsTypes = {
    win32: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    linux: "/usr/bin/google-chrome-stable",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  };

  const exePath = chromeExecPaths[process.platform];

  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chromeLambda.args,
      executablePath: await chromeLambda.executablePath,
      headless: chromeLambda.headless,
    };
  }

  return options;
}

let _page: Page | null;

async function getPage(): Promise<{ _page: Page; browser?: Browser }> {
  if (_page) {
    return { _page };
  }

  const options = await getOptions();
  const browser = await puppeteer.launch(options);

  _page = await browser.newPage();

  return { _page, browser };
}

export const generatorPDf = async (pathname: string) => {
  //   const browser = await puppeteer.launch({
  //     ignoreHTTPSErrors: true,
  //     devtools: false,
  //     handleSIGINT: false,
  //     ignoreDefaultArgs: ["--disable-extensions"],
  //     defaultViewport: chromeLambda.defaultViewport,
  //     executablePath:
  //       process.env.NODE_ENV === "production"
  //         ? await chromeLambda.executablePath
  //         : "/usr/bin/google-chrome-stable",
  //     headless:
  //       process.env.NODE_ENV === "production" ? chromeLambda.headless : true,
  //     args: [
  //       ...chromeLambda.args,
  //       "--font-render-hinting=none",
  //       "--no-sandbox",
  //       "--disable-setuid-sandbox",
  //       "--font-render-hinting=none",
  //       "--disable-gpu",
  //       "--disable-web-security",
  //       "--disable-dev-profile",
  //       "--single-process",
  //       "--disable-dev-shm-usage",
  //       "--disable-accelerated-2d-canvas",
  //       "--no-first-run",
  //       "--no-zygote",
  //       "--use-gl=egl",
  //     ],
  //   });
  const { _page, browser } = await getPage();
  try {
    await _page.goto(`${pdfUrl}/${pathname}`, {
      waitUntil: ["domcontentloaded", "load", "networkidle2"],
    });
    await _page.emulateMediaType("screen");

    const pdfBuffer = await _page.pdf({
      format: "A4",
      displayHeaderFooter: true,
      printBackground: true,
      margin: { top: 0, left: 0, right: 0, bottom: 0 },
      headerTemplate: "<div></div>",
      footerTemplate:
        '<div class="footer" style="font-size: 11px;color: #8872B2;margin: 15px 500px;clear:both;position: relative;top: 20px;font-family: Roboto;font-weight: bold; "><span class="pageNumber"></span></div>',
    });
    await browser?.close();

    return pdfBuffer;
  } catch (error) {
    return error;
  } finally {
    browser?.disconnect();
    await browser?.close();
  }
};
