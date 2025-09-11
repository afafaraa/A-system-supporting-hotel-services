import Title from "../../components/ui/Title.tsx";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import {ReactElement, useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {Rating, Stack, Typography, Button, Alert} from "@mui/material";
import {isSameMonth} from "date-fns";
import Box from "@mui/system/Box";
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import {useTranslation} from "react-i18next";
import ServiceIcon from "../../components/ui/ServiceIcon.tsx";

export type Rating = {
  fullName: string;
  stars: number;
  comment: string;
  createdAt: string;
};

function ReviewsPage() {
  const {t} = useTranslation();
  const tc = (key: string) => t(`pages.employee.reviews.${key}`);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showMore = () => setVisibleCount(prev => prev + 10);

  useEffect(() => {
    axiosAuthApi.get<Rating[]>("/ratings/my-ratings")
      .then(res => setRatings(res.data))
      .catch(err => setError(err.message))
      .finally(() => setPageLoading(false));
  }, []);

  const today = new Date();
  const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length).toFixed(1) : "N/A";
  const totalReviews = ratings.length;
  const FiveStarReviews = ratings.filter(r => r.stars === 5).length;
  const thisMonth = ratings.filter(r => isSameMonth(today, new Date(r.createdAt))).length;

  const InfoCard = ({title, value}: {title: ReactElement, value: number | string}) => (
    <Box flex="1 0 0">
      <Typography display="flex" alignItems="center" justifyContent="center" lineHeight={1.7} textAlign="center" noWrap gap={0.75}>{title}</Typography>
      <Typography lineHeight={1.7} textAlign="center" fontWeight="bold" fontSize="1.2rem">{value}</Typography>
    </Box>
  )

  return (
    <SectionCard>
      <Title title={<><StarBorderOutlinedIcon /> {tc("title")}</>}
             subtitle={tc("subtitle")} />
      <SectionCard sx={{bgcolor: "background.default", borderWidth: 0, borderRadius: 2}} display="flex" justifyContent="space-around" flexWrap="wrap" gap={2}>
        <Box display="flex" justifyContent="space-between" flex="1 0 0" gap={2}>
          <InfoCard title={<><TrendingUpOutlinedIcon sx={{fontSize: "120%"}}/> {tc("avg_rating")}</>} value={avgRating}/>
          <InfoCard title={<><CommentOutlinedIcon sx={{fontSize: "120%"}}/> {tc("total_reviews")}</>} value={totalReviews}/>
        </Box>
        <Box display="flex" justifyContent="space-between" flex="1 0 0" gap={2}>
          <InfoCard title={<><ThumbUpOutlinedIcon sx={{fontSize: "120%"}}/> {tc("5_star_reviews")}</>} value={FiveStarReviews}/>
          <InfoCard title={<><CalendarTodayOutlinedIcon sx={{fontSize: "120%"}}/> {tc("this_month")}</>} value={thisMonth}/>
        </Box>
      </SectionCard>
      {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
      <Stack spacing={2} mt={3}>
        {pageLoading ? <></> : ratings.length === 0 ?
          <SectionCard size={4}>
            {tc("no_reviews")}
          </SectionCard>
          :
          ratings.slice(0, visibleCount).map((rating, index) => (
          <SectionCard key={index} size={3}>
            <Stack direction="row" justifyContent="space-between" textAlign="center" sx={{mb: 2}} flexWrap="wrap" gap={1}>
              <ServiceIcon>
                <Typography fontWeight="bold">Unknown service name</Typography> {/* TODO: implement service name fetching */}
                <Typography fontSize="12px" color="text.secondary">
                  {rating.fullName}{" | "}
                  {new Date(rating.createdAt).toLocaleTimeString(t('date.locale'), {hour: '2-digit', minute: '2-digit'})}
                  {" "}{new Date(rating.createdAt).toLocaleDateString(t('date.locale'))}
                </Typography>
              </ServiceIcon>
              <Box display="flex" alignItems="center" gap={2}>
                <Rating readOnly value={rating.stars} precision={0.5} sx={{fontSize: '160%'}} />
                <Typography fontWeight="bold">{rating.stars} / 5</Typography>
              </Box>
            </Stack>
            "{rating.comment}"
          </SectionCard>
        ))}

        {visibleCount < ratings.length &&
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="outlined" onClick={showMore} sx={{width: "300px"}}>{t("ui.show_more")}</Button>
          </Box>
        }
      </Stack>

    </SectionCard>
  );
}

export default ReviewsPage;
