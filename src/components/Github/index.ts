export interface Gist {
    url: string;
    forks_url: string;
    commits_url: string;
    id: string;
    node_id: string;
    git_pull_url: string;
    git_push_url: string;
    html_url: string;
    files: {
        [key: string]: {
            filename: string;
            type: string;
            language: string;
            raw_url: string;
            size: number;
            truncated: boolean;
            content: string;
        };
    };
    public: boolean;
    created_at: string;
    updated_at: string;
    description: string;
    comments: number;
    user?: any;
    comments_url: string;
    owner?: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean
    };
    forks?: any[];
    history?: {
        user?: {
            login?:string,
            id?:number,
            node_id?:string,
            avatar_url?:string,
            gravatar_id?:string,
            url?:string,
            html_url?:string,
            followers_url?:string,
            following_url?:string,
            gists_url?:string,
            starred_url?:string,
            subscriptions_url?:string,
            organizations_url?:string,
            repos_url?:string,
            events_url?:string,
            received_events_url?:string,
            type?:string,
            site_admin?:boolean
        },
        version:string,
        committed_at:string,
        change_status:{
            total:number,
            additions:number,
            deletions:number
        },
        url:string
    }[];
}
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

