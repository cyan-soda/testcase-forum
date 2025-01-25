'use client'

import { useParams } from "next/navigation";

const PostDetailPage = () => {
  const { space, course, term, postId } = useParams();

  return (
    <div>
      <h1>Post Detail</h1>
      <p>Space: {space}</p>
      <p>Course: {course}</p>
      <p>Term: {term}</p>
      <p>Post ID: {postId}</p>
    </div>
  );
};

export default PostDetailPage
