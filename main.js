/*
 * This file is the first file executed by code using the package
 * Its responsability is to export what is documented
 * Ideally this file should be kept simple to help discovering codebase progressively.
 */

export {
  installCertificateAuthority,
  uninstallCertificateAuthority,
} from "./src/certificate_authority.js"

export {
  createValidityDurationOfXYears,
  createValidityDurationOfXDays,
} from "./src/validity_duration.js"

export { verifyHostsFile } from "./src/hosts_file_verif.js"

export { requestCertificateForLocalhost } from "./src/certificate_for_localhost.js"
