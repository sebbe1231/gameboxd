import Swal from "sweetalert2";

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

export const sort_types = [
    "name",
    "first_release_date",
    "rating"
]


export const toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});