export type MediaItem = {
    id: number;
    filename: string;
    filetype: 'video' | 'image';
    mime_type: string;
    size: number;
    url: string;
    uploaded_by: string;
    description: string;
}

export type Comment = {
    id: number;
    mediaId: number;
    content: string;
    created_at: string;
}