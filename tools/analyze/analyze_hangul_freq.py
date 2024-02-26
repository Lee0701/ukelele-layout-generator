
import sys
import os
import os.path as path

from collections import Counter
from unicodedata import normalize

STD_CHO = 'ᄀᄁᄂᄃᄄᄅᄆᄇᄈᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ'
STD_JUNG = 'ᅡᅢᅣᅤᅥᅦᅧᅨᅩᅪᅫᅬᅭᅮᅯᅰᅱᅲᅳᅴᅵ'
STD_JONG = 'ᆨᆩᆪᆫᆬᆭᆮᆯᆰᆱᆲᆳᆴᆵᆶᆷᆸᆹᆺᆻᆼᆽᆾᆿᇀᇁᇂ'

COMPAT_CONSONANT = 'ㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅄㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
COMPAT_VOWEL = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'

CONVERT_CHO = 'ᄀᄁ ᄂ  ᄃᄄᄅ       ᄆᄇᄈ ᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ'
CONVERT_JONG = 'ᆨᆩᆪᆫᆬᆭᆮ ᆯᆰᆱᆲᆳᆴᆵᆶᆷᆸ ᆹᆺᆻᆼᆽ ᆾᆿᇀᇁᇂ'

def remove_newlines(content):
    return content.replace('\n', '').replace('\r', '')

def is_hangul_syllable(c):
    return c >= '가' and c <= '힣'

def filter_syllables(content):
    return ''.join([c for c in content if is_hangul_syllable(c)])

def std_to_compat_jamo(c):
    if c in STD_CHO:
        return COMPAT_CONSONANT[CONVERT_CHO.index(c)]
    elif c in STD_JUNG:
        return COMPAT_VOWEL[STD_JUNG.index(c)]
    elif c in STD_JONG:
        return COMPAT_CONSONANT[CONVERT_JONG.index(c)]
    else:
        return c

def only_hangul_normalized_nfd(content):
    content = remove_newlines(content)
    content = filter_syllables(content)
    content = normalize('NFD', content)
    return content

def run_counter(content):
    counter = Counter(content)
    result = counter.items()
    result = sorted(result, key=lambda x: x[0])
    return result

def analyze_syllable_freq(content):
    content = normalize('NFC', content)
    result = run_counter(content)
    return result

def analyze_jamo_freq(content):
    result = run_counter(content)
    return result

def analyze_compat_jamo_freq(content):
    content = ''.join([std_to_compat_jamo(c) for c in content])
    result = run_counter(content)
    return result

def analyze_syllable_syllable_freq(content):
    content = normalize('NFC', content)
    indices = [i for i, c in enumerate(content) if is_hangul_syllable(c)]
    result = [content[i] + content[i+1] for i in indices[:-1]]
    result = run_counter(result)
    result = [list(key) + [value] for key, value in result]
    return result

def analyze_cho_jung_freq(content):
    indices = [i for i, c in enumerate(content) if c in STD_CHO]
    result = [content[i] + content[i+1] for i in indices]
    result = run_counter(result)
    result = [list(key) + [value] for key, value in result]
    return result

def analyze_jung_jong_freq(content):
    indices = [i for i, c in enumerate(content) if c in STD_JUNG and i+1 < len(content) and content[i+1] in STD_JONG]
    indices_without_jong = [i for i, c in enumerate(content) if c in STD_JUNG and (i+1 >= len(content) or content[i+1] in STD_CHO)]
    result = [content[i] + content[i+1] for i in indices]
    result_without_jong = [content[i] + '_' for i in indices_without_jong]
    result = run_counter(result + result_without_jong)
    result = [list(key) + [value] for key, value in result]
    return result

def analyze_jong_cho_freq(content):
    indices = [i for i, c in enumerate(content) if c in STD_JONG and i+1 < len(content) and content[i+1] in STD_CHO]
    indices_without_jong = [i for i, c in enumerate(content) if c in STD_JUNG and i+1 < len(content) and content[i+1] in STD_CHO]
    result = [content[i] + content[i+1] for i in indices]
    result_without_jong = ['_' + content[i+1] for i in indices_without_jong]
    result = run_counter(result + result_without_jong)
    result = [list(key) + [value] for key, value in result]
    return result

analyzes = {
    'syllable_freq': analyze_syllable_freq,
    'jamo_freq': analyze_jamo_freq,
    'compat_jamo_freq': analyze_compat_jamo_freq,

    'syllable_syllable_freq': analyze_syllable_syllable_freq,
    'cho_jung_freq': analyze_cho_jung_freq,
    'jung_jong_freq': analyze_jung_jong_freq,
    'jong_cho_freq': analyze_jong_cho_freq,
}

def analyze_all(corpus_file, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    with open(corpus_file, 'r') as f:
        content = f.read()
    content = only_hangul_normalized_nfd(content)
    for name, func in analyzes.items():
        result = func(content)
        output_file = path.join(output_dir, f'{name}.tsv')
        with open(output_file, 'w') as f:
            output = ['\t'.join([str(c) for c in item]) for item in result]
            output = '\n'.join(output)
            f.write(output)

def main():
    args = sys.argv[1:]
    [corpus_file, output_dir] = args
    analyze_all(corpus_file, output_dir)

if __name__ == '__main__':
    main()
