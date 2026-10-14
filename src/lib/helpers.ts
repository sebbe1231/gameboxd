export function decodeTag(tagNumber: number) {
    const type = tagNumber >>> 28;
    const id = tagNumber & 0x0fffffff

    return { type, id };
}

export const tag_types = [
    "themes",
    "genres",
    "keywords",
    "games",
    "player_perspectives"
]