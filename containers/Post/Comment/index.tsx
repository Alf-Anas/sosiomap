'use client';

import {
    Box,
    Button,
    Card,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import NeedLogin from '@/components/auth/NeedLogin';
import { useI18n } from '@/locales/client';
import { useState } from 'react';
import { compressImage } from '@/utils/helper';
import { toast } from 'react-toastify';
import useAPI from '@/hooks/useAPI';
import API from '@/configs/api';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { TheFileType as TheFileTypeCarousel } from '@/components/input/FileUpload/ImageVideoUploadCarousel';
import { TheFileType as TheFileTypeStandard } from '@/components/input/FileUpload/ImageVideoUploadStandard';
import { PostCommentParamsInterface } from '@/types/api/params/post-comment.interface';
import { CommentDataInterface } from '@/types/api/responses/comment-data.interface';
import CommentBox from './CommentBox';
import SingleAccordion from '@/components/accordion/SingleAccordion';
import {
    SocialMediaURLType,
    initialSocialMediaURLType,
} from '../New/SocialMediaPost';
import StandardPost from '../New/StandardPost';
import SendIcon from '@mui/icons-material/Send';
import useFormattingData from '@/hooks/useFormattingData';

type Props = {
    postId: string;
    topicId: string;
    commentValue: number;
};

export default function CommentPage({ postId, topicId, commentValue }: Props) {
    const t = useI18n();
    const [socialMediaURL, setSocialMediaURL] = useState<SocialMediaURLType>(
        initialSocialMediaURLType,
    );
    const [inputData, setInputData] = useState({
        title: '',
        body: '',
    });
    const [inputFiles, setInputFiles] = useState<
        (TheFileTypeCarousel | TheFileTypeStandard)[]
    >([]);

    const [isLoading, setIsLoading] = useState(false);

    const { list: listComment, ...apiListComment } = useAPI<
        ObjectLiteral,
        string,
        CommentDataInterface[]
    >(API.getPublicComment, {
        onError: (err) => {
            toast.error(err, {
                theme: 'colored',
            });
        },
        listkey: 'data',
        callOnFirstRender: true,
        callOnFirstRenderParams: postId,
    });
    const apiSendComment = useAPI<ObjectLiteral, PostCommentParamsInterface>(
        API.postComment,
        {
            onSuccess: () => {
                apiListComment.call(postId);
                setIsLoading(false);
                setInputData({
                    title: '',
                    body: '',
                });
                setInputFiles([]);
                setSocialMediaURL(initialSocialMediaURLType);
            },
            onError: (err) => {
                toast.error(err, {
                    theme: 'colored',
                });
                setIsLoading(false);
            },
        },
    );

    async function onClickSend() {
        setIsLoading(true);

        let compressFlagError = false;
        const newComp: { file: File; idx: number; caption: string }[] = [];
        for (let i = 0; i < inputFiles.length; i++) {
            const eFile = inputFiles[i] as TheFileTypeCarousel;
            await compressImage(eFile.file)
                .then((out) => {
                    newComp.push({
                        file: out,
                        idx: i + 1,
                        caption: eFile.caption || '',
                    });
                })
                .catch((err) => {
                    toast.error(JSON.stringify(err));
                    compressFlagError = true;
                });
            if (compressFlagError) {
                setIsLoading(false);
                break;
            }
        }
        if (compressFlagError) {
            setIsLoading(false);
            return;
        }

        const params: PostCommentParamsInterface = {
            post_id: postId,
            topic_id: topicId,
            title: inputData.title,
            body: inputData.body,
            url_facebook_post: socialMediaURL.facebook,
            url_twitter_post: socialMediaURL.twitter,
            url_instagram_post: socialMediaURL.instagram,
            url_tiktok_post: socialMediaURL.tiktok,
            url_youtube_post: socialMediaURL.youtube,
            url_linkedin_post: socialMediaURL.linkedin,
            url_news_website_post: socialMediaURL.news_website,
            url_other: socialMediaURL.other,
        };
        newComp.forEach((item) => {
            params[`media_${item.idx}` as 'media_1'] = item.file;
            params[`media_${item.idx}_caption` as 'media_1_caption'] =
                item.caption;
        });
        apiSendComment.call(params);
    }

    const { formattingData } = useFormattingData();

    // @ts-ignore
    const commentLabel = t('post.statistic.comments', {
        value: formattingData(commentValue),
    });

    return (
        <Stack spacing={0.5} className='mt-1 mx-1'>
            <Card
                elevation={5}
                variant='elevation'
                sx={{ borderRadius: '8px' }}
            >
                <Typography
                    component='p'
                    variant='body2'
                    className='!mt-2 text-center'
                >
                    {commentLabel}
                </Typography>
                <NeedLogin>
                    <SingleAccordion title={t('post.add_comment')} defaultOpen>
                        <Box className='max-w-xl'>
                            <StandardPost
                                valueInputData={inputData}
                                valueSocialMediaURL={socialMediaURL}
                                onChangeInputData={setInputData}
                                onChangeInputFiles={setInputFiles}
                                onChangeSocialMediaURL={setSocialMediaURL}
                                placeholder={t('post.add_comment_placeholder')}
                                minRows={2}
                            />
                        </Box>
                        <Box className='text-end'>
                            <Button
                                onClick={onClickSend}
                                disabled={isLoading}
                                variant='contained'
                                endIcon={
                                    isLoading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <SendIcon />
                                    )
                                }
                            >
                                {t('button.send')}
                            </Button>
                        </Box>
                    </SingleAccordion>
                </NeedLogin>
            </Card>

            {apiListComment.loading && <CircularProgress />}
            {listComment?.map((item) => {
                return <CommentBox key={item._id} comment={item} />;
            })}
        </Stack>
    );
}
