import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShopIcon from '@mui/icons-material/Shop';
import {
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from '@mui/material';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useChangeLocale, useI18n } from '@/locales/client';
import { LIST_COUNTRY } from '@/locales/country';
import BasicMenu from '@/components/menu/BasicMenu';
import MyImage from '@/components/preview/MyImage';
import { ASSETS, ROUTE, ROUTE_EXTERNAL } from '@/utils/constant';
import { useSession } from 'next-auth/react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
// import PhonelinkEraseIcon from '@mui/icons-material/PhonelinkErase';
import LogoutIcon from '@mui/icons-material/Logout';
import useLogout from '@/hooks/useLogout';
import { ReactNode } from 'react';
import { isTWA } from '@/utils/helper';

type UseChangeLocaleType = typeof useChangeLocale;
type NewLocaleType = Parameters<ReturnType<UseChangeLocaleType>>[0];

export default function PageAppBar() {
    const t = useI18n();
    const changeLocale = useChangeLocale();
    const { mode, toggleColorMode } = useThemeMode();
    const session = useSession();
    const logout = useLogout();

    const LIST_MORE_MENU: {
        id: string;
        label: string;
        url: string;
        icon?: ReactNode;
    }[][] = [
        [
            {
                id: 'about',
                label: t('navigation.about'),
                url: ROUTE.ABOUT.URL,
                icon: <InfoOutlinedIcon fontSize='small' />,
            },
            {
                id: 'privacy-policy',
                label: t('navigation.privacy_policy'),
                url: ROUTE.PRIVACY_POLICY.URL,
                icon: <PrivacyTipOutlinedIcon fontSize='small' />,
            },
            {
                id: 'terms-and-conditions',
                label: t('navigation.terms_and_conditions'),
                url: ROUTE.TERMS_AND_CONDITIONS.URL,
                icon: <StickyNote2OutlinedIcon fontSize='small' />,
            },
        ],
        // {
        //     id: 'clear_data',
        //     label: t('navigation.clear_data'),
        //     url: ROUTE.CLEAR_DATA.URL,
        //     icon: <PhonelinkEraseIcon fontSize='small' />,
        //     hide: true,
        // },
    ];

    if (!isTWA()) {
        LIST_MORE_MENU.unshift([
            {
                id: 'play-store',
                label: ROUTE_EXTERNAL.PLAY_STORE.LABEL,
                url: ROUTE_EXTERNAL.PLAY_STORE.URL,
                icon: <ShopIcon fontSize='small' />,
            },
        ]);
    }

    return (
        <Box>
            <AppBar position='sticky'>
                <Toolbar>
                    <AccountCircleIcon
                        color='inherit'
                        aria-label='profile-icon'
                        sx={{ mr: 2 }}
                    />
                    <Typography variant='h6' noWrap component='div'>
                        {session.data?.user.name || t('navigation.profile')}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box>
                        <IconButton
                            size='medium'
                            aria-label='theme'
                            color='inherit'
                            onClick={toggleColorMode}
                        >
                            {mode === 'dark' ? (
                                <LightModeIcon />
                            ) : (
                                <DarkModeIcon />
                            )}
                        </IconButton>

                        <BasicMenu
                            menuID='locale'
                            menuButton={
                                <IconButton size='medium' color='inherit'>
                                    <GTranslateIcon />
                                </IconButton>
                            }
                        >
                            {LIST_COUNTRY.map((item) => {
                                return (
                                    <MenuItem
                                        key={item.locale}
                                        onClick={() =>
                                            changeLocale(
                                                item.locale.toLowerCase() as NewLocaleType,
                                            )
                                        }
                                    >
                                        <MyImage
                                            width='20'
                                            src={`${ASSETS.FLAG_IMAGE}${item.flag}`}
                                            alt={item.flag}
                                            className='mr-4'
                                        />
                                        {item.locale}
                                    </MenuItem>
                                );
                            })}
                        </BasicMenu>
                        <BasicMenu
                            menuID='more'
                            menuButton={
                                <IconButton size='medium' color='inherit'>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        >
                            {LIST_MORE_MENU.map((groupMenu, idx) => {
                                const groupItems: JSX.Element[] = [
                                    <Divider key={idx} />,
                                ];

                                groupMenu.map((item) => {
                                    groupItems.push(
                                        <MenuItem
                                            key={item.id}
                                            onClick={() =>
                                                window.open(item.url, '_blank')
                                            }
                                        >
                                            {item.icon && (
                                                <ListItemIcon>
                                                    {item.icon}
                                                </ListItemIcon>
                                            )}

                                            <ListItemText>
                                                {item.label}
                                            </ListItemText>
                                        </MenuItem>,
                                    );
                                });
                                return groupItems;
                            })}
                            {session.status === 'authenticated' &&
                                [
                                    <Divider key='divider' />,
                                    <MenuItem
                                        key='logout'
                                        onClick={() => logout.signout()}
                                    >
                                        <ListItemIcon>
                                            <LogoutIcon fontSize='small' />
                                        </ListItemIcon>
                                        <ListItemText>
                                            {t('button.logout')}
                                        </ListItemText>
                                    </MenuItem>,
                                ].map((item) => item)}
                        </BasicMenu>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
