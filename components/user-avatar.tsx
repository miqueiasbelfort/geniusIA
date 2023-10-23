import { useUser } from '@clerk/nextjs';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function UserAvatar() {

    const {user} = useUser();

  return (
    <Avatar className='w-8 h-8'>
        <AvatarImage src={user?.imageUrl}/>
        <AvatarFallback>
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(1)}
        </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar;