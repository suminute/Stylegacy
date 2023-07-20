import { memo, useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { getDefaultProfileImageUrl } from "../api/users"


const ProfileAvatar = ({ 
    width =100, 
    height=100, 
    src,
    ...props
  }) => {
    console.log(src)
  const [image,setImage] = useState(src|| '')

  const handleImageError = useCallback(async () => {
    const defaultImageUrl = await getDefaultProfileImageUrl()
    if(image !== defaultImageUrl)
    setImage(defaultImageUrl)
  },[image])

  useEffect(() => {
    setImage(src)
  },[src])

  return(
  <ProfileImage  
    width={`${width}`} 
    height={`${height}`} 
    src={image} 
    onError={handleImageError} 
    alt='profile' 
    {...props}
  />)
}

export default memo(ProfileAvatar)

const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
`