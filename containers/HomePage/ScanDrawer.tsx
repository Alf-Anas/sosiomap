import { Box, Fab, Stack, Zoom } from '@mui/material';
import { useI18n } from '@/locales/client';
import { MapPostDataInterface } from '@/types/api/responses/map-post-data.interface';
import { MyLocation } from '@/hooks/useGeolocation';
import CommonDrawer, {
    useCommonDrawer,
} from '@/components/drawer/CommonDrawer';
import SimplePost from '../Post/View/SimplePost';
import SensorsIcon from '@mui/icons-material/Sensors';
import { useState } from 'react';
import { myTurf } from '@/utils/helper';
import { useMapLibreContext } from '@/contexts/MapLibreContext';
import useWideScreen from '@/hooks/useWideScreen';
import { toast } from 'react-toastify';
import { TooltipSpeedDial } from './HomeSpeedDial';

type Props = {
    userLocation: MyLocation | null;
    posts: MapPostDataInterface[];
};

export default function ScanDrawer({ userLocation, posts }: Props) {
    const t = useI18n();
    const isWide = useWideScreen();
    const { myMap } = useMapLibreContext();
    const [listScanData, setListScanData] = useState<MapPostDataInterface[]>(
        [],
    );

    const { openDrawer, toggleDrawer } = useCommonDrawer();

    function onClickScan(e: any) {
        if (!myMap) return;
        const bbox = myMap.getBounds();
        const polygonCoordinates = [
            [
                [bbox._sw.lng, bbox._sw.lat],
                [bbox._sw.lng, bbox._ne.lat],
                [bbox._ne.lng, bbox._ne.lat],
                [bbox._ne.lng, bbox._sw.lat],
                [bbox._sw.lng, bbox._sw.lat],
            ],
        ];
        const polygon = myTurf.polygon(polygonCoordinates);
        const filteredData = posts.filter((item) => {
            const point = myTurf.point(item.location.coordinates);
            return myTurf.booleanPointInPolygon(point, polygon);
        });

        setListScanData(filteredData);
        if (filteredData.length > 0) {
            toggleDrawer(true)(e);
        } else {
            toast.error(t('message.error.no_post_found_in_your_area'), {
                theme: 'colored',
            });
        }
    }

    return (
        <>
            <Zoom in>
                <Fab aria-label='scan' size='medium' onClick={onClickScan}>
                    <TooltipSpeedDial label={t('button.scan_this_area')}>
                        <SensorsIcon />
                    </TooltipSpeedDial>
                </Fab>
            </Zoom>

            <CommonDrawer
                anchor={isWide ? 'right' : 'bottom'}
                open={openDrawer}
                toggleDrawer={toggleDrawer}
                title={t('post.nearby_post')}
                keepMounted={false}
                transparent
            >
                <Stack spacing={2} className='max-h-[50vh] max-w-md'>
                    {listScanData.map((post) => (
                        <Box key={post._id}>
                            <SimplePost
                                post={post}
                                userLocation={userLocation}
                            />
                        </Box>
                    ))}
                </Stack>
            </CommonDrawer>
        </>
    );
}
