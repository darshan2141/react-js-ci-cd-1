import React, { useState, useRef } from "react";
import Modal from "@material-ui/core/Modal";
import Slider from "react-slick";
import { Card, CardContent, Button } from "@material-ui/core";
import "./IntroModal.css";
import startedImg1 from "../../assets/images/svg/getStarted1.svg";
import startedImg2 from "../../assets/images/svg/getStarted2.svg";
import startedImg3 from "../../assets/images/svg/getStarted3.svg";
import startedImg4 from "../../assets/images/svg/getStarted4.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const IntroModal = ({ onClose }) => {
  const [open, setOpen] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slider = useRef(null);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const nextSlide = () => {
    slider.current.slickNext();
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
  };

  const slides = [
    {
      img: startedImg1,
      title: "",
      description: "Features that can improve the quality of your digital scoring experience",
    },
    {
      img: startedImg1,
      title: "Step 01",
      description: "Add or Invite your team players to the platform",
    },
    {
      img: startedImg2,
      title: "Step 02",
      description: "Create many teams as per your requirement",
    },
    {
      img: startedImg3,
      title: "Step 03",
      description: "Create a match and notify all your team members",
    },
    {
      img: startedImg4,
      title: "Step 04",
      description: "Organize tournaments to play with teams near you",
    },
  ];

  const buttonText =
    currentSlide === 0
      ? "Getting Started"
      : currentSlide === slides.length - 1
      ? "Complete"
      : "Next";

  return (
    <Modal open={open} onClose={handleClose} className="intro-modal">
      <div className="intro-modal-content">
        <div className="skip" onClick={handleClose}>
          Skip
        </div>
        <Slider ref={slider} {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <img src={slide.img} alt={slide.title} className="slide-img" />
              <Card className="intro-card">
                <CardContent>
                  <h2 className="title">{slide.title}</h2>
                  <p className="description">{slide.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>
        <Button
          variant="contained"
          color="primary"
          className="next-button"
          onClick={
            currentSlide === slides.length - 1
              ? handleClose
              : nextSlide
          }
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default IntroModal;
