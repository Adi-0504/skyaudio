from phonology import phoneme_map

def g2p(text: str):
    text = text.lower()

    result = []

    i = 0
    while i < len(text):
        ch = text[i]

        if ch == " ":
            result.append(" ")
            i += 1
            continue

        if ch in phoneme_map:
            mapped = phoneme_map[ch]
            if mapped != "":
                result.append(mapped)

        i += 1

    return result
