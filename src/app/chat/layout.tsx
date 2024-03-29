"use server"
import SignOutButton from '@/components/SignOutButton'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/siderbar/Sidebar'
import ConversationList from './components/ConversationList'
import getConversations from '../actions/getConversations'
import getUsers from '../actions/getUsers'
import getPublicGroups from '../actions/getPublicGroups'
import getGroupInvites from '../actions/getGroupInvites'
import getCurrentUser from '../actions/getCurrentUser'
interface LayoutProps {
    children: ReactNode
}

const layout = async ({ children }: LayoutProps) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect(`/login`)
    }

    const currentUser = await getCurrentUser()
    const conversations = await getConversations()
    const publicGroups = await getPublicGroups()
    const groupInviteRequest = await getGroupInvites()
    const users = await getUsers()

    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList currentUser={currentUser} initialConversations={conversations} publicGroups={publicGroups} groupInviteRequest={groupInviteRequest} title='Messages' users={users} />
                {children}
            </div>
        </Sidebar>
    )
}

export default layout