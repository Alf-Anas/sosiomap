import { ReactElement, cloneElement } from 'react';
import { Avatar, Box, Fab, Icon } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import SingleAccordion from '@/components/accordion/SingleAccordion';
import CommonDrawer, {
    useCommonDrawer,
} from '@/components/drawer/CommonDrawer';
import { useScopedI18n } from '@/locales/client';
import { useWideScreenContext } from '@/contexts/ResponsiveContext';
import React from 'react';
import { useActiveTopicContext } from '../AppPage/PageContext';

const defaultButton = (
    <Fab color='default' aria-label='layers' size='small'>
        <LayersIcon />
    </Fab>
);

export default function LayerDrawer({
    menuButton = defaultButton,
}: {
    menuButton?: ReactElement;
}) {
    const t = useScopedI18n('map');
    const { activeTopicType } = useActiveTopicContext();
    const isWide = useWideScreenContext();
    const { openDrawer, toggleDrawer } = useCommonDrawer();

    const clonedButton = cloneElement(menuButton, {
        onClick: toggleDrawer(true),
    });

    return (
        <>
            {clonedButton}
            <CommonDrawer
                anchor={isWide ? 'right' : 'bottom'}
                open={openDrawer}
                toggleDrawer={toggleDrawer}
                title={t('layers')}
            >
                <Box
                    className='min-h-[35vh] text-center'
                    style={
                        isWide ? { maxWidth: '400px' } : { maxHeight: '100vh' }
                    }
                >
                    {activeTopicType.map((item) => {
                        return (
                            <SingleAccordion
                                title={
                                    <>
                                        <Avatar
                                            className='mr-2'
                                            sx={{
                                                bgcolor: item.bgColor,
                                                width: 24,
                                                height: 24,
                                            }}
                                        >
                                            {typeof item.icon === 'string' ? (
                                                <Icon style={{ width: 16 }}>
                                                    {item.icon}
                                                </Icon>
                                            ) : (
                                                cloneElement(item.icon, {
                                                    style: { width: 16 },
                                                })
                                            )}
                                        </Avatar>
                                        {item.label}
                                    </>
                                }
                                key={item.id}
                            >
                                {item.description}
                            </SingleAccordion>
                        );
                    })}
                </Box>
            </CommonDrawer>
        </>
    );
}
