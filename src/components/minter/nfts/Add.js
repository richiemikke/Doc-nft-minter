/* eslint-disable react/jsx-filename-extension */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { uploadToIpfs } from "../../../utils/minter";



const AddNfts = ({ save, address }) => {
  const [name, setName] = useState("");
  const [ipfsImage, setIpfsImage] = useState("");
  const [description, setDescription] = useState("");

  
  const [show, setShow] = useState(false);


  // check if all form data has been filled
  const isFormFilled = () =>
      name && ipfsImage && description;

  // close the popup modal
  const handleClose = () => {
    setShow(false);
 
  };

  // display the popup modal
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="link"
        className="rounded-pill px-2 py-2"
      >
         <h1 className="fs-4 fw-bold mb-0 text-dark">{"Mint a new Document"}</h1> 
        
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mint a doc</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="inputLocation"
              label="Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name of NFT"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>

            <Form.Control
              type="file"
              className={"mb-3"}
              onChange={async (e) => {
                const imageUrl = await uploadToIpfs(e);
                if (!imageUrl) {
                  alert("failed to upload image");
                  return;
                }
                setIpfsImage(imageUrl);
              }}
              placeholder="Product name"
            ></Form.Control>
            

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                name,
                ipfsImage,
                description,
                ownerAddress: address,
            
              });
              handleClose();
            }}
          >
            Create NFT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddNfts.propTypes = {

  // props passed into this component
  save: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

export default AddNfts;
