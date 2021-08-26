import { assert } from "@jsenv/assert"

import { installCertificateAuthority, uninstallCertificateAuthority } from "@jsenv/https-localhost"
import { infoSign, okSign } from "@jsenv/https-localhost/src/internal/logs.js"
import { createLoggerForTest } from "@jsenv/https-localhost/test/test_helpers.mjs"

await uninstallCertificateAuthority({
  logLevel: "warn",
})
const loggerForTest = createLoggerForTest({
  // logLevel: "info",
  // forwardToConsole: true,
})
const {
  rootCertificateForgeObject,
  rootCertificatePrivateKeyForgeObject,
  rootCertificate,
  rootCertificatePrivateKey,
  rootCertificatePath,
  trustInfo,
} = await installCertificateAuthority({
  logger: loggerForTest,
})
const { infos, warns, errors } = loggerForTest.getLogs({ info: true, warn: true, error: true })

const actual = {
  // assert what is logged
  infos,
  warns,
  errors,
  // assert value returned
  rootCertificateForgeObject,
  rootCertificatePrivateKeyForgeObject,
  rootCertificate,
  rootCertificatePrivateKey,
  rootCertificatePath,
  trustInfo,
}
const expected = {
  infos: [
    `Search existing certificate authority on filesystem...`,
    `${infoSign} no certificate authority on filesystem`,
    `Generating authority root certificate...`,
    `${okSign} authority root certificate valid for 20 years written at ${actual.returnValue.rootCertificatePath}`,
  ],
  warns: [],
  errors: [],
  rootCertificateForgeObject: assert.any(Object),
  rootCertificatePrivateKeyForgeObject: assert.any(Object),
  rootCertificate: assert.any(String),
  rootCertificatePrivateKey: assert.any(String),
  rootCertificatePath: assert.any(String),
  trustInfo: {
    mac: {
      status: "not_trusted",
      reason: "tryToTrust disabled",
    },
    chrome: {
      status: "not_trusted",
      reason: "tryToTrust disabled",
    },
    safari: {
      status: "not_trusted",
      reason: "tryToTrust disabled",
    },
    firefox: {
      status: "not_trusted",
      reason: "tryToTrust disabled",
    },
  },
}
assert({ actual, expected })