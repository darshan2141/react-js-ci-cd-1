import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import startedImg from "../../assets/images/svg/getStarted1.svg";
import { ToastMessage } from "../CustomMUI/ToastMessage";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
} from "@material-ui/core";
import "../Auth/auth.css";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import "./GettingStarted.css";

const GettingStartedOne = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const history = useHistory();

  const handleClose = () => {
    history.push("/");
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) => prevSlide + 1);
  };

  const handleComplete = () => {
    history.push("/");
  };

  const slides = [
    {
      title: "",
      description:
        "Features that can improve the quality of your digital scoring experience",
    },
    {
      title: "Step 01",
      description: "Add or Invite your team players to the platform",
    },
    {
      title: "Step 02",
      description: "Create many teams as per your requirement",
    },
    {
      title: "Step 03",
      description: "Create a match and notify all your team members",
    },
    {
      title: "Step 04",
      description: "Organize tournaments to play with teams near you",
    },
  ];

  return (
    <>
      <div className="app-container">
        <ToastMessage />
        <div className="gs-container">
          <Card className="card" elevation={0}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="right">
                <span onClick={handleClose} className="skip">
                  Skip
                </span>
              </Typography>
              <CardMedia
                component="img"
                style={{ width: "100%", margin: "auto" }}
                alt=""
                src={startedImg}
              />
              <CardContent className="card-content">
                <Typography variant="h6" className="title" gutterBottom>
                  {slides[currentSlide].title}
                </Typography>
                <Typography
                  variant="body1"
                  className="description"
                  gutterBottom
                >
                  {slides[currentSlide].description}
                </Typography>
                <div className="pagination">
                  {slides.map((_, index) => (
                    <div
                      key={index}
                      className={`pagination-bullet ${
                        index === currentSlide ? "active" : ""
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
              <CardActions className="card-actions">
                {currentSlide === 0 && (
                  <PrimaryButton onClick={handleNext}>
                    Getting Started
                  </PrimaryButton>
                )}
                {currentSlide > 0 && currentSlide < slides.length - 1 && (
                  <PrimaryButton onClick={handleNext}>Next</PrimaryButton>
                )}
                {currentSlide === slides.length - 1 && (
                  <PrimaryButton onClick={handleComplete}>
                    Complete
                  </PrimaryButton>
                )}
              </CardActions>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default GettingStartedOne;
