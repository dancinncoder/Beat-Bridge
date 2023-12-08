import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/auth.context';
import { usePost } from '../../contexts/post.context';
import { storage } from '../../firebase/firebase.config';
import useModal from '../../hooks/useModal';

export default function MyPageEditForm({
  nickname,
  email,
  setIsEditing,
  children
}) {
  const [imgInputValue, setImgInputValue] = useState(null);
  const [editedNickname, setEditedNickname] = useState(nickname || '');

  const { updateProfileBy, userInfo } = useAuth();
  const { updatePosts } = usePost();

  const { alertModal, confirmModal } = useModal();
  const alertModalWithValidate = (content) =>
    alertModal({ name: 'Validation Failed', content });

  const handleFileSelect = (e) => {
    setImgInputValue(e.target.files[0]);
  };
  const handleChangeEditedNickname = (e) => {
    setEditedNickname(e.target.value);
  };
  const saveUpdateProfile = async () => {
    const newUserInfo = {
      ...userInfo
    };

    if (imgInputValue) {
      const imageRef = ref(storage, `profile/${email}`);
      try {
        await uploadBytes(imageRef, imgInputValue);
      } catch (e) {
        console.error('error occurred while uploading image to storage', e);
        alert('error occurred while uploading image to storage.');
        return;
      }
      try {
        const downloadURL = await getDownloadURL(imageRef);
        newUserInfo.profileImgUrl = downloadURL;
      } catch (e) {
        console.error(
          'error occurred while downloading image from storage or setting user profile image url',
          e
        );
        alert('error occurred while downloading image from storage or setting user profile image url.');
        return;
      }
    }
    if (userInfo.nickname !== editedNickname) {
      newUserInfo.nickname = editedNickname;
    }
    updateProfileBy(newUserInfo);
    updatePosts({ userInfo: newUserInfo });
  };

  const handleSaveUpdatedProfile = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    if (!checkValidation(editedNickname)) return;

    confirmModal({
      name: 'Edit Profile',
      content: 'Are you sure you want to save your changes?',
      confirmLogic: () => saveUpdateProfile()
    });
  };

  const checkValidation = (nickname) => {
    let content;
    if (nickname.length === 0) {
      content = 'Please enter your nickname.';
    } else if (nickname.length > 10) {
      content = 'Please enter a nickname of 10 characters or less.';
    } else if (/^\s*$/.test(nickname)) {
      content = 'You have entered only spaces. Please enter again.';
    }
    if (content) {
      alertModalWithValidate(content);
      return false;
    }
    return true;
  };

  return (
    <StEditForm onSubmit={handleSaveUpdatedProfile}>
      <StMyInformationDetailsSmallContainer>
        <StMyEmail>E-mail:&nbsp;{email}</StMyEmail>
        <StNickNameAfter>
          nickname:
          <StNicknameEditInput
            value={editedNickname}
            onChange={handleChangeEditedNickname}
          />
        </StNickNameAfter>
        <StImageInputAfterWrapper>
          <StImageInput type="file" onChange={handleFileSelect} />
        </StImageInputAfterWrapper>
      </StMyInformationDetailsSmallContainer>
      {children}
    </StEditForm>
  );
}

const StEditForm = styled.form`
  color: #929292;
  font-size: 0.85rem;
  display: flex;
  flex: row;
  justify-content: center;
  align-items: center;
  padding: 10px 20px 20px 20px;
  min-width: 452px;
  height: 120px;
`;
const StNicknameEditInput = styled.input`
  color: #929292;
  border: 0.5px solid #c8c8c8;
  width: 120px;
  padding-left: 3px;
`;
const StImageInputAfterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
  margin-top: 5px;
  color: gray;
`;
const StImageInput = styled.input`
  cursor: pointer;
  width: 100%;
`;

const StNickNameAfter = styled.span`
  margin: 0;
  color: #929292;
  font-size: 0.85rem;
`;

const StMyInformationDetailsSmallContainer = styled.div`
  background-color: #f2f2f2;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  padding: 8px 8px 8px 15px;
  min-height: 90px;
  width: 270px;
`;

const StMyEmail = styled.p`
  margin: 5px 0 5px 0;
  color: #929292;
  font-size: 0.85rem;
`;
