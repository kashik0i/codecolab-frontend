
const url = "https://api.github.com/gists";

export const getGist = async (gistId: string,token: string) => {
    return await fetch(`${url}/${gistId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const fetchGists = async (token) => {
    return await fetch(`${url}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}