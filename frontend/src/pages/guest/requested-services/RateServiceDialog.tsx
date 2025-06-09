import {Dialog, Button, TextField, IconButton} from "@mui/material";
import {useState} from "react";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../../redux/slices/userSlice.ts";

function RateServiceDialog({open, setOpen, scheduleId, fetchData}: {open: boolean, setOpen: (b: boolean) => void, scheduleId: string, fetchData: () => void}) {
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const user = useSelector(selectUser);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    console.log("Rating:", rating);
    console.log("Comment:", comment);
    try {
      await axiosAuthApi.post("/services/rate", {
        scheduleId: scheduleId,
        comment: comment,
        username: user?.username,
        rating: rating,
      })
    } catch (e) {
      console.error(e);
    } finally {
      setOpen(false);
      setRating(0);
      setComment("");
      setCommentOpen(false);
      fetchData()
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setRating(0);
    setComment("");
    setCommentOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <div style={{padding: '20px'}}>
        <p style={{marginBottom: '15px', fontSize: '1.2em', fontWeight: 'bold'}}>Rate this service</p>

        <div style={{marginBottom: '20px'}}>
          {[1, 2, 3, 4, 5].map((star) => (
            <IconButton key={star} onClick={() => handleStarClick(star)} color={rating >= star ? "warning" : "inherit"}>
              {rating >= star ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          ))}
        </div>

        <div>
          {!commentOpen && (
            <Button onClick={() => setCommentOpen(true)} variant="outlined" sx={{marginBottom: '10px', width: '100%'}}>Add comment</Button>
          )}

          {commentOpen && (
            <>
              <TextField
                placeholder={"Write your comment here"}
                sx={{width:'100%', marginBottom: '10px'}}
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button onClick={() => setCommentOpen(false)} variant="outlined" color="secondary">Cancel Comment</Button>
            </>
          )}
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
          <Button onClick={handleCancel} color="primary" sx={{marginRight: '10px'}}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={rating === 0}>Submit</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default RateServiceDialog;