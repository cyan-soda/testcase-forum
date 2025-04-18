'use client'

import { useUserStore } from "@/store/user/user-store"
import { useTranslation } from "react-i18next"

const SpacePage = () => {
    const { user } = useUserStore()
    const { t } = useTranslation('home')

    return (
        <div className="py-8 px-4 flex flex-col gap-2 items-start justify-start w-full">
            {!user && (
                <div className="flex flex-col gap-2 items-start justify-start w-full">
                    <p className="text-lg font-bold">{t('login_required')}</p>
                    <p>{t('login_required_description')}</p>
                </div>
            )}
        </div>
    )
}

export default SpacePage