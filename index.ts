import { SkipFunction, VariableCompressParameters, BuildHistory } from './types'
export * from './types'
import fs from 'fs'
import path from 'path'

const postcssPlugin = 'postcss-variable-compress'
const buildHistoryFileName = 'postcssVariableCompress.json'

let renamedVariables = new Set<string>()
let pureSkips = new Set<string>()
let functionBasedSkips: SkipFunction[] = []
let cssVariablesMap = new Map<string, string>()

function scriptCheck(val: string): boolean {
  return functionBasedSkips.some((skipFunc) => skipFunc(val))
}

function shouldRun(val: string): boolean {
  return !renamedVariables.has(val) && !scriptCheck(val)
}

function getReplacementVariable() {
  
}

function increase(): void {
  let counter = cssVariablesMap.size
  let temp = counter.toString(36)

  while (pureSkips.has(temp)) {
    counter++
    temp = counter.toString(36)
  }
}

function replacer(match: string): string {
  if (!shouldRun(match)) return match

  let exist = cssVariablesMap.get(match)
  if (!exist) {
    exist = '--' + cssVariablesMap.size.toString(36)
    increase()
    cssVariablesMap.set(match, exist)
    renamedVariables.add(exist)
  }

  return exist
}

function map(declaration: import('postcss').Declaration): void {
  const prop = declaration.prop
  if (prop && declaration.variable && shouldRun(prop)) {
    const old = prop
    let exist = cssVariablesMap.get(old)
    if (!exist) {
      exist = '--' + cssVariablesMap.size.toString(36)
      increase()
      cssVariablesMap.set(old, exist)
      renamedVariables.add(exist)
    }
    declaration.prop = exist
  }

  let value = declaration.value
  if (
    value &&
    value.includes('var(') &&
    value.includes('--') &&
    value.length <= 1000
  ) {
    value = value.replace(/--[\w-_]{1,1000}/g, replacer)
    declaration.value = value
  }

  // @ts-ignore
  declaration.processed = true
}

function loadBuildHistory(historyPath: string): void {
  try {
    let stats = fs.statSync(historyPath)
    if (stats.isDirectory()) {
      historyPath = path.join(historyPath, buildHistoryFileName)
    }

    try {
      stats = fs.statSync(historyPath)
      cssVariablesMap.clear()
      const fileData = fs.readFileSync(historyPath, 'utf8')
      const buildHistory: BuildHistory = JSON.parse(fileData)

      buildHistory.variables
        .filter((item) => Boolean(Array.isArray(item) && item.length === 2))
        .forEach(([a, b]) => {
          cssVariablesMap.set(a, b)
        })
    } catch (error) {
      fs.writeFileSync(
        historyPath,
        JSON.stringify(
          {
            variables: []
          },
          null,
          2
        ),
        'utf8'
      )
    }
  } catch (error) {
    console.error('Failed to load build history:', error)
  }
}
async function saveBuildHistory(historyPath: string): Promise<void> {
  try {
    const stats = await fs.promises.stat(historyPath)
    if (stats.isDirectory()) {
      historyPath = path.join(historyPath, buildHistoryFileName)
    }

    const buildHistory: BuildHistory = {
      variables: [...cssVariablesMap.entries()]
    }
    const jsonData = JSON.stringify(buildHistory, null, 2)

    await fs.promises.writeFile(historyPath, jsonData, 'utf8')
  } catch (error) {
    console.error('Failed to save build history:', error)
  }
}

/**
 * This is necessary as if the
 */
let lastHistory: string | boolean | undefined
let runs = 0

/**
 *
 * @param preserveVariables Provides facility to preserver the variables from being changed
 * @param history When true is provided changes are kept same in the build
 * @param history When a path is provided Keeps the list of variables same accross build at the cost of storing variables in a file
 * @returns
 */
function variableCompress(
  preserveVariables?: VariableCompressParameters[],
  history?: string | boolean
): any {
  let firstRun = runs === 0

  if (
    !(history === true || typeof history === 'string') ||
    (!firstRun && lastHistory !== history)
  ) {
    renamedVariables = new Set()  
    pureSkips = new Set()
    functionBasedSkips = []
    cssVariablesMap.clear()
  }

  runs++

  if (typeof history === 'string') {
    loadBuildHistory(history)
  }

  preserveVariables?.forEach((param) => {
    if (typeof param === 'string') {
      let name = param
      let cssName = param

      if (param.slice(0, 2) === '--') {
        name = param.slice(2)
      } else {
        cssName = '--' + param
      }

      pureSkips.add(name)
      cssVariablesMap.set(cssName, cssName)
    } else {
      functionBasedSkips.push(param)
    }
  })

  increase()

  return {
    postcssPlugin,
    Declaration: {
      '*': map
    },
    async OnceExit() {
      if (typeof history === 'string') {
        await saveBuildHistory(history)
      }
      return true
    }
  }
}

module.exports = variableCompress
module.exports.postcss = true
export default variableCompress
