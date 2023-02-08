export type likesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

export enum myLikeStatus {
    'None',
    'Like',
    'Dislike'
}

export type likesReq = {
    likeStatus: string
}