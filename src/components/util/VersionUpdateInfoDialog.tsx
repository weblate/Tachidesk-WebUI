/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { useUpdateChecker } from '@/util/useUpdateChecker.tsx';

interface BaseProps {
    info: string;
    actionTitle: string;
    updateCheckerProps: Parameters<typeof useUpdateChecker>;
    changelogUrl?: string;
}

interface UrlActionProps extends BaseProps {
    actionUrl: string;
}

interface ActionProps extends BaseProps {
    onAction: () => void;
}

type VersionUpdateInfoDialogProps =
    | (UrlActionProps & PropertiesNever<Pick<ActionProps, 'onAction'>>)
    | (PropertiesNever<Pick<UrlActionProps, 'actionUrl'>> & ActionProps);

export const VersionUpdateInfoDialog = ({
    info,
    actionUrl,
    onAction,
    actionTitle,
    updateCheckerProps,
    changelogUrl,
}: VersionUpdateInfoDialogProps) => {
    const { t } = useTranslation();

    const updateChecker = useUpdateChecker(...updateCheckerProps);

    if (!updateChecker.handleUpdate) {
        return null;
    }

    return (
        <Dialog open>
            <DialogTitle>{t('global.update.label.available')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{info}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Stack sx={{ width: '100%' }} direction="row" justifyContent={changelogUrl ? 'space-between' : 'end'}>
                    {changelogUrl && (
                        <Button href={changelogUrl} target="_blank">
                            {t('global.button.changelog')}
                        </Button>
                    )}
                    <Stack direction="row">
                        <PopupState variant="popover" popupId="update-checker-close-menu">
                            {(popupState) => (
                                <>
                                    <Button {...bindTrigger(popupState)}>{t('global.label.close')}</Button>
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem
                                            onClick={() => {
                                                updateChecker.remindLater();
                                                popupState.close();
                                            }}
                                        >
                                            {t('global.button.remind_later')}
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                updateChecker.ignoreUpdate();
                                                popupState.close();
                                            }}
                                        >
                                            {t('global.button.ignore')}
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}
                        </PopupState>
                        {actionUrl ? (
                            <Button variant="contained" href={actionUrl} target="_blank">
                                {actionTitle}
                            </Button>
                        ) : (
                            <Button onClick={onAction} variant="contained">
                                {actionTitle}
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};
