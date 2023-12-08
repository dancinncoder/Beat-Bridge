import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { usePost } from '../../contexts/post.context';
import SkeletonPost from '../common/skeleton/SkeletonPost';
import Post from './Post';
import PostForm from './PostForm';

function Main() {
  const [searchParams] = useSearchParams();
  const paramCategory = searchParams.get('category');
  const { posts, isLoading } = usePost();

  const postsFilteredByCategory = posts.filter(
    (post) => !paramCategory || post.category === paramCategory
  );
  return (
    <StContainer>
      <PostForm />
      <StPostBox>
        {isLoading && <SkeletonPost />}
        {!isLoading && checkEmpty(postsFilteredByCategory) ? (
          <StNoPosts>
            <p>There are no shared Beats.</p>
            <p>⚡ Beat Up the first Beat in a category! ⚡</p>
          </StNoPosts>
        ) : (
          postsFilteredByCategory.map((post) => (
            <Post key={post.id} post={post} />
          ))
        )}
      </StPostBox>
    </StContainer>
  );
}

function checkEmpty(value) {
  return !value.length;
}

export default Main;
const StNoPosts = styled.p`
  text-align: center;
  line-height: 1.5;
  margin-top: 20px;
  font-size: 20px;
`;
const StContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75%;
  margin: 40px 0;
`;

const StPostBox = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  margin: 30px 0;
`;
