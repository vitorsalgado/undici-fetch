'use strict'

const stream = require('stream')

function isReadable (obj) {
  return obj instanceof stream.Stream && typeof obj._read === 'function' && typeof obj._readableState === 'object'
}

function HeaderNameValidationError (name) {
  return TypeError(`Invalid Header name: ${name}`)
}

function HeaderValueValidationError (name, value) {
  return TypeError(`Invalid Header value: ${value} for Header name: ${name}`)
}

function validateHeaderName (name) {
  if (!name || name.length === 0) throw HeaderNameValidationError(name)

  for (let i = 0, cc = name.charCodeAt(0); i < name.length; i++, cc = name.charCodeAt(i)) {
    /* istanbul ignore else */
    if (
      // check most common characters first
      (cc >= 94 && cc <= 122) || // ^ _ ` a-z
      (cc >= 65 && cc <= 90) || // A-z
      cc === 45 || // -
      cc === 33 || // !
      (cc >= 35 && cc <= 39) || // # $ % & '
      cc === 42 || // *
      cc === 43 || // +
      cc === 46 || // .
      (cc >= 48 && cc <= 57) || // 0-9
      cc === 124 || // |
      cc === 126 // ~
    ) {
      continue
    } else {
      throw HeaderNameValidationError(name)
    }
  }
}

function validateHeaderValue (name, value) {
  if (!value || value.length === 0) throw HeaderValueValidationError(name, value)

  for (let i = 0, cc = value.charCodeAt(0); i < value.length; i++, cc = value.charCodeAt(i)) {
    /* istanbul ignore else */
    if ((cc >= 32 && cc <= 126) || (cc >= 128 && cc <= 255) || cc === 9) {
      continue
    } else {
      throw HeaderValueValidationError(name, value)
    }
  }
}

function normalizeAndValidateHeaderName (name) {
  const normalizedHeaderName = name.toLowerCase()
  validateHeaderName(normalizedHeaderName)
  return normalizedHeaderName
}

function normalizeAndValidateHeaderValue (name, value) {
  const normalizedHeaderValue = value.trim()
  validateHeaderValue(name, normalizedHeaderValue)
  return normalizedHeaderValue
}

function normalizeAndValidateHeaderArguments (name, value) {
  return [normalizeAndValidateHeaderName(name), normalizeAndValidateHeaderValue(name, value)]
}

module.exports = {
  isReadable,
  HeaderNameValidationError,
  HeaderValueValidationError,
  validateHeaderName,
  validateHeaderValue,
  normalizeAndValidateHeaderName,
  normalizeAndValidateHeaderValue,
  normalizeAndValidateHeaderArguments
}
