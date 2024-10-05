import { Fab, Zoom } from '@mui/material';
import { QUERY, ROUTE } from '@/utils/constant';
import { TOPIC } from '@/hooks/useTopic';
import ChooseLocationEnum from '@/types/choose-location.enum';
import { blue } from '@mui/material/colors';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { TooltipSpeedDial } from './HomeSpeedDial';
import { useScopedI18n } from '@/locales/client';

export default function NewStoryButton() {
    const t = useScopedI18n('button');
    function onClickNewStory() {
        const theURL = `${ROUTE.POST.NEW.URL}?${QUERY.LOCATION}=${ChooseLocationEnum.USE_CURRENT_LOCATION}&${QUERY.TOPIC}=${TOPIC.USER_STORIES.id}`;
        window.open(theURL, '_blank');
    }

    return (
        <Zoom in>
            <Fab
                aria-label={TOPIC.USER_STORIES.id}
                size='medium'
                style={{ backgroundColor: blue[500], color: 'white' }}
                onClick={onClickNewStory}
            >
                <TooltipSpeedDial label={t('post_story')}>
                    <AddCircleOutlineOutlinedIcon />
                </TooltipSpeedDial>
            </Fab>
        </Zoom>
    );
}
