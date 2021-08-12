import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

export const subjectAltNamesFromAltNames = (altNames) => {
  const isIp = require("is-ip")

  const isUrl = (value) => {
    try {
      // eslint-disable-next-line no-new
      new URL(value)
      return true
    } catch (e) {
      return false
    }
  }

  const altNamesArray = altNames.map((altName) => {
    if (isIp(altName)) {
      return {
        type: 7,
        ip: altName,
      }
    }
    if (isUrl(altName)) {
      return {
        type: 6,
        value: altName,
      }
    }
    // 2 is DNS (Domain Name Server)
    return {
      type: 2,
      value: altName,
    }
  })

  return {
    altNames: altNamesArray,
  }
}

export const extensionArrayFromExtensionDescription = (extensionDescription) => {
  const extensionArray = []
  Object.keys(extensionDescription).forEach((key) => {
    extensionArray.push({
      name: key,
      ...extensionDescription[key],
    })
  })
  return extensionArray
}

export const extensionDescriptionFromExtensionArray = (extensionArray) => {
  const extensionDescription = {}
  extensionArray.forEach((extension) => {
    const { name, ...rest } = extension
    extensionDescription[name] = rest
  })
  return extensionDescription
}

export const attributeDescriptionFromAttributeArray = (attributeArray) => {
  const attributeObject = {}
  attributeArray.forEach((attribute) => {
    attributeObject[attribute.name] = attribute.value
  })
  return attributeObject
}

export const attributeArrayFromAttributeDescription = (attributeDescription) => {
  const attributeArray = []
  Object.keys(attributeDescription).forEach((key) => {
    const value = attributeDescription[key]
    if (typeof value === "undefined") {
      return
    }
    attributeArray.push({
      name: key,
      value: attributeDescription[key],
    })
  })
  return attributeArray
}