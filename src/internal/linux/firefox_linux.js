import { existsSync } from "node:fs"
import { execSync } from "node:child_process"
import { resolveUrl, assertAndNormalizeDirectoryUrl } from "@jsenv/filesystem"

import { okSign, infoSign, warningSign } from "@jsenv/local-https-certificates/src/internal/logs.js"
import {
  nssCommandName,
  detectIfNSSIsInstalled,
  getNSSDynamicInstallInfo,
  getCertutilBinPath,
} from "./nss_linux.js"

import { executeTrustQueryOnBrowserNSSDB } from "../nssdb_browser.js"

export const executeTrustQueryOnFirefox = ({
  logger,
  certificateCommonName,
  certificateFileUrl,
  certificateIsNew,
  certificate,
  verb,
  NSSDynamicInstall,
}) => {
  return executeTrustQueryOnBrowserNSSDB({
    logger,
    certificateCommonName,
    certificateFileUrl,
    certificateIsNew,
    certificate,

    verb,
    NSSDynamicInstall,
    nssCommandName,
    detectIfNSSIsInstalled,
    getNSSDynamicInstallInfo,
    getCertutilBinPath,

    browserName: "firefox",
    detectBrowser: () => {
      logger.debug(`Detecting Firefox...`)
      const firefoxBinFileExists = existsSync("/usr/bin/firefox")

      if (firefoxBinFileExists) {
        logger.debug(`${okSign} Firefox detected`)
        return true
      }

      logger.debug(`${infoSign} Firefox not detected`)
      return false
    },
    browserNSSDBDirectoryUrl: resolveUrl(
      ".mozilla/firefox/",
      assertAndNormalizeDirectoryUrl(process.env.HOME),
    ),
    getBrowserClosedPromise: async () => {
      if (!isFirefoxOpen()) {
        return
      }

      logger.warn(`${warningSign} waiting for you to close Firefox before resuming...`)
      const next = async () => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        if (isFirefoxOpen()) {
          await next()
        } else {
          logger.info(`${okSign} Firefox closed, resuming`)
          // wait 50ms more to ensure firefox has time to cleanup
          // othrwise sometimes there is an SEC_ERROR_REUSED_ISSUER_AND_SERIAL error
          // because we updated nss database file while firefox is not fully closed
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }
      await next()
    },
  })
}

const isFirefoxOpen = () => {
  return execSync("ps aux").includes("firefox")
}