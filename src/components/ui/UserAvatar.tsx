"use client";
import React from 'react';

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, src, size = 40 }) => {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div role="img" aria-label={`User avatar ${name}`} className="inline-flex items-center justify-center rounded-full overflow-hidden" style={{ width: size, height: size }}>
      {src ? (
        // Image could be replaced with Next/Image when integrating with backend
        // for now we show a simple img tag for demo
        // TODO: replace with <Image> and proper optimization when hooking up backend
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`Avatar of ${name}`} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-iosPurple text-white flex items-center justify-center font-semibold">{initials}</div>
      )}
    </div>
  );
};

export default UserAvatar;
