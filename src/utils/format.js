import { numberCategory } from '@/utils/dict'

export const phoneNumberFormat = (number) => {
  if (!number) {
    return ''
  }
  const prefix = number.slice(0, number.length - 7)
  const suffix = number.substr(-7, 7)
  return `${prefix}-${suffix}`
}

export const priceFormat = (n, price, c = 'MYR') => n(price, 'currency', c)

export const phoneCategory = (number = '') => {
  const result = parser(number)
  if (!result) {
    return 36
  }
  return result
}

function parser(number = '') {
  for (const i of numberCategory()) {
    switch (i.value) {
      case 3: // AB Series
        if (AB(number)) {
          return i.value
        }
        break
      case 30: // FengShui 1349
        if (FengShui(number, 1, 3, 4, 9)) {
          return i.value
        }
        break
      case 31: // FengShui 2678
        if (FengShui(number, 2, 6, 7, 8)) {
          return i.value
        }
        break
      case 37: // Thousand Series
        if (ThousandSeries(number)) {
          return i.value
        }
        break
      case 1: // AAABBBB
        if (AxBx(number, 3, 4)) {
          return i.value
        }
        break
      case 2: // AAAABBB
        if (AxBx(number, 4, 3)) {
          return i.value
        }
        break
      case 4: // AAABBB
        // if (ABC(number, 1, 3, 3)) {
        //   return 10 // ABBBCCC
        // }
        //
        // if (ABC(number, 3, 3, 1)) {
        //   return 14 // AAABBBC
        // }
        if (AxBx(number, 3, 3)) {
          return i.value
        }

        break
      case 5: // AAAA
        if (MultiA(number, 4)) {
          return i.value
        }
        break
      case 6: // AAA
        if (number.substr(-7, 7).includes('000')) {
          if (ThousandSeries(number, 3, 1, 3)) {
            return 37 // AAABCCC
          }
        }

        if (ABC(number, 3, 1, 3)) {
          return 13 // AAABCCC
        }
        if (ABC(number, 2, 3, 2)) {
          return 15 // AABBBCC
        }

        if (ABC(number, 2, 2, 3)) {
          return 12 // AABBCCC
        }
        if (MultiA(number, 3)) {
          return i.value
        }
        break
      case 7: // AAAAAAA
        if (MultiA(number, 7)) {
          return i.value
        }
        break
      case 8: // AAAAAA
        if (MultiA(number, 6)) {
          return i.value
        }
        break
      case 9: // AAAAA
        if (MultiA(number, 5)) {
          return i.value
        }
        break
      // case 10: // ABBBCCC 會直接進入 AAABBB NO
      // case 11: // ABBBBBC 會直接進入 AAAAA NO
      // case 12: // AABBCCC 會直接進入 AAA
      // case 13: // AAABCCC 會直接進入 AAA
      // case 14: // AAABBBC 會直接進入 AAABBB NO
      // case 15: // AABBBCC 會直接進入 AAA
      // case 16: // AABBCDCD 多餘
      case 17: // AABBCCDD
        if (ABCD(number, 2, 2, 2, 2)) {
          return i.value
        }
        break
      case 18: // ABCDABCD
        if (ABCDABCD(number)) {
          return i.value
        }
        break
      case 19: // ABCABC
        if (ABCABC(number)) {
          return i.value
        }
        break
      case 20: // ABABAB
        if (ABABAB(number)) {
          return i.value
        }
        break
      // case 21: // AAAB 多餘
      case 22: // ABAB
        if (ABAB(number)) {
          return i.value
        }
        break
      case 23: // AABB
        if (AxBx(number, 2, 2)) {
          return i.value
        }
        break
      case 24: // ABBA
        if (ABBA(number)) {
          return i.value
        }
        break
      case 25: // AABA
        if (AABA(number)) {
          return i.value
        }
        break
      case 26: // ABAA
        if (ABAA(number)) {
          return i.value
        }
        break
      // case 27: // AABBCAB 會直接進入 AABB NO
      // case 28: // ABABCAB 會直接進入 ABAB NO
      // case 29: // AABBABC 會直接進入 AABB NO
      // case 32: // I-Ching NO
      // case 33: // Mirror Series NO
      case 34: // Ladder
        if (Ladder(number)) {
          return i.value
        }
        break
      // case 33: // Metafizik NO
      // case 36: // Other NO
    }
  }
  return false
}

function AB(number) {
  const suffix = number.substr(-7, 7)
  const t = []
  for (let A = 0; A < 10; A++) {
    if (suffix.includes(A)) {
      t.push(A)
    }
  }
  return t.length === 2
}

function MultiA(number, repeat = 4) {
  const suffix = repeat === 3 ? number.substr(-7, 7) : number
  for (let A = 0; A < 10; A++) {
    const multi = A.toString().repeat(repeat)
    if (suffix.includes(multi)) {
      return true
    }
  }
  return false
}

function AxBx(number = '', repeatA = 0, repeatB = 0) {
  const suffix = number.substr(-7, 7)
  for (let A = 0; A < 10; A++) {
    const a = A.toString().repeat(repeatA)
    if (suffix.includes(a)) {
      for (let B = 0; B < 10; B++) {
        if (A !== B) {
          const b = B.toString().repeat(repeatB)
          if (suffix.includes(`${a}${b}`)) {
            return true
          }
        }
      }
    }
  }
  return false
}

function ABC(number = '', repeatA = 0, repeatB = 0, repeatC = 0) {
  const suffix = number.substr(-7, 7)
  for (let A = 0; A < 10; A++) {
    const a = A.toString().repeat(repeatA)

    if (suffix.includes(`${a}`)) {
      for (let B = 0; B < 10; B++) {
        if (A === B) {
          continue
        }
        const b = B.toString().repeat(repeatB)

        if (suffix.includes(`${a}${b}`)) {
          for (let C = 0; C < 10; C++) {
            if (A === C) {
              continue
            }

            if (C === B) {
              continue
            }

            const c = C.toString().repeat(repeatC)
            if (suffix.includes(`${a}${b}${c}`)) {
              return true
            }
          }
        }
      }
    }
  }
  return false
}

function ABCD(number = '', repeatA = 0, repeatB = 0, repeatC = 0, repeatD = 0) {
  for (let A = 0; A < 10; A++) {
    const a = A.toString().repeat(repeatA)

    if (number.includes(`${a}`)) {
      for (let B = 0; B < 10; B++) {
        if (A === B) {
          continue
        }
        const b = B.toString().repeat(repeatB)

        if (number.includes(`${a}${b}`)) {
          for (let C = 0; C < 10; C++) {
            if (A === C) {
              continue
            }

            if (C === B) {
              continue
            }

            const c = C.toString().repeat(repeatC)
            if (number.includes(`${a}${b}${c}`)) {
              for (let D = 0; D < 10; D++) {
                if (A === D) {
                  continue
                }
                if (B === D) {
                  continue
                }
                if (C === D) {
                  continue
                }
                const d = D.toString().repeat(repeatD)
                if (number.includes(`${a}${b}${c}${d}`)) {
                  return true
                }
              }
            }
          }
        }
      }
    }
  }
  return false
}

function ABCDABCD(number) {
  for (let A = 0; A < 10; A++) {
    for (let B = 0; B < 10; B++) {
      if (A === B) {
        continue
      }
      for (let C = 0; C < 10; C++) {
        if (A === C || B === C) {
          continue
        }
        for (let D = 0; D < 10; D++) {
          if (A === D || B === D || C === D) {
            continue
          }
          const a = A.toString().repeat(1)
          const b = B.toString().repeat(1)
          const c = C.toString().repeat(1)
          const d = D.toString().repeat(1)
          const x = `${a}${b}${c}${d}`
          if (number.includes(`${x}${x}`)) {
            return true
          }
        }
      }
    }
  }
  return false
}

function ABCABC(number) {
  for (let A = 0; A < 10; A++) {
    for (let B = 0; B < 10; B++) {
      if (A === B) {
        continue
      }
      for (let C = 0; C < 10; C++) {
        if (A === C || B === C) {
          continue
        }
        const a = A.toString().repeat(1)
        const b = B.toString().repeat(1)
        const c = C.toString().repeat(1)
        const x = `${a}${b}${c}`
        if (number.includes(`${x}${x}`)) {
          return true
        }
      }
    }
  }
  return false
}

function ABABAB(number) {
  const suffix = number.substr(-7, 7)
  for (let A = 0; A < 10; A++) {
    for (let B = 0; B < 10; B++) {
      if (A === B) {
        continue
      }
      const a = A.toString().repeat(1)
      const b = B.toString().repeat(1)
      const x = `${a}${b}`
      if (suffix.includes(`${x}${x}${x}`)) {
        return true
      }
    }
  }
  return false
}

function ABAB(number) {
  const suffix = number.substr(-7, 7)
  for (let A = 0; A < 10; A++) {
    for (let B = 0; B < 10; B++) {
      if (A === B) {
        continue
      }
      const a = A.toString().repeat(1)
      const b = B.toString().repeat(1)
      const x = `${a}${b}`
      if (suffix.includes(`${x}${x}`)) {
        return true
      }
    }
  }
  return false
}

function ABBA(number) {
  const suffix = number.substr(-7, 7)
  for (let A = 0; A < 10; A++) {
    for (let B = 0; B < 10; B++) {
      if (A === B) {
        continue
      }
      const a = A.toString().repeat(1)
      const b = B.toString().repeat(2)
      if (suffix.includes(`${a}${b}${a}`)) {
        return true
      }
    }
  }
  return false
}

function AABA(number) {
  const suffix = number.substr(-7, 7)
  for (let A = 0; A < 10; A++) {
    for (let B = 0; B < 10; B++) {
      if (A === B) {
        continue
      }
      const a = A.toString().repeat(1)
      const b = B.toString().repeat(1)
      if (suffix.includes(`${a}${a}${b}${a}`)) {
        return true
      }
    }
  }
  return false
}

function ABAA(number) {
  const suffix = number.substr(-7, 7)
  for (let A = 0; A < 10; A++) {
    for (let B = 0; B < 10; B++) {
      if (A === B) {
        continue
      }
      const a = A.toString().repeat(1)
      const b = B.toString().repeat(1)
      if (suffix.includes(`${a}${b}${a}${a}`)) {
        return true
      }
    }
  }
  return false
}

function FengShui(number, a, b, c, d) {
  for (let A = 0; A < 10; A++) {
    if (A === a || A === b || A === c || A === d || A === 5) {
      continue
    }
    const suffix = number.substr(-7, 7)
    if (suffix.includes(A)) {
      return false
    }
  }
  return true
}

function Ladder(number) {
  const result = generateCombinations()
  const suffix = number.substr(-7, 7)
  for (const i of result) {
    if (suffix.includes(i)) {
      return true
    }

    if (suffix.includes(i.split('').reverse().join(''))) {
      return true
    }
  }
  return false
}

function generateCombinations() {
  const combinations = []
  const digits = '0123456789'
  for (let length = 3; length <= 7; length++) {
    for (let i = 0; i <= digits.length - length; i++) {
      const combo = digits.substring(i, i + length)
      let consecutiveCount = 1
      let isValid = false
      for (let j = 1; j < combo.length; j++) {
        if (combo.charCodeAt(j) === combo.charCodeAt(j - 1) + 1) {
          consecutiveCount++
          if (consecutiveCount >= 4) {
            isValid = true
            break
          }
        } else {
          consecutiveCount = 1
        }
      }
      if (isValid) {
        combinations.push(combo)
      }
    }
  }
  return combinations
}

function ThousandSeries(number) {
  const suffix = number.substr(-7, 7)
  for (let A = 1; A < 10; A++) {
    if (suffix.includes(`${A}000`)) {
      return true
    }
  }
  return false
}
