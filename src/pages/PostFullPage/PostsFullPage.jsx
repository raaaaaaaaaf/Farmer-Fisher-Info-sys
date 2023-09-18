import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import MainFeaturedPost from './MainFeaturedPost';
import Main from './Main';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import Loading from '../../components/loading/Loading';

const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random?wallpapers',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};



export default function PostsFullPage() {
  const [posts, setPosts] = useState({})
  const [loading, setLoading] = useState(true)
  const {id} = useParams();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    const postRef = doc(db, "postData", id);

    const fetchData = async () => {
        try {

            const postSnap = await getDoc(postRef)
            if (postSnap.exists()) {
              setPosts({...postSnap.data(), id: postSnap.id})
            } else {
              setPosts({});
            }
            console.log({...postSnap.data(), id: postSnap.id})
        } catch(err) {
            console.error(err)
        }
    }
 fetchData()
}, [id])

  return (
    <>
    {loading ? (
      <Loading/>
    ) : (
      <Container maxWidth="lg">
        <main>
          <MainFeaturedPost posts={posts} />
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main posts={posts} />
          </Grid>
        </main>
      </Container>
    )}

    </>

  );
}