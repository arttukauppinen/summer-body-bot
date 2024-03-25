const formatList = (title, text, titlePadding, valuePadding, unit = '') => {
    title = title.padEnd(titlePadding, ' ')
    text = text.toString().padStart(valuePadding, ' ')
    const formattedUnit = unit ? ` ${unit}` : ''
    const escapedTitle = escapeMarkdownV2(title)
    const escapedText = escapeMarkdownV2(text)
    return `\`${escapedTitle}${escapedText}\`${formattedUnit}`
}

const escapeMarkdownV2 = (text) => {
    return text.replace(/[_*[\]()~`>#+-=|{}.!\\]/g, (x) => '\\' + x)
}

module.exports = { formatList, escapeMarkdownV2 }