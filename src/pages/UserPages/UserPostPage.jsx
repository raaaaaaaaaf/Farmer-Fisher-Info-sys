import { Helmet } from "react-helmet-async";
// @mui
import { Grid, Button, Container, Stack, Typography } from "@mui/material";
// components
import Iconify from "../../components/iconify";
import {
  BlogPostCard,
  BlogPostsSort,
  BlogPostsSearch,
} from "../../sections/@dashboard/blog";
// mock
// import POSTS from '../../_mock/blog';
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { query, collection, getDocs, doc } from "firebase/firestore";
import Modal from "../CreatePostModal";
import _ from "lodash";
import { Link } from "react-router-dom";
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];

// ----------------------------------------------------------------------

export default function UserPostPage() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];

        const postRef = query(collection(db, "postData"));
        const postSnap = await getDocs(postRef);
        postSnap.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  
  const sortedDocData = _.sortBy(
    posts,
    (data) => data.createdAt.seconds
  ).reverse();
  return (
    <>
      <Helmet>
        <title> Client: Posts | Local Farmers and Fisher folks web-based information system  </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Posts
          </Typography>
        </Stack>
        {sortedDocData !== null ? (
          <Grid container spacing={3}>
            {sortedDocData.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </Grid>
        ) : (
          <div>Loading...</div>
        )}
      </Container>
    </>
  );
}
