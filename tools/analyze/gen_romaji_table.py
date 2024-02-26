
import sys
from unicodedata import normalize

from gen_romaji_table_data import jamo_tables, combination_tables, jamo_to_compat

(cho_table, jung_table, jong_table) = jamo_tables
(cho_combination_table, jung_combination_table, jong_combination_table) = combination_tables

def generate(output_file):
    syllables = []

    for strokes, result in cho_combination_table.items():
        cho_table[strokes] = result
    
    for strokes, result in jung_combination_table.items():
        jung_table[strokes] = result
    
    for strokes, result in jong_combination_table.items():
        jong_table[strokes] = result

    for cho_code, cho in cho_table.items():
        key_stroke = cho_code
        cho_display = jamo_to_compat(cho)
        syllables.append([key_stroke, '', cho_display])
        for jung_code, jung in jung_table.items():
            key_stroke = cho_display + jung_code
            cho_jung_display = normalize('NFC', cho + jung)
            syllables.append([key_stroke, '', cho_jung_display])
            for jong_code, jong in jong_table.items():
                key_stroke = cho_jung_display + jong_code
                cho_jung_jong_display = normalize('NFC', cho + jung + jong)
                syllables.append([key_stroke, '', cho_jung_jong_display])

    with open(output_file, 'w', encoding='utf-8') as f:
        data = '\n'.join(['\t'.join(items) for items in syllables])
        f.write(data)

def main():
    args = sys.argv[1:]
    output_file, = args[:1]
    generate(output_file)

if __name__ == "__main__":
    main()
