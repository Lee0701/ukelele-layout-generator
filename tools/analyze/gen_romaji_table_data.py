
cho_table = {
    'k': 'ᄀ',
    'h': 'ᄂ',
    'u': 'ᄃ',
    'y': 'ᄅ',
    'i': 'ᄆ',
    ';': 'ᄇ',
    'n': 'ᄉ',
    'j': 'ᄋ',
    'l': 'ᄌ',
    'o': 'ᄎ',
    '0': 'ᄏ',
    ':': 'ᄐ',
    'p': 'ᄑ',
    'm': 'ᄒ',
}

jung_table = {
    'f': 'ᅡ',
    'r': 'ᅢ',
    '6': 'ᅣ',
    'G': 'ᅤ',
    't': 'ᅥ',
    'c': 'ᅦ',
    'e': 'ᅧ',
    '7': 'ᅨ',
    'v': 'ᅩ',
    '4': 'ᅭ',
    'b': 'ᅮ',
    '5': 'ᅲ',
    'g': 'ᅳ',
    '8': 'ᅴ',
    'd': 'ᅵ',

    '/': 'ᅩ',
    '9': 'ᅮ',
}

jong_table = {
    'x': 'ᆨ',
    '!': 'ᆩ',
    'V': 'ᆪ',
    's': 'ᆫ',
    'E': 'ᆬ',
    'S': 'ᆭ',
    'A': 'ᆮ',
    'w': 'ᆯ',
    '"': 'ᆰ',
    'F': 'ᆱ',
    'D': 'ᆲ',
    'T': 'ᆳ',
    '%': 'ᆴ',
    '$': 'ᆵ',
    'R': 'ᆶ',
    'z': 'ᆷ',
    '3': 'ᆸ',
    'X': 'ᆹ',
    'q': 'ᆺ',
    '2': 'ᆻ',
    'a': 'ᆼ',
    '#': 'ᆽ',
    'Z': 'ᆾ',
    'C': 'ᆿ',
    'W': 'ᇀ',
    'Q': 'ᇁ',
    '1': 'ᇂ',
}

jamo_tables = (cho_table, jung_table, jong_table)

cho_combination_table = {
    'kk': 'ᄁ',
    'uu': 'ᄄ',
    ';;': 'ᄈ',
    'nn': 'ᄊ',
    'll': 'ᄍ',
}

jung_combination_table = {
    '/f': 'ᅪ',
    '/r': 'ᅫ',
    '/d': 'ᅬ',
    '9t': 'ᅯ',
    '9c': 'ᅰ',
    '9d': 'ᅱ',
}

jong_combination_table = {
}

combination_tables = (cho_combination_table, jung_combination_table, jong_combination_table)

convert_cho = 'ᄀᄁ\x00ᄂ\x00\x00ᄃᄄᄅ\x00\x00\x00\x00\x00\x00\x00ᄆᄇᄈ\x00ᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ'
convert_jung = 'ᅡᅢᅣᅤᅥᅦᅧᅨᅩᅪᅫᅬᅭᅮᅯᅰᅱᅲᅳᅴᅵ'
convert_jong = 'ᆨᆩᆪᆫᆬᆭᆮ\x00ᆯᆰᆱᆲᆳᆴᆵᆶᆷᆸ\x00ᆹᆺᆻᆼᆽ\x00ᆾᆿᇀᇁᇂ'

compat_cho_jong = 'ㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅄㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
compat_jung = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'

def jamo_to_compat(c):
    if c in convert_cho:
        return compat_cho_jong[convert_cho.index(c)]
    elif c in convert_jung:
        return compat_jung[convert_jung.index(c)]
    elif c in convert_jong:
        return compat_cho_jong[convert_jong.index(c)]
    else:
        return c
