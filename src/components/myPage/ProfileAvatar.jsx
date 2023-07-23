import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getDefaultProfileImageUrl } from '../../api/users';
import { useQuery } from 'react-query';

const ProfileAvatar = ({ width = 100, height = 100, src, ...props }) => {
  const [imageUrl, setImageUrl] = useState('');
  const { isLoading, data } = useQuery(['profileAvatar'], () => getDefaultProfileImageUrl(), {
    staleTime: Infinity
  });

  const handleImageError = useCallback(
    async (e) => {
      e.target.src = data;
    },
    [data]
  );

  useEffect(() => {
    if (!data) return;
    setImageUrl(src || data);
  }, [src, data]);

  if (isLoading) return null;
  return (
    <ProfileImage
      width={`${width}`}
      height={`${height}`}
      src={imageUrl}
      onError={handleImageError}
      alt="profile"
      {...props}
    />
  );
};

export default ProfileAvatar;

const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
`;
