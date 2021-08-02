const utility = {
  randomUrlCode() {
    const codePattern = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let urlCode = ''
    for (let i = 0; i < 5; i++) {
      const codePatternIndex = Math.floor(Math.random() * codePattern.length)
      urlCode += codePattern[codePatternIndex]
    }
    // 回傳產生的隨機加密
    return urlCode
  }
}

module.exports = utility