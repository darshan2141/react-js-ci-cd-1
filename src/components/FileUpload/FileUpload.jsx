import React from "react";
import "./FileUpload.css";
import { Button } from "@material-ui/core";
import { CameraAltOutlined } from "@material-ui/icons";

class FileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgUrl: ""
    };
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  render() {
    const { imgUrl } = this.state;

    return (
      <div className="file-upload-container" >
        {imgUrl && <img src={imgUrl} alt="preview" />}
        <h5>{this.props.heading}</h5>
        <p>Accepts only JPEG, PNG, PDF formats</p>
        <input
          type="file"
          id={this.props.heading}
          accept=".pdf, image/png, image/jpeg, image/* "
          required
          onChange={(e) => {
            if (e.target.files) {
              this.props.onChange(e.target.files[0]);
              this.toBase64(e.target.files[0]).then((url) => {
                this.setState({ imgUrl: url });
              });
            }
          }}
        />
        <label htmlFor={this.props.heading}>
          <Button variant="outlined" className="primary-hollow-btn" component="span" startIcon={<CameraAltOutlined />}>
            Select Image
          </Button>
        </label>
      </div>
    );
  }
}


export default FileUpload;

