import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ReactNode, useRef, useState } from 'react';

const StyledBox = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

type Props = {
    drawerBleeding?: number;
    title?: string;
    children: ReactNode;
    anchor: 'bottom' | 'right' | 'left' | 'top';
    open: boolean;
    toggleDrawer: (
        open: boolean,
    ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
    keepMounted?: boolean;
    transparent?: boolean;
};

export const useCommonDrawer = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const refCallbackOpenDrawer = useRef((open: boolean) => {});

    const toggleDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (event) {
                event.stopPropagation();
            }
            if (
                event &&
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            setOpenDrawer(open);
            refCallbackOpenDrawer.current(open);
        };

    return {
        openDrawer,
        setOpenDrawer,
        toggleDrawer,
        refCallbackOpenDrawer,
    };
};

export default function CommonDrawer({
    drawerBleeding = 0,
    title,
    children,
    anchor,
    open,
    toggleDrawer,
    keepMounted = true,
    transparent,
}: Props) {
    return (
        <SwipeableDrawer
            anchor={anchor}
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            swipeAreaWidth={drawerBleeding}
            disableSwipeToOpen={drawerBleeding > 0 ? false : true}
            ModalProps={{
                keepMounted: keepMounted,
            }}
            PaperProps={{
                sx: {
                    backgroundColor: transparent ? 'transparent' : '',
                },
            }}
        >
            <StyledBox
                sx={{
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    right: 0,
                    left: 0,
                    backgroundColor: transparent ? 'transparent' : '',
                }}
            >
                <Puller />
                {title && (
                    <Typography sx={{ p: 2, color: 'text.secondary' }}>
                        {title}
                    </Typography>
                )}
            </StyledBox>
            <StyledBox
                sx={{
                    px: 2,
                    pb: 2,
                    height: '100%',
                    overflow: 'auto',
                    backgroundColor: transparent ? 'transparent' : '',
                }}
            >
                {children}
            </StyledBox>
        </SwipeableDrawer>
    );
}
