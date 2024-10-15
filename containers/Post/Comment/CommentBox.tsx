import {
    Box,
    Card,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';
import { useI18n } from '@/locales/client';
import {
    formatDateTime,
    formatDistance,
    getMimeTypeFromURL,
} from '@/utils/helper';
import { CommentDataInterface } from '@/types/api/responses/comment-data.interface';
import ImageVideoStandard from '../View/ImageVideoStandard';
import SocialMediaPost from '../View/SocialMediaPost';
import MyAvatar from '@/components/preview/MyAvatar';
import ProfileDialog from '@/containers/ProfilePage/shared/ProfileDialog';
import TooltipClick from '@/components/tooltip/TooltipClick';

type Props = {
    comment: CommentDataInterface;
};

export default function CommentBox({ comment }: Props) {
    const t = useI18n();

    const commentDistance = formatDistance(comment.distance) + t('unit.km');
    // @ts-ignore
    const distanceDesc = t('post.comment_distance_description', {
        distance: commentDistance,
    });

    return (
        <Card
            variant='elevation'
            elevation={5}
            sx={{ borderRadius: '8px', px: '1rem' }}
        >
            <Stack spacing={0.5}>
                <ListItem className='!items-start !px-0'>
                    <ListItemAvatar sx={{ paddingTop: '0.35rem' }}>
                        <ProfileDialog
                            name={comment.name}
                            username={comment.username}
                            photo_url={comment.photo_url}
                        >
                            <MyAvatar
                                name={comment.name}
                                photo_url={comment.photo_url}
                            />
                        </ProfileDialog>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <ProfileDialog
                                name={comment.name}
                                username={comment.username}
                                photo_url={comment.photo_url}
                            >
                                <span className='cursor-pointer hover:underline active:underline'>
                                    {comment.name}
                                    <span className='ml-1 text-slate-500'>
                                        @{comment.username}
                                    </span>
                                </span>
                            </ProfileDialog>
                        }
                        primaryTypographyProps={{
                            className: '!text-sm ',
                        }}
                        secondary={
                            <>
                                <div className='justify-between flex'>
                                    <Typography className='!text-xs'>
                                        {formatDateTime(
                                            comment.createdAt,
                                            'DD MMM YYYY - HH:mm',
                                        )}
                                    </Typography>
                                    <TooltipClick
                                        title={distanceDesc}
                                        placement='bottom'
                                    >
                                        <Typography className='!text-xs cursor-pointer'>
                                            &#9432; {commentDistance}
                                        </Typography>
                                    </TooltipClick>
                                </div>
                            </>
                        }
                        secondaryTypographyProps={{
                            className: '!text-xs',
                            component: 'div',
                        }}
                    />
                </ListItem>
                <Stack spacing={0}>
                    {comment.title && (
                        <Typography
                            component='p'
                            variant='body1'
                            className='block break-all whitespace-pre-line'
                        >
                            {comment.title}
                        </Typography>
                    )}

                    <Typography component='p' variant='body2'>
                        {comment.body}
                    </Typography>

                    <Box>
                        <ImageVideoStandard
                            media={comment.media.map((item) => ({
                                url: item.file_url,
                                fileType: getMimeTypeFromURL(item.file_url),
                                caption: item.caption,
                            }))}
                        />
                    </Box>
                </Stack>
                <SocialMediaPost postUrlProps={comment.post_url} />
            </Stack>
        </Card>
    );
}
