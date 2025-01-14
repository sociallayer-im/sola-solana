import {ReactNode, useContext, useEffect, useState} from 'react'
import AppSwiper from '../../AppSwiper/AppSwiper'
import {Delete} from 'baseui/icon'
import LangContext from '../../../provider/LangProvider/LangContext'
import {getProfile, Profile, Badge, queryGroupDetail} from "@/service/solas";
import DialogsContext from "@/components/provider/DialogProvider/DialogsContext";

export type CreateType = 'badge' | 'point' | 'nftpass' | 'private' | 'gift' | 'solanabadge'

export interface BadgeBookDialogRes {
    badgeId?: number
    badgebookId?: number
    type: CreateType
    badge?: Badge
}

interface DialogIssuePrefillProps {
    badges: Badge[]
    handleClose: () => any
    profileId: number
    group_id?: number
    onSelect?: (res: BadgeBookDialogRes) => any
}


function DialogIssuePrefill(props: DialogIssuePrefillProps) {
    const [showCreateOption, setShowCreateOption] = useState(false)
    const {lang} = useContext(LangContext)
    const [user, setUser] = useState<Profile | null>(null)
    const {showLoading} = useContext(DialogsContext)


    const gotoCreateBadge = (type: CreateType) => {
        !!props.onSelect && props.onSelect({type})
        props.handleClose()
    }

    const getProfileDetail = async () => {
        const unload = showLoading()
        const profile = props.group_id
            ? await queryGroupDetail(props.group_id)
            : await getProfile({id: props.profileId})
        unload()
        setUser(profile)
    }

    useEffect(() => {
        getProfileDetail()
    }, [])

    const badgeItems = (badges: Badge[]) => {
        const handleClick = (item: Badge) => {
            !!props.onSelect && props.onSelect({badgeId: item.id, type: 'badge', badge: item})
            props.handleClose()
        }

        return badges.map(item => {
            return (
                <div className='prefill-item' key={item.id} title={item.title} onClick={() => {
                    handleClick(item)
                }}>
                    <img src={item.image_url} alt=""/>
                </div>
            )
        }) as ReactNode[]
    }

    return (<>
        {!!user &&
            <div className='dialog-issue-prefill'>
                {showCreateOption ?
                    <>
                        <div className='create-badge-btn' onClick={e => {
                            gotoCreateBadge('badge')
                        }}>
                            <img src="/images/badge_type/basic.png" alt=""/>
                            <div>
                                <div>{lang['Badgebook_Dialog_Recognition_Badge']}</div>
                                <div className={'des'}>{lang['Badgebook_Dialog_Recognition_Des']} </div>
                            </div>
                        </div>
                        <div className='create-badge-btn' onClick={e => {
                            gotoCreateBadge('solanabadge')
                        }}>
                            <img src="/images/solana.png" alt=""/>
                            <div>
                                <div>{'Solana Badge'} <span className={'new-mark'}>NEW</span></div>
                                <div className={'des'}>{'Create a badge on Solana network'} </div>
                            </div>
                        </div>
                        <div className='create-badge-btn' onClick={e => {
                            gotoCreateBadge('private')
                        }}>
                            <img src="/images/badge_type/private.png" alt=""/>
                            <div>
                                <div>{lang['Badgebook_Dialog_Privacy']} <span className={'new-mark'}>NEW</span></div>
                                <div className={'des'}>{lang['Badgebook_Dialog_Privacy_Des']}</div>
                            </div>
                        </div>
                        {
                            !!user?.id && user?.permissions.includes('nftpass') &&
                            <div className='create-badge-btn' onClick={e => {
                                gotoCreateBadge('nftpass')
                            }}>
                                <img src="/images/badge_type/nftpass.png" alt=""/>
                                <div>
                                    <div>{lang['Badgebook_Dialog_NFT_Pass']} <span className={'new-mark'}>NEW</span></div>
                                    <div className={'des'}>{lang['Badgebook_Dialog_NFT_Pass_Des']}</div>
                                </div>
                            </div>
                        }
                        {
                            !!user?.id && user?.permissions.includes('point') &&
                            <div className='create-badge-btn' onClick={e => {
                                gotoCreateBadge('point')
                            }}>
                                <img src="/images/badge_type/point.png" alt=""/>
                                <div>
                                    <div>{lang['Badgebook_Dialog_Points']} <span className={'new-mark'}>NEW</span></div>
                                    <div className={'des'}>{lang['Badgebook_Dialog_Points_Des']}</div>
                                </div>
                            </div>
                        }

                        {
                            !!user?.id && user?.permissions.includes('gift') &&
                            <div className='create-badge-btn' onClick={e => {
                                gotoCreateBadge('gift')
                            }}>
                                <img src="/images/badge_type/gift.png" alt=""/>
                                <div>
                                    <div>{lang['Badgebook_Dialog_Gift']} <span className={'new-mark'}>NEW</span></div>
                                    <div className={'des'}>{lang['Badgebook_Dialog_Gift_Des']}</div>
                                </div>
                            </div>
                        }
                    </>
                    : <>
                        { props.badges.length > 0 &&
                            <div className='prefill-module'>
                                <div className='prefill-module-title'>{lang['Badgebook_Dialog_Choose_Badge']}</div>
                                <div className='prefill-module-items'>
                                    <AppSwiper items={badgeItems(props.badges)} space={6} itemWidth={68}/>
                                </div>
                            </div>
                        }
                        <div className='create-badge-btn' onClick={event => {
                            console.log('user?.id  ' + user)
                            console.log('user.permissions.length  ' + user?.permissions.length)
                            setShowCreateOption(true)
                        }}>
                            <img src="/images/create_badge_icon.png" alt=""/>
                            <span>{lang['Badgebook_Dialog_Cetate_Badge']}</span>
                        </div>
                    </>
                }
                <div className='close-dialog' onClick={() => {
                    props.handleClose()
                }}><Delete size={20} title='Close'/></div>
            </div>
        }
    </>)
}

export default DialogIssuePrefill
