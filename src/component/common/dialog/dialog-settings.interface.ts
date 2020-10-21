import { DialogType } from "src/app/enum/system/dialog-type.enum";

export interface IDialogSettings {
    title: string,
    message: string,
    type?: DialogType,
    approveButtonText?: string,
    showDeclineButton?: boolean,
    declineButtonText?: string,
    titleData?: any,
    messageData?: any
}