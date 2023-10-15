import { Helmet } from "react-helmet-async";
import { faker } from "@faker-js/faker";
// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography } from "@mui/material";
// components
import Iconify from "../../components/iconify";
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from "../../sections/@dashboard/app";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import _ from "lodash";
import Loading from "../../components/loading/Loading";
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [post, setPost] = useState([]);
  const [userList, setUserList] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = query(collection(db, "users"));
        const userSnap = await getDocs(userRef);

        const postRef = query(collection(db, "postData"));
        const postSnap = await getDocs(postRef);

        setUserList(userSnap.docs.length);
        setPostCount(postSnap.docs.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

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
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const sortedDocData = _.sortBy(
    post,
    (data) => data.createdAt.seconds
  ).reverse();
  return (
    <>
      <Helmet>
        <title> Dashboard | Local Farmers and Fisher folks web-based information system </title>
      </Helmet>
      {loading ? (
        <Loading />
      ) : (
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Hi, Welcome back
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <AppWidgetSummary
                title="Users"
                total={userList}
                color="info"
                icon={"mdi:users-outline"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <AppWidgetSummary
                title="Posts"
                total={postCount}
                color="info"
                icon={"carbon:blog"}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={12}>
              <AppNewsUpdate list={sortedDocData} />
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}
